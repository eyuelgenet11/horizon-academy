import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/admin/blog — all posts (including drafts)
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch posts.' }, { status: 500 });
  }
}

// POST /api/admin/blog — create post
export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const body = await req.json();
    const { title, slug, content, excerpt, imageUrl, isPublished } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'title, slug, and content are required.' }, { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: { title, slug, content, excerpt, imageUrl, isPublished: isPublished ?? false },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'A post with this slug already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create post.' }, { status: 500 });
  }
}

// PATCH /api/admin/blog — update post
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'Post id is required.' }, { status: 400 });

    const post = await prisma.blogPost.update({ where: { id }, data });
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update post.' }, { status: 500 });
  }
}
