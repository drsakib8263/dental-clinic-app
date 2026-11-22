'use client'

import { useState, useEffect } from 'react'

export default function GalleryPage() {
  const [lang, setLang] = useState('bn')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedModalIndex, setSelectedModalIndex] = useState(null)
  const [activeGalleryType, setActiveGalleryType] = useState('chamber')

  
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

  const [chamberIndex, setChamberIndex] = useState(0)
  const [patientIndex, setPatientIndex] = useState(0)

  const prevChamber = () => {
    setChamberIndex((prev) => (prev === 0 ? chamberImages.length - 1 : prev - 1))
  }
  const nextChamber = () => {
    setChamberIndex((prev) => (prev === chamberImages.length - 1 ? 0 : prev + 1))
  }

  const prevPatient = () => {
    setPatientIndex((prev) => (prev === 0 ? patientImages.length - 1 : prev - 1))
  }
  const nextPatient = () => {
    setPatientIndex((prev) => (prev === patientImages.length - 1 ? 0 : prev + 1))
  }

  const openModal = (type, index) => {
    setActiveGalleryType(type)
    setSelectedModalIndex(index)
  }

  const currentImagesList = activeGalleryType === 'chamber' ? chamberImages : patientImages

  const prevModalSlide = () => {
    setSelectedModalIndex((prev) => (prev === 0 ? currentImagesList.length - 1 : prev - 1))
  }

  const nextModalSlide = () => {
    setSelectedModalIndex((prev) => (prev === currentImagesList.length - 1 ? 0 : prev + 1))
  }

  return (
    <main
      data-lang={lang}
      className="font-body-ui min-h-screen bg-[#F7F5F0] text-[#2C2A29] py-10 px-4 md:px-12 transition-colors duration-300 overflow-x-clip"
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@600;700;800&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
      />

      {/* টপ ন্যাভিগেশন, ডার্ক মোড, ল্যাঙ্গুয়েজ টগল ও হ্যামবার্গার বাটন */}
      <div className="max-w-6xl mx-auto flex justify-between items-center gap-2 mb-8 relative z-50">
        <a
          href="/"
          className="bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] font-semibold px-4 sm:px-5 py-2.5 rounded-full transition-colors duration-300 text-xs sm:text-sm"
        >
          {lang === 'bn' ? '← হোম পেজে ফিরে যান' : '← Back to Home'}
        </a>

        <div className="flex items-center gap-2">
          
          <button
            type="button"
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="bg-[#FCFBF9] hover:border-[#A68A64] text-[#2C2A29] border border-[#E6DFD5] font-semibold px-4 sm:px-5 py-2.5 rounded-full transition-colors duration-300 flex items-center gap-2 text-xs sm:text-sm cursor-pointer select-none"
          >
            <span>🌐</span>
            <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 shrink-0 rounded-full border border-[#E6DFD5] bg-[#FCFBF9] hover:border-[#A68A64] text-[#2C2A29] flex items-center justify-center text-lg cursor-pointer transition-colors duration-300 focus:outline-none"
            aria-label="Toggle Hamburger Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* হ্যামবার্গার ড্রপডাউন মেনু (স্ক্রলের যেকোনো পজিশন থেকে খুলবে) */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-[88px] z-50 max-w-6xl mx-auto p-4 rounded-2xl border border-[#E6DFD5] bg-[#FCFBF9] shadow-xl space-y-2 font-semibold text-sm text-[#2C2A29] max-h-[75vh] overflow-y-auto">
          <a href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-xl border-b border-[#E6DFD5]">
            {lang === 'bn' ? 'হোম' : 'Home'}
          </a>
          <a href="/#about-section" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-xl border-b border-[#E6DFD5] text-[#5C5852]">
            {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
          </a>
          <a href="/introduction-to-dentistry" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-xl border-b border-[#E6DFD5] text-[#5C5852]">
            {lang === 'bn' ? 'ডেন্টিস্ট্রি সম্পর্কে' : 'About Dentistry'}
          </a>
          <a href="/services" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-xl border-b border-[#E6DFD5] text-[#5C5852]">
            {lang === 'bn' ? 'সার্ভিস সমূহ' : 'Services'}
          </a>
          <a href="/gallery" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-xl border-b border-[#E6DFD5] text-[#A68A64]">
            {lang === 'bn' ? 'গ্যালারি' : 'Gallery'}
          </a>
          <a href="/#contact-section" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-xl text-[#5C5852]">
            {lang === 'bn' ? 'যোগাযোগ' : 'Contact Us'}
          </a>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-[#FCFBF9] p-6 sm:p-8 md:p-12 rounded-2xl border border-[#E6DFD5] relative z-10 space-y-16 transition-colors duration-300">

        {/* হেডার */}
        <div className="border-b border-[#E6DFD5] pb-6 text-center space-y-2">
          <span className="inline-block bg-[#F7F5F0] text-[#A68A64] text-xs font-semibold px-4 py-1.5 rounded-full border border-[#E6DFD5] uppercase tracking-widest">
            {lang === 'bn' ? 'ডেন্টাল গ্যালারি' : 'Visual Showcase'}
          </span>
          <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-[#2C2A29] tracking-tight pt-1">
            {lang === 'bn' ? 'ফটো গ্যালারি' : 'Photo Gallery'}
          </h1>
          <p className="text-[#5C5852] font-semibold text-base md:text-lg">
            {lang === 'bn' ? 'ডাঃ আসির মোসাদ্দেক সাকিব ডেন্টাল কেয়ার' : 'Dr. Asir Mosaddeque Sakib Dental Care'}
          </p>
        </div>

        {/* সেকশন ১: আমাদের চেম্বার */}
        <div className="space-y-6">
          <div className="border-b border-[#E6DFD5] pb-3">
            <h2 className="font-heading text-2xl font-bold text-[#2C2A29]">
              {lang === 'bn' ? 'আমাদের চেম্বার' : 'Our Chamber'}
            </h2>
          </div>
          <p className="text-sm text-[#5C5852] text-center">
            {lang === 'bn'
              ? 'আমাদের চেম্বারের আধুনিক পরিবেশ ও চিকিৎসা সরঞ্জামের দৃশ্যসমূহ। (ছবিতে ক্লিক করে বড় করুন)'
              : 'Views of our modern chamber environment. (Click to enlarge)'}
          </p>

          <div className="relative flex items-center justify-center overflow-hidden py-4">
            <button
              onClick={prevChamber}
              aria-label="Previous Chamber Image"
              className="absolute left-1 md:left-4 z-30 w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] flex items-center justify-center text-lg md:text-xl transition-colors duration-300 cursor-pointer"
            >
              ❮
            </button>

            <div className="flex items-center justify-center gap-2 md:gap-6 w-full max-w-5xl px-8 md:px-0">
              {/* বাম পাশের ঝাপসা ছবি (Peek View) */}
              <div
                onClick={() => setChamberIndex((chamberIndex - 1 + chamberImages.length) % chamberImages.length)}
                className="flex relative w-[25%] md:w-1/4 h-40 md:h-56 rounded-2xl overflow-hidden border border-[#E6DFD5] cursor-pointer opacity-40 blur-[2px] md:blur-[3px] scale-90 transition-all duration-500 hover:opacity-70 flex-shrink-0"
              >
                <img
                  src={chamberImages[(chamberIndex - 1 + chamberImages.length) % chamberImages.length].src}
                  alt="Previous"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* মাঝখানের প্রধান স্পষ্ট ছবি */}
              <div
                onClick={() => openModal('chamber', chamberIndex)}
                className="relative w-[70%] md:w-2/4 h-64 md:h-96 rounded-2xl overflow-hidden border-2 border-[#A68A64] bg-[#121110] cursor-pointer group z-20 flex-shrink-0"
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
                className="flex relative w-[25%] md:w-1/4 h-40 md:h-56 rounded-2xl overflow-hidden border border-[#E6DFD5] cursor-pointer opacity-40 blur-[2px] md:blur-[3px] scale-90 transition-all duration-500 hover:opacity-70 flex-shrink-0"
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
              aria-label="Next Chamber Image"
              className="absolute right-1 md:right-4 z-30 w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] flex items-center justify-center text-lg md:text-xl transition-colors duration-300 cursor-pointer"
            >
              ❯
            </button>
          </div>
        </div>

        {/* সেকশন ২: রোগীর হাসি ফিরিয়ে আনার প্রচেষ্টা */}
        <div className="space-y-6 pt-8 border-t border-[#E6DFD5]">
          <div className="border-b border-[#E6DFD5] pb-3">
            <h2 className="font-heading text-2xl font-bold text-[#2C2A29]">
              {lang === 'bn' ? 'রোগীর হাসি ফিরিয়ে আনার প্রচেষ্টা' : 'Patient Smile Restoration'}
            </h2>
          </div>
          <p className="text-sm text-[#5C5852] text-center">
            {lang === 'bn'
              ? 'আমাদের সফল চিকিৎসা ও কসমেটিক ডেন্টিস্ট্রির মাধ্যমে রোগীর হাসির রূপান্তরের দৃশ্যসমূহ। (ছবিতে ক্লিক করে বড় করুন)'
              : 'Showcasing smile transformations. (Click to enlarge)'}
          </p>

          <div className="relative flex items-center justify-center overflow-hidden py-4">
            <button
              onClick={prevPatient}
              aria-label="Previous Patient Image"
              className="absolute left-1 md:left-4 z-30 w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] flex items-center justify-center text-lg md:text-xl transition-colors duration-300 cursor-pointer"
            >
              ❮
            </button>

            <div className="flex items-center justify-center gap-2 md:gap-6 w-full max-w-5xl px-8 md:px-0">
              {/* বাম পাশের ঝাপসা ছবি (Peek View) */}
              <div
                onClick={() => setPatientIndex((patientIndex - 1 + patientImages.length) % patientImages.length)}
                className="flex relative w-[25%] md:w-1/4 h-40 md:h-56 rounded-2xl overflow-hidden border border-[#E6DFD5] cursor-pointer opacity-40 blur-[2px] md:blur-[3px] scale-90 transition-all duration-500 hover:opacity-70 flex-shrink-0"
              >
                <img
                  src={patientImages[(patientIndex - 1 + patientImages.length) % patientImages.length].src}
                  alt="Previous"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* মাঝখানের প্রধান স্পষ্ট ছবি */}
              <div
                onClick={() => openModal('patient', patientIndex)}
                className="relative w-[70%] md:w-2/4 h-64 md:h-96 rounded-2xl overflow-hidden border-2 border-[#A68A64] bg-[#121110] cursor-pointer group z-20 flex-shrink-0"
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
                className="flex relative w-[25%] md:w-1/4 h-40 md:h-56 rounded-2xl overflow-hidden border border-[#E6DFD5] cursor-pointer opacity-40 blur-[2px] md:blur-[3px] scale-90 transition-all duration-500 hover:opacity-70 flex-shrink-0"
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
              aria-label="Next Patient Image"
              className="absolute right-1 md:right-4 z-30 w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] flex items-center justify-center text-lg md:text-xl transition-colors duration-300 cursor-pointer"
            >
              ❯
            </button>
          </div>
        </div>

      </div>

      {/* ছবি বড় করার পপ-আপ মোডাল */}
      {selectedModalIndex !== null && (
        <div
          onClick={() => setSelectedModalIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-[#2C2A29]/80 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FCFBF9] p-4 md:p-6 rounded-2xl border border-[#E6DFD5] max-w-4xl w-full relative flex flex-col items-center shadow-xl"
          >
            {/* ক্লোজ বাটন */}
            <button
              onClick={() => setSelectedModalIndex(null)}
              className="absolute top-3 right-3 z-40 bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] font-bold w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer text-lg"
            >
              ✕
            </button>

            {/* মোডালের ভেতরে পিক ভিউ স্লাইডার কন্টেইনার */}
            <div className="relative flex items-center justify-center w-full overflow-hidden py-6">

              {/* প্রিভিয়াস বাটন */}
              <button
                onClick={prevModalSlide}
                aria-label="Previous Modal Slide"
                className="absolute left-1 md:left-2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] flex items-center justify-center text-xl transition-colors duration-300 cursor-pointer"
              >
                ❮
              </button>

              <div className="flex items-center justify-center gap-2 md:gap-4 w-full px-8 md:px-12">
                {/* মোডাল বাম পাশের ঝাপসা ছবি */}
                <div
                  onClick={() => setSelectedModalIndex((selectedModalIndex - 1 + currentImagesList.length) % currentImagesList.length)}
                  className="hidden sm:flex relative w-1/4 h-48 md:h-72 rounded-2xl overflow-hidden border border-[#E6DFD5] cursor-pointer opacity-40 blur-[3px] scale-90 transition-all duration-300 hover:opacity-70 flex-shrink-0"
                >
                  <img
                    src={currentImagesList[(selectedModalIndex - 1 + currentImagesList.length) % currentImagesList.length].src}
                    alt="Modal Prev"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* মোডাল মাঝখানের বড় ও পরিষ্কার ছবি */}
                <div className="relative w-full sm:w-2/4 h-[50vh] md:h-[65vh] rounded-2xl overflow-hidden border-2 border-[#A68A64] bg-[#121110] flex items-center justify-center flex-shrink-0 z-20">
                  <img
                    src={currentImagesList[selectedModalIndex].src}
                    alt="Modal Active"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* মোডাল ডান পাশের ঝাপসা ছবি */}
                <div
                  onClick={() => setSelectedModalIndex((selectedModalIndex + 1) % currentImagesList.length)}
                  className="hidden sm:flex relative w-1/4 h-48 md:h-72 rounded-2xl overflow-hidden border border-[#E6DFD5] cursor-pointer opacity-40 blur-[3px] scale-90 transition-all duration-300 hover:opacity-70 flex-shrink-0"
                >
                  <img
                    src={currentImagesList[(selectedModalIndex + 1) % currentImagesList.length].src}
                    alt="Modal Next"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* নেক্সট বাটন */}
              <button
                onClick={nextModalSlide}
                aria-label="Next Modal Slide"
                className="absolute right-1 md:right-2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] flex items-center justify-center text-xl transition-colors duration-300 cursor-pointer"
              >
                ❯
              </button>

            </div>

            <div className="text-sm font-bold text-[#5C5852] mt-2">
              {selectedModalIndex + 1} / {currentImagesList.length}
            </div>

          </div>
        </div>
      )}
    </main>
  )
}