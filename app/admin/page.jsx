'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [appointments, setAppointments] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [loading, setLoading] = useState(false)

  // চেম্বার নোটিশ স্টেট
  const [notice, setNotice] = useState({
    isClosed: false,
    titleBn: '',
    titleEn: '',
    messageBn: '',
    messageEn: ''
  })

  const handleLogin = (e) => {
    e.preventDefault()
    if (passcode === '1234') { // আপনার ইচ্ছমতো পাসকোড পরিবর্তন করতে পারেন
      setIsAuthenticated(true)
      fetchAppointments()
      fetchNoticeSettings()
    } else {
      alert(' ভুল পাসওয়ার্ড!')
    }
  }

  const fetchAppointments = async (dateFilter = '') => {
    setLoading(true)
    try {
      let query = supabase.from('appointments').select('*').order('appointment_date', { ascending: true })
      
      if (dateFilter) {
        query = query.eq('appointment_date', dateFilter)
      }

      const { data, error } = await query
      if (error) {
        console.error('Error fetching appointments:', error)
      } else {
        setAppointments(data || [])
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchNoticeSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'chamber_notice')
        .single()

      if (data && !error) {
        setNotice({
          isClosed: data.is_closed || false,
          titleBn: data.title_bn || '',
          titleEn: data.title_en || '',
          messageBn: data.message_bn || '',
          messageEn: data.message_en || ''
        })
      }
    } catch (err) {
      console.error('Error fetching notice:', err)
    }
  }

  const handleUpdateNotice = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 'chamber_notice',
          is_closed: notice.isClosed,
          title_bn: notice.titleBn,
          title_en: notice.titleEn,
          message_bn: notice.messageBn,
          message_en: notice.messageEn,
          updated_at: new Date()
        })

      if (error) {
        alert('নোটিশ আপডেট করতে সমস্যা হয়েছে: ' + error.message)
      } else {
        alert('চেম্বারের নোটিশ সফলভাবে আপডেট ও সিঙ্ক হয়েছে!')
      }
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  // অ্যাপয়েন্টমেন্ট কনফার্ম করার ফাংশন
  const handleConfirm = async (id) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'Confirmed' })
        .eq('id', id)

      if (error) {
        alert('কনফার্ম করতে সমস্যা হয়েছে: ' + error.message)
      } else {
        alert('অ্যাপয়েন্টমেন্ট সফলভাবে কনফার্ম করা হয়েছে!')
        fetchAppointments(selectedDate)
      }
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  // অ্যাপয়েন্টমেন্ট ডিলিট করার ফাংশন
  const handleDelete = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিতভাবে এই অ্যাপয়েন্টমেন্টটি ডিলিট করতে চান?')) return

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)

      if (error) {
        alert('ডিলিট করতে সমস্যা হয়েছে: ' + error.message)
      } else {
        alert('অ্যাপয়েন্টমেন্ট সফলভাবে ডিলিট করা হয়েছে!')
        fetchAppointments(selectedDate)
      }
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-slate-100">
        <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 w-full max-w-md space-y-6">
          <h2 className="text-2xl font-black text-center text-teal-400">অ্যাডমিন লগইন</h2>
          <div>
            <label className="block text-sm font-semibold mb-2">পাসকোড দিন</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="পাসকোড লিখুন"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-white"
              required
            />
          </div>
          <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition">
            লগইন করুন
          </button>
        </form>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-black text-teal-400">অ্যাডমিন ড্যাশবোর্ড</h1>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-xl font-bold text-sm transition"
        >
          লগআউট
        </button>
      </div>

      {/* চেম্বার নোটিশ কন্ট্রোল সেকশন */}
      <div className="max-w-6xl mx-auto bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-700 shadow-xl space-y-6">
        <h2 className="text-xl font-bold text-teal-400">📢 চেম্বার বন্ধ/খোলা নোটিশ ম্যানেজমেন্ট</h2>
        
        <form onSubmit={handleUpdateNotice} className="space-y-4">
          <div className="flex items-center gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-700">
            <input
              type="checkbox"
              id="isClosed"
              checked={notice.isClosed}
              onChange={(e) => setNotice({ ...notice, isClosed: e.target.checked })}
              className="w-6 h-6 accent-teal-500 cursor-pointer"
            />
            <label htmlFor="isClosed" className="font-bold text-rose-400 cursor-pointer">
              চেম্বারের কার্যক্রম বর্তমানে বন্ধ রাখুন (হোমপেজে পপ-আপ নোটিশ দেখাবে)
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">নোটিশের শিরোনাম (বাংলা)</label>
              <input
                type="text"
                value={notice.titleBn}
                onChange={(e) => setNotice({ ...notice, titleBn: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Notice Title (English)</label>
              <input
                type="text"
                value={notice.titleEn}
                onChange={(e) => setNotice({ ...notice, titleEn: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">নোটিশের বিবরণ (বাংলা)</label>
              <textarea
                rows="3"
                value={notice.messageBn}
                onChange={(e) => setNotice({ ...notice, messageBn: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Notice Message (English)</label>
              <textarea
                rows="3"
                value={notice.messageEn}
                onChange={(e) => setNotice({ ...notice, messageEn: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
              ></textarea>
            </div>
          </div>

          <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl transition">
            নোটিশ সেভ ও সিঙ্ক করুন
          </button>
        </form>
      </div>

      {/* অ্যাপয়েন্টমেন্ট লিস্ট সেকশন */}
      <div className="max-w-6xl mx-auto bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-700 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-teal-400">📅 রোগীর অ্যাপয়েন্টমেন্ট তালিকা</h2>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                fetchAppointments(e.target.value)
              }}
              className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none"
            />
            {selectedDate && (
              <button
                onClick={() => {
                  setSelectedDate('')
                  fetchAppointments('')
                }}
                className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-xl text-xs font-bold"
              >
                রিসেট
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-center py-6 text-slate-400">লোড হচ্ছে...</p>
        ) : appointments.length === 0 ? (
          <p className="text-center py-6 text-slate-400">কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-700 text-slate-200 text-xs md:text-sm">
                  <th className="py-3 px-4">রোগীর নাম</th>
                  <th className="py-3 px-4">বয়স</th>
                  <th className="py-3 px-4">ফোন নম্বর</th>
                  <th className="py-3 px-4">সেবা</th>
                  <th className="py-3 px-4">তারিখ ও সময়</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-xs md:text-sm">
                {appointments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-700/40 transition">
                    <td className="py-3 px-4 font-bold text-white">{item.patient_name}</td>
                    <td className="py-3 px-4">{item.age || '-'}</td>
                    <td className="py-3 px-4 font-semibold text-teal-300">{item.patient_phone}</td>
                    <td className="py-3 px-4">{item.service}</td>
                    <td className="py-3 px-4">
                      <span className="block font-semibold">{item.appointment_date}</span>
                      <span className="text-xs text-teal-400">{item.appointment_time}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}>
                        {item.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => handleConfirm(item.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow transition cursor-pointer"
                      >
                        কনফার্ম
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow transition cursor-pointer"
                      >
                        ডিলিট
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}