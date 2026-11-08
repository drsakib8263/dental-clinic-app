'use client'

import { useState, useEffect } from 'react'

export default function ServicesPage() {
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

  // থিম কালার (ছবিটির পেস্টেল মিন্ট ও ক্লিন থিম থেকে অনুপ্রাণিত)
  const themeStyles = darkMode ? {
    bgMain: '#0f172a',
    cardBg: '#1e293b',
    textColor: '#f8fafc',
    subTextColor: '#94a3b8',
    borderColor: '#334155',
    accentBg: '#0f2942'
  } : {
    bgMain: '#f4f9f6',
    cardBg: '#ffffff',
    textColor: '#0f2922',
    subTextColor: '#4a6b5d',
    borderColor: '#d0e5d8',
    accentBg: '#e2f0e8'
  }

  const content = {
    bn: {
      badge: 'প্রিমিয়াম ডেন্টাল সেবা',
      title: 'আমাদের ডেন্টাল সার্ভিসসমূহ',
      subtitle: 'সর্বাধুনিক প্রযুক্তি এবং শতভাগ জীবাণুমুক্ত পরিবেশে আপনার দাঁতের সুস্বাস্থ্য ও সুন্দর হাসি নিশ্চিত করতে আমরা প্রতিজ্ঞাবদ্ধ।',
      backHome: '← হোম পেজে ফিরে যান',
      servicesList: [
        {
          title: 'রুট ক্যানাল ট্রিটমেন্ট (RCT)',
          desc: 'সংক্রমিত বা ক্ষতিগ্রস্থ দাঁতের ভেতরের নার্ভ ও রক্তনালী নিরাপদে পরিষ্কার করে দাঁত রক্ষা করার সর্বাধুনিক চিকিৎসা।',
          icon: '🦷'
        },
        {
          title: 'স্কেলিং ও মাড়ির চিকিৎসা',
          desc: 'দাঁতের জমে থাকা টারটার, প্লাক ও দাগ দূর করে মাড়ি সুস্থ ও রক্তপড়া বন্ধ রাখার পেশাদার যত্ন।',
          icon: '✨'
        },
        {
          title: 'দাঁত ফিলিং ও রেস্টোরেশন',
          desc: 'ক্ষয় হওয়া বা গর্ত হওয়া দাঁতে লাইট কিউর ফিলিংয়ের মাধ্যমে স্বাভাবিক রূপ ও কার্যক্ষমতা ফিরিয়ে আনা।',
          icon: '💎'
        },
        {
          title: 'ক্রাউন এবং ব্রিজ (Crown & Bridge)',
          desc: 'ভাঙা বা রুট ক্যানাল করা দাঁতের সুরক্ষায় টেকসই জিরকোনিয়া ও মেটাল-সিরামিক ক্রাউন সংযোজন।',
          icon: '🛡️'
        },
        {
          title: 'দাঁত তোলা (Extraction)',
          desc: 'অতিরিক্ত ক্ষতিগ্রস্থ বা আক্কেল দাঁত (Wisdom tooth) সম্পূর্ণ পেইনলেস ও নিরাপদ উপায়ে অপসারণ।',
          icon: '🩺'
        },
        {
          title: 'কসমেটিক ডেন্টিস্ট্রি',
          desc: 'হলদে দাঁত হোয়াইটিং এবং সুন্দর স্মাইল ডিজাইনিংয়ের মাধ্যমে আকর্ষণীয় হাসি নিশ্চিতকরণ।',
          icon: '😁'
        }
      ]
    },
    en: {
      badge: 'PREMIUM DENTAL SERVICES',
      title: 'Our Dental Services',
      subtitle: 'We are committed to ensuring your dental health and a beautiful smile with cutting-edge technology and a 100% sterile environment.',
      backHome: '← Back to Home',
      servicesList: [
        {
          title: 'Root Canal Treatment (RCT)',
          desc: 'Advanced treatment to safely clean infected nerves and blood vessels inside damaged teeth.',
          icon: '🦷'
        },
        {
          title: 'Scaling & Gum Treatment',
          desc: 'Professional care to remove tartar, plaque, and stains, keeping gums healthy and stopping bleeding.',
          icon: '✨'
        },
        {
          title: 'Tooth Filling & Restoration',
          desc: 'Restoring decayed or cavity teeth to their natural shape and function using light-cure filling.',
          icon: '💎'
        },
        {
          title: 'Crown & Bridge',
          desc: 'Durable Zirconia and PFM crowns to protect broken or root-canaled teeth.',
          icon: '🛡️'
        },
        {
          title: 'Tooth Extraction',
          desc: 'Painless and safe removal of severely damaged or wisdom teeth.',
          icon: '🩺'
        },
        {
          title: 'Cosmetic Dentistry',
          desc: 'Ensuring an attractive smile through teeth whitening and smile designing.',
          icon: '😁'
        }
      ]
    }
  }

  const t = content[lang]

  return (
    <main 
      className="min-h-screen transition-all duration-300 font-sans"
      style={{ backgroundColor: themeStyles.bgMain, color: themeStyles.textColor }}
    >
      {/* টপ ন্যাভ বার */}
      <header 
        className="sticky top-0 z-50 px-4 md:px-12 py-4 shadow-sm flex items-center justify-between border-b backdrop-blur-md transition-all"
        style={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', borderColor: themeStyles.borderColor }}
      >
        <div className="flex items-center gap-3">
          <a href="/" className="w-10 h-10 rounded-xl bg-[#2d6a4f] text-white flex items-center justify-center text-xl font-bold shadow-md">
            🦷
          </a>
          <div className="flex flex-col">
            <span className="font-black text-lg md:text-xl tracking-tight" style={{ color: themeStyles.textColor }}>
              Dr. Sakib Dental Care
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href="/"
            className="text-xs md:text-sm font-bold px-4 py-2 rounded-full border transition hover:opacity-80"
            style={{ borderColor: themeStyles.borderColor, color: themeStyles.textColor }}
          >
            {t.backHome}
          </a>

          <button
            type="button"
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="font-bold px-3 py-2 rounded-lg border text-xs cursor-pointer"
            style={{ borderColor: themeStyles.borderColor }}
          >
            {lang === 'bn' ? 'English' : 'বাংলা'}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg border text-xs cursor-pointer"
            style={{ borderColor: themeStyles.borderColor }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* হিরো ও হেডার সেকশন (ছবিটির মিন্ট-গ্রিন ও প্যাস্টেল ডিজাইনের আদলে তৈরি) */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 pt-12 pb-16">
        <div 
          className="rounded-3xl p-8 md:p-16 border shadow-sm relative overflow-hidden transition-all duration-300"
          style={{ backgroundColor: themeStyles.accentBg, borderColor: themeStyles.borderColor }}
        >
          {/* ব্যাকগ্রাউন্ড ডেকোরেটিভ এলিমেন্ট */}
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-9xl pointer-events-none">
            🦷
          </div>

          <div className="max-w-3xl space-y-6 relative z-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-[#2d6a4f] text-white shadow-sm">
              {t.badge}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              {t.title}
            </h1>
            <p className="text-base md:text-lg font-medium leading-relaxed" style={{ color: themeStyles.subTextColor }}>
              {t.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* সার্ভিস কার্ড সেকশন (ছবিটির লেআউটের মতো আধুনিক গ্রিড) */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.servicesList.map((service, index) => (
            <div 
              key={index}
              className="p-8 rounded-3xl border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between space-y-4"
              style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.borderColor }}
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center text-2xl shadow-inner">
                  {service.icon}
                </div>
                <h3 className="text-xl font-black tracking-tight" style={{ color: themeStyles.textColor }}>
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: themeStyles.subTextColor }}>
                  {service.desc}
                </p>
              </div>

              <div className="pt-4 border-t" style={{ borderColor: themeStyles.borderColor }}>
                <a 
                  href="/#booking-section"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#2d6a4f] hover:underline"
                >
                  {lang === 'bn' ? 'অ্যাপয়েন্টমেন্ট নিন →' : 'Book Appointment →'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ফুটার */}
      <footer className="py-8 text-center border-t text-xs font-medium" style={{ borderColor: themeStyles.borderColor, color: themeStyles.subTextColor }}>
        <p>© {new Date().getFullYear()} Dr. Asir Mosaddeque Sakib Dental Care. All rights reserved.</p>
      </footer>
    </main>
  )
}