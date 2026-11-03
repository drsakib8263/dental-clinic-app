'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  async function fetchAppointments() {
    setLoading(true)
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setAppointments(data)
    }
    setLoading(false)
  }

  // তারিখকে বাংলায় রূপান্তর করার ফাংশন
  function formatDateToBangla(dateStr) {
    if (!dateStr) return ''
    const dateObj = new Date(dateStr)
    if (isNaN(dateObj)) return dateStr

    const day = dateObj.getDate()
    const months = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ]
    const month = months[dateObj.getMonth()]
    const year = dateObj.getFullYear()

    return `${day} ${month} ${year}`
  }

  // স্ট্যাটাস কনফার্ম করা বা বাতিল (ডিলিট) করার ফাংশন
  async function updateStatus(id, newStatus) {
    if (newStatus === 'cancelled') {
      // যদি বাতিল করা হয়, তবে ডাটাবেস থেকে ডিলিট করে দেওয়া
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)

      if (!error) {
        // লিস্ট থেকে ওই অ্যাপয়েন্টমেন্টটি ফিল্টার করে সরিয়ে দেওয়া যাতে ইনস্ট্যান্ট পেজ থেকে চলে যায়
        setAppointments(appointments.filter(app => app.id !== id))
      }
    } else {
      // কনফার্ম বা অন্য স্ট্যাটাসের জন্য আপডেট করা
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id)

      if (!error) {
        setAppointments(appointments.map(app => 
          app.id === id ? { ...app, status: newStatus } : app
        ))
      }
    }
  }

  if (loading) return <div className="text-center py-4">লোড হচ্ছে...</div>

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-teal-100 mt-8">
      <h2 className="text-2xl font-bold text-teal-900 mb-6">রোগীদের অ্যাপয়েন্টমেন্ট তালিকা</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center">কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-teal-50 text-teal-900 border-b">
                <th className="p-3">রোগীর নাম</th>
                <th className="p-3">মোবাইল</th>
                <th className="p-3">চিকিৎসা</th>
                <th className="p-3">তারিখ ও সময়</th>
                <th className="p-3">স্ট্যাটাস</th>
                <th className="p-3">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{app.patient_name}</td>
                  <td className="p-3">{app.patient_phone}</td>
                  <td className="p-3">{app.treatment_id || 'সাধারণ পরামর্শ'}</td>
                  <td className="p-3">
                    {formatDateToBangla(app.appointment_date)} 
                    <br/>
                    <span className="text-sm text-gray-500">{app.appointment_time}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      app.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <button 
                      onClick={() => updateStatus(app.id, 'confirmed')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                    >
                      কনফার্ম
                    </button>
                    <button 
                      onClick={() => updateStatus(app.id, 'cancelled')}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                    >
                      বাতিল
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}