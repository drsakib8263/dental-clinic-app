'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  
  // ফিল্টারিংয়ের জন্য সিলেক্টেড ডেট (YYYY-MM-DD ফরম্যাট, খালি থাকলে সব দেখাবে)
  const [selectedDate, setSelectedDate] = useState('')
  const [dateTabs, setDateTabs] = useState([])

  // সামনের ৭ দিনের বাংলা তারিখ জেনারেট করা
  useEffect(() => {
    const dates = []
    const daysMap = {
      'Sun': 'রবিবার', 'Mon': 'সোমবার', 'Tue': 'মঙ্গলবার',
      'Wed': 'বুধবার', 'Thu': 'বৃহস্পতিবার', 'Fri': 'শুক্রবার', 'Sat': 'শনিবার'
    }
    const monthsMap = {
      'Jan': 'জানুয়ারি', 'Feb': 'ফেব্রুয়ারি', 'Mar': 'মার্চ', 'Apr': 'এপ্রিল',
      'May': 'মে', 'Jun': 'জুন', 'Jul': 'জুলাই', 'Aug': 'আগস্ট',
      'Sep': 'সেপ্টেম্বর', 'Oct': 'অক্টোবর', 'Nov': 'নভেম্বর', 'Dec': 'ডিসেম্বর'
    }

    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
    const toBanglaNum = (num) => {
      return num.toString().split('').map(digit => banglaDigits[digit] !== undefined ? banglaDigits[digit] : digit).join('')
    }

    const today = new Date()
    let count = 0
    let i = 0

    while (count < 7 && i < 20) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      
      const enDay = d.toLocaleDateString('en-US', { weekday: 'short' })
      
      // শুক্রবার বাদে ৭ কার্যদিবস
      if (enDay !== 'Fri') {
        const bnDay = daysMap[enDay] || enDay
        const dayNum = toBanglaNum(d.getDate())
        const enMonth = d.toLocaleDateString('en-US', { month: 'short' })
        const bnMonth = monthsMap[enMonth] || enMonth
        const year = toBanglaNum(d.getFullYear())
        
        const value = d.toISOString().split('T')[0] // YYYY-MM-DD
        const label = (count === 0)
          ? `আজ (${bnDay}, ${dayNum} ${bnMonth} ${year})`
          : `${bnDay}, ${dayNum} ${bnMonth} ${year}`

        dates.push({ value, label, shortLabel: `${dayNum} ${bnMonth}` })
        count++
      }
      i++
    }
    setDateTabs(dates)
  }, [])

  // ইংরেজি তারিখকে বাংলায় রূপান্তর করার ফাংশন
  const formatDateToBangla = (dateStr) => {
    if (!dateStr) return '-'
    const parts = dateStr.split('-')
    if (parts.length !== 3) return dateStr

    const year = parts[0]
    const monthNum = parts[1]
    const dayNum = parts[2]

    const monthsMap = {
      '01': 'জানুয়ারি', '02': 'ফেব্রুয়ারি', '03': 'মার্চ', '04': 'এপ্রিল',
      '05': 'মে', '06': 'জুন', '07': 'জুলাই', '08': 'আগস্ট',
      '09': 'সেপ্টেম্বর', '10': 'অক্টোবর', '11': 'নভেম্বর', '12': 'ডিসেম্বর'
    }

    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
    const toBanglaNum = (str) => {
      return str.toString().split('').map(char => banglaDigits[char] !== undefined ? banglaDigits[char] : char).join('')
    }

    const bnDay = toBanglaNum(parseInt(dayNum, 10))
    const bnMonth = monthsMap[monthNum] || monthNum
    const bnYear = toBanglaNum(year)

    return `${bnDay} ${bnMonth} ${bnYear}`
  }

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('appointments')
        .select('*')
        .order('id', { ascending: false })

      // যদি কোনো নির্দিষ্ট তারিখ সিলেক্ট করা থাকে, তবে ফিল্টার করা হবে
      if (selectedDate) {
        query = query.eq('appointment_date', selectedDate)
      }

      const { data, error } = await query

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [selectedDate])

  // অ্যাপয়েন্টমেন্ট কনফার্ম করার ফাংশন
  const handleConfirm = async (id) => {
    try {
      setActionLoading(id)
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', id)

      if (error) throw error
      fetchAppointments()
    } catch (error) {
      console.error('Error confirming appointment:', error)
      alert('অ্যাপয়েন্টমেন্ট কনফার্ম করতে সমস্যা হয়েছে।')
    } finally {
      setActionLoading(null)
    }
  }

  // অ্যাপয়েন্টমেন্ট সম্পূর্ণ ডিলিট করার ফাংশন
  const handleDelete = async (id) => {
    if (window.confirm("আপনি কি নিশ্চিতভাবে এই অ্যাপয়েন্টমেন্টটি মুছে ফেলতে চান?")) {
      try {
        setActionLoading(id)
        const { error } = await supabase
          .from('appointments')
          .delete()
          .eq('id', id)

        if (error) throw error
        setAppointments(appointments.filter(app => app.id !== id))
      } catch (error) {
        console.error('Error deleting appointment:', error)
        alert('অ্যাপয়েন্টমেন্ট মুছতে সমস্যা হয়েছে। আবার চেষ্টা করুন।')
      } finally {
        setActionLoading(null)
      }
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-4 border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-[#800000]">অ্যাডমিন ড্যাশবোর্ড</h1>
            <p className="text-gray-600 mt-1">রোগীদের বুক করা অ্যাপয়েন্টমেন্টসমূহের তালিকা ও ব্যবস্থাপনা</p>
          </div>
          <button
            onClick={fetchAppointments}
            className="mt-4 md:mt-0 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            রিফ্রেশ করুন
          </button>
        </div>

        {/* তারিখের বক্স / ফিল্টার ট্যাব */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-teal-100 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">তারিখ অনুযায়ী ফিল্টার করুন:</h3>
            {selectedDate && (
              <button 
                onClick={() => setSelectedDate('')}
                className="text-xs text-[#800000] hover:underline font-medium"
              >
                সব তারিখের দেখুন
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedDate('')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedDate === '' 
                  ? 'bg-[#800000] text-white shadow' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              সকল তারিখ
            </button>
            {dateTabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(tab.value)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedDate === tab.value 
                    ? 'bg-teal-700 text-white shadow' 
                    : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 text-lg">লোড হচ্ছে...</div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">এই তারিখে কোনো অ্যাপয়েন্টমেন্ট জমা নেই।</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-teal-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-teal-700 text-white text-sm">
                    <th className="p-4 font-semibold">রোগীর নাম</th>
                    <th className="p-4 font-semibold">বয়স</th>
                    <th className="p-4 font-semibold">মোবাইল নম্বর</th>
                    <th className="p-4 font-semibold">চিকিৎসার ধরণ</th>
                    <th className="p-4 font-semibold">তারিখ</th>
                    <th className="p-4 font-semibold">সময়</th>
                    <th className="p-4 font-semibold">স্ট্যাটাস</th>
                    <th className="p-4 font-semibold text-center">কার্যক্রম</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                  {appointments.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-900">{item.patient_name}</td>
                      <td className="p-4">{item.age ? `${item.age} বছর` : '-'}</td>
                      <td className="p-4 font-mono">{item.patient_phone}</td>
                      <td className="p-4">{item.service || '-'}</td>
                      <td className="p-4 font-medium text-gray-800">{formatDateToBangla(item.appointment_date)}</td>
                      <td className="p-4 font-medium text-teal-800">{item.appointment_time}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'confirmed' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status || 'pending'}
                        </span>
                      </td>
                      <td className="p-4 text-center space-x-2">
                        {item.status !== 'confirmed' && (
                          <button
                            disabled={actionLoading === item.id}
                            onClick={() => handleConfirm(item.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-medium transition disabled:opacity-50"
                          >
                            কনফার্ম
                          </button>
                        )}
                        <button
                          disabled={actionLoading === item.id}
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium transition disabled:opacity-50"
                        >
                          ডিলিট
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}