import type {ActionFunctionArgs} from 'react-router';

const STAGED_UPLOADS_MUTATION = `#graphql
  mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        url
        resourceUrl
        parameters { name value }
      }
      userErrors { field message }
    }
  }
`;

const FILE_CREATE_MUTATION = `#graphql
  mutation fileCreate($files: [FileCreateInput!]!) {
    fileCreate(files: $files) {
      files { id }
      userErrors { field message }
    }
  }
`;

const GET_PRODUCT_REVIEWS_METAFIELD = `#graphql
  query GetProductReviewsMetafield($id: ID!) {
    product(id: $id) {
      metafield(namespace: "custom", key: "reviews") {
        value
      }
    }
  }
`;

const METAFIELDS_SET_MUTATION = `#graphql
  mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { id }
      userErrors { field message }
    }
  }
`;

const CREATE_REVIEW_MUTATION = `#graphql
  mutation MetaobjectCreate($metaobject: MetaobjectCreateInput!) {
    metaobjectCreate(metaobject: $metaobject) {
      metaobject { id }
      userErrors { field message }
    }
  }
`;

async function adminGraphql(
  shopDomain: string,
  accessToken: string,
  query: string,
  variables: Record<string, unknown>,
): Promise<any> {
  const res = await fetch(
    `https://${shopDomain}/admin/api/2026-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({query, variables}),
    },
  );
  return res.json();
}

async function uploadPhoto(
  shopDomain: string,
  accessToken: string,
  file: File,
): Promise<string | null> {
  // 1. Get a staged upload target
  const stagedResult = await adminGraphql(
    shopDomain,
    accessToken,
    STAGED_UPLOADS_MUTATION,
    {
      input: [
        {
          filename: file.name,
          mimeType: file.type,
          resource: 'IMAGE',
          fileSize: String(file.size),
          httpMethod: 'POST',
        },
      ],
    },
  );

  console.log('[photo staged] raw response:', JSON.stringify(stagedResult, null, 2));

  const stagedErrors =
    stagedResult?.data?.stagedUploadsCreate?.userErrors ?? [];
  if (stagedResult?.errors?.length || stagedErrors.length) {
    console.error('[photo staged] errors:', JSON.stringify(stagedResult?.errors ?? stagedErrors));
    return null;
  }

  const target =
    stagedResult?.data?.stagedUploadsCreate?.stagedTargets?.[0];
  if (!target) {
    console.error('[photo staged] no target returned');
    return null;
  }

  // 2. Upload the file to the staged URL
  const uploadForm = new FormData();
  for (const {name, value} of target.parameters as {
    name: string;
    value: string;
  }[]) {
    uploadForm.append(name, value);
  }
  uploadForm.append('file', file);

  const uploadRes = await fetch(target.url, {
    method: 'POST',
    body: uploadForm,
  });

  if (!uploadRes.ok) {
    console.error('[photo upload] HTTP', uploadRes.status);
    return null;
  }

  // 3. Create the file record in Shopify
  const fileResult = await adminGraphql(
    shopDomain,
    accessToken,
    FILE_CREATE_MUTATION,
    {
      files: [
        {
          alt: 'Review photo',
          contentType: 'IMAGE',
          originalSource: target.resourceUrl,
        },
      ],
    },
  );

  const fileErrors = fileResult?.data?.fileCreate?.userErrors ?? [];
  if (fileErrors.length) {
    console.error('[photo fileCreate]', JSON.stringify(fileErrors));
    return null;
  }

  const fileGid: string | undefined =
    fileResult?.data?.fileCreate?.files?.[0]?.id;
  console.log('[photo] created file GID:', fileGid);
  return fileGid ?? null;
}

async function linkReviewToProduct(
  shopDomain: string,
  accessToken: string,
  productId: string,
  reviewGid: string,
): Promise<void> {
  const fetchResult = await adminGraphql(
    shopDomain,
    accessToken,
    GET_PRODUCT_REVIEWS_METAFIELD,
    {id: productId},
  );

  const rawValue: string =
    fetchResult?.data?.product?.metafield?.value ?? '[]';
  let existing: string[] = [];
  try {
    existing = JSON.parse(rawValue);
  } catch {
    existing = [];
  }

  if (!existing.includes(reviewGid)) {
    existing.push(reviewGid);
  }

  const setResult = await adminGraphql(
    shopDomain,
    accessToken,
    METAFIELDS_SET_MUTATION,
    {
      metafields: [
        {
          ownerId: productId,
          namespace: 'custom',
          key: 'reviews',
          type: 'list.metaobject_reference',
          value: JSON.stringify(existing),
        },
      ],
    },
  );

  const setErrors = setResult?.data?.metafieldsSet?.userErrors ?? [];
  if (setErrors.length) {
    throw new Error(`metafieldsSet failed: ${JSON.stringify(setErrors)}`);
  }
}

async function getAdminToken(
  shopDomain: string,
  clientId: string,
  clientSecret: string,
): Promise<string> {
  const res = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Token request failed ${res.status}: ${text.slice(0, 200)}`,
    );
  }

  const data = (await res.json()) as {access_token: string};
  return data.access_token;
}

