import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { Resend } from 'resend';

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const inquiry = await prisma.contactInquiry.create({ data: parsed.data });

    // Send email alert via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: 'eyuelshimelis29@gmail.com', // Administrator inbox (Onboarding Sandbox target)
          subject: `📬 New Contact Inquiry: ${parsed.data.subject || 'No Subject'}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #f26522;">New Contact Form Submission</h2>
              <p>You have received a new contact inquiry from the Horizon Platform.</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p><strong>Name:</strong> ${parsed.data.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${parsed.data.email}">${parsed.data.email}</a></p>
              <p><strong>Phone:</strong> ${parsed.data.phone || 'N/A'}</p>
              <p><strong>Subject:</strong> ${parsed.data.subject || 'General Inquiry'}</p>
              <p><strong>Message:</strong></p>
              <blockquote style="background: #f8fafc; padding: 15px; border-left: 4px solid #f26522; margin: 10px 0; line-height: 1.6;">
                ${parsed.data.message.replace(/\n/g, '<br />')}
              </blockquote>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('[EMAIL_SEND_ERROR]', emailErr);
      }
    }

    return NextResponse.json({ message: 'Message sent successfully!', id: inquiry.id }, { status: 201 });
  } catch (err) {
    console.error('[CONTACT_POST]', err);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
