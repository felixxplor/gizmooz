export interface Review {
  id: string;
  title: string;
  body: string;
  rating: number;
  reviewer: {name: string};
  created_at: string;
  verified_buyer: boolean;
  photo?: {url: string; altText?: string; width?: number; height?: number};
}

export interface ReviewsData {
  reviews: Review[];
  total: number;
  average: number;
  breakdown: {stars: number; pct: number}[];
}

export function parseMetaobjectReviews(product: any): ReviewsData | null {
  const nodes = product?.metafield?.references?.nodes;
  if (!nodes?.length) return null;

  const reviews: Review[] = nodes.map((node: any) => {
    const fieldMap = Object.fromEntries(
      (node.fields as {key: string; value: string; reference?: any}[]).map(
        (f) => [f.key, f],
      ),
    );
    const photo = fieldMap.photo?.reference?.image ?? undefined;
    return {
      id: node.id,
      title: fieldMap.title?.value ?? '',
      body: fieldMap.body?.value ?? '',
      rating: parseInt(fieldMap.rating?.value ?? '5', 10),
      reviewer: {name: fieldMap.author?.value ?? 'Anonymous'},
      created_at: fieldMap.date?.value ?? new Date().toISOString(),
      verified_buyer: fieldMap.verified?.value === 'true',
      photo,
    };
  });

  const total = reviews.length;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = total ? Math.round((sum / total) * 10) / 10 : 0;

  const counts: Record<number, number> = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, r.rating));
    counts[star] = (counts[star] ?? 0) + 1;
  });
  const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    pct: total ? Math.round(((counts[stars] ?? 0) / total) * 100) : 0,
  }));

  return {reviews, total, average, breakdown};
}
