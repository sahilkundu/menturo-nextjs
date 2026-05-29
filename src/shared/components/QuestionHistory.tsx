export default function QuestionHistory() {
    return (
        <div className="px-4 py-1.5 bg-sky-50/60 flex flex-wrap items-center justify-between text-[11px] font-bold text-slate-700 gap-2">
            <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">A: <span className="bg-amber-500 text-white px-1.5 py-0.2 rounded-full text-[9px]">9</span></span>
                <span className="flex items-center gap-1">C: <span className="bg-emerald-500 text-white px-1.5 py-0.2 rounded-full text-[9px]">5</span></span>
                <span className="flex items-center gap-1">W: <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[9px]">4</span></span>
                <span className="text-sky-700">P: 56%</span>

            </div>

        </div>
    )
}