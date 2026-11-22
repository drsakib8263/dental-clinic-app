'use client'

import { useState, useEffect } from 'react'

export default function ServicesPage() {
  const [lang, setLang] = useState('bn')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  
  const servicesList = [
    {
      id: 'ser-01',
      badgeBn: 'প্রাথমিক সেবা',
      badgeEn: 'Primary Care',
      nameBn: 'নিয়মিত দাঁতের চেকাপ (Regular Dental Checkup)',
      nameEn: 'Regular Dental Checkup',
      descBn: 'দাঁত ও মাড়ির যেকোনো সমস্যা প্রাথমিক অবস্থায় শনাক্ত করতে এবং সুস্থ মুখগহ্বর বজায় রাখতে নিয়মিত রুটিন চেকআপ।',
      descEn: 'Routine dental checkup to detect early signs of dental issues and maintain optimal oral health.',
      timeBn: '১০-১৫ মিনিট',
      timeEn: '10-15 mins'
    },
    {
      id: 'ser-02',
      badgeBn: 'পরামর্শ সেবা',
      badgeEn: 'Consultation',
      nameBn: 'পেশেন্ট কাউন্সেলিং (Patient Counseling)',
      nameEn: 'Patient Counseling',
      descBn: 'রোগীর যেকোনো জটিল ডেন্টাল সমস্যা ও ভীতি দূর করতে এবং সঠিক মৌখিক স্বাস্থ্যবিধি বজায় রাখতে বিস্তারিত পরামর্শ প্রদান।',
      descEn: 'Detailed consultation and guidance to alleviate patient anxiety and maintain optimal oral hygiene.',
      timeBn: '১৫-২০ মিনিট',
      timeEn: '15-20 mins'
    },
    {
      id: 'ser-03',
      badgeBn: 'পপুলার ট্রিটমেন্ট',
      badgeEn: 'Popular Treatment',
      nameBn: 'রুট ক্যানাল ট্রিটমেন্ট (Root Canal Treatment)',
      nameEn: 'Root Canal Treatment',
      descBn: 'সংক্রমিত বা ক্ষতিগ্রস্থ দাঁতের ভেতরের নার্ভ ও রক্তনালী পরিষ্কার করে দাঁত বাঁচানোর আধুনিক চিকিৎসা।',
      descEn: 'Modern treatment to save a damaged tooth by cleaning infected pulp and nerves inside.',
      timeBn: '১৫-২০ মিনিট',
      timeEn: '15-20 mins'
    },
    {
      id: 'ser-04',
      badgeBn: 'প্রিমিয়াম ক্যাটাগরি',
      badgeEn: 'Premium Choice',
      nameBn: 'জিরকনিয়া ক্রাউন/ক্যাপ (Zirconia Crown)',
      nameEn: 'Zirconia Crown/Cap',
      descBn: 'সর্বাধুনিক প্রযুক্তির অত্যন্ত শক্তিশালী ও দেখতে একদম প্রাকৃতিক দাঁতের মতো প্রিমিয়াম ক্রাউন।',
      descEn: 'State-of-the-art, highly durable, and natural-looking premium ceramic crown.',
      timeBn: '১৫ মিনিট (প্রতি ভিজিট)',
      timeEn: '15 mins (Per Visit)'
    },
    {
      id: 'ser-05',
      badgeBn: 'স্ট্যান্ডার্ড ক্যাপ',
      badgeEn: 'Standard Crown',
      nameBn: 'মেটাল-সিরামিক (PFM) ক্রাউন/ক্যাপ',
      nameEn: 'Metal-Ceramic (PFM) Crown/Cap',
      descBn: 'রুট ক্যানাল বা দুর্বল দাঁতের সুরক্ষায় এবং স্থায়িত্ব বাড়াতে টেকসই মেটাল ও সিরামিকের সংমিশ্রণে তৈরি ক্যাপ।',
      descEn: 'Durable metal and ceramic combination cap for protection after root canal or weak teeth.',
      timeBn: '১৫ মিনিট (প্রতি ভিজিট)',
      timeEn: '15 mins (Per Visit)'
    },
    {
      id: 'ser-06',
      badgeBn: 'টুথ কালার ফিলিং',
      badgeEn: 'Tooth Colored',
      nameBn: 'কম্পোজিট ফিলিং (Composite Filling)',
      nameEn: 'Composite Filling',
      descBn: 'দাঁতের ক্যাভিটি বা ক্ষয় রোধে দাঁতের রঙের সাথে মিলিয়ে নিখুঁতভাবে ফিলিং করা।',
      descEn: 'Tooth-colored filling to repair cavities and restore natural appearance.',
      timeBn: '১৫-২০ মিনিট',
      timeEn: '15-20 mins'
    },
    {
      id: 'ser-07',
      badgeBn: 'স্ট্যান্ডার্ড ফিলিং',
      badgeEn: 'Standard Filling',
      nameBn: 'জি.আই ফিলিং (G.I. Filling)',
      nameEn: 'G.I. Filling',
      descBn: 'দাঁতের চিকিৎসায় ব্যবহৃত গ্লাস আয়োনোমার সিমেন্ট ফিলিং, যা দাঁতের সুরক্ষায় অত্যন্ত কার্যকর।',
      descEn: 'Glass Ionomer cement filling used for standard cavity protection.',
      timeBn: '২০ মিনিট',
      timeEn: '20 mins'
    },
    {
      id: 'ser-08',
      badgeBn: 'এক ভিজিটে ফিক্সড দাঁত',
      badgeEn: 'Single Visit Fixed',
      nameBn: 'ফাইবার রি-ইনফোর্সড কম্পোজিট ব্রিজ (Fiber-Reinforced Composite Bridge)',
      nameEn: 'Fiber-Reinforced Composite Bridge',
      descBn: 'হারিয়ে যাওয়া দাঁতের দুই পাশের দাঁতের সাহায্যে বিশেষ ফাইবার ও কম্পোজিট রজন ব্যবহার করে এক ভিজিটে ফিক্সড কৃত্রিম দাঁত সংযোজন।',
      descEn: 'Single-visit fixed tooth replacement using high-strength fiber and composite resin supported by adjacent teeth.',
      timeBn: '৩০-৪৫ মিনিট',
      timeEn: '30-45 mins'
    },
    {
      id: 'ser-09',
      badgeBn: 'স্থায়ী সমাধান',
      badgeEn: 'Permanent Solution',
      nameBn: 'ইমপ্ল্যান্ট (Dental Implant)',
      nameEn: 'Dental Implant',
      descBn: 'হারিয়ে যাওয়া দাঁতের শেকড়ের জায়গায় টাইটানিয়াম ফিক্সড কৃত্রিম দাঁত প্রতিস্থাপনের সর্বাধুনিক ও স্থায়ী সমাধান।',
      descEn: 'Advanced permanent tooth replacement using titanium fixtures embedded into the jawbone.',
      timeBn: '৪৫-৯০ মিনিট',
      timeEn: '45-90 mins'
    },
    {
      id: 'ser-10',
      badgeBn: 'আঁকাবাঁকা দাঁতের চিকিৎসা',
      badgeEn: 'Teeth Alignment',
      nameBn: 'বাঁকা দাঁতের অর্থোডন্টিক কারেকশন (Orthodontic Correction)',
      nameEn: 'Orthodontic Correction (Braces)',
      descBn: 'ব্রেসেস বা আধুনিক অ্যালাইনারের সাহায্যে আঁকাবাঁকা ও ফাঁকা দাঁত সোজা করে হাসির সৌন্দর্য ও কামড় ঠিক করা।',
      descEn: 'Realignment of crooked or spaced teeth using braces or aligners for ideal occlusion and aesthetics.',
      timeBn: '৩০ মিনিট (প্রতি ভিজিট)',
      timeEn: '30 mins (Per Visit)'
    },
    {
      id: 'ser-11',
      badgeBn: 'কসমেটিক ডেন্টিস্ট্রি',
      badgeEn: 'Cosmetic Dentistry',
      nameBn: 'মিড-ডায়াস্টেমা ক্লোজ (Front Tooth Gap Closing)',
      nameEn: 'Mid-Diastema Closure',
      descBn: 'সামনের দুই দাঁতের মাঝখানের ফাঁকা জায়গা সুন্দরভাবে বন্ধ করার চিকিৎসা।',
      descEn: 'Aesthetic cosmetic procedure to close gaps between front teeth.',
      timeBn: '৩০ মিনিট',
      timeEn: '30 mins'
    },
    {
      id: 'ser-12',
      badgeBn: 'পেইনলেস সার্ভিস',
      badgeEn: 'Painless Care',
      nameBn: 'নরমাল এক্সট্রাকশন (Normal Tooth Extraction)',
      nameEn: 'Normal Tooth Extraction',
      descBn: 'অতিরিক্ত ক্ষতিগ্রস্থ বা নড়বড়ে দাঁত নিরাপদে ও পেইনলেসভাবে অপসারণ করা।',
      descEn: 'Safe and painless removal of severely decayed or loose teeth.',
      timeBn: '১৫ মিনিট',
      timeEn: '15 mins'
    },
    {
      id: 'ser-13',
      badgeBn: 'সার্জারি সেবা',
      badgeEn: 'Oral Surgery',
      nameBn: 'সার্জিক্যাল এক্সট্রাকশন (Wisdom Tooth Surgery)',
      nameEn: 'Surgical Extraction (Wisdom Tooth)',
      descBn: 'আঁকাবাঁকা বা মাড়ির ভেতরে আটকে থাকা আককেল দাঁত বা জটিল দাঁত অপারেশনের মাধ্যমে অপসারণ।',
      descEn: 'Surgical removal of impacted wisdom teeth or complex dental structures.',
      timeBn: '৩০-৬০ মিনিট',
      timeEn: '30-60 mins'
    },
    {
      id: 'ser-14',
      badgeBn: 'শিশুদের সেবা',
      badgeEn: 'Pediatric Care',
      nameBn: 'বাচ্চাদের ফিলিং ও দাঁত তোলা (Pediatric Dentistry)',
      nameEn: 'Pediatric Dental Care',
      descBn: 'ছোটদের দুধ দাঁতের সমস্যা সমাধান এবং শিশুদের উপযোগী কোমল ডেন্টাল কেয়ার।',
      descEn: 'Gentle dental fillings and extractions specially tailored for children.',
      timeBn: '১০-২০ মিনিট',
      timeEn: '10-20 mins'
    },
    {
      id: 'ser-15',
      badgeBn: 'হাইজিন সেবা',
      badgeEn: 'Hygiene Care',
      nameBn: 'স্কেলিং ও পলিশিং (Scaling & Polishing)',
      nameEn: 'Scaling & Polishing',
      descBn: 'দাঁতে জমে থাকা টাটার, প্লাক ও দাগ দূর করে মাড়ি সুস্থ ও মুখগহ্বর সতেজ রাখা।',
      descEn: 'Professional cleaning to remove tartar, plaque, and stains for healthy gums.',
      timeBn: '২০-২৫ মিনিট',
      timeEn: '20-25 mins'
    },
    {
      id: 'ser-16',
      badgeBn: 'আর্টিফিশিয়াল সেট',
      badgeEn: 'Prosthetics',
      nameBn: 'ফ্লেক্সিবল ও হিট কিউর ডেঞ্চার',
      nameEn: 'Flexible & Heat Cure Dentures',
      descBn: 'হারিয়ে যাওয়া দাঁতের পরিবর্তে আরামদায়ক ও নমনীয় কৃত্রিম আর্টিফিশিয়াল দাঁতের সেট বা ডেনচার।',
      descEn: 'Removable artificial teeth appliances designed for comfort and mastication.',
      timeBn: '১৫ মিনিট (প্রতি ভিজিট)',
      timeEn: '15 mins (Per Visit)'
    },
    {
      id: 'ser-17',
      badgeBn: 'নাইট গার্ড',
      badgeEn: 'Teeth Protection',
      nameBn: 'নাইট গার্ড (Night Guard)',
      nameEn: 'Night Guard',
      descBn: 'ঘুমের সময় দাঁত কিড়মিড় করার অভ্যাস (Bruxism) থেকে দাঁতকে সুরক্ষার বিশেষ ট্রের ব্যবস্থা।',
      descEn: 'Custom protective appliance to prevent tooth damage from nighttime teeth grinding.',
      timeBn: '১৫ মিনিট (প্রতি ভিজিট)',
      timeEn: '15 mins (Per Visit)'
    },
    {
      id: 'ser-18',
      badgeBn: 'উজ্জ্বল হাসি',
      badgeEn: 'Smile Brightening',
      nameBn: 'টুথ হোয়াইটেনিং (Tooth Whitening)',
      nameEn: 'Tooth Whitening (Bleaching)',
      descBn: 'আধুনিক ও নিরাপদ প্রযুক্তির সাহায্যে হলুদ বা দাগযুক্ত দাঁত উজ্জ্বল, সাদা ও আকর্ষণীয় করে তোলার কসমেটিক সেবা।',
      descEn: 'Professional whitening treatment to remove stains and brighten your smile safely.',
      timeBn: '৩০-৪৫ মিনিট',
      timeEn: '30-45 mins'
    },
    {
      id: 'ser-19',
      badgeBn: 'ডিজিটাল ইমেজিং',
      badgeEn: 'Digital Imaging',
      nameBn: 'ডিজিটাল ডেন্টাল এক্স-রে (RVG)',
      nameEn: 'Digital Dental X-Ray (RVG)',
      descBn: 'কম রেডিয়েশনের অত্যন্ত নিখুঁত ও আধুনিক রেডিওগ্রাফি প্রযুক্তি, যার মাধ্যমে দাঁতের ভেতরের অবস্থা তাৎক্ষণিকভাবে স্ক্রিনে দেখা যায়।',
      descEn: 'Low-radiation advanced digital RVG imaging for accurate and instant dental diagnosis.',
      timeBn: '৫-১০ মিনিট',
      timeEn: '5-10 mins'
    },
    {
      id: 'ser-20',
      badgeBn: 'অ্যাডভান্সড সার্জারি',
      badgeEn: 'Advanced Surgery',
      nameBn: 'সিস্ট ইনিউক্লিয়েশন (Cyst Enucleation)',
      nameEn: 'Cyst Enucleation',
      descBn: 'মুখগহ্বর বা চোয়ালের ভেতরে তৈরি হওয়া তরলপূর্ণ সিস্ট বা থলি সফলভাবে অপারেশনের মাধ্যমে সম্পূর্ণ অপসারণের চিকিৎসা।',
      descEn: 'Surgical removal of fluid-filled cysts or lesions developing within the jaws or oral cavity.',
      timeBn: '৪৫-৬০ মিনিট',
      timeEn: '45-60 mins'
    },
    {
      id: 'ser-21',
      badgeBn: 'বিশেষায়িত চিকিৎসা',
      badgeEn: 'Specialized Care',
      nameBn: 'দীর্ঘস্থায়ী ঘা ও প্রি-ক্যান্সারাস লেশনের চিকিৎসা',
      nameEn: 'Long-standing Sores & Pre-cancerous Lesions Treatment',
      descBn: 'মুখে দীর্ঘদিনের না ভালো হওয়া ঘা, সাদা বা লাল প্যাচ এবং প্রি-ক্যান্সারাস অবস্থা নির্ণয় ও যথাযথ চিকিৎসা প্রদান।',
      descEn: 'Diagnosis and clinical management of chronic oral ulcers, white/red patches, and pre-cancerous conditions.',
      timeBn: '৩০-৪৫ মিনিট',
      timeEn: '30-45 mins'
    }
  ]

  return (
    <main
      data-lang={lang}
      className="font-body-ui min-h-screen transition-colors duration-300 bg-[#F7F5F0] text-[#2C2A29] overflow-x-clip"
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@600;700;800&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
      />

      {/* টপ নোটিশ ব্যানার */}
      <div className="bg-[#2C2A29] text-[#D8CFC4] py-2.5 px-4 text-center text-xs md:text-sm font-medium tracking-wide border-b border-[#A68A64]/25 flex items-center justify-center gap-2">
        <span className="bg-[#A68A64] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          Notice
        </span>
        <span>
          {lang === 'bn'
            ? 'জরুরি বা রুটিন ডেন্টাল অ্যাপয়েন্টমেন্টের জন্য আজই আমাদের সাথে যোগাযোগ করুন।'
            : 'Contact us today for emergency or routine dental appointments.'}
        </span>
      </div>

      {/* হেডার এবং ন্যাভিগেশন বার */}
      <header className="sticky top-0 z-50 bg-[#FCFBF9]/95 backdrop-blur-md border-b border-[#E6DFD5] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 shrink-0 rounded-full bg-[#2C2A29] text-[#F7F5F0] flex items-center justify-center text-lg border border-[#A68A64]/40">
              🦷
            </div>
            <div className="min-w-0">
              <span className="font-bold text-[#2C2A29] text-base md:text-xl tracking-tight block leading-none truncate">
                {lang === 'bn' ? 'ডাঃ আসির মোসাদ্দেক সাকিব' : 'Dr. Asir Mosaddeque Sakib'}
              </span>
              <span className="text-[10px] font-semibold text-[#A68A64] uppercase tracking-widest block pt-1 truncate">
                {lang === 'bn' ? 'ওরাল এন্ড ডেন্টাল সার্জন' : 'Oral & Dental Surgeon'}
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
            <a href="/introduction-to-dentistry" className="hover:text-[#A68A64] transition-colors duration-300">
              {lang === 'bn' ? 'ডেন্টিস্ট্রি সম্পর্কে' : 'About Dentistry'}
            </a>
            <a href="/services" className="text-[#2C2A29] font-semibold border-b border-[#A68A64] pb-0.5 transition-colors duration-300">
              {lang === 'bn' ? 'সার্ভিস সমূহ' : 'Services'}
            </a>
            <a href="/gallery" className="hover:text-[#A68A64] transition-colors duration-300">
              {lang === 'bn' ? 'গ্যালারি' : 'Gallery'}
            </a>
            <a href="/#contact-section" className="hover:text-[#A68A64] transition-colors duration-300">
              {lang === 'bn' ? 'যোগাযোগ' : 'Contact Us'}
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            <button
              type="button"
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="font-semibold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#E6DFD5] bg-[#F7F5F0] hover:border-[#A68A64] text-[#2C2A29] text-xs md:text-sm transition-colors duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              <span>🌐</span>
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full border border-[#E6DFD5] bg-[#F7F5F0] text-[#2C2A29] flex items-center justify-center text-base sm:text-lg cursor-pointer focus:outline-none"
              aria-label="Mobile Menu Toggle"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* মোবাইল / হ্যামবার্গার ড্রপডাউন মেনু (স্ক্রলের যেকোনো জায়গা থেকে খুলবে) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[73px] sm:top-[81px] z-50 px-4 sm:px-6 py-4 space-y-2 bg-[#FCFBF9] border-b border-[#E6DFD5] shadow-xl transition-all duration-300 max-h-[75vh] overflow-y-auto">
          <a href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-sm border-b border-[#E6DFD5] text-[#2C2A29]">
            {lang === 'bn' ? 'হোম' : 'Home'}
          </a>
          <a href="/#about-section" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-sm border-b border-[#E6DFD5] text-[#5C5852]">
            {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
          </a>
          <a href="/introduction-to-dentistry" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-sm border-b border-[#E6DFD5] text-[#5C5852]">
            {lang === 'bn' ? 'ডেন্টিস্ট্রি সম্পর্কে' : 'About Dentistry'}
          </a>
          <a href="/services" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-sm border-b border-[#E6DFD5] text-[#A68A64]">
            {lang === 'bn' ? 'সার্ভিস সমূহ' : 'Services'}
          </a>
          <a href="/gallery" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-sm border-b border-[#E6DFD5] text-[#5C5852]">
            {lang === 'bn' ? 'গ্যালারি' : 'Gallery'}
          </a>
          <a href="/#contact-section" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-sm text-[#5C5852]">
            {lang === 'bn' ? 'যোগাযোগ' : 'Contact Us'}
          </a>
        </div>
      )}

      {/* হিরো সেকশন */}
      <section className="bg-[#FCFBF9] border-b border-[#E6DFD5] py-12 md:py-16 px-4 md:px-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="inline-block bg-[#F7F5F0] text-[#A68A64] text-xs font-semibold px-4 py-1.5 rounded-full border border-[#E6DFD5] uppercase tracking-widest">
            {lang === 'bn' ? 'আমাদের ডেন্টাল সেবাসমূহ' : 'Clinical Specialties'}
          </span>
          <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-[#2C2A29] tracking-tight pt-1">
            {lang === 'bn' ? 'আধুনিক ও ব্যথামুক্ত ডেন্টাল সেবা' : 'Comprehensive & Painless Dental Care'}
          </h1>
          <p className="text-sm md:text-base text-[#5C5852] max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'ডাঃ আসির মোসাদ্দেক সাকিব ডেন্টাল কেয়ারে আধুনিক প্রযুক্তির সাহায্যে সুনির্দিষ্ট ও নিরাপদ সেবা প্রদান করা হয়।'
              : 'Providing precise, hygienic, and state-of-the-art dental procedures using modern technology.'}
          </p>
        </div>
      </section>

      {/* প্রধান সার্ভিস গ্রিড সেকশন (২১টি সার্ভিস) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {servicesList.map((service) => (
            <div
              key={service.id}
              className="bg-[#FCFBF9] rounded-2xl border border-[#E6DFD5] hover:border-[#A68A64] transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div className="w-full h-52 bg-[#F7F5F0] relative overflow-hidden border-b border-[#E6DFD5]">
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-[#2C2A29]/90 backdrop-blur-xs text-[#F7F5F0] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#A68A64]/40">
                    {lang === 'bn' ? service.badgeBn : service.badgeEn}
                  </span>
                </div>

                <img
                  src={`/services/${service.id}.jpg`}
                  alt={service.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    if (!e.target.dataset.triedJpeg) {
                      e.target.dataset.triedJpeg = "true";
                      e.target.src = `/services/${service.id}.jpeg`;
                    } else {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect fill='%23F7F5F0' width='400' height='250'/%3E%3Ctext fill='%232C2A29' font-family='sans-serif' font-size='14' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImage Missing: " + service.id + "(.jpg/.jpeg)%3E%3C/text%3E%3C/svg%3E";
                    }
                  }}
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-heading text-lg md:text-xl font-bold text-[#2C2A29] leading-snug group-hover:text-[#A68A64] transition-colors duration-300">
                    {lang === 'bn' ? service.nameBn : service.nameEn}
                  </h3>
                  <p className="text-xs md:text-sm text-[#5C5852] leading-relaxed">
                    {lang === 'bn' ? service.descBn : service.descEn}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E6DFD5] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#5C5852] font-medium">
                    <span>⏱️</span>
                    <span>{lang === 'bn' ? service.timeBn : service.timeEn}</span>
                  </div>

                  <a
                    href="/#booking-section"
                    className="bg-[#F7F5F0] hover:bg-[#A68A64] text-[#2C2A29] hover:text-white border border-[#E6DFD5] font-semibold px-3.5 py-1.5 rounded-full transition-colors duration-300 flex items-center gap-1 text-xs"
                  >
                    <span>{lang === 'bn' ? 'বুকিং' : 'Book'}</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* বটম বুকিং বাটন */}
        <div className="mt-14 text-center">
          <a
            href="/#booking-section"
            className="inline-flex items-center gap-3 bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] font-bold text-sm md:text-base px-8 py-3.5 rounded-full transition-colors duration-300 cursor-pointer"
          >
            <span>📅</span>
            <span>{lang === 'bn' ? 'অ্যাপয়েন্টমেন্ট বুক করুন' : 'Book Appointment Now'}</span>
          </a>
        </div>
      </section>

      {/* ফুটার */}
      <footer className="bg-[#2C2A29] text-[#D8CFC4] py-8 border-t border-[#A68A64]/25">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D8CFC4]/75 gap-4">
          <p>© 2026 Dr. Sakib Dental Care. All rights reserved.</p>
          <p className="font-medium text-[#A68A64]">
            developed by own(Dr. Asir Mosaddeque Sakib)
          </p>
        </div>
      </footer>

    </main>
  )
}