'use client'

import { useState } from 'react'

export default function ServicesPage() {
  const [lang, setLang] = useState('bn')

  const servicesList = [
    {
      id: 'ser-01',
      nameBn: 'নিয়মিত দাঁতের চেকাপ (Regular Dental Checkup)',
      nameEn: 'Regular Dental Checkup',
      descBn: 'দাঁত ও মাড়ির যেকোনো সমস্যা প্রাথমিক অবস্থায় শনাক্ত করতে এবং সুস্থ মুখগহ্বর বজায় রাখতে নিয়মিত রুটিন চেকআপ।',
      descEn: 'Routine dental checkup to detect early signs of dental issues and maintain optimal oral health.',
      timeBn: '১০-১৫ মিনিট',
      timeEn: '10-15 mins'
    },
    {
      id: 'ser-02',
      nameBn: 'পেশেন্ট কাউন্সেলিং (Patient Counseling)',
      nameEn: 'Patient Counseling',
      descBn: 'রোগীর যেকোনো জটিল ডেন্টাল সমস্যা ও ভীতি দূর করতে এবং সঠিক মৌখিক স্বাস্থ্যবিধি বজায় রাখতে বিস্তারিত পরামর্শ প্রদান।',
      descEn: 'Detailed consultation and guidance to alleviate patient anxiety and maintain optimal oral hygiene.',
      timeBn: '১৫-২০ মিনিট',
      timeEn: '15-20 mins'
    },
    {
      id: 'ser-03',
      nameBn: 'রুট ক্যানাল ট্রিটমেন্ট (Root Canal Treatment)',
      nameEn: 'Root Canal Treatment',
      descBn: 'সংক্রমিত বা ক্ষতিগ্রস্থ দাঁতের ভেতরের নার্ভ ও রক্তনালী পরিষ্কার করে দাঁত বাঁচানোর আধুনিক চিকিৎসা।',
      descEn: 'Modern treatment to save a damaged tooth by cleaning infected pulp and nerves inside.',
      timeBn: '১৫-২০ মিনিট',
      timeEn: '15-20 mins'
    },
    {
      id: 'ser-04',
      nameBn: 'জিরকনিয়া ক্রাউন/ক্যাপ (Zirconia Crown)',
      nameEn: 'Zirconia Crown/Cap',
      descBn: 'সর্বাধুনিক প্রযুক্তির অত্যন্ত শক্তিশালী ও দেখতে একদম প্রাকৃতিক দাঁতের মতো প্রিমিয়াম ক্রাউন।',
      descEn: 'State-of-the-art, highly durable, and natural-looking premium ceramic crown.',
      timeBn: '১৫ মিনিট (প্রতি ভিজিট)',
      timeEn: '15 mins (Per Visit)'
    },
    {
      id: 'ser-05',
      nameBn: 'মেটাল-সিরামিক (PFM) ক্রাউন/ক্যাপ',
      nameEn: 'Metal-Ceramic (PFM) Crown/Cap',
      descBn: 'রুট ক্যানাল বা দুর্বল দাঁতের সুরক্ষায় এবং স্থায়িত্ব বাড়াতে টেকসই মেটাল ও সিরামিকের সংমিশ্রণে তৈরি ক্যাপ।',
      descEn: 'Durable metal and ceramic combination cap for protection after root canal or weak teeth.',
      timeBn: '১৫ মিনিট (প্রতি ভিজিট)',
      timeEn: '15 mins (Per Visit)'
    },
    {
      id: 'ser-06',
      nameBn: 'কম্পোজিট ফিলিং (Composite Filling)',
      nameEn: 'Composite Filling',
      descBn: 'দাঁতের ক্যাভিটি বা ক্ষয় রোধে দাঁতের রঙের সাথে মিলিয়ে নিখুঁতভাবে ফিলিং করা।',
      descEn: 'Tooth-colored filling to repair cavities and restore natural appearance.',
      timeBn: '১৫-২০ মিনিট',
      timeEn: '15-20 mins'
    },
    {
      id: 'ser-07',
      nameBn: 'জি.আই ফিলিং (G.I. Filling)',
      nameEn: 'G.I. Filling',
      descBn: 'দাঁতের চিকিৎসায় ব্যবহৃত গ্লাস আয়োনোমার সিমেন্ট ফিলিং, যা দাঁতের সুরক্ষায় অত্যন্ত কার্যকর।',
      descEn: 'Glass Ionomer cement filling used for standard cavity protection.',
      timeBn: '২০ মিনিট',
      timeEn: '20 mins'
    },
    {
      id: 'ser-08',
      nameBn: 'ফাইবার রি-ইনফোর্সড কম্পোজিট ব্রিজ (Fiber-Reinforced Composite Bridge)',
      nameEn: 'Fiber-Reinforced Composite Bridge',
      descBn: 'হারিয়ে যাওয়া দাঁতের দুই পাশের দাঁতের সাহায্যে বিশেষ ফাইবার ও কম্পোজিট রজন ব্যবহার করে এক ভিজিটে ফিক্সড কৃত্রিম দাঁত সংযোজন।',
      descEn: 'Single-visit fixed tooth replacement using high-strength fiber and composite resin supported by adjacent teeth.',
      timeBn: '৩০-৪৫ মিনিট',
      timeEn: '30-45 mins'
    },
    {
      id: 'ser-09',
      nameBn: 'ইমপ্ল্যান্ট (Dental Implant)',
      nameEn: 'Dental Implant',
      descBn: 'হারিয়ে যাওয়া দাঁতের শেকড়ের জায়গায় টাইটানিয়াম ফিক্সড কৃত্রিম দাঁত প্রতিস্থাপনের সর্বাধুনিক ও স্থায়ী সমাধান।',
      descEn: 'Advanced permanent tooth replacement using titanium fixtures embedded into the jawbone.',
      timeBn: '৪৫-৯০ মিনিট',
      timeEn: '45-90 mins'
    },
    {
      id: 'ser-10',
      nameBn: 'বাঁকা দাঁতের অর্থোডন্টিক কারেকশন (Orthodontic Correction)',
      nameEn: 'Orthodontic Correction (Braces)',
      descBn: 'ব্রেসেস বা আধুনিক অ্যালাইনারের সাহায্যে আঁকাবাঁকা ও ফাঁকা দাঁত সোজা করে হাসির সৌন্দর্য ও কামড় ঠিক করা।',
      descEn: 'Realignment of crooked or spaced teeth using braces or aligners for ideal occlusion and aesthetics.',
      timeBn: '৩০ মিনিট (প্রতি ভিজিট)',
      timeEn: '30 mins (Per Visit)'
    },
    {
      id: 'ser-11',
      nameBn: 'মিড-ডায়াস্টেমা ক্লোজ (Front Tooth Gap Closing)',
      nameEn: 'Mid-Diastema Closure',
      descBn: 'সামনের দুই দাঁতের মাঝখানের ফাঁকা জায়গা সুন্দরভাবে বন্ধ করার চিকিৎসা।',
      descEn: 'Aesthetic cosmetic procedure to close gaps between front teeth.',
      timeBn: '৩০ মিনিট',
      timeEn: '30 mins'
    },
    {
      id: 'ser-12',
      nameBn: 'নরমাল এক্সট্রাকশন (Normal Tooth Extraction)',
      nameEn: 'Normal Tooth Extraction',
      descBn: 'অতিরিক্ত ক্ষতিগ্রস্থ বা নড়বড়ে দাঁত নিরাপদে ও পেইনলেসভাবে অপসারণ করা।',
      descEn: 'Safe and painless removal of severely decayed or loose teeth.',
      timeBn: '১৫ মিনিট',
      timeEn: '15 mins'
    },
    {
      id: 'ser-13',
      nameBn: 'সার্জিক্যাল এক্সট্রাকশন (Wisdom Tooth Surgery)',
      nameEn: 'Surgical Extraction (Wisdom Tooth)',
      descBn: 'আঁকাবাঁকা বা মাড়ির ভেতরে আটকে থাকা আককেল দাঁত বা জটিল দাঁত অপারেশনের মাধ্যমে অপসারণ।',
      descEn: 'Surgical removal of impacted wisdom teeth or complex dental structures.',
      timeBn: '৩০-৬০ মিনিট',
      timeEn: '30-60 mins'
    },
    {
      id: 'ser-14',
      nameBn: 'বাচ্চাদের ফিলিং ও দাঁত তোলা (Pediatric Dentistry)',
      nameEn: 'Pediatric Dental Care',
      descBn: 'ছোটদের দুধ দাঁতের সমস্যা সমাধান এবং শিশুদের উপযোগী কোমল ডেন্টাল কেয়ার।',
      descEn: 'Gentle dental fillings and extractions specially tailored for children.',
      timeBn: '১০-২০ মিনিট',
      timeEn: '10-20 mins'
    },
    {
      id: 'ser-15',
      nameBn: 'স্কেলিং ও পলিশিং (Scaling & Polishing)',
      nameEn: 'Scaling & Polishing',
      descBn: 'দাঁতে জমে থাকা টাটার, প্লাক ও দাগ দূর করে মাড়ি সুস্থ ও মুখগহ্বর সতেজ রাখা।',
      descEn: 'Professional cleaning to remove tartar, plaque, and stains for healthy gums.',
      timeBn: '২০-২৫ মিনিট',
      timeEn: '20-25 mins'
    },
    {
      id: 'ser-16',
      nameBn: 'ফ্লেক্সিবল ও হিট কিউর ডেঞ্চার',
      nameEn: 'Flexible & Heat Cure Dentures',
      descBn: 'হারিয়ে যাওয়া দাঁতের পরিবর্তে আরামদায়ক ও নমনীয় কৃত্রিম আর্টিফিশিয়াল দাঁতের সেট বা ডেনচার।',
      descEn: 'Removable artificial teeth appliances designed for comfort and mastication.',
      timeBn: '১৫ মিনিট (প্রতি ভিজিট)',
      timeEn: '15 mins (Per Visit)'
    },
    {
      id: 'ser-17',
      nameBn: 'নাইট গার্ড (Night Guard)',
      nameEn: 'Night Guard',
      descBn: 'ঘুমের সময় দাঁত কিড়মিড় করার অভ্যাস (Bruxism) থেকে দাঁতকে সুরক্ষার বিশেষ ট্রের ব্যবস্থা।',
      descEn: 'Custom protective appliance to prevent tooth damage from nighttime teeth grinding.',
      timeBn: '১৫ মিনিট (প্রতি ভিজিট)',
      timeEn: '15 mins (Per Visit)'
    },
    {
      id: 'ser-18',
      nameBn: 'টুথ হোয়াইটেনিং (Tooth Whitening)',
      nameEn: 'Tooth Whitening (Bleaching)',
      descBn: 'আধুনিক ও নিরাপদ প্রযুক্তির সাহায্যে হলুদ বা দাগযুক্ত দাঁত উজ্জ্বল, সাদা ও আকর্ষণীয় করে তোলার কসমেটিক সেবা।',
      descEn: 'Professional whitening treatment to remove stains and brighten your smile safely.',
      timeBn: '৩০-৪৫ মিনিট',
      timeEn: '30-45 mins'
    },
    {
      id: 'ser-19',
      nameBn: 'ডিজিটাল ডেন্টাল এক্স-রে (RVG)',
      nameEn: 'Digital Dental X-Ray (RVG)',
      descBn: 'কম রেডিয়েশনের অত্যন্ত নিখুঁত ও আধুনিক রেডিওগ্রাফি প্রযুক্তি, যার মাধ্যমে দাঁতের ভেতরের অবস্থা তাৎক্ষণিকভাবে স্ক্রিনে দেখা যায়।',
      descEn: 'Low-radiation advanced digital RVG imaging for accurate and instant dental diagnosis.',
      timeBn: '৫-১০ মিনিট',
      timeEn: '5-10 mins'
    },
    {
      id: 'ser-20',
      nameBn: 'সিস্ট ইনিউক্লিয়েশন (Cyst Enucleation)',
      nameEn: 'Cyst Enucleation',
      descBn: 'মুখগহ্বর বা চোয়ালের ভেতরে তৈরি হওয়া তরলপূর্ণ সিস্ট বা থলি সফলভাবে অপারেশনের মাধ্যমে সম্পূর্ণ অপসারণের চিকিৎসা।',
      descEn: 'Surgical removal of fluid-filled cysts or lesions developing within the jaws or oral cavity.',
      timeBn: '৪৫-৬০ মিনিট',
      timeEn: '45-60 mins'
    },
    {
      id: 'ser-21',
      nameBn: 'দীর্ঘস্থায়ী ঘা ও প্রি-ক্যান্সারাস লেশনের চিকিৎসা',
      nameEn: 'Long-standing Sores & Pre-cancerous Lesions Treatment',
      descBn: 'মুখে দীর্ঘদিনের না ভালো হওয়া ঘা, সাদা বা লাল প্যাচ এবং প্রি-ক্যান্সারাস অবস্থা নির্ণয় ও যথাযথ চিকিৎসা প্রদান।',
      descEn: 'Diagnosis and clinical management of chronic oral ulcers, white/red patches, and pre-cancerous conditions.',
      timeBn: '৩০-৪৫ মিনিট',
      timeEn: '30-45 mins'
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
              className="bg-[#EADCD2]/40 dark:bg-slate-800/80 rounded-2xl border border-[#5A181C]/20 shadow-md overflow-hidden flex flex-col justify-between hover:shadow-lg transition"
            >
              {/* সার্ভিস ছবি সেকশন */}
              <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 relative overflow-hidden flex items-center justify-center">
                <img 
                  src={`/services/${service.id}.jpeg`} 
                  alt={service.nameEn}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect fill='%23EADCD2' width='300' height='200'/%3E%3Ctext fill='%235A181C' font-family='sans-serif' font-size='14' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImage: " + service.id + ".jpeg%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>

              {/* কন্টেন্ট অংশ */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#5A181C] dark:text-amber-200 mb-2">
                    {lang === 'bn' ? service.nameBn : service.nameEn}
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {lang === 'bn' ? service.descBn : service.descEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#5A181C]/10 flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#8B6B5E] dark:text-[#A89287]">
                    {lang === 'bn' ? '⏱️ আনুমানিক সময়:' : '⏱️ Approx Time:'}
                  </span>
                  <span className="text-[#5A181C] dark:text-teal-300 font-bold">
                    {lang === 'bn' ? service.timeBn : service.timeEn}
                  </span>
                </div>
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