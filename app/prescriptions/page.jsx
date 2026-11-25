'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ejdewrkkadndjlspmhyj.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_mcnw0osdruKLepukigC4Zw_JwEojZh7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function PrescriptionLookupPage() {
  const [phone, setPhone] = useState('')
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSearched(true)

    const cleanPhone = phone.replace(/\D/g, '').trim()
    if (cleanPhone.length < 10) {
      setErrorMsg('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন।')
      setRecords([])
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('phone', cleanPhone)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase search error:', error)
        setErrorMsg('তথ্য খুঁজতে সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।')
        setRecords([])
      } else {
        setRecords(data || [])
      }
    } catch (err) {
      console.error('Error:', err)
      setErrorMsg('নেটওয়ার্ক বা সার্ভার ত্রুটি হয়েছে।')
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPdf = async (item) => {
    try {
      let downloadUrl =
        item.pdf_url || item.prescription_url || item.file_url || item.url || ''

      if (!downloadUrl && item.file_path) {
        const { data, error } = await supabase.storage
          .from('prescriptions')
          .createSignedUrl(item.file_path, 60)

        if (!error && data?.signedUrl) {
          downloadUrl = data.signedUrl
        }
      }

      if (!downloadUrl) {
        alert('এই রেকর্ডের PDF লিংক পাওয়া যায়নি।')
        return
      }

      const response = await fetch(downloadUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Prescription_${item.phone || 'patient'}_${item.id || 'file'}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF download error:', err)
      const fallbackUrl =
        item.pdf_url || item.prescription_url || item.file_url || item.url
      if (fallbackUrl) {
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer')
      } else {
        alert('PDF ডাউনলোড করতে সমস্যা হয়েছে।')
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#2C2A29] px-4 py-10 md:py-16">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full border border-[#E6DFD5] bg-[#FCFBF9] hover:border-[#A68A64] transition-colors"
          >
            <span>←</span>
            <span>হোম পেজে ফিরুন</span>
          </a>
          <span className="text-xs font-semibold text-[#A68A64]">
            ডিজিটাল প্রেসক্রিপশন পোর্টাল
          </span>
        </div>

        <div className="rounded-3xl border border-[#E6DFD5] bg-[#FCFBF9] p-6 md:p-8 shadow-sm space-y-5">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2C2A29]">
              প্রেসক্রিপশন ডাউনলোড (PDF)
            </h1>
            <p className="text-xs sm:text-sm text-[#5C5852] leading-relaxed">
              আপনার চিকিৎসা সংক্রান্ত প্রেসক্রিপশন PDF আকারে পেতে চেম্বারে রেজিস্ট্রিকৃত মোবাইল নম্বর দিয়ে সার্চ করুন।
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              placeholder="মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)"
              maxLength="11"
              required
              className="flex-1 px-4 py-3 rounded-2xl border border-[#DFD6C7] bg-[#F7F5F0] text-sm font-medium text-[#2C2A29] outline-none focus:border-[#A68A64]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] font-semibold text-sm transition-colors cursor-pointer shrink-0"
            >
              {loading ? 'খোঁজা হচ্ছে...' : 'প্রেসক্রিপশন খুঁজুন'}
            </button>
          </form>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-xs sm:text-sm text-rose-800 font-medium">
              {errorMsg}
            </div>
          )}

          {searched && !loading && !errorMsg && (
            <div className="pt-2 space-y-3">
              {records.length === 0 ? (
                <div className="p-5 rounded-2xl bg-[#F7F5F0] border border-[#E6DFD5] text-center text-xs sm:text-sm text-[#5C5852]">
                  এই মোবাইল নম্বরের বিপরীতে কোনো প্রেসক্রিপশন পাওয়া যায়নি।
                </div>
              ) : (
                records.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#E6DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-[#2C2A29]">
                        {item.name || 'রোগীর প্রেসক্রিপশন'}
                      </p>
                      <p className="text-xs text-[#5C5852]">
                        মোবাইল: {item.phone}
                        {item.created_at
                          ? ` • তারিখ: ${new Date(item.created_at).toLocaleDateString('bn-BD')}`
                          : ''}
                      </p>
                      {item.description && (
                        <p className="text-xs text-[#5C5852] pt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(item)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] text-xs font-semibold transition-colors cursor-pointer shrink-0"
                    >
                      <span>📄</span>
                      <span>PDF ডাউনলোড</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}