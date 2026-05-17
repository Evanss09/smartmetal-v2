import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    if (AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        firstName: name,
        audienceId: AUDIENCE_ID,
        unsubscribed: false,
      });
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'SmartMetal <onboarding@resend.dev>',
      to: email,
      subject: "You're in — SmartMetal Updates",
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; padding: 40px 32px;">
          <h1 style="font-size: 24px; font-weight: 900; margin: 0 0 8px; letter-spacing: -0.5px; text-transform: uppercase;">
            SMART<span style="color: #f97316;">METAL</span>
          </h1>
          <p style="margin: 24px 0 8px; font-size: 16px; font-weight: 700; color: #f5f5f5;">Hey ${name},</p>
          <p style="margin: 0 0 16px; font-size: 14px; color: #9ca3af; line-height: 1.6;">
            You're on the list. We'll reach out with useful updates for sheet metal workers — new tools, courses, and trade resources.
          </p>
          <p style="margin: 16px 0; font-size: 14px; color: #9ca3af; line-height: 1.6;">
            In the meantime, check out the tools at smartmetal.ca.
          </p>
          <p style="margin: 32px 0 0; font-size: 12px; color: #4b4b4b;">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Newsletter error:', err);
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
  }
}
