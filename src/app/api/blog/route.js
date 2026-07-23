import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/blog — public list of published posts
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { id: true, title: true, slug: true, excerpt: true, imageUrl: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (err) {
    console.error('[BLOG_GET]', err);
    return NextResponse.json({ error: 'Failed to fetch posts.' }, { status: 500 });
  }
}
