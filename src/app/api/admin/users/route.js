import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/admin/users — admin only
export async function GET(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true, name: true, email: true, role: true, createdAt: true,
          _count: { select: { enrollments: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json({ users, total, page, limit });
  } catch (err) {
    console.error('[ADMIN_USERS_GET]', err);
    return NextResponse.json({ error: 'Failed to fetch users.' }, { status: 500 });
  }
}

// PATCH /api/admin/users — update a user's role
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const { userId, role } = await req.json();
    if (!userId || !['STUDENT', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Invalid data.' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error('[ADMIN_USERS_PATCH]', err);
    return NextResponse.json({ error: 'Failed to update user.' }, { status: 500 });
  }
}
