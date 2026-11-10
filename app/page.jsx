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
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  const [chamberStatusText, setChamberStatusText] = useState('')
  const [showChamberClosedModal, setShowChamberClosedModal] = useState(false)
  const [chamberNotice, setChamberNotice] = useState({
    isClosed: false,
    titleBn: 'জরুরি নোটিশ: চেম্বার বন্ধ সংক্রান্ত',
    titleEn: 'Important Notice: Chamber Closure',
    messageBn: '',
    messageEn: ''
  })

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showPopupBooking, setShowPopupBooking] = useState(false)
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
    const checkChamberStatus = () => {
      const now = new Date()
      const day = now.getDay()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const currentTimeInMinutes = hours * 60 + minutes

      const isOpenTime = day !== 5 && currentTimeInMinutes >= 960 && currentTimeInMinutes <= 1260

      if (lang === 'bn') {
        setChamberStatusText(isOpenTime ? '🟢 চেম্বার এখন চালু রয়েছে' : '🔴 চেম্বার বর্তমানে বন্ধ রয়েছে')
      } else {
        setChamberStatusText(isOpenTime ? '🟢 Chamber is currently OPEN' : '🟢 Chamber is currently CLOSED')
      }
    }

    checkChamberStatus()
    const interval = setInterval(checkChamberStatus, 60000)

    const savedTheme = localStorage.getItem('theme')
    const isDark = savedTheme === 'dark'
    setDarkMode(isDark)

    fetchBookingsCount()
    fetchLiveNotice()

    return () => clearInterval(interval)
  }, [lang])

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
    const nextMode = !darkMode
    setDarkMode(nextMode)
    localStorage.setItem('theme', nextMode ? 'dark' : 'light')
  }

  const themeStyles = darkMode ? {
    bgMain: '#0f172a',
    cardBg: '#1e293b',
    textColor: '#f8fafc',
    subTextColor: '#94a3b8',
    borderColor: '#334155',
    inputBg: '#334155',
    inputText: '#ffffff'
  } : {
    bgMain: '#f8fafc',
    cardBg: '#ffffff',
    textColor: '#0f172a',
    subTextColor: '#475569',
    borderColor: '#e2e8f0',
    inputBg: '#f1f5f9',
    inputText: '#0f172a'
  }

  const t = {
    bn: {
      heroTitle: 'বিশ্বস্ত ডেন্টাল সেবা ও সুন্দর হাসির নিশ্চয়তা',
      heroSub: 'চট্টগ্রাম মেডিকেল কলেজের অভিজ্ঞ চিকিৎসকের নিবিড় তত্ত্বাবধানে সর্বাধুনিক ডেন্টাল কেয়ার।',
      title: 'ডাঃ আসির মোসাদ্দেক সাকিব',
      subtitle: 'ওরাল এন্ড ডেন্টাল সার্জন',
      doctorInfo: 'বিডিএস (চট্টগ্রাম মেডিকেল কলেজ)\nবিএমডিসি রেজি. ৮২৬৩',
      addressText: 'আলম মেডিকেল হল, পটিয়া সরকারি কলেজ সংলগ্ন আনোয়ারা বিকল্প সড়ক, বাস স্টেশন, পটিয়া, চট্টগ্রাম।',
      bookingMainBtn: 'অ্যাপয়েন্টমেন্ট বুক করুন',
      bookingCloseBtn: '✕ বন্ধ করুন',
      bookingTitle: 'অনলাইন অ্যাপয়েন্টমেন্ট বুকিং',
      bookingSub: 'শনিবার থেকে বৃহস্পতিবার (বিকাল ৪:০০ টা - রাত ৯:০০ টা), শুক্রবার বন্ধ',
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
      submitBtn: 'অ্যাপয়েন্টমেন্ট সাবমিট করুন',
      submitting: 'জমা দেওয়া হচ্ছে...',
      successTitle: 'অভিনন্দন! বুকিং সফল হয়েছে',
      successMsg: 'আপনার অ্যাপয়েন্টমেন্ট আবেদনটি সফলভাবে জমা হয়েছে! শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।',
      closeModalBtn: 'ঠিক আছে',
      scheduleTitle: 'চেম্বারের সময়সূচি',
      tipsTitle: 'দাঁতের যত্ন ও স্বাস্থ্য টিপস',
      whyUsTitle: 'কেন আপনার জন্য আমরাই?',
      videoTitle: 'দাঁতের যত্ন ও চিকিৎসা বিষয়ক সচেতনতামূলক ভিডিও',
      videoSub: 'দাঁতের বিভিন্ন চিকিৎসা সম্পর্কে বিস্তারিত জানতে নিচের ভিডিওগুলো দেখুন।'
    },
    en: {
      heroTitle: 'Trustworthy Dental Services for a Healthy Smile',
      heroSub: 'Advanced dental treatment under the expert care of Chattogram Medical College surgeon.',
      title: 'Dr. Asir Mosaddeque Sakib',
      subtitle: 'Oral & Dental Surgeon',
      doctorInfo: 'BDS (Chittagong Medical College)\nBMDC reg. 8263',
      addressText: 'Alam Medical Hall, Beside Patiya Govt. College, Anwara Bypass Road, Bus Station, Patiya, Chattogram.',
      bookingMainBtn: 'Book an Appointment',
      bookingCloseBtn: '✕ Close',
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
      tipsTitle: 'Dental Care & Health Tips',
      whyUsTitle: 'Why Choose Us?',
      videoTitle: 'Dental Care & Treatment Awareness Videos',
      videoSub: 'Watch the videos below to learn more about various dental treatments.'
    }
  }

  const rawTimes = lang === 'bn' ? [
    "বিকাল ৪:০০ টা", "বিকাল ৪:৩০ টা",
    "বিকাল ৫:০০ টা", "বিকাল ৫:৩০ টা",
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

      setShowSuccessModal(true)
      setShowPopupBooking(false)

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

  const tipsList = [
    {
      id: 'tips-01',
      textBn: 'দিনে অন্তত দুইবার ফ্লোরাইডযুক্ত টুথপেস্ট দিয়ে ভালোভাবে দাঁত ব্রাশ করুন।',
      textEn: 'Brush your teeth thoroughly at least twice a day with fluoride toothpaste.'
    },
    {
      id: 'tips-02',
      textBn: 'প্রতিদিন নিয়মিত ডেন্টাল ফ্লস ব্যবহার করে দাঁতের ফাঁকে জমে থাকা ময়লা পরিষ্কার রাখুন।',
      textEn: 'Use dental floss daily to clean food particles trapped between teeth.'
    },
    {
      id: 'tips-03',
      textBn: 'চিনিযুক্ত খাবার ও মিষ্টি খাওয়ার পর কুলি করার অভ্যাস গড়ে তুলুন।',
      textEn: 'Develop a habit of rinsing your mouth after consuming sugary foods.'
    },
    {
      id: 'tips-04',
      textBn: 'ছয় মাস পর পর নিয়মিত ডেন্টাল সার্জনের কাছে গিয়ে দাঁত চেকআপ করান।',
      textEn: 'Visit your dental surgeon regularly every six months for a checkup.'
    },
    {
      id: 'tips-05',
      textBn: 'ধূমপান ও পান-সুপারি থেকে বিরত থাকুন, যা দাঁতের মাড়ির মারাত্মক ক্ষতি করে।',
      textEn: 'Avoid smoking and betel nut, which severely damage your gums and teeth.'
    },
    {
      id: 'tips-06',
      textBn: 'দাঁতে কোনো ধরনের ব্যথা বা সংবেদনশীলতা অনুভব করলেই দ্রুত চিকিৎসকের পরামর্শ নিন।',
      textEn: 'Consult a doctor immediately if you experience any tooth pain or sensitivity.'
    }
  ]

  const featureBoxes = lang === 'bn' ? [
    {
      title: 'আধুনিক ডেন্টাল কেয়ার',
      description: 'সর্বাধুনিক যন্ত্রপাতি ও নিরাপদ উপায়ে পেইনলেস ডেন্টাল ট্রিটমেন্ট নিশ্চিত করা হয়।',
      bgImage: '/why-01.jpeg',
      stepClass: 'md:mr-24 lg:mr-36'
    },
    {
      title: 'জীবাণুমুক্ত পরিবেশ',
      description: 'অটোক্লেভ ও উন্নত স্টেরিলাইজেশন প্রযুক্তির মাধ্যমে শতভাগ সংক্রমণমুক্ত পরিবেশ।',
      bgImage: '/why-02.jpeg',
      stepClass: 'md:mx-12 lg:mx-20'
    },
    {
      title: 'অভিজ্ঞ কনসালটেশন',
      description: 'চট্টগ্রাম মেডিকেল কলেজের অভিজ্ঞ চিকিৎসকের নিবিড় তত্ত্বাবধানে সঠিক রোগ নির্ণয়।',
      bgImage: '/why-03.jpeg',
      stepClass: 'md:ml-24 lg:ml-36'
    }
  ] : [
    {
      title: 'Modern Dental Care',
      description: 'Ensuring painless dental treatment using advanced equipment and safe procedures.',
      bgImage: '/why-01.jpeg',
      stepClass: 'md:mr-24 lg:mr-36'
    },
    {
      title: 'Sterilized Environment',
      description: '100% infection-free environment through autoclave and advanced sterilization technology.',
      bgImage: '/why-02.jpeg',
      stepClass: 'md:mx-12 lg:mx-20'
    },
    {
      title: 'Expert Consultation',
      description: 'Accurate diagnosis under the close supervision of an experienced surgeon.',
      bgImage: '/why-03.jpeg',
      stepClass: 'md:ml-24 lg:ml-36'
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
      className="min-h-screen transition-all duration-300 font-sans"
      style={{ backgroundColor: themeStyles.bgMain, color: themeStyles.textColor }}
    >
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 18s linear infinite;
        }
      `}</style>

      {/* ১ ও ২. টপ নোটিশ ও স্থির চেম্বার টাইম বার */}
      <div className="bg-[#0c1e3e] text-white text-[11px] md:text-sm py-2 px-3 md:px-12 flex flex-col gap-1 border-b border-blue-900/50">
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="animate-marquee inline-flex items-center gap-1.5 font-medium">
            <span>📍</span>
            <span>{t[lang].addressText}</span>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-blue-800/60 pt-1 text-[11px] md:text-xs">
          <div className="flex items-center gap-1 text-cyan-300 font-semibold">
            <span>🕒</span>
            <span>{lang === 'bn' ? 'চেম্বার খোলা: শনি - বৃহস্পতি (বিকাল ৪:০০ - রাত ৯:০০), শুক্রবার বন্ধ' : 'Chamber Open: Sat - Thu (4:00 PM - 9:00 PM), Friday Closed'}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <a 
              href="https://www.facebook.com/share/1ZfF826KUs/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center overflow-hidden transition shadow-sm p-1.5"
              title="Facebook"
            >
              <img src="/facebook.png" alt="FB" className="w-full h-full object-cover rounded-full" />
            </a>
            <a 
              href="https://www.instagram.com/sakib.cmc?exln=MXQ0N214dDNyaTU4ZQ==" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center overflow-hidden transition shadow-sm p-1.5"
              title="Instagram"
            >
              <img src="/instagram.png" alt="IG" className="w-full h-full object-cover rounded-full" />
            </a>
            <a 
              href="https://wa.me/message/KBZOTSKH66H4P1" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center overflow-hidden transition shadow-sm p-1.5"
              title="WhatsApp"
            >
              <img src="/whatsapp.png" alt="WhatsApp" className="w-full h-full object-cover rounded-full" />
            </a>
          </div>
        </div>
      </div>

      {/* ৩. ন্যাভিগেশন বার */}
      <header 
        className="sticky top-0 z-50 px-3 md:px-12 py-3 shadow-md flex items-center justify-between border-b transition-all duration-300 backdrop-blur-md"
        style={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', borderColor: themeStyles.borderColor }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#00a8e8] text-white flex items-center justify-center text-lg md:text-xl font-bold shadow-md">
            🦷
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm sm:text-base md:text-xl tracking-tight whitespace-nowrap" style={{ color: themeStyles.textColor }}>
              {t[lang].title}
            </span>
            <span className="text-[9px] md:text-[10px] font-semibold text-[#00a8e8] uppercase tracking-wider">
              {t[lang].subtitle}
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8 font-bold text-sm" style={{ color: themeStyles.textColor }}>
          <a href="/" className="text-[#00a8e8] transition">{lang === 'bn' ? 'হোম' : 'Home'}</a>
          <a href="#about-section" className="hover:text-[#00a8e8] transition">{lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</a>
          <a href="/services" className="hover:text-[#00a8e8] transition">{lang === 'bn' ? 'সার্ভিস সমূহ' : 'Services'}</a>
          <a href="/gallery" className="hover:text-[#00a8e8] transition">{lang === 'bn' ? 'গ্যালারি' : 'Gallery'}</a>
          <button 
            onClick={() => setIsContactModalOpen(true)}
            className="hover:text-[#00a8e8] transition bg-transparent border-none cursor-pointer font-bold text-sm"
            style={{ color: themeStyles.textColor }}
          >
            {lang === 'bn' ? 'যোগাযোগ' : 'Contact Us'}
          </button>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <a href="tel:+8801816011701" className="hidden sm:flex items-center gap-2 font-bold text-sm text-[#00a8e8]">
            <span className="w-8 h-8 rounded-full bg-[#00a8e8]/10 flex items-center justify-center text-base">📞</span>
            <span>+880 1816 011 701</span>
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="font-bold px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg border text-xs cursor-pointer"
              style={{ borderColor: themeStyles.borderColor }}
            >
              {lang === 'bn' ? 'English' : 'বাংলা'}
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 md:p-2 rounded-lg border text-xs cursor-pointer"
              style={{ borderColor: themeStyles.borderColor }}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            <button 
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-2xl p-1 cursor-pointer focus:outline-none"
              style={{ color: themeStyles.textColor }}
              aria-label="Mobile Menu Toggle"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* মোবাইল ড্রপডাউন মেনু */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden px-6 py-4 space-y-3 border-b shadow-lg transition-all duration-300"
          style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.borderColor }}
        >
          <a 
            href="/" 
            onClick={() => setMobileMenuOpen(false)} 
            className="block py-2 font-bold text-sm border-b" 
            style={{ borderColor: themeStyles.borderColor, color: themeStyles.textColor }}
          >
            {lang === 'bn' ? 'হোম' : 'Home'}
          </a>
          <a 
            href="#about-section" 
            onClick={() => setMobileMenuOpen(false)} 
            className="block py-2 font-bold text-sm border-b" 
            style={{ borderColor: themeStyles.borderColor, color: themeStyles.textColor }}
          >
            {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
          </a>
          <a 
            href="/services" 
            onClick={() => setMobileMenuOpen(false)} 
            className="block py-2 font-bold text-sm border-b" 
            style={{ borderColor: themeStyles.borderColor, color: themeStyles.textColor }}
          >
            {lang === 'bn' ? 'সার্ভিস সমূহ' : 'Services'}
          </a>
          <a 
            href="/gallery" 
            onClick={() => setMobileMenuOpen(false)} 
            className="block py-2 font-bold text-sm border-b" 
            style={{ borderColor: themeStyles.borderColor, color: themeStyles.textColor }}
          >
            {lang === 'bn' ? 'গ্যালারি' : 'Gallery'}
          </a>
          <button 
            onClick={() => {
              setMobileMenuOpen(false)
              setIsContactModalOpen(true)
            }}
            className="w-full text-left py-2 font-bold text-sm bg-transparent border-none cursor-pointer"
            style={{ color: themeStyles.textColor }}
          >
            {lang === 'bn' ? 'যোগাযোগ' : 'Contact Us'}
          </button>
        </div>
      )}

      {/* ৪. হিরো সেকশন */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0d2857] via-[#0b3c85] to-[#0077b6] text-white py-10 lg:py-20 px-4 md:px-12">
        <div className="max-w-7xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs md:text-sm font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{chamberNotice.isClosed ? (lang === 'bn' ? chamberNotice.messageBn : chamberNotice.messageEn) : chamberStatusText}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative w-64 h-[340px] md:w-80 md:h-96 lg:w-96 lg:h-[420px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-[#071630]">
              <img src="/doctor.jpeg" alt="Dr. Asir Mosaddeque Sakib" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071630] via-transparent to-transparent opacity-40"></div>
              
              <div className="absolute bottom-2 left-3 right-3 p-3.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 space-y-0.5">
                <h3 className="font-bold text-sm md:text-base text-white">{t[lang].title}</h3>
                <p className="text-[11px] text-cyan-300 font-medium whitespace-pre-line">{t[lang].doctorInfo}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2 text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-300 bg-cyan-900/40 px-3.5 py-1.5 rounded-full border border-cyan-500/30">
              {t[lang].subtitle}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight drop-shadow-md">
              {t[lang].heroTitle}
            </h1>
            <p className="text-base md:text-lg text-cyan-100/90 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t[lang].heroSub}
            </p>
            
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => setShowPopupBooking(true)}
                className="px-8 py-4 rounded-full bg-[#00a8e8] hover:bg-[#008fca] text-white font-extrabold shadow-lg shadow-cyan-900/40 transition transform hover:-translate-y-0.5 cursor-pointer text-sm md:text-base"
              >
                {t[lang].bookingMainBtn}
              </button>
              <a
                href="#about-section"
                className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold border border-white/30 backdrop-blur-md transition text-sm md:text-base"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ৫. পপ-আপ বুকিং ফর্ম */}
      {showPopupBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div 
            className="max-w-xl w-full p-6 md:p-8 rounded-3xl shadow-2xl border relative my-8"
            style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.borderColor }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2" style={{ color: themeStyles.textColor }}>
                <span>📅</span> {t[lang].bookingTitle}
              </h2>
              <button onClick={() => setShowPopupBooking(false)} className="font-bold text-lg p-2 rounded-full opacity-70 hover:opacity-100" style={{ color: themeStyles.textColor }}>
                ✕
              </button>
            </div>
            <p className="font-semibold mb-6 text-xs md:text-sm" style={{ color: themeStyles.subTextColor }}>
              {t[lang].bookingSub}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1" style={{ color: themeStyles.textColor }}>{t[lang].patientName}</label>
                  <input 
                    type="text" 
                    name="patient_name" 
                    value={formData.patient_name} 
                    onChange={handleChange} 
                    required 
                    placeholder={t[lang].patientNamePlaceholder} 
                    className="w-full px-4 py-2.5 rounded-xl outline-none border" 
                    style={{ backgroundColor: themeStyles.inputBg, color: themeStyles.inputText, borderColor: themeStyles.borderColor }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: themeStyles.textColor }}>{t[lang].ageLabel}</label>
                  <input 
                    type="number" 
                    name="age" 
                    value={formData.age} 
                    onChange={handleChange} 
                    required 
                    min="1" 
                    max="120" 
                    placeholder={t[lang].agePlaceholder} 
                    className="w-full px-4 py-2.5 rounded-xl outline-none border" 
                    style={{ backgroundColor: themeStyles.inputBg, color: themeStyles.inputText, borderColor: themeStyles.borderColor }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: themeStyles.textColor }}>{t[lang].phoneLabel}</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                  placeholder="017XXXXXXXX" 
                  className="w-full px-4 py-2.5 rounded-xl outline-none border" 
                  style={{ backgroundColor: themeStyles.inputBg, color: themeStyles.inputText, borderColor: themeStyles.borderColor }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: themeStyles.textColor }}>{t[lang].serviceLabel}</label>
                <select 
                  name="service" 
                  value={formData.service} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 rounded-xl outline-none border font-medium cursor-pointer" 
                  style={{ backgroundColor: themeStyles.inputBg, color: themeStyles.inputText, borderColor: themeStyles.borderColor }}
                >
                  <option value="">{t[lang].serviceDefault}</option>
                  <option value={t[lang].service1}>{t[lang].service1}</option>
                  <option value={t[lang].service2}>{t[lang].service2}</option>
                  <option value={t[lang].service3}>{t[lang].service3}</option>
                  <option value={t[lang].service4}>{t[lang].service4}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: themeStyles.textColor }}>{t[lang].dateLabel}</label>
                <select 
                  name="appointment_date" 
                  value={formData.appointment_date} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 rounded-xl outline-none border font-medium cursor-pointer" 
                  style={{ backgroundColor: themeStyles.inputBg, color: themeStyles.inputText, borderColor: themeStyles.borderColor }}
                >
                  <option value="">{t[lang].dateDefault}</option>
                  {availableDates.map((item, index) => (
                    <option key={index} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: themeStyles.textColor }}>{t[lang].timeLabel}</label>
                <select 
                  name="appointment_time" 
                  value={formData.appointment_time} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 rounded-xl outline-none border font-medium cursor-pointer" 
                  style={{ backgroundColor: themeStyles.inputBg, color: themeStyles.inputText, borderColor: themeStyles.borderColor }}
                >
                  <option value="">{t[lang].timeDefault}</option>
                  {rawTimes.map((time, index) => {
                    const slotKey = `${formData.appointment_date}|${time}`
                    const count = bookedSlotsCount[slotKey] || 0
                    const isFull = count >= 2
                    const fullText = lang === 'bn' ? '(বুকড)' : '(Full)'
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
                className="w-full font-bold py-3.5 px-6 rounded-xl transition duration-200 shadow-lg cursor-pointer text-white bg-[#00a8e8] hover:bg-[#008fca]"
              >
                {loading ? t[lang].submitting : t[lang].submitBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ৬. স্থায়ী About Us সেকশন */}
      <section 
        id="about-section" 
        className="max-w-7xl mx-auto my-12 p-6 md:p-10 rounded-3xl border shadow-sm space-y-4 transition-all duration-300"
        style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.borderColor }}
      >
        <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: themeStyles.textColor }}>
          {lang === 'bn' ? 'আমাদের সম্পর্কে (About Us)' : 'About Us'}
        </h2>
        <div className="space-y-3 text-sm md:text-base leading-relaxed" style={{ color: themeStyles.subTextColor }}>
          <p>
            {lang === 'bn'
              ? 'ডাঃ আসির মোসাদ্দেক সাকিব ডেন্টাল কেয়ারে আপনাকে স্বাগতম। আমরা আধুনিক প্রযুক্তির সাহায্যে রোগীদের সর্বাধুনিক ও নিরাপদ ডেন্টাল সেবা প্রদান করে থাকি। আমাদের চেম্বারে রুট ক্যানাল ট্রিটমেন্ট, জিরকনিয়া ও মেটাল-সিরামিক ক্রাউন, স্কেলিং, দাঁত তোলা এবং কসমেটিক ডেন্টিস্ট্রির আধুনিক চিকিৎসা নিশ্চিত করা হয়।'
              : 'Welcome to Dr. Asir Mosaddeque Sakib Dental Care. We provide advanced and safe dental services using modern technology. Our chamber ensures state-of-the-art treatments including Root Canal Therapy, Zirconia & PFM Crowns, Scaling, Extractions, and Cosmetic Dentistry.'
            }
          </p>
        </div>
      </section>

      {/* ৭. দাঁতের যত্ন ও স্বাস্থ্য টিপস সেকশন */}
      <section className="max-w-7xl mx-auto my-16 px-4 md:px-8">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl md:text-4xl font-black text-[#0E3A5D] dark:text-white">
            {t[lang].tipsTitle}
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
            {lang === 'bn' ? 'সুস্থ ও উজ্জ্বল হাসি ধরে রাখতে অনুসরণ করুন প্রয়োজনীয় কিছু টিপস' : 'Follow these essential tips to maintain a healthy and bright smile.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tipsList.map((item, index) => {
            const isDarkCard = index === 2 || index === 5;
            const isFourthCard = index === 3;

            const headlines = [
              { bn: 'নিয়মিত ব্রাশ করুন', en: 'Brush Regularly' },
              { bn: 'ডেন্টাল ফ্লস ব্যবহার', en: 'Use Dental Floss' },
              { bn: 'মিষ্টি খাবার পর কুলি', en: 'Rinse After Sweets' },
              { bn: 'নিয়মিত চেকআপ', en: 'Regular Checkup' },
              { bn: 'বর্জন করুন', en: 'Avoid Harmful Habits' },
              { bn: 'ব্যাথায় সচেতনতা', en: 'Dental Pain Care' }
            ];

            return (
              <div 
                key={index} 
                className="relative h-72 rounded-2xl overflow-hidden shadow-md border border-slate-200/50 dark:border-slate-800 flex flex-col justify-center items-start p-6 group transition duration-300 hover:shadow-xl bg-white dark:bg-slate-900"
              >
                <img 
                  src={`/tips/${item.id}.jpeg`} 
                  alt={`Dental Tip ${index + 1}`} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    if (!e.target.dataset.triedJpg) {
                      e.target.dataset.triedJpg = "true";
                      e.target.src = `/tips/${item.id}.jpg`;
                    } else {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect fill='%23F4F9F9' width='400' height='250'/%3E%3Ctext fill='%230E3A5D' font-family='sans-serif' font-size='14' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EMissing: " + item.id + "(.jpeg/.jpg)%3E%3C/text%3E%3C/svg%3E";
                    }
                  }}
                />

                <div className="relative z-10 w-1/3 text-left space-y-2">
                  <h3 className={`font-black text-lg md:text-xl tracking-tight drop-shadow-md ${isDarkCard ? 'text-teal-300' : isFourthCard ? 'text-black font-extrabold' : 'text-[#0E3A5D]'}`}
                      style={isFourthCard ? { textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff' } : {}}
                  >
                    {lang === 'bn' ? headlines[index].bn : headlines[index].en}
                  </h3>
                  
                  <p className={`font-bold text-xs md:text-sm leading-relaxed break-words ${isDarkCard ? 'text-white drop-shadow-md' : isFourthCard ? 'text-black' : 'text-slate-900 drop-shadow-md'}`}
                     style={isFourthCard ? { textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff' } : {}}
                  >
                    {lang === 'bn' ? item.textBn : item.textEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ৮. কেন আপনার জন্য আমরাই? - রেক্ট্যাঙ্গেল সিঁড়ির প্যাটার্ন সেকশন */}
      <section className="max-w-7xl mx-auto my-16 px-4 md:px-0">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: themeStyles.textColor }}>
            {t[lang].whyUsTitle}
          </h2>
        </div>

        <div className="space-y-8 md:space-y-10">
          {featureBoxes.map((box, index) => (
            <div 
              key={index} 
              className={`p-1 shadow-2xl bg-gradient-to-r from-[#0c1e3e] via-[#0077b6] to-[#00a8e8] transition-all duration-300 ${box.stepClass}`}
            >
              <div 
                className="relative p-8 md:p-14 min-h-[380px] md:min-h-[440px] flex flex-col justify-end bg-cover bg-center overflow-hidden"
                style={{ backgroundImage: `url(${box.bgImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                
                <div className="relative z-10 space-y-3 text-white">
                  <span className="text-xs font-bold tracking-widest uppercase text-cyan-300 bg-black/60 px-3 py-1 inline-block">
                    0{index + 1}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-black drop-shadow-md">{box.title}</h3>
                  <p className="text-sm md:text-base leading-relaxed text-slate-200 font-medium max-w-2xl drop-shadow-sm">
                    {box.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ৯. সচেতনতামূলক ভিডিও সেকশন */}
      <section 
        id="contact-section"
        className="max-w-7xl mx-auto my-12 p-6 md:p-10 rounded-3xl border shadow-sm space-y-6 transition-all duration-300"
        style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.borderColor }}
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: themeStyles.textColor }}>
            {t[lang].videoTitle}
          </h2>
          <p className="text-xs md:text-sm max-w-2xl mx-auto" style={{ color: themeStyles.subTextColor }}>
            {t[lang].videoSub}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {videoList.map((vid, index) => (
            <div 
              key={index} 
              className="p-4 rounded-2xl border flex flex-col justify-between space-y-3 shadow-sm"
              style={{ backgroundColor: themeStyles.bgMain, borderColor: themeStyles.borderColor }}
            >
              <h4 className="font-bold text-sm" style={{ color: themeStyles.textColor }}>{vid.title}</h4>
              <div className="w-full h-32 rounded-xl flex items-center justify-center text-xs font-medium opacity-80" style={{ backgroundColor: themeStyles.cardBg }}>
                🎬 {lang === 'bn' ? 'ভিডিও শীঘ্রই আসছে' : 'Video Coming Soon'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ১০. প্রফেশনাল ফুটার সেকশন */}
      <footer className="bg-[#0c1e3e] text-slate-300 pt-16 pb-8 border-t border-blue-900/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-blue-900/50">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00a8e8] text-white flex items-center justify-center text-xl font-bold shadow-md">
                🦷
              </div>
              <span className="font-black text-lg text-white tracking-tight">
                {t[lang].title}
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              {lang === 'bn' 
                ? 'আধুনিক প্রযুক্তি ও অভিজ্ঞ চিকিৎসকের নিবিড় তত্ত্বাবধানে নিরাপদ ও পেইনলেস ডেন্টাল কেয়ার নিশ্চিত করা আমাদের লক্ষ্য।' 
                : 'Ensuring safe and painless dental care with modern technology and expert supervision.'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://www.facebook.com/share/1ZfF826KUs/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#00a8e8] flex items-center justify-center overflow-hidden transition shadow-sm p-1.5 text-white"
                title="Facebook"
              >
                <img src="/facebook.png" alt="FB" className="w-full h-full object-cover rounded-full" />
              </a>
              <a 
                href="https://www.instagram.com/sakib.cmc?exln=MXQ0N214dDNyaTU4ZQ==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#00a8e8] flex items-center justify-center overflow-hidden transition shadow-sm p-1.5 text-white"
                title="Instagram"
              >
                <img src="/instagram.png" alt="IG" className="w-full h-full object-cover rounded-full" />
              </a>
              <a 
                href="https://wa.me/message/KBZOTSKH66H4P1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#00a8e8] flex items-center justify-center overflow-hidden transition shadow-sm p-1.5 text-white"
                title="WhatsApp"
              >
                <img src="/whatsapp.png" alt="WhatsApp" className="w-full h-full object-cover rounded-full" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold text-base border-l-4 border-[#00a8e8] pl-3">
              {lang === 'bn' ? 'দ্রুত লিংক' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><a href="/" className="hover:text-[#00a8e8] transition">🏠 {lang === 'bn' ? 'হোম পেজ' : 'Home'}</a></li>
              <li><a href="#about-section" className="hover:text-[#00a8e8] transition">ℹ️ {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</a></li>
              <li><a href="/services" className="hover:text-[#00a8e8] transition">🦷 {lang === 'bn' ? 'সেবাসমূহ' : 'Services'}</a></li>
              <li><a href="/gallery" className="hover:text-[#00a8e8] transition">🖼️ {lang === 'bn' ? 'গ্যালারি' : 'Gallery'}</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold text-base border-l-4 border-[#00a8e8] pl-3">
              {lang === 'bn' ? 'সময়সূচি' : 'Working Hours'}
            </h4>
            <div className="space-y-2 text-xs md:text-sm text-slate-300">
              <p className="flex items-center gap-2">
                <span>📅</span> 
                <span className="font-semibold">{lang === 'bn' ? 'শনিবার - বৃহস্পতিবার:' : 'Sat - Thu:'}</span>
              </p>
              <p className="text-cyan-300 pl-6 font-medium">
                {lang === 'bn' ? 'বিকাল ৪:০০ টা - রাত ৯:০০ টা' : '4:00 PM - 9:00 PM'}
              </p>
              <p className="flex items-center gap-2 pt-2">
                <span>❌</span> 
                <span className="text-rose-400 font-semibold">{lang === 'bn' ? 'শুক্রবার: সম্পূর্ণ বন্ধ' : 'Friday: Closed'}</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold text-base border-l-4 border-[#00a8e8] pl-3">
              {lang === 'bn' ? 'যোগাযোগ' : 'Contact Us'}
            </h4>
            <div className="space-y-3 text-xs md:text-sm">
              <p className="flex items-start gap-2">
                <span className="text-cyan-400">📍</span>
                <span>{t[lang].addressText}</span>
              </p>

              {/* গুগল ম্যাপ লোকেশন বাটন */}
              <div className="pt-1">
                <a 
                  href="https://maps.app.goo.gl/4nNgwj68kE6okDZ96?g_st=ac" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#00a8e8] hover:bg-[#008fca] text-white font-bold px-3.5 py-2 rounded-xl transition shadow-sm text-xs"
                >
                  <span>🗺️</span> 
                  <span>{lang === 'bn' ? 'গুগল ম্যাপে লোকেশন দেখুন' : 'View on Google Maps'}</span>
                </a>
              </div>

              <p className="flex items-center gap-2 pt-1">
                <span className="text-cyan-400">📞</span>
                <a href="tel:+8801816011701" className="hover:text-[#00a8e8] transition font-bold">+880 1816 011 701</a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-cyan-400">✉️</span>
                <a href="mailto:asir.mosaddeque@gmail.com" className="hover:text-[#00a8e8] transition">asir.mosaddeque@gmail.com</a>
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Dr. Sakib Dental Care. All rights reserved.</p>
          <p className="font-medium text-cyan-300">
            developed by own(Dr. Asir Mosaddeque Sakib)
          </p>
        </div>
      </footer>

      {/* যোগাযোগ পপ-আপ মোডাল (মোবাইল ও কম্পিউটার উভয় ভার্সনের জন্য) */}
      {isContactModalOpen && (
        <div 
          onClick={() => setIsContactModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-[#00a8e8] max-w-md w-full relative space-y-6 text-slate-900 dark:text-slate-100"
          >
            {/* ক্লোজ বাটন */}
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-4 right-4 bg-[#00a8e8] text-white hover:bg-[#008fca] font-bold w-9 h-9 rounded-full flex items-center justify-center shadow-md transition cursor-pointer text-base"
            >
              ✕
            </button>

            {/* মোডাল হেডার */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-xl font-extrabold text-[#0E3A5D] dark:text-teal-300">
                {lang === 'bn' ? 'যোগাযোগ ও লোকেশন' : 'Contact & Location'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'bn' ? 'ডাঃ আসির মোসাদ্দেক সাকিব ডেন্টাল কেয়ার' : 'Dr. Asir Mosaddeque Sakib Dental Care'}
              </p>
            </div>

            {/* কন্টেন্ট বডি */}
            <div className="space-y-4 text-sm">
              {/* ঠিকানা */}
              <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-cyan-500 text-lg">📍</span>
                <span>{t[lang].addressText}</span>
              </div>

              {/* গুগল ম্যাপ লোকেশন বাটন */}
              <div>
                <a 
                  href="https://maps.app.goo.gl/4nNgwj68kE6okDZ96?g_st=ac" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#00a8e8] hover:bg-[#008fca] text-white font-bold px-4 py-3 rounded-2xl transition shadow-md text-sm"
                >
                  <span>🗺️</span> 
                  <span>{lang === 'bn' ? 'গুগল ম্যাপে লোকেশন দেখুন' : 'View on Google Maps'}</span>
                </a>
              </div>

              {/* ফোন কল */}
              <div>
                <a 
                  href="tel:+8801816011701" 
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-3 rounded-2xl transition shadow-md text-sm"
                >
                  <span>📞</span> 
                  <span>+880 1816 011 701</span>
                </a>
              </div>

              {/* হোয়াটসঅ্যাপ বাটন */}
              <div>
                <a 
                  href="https://wa.me/message/KBZOTSKH66H4P1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold px-4 py-3 rounded-2xl transition shadow-md text-sm"
                >
                  <span>💬</span> 
                  <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে যোগাযোগ করুন' : 'Chat on WhatsApp'}</span>
                </a>
              </div>

              {/* ইমেইল */}
              <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
                <span>✉️</span>
                <a href="mailto:asir.mosaddeque@gmail.com" className="hover:text-[#00a8e8] transition">asir.mosaddeque@gmail.com</a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* সফল বুকিং মোডাল */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-4 border"
            style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.borderColor, color: themeStyles.textColor }}
          >
            <div className="w-16 h-16 text-white text-3xl rounded-full flex items-center justify-center mx-auto bg-emerald-500">✓</div>
            <h3 className="text-2xl font-black">{t[lang].successTitle}</h3>
            <p className="text-sm leading-relaxed" style={{ color: themeStyles.subTextColor }}>{t[lang].successMsg}</p>
            <button 
              onClick={() => setShowSuccessModal(false)} 
              className="w-full font-bold py-3 rounded-xl transition cursor-pointer text-white bg-[#00a8e8]"
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
            className="p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-4 border"
            style={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.borderColor, color: themeStyles.textColor }}
          >
            <div className="w-16 h-16 text-white text-3xl rounded-full flex items-center justify-center mx-auto bg-amber-500">🔔</div>
            <h3 className="text-2xl font-black text-amber-500">
              {lang === 'bn' ? chamberNotice.titleBn : chamberNotice.titleEn}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: themeStyles.subTextColor }}>
              {lang === 'bn' ? chamberNotice.messageBn : chamberNotice.messageEn}
            </p>
            <button 
              onClick={() => setShowChamberClosedModal(false)} 
              className="w-full font-bold py-3 rounded-xl transition cursor-pointer text-white bg-[#00a8e8]"
            >
              {t[lang].closeModalBtn}
            </button>
          </div>
        </div>
      )}

    </main>
  )
}