import { NextResponse } from 'next/server';
import webpush from 'web-push';

// কনফিগারেশন
webpush.setVapidDetails(
  'mailto:admin@drsakibdentalcare.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function POST(request) {
  try {
    const { subscription, title, body } = await request.json();

    const payload = JSON.stringify({
      title: title || '🔔 নতুন অ্যাপয়েন্টমেন্ট!',
      body: body || 'আপনার চেম্বারে একটি নতুন বুকিং এসেছে।'
    });

    await webpush.sendNotification(subscription, payload);

    return NextResponse.json({ success: true, message: 'Push notification sent successfully!' });
  } catch (error) {
    console.error('Push Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}