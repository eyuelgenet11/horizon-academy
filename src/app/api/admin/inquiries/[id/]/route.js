import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();
    const { status } = body; // 'READ' or 'REPLIED' or 'UNREAD'

    if (!status) {
      return NextResponse.json({ error: 'Status is required.' }, { status: 400 });
    }

    const inquiry = await prisma.contactInquiry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(inquiry);
  } catch (err) {
    console.error('[INQUIRY_PATCH]', err);
    return NextResponse.json({ error: 'Failed to update inquiry.' }, { status: 500 });
  }
}
