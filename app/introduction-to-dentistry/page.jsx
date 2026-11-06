'use client'

import { useState } from 'react'

export default function IntroductionToDentistry() {
  const [lang, setLang] = useState('bn')

  const branches = lang === 'bn' ? [
    {
      title: '১. অর্থোডন্টিক্স (Orthodontics)',
      desc: 'আঁকাবাঁকা দাঁত সোজা করা, চোয়ালের গঠনগত ত্রুটি এবং কামড়ের অসঙ্গতি ঠিক করার চিকিৎসা।'
    },
    {
      title: '২. এন্ডোডন্টিক্স (Endodontics)',
      desc: 'দাঁতের মূল বা পাল্প (Pulp) এর ইনফেকশন এবং রুট ক্যানাল ট্রিটমেন্ট (RCT) সংক্রান্ত চিকিৎসা।'
    },
    {
      title: '৩. ওরাল অ্যান্ড ম্যাক্সোফেসিয়াল সার্জারি (Oral & Maxillofacial Surgery)',
      desc: 'মুখ, চোয়াল ও মুখের ভেতরের জটিল সার্জারি, যেমন- আককেল দাঁত অপারেশন ও ফেসিয়াল ট্রমা চিকিৎসা।'
    },
    {
      title: '৪. পিরিওডন্টিক্স (Periodontics)',
      desc: 'মাড়ির রোগ, মাড়ি থেকে রক্ত পড়া এবং দাঁতের চারপাশের টিস্যুর সুস্বাস্থ্য ও সুরক্ষা নিশ্চিতকরণ।'
    },
    {
      title: '৫. প্রোস্থোডন্টিক্স (Prosthodontics)',
      desc: 'হারিয়ে যাওয়া দাঁতের স্থলে কৃত্রিম দাঁত, ডেনচার, ক্রাউন ও ব্রিজ সংযোজনের মাধ্যমে হাসির সৌন্দর্য ও চর্বণ ক্ষমতা ফিরিয়ে আনা।'
    }
  ] : [
    {
      title: '1. Orthodontics',
      desc: 'Correction of crooked teeth, malocclusions, and improper jaw alignment.'
    },
    {
      title: '2. Endodontics',
      desc: 'Treatment of dental pulp infections, root canal therapy, and internal tooth care.'
    },
    {
      title: '3. Oral & Maxillofacial Surgery',
      desc: 'Surgical treatments involving the mouth, jaw, and facial structures, including wisdom teeth removal.'
    },
    {
      title: '4. Periodontics',
      desc: 'Prevention, diagnosis, and treatment of periodontal (gum) diseases.'
    },
    {
      title: '5. Prosthodontics',
      desc: 'Restoration and replacement of missing teeth with dentures, crowns, bridges, and implants.'
    }
  ]

  return (
    <main 
      className="min-h-screen text-slate-900 dark:text-slate-100 relative py-12 px-4 md:px-16 bg-cover bg-center bg-fixed transition-colors duration-200"
      style={{ backgroundImage: `url('/site-bg.jpeg')` }}
    >
      <div className="absolute inset-0 bg-[#EADCD2]/80 dark:bg-[#2B1618]/90 backdrop-blur-md pointer-events-none z-0"></div>

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

      <div className="max-w-4xl mx-auto bg-white/90 dark:bg-[#344246]/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border-2 border-[#5A181C]/40 relative z-10 space-y-8">
        
        <div className="border-b border-[#5A181C]/20 pb-6 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#5A181C] dark:text-[#EADCD2] tracking-tight">
            {lang === 'bn' ? 'ডেন্টিস্ট্রি পরিচিতি' : 'Introduction to Dentistry'}
          </h1>
          <p className="text-[#8B6B5E] dark:text-[#A89287] font-bold text-lg mt-2">
            {lang === 'bn' ? 'মৌলিক ধারণা, বিশেষায়িত শাখা এবং বাংলাদেশে ডেন্টাল প্র্যাকটিসের মানদণ্ড' : 'Core concepts, specialized branches, and standards of dental practice in Bangladesh'}
          </p>
        </div>

        <div className="space-y-6 text-slate-800 dark:text-slate-200 text-base md:text-lg leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-[#5A181C] dark:text-teal-300">
              {lang === 'bn' ? 'ডেন্টিস্ট্রি (Dentistry) কী?' : 'What is Dentistry?'}
            </h2>
            <p>
              {lang === 'bn'
                ? 'ডেন্টিস্ট্রি হলো চিকিৎসা বিজ্ঞানের একটি বিশেষ শাখা যা মুখগহ্বর (Oral cavity), দাঁত, মাড়ি এবং চোয়ালের বিভিন্ন রোগ নির্ণয়, প্রতিরোধ ও চিকিৎসার সাথে যুক্ত। এটি কেবল সুন্দর হাসির সুরক্ষাই করে না, বরং মানুষের সামগ্রিক শারীরিক সুস্থতা ও পুষ্টি নিশ্চিত করতে প্রধান ভূমিকা পালন করে।'
                : 'Dentistry is the branch of medicine focused on the diagnosis, prevention, and treatment of diseases and conditions of the oral cavity, teeth, gums, and jaw structures. It plays a vital role in maintaining overall health and well-being.'
              }
            </p>
          </section>

          <section className="space-y-4 pt-4">
            <h2 className="text-2xl font-bold text-[#5A181C] dark:text-teal-300">
              {lang === 'bn' ? 'ডেন্টিস্ট্রির ৫টি প্রধান শাখা ও তাদের কার্যপরিধি' : '5 Major Branches of Dentistry'}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {branches.map((b, idx) => (
                <div key={idx} className="bg-[#EADCD2]/50 dark:bg-slate-800/80 p-4 rounded-2xl border border-[#5A181C]/20 shadow-sm">
                  <h3 className="font-bold text-lg text-[#5A181C] dark:text-amber-200 mb-1">{b.title}</h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{b.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3 pt-4">
            <h2 className="text-2xl font-bold text-[#5A181C] dark:text-teal-300">
              {lang === 'bn' ? 'বাংলাদেশে দাঁতের ডাক্তারের ডিগ্রি' : 'Dental Degrees in Bangladesh'}
            </h2>
            <p>
              {lang === 'bn'
                ? 'বাংলাদেশে সরকারি বা বেসরকারি মেডিকেল ও ডেন্টাল কলেজ থেকে ৫ বছর মেয়াদী ব্যাচেলর অব ডেন্টাল সার্জারি (BDS) ডিগ্রি অর্জন করতে হয়। এরপর ১ বছরের বাধ্যতামূলক ইন্টার্নশিপ সম্পন্ন করার পর ডেন্টাল সার্জন হিসেবে প্র্যাকটিস করার যোগ্যতা অর্জিত হয়। উচ্চশিক্ষার জন্য এফসিপিএস (FCPS), এমএস (MS) ও বিভিন্ন ফেলোশিপ ডিগ্রি রয়েছে।'
                : 'In Bangladesh, the primary professional degree is Bachelor of Dental Surgery (BDS), which is a 5-year undergraduate program followed by a mandatory 1-year internship. Higher education includes FCPS, MS, and specialized master\'s degrees.'
              }
            </p>
          </section>

          <section className="space-y-3 pt-4">
            <h2 className="text-2xl font-bold text-[#5A181C] dark:text-teal-300">
              {lang === 'bn' ? 'বিএমডিসি (BMDC) রেজিস্ট্রেশন নম্বর কেন প্রয়োজন?' : 'Why is BMDC Registration Number Necessary?'}
            </h2>
            <p>
              {lang === 'bn'
                ? 'বাংলাদেশ মেডিকেল অ্যান্ড ডেন্টাল কাউন্সিল (BMDC) হলো দেশের চিকিৎসকদের একমাত্র লাইসেন্সিং অথরিটি। বিএমডিসি রেজিস্ট্রেশন নম্বর থাকা বাধ্যতামূলক কারণ:'
                : 'Bangladesh Medical and Dental Council (BMDC) is the licensing authority for medical and dental practitioners. A BMDC registration number is necessary because:'
              }
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base">
              <li>
                {lang === 'bn' ? 'এটি চিকিৎসকের যোগ্যতার আইনি স্বীকৃতি প্রদান করে।' : 'It provides legal recognition of the doctor\'s qualification.'}
              </li>
              <li>
                {lang === 'bn' ? 'রোগীদের সঠিক ও নিরাপদ চিকিৎসা সেবা প্রাপ্তি নিশ্চিত করে।' : 'It ensures patient safety and prevents malpractice by quacks.'}
              </li>
              <li>
                {lang === 'bn' ? 'সরকারিভাবে বা স্বাধীনভাবে লিগ্যাল প্রেসক্রিপশন লেখার বৈধতা দেয়।' : 'It grants legal authorization to prescribe medications and treatments.'}
              </li>
            </ul>
          </section>

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