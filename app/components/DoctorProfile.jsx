'use client'

export default function DoctorProfile() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-gradient-to-br from-white via-teal-50/30 to-cyan-50/40 rounded-3xl p-8 md:p-12 shadow-xl border-2 border-teal-600/20 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        
        {/* ব্যাকগ্রাউন্ড ওয়াটারমার্ক */}
        <div className="absolute right-4 bottom-4 w-32 h-32 bg-no-repeat bg-contain opacity-10 pointer-events-none" style={{ backgroundImage: "url('/logo.png')" }}></div>

        {/* ডাক্তারের ছবি */}
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-teal-800 shadow-lg overflow-hidden flex-shrink-0 bg-teal-100 flex items-center justify-center">
          <img 
            src="/doctor.jpeg" 
            alt="ডা: আসির মোসাদ্দেক সাকিব" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* ডাক্তারের বিবরণ */}
        <div className="text-center md:text-left space-y-3 z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-rose-900 tracking-wide">
            ডা. আসির মোসাদ্দেক সাকিব
          </h2>
          <p className="text-teal-900 font-bold text-lg">
            বিডিএস (চট্টগ্রাম মেডিকেল কলেজ)
          </p>
          <p className="text-teal-800 font-semibold text-base">
            ওরাল এন্ড ডেন্টাল সার্জন
          </p>
          <p className="text-gray-700 text-sm italic">
            (ট্রেইনড ইন এন্ডোডন্টিক, ইমপ্লান্ট এন্ড কসমেটিক ডেন্টিস্ট্রি)
          </p>
          <div className="pt-2">
            <span className="inline-block bg-teal-100 text-teal-900 text-xs md:text-sm font-bold px-4 py-1.5 rounded-full border border-teal-300">
              বিএমডিসি রেজি. নং- ৮২৬৩
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}