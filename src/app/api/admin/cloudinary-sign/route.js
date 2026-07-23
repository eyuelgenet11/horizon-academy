import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const body = await req.json();
    const { paramsToSign } = body;

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({ signature });
  } catch (err) {
    console.error('[CLOUDINARY_SIGN_POST]', err);
    return NextResponse.json({ error: 'Failed to generate upload signature.' }, { status: 500 });
  }
}
