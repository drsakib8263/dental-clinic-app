'use client'

export default function ContactSchedule() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* চেম্বারের সময়সূচী কার্ড */}
        <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-teal-600/20 flex flex-col justify-between">
          <h3 className="text-xl font-bold text-rose-900 mb-4 border-b-2 border-teal-600/20 pb-2">
            চেম্বারের সময়সূচী
          </h3>
          <div className="space-y-3 text-gray-700 text-sm md:text-base">
            <div className="flex justify-between items-center">
              ق<span className="font-semibold text-teal-900">শনিবার – বৃহস্পতিবার:</span>
              <span className="font-bold text-teal-800">বিকাল ৪:০০ টা – রাত ৯:০০ টা</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-100 pt-2">
              <span className="font-semibold text-rose-700">শুক্রবার:</span>
              <span className="font-bold text-rose-600">বন্ধ</span>
            </div>
          </div>
        </div>

        {/* সিরিয়াল ও যোগাযোগের কার্ড */}
        <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-teal-600/20 flex flex-col justify-between">
          <h3 className="text-xl font-bold text-rose-900 mb-4 border-b-2 border-teal-600/20 pb-2">
            সিরিয়াল ও যোগাযোগ
          </h3>
          <div className="space-y-3 text-gray-700 text-sm md:text-base">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-teal-900">হটলাইন / সিরিয়াল:</span>
              <span className="font-extrabold text-teal-800">০১৮১৬-০১১৭০১</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-2">
              <span className="font-semibold text-teal-900">ইমেল:</span>
              <span className="font-medium text-gray-800 text-xs md:text-sm">sakibcmc@hotmail.com</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}