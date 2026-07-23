import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { createZoomMeeting } from '@/lib/zoom';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const body = await req.json();
    const { title, videoUrl, audioUrl, pdfUrl, content, courseId, order, isZoomClass, zoomStartTime, zoomDuration } = body;

    if (!title || !courseId) {
      return NextResponse.json({ error: 'title and courseId are required.' }, { status: 400 });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    }

    let finalVideoUrl = videoUrl || null;
    let finalContent = content || null;

    // Handle automated Zoom scheduling
    if (isZoomClass) {
      try {
        if (!zoomStartTime) {
          return NextResponse.json({ error: 'Start time is required for Zoom classes.' }, { status: 400 });
        }
        
        const zoomMeeting = await createZoomMeeting({
          topic: `${course.title} — ${title}`,
          startTime: zoomStartTime,
          duration: zoomDuration ? parseInt(zoomDuration) : 60
        });

        finalVideoUrl = zoomMeeting.joinUrl;
        
        const zoomDetails = `📅 Live Class Details:\n• Meeting ID: ${zoomMeeting.meetingId}\n• Passcode: ${zoomMeeting.password || 'None'}\n\nClick the button above to join the class live!`;
        finalContent = finalContent ? `${finalContent}\n\n${zoomDetails}` : zoomDetails;
      } catch (zoomErr) {
        console.error('[ZOOM_SCHEDULING_FAILED]', zoomErr);
        return NextResponse.json({ error: `Zoom Integration Error: ${zoomErr.message}` }, { status: 422 });
      }
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        videoUrl: finalVideoUrl,
        audioUrl: audioUrl || null,
        pdfUrl: pdfUrl || null,
        content: finalContent,
        courseId,
        order: order ? parseInt(order) : 0,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (err) {
    console.error('[LESSONS_POST]', err);
    return NextResponse.json({ error: 'Failed to create lesson.' }, { status: 500 });
  }
}

