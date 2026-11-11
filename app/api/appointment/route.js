import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // আপনার গুগল স্ক্রিপ্ট ওয়েব অ্যাপ ইউআরএল
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxTwttvCE4yllq4XqmLKugGRdk_RJggL9jGhP1Rypz2HjNfyTHA_CVf0FhrNbH_atYKfw/exec';

    // সার্ভার থেকে গুগল স্ক্রিপ্টে ফেচ করা (এখানে কোনো CORS সমস্যা হবে না)
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.text();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}