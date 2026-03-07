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
    const res = await fetch(
      'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Klaviyo-API-Key ${env.KLAVIYO_PRIVATE_API_KEY}`,
          'Content-Type': 'application/json',
          'revision': '2024-10-15',
        },
        body: JSON.stringify({
          data: {
            type: 'profile-subscription-bulk-create-job',
            attributes: {
              profiles: {
                data: [
                  {
                    type: 'profile',
                    attributes: {
                      email,
                      subscriptions: {
                        email: {marketing: {consent: 'SUBSCRIBED'}},
                      },
                    },
                  },
                ],
              },
              list_id: env.KLAVIYO_LIST_ID,
            },
          },
        }),
      },
    );

    if (!res.ok && res.status !== 202) {
      const body = await res.text();
      console.error('Klaviyo error:', res.status, body);
      return Response.json({error: 'Failed to subscribe. Please try again.'}, {status: 500});
    }

    return Response.json({success: true, message: "You're subscribed! Thanks for joining."});
  } catch (e) {
    console.error('Newsletter error:', e);
    return Response.json({error: 'Failed to subscribe. Please try again.'}, {status: 500});
  }
}
