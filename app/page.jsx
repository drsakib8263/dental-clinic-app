'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Home() {
  const [appointments, setAppointments] = useState([])
  const [formData, setFormData] = useState({
    patient_name: '',
    age: '',
    patient_phone: '',
    service: 'General Checkup',
    appointment_date: '',
    appointment_time: '10:00 AM'
  })
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // চেম্বার বন্ধ ও নোটিশ সংক্রান্ত স্টেট
  const [chamberNotice, setChamberNotice] = useState({
    isClosed: false,
    titleBn: 'জরুরি নোটিশ: চেম্বার বন্ধ সংক্রান্ত',
    titleEn: 'Important Notice: Chamber Closure',
    messageBn: '',
    messageEn: ''
  })
  const [showNoticeModal, setShowNoticeModal] = useState(false)
  const [language, setLanguage] = useState('bn') // 'bn' অথবা 'en'

  // Supabase লাইভ ডেটাবেজ থেকে নোটিশ লোড করার জন্য useEffect
  useEffect(() => {
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
            titleBn: data.title_bn,
            titleEn: data.title_en,
            messageBn: data.message_bn,
            messageEn: data.message_en
          })
          if (data.is_closed) {
            setShowNoticeModal(true)
          }
        }
      } catch (err) {
        console.error('Error fetching live notice:', err)
      }
    }

    fetchLiveNotice()
  }, [])

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage('')

    try {
      const { error } = await supabase
        .from('appointments')
        .insert([formData])

      if (error) {
        alert('অ্যাপয়েন্টমেন্ট বুক করতে সমস্যা হয়েছে: ' + error.message)
      } else {
        setSuccessMessage(
          language === 'bn' 
            ? 'আপনার অ্যাপয়েন্টমেন্ট সফলভাবে সংরক্ষিত হয়েছে!' 
            : 'Your appointment has been successfully booked!'
        )
        setFormData({
          patient_name: '',
          age: '',
          patient_phone: '',
          service: 'General Checkup',
          appointment_date: '',
          appointment_time: '10:00 AM'
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* হেডার ও ভাষা পরিবর্তন বাটন */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-teal-800">
              {language === 'bn' ? 'ডেন্টাল চেম্বার অ্যাপয়েন্টমেন্ট' : 'Dental Chamber Appointment'}
            </h1>
            <p className="text-slate-500 text-sm">
              {language === 'bn' ? 'অনলাইনে সহজেই আপনার সময় বুক করুন' : 'Easily book your slot online'}
            </p>
          </div>

          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl transition text-xs md:text-sm cursor-pointer"
          >
            {language === 'bn' ? 'English' : 'বাংলা'}
          </button>
        </div>

        {/* অ্যাপয়েন্টমেন্ট ফর্ম */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-slate-200">
          {successMessage && (
            <div className="mb-6 p-4 bg-teal-50 border border-teal-200 text-teal-800 rounded-2xl font-bold text-center">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'রোগীর নাম' : 'Patient Name'}
              </label>
              <input
                type="text"
                required
                value={formData.patient_name}
                onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-700 text-slate-900"
                placeholder={language === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your name'}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'বয়স' : 'Age'}
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-700 text-slate-900"
                  placeholder={language === 'bn' ? 'বয়স লিখুন' : 'Enter age'}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
                </label>
                <input
                  type="tel"
                  required
                  value={formData.patient_phone}
                  onChange={(e) => setFormData({ ...formData, patient_phone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-700 text-slate-900"
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'চিকিৎসার ধরণ' : 'Service Type'}
              </label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-700 text-slate-900 cursor-pointer"
              >
                <option value="General Checkup">General Checkup / সাধারণ পরীক্ষা</option>
                <option value="Scaling & Polishing">Scaling & Polishing / স্কেলিং ও পলিশিং</option>
                <option value="Tooth Extraction">Tooth Extraction / দাঁত তোলা</option>
                <option value="Root Canal">Root Canal Treatment / রুট ক্যানেল</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'তারিখ নির্বাচন করুন' : 'Select Date'}
                </label>
                <input
                  type="date"
                  required
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-700 text-slate-900 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'সময় নির্বাচন করুন' : 'Select Time'}
                </label>
                <select
                  value={formData.appointment_time}
                  onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-700 text-slate-900 cursor-pointer"
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                  <option value="08:00 PM">08:00 PM</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-4 rounded-xl transition duration-200 shadow-lg cursor-pointer mt-4"
            >
              {loading ? (language === 'bn' ? 'বুক হচ্ছে...' : 'Booking...') : (language === 'bn' ? 'অ্যাপয়েন্টমেন্ট কনফার্ম করুন' : 'Confirm Appointment')}
            </button>
          </form>
        </div>

      </div>

      {/* চেম্বার বন্ধ থাকলে রোগীর সামনে পপ-আপ নোটিশ দেখানোর মডাল */}
      {showNoticeModal && chamberNotice.isClosed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-rose-500 max-w-md w-full space-y-4 text-center">
            <div className="text-4xl">📢</div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {language === 'bn' ? chamberNotice.titleBn : chamberNotice.titleEn}
            </h3>
            <p className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">
              {language === 'bn' ? chamberNotice.messageBn : chamberNotice.messageEn}
            </p>
            <button
              onClick={() => setShowNoticeModal(false)}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-xl transition duration-200 shadow cursor-pointer mt-2"
            >
              {language === 'bn' ? 'বুঝেছি (Close)' : 'Understood (Close)'}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}