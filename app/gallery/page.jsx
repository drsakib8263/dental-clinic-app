'use client'

import { useState } from 'react'

export default function GalleryPage() {
  const [lang, setLang] = useState('bn')
  const [selectedImage, setSelectedImage] = useState(null) // বড় করে দেখানোর জন্য স্টেট

  // ২০টি করে ছবির অ্যারে তৈরি করা
  const chamberImages = Array.from({ length: 20 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0')
    return {
      src: `/gallery/chamber-${num}.jpeg`,
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

      <div className="max-w-6xl mx-auto bg-white/90 dark:bg-[#344246]/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border-2 border-[#5A181C]/40 relative z-10 space-y-12">
        
        {/* হেডার */}
        <div className="border-b border-[#5A181C]/20 pb-6 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#5A181C] dark:text-[#EADCD2] tracking-tight">
            {lang === 'bn' ? 'ফটো গ্যালারি' : 'Photo Gallery'}
          </h1>
          <p className="text-[#8B6B5E] dark:text-[#A89287] font-bold text-lg mt-2">
            {lang === 'bn' ? 'ডাঃ আসির মোসাদ্দেক সাকিব ডেন্টাল কেয়ার' : 'Dr. Asir Mosaddeque Sakib Dental Care'}
          </p>
        </div>

        {/* সেকশন ১: আমাদের চেম্বার */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-[#5A181C]/20 pb-3">
            <span className="text-2xl">🏥</span>
            <h2 className="text-2xl font-extrabold text-[#5A181C] dark:text-teal-300">
              {lang === 'bn' ? 'আমাদের চেম্বার' : 'Our Chamber'}
            </h2>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {lang === 'bn' 
              ? 'আমাদের চেম্বারের আধুনিক পরিবেশ ও চিকিৎসা সরঞ্জামের দৃশ্যসমূহ। (ছবিতে ক্লিক করে বড় করুন)' 
              : 'Views of our modern chamber environment. (Click to enlarge)'}
          </p>

          <div className="flex overflow-x-auto gap-6 pb-4 pt-2 snap-x scrollbar-thin">
            {chamberImages.map((item, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedImage(item)}
                className="min-w-[280px] md:min-w-[340px] bg-white dark:bg-slate-800 rounded-2xl border border-[#5A181C]/20 shadow-md overflow-hidden snap-center flex-shrink-0 flex flex-col cursor-pointer hover:shadow-xl transition"
              >
                <div className="w-full h-48 md:h-56 bg-slate-200 dark:bg-slate-700 relative overflow-hidden flex items-center justify-center">
                  <img 
                    src={item.src} 
                    alt={item.titleEn}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect fill='%23EADCD2' width='300' height='200'/%3E%3Ctext fill='%235A181C' font-family='sans-serif' font-size='14' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3Echamber-" + String(index + 1).padStart(2, '0') + ".jpeg%3C/text%3E%3C/svg%3E";
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
        </div>

        {/* সেকশন ২: রোগীর হাসি ফিরিয়ে আনার প্রচেষ্টা */}
        <div className="space-y-4 pt-6 border-t-2 border-[#5A181C]/20">
          <div className="flex items-center gap-3 border-b border-[#5A181C]/20 pb-3">
            <span className="text-2xl">😁</span>
            <h2 className="text-2xl font-extrabold text-[#5A181C] dark:text-teal-300">
              {lang === 'bn' ? 'রোগীর হাসি ফিরিয়ে আনার প্রচেষ্টা' : 'Patient Smile Restoration'}
            </h2>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {lang === 'bn' 
              ? 'আমাদের সফল চিকিৎসা ও কসমেটিক ডেন্টিস্ট্রির মাধ্যমে রোগীর হাসির রূপান্তরের দৃশ্যসমূহ। (ছবিতে ক্লিক করে বড় করুন)' 
              : 'Showcasing smile transformations. (Click to enlarge)'}
          </p>

          <div className="flex overflow-x-auto gap-6 pb-4 pt-2 snap-x scrollbar-thin">
            {patientImages.map((item, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedImage(item)}
                className="min-w-[280px] md:min-w-[340px] bg-white dark:bg-slate-800 rounded-2xl border border-[#5A181C]/20 shadow-md overflow-hidden snap-center flex-shrink-0 flex flex-col cursor-pointer hover:shadow-xl transition"
              >
                <div className="w-full h-48 md:h-56 bg-slate-200 dark:bg-slate-700 relative overflow-hidden flex items-center justify-center">
                  <img 
                    src={item.src} 
                    alt={item.titleEn}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect fill='%23EADCD2' width='300' height='200'/%3E%3Ctext fill='%235A181C' font-family='sans-serif' font-size='14' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3Epatient-" + String(index + 1).padStart(2, '0') + ".jpeg%3C/text%3E%3C/svg%3E";
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
        </div>

      </div>

      {/* ছবি বড় করে দেখানোর পপ-আপ (Modal) */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-2xl border-2 border-[#5A181C] max-w-3xl w-full relative flex flex-col items-center space-y-4"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-[#5A181C] text-white hover:bg-[#451215] font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition cursor-pointer text-lg"
            >
              ✕
            </button>

            <div className="w-full max-h-[70vh] overflow-hidden rounded-2xl flex items-center justify-center bg-black">
              <img 
                src={selectedImage.src} 
                alt="Enlarged view" 
                className="max-h-[70vh] object-contain w-auto"
              />
            </div>

            <h3 className="text-xl font-extrabold text-[#5A181C] dark:text-white text-center">
              {lang === 'bn' ? selectedImage.titleBn : selectedImage.titleEn}
            </h3>
          </div>
        </div>
      )}
    </main>
  )
}