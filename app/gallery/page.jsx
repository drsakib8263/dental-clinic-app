'use client'

import { useState, useEffect } from 'react'

export default function GalleryPage() {
  const [lang, setLang] = useState('bn')
  const [darkMode, setDarkMode] = useState(false)
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

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="bg-[#5A181C] hover:bg-[#451215] text-[#EADCD2] font-extrabold p-2.5 rounded-full shadow-lg transition-all duration-200 cursor-pointer"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          <button
            type="button"
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="bg-[#5A181C] hover:bg-[#451215] text-[#EADCD2] font-extrabold px-5 py-2.5 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2 text-sm cursor-pointer select-none"
          >
            <span>🌐</span>
            <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white/90 dark:bg-[#344246]/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border-2 border-[#5A181C]/40 relative z-10 space-y-16">
        
        {/* হেডার */}
        <div className="border-b border-[#5A181C]/20 pb-6 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#5A181C] dark:text-[#EADCD2] tracking-tight">
            {lang === 'bn' ? 'ফটো গ্যালারি' : 'Photo Gallery'}
          </h1>
          <p className="text-[#8B6B5E] dark:text-[#A89287] font-bold text-lg mt-2">
            {lang === 'bn' ? 'ডাঃ আসির মোসাদ্দেক সাকিব ডেন্টাল কেয়ার' : 'Dr. Asir Mosaddeque Sakib Dental Care'}
          </p>
        </div>

        {/* সেকশন ১: আমাদের চেম্বার (ঝাপসা দুই পাশ সহ স্লাইডার) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#5A181C]/20 pb-3">
            <span className="text-2xl">🏥</span>
            <h2 className="text-2xl font-extrabold text-[#5A181C] dark:text-teal-300">
              {lang === 'bn' ? 'আমাদের চেম্বার' : 'Our Chamber'}
            </h2>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 text-center">
            {lang === 'bn' 
              ? 'আমাদের চেম্বারের আধুনিক পরিবেশ ও চিকিৎসা সরঞ্জামের দৃশ্যসমূহ। (ছবিতে ক্লিক করে বড় করুন)' 
              : 'Views of our modern chamber environment. (Click to enlarge)'}
          </p>

          {/* ক্যারোসেল কন্টেইনার */}
          <div className="relative flex items-center justify-center overflow-hidden py-4">
            <button 
              onClick={prevChamber}
              className="absolute left-2 md:left-4 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#5A181C] hover:bg-[#451215] text-[#EADCD2] flex items-center justify-center text-xl shadow-lg transition cursor-pointer"
            >
              ❮
            </button>

            <div className="flex items-center justify-center gap-3 md:gap-6 w-full max-w-5xl">
              {/* বাম পাশের ঝাপসা ছবি */}
              <div 
                onClick={() => setChamberIndex((chamberIndex - 1 + chamberImages.length) % chamberImages.length)}
                className="hidden md:flex relative w-1/4 h-56 rounded-2xl overflow-hidden shadow-md cursor-pointer opacity-40 blur-[3px] scale-90 transition-all duration-500 hover:opacity-70"
              >
                <img 
                  src={chamberImages[(chamberIndex - 1 + chamberImages.length) % chamberImages.length].src} 
                  alt="Previous" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* মাঝখানের প্রধান ছবি */}
              <div 
                onClick={() => setSelectedImage(chamberImages[chamberIndex])}
                className="relative w-full md:w-2/4 h-72 md:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#5A181C]/40 bg-black cursor-pointer group z-20"
              >
                <img 
                  src={chamberImages[chamberIndex].src} 
                  alt={chamberImages[chamberIndex].titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4 right-4 text-center text-white">
                  <span className="font-extrabold text-base md:text-lg drop-shadow-md">
                    {lang === 'bn' ? chamberImages[chamberIndex].titleBn : chamberImages[chamberIndex].titleEn}
                  </span>
                  <span className="block text-xs text-cyan-300 font-semibold mt-1">
                    {chamberIndex + 1} / {chamberImages.length}
                  </span>
                </div>
              </div>

              {/* ডান পাশের ঝাপসা ছবি */}
              <div 
                onClick={() => setChamberIndex((chamberIndex + 1) % chamberImages.length)}
                className="hidden md:flex relative w-1/4 h-56 rounded-2xl overflow-hidden shadow-md cursor-pointer opacity-40 blur-[3px] scale-90 transition-all duration-500 hover:opacity-70"
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
              className="absolute right-2 md:right-4 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#5A181C] hover:bg-[#451215] text-[#EADCD2] flex items-center justify-center text-xl shadow-lg transition cursor-pointer"
            >
              ❯
            </button>
          </div>
        </div>

        {/* সেকশন ২: রোগীর হাসি ফিরিয়ে আনার প্রচেষ্টা (ঝাপসা দুই পাশ সহ স্লাইডার) */}
        <div className="space-y-6 pt-8 border-t-2 border-[#5A181C]/20">
          <div className="flex items-center gap-3 border-b border-[#5A181C]/20 pb-3">
            <span className="text-2xl">😁</span>
            <h2 className="text-2xl font-extrabold text-[#5A181C] dark:text-teal-300">
              {lang === 'bn' ? 'রোগীর হাসি ফিরিয়ে আনার প্রচেষ্টা' : 'Patient Smile Restoration'}
            </h2>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 text-center">
            {lang === 'bn' 
              ? 'আমাদের সফল চিকিৎসা ও কসমেটিক ডেন্টিস্ট্রির মাধ্যমে রোগীর হাসির রূপান্তরের দৃশ্যসমূহ। (ছবিতে ক্লিক করে বড় করুন)' 
              : 'Showcasing smile transformations. (Click to enlarge)'}
          </p>

          {/* ক্যারোসেল কন্টেইনার */}
          <div className="relative flex items-center justify-center overflow-hidden py-4">
            <button 
              onClick={prevPatient}
              className="absolute left-2 md:left-4 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#5A181C] hover:bg-[#451215] text-[#EADCD2] flex items-center justify-center text-xl shadow-lg transition cursor-pointer"
            >
              ❮
            </button>

            <div className="flex items-center justify-center gap-3 md:gap-6 w-full max-w-5xl">
              {/* বাম পাশের ঝাপসা ছবি */}
              <div 
                onClick={() => setPatientIndex((patientIndex - 1 + patientImages.length) % patientImages.length)}
                className="hidden md:flex relative w-1/4 h-56 rounded-2xl overflow-hidden shadow-md cursor-pointer opacity-40 blur-[3px] scale-90 transition-all duration-500 hover:opacity-70"
              >
                <img 
                  src={patientImages[(patientIndex - 1 + patientImages.length) % patientImages.length].src} 
                  alt="Previous" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* মাঝখানের প্রধান ছবি */}
              <div 
                onClick={() => setSelectedImage(patientImages[patientIndex])}
                className="relative w-full md:w-2/4 h-72 md:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#5A181C]/40 bg-black cursor-pointer group z-20"
              >
                <img 
                  src={patientImages[patientIndex].src} 
                  alt={patientImages[patientIndex].titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4 right-4 text-center text-white">
                  <span className="font-extrabold text-base md:text-lg drop-shadow-md">
                    {lang === 'bn' ? patientImages[patientIndex].titleBn : patientImages[patientIndex].titleEn}
                  </span>
                  <span className="block text-xs text-cyan-300 font-semibold mt-1">
                    {patientIndex + 1} / {patientImages.length}
                  </span>
                </div>
              </div>

              {/* ডান পাশের ঝাপসা ছবি */}
              <div 
                onClick={() => setPatientIndex((patientIndex + 1) % patientImages.length)}
                className="hidden md:flex relative w-1/4 h-56 rounded-2xl overflow-hidden shadow-md cursor-pointer opacity-40 blur-[3px] scale-90 transition-all duration-500 hover:opacity-70"
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
              className="absolute right-2 md:right-4 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#5A181C] hover:bg-[#451215] text-[#EADCD2] flex items-center justify-center text-xl shadow-lg transition cursor-pointer"
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