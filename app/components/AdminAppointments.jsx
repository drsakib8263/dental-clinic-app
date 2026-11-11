'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newBookingAlert, setNewBookingAlert] = useState(null)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    // সার্ভিস ওয়ার্কার রেজিস্টার করা
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('Service Worker Registered:', reg.scope))
        .catch((err) => console.error('Service Worker Error:', err))
    }

    // ব্রাউজার নোটিফিকেশনের অনুমতি চাওয়া
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission()
      }
    }

    fetchAppointments()

    // Supabase Realtime সাবস্ক্রিপশন
    const channel = supabase
      .channel('admin-appointments-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAppointments((prev) => [payload.new, ...prev])
            setNewBookingAlert(payload.new)
            playNotificationSound()
            showNativeNotification(payload.new)
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

  // ব্রাউজার/মোবাইল পুশ নোটিফিকেশন দেখানোর ফাংশন
  const showNativeNotification = (booking) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('🔔 নতুন অ্যাপয়েন্টমেন্ট!', {
          body: `রোগী: ${booking.patient_name} (${booking.patient_phone})\nতারিখ: ${booking.appointment_date}`,
          icon: '/favicon.ico'
        })
      } catch (e) {
        console.log('Notification error:', e)
      }
    }
  }

  // ব্যাকগ্রাউন্ড পুশ সাবস্ক্রাইব করার হ্যান্ডলার
  const handleSubscribePush = async () => {
    try {
      if (!('serviceWorker' in navigator)) {
        alert('এই ব্রাউজারে সার্ভিস ওয়ার্কার সমর্থিত নয়!');
        return
      }

      const register = await navigator.serviceWorker.ready
      const permission = await Notification.requestPermission()
      
      if (permission !== 'granted') {
        alert('নোটিফিকেশনের অনুমতি দেওয়া হয়নি!');
        return
      }

      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      })

      console.log('Push Subscription:', JSON.stringify(subscription))

      // চাইলে সাবস্ক্রিপশনটি Supabase ডেটাবেজে সেভ করে রাখতে পারেন
      /*
      await supabase.from('push_subscriptions').upsert({
        endpoint: subscription.endpoint,
        subscription_data: subscription
      })
      */

      setIsSubscribed(true)
      alert('সফলভাবে ব্যাকগ্রাউন্ড পুশ নোটিফিকেশনের জন্য সাবস্ক্রাইব করা হয়েছে!');
    } catch (error) {
      console.error('Subscription error:', error)
      alert('সাবস্ক্রাইব করতে সমস্যা হয়েছে: ' + error.message)
    }
  }

  const playNotificationSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
      audio.play()
    } catch (e) {
      console.log('Audio play error:', e)
    }
  }

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
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-teal-900">রোগীদের অ্যাপয়েন্টমেন্ট তালিকা</h2>
        
        {/* ব্যাকগ্রাউন্ড পুশ অন করার বাটন */}
        <button
          onClick={handleSubscribePush}
          className={`px-4 py-2 rounded-xl text-white font-medium text-sm shadow transition ${
            isSubscribed ? 'bg-green-600 hover:bg-green-700' : 'bg-teal-600 hover:bg-teal-700'
          }`}
        >
          {isSubscribed ? '✅ পুশ নোটিফিকেশন অন আছে' : '🔔 ব্যাকগ্রাউন্ড পুশ অন করুন'}
        </button>
      </div>

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