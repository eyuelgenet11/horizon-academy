import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { getSettings } from '@/lib/settings';

// GET /api/enrollments — get current user's enrollments
export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          include: {
            lessons: { select: { id: true }, orderBy: { order: 'asc' } },
            _count: { select: { lessons: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(enrollments);
  } catch (err) {
    console.error('[ENROLLMENTS_GET]', err);
    return NextResponse.json({ error: 'Failed to fetch enrollments.' }, { status: 500 });
  }
}

// POST /api/enrollments — enroll in a course (processes payment via Chapa if configured)
export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const { courseId } = await req.json();
    if (!courseId) return NextResponse.json({ error: 'courseId is required.' }, { status: 400 });

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 });

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });
    if (existing) return NextResponse.json({ error: 'Already enrolled.' }, { status: 409 });

    // If the course has a price > 0, process payment
    if (course.price > 0) {
      const settings = getSettings();
      const isSandbox = settings.mode === 'SANDBOX' || settings.chapaStatus !== 'ACTIVE';

      const shortUser = session.user.id.slice(-6);
      const shortCourse = courseId.slice(-6);

      if (isSandbox) {
        const txRef = `mock-${shortUser}-${shortCourse}-${Date.now()}`;

        // Create a pending transaction record in SQLite
        await prisma.transaction.create({
          data: {
            userId: session.user.id,
            courseId,
            amount: course.price,
            currency: 'ETB',
            status: 'PENDING',
            reference: txRef,
          },
        });

        // Return local mock checkout URL
        const returnUrl = `/payments/mock-checkout?tx_ref=${txRef}&amount=${course.price}&title=${encodeURIComponent(course.title)}`;
        return NextResponse.json({ checkoutUrl: returnUrl }, { status: 200 });
      }

      // If Chapa Secret Key is configured, initialize real Chapa transaction
      if (process.env.CHAPA_SECRET_KEY) {
        const txRef = `tx-${shortUser}-${shortCourse}-${Date.now()}`;

        // Create a pending transaction record in SQLite
        await prisma.transaction.create({
          data: {
            userId: session.user.id,
            courseId,
            amount: course.price,
            currency: 'ETB',
            status: 'PENDING',
            reference: txRef,
          },
        });

        try {
          const nameParts = (session.user.name || 'Student User').split(' ');
          const firstName = nameParts[0] || 'Student';
          const lastName = nameParts[1] || 'User';

          const chapaRes = await fetch('https://api.chapa.co/v1/transaction/initialize', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY.trim()}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: course.price.toString(),
              currency: 'ETB',
              email: session.user.email,
              first_name: firstName,
              last_name: lastName,
              tx_ref: txRef,
              callback_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/payments/webhook`,
              return_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/payments/verify?tx_ref=${txRef}`,
              customization: {
                title: course.title,
                description: `Enrollment for ${course.title} course`,
              },
            }),
          });

          const chapaData = await chapaRes.json();

          if (!chapaRes.ok || chapaData.status !== 'success') {
            console.error('[CHAPA_INITIALIZE_FAILED]', JSON.stringify(chapaData, null, 2));

            let errMsg = 'Chapa payment gateway initialization failed.';
            if (typeof chapaData.message === 'string') {
              errMsg = chapaData.message;
            } else if (typeof chapaData.message === 'object' && chapaData.message !== null) {
              errMsg = Object.entries(chapaData.message)
                .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                .join('; ');
            } else if (chapaData.error) {
              errMsg = typeof chapaData.error === 'string' ? chapaData.error : JSON.stringify(chapaData.error);
            }
            throw new Error(errMsg);
          }

          // Return Chapa checkout URL back to the client button
          return NextResponse.json({ checkoutUrl: chapaData.data.checkout_url }, { status: 200 });
        } catch (chapaErr) {
          console.error('[CHAPA_INITIALIZE_ERROR]', chapaErr);
          return NextResponse.json({ error: `Payment Gateway Error: ${chapaErr.message}` }, { status: 422 });
        }
      }
    }

    // Fallback: Free or sandbox enrollment when Chapa API is not enabled
    const enrollment = await prisma.enrollment.create({
      data: { userId: session.user.id, courseId },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (err) {
    console.error('[ENROLLMENTS_POST]', err);
    return NextResponse.json({ error: 'Failed to enroll.' }, { status: 500 });
  }
}

