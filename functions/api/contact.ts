interface Env {
  RESEND_API_KEY?: string;
  CONTACT_RECEIVER_EMAIL?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;

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

    const apiKey = env.RESEND_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY is not configured on server.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const toEmail = env.CONTACT_RECEIVER_EMAIL || 'contact@kernovasystems.com';

    // Technical, bulletproof plain-text notification
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

    // Call Resend API via server-side fetch
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Kernova Systems <onboarding@resend.dev>',
        to: [toEmail],
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
