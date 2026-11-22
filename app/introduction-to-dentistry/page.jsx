'use client'

import { useState, useEffect } from 'react'

export default function IntroductionToDentistry() {
  const [lang, setLang] = useState('bn')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  
  const content = {
    bn: {
      brandName: 'ডাঃ আসির মোসাদ্দেক সাকিব',
      brandSub: 'ওরাল এন্ড ডেন্টাল সার্জন',
      aboutDentistryMenu: 'ডেন্টিস্ট্রি সম্পর্কে',
      title: 'ডেন্টিস্ট্রি পরিচিতি',
      subtitle: 'মুখের স্বাস্থ্য, ডেন্টাল কেয়ার ও আধুনিক চিকিৎসার মূলভিত্তি',
      introTitle: 'আধুনিক ডেন্টিস্ট্রি ও ওরাল হেলথ',
      introDesc: 'মুখের স্বাস্থ্য কেবল সুন্দর হাসির সাথেই যুক্ত নয়, এটি আপনার সামগ্রিক শারীরিক সুস্বাস্থ্যের একটি বড় চাবিকাঠি। নিয়মিত ডেন্টাল চেকআপ এবং সঠিক সময়ে সঠিক চিকিৎসা গ্রহণের মাধ্যমে বড় ধরনের অনেক শারীরিক জটিলতা এড়ানো সম্ভব।',
      pointsTitle: 'কেন ডেন্টিস্ট্রি সম্পর্কে সচেতনতা জরুরি?',
      point1Title: '১. ক্যাভিটি ও দাঁতের ক্ষয় রোধ',
      point1Desc: 'নিয়মিত ব্রাশ ও ফ্লসিংয়ের মাধ্যমে দাঁতে প্লাক জমা হওয়া রোধ করা যায়, যা ক্যাভিটি সৃষ্টিতে বাধা দেয়।',
      point2Title: '২. মাড়ির রোগ প্রতিরোধ',
      point2Desc: 'জিঞ্জিভাইটিস বা পিরিয়ডন্টাইটিসের মতো মাড়ির ইনফেকশন এড়াতে প্রাথমিক সচেতনতা অত্যন্ত কার্যকর।',
      point3Title: '৩. সামগ্রিক স্বাস্থ্যের সুরক্ষা',
      point3Desc: 'মুখের ভেতরের ব্যাকটেরিয়া রক্তনালীর মাধ্যমে হৃদরোগ বা ডায়াবেটিসের মতো জটিলতা বাড়াতে পারে, তাই ওরাল হাইজিন অত্যন্ত জরুরি।'
    },
    en: {
      brandName: 'Dr. Asir Mosaddeque Sakib',
      brandSub: 'Oral & Dental Surgeon',
      aboutDentistryMenu: 'About Dentistry',
      title: 'Introduction to Dentistry',
      subtitle: 'The Foundation of Oral Health, Dental Care & Modern Treatments',
      introTitle: 'Modern Dentistry & Oral Health',
      introDesc: 'Oral health is not just about a beautiful smile; it is a major key to your overall physical well-being. Regular dental checks and timely interventions can prevent major health complications.',
      pointsTitle: 'Why Dental Awareness Matters?',
      point1Title: '1. Preventing Cavities & Decay',
      point1Desc: 'Regular brushing and flossing prevent plaque buildup, which stops cavities from forming.',
      point2Title: '2. Gum Disease Prevention',
      point2Desc: 'Early awareness is extremely effective in avoiding gum infections like gingivitis or periodontitis.',
      point3Title: '3. Protecting Overall Health',
      point3Desc: 'Oral bacteria can enter the bloodstream and worsen conditions like heart disease or diabetes, making oral hygiene crucial.'
    }
  }

  return (
    <main
      data-lang={lang}
      className="font-body-ui min-h-screen relative py-6 px-4 md:px-12 transition-colors duration-300 scroll-smooth bg-[#F7F5F0] text-[#2C2A29] overflow-x-clip"
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@600;700;800&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
      />

      {/* ন্যাভিগেশন বার */}
      <header className="max-w-7xl mx-auto mb-8 sticky top-4 z-50 p-4 md:px-8 rounded-2xl backdrop-blur-md flex items-center justify-between gap-2 border border-[#E6DFD5] bg-[#FCFBF9]/95 transition-colors duration-300">
        <a href="/" className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-full bg-[#2C2A29] text-[#F7F5F0] flex items-center justify-center text-lg border border-[#A68A64]/40">
            🦷
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm sm:text-base md:text-xl tracking-tight truncate text-[#2C2A29]">
              {content[lang].brandName}
            </span>
            <span className="text-[10px] font-semibold text-[#A68A64] uppercase tracking-wider truncate">
              {content[lang].brandSub}
            </span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-6 font-medium text-sm text-[#5C5852]">
          <a href="/" className="hover:text-[#A68A64] transition-colors duration-300">
            {lang === 'bn' ? 'হোম' : 'Home'}
          </a>
          <a href="/#about-section" className="hover:text-[#A68A64] transition-colors duration-300">
            {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
          </a>
          <a href="/introduction-to-dentistry" className="text-[#2C2A29] font-semibold border-b border-[#A68A64] pb-0.5 transition-colors duration-300">
            {content[lang].aboutDentistryMenu}
          </a>
          <a href="/services" className="hover:text-[#A68A64] transition-colors duration-300">
            {lang === 'bn' ? 'সার্ভিস সমূহ' : 'Services'}
          </a>
          <a href="/gallery" className="hover:text-[#A68A64] transition-colors duration-300">
            {lang === 'bn' ? 'গ্যালারি' : 'Gallery'}
          </a>
          <a href="/#contact-section" className="hover:text-[#A68A64] transition-colors duration-300">
            {lang === 'bn' ? 'যোগাযোগ' : 'Contact Us'}
          </a>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {/* লাইট / ডার্ক মোড টগল বাটন */}
          
          <button
            type="button"
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#E6DFD5] bg-[#F7F5F0] hover:border-[#A68A64] text-[#2C2A29] transition-colors duration-300 flex items-center gap-1.5 text-xs md:text-sm cursor-pointer select-none"
          >
            <span>🌐</span>
            <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full border border-[#E6DFD5] bg-[#F7F5F0] text-[#2C2A29] flex items-center justify-center text-base sm:text-lg cursor-pointer focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* হ্যামবার্গার / মোবাইল ড্রপডাউন মেনু (স্ক্রলের যেকোনো জায়গা থেকে খুলবে) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-4 top-[88px] z-50 p-4 rounded-2xl border border-[#E6DFD5] bg-[#FCFBF9] shadow-xl space-y-2 font-semibold text-sm text-[#2C2A29] max-h-[75vh] overflow-y-auto">
          <a href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-xl border-b border-[#E6DFD5]">
            {lang === 'bn' ? 'হোম' : 'Home'}
          </a>
          <a href="/#about-section" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-xl border-b border-[#E6DFD5] text-[#5C5852]">
            {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
          </a>
          <a href="/introduction-to-dentistry" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-xl border-b border-[#E6DFD5] text-[#A68A64]">
            {content[lang].aboutDentistryMenu}
          </a>
          <a href="/services" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-xl border-b border-[#E6DFD5] text-[#5C5852]">
            {lang === 'bn' ? 'সার্ভিস সমূহ' : 'Services'}
          </a>
          <a href="/gallery" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-xl border-b border-[#E6DFD5] text-[#5C5852]">
            {lang === 'bn' ? 'গ্যালারি' : 'Gallery'}
          </a>
          <a href="/#contact-section" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-xl text-[#5C5852]">
            {lang === 'bn' ? 'যোগাযোগ' : 'Contact Us'}
          </a>
        </div>
      )}

      {/* মূল কন্টেন্ট সেকশন */}
      <section className="max-w-7xl mx-auto space-y-8 mb-16">

        {/* হেডার ব্যানার */}
        <div className="p-8 md:p-12 rounded-2xl border border-[#E6DFD5] bg-[#FCFBF9] text-center space-y-4 transition-colors duration-300">
          <span className="text-[#A68A64] bg-[#F7F5F0] border border-[#E6DFD5] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest inline-block">
            {lang === 'bn' ? 'ডেন্টাল গাইড' : 'Overview'}
          </span>
          <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight text-[#2C2A29]">
            {content[lang].title}
          </h1>
          <p className="text-sm md:text-base max-w-2xl mx-auto font-medium text-[#5C5852]">
            {content[lang].subtitle}
          </p>
        </div>

        {/* প্রধান বিবরণ */}
        <div className="p-6 md:p-10 rounded-2xl border border-[#E6DFD5] bg-[#FCFBF9] space-y-4 transition-colors duration-300">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#2C2A29]">
            {content[lang].introTitle}
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-[#5C5852]">
            {content[lang].introDesc}
          </p>
        </div>

        {/* পয়েন্টসমূহ */}
        <div className="space-y-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-[#2C2A29]">
            {content[lang].pointsTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="p-6 rounded-2xl border border-[#E6DFD5] bg-[#FCFBF9] hover:border-[#A68A64] transition-colors duration-300 space-y-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl bg-[#2C2A29] text-[#F7F5F0]">
                🦷
              </div>
              <h3 className="font-heading text-lg font-bold text-[#2C2A29]">{content[lang].point1Title}</h3>
              <p className="text-xs md:text-sm leading-relaxed text-[#5C5852]">{content[lang].point1Desc}</p>
            </div>

            <div className="p-6 rounded-2xl border border-[#E6DFD5] bg-[#FCFBF9] hover:border-[#A68A64] transition-colors duration-300 space-y-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl bg-[#2C2A29] text-[#F7F5F0]">
                🛡️
              </div>
              <h3 className="font-heading text-lg font-bold text-[#2C2A29]">{content[lang].point2Title}</h3>
              <p className="text-xs md:text-sm leading-relaxed text-[#5C5852]">{content[lang].point2Desc}</p>
            </div>

            <div className="p-6 rounded-2xl border border-[#E6DFD5] bg-[#FCFBF9] hover:border-[#A68A64] transition-colors duration-300 space-y-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl bg-[#2C2A29] text-[#F7F5F0]">
                ⭐
              </div>
              <h3 className="font-heading text-lg font-bold text-[#2C2A29]">{content[lang].point3Title}</h3>
              <p className="text-xs md:text-sm leading-relaxed text-[#5C5852]">{content[lang].point3Desc}</p>
            </div>

          </div>
        </div>

      </section>

      {/* ফুটার */}
      <footer className="max-w-7xl mx-auto bg-[#2C2A29] text-[#D8CFC4] py-6 px-6 rounded-2xl border border-[#A68A64]/25 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D8CFC4]/75 gap-4">
        <p>© 2026 Dr. Sakib Dental Care. All rights reserved.</p>
        <p className="font-medium text-[#A68A64]">
          developed by own(Dr. Asir Mosaddeque Sakib)
        </p>
      </footer>

    </main>
  )
}