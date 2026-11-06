'use client'

import { useState } from 'react'

export default function OurServices() {
  const [lang, setLang] = useState('bn')

  const servicesList = lang === 'bn' ? [
    {
      icon: '🦷',
      title: 'জেনারেল ডেন্টিস্ট্রি (General Dentistry)',
      desc: 'নিয়মিত চেক-আপ, দাঁত পরিষ্কার ও স্কেলিং থেকে শুরু করে আপনার পরিবারের সকলের ব্যক্তিগত ও সাশ্রয়ী ডেন্টাল কেয়ার নিশ্চিত করা হয়।'
    },
    {
      icon: '✨',
      title: 'কসমেটিক ডেন্টিস্ট্রি (Cosmetic Dentistry)',
      desc: 'একটি সুন্দর হাসি আত্মবিশ্বাস বাড়িয়ে দেয়। আমাদের আধুনিক হোয়াইটনিং, ভিনিয়ার্স এবং বন্ডিং সলিউশনের মাধ্যমে আপনার হাসি করুন আরও আকর্ষণীয়।'
    },
    {
      icon: '👑',
      title: 'রিস্টোরেটিভ ডেন্টিস্ট্রি (Restorative Dentistry)',
      desc: 'ক্ষতিগ্রস্ত বা ভাঙা দাঁতের কার্যকারিতা ও সৌন্দর্য ফিরিয়ে আনতে প্রিমিয়াম মানের ডেন্টাল ক্রাউন, ক্যাপ এবং ব্রিজ সেবা।'
    },
    {
      icon: '🛠️',
      title: 'রুট ক্যানাল ট্রিটমেন্ট (Root Canal Treatment)',
      desc: 'সংক্রমিত বা তীব্র ব্যথযুক্ত দাঁত ফেলে না দিয়ে আধুনিক এন্ডোডন্টিক চিকিৎসার মাধ্যমে তা সম্পূর্ণ ইনফেকশন মুক্ত ও সুরক্ষিত রাখা হয়।'
    },
    {
      icon: '💉',
      title: 'ওরাল সার্জারি ও এক্সট্রাকশন (Oral Surgery)',
      desc: 'আক্কেল দাঁতের জটিল সমস্যা বা ক্ষতিগ্রস্ত দাঁত নিরাপদে ও পেইনলেস পদ্ধতিতে অপসারণের জন্য বিশেষজ্ঞ সার্জিক্যাল সেবা।'
    },
    {
      icon: '👶',
      title: 'শিশুদের ডেন্টাল কেয়ার (Dentistry for Kids)',
      desc: 'ছোটদের দাঁতের যত্ন, ক্যাভিটি ফিলিং এবং প্রাকভেন্টিভ চেক-আপের জন্য রয়েছে অত্যন্ত বন্ধুভাবাপন্ন ও আরামদায়ক পরিবেশ।'
    },
    {
      icon: '🦠',
      title: 'মাড়ির রোগ চিকিৎসা (Gum Disease Treatments)',
      desc: 'মাড়ি থেকে রক্ত পড়া বা জিঞ্জিভাইটিস এর সমস্যা দূর করে মাড়ির দীর্ঘস্থায়ী সুস্বাস্থ্য ও শক্ত ভিত বজায় রাখতে সাহায্য করে।'
    },
    {
      icon: '🦷',
      title: 'ইমপ্লান্ট ও কৃত্রিম দাঁত (Implant & Dentures)',
      desc: 'হারিয়ে যাওয়া দাঁতের স্থায়ী ও প্রাকৃতিক বিকল্প হিসেবে আধুনিক ডেন্টাল ইমপ্লান্ট এবং ফ্লেক্সিবল ডেমচার বা কৃত্রিম দাঁতের ব্যবস্থা।'
    }
  ] : [
    {
      icon: '🦷',
      title: 'General Dentistry',
      desc: 'Personalized, cut-rate dental services close to home including routine check-ups, cleanings, and preventive care.'
    },
    {
      icon: '✨',
      title: 'Cosmetic Dentistry',
      desc: 'Enhance your quality of life and boost your confidence with our professional whitening options, veneers, and bonding choices.'
    },
    {
      icon: '👑',
      title: 'Restorative Dentistry',
      desc: 'Regain the functionality and aesthetics of your teeth with high-quality dental crowns, bridges, and customized restorations.'
    },
    {
      icon: '🛠️',
      title: 'Root Canal Treatment',
      desc: 'Endodontic treatments performed regularly to remove infections, alleviate pain, and save your natural teeth.'
    },
    {
      icon: '💉',
      title: 'Oral Surgery',
      desc: 'Professional surgical procedures including wisdom tooth removal and intensive treatments to restore your oral health.'
    },
    {
      icon: '👶',
      title: 'Dentistry for Kids',
      desc: 'Children are always welcome. We provide a comfortable environment for your family’s routine check-ups and cleanings.'
    },
    {
      icon: '🦠',
      title: 'Gum Disease Treatments',
      desc: 'Specialized periodontal treatments to help you keep your teeth for life without invasive or expensive complications.'
    },
    {
      icon: '🦷',
      title: 'Implant Dentistry & Dentures',
      desc: 'State-of-the-art tooth replacement solutions including natural-looking dental implants and partial/complete dentures.'
    }
  ]

  return (
    <main 
      className="min-h-screen text-slate-900 dark:text-slate-100 relative py-12 px-4 md:px-16 bg-cover bg-center bg-fixed transition-colors duration-200"
      style={{ backgroundImage: `url('/site-bg.jpeg')` }}
    >
      {/* ব্যাকগ্রাউন্ড ব্লার ও ওভারলে লেয়ার */}
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

      {/* মূল কন্টেন্ট বক্স */}
      <div className="max-w-6xl mx-auto bg-white/90 dark:bg-[#344246]/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border-2 border-[#5A181C]/40 relative z-10 space-y-10">
        
        {/* হেডার সেকশন */}
        <div className="border-b border-[#5A181C]/20 pb-6 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#5A181C] dark:text-[#EADCD2] tracking-tight">
            {lang === 'bn' ? 'আমাদের ডেন্টাল সেবাসমূহ' : 'Our Dental Services'}
          </h1>
          <p className="text-[#8B6B5E] dark:text-[#A89287] font-bold text-lg mt-2">
            {lang === 'bn' ? 'ডাঃ আসির মোসাদ্দেক সাকিব ডেন্টাল কেয়ার — সকল ডেন্টাল স্পেশালিটি এক ছাদের নিচে' : 'Dr. Asir Mosaddeque Sakib Dental Care — All dental specialties in one location'}
          </p>
        </div>

        {/* সার্ভিস গ্রিড কার্ড */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {servicesList.map((service, index) => (
            <div 
              key={index}
              className="bg-[#EADCD2]/50 dark:bg-slate-800/80 p-6 rounded-2xl border border-[#5A181C]/20 shadow-sm hover:shadow-md transition space-y-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm">{service.icon}</span>
                <h3 className="text-xl font-bold text-[#5A181C] dark:text-teal-300">{service.title}</h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>

        {/* নিচের কল টু অ্যাকশন সেকশন */}
        <div className="pt-6 border-t border-[#5A181C]/20 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">
              {lang === 'bn' ? 'আপনার দাঁতের সুস্থতার জন্য আজই অ্যাপয়েন্টমেন্ট নিন' : 'Ready to experience exceptional dental care?'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {lang === 'bn' ? 'আমরা আধুনিক প্রযুক্তির সাহায্যে আপনাকে সর্বোচ্চ মানের সেবা প্রদানে প্রতিশ্রুতিবদ্ধ।' : 'Schedule your visit with us today for a healthier smile.'}
            </p>
          </div>

          <a 
            href="/#booking-section"
            className="bg-[#5A181C] hover:bg-[#451215] text-[#EADCD2] font-bold px-8 py-3.5 rounded-xl shadow-lg transition text-sm"
          >
            {lang === 'bn' ? '📅 অ্যাপয়েন্টমেন্ট বুক করুন' : '📅 Request Appointment'}
          </a>
        </div>

      </div>
    </main>
  )
}