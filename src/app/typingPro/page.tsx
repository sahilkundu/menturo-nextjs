'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, FileText, Globe2, Lock, Play, RotateCcw, Settings, Trash2, Trophy } from 'lucide-react'
import TypingProTestCardSkeleton from '../../shared/components/Skeleton/TypingProTestCardSkeleton'
import { useUserStore } from '../../shared/store/user'
import { useTypingStore } from '../../shared/store/typingStore'
import type { TypingAction, TypingTest } from '../../shared/store/typingStore'
import { showPopupMessage } from '../../shared/utils/popup'
import { showRouteLoader } from '../../shared/utils/routeLoader'
import { goToLoginAfterRememberingPage } from '../../shared/utils/loginRedirect'
import AdSenseAd from '../../shared/components/AdSenseAd'
import { DELETE_TYPING_HISTORY } from '../../../api'

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
    const clearTestsCache = useTypingStore((state) => state.clearTestsCache)
    const applyTypingTestUpdate = useTypingStore((state) => state.applyTypingTestUpdate)
    const controlsLocked = loadingTests
    const [selectedTestId, setSelectedTestId] = useState('')
    const [testMenuOpen, setTestMenuOpen] = useState(false)
    const [canScrollLevelsLeft, setCanScrollLevelsLeft] = useState(false)
    const [deletingHistoryKey, setDeletingHistoryKey] = useState('')
    const testMenuRef = useRef<HTMLDivElement>(null)
    const levelTabsRef = useRef<HTMLDivElement>(null)
    const testsScrollRef = useRef<HTMLDivElement>(null)
    const loadMoreRef = useRef<HTMLDivElement>(null)
    const loadingPlaceholders = Array.from({ length: loadingTests ? 3 : 0 }, (_, index) => ({ testId: `__typing-skeleton-${index}`, title: '', language: 'english', level: 1, levelName: 'Easy', duration: 1 } as TypingTest))
    const activeTests = tests.filter((test) => test.levelName === level && test.language === language)
    const visibleTests = [...(selectedTestId ? activeTests.filter((test) => test.testId === selectedTestId) : activeTests), ...loadingPlaceholders]
    const selectedTest = activeTests.find((test) => test.testId === selectedTestId)
    const selectedTestLabel = selectedTest ? `${activeTests.indexOf(selectedTest) + 1}. ${selectedTest.title}` : `All loaded tests (${activeTests.length})`

    useEffect(() => { if (!authenticated && !authChecked) fetchUser() }, [authenticated, authChecked, fetchUser])
    useEffect(() => { void loadTests(level, 1, true, language); void loadHistory(1, true) }, [language, level, loadHistory, loadTests])
    useEffect(() => { setSelectedTestId(''); testsScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' }) }, [language, level])
    useEffect(() => {
        const sentinel = loadMoreRef.current
        if (!sentinel || selectedTestId || !testsHasMore || loadingTests) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    void loadTests(level, testPage + 1, false, language)
                }
            },
            {
                root: testsScrollRef.current,
                rootMargin: '0px 0px 500px 0px'
            }
        )

        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [language, level, loadTests, loadingTests, selectedTestId, testPage, testsHasMore])
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

    const login = async () => { await goToLoginAfterRememberingPage(router) }
    const open = async (test: TypingTest, action: TypingAction = 'start', historyId = '') => {
        if (!authenticated) { showPopupMessage('Please sign in to start typing test', false); await login(); return }
        if (test.available === false || test.access === false) { showPopupMessage('This test is locked', false); return }
        setPendingTest(test.testId, action, historyId, duration)
        showRouteLoader(); router.push('/typingTest')
    }
    const deleteTypingHistory = async (resultId = '', deleteAll = false) => {
        if (!authenticated) {
            showPopupMessage('Please sign in to delete typing attempts', false)
            await login()
            return
        }

        if (!deleteAll && !resultId) {
            showPopupMessage('No typing attempt available to delete', false)
            return
        }

        const key = deleteAll ? 'all' : resultId

        if (deletingHistoryKey) return

        try {
            setDeletingHistoryKey(key)

            const response = await fetch(DELETE_TYPING_HISTORY, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resultId,
                    deleteAll,
                    level,
                    lan: language === 'hindi' ? 'hn' : 'en',
                    testId: selectedTestId
                })
            })

            const data = await response.json()

            if (!response.ok || !data?.success) {
                showPopupMessage(data?.message || 'Unable to delete typing attempt', false)
                return
            }

            showPopupMessage(data?.message || 'Typing attempt deleted', true)
            clearTestsCache()
            await loadHistory(1, true)
            await loadTests(level, 1, true, language)
        } catch {
            showPopupMessage('Unable to delete typing attempt', false)
        } finally {
            setDeletingHistoryKey('')
        }
    }

    return <main className="typing-font min-h-[100dvh] bg-[#f6f7fb] px-2 py-2 pb-24 text-[#121735] sm:px-3 xl:h-[100dvh] xl:min-h-0 xl:overflow-hidden xl:pb-16">
        <div className="mx-auto max-w-[1240px] xl:grid xl:h-[calc(100dvh-76px)] xl:min-h-0 xl:grid-cols-[minmax(0,1fr)_292px] xl:grid-rows-[260px_minmax(0,1fr)] xl:items-stretch xl:gap-x-5 xl:gap-y-3">
            <div className="space-y-3 xl:contents">
            <div className="space-y-3 xl:col-start-1 xl:row-start-1 xl:flex xl:h-full xl:flex-col xl:gap-3 xl:space-y-0">
            <section className="xl:col-start-1 rounded-[14px] bg-[#f8f9fc] p-2 shadow-[0_5px_18px_rgba(36,29,83,.13)] xl:p-1.5"><div className="flex flex-wrap gap-2">{(['english','hindi'] as const).map((item) => <button key={item} disabled={controlsLocked} onClick={() => setLanguage(item)} className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-black shadow-sm transition-all disabled:cursor-wait disabled:opacity-60 xl:py-1.5 ${language === item ? 'border-[#4b397c] bg-[linear-gradient(135deg,#57478e,#332760)] text-white shadow-[#4b397c]/20' : 'border-[#e5e0f0] bg-white text-[#706783] hover:border-[#cbbfe5] hover:bg-[#faf8ff]'}`}><Globe2 size={15}/>{item === 'english' ? 'English' : 'Hindi'}</button>)}</div></section>
            <section className="xl:col-start-1 rounded-[14px] bg-white p-3 shadow-[0_5px_18px_rgba(36,29,83,.13)] xl:p-2">
                <div className="relative">
                    <div ref={levelTabsRef} onScroll={(event) => setCanScrollLevelsLeft(event.currentTarget.scrollLeft > 4)} className="flex gap-2 overflow-x-auto px-2 py-1 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {levels.map((item, index) => {
                            const unlocked = item === 'Easy' || access[item] === true
                            return <button key={item} disabled={controlsLocked} onClick={() => setLevel(item)} className={`relative shrink-0 rounded-xl border px-3 py-2 text-[11px] font-black shadow-sm transition-all disabled:cursor-wait disabled:opacity-60 xl:py-1.5 ${level === item ? 'border-[#4b397c] bg-[linear-gradient(135deg,#57478e,#332760)] text-white shadow-md shadow-[#4b397c]/25 ring-2 ring-[#a99ce0] ring-offset-2' : unlocked ? 'border-[#e5e0f0] bg-white text-[#706783] hover:border-[#cbbfe5] hover:bg-[#faf8ff]' : 'border-[#e9e6ef] bg-[#f7f8fb] text-slate-400'}`}>{!unlocked && <Lock className="mr-1 inline" size={12}/>} {index + 1}. {item}</button>
                        })}
                    </div>
                    {canScrollLevelsLeft && <button type="button" aria-label="Show previous levels" onClick={() => levelTabsRef.current?.scrollBy({ left: -180, behavior: 'smooth' })} className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-[#ddd5ef] bg-white/95 p-1.5 text-[#57478e] shadow-sm sm:hidden"><ChevronLeft size={15}/></button>}
                    <button type="button" aria-label="Show more levels" onClick={() => levelTabsRef.current?.scrollBy({ left: 180, behavior: 'smooth' })} className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-[#ddd5ef] bg-white/95 p-1.5 text-[#57478e] shadow-sm sm:hidden"><ChevronRight size={15}/></button>
                </div>
            </section>
            <div className="xl:flex-1"><Progress level={level} progress={progress}/></div>
            </div>
            <div className="xl:hidden"><Setup duration={duration} setDuration={setDuration} backspace={backspace} highlight={highlight} spelling={spelling} setSetting={setSetting}/></div>
            <div className="min-h-0 xl:col-start-1 xl:row-start-2">
                <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[20px] border border-[#ddd5f1] bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFBFF_58%,#F6F3FF_100%)] p-3 shadow-[0_16px_38px_rgba(67,48,117,.12)] sm:p-4"><div className="mb-4 flex shrink-0 flex-wrap items-center justify-between gap-3 xl:mb-2"><div><h1 className="text-base font-black tracking-[-0.01em] text-[#251b49]">{level} {language === 'english' ? 'English' : 'Hindi'} Typing Tests</h1><p className="mt-1 text-xs font-bold text-[#7b7297]">Smooth practice, instant progress, and focused typing.</p></div><div ref={testMenuRef} className="relative w-full sm:w-64"><button type="button" disabled={!activeTests.length} onClick={() => setTestMenuOpen((open) => !open)} aria-label="Filter loaded typing tests" aria-haspopup="listbox" aria-expanded={testMenuOpen} className="flex w-full items-center justify-between gap-2 rounded-[9px] border border-[#d8cff3] bg-[#f8f6ff] px-3 py-2 text-left text-xs font-black text-[#4b397c] outline-none disabled:opacity-50"><span className="min-w-0 truncate">{selectedTestLabel}</span><span aria-hidden="true" className="shrink-0">▾</span></button>{testMenuOpen && <div role="listbox" aria-label="Loaded typing tests" className="absolute right-0 z-20 mt-1 max-h-[320px] w-full overflow-y-auto rounded-[9px] border border-[#d8cff3] bg-[#f8f6ff] py-1 shadow-lg"><button type="button" role="option" aria-selected={!selectedTestId} onClick={() => { setSelectedTestId(''); setTestMenuOpen(false) }} className={`block w-full truncate px-3 py-2 text-left text-xs font-black ${!selectedTestId ? 'bg-[#4b397c] text-white' : 'bg-[#f8f6ff] text-[#4b397c] hover:bg-[#eee9fb]'}`}>All loaded tests ({activeTests.length})</button>{activeTests.map((test, index) => <button key={test.testId} type="button" role="option" aria-selected={selectedTestId === test.testId} title={`${index + 1}. ${test.title}`} onClick={() => { setSelectedTestId(test.testId); setTestMenuOpen(false) }} className={`block w-full truncate px-3 py-2 text-left text-xs font-black ${selectedTestId === test.testId ? 'bg-[#4b397c] text-white' : 'bg-[#f8f6ff] text-[#4b397c] hover:bg-[#eee9fb]'}`}>{index + 1}. {test.title}</button>)}</div>}</div></div><div ref={testsScrollRef} className="h-[480px] overflow-y-auto rounded-[16px] sm:h-[420px] lg:h-[52dvh] lg:max-h-[540px] xl:h-auto xl:min-h-0 xl:max-h-none xl:flex-1 border border-[#e9e3f7] bg-white/75 p-2 pr-1 shadow-[inset_0_1px_0_rgba(255,255,255,.9)] sm:max-h-[470px] sm:p-3 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#eeeafb] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#9b8bd4] [&::-webkit-scrollbar-thumb]:hover:bg-[#7661b5]"><div className="space-y-2.5">{visibleTests.map((test) => <TestCard key={test.testId} test={test} requirements={progress[test.levelName]} onOpen={open}/>)}</div>{loadingTests && <p className="py-8 text-center text-sm font-bold text-slate-500">Loading typing tests…</p>}{!loadingTests && !activeTests.length && <p className="rounded-xl border border-dashed p-8 text-center text-sm font-bold text-slate-500">No tests found for this level.</p>}{!loadingTests && activeTests.length > 0 && !visibleTests.length && <p className="rounded-xl border border-dashed p-8 text-center text-sm font-bold text-slate-500">Select a loaded test from the menu above.</p>}<div ref={loadMoreRef} className="mt-3 min-h-9 rounded-xl border border-[#e4def5] bg-[#f4f1fc] px-3 py-2 text-center text-[11px] font-black tracking-wide text-[#6653a7]" aria-live="polite">{selectedTestId ? null : loadingTests ? 'Loading more tests...' : testsHasMore ? 'Scroll to load more tests' : 'All tests loaded'}</div></div></section>
            </div>
            </div>
            <aside className="mt-3 space-y-3 xl:contents"><div className="hidden min-h-0 xl:col-start-2 xl:row-start-1 xl:block"><Setup duration={duration} setDuration={setDuration} backspace={backspace} highlight={highlight} spelling={spelling} setSetting={setSetting}/></div><div className="min-h-0 xl:col-start-2 xl:row-start-2"><History history={history} loading={loadingHistory} more={historyHasMore} authenticated={authenticated} deletingKey={deletingHistoryKey} onDeleteLatest={() => void deleteTypingHistory(history[0]?.resultId || '', false)} onResetAll={() => void deleteTypingHistory('', true)} onMore={() => void loadHistory(historyPage + 1, false)}/></div></aside>
        </div>
        <AdSenseAd
            className="mx-auto mt-6 max-w-[1180px] xl:hidden"
        />
    </main>
}

function TestCard({ test, requirements, onOpen }: { test: TypingTest; requirements?: { minimumSpeed?: number; minimumAccuracy?: number }; onOpen: (test: TypingTest, action?: TypingAction, historyId?: string) => void }) {
    if (test.testId.startsWith('__typing-skeleton-')) return <TypingProTestCardSkeleton />

    const resume = test.history?.find((item) => item.historyId === test.actions?.resumeHistoryId || item.status === 'resume' || item.status === 'running')
    const solution = test.history?.find((item) => item.historyId === test.actions?.solutionHistoryId || item.status === 'submitted')
    const primaryAction = test.actions?.primary === 'resume' ? 'resume' : 'start'
    const resumeHistoryId = test.actions?.resumeHistoryId || resume?.historyId || ''
    const locked = test.access === false || test.available === false
    const attempted = Boolean(solution)
    const score = solution?.score || 0
    const accuracy = solution?.accuracy || 0
    const requiredSpeed = requirements?.minimumSpeed || 0
    const requiredAccuracy = requirements?.minimumAccuracy || 0

    return (
        <article className="rounded-[18px] border border-[#e2dcf3] bg-[linear-gradient(135deg,#FFFFFF_0%,#FCFBFF_100%)] px-3.5 py-3 shadow-[0_6px_18px_rgba(67,48,117,.07)] sm:px-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-[13px] font-black text-[#20193e]">{test.title}</h2>
                        <span className="rounded-md border border-[#f3d88e] bg-[#fff7d9] px-1.5 py-0.5 text-[9px] font-black text-[#9a6500]">Level {test.level}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-[#756c91]">
                        <span className="inline-flex items-center gap-1"><FileText size={12} className="text-[#7f6cc4]"/>{test.words || 0} Words</span>
                        {resume && <span className="inline-flex items-center gap-1"><Clock3 size={12} className="text-[#7f6cc4]"/>{resume.duration || test.duration || 1} Min</span>}
                        <span className="inline-flex items-center gap-1"><Globe2 size={12} className="text-sky-500"/>{test.language === 'english' ? 'en' : 'hn'}, {test.levelName}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 min-w-[120px] flex-1 overflow-hidden rounded-full bg-[#eeebf6]">
                            <div className={`h-full rounded-full ${attempted ? 'w-full bg-emerald-400' : 'w-[12%] bg-[#8b78cc]'}`}/>
                        </div>
                        <span className="text-[9px] font-black text-[#8b829f]">{attempted ? 'Completed' : 'Practice'}</span>
                    </div>
                    {attempted ? (
                        <p className="mt-1.5 text-[10px] font-bold text-[#8b829f]">{score} WPM / {Number(accuracy).toFixed(1)}%</p>
                    ) : (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] font-black">
                            <span className="text-[#716789]">Need</span>
                            <span className="rounded-md bg-violet-100 px-1.5 py-0.5 text-violet-700 ring-1 ring-inset ring-violet-200">{requiredSpeed} WPM</span>
                            <span className="text-[#8b829f]">/</span>
                            <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-amber-700 ring-1 ring-inset ring-amber-200">{requiredAccuracy}% accuracy</span>
                        </div>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                    {locked ? (
                        <span className="inline-flex min-w-[132px] items-center justify-center gap-1.5 rounded-xl bg-[#e9edf3] px-3 py-2.5 text-[11px] font-black text-[#72809a]"><Lock size={13}/> Locked</span>
                    ) : (
                        <>
                            {solution && <button onClick={() => onOpen(test, 'solution', solution.historyId || '')} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#ddd5ef] bg-white px-3 py-2.5 text-[11px] font-black text-[#58458c] shadow-sm transition-colors hover:bg-[#f7f4fd]">Solutions</button>}
                            <button onClick={() => onOpen(test, primaryAction, resumeHistoryId)} className="inline-flex min-w-[104px] items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#56448b,#38296b)] px-3 py-2.5 text-[11px] font-black text-white shadow-[0_7px_15px_rgba(75,57,124,.22)] transition-transform hover:-translate-y-px"><Play size={12}/>{primaryAction === 'resume' ? 'Resume' : attempted ? 'Test Again' : 'Start Test'}</button>
                        </>
                    )}
                </div>
            </div>
        </article>
    )
}

function Setup({ duration, setDuration, backspace, highlight, spelling, setSetting }: any) {
    const [durationMenuOpen, setDurationMenuOpen] = useState(false)
    const durationMenuRef = useRef<HTMLDivElement>(null)
    const settings = [
        ['backspaceEnabled', 'Backspace', backspace],
        ['highlightEnabled', 'Highlight & Auto Scroll', highlight],
        ['liveSpellingEnabled', 'Live Spelling Check', spelling]
    ] as const

    useEffect(() => {
        if (!durationMenuOpen) return
        const closeMenu = (event: MouseEvent) => {
            if (!durationMenuRef.current?.contains(event.target as Node)) setDurationMenuOpen(false)
        }
        document.addEventListener('mousedown', closeMenu)
        return () => document.removeEventListener('mousedown', closeMenu)
    }, [durationMenuOpen])

    return <section className="relative z-30 h-full overflow-visible rounded-[16px] bg-white p-3.5 shadow-[0_5px_18px_rgba(36,29,83,.09)] xl:p-3">
        <h2 className="flex items-center gap-2 text-sm font-black"><Settings size={17} className="text-[#4b39cf]"/>Test Setup</h2>
        <div className="mt-3 xl:mt-2">
            <div>
                <span className="mb-1.5 block text-[10px] font-black">Choose time</span>
                <div ref={durationMenuRef} className="relative">
                    <Clock3 size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#4f36ff]"/>
                    <button type="button" id="typing-test-duration" aria-haspopup="listbox" aria-expanded={durationMenuOpen} onClick={() => setDurationMenuOpen((open) => !open)} className="flex w-full items-center justify-between rounded-xl border border-[#d8cff3] bg-[#f8f6ff] py-2.5 pl-9 pr-3 text-left text-xs font-black text-[#38296b] outline-none transition focus:border-[#4f36ff] focus:ring-2 focus:ring-[#4f36ff]/15 xl:py-2">
                        <span>{duration} {duration === 1 ? 'minute' : 'minutes'}</span>
                        <span aria-hidden="true" className="text-[10px] text-[#6653a7]">▼</span>
                    </button>
                    {durationMenuOpen && <div role="listbox" aria-label="Typing test duration" className="absolute left-0 right-0 z-50 mt-1 max-h-[300px] overflow-y-auto rounded-[9px] border border-[#d8cff3] bg-[#f8f6ff] py-1 shadow-xl [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#8c8991]">
                        {Array.from({ length: 60 }, (_, index) => index + 1).map((value) => <button type="button" role="option" aria-selected={duration === value} key={value} onClick={() => { setDuration(value); setDurationMenuOpen(false) }} className={`block w-full px-3 py-2 text-left text-xs font-bold ${duration === value ? 'bg-[#58418f] text-white' : 'text-[#4b397c] hover:bg-[#eee9fb]'}`}>{value} {value === 1 ? 'minute' : 'minutes'}</button>)}
                    </div>}
                </div>
            </div>
        </div>
        <div className="mt-4 space-y-2.5 xl:mt-2.5 xl:space-y-1.5" aria-label="Typing test settings">
            {settings.map(([key, label, enabled]) => <button type="button" role="switch" key={key} aria-checked={enabled} onClick={() => setSetting(key, !enabled)} className="flex w-full items-center justify-between gap-3 text-left text-[13px] font-black text-[#171b3a] xl:text-[12px]"><span>{label}</span><span className={`relative h-8 w-12 shrink-0 rounded-full p-1 transition-colors xl:h-7 xl:w-11 ${enabled ? 'bg-[#5038ff]' : 'bg-slate-300'}`}><span className={`absolute top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-transform xl:h-5 xl:w-5 ${enabled ? 'translate-x-4 text-[#5038ff]' : 'translate-x-0 text-slate-400'}`}>{enabled && <Check size={14} strokeWidth={3}/>}</span></span></button>)}
        </div>
    </section>
}

function Progress({ level, progress }: any) {
    const current = progress[level] || { total: 0, passed: 0, percent: 0 }
    const percent = Math.max(0, Math.min(100, Number(current.percent) || 0))
    const levelNumber = Math.max(1, levels.indexOf(level) + 1)
    return <section className="h-full rounded-[16px] border border-[#ded7f3] bg-[linear-gradient(135deg,#ffffff_0%,#faf8ff_100%)] p-3 shadow-[0_7px_20px_rgba(75,57,124,.12)] xl:p-2.5">
        <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-[12px] font-black"><BarChart3 size={16} className="text-[#4b39cf]"/>Your Progress & Levels</h2>
            <span className="rounded-full bg-[#4b397c] px-2.5 py-1 text-[9px] font-black text-white shadow-sm">{percent}% complete</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-[#e3dcf5] bg-[#f5f2fd] px-2.5 py-1.5">
            <div><span className="block text-[8px] font-black uppercase tracking-[0.12em] text-[#8173ad]">Current level</span><span className="text-[12px] font-black text-[#38296b]">{levelNumber}. {level}</span></div>
            <span className="text-[10px] font-black text-[#6653a7]">{current.passed}/{current.total} tests passed</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#e7e3f0] shadow-inner" role="progressbar" aria-label={`${level} progress`} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-gradient-to-r from-[#6554d9] via-[#8b78e6] to-emerald-500 transition-[width] duration-500" style={{ width: `${percent}%` }}/></div>
        <p className="mt-2 flex min-h-7 w-full min-w-0 items-center gap-1.5 whitespace-normal rounded-lg bg-amber-50 px-2 py-1.5 text-[10px] font-black leading-snug text-amber-800 ring-1 ring-inset ring-amber-200 sm:text-[11px] lg:text-[10px]"><Trophy size={12} className="shrink-0 text-amber-600"/><span className="min-w-0">Pass all tests to unlock the next level.</span></p>
    </section>
}

function History({ history, loading, more, authenticated, deletingKey, onDeleteLatest, onResetAll, onMore }: any) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const loadMoreRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const root = scrollRef.current
        const sentinel = loadMoreRef.current
        if (!root || !sentinel || loading || !more) return

        const observer = new IntersectionObserver(
            (entries) => { if (entries[0]?.isIntersecting) onMore() },
            { root, rootMargin: '0px 0px 180px 0px' }
        )

        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [history.length, loading, more, onMore])

    return <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[16px] bg-white p-3.5 shadow-[0_5px_18px_rgba(36,29,83,.09)]">
        <div className="mb-3 flex items-start justify-between gap-2">
            <div>
                <h2 className="flex items-center gap-2 text-sm font-black"><Clock3 size={17} className="text-[#4b39cf]"/>Your Test History</h2>
                {authenticated && history.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        <button type="button" disabled={Boolean(deletingKey)} onClick={onDeleteLatest} className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-red-200 bg-white px-2.5 text-[10px] font-bold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60">
                            <Trash2 size={13} aria-hidden="true" />
                            {deletingKey && deletingKey !== 'all' ? 'Deleting...' : 'Delete latest'}
                        </button>
                        <button type="button" disabled={Boolean(deletingKey)} onClick={onResetAll} className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-red-700 bg-red-600 px-2.5 text-[10px] font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
                            <RotateCcw size={13} aria-hidden="true" />
                            {deletingKey === 'all' ? 'Resetting...' : 'Reset all'}
                        </button>
                    </div>
                ) : null}
            </div>
            <span className="shrink-0 rounded-full bg-[#f2effa] px-2 py-1 text-[9px] font-black text-[#6653a7]">{history.length} loaded</span>
        </div>
        <div ref={scrollRef} className="h-[230px] space-y-2 overflow-y-auto pr-1 sm:h-[280px] xl:h-auto xl:min-h-0 xl:flex-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#eeeafb] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#9b8bd4]">
            {history.map((item: any, index: number) => <div key={item.resultId || index} className={`rounded-xl border p-2.5 ${index === 0 ? 'border-emerald-200 bg-emerald-50/60' : 'border-[#ebe7f4] bg-[#fdfcff]'}`}><div className="flex justify-between gap-2"><div className="min-w-0"><p className="truncate text-[11px] font-black">{item.title || 'Typing Test'}</p><p className="mt-1 flex items-center gap-1 text-[9px] text-slate-500"><CalendarDays size={10}/>{historyDate(item.attemptedAt)}</p><p className="mt-1 text-[9px] font-black text-[#4b39cf]">Level {item.level}: {item.levelName}</p></div><div className="text-right"><p className="text-[11px] font-black text-emerald-600">{Number(item.netWpm || 0).toFixed(2)} WPM</p><p className="mt-1 text-[10px] font-black">{Number(item.accuracy || 0).toFixed(2)}%</p></div></div></div>)}
            {!loading && !history.length && <p className="py-5 text-center text-xs font-bold text-slate-500">No typing history yet</p>}
            {loading && <TypingHistorySkeleton />}
            <div ref={loadMoreRef} className="min-h-4" aria-label="Load more history"/>
            {!loading && history.length > 0 && <p className="py-1 text-center text-[9px] font-black text-[#81779b]">{more ? 'Scroll for more history' : 'All history loaded'}</p>}
        </div>
    </section>
}

function TypingHistorySkeleton() {
    return <div className="animate-pulse space-y-2">{Array.from({ length: 2 }).map((_, index) => <div key={index} className="rounded-xl border border-[#ebe7f4] bg-[#fdfcff] p-2.5"><div className="h-3 w-2/3 rounded bg-[#ece8f4]"/><div className="mt-2 h-2 w-1/2 rounded bg-[#f1eef7]"/><div className="mt-2 h-2 w-1/3 rounded bg-[#f1eef7]"/></div>)}</div>
}
