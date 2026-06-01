import { useTestDataStore } from "../store/testDataStore"

export default function QuestionHistory() {
    const {
        activeTest,
    } = useTestDataStore()
    return (
        <div className="px-2 py-1 bg-sky-50/60 flex items-center justify-between text-[10px] font-bold text-slate-700">

            <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                    A:
                    <span className="bg-amber-500 text-white px-1 py-[1px] rounded-full text-[8px]">
                        9
                    </span>
                </span>

                <span className="flex items-center gap-1">
                    C:
                    <span className="bg-emerald-500 text-white px-1 py-[1px] rounded-full text-[8px]">
                        5
                    </span>
                </span>

                <span className="flex items-center gap-1">
                    W:
                    <span className="bg-rose-500 text-white px-1 py-[1px] rounded-full text-[8px]">
                        4
                    </span>
                </span>

                <span className="text-sky-700">
                    P: 56%
                </span>
            </div>
            {activeTest?.totalMarks && activeTest?.obtainedMarks &&
                <div className="flex items-center gap-1 pl-2 border-l border-slate-300/60">


                    <span>Total:</span>

                    <span className="text-slate-900 font-extrabold">
                        {activeTest?.totalMarks}
                    </span>


                    <span className="text-slate-400">|</span>

                    <span>Obtained:</span>

                    <span className="text-emerald-600 font-extrabold">
                        {activeTest?.obtainedMarks}
                    </span>


                </div>
            }

        </div>
    )
}