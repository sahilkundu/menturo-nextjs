import { useQHistoryStore } from "../store/qHisStore";
import { useTestDataStore } from "../store/testDataStore";

const formatScore = (value: any) => {
    const numberValue =
        Number(value || 0)

    return Number.isInteger(numberValue)
        ? String(numberValue)
        : numberValue
            .toFixed(2)
            .replace(/0+$/, '')
            .replace(/\.$/, '')
}

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
        <div className="w-full rounded-xl border border-slate-200 bg-sky-50/70 px-3 py-2">

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">

                <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">

                    <div
                        title="Total Attempts"
                        className="flex items-center gap-1.5"
                    >
                        <span className="text-xs font-semibold text-slate-600">
                            Attempt:
                        </span>

                        <span className="min-w-7 rounded-full bg-amber-500 px-2 py-0.5 text-center text-[11px] font-bold text-white sm:text-xs">
                            {currentHistory?.ta ?? 0}
                        </span>
                    </div>

                    <div
                        title="Correct Answers"
                        className="flex items-center gap-1.5"
                    >
                        <span className="text-xs font-semibold text-slate-600">
                            Correct:
                        </span>

                        <span className="min-w-7 rounded-full bg-emerald-500 px-2 py-0.5 text-center text-[11px] font-bold text-white sm:text-xs">
                            {currentHistory?.c ?? 0}
                        </span>
                    </div>

                    <div
                        title="Wrong Answers"
                        className="flex items-center gap-1.5"
                    >
                        <span className="text-xs font-semibold text-slate-600">
                            Wrong:
                        </span>

                        <span className="min-w-7 rounded-full bg-rose-500 px-2 py-0.5 text-center text-[11px] font-bold text-white sm:text-xs">
                            {currentHistory?.w ?? 0}
                        </span>
                    </div>

                    <div
                        title="Accuracy Percentage"
                        className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-bold text-sky-700 sm:text-xs"
                    >
                        {currentHistory?.pr ?? 0}%
                    </div>

                </div>

                {(activeTest?.totalMarks !== undefined &&
                    activeTest?.obtainedMarks !== undefined) && (

                        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 border-slate-200 text-sm font-bold sm:border-l sm:pl-4 sm:text-base">

                            <span className="text-slate-600">
                                Total:
                            </span>

                            <span className="text-slate-900">
                                {formatScore(activeTest.totalMarks)}
                            </span>

                            <span className="text-slate-300 max-sm:hidden">
                                |
                            </span>

                            <span className="text-slate-600">
                                Obtained:
                            </span>

                            <span className="text-emerald-600">
                                {formatScore(activeTest.obtainedMarks)}
                            </span>

                        </div>
                    )}

            </div>

        </div>
    );
}