export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return Response.json({error: 'Method not allowed'}, {status: 405});
  }

  const formData = await request.formData();
  const rating = String(formData.get('rating') ?? '').trim();
  const author = String(formData.get('author') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  const productId = String(formData.get('productId') ?? '').trim();
  const photo = formData.get('photo') as File | null;

  if (!rating || !author || !body) {
    return Response.json(
      {error: 'Name, rating and review are required.'},
      {status: 400},
    );
  }

  const {env} = context;
  const today = new Date().toISOString().split('T')[0];

  let accessToken: string;
  try {
    accessToken = await getAdminToken(
      env.PUBLIC_STORE_DOMAIN,
      env.SHOPIFY_API_KEY,
      env.SHOPIFY_API_SECRET,
    );
  } catch (e) {
    console.error('[review token]', e);
    return Response.json(
      {error: 'Failed to authenticate. Please try again.'},
      {status: 500},
    );
  }

  // Upload photo if provided
  let photoGid: string | null = null;
  if (photo && photo.size > 0) {
    photoGid = await uploadPhoto(env.PUBLIC_STORE_DOMAIN, accessToken, photo);
  }

  const fields: {key: string; value: string}[] = [
    {key: 'rating', value: rating},
    {key: 'author', value: author},
    {key: 'title', value: title},
    {key: 'body', value: body},
    {key: 'date', value: today},
    {key: 'verified', value: 'false'},
  ];

  if (photoGid) {
    fields.push({key: 'photo', value: photoGid});
  }

  const json = await adminGraphql(
    env.PUBLIC_STORE_DOMAIN,
    accessToken,
    CREATE_REVIEW_MUTATION,
    {
      metaobject: {
        type: 'customer_review',
        capabilities: {publishable: {status: 'ACTIVE'}},
        fields,
      },
    },
  );

  const userErrors = json?.data?.metaobjectCreate?.userErrors ?? [];
  if (json?.errors?.length || userErrors.length) {
    console.error(
      '[review submit]',
      JSON.stringify(json?.errors ?? userErrors, null, 2),
    );
    return Response.json(
      {error: 'Failed to submit review. Please try again.'},
      {status: 500},
    );
  }

  const reviewGid: string | undefined =
    json?.data?.metaobjectCreate?.metaobject?.id;

  if (reviewGid && productId) {
    try {
      await linkReviewToProduct(
        env.PUBLIC_STORE_DOMAIN,
        accessToken,
        productId,
        reviewGid,
      );
      console.log('[review link] ✓ linked', reviewGid, '→', productId);
    } catch (e: any) {
      console.error('[review link] FAILED:', e?.message ?? e);
    }
  }

  return Response.json({success: true});
}
