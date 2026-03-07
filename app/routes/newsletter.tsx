import type {ActionFunctionArgs} from 'react-router';

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

  try {
    // Step 1: Create or update profile
    const profileRes = await fetch('https://a.klaviyo.com/api/profiles/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${env.KLAVIYO_PRIVATE_API_KEY}`,
        'Content-Type': 'application/json',
        'revision': '2024-10-15',
      },
      body: JSON.stringify({
        data: {
          type: 'profile',
          attributes: {email},
        },
      }),
    });

    let profileId: string;
    if (profileRes.status === 409) {
      // Profile already exists — extract id from conflict response
      const conflict = await profileRes.json() as {errors?: [{meta?: {duplicate_profile_id?: string}}]};
      profileId = conflict.errors?.[0]?.meta?.duplicate_profile_id ?? '';
    } else if (profileRes.ok) {
      const profileData = await profileRes.json() as {data?: {id?: string}};
      profileId = profileData.data?.id ?? '';
    } else {
      const body = await profileRes.text();
      console.error('Klaviyo profile error:', profileRes.status, body);
      return Response.json({error: 'Failed to subscribe. Please try again.'}, {status: 500});
    }

    // Step 2: Add profile to list
    const listRes = await fetch(
      `https://a.klaviyo.com/api/lists/${env.KLAVIYO_LIST_ID}/relationships/profiles/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Klaviyo-API-Key ${env.KLAVIYO_PRIVATE_API_KEY}`,
          'Content-Type': 'application/json',
          'revision': '2024-10-15',
        },
        body: JSON.stringify({
          data: [{type: 'profile', id: profileId}],
        }),
      },
    );

    if (!listRes.ok && listRes.status !== 204) {
      const body = await listRes.text();
      console.error('Klaviyo list error:', listRes.status, body);
      return Response.json({error: 'Failed to subscribe. Please try again.'}, {status: 500});
    }

    return Response.json({success: true, message: "You're subscribed! Thanks for joining."});
  } catch (e) {
    console.error('Newsletter error:', e);
    return Response.json({error: 'Failed to subscribe. Please try again.'}, {status: 500});
  }
}
