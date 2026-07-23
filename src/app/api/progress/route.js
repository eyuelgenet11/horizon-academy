import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';

const ProgressSchema = z.object({
  lessonId: z.string(),
  completed: z.boolean(),
});

// GET /api/progress?courseId=xxx — get progress for a course
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    const progress = await prisma.progress.findMany({
      where: {
        userId: session.user.id,
        ...(courseId ? { lesson: { courseId } } : {}),
      },
    });

    return NextResponse.json(progress);
  } catch (err) {
    console.error('[PROGRESS_GET]', err);
    return NextResponse.json({ error: 'Failed to fetch progress.' }, { status: 500 });
  }
}

// POST /api/progress — mark a lesson complete or incomplete
export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const body = await req.json();
    const parsed = ProgressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { lessonId, completed } = parsed.data;

    const progress = await prisma.progress.upsert({
      where: { userId_lessonId: { userId: session.user.id, lessonId } },
      update: { completed, completedAt: completed ? new Date() : null },
      create: {
        userId: session.user.id,
        lessonId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    // Check if all course lessons are completed to auto-generate certificate
    try {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          course: {
            include: {
              lessons: { select: { id: true } }
            }
          }
        }
      });

      if (lesson) {
        if (completed) {
          const totalLessons = lesson.course.lessons.length;
          const completedCount = await prisma.progress.count({
            where: {
              userId: session.user.id,
              completed: true,
              lesson: {
                courseId: lesson.courseId
              }
            }
          });

          if (completedCount === totalLessons && totalLessons > 0) {
            await prisma.certificate.upsert({
              where: {
                userId_courseId: {
                  userId: session.user.id,
                  courseId: lesson.courseId,
                }
              },
              update: {},
              create: {
                userId: session.user.id,
                courseId: lesson.courseId,
              }
            });
          }
        } else {
          // Revoke certificate if lesson is marked incomplete
          await prisma.certificate.delete({
            where: {
              userId_courseId: {
                userId: session.user.id,
                courseId: lesson.courseId
              }
            }
          }).catch(() => {});
        }
      }
    } catch (certErr) {
      console.error('[AUTO_CERTIFICATE_ERROR]', certErr);
    }

    return NextResponse.json(progress);
  } catch (err) {
    console.error('[PROGRESS_POST]', err);
    return NextResponse.json({ error: 'Failed to save progress.' }, { status: 500 });
  }
}
