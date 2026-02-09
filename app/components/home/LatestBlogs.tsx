import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';

interface LatestBlogsProps {
  articles?: Array<{
    id: string;
    title: string;
    handle: string;
    publishedAt: string;
    blog: {handle: string};
    image?: {url: string; altText?: string; width: number; height: number} | null;
    authorV2?: {name: string} | null;
  }>;
}

export function LatestBlogs({articles}: LatestBlogsProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-brand-50">
      <div className="section-container">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-brand-900">
          Latest from the Blog
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.slice(0, 4).map((article) => (
            <Link
              key={article.id}
              to={`/blogs/${article.blog.handle}/${article.handle}`}
              prefetch="intent"
              className="group"
            >
              <div className="bg-white rounded-lg overflow-hidden border border-brand-200 hover:shadow-lg transition-shadow">
                {article.image && (
                  <div className="aspect-video overflow-hidden">
                    <Image
                      data={article.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="text-xs text-brand-400 mb-2">
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    {article.authorV2?.name && ` | By ${article.authorV2.name}`}
                  </div>
                  <h3 className="font-semibold text-brand-900 group-hover:text-accent-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
