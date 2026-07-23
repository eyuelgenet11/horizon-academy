import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const txRef = searchParams.get('tx_ref');

    if (!txRef) {
      return NextResponse.redirect(new URL('/courses?error=missing_ref', req.url));
    }

    const isMock = txRef.startsWith('mock-');
    let paymentMethod = 'Chapa Sandbox';

    if (!isMock) {
      if (!process.env.CHAPA_SECRET_KEY) {
        return NextResponse.redirect(new URL('/courses?error=chapa_not_configured', req.url));
      }

      // Verify transaction status with Chapa
      const chapaRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      });

      const chapaData = await chapaRes.json();

      if (!chapaRes.ok || chapaData.status !== 'success' || chapaData.data.status !== 'success') {
        console.error('[CHAPA_VERIFICATION_FAILED]', chapaData);
        return NextResponse.redirect(new URL('/courses?error=payment_failed', req.url));
      }

      paymentMethod = chapaData.data.payment_method || 'Chapa';
    }

    // Find the pending transaction in SQLite
    const transaction = await prisma.transaction.findUnique({
      where: { reference: txRef },
    });

    if (!transaction) {
      return NextResponse.redirect(new URL('/courses?error=transaction_not_found', req.url));
    }

    // Process enrollment if the transaction was pending
    if (transaction.status === 'PENDING') {
      const allCourses = await prisma.course.findMany({
        where: { isPublished: true },
        select: { id: true },
      });

      await prisma.$transaction([
        // Update transaction status
        prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'SUCCESS', paymentMethod },
        }),
        // Enroll user in ALL courses for 5 Birr payment
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
    }

    // Redirect student successfully to learning portal course overview
    return NextResponse.redirect(new URL(`/learning-portal/${transaction.courseId}?payment=success`, req.url));
  } catch (err) {
    console.error('[PAYMENT_VERIFY_GET]', err);
    return NextResponse.redirect(new URL('/courses?error=verification_error', req.url));
  }
}
