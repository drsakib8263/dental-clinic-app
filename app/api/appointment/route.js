import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// CommonJS স্টাইলে web-push লোড করা যাতে বিল্ড এরর না আসে
const webpush = require('web-push');

// Vapid কি কনফিগারেশন
webpush.setVapidDetails(
  'mailto:admin@drsakibdental.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    
    // গুগল স্ক্রিপ্ট ওয়েব অ্যাপে ডাটা পাঠানো
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxTwttvCE4yllq4XqmLKugGRdk_RJggL9jGhP1Rypz2HjNfyTHA_CVf0FhrNbH_atYKfw/exec';

    await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Supabase থেকে সেভ করা পুশ সাবস্ক্রিপশনগুলো ফেচ করা
    const { data: subs, error: subError } = await supabase
      .from('push_subscriptions')
      .select('subscription');

    if (!subError && subs && subs.length > 0) {
      // সার্ভিস ওয়ার্কারের জন্য আলাদা আলাদা প্রপার্টিসহ পে-লোড তৈরি
      const payload = JSON.stringify({
        title: '🔔 নতুন অ্যাপয়েন্টমেন্ট!',
        patientName: body.patient_name || 'অজানা রোগী',
        patientPhone: body.patient_phone || '',
        date: body.appointment_date || '',
        timeSlot: body.appointment_time || ''
      });

      // সকল সাবস্ক্রাইব করা ডিভাইসে ব্যাকগ্রাউন্ড পুশ নোটিফিকেশন পাঠানো
      await Promise.all(
        subs.map(async (sub) => {
          try {
            await webpush.sendNotification(sub.subscription, payload);
          } catch (err) {
            console.error('Push send error for a subscription:', err);
          }
        })
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}