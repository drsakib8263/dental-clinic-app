'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Home() {
  const [lang, setLang] = useState('bn')
  const [minDate, setMinDate] = useState('')
  const [maxDate, setMaxDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showTreatments, setShowTreatments] = useState(false)

  // বুকিং ফর্ম পপ-আপ বা বক্স ওপেন/ক্লোজ করার স্টেট
  const [showBookingBox, setShowBookingBox] = useState(false)

  // ডার্ক মোড স্টেট
  const [darkMode, setDarkMode] = useState(false)

  const [formData, setFormData] = useState({
    patient_name: '',
    age: '',
    phone: '',
    service: '',
    appointment_date: '',
    appointment_time: ''
  })

  // পেজ লোড হওয়ার সময় লোকাল স্টোরেজ থেকে ডার্ক মোড সেট করা
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setDarkMode(true)
    }
  }

  const t = {
    bn: {
      title: 'ডাঃ আসির মোসাদ্দেক সাকিব',
      subtitle: 'ওরাল এন্ড ডেন্টাল সার্জন',
      degree: 'বিডিএস (চট্টগ্রাম মেডিকেল কলেজ)',
      bmdc: 'বিএমডিসি রেজি. ৮২৬৩',
      training: 'স্পেশাল ট্রেইনড ইন ইমপ্ল্যান্ট এন্ড কসমেটিক ডেন্টিস্ট্রি',
      bookingMainBtn: '📅 অনলাইন অ্যাপয়েন্টমেন্ট বুকিং করুন',
      bookingCloseBtn: '✕ ফর্ম বন্ধ করুন',
      bookingTitle: 'অনলাইন অ্যাপয়েন্টমেন্ট বুকিং',
      bookingSub: 'শনিবার থেকে বৃহস্পতিবার (বিকেল ৪:০০ টা - রাত ৯:০০ টা), শুক্রবার বন্ধ',
      patientName: 'রোগীর নাম *',
      patientNamePlaceholder: 'আপনার নাম লিখুন',
      ageLabel: 'বয়স *',
      agePlaceholder: 'যেমন: ৩২',
      phoneLabel: 'মোবাইল নম্বর *',
      serviceLabel: 'চিকিৎসার ধরণ *',
      serviceDefault: 'চিকিৎসার ধরণ নির্বাচন করুন',
      service1: 'দাঁতের নতুন সমস্যা নিয়ে দেখাব',
      service2: 'দাঁতের চিকিৎসা চলমান রয়েছে',
      service3: 'ওষুধ খাওয়ার পরে আমার চিকিৎসা শুরু হবে',
      service4: 'ওষুধ খাওয়ার পরেও ব্যথা কমছে না',
      dateLabel: 'তারিখ নির্বাচন করুন (শুক্রবার বাদে) *',
      timeLabel: 'পছন্দের সময় (বিকেল ৪টা - রাত ৯টা) *',
      timeDefault: 'সময় নির্বাচন করুন',
      submitBtn: 'অ্যাপয়েন্টমেন্ট বুক করুন',
      submitting: 'জমা দেওয়া হচ্ছে...',
      successMsg: 'আপনার অ্যাপয়েন্টমেন্ট আবেদনটি সফলভাবে জমা হয়েছে! শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।',
      errorMsg: 'বুকিং জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      treatmentToggle: 'চিকিৎসার খরচ ও আনুমানিক সময়সূচি দেখুন',
      treatmentName: 'চিকিৎসার নাম',
      approxCost: 'আনুমানিক খরচ',
      approxTime: 'সময়',
      scheduleTitle: 'চেম্বারের সময়সূচি',
      scheduleDays: 'শনিবার - বৃহস্পতিবার:',
      scheduleTime: 'বিকেল ৪:০০ টা - রাত ৯:০০ টা',
      scheduleFriday: 'শুক্রবার:',
      scheduleClosed: 'বন্ধ (সাপ্তাহিক ছুটি)',
      contactTitle: 'যোগাযোগ ও কন্টাক্ট',
      hotline: 'হটলাইন:',
      email: 'ইমেল:',
      mapBtn: '📍 গুগল ম্যাপ লোকেশন',
      whatsappBtn: '💬 হোয়াটসঅ্যাপে চ্যাট করুন',
      tipsTitle: 'দাঁতের যত্ন ও স্বাস্থ্য টিপস',
      videoTitle: 'দাঁতের যত্ন বিষয়ক সচেতনতামূলক ভিডিও',
      videoSub: 'নিচে আমাদের সচেতনতামূলক ভিডিওটি দেখে দাঁতের সঠিক সুরক্ষা সম্পর্কে আরও বিস্তারিত জেনে নিন।'
    },
    en: {
      title: 'Dr. Asir Mosaddeque Sakib',
      subtitle: 'Oral & Dental Surgeon',
      degree: 'BDS (Chattagong Medical College)',
      bmdc: 'BMDC Reg. 8263',
      training: 'Special Trained in Implant & Cosmetic Dentistry',
      bookingMainBtn: '📅 Book Online Appointment',
      bookingCloseBtn: '✕ Close Form',
      bookingTitle: 'Online Appointment Booking',
      bookingSub: 'Saturday to Thursday (4:00 PM - 9:00 PM), Friday Closed',
      patientName: 'Patient Name *',
      patientNamePlaceholder: 'Enter your name',
      ageLabel: 'Age *',
      agePlaceholder: 'e.g. 32',
      phoneLabel: 'Mobile Number *',
      serviceLabel: 'Treatment Type *',
      serviceDefault: 'Select treatment type',
      service1: 'Consulting for new dental issue',
      service2: 'Ongoing dental treatment',
      service3: 'Treatment will start after taking medicine',
      service4: 'Pain persists even after taking medicine',
      dateLabel: 'Select Date (Excluding Friday) *',
      timeLabel: 'Preferred Time (4 PM - 9 PM) *',
      timeDefault: 'Select time',
      submitBtn: 'Book Appointment',
      submitting: 'Submitting...',
      successMsg: 'Your appointment request has been successfully submitted! We will contact you soon.',
      errorMsg: 'Error submitting appointment. Please try again.',
      treatmentToggle: 'View Treatment Costs & Estimated Schedule',
      treatmentName: 'Treatment Name',
      approxCost: 'Estimated Cost',
      approxTime: 'Time',
      scheduleTitle: 'Chamber Schedule',
      scheduleDays: 'Saturday - Thursday:',
      scheduleTime: '4:00 PM - 9:00 PM',
      scheduleFriday: 'Friday:',
      scheduleClosed: 'Closed (Weekly Holiday)',
      contactTitle: 'Contact & Communication',
      hotline: 'Hotline:',
      email: 'Email:',
      mapBtn: '📍 Google Map Location',
      whatsappBtn: '💬 Chat on WhatsApp',
      tipsTitle: 'Dental Care & Health Tips',
      videoTitle: 'Dental Care Awareness Video',
      videoSub: 'Watch our awareness video below to learn more about proper dental protection.'
    }
  }

  useEffect(() => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    let validCount = 0
    let i = 0
    let maxDateStr = todayStr

    while (validCount < 7 && i < 35) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const dayOfWeek = d.getDay()
      
      if (dayOfWeek !== 5) {
        validCount++
      }
      maxDateStr = d.toISOString().split('T')[0]
      i++
    }

    setMinDate(todayStr)
    setMaxDate(maxDateStr)
  }, [])

  const availableTimes = lang === 'bn' ? [
    "বিকেল ৪:০০ টা", "বিকেল ৪:৩০ টা",
    "বিকেল ৫:০০ টা", "বিকেল ৫:৩০ টা",
    "সন্ধ্যা ৬:০০ টা", "সন্ধ্যা ৬:৩০ টা",
    "সন্ধ্যা ৭:০০ টা", "সন্ধ্যা ৭:৩০ টা",
    "রাত ৮:০০ টা", "রাত ৮:৩০ টা",
    "রাত ৯:০০ টা"
  ] : [
    "4:00 PM", "4:30 PM",
    "5:00 PM", "5:30 PM",
    "6:00 PM", "6:30 PM",
    "7:00 PM", "7:30 PM",
    "8:00 PM", "8:30 PM",
    "9:00 PM"
  ]

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'appointment_date' && value) {
      const parts = value.split('-')
      const selectedDate = new Date(parts[0], parts[1] - 1, parts[2])
      const dayOfWeek = selectedDate.getDay()

      if (dayOfWeek === 5) {
        alert(lang === 'bn' ? 'শুক্রবার চেম্বার বন্ধ থাকে। অনুগ্রহ করে অন্য দিন নির্বাচন করুন।' : 'Chamber is closed on Friday. Please select another day.')
        setFormData((prev) => ({ ...prev, appointment_date: '' }))
        return
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.patient_name || !formData.phone || !formData.service || !formData.appointment_date || !formData.appointment_time) {
      alert(lang === 'bn' ? 'দয়া করে সব ফিল্ড সঠিকভাবে পূরণ করুন।' : 'Please fill in all required fields.')
      return
    }

    const parts = formData.appointment_date.split('-')
    const selectedDateObj = new Date(parts[0], parts[1] - 1, parts[2])
    const dayOfWeek = selectedDateObj.getDay()

    if (dayOfWeek === 5) {
      alert(lang === 'bn' ? 'শুক্রবার অ্যাপয়েন্টমেন্ট নেওয়া যাবে না।' : 'Appointments cannot be booked on Fridays.')
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const payload = {
        patient_name: formData.patient_name.trim(),
        age: formData.age ? parseInt(formData.age, 10) : null,
        patient_phone: formData.phone.trim(),
        service: formData.service,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time
      }

      const { error } = await supabase
        .from('appointments')
        .insert([payload])

      if (error) {
        console.error('Supabase Error:', error)
        alert('Database Error: ' + error.message)
        setLoading(false)
        return
      }

      setMessage({
        type: 'success',
        text: t[lang].successMsg
      })

      setFormData({
        patient_name: '',
        age: '',
        phone: '',
        service: '',
        appointment_date: '',
        appointment_time: ''
      })
    } catch (err) {
      console.error('Submission Error:', err)
      alert('Error: ' + (err.message || err))
    } finally {
      setLoading(false)
    }
  }

  const treatmentsList = lang === 'bn' ? [
    { name: 'রুট ক্যানাল ট্রিটমেন্ট', price: '৪০০০ টাকা (প্রতি দাঁত)', time: '১৫-২০ মিনিট' },
    { name: 'মেটাল-সিরামিক (PFM) ক্রাউন/ক্যাপ', price: '৪০০০ টাকা (প্রতি দাঁত)', time: '১৫ মিনিট (প্রতি ভিজিট)' },
    { name: 'জিরকনিয়া ক্রাউন/ক্যাপ', price: '১০০০০ টাকা (প্রতি দাঁত)', time: '১৫ মিনিট (প্রতি ভিজিট)' },
    { name: 'কম্পোজিট ফিলিং', price: '১৫০০ টাকা (প্রতি দাঁত)', time: '১৫-২০ মিনিট' },
    { name: 'মিড-ডায়াস্টেমা ক্লোজ (সামনের দাঁতের ফাঁকা বন্ধ করা)', price: '৪০০০ টাকা', time: '৩০ মিনিট' },
    { name: 'জি.আই ফিলিং', price: '৮০০ টাকা (প্রতি দাঁত)', time: '২০ মিনিট' },
    { name: 'নরমাল এক্সট্রাকশন (দাঁত তোলা)', price: '১০০০ টাকা (প্রতি দাঁত)', time: '১৫ মিনিট' },
    { name: 'সার্জিক্যাল এক্সট্রাকশন (আক্কেল দাঁত অপারেশন)', price: '৬০০০ টাকা (প্রতি দাঁত)', time: '৩০-৬০ মিনিট' },
    { name: 'বাচ্চাদের ফিলিং', price: '৫০০ টাকা (প্রতি দাঁত)', time: '১৫-২০ মিনিট' },
    { name: 'বাচ্চাদের দাঁত তোলা', price: '৪০০ টাকা (প্রতি দাঁত)', time: '১০ মিনিট' },
    { name: 'স্কেলিং ও পলিশিং', price: '২০০০ টাকা', time: '২০-২৫ মিনিট' },
    { name: 'পোস্ট-কোর বিল্ডাপ (ফাইবার ও ফিলিং দ্বারা)', price: '১৫০০ টাকা (প্রতি দাঁত)', time: '১৫ মিনিট' },
    { name: 'ফ্লেক্সিবল ডেঞ্চার', price: '৪০০০ টাকা (প্রতি দাঁত)', time: '১৫ মিনিট (প্রতি ভিজিট)' },
    { name: 'হিট কিউর ডেঞ্চার', price: '২৫০০ টাকা (প্রতি দাঁত)', time: '১৫ মিনিট (প্রতি ভিজিট)' },
    { name: 'সেলফ কিউর ডেঞ্চার', price: '১০০০ টাকা (প্রতি দাঁত)', time: '১৫ মিনিট (প্রতি ভিজিট)' },
    { name: 'নাইট গার্ড', price: '৭০০০ টাকা (প্রতি চোয়ালের জন্য)', time: '১৫ মিনিট (প্রতি ভিজিট)' }
  ] : [
    { name: 'Root Canal Treatment', price: '4000 BDT (Per Tooth)', time: '15-20 mins' },
    { name: 'Metal-Ceramic (PFM) Crown/Cap', price: '4000 BDT (Per Tooth)', time: '15 mins (Per Visit)' },
    { name: 'Zirconia Crown/Cap', price: '10000 BDT (Per Tooth)', time: '15 mins (Per Visit)' },
    { name: 'Composite Filling', price: '1500 BDT (Per Tooth)', time: '15-20 mins' },
    { name: 'Mid-Diastema Closure (Front tooth gap filling)', price: '4000 BDT', time: '30 mins' },
    { name: 'G.I. Filling', price: '800 BDT (Per Tooth)', time: '20 mins' },
    { name: 'Normal Extraction (Tooth Removal)', price: '1000 BDT (Per Tooth)', time: '15 mins' },
    { name: 'Surgical Extraction (Wisdom Tooth)', price: '6000 BDT (Per Tooth)', time: '30-60 mins' },
    { name: 'Pediatric Filling', price: '500 BDT (Per Tooth)', time: '15-20 mins' },
    { name: 'Pediatric Tooth Extraction', price: '400 BDT (Per Tooth)', time: '10 mins' },
    { name: 'Scaling & Polishing', price: '2000 BDT', time: '20-25 mins' },
    { name: 'Post-Core Buildup (Fiber & Filling)', price: '1500 BDT (Per Tooth)', time: '15 mins' },
    { name: 'Flexible Denture', price: '4000 BDT (Per Tooth)', time: '15 mins (Per Visit)' },
    { name: 'Heat Cure Denture', price: '2500 BDT (Per Tooth)', time: '15 mins (Per Visit)' },
    { name: 'Self Cure Denture', price: '1000 BDT (Per Tooth)', time: '15 mins (Per Visit)' },
    { name: 'Night Guard', price: '7000 BDT (Per Arch)', time: '15 mins (Per Visit)' }
  ]

  const dentalTips = lang === 'bn' ? [
    {
      icon: '🦷',
      title: 'দিনে দুবার ব্রাশ করার সঠিক নিয়ম',
      description: 'সকালে নাস্তার পর এবং রাতে ঘুমাতে যাওয়ার আগে অন্তত ২ মিনিট ধরে ফ্লোরাইডযুক্ত টুথপেস্ট দিয়ে দাঁত ব্রাশ করুন। এটি দাঁতের ক্ষয় ও ক্যাভিটি রোধ করতে সবচেয়ে কার্যকরী।'
    },
    {
      icon: '🧵',
      title: 'মাড়ির সুস্থতা ও ডেন্টাল ফ্লস',
      description: 'শুধু ব্রাশ করলেই মুখের সম্পূর্ণ hygiene রক্ষা হয় না। প্রতিদিন অন্তত একবার ডেন্টাল ফ্লস ব্যবহার করে দাঁতের মধ্যবর্তী জমে থাকা খাবারের কণা ও প্লাক পরিষ্কার করুন।'
    },
    {
      icon: '🩺',
      title: 'কবে ডেন্টাল সার্জনের কাছে যাবেন?',
      description: 'দাঁতে সামান্য ব্যথা, মাড়ি দিয়ে রক্ত পড়া বা ঠান্ডা-গরম লাগার সমস্যা দেখা দিলেই অবহেলা না করে দ্রুত ডেন্টাল সার্জনের পরামর্শ নিন। নিয়মিত চেকআপ বড় জটিলতা থেকে রক্ষা করে।'
    }
  ] : [
    {
      icon: '🦷',
      title: 'Proper Brushing Technique Twice Daily',
      description: 'Brush your teeth with fluoride toothpaste for at least 2 minutes after breakfast and before going to bed at night. This is most effective in preventing tooth decay and cavities.'
    },
    {
      icon: '🧵',
      title: 'Gum Health and Dental Floss',
      description: 'Brushing alone does not maintain complete oral hygiene. Use dental floss at least once a day to clean food particles and plaque trapped between your teeth.'
    },
    {
      icon: '🩺',
      title: 'When to Visit a Dental Surgeon?',
      description: 'Do not neglect minor tooth pain, bleeding gums, or sensitivity. Consult a dental surgeon promptly. Regular checkups protect against major complications.'
    }
  ]

  return (
    <main 
      className="min-h-screen text-slate-800 dark:text-slate-100 relative py-8 px-4 md:px-8 bg-cover bg-center bg-fixed transition-colors duration-200"
      style={{ backgroundImage: `url('/site-bg.jpeg')` }}
    >
      
      {/* ল্যাঙ্গুয়েজ ও ডার্ক মোড টগল বাটন বার */}
      <div className="max-w-4xl mx-auto flex justify-end gap-3 mb-4 relative z-50">
        {/* ডার্ক মোড টগল বাটন */}
        <button
          type="button"
          onClick={toggleTheme}
          className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2.5 rounded-full shadow-lg border-2 border-slate-300 dark:border-slate-600 transition-all duration-200 flex items-center gap-2 text-sm cursor-pointer select-none"
        >
          <span>{darkMode ? '☀️ লাইট মোড' : '🌙 ডার্ক মোড'}</span>
        </button>

        {/* ভাষা পরিবর্তনের বাটন */}
        <button
          type="button"
          onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
          className="bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-sky-900 dark:text-sky-300 font-extrabold px-5 py-2.5 rounded-full shadow-lg border-2 border-sky-500 transition-all duration-200 flex items-center gap-2 text-sm cursor-pointer select-none"
        >
          <span>🌐</span>
          <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        
        {/* ডক্টরের প্রোফাইল ও হেডার সেকশন */}
        <section className="p-6 md:p-8 rounded-3xl shadow-xl border border-gray-200/80 dark:border-slate-700 relative overflow-hidden bg-white/80 dark:bg-slate-900/85 backdrop-blur-md">
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-md border-2 border-sky-600 bg-white shrink-0">
              <img 
                src="/doctor.jpeg" 
                alt="Doctor Profile" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1.5 flex-1">
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t[lang].title}
              </h1>
              
              <p className="text-sky-800 dark:text-sky-400 font-extrabold text-xl md:text-2xl pt-1">
                {t[lang].subtitle}
              </p>

              <p className="text-slate-800 dark:text-slate-200 font-bold text-base md:text-lg">
                {t[lang].degree}
              </p>

              <p className="text-slate-700 dark:text-slate-300 font-bold text-sm md:text-base">
                {t[lang].bmdc}
              </p>

              <p className="text-slate-800 dark:text-slate-200 font-bold text-base md:text-lg pt-2">
                {t[lang].training}
              </p>
            </div>
          </div>
        </section>

        {/* অ্যাপয়েন্টমেন্ট বুকিং টগল বাটন */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowBookingBox(!showBookingBox)}
            className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-lg py-4 px-8 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-sky-400 flex items-center justify-center gap-3 mx-auto"
          >
            <span>{showBookingBox ? t[lang].bookingCloseBtn : t[lang].bookingMainBtn}</span>
          </button>
        </div>

        {/* অনলাইন অ্যাপয়েন্টমেন্ট বুকিং বক্স (টগল করার পর শো করবে) */}
        {showBookingBox && (
          <section className="bg-sky-200 dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-xl border border-sky-300 dark:border-slate-700 max-w-2xl mx-auto relative z-10 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 mx-auto">
                <span className="text-2xl">📅</span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
                  {t[lang].bookingTitle}
                </h2>
              </div>
              <button 
                onClick={() => setShowBookingBox(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-rose-600 dark:text-rose-400 font-semibold text-center mb-6 text-sm">
              {t[lang].bookingSub}
            </p>

            {message.text && (
              <div
                className={`p-4 mb-6 rounded-xl text-sm font-medium ${
                  message.type === 'success'
                    ? 'bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800'
                    : 'bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t[lang].patientName}
                  </label>
                  <input
                    type="text"
                    name="patient_name"
                    value={formData.patient_name}
                    onChange={handleChange}
                    required
                    placeholder={t[lang].patientNamePlaceholder}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-sky-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t[lang].ageLabel}
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="1"
                    max="120"
                    placeholder={t[lang].agePlaceholder}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-sky-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t[lang].phoneLabel}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="017XXXXXXXX"
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-sky-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t[lang].serviceLabel}
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-sky-400 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-600 outline-none transition text-slate-900 dark:text-white font-medium cursor-pointer"
                >
                  <option value="">{t[lang].serviceDefault}</option>
                  <option value={t[lang].service1}>{t[lang].service1}</option>
                  <option value={t[lang].service2}>{t[lang].service2}</option>
                  <option value={t[lang].service3}>{t[lang].service3}</option>
                  <option value={t[lang].service4}>{t[lang].service4}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t[lang].dateLabel}
                </label>
                <input
                  type="date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  min={minDate}
                  max={maxDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-sky-400 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-600 outline-none transition text-slate-900 dark:text-white font-medium cursor-pointer"
                />
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-bold">
                  * ক্যালেন্ডার থেকে কেবল সামনের ৭টি সচল দিন (শুক্রবার বাদে) সিলেক্ট করা যাবে।
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t[lang].timeLabel}
                </label>
                <select
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-sky-400 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-600 outline-none transition text-slate-900 dark:text-white font-medium cursor-pointer"
                >
                  <option value="">{t[lang].timeDefault}</option>
                  {availableTimes.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-700 hover:bg-sky-800 text-white font-bold py-3.5 px-6 rounded-xl transition duration-200 shadow-md disabled:opacity-50 mt-4 cursor-pointer"
              >
                {loading ? t[lang].submitting : t[lang].submitBtn}
              </button>
            </form>
          </section>
        )}

        {/* চেম্বারের চিকিৎসা ও খরচের তালিকা */}
        <section className="bg-white/95 dark:bg-slate-900 backdrop-blur-md rounded-3xl shadow-xl border-2 border-sky-300 dark:border-slate-700 overflow-hidden">
          <div 
            onClick={() => setShowTreatments(!showTreatments)}
            className="w-full p-5 md:p-6 flex items-center justify-between bg-sky-100 dark:bg-slate-800 hover:bg-sky-200 dark:hover:bg-slate-700 transition cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2 bg-white dark:bg-slate-700 rounded-2xl shadow-sm border border-sky-200 dark:border-slate-600">💰</span>
              <h2 className="text-lg md:text-xl font-bold text-sky-950 dark:text-white">
                {t[lang].treatmentToggle}
              </h2>
            </div>
            
            <button 
              type="button"
              className="bg-sky-700 text-white px-4 py-2 rounded-xl text-xs md:text-sm font-bold shadow-md pointer-events-none"
            >
              {showTreatments ? (lang === 'bn' ? 'বন্ধ করুন ▲' : 'Hide ▲') : (lang === 'bn' ? 'দেখুন ▼' : 'View ▼')}
            </button>
          </div>

          {showTreatments && (
            <div className="p-4 md:p-6 border-t border-sky-200 dark:border-slate-800 bg-sky-50 dark:bg-slate-900/50">
              <div className="overflow-x-auto rounded-2xl border border-sky-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-inner">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-sky-200 dark:border-slate-700 text-sky-950 dark:text-white bg-sky-100 dark:bg-slate-700">
                      <th className="py-3.5 px-4 font-bold text-xs md:text-sm">{t[lang].treatmentName}</th>
                      <th className="py-3.5 px-4 font-bold text-xs md:text-sm">{t[lang].approxCost}</th>
                      <th className="py-3.5 px-4 font-bold text-xs md:text-sm">{t[lang].approxTime}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100 dark:divide-slate-700 text-xs md:text-sm">
                    {treatmentsList.map((item, index) => (
                      <tr key={index} className="hover:bg-sky-50 dark:hover:bg-slate-700/50 transition">
                        <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{item.name}</td>
                        <td className="py-3 px-4 font-semibold text-sky-700 dark:text-sky-400">{item.price}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{item.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* চেম্বারের সময়সূচি ও যোগাযোগ */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/90 dark:bg-slate-900 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-lg border border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🕒</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t[lang].scheduleTitle}</h3>
            </div>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300 text-sm">
              <li className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <span className="font-medium">
                  <strong>{t[lang].scheduleDays}</strong>
                </span>
                <span className="text-sky-700 dark:text-sky-400 font-semibold">{t[lang].scheduleTime}</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <span className="font-medium">
                  <strong>{t[lang].scheduleFriday}</strong>
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-semibold">{t[lang].scheduleClosed}</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/90 dark:bg-slate-900 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-lg border border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📞</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t[lang].contactTitle}</h3>
            </div>
            <div className="space-y-3 text-slate-700 dark:text-slate-300 text-sm">
              <p>
                <span className="font-medium">{t[lang].hotline}</span>{' '}
                <a href="tel:01816011701" className="font-bold text-sky-700 dark:text-sky-400 hover:underline cursor-pointer">
                  01816 011 701
                </a>
              </p>
              <p><span className="font-medium">{t[lang].email}</span> <a href="mailto:sakibcmc@hotmail.com" className="text-sky-600 dark:text-sky-400 hover:underline">sakibcmc@hotmail.com</a></p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                <a 
                  href="https://maps.app.goo.gl/cArTCHeJjE453izP7?g_st=ac" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl transition shadow-md cursor-pointer"
                >
                  {t[lang].mapBtn}
                </a>
                
                <a 
                  href="https://wa.me/message/KBZOTSKH66H4P1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl transition shadow-md cursor-pointer"
                >
                  {t[lang].whatsappBtn}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* স্বাস্থ্য বিষয়ক উপদেশমূলক ব্লগ / টিপস সেকশন */}
        <section className="bg-white/90 dark:bg-slate-900 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-lg border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            {t[lang].tipsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dentalTips.map((tip, index) => (
              <div key={index} className="bg-sky-50/50 dark:bg-slate-800 p-6 rounded-2xl border border-sky-100 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="text-3xl mb-3">{tip.icon}</div>
                  <h3 className="font-bold text-sky-900 dark:text-sky-300 text-lg mb-2">{tip.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ইউটিউব ভিডিও ইন্টিগ্রেশন সেকশন */}
        <section className="bg-white/90 dark:bg-slate-900 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-lg border border-gray-200 dark:border-slate-700 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {t[lang].videoTitle}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-lg mx-auto">
            {t[lang].videoSub}
          </p>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-700">
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              title="Dental Care Video" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </section>
      </div>

      {/* ভাসমান হোয়াটসঅ্যাপ বাটন */}
      <a
        href="https://wa.me/message/KBZOTSKH66H4P1"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 animate-bounce cursor-pointer"
        title="Chat on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>
    </main>
  )
}