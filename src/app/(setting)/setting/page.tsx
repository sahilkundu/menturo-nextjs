'use client'

import { useState, useRef, useEffect } from 'react'

// TypeScript Interfaces
interface UserData {
  firstName: string
  lastName: string
  phone: string
  oldEmail: string
  currentEmail: string
  examTarget: string
}

interface SecuritySettings {
  twoFactorEnabled: boolean
  loginAlertsEnabled: boolean
  dndEnabled: boolean
  dndFrom: string
  dndTo: string
}

interface NotificationChannel {
  name: string
  enabled: boolean
}

interface Query {
  id: number
  text: string
  status: string
  time: string
}

export default function SettingPage() {
  // State Variables
  const [coinBalance, setCoinBalance] = useState<number>(1250)
  const [testAttempts, setTestAttempts] = useState<number>(12)
  
  // Form visibility states
  const [showMobileForm, setShowMobileForm] = useState<boolean>(false)
  const [showEmailForm, setShowEmailForm] = useState<boolean>(false)
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false)
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false)
  
  // User Data
  const [userData, setUserData] = useState<UserData>({
    firstName: 'Rahul',
    lastName: 'Sharma',
    phone: '+91 98765 43210',
    oldEmail: 'rahul.old@university.edu',
    currentEmail: 'rahul.student@university.edu',
    examTarget: 'Hartron DEO'
  })
  
  // Security Settings
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginAlertsEnabled: true,
    dndEnabled: false,
    dndFrom: '22:00',
    dndTo: '07:00'
  })
  
  // Notification Channels
  const [notificationChannels, setNotificationChannels] = useState<NotificationChannel[]>([
    { name: '📘 Hartron DEO Updates & Results', enabled: true },
    { name: '💻 Junior Programmer / Programmer Alerts', enabled: false },
    { name: '📊 SSC CGL / CHSL Exam Alerts', enabled: true },
    { name: '📑 HSSC Clerk & State Exam Notifications', enabled: false },
    { name: '🏆 Test Series Reminders & New Tests', enabled: true },
    { name: '💰 Coin Rewards & Partner Offers', enabled: true }
  ])
  
  // Queries
  const [queries, setQueries] = useState<Query[]>([
    { id: 1, text: 'Test series access issue', status: 'Resolved', time: '2 days ago' },
    { id: 2, text: 'Coins not credited after test', status: 'In progress', time: '1 day ago' }
  ])
  const [queryInput, setQueryInput] = useState<string>('')
  
  // Profile Photo
  const [profilePhoto, setProfilePhoto] = useState<string>(
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250'
  )
  
  // Refs for forms
  const newMobileRef = useRef<HTMLInputElement>(null)
  const newEmailRef = useRef<HTMLInputElement>(null)
  const oldPassRef = useRef<HTMLInputElement>(null)
  const newPassRef = useRef<HTMLInputElement>(null)
  const confirmPassRef = useRef<HTMLInputElement>(null)
  
  // Toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success'): void => {
    const toast = document.createElement('div')
    const bgColor = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-blue-600'
    toast.className = `fixed bottom-5 left-1/2 -translate-x-1/2 ${bgColor} text-white px-5 py-2.5 rounded-full text-xs z-50 shadow-lg`
    toast.innerHTML = `<i class="fa-regular fa-bell mr-1"></i> ${message}`
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 2500)
  }
  
  // Handlers
  const handleMobileChange = (): void => {
    const newMobile = newMobileRef.current?.value.trim()
    if (newMobile && newMobile.length >= 10) {
      setUserData({ ...userData, phone: newMobile })
      setShowMobileForm(false)
      showToast(`📱 Mobile number updated to ${newMobile}`, 'success')
    } else {
      showToast('Please enter valid mobile number (min 10 digits)', 'error')
    }
  }
  
  const handleEmailChange = (): void => {
    const newEmail = newEmailRef.current?.value.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (newEmail && emailRegex.test(newEmail)) {
      setUserData({ ...userData, currentEmail: newEmail })
      setShowEmailForm(false)
      showToast(`✨ Email updated to ${newEmail}`, 'success')
    } else {
      showToast('Please enter valid email address', 'error')
    }
  }
  
  const handlePasswordChange = (): void => {
    const oldPass = oldPassRef.current?.value
    const newPass = newPassRef.current?.value
    const confirmPass = confirmPassRef.current?.value
    
    if (!oldPass) {
      showToast('Please enter old password', 'error')
      return
    }
    if (!newPass || newPass.length < 6) {
      showToast('New password must be at least 6 characters', 'error')
      return
    }
    if (newPass !== confirmPass) {
      showToast('New passwords do not match', 'error')
      return
    }
    
    showToast('Password updated successfully!', 'success')
    setShowPasswordForm(false)
    
    // Clear form
    if (oldPassRef.current) oldPassRef.current.value = ''
    if (newPassRef.current) newPassRef.current.value = ''
    if (confirmPassRef.current) confirmPassRef.current.value = ''
  }
  
  const handleRemovePhoto = (): void => {
    const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2394a3b8' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'/%3E%3C/svg%3E"
    setProfilePhoto(defaultAvatar)
    setShowPhotoModal(false)
    showToast('Profile photo removed', 'success')
  }
  
  const handleSendQuery = (): void => {
    if (queryInput.trim()) {
      const newQueryObj: Query = {
        id: Date.now(),
        text: queryInput.trim(),
        status: 'Pending',
        time: 'Just now'
      }
      setQueries([newQueryObj, ...queries])
      setQueryInput('')
      showToast('Query sent to support team', 'success')
    } else {
      showToast('Please write your query first', 'error')
    }
  }
  
  const handleDailyBonus = (): void => {
    setCoinBalance(coinBalance + 20)
    showToast('Daily bonus collected! +20 Coins', 'success')
  }
  
  const handleCopyReferral = (): void => {
    navigator.clipboard.writeText('https://examprep.in/partner/rahul42')
    showToast('Referral link copied to clipboard!', 'success')
  }
  
  const handleClaimBonus = (): void => {
    setCoinBalance(coinBalance + 250)
    showToast('Partner bonus claimed! +250 Coins', 'success')
  }
  
  const handleSaveSecurity = (): void => {
    showToast(`Security saved: 2FA ${security.twoFactorEnabled ? 'ON' : 'OFF'}, Alerts ${security.loginAlertsEnabled ? 'ON' : 'OFF'}`, 'success')
  }
  
  const handleResetSecurity = (): void => {
    setSecurity({
      ...security,
      twoFactorEnabled: false,
      loginAlertsEnabled: true
    })
    showToast('Security settings reset', 'info')
  }
  
  const toggleChannel = (index: number): void => {
    const newChannels = [...notificationChannels]
    newChannels[index].enabled = !newChannels[index].enabled
    setNotificationChannels(newChannels)
  }
  
  // Update header name
  const getFullName = (): string => {
    return `${userData.firstName} ${userData.lastName}`
  }
  
  return (
    <>
  
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', fontFamily: "'Inter', sans-serif" }}>
        
        {/* Header */}
        <header className="h-16 bg-white/90 backdrop-blur-sm border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 shrink-0 shadow-sm">
          <div>
            <h1 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <i className="fa-solid fa-graduation-cap text-blue-600"></i>Menturo
            </h1>
            <p className="text-[11px] text-slate-400">Hartron • DEOC • SSC • Test Series</p>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative w-48 lg:w-64 hidden md:block">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input type="text" placeholder="Search exams, tests..." className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-400" />
            </div>
            <div className="flex items-center gap-3.5 border-l border-slate-100 pl-4 sm:pl-6">
              <a href="https://www.youtube.com/@ExamPrepHub" target="_blank" className="transition hover:-translate-y-0.5" style={{ color: '#ff0000' }}><i className="fab fa-youtube text-base"></i></a>
              <a href="mailto:support@examprep.in" target="_blank" className="transition hover:-translate-y-0.5" style={{ color: '#ea4335' }}><i className="fas fa-envelope text-base"></i></a>
              <a href="https://wa.me/919876543210" target="_blank" className="transition hover:-translate-y-0.5" style={{ color: '#25d366' }}><i className="fab fa-whatsapp text-base"></i></a>
              <a href="https://t.me/ExamPrepHub" target="_blank" className="transition hover:-translate-y-0.5" style={{ color: '#0088cc' }}><i className="fab fa-telegram-plane text-base"></i></a>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 border-l border-slate-100 pl-4 sm:pl-6">
              <div className="relative shrink-0">
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150" alt="Student" className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100" />
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] border border-white"><i className="fas fa-graduation-cap"></i></div>
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-semibold text-slate-700">{getFullName()}</p>
                <p className="text-[10px] text-slate-400 font-medium">Aspirant • Rank #42</p>
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Profile Card */}
              <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2"><i className="fa-regular fa-id-card text-blue-500"></i> Student Profile</h2>
                  <div className="flex gap-2 flex-wrap">
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-3 py-1.5 rounded-full flex items-center gap-2 animate-softPulse">
                      <i className="fa-solid fa-trophy text-amber-500 text-xs"></i>
                      <span className="text-xs font-extrabold text-amber-700">Rank #42</span>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 px-3 py-1.5 rounded-full flex items-center gap-2">
                      <i className="fa-solid fa-coins text-yellow-600 animate-sparkle"></i>
                      <span className="text-xs font-bold text-yellow-700">{coinBalance}</span>
                      <span className="text-[10px] text-yellow-600">Coins</span>
                    </div>
                  </div>
                </div>
                
                {/* Mentor Badge */}
                <div className="mb-5 flex justify-center">
                  <div className="px-4 py-2 rounded-full text-white text-xs font-semibold flex items-center gap-2 shadow-md" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <i className="fa-solid fa-user-graduate"></i>
                    <span>Mentor: Aman Deep (Junior Programmer - Hartron)</span>
                  </div>
                </div>
                
                {/* Profile Photo */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative group">
                    <img src={profilePhoto} alt="Avatar" className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-50" />
                    <button onClick={() => setShowPhotoModal(true)} className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-xs"><i className="fa-solid fa-camera"></i></button>
                  </div>
                  <button onClick={() => setShowPhotoModal(true)} className="text-xs font-medium text-rose-500 mt-3 hover:underline">Remove photo</button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">First Name</label>
  <input type="text" value={userData.firstName} onChange={(e) => setUserData({ ...userData, firstName: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
</div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Last Name</label>
                    <input type="text" value={userData.lastName} onChange={(e) => setUserData({ ...userData, lastName: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"  />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Exam Target</label>
                    <select value={userData.examTarget} onChange={(e) => setUserData({ ...userData, examTarget: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" >
                      <option>Hartron DEO</option>
                      <option>Junior Programmer (HSSC)</option>
                      <option>Programmer (HSSC)</option>
                      <option>SSC CGL</option>
                      <option>HSSC Clerk</option>
                      <option>State Exam (General)</option>
                    </select>
                  </div>
                  
                  {/* Phone Number */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Phone Number</label>
                    <div className="relative">
                      <input type="text" value={userData.phone} readOnly className="w-full pl-3 pr-28 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium" />
                      <button onClick={() => setShowMobileForm(!showMobileForm)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-medium hover:bg-slate-50 transition shadow-sm">
                        <i className="fa-solid fa-mobile-screen-button mr-1"></i> Change
                      </button>
                    </div>
                    <span className="text-[10px] text-emerald-600 mt-1 inline-flex items-center gap-1"><i className="fa-solid fa-circle-check"></i> Verified</span>
                  </div>
                  
                  {/* Mobile Change Form */}
                  {showMobileForm && (
                    <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl">
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Enter New Mobile Number</label>
                      <div className="flex gap-2">
                        <input type="tel" ref={newMobileRef} placeholder="+91 XXXXXXXXXX" className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs" />
                        <button onClick={handleMobileChange} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-blue-700"><i className="fa-regular fa-floppy-disk mr-1"></i>Save</button>
                        <button onClick={() => setShowMobileForm(false)} className="border border-slate-300 px-3 py-2 rounded-xl text-xs hover:bg-white">Cancel</button>
                      </div>
                    </div>
                  )}
                  
                  {/* Old Email */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Old Email (Institutional)</label>
                    <div className="relative">
                      <input type="email" value={userData.oldEmail} disabled className="w-full pl-3 pr-28 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed" />
                      <button onClick={() => setShowEmailForm(!showEmailForm)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-medium hover:bg-slate-50 transition shadow-sm">
                        <i className="fa-solid fa-envelope-pen mr-1"></i> Change Email
                      </button>
                    </div>
                  </div>
                  
                  {/* Email Change Form */}
                  {showEmailForm && (
                    <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl">
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Enter New Email Address</label>
                      <div className="flex gap-2">
                        <input type="email" ref={newEmailRef} placeholder="student.new@university.edu" className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs" />
                        <button onClick={handleEmailChange} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-blue-700"><i className="fa-regular fa-floppy-disk mr-1"></i>Save</button>
                        <button onClick={() => setShowEmailForm(false)} className="border border-slate-300 px-3 py-2 rounded-xl text-xs hover:bg-white">Cancel</button>
                      </div>
                    </div>
                  )}
                  
                  {/* Current Email */}
                  <div className="sm:col-span-2 mt-2">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Current Email (Active)</label>
                    <div className="relative">
                      <input type="email" value={userData.currentEmail} readOnly className="w-full pl-3 pr-16 py-2 bg-blue-50/30 border border-blue-200 rounded-xl text-xs font-medium text-slate-700" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1"><i className="fa-solid fa-check-circle"></i> Primary</span>
                    </div>
                  </div>
                </div>
              </section>
              
              {/* Account Security */}
              <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><i className="fa-solid fa-shield-haltered text-slate-600"></i> Account & Security</h2>
                <div className="divide-y divide-slate-100">
                  
                  {/* Password Change */}
                  <div className="py-3">
                    <div className="flex justify-between items-center">
                      <div><p className="font-semibold text-xs">Password</p><p className="text-[11px] text-slate-400">Update credentials</p></div>
                      <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" ><i className="fa-solid fa-key mr-1"></i> Change Password</button>
                    </div>
                    
                    {showPasswordForm && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-2">
                        <input type="password" ref={oldPassRef} placeholder="Old password" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
                        <input type="password" ref={newPassRef} placeholder="New password (min 6)" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
                        <input type="password" ref={confirmPassRef} placeholder="Confirm password" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setShowPasswordForm(false)} className="text-xs px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white">Cancel</button>
                          <button onClick={handlePasswordChange} className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Update</button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Two Factor Authentication */}
                  <div className="flex justify-between items-center py-3.5">
                    <div><p className="font-semibold text-xs">Two-Factor Authentication (2FA)</p><p className="text-[11px] text-slate-400">Extra security on your account</p></div>
                    <label className="relative inline-flex cursor-pointer">
                      <input type="checkbox" checked={security.twoFactorEnabled} onChange={(e) => setSecurity({ ...security, twoFactorEnabled: e.target.checked })} className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-600 after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                  
                  {/* Login Alerts */}
                  <div className="flex justify-between items-center py-3.5">
                    <div><p className="font-semibold text-xs">Login Alerts</p><p className="text-[11px] text-slate-400">Notify on unusual logins</p></div>
                    <label className="relative inline-flex cursor-pointer">
                      <input type="checkbox" checked={security.loginAlertsEnabled} onChange={(e) => setSecurity({ ...security, loginAlertsEnabled: e.target.checked })} className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-600 after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-5">
                  <button onClick={handleResetSecurity} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs hover:bg-slate-50">Reset</button>
                  <button onClick={handleSaveSecurity} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700">Save Security</button>
                </div>
              </section>
              
              {/* Support Queries */}
              <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="font-bold text-sm mb-3 flex items-center gap-2"><i className="fa-regular fa-message text-purple-500"></i> Support & Queries</h2>
                <div className="space-y-2 max-h-32 overflow-y-auto mb-3 text-xs">
                  {queries.map((q) => (
                    <div key={q.id} className="flex justify-between p-2 bg-slate-50 rounded">
                      <span>{q.text}</span>
                      <span className="text-slate-400">{q.status}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={queryInput} onChange={(e) => setQueryInput(e.target.value)} placeholder="Ask about exams, coins, tests..." className="flex-1 px-3 py-2 bg-slate-50 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
                  <button onClick={handleSendQuery} className="bg-indigo-600 text-white px-4 rounded-xl text-xs font-medium hover:bg-indigo-700"><i className="fa-regular fa-paper-plane"></i> Send</button>
                </div>
              </section>
            </div>
            
            {/* RIGHT COLUMN */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Notification Settings */}
              <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2"><i className="fa-regular fa-bell text-yellow-600"></i> Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-700">Notification Channels</p>
                    <label className="relative inline-flex cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-600 after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-400 -mt-2">Email & SMS • Push Notifications</p>
                  
                  <div className="space-y-3 pl-4 border-l-2 border-slate-100 mt-2">
                    {notificationChannels.map((channel, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <span className="text-slate-600 font-medium">{channel.name}</span>
                        <label className="relative inline-flex cursor-pointer">
                          <input type="checkbox" checked={channel.enabled} onChange={() => toggleChannel(idx)} className="sr-only peer" />
                          <div className="w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-600 after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs pt-2">
                    <div><p className="font-semibold text-slate-700">Do Not Disturb</p><p className="text-[11px] text-slate-400">Mute during set hours</p></div>
                    <label className="relative inline-flex cursor-pointer">
                      <input type="checkbox" checked={security.dndEnabled} onChange={(e) => setSecurity({ ...security, dndEnabled: e.target.checked })} className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-600 after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </section>
              
              {/* Partner Program */}
              <section className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-5 border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-amber-800"><i className="fa-solid fa-handshake"></i> Partner Program</p>
                    <p className="text-sm font-extrabold text-amber-900">Become Our Partner</p>
                    <p className="text-[11px] text-amber-700">Earn coins for every referral</p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md"><i className="fa-solid fa-coins text-amber-600 text-xl"></i></div>
                </div>
                <button onClick={handleCopyReferral} className="mt-3 w-full text-[11px] bg-amber-600 text-white px-3 py-2 rounded-full hover:bg-amber-700"><i className="fa-regular fa-copy"></i> Copy Referral Link</button>
                <div className="mt-3 p-2 bg-white/60 rounded-xl text-xs"><span className="font-bold">💰 Commission:</span> 250 Coins per referral</div>
                <div className="mt-2 flex justify-between text-[10px]"><span>👥 Your Partners: 3</span><span>🏅 Earned: 750 Coins</span><button onClick={handleClaimBonus} className="text-blue-600 underline hover:text-blue-800">Claim Bonus</button></div>
              </section>
              
              {/* Coin Collection */}
              <section className="bg-white rounded-2xl p-5 border border-slate-100">
                <h3 className="text-xs font-bold"><i className="fa-solid fa-chart-line text-emerald-600"></i> Coin Activity</h3>
                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl"><p className="text-[10px] text-slate-500">Tests Attempted</p><p className="text-lg font-bold text-slate-800">{testAttempts}</p></div>
                  <div className="bg-slate-50 p-2 rounded-xl"><p className="text-[10px] text-slate-500">Total Coins</p><p className="text-lg font-bold text-yellow-600">{coinBalance}</p></div>
                </div>
                <button onClick={handleDailyBonus} className="w-full mt-3 text-[11px] border border-blue-200 text-blue-600 py-1.5 rounded-lg hover:bg-blue-50">Collect Daily Bonus → +20 Coins</button>
              </section>
              
              {/* Exam Corner */}
              <section className="bg-indigo-50/40 rounded-2xl p-4 border border-indigo-100">
                <p className="text-[11px] font-semibold text-indigo-800"><i className="fa-regular fa-newspaper"></i> 📢 Hartron DEO 2025 Notification Soon | Junior Programmer Admit Card Released</p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      {/* Modal for Remove Photo */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowPhotoModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm">Remove photo?</h3>
              <button onClick={() => setShowPhotoModal(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <p className="text-xs text-slate-500 mb-5">Set default avatar image?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowPhotoModal(false)} className="px-3 py-1.5 border rounded-lg text-xs">Cancel</button>
              <button onClick={handleRemovePhoto} className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-xs">Remove</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}