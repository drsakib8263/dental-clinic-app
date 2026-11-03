'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TreatmentsList() {
  const [treatments, setTreatments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTreatments = async () => {
      const { data, error } = await supabase
        .from('treatments')
        .select('*')

      if (!error && data) {
        setTreatments(data)
      }
      setLoading(false)
    }

    fetchTreatments()
  }, [])

  if (loading) {
    return <div className="text-center py-10 text-teal-800 font-semibold">তথ্য লোড হচ্ছে...</div>
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-teal-800 mb-2">আমাদের চিকিৎসাসমূহ ও আনুমানিক খরচ</h2>
        <p className="text-gray-600 font-medium">আধুনিক প্রযুক্তিতে সাশ্রয়ী মূল্যে দাঁতের সুচিকিৎসা</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {treatments.map((item) => (
          <div 
            key={item.id} 
            className="relative bg-gradient-to-br from-white via-cyan-50/40 to-teal-50/40 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-teal-600/20 flex flex-col justify-between group overflow-hidden"
          >
            {/* ভিজিটিং কার্ডের লোগো বা ওয়াটারমার্ক */}
            <div className="absolute right-3 bottom-3 w-20 h-20 bg-no-repeat bg-contain opacity-30 pointer-events-none" style={{ backgroundImage: "url('/logo.png')" }}></div>

            <div>
              <div className="border-b-2 border-teal-600/20 pb-3 mb-4">
                {/* শুধুমাত্র ট্রিটমেন্টের নাম মেরুন কালার করা হয়েছে */}
                <h3 className="text-xl font-bold text-rose-900 tracking-wide">
                  {item.name}
                </h3>
              </div>

              {item.description && (
                <p className="text-gray-600 text-sm mb-4">
                  {item.description}
                </p>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-teal-800 font-medium">মূল্য:</span>
                <span className="text-teal-800 font-extrabold text-lg">{item.cost}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-teal-800 font-medium">সময় প্রয়োজন:</span>
                <span className="text-teal-700 font-bold">{item.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}