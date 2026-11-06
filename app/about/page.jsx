'use client'

import { useState } from 'react'

export default function AboutUs() {
  const [lang, setLang] = useState('bn')

  return (
    <main 
      className="min-h-screen text-slate-900 dark:text-slate-100 relative py-12 px-4 md:px-16 bg-cover bg-center bg-fixed transition-colors duration-200"
      style={{ backgroundImage: `url('/site-bg.jpeg')` }}
    >
      {/* ব্যাকগ্রাউন্ড ব্লার ও ওভারলে লেয়ার */}
      <div className="absolute inset-0 bg-[#EADCD2]/80 dark:bg-[#2B1618]/90 backdrop-blur-md pointer-events-none z-0"></div>

      {/* টপ ল্যাঙ্গুয়েজ টগল ও হোম বাটন */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-8 relative z-50">
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

      {/* মূল কন্টেন্ট বক্স */}
      <div className="max-w-4xl mx-auto bg-white/90 dark:bg-[#344246]/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border-2 border-[#5A181C]/40 relative z-10 space-y-8">
        
        {/* পেজ হেডিং */}
        <div className="border-b border-[#5A181C]/20 pb-6 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#5A181C] dark:text-[#EADCD2] tracking-tight">
            {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
          </h1>
          <p className="text-[#8B6B5E] dark:text-[#A89287] font-bold text-lg mt-2">
            {lang === 'bn' ? 'ডাঃ আসির মোসাদ্দেক সাকিব ডেন্টাল কেয়ার' : 'Dr. Asir Mosaddeque Sakib Dental Care'}
          </p>
        </div>

        {/* প্যারাগ্রাফ সেকশন - এগুলো আপনি পরবর্তীতে নিজের ইচ্ছামতো পরিবর্তন করতে পারবেন */}
        <div className="space-y-6 text-slate-800 dark:text-slate-200 text-base md:text-lg leading-relaxed">
          
          <h2 className="text-xl md:text-2xl font-bold text-[#5A181C] dark:text-white">
            {lang === 'bn' ? 'আপনার দাঁতের সুস্বাস্থ্য ও একটি সুন্দর হাসির নিশ্চয়তা' : 'Committed to Your Dental Health & Beautiful Smile'}
          </h2>

          <p>
            {lang === 'bn' 
              ? 'আমাদের চেম্বারে আপনাকে স্বাগতম। আমরা প্রতিটি রোগীর জন্য একটি আরামদায়ক ও ভীতিহীন পরিবেশ নিশ্চিত করতে প্রতিজ্ঞাবদ্ধ। আধুনিক প্রযুক্তির ছোঁয়া এবং অত্যন্ত আন্তরিকতার সাথে আমরা প্রদান করে আসছি বিশ্বমানের ওরাল ও ডেন্টাল কেয়ার সার্ভিস।' 
              : 'Welcome to our dental practice. We are dedicated to making every visit to our office a comfortable, relaxed experience. Expert dental care is provided with a warm, personal touch.'
            }
          </p>

          <p>
            {lang === 'bn'
              ? 'ডাঃ আসির মোসাদ্দেক সাকিব (বিডিএস, সিএমসি) ও তার অভিজ্ঞ টিম রুট ক্যানাল ট্রিটমেন্ট, জিরকনিয়া ক্রাউন, ফিলিং, স্কেলিং থেকে শুরু করে যেকোনো জটিল ডেন্টাল সার্জারিতে আধুনিক এবং পেইনলেস পদ্ধতি অনুসরণ করে থাকেন। আমরা প্রতিটি রোগীর সমস্যা গুরুত্ব সহকারে শুনে দীর্ঘস্থায়ী ও নিরাপদ সমাধান নিশ্চিত করি।'
              : 'Led by Dr. Asir Mosaddeque Sakib (BDS, CMC), our clinic offers a full range of general, restorative, and cosmetic dental treatments. From routine checkups to complete smile makeovers, we utilize modern technology to ensure the best outcomes for your dental health.'
            }
          </p>

          <p>
            {lang === 'bn'
              ? 'একটি সুন্দর হাসি আত্মবিশ্বাস বাড়ায়, আর সুস্থ দাঁত সুস্বাস্থ্য নিশ্চিত করে। আপনার যেকোনো ডেন্টাল প্রয়োজনে আজই আমাদের সাথে অ্যাপয়েন্টমেন্ট নিন এবং সেরা সেবাটি গ্রহণ করুন।'
              : 'The first step towards a beautiful smile and a lifetime of good oral health is to schedule an appointment with us. We look forward to serving you, your family, and friends of all ages.'
            }
          </p>

        </div>

        {/* নিচে যোগাযোগ বা কল টু অ্যাকশন বাটন */}
        <div className="pt-6 border-t border-[#5A181C]/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
            {lang === 'bn' ? 'হটলাইন: +880 1816 011 701' : 'Hotline: +880 1816 011 701'}
          </span>
          <a 
            href="tel:+8801816011701"
            className="bg-[#5A181C] hover:bg-[#451215] text-[#EADCD2] font-bold px-6 py-3 rounded-xl shadow transition text-sm"
          >
            {lang === 'bn' ? 'অ্যাপয়েন্টমেন্টের জন্য কল করুন' : 'Call for Appointment'}
          </a>
        </div>

      </div>
    </main>
  )
}