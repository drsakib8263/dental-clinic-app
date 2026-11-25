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

  const [isFriday, setIsFriday] = useState(false)
  const [chamberStatusText, setChamberStatusText] = useState('')
  const [isChamberOpenNow, setIsChamberOpenNow] = useState(false)
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

  // পেশেন্ট রিভিউ সাবমিট মোডাল ও স্টেট
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewsList, setReviewsList] = useState([])
  const [reviewForm, setReviewForm] = useState({
    patient_name: '',
    location: '',
    review_text: '',
    rating: 5
  })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  const [customAlert, setCustomAlert] = useState({ show: false, message: '' })

  const [formData, setFormData] = useState({
    patient_name: '',
    age: '',
    phone: '',
    service: '',
    appointment_date: '',
    appointment_time: ''
  })

  const fridayNoticeBn =
    'আমাদের ওয়েবসাইটে আপনাকে স্বাগতম। শুক্রবার আমাদের চেম্বার এর কার্যক্রম সম্পূর্ণ বন্ধ থাকে। আগামীকাল শনিবার সকাল ৭ টা থেকে অনলাইনে এপয়েন্টমেন্ট নেয়া যাবে। ধন্যবাদ।'
  const fridayNoticeEn =
    'Welcome to our website. Our chamber remains completely closed on Friday. Online appointments will be available starting tomorrow, Saturday, at 7:00 AM. Thank you.'

  const fetchBookingsCount = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_date, appointment_time, patient_type')

      if (error) {
        console.error('Error fetching bookings:', error)
        return
      }

      const counts = {}
      data.forEach(item => {
        const key = `${item.appointment_date}|${item.appointment_time}`
        if (!counts[key]) {
          counts[key] = { total: 0, new: 0, old: 0 }
        }
        counts[key].total += 1
        if (item.patient_type === 'new') {
          counts[key].new += 1
        } else {
          counts[key].old += 1
        }
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
        if (data.is_closed && !isFriday) {
          setShowChamberClosedModal(true)
        }
      }
    } catch (err) {
      console.error('Error fetching live notice:', err)
    }
  }

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('patient_reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching reviews:', error)
        return
      }

      if (data && data.length > 0) {
        setReviewsList(data)
      } else {
        setReviewsList([
          {
            patient_name: lang === 'bn' ? 'মোহাম্মদ আলী' : 'Mohammad Ali',
            location: lang === 'bn' ? 'পটিয়া, চট্টগ্রাম' : 'Patiya, Chattogram',
            review_text: lang === 'bn'
              ? 'ডাক্তার সাহেব ভীষণ যত্ন নিয়ে আমার রুট ক্যানাল চিকিৎসা করেছেন। কোনো ধরনের ব্যথা ছাড়াই কাজটি সম্পন্ন হয়েছে।'
              : 'Doctor Sakib took great care during my root canal treatment. It was completely painless.',
            rating: 5,
            created_at: new Date().toISOString()
          }
        ])
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }

  useEffect(() => {
    const checkChamberStatus = (shouldOpenFridayPopup = false) => {
      const now = new Date()
      const bdTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }))

      const day = bdTime.getDay() // 5 = Friday
      const fridayNow = day === 5
      setIsFriday(fridayNow)

      const hours = bdTime.getHours()
      const minutes = bdTime.getMinutes()
      const currentTimeInMinutes = hours * 60 + minutes

      // শুক্রবার বন্ধ; শনি-বৃহস্পতি বিকাল ৪:৩০ (990) থেকে রাত ৯:৩০ (1290) খোলা
      const isOpenTime =
        !fridayNow &&
        currentTimeInMinutes >= 990 &&
        currentTimeInMinutes <= 1290

      setIsChamberOpenNow(isOpenTime)

      if (fridayNow) {
        setChamberStatusText(
          lang === 'bn'
            ? 'আজ শুক্রবার, চেম্বার সম্পূর্ণ বন্ধ রয়েছে'
            : 'Today is Friday, the chamber is completely closed'
        )
        if (shouldOpenFridayPopup) {
          setCustomAlert({
            show: true,
            message: lang === 'bn' ? fridayNoticeBn : fridayNoticeEn
          })
        }
      } else if (lang === 'bn') {
        setChamberStatusText(
          isOpenTime ? 'চেম্বার বর্তমানে খোলা রয়েছে' : 'চেম্বার বর্তমানে বন্ধ রয়েছে'
        )
      } else {
        setChamberStatusText(
          isOpenTime ? 'Chamber is currently open' : 'Chamber is currently closed'
        )
      }
    }

    checkChamberStatus(true)
    const interval = setInterval(() => checkChamberStatus(false), 60000)

    fetchBookingsCount()
    fetchLiveNotice()
    fetchReviews()

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
    today.setHours(0, 0, 0, 0)

    const currentDayOfWeek = today.getDay()

    let saturdayDate = new Date(today)
    if (currentDayOfWeek === 5) {
      saturdayDate.setDate(today.getDate() + 1)
    } else if (currentDayOfWeek === 6) {
      saturdayDate = new Date(today)
    } else {
      saturdayDate.setDate(today.getDate() - (currentDayOfWeek + 1))
    }

    for (let offset = 0; offset < 6; offset++) {
      const d = new Date(saturdayDate)
      d.setDate(saturdayDate.getDate() + offset)
      d.setHours(0, 0, 0, 0)

      const dayOfWeek = d.getDay()

      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const value = `${year}-${month}-${day}`

      const isPast = d < today
      const isToday = d.getTime() === today.getTime()

      let label = ''

      if (lang === 'bn') {
        const bnDayName = daysListBn[dayOfWeek]
        const dayNum = toBengaliNumber(d.getDate())
        const bnMonthName = monthsListBn[d.getMonth()]
        const yearNum = toBengaliNumber(d.getFullYear())

        const dateStr = `${bnDayName}, ${dayNum} ${bnMonthName} ${yearNum}`
        label = isToday ? `আজ (${dateStr})` : isPast ? `${dateStr} (অতিক্রান্ত)` : dateStr
      } else {
        const enDayName = daysListEn[dayOfWeek]
        const dayNum = d.getDate()
        const enMonthName = monthsListEn[d.getMonth()]
        const yearNum = d.getFullYear()

        const dateStr = `${enDayName}, ${enMonthName} ${dayNum}, ${yearNum}`
        label = isToday ? `Today (${dateStr})` : isPast ? `${dateStr} (Passed)` : dateStr
      }

      dates.push({ value, label, isPast })
    }

    setAvailableDates(dates)
  }, [lang])

  const t = {
    bn: {
      heroTitle: 'বিশ্বস্ত ডেন্টাল সেবা ও সুন্দর হাসির নিশ্চয়তা',
      heroSub: 'চট্টগ্রাম মেডিকেল কলেজের অভিজ্ঞ চিকিৎসকের নিবিড় তত্ত্বাবধানে সর্বাধুনিক ডেন্টাল কেয়ার।',
      title: 'ডাঃ আসির মোসাদ্দেক সাকিব',
      subtitle: 'ওরাল এন্ড ডেন্টাল সার্জন',
      doctorInfo: 'বিডিএস (চট্টগ্রাম মেডিকেল কলেজ)\nবিএমডিসি রেজি. ৮২৬৩',
      addressText: 'আলম মেডিকেল হল, পটিয়া কলেজ সংলগ্ন আনোয়ারা বিকল্প সড়ক, বাস স্টেশন, পটিয়া, চট্টগ্রাম।',
      bookingMainBtn: 'অ্যাপয়েন্টমেন্ট বুক করুন',
      learnMoreBtn: 'বিস্তারিত জানুন',
      bookingTitle: 'অনলাইন অ্যাপয়েন্টমেন্ট বুকিং',
      bookingSub: 'শনিবার থেকে বৃহস্পতিবার (বিকাল ৪:৩০ টা - রাত ৯:৩০ টা)',
      patientName: 'রোগীর নাম *',
      patientNamePlaceholder: 'আপনার নাম লিখুন',
      ageLabel: 'বয়স *',
      agePlaceholder: 'যেমন: ৩২ বা ২৫ বছর',
      phoneLabel: 'মোবাইল নম্বর * (১১ ডিজিট)',
      serviceLabel: 'চিকিৎসার ধরণ *',
      serviceDefault: 'চিকিৎসার ধরণ নির্বাচন করুন',
      service1: 'দাঁতের নতুন সমস্যা নিয়ে দেখাব',
      service2: 'দাঁতের চিকিৎসা চলমান রয়েছে',
      service3: 'ওষুধ খাওয়ার পরে আমার চিকিৎসা শুরু হবে',
      service4: 'ওষুধ খাওয়ার পরেও ব্যথা কমছে না',
      dateLabel: 'পছন্দের তারিখ *',
      dateDefault: 'তারিখ নির্বাচন করুন',
      timeLabel: 'পছন্দের সময় *',
      timeDefault: 'সময় নির্বাচন করুন',
      submitBtn: 'অ্যাপয়েন্টমেন্ট সাবমিট করুন',
      submitting: 'জমা দেওয়া হচ্ছে...',
      successTitle: 'অভিনন্দন! বুকিং সফল হয়েছে',
      successMsg: 'আপনার অ্যাপয়েন্টমেন্ট আবেদনটি সফলভাবে জমা হয়েছে! শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।',
      closeModalBtn: 'ঠিক আছে',
      tipsTitle: 'দাঁতের যত্ন ও স্বাস্থ্য টিপস',
      whyUsTitle: 'কেন আপনার জন্য আমরাই?',
      videoTitle: 'দাঁতের যত্ন ও চিকিৎসা বিষয়ক সচেতনতামূলক ভিডিও',
      videoSub: 'দাঁতের বিভিন্ন চিকিৎসা সম্পর্কে বিস্তারিত জানতে নিচের ভিডিওগুলো দেখুন।',
      reviewsTitle: 'রোগীদের রিভিউ ও মতামত',
      reviewsSub: 'আমাদের সেবা গ্রহণকারী সম্মানিত রোগীদের কিছু অভিজ্ঞতা ও মতামত',
      addReviewBtn: 'আপনার রিভিউ বা রেটিং দিন ⭐',
      reviewModalTitle: 'আপনার মূল্যবান মতামত দিন',
      reviewNameLabel: 'আপনার নাম *',
      locationLabel: 'আপনার এলাকা / ঠিকানা',
      ratingLabel: 'রেটিং নির্বাচন করুন *',
      reviewTextLabel: 'আপনার মন্তব্য / রিভিউ *',
      reviewSubmitBtn: 'রিভিউ সাবমিট করুন',
      reviewSubmitting: 'সাবমিট হচ্ছে...',
      bmdcTitle: 'বিএমডিসি রেজিষ্ট্রেশন যাচাইয়ের প্রয়োজনীয়তা',
      bmdcBody:
        'বাংলাদেশ সরকার কর্তৃক সকল বৈধ ও রেজিস্ট্রারড MBBS ও BDS চিকিৎসকদের রেজিষ্ট্রেশন নাম্বার দেয়ার জন্য স্বীকৃত প্রতিষ্ঠান হলো BANGLADESH MEDICAL & DENTAL COUNCIL যাকে সংক্ষেপে BMDC বা BM&DC বলা হয়। বাংলাদেশের সকল বৈধ প্রেকটিশনার বা চিকিৎসকের বিএমডিসি রেজিষ্ট্রেশন নাম্বার থাকা বাধ্যতামূলক। এই নাম্বার ছাড়া সকল প্রকার মেডিকেল ও সার্জিক্যাল চিকিৎসা প্রদান সম্পূর্ণভাবে নিষিদ্ধ ও আইনত দন্ডনীয় অপরাধ। যে কোন MBBS বা BDS ডাক্তারের অবশ্যই BMDC রেজিষ্ট্রেশন নাম্বার থাকবে। এই নাম্বারের সত্যতা যাচাইয়ের জন্য নিচের লিংকে প্রবেশ করে আপনার ডাক্তারের রেজিষ্ট্রেশন নাম্বার লিখে সার্চ করে দেখুন যে সব তথ্য মিল আছে কিনা। দন্ত চিকিৎসকের নাম্বার যাচাইয়ের জন্য BDS এবং মেডিসিন ও সার্জারির চিকিৎসকের নাম্বার যাচাইয়ের জন্য MBBS সিলেক্ট করবেন। এখানের কোন তথ্য মিল না থাকলে বা BMDC রেজিষ্ট্রেশন নাম্বার না থাকলে বুঝতে হবে আপনার সন্ধানকৃত ব্যক্তিটি একজন অবৈধ লাইসেন্সবিহীন প্রেকটিশনার।',
      bmdcBtn: 'BMDC রেজিষ্ট্রেশন নাম্বার যাচাইয়ের লিংক'
    },
    en: {
      heroTitle: 'Trustworthy Dental Services for a Healthy Smile',
      heroSub: 'Advanced dental treatment under the expert care of Chattogram Medical College surgeon.',
      title: 'Dr. Asir Mosaddeque Sakib',
      subtitle: 'Oral & Dental Surgeon',
      doctorInfo: 'BDS (Chittagong Medical College)\nBMDC reg. 8263',
      addressText: 'Alam Medical Hall, Beside Patiya Govt. College, Anwara Bypass Road, Bus Station, Patiya, Chattogram.',
      bookingMainBtn: 'Book an Appointment',
      learnMoreBtn: 'Learn More',
      bookingTitle: 'Online Appointment Booking',
      bookingSub: 'Saturday to Thursday (4:30 PM - 9:30 PM)',
      patientName: 'Patient Name *',
      patientNamePlaceholder: 'Enter your name',
      ageLabel: 'Age *',
      agePlaceholder: 'e.g. 32',
      phoneLabel: 'Mobile Number * (11 Digits)',
      serviceLabel: 'Treatment Type *',
      serviceDefault: 'Select treatment type',
      service1: 'Consulting for new dental issue',
      service2: 'Ongoing dental treatment',
      service3: 'Treatment will start after taking medicine',
      service4: 'Pain persists even after taking medicine',
      dateLabel: 'Select Date *',
      dateDefault: 'Select Date',
      timeLabel: 'Preferred Time *',
      timeDefault: 'Select time',
      submitBtn: 'Book Appointment',
      submitting: 'Submitting...',
      successTitle: 'Congratulations! Booking Successful',
      successMsg: 'Your appointment request has been successfully submitted! We will contact you soon.',
      closeModalBtn: 'OK',
      tipsTitle: 'Dental Care & Health Tips',
      whyUsTitle: 'Why Choose Us?',
      videoTitle: 'Dental Care & Treatment Awareness Videos',
      videoSub: 'Watch the videos below to learn more about various dental treatments.',
      reviewsTitle: 'Patient Reviews & Testimonials',
      reviewsSub: 'Experiences and feedback from our valued patients',
      addReviewBtn: 'Give Your Review & Rating ⭐',
      reviewModalTitle: 'Share Your Valuable Feedback',
      reviewNameLabel: 'Your Name *',
      locationLabel: 'Your Location / Area',
      ratingLabel: 'Select Rating *',
      reviewTextLabel: 'Your Review / Comment *',
      reviewSubmitBtn: 'Submit Review',
      reviewSubmitting: 'Submitting...',
      bmdcTitle: 'Importance of Verifying BMDC Registration',
      bmdcBody:
        'Recognized by the Government of Bangladesh to issue registration numbers to all legitimate and registered MBBS and BDS practitioners is the BANGLADESH MEDICAL & DENTAL COUNCIL, abbreviated as BMDC or BM&DC. Having a BMDC registration number is mandatory for all valid medical and dental practitioners in Bangladesh. Providing medical or surgical treatment without this number is strictly prohibited and a punishable offense by law. Every MBBS or BDS doctor must have a valid BMDC registration number. To verify authenticity, visit the link below, enter the doctor’s registration number, and check if all details match. Select BDS to verify a dental surgeon or MBBS to verify a medicine/surgery practitioner. If no matching record is found or there is no BMDC registration number, the individual is an unlicensed and unauthorized practitioner.',
      bmdcBtn: 'Verify BMDC Registration Number'
    }
  }

  const rawTimes = lang === 'bn' ? [
    "বিকাল ৪:৩০ টা",
    "বিকাল ৫:০০ টা", "বিকাল ৫:৩০ টা",
    "সন্ধ্যা ৬:০০ টা", "সন্ধ্যা ৬:৩০ টা",
    "সন্ধ্যা ৭:০০ টা", "সন্ধ্যা ৭:৩০ টা",
    "রাত ৮:০০ টা", "রাত ৮:৩০ টা",
    "রাত ৯:০০ টা", "রাত ৯:৩০ টা"
  ] : [
    "4:30 PM",
    "5:00 PM", "5:30 PM",
    "6:00 PM", "6:30 PM",
    "7:00 PM", "7:30 PM",
    "8:00 PM", "8:30 PM",
    "9:00 PM", "9:30 PM"
  ]

  const handleOpenBooking = () => {
    if (isFriday) {
      setCustomAlert({
        show: true,
        message: lang === 'bn' ? fridayNoticeBn : fridayNoticeEn
      })
      return
    }

    const now = new Date()
    const bdTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }))
    const currentHour = bdTime.getHours()

    if (currentHour < 7 || currentHour >= 21) {
      setCustomAlert({
        show: true,
        message: lang === 'bn'
          ? 'আমাদের সিরিয়াল নেয়ার সময় -সকাল ৭ টা থেকে রাত ৯ টা পর্যন্ত। অনুগ্রহপূর্বক সকাল ৭ টা থেকে আবার চেষ্টা করবেন। ধন্যবাদ।'
          : 'Our serial booking hours are from 7:00 AM to 9:00 PM. Please try again starting at 7:00 AM. Thank you.'
      })
      return
    }

    setShowPopupBooking(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'service') {
      const isNew = value.includes("নতুন সমস্যা") || value.includes("ব্যথা কমছে না") || value.includes("new dental issue") || value.includes("Pain persists");
      const selectedType = isNew ? 'new' : 'old';

      if (formData.appointment_date && formData.appointment_time) {
        const slotKey = `${formData.appointment_date}|${formData.appointment_time}`;
        const slotData = bookedSlotsCount[slotKey];

        if (slotData) {
          if (slotData.total >= 2) {
            setCustomAlert({
              show: true,
              message: lang === 'bn'
                ? 'দুঃখিত, এই স্লটে ইতোমধ্যে একজন রোগী বুক করেছেন। দয়া করে অন্য একটি সময় বেছে নিন'
                : 'Sorry, this slot is already booked. Please choose another time.'
            });
            return;
          }
          if (selectedType === 'new' && slotData.new >= 1) {
            setCustomAlert({
              show: true,
              message: lang === 'bn'
                ? 'দুঃখিত, এই স্লটে ইতোমধ্যে একজন রোগী বুক করেছেন। দয়া করে অন্য একটি সময় বেছে নিন'
                : 'Sorry, this slot is already booked. Please choose another time.'
            });
            return;
          }
          if (selectedType === 'old' && slotData.old >= 1) {
            setCustomAlert({
              show: true,
              message: lang === 'bn'
                ? 'দুঃখিত, এই স্লটে ইতোমধ্যে একজন রোগী বুক করেছেন। দয়া করে অন্য একটি সময় বেছে নিন'
                : 'Sorry, this slot is already booked. Please choose another time.'
            });
            return;
          }
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isFriday) {
      setCustomAlert({
        show: true,
        message: lang === 'bn' ? fridayNoticeBn : fridayNoticeEn
      })
      setShowPopupBooking(false)
      return
    }

    const now = new Date()
    const bdTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }))
    const currentHour = bdTime.getHours()
    if (currentHour < 7 || currentHour >= 21) {
      setCustomAlert({
        show: true,
        message: lang === 'bn'
          ? 'আমাদের সিরিয়াল নেয়ার সময় -সকাল ৭ টা থেকে রাত ৯ টা পর্যন্ত। অনুগ্রহপূর্বক সকাল ৭ টা থেকে আবার চেষ্টা করবেন। ধন্যবাদ।'
          : 'Our serial booking hours are from 7:00 AM to 9:00 PM. Please try again starting at 7:00 AM. Thank you.'
      });
      setShowPopupBooking(false);
      return;
    }

    if (!formData.patient_name || !formData.phone || !formData.service || !formData.appointment_date || !formData.appointment_time) {
      setCustomAlert({
        show: true,
        message: lang === 'bn' ? 'দয়া করে সব ফিল্ড সঠিকভাবে পূরণ করুন।' : 'Please fill in all required fields.'
      });
      return
    }

    if (formData.phone.length !== 11) {
      setCustomAlert({
        show: true,
        message: lang === 'bn' ? 'মোবাইল নম্বর অবশ্যই ১১ ডিজিটের হতে হবে।' : 'Mobile number must be exactly 11 digits.'
      });
      return
    }

    const slotKey = `${formData.appointment_date}|${formData.appointment_time}`
    const slotData = bookedSlotsCount[slotKey] || { total: 0, new: 0, old: 0 };

    const isNewPatient = formData.service.includes("নতুন সমস্যা") ||
      formData.service.includes("ব্যথা কমছে না") ||
      formData.service.includes("new dental issue") ||
      formData.service.includes("Pain persists");
    const targetType = isNewPatient ? 'new' : 'old';

    if (slotData.total >= 2 || (targetType === 'new' && slotData.new >= 1) || (targetType === 'old' && slotData.old >= 1)) {
      setCustomAlert({
        show: true,
        message: lang === 'bn'
          ? 'দুঃখিত, এই স্লটে ইতোমধ্যে একজন রোগী বুক করেছেন। দয়া করে অন্য একটি সময় বেছে নিন'
          : 'Sorry, this slot is already booked. Please choose another time.'
      });
      return;
    }

    setLoading(true)

    try {
      const patientTypeVal = isNewPatient ? 'নতুন রোগী' : 'পুরাতন রোগী';
      const parsedAge = isNaN(formData.age) ? formData.age : (formData.age ? parseInt(formData.age, 10) : null)

      const { error } = await supabase
        .from('appointments')
        .insert([{
          patient_name: formData.patient_name.trim(),
          age: parsedAge,
          patient_phone: formData.phone.trim(),
          service: formData.service,
          appointment_date: formData.appointment_date,
          appointment_time: formData.appointment_time,
          patient_type: targetType
        }])

      if (error) {
        setCustomAlert({ show: true, message: 'Database Error: ' + error.message });
        setLoading(false)
        return
      }

      const payload = {
        date: formData.appointment_date,
        timeSlot: formData.appointment_time,
        patientType: patientTypeVal,
        patientName: formData.patient_name.trim(),
        patientPhone: formData.phone.trim()
      };

      try {
        await fetch('/api/appointment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (sheetErr) {
        console.error('Google Sheet Sync Error:', sheetErr);
      }

      await fetchBookingsCount();

      setShowSuccessModal(true);
      setShowPopupBooking(false);

      setFormData({
        patient_name: '',
        age: '',
        phone: '',
        service: '',
        appointment_date: '',
        appointment_time: '',
        patient_type: ''
      });

    } catch (err) {
      setCustomAlert({ show: true, message: 'Error: ' + (err.message || err) });
    } finally {
      setLoading(false);
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()

    if (!reviewForm.patient_name || !reviewForm.review_text) {
      setCustomAlert({
        show: true,
        message: lang === 'bn' ? 'দয়া করে নাম এবং রিভিউ এর বিবরণ লিখুন।' : 'Please enter your name and review text.'
      });
      return
    }

    setReviewSubmitting(true)

    try {
      const { error } = await supabase
        .from('patient_reviews')
        .insert([{
          patient_name: reviewForm.patient_name.trim(),
          location: reviewForm.location.trim() || (lang === 'bn' ? 'বাংলাদেশ' : 'Bangladesh'),
          review_text: reviewForm.review_text.trim(),
          rating: parseInt(reviewForm.rating, 10)
        }])

      if (error) {
        setCustomAlert({ show: true, message: 'Review Error: ' + error.message });
      } else {
        setCustomAlert({
          show: true,
          message: lang === 'bn' ? 'আপনার মূল্যবান মতামতের জন্য ধন্যবাদ! রিভিউটি সফলভাবে জমা হয়েছে।' : 'Thank you for your valuable feedback! Your review has been submitted successfully.'
        });
        setShowReviewModal(false)
        setReviewForm({ patient_name: '', location: '', review_text: '', rating: 5 })
        fetchReviews()
      }
    } catch (err) {
      setCustomAlert({ show: true, message: 'Error: ' + (err.message || err) });
    } finally {
      setReviewSubmitting(false)
    }
  }

  const tipsList = [
    { id: 'tips-01', textBn: 'দিনে অন্তত দুইবার ফ্লোরাইডযুক্ত টুথপেস্ট দিয়ে ভালোভাবে দাঁত ব্রাশ করুন।', textEn: 'Brush your teeth thoroughly at least twice a day with fluoride toothpaste.' },
    { id: 'tips-02', textBn: 'প্রতিদিন নিয়মিত ডেন্টাল ফ্লস ব্যবহার করে দাঁতের ফাঁকে জমে থাকা ময়লা পরিষ্কার রাখুন।', textEn: 'Use dental floss daily to clean food particles trapped between teeth.' },
    { id: 'tips-03', textBn: 'চিনিযুক্ত খাবার ও মিষ্টি খাওয়ার পর কুলি করার অভ্যাস গড়ে তুলুন।', textEn: 'Develop a habit of rinsing your mouth after consuming sugary foods.' },
    { id: 'tips-04', textBn: 'ছয় মাস পর পর নিয়মিত ডেন্টাল সার্জনের কাছে গিয়ে দাঁত চেকআপ করান।', textEn: 'Visit your dental surgeon regularly every six months for a checkup.' },
    { id: 'tips-05', textBn: 'ধূমপান ও পান-সুপারি থেকে বিরত থাকুন, যা দাঁতের মাড়ির মারাত্মক ক্ষতি করে।', textEn: 'Avoid smoking and betel nut, which severely damage your gums and teeth.' },
    { id: 'tips-06', textBn: 'দাঁতে কোনো ধরনের ব্যথা বা সংবেদনশীলতা অনুভব করলেই দ্রুত চিকিৎসকের পরামর্শ নিন।', textEn: 'Consult a doctor immediately if you experience any tooth pain or sensitivity.' }
  ]

  const featureBoxes = lang === 'bn' ? [
    { title: 'আধুনিক ডেন্টাল কেয়ার', description: 'সর্বাধুনিক যন্ত্রপাতি ও নিরাপদ উপায়ে পেইনলেস ডেন্টাল ট্রিটমেন্ট নিশ্চিত করা হয়।', bgImage: '/why-01.jpeg', stepClass: 'md:mr-24 lg:mr-36' },
    { title: 'জীবাণুমুক্ত পরিবেশ', description: 'অটোক্লেভ ও উন্নত স্টেরিলাইজেশন প্রযুক্তির মাধ্যমে শতভাগ সংক্রমণমুক্ত পরিবেশ।', bgImage: '/why-02.jpeg', stepClass: 'md:mx-12 lg:mx-20' },
    { title: 'অভিজ্ঞ কনসালটেশন', description: 'চট্টগ্রাম মেডিকেল কলেজের অভিজ্ঞ চিকিৎসকের নিবিড় তত্ত্বাবধানে সঠিক রোগ নির্ণয়।', bgImage: '/why-03.jpeg', stepClass: 'md:ml-24 lg:ml-36' }
  ] : [
    { title: 'Modern Dental Care', description: 'Ensuring painless dental treatment using advanced equipment and safe procedures.', bgImage: '/why-01.jpeg', stepClass: 'md:mr-24 lg:mr-36' },
    { title: 'Sterilized Environment', description: '100% infection-free environment through autoclave and advanced sterilization technology.', bgImage: '/why-02.jpeg', stepClass: 'md:mx-12 lg:mx-20' },
    { title: 'Expert Consultation', description: 'Accurate diagnosis under the close supervision of an experienced surgeon.', bgImage: '/why-03.jpeg', stepClass: 'md:ml-24 lg:ml-36' }
  ]

  const videoList = lang === 'bn' ? [
    { title: 'রুট ক্যানাল ট্রিটমেন্ট প্রক্রিয়া', id: 'YOUR_ROOT_CANAL_VIDEO_ID' },
    { title: 'দাঁত এক্সট্রাকশন (দাঁত তোলা)', id: 'YOUR_EXTRACTION_VIDEO_ID' },
    { title: 'দাঁতের ফিলিং পদ্ধতি', id: 'YOUR_FILLING_VIDEO_ID' },
    { title: 'দাঁতের ক্যাপ ও ক্রাউন সংক্রান্ত', id: 'YOUR_CROWN_VIDEO_ID' }
  ] : [
    { title: 'Root Canal Treatment Procedure', id: 'YOUR_ROOT_CANAL_VIDEO_ID' },
    { title: 'Tooth Extraction Process', id: 'YOUR_EXTRACTION_VIDEO_ID' },
    { title: 'Dental Filling Method', id: 'YOUR_FILLING_VIDEO_ID' },
    { title: 'Dental Crowns & Caps Overview', id: 'YOUR_CROWN_VIDEO_ID' }
  ]

  const inputClass =
    'font-body-ui w-full px-4 py-3 rounded-2xl outline-none border border-[#E6DFD5] bg-[#F7F5F0] text-[#2C2A29] placeholder:text-[#5C5852]/70 focus:border-[#A68A64] transition-colors duration-300'

  const isOpenStatus = !isFriday && !chamberNotice.isClosed && isChamberOpenNow

  return (
    <main
      data-lang={lang}
      className="font-body-ui min-h-screen transition-colors duration-300 bg-[#F7F5F0] text-[#2C2A29] overflow-x-clip"
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@600;700;800&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
      />

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
        .card-3d {
          box-shadow:
            0 12px 24px -8px rgba(44, 42, 41, 0.14),
            0 4px 10px -3px rgba(44, 42, 41, 0.08),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.85),
            inset 0 -3px 0 0 rgba(166, 138, 100, 0.22);
          transform: translateY(0px);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .card-3d:hover {
          transform: translateY(-4px);
          box-shadow:
            0 20px 32px -10px rgba(44, 42, 41, 0.2),
            0 8px 16px -4px rgba(166, 138, 100, 0.18),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.95),
            inset 0 -3px 0 0 rgba(166, 138, 100, 0.38);
        }
      `}</style>

      {/* টপ নোটিশ বার */}
      <div className="bg-[#2C2A29] text-[#D8CFC4] text-[11px] md:text-sm py-2 px-2.5 sm:px-6 md:px-12 flex flex-col gap-1.5 border-b border-[#A68A64]/25">
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="animate-marquee inline-flex items-center gap-1.5 font-medium">
            <span>📍</span>
            <span>{t[lang].addressText}</span>
          </div>
        </div>

        <div className="flex justify-between items-center gap-2 border-t border-white/10 pt-1.5 text-[10px] sm:text-xs">
          <div className="flex items-start sm:items-center gap-1.5 text-[#F7F5F0] font-medium min-w-0">
            <span className="shrink-0 mt-0.5 sm:mt-0">🕒</span>
            {lang === 'bn' ? (
              <span className="leading-snug">
                <span className="block sm:inline">চেম্বার খোলা: শনি - বৃহস্পতি (বিকাল ৪:৩০ - রাত ৯:৩০)</span>
                <span className="hidden sm:inline">, </span>
                <span className="block sm:inline text-[#E6DFD5]">শুক্রবার বন্ধ</span>
              </span>
            ) : (
              <span className="leading-snug">
                <span className="block sm:inline">Chamber Open: Sat - Thu (4:30 PM - 9:30 PM)</span>
                <span className="hidden sm:inline">, </span>
                <span className="block sm:inline text-[#E6DFD5]">Friday Closed</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <a href="https://www.facebook.com/share/1ZfF826KUs/" target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-[#A68A64] flex items-center justify-center overflow-hidden transition-colors duration-300 p-1" title="Facebook">
              <img src="/facebook.png" alt="FB" className="w-full h-full object-cover rounded-full" />
            </a>
            <a href="https://www.instagram.com/sakib.cmc?exln=MXQ0N214dDNyaTU4ZQ==" target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-[#A68A64] flex items-center justify-center overflow-hidden transition-colors duration-300 p-1" title="Instagram">
              <img src="/instagram.png" alt="IG" className="w-full h-full object-cover rounded-full" />
            </a>
            <a href="https://wa.me/message/KBZOTSKH66H4P1" target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-[#A68A64] flex items-center justify-center overflow-hidden transition-colors duration-300 p-1" title="WhatsApp">
              <img src="/whatsapp.png" alt="WhatsApp" className="w-full h-full object-cover rounded-full" />
            </a>
          </div>
        </div>
      </div>

      {/* ন্যাভিগেশন বার (হেডার) */}
      <header className="sticky top-0 z-50 px-2.5 sm:px-6 md:px-12 py-3 md:py-4 bg-[#FCFBF9]/95 backdrop-blur-md border-b border-[#E6DFD5] flex items-center justify-between gap-1.5 transition-colors duration-300">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-[#2C2A29] text-[#F7F5F0] flex items-center justify-center text-sm sm:text-lg border border-[#A68A64]/40">
            🦷
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs sm:text-base md:text-xl tracking-tight truncate text-[#2C2A29]">
              {t[lang].title}
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold text-[#A68A64] uppercase tracking-wider truncate">
              {t[lang].subtitle}
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8 font-medium text-sm text-[#5C5852]">
          <a href="/" className="text-[#2C2A29] font-semibold border-b border-[#A68A64] pb-0.5 transition-colors duration-300">{lang === 'bn' ? 'হোম' : 'Home'}</a>
          <a href="#about-section" className="hover:text-[#A68A64] transition-colors duration-300">{lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</a>
          <a href="/introduction-to-dentistry" className="hover:text-[#A68A64] transition-colors duration-300">{lang === 'bn' ? 'ডেন্টিস্ট্রি সম্পর্কে' : 'About Dentistry'}</a>
          <a href="/services" className="hover:text-[#A68A64] transition-colors duration-300">{lang === 'bn' ? 'সার্ভিস সমূহ' : 'Services'}</a>
          <a href="/gallery" className="hover:text-[#A68A64] transition-colors duration-300">{lang === 'bn' ? 'গ্যালারি' : 'Gallery'}</a>
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="hover:text-[#A68A64] transition-colors duration-300 bg-transparent border-none cursor-pointer font-medium text-sm text-[#5C5852]"
          >
            {lang === 'bn' ? 'যোগাযোগ' : 'Contact Us'}
          </button>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <a href="tel:+8801816011701" className="hidden xl:flex items-center gap-2 font-semibold text-xs md:text-sm text-[#2C2A29] hover:text-[#A68A64] transition-colors duration-300">
            <span className="w-8 h-8 rounded-full bg-[#F7F5F0] border border-[#E6DFD5] flex items-center justify-center text-sm">📞</span>
            <span>+880 1816 011 701</span>
          </a>

          <button
            type="button"
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="font-semibold px-2.5 sm:px-4 py-1.5 sm:py-2 shrink-0 rounded-full border border-[#E6DFD5] bg-[#F7F5F0] hover:border-[#A68A64] text-[#2C2A29] text-[11px] sm:text-xs cursor-pointer transition-colors duration-300"
          >
            {lang === 'bn' ? 'English' : 'বাংলা'}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full border border-[#E6DFD5] bg-[#F7F5F0] text-[#2C2A29] flex items-center justify-center text-base sm:text-lg cursor-pointer focus:outline-none"
            aria-label="Mobile Menu Toggle"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* হেডারের একদম নিচ থেকে শুরু হওয়া চেম্বার স্ট্যাটাস বার */}
      <div className="w-full bg-[#FCFBF9] border-b border-[#E6DFD5] px-2.5 sm:px-6 md:px-12 py-2 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#2C2A29]">
          <span
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0 ${
              isOpenStatus
                ? 'bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20'
                : 'bg-rose-600 ring-4 ring-rose-600/20'
            }`}
          ></span>
          <span>
            {isFriday
              ? lang === 'bn'
                ? 'আজ শুক্রবার, চেম্বার সম্পূর্ণ বন্ধ রয়েছে'
                : 'Today is Friday, the chamber is completely closed'
              : chamberNotice.isClosed
              ? lang === 'bn'
                ? chamberNotice.messageBn || 'চেম্বার বর্তমানে বন্ধ রয়েছে'
                : chamberNotice.messageEn || 'Chamber is currently closed'
              : chamberStatusText}
          </span>
        </div>
      </div>

      {/* মোবাইল ড্রপডাউন মেনু */}
      {mobileMenuOpen && (
        <div className="card-3d lg:hidden fixed inset-x-0 top-[116px] sm:top-[128px] z-50 px-4 sm:px-6 py-4 space-y-2 bg-[#FCFBF9] border-b border-[#E6DFD5] transition-all duration-300 max-h-[75vh] overflow-y-auto">
          <a href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-sm border-b border-[#E6DFD5] text-[#2C2A29]">
            {lang === 'bn' ? 'হোম' : 'Home'}
          </a>
          <a href="#about-section" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-sm border-b border-[#E6DFD5] text-[#5C5852]">
            {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
          </a>
          <a href="/introduction-to-dentistry" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-sm border-b border-[#E6DFD5] text-[#5C5852]">
            {lang === 'bn' ? 'ডেন্টিস্ট্রি সম্পর্কে' : 'About Dentistry'}
          </a>
          <a href="/services" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-sm border-b border-[#E6DFD5] text-[#5C5852]">
            {lang === 'bn' ? 'সার্ভিস সমূহ' : 'Services'}
          </a>
          <a href="/gallery" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-sm border-b border-[#E6DFD5] text-[#5C5852]">
            {lang === 'bn' ? 'গ্যালারি' : 'Gallery'}
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false)
              setIsContactModalOpen(true)
            }}
            className="w-full text-left py-2 font-semibold text-sm bg-transparent border-none cursor-pointer text-[#5C5852]"
          >
            {lang === 'bn' ? 'যোগাযোগ' : 'Contact Us'}
          </button>
        </div>
      )}

      {/* হিরো / ব্যানার সেকশন */}
      <section className="relative w-full min-h-[460px] sm:min-h-[540px] md:min-h-[620px] flex items-center overflow-hidden border-b border-[#E6DFD5] bg-[#121110]">
        <img
          src="/doctor.png"
          alt="Dr. Asir Mosaddeque Sakib"
          className="absolute inset-0 w-full h-full object-cover object-[72%_20%] sm:object-[65%_22%] md:object-right"
        />

        <div
          className="absolute inset-0 bg-gradient-to-l from-black/10 via-black/65 to-black/95 pointer-events-none"
          aria-hidden="true"
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 py-10 sm:py-16 md:py-24">
          <div className="max-w-xl lg:max-w-2xl space-y-4 sm:space-y-6 text-left text-[#F7F5F0]">
            <span className="inline-block text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#E6DFD5] bg-white/10 backdrop-blur-xs px-3.5 py-1 rounded-full border border-white/20">
              {t[lang].subtitle}
            </span>

            <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm">
              {t[lang].heroTitle}
            </h1>

            <p className="text-sm sm:text-base md:text-lg font-medium text-[#E6DFD5]/95 max-w-md sm:max-w-xl leading-relaxed">
              {t[lang].heroSub}
            </p>

            <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2.5 sm:gap-4">
              <button
                onClick={handleOpenBooking}
                className="bg-[#F7F5F0] text-[#2C2A29] hover:bg-[#A68A64] hover:text-white transition-colors duration-300 rounded-full px-5 sm:px-7 py-2.5 sm:py-3.5 font-bold cursor-pointer text-xs sm:text-sm md:text-base shadow-md"
              >
                {t[lang].bookingMainBtn}
              </button>
              <a
                href="#about-section"
                className="px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full bg-black/45 hover:bg-black/70 text-white font-bold border border-white/25 transition-colors duration-300 text-xs sm:text-sm md:text-base backdrop-blur-xs"
              >
                {t[lang].learnMoreBtn}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ডাক্তারের ক্রেডেনশিয়াল স্ট্রিপ */}
      <div className="w-full bg-[#FCFBF9] border-b border-[#E6DFD5] px-4 sm:px-6 md:px-12 py-4 transition-colors duration-300">
        <div className="card-3d max-w-7xl mx-auto rounded-2xl border border-[#E6DFD5] bg-[#F7F5F0]/60 px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 text-left">
          <div>
            <h2 className="font-heading font-bold text-base sm:text-lg md:text-xl text-[#2C2A29]">
              {t[lang].title}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#A68A64]">
              {t[lang].subtitle}
            </p>
          </div>

          <div className="text-xs sm:text-sm text-[#5C5852] md:text-right whitespace-pre-line font-medium">
            {t[lang].doctorInfo}
          </div>
        </div>
      </div>

      {/* পপ-আপ বুকিং ফর্ম */}
      {showPopupBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2A29]/60 backdrop-blur-sm overflow-y-auto">
          <div className="card-3d max-w-xl w-full p-6 md:p-8 rounded-2xl border border-[#E6DFD5] bg-[#FCFBF9] text-[#2C2A29] relative my-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading text-xl md:text-2xl font-bold text-[#2C2A29] flex items-center gap-2">
                <span>📅</span> {t[lang].bookingTitle}
              </h2>
              <button
                onClick={() => setShowPopupBooking(false)}
                className="font-bold text-sm px-3.5 py-1.5 rounded-full border border-[#E6DFD5] bg-[#F7F5F0] hover:bg-[#A68A64] hover:text-[#F7F5F0] text-[#2C2A29] transition-colors duration-300 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="font-medium mb-6 text-xs md:text-sm text-[#5C5852]">
              {t[lang].bookingSub}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1.5 text-[#2C2A29]">{t[lang].patientName}</label>
                  <input
                    type="text"
                    name="patient_name"
                    value={formData.patient_name}
                    onChange={handleChange}
                    required
                    placeholder={t[lang].patientNamePlaceholder}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-[#2C2A29]">{t[lang].ageLabel}</label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    placeholder={t[lang].agePlaceholder}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-[#2C2A29]">{t[lang].phoneLabel}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                    setFormData(prev => ({ ...prev, phone: val }));
                  }}
                  required
                  maxLength="11"
                  placeholder="017XXXXXXXX"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-[#2C2A29]">{t[lang].serviceLabel}</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">{t[lang].serviceDefault}</option>
                  <option value={t[lang].service1}>{t[lang].service1}</option>
                  <option value={t[lang].service2}>{t[lang].service2}</option>
                  <option value={t[lang].service3}>{t[lang].service3}</option>
                  <option value={t[lang].service4}>{t[lang].service4}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-[#2C2A29]">{t[lang].dateLabel}</label>
                <select
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  required
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">{t[lang].dateDefault}</option>
                  {availableDates.map((item, index) => (
                    <option
                      key={index}
                      value={item.value}
                      disabled={item.isPast}
                      className={item.isPast ? 'text-[#5C5852]/50' : ''}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-[#2C2A29]">{t[lang].timeLabel}</label>
                <select
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleChange}
                  required
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">{t[lang].timeDefault}</option>
                  {rawTimes.map((time, index) => {
                    const slotKey = `${formData.appointment_date}|${time}`
                    const slotData = bookedSlotsCount[slotKey] || { total: 0, new: 0, old: 0 }
                    const isFull = slotData.total >= 2

                    return (
                      <option key={index} value={time} disabled={isFull} className={isFull ? 'text-rose-700' : ''}>
                        {time} {isFull ? (lang === 'bn' ? '(বুকড)' : '(Full)') : ''}
                      </option>
                    )
                  })}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] transition-colors duration-300 rounded-full px-7 py-3.5 font-semibold cursor-pointer mt-2"
              >
                {loading ? t[lang].submitting : t[lang].submitBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* কাস্টম নোটিশ মোডাল (শুক্রবার নোটিশ ও অ্যালার্টের জন্য) */}
      {customAlert.show && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-[#2C2A29]/60 backdrop-blur-sm">
          <div className="card-3d p-6 md:p-8 rounded-2xl border border-[#E6DFD5] bg-[#FCFBF9] text-[#2C2A29] max-w-md w-full text-center space-y-5">
            <div className="w-14 h-14 bg-[#F7F5F0] border border-[#E6DFD5] text-[#A68A64] text-2xl rounded-full flex items-center justify-center mx-auto">
              ✦
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-xl font-bold text-[#2C2A29]">
                {lang === 'bn' ? 'মনোযোগ দিন' : 'Attention'}
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-[#5C5852]">
                {customAlert.message}
              </p>
            </div>

            <button
              onClick={() => setCustomAlert({ show: false, message: '' })}
              className="w-full bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] transition-colors duration-300 rounded-full px-7 py-3 font-semibold cursor-pointer"
            >
              {lang === 'bn' ? 'ঠিক আছে' : 'OK'}
            </button>
          </div>
        </div>
      )}

      {/* About Us সেকশন */}
      <section className="py-20 md:py-24 px-4 md:px-8">
        <div
          id="about-section"
          className="card-3d max-w-7xl mx-auto p-8 md:p-12 rounded-2xl border border-[#E6DFD5] bg-[#FCFBF9] space-y-4 transition-colors duration-300"
        >
          <h2 className="font-heading text-2xl md:text-4xl font-bold text-[#2C2A29]">
            {lang === 'bn' ? 'আমাদের সম্পর্কে (About Us)' : 'About Us'}
          </h2>
          <div className="space-y-3 text-sm md:text-base leading-relaxed text-[#5C5852]">
            <p>
              {lang === 'bn'
                ? 'ডাঃ আসির মোসাদ্দেক সাকিব ডেন্টাল কেয়ারে আপনাকে স্বাগতম। আমরা আধুনিক প্রযুক্তির সাহায্যে রোগীদের সর্বাধুনিক ও নিরাপদ ডেন্টাল সেবা প্রদান করে থাকি। আমাদের চেম্বারে রুট ক্যানাল ট্রিটমেন্ট, জিরকনিয়া ও মেটাল-সিরামিক ক্রাউন, স্কেলিং, দাঁত তোলা এবং কসমেটিক ডেন্টিস্ট্রির আধুনিক চিকিৎসা নিশ্চিত করা হয়।'
                : 'Welcome to Dr. Asir Mosaddeque Sakib Dental Care. We provide advanced and safe dental services using modern technology. Our chamber ensures state-of-the-art treatments including Root Canal Therapy, Zirconia & PFM Crowns, Scaling, Extractions, and Cosmetic Dentistry.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* টিপস সেকশন */}
      <section className="py-20 md:py-24 px-4 md:px-8 bg-[#FCFBF9] border-y border-[#E6DFD5] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="font-heading text-2xl md:text-4xl font-bold text-[#2C2A29]">
              {t[lang].tipsTitle}
            </h2>
            <p className="text-sm md:text-base text-[#5C5852]">
              {lang === 'bn' ? 'সুস্থ ও উজ্জ্বল হাসি ধরে রাখতে অনুসরণ করুন প্রয়োজনীয় কিছু টিপস' : 'Follow these essential tips to maintain a healthy and bright smile.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tipsList.map((item, index) => {
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
                  className="card-3d relative h-72 rounded-2xl overflow-hidden border border-[#E6DFD5] bg-[#F7F5F0] flex flex-col justify-center items-start p-6 group transition-colors duration-300"
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
                        e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect fill='%23FCFBF9' width='400' height='250'/%3E%3Ctext fill='%232C2A29' font-family='sans-serif' font-size='14' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EMissing: " + item.id + "(.jpeg/.jpg)%3E%3C/text%3E%3C/svg%3E";
                      }
                    }}
                  />

                  <div className="card-3d relative z-10 w-1/2 text-left space-y-2 p-3 rounded-xl bg-[#FCFBF9]/90 backdrop-blur-xs border border-[#E6DFD5]">
                    <h3 className="font-heading font-bold text-base md:text-lg tracking-tight text-[#2C2A29]">
                      {lang === 'bn' ? headlines[index].bn : headlines[index].en}
                    </h3>

                    <p className="font-medium text-xs leading-relaxed text-[#5C5852]">
                      {lang === 'bn' ? item.textBn : item.textEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* কেন আমাদের পছন্দ করবেন সেকশন */}
      <section className="py-20 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#A68A64]">
              {lang === 'bn' ? 'আমাদের বিশেষত্ব' : 'The Boutique Standard'}
            </span>
            <h2 className="font-heading text-2xl md:text-4xl font-bold text-[#2C2A29]">
              {t[lang].whyUsTitle}
            </h2>
          </div>

          <div className="space-y-8 md:space-y-10">
            {featureBoxes.map((box, index) => (
              <div
                key={index}
                className={`card-3d rounded-2xl border border-[#E6DFD5] bg-[#FCFBF9] p-2 transition-all duration-300 ${box.stepClass}`}
              >
                <div
                  className="relative p-8 md:p-14 min-h-[360px] md:min-h-[420px] rounded-2xl flex flex-col justify-end bg-cover bg-center overflow-hidden"
                  style={{ backgroundImage: `url(${box.bgImage})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A29]/90 via-[#2C2A29]/40 to-transparent"></div>

                  <div className="relative z-10 space-y-3 text-[#F7F5F0]">
                    <h3 className="font-heading text-2xl md:text-4xl font-bold text-[#F7F5F0]">{box.title}</h3>
                    <p className="text-sm md:text-base leading-relaxed text-[#D8CFC4] max-w-2xl">
                      {box.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ভিডিও সেকশন */}
      <section id="contact-section" className="py-20 md:py-24 px-4 md:px-8 bg-[#FCFBF9] border-y border-[#E6DFD5] transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-heading text-2xl md:text-4xl font-bold text-[#2C2A29]">
              {t[lang].videoTitle}
            </h2>
            <p className="text-xs md:text-sm max-w-2xl mx-auto text-[#5C5852]">
              {t[lang].videoSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoList.map((vid, index) => (
              <div
                key={index}
                className="card-3d p-5 rounded-2xl border border-[#E6DFD5] bg-[#F7F5F0] flex flex-col justify-between space-y-4"
              >
                <h4 className="font-heading font-bold text-base text-[#2C2A29]">{vid.title}</h4>
                <div className="w-full h-32 rounded-2xl border border-[#E6DFD5] bg-[#FCFBF9] flex items-center justify-center text-xs font-medium text-[#5C5852]">
                  🎬 {lang === 'bn' ? 'ভিডিও শীঘ্রই আসছে' : 'Video Coming Soon'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* পেশেন্ট রিভিউ ও রেটিং সেকশন */}
      <section className="py-20 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="card-3d inline-block text-xs font-semibold uppercase tracking-widest text-[#A68A64] bg-[#FCFBF9] px-4 py-1.5 rounded-full border border-[#E6DFD5]">
              {lang === 'bn' ? 'রোগীদের মূল্যায়ন' : 'Testimonials'}
            </span>
            <h2 className="font-heading text-2xl md:text-4xl font-bold text-[#2C2A29] pt-1">
              {t[lang].reviewsTitle}
            </h2>
            <p className="text-sm md:text-base text-[#5C5852]">
              {t[lang].reviewsSub}
            </p>

            <div className="pt-3">
              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] transition-colors duration-300 rounded-full px-7 py-3 font-semibold cursor-pointer text-sm shadow-md"
              >
                {t[lang].addReviewBtn}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviewsList.map((rev, index) => (
              <div
                key={index}
                className="card-3d p-7 rounded-2xl border border-[#E6DFD5] bg-[#FCFBF9] flex flex-col justify-between transition-colors duration-300 hover:border-[#A68A64]"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-[#A68A64] text-lg">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-sm md:text-base leading-relaxed italic text-[#5C5852]">
                    "{rev.review_text}"
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E6DFD5] flex items-center justify-between">
                  <div>
                    <h4 className="font-heading font-bold text-base text-[#2C2A29]">{rev.patient_name}</h4>
                    <p className="text-xs font-semibold text-[#A68A64]">{rev.location}</p>
                  </div>
                  <span className="text-xs text-[#5C5852]">
                    {new Date(rev.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* বিএমডিসি রেজিষ্ট্রেশন যাচাইয়ের প্রয়োজনীয়তা (সতর্কতামূলক সেকশন) */}
      <section className="pb-20 md:pb-24 px-4 md:px-8">
        <div className="card-3d max-w-7xl mx-auto p-6 sm:p-8 md:p-12 rounded-2xl border border-[#E6DFD5] bg-[#FCFBF9] space-y-5 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 shrink-0 rounded-full bg-[#F7F5F0] border border-[#E6DFD5] text-[#A68A64] flex items-center justify-center text-lg font-bold">
              ⚠️
            </span>
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-[#2C2A29]">
              {t[lang].bmdcTitle}
            </h2>
          </div>

          <p className="text-sm md:text-base leading-relaxed text-[#5C5852]">
            {t[lang].bmdcBody}
          </p>

          <div className="pt-2">
            <a
              href="https://verify.bmdc.org.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] transition-colors duration-300 rounded-full px-6 sm:px-8 py-3 sm:py-3.5 font-semibold text-xs sm:text-sm md:text-base shadow-md"
            >
              <span>🔗</span>
              <span>{t[lang].bmdcBtn}</span>
            </a>
          </div>
        </div>
      </section>

      {/* রোগী নিজে রিভিউ সাবমিট করার পপ-আপ মোডাল */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2A29]/60 backdrop-blur-sm overflow-y-auto">
          <div className="card-3d max-w-xl w-full p-6 md:p-8 rounded-2xl border border-[#E6DFD5] bg-[#FCFBF9] text-[#2C2A29] relative my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-xl md:text-2xl font-bold text-[#2C2A29] flex items-center gap-2">
                <span>✍️</span> {t[lang].reviewModalTitle}
              </h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="font-bold text-sm px-3.5 py-1.5 rounded-full border border-[#E6DFD5] bg-[#F7F5F0] hover:bg-[#A68A64] hover:text-[#F7F5F0] text-[#2C2A29] transition-colors duration-300 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-[#2C2A29]">{t[lang].reviewNameLabel}</label>
                <input
                  type="text"
                  value={reviewForm.patient_name}
                  onChange={(e) => setReviewForm({ ...reviewForm, patient_name: e.target.value })}
                  required
                  placeholder={lang === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your name'}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-[#2C2A29]">{t[lang].locationLabel}</label>
                <input
                  type="text"
                  value={reviewForm.location}
                  onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                  placeholder={lang === 'bn' ? 'যেমন: পটিয়া, চট্টগ্রাম' : 'e.g. Patiya, Chattogram'}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-[#2C2A29]">{t[lang].ratingLabel}</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                  required
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5/5 - Excellent)</option>
                  <option value="4">⭐⭐⭐⭐ (4/5 - Very Good)</option>
                  <option value="3">⭐⭐⭐ (3/5 - Good)</option>
                  <option value="2">⭐⭐ (2/5 - Fair)</option>
                  <option value="1">⭐ (1/5 - Poor)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-[#2C2A29]">{t[lang].reviewTextLabel}</label>
                <textarea
                  rows="4"
                  value={reviewForm.review_text}
                  onChange={(e) => setReviewForm({ ...reviewForm, review_text: e.target.value })}
                  required
                  placeholder={lang === 'bn' ? 'আপনার অভিজ্ঞতা ও মতামত এখানে বিস্তারিত লিখুন...' : 'Write your experience and feedback in detail...'}
                  className={inputClass}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="w-full bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] transition-colors duration-300 rounded-full px-7 py-3.5 font-semibold cursor-pointer"
              >
                {reviewSubmitting ? t[lang].reviewSubmitting : t[lang].reviewSubmitBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ফুটার */}
      <footer className="bg-[#2C2A29] text-[#D8CFC4] pt-20 pb-10 border-t border-[#A68A64]/25">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F7F5F0] text-[#2C2A29] flex items-center justify-center text-lg">
                🦷
              </div>
              <span className="font-bold text-lg text-[#F7F5F0] tracking-tight">
                {t[lang].title}
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#D8CFC4]/80 leading-relaxed">
              {lang === 'bn'
                ? 'আধুনিক প্রযুক্তি ও অভিজ্ঞ চিকিৎসকের নিবিড় তত্ত্বাবধানে নিরাপদ ও পেইনলেস ডেন্টাল কেয়ার নিশ্চিত করা আমাদের লক্ষ্য।'
                : 'Ensuring safe and painless dental care with modern technology and expert supervision.'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://www.facebook.com/share/1ZfF826KUs/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#A68A64] flex items-center justify-center overflow-hidden transition-colors duration-300 p-1.5" title="Facebook">
                <img src="/facebook.png" alt="FB" className="w-full h-full object-cover rounded-full" />
              </a>
              <a href="https://www.instagram.com/sakib.cmc?exln=MXQ0N214dDNyaTU4ZQ==" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#A68A64] flex items-center justify-center overflow-hidden transition-colors duration-300 p-1.5" title="Instagram">
                <img src="/instagram.png" alt="IG" className="w-full h-full object-cover rounded-full" />
              </a>
              <a href="https://wa.me/message/KBZOTSKH66H4P1" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#A68A64] flex items-center justify-center overflow-hidden transition-colors duration-300 p-1.5" title="WhatsApp">
                <img src="/whatsapp.png" alt="WhatsApp" className="w-full h-full object-cover rounded-full" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading text-[#F7F5F0] font-bold text-lg border-l-2 border-[#A68A64] pl-3">
              {lang === 'bn' ? 'দ্রুত লিংক' : 'Quick Links'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/" className="hover:text-[#A68A64] transition-colors duration-300">{lang === 'bn' ? 'হোম পেজ' : 'Home'}</a></li>
              <li><a href="#about-section" className="hover:text-[#A68A64] transition-colors duration-300">{lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</a></li>
              <li><a href="/services" className="hover:text-[#A68A64] transition-colors duration-300">{lang === 'bn' ? 'সেবাসমূহ' : 'Services'}</a></li>
              <li><a href="/gallery" className="hover:text-[#A68A64] transition-colors duration-300">{lang === 'bn' ? 'গ্যালারি' : 'Gallery'}</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading text-[#F7F5F0] font-bold text-lg border-l-2 border-[#A68A64] pl-3">
              {lang === 'bn' ? 'সময়সূচি' : 'Working Hours'}
            </h4>
            <div className="space-y-2 text-xs md:text-sm text-[#D8CFC4]">
              <p className="flex items-center gap-2">
                <span>📅</span>
                <span className="font-semibold text-[#F7F5F0]">{lang === 'bn' ? 'শনিবার - বৃহস্পতিবার:' : 'Sat - Thu:'}</span>
              </p>
              <p className="text-[#A68A64] pl-6 font-medium">
                {lang === 'bn' ? 'বিকাল ৪:৩০ টা - রাত ৯:৩০ টা' : '4:30 PM - 9:30 PM'}
              </p>
              <p className="flex items-center gap-2 pt-2">
                <span>✦</span>
                <span className="text-[#D8CFC4]/80 font-medium">{lang === 'bn' ? 'শুক্রবার: সম্পূর্ণ বন্ধ' : 'Friday: Closed'}</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading text-[#F7F5F0] font-bold text-lg border-l-2 border-[#A68A64] pl-3">
              {lang === 'bn' ? 'যোগাযোগ' : 'Contact Us'}
            </h4>
            <div className="space-y-3 text-xs md:text-sm">
              <p className="flex items-start gap-2">
                <span className="text-[#A68A64]">📍</span>
                <span>{t[lang].addressText}</span>
              </p>

              <div className="pt-1">
                <a
                  href="https://maps.app.goo.gl/4nNgwj68kE6okDZ96?g_st=ac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#F7F5F0] text-[#2C2A29] hover:bg-[#A68A64] hover:text-[#F7F5F0] font-semibold px-5 py-2.5 rounded-full transition-colors duration-300 text-xs"
                >
                  <span>🗺️</span>
                  <span>{lang === 'bn' ? 'গুগল ম্যাপে লোকেশন দেখুন' : 'View on Google Maps'}</span>
                </a>
              </div>

              <p className="flex items-center gap-2 pt-1">
                <span className="text-[#A68A64]">📞</span>
                <a href="tel:+8801816011701" className="hover:text-[#A68A64] transition-colors duration-300 font-semibold text-[#F7F5F0]">+880 1816 011 701</a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#A68A64]">✉️</span>
                <a href="mailto:asir.mosaddeque@gmail.com" className="hover:text-[#A68A64] transition-colors duration-300">asir.mosaddeque@gmail.com</a>
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D8CFC4]/75 gap-4">
          <p>© 2026 Dr. Sakib Dental Care. All rights reserved.</p>
          <p className="font-medium text-[#A68A64]">
            developed by own(Dr. Asir Mosaddeque Sakib)
          </p>
        </div>
      </footer>

      {/* কন্টাক্ট মোডাল */}
      {isContactModalOpen && (
        <div onClick={() => setIsContactModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2A29]/60 backdrop-blur-sm">
          <div onClick={(e) => e.stopPropagation()} className="card-3d bg-[#FCFBF9] p-6 md:p-8 rounded-2xl border border-[#E6DFD5] max-w-md w-full relative space-y-6 text-[#2C2A29]">
            <button onClick={() => setIsContactModalOpen(false)} className="absolute top-4 right-4 bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] font-bold w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer text-sm">
              ✕
            </button>

            <div className="border-b border-[#E6DFD5] pb-3">
              <h3 className="font-heading text-xl font-bold text-[#2C2A29]">
                {lang === 'bn' ? 'যোগাযোগ ও লোকেশন' : 'Contact & Location'}
              </h3>
              <p className="text-xs text-[#5C5852] mt-1">
                {lang === 'bn' ? 'ডাঃ আসির মোসাদ্দেক সাকিব ডেন্টাল কেয়ার' : 'Dr. Asir Mosaddeque Sakib Dental Care'}
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 bg-[#F7F5F0] p-3.5 rounded-2xl border border-[#E6DFD5]">
                <span className="text-[#A68A64] text-lg">📍</span>
                <span className="text-[#5C5852]">{t[lang].addressText}</span>
              </div>

              <div>
                <a href="https://maps.app.goo.gl/4nNgwj68kE6okDZ96?g_st=ac" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] font-semibold px-7 py-3 rounded-full transition-colors duration-300 text-sm">
                  <span>🗺️</span>
                  <span>{lang === 'bn' ? 'গুগল ম্যাপে লোকেশন দেখুন' : 'View on Google Maps'}</span>
                </a>
              </div>

              <div>
                <a href="tel:+8801816011701" className="w-full inline-flex items-center justify-center gap-2 bg-[#F7F5F0] text-[#2C2A29] hover:border-[#A68A64] border border-[#E6DFD5] font-semibold px-7 py-3 rounded-full transition-colors duration-300 text-sm">
                  <span>📞</span>
                  <span>+880 1816 011 701</span>
                </a>
              </div>

              <div>
                <a href="https://wa.me/message/KBZOTSKH66H4P1" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] font-semibold px-7 py-3 rounded-full transition-colors duration-300 text-sm">
                  <span>💬</span>
                  <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে যোগাযোগ করুন' : 'Chat on WhatsApp'}</span>
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2 text-xs text-[#5C5852]">
                <span>✉️</span>
                <a href="mailto:asir.mosaddeque@gmail.com" className="hover:text-[#A68A64] transition-colors duration-300">asir.mosaddeque@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* সাকসেস মোডাল */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2A29]/60 backdrop-blur-sm">
          <div className="card-3d p-6 md:p-8 rounded-2xl border border-[#E6DFD5] bg-[#FCFBF9] text-[#2C2A29] max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 text-[#F7F5F0] text-3xl rounded-full flex items-center justify-center mx-auto bg-[#2C2A29]">✓</div>
            <h3 className="font-heading text-2xl font-bold text-[#2C2A29]">{t[lang].successTitle}</h3>
            <p className="text-sm leading-relaxed text-[#5C5852]">{t[lang].successMsg}</p>
            <button onClick={() => setShowSuccessModal(false)} className="w-full bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] transition-colors duration-300 rounded-full px-7 py-3 font-semibold cursor-pointer">
              {t[lang].closeModalBtn}
            </button>
          </div>
        </div>
      )}

      {/* চেম্বার ক্লোজড নোটিশ মোডাল */}
      {showChamberClosedModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-[#2C2A29]/60 backdrop-blur-sm">
          <div className="card-3d p-6 md:p-8 rounded-2xl border border-[#E6DFD5] bg-[#FCFBF9] text-[#2C2A29] max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 text-[#F7F5F0] text-3xl rounded-full flex items-center justify-center mx-auto bg-[#A68A64]">✦</div>
            <h3 className="font-heading text-2xl font-bold text-[#2C2A29]">
              {lang === 'bn' ? chamberNotice.titleBn : chamberNotice.titleEn}
            </h3>
            <p className="text-sm leading-relaxed text-[#5C5852]">
              {lang === 'bn' ? chamberNotice.messageBn : chamberNotice.messageEn}
            </p>
            <button onClick={() => setShowChamberClosedModal(false)} className="w-full bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] transition-colors duration-300 rounded-full px-7 py-3 font-semibold cursor-pointer">
              {t[lang].closeModalBtn}
            </button>
          </div>
        </div>
      )}

    </main>
  )
}