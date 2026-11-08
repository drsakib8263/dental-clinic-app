'use client'

import { useState } from 'react'

export default function ServicesPage() {
  const [lang, setLang] = useState('bn')

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
    <main className="min-h-screen bg-[#F4F9F9] dark:bg-[#081C24] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* ১. টপ নোটিশ ব্যানার */}
      <div className="bg-[#0E3A5D] text-white py-2.5 px-4 text-center text-xs md:text-sm font-medium tracking-wide shadow-md flex items-center justify-center gap-2">
        <span className="bg-[#00A896] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Notice</span>
        <span>
          {lang === 'bn' 
            ? 'জরুরি বা রুটিন ডেন্টাল অ্যাপয়েন্টমেন্টের জন্য আজই আমাদের সাথে যোগাযোগ করুন।' 
            : 'Contact us today for emergency or routine dental appointments.'}
        </span>
      </div>

      {/* ২. হেডার এবং ন্যাভিগেশন বার */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#081C24]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0E3A5D] flex items-center justify-center text-white text-xl font-black shadow-md">
              🦷
            </div>
            <div>
              <span className="font-extrabold text-[#0E3A5D] dark:text-[#00A896] text-lg md:text-xl tracking-tight block leading-none">
                Dr. Sakib
              </span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block pt-0.5">
                Dental Care
              </span>
            </div>
          </a>

          <div className="flex items-center gap-3 md:gap-4">
            <a 
              href="/"
              className="text-xs md:text-sm font-bold text-[#0E3A5D] dark:text-slate-200 hover:text-[#00A896] dark:hover:text-[#00A896] transition hidden sm:block"
            >
              {lang === 'bn' ? '← হোম পেজ' : '← Home'}
            </a>

            <button
              type="button"
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="bg-[#0E3A5D] hover:bg-[#0B2545] text-white font-extrabold px-4 py-2 rounded-xl text-xs md:text-sm shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>🌐</span>
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ৩. পেজের হেডার / হিরো সেকশন */}
      <section className="bg-gradient-to-b from-[#0E3A5D]/10 to-transparent dark:from-[#0E3A5D]/30 py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="inline-block bg-[#00A896]/10 text-[#00A896] text-xs font-bold px-3 py-1 rounded-full border border-[#00A896]/30 uppercase tracking-wider">
            {lang === 'bn' ? 'আমাদের ডেন্টাল সেবাসমূহ' : 'Clinical Specialties'}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-[#0E3A5D] dark:text-white tracking-tight">
            {lang === 'bn' ? 'আধুনিক ও ব্যথামুক্ত ডেন্টাল সেবা' : 'Comprehensive & Painless Dental Care'}
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn' 
              ? 'ডাঃ আসির মোসাদ্দেক সাকিব ডেন্টাল কেয়ারে আধুনিক প্রযুক্তির সাহায্যে সুনির্দিষ্ট ও নিরাপদ সেবা প্রদান করা হয়।' 
              : 'Providing precise, hygienic, and state-of-the-art dental procedures using modern technology.'}
          </p>
        </div>
      </section>

      {/* ৪. প্রধান সার্ভিস গ্রিড সেকশন */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {servicesList.map((service) => (
            <div 
              key={service.id} 
              className="bg-white dark:bg-[#102A36] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* ছবির অংশ - .jpg অথবা .jpeg যেকোনো ফরম্যাট সাপোর্ট করবে */}
              <div className="w-full h-52 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-[#0E3A5D]/90 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md border border-white/20">
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
                      e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect fill='%23F4F9F9' width='400' height='250'/%3E%3Ctext fill='%230E3A5D' font-family='sans-serif' font-size='14' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImage Missing: " + service.id + "(.jpg/.jpeg)%3C/text%3E%3C/svg%3E";
                    }
                  }}
                />
              </div>

              {/* কন্টেন্ট অংশ */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-[#0E3A5D] dark:text-teal-300 leading-snug group-hover:text-[#00A896] transition">
                    {lang === 'bn' ? service.nameBn : service.nameEn}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {lang === 'bn' ? service.descBn : service.descEn}
                  </p>
                </div>

                {/* সময় ও বুকিং তথ্য */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                    <span>⏱️</span>
                    <span>{lang === 'bn' ? service.timeBn : service.timeEn}</span>
                  </div>

                  <a 
                    href="/#booking-section"
                    className="bg-[#00A896]/10 hover:bg-[#00A896] text-[#00A896] hover:text-white font-extrabold px-3.5 py-1.5 rounded-xl transition duration-200 flex items-center gap-1 text-xs"
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
            className="inline-flex items-center gap-3 bg-[#00A896] hover:bg-[#02C39A] text-white font-extrabold text-base md:text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-teal-500/30 transition-all hover:scale-105 cursor-pointer"
          >
            <span>📅</span>
            <span>{lang === 'bn' ? 'অ্যাপয়েন্টমেন্ট বুক করুন' : 'Book Appointment Now'}</span>
          </a>
        </div>
      </section>

    </main>
  )
}