import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import '../page.css';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug: resolvedParams.slug } });
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: { title: post.title, description: post.excerpt },
  };
}

export const revalidate = 60;

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: resolvedParams.slug, isPublished: true },
  });

  if (!post) notFound();

  return (
    <div className="blog-post-page">
      <article className="container">
        <Link href="/blog" className="back-link">← Back to Blog</Link>

        <header className="post-header">
          {post.imageUrl && (
            <img src={post.imageUrl} alt={post.title} className="post-hero-image" />
          )}
          <p className="blog-date">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
          <h1>{post.title}</h1>
          {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
        </header>

        <div
          className="post-content glass"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
