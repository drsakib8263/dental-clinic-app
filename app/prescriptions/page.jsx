'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ejdewrkkadndjlspmhyj.supabase.co'
const supabaseAnonKey = 'sb_publishable_mcnw0osdruKLepukigC4Zw_JwEojZh7'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const TEXT = {
  bn: {
    backHome: 'হোম পেজে ফিরুন',
    portalLabel: 'ডিজিটাল প্রেসক্রিপশন পোর্টাল',
    toggleBtn: 'English',
    title: 'প্রেসক্রিপশন ডাউনলোড (PDF)',
    subtitle:
      'আপনার চিকিৎসা সংক্রান্ত প্রেসক্রিপশন PDF আকারে পেতে চেম্বারে রেজিস্ট্রিকৃত মোবাইল নম্বর দিয়ে সার্চ করুন।',
    phonePlaceholder: 'মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)',
    searchBtn: 'প্রেসক্রিপশন খুঁজুন',
    searching: 'খোঁজা হচ্ছে...',
    invalidPhone: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন।',
    searchErrorPrefix: 'তথ্য খুঁজতে সমস্যা হয়েছে:',
    networkError: 'নেটওয়ার্ক বা সার্ভার ত্রুটি হয়েছে।',
    noRecords: 'এই মোবাইল নম্বরের বিপরীতে কোনো প্রেসক্রিপশন পাওয়া যায়নি।',
    defaultPatientName: 'রোগীর প্রেসক্রিপশন',
    mobileLabel: 'মোবাইল',
    dateLabel: 'তারিখ',
    downloadSingle: 'PDF ডাউনলোড',
    downloadMultiPrefix: 'PDF',
    downloadMultiSuffix: 'ডাউনলোড',
    noPdfBadge: 'কোনো PDF নেই',
    downloadAlert: 'PDF ডাউনলোড করতে সমস্যা হয়েছে।'
  },
  en: {
    backHome: 'Back to Home',
    portalLabel: 'Digital Prescription Portal',
    toggleBtn: 'বাংলা',
    title: 'Download Prescription (PDF)',
    subtitle:
      'Search with the mobile number registered at the chamber to download your prescription in PDF format.',
    phonePlaceholder: 'Enter mobile number (e.g. 017XXXXXXXX)',
    searchBtn: 'Find Prescription',
    searching: 'Searching...',
    invalidPhone: 'Please enter a valid 11-digit mobile number.',
    searchErrorPrefix: 'Failed to fetch records:',
    networkError: 'Network or server error occurred.',
    noRecords: 'No prescription records found for this mobile number.',
    defaultPatientName: 'Patient Prescription',
    mobileLabel: 'Mobile',
    dateLabel: 'Date',
    downloadSingle: 'Download PDF',
    downloadMultiPrefix: 'Download PDF',
    downloadMultiSuffix: '',
    noPdfBadge: 'No PDF available',
    downloadAlert: 'Failed to download PDF.'
  }
}

function isPdfFile(entry, url = '') {
  const cleanUrl = (url || '').split('?')[0].toLowerCase()
  const nameOrPath =
    typeof entry === 'object' && entry !== null
      ? `${entry.name || ''} ${entry.file_name || ''} ${entry.path || ''} ${entry.file_path || ''}`.toLowerCase()
      : ''
  const mimeOrType =
    typeof entry === 'object' && entry !== null
      ? `${entry.type || ''} ${entry.mime_type || ''} ${entry.contentType || ''}`.toLowerCase()
      : ''

  if (
    cleanUrl.endsWith('.xlsm') ||
    cleanUrl.endsWith('.xlsx') ||
    cleanUrl.endsWith('.xls') ||
    nameOrPath.includes('.xlsm') ||
    nameOrPath.includes('.xlsx') ||
    nameOrPath.includes('.xls') ||
    mimeOrType.includes('sheet') ||
    mimeOrType.includes('excel')
  ) {
    return false
  }

  return (
    cleanUrl.endsWith('.pdf') ||
    nameOrPath.includes('.pdf') ||
    mimeOrType.includes('pdf')
  )
}

function extractPdfUrls(filesField) {
  if (!filesField) return []

  let parsed = filesField
  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed)
    } catch {
      return parsed.toLowerCase().includes('.pdf') ? [parsed] : []
    }
  }

  if (Array.isArray(parsed)) {
    return parsed
      .map((entry) => {
        if (typeof entry === 'string') {
          return isPdfFile(entry, entry) ? entry : ''
        }
        if (entry && typeof entry === 'object') {
          const url =
            entry.url || entry.pdf_url || entry.file_url || entry.publicUrl || ''
          return url && isPdfFile(entry, url) ? url : ''
        }
        return ''
      })
      .filter(Boolean)
  }

  if (typeof parsed === 'object') {
    const single =
      parsed.url || parsed.pdf_url || parsed.file_url || parsed.publicUrl || ''
    return single && isPdfFile(parsed, single) ? [single] : []
  }

  return []
}

