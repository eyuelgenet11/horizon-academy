import Link from 'next/link';
import prisma from '@/lib/prisma';
import './page.css';

export const metadata = { title: 'Blog' };

export const revalidate = 60; // revalidate every 60s

async function getPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { id: true, title: true, slug: true, excerpt: true, imageUrl: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="blog-page">
      <section className="blog-hero text-center">
        <div className="container animate-fade-in">
          <h1 className="section-title">
            Academy <span className="text-gradient">Blog</span>
          </h1>
          <p className="hero-subtitle mx-auto">
            Tips, insights, and updates from the Horizon Academy team.
          </p>
        </div>
      </section>

      <section className="blog-content container">
        {posts.length === 0 ? (
          <div className="blog-empty glass">
            <p>📝 No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card glass hover-lift">
                <div className="blog-card-image">
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.title} />
                  ) : (
                    <div className="blog-card-placeholder bg-orange" />
                  )}
                </div>
                <div className="blog-card-body">
                  <p className="blog-date">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                  <h2>{post.title}</h2>
                  {post.excerpt && <p className="blog-excerpt">{post.excerpt}</p>}
                  <span className="blog-read-more">Read more →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
