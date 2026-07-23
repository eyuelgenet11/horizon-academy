import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/courses/[id]
export async function GET(req, { params }) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        lessons: { orderBy: { order: 'asc' } },
        _count: { select: { enrollments: true } },
      },
    });

    if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    return NextResponse.json(course);
  } catch (err) {
    console.error('[COURSE_GET]', err);
    return NextResponse.json({ error: 'Failed to fetch course.' }, { status: 500 });
  }
}

// PUT /api/courses/[id] — admin only: update course
export async function PUT(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const body = await req.json();
    const course = await prisma.course.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(course);
  } catch (err) {
    console.error('[COURSE_PUT]', err);
    return NextResponse.json({ error: 'Failed to update course.' }, { status: 500 });
  }
}

// DELETE /api/courses/[id] — admin only
export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    await prisma.course.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Course deleted.' });
  } catch (err) {
    console.error('[COURSE_DELETE]', err);
    return NextResponse.json({ error: 'Failed to delete course.' }, { status: 500 });
  }
}
