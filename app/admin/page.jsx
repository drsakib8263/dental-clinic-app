'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('all')
  const [availableDates, setAvailableDates] = useState([])

  const [showNoticeControl, setShowNoticeControl] = useState(false)
  const [chamberNotice, setChamberNotice] = useState({
    isClosed: false,
    titleBn: '',
    titleEn: '',
    messageBn: '',
    messageEn: ''
  })
  const [notificationEnabled, setNotificationEnabled] = useState(true)

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('appointments').select('*')
      if (!error) {
        setAppointments(data || [])
        setFilteredAppointments(data || [])
        const uniqueDates = [...new Set((data || []).map(item => item.appointment_date))]
        setAvailableDates(uniqueDates)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('settings').select('*').eq('id', 'chamber_notice').single()
    if (data && !error) {
      setChamberNotice({
        isClosed: data.is_closed,
        titleBn: data.title_bn,
        titleEn: data.title_en,
        messageBn: data.message_bn,
        messageEn: data.message_en
      })
      setNotificationEnabled(data.notification_enabled)
    }
  }

  useEffect(() => {
    fetchAppointments()
    fetchSettings()
  }, [])

  const handleSaveAdminSettings = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('settings').upsert({
      id: 'chamber_notice',
      is_closed: chamberNotice.isClosed,
      title_bn: chamberNotice.titleBn,
      title_en: chamberNotice.titleEn,
      message_bn: chamberNotice.messageBn,
      message_en: chamberNotice.messageEn,
      notification_enabled: notificationEnabled,
      updated_at: new Date()
    })

    if (error) {
      alert('সেটিংস সেভ করতে সমস্যা হয়েছে: ' + error.message)
    } else {
      alert('সফলভাবে লাইভ ডেটাবেজে নোটিশ ও সেটিংস আপডেট করা হয়েছে!')
      setShowNoticeControl(false)
    }
  }

  const handleFilterDate = (date) => {
    setSelectedDate(date)
    if (date === 'all') {
      setFilteredAppointments(appointments)
    } else {
      setFilteredAppointments(appointments.filter(item => item.appointment_date === date))
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">অ্যাডমিন ড্যাশবোর্ড</h1>
            <p className="text-slate-500 text-sm">রোগীদের অ্যাপয়েন্টমেন্ট তালিকা ও চেম্বার সেটিংস</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowNoticeControl(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition text-sm cursor-pointer"
            >
              ⚙️ চেম্বার বন্ধ/নোটিশ কন্ট্রোল
            </button>
            <button
              onClick={fetchAppointments}
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-4 py-2.5 rounded-xl shadow transition text-sm cursor-pointer"
            >
              🔄 রিফ্রেশ করুন
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow border border-slate-200">
          <p className="text-sm font-bold text-slate-700 mb-3">তারিখ অনুযায়ী ফিল্টার করুন:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterDate('all')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition ${
                selectedDate === 'all' ? 'bg-rose-900 text-white shadow' : 'bg-slate-100 text-slate-700'
              }`}
            >
              সকল তারিখ ({appointments.length})
            </button>
            {availableDates.map((date, index) => (
              <button
                key={index}
                onClick={() => handleFilterDate(date)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition ${
                  selectedDate === date ? 'bg-rose-900 text-white shadow' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {date}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">লোড হচ্ছে...</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-8 text-center text-slate-500">কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-teal-800 text-white text-xs md:text-sm">
                    <th className="py-3.5 px-4 font-bold">রোগীর নাম</th>
                    <th className="py-3.5 px-4 font-bold">বয়স</th>
                    <th className="py-3.5 px-4 font-bold">মোবাইল নম্বর</th>
                    <th className="py-3.5 px-4 font-bold">চিকিৎসার ধরণ</th>
                    <th className="py-3.5 px-4 font-bold">তারিখ ও সময়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
                  {filteredAppointments.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{item.patient_name}</td>
                      <td className="py-3.5 px-4 text-slate-700">{item.age ? `${item.age} বছর` : '-'}</td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <a href={`tel:${item.patient_phone}`} className="text-teal-700 font-bold hover:underline">
                          {item.patient_phone}
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{item.service}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {item.appointment_date} <br />
                        <span className="text-rose-600 text-xs font-bold">{item.appointment_time}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showNoticeControl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-amber-500 max-w-lg w-full space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                ⚙️ চেম্বার নোটিশ ও নোটিফিকেশন কন্ট্রোল
              </h3>
              <button onClick={() => setShowNoticeControl(false)} className="text-slate-500 font-bold text-lg p-1">✕</button>
            </div>

            <form onSubmit={handleSaveAdminSettings} className="space-y-4 text-sm">
              <div className="flex items-center justify-between bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <span className="font-bold text-slate-800">চেম্বার বন্ধ রাখুন (রোগীদের নোটিশ দেখাবে)</span>
                <input 
                  type="checkbox"
                  checked={chamberNotice.isClosed}
                  onChange={(e) => setChamberNotice({ ...chamberNotice, isClosed: e.target.checked })}
                  className="w-6 h-6 accent-amber-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between bg-sky-50 p-4 rounded-2xl border border-sky-200">
                <span className="font-bold text-slate-800">পুশ নোটিফিকেশন চালু রাখুন</span>
                <input 
                  type="checkbox"
                  checked={notificationEnabled}
                  onChange={(e) => setNotificationEnabled(e.target.checked)}
                  className="w-6 h-6 accent-sky-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">বাংলা নোটিশ শিরোনাম:</label>
                <input 
                  type="text"
                  value={chamberNotice.titleBn}
                  onChange={(e) => setChamberNotice({ ...chamberNotice, titleBn: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border rounded-xl outline-none text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">বাংলা নোটিশ বার্তা:</label>
                <textarea 
                  rows="3"
                  value={chamberNotice.messageBn}
                  onChange={(e) => setChamberNotice({ ...chamberNotice, messageBn: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border rounded-xl outline-none text-slate-900"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">ইংরেজি নোটিশ শিরোনাম:</label>
                <input 
                  type="text"
                  value={chamberNotice.titleEn}
                  onChange={(e) => setChamberNotice({ ...chamberNotice, titleEn: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border rounded-xl outline-none text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">ইংরেজি নোটিশ বার্তা:</label>
                <textarea 
                  rows="3"
                  value={chamberNotice.messageEn}
                  onChange={(e) => setChamberNotice({ ...chamberNotice, messageEn: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border rounded-xl outline-none text-slate-900"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg cursor-pointer mt-4"
              >
                লাইভ সেভ করুন (Save to Live DB)
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}