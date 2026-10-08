'use client'

type LiveTestResultModalProps = {
    result: any
    onViewSolution: () => void
    onClose?: () => void
}

const formatTime = (seconds: number) => {
    const safe = Math.max(0, Number(seconds || 0))
    const minutes = Math.floor(safe / 60)
    const remaining = safe % 60
    return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
}

export default function LiveTestResultModal({
    result,
    onViewSolution,
    onClose,
}: LiveTestResultModalProps) {
    const history = result?.history || {}
    const participants = Array.isArray(result?.participants)
        ? result.participants
        : []

    if (result?.status === 'submitted' || result?.status === 'queued' || result?.status === 'processing') {
        return (
            <div className="fixed inset-0 z-[2000] grid place-items-center bg-slate-950/50 p-4">
                <div className="max-w-sm rounded-2xl bg-white p-7 text-center shadow-2xl">
                    <p className="text-lg font-black text-slate-900">Result not yet declared</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Your submission is locked. After the live quiz ends, your rank and solution will be available in My activity.
                    </p>
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-5 w-full rounded-xl bg-violet-600 px-5 py-3 font-black text-white"
                        >
                            OK
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[2000] overflow-y-auto bg-slate-950/50 p-4">
            <div className="mx-auto mt-8 max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
                <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                    Quiz Final Results
                </p>
                <h2 className="mt-2 text-center text-2xl font-black text-slate-900">
                    Congratulations!
                </h2>
                <p className="mt-3 text-center text-4xl font-black text-amber-500">
                    #{history.rank || '—'}
                </p>
                <p className="text-center font-black text-slate-700">Rank achieved</p>

                <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-xl bg-emerald-50 p-4">
                        <p className="text-xs font-bold text-slate-500">Score</p>
                        <p className="text-2xl font-black text-emerald-700">{history.score ?? 0}</p>
                    </div>
                    <div className="rounded-xl bg-blue-50 p-4">
                        <p className="text-xs font-bold text-slate-500">Time</p>
                        <p className="text-2xl font-black text-blue-700">
                            {formatTime(history.elapsedSeconds)}
                        </p>
                    </div>
                </div>

                <p className="mt-4 text-center font-semibold text-slate-700">
                    Correct answers: {history.correctAnswers || 0} / {history.totalQuestions || 0}
                </p>

                <div className="mt-6 overflow-hidden rounded-xl border">
                    <div className="bg-slate-50 p-3 font-black">Test Series Rank List</div>
                    {participants.map((person: any) => (
                        <div
                            key={`${person.userId}-${person.rank}`}
                            className={`border-t p-3 font-semibold ${
                                person.rank === history.rank
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : ''
                            }`}
                        >
                            <div className="flex justify-between gap-3">
                                <span>
                                    #{person.rank} {person.firstName || person.username || 'Participant'}{' '}
                                    {person.lastName || ''}
                                    {person.rank === history.rank ? ' (You)' : ''}
                                </span>
                                <span>{person.score}</span>
                            </div>
                            <div className="mt-1 flex justify-between text-xs font-medium text-slate-500">
                                <span>User ID: {person.userId}</span>
                                <span>Time: {formatTime(person.elapsedSeconds)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={onViewSolution}
                    className="mt-6 w-full rounded-xl bg-violet-600 px-5 py-3 font-black text-white"
                >
                    View Solution
                </button>
            </div>
        </div>
    )
}
