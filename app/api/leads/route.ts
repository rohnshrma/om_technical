import { NextResponse } from 'next/server';
import { getLeadCollection } from '@/lib/models/lead';
import { BUSINESS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: {
    name?: string;
    phone?: string;
    email?: string;
    course_interested?: string;
    message?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const name = (body.name || '').trim();
  const phone = (body.phone || '').trim();
  const email = (body.email || '').trim();
  const courseInterested = (body.course_interested || '').trim();
  const message = (body.message || '').trim();

  if (!name || name.length > 100) {
    return NextResponse.json({ error: 'Please provide a valid name.' }, { status: 400 });
  }
  if (!/^[0-9+\-\s]{7,15}$/.test(phone)) {
    return NextResponse.json({ error: 'Please provide a valid phone number.' }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
  }

  try {
    const collection = await getLeadCollection();
    await collection.insertOne({
      name,
      phone,
      email: email || null,
      courseInterested: courseInterested || null,
      message: message || null,
      status: 'New',
      createdAt: new Date(),
    });
  } catch (e) {
    console.error('Lead insert failed:', e);
    return NextResponse.json({ error: 'Could not save your enquiry. Please try again or call us directly.' }, { status: 500 });
  }

  // Optional: notify the owner by email if Resend is configured (free tier — see README).
  const resendKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.LEAD_NOTIFICATION_EMAIL || BUSINESS.email;
  if (resendKey) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'OM Technical Website <onboarding@resend.dev>',
          to: [notifyTo],
          subject: `New Enquiry: ${name} — ${courseInterested || 'General'}`,
          text: `New lead received.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\nCourse Interested: ${courseInterested || 'N/A'}\nMessage: ${message || 'N/A'}`,
        }),
      });
    } catch (e) {
      console.error('Email notification failed (lead was still saved):', e);
    }
  }

  return NextResponse.json({ success: true });
}
