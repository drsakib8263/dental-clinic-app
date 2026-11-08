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
      addressText: 'আলম মেডিকেল হল, পটিয়া সরকারি কলেজ সংলগ্ন আনোয়ারা বিকল্প সড়ক, বাস স্টেশন, পটিয়া, চট্টগ্রাম।',
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
      addressText: 'Alam Medical Hall, Beside Patiya Govt. College, Anwara Bypass Road, Bus Station, Patiya, Chattogram.',
      bookingMainBtn: '📅 Book Online Appointment',
      bookingCloseBtn: '✕ Close Form',
      bookingTitle: 'Online Appointment Booking',
      bookingSub: 'Saturday to Thursday (4:30 PM - 9:00 PM), Friday Closed',
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
      tipsTitle: 'Dental Care & Health Tips',
      videoTitle: 'Dental Care & Treatment Awareness Videos',
      videoSub: 'Watch the videos below to learn more about various dental treatments (Root Canal, Extraction, Filling, and Crowns/Caps).'
    }
  }

  const rawTimes = lang === 'bn' ? [
    "বিকেল ৪:৩০ টা",
    "বিকেল ৫:০০ টা", "বিকেল ৫:৩০ টা",
    "সন্ধ্যা ৬:০০ টা", "সন্ধ্যা ৬:৩০ টা",
    "সন্ধ্যা ৭:০০ টা", "সন্ধ্যা ৭:৩০ টা",
    "রাত ৮:০০ টা", "রাত ৮:৩০ টা",
    "রাত ৯:০০ টা"
  ] : [
    "4:30 PM",
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
      className="min-h-screen text-slate-900 relative py-6 px-4 md:px-12 transition-colors duration-200 scroll-smooth"
      style={{ backgroundColor: '#d9dee3' }}
    >
      
      {/* ১. টপ নোটিশ বা ব্যানার */}
      <div 
        className="max-w-7xl mx-auto mb-6 text-slate-900 py-2.5 px-4 rounded-2xl text-center text-xs md:text-sm font-medium tracking-wide shadow-md flex items-center justify-center gap-2 border"
        style={{ backgroundColor: '#d9dee3', borderColor: '#9fb2c6' }}
      >
        <span 
          className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          Notice
        </span>
        <span>
          {lang === 'bn' 
            ? 'এবারে চেম্বার বন্ধের নোটিশ সিঙ্ক্রোনাইজেশন ঠিক হয়েছে। জরুরি ডেন্টাল সেবার জন্য যোগাযোগ করুন।' 
            : 'Chamber closing notice synchronization has been fixed. Contact us for emergency dental care.'}
        </span>
      </div>

      {/* ২. ন্যাভিগেশন বার */}
      <header 
        className="max-w-7xl mx-auto mb-6 sticky top-4 z-50 p-4 md:px-8 rounded-2xl shadow-xl backdrop-blur-md flex items-center justify-between border"
        style={{ backgroundColor: '#d9dee3', borderColor: '#9fb2c6' }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-md"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            🦷
          </div>
          <span 
            className="font-extrabold text-lg md:text-xl tracking-tight"
            style={{ color: '#1a1a1a' }}
          >
            Dr. Sakib Dental Care
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 font-bold text-sm md:text-base" style={{ color: '#1a1a1a' }}>
          <a href="/" className="transition hover:text-slate-600">Home</a>
          <a href="#about-section" className="transition hover:text-slate-600">About us</a>
          <a href="/introduction-to-dentistry" className="transition hover:text-slate-600">Introduction to Dentistry</a>
          <a href="/services" className="transition hover:text-slate-600">Our services</a>
          <a href="/gallery" className="transition hover:text-slate-600">Gallery</a>
          <a href="#contact-section" className="transition hover:text-slate-600">Contact us</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="font-bold px-3.5 py-2 rounded-xl shadow-sm border transition flex items-center gap-1.5 text-xs cursor-pointer select-none"
            style={{ backgroundColor: '#1a1a1a', color: '#d9dee3', borderColor: '#9fb2c6' }}
          >
            <span>{darkMode ? '☀️' : '🌙'}</span>
          </button>

          <button
            type="button"
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="font-extrabold px-4 py-2 rounded-xl shadow-md transition flex items-center gap-1.5 text-xs md:text-sm cursor-pointer select-none text-white"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <span>🌐</span>
            <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-2xl p-2 focus:outline-none"
            style={{ color: '#1a1a1a' }}
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* মোবাইল ড্রপডাউন মেনু */}
      {mobileMenuOpen && (
        <div 
          className="max-w-7xl mx-auto mb-6 md:hidden relative z-50 p-4 rounded-2xl shadow-2xl border space-y-3 font-bold text-sm"
          style={{ backgroundColor: '#d9dee3', borderColor: '#9fb2c6', color: '#1a1a1a' }}
        >
          <a href="/" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 rounded-lg" style={{ backgroundColor: '#1a1a1a', color: '#d9dee3' }}>Home</a>
          <a href="#about-section" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 rounded-lg hover:bg-slate-300">About us</a>
          <a href="/introduction-to-dentistry" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 rounded-lg hover:bg-slate-300">Introduction to Dentistry</a>
          <a href="/services" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 rounded-lg hover:bg-slate-300">Our services</a>
          <a href="/gallery" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 rounded-lg hover:bg-slate-300">Gallery</a>
          <a href="#contact-section" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 rounded-lg hover:bg-slate-300">Contact us</a>
        </div>
      )}

      {/* ৩. স্প্লিট হিরো সেকশন */}
      <section className="max-w-7xl mx-auto mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* বাম কলাম */}
          <div 
            className="p-6 md:p-10 rounded-3xl border shadow-sm flex flex-col justify-between space-y-6"
            style={{ backgroundColor: '#d9dee3', borderColor: '#9fb2c6' }}
          >
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <div 
                  className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden shadow-lg border-2 shrink-0"
                  style={{ borderColor: '#9fb2c6', backgroundColor: '#1a1a1a' }}
                >
                  <img src="/doctor.jpeg" alt="Doctor Profile" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1.5">
                  <span 
                    className="text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1 text-white"
                    style={{ backgroundColor: '#1a1a1a' }}
                  >
                    {lang === 'bn' ? 'ওরাল এন্ড ডেন্টাল সার্জন' : 'Oral & Dental Surgeon'}
                  </span>
                  <h1 
                    className="text-2xl md:text-3xl font-black tracking-tight"
                    style={{ color: '#1a1a1a' }}
                  >
                    {t[lang].title}
                  </h1>
                  <p className="text-xs md:text-sm font-bold" style={{ color: '#0E3A5D' }}>
                    {t[lang].degree}
                  </p>
                  <p className="text-xs font-semibold text-slate-700">
                    {t[lang].bmdc}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3 text-sm text-slate-800" style={{ borderColor: '#9fb2c6' }}>
                <div className="flex items-start gap-3">
                  <span className="text-lg shrink-0">📍</span>
                  <p className="font-medium leading-relaxed">{t[lang].addressText}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg shrink-0">📞</span>
                  <a href="tel:+8801816011701" className="font-bold hover:underline" style={{ color: '#1a1a1a' }}>+880 1816 011 701</a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg shrink-0">✉️</span>
                  <a href="mailto:asir.mosaddeque@gmail.com" className="font-medium hover:underline text-slate-800">asir.mosaddeque@gmail.com</a>
                </div>
              </div>
            </div>

            {/* সোশ্যাল মিডিয়া লোগো ইমেজ সেকশন (public ফোল্ডার থেকে) */}
            <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: '#9fb2c6' }}>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                {lang === 'bn' ? 'সোশ্যাল লিংক:' : 'Connect:'}
              </span>
              <div className="flex items-center gap-3">
                {/* ফেসবুক */}
                <a 
                  href="https://www.facebook.com/share/1ZfF826KUs/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition shadow-sm hover:opacity-90 overflow-hidden p-2" 
                  style={{ backgroundColor: '#1a1a1a' }} 
                  title="Facebook"
                >
                  <img src="/facebook.png" alt="Facebook" className="w-full h-full object-contain filter invert" />
                </a>
                
                {/* ইনস্টাগ্রাম */}
                <a 
                  href="https://www.instagram.com/sakib.cmc?exln=MXQ0N214dDNyaTU4ZQ==" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition shadow-sm hover:opacity-90 overflow-hidden p-2" 
                  style={{ backgroundColor: '#1a1a1a' }} 
                  title="Instagram"
                >
                  <img src="/instagram.png" alt="Instagram" className="w-full h-full object-contain filter invert" />
                </a>
                
                {/* হোয়াটসঅ্যাপ */}
                <a 
                  href="https://wa.me/message/KBZOTSKH66H4P1" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition shadow-sm hover:opacity-90 overflow-hidden p-2" 
                  style={{ backgroundColor: '#1a1a1a' }} 
                  title="WhatsApp"
                >
                  <img src="/whatsapp.png" alt="WhatsApp" className="w-full h-full object-contain filter invert" />
                </a>
              </div>
            </div>
          </div>

          {/* ডান কলাম (চেম্বার শিডিউল) */}
          <div 
            className="p-6 md:p-10 rounded-3xl shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden border"
            style={{ backgroundColor: '#d9dee3', borderColor: '#9fb2c6' }}
          >
            <div className="space-y-4 relative z-10">
              <span 
                className="text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider"
                style={{ backgroundColor: '#1a1a1a' }}
              >
                {lang === 'bn' ? 'সময়সূচি' : 'Office Hours'}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900">
                {lang === 'bn' ? 'রোগী দেখার সময়' : 'Chamber Schedule'}
              </h3>
              <div className="p-4 rounded-2xl border space-y-2 text-sm shadow-sm" style={{ backgroundColor: '#ffffff', borderColor: '#9fb2c6', color: '#1a1a1a' }}>
                <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: '#9fb2c6' }}>
                  <span className="font-semibold">{lang === 'bn' ? 'শনিবার - বৃহস্পতিবার' : 'Sat - Thu'}</span>
                  <span className="font-bold">৪:৩০ PM - ৯:০০ PM</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold">{lang === 'bn' ? 'শুক্রবার' : 'Friday'}</span>
                  <span className="font-bold text-red-600">{lang === 'bn' ? 'বন্ধ' : 'Closed'}</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 space-y-3">
              <button
                type="button"
                onClick={() => setShowBookingBox(!showBookingBox)}
                className="w-full block text-center font-extrabold py-3.5 px-6 rounded-2xl shadow-lg transition duration-200 text-sm md:text-base cursor-pointer text-white"
                style={{ backgroundColor: '#1a1a1a' }}
              >
                {showBookingBox ? t[lang].bookingCloseBtn : t[lang].bookingMainBtn}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ৪. অনলাইন অ্যাপয়েন্টমেন্ট বুকিং বক্স */}
      {showBookingBox && (
        <section 
          id="booking-section" 
          className="max-w-3xl mx-auto mb-10 p-6 md:p-10 rounded-3xl shadow-2xl border relative z-10"
          style={{ backgroundColor: '#d9dee3', borderColor: '#9fb2c6' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 text-center flex items-center gap-2 mx-auto">
              <span>📅</span> {t[lang].bookingTitle}
            </h2>
            <button onClick={() => setShowBookingBox(false)} className="text-slate-700 hover:text-slate-900 font-bold text-lg p-1">
              ✕
            </button>
          </div>
          <p className="font-semibold text-center mb-6 text-xs md:text-sm text-slate-700">
            {t[lang].bookingSub}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-800 mb-1">{t[lang].patientName}</label>
                <input 
                  type="text" 
                  name="patient_name" 
                  value={formData.patient_name} 
                  onChange={handleChange} 
                  required 
                  placeholder={t[lang].patientNamePlaceholder} 
                  className="w-full px-4 py-2.5 rounded-xl outline-none text-slate-900 bg-white border border-slate-300" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">{t[lang].ageLabel}</label>
                <input 
                  type="number" 
                  name="age" 
                  value={formData.age} 
                  onChange={handleChange} 
                  required 
                  min="1" 
                  max="120" 
                  placeholder={t[lang].agePlaceholder} 
                  className="w-full px-4 py-2.5 rounded-xl outline-none text-slate-900 bg-white border border-slate-300" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">{t[lang].phoneLabel}</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
                placeholder="017XXXXXXXX" 
                className="w-full px-4 py-2.5 rounded-xl outline-none text-slate-900 bg-white border border-slate-300" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">{t[lang].serviceLabel}</label>
              <select 
                name="service" 
                value={formData.service} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 rounded-xl outline-none text-slate-900 font-medium cursor-pointer bg-white border border-slate-300" 
              >
                <option value="">{t[lang].serviceDefault}</option>
                <option value={t[lang].service1}>{t[lang].service1}</option>
                <option value={t[lang].service2}>{t[lang].service2}</option>
                <option value={t[lang].service3}>{t[lang].service3}</option>
                <option value={t[lang].service4}>{t[lang].service4}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">{t[lang].dateLabel}</label>
              <select 
                name="appointment_date" 
                value={formData.appointment_date} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 rounded-xl outline-none text-slate-900 font-medium cursor-pointer bg-white border border-slate-300" 
              >
                <option value="">{t[lang].dateDefault}</option>
                {availableDates.map((item, index) => (
                  <option key={index} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">{t[lang].timeLabel}</label>
              <select 
                name="appointment_time" 
                value={formData.appointment_time} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 rounded-xl outline-none text-slate-900 font-medium cursor-pointer bg-white border border-slate-300" 
              >
                <option value="">{t[lang].timeDefault}</option>
                {rawTimes.map((time, index) => {
                  const slotKey = `${formData.appointment_date}|${time}`
                  const count = bookedSlotsCount[slotKey] || 0
                  const isFull = count >= 2
                  const fullText = lang === 'bn' ? '(এই সময়ে এপয়েন্টমেন্ট খালি নেই)' : '(Fully Booked)'
                  const bookedText = lang === 'bn' ? `(বুকড: ${count}/২)` : `(Booked: ${count}/2)`
                  return (
                    <option key={index} value={time} disabled={isFull} style={{ color: isFull ? 'red' : 'inherit' }}>
                      {time} {isFull ? fullText : bookedText}
                    </option>
                  )
                })}
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full font-bold py-3.5 px-6 rounded-xl transition duration-200 shadow-lg cursor-pointer text-white"
              style={{ backgroundColor: '#1a1a1a' }}
            >
              {loading ? t[lang].submitting : t[lang].submitBtn}
            </button>
          </form>
        </section>
      )}

      {/* ৫. স্থায়ী About Us সেকশন */}
      <section 
        id="about-section" 
        className="max-w-7xl mx-auto mb-10 p-6 md:p-10 rounded-3xl border shadow-sm space-y-4"
        style={{ backgroundColor: '#d9dee3', borderColor: '#9fb2c6' }}
      >
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
          {lang === 'bn' ? 'আমাদের সম্পর্কে (About Us)' : 'About Us'}
        </h2>
        <div className="space-y-3 text-slate-800 text-sm md:text-base leading-relaxed">
          <p>
            {lang === 'bn'
              ? 'ডাঃ আসির মোসাদ্দেক সাকিব ডেন্টাল কেয়ারে আপনাকে স্বাগতম। আমরা আধুনিক প্রযুক্তির সাহায্যে রোগীদের সর্বাধুনিক ও নিরাপদ ডেন্টাল সেবা প্রদান করে থাকি। আমাদের চেম্বারে রুট ক্যানাল ট্রিটমেন্ট, জিরকনিয়া ও মেটাল-সিরামিক ক্রাউন, স্কেলিং, দাঁত তোলা এবং কসমেটিক ডেন্টিস্ট্রির আধুনিক চিকিৎসা নিশ্চিত করা হয়।'
              : 'Welcome to Dr. Asir Mosaddeque Sakib Dental Care. We provide advanced and safe dental services using modern technology. Our chamber ensures state-of-the-art treatments including Root Canal Therapy, Zirconia & PFM Crowns, Scaling, Extractions, and Cosmetic Dentistry.'
            }
          </p>
        </div>
      </section>

      {/* ৬. দাঁতের যত্ন ও স্বাস্থ্য টিপস */}
      <section className="max-w-7xl mx-auto mb-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            {t[lang].tipsTitle}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dentalTips.map((tip, index) => (
            <div 
              key={index} 
              className="p-6 rounded-3xl border shadow-sm space-y-3"
              style={{ backgroundColor: '#d9dee3', borderColor: '#9fb2c6' }}
            >
              <span className="text-3xl block">{tip.icon}</span>
              <h3 className="text-lg font-bold text-slate-900">{tip.title}</h3>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed">{tip.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ৭. সচেতনতামূলক ভিডিও সেকশন */}
      <section 
        id="contact-section"
        className="max-w-7xl mx-auto mb-10 p-6 md:p-10 rounded-3xl border shadow-sm space-y-6"
        style={{ backgroundColor: '#d9dee3', borderColor: '#9fb2c6' }}
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            {t[lang].videoTitle}
          </h2>
          <p className="text-xs md:text-sm text-slate-700 max-w-2xl mx-auto">
            {t[lang].videoSub}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {videoList.map((vid, index) => (
            <div 
              key={index} 
              className="p-4 rounded-2xl border flex flex-col justify-between space-y-3 bg-white shadow-sm"
              style={{ borderColor: '#9fb2c6', color: '#1a1a1a' }}
            >
              <h4 className="font-bold text-sm text-slate-900">{vid.title}</h4>
              <div className="w-full h-32 rounded-xl flex items-center justify-center text-xs font-medium bg-slate-100 text-slate-700">
                🎬 {lang === 'bn' ? 'ভিডিও শীঘ্রই আসছে' : 'Video Coming Soon'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* সফল বুকিং মোডাল */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-4 border text-slate-900 bg-white"
            style={{ borderColor: '#9fb2c6' }}
          >
            <div className="w-16 h-16 text-white text-3xl rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#1a1a1a' }}>✓</div>
            <h3 className="text-2xl font-black text-slate-900">{t[lang].successTitle}</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{t[lang].successMsg}</p>
            <button 
              onClick={() => setShowSuccessModal(false)} 
              className="w-full font-bold py-3 rounded-xl transition cursor-pointer text-white"
              style={{ backgroundColor: '#1a1a1a' }}
            >
              {t[lang].closeModalBtn}
            </button>
          </div>
        </div>
      )}

      {/* চেম্বার বন্ধ থাকার নোটিশ মোডাল */}
      {showChamberClosedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-4 border text-slate-900 bg-white"
            style={{ borderColor: '#9fb2c6' }}
          >
            <div className="w-16 h-16 text-white text-3xl rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#1a1a1a' }}>🔔</div>
            <h3 className="text-2xl font-black text-amber-600">
              {lang === 'bn' ? chamberNotice.titleBn : chamberNotice.titleEn}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {lang === 'bn' ? chamberNotice.messageBn : chamberNotice.messageEn}
            </p>
            <button 
              onClick={() => setShowChamberClosedModal(false)} 
              className="w-full font-bold py-3 rounded-xl transition cursor-pointer text-white"
              style={{ backgroundColor: '#1a1a1a' }}
            >
              {t[lang].closeModalBtn}
            </button>
          </div>
        </div>
      )}

    </main>
  )
}