'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, CalendarDays, Check, Clock3, Globe2, Lock, Play, Settings, Trophy } from 'lucide-react'
import TestSectionHead from '../../shared/components/TestSectionHead'
import TypingProTestCardSkeleton from '../../shared/components/Skeleton/TypingProTestCardSkeleton'
import { useUserStore } from '../../shared/store/user'
import { useTypingStore } from '../../shared/store/typingStore'
import type { TypingAction, TypingTest } from '../../shared/store/typingStore'
import { showPopupMessage } from '../../shared/utils/popup'
import { showRouteLoader } from '../../shared/utils/routeLoader'

const levels = ['Easy', 'Medium', 'Hard', 'Expert', 'Master']
const historyDate = (value: number) => value ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value)) : 'Recent attempt'

export default function TypingProPage() {
    const router = useRouter()
    const authenticated = useUserStore((state) => state.authenticated)
    const authChecked = useUserStore((state) => state.authChecked)
    const fetchUser = useUserStore((state) => state.fetchUser)
    const tests = useTypingStore((state) => state.tests); const history = useTypingStore((state) => state.history)
    const loadingTests = useTypingStore((state) => state.loadingTests); const loadingHistory = useTypingStore((state) => state.loadingHistory)
    const testsHasMore = useTypingStore((state) => state.testsHasMore); const historyHasMore = useTypingStore((state) => state.historyHasMore)
    const testPage = useTypingStore((state) => state.testPage); const historyPage = useTypingStore((state) => state.historyPage)
    const language = useTypingStore((state) => state.language); const level = useTypingStore((state) => state.selectedLevel); const duration = useTypingStore((state) => state.duration)
    const backspace = useTypingStore((state) => state.backspaceEnabled); const highlight = useTypingStore((state) => state.highlightEnabled); const spelling = useTypingStore((state) => state.liveSpellingEnabled)
    const access = useTypingStore((state) => state.levelAccess); const progress = useTypingStore((state) => state.levelProgress)
    const setLanguage = useTypingStore((state) => state.setLanguage); const setLevel = useTypingStore((state) => state.setSelectedLevel); const setDuration = useTypingStore((state) => state.setDuration); const setSetting = useTypingStore((state) => state.setSetting)
    const setPendingTest = useTypingStore((state) => state.setPendingTest)
    const loadTests = useTypingStore((state) => state.loadTests); const loadHistory = useTypingStore((state) => state.loadHistory)
    const applyTypingTestUpdate = useTypingStore((state) => state.applyTypingTestUpdate)
    const controlsLocked = loadingTests
    const [selectedTestId, setSelectedTestId] = useState('')
    const [testMenuOpen, setTestMenuOpen] = useState(false)
    const testMenuRef = useRef<HTMLDivElement>(null)
    const loadingPlaceholders = Array.from({ length: loadingTests ? 2 : 0 }, (_, index) => ({ testId: `__typing-skeleton-${index}`, title: '', language: 'english', level: 1, levelName: 'Easy', duration: 1 } as TypingTest))
    const visibleTests = [...(selectedTestId ? tests.filter((test) => test.testId === selectedTestId) : tests), ...loadingPlaceholders]
    const selectedTest = tests.find((test) => test.testId === selectedTestId)
    const selectedTestLabel = selectedTest ? `${tests.indexOf(selectedTest) + 1}. ${selectedTest.title}` : `All loaded tests (${tests.length})`

    useEffect(() => { if (!authenticated && !authChecked) fetchUser() }, [authenticated, authChecked, fetchUser])
    useEffect(() => { void loadTests(level, 1, true, language); void loadHistory(1, true) }, [language, level, loadHistory, loadTests])
    useEffect(() => { setSelectedTestId('') }, [language, level])
    useEffect(() => {
        const closeMenu = (event: MouseEvent) => {
            if (!testMenuRef.current?.contains(event.target as Node)) setTestMenuOpen(false)
        }
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setTestMenuOpen(false)
        }

        document.addEventListener('mousedown', closeMenu)
        document.addEventListener('keydown', closeOnEscape)
        return () => {
            document.removeEventListener('mousedown', closeMenu)
            document.removeEventListener('keydown', closeOnEscape)
        }
    }, [])
    useEffect(() => {
        const handleTypingTestUpdate = (event: Event) => {
            const update = (event as CustomEvent).detail
            applyTypingTestUpdate(update)
            void loadHistory(1, true)
        }

        window.addEventListener('menturo-typing-test-updated', handleTypingTestUpdate)
        return () => window.removeEventListener('menturo-typing-test-updated', handleTypingTestUpdate)
    }, [applyTypingTestUpdate, loadHistory])

    const login = async () => { await fetch('/redirect', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: '/typingPro' }) }); router.push('/login') }
    const open = async (test: TypingTest, action: TypingAction = 'start', historyId = '') => {
        if (!authenticated) { showPopupMessage('Please sign in to start typing test', false); await login(); return }
        if (test.available === false || test.access === false) { showPopupMessage('This test is locked', false); return }
        setPendingTest(test.testId, action, historyId)
        showRouteLoader(); router.push('/typingTest')
    }

    return <main className="typing-font min-h-[100dvh] overflow-y-auto bg-[#f6f7fb] px-2 py-2 pb-24 text-[#121735] sm:px-3">
        <TestSectionHead userName="" rollingId="" activePlan={authenticated ? 'Typing Pro' : 'Guest'} badgeText="Typing Master Pro" onHome={() => router.push('/')} onLogin={login} showSignIn={!authenticated} />
        <div className="mx-auto mt-3 max-w-[1180px] xl:grid xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start xl:gap-4">
            <div className="space-y-2 xl:col-start-1">
            <section className="xl:col-start-1 rounded-[14px] bg-[#f8f9fc] p-2 shadow-[0_5px_18px_rgba(36,29,83,.13)]"><div className="flex flex-wrap gap-2">{(['english','hindi'] as const).map((item) => <button key={item} disabled={controlsLocked} onClick={() => setLanguage(item)} className={`flex items-center gap-2 rounded-[12px] border px-7 py-3 text-sm font-black disabled:cursor-wait disabled:opacity-60 ${language === item ? 'border-[#4b397c] bg-[#4b397c] text-white' : 'border-slate-200 bg-white text-slate-600'}`}><Globe2 size={15}/>{item === 'english' ? 'English' : 'Hindi'}</button>)}</div></section>
            <section className="xl:col-start-1 rounded-[14px] bg-white p-3 shadow-[0_5px_18px_rgba(36,29,83,.13)]"><div className="flex gap-2 overflow-x-auto pb-1">{levels.map((item, index) => { const unlocked = item === 'Easy' || access[item] === true; return <button key={item} disabled={controlsLocked} onClick={() => setLevel(item)} className={`relative shrink-0 rounded-[11px] border px-5 py-3 text-xs font-black disabled:cursor-wait disabled:opacity-60 ${level === item ? 'border-[#4b397c] bg-[#4b397c] text-white' : unlocked ? 'border-slate-200 bg-white text-slate-600' : 'border-slate-200 bg-[#eff4fa] text-slate-400'}`}>{!unlocked && <Lock className="mr-1 inline" size={12}/>} {index + 1}. {item}</button> })}</div></section>
            <div>
                <section className="rounded-[14px] border border-[#e4ddf7] bg-white p-3 shadow-[0_5px_18px_rgba(36,29,83,.09)] sm:p-4"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-base font-black">{level} {language === 'english' ? 'English' : 'Hindi'} Typing Tests</h1><p className="mt-1 text-xs font-bold text-slate-500">Choose a test to start, resume, or view its solution.</p></div><div ref={testMenuRef} className="relative w-full sm:w-64"><button type="button" disabled={!tests.length} onClick={() => setTestMenuOpen((open) => !open)} aria-label="Filter loaded typing tests" aria-haspopup="listbox" aria-expanded={testMenuOpen} className="flex w-full items-center justify-between gap-2 rounded-[9px] border border-[#d8cff3] bg-[#f8f6ff] px-3 py-2 text-left text-xs font-black text-[#4b397c] outline-none disabled:opacity-50"><span className="min-w-0 truncate">{selectedTestLabel}</span><span aria-hidden="true" className="shrink-0">▾</span></button>{testMenuOpen && <div role="listbox" aria-label="Loaded typing tests" className="absolute right-0 z-20 mt-1 w-full overflow-hidden rounded-[9px] border border-[#d8cff3] bg-[#f8f6ff] py-1 shadow-lg"><button type="button" role="option" aria-selected={!selectedTestId} onClick={() => { setSelectedTestId(''); setTestMenuOpen(false) }} className={`block w-full truncate px-3 py-2 text-left text-xs font-black ${!selectedTestId ? 'bg-[#4b397c] text-white' : 'bg-[#f8f6ff] text-[#4b397c] hover:bg-[#eee9fb]'}`}>All loaded tests ({tests.length})</button>{tests.map((test, index) => <button key={test.testId} type="button" role="option" aria-selected={selectedTestId === test.testId} title={`${index + 1}. ${test.title}`} onClick={() => { setSelectedTestId(test.testId); setTestMenuOpen(false) }} className={`block w-full truncate px-3 py-2 text-left text-xs font-black ${selectedTestId === test.testId ? 'bg-[#4b397c] text-white' : 'bg-[#f8f6ff] text-[#4b397c] hover:bg-[#eee9fb]'}`}>{index + 1}. {test.title}</button>)}</div>}</div></div><div className="space-y-3">{visibleTests.map((test) => <TestCard key={test.testId} test={test} requirements={progress[test.levelName]} onOpen={open}/>)}</div>{loadingTests && <p className="py-8 text-center text-sm font-bold text-slate-500">Loading typing tests…</p>}{!loadingTests && !tests.length && <p className="rounded-xl border border-dashed p-8 text-center text-sm font-bold text-slate-500">No tests found for this level.</p>}{!loadingTests && tests.length > 0 && !visibleTests.length && <p className="rounded-xl border border-dashed p-8 text-center text-sm font-bold text-slate-500">Select a loaded test from the menu above.</p>}<button disabled={!testsHasMore || loadingTests} onClick={() => void loadTests(level, testPage + 1, false, language)} className="mt-4 w-full rounded-[10px] bg-[#eef1ff] py-3 text-xs font-black text-[#4b39cf] disabled:opacity-50">{loadingTests ? 'Loading…' : testsHasMore ? 'Load More Tests' : 'All Tests Loaded'}</button></section>
            </div>
            </div>
            <aside className="space-y-4 xl:col-start-2"><Setup duration={duration} setDuration={setDuration} backspace={backspace} highlight={highlight} spelling={spelling} setSetting={setSetting}/><Progress level={level} access={access} progress={progress}/><History history={history} loading={loadingHistory} more={historyHasMore} onMore={() => void loadHistory(historyPage + 1, false)}/></aside>
        </div>
    </main>
}

