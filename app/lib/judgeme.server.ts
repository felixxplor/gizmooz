const BASE_URL = 'https://judge.me/api/v1';

export interface JudgemeReview {
  id: number;
  title: string;
  body: string;
  rating: number;
  reviewer: {name: string};
  created_at: string;
  verified_buyer: boolean;
}

export interface JudgemeData {
  reviews: JudgemeReview[];
  total: number;
  average: number;
  breakdown: {stars: number; pct: number}[];
}

export async function getProductReviews({
  apiToken,
  shopDomain,
  productId, // Shopify GID e.g. gid://shopify/Product/123
  perPage = 10,
}: {
  apiToken: string;
  shopDomain: string;
  productId: string;
  perPage?: number;
}): Promise<JudgemeData | null> {
  const numericId = productId.split('/').pop();
  if (!numericId) return null;

  const params = new URLSearchParams({
    api_token: apiToken,
    shop_domain: shopDomain,
    product_id: numericId,
    per_page: String(perPage),
    page: '1',
  });

  try {
    const url = `${BASE_URL}/reviews?${params}`;
    console.log('[Judge.me] fetching:', url.replace(apiToken, '***'));

    const res = await fetch(url);
    console.log('[Judge.me] status:', res.status);
    if (!res.ok) return null;

    const data = (await res.json()) as {
      reviews: JudgemeReview[];
      total: number;
    };
    console.log('[Judge.me] total reviews returned:', data.reviews?.length, '/ total:', data.total);

    const reviews = data.reviews ?? [];
    const total = data.total ?? reviews.length;

    // Calculate average and breakdown from returned reviews
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = reviews.length ? Math.round((sum / reviews.length) * 10) / 10 : 0;

    const counts: Record<number, number> = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[star] = (counts[star] ?? 0) + 1;
    });
    const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      pct: reviews.length
        ? Math.round(((counts[stars] ?? 0) / reviews.length) * 100)
        : 0,
    }));

    return {reviews, total, average, breakdown};
  } catch {
    return null;
  }
}
