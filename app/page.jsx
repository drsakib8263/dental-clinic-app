'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Home() {
  const [lang, setLang] = useState('bn')
  const [availableDates, setAvailableDates] = useState([])
  const [bookedSlotsCount, setBookedSlotsCount] = useState({})
  const [loading, setLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // চেম্বার বন্ধ থাকার নোটিশ পপ-আপ স্টেট
  const [showChamberClosedModal, setShowChamberClosedModal] = useState(false)
  const [chamberNotice, setChamberNotice] = useState({
    isClosed: false,
    titleBn: 'জরুরি নোটিশ: চেম্বার বন্ধ সংক্রান্ত',
    titleEn: 'Important Notice: Chamber Closure',
    messageBn: 'আগামী ১০ নভেম্বর থেকে ১৫ নভেম্বর পর্যন্ত চেম্বার বন্ধ থাকবে। ১৬ নভেম্বর থেকে যথারীতি অ্যাপয়েন্টমেন্ট নেওয়া যাবে।',
    messageEn: 'The chamber will be closed from Nov 10 to Nov 15. Appointments will resume from Nov 16.'
  })

  // সফল বুকিং পপ-আপ স্টেট
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successDetails, setSuccessDetails] = useState({ name: '', date: '', time: '' })

  const [showBookingBox, setShowBookingBox] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const [formData, setFormData] = useState({
    patient_name: '',
    age: '',
    phone: '',
    service: '',
    appointment_date: '',
    appointment_time: ''
  })

  const fetchBookingsCount = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_date, appointment_time')

      if (error) {
        console.error('Error fetching bookings:', error)
        return
      }

      const counts = {}
      data.forEach(item => {
        const key = `${item.appointment_date}|${item.appointment_time}`
        counts[key] = (counts[key] || 0) + 1
      })
      setBookedSlotsCount(counts)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const fetchLiveNotice = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'chamber_notice')
        .single()

      if (data && !error) {
        setChamberNotice({
          isClosed: data.is_closed,
          titleBn: data.title_bn || 'জরুরি নোটিশ: চেম্বার বন্ধ সংক্রান্ত',
          titleEn: data.title_en || 'Important Notice: Chamber Closure',
          messageBn: data.message_bn || '',
          messageEn: data.message_en || ''
        })
        if (data.is_closed) {
          setShowChamberClosedModal(true)
        }
      }
    } catch (err) {
      console.error('Error fetching live notice:', err)
    }
  }

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
     
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    fetchBookingsCount()
    fetchLiveNotice()
  }, [])

  useEffect(() => {
    const dates = []
    const daysListBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার']
    const monthsListBn = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
    
    const daysListEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const monthsListEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const toBengaliNumber = (num) => {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
      return num.toString().split('').map(digit => {
        return /\d/.test(digit) ? bnDigits[parseInt(digit, 10)] : digit
      }).join('')
    }

    const today = new Date()
    let count = 0
    let i = 0

    while (count < 7 && i < 25) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      
      const dayOfWeek = d.getDay()
      
      if (dayOfWeek !== 5) {
        const value = d.toISOString().split('T')[0]
        let label = ''

        if (lang === 'bn') {
          const bnDayName = daysListBn[dayOfWeek]
          const dayNum = toBengaliNumber(d.getDate())
          const bnMonthName = monthsListBn[d.getMonth()]
          const yearNum = toBengaliNumber(d.getFullYear())
          
          label = (count === 0)
            ? `আজ (${bnDayName}, ${dayNum} ${bnMonthName} ${yearNum})`
            : `${bnDayName}, ${dayNum} ${bnMonthName} ${yearNum}`
        } else {
          const enDayName = daysListEn[dayOfWeek]
          const dayNum = d.getDate()
          const enMonthName = monthsListEn[d.getMonth()]
          const yearNum = d.getFullYear()
          
          label = (count === 0)
            ? `Today (${enDayName}, ${enMonthName} ${dayNum}, ${yearNum})`
            : `${enDayName}, ${enMonthName} ${dayNum}, ${yearNum}`
        }

        dates.push({ value, label })
        count++
      }
      i++
    }
    setAvailableDates(dates)
  }, [lang])

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
      dateLabel: 'পছন্দের তারিখ (শুক্রবার বাদে) *',
      dateDefault: 'তারিখ নির্বাচন করুন',
      timeLabel: 'পছন্দের সময় (প্রতি স্লটে সর্বোচ্চ ২ জন) *',
      timeDefault: 'সময় নির্বাচন করুন',
      submitBtn: 'অ্যাপয়েন্টমেন্ট বুক করুন',
      submitting: 'জমা দেওয়া হচ্ছে...',
      successTitle: 'অভিনন্দন! বুকিং সফল হয়েছে',
      successMsg: 'আপনার অ্যাপয়েন্টমেন্ট আবেদনটি সফলভাবে জমা হয়েছে! শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।',
      closeModalBtn: 'ঠিক আছে',
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
      videoTitle: 'দাঁতের যত্ন ও চিকিৎসা বিষয়ক সচেতনতামূলক ভিডিও',
      videoSub: 'দাঁতের বিভিন্ন চিকিৎসা (রুট ক্যানেল, এক্সট্রাকশন, ফিলিং ও ক্যাপ) সম্পর্কে বিস্তারিত জানতে নিচের ভিডিওগুলো দেখুন।'
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
      dateDefault: 'Select Date',
      timeLabel: 'Preferred Time (Max 2 per slot) *',
      timeDefault: 'Select time',
      submitBtn: 'Book Appointment',
      submitting: 'Submitting...',
      successTitle: 'Congratulations! Booking Successful',
      successMsg: 'Your appointment request has been successfully submitted! We will contact you soon.',
      closeModalBtn: 'OK',
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
      videoTitle: 'Dental Care & Treatment Awareness Videos',
      videoSub: 'Watch the videos below to learn more about various dental treatments (Root Canal, Extraction, Filling, and Crowns/Caps).'
    }
  }

  const rawTimes = lang === 'bn' ? [
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

    const slotKey = `${formData.appointment_date}|${formData.appointment_time}`
    if ((bookedSlotsCount[slotKey] || 0) >= 2) {
      alert(lang === 'bn' ? 'দুঃখিত, এই সময়ে এপয়েন্টমেন্ট খালি নেই।' : 'Sorry, this time slot is fully booked.')
      return
    }

    setLoading(true)

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
        alert('Database Error: ' + error.message)
        setLoading(false)
        return
      }

      await fetchBookingsCount()

      setSuccessDetails({
        name: formData.patient_name,
        date: formData.appointment_date,
        time: formData.appointment_time
      })
      setShowSuccessModal(true)
      setShowBookingBox(false)

      setFormData({
        patient_name: '',
        age: '',
        phone: '',
        service: '',
        appointment_date: '',
        appointment_time: ''
      })
    } catch (err) {
      alert('Error: ' + (err.message || err))
    } finally {
      setLoading(false)
    }
  }

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

  const videoList = lang === 'bn' ? [
    { title: '১. রুট ক্যানাল ট্রিটমেন্ট প্রক্রিয়া', id: 'YOUR_ROOT_CANAL_VIDEO_ID' },
    { title: '২. দাঁত এক্সট্রাকশন (দাঁত তোলা)', id: 'YOUR_EXTRACTION_VIDEO_ID' },
    { title: '৩. দাঁতের ফিলিং পদ্ধতি', id: 'YOUR_FILLING_VIDEO_ID' },
    { title: '৪. দাঁতের ক্যাপ ও ক্রাউন সংক্রান্ত', id: 'YOUR_CROWN_VIDEO_ID' }
  ] : [
    { title: '1. Root Canal Treatment Procedure', id: 'YOUR_ROOT_CANAL_VIDEO_ID' },
    { title: '2. Tooth Extraction Process', id: 'YOUR_EXTRACTION_VIDEO_ID' },
    { title: '3. Dental Filling Method', id: 'YOUR_FILLING_VIDEO_ID' },
    { title: '4. Dental Crowns & Caps Overview', id: 'YOUR_CROWN_VIDEO_ID' }
  ]

  return (
    <main 
      className="min-h-screen text-slate-900 dark:text-slate-100 relative py-8 px-4 md:px-12 bg-cover bg-center bg-fixed transition-colors duration-200 scroll-smooth"
      style={{ backgroundImage: `url('/site-bg.jpeg')` }}
    >
      {/* ব্যাকগ্রাউন্ড ব্লার ও ওভারলে লেয়ার */}
      <div className="absolute inset-0 bg-[#EADCD2]/70 dark:bg-[#2B1618]/80 backdrop-blur-md pointer-events-none z-0"></div>

      {/* পেজের বাম পাশে ফিক্সড তিনটি আইকন বক্স */}
      <div className="flex flex-col fixed left-3 md:left-6 top-1/3 z-40 shadow-2xl rounded-2xl overflow-hidden border-2 border-[#5A181C]/40">
        <a
          href="https://wa.me/message/KBZOTSKH66H4P1"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#EADCD2] dark:bg-[#3D2F27] hover:bg-[#D3D8DB] dark:hover:bg-[#4A3B3C] p-3 md:p-3.5 flex items-center justify-center text-xl md:text-2xl transition-colors"
          title="WhatsApp"
        >
          💬
        </a>

        <a
          href="tel:+8801816011701"
          className="bg-[#EADCD2] dark:bg-[#3D2F27] hover:bg-[#D3D8DB] dark:hover:bg-[#4A3B3C] p-3 md:p-3.5 flex items-center justify-center text-xl md:text-2xl transition-colors border-t border-b border-[#5A181C]/20"
          title="Hotline"
        >
          📱
        </a>

        <a
          href="mailto:asir.mosaddeque@gmail.com"
          className="bg-[#EADCD2] dark:bg-[#3D2F27] hover:bg-[#D3D8DB] dark:hover:bg-[#4A3B3C] p-3 md:p-3.5 flex items-center justify-center text-xl md:text-2xl transition-colors"
          title="Email"
        >
          ✉️
        </a>
      </div>

      {/* ন্যাভিগেশন বার */}
      <header className="max-w-7xl mx-auto mb-6 relative z-50 bg-[#EADCD2]/90 dark:bg-[#2B1618]/90 p-4 md:px-8 rounded-2xl shadow-xl border border-[#5A181C]/30 backdrop-blur-md flex items-center justify-between">
        <div className="font-extrabold text-[#5A181C] dark:text-[#EADCD2] text-lg md:text-xl tracking-tight">
          Dental Care
        </div>

        {/* কম্পিউটার ভার্সন: হরাইজন্টাল মেনু */}
        <nav className="hidden md:flex items-center gap-6 font-bold text-sm md:text-base text-slate-800 dark:text-slate-200">
          <a href="/" className="hover:text-[#5A181C] dark:hover:text-teal-400 transition">Home</a>
          <a href="#about-section" className="hover:text-[#5A181C] dark:hover:text-teal-400 transition">About us</a>
          <a href="/introduction-to-dentistry" className="hover:text-[#5A181C] dark:hover:text-teal-400 transition">Introduction to Dentistry</a>
          <a href="/services" className="hover:text-[#5A181C] dark:hover:text-teal-400 transition">Our services</a>
          <a href="/gallery" className="hover:text-[#5A181C] dark:hover:text-teal-400 transition">Gallery</a>
          <a href="#" className="hover:text-[#5A181C] dark:hover:text-teal-400 transition">Contact us</a>
        </nav>

        {/* মোবাইল ভার্সন: তিন দাগের মেনু বাটন */}
        <div className="flex md:hidden items-center">
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-2xl p-2 text-[#5A181C] dark:text-[#EADCD2] focus:outline-none"
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* মোবাইল ড্রপডাউন মেনু */}
      {mobileMenuOpen && (
        <div className="max-w-7xl mx-auto mb-6 md:hidden relative z-50 bg-[#EADCD2] dark:bg-[#2B1618] p-4 rounded-2xl shadow-2xl border border-[#5A181C]/40 space-y-3 font-bold text-sm text-slate-900 dark:text-white animate-in fade-in duration-200">
          <a href="/" onClick={() => setMobileMenuOpen(false)} className="block py-1 px-2 hover:bg-[#95A5A6]/20 rounded-lg">Home</a>
          <a href="#about-section" onClick={() => setMobileMenuOpen(false)} className="block py-1 px-2 hover:bg-[#95A5A6]/20 rounded-lg">About us</a>
          <a href="/introduction-to-dentistry" onClick={() => setMobileMenuOpen(false)} className="block py-1 px-2 hover:bg-[#95A5A6]/20 rounded-lg">Introduction to Dentistry</a>
          <a href="/services" onClick={() => setMobileMenuOpen(false)} className="block py-1 px-2 hover:bg-[#95A5A6]/20 rounded-lg">Our services</a>
          <a href="/gallery" onClick={() => setMobileMenuOpen(false)} className="block py-1 px-2 hover:bg-[#95A5A6]/20 rounded-lg">Gallery</a>
          <a href="#" onClick={() => setMobileMenuOpen(false)} className="block py-1 px-2 hover:bg-[#95A5A6]/20 rounded-lg">Contact us</a>
        </div>
      )}

      {/* টপ বার: থিম ও ল্যাঙ্গুয়েজ টগল বাটন */}
      <div className="max-w-7xl mx-auto flex justify-end gap-3 mb-6 relative z-50">
        <button
          type="button"
          onClick={toggleTheme}
          className="bg-[#D3D8DB] dark:bg-[#4A3B3C] hover:bg-[#EAECEE] text-slate-900 dark:text-slate-100 font-bold px-4 py-2.5 rounded-full shadow-lg border border-[#95A5A6] transition-all duration-200 flex items-center gap-2 text-sm cursor-pointer select-none backdrop-blur-md"
        >
          <span>{darkMode ? '☀️ লাইট মোড' : '🌙 ডার্ক মোড'}</span>
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

      {/* মূল কন্টেন্ট কনটেইনার */}
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* ডক্টরের প্রোফাইল ও হেডার সেকশন */}
        <section className="p-6 md:p-10 rounded-3xl shadow-2xl border-2 border-[#5A181C]/30 relative overflow-hidden bg-[#EADCD2]/95 dark:bg-[#2B1618]/95 backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#95A5A6]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-xl border-2 border-[#5A181C] bg-white shrink-0">
              <img 
                src="/doctor.jpeg" 
                alt="Doctor Profile" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2 flex-1">
              <h1 className="text-3xl md:text-5xl font-extrabold text-[#5A181C] dark:text-[#EADCD2] tracking-tight">
                {t[lang].title}
              </h1>
              
              <p className="text-[#8B6B5E] dark:text-[#A89287] font-extrabold text-xl md:text-2xl pt-1">
                {t[lang].subtitle}
              </p>

              <p className="text-slate-800 dark:text-slate-200 font-bold text-base md:text-lg">
                {t[lang].degree}
              </p>

              <p className="text-slate-700 dark:text-slate-300 font-bold text-sm md:text-base">
                {t[lang].bmdc}
              </p>

              <p className="text-[#5A181C] dark:text-[#EADCD2] font-bold text-base md:text-lg pt-2">
                {t[lang].training}
              </p>
            </div>
          </div>
        </section>

        {/* স্থায়ী About Us সেকশন */}
        <section id="about-section" className="bg-white dark:bg-[#344246] p-6 md:p-10 rounded-3xl shadow-2xl border-2 border-[#5A181C]/30 space-y-6">
          <div className="border-b border-[#5A181C]/20 pb-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#5A181C] dark:text-[#EADCD2]">
              {lang === 'bn' ? 'আমাদের সম্পর্কে (About Us)' : 'About Us'}
            </h2>
            <p className="text-sm text-[#8B6B5E] dark:text-[#A89287] font-bold mt-1">
              {lang === 'bn' ? 'ডাঃ আসির মোসাদ্দেক সাকিব ডেন্টাল কেয়ার' : 'Dr. Asir Mosaddeque Sakib Dental Care'}
            </p>
          </div>

          <div className="space-y-4 text-slate-800 dark:text-slate-200 text-base leading-relaxed">
            <p>
              {lang === 'bn'
                ? 'ডাঃ আসির মোসাদ্দেক সাকিব ডেন্টাল কেয়ারে আপনাকে স্বাগতম। আমরা আধুনিক প্রযুক্তির সাহায্যে রোগীদের সর্বাধুনিক ও নিরাপদ ডেন্টাল সেবা প্রদান করে থাকি। আমাদের চেম্বারে রুট ক্যানাল ট্রিটমেন্ট, জিরকনিয়া ও মেটাল-সিরামিক ক্রাউন, স্কেলিং, দাঁত তোলা এবং কসমেটিক ডেন্টিস্ট্রির আধুনিক চিকিৎসা নিশ্চিত করা হয়।'
                : 'Welcome to Dr. Asir Mosaddeque Sakib Dental Care. We provide advanced and safe dental services using modern technology. Our chamber ensures state-of-the-art treatments including Root Canal Therapy, Zirconia & PFM Crowns, Scaling, Extractions, and Cosmetic Dentistry.'
              }
            </p>
            <p>
              {lang === 'bn'
                ? 'প্রতিটি রোগীর সমস্যা যত্নসহকারে শুনে নিখুঁত ও পেইনলেস চিকিৎসা প্রদানই আমাদের মূল লক্ষ্য। আপনার সুস্থ ও সুন্দর হাসিই আমাদের বড় অর্জন।'
                : 'Our primary goal is to carefully listen to each patient’s dental concerns and provide precise, painless treatments. Your healthy and beautiful smile is our greatest achievement.'
              }
            </p>
          </div>
        </section>

        {/* অ্যাপয়েন্টমেন্ট বুকিং টগল বাটন */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowBookingBox(!showBookingBox)}
            className="bg-[#5A181C] hover:bg-[#451215] text-[#EADCD2] font-extrabold text-lg py-4 px-10 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border border-[#8B6B5E]/40 flex items-center justify-center gap-3 mx-auto"
          >
            <span>{showBookingBox ? t[lang].bookingCloseBtn : t[lang].bookingMainBtn}</span>
          </button>
        </div>

        {/* অনলাইন অ্যাপয়েন্টমেন্ট বুকিং বক্স */}
        {showBookingBox && (
          <section id="booking-section" className="bg-[#95A5A6]/90 dark:bg-[#344246]/95 p-6 md:p-10 rounded-3xl shadow-2xl border-2 border-[#5A181C]/40 max-w-3xl mx-auto relative z-10 animate-in fade-in zoom-in duration-300 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 mx-auto">
                <span className="text-2xl">📅</span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
                  {t[lang].bookingTitle}
                </h2>
              </div>
              <button 
                onClick={() => setShowBookingBox(false)}
                className="text-slate-700 hover:text-slate-900 dark:text-slate-200 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-[#5A181C] dark:text-[#EADCD2] font-semibold text-center mb-6 text-sm">
              {t[lang].bookingSub}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    {t[lang].patientName}
                  </label>
                  <input
                    type="text"
                    name="patient_name"
                    value={formData.patient_name}
                    onChange={handleChange}
                    required
                    placeholder={t[lang].patientNamePlaceholder}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-[#D3D8DB] rounded-xl focus:ring-2 focus:ring-[#5A181C] outline-none transition text-slate-900 dark:text-white shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
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
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-[#D3D8DB] rounded-xl focus:ring-2 focus:ring-[#5A181C] outline-none transition text-slate-900 dark:text-white shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  {t[lang].phoneLabel}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="017XXXXXXXX"
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-[#D3D8DB] rounded-xl focus:ring-2 focus:ring-[#5A181C] outline-none transition text-slate-900 dark:text-white shadow-inner"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  {t[lang].serviceLabel}
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-[#5A181C]/40 rounded-xl focus:ring-2 focus:ring-[#5A181C] outline-none transition text-slate-900 dark:text-white font-medium cursor-pointer shadow-inner"
                >
                  <option value="">{t[lang].serviceDefault}</option>
                  <option value={t[lang].service1}>{t[lang].service1}</option>
                  <option value={t[lang].service2}>{t[lang].service2}</option>
                  <option value={t[lang].service3}>{t[lang].service3}</option>
                  <option value={t[lang].service4}>{t[lang].service4}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  {t[lang].dateLabel}
                </label>
                <select
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-[#5A181C]/40 rounded-xl focus:ring-2 focus:ring-[#5A181C] outline-none transition text-slate-900 dark:text-white font-medium cursor-pointer shadow-inner"
                >
                  <option value="">{t[lang].dateDefault}</option>
                  {availableDates.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  {t[lang].timeLabel}
                </label>
                <select
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-[#5A181C]/40 rounded-xl focus:ring-2 focus:ring-[#5A181C] outline-none transition text-slate-900 dark:text-white font-medium cursor-pointer shadow-inner"
                >
                  <option value="">{t[lang].timeDefault}</option>
                  {rawTimes.map((time, index) => {
                    const slotKey = `${formData.appointment_date}|${time}`
                    const count = bookedSlotsCount[slotKey] || 0
                    const isFull = count >= 2

                    const fullText = lang === 'bn' ? '(এই সময়ে এপয়েন্টমেন্ট খালি নেই)' : '(Fully Booked)'
                    const bookedText = lang === 'bn' ? `(বুকড: ${count}/২)` : `(Booked: ${count}/2)`

                    return (
                      <option 
                        key={index} 
                        value={time}
                        disabled={isFull}
                        style={{ color: isFull ? 'red' : 'inherit' }}
                      >
                        {time} {isFull ? fullText : bookedText}
                      </option>
                    )
                  })}
                </select>
                {!formData.appointment_date && (
                  <p className="text-xs text-[#5A181C] dark:text-[#EADCD2] mt-1 font-medium">
                    {lang === 'bn' ? '* প্রথমে তারিখ নির্বাচন করুন, এরপর খালি সময় দেখতে পাবেন।' : '* Please select a date first to view available time slots.'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5A181C] hover:bg-[#451215] text-[#EADCD2] font-bold py-3.5 px-6 rounded-xl transition duration-200 shadow-lg disabled:opacity-50 mt-4 cursor-pointer"
              >
                {loading ? t[lang].submitting : t[lang].submitBtn}
              </button>
            </form>
          </section>
        )}

        {/* চেম্বারের সময়সূচি সেকশন */}
        <section className="bg-[#B89C8B]/90 dark:bg-[#4E3E34] backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl border border-[#8B6B5E]/50">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">⏰</span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              {t[lang].scheduleTitle}
            </h2>
          </div>
          <div className="space-y-3 text-slate-900 dark:text-slate-100 text-sm md:text-base">
            <div className="flex justify-between items-center p-3.5 bg-white/70 dark:bg-slate-800 rounded-2xl border border-[#8B6B5E]/30 shadow-sm">
              <span className="font-bold">{t[lang].scheduleDays}</span>
              <span className="font-semibold text-[#5A181C] dark:text-[#EADCD2]">{t[lang].scheduleTime}</span>
            </div>
            <div className="flex justify-between items-center p-3.5 bg-white/70 dark:bg-slate-800 rounded-2xl border border-[#8B6B5E]/30 shadow-sm">
              <span className="font-bold">{t[lang].scheduleFriday}</span>
              <span className="font-semibold text-rose-700 dark:text-rose-400">{t[lang].scheduleClosed}</span>
            </div>
          </div>
        </section>

        {/* দাঁতের যত্ন ও স্বাস্থ্য টিপস (ব্লগ) সেকশন */}
        <section className="bg-[#EADCD2]/95 dark:bg-[#32201D] backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl border border-[#8B6B5E]/40 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <h2 className="text-xl md:text-2xl font-bold text-[#5A181C] dark:text-[#EADCD2]">
              {t[lang].tipsTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dentalTips.map((tip, index) => (
              <div key={index} className="bg-white/80 dark:bg-slate-800 p-6 rounded-2xl border border-[#B89C8B]/40 shadow-sm space-y-2 flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="text-3xl mb-2">{tip.icon}</div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">{tip.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ভিডিও এমবেড সেকশন */}
        <section className="bg-[#95A5A6]/90 dark:bg-[#344246] backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-xl border border-slate-500/40 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎥</span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              {t[lang].videoTitle}
            </h2>
          </div>
          <p className="text-slate-800 dark:text-slate-200 text-sm">
            {t[lang].videoSub}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {videoList.map((video, index) => (
              <div key={index} className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-2xl shadow-lg border border-[#5A181C]/30 space-y-2 flex flex-col justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs md:text-sm line-clamp-1">{video.title}</h3>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow bg-black">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* যোগাযোগ ও কন্টাক্ট সেকশন */}
        <section className="bg-[#B89C8B]/95 dark:bg-[#3D2F27] backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-xl border-2 border-[#5A181C]/50 space-y-6">
          <div className="flex items-center gap-3 border-b border-[#8B6B5E]/40 pb-4">
            <span className="text-3xl p-2 bg-white/70 dark:bg-slate-800 rounded-2xl">📞</span>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
                {t[lang].contactTitle}
              </h2>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300">
                {lang === 'bn' ? 'যেকোনো প্রয়োজনে সরাসরি যোগাযোগ করুন' : 'Feel free to reach out for any queries'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:text-base">
            <div className="p-5 bg-white/80 dark:bg-slate-800 rounded-2xl border border-[#8B6B5E]/40 shadow-sm space-y-2 hover:shadow-md transition">
              <div className="flex items-center gap-2 text-[#5A181C] dark:text-[#EADCD2] font-bold">
                <span>📱</span>
                <span>{t[lang].hotline}</span>
              </div>
              <a href="tel:+8801816011701" className="text-slate-900 dark:text-white font-black text-lg md:text-xl hover:text-[#5A181C] transition block">
                +880 1816 011 701
              </a>
            </div>

            <div className="p-5 bg-white/80 dark:bg-slate-800 rounded-2xl border border-[#8B6B5E]/40 shadow-sm space-y-2 hover:shadow-md transition">
              <div className="flex items-center gap-2 text-[#5A181C] dark:text-[#EADCD2] font-bold">
                <span>✉️</span>
                <span>{t[lang].email}</span>
              </div>
              <a href="mailto:asir.mosaddeque@gmail.com" className="text-slate-900 dark:text-white font-bold text-sm md:text-base hover:text-[#5A181C] transition block break-all">
                asir.mosaddeque@gmail.com
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-2">
            <a 
              href="https://maps.app.goo.gl/fk2Y1ujsnXuctkpL9?g_st=ac" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-[#5A181C] hover:bg-[#451215] text-[#EADCD2] font-bold py-3.5 px-6 rounded-2xl text-center shadow-lg transition duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {t[lang].mapBtn}
            </a>
            <a 
              href="https://wa.me/message/KBZOTSKH66H4P1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-[#4A3B3C] hover:bg-[#32201D] text-[#EADCD2] font-bold py-3.5 px-6 rounded-2xl text-center shadow-lg transition duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {t[lang].whatsappBtn}
            </a>
          </div>
        </section>

      </div>

    </main>
  )
}