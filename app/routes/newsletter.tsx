import type {ActionFunctionArgs} from 'react-router';

const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer { id email }
      userErrors { field message }
    }
  }
`;

const CUSTOMER_BY_EMAIL_QUERY = `
  query customerByEmail($query: String!) {
    customers(first: 1, query: $query) {
      nodes { id }
    }
  }
`;

const CUSTOMER_UPDATE_MUTATION = `
  mutation customerUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer { id }
      userErrors { field message }
    }
  }
`;

async function adminGraphql(
  shopDomain: string,
  accessToken: string,
  query: string,
  variables: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

async function getAdminToken(
  shopDomain: string,
  clientId: string,
  clientSecret: string,
): Promise<string> {
  const res = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
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
  const email = String(formData.get('email') ?? '').trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({error: 'Please enter a valid email address.'}, {status: 400});
  }

  const {env} = context;

  let accessToken: string;
  try {
    accessToken = await getAdminToken(
      env.PUBLIC_STORE_DOMAIN,
      env.SHOPIFY_API_KEY,
      env.SHOPIFY_API_SECRET,
    );
  } catch {
    return Response.json(
      {error: 'Something went wrong. Please try again.'},
      {status: 500},
    );
  }

  const marketingConsent = {
    marketingState: 'SUBSCRIBED',
    marketingOptInLevel: 'SINGLE_OPT_IN',
  };

  // Try to create customer
  const createResult = await adminGraphql(
    env.PUBLIC_STORE_DOMAIN,
    accessToken,
    CUSTOMER_CREATE_MUTATION,
    {
      input: {
        email,
        emailMarketingConsent: marketingConsent,
      },
    },
  );

  const userErrors = createResult?.data?.customerCreate?.userErrors ?? [];
  const alreadyExists = userErrors.some((e: {message: string}) =>
    e.message?.toLowerCase().includes('email'),
  );

  if (alreadyExists) {
    // Customer exists — update their marketing consent
    const findResult = await adminGraphql(
      env.PUBLIC_STORE_DOMAIN,
      accessToken,
      CUSTOMER_BY_EMAIL_QUERY,
      {query: `email:${email}`},
    );

    const customerId =
      findResult?.data?.customers?.nodes?.[0]?.id;

    if (customerId) {
      await adminGraphql(
        env.PUBLIC_STORE_DOMAIN,
        accessToken,
        CUSTOMER_UPDATE_MUTATION,
        {
          input: {
            id: customerId,
            emailMarketingConsent: marketingConsent,
          },
        },
      );
    }

    return Response.json({success: true, message: "You're already subscribed!"});
  }

  if (createResult?.errors?.length || userErrors.length) {
    return Response.json(
      {error: 'Failed to subscribe. Please try again.'},
      {status: 500},
    );
  }

  return Response.json({success: true, message: "You're subscribed! Thanks for joining."});
}
