'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function BookingForm() {
  const [formData, setFormData] = useState({
    patient_name: '',
    age: '',
    phone: '',
    service: '',
    appointment_date: '',
    appointment_time: ''
  })

  const [availableDates, setAvailableDates] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // মোবাইলে ও ডেস্কটপে পপ-আপ নোটিফিকেশন দেখানোর জন্য নতুন স্টেট
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    const dates = []
    const daysMap = {
      'Sun': 'রবিবার',
      'Mon': 'সোমবার',
      'Tue': 'মঙ্গলবার',
      'Wed': 'বুধবার',
      'Thu': 'বৃহস্পতিবার',
      'Fri': 'শুক্রবার',
      'Sat': 'শনিবার'
    }
    const monthsMap = {
      'Jan': 'জানুয়ারি', 'Feb': 'ফেব্রুয়ারি', 'Mar': 'মার্চ', 'Apr': 'এপ্রিল',
      'May': 'মে', 'Jun': 'জুন', 'Jul': 'জুলাই', 'Aug': 'আগস্ট',
      'Sep': 'সেপ্টেম্বর', 'Oct': 'অক্টোবর', 'Nov': 'নভেম্বর', 'Dec': 'ডিসেম্বর'
    }

    const today = new Date()
    let count = 0
    let i = 0

    while (count < 7 && i < 20) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      
      const enDay = d.toLocaleDateString('en-US', { weekday: 'short' })
      
      if (enDay !== 'Fri') {
        const bnDay = daysMap[enDay] || enDay
        const dayNum = d.getDate()
        const enMonth = d.toLocaleDateString('en-US', { month: 'short' })
        const bnMonth = monthsMap[enMonth] || enMonth
        const year = d.getFullYear()
        
        // ডাটাবেজে সেভ হওয়ার জন্য ইংরেজি YYYY-MM-DD ফরম্যাট
        const value = d.toISOString().split('T')[0]
        
        // ড্রপডাউনে দেখানোর জন্য সম্পূর্ণ বাংলা ফরম্যাট
        const label = (count === 0)
          ? `আজ (${bnDay}, ${dayNum} ${bnMonth} ${year})`
          : `${bnDay}, ${dayNum} ${bnMonth} ${year}`

        dates.push({ value, label })
        count++
      }
      i++
    }
    setAvailableDates(dates)
  }, [])

  const availableTimes = [
    "বিকেল ৪:০০ টা", "বিকেল ৪:৩০ টা",
    "বিকেল ৫:০০ টা", "বিকেল ৫:৩০ টা",
    "সন্ধ্যা ৬:০০ টা", "সন্ধ্যা ৬:৩০ টা",
    "সন্ধ্যা ৭:০০ টা", "সন্ধ্যা ৭:৩০ টা",
    "রাত ৮:০০ টা", "রাত ৮:৩০ টা",
    "রাত ৯:০০ টা"
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const { error } = await supabase
        .from('appointments')
        .insert([
          {
            patient_name: formData.patient_name,
            age: formData.age ? parseInt(formData.age) : null,
            patient_phone: formData.phone,
            service: formData.service,
            appointment_date: formData.appointment_date,
            appointment_time: formData.appointment_time
          }
        ])

      if (error) throw error

      // সফলভাবে ডেটা সেভ হলে পপ-আপ ট্রিগার হবে
      setShowSuccessModal(true)

      setFormData({
        patient_name: '',
        age: '',
        phone: '',
        service: '',
        appointment_date: '',
        appointment_time: ''
      })
    } catch (error) {
      console.error('Error submitting appointment:', error)
      setMessage({
        type: 'error',
        text: 'বুকিং জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-teal-100 max-w-2xl mx-auto my-8 relative">
      <h2 className="text-2xl font-bold text-[#800000] text-center mb-2">
        অনলাইন অ্যাপয়েন্টমেন্ট বুকিং
      </h2>
      <p className="text-gray-600 text-center mb-6 text-sm">
        শনিবার থেকে বৃহস্পতিবার (বিকেল ৪:০০ টা - রাত ৯:০০ টা), শুক্রবার বন্ধ
      </p>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-lg text-sm font-medium ${
            message.type === 'success'
              ? 'bg-teal-50 text-teal-800 border border-teal-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              রোগীর নাম *
            </label>
            <input
              type="text"
              name="patient_name"
              value={formData.patient_name}
              onChange={handleChange}
              required
              placeholder="আপনার নাম লিখুন"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-teal-700 outline-none transition bg-white text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              বয়স *
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="1"
              max="120"
              placeholder="যেমন: ৩২"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-teal-700 outline-none transition bg-white text-gray-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            মোবাইল নম্বর *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="017XXXXXXXX"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-teal-700 outline-none transition bg-white text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            চিকিৎসার ধরণ *
          </label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-teal-700 outline-none transition bg-white text-gray-800"
          >
            <option value="">চিকিৎসার ধরণ নির্বাচন করুন</option>
            <option value="দাঁতের নতুন সমস্যা নিয়ে দেখাব">দাঁতের নতুন সমস্যা নিয়ে দেখাব</option>
            <option value="দাঁতের চিকিৎসা চলমান রয়েছে">দাঁতের চিকিৎসা চলমান রয়েছে</option>
            <option value="ওষুধ খাওয়ার পরে আমার চিকিৎসা শুরু হবে">ওষুধ খাওয়ার পরে আমার চিকিৎসা শুরু হবে</option>
            <option value="ওষুধ খাওয়ার পরেও ব্যথা কমছে না">ওষুধ খাওয়ার পরেও ব্যথা কমছে না</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              পছন্দের তারিখ (শুক্রবার বাদে) *
            </label>
            <select
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-teal-700 outline-none transition bg-white text-gray-800"
            >
              <option value="">তারিখ নির্বাচন করুন</option>
              {availableDates.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              পছন্দের সময় (বিকেল ৪টা - রাত ৯টা) *
            </label>
            <select
              name="appointment_time"
              value={formData.appointment_time}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-teal-700 outline-none transition bg-white text-gray-800"
            >
              <option value="">সময় নির্বাচন করুন</option>
              {availableTimes.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-md disabled:opacity-50"
        >
          {loading ? 'জমা দেওয়া হচ্ছে...' : 'অ্যাপয়েন্টমেন্ট বুক করুন'}
        </button>
      </form>

      {/* মোবাইল এবং ডেস্কটপের জন্য সুন্দর পপ-আপ (Modal) নোটিফিকেশন */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-center space-y-4 border border-teal-100 animate-in fade-in zoom-in duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-3xl font-bold shadow-inner">
              ✓
            </div>
            <h3 className="text-xl font-bold text-teal-900">
              অ্যাপয়েন্টমেন্ট সফল হয়েছে!
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              আপনার অ্যাপয়েন্টমেন্ট আবেদনটি সফলভাবে জমা হয়েছে। খুব শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full rounded-xl bg-teal-700 hover:bg-teal-800 py-3 font-semibold text-white transition shadow-md"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </section>
  )
}