import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get('x-chapa-signature') || req.headers.get('chapa-signature');
    const secret = process.env.CHAPA_WEBHOOK_SECRET || process.env.CHAPA_SECRET_KEY;

    // Enforce HMAC SHA-256 webhook signature verification when secret is set
    if (secret) {
      if (!signature) {
        console.warn('[CHAPA_WEBHOOK_SECURITY] Missing webhook signature header.');
        return NextResponse.json({ error: 'Missing signature header' }, { status: 401 });
      }

      const expectedHash = crypto
        .createHmac('sha256', secret.trim())
        .update(bodyText)
        .digest('hex');

      const expectedBuf = Buffer.from(expectedHash, 'utf-8');
      const signatureBuf = Buffer.from(signature, 'utf-8');

      if (expectedBuf.length !== signatureBuf.length || !crypto.timingSafeEqual(expectedBuf, signatureBuf)) {
        console.warn('[CHAPA_WEBHOOK_SECURITY] Invalid webhook signature match.');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
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
        await prisma.$transaction([
          prisma.transaction.update({
            where: { id: transaction.id },
            data: { 
              status: 'SUCCESS',
              paymentMethod: payload.method || 'Chapa',
            },
          }),
          // Enroll user ONLY in the specific course they paid for
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
        console.log(`[CHAPA_WEBHOOK] Transaction ${txRef} marked as SUCCESS & user enrolled in single course ${transaction.courseId}.`);
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (err) {
    console.error('[CHAPA_WEBHOOK_ERROR]', err);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 });
  }
}
