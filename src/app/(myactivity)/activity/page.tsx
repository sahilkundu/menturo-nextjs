'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import LiveTestActivity from '../../../shared/components/LiveTestActivity'
import { useUserStore } from '../../../shared/store/user'

// Dynamic import for Chart.js
const Chart = dynamic(() => import('chart.js/auto'), { ssr: false })

// Demo score data used by the existing dashboard. Names are always rendered
// from the authenticated account below; no other user's identity is stored or shown here.
const hardcodedScores = [
  { _id: '1', date: '2025-06-01T10:30:00', chapters: 'JavaScript, React', correct: 18, incorrect: 2, totalQuestions: 20 },
  { _id: '2', date: '2025-05-30T09:15:00', chapters: 'Python, Django', correct: 15, incorrect: 5, totalQuestions: 20 },
  { _id: '3', date: '2025-05-28T14:20:00', chapters: 'HTML, CSS', correct: 19, incorrect: 1, totalQuestions: 20 },
  { _id: '4', date: '2025-05-25T11:00:00', chapters: 'TypeScript, Next.js', correct: 14, incorrect: 6, totalQuestions: 20 },
  { _id: '5', date: '2025-05-22T16:30:00', chapters: 'Node.js, Express', correct: 16, incorrect: 4, totalQuestions: 20 },
  { _id: '6', date: '2025-05-20T08:45:00', chapters: 'MongoDB, SQL', correct: 17, incorrect: 3, totalQuestions: 20 },
  { _id: '7', date: '2025-05-18T13:10:00', chapters: 'Tailwind, Bootstrap', correct: 20, incorrect: 0, totalQuestions: 20 },
  { _id: '8', date: '2025-05-15T10:00:00', chapters: 'JavaScript', correct: 12, incorrect: 8, totalQuestions: 20 },
  { _id: '9', date: '2025-05-12T15:30:00', chapters: 'React Native', correct: 13, incorrect: 7, totalQuestions: 20 },
  { _id: '10', date: '2025-05-10T09:20:00', chapters: 'Angular', correct: 11, incorrect: 9, totalQuestions: 20 },
]

