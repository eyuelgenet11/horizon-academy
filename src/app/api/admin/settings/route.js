import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/settings';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const settings = getSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error('[API_SETTINGS_GET]', err);
    return NextResponse.json({ error: 'Failed to fetch settings.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const current = getSettings();

    // Merge settings
    const updated = {
      ...current,
      ...body
    };

    const ok = saveSettings(updated);
    if (!ok) {
      return NextResponse.json({ error: 'Failed to save settings file.' }, { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error('[API_SETTINGS_POST]', err);
    return NextResponse.json({ error: 'Failed to update settings.' }, { status: 500 });
  }
}
