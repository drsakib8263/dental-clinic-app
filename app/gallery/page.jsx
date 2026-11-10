'use client'

import { useState } from 'react'

export default function GalleryPage() {
  const [lang, setLang] = useState('bn')
  const [selectedImage, setSelectedImage] = useState(null)

  // চেম্বারের ছবির স্লাইড ইনডেক্স
  const [chamberIndex, setChamberIndex] = useState(0)
  // রোগীর হাসির ছবির স্লাইড ইনডেক্স
  const [patientIndex, setPatientIndex] = useState(0)

  // ২০টি করে ছবির অ্যারে তৈরি করা
  const chamberImages = Array.from({ length: 20 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0')
    return {
      src: `/gallery/chamber-${num}.jpeg`,
    }
  })

  const patientImages = Array.from({ length: 20 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0')
    return {
      src: `/gallery/patient-${num}.jpeg`,
    }
  })

  // চেম্বার স্লাইডার কন্ট্রোল
  const prevChamber = () => {
    setChamberIndex((prev) => (prev === 0 ? chamberImages.length - 1 : prev - 1))
  }
  const nextChamber = () => {
    setChamberIndex((prev) => (prev === chamberImages.length - 1 ? 0 : prev + 1))
  }

  // রোগী স্লাইডার কন্ট্রোল
  const prevPatient = () => {
    setPatientIndex((prev) => (prev === 0 ? patientImages.length - 1 : prev - 1))
  }
  const nextPatient = () => {
    setPatientIndex((prev) => (prev === patientImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 md:px-16 transition-colors duration-200">
      
      {/* টপ ন্যাভিগেশন ও ল্যাঙ্গুয়েজ টগল */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8 relative z-50">
        <a 
          href="/"
          className="bg-[#00a8e8] hover:bg-[#008fca] text-white font-bold px-5 py-2.5 rounded-full shadow-lg transition"
        >
          {lang === 'bn' ? '← হোম পেজে ফিরে যান' : '← Back to Home'}
        </a>

        <button
          type="button"
          onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
          className="bg-[#00a8e8] hover:bg-[#008fca] text-white font-extrabold px-5 py-2.5 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2 text-sm cursor-pointer select-none"
        >
          <span>🌐</span>
          <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 relative z-10 space-y-16">
        
        {/* হেডার */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0E3A5D] dark:text-white tracking-tight">
            {lang === 'bn' ? 'ফটো গ্যালারি' : 'Photo Gallery'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-bold text-lg mt-2">
            {lang === 'bn' ? 'ডাঃ আসির মোসাদ্দেক সাকিব ডেন্টাল কেয়ার' : 'Dr. Asir Mosaddeque Sakib Dental Care'}
          </p>
        </div>

        {/* সেকশন ১: আমাদের চেম্বার */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-2xl font-extrabold text-[#0E3A5D] dark:text-teal-300">
              {lang === 'bn' ? 'আমাদের চেম্বার' : 'Our Chamber'}
            </h2>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 text-center">
            {lang === 'bn' 
              ? 'আমাদের চেম্বারের আধুনিক পরিবেশ ও চিকিৎসা সরঞ্জামের দৃশ্যসমূহ। (ছবিতে ক্লিক করে বড় করুন)' 
              : 'Views of our modern chamber environment. (Click to enlarge)'}
          </p>

          <div className="relative flex items-center justify-center overflow-hidden py-4">
            <button 
              onClick={prevChamber}
              className="absolute left-1 md:left-4 z-30 w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#00a8e8] hover:bg-[#008fca] text-white flex items-center justify-center text-lg md:text-xl shadow-lg transition cursor-pointer"
            >
              ❮
            </button>

            <div className="flex items-center justify-center gap-2 md:gap-6 w-full max-w-5xl px-8 md:px-0">
              {/* বাম পাশের ঝাপসা ছবি (Peek View) */}
              <div 
                onClick={() => setChamberIndex((chamberIndex - 1 + chamberImages.length) % chamberImages.length)}
                className="flex relative w-[25%] md:w-1/4 h-40 md:h-56 rounded-2xl overflow-hidden shadow-md cursor-pointer opacity-40 blur-[2px] md:blur-[3px] scale-90 transition-all duration-500 hover:opacity-70 flex-shrink-0"
              >
                <img 
                  src={chamberImages[(chamberIndex - 1 + chamberImages.length) % chamberImages.length].src} 
                  alt="Previous" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* মাঝখানের প্রধান স্পষ্ট ছবি */}
              <div 
                onClick={() => setSelectedImage(chamberImages[chamberIndex])}
                className="relative w-[70%] md:w-2/4 h-64 md:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#00a8e8]/40 bg-black cursor-pointer group z-20 flex-shrink-0"
              >
                <img 
                  src={chamberImages[chamberIndex].src} 
                  alt="Chamber Active"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* ডান পাশের ঝাপসা ছবি (Peek View) */}
              <div 
                onClick={() => setChamberIndex((chamberIndex + 1) % chamberImages.length)}
                className="flex relative w-[25%] md:w-1/4 h-40 md:h-56 rounded-2xl overflow-hidden shadow-md cursor-pointer opacity-40 blur-[2px] md:blur-[3px] scale-90 transition-all duration-500 hover:opacity-70 flex-shrink-0"
              >
                <img 
                  src={chamberImages[(chamberIndex + 1) % chamberImages.length].src} 
                  alt="Next" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <button 
              onClick={nextChamber}
              className="absolute right-1 md:right-4 z-30 w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#00a8e8] hover:bg-[#008fca] text-white flex items-center justify-center text-lg md:text-xl shadow-lg transition cursor-pointer"
            >
              ❯
            </button>
          </div>
        </div>

        {/* সেকশন ২: রোগীর হাসি ফিরিয়ে আনার প্রচেষ্টা */}
        <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-2xl font-extrabold text-[#0E3A5D] dark:text-teal-300">
              {lang === 'bn' ? 'রোগীর হাসি ফিরিয়ে আনার প্রচেষ্টা' : 'Patient Smile Restoration'}
            </h2>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 text-center">
            {lang === 'bn' 
              ? 'আমাদের সফল চিকিৎসা ও কসমেটিক ডেন্টিস্ট্রির মাধ্যমে রোগীর হাসির রূপান্তরের দৃশ্যসমূহ। (ছবিতে ক্লিক করে বড় করুন)' 
              : 'Showcasing smile transformations. (Click to enlarge)'}
          </p>

          <div className="relative flex items-center justify-center overflow-hidden py-4">
            <button 
              onClick={prevPatient}
              className="absolute left-1 md:left-4 z-30 w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#00a8e8] hover:bg-[#008fca] text-white flex items-center justify-center text-lg md:text-xl shadow-lg transition cursor-pointer"
            >
              ❮
            </button>

            <div className="flex items-center justify-center gap-2 md:gap-6 w-full max-w-5xl px-8 md:px-0">
              {/* বাম পাশের ঝাপসা ছবি (Peek View) */}
              <div 
                onClick={() => setPatientIndex((patientIndex - 1 + patientImages.length) % patientImages.length)}
                className="flex relative w-[25%] md:w-1/4 h-40 md:h-56 rounded-2xl overflow-hidden shadow-md cursor-pointer opacity-40 blur-[2px] md:blur-[3px] scale-90 transition-all duration-500 hover:opacity-70 flex-shrink-0"
              >
                <img 
                  src={patientImages[(patientIndex - 1 + patientImages.length) % patientImages.length].src} 
                  alt="Previous" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* মাঝখানের প্রধান স্পষ্ট ছবি */}
              <div 
                onClick={() => setSelectedImage(patientImages[patientIndex])}
                className="relative w-[70%] md:w-2/4 h-64 md:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#00a8e8]/40 bg-black cursor-pointer group z-20 flex-shrink-0"
              >
                <img 
                  src={patientImages[patientIndex].src} 
                  alt="Patient Active"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* ডান পাশের ঝাপসা ছবি (Peek View) */}
              <div 
                onClick={() => setPatientIndex((patientIndex + 1) % patientImages.length)}
                className="flex relative w-[25%] md:w-1/4 h-40 md:h-56 rounded-2xl overflow-hidden shadow-md cursor-pointer opacity-40 blur-[2px] md:blur-[3px] scale-90 transition-all duration-500 hover:opacity-70 flex-shrink-0"
              >
                <img 
                  src={patientImages[(patientIndex + 1) % patientImages.length].src} 
                  alt="Next" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <button 
              onClick={nextPatient}
              className="absolute right-1 md:right-4 z-30 w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#00a8e8] hover:bg-[#008fca] text-white flex items-center justify-center text-lg md:text-xl shadow-lg transition cursor-pointer"
            >
              ❯
            </button>
          </div>
        </div>

      </div>

      {/* ছবি বড় করে দেখানোর পপ-আপ (Modal) */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-2xl border-2 border-[#00a8e8] max-w-3xl w-full relative flex flex-col items-center space-y-4"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-[#00a8e8] text-white hover:bg-[#008fca] font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition cursor-pointer text-lg"
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
          </div>
        </div>
      )}
    </main>
  )
}