function TestCard({ test, requirements, onOpen }: { test: TypingTest; requirements?: { minimumSpeed?: number; minimumAccuracy?: number }; onOpen: (test: TypingTest, action?: TypingAction, historyId?: string) => void }) {
    if (test.testId.startsWith('__typing-skeleton-')) return <TypingProTestCardSkeleton />
    const resume = test.history?.find((item) => item.historyId === test.actions?.resumeHistoryId || item.status === 'resume' || item.status === 'running'); const solution = test.history?.find((item) => item.historyId === test.actions?.solutionHistoryId || item.status === 'submitted'); const primaryAction = test.actions?.primary === 'resume' ? 'resume' : 'start'; const resumeHistoryId = test.actions?.resumeHistoryId || resume?.historyId || ''; const attempted = Boolean(solution); const score = solution?.score || 0; const accuracy = solution?.accuracy || 0; const requiredSpeed = requirements?.minimumSpeed || 0; const requiredAccuracy = requirements?.minimumAccuracy || 0
    const locked = test.access === false || test.available === false
    return <article className="rounded-[14px] border border-[#d8cff3] bg-[#fdfcff] p-3 sm:p-4"><h2 className="truncate text-sm font-black">{test.title}</h2><div className="mt-3 grid grid-cols-3 gap-2 text-[11px] font-bold text-[#61708c]"><span><Globe2 className="mr-1 inline text-sky-500" size={13}/>{test.language}</span><span>Level {test.level}: {test.levelName}</span><span>{test.words || 0} words</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${attempted ? 'w-full bg-amber-400' : 'w-[12%] bg-rose-500'}`}/></div>{attempted ? <p className="mt-1 flex items-center justify-between gap-2 text-[11px] font-bold"><span className="text-red-600">{score} WPM / {Number(accuracy).toFixed(1)}%</span><span className="text-emerald-600">need {requiredSpeed} WPM / {requiredAccuracy}%</span></p> : <p className="mt-1 text-[11px] font-bold text-[#65708a]">Not attempted • need {requiredSpeed} WPM / {requiredAccuracy}%</p>}{locked ? <div className="mt-4 flex items-center justify-center gap-2 rounded-[11px] bg-[#edf2f8] py-3 text-xs font-black text-[#61708c]"><Lock size={14}/>Locked</div> : <div className={`mt-4 grid gap-2 ${solution ? 'grid-cols-2' : 'grid-cols-1'}`}><button onClick={() => onOpen(test, primaryAction, resumeHistoryId)} className="flex items-center justify-center gap-1 rounded-[11px] bg-[#4b397c] py-3 text-xs font-black text-white"><Play size={14}/>{primaryAction === 'resume' ? 'Resume' : attempted ? 'Test Again' : 'Start Test'}</button>{solution && <button onClick={() => onOpen(test, 'solution', solution.historyId || '')} className="rounded-[11px] border border-[#d8cff3] bg-[#f3f0fb] text-xs font-black text-[#4b397c]">Solution</button>}</div>}</article>
}

function Setup({ duration, setDuration, backspace, highlight, spelling, setSetting }: any) { return <section className="rounded-[14px] bg-white p-4 shadow-[0_5px_18px_rgba(36,29,83,.09)]"><h2 className="flex items-center gap-2 text-sm font-black"><Settings size={17} className="text-[#4b39cf]"/>Test Setup</h2><p className="mb-2 mt-4 text-xs font-black">Select Test Time</p><div className="grid grid-cols-5 gap-2">{[1,2,3,4,5,6,7,8,9,10].map((value) => <button key={value} onClick={() => setDuration(value)} className={`rounded-[8px] border py-2 text-xs font-black ${duration === value ? 'border-[#4f36ff] bg-[#4f36ff] text-white' : 'border-slate-200 text-slate-600'}`}><Clock3 className="mr-1 inline" size={11}/>{value}m</button>)}</div><div className="mt-5 space-y-3">{([['backspaceEnabled','Backspace',backspace],['highlightEnabled','Highlight & Auto Scroll',highlight],['liveSpellingEnabled','Live Spelling Check',spelling]] as const).map(([key,label,enabled]) => <button key={key} onClick={() => setSetting(key, !enabled)} className="flex w-full items-center justify-between text-left text-sm font-black"><span>{label}</span><span className={`flex h-8 w-12 items-center justify-end rounded-full p-1 ${enabled ? 'bg-[#4f36ff]' : 'bg-slate-200'}`}><span className={`flex h-6 w-6 items-center justify-center rounded-full bg-white ${enabled ? '' : '-translate-x-4'}`}>{enabled && <Check size={14} className="text-[#4f36ff]"/>}</span></span></button>)}</div></section> }

function Progress({ level, access, progress }: any) { const current = progress[level] || { total: 0, passed: 0, percent: 0 }; return <section className="rounded-[14px] bg-white p-4 shadow-[0_5px_18px_rgba(36,29,83,.09)]"><h2 className="flex items-center gap-2 text-sm font-black"><BarChart3 size={17} className="text-[#4b39cf]"/>Your Progress & Levels</h2><div className="mt-5 grid grid-cols-5 gap-1">{levels.map((item, index) => { const unlocked = item === 'Easy' || access[item]; const itemProgress = progress[item] || { total: 0, passed: 0 }; return <div key={item} className="text-center"><div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-black ${item === level ? 'border-[#29135f] bg-[#29135f] text-white' : unlocked ? 'border-sky-200 bg-sky-50 text-slate-600' : 'border-slate-200 bg-slate-100 text-slate-400'}`}>{unlocked ? index + 1 : <Lock size={13}/>}</div><p className="mt-2 text-[10px] font-bold">{item}</p><p className="mt-1 text-[10px] text-slate-500">{itemProgress.passed}/{itemProgress.total}</p></div>})}</div><div className="mt-4 rounded-[10px] bg-slate-50 p-3"><div className="flex justify-between text-xs font-black"><span><Lock className="mr-1 inline text-amber-500" size={13}/>{level} progress</span><span>{current.passed}/{current.total}</span></div><div className="mt-2 h-2 overflow-hidden rounded bg-slate-200"><div className="h-full rounded bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-500" style={{ width: `${current.percent || 0}%` }}/></div><p className="mt-2 text-[10px] font-bold text-slate-500">Next level unlocks after passing all tests in previous level</p></div></section> }

