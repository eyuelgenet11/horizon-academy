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

    // In production, block mock transactions unless running in development/sandbox mode
    if (isMock) {
      if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_MOCK_PAYMENTS) {
        console.warn(`[SECURITY_ALERT] Mock payment verification attempt blocked in production: ${txRef}`);
        return NextResponse.redirect(new URL('/courses?error=payment_failed', req.url));
      }
    } else {
      if (!process.env.CHAPA_SECRET_KEY) {
        return NextResponse.redirect(new URL('/courses?error=chapa_not_configured', req.url));
      }

      // Verify transaction status directly with Chapa API
      const chapaRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY.trim()}`,
        },
      });

      const chapaData = await chapaRes.json();

      if (!chapaRes.ok || chapaData.status !== 'success' || chapaData.data.status !== 'success') {
        console.error('[CHAPA_VERIFICATION_FAILED]', chapaData);
        return NextResponse.redirect(new URL('/courses?error=payment_failed', req.url));
      }

      paymentMethod = chapaData.data.payment_method || 'Chapa';
    }

    // Find the pending transaction record in SQLite
    const transaction = await prisma.transaction.findUnique({
      where: { reference: txRef },
    });

    if (!transaction) {
      return NextResponse.redirect(new URL('/courses?error=transaction_not_found', req.url));
    }

    // Process enrollment ONLY for the single course paid for in this transaction
    if (transaction.status === 'PENDING') {
      await prisma.$transaction([
        // Update transaction status to SUCCESS
        prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'SUCCESS', paymentMethod },
        }),
        // Enroll user ONLY in the specific course they purchased
        prisma.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: transaction.userId,
              courseId: transaction.courseId,
            },
          },
          create: {
            userId: transaction.userId,
            courseId: transaction.courseId,
            status: 'ACTIVE',
          },
          update: {
            status: 'ACTIVE',
          },
        }),
      ]);
      console.log(`[PAYMENT_SUCCESS] User ${transaction.userId} successfully enrolled in course ${transaction.courseId}`);
    }

    // Redirect student directly to their newly unlocked course in the learning portal
    return NextResponse.redirect(new URL(`/learning-portal/${transaction.courseId}`, req.url));
  } catch (err) {
    console.error('[PAYMENTS_VERIFY_ERROR]', err);
    return NextResponse.redirect(new URL('/courses?error=server_error', req.url));
  }
}
