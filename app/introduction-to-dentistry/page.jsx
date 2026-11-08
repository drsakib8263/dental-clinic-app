'use client'

import { useState, useEffect } from 'react'

export default function IntroductionToDentistry() {
  const [lang, setLang] = useState('bn')
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const isDark = savedTheme === 'dark'
    setDarkMode(isDark)
  }, [])

  const toggleTheme = () => {
    const nextMode = !darkMode
    setDarkMode(nextMode)
    localStorage.setItem('theme', nextMode ? 'dark' : 'light')
  }

  // থিম অনুযায়ী কালার প্যালেট (Services পেজের সাথে মিল রেখে)
  const themeStyles = darkMode ? {
    bgMain: '#1a1a1a',
    cardBg: '#262626',
    textColor: '#ffffff',
    subTextColor: '#cbd5e1',
    borderColor: '#9fb2c6'
  } : {
    bgMain: '#d9dee3',
    cardBg: '#ffffff',
    textColor: '#1a1a1a',
    subTextColor: '#334155',
    borderColor: '#9fb2c6'
  }

  const content = {
    bn: {
      title: 'ডেন্টিস্ট্রি পরিচিতি',
      subtitle: 'মুখের স্বাস্থ্য, ডেন্টাল কেয়ার ও আধুনিক চিকিৎসার মূলভিত্তি',
      introTitle: 'আধুনিক ডেন্টিস্ট্রি ও ওরাল হেলথ',
      introDesc: 'মুখের স্বাস্থ্য কেবল সুন্দর হাসির সাথেই যুক্ত নয়, এটি আপনার সামগ্রিক শারীরিক সুস্বাস্থ্যের একটি বড় চাবিকাঠি। নিয়মিত ডেন্টাল চেকআপ এবং সঠিক সময়ে সঠিক চিকিৎসা গ্রহণের মাধ্যমে বড় ধরনের অনেক শারীরিক জটিলতা এড়ানো সম্ভব।',
      pointsTitle: 'কেন ডেন্টাল সচেতনতা জরুরি?',
      point1Title: '১. ক্যাভিটি ও দাঁতের ক্ষয় রোধ',
      point1Desc: 'নিয়মিত ব্রাশ ও ফ্লসিংয়ের মাধ্যমে দাঁতে প্লাক জমা হওয়া রোধ করা যায়, যা ক্যাভিটি সৃষ্টিতে বাধা দেয়।',
      point2Title: '২. মাড়ির রোগ প্রতিরোধ',
      point2Desc: 'জিঞ্জিভাইটিস বা পিরিয়ডন্টাইটিসের মতো মাড়ির ইনফেকশন এড়াতে প্রাথমিক সচেতনতা অত্যন্ত কার্যকর।',
      point3Title: '৩. সামগ্রিক স্বাস্থ্যের সুরক্ষা',
      point3Desc: 'মুখের ভেতরের ব্যাকটেরিয়া রক্তনালীর মাধ্যমে হৃদরোগ বা ডায়াবেটিসের মতো জটিলতা বাড়াতে পারে, তাই ওরাল হাইজিন অত্যন্ত জরুরি।'
    },
    en: {
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
      className="min-h-screen relative py-6 px-4 md:px-12 transition-all duration-300 scroll-smooth"
      style={{ backgroundColor: themeStyles.bgMain, color: themeStyles.textColor }}
    >
      
      {/* ন্যাভিগেশন বার */}
      <header 
        className="max-w-7xl mx-auto mb-8 sticky top-4 z-50 p-4 md:px-8 rounded-2xl shadow-xl backdrop-blur-md flex items-center justify-between border transition-all duration-300"
        style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.borderColor }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-md"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            🦷
          </div>
          <span 
            className="font-extrabold text-lg md:text-xl tracking-tight"
            style={{ color: themeStyles.textColor }}
          >
            Dr. Sakib Dental Care
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 font-bold text-sm md:text-base" style={{ color: themeStyles.textColor }}>
          <a href="/" className="transition hover:opacity-70">Home</a>
          <a href="/#about-section" className="transition hover:opacity-70">About us</a>
          <a href="/introduction-to-dentistry" className="transition hover:opacity-70 border-b-2 pb-0.5" style={{ borderColor: '#9fb2c6' }}>Introduction to Dentistry</a>
          <a href="/services" className="transition hover:opacity-70">Our services</a>
          <a href="/gallery" className="transition hover:opacity-70">Gallery</a>
          <a href="/#contact-section" className="transition hover:opacity-70">Contact us</a>
        </nav>

        <div className="flex items-center gap-3">
          {/* লাইট / ডার্ক মোড টগল বাটন */}
          <button
            type="button"
            onClick={toggleTheme}
            className="font-bold px-4 py-2 rounded-xl shadow-md border transition-all duration-300 flex items-center gap-2 text-xs md:text-sm cursor-pointer select-none"
            style={{ 
              backgroundColor: darkMode ? '#ffffff' : '#1a1a1a', 
              color: darkMode ? '#1a1a1a' : '#ffffff', 
              borderColor: themeStyles.borderColor 
            }}
          >
            <span>{darkMode ? '☀️ Light' : '🌙 Dark'}</span>
          </button>

          <button
            type="button"
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="font-extrabold px-4 py-2 rounded-xl shadow-md transition flex items-center gap-1.5 text-xs md:text-sm cursor-pointer select-none text-white"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <span>🌐</span>
            <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-2xl p-2 focus:outline-none"
            style={{ color: themeStyles.textColor }}
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* মোবাইল ড্রপডাউন মেনু */}
      {mobileMenuOpen && (
        <div 
          className="max-w-7xl mx-auto mb-6 md:hidden relative z-50 p-4 rounded-2xl shadow-2xl border space-y-3 font-bold text-sm"
          style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.borderColor, color: themeStyles.textColor }}
        >
          <a href="/" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 rounded-lg" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>Home</a>
          <a href="/#about-section" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 rounded-lg opacity-90">About us</a>
          <a href="/introduction-to-dentistry" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 rounded-lg opacity-90">Introduction to Dentistry</a>
          <a href="/services" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 rounded-lg opacity-90">Our services</a>
          <a href="/gallery" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 rounded-lg opacity-90">Gallery</a>
          <a href="/#contact-section" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 rounded-lg opacity-90">Contact us</a>
        </div>
      )}

      {/* মূল কন্টেন্ট সেকশন */}
      <section className="max-w-7xl mx-auto space-y-8 mb-16">
        
        {/* হেডার ব্যানার */}
        <div 
          className="p-8 md:p-12 rounded-3xl border shadow-lg text-center space-y-4"
          style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.borderColor }}
        >
          <span 
            className="text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider inline-block"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            Overview
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight" style={{ color: themeStyles.textColor }}>
            {content[lang].title}
          </h1>
          <p className="text-sm md:text-base max-w-2xl mx-auto font-medium" style={{ color: themeStyles.subTextColor }}>
            {content[lang].subtitle}
          </p>
        </div>

        {/* প্রধান বিবরণ */}
        <div 
          className="p-6 md:p-10 rounded-3xl border shadow-sm space-y-4"
          style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.borderColor }}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: themeStyles.textColor }}>
            {content[lang].introTitle}
          </h2>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: themeStyles.subTextColor }}>
            {content[lang].introDesc}
          </p>
        </div>

        {/* পয়েন্টসমূহ (গ্রেডিয়েন্ট বর্ডার সহ বা ফিচার কার্ড স্টাইলে) */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-center" style={{ color: themeStyles.textColor }}>
            {content[lang].pointsTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div 
              className="p-6 rounded-3xl border shadow-sm space-y-3"
              style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.borderColor }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-md" style={{ backgroundColor: '#1a1a1a' }}>
                🦷
              </div>
              <h3 className="text-lg font-bold" style={{ color: themeStyles.textColor }}>{content[lang].point1Title}</h3>
              <p className="text-xs md:text-sm leading-relaxed" style={{ color: themeStyles.subTextColor }}>{content[lang].point1Desc}</p>
            </div>

            <div 
              className="p-6 rounded-3xl border shadow-sm space-y-3"
              style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.borderColor }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-md" style={{ backgroundColor: '#1a1a1a' }}>
                🛡️
              </div>
              <h3 className="text-lg font-bold" style={{ color: themeStyles.textColor }}>{content[lang].point2Title}</h3>
              <p className="text-xs md:text-sm leading-relaxed" style={{ color: themeStyles.subTextColor }}>{content[lang].point2Desc}</p>
            </div>

            <div 
              className="p-6 rounded-3xl border shadow-sm space-y-3"
              style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.borderColor }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-md" style={{ backgroundColor: '#1a1a1a' }}>
                ⭐
              </div>
              <h3 className="text-lg font-bold" style={{ color: themeStyles.textColor }}>{content[lang].point3Title}</h3>
              <p className="text-xs md:text-sm leading-relaxed" style={{ color: themeStyles.subTextColor }}>{content[lang].point3Desc}</p>
            </div>

          </div>
        </div>

      </section>

    </main>
  )
}