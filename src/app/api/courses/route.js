import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/courses — public list of published courses
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      include: { _count: { select: { lessons: true, enrollments: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(courses);
  } catch (err) {
    console.error('[COURSES_GET]', err);
    return NextResponse.json({ error: 'Failed to fetch courses.' }, { status: 500 });
  }
}

// POST /api/courses — admin only: create a new course
export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, level, duration, price, imageUrl } = body;

    if (!title || !description || !level || !duration) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: { title, description, level, duration, price: price || 0, imageUrl },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (err) {
    console.error('[COURSES_POST]', err);
    return NextResponse.json({ error: 'Failed to create course.' }, { status: 500 });
  }
}