export default function ScoreCardPage() {
  const user = useUserStore((state) => state.user)
  const activityOwner = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.username || 'Your account'
  const [currentDateTime, setCurrentDateTime] = useState('')
  const [calendarYear, setCalendarYear] = useState(2025)
  const [calendarMonth, setCalendarMonth] = useState(5) // June 2025
  const [chartsReady, setChartsReady] = useState(false)
  
  // Chart refs
  const performanceChartRef = useRef(null)
  const chapterChartRef = useRef(null)
  let performanceChartInstance = null
  let chapterChartInstance = null

  // Update date time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setCurrentDateTime(now.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }))
    }
    updateDateTime()
    const interval = setInterval(updateDateTime, 60000)
    
    // Wait for DOM to be ready
    setTimeout(() => {
      setChartsReady(true)
      updateAllStats()
      renderAttendanceCalendar()
    }, 500)
    
    return () => clearInterval(interval)
  }, [])

  // Re-render calendar when month/year changes
  useEffect(() => {
    if (chartsReady) {
      renderAttendanceCalendar()
    }
  }, [calendarYear, calendarMonth])

  // Render charts when ready
  useEffect(() => {
    if (chartsReady) {
      renderPerformanceChart()
      renderChapterChart()
    }
  }, [chartsReady])

  useEffect(() => {
    if (chartsReady) renderFullActivityTable()
  }, [chartsReady, activityOwner])

  // Helper functions
  const truncateChapter = (chapter) => {
    if (!chapter || chapter.length <= 20) return chapter || 'N/A'
    return chapter.substring(0, 17) + '...'
  }

  const getFirstThreeChars = (chapters) => {
    if (!chapters) return 'N/A'
    const firstChapter = chapters.split(',')[0]?.trim()
    return firstChapter ? firstChapter.substring(0, 3).toUpperCase() : 'N/A'
  }

  const formatDateToYMD = (date) => {
    return date.toISOString().split('T')[0]
  }

  const calculatePercentage = (correct, total) => {
    if (total === 0) return '0'
    return ((correct / total) * 100).toFixed(1)
  }

  const getAverageStatus = (avg) => {
    if (avg >= 70) return { text: 'Good! Keep it up.', className: 'text-emerald-600' }
    if (avg >= 50) return { text: 'Average. Room for improvement.', className: 'text-amber-500' }
    return { text: 'Poor. Time to practice more!', className: 'text-rose-600' }
  }

  // Get test dates for calendar
  const getTestDatesForMonth = (year, month) => {
    const testDatesSet = new Set()
    hardcodedScores.forEach(score => {
      const scoreDate = new Date(score.date)
      if (scoreDate.getFullYear() === year && scoreDate.getMonth() === month) {
        testDatesSet.add(formatDateToYMD(scoreDate))
      }
    })
    return testDatesSet
  }

  // Render all stats
  const updateAllStats = () => {
    const totalTests = hardcodedScores.length
    document.getElementById('totalTestsCount').innerText = totalTests
    
    // Last 7 average
    const lastSevenScores = hardcodedScores.slice(0, 7)
    let totalCorrect = 0
    let totalQuestions = 0
    lastSevenScores.forEach(score => {
      totalCorrect += score.correct || 0
      totalQuestions += score.totalQuestions || 0
    })
    const avgPercentageNum = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0
    document.getElementById('avgCorrectPercentage').innerText = `${avgPercentageNum.toFixed(1)}%`
    
    // Rating
    const rating = totalQuestions > 0 ? ((avgPercentageNum / 100) * 5).toFixed(1) : '--'
    document.getElementById('overallRating').innerText = rating !== '--' ? `${rating}/5` : '--'
    
    // Average status
    const status = getAverageStatus(avgPercentageNum)
    const avgStatusEl = document.getElementById('averageStatus')
    if (avgStatusEl) {
      avgStatusEl.innerHTML = `<span class="${status.className}">${status.text}</span>`
    }
    
    // Most used chapter
    const chapterCounts = {}
    hardcodedScores.forEach(score => {
      if (score.chapters) {
        score.chapters.split(', ').forEach(ch => {
          const trimmedCh = ch.trim()
          if (trimmedCh) {
            chapterCounts[trimmedCh] = (chapterCounts[trimmedCh] || 0) + 1
          }
        })
      }
    })
    const mostUsed = Object.keys(chapterCounts).reduce((a, b) => chapterCounts[a] > chapterCounts[b] ? a : b, '')
    document.getElementById('mostUsedChapter').innerText = truncateChapter(mostUsed) || 'N/A'
    
    // Rank
    document.getElementById('currentRank').innerText = '42 / 150'
    
    // Last 6 average
    const lastSixScores = hardcodedScores.slice(0, 6)
    let lastSixTotalCorrect = 0
    let lastSixTotalQuestions = 0
    lastSixScores.forEach(score => {
      lastSixTotalCorrect += score.correct || 0
      lastSixTotalQuestions += score.totalQuestions || 0
    })
    const lastSixAvgNum = lastSixTotalQuestions > 0 ? (lastSixTotalCorrect / lastSixTotalQuestions) * 100 : 0
    document.getElementById('lastSixAvg').innerText = `${lastSixAvgNum.toFixed(1)}%`
    
    // Render breakdowns
    renderAverageBreakdown(lastSevenScores)
    renderLastSixBreakdown(lastSixScores)
    renderFavoriteTests()
    renderFullActivityTable()
  }

  const renderAverageBreakdown = (scoresData) => {
    const tbody = document.getElementById('testBreakdownTable')
    if (!tbody) return
    tbody.innerHTML = ''
    scoresData.forEach((score, index) => {
      const testNum = scoresData.length - index
      const percent = calculatePercentage(score.correct, score.totalQuestions)
      tbody.innerHTML += `
        <tr>
          <td class="p-2 border border-gray-200 text-center">Test ${testNum}</td>
          <td class="p-2 border border-gray-200 text-center">${score.correct} / ${score.totalQuestions}</td>
          <td class="p-2 border border-gray-200 text-center">${percent}%</td>
        </tr>
      `
    })
  }

  const renderLastSixBreakdown = (scoresData) => {
    const tbody = document.getElementById('lastSixTable')
    if (!tbody) return
    tbody.innerHTML = ''
    scoresData.forEach((score, index) => {
      const testNum = scoresData.length - index
      const percent = calculatePercentage(score.correct, score.totalQuestions)
      const chapterCode = getFirstThreeChars(score.chapters)
      tbody.innerHTML += `
        <tr>
          <td class="p-2 border border-gray-200 text-center">Test ${testNum}</td>
          <td class="p-2 border border-gray-200 text-center" title="${truncateChapter(score.chapters || 'N/A')}">${chapterCode}</td>
          <td class="p-2 border border-gray-200 text-center">${score.correct} / ${score.totalQuestions}</td>
          <td class="p-2 border border-gray-200 text-center">${percent}%</td>
        </tr>
      `
    })
  }

  const renderPerformanceChart = () => {
    if (!performanceChartRef.current) return
    
    // Destroy existing chart
    if (performanceChartInstance) {
      performanceChartInstance.destroy()
    }
    
    const lastSevenScores = [...hardcodedScores].slice(0, 7).reverse()
    const labels = lastSevenScores.map((_, index) => `Test ${index + 1}`)
    const percentages = lastSevenScores.map(score => 
      parseFloat(calculatePercentage(score.correct, score.totalQuestions))
    )
    
    const ctx = performanceChartRef.current.getContext('2d')
    performanceChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Correct Percentage (%)',
          data: percentages,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: 'rgb(99, 102, 241)',
          pointBorderColor: '#fff',
          pointHoverRadius: 8,
          pointRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { 
            beginAtZero: true, 
            max: 100, 
            title: { display: true, text: 'Correct %', font: { size: 14, weight: 'bold' } },
            ticks: { callback: (value) => value + '%' }
          },
          x: { 
            title: { display: true, text: 'Test Number (Oldest to Newest)', font: { size: 14, weight: 'bold' } }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (context) => `Score: ${context.raw}%` } }
        }
      }
    })
  }

  const renderChapterChart = () => {
    if (!chapterChartRef.current) return
    
    // Destroy existing chart
    if (chapterChartInstance) {
      chapterChartInstance.destroy()
    }
    
    const chapterCounts = {}
    hardcodedScores.forEach(score => {
      if (score.chapters) {
        score.chapters.split(', ').forEach(ch => {
          const trimmedCh = ch.trim()
          if (trimmedCh) {
            chapterCounts[trimmedCh] = (chapterCounts[trimmedCh] || 0) + 1
          }
        })
      }
    })
    
    const labels = Object.keys(chapterCounts)
    const data = Object.values(chapterCounts)
    const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#34D399', '#F472B6']
    
    const ctx = chapterChartRef.current.getContext('2d')
    chapterChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { font: { size: 12 } } },
          tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw} times` } }
        }
      }
    })
  }

  const renderFavoriteTests = () => {
    const chapterCounts = {}
    hardcodedScores.forEach(score => {
      if (score.chapters) {
        score.chapters.split(', ').forEach(ch => {
          const trimmedCh = ch.trim()
          if (trimmedCh) {
            chapterCounts[trimmedCh] = (chapterCounts[trimmedCh] || 0) + 1
          }
        })
      }
    })
    
    const repeated = Object.entries(chapterCounts)
      .filter(([, count]) => count > 1)
      .sort(([, a], [, b]) => b - a)
    
    const container = document.getElementById('favoriteTestsContainer')
    if (!container) return
    
    if (repeated.length === 0) {
      container.innerHTML = '<p class="text-center text-gray-500 col-span-full">No repeated tests yet. Try more!</p>'
      return
    }
    
    let html = ''
    repeated.forEach(([chapter, count]) => {
      html += `
        <div class="bg-gradient-to-r from-teal-100 to-pink-100 p-4 rounded-xl text-center shadow-md hover:-translate-y-1 transition-all duration-200">
          <h4 class="font-bold text-gray-800 mb-1">${truncateChapter(chapter)}</h4>
          <p class="text-sm text-gray-600">Taken ${count} times 🔥</p>
        </div>
      `
    })
    container.innerHTML = html
  }

  const renderFullActivityTable = () => {
    const tbody = document.getElementById('fullActivityTable')
    if (!tbody) return
    tbody.innerHTML = ''
    
    hardcodedScores.forEach((score, index) => {
      const percent = calculatePercentage(score.correct, score.totalQuestions)
      const truncatedChapters = truncateChapter(score.chapters)
      const row = document.createElement('tr')
      row.className = index % 2 === 0 ? 'bg-gray-50 hover:bg-blue-50' : 'bg-white hover:bg-blue-50'
      row.innerHTML = `
        <td class="p-3 border border-gray-200 text-center">${index + 1}</td>
        <td class="p-3 border border-gray-200">${new Date(score.date).toLocaleString('en-IN')}</td>
        <td class="p-3 border border-gray-200">${activityOwner}</td>
        <td class="p-3 border border-gray-200 max-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis" title="${score.chapters}">${truncatedChapters}</td>
        <td class="p-3 border border-gray-200 text-center text-emerald-600 font-semibold">${score.correct}</td>
        <td class="p-3 border border-gray-200 text-center text-rose-600">${score.incorrect}</td>
        <td class="p-3 border border-gray-200 text-center font-medium">${score.totalQuestions}</td>
        <td class="p-3 border border-gray-200 text-center text-blue-600 font-bold">${percent}%</td>
      `
      tbody.appendChild(row)
    })
  }

  const renderAttendanceCalendar = () => {
    const container = document.getElementById('calendarContainer')
    if (!container) return
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const monthName = monthNames[calendarMonth]
    const testDatesSet = getTestDatesForMonth(calendarYear, calendarMonth)
    
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay()
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate()
    
    let html = `
      <div class="flex justify-between items-center mb-4">
        <button id="prevMonthBtn" class="bg-transparent text-2xl text-indigo-600 cursor-pointer p-2 rounded hover:bg-indigo-100"><i class="fas fa-chevron-left"></i></button>
        <span class="font-bold text-gray-800">${monthName} ${calendarYear}</span>
        <button id="nextMonthBtn" class="bg-transparent text-2xl text-indigo-600 cursor-pointer p-2 rounded hover:bg-indigo-100"><i class="fas fa-chevron-right"></i></button>
      </div>
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gradient-to-r from-emerald-400 to-blue-500 text-white">
            <th class="p-2 border border-gray-300">Sun</th><th class="p-2 border border-gray-300">Mon</th><th class="p-2 border border-gray-300">Tue</th>
            <th class="p-2 border border-gray-300">Wed</th><th class="p-2 border border-gray-300">Thu</th><th class="p-2 border border-gray-300">Fri</th><th class="p-2 border border-gray-300">Sat</th>
          </tr>
        </thead>
        <tbody>
          <tr>
    `
    
    for (let i = 0; i < firstDay; i++) {
      html += '<td class="p-2 border border-gray-200 bg-gray-100 text-center"></td>'
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const hasTest = testDatesSet.has(dateStr)
      const className = hasTest ? 'bg-emerald-100 font-bold text-emerald-800' : 'hover:bg-gray-100'
      html += `<td class="p-2 border border-gray-200 text-center ${className}">${day}</td>`
      
      if ((firstDay + day) % 7 === 0 && day !== daysInMonth) {
        html += '</tr><tr>'
      }
    }
    
    const totalCells = firstDay + daysInMonth
    const remaining = (7 - (totalCells % 7)) % 7
    for (let i = 0; i < remaining; i++) {
      html += '<td class="p-2 border border-gray-200 bg-gray-100 text-center"></td>'
    }
    
    html += `
          </tr>
        </tbody>
      </table>
      <p class="mt-4 text-center font-semibold text-emerald-600">Attendance: ${testDatesSet.size} days (Marked in Green) 📅</p>
    `
    
    container.innerHTML = html
    
    // Add event listeners
    const prevBtn = document.getElementById('prevMonthBtn')
    const nextBtn = document.getElementById('nextMonthBtn')
    if (prevBtn) {
      prevBtn.onclick = () => {
        let newMonth = calendarMonth - 1
        let newYear = calendarYear
        if (newMonth < 0) {
          newMonth = 11
          newYear--
        }
        setCalendarMonth(newMonth)
        setCalendarYear(newYear)
      }
    }
    if (nextBtn) {
      nextBtn.onclick = () => {
        let newMonth = calendarMonth + 1
        let newYear = calendarYear
        if (newMonth > 11) {
          newMonth = 0
          newYear++
        }
        setCalendarMonth(newMonth)
        setCalendarYear(newYear)
      }
    }
  }

  const toggleAverageDetails = () => {
    const details = document.getElementById('averageDetails')
    const chevron = document.getElementById('avgChevron')
    if (details && chevron) {
      details.classList.toggle('hidden')
      chevron.classList.toggle('fa-rotate-180')
    }
  }

  const toggleLastSixDetails = () => {
    const details = document.getElementById('lastSixDetails')
    const chevron = document.getElementById('lastSixChevron')
    if (details && chevron) {
      details.classList.toggle('hidden')
      chevron.classList.toggle('fa-rotate-180')
    }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-sans antialiased text-gray-800 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <LiveTestActivity />
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="text-2xl font-semibold text-gray-800">{activityOwner}</div>
          <div className="text-base text-gray-600">{currentDateTime}</div>
        </div>
        
        {/* Activity Section */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl">
          <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 border-b-2 border-indigo-200 pb-4 mb-6">
            <i className="fas fa-chart-line mr-2"></i> Your Full Activity Dashboard
          </h3>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="relative bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md hover:-translate-y-1 transition-all">
              <i className="fas fa-tasks text-2xl text-indigo-600 mb-2 block"></i>
              <h3 className="text-xs text-gray-500 mb-3 font-medium">Total Tests Taken</h3>
              <p id="totalTestsCount" className="text-2xl font-bold text-gray-800">0</p>
            </div>
            
            <div onClick={toggleAverageDetails} className="relative bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md hover:-translate-y-1 transition-all cursor-pointer">
              <i className="fas fa-chart-bar text-2xl text-indigo-600 mb-2 block"></i>
              <h3 className="text-xs text-gray-500 mb-3 font-medium">Avg. Correct % (Last 7)</h3>
              <p id="avgCorrectPercentage" className="text-2xl font-bold text-gray-800">--%</p>
              <i id="avgChevron" className="fas fa-chevron-down mt-2 text-gray-400"></i>
            </div>
            
            <div id="averageDetails" className="hidden col-span-full bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2 overflow-x-auto">
              <div id="averageStatus" className="font-bold mb-4 text-center"></div>
              <h4 className="text-sm font-bold mb-2">Test-wise Breakdown (Last 7 Tests):</h4>
              <table className="w-full border-collapse">
                <thead><tr><th className="p-2 border border-gray-300 bg-gray-200">Test No.</th><th className="p-2 border border-gray-300 bg-gray-200">Correct / Total</th><th className="p-2 border border-gray-300 bg-gray-200">Percentage</th></tr></thead>
                <tbody id="testBreakdownTable"></tbody>
              </table>
            </div>
            
            <div className="relative bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md hover:-translate-y-1 transition-all">
              <i className="fas fa-trophy text-2xl text-indigo-600 mb-2 block"></i>
              <h3 className="text-xs text-gray-500 mb-3 font-medium">Overall Rank</h3>
              <p id="currentRank" className="text-2xl font-bold text-gray-800">--</p>
              <p className="text-xs text-gray-400 mt-1">Based on scores vs. all students</p>
            </div>
            
            <div className="relative bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md hover:-translate-y-1 transition-all">
              <i className="fas fa-star text-2xl text-indigo-600 mb-2 block"></i>
              <h3 className="text-xs text-gray-500 mb-3 font-medium">Overall Rating</h3>
              <p id="overallRating" className="text-2xl font-bold text-gray-800">--</p>
              <p className="text-xs text-gray-400 mt-1">Based on average score</p>
            </div>
            
            <div className="relative bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md hover:-translate-y-1 transition-all">
              <i className="fas fa-book-open text-2xl text-indigo-600 mb-2 block"></i>
              <h3 className="text-xs text-gray-500 mb-3 font-medium">Most Used Chapter</h3>
              <p id="mostUsedChapter" className="text-lg font-bold text-gray-800">--</p>
            </div>
            
            <div onClick={toggleLastSixDetails} className="relative bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md hover:-translate-y-1 transition-all cursor-pointer">
              <i className="fas fa-chart-line text-2xl text-indigo-600 mb-2 block"></i>
              <h3 className="text-xs text-gray-500 mb-3 font-medium">Last 6 Tests</h3>
              <p id="lastSixAvg" className="text-2xl font-bold text-gray-800">--%</p>
              <i id="lastSixChevron" className="fas fa-chevron-down mt-2 text-gray-400"></i>
            </div>
            
            <div id="lastSixDetails" className="hidden col-span-full bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2 overflow-x-auto">
              <h4 className="text-sm font-bold mb-2">Last 6 Tests Breakdown:</h4>
              <table className="w-full border-collapse">
                <thead><tr><th className="p-2 border border-gray-300 bg-gray-200">Test No.</th><th className="p-2 border border-gray-300 bg-gray-200">Chapter Code</th><th className="p-2 border border-gray-300 bg-gray-200">Correct / Total</th><th className="p-2 border border-gray-300 bg-gray-200">Percentage</th></tr></thead>
                <tbody id="lastSixTable"></tbody>
              </table>
            </div>
          </div>
          
          {/* Attendance Calendar */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <i className="fas fa-calendar text-emerald-500"></i>
              <span className="font-bold text-gray-800">Attendance Calendar</span>
            </div>
            <div id="calendarContainer"></div>
          </div>
          
          {/* Performance Trend Chart */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <i className="fas fa-chart-line text-blue-500 text-xl"></i>
              <span className="font-bold text-gray-800">Performance Trend (Last 7 Tests - Correct %)</span>
            </div>
            <div className="h-80 w-full">
              <canvas ref={performanceChartRef}></canvas>
            </div>
          </div>
          
          {/* Chapter Usage Distribution Chart */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <i className="fas fa-chart-pie text-purple-500 text-xl"></i>
              <span className="font-bold text-gray-800">Chapter Usage Distribution</span>
            </div>
            <div className="h-80 w-full">
              <canvas ref={chapterChartRef}></canvas>
            </div>
          </div>
          
          {/* Favorite Tests */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <i className="fas fa-star text-amber-500"></i>
              <span className="font-bold text-gray-800">Your Favorite/Repeated Tests</span>
            </div>
            <div id="favoriteTestsContainer" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
          </div>
          
          {/* Full Activity Log */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <i className="fas fa-list text-indigo-500"></i>
              <span className="font-bold text-gray-800">Full Activity Log</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    <th className="p-3 rounded-tl-xl">Test No.</th><th className="p-3">Date</th><th className="p-3">Name</th>
                    <th className="p-3">Chapter</th><th className="p-3">Correct</th><th className="p-3">Incorrect</th>
                    <th className="p-3">Total</th><th className="p-3 rounded-tr-xl">Score %</th>
                  </tr>
                </thead>
                <tbody id="fullActivityTable"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .fa-rotate-180 {
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  )
}