export default function PrescriptionLookupPage() {
  const [lang, setLang] = useState('bn')
  const [phone, setPhone] = useState('')
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const t = TEXT[lang]

  const handleSearch = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSearched(true)

    const cleanPhone = phone.replace(/\D/g, '').trim()
    if (cleanPhone.length < 10) {
      setErrorMsg(t.invalidPhone)
      setRecords([])
      return
    }

    const last10 = cleanPhone.slice(-10)

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .ilike('phone', `%${last10}%`)

      if (error) {
        console.error('Supabase search error:', error)
        setErrorMsg(`${t.searchErrorPrefix} ${error.message}`)
        setRecords([])
      } else {
        setRecords(data || [])
      }
    } catch (err) {
      console.error('Error:', err)
      setErrorMsg(t.networkError)
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPdf = async (url, item, fileIndex = 0) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = `Prescription_${item.phone || 'patient'}_${item.id || 'rec'}_${fileIndex + 1}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(objectUrl)
    } catch (err) {
      console.error('PDF download error:', err)
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#2C2A29] px-4 py-8 sm:py-12 md:py-16">
      <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6">
        {/* টপ বার: হোম লিংক + পোর্টাল লেবেল + বাংলা/ইংলিশ টগল বাটন */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full border border-[#E6DFD5] bg-[#FCFBF9] hover:border-[#A68A64] transition-colors"
          >
            <span>←</span>
            <span>{t.backHome}</span>
          </a>

          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            <span className="text-[11px] sm:text-xs font-semibold text-[#A68A64]">
              {t.portalLabel}
            </span>

            <button
              type="button"
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              aria-label="Toggle Language"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#DFD6C7] bg-[#FCFBF9] hover:bg-[#2C2A29] hover:text-[#F7F5F0] hover:border-[#2C2A29] text-[#2C2A29] text-xs font-bold transition-all duration-300 cursor-pointer shadow-2xs"
            >
              <span>🌐</span>
              <span>{t.toggleBtn}</span>
            </button>
          </div>
        </div>

        {/* মূল কার্ড */}
        <div className="rounded-3xl border border-[#E6DFD5] bg-[#FCFBF9] p-5 sm:p-6 md:p-8 shadow-sm space-y-5">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2C2A29]">
              {t.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#5C5852] leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              placeholder={t.phonePlaceholder}
              maxLength="11"
              required
              className="flex-1 px-4 py-3 rounded-2xl border border-[#DFD6C7] bg-[#F7F5F0] text-sm font-medium text-[#2C2A29] outline-none focus:border-[#A68A64]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] font-semibold text-sm transition-colors cursor-pointer shrink-0"
            >
              {loading ? t.searching : t.searchBtn}
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
                  {t.noRecords}
                </div>
              ) : (
                records.map((item, idx) => {
                  const pdfUrls = extractPdfUrls(item.files)

                  return (
                    <div
                      key={item.id || idx}
                      className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#E6DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-[#2C2A29]">
                          {item.name || t.defaultPatientName}
                        </p>
                        <p className="text-xs text-[#5C5852]">
                          {t.mobileLabel}: {item.phone}
                          {item.created_at
                            ? ` • ${t.dateLabel}: ${new Date(item.created_at).toLocaleDateString(
                                lang === 'bn' ? 'bn-BD' : 'en-US'
                              )}`
                            : ''}
                        </p>
                        {item.description && (
                          <p className="text-xs text-[#5C5852] pt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {pdfUrls.length > 0 ? (
                          pdfUrls.map((url, fIdx) => (
                            <button
                              key={fIdx}
                              type="button"
                              onClick={() => handleDownloadPdf(url, item, fIdx)}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#2C2A29] text-[#F7F5F0] hover:bg-[#A68A64] text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <span>📄</span>
                              <span>
                                {pdfUrls.length > 1
                                  ? `${t.downloadMultiPrefix} ${fIdx + 1} ${t.downloadMultiSuffix}`.trim()
                                  : t.downloadSingle}
                              </span>
                            </button>
                          ))
                        ) : (
                          <span className="text-xs text-[#5C5852] px-3 py-1.5 rounded-full bg-[#FCFBF9] border border-[#E6DFD5]">
                            {t.noPdfBadge}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}