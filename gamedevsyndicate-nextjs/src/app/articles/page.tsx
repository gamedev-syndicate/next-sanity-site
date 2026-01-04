import { getAllArticlePages } from '../../lib/sanity-queries';
import { getImageUrl } from '../../lib/sanity-image';
import type { ArticlePage } from '../../types/sanity';
import { Metadata } from 'next';

// Revalidate this page every 1 minute in production (articles change frequently)
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Browse our latest articles, news, and insights',
};

export default async function ArticlesIndexPage() {
  const articles = await getAllArticlePages();

  return (
    <div className="min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Articles
          </h1>
          <p className="text-xl text-gray-300">
            Browse our latest articles, news, and insights
          </p>
        </header>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">No articles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: ArticlePage) => {
              const imageUrl = article.featuredImage
                ? getImageUrl(article.featuredImage, 600, 400)
                : null;

              return (
                <article
                  key={article._id}
                  className="group bg-gray-800/30 rounded-lg overflow-hidden hover:bg-gray-800/50 transition-all duration-300 hover:shadow-xl"
                >
                  <a href={`/articles/${article.slug.current}`} className="block">
                    {/* Featured Image */}
                    {imageUrl && (
                      <div className="aspect-video w-full overflow-hidden bg-gray-900">
                        <img
                          src={imageUrl}
                          alt={article.featuredImage?.alt || article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      {/* Category & Date */}
                      <div className="flex items-center gap-3 mb-3 text-sm">
                        {article.category && (
                          <span className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded capitalize">
                            {article.category}
                          </span>
                        )}
                        {article.publishedAt && (
                          <time
                            dateTime={article.publishedAt}
                            className="text-gray-400"
                          >
                            {new Date(article.publishedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </time>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h2>

                      {/* Excerpt */}
                      {article.excerpt && (
                        <p className="text-gray-400 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}

                      {/* Author */}
                      {article.author && (
                        <p className="text-sm text-gray-500">
                          By {article.author}
                        </p>
                      )}

                      {/* Tags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-gray-700/30 text-gray-400 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                          {article.tags.length > 3 && (
                            <span className="text-xs px-2 py-1 text-gray-500">
                              +{article.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </a>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
