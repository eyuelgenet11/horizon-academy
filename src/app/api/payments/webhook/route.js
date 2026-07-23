import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get('x-chapa-signature') || req.headers.get('chapa-signature');
    const secret = process.env.CHAPA_WEBHOOK_SECRET || process.env.CHAPA_SECRET_KEY;

    // Optional: Verify signature if secret is present
    if (secret && signature) {
      const hash = crypto
        .createHmac('sha256', secret)
        .update(bodyText)
        .digest('hex');

      if (hash !== signature) {
        console.warn('[CHAPA_WEBHOOK] Invalid signature match');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(bodyText);
    const txRef = payload.tx_ref || payload.reference;
    const status = payload.status;

    if (!txRef) {
      return NextResponse.json({ error: 'Missing tx_ref' }, { status: 400 });
    }

    if (status === 'success') {
      const transaction = await prisma.transaction.findUnique({
        where: { reference: txRef },
      });

      if (transaction && transaction.status === 'PENDING') {
        const allCourses = await prisma.course.findMany({
          where: { isPublished: true },
          select: { id: true },
        });

        await prisma.$transaction([
          prisma.transaction.update({
            where: { id: transaction.id },
            data: { 
              status: 'SUCCESS',
              paymentMethod: payload.method || 'Chapa',
            },
          }),
          ...allCourses.map((c) =>
            prisma.enrollment.upsert({
              where: {
                userId_courseId: {
                  userId: transaction.userId,
                  courseId: c.id,
                },
              },
              create: {
                userId: transaction.userId,
                courseId: c.id,
                status: 'ACTIVE',
              },
              update: {
                status: 'ACTIVE',
              },
            })
          ),
        ]);
        console.log(`[CHAPA_WEBHOOK] Transaction ${txRef} marked as SUCCESS & user enrolled in ALL courses.`);
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (err) {
    console.error('[CHAPA_WEBHOOK_ERROR]', err);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 });
  }
}