function History({ history, loading, more, onMore }: any) { return <section className="rounded-[14px] bg-white p-4 shadow-[0_5px_18px_rgba(36,29,83,.09)]"><h2 className="flex items-center gap-2 text-sm font-black"><Clock3 size={17} className="text-[#4b39cf]"/>Your Test History</h2><div className="mt-4 space-y-2">{history.map((item: any, index: number) => <div key={item.resultId || index} className={`rounded-[9px] border p-3 ${index === 0 ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100'}`}><div className="flex justify-between gap-2"><div className="min-w-0"><p className="truncate text-xs font-black">{item.title || 'Typing Test'}</p><p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500"><CalendarDays size={11}/>{historyDate(item.attemptedAt)}</p><p className="mt-1 text-[10px] font-black text-[#4b39cf]">Level {item.level}: {item.levelName}</p></div><div className="text-right"><p className="text-xs font-black text-emerald-600">{Number(item.netWpm || 0).toFixed(2)} WPM</p><p className="mt-1 text-[11px] font-black">{Number(item.accuracy || 0).toFixed(2)}%</p></div></div></div>)}{!loading && !history.length && <p className="py-5 text-center text-xs font-bold text-slate-500">No typing history yet</p>}{loading && <p className="py-4 text-center text-xs text-slate-500">Loading history…</p>}</div><button disabled={!more || loading} onClick={onMore} className="mt-4 flex w-full items-center justify-center gap-2 rounded-[9px] bg-[#eef1ff] py-3 text-xs font-black text-[#4b39cf] disabled:opacity-50"><Trophy size={15}/>{more ? 'Load More History' : 'All History Loaded'}</button></section> }
