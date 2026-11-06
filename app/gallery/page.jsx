'use client'

import { useState } from 'react'

export default function GalleryPage() {
  const [lang, setLang] = useState('bn')
  const [activeTab, setActiveTab] = useState('chamber') // 'chamber' অথবা 'patient'

  // ২০টি করে ছবির অ্যারে তৈরি করা (chamber-01 থেকে chamber-20 এবং patient-01 থেকে patient-20)
  const chamberImages = Array.from({ length: 20 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0')
    return {
      src: `/gallery/chamber-${num}.jpeg`, // আপনার লোকাল ফোল্ডারে এই নামে ছবি রাখতে হবে
      titleBn: `চেম্বার ছবি #${i + 1}`,
      titleEn: `Chamber Photo #${i + 1}`
    }
  })

  const patientImages = Array.from({ length: 20 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0')
    return {
      src: `/gallery/patient-${num}.jpeg`,
      titleBn: `রোগীর হাসির প্রচেষ্টা #${i + 1}`,
      titleEn: `Patient Smile Restoration #${i + 1}`
    }
  })

  const currentList = activeTab === 'chamber' ? chamberImages : patientImages

  return (
    <main 
      className="min-h-screen text-slate-900 dark:text-slate-100 relative py-12 px-4 md:px-16 bg-cover bg-center bg-fixed transition-colors duration-200"
      style={{ backgroundImage: `url('/site-bg.jpeg')` }}
    >
      <div className="absolute inset-0 bg-[#EADCD2]/80 dark:bg-[#2B1618]/90 backdrop-blur-md pointer-events-none z-0"></div>

      {/* টপ ন্যাভিগেশন ও ল্যাঙ্গুয়েজ টগল */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8 relative z-50">
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

      <div className="max-w-6xl mx-auto bg-white/90 dark:bg-[#344246]/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border-2 border-[#5A181C]/40 relative z-10 space-y-8">
        
        {/* হেডার */}
        <div className="border-b border-[#5A181C]/20 pb-6 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#5A181C] dark:text-[#EADCD2] tracking-tight">
            {lang === 'bn' ? 'ফটো গ্যালারি' : 'Photo Gallery'}
          </h1>
          <p className="text-[#8B6B5E] dark:text-[#A89287] font-bold text-lg mt-2">
            {lang === 'bn' ? 'ডাঃ আসির মোসাদ্দেক সাকিব ডেন্টাল কেয়ার' : 'Dr. Asir Mosaddeque Sakib Dental Care'}
          </p>
        </div>

        {/* ব্রাঞ্চ সিলেকশন ট্যাব বাটন */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setActiveTab('chamber')}
            className={`px-6 py-3 rounded-2xl font-bold transition shadow-md cursor-pointer ${
              activeTab === 'chamber'
                ? 'bg-[#5A181C] text-[#EADCD2]'
                : 'bg-white/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#5A181C]/30'
            }`}
          >
            {lang === 'bn' ? '🏥 আমাদের চেম্বার' : '🏥 Our Chamber'}
          </button>

          <button
            onClick={() => setActiveTab('patient')}
            className={`px-6 py-3 rounded-2xl font-bold transition shadow-md cursor-pointer ${
              activeTab === 'patient'
                ? 'bg-[#5A181C] text-[#EADCD2]'
                : 'bg-white/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#5A181C]/30'
            }`}
          >
            {lang === 'bn' ? '😁 রোগীর হাসি ফিরিয়ে আনার প্রচেষ্টা' : '😁 Patient Smile Restoration'}
          </button>
        </div>

        {/* স্লাইড শো / হরিজন্টাল স্ক্রোলিং কন্টেইনার */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#5A181C] dark:text-teal-300">
            {activeTab === 'chamber' 
              ? (lang === 'bn' ? 'আমাদের চেম্বারের দৃশ্যসমূহ (২০টি স্লাইড)' : 'Our Chamber Views (20 Slides)')
              : (lang === 'bn' ? 'রোগীর হাসি ফিরিয়ে আনার প্রচেষ্টা (২০টি স্লাইড)' : 'Smile Restoration Cases (20 Slides)')}
          </h2>

          {/* ডানে-বামে স্ক্রোল করার বক্স */}
          <div className="flex overflow-x-auto gap-6 pb-6 pt-2 snap-x scrollbar-thin scrollbar-thumb-[#5A181C] scrollbar-track-[#EADCD2]">
            {currentList.map((item, index) => (
              <div 
                key={index} 
                className="min-w-[280px] md:min-w-[340px] bg-white dark:bg-slate-800 rounded-2xl border border-[#5A181C]/20 shadow-md overflow-hidden snap-center flex-shrink-0 flex flex-col"
              >
                <div className="w-full h-48 md:h-56 bg-slate-200 dark:bg-slate-700 relative overflow-hidden flex items-center justify-center">
                  {/* যদি ছবি না থাকে তবে ফলব্যাক টেক্সট দেখাবে, ছবি থাকলে লোড হবে */}
                  <img 
                    src={item.src} 
                    alt={item.titleEn}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect fill='%23EADCD2' width='300' height='200'/%3E%3Ctext fill='%235A181C' font-family='sans-serif' font-size='14' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImage Not Found (Add File)%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="p-4 text-center">
                  <span className="font-bold text-sm text-[#5A181C] dark:text-[#EADCD2]">
                    {lang === 'bn' ? item.titleBn : item.titleEn}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            {lang === 'bn' ? '← ডানে বা বামে স্ক্রোল করে ছবিগুলো দেখুন →' : '← Scroll left or right to view images →'}
          </p>
        </div>

      </div>
    </main>
  )
}