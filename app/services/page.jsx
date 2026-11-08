'use client'

import { useState } from 'react'

export default function ServicesPage() {
  const [lang, setLang] = useState('bn')

  const servicesList = lang === 'bn' ? [
    {
      name: 'রুট ক্যানাল ট্রিটমেন্ট (Root Canal Treatment)',
      desc: 'সংক্রমিত বা ক্ষতিগ্রস্থ দাঁতের ভেতরের নার্ভ ও রক্তনালী পরিষ্কার করে দাঁত বাঁচানোর আধুনিক চিকিৎসা।',
      time: '১৫-২০ মিনিট'
    },
    {
      name: 'মেটাল-সিরামিক (PFM) ক্রাউন/ক্যাপ',
      desc: 'রুট ক্যানাল বা দুর্বল দাঁতের সুরক্ষায় এবং স্থায়িত্ব বাড়াতে টেকসই মেটাল ও সিরামিকের সংমিশ্রণে তৈরি ক্যাপ।',
      time: '১৫ মিনিট (প্রতি ভিজিট)'
    },
    {
      name: 'জিরকনিয়া ক্রাউন/ক্যাপ (Zirconia Crown)',
      desc: 'সর্বাধুনিক প্রযুক্তির অত্যন্ত শক্তিশালী ও দেখতে একদম প্রাকৃতিক দাঁতের মতো প্রিমিয়াম ক্রাউন।',
      time: '১৫ মিনিট (প্রতি ভিজিট)'
    },
    {
      name: 'কম্পোজিট ফিলিং (Composite Filling)',
      desc: 'দাঁতের ক্যাভিটি বা ক্ষয় রোধে দাঁতের রঙের সাথে মিলিয়ে নিখুঁতভাবে ফিলিং করা।',
      time: '১৫-২০ মিনিট'
    },
    {
      name: 'মিড-ডায়াস্টেমা ক্লোজ (Front Tooth Gap Closing)',
      desc: 'সামনের দুই দাঁতের মাঝখানের ফাঁকা জায়গা সুন্দরভাবে বন্ধ করার চিকিৎসা।',
      time: '৩০ মিনিট'
    },
    {
      name: 'জি.আই ফিলিং (G.I. Filling)',
      desc: 'দাঁতের চিকিৎসায় ব্যবহৃত গ্লাস আয়োনোমার সিমেন্ট ফিলিং, যা দাঁতের সুরক্ষায় অত্যন্ত কার্যকর।',
      time: '২০ মিনিট'
    },
    {
      name: 'নরমাল এক্সট্রাকশন (Normal Tooth Extraction)',
      desc: 'অতিরিক্ত ক্ষতিগ্রস্থ বা নড়বড়ে দাঁত নিরাপদে ও পেইনলেসভাবে অপসারণ করা।',
      time: '১৫ মিনিট'
    },
    {
      name: 'সার্জিক্যাল এক্সট্রাকশন (Wisdom Tooth Surgery)',
      desc: 'আঁকাবাঁকা বা মাড়ির ভেতরে আটকে থাকা আককেল দাঁত বা জটিল দাঁত অপারেশনের মাধ্যমে অপসারণ।',
      time: '৩০-৬০ মিনিট'
    },
    {
      name: 'বাচ্চাদের ফিলিং ও দাঁত তোলা (Pediatric Dentistry)',
      desc: 'ছোটদের দুধ দাঁতের সমস্যা সমাধান এবং শিশুদের উপযোগী কোমল ডেন্টাল কেয়ার।',
      time: '১০-২০ মিনিট'
    },
    {
      name: 'স্কেলিং ও পলিশিং (Scaling & Polishing)',
      desc: 'দাঁতে জমে থাকা টাটার, প্লাক ও দাগ দূর করে মাড়ি সুস্থ ও মুখগহ্বর সতেজ রাখা।',
      time: '২০-২৫ মিনিট'
    },
    {
      name: 'পোস্ট-কোর বিল্ডাপ (Post-Core Buildup)',
      desc: 'ভাঙা বা অত্যন্ত দুর্বল দাঁতের শিকড়ে ফাইবার পোস্ট স্থাপন করে ক্যাপ পরার উপযোগী করা।',
      time: '১৫ মিনিট'
    },
    {
      name: 'ফ্লেক্সিবল ও হিট কিউর ডেঞ্চার',
      desc: 'হারিয়ে যাওয়া দাঁতের পরিবর্তে আরামদায়ক ও নমনীয় কৃত্রিম আর্টিফিশিয়াল দাঁতের সেট বা ডেনচার।',
      time: '১৫ মিনিট (প্রতি ভিজিট)'
    },
    {
      name: 'নাইট গার্ড (Night Guard)',
      desc: 'ঘুমের সময় দাঁত কিড়মিড় করার অভ্যাস (Bruxism) থেকে দাঁতকে সুরক্ষার বিশেষ ট্রের ব্যবস্থা।',
      time: '১৫ মিনিট (প্রতি ভিজিট)'
    }
  ] : [
    {
      name: 'Root Canal Treatment',
      desc: 'Modern treatment to save a damaged tooth by cleaning infected pulp and nerves inside.',
      time: '15-20 mins'
    },
    {
      name: 'Metal-Ceramic (PFM) Crown/Cap',
      desc: 'Durable metal and ceramic combination cap for protection after root canal or weak teeth.',
      time: '15 mins (Per Visit)'
    },
    {
      name: 'Zirconia Crown/Cap',
      desc: 'State-of-the-art, highly durable, and natural-looking premium ceramic crown.',
      time: '15 mins (Per Visit)'
    },
    {
      name: 'Composite Filling',
      desc: 'Tooth-colored filling to repair cavities and restore natural appearance.',
      time: '15-20 mins'
    },
    {
      name: 'Mid-Diastema Closure',
      desc: 'Aesthetic cosmetic procedure to close gaps between front teeth.',
      time: '30 mins'
    },
    {
      name: 'G.I. Filling',
      desc: 'Glass Ionomer cement filling used for standard cavity protection.',
      time: '20 mins'
    },
    {
      name: 'Normal Tooth Extraction',
      desc: 'Safe and painless removal of severely decayed or loose teeth.',
      time: '15 mins'
    },
    {
      name: 'Surgical Extraction (Wisdom Tooth)',
      desc: 'Surgical removal of impacted wisdom teeth or complex dental structures.',
      time: '30-60 mins'
    },
    {
      name: 'Pediatric Dental Care',
      desc: 'Gentle dental fillings and extractions specially tailored for children.',
      time: '10-20 mins'
    },
    {
      name: 'Scaling & Polishing',
      desc: 'Professional cleaning to remove tartar, plaque, and stains for healthy gums.',
      time: '20-25 mins'
    },
    {
      name: 'Post-Core Buildup',
      desc: 'Fiber post placement in weakened teeth to support crowns securely.',
      time: '15 mins'
    },
    {
      name: 'Flexible & Heat Cure Dentures',
      desc: 'Removable artificial teeth appliances designed for comfort and mastication.',
      time: '15 mins (Per Visit)'
    },
    {
      name: 'Night Guard',
      desc: 'Custom protective appliance to prevent tooth damage from nighttime teeth grinding.',
      time: '15 mins (Per Visit)'
    }
  ]

  return (
    <main 
      className="min-h-screen text-slate-900 dark:text-slate-100 relative py-12 px-4 md:px-16 bg-cover bg-center bg-fixed transition-colors duration-200"
      style={{ backgroundImage: `url('/site-bg.jpeg')` }}
    >
      <div className="absolute inset-0 bg-[#EADCD2]/80 dark:bg-[#2B1618]/90 backdrop-blur-md pointer-events-none z-0"></div>

      {/* টপ ন্যাভিগেশন ও ল্যাঙ্গুয়েজ টগল */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-8 relative z-50">
        <a 
          href="/"
          className="bg-[#5A181C] text-[#EADCD2] font-bold px-5 py-2.5 rounded-full shadow-lg transition hover:bg-[#451215]"
        >
          {lang === 'bn' ? '← হোম পেজে ফিরে যান' : '← Back to Home'}
        </a>

        <button
          type="button"
          onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
          className="bg-[#5A181C] hover:bg-[#451215] text-[#EADCD2] font-extrabold px-5 py-2.5 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2 text-sm cursor-pointer select-none"
        >
          <span>🌐</span>
          <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white/90 dark:bg-[#344246]/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border-2 border-[#5A181C]/40 relative z-10 space-y-8">
        
        <div className="border-b border-[#5A181C]/20 pb-6 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#5A181C] dark:text-[#EADCD2] tracking-tight">
            {lang === 'bn' ? 'আমাদের সেবাসমূহ (Our Services)' : 'Our Services'}
          </h1>
          <p className="text-[#8B6B5E] dark:text-[#A89287] font-bold text-lg mt-2">
            {lang === 'bn' ? 'ডাঃ আসির মোসাদ্দেক সাকিব ডেন্টাল কেয়ারে প্রদত্ত আধুনিক ডেন্টাল চিকিৎসাসমূহ' : 'Advanced dental treatments provided at our clinic'}
          </p>
        </div>

        {/* সার্ভিস লিস্ট কার্ড গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {servicesList.map((service, index) => (
            <div 
              key={index} 
              className="bg-[#EADCD2]/40 dark:bg-slate-800/80 p-6 rounded-2xl border border-[#5A181C]/20 shadow-md flex flex-col justify-between space-y-3 hover:shadow-lg transition"
            >
              <div>
                <h3 className="text-lg font-bold text-[#5A181C] dark:text-amber-200 mb-2">
                  {service.name}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {service.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#5A181C]/10 flex items-center justify-between text-xs font-semibold">
                <span className="text-[#8B6B5E] dark:text-[#A89287]">
                  {lang === 'bn' ? '⏱️ আনুমানিক সময়:' : '⏱️ Approx Time:'}
                </span>
                <span className="text-[#5A181C] dark:text-teal-300 font-bold">
                  {service.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-[#5A181C]/20 text-center">
          <a 
            href="/#booking-section"
            className="inline-block bg-[#5A181C] hover:bg-[#451215] text-[#EADCD2] font-bold px-8 py-3.5 rounded-xl shadow-lg transition text-sm"
          >
            {lang === 'bn' ? '📅 অ্যাপয়েন্টমেন্ট বুক করুন' : '📅 Book Appointment'}
          </a>
        </div>

      </div>
    </main>
  )
}