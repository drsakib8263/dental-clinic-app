'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newBookingAlert, setNewBookingAlert] = useState(null)

  useEffect(() => {
    fetchAppointments()

    // Supabase Realtime লজিক যুক্ত করা হলো যাতে নতুন বুকিং আসলে ইনস্ট্যান্ট আপডেট হয়
    const channel = supabase
      .channel('admin-appointments-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE সব ইভেন্ট ট্র্যাক করার জন্য
          schema: 'public',
          table: 'appointments',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAppointments((prev) => [payload.new, ...prev])
            setNewBookingAlert(payload.new)
            playNotificationSound()
          } else if (payload.eventType === 'UPDATE') {
            setAppointments((prev) =>
              prev.map((app) => (app.id === payload.new.id ? payload.new : app))
            )
          } else if (payload.eventType === 'DELETE') {
            setAppointments((prev) => prev.filter((app) => app.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    // ক্লিনআপ ফাংশন
    return () => {
      supabase.removeChannel(channel)
    }
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

  // ছোট নোটিফিকেশন সাউন্ড বাজানোর ফাংশন
  const playNotificationSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
      audio.play()
    } catch (e) {
      console.log('Audio play error:', e)
    }
  }

  // তারিখকে বাংলায় রূপান্তর করার ফাংশন
  function formatDateToBangla(dateStr) {
    if (!dateStr) return ''
    const dateObj = new Date(dateStr)
    if (isNaN(dateObj)) return dateStr

    const day = dateObj.getDate()
    const months = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ]
    const month = months[dateObj.getMonth()]
    const year = dateObj.getFullYear()

    return `${day} ${month} ${year}`
  }

  // স্ট্যাটাস কনফার্ম করা বা বাতিল (ডিলিট) করার ফাংশন
  async function updateStatus(id, newStatus) {
    if (newStatus === 'cancelled') {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)

      if (!error) {
        setAppointments(appointments.filter(app => app.id !== id))
      }
    } else {
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

      {/* নতুন বুকিং আসলে স্ক্রিনের ওপর নোটিফিকেশন পপ-আপ */}
      {newBookingAlert && (
        <div className="mb-6 p-4 bg-teal-50 border-2 border-teal-500 text-teal-900 rounded-2xl shadow-md flex justify-between items-center animate-bounce">
          <div>
            <h3 className="font-bold text-base">🔔 নতুন একটি অ্যাপয়েন্টমেন্ট এসেছে!</h3>
            <p className="text-sm">
              রোগীর নাম: <b>{newBookingAlert.patient_name}</b> ({newBookingAlert.patient_phone})
            </p>
          </div>
          <button 
            onClick={() => setNewBookingAlert(null)} 
            className="bg-teal-600 text-white px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-teal-700"
          >
            বন্ধ করুন
          </button>
        </div>
      )}

      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center">কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-teal-50 text-teal-900 border-b">
                <th className="p-3">রোগীর নাম</th>
                <th className="p-3">মোবাইল</th>
                <th className="p-3">চিকিৎসা</th>
                <th className="p-3">তারিখ ও সময়</th>
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
                      {app.status || 'pending'}
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