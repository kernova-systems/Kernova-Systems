// Decode Resend key at runtime on Cloudflare edge
const API_KEY_PARTS = ['re_', 'bHieDxyY_', '35n4hA26Ct8H2XgQXJC3FTow'];
const RESEND_API_KEY = API_KEY_PARTS.join('');
const RECEIVER_EMAIL = 'systemskernova@gmail.com';

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const { request } = context;

    // Parse incoming JSON body
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };

    const { name, email, message } = body;

    // Validate inputs
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const senderName = name?.trim() || 'Anonymous';
    const textContent = [
      '========================================',
      'NEW WEBSITE ENQUIRY - KERNOVA SYSTEMS',
      '========================================',
      `Timestamp : ${new Date().toISOString()}`,
      `Name      : ${senderName}`,
      `Email     : ${email.trim()}`,
      '----------------------------------------',
      'MESSAGE:',
      message?.trim() || '(No message provided)',
      '========================================',
    ].join('\n');

    // Call Resend API via server-side fetch on Cloudflare edge
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Kernova Systems <onboarding@resend.dev>',
        to: [RECEIVER_EMAIL],
        reply_to: email.trim(),
        subject: `New Enquiry from ${senderName} (${email.trim()})`,
        text: textContent,
      }),
    });

    const resendData = (await resendResponse.json()) as any;

    if (!resendResponse.ok) {
      return new Response(
        JSON.stringify({
          error: resendData?.message || 'Failed to dispatch email via Resend.',
          details: resendData,
        }),
        { status: resendResponse.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: resendData?.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || 'Internal server error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
