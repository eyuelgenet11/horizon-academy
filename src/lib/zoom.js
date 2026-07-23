export async function getZoomAccessToken() {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    throw new Error('Zoom API credentials are not configured in the .env file.');
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.reason || data.error_description || 'Failed to fetch Zoom access token.');
  }

  return data.access_token;
}

export async function createZoomMeeting({ topic, startTime, duration = 60 }) {
  const accessToken = await getZoomAccessToken();

  const res = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic,
      type: 2, // Scheduled meeting
      start_time: startTime, // ISO 8601 format: YYYY-MM-DDTHH:MM:SS
      duration,
      timezone: 'Africa/Addis_Ababa',
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: true,
        mute_upon_entry: true,
        waiting_room: false,
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to create Zoom meeting.');
  }

  return {
    meetingId: data.id,
    joinUrl: data.join_url,
    password: data.password,
    startUrl: data.start_url,
  };
}
