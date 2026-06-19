import { useQHistoryStore } from "../store/qHisStore";
import { useTestDataStore } from "../store/testDataStore";

export default function QuestionHistory() {
    const activeTest =
        useTestDataStore((state) => state.activeTest);
    const activeQuestionIndex =
        useTestDataStore((state) => state.activeQuestionIndex);
    const activeSubject =
        useTestDataStore((state) => state.activeSubject);

    const qHistory =
        useQHistoryStore(
            (state) => state.qHistory
        );

    const historyObj =
        activeTest?.activeQuestionHistoryObj?.[
        activeSubject
        ] || {};

    const qIDs = Array.isArray(historyObj?.qIDs)
        ? historyObj.qIDs
        : Object.values(historyObj?.qIDs || {});

    const currentHistory =
        qHistory?.[qIDs?.[activeQuestionIndex]];

    return (
        <div className="bg-sky-50/70 border border-slate-200 rounded-xl px-3 py-2">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                {/* STATS */}
                <div className="flex flex-wrap items-center gap-2">

                    <div
                        title="Total Attempts"
                        className="flex items-center gap-1"
                    >
                        <span className="text-slate-600 text-xs font-semibold">
                            Attemp:
                        </span>

                        <span className="min-w-[28px] px-2 py-0.5 rounded-full bg-amber-500 text-white text-[11px] sm:text-xs font-bold text-center">
                            {currentHistory?.ta ?? 0}
                        </span>
                    </div>

                    <div
                        title="Correct Answers"
                        className="flex items-center gap-1"
                    >
                        <span className="text-slate-600 text-xs font-semibold">
                            Correct:
                        </span>

                        <span className="min-w-[28px] px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] sm:text-xs font-bold text-center">
                            {currentHistory?.c ?? 0}
                        </span>
                    </div>

                    <div
                        title="Wrong Answers"
                        className="flex items-center gap-1"
                    >
                        <span className="text-slate-600 text-xs font-semibold">
                            Wrong:
                        </span>

                        <span className="min-w-[28px] px-2 py-0.5 rounded-full bg-rose-500 text-white text-[11px] sm:text-xs font-bold text-center">
                            {currentHistory?.w ?? 0}
                        </span>
                    </div>

                    <div
                        title="Accuracy Percentage"
                        className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[11px] sm:text-xs font-bold"
                    >
                        {currentHistory?.pr ?? 0}%
                    </div>

                </div>

                {/* RESULT */}
                {(activeTest?.totalMarks !== undefined &&
                    activeTest?.obtainedMarks !== undefined) && (

                        <div className="flex items-center flex-wrap gap-2 text-sm sm:text-base font-bold">

                            <span className="text-slate-600">
                                Total:
                            </span>

                            <span className="text-slate-900">
                                {activeTest.totalMarks}
                            </span>

                            <span className="text-slate-300">
                                |
                            </span>

                            <span className="text-slate-600">
                                Obtained:
                            </span>

                            <span className="text-emerald-600">
                                {activeTest.obtainedMarks}
                            </span>

                        </div>
                    )}

            </div>

        </div>
    );
}
