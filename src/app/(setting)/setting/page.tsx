'use client'

import { useState, useRef, useEffect } from 'react'
import { useUserStore } from '../../../shared/store/user'
import { showPopupMessage } from '../../../shared/utils/popup'
import { FORGOT_PASS, GET_GRIEVANCES, GET_SESSIONS, LOGOUT, UPDATE_PASS, UPDATE_PROFILE } from '../../../../api'
import Spinner from '../../../shared/components/Spinner'
import { useSessionStore } from '../../../shared/store/sessionStore'
import { useRouter } from 'next/navigation'
import { showRouteLoader } from '../../../shared/utils/routeLoader'
import { goToLoginAfterRememberingPage } from '../../../shared/utils/loginRedirect'


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
interface Grievance {
  id: string
  query: string
  status: string
  createdAt: number
}

export default function SettingPage() {
  const user =
    useUserStore((state) => state.user)
  const authenticated =
    useUserStore((state) => state.authenticated)
  const authChecked =
    useUserStore((state) => state.authChecked)
  const fetchUser =
    useUserStore((state) => state.fetchUser)
  const {
    sessions,
    setSessions,
    addSession,
    logoutSession: logoutSessionStore,
    logoutAllSessions: logoutAllSessionsStore,
  } = useSessionStore();
  // State Variables
  const [otpStep, setOtpStep] = useState(false);
  const [pendingAction, setPendingAction] =
    useState<"email" | "mobile" | "password" | null>(null);
  const [otp, setOtp] = useState("");

  const [otpLength, setOtpLength] = useState(6);

  const [recipient, setRecipient] = useState("");
  const [sentTo, setSentTo] = useState("");

  const [resendTimer, setResendTimer] = useState(0);
  const [resending, setResending] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [nameLoading, setNameLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [mobileLoading, setMobileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [logoutAllLoading, setLogoutAllLoading] =
    useState(false);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const router = useRouter();
  const [logoutSessionLoading, setLogoutSessionLoading] =
    useState<string | null>(null);
  const [coinBalance, setCoinBalance] = useState<number>(1250)
  const [testAttempts, setTestAttempts] = useState<number>(12)

  useEffect(() => {
    if (!authenticated) return;
    fetch(GET_GRIEVANCES, { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => { if (data.success) setGrievances(data.grievances || []) })
      .catch(() => undefined);
  }, [authenticated]);

  // Form visibility states
  const [showMobileForm, setShowMobileForm] = useState<boolean>(false)
  const [showEmailForm, setShowEmailForm] = useState<boolean>(false)
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false)
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false)
  const [originalName, setOriginalName] = useState({
    firstName: "",
    lastName: "",
  });
  const [oldPassword, setOldPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");
  // User Data
  const [userData, setUserData] =
    useState<UserData>({
      firstName: "",
      lastName: "",
      phone: "",
      oldEmail: "",
      currentEmail: "",
      examTarget: "Hartron DEO",
    });
  useEffect(() => {
    if (!user) return;

    const firstName = user.firstName || "";
    const lastName = user.lastName || "";

    setUserData(prev => ({
      ...prev,
      firstName,
      lastName,
      phone: user.mobile || "",
      oldEmail: user.oldEmail || "",
      currentEmail: user.email || "",
    }));

    setOriginalName({
      firstName,
      lastName,
    });
  }, [user]);

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

  // Toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success'): void => {
    const toast = document.createElement('div')
    const bgColor = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-blue-600'
    toast.className = `fixed bottom-5 left-1/2 -translate-x-1/2 ${bgColor} text-white px-5 py-2.5 rounded-full text-[16px] z-50 shadow-lg`
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
  const updateName = async () => {
    if (!authenticated) return
    try {
      setNameLoading(true);
      const res = await fetch(
        UPDATE_PROFILE,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: userData.firstName,
            lastName: userData.lastName,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        showPopupMessage(
          data.message,
          false
        );
        return;
      }

      showPopupMessage(
        data.message,
        true
      );
    } catch {
      showPopupMessage(
        "Failed to update name",
        false
      );
    } finally {
      setNameLoading(false);
    }
  };
  const updateEmail = async () => {
    if (!authenticated) return
    const email =
      newEmailRef.current?.value.trim() || "";

    if (!email) {
      showPopupMessage(
        "Enter email",
        false
      );
      return;
    }

    try {
      setEmailLoading(true);
      const res = await fetch(
        UPDATE_PROFILE,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        showPopupMessage(
          data.message,
          false
        );
        return;
      }
      if (
        data.otpRequired === true
      ) {
        setOtpLength(
          Number(data.len) || 6
        );

        setRecipient(
          data.recipient || ""
        );

        setSentTo(
          data.sentTo || ""
        );

        setPendingAction(
          "email"
        );

        setOtp("");
        setOtpStep(true);

        return;
      }

      setUserData(prev => ({
        ...prev,
        currentEmail: data?.emailChanged,
      }));

      setShowEmailForm(false);

      showPopupMessage(
        data.message,
        true
      );
    } catch {
      showPopupMessage(
        "Failed to update email",
        false
      );
    } finally {
      setEmailLoading(false);
    }
  };
  const updateMobile = async () => {
    if (!authenticated) return
    const mobile =
      newMobileRef.current?.value.trim() || "";

    if (!mobile) {
      showPopupMessage(
        "Enter mobile number",
        false
      );
      return;
    }

    try {
      setMobileLoading(true);
      const res = await fetch(
        UPDATE_PROFILE,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        showPopupMessage(
          data.message,
          false
        );
        return;
      }
      if (
        data.otpRequired === true
      ) {
        setOtpLength(
          Number(data.len) || 6
        );

        setRecipient(
          data.recipient || ""
        );

        setSentTo(
          data.sentTo || ""
        );

        setPendingAction(
          "mobile"
        );

        setOtp("");
        setOtpStep(true);

        return;
      }

      setUserData(prev => ({
        ...prev,
        phone: data?.mobileChanged,
      }));

      setShowMobileForm(false);

      showPopupMessage(
        data.message,
        true
      );
    } catch (err) {
      showPopupMessage(
        "Failed to update mobile",
        false
      );
    } finally {
      setMobileLoading(false);
    }
  };
  const changePassword = async () => {
    if (!authenticated) return
    try {
      setPasswordLoading(true);
      const res = await fetch(
        UPDATE_PASS,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        showPopupMessage(
          data.message,
          false
        );
        throw new Error(data.message);
      }
      if (data.otpRequired) {
        setOtpLength(Number(data.len) || 6);
        setRecipient(data.recipient || "");
        setSentTo(data.sentTo || "");

        setPendingAction("password");

        setOtp("");
        setOtpStep(true);
        return;
      }
      setShowPasswordForm(false);
      setOldPassword("");
      setNewPassword("");
      showPopupMessage(
        data.message,
        true
      );
      // toast.success("Password changed");
    } catch (err: any) {
      // toast.error(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    if (!authenticated && !authChecked) {
      fetchUser()
    }
  }, [authChecked, authenticated, fetchUser])
  const isNameChanged =
    userData.firstName !== originalName.firstName ||
    userData.lastName !== originalName.lastName;

  const getSessions = async () => {
    if (!authenticated) return;

    try {
      const res = await fetch(
        GET_SESSIONS,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!data.success) return;

      setSessions(
        [...data.sessions].sort(
          (a, b) =>
            b.createdAt - a.createdAt
        )
      );
    } catch {
    }
  };
  useEffect(() => {
    getSessions();
  }, [authenticated]);
  const logoutSession = async (
    sessionId: string
  ) => {
    setLogoutSessionLoading(
      sessionId
    );
    try {
      const res = await fetch(
        LOGOUT,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        showPopupMessage(
          data.message,
          false
        );
        return;
      }

      logoutSessionStore(sessionId);

      showPopupMessage(
        "Session logged out",
        true
      );
      const currentSession =
        sessions.find(
          (s) =>
            s._id === sessionId &&
            s.current
        );

      if (currentSession) {
        await goToLoginAfterRememberingPage(router);
        return;
      }
    } catch {
      showPopupMessage(
        "Failed to logout session",
        false
      );
    } finally {
      setLogoutSessionLoading(
        null
      );
    }
  };
  const logoutAllSessions = async () => {
    try {
      setLogoutAllLoading(true);

      const res = await fetch(
        LOGOUT,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            a: 1,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        showPopupMessage(
          data.message,
          false
        );
        return;
      }

      logoutAllSessionsStore();

      showPopupMessage(
        "Logged out from all devices",
        true
      );

      // optional
      showRouteLoader();
      window.location.href = "/login";

    } catch {
      showPopupMessage(
        "Failed to logout all sessions",
        false
      );
    } finally {
      setLogoutAllLoading(false);
    }
  };
  const verifyOtp = async () => {
    if (verifyLoading) return;

    try {
      setVerifyLoading(true);

      const response = await fetch(FORGOT_PASS, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showPopupMessage(
          data.message || "Invalid OTP",
          false
        );
        return;
      }
      if (
        data?.otpRequired === true && data?.sentTo === "mobile"
      ) {
        setOtpLength(
          Number(data.len) || 6
        );

        setRecipient(
          data.recipient || ""
        );

        setSentTo(
          data.sentTo || ""
        );

        setPendingAction(
          "mobile"
        );

        setOtp("");
        setOtpStep(true);

        return;
      }
      if (
        data.otpRequired === true && data.sentTo === "email"
      ) {
        setOtpLength(
          Number(data.len) || 6
        );

        setRecipient(
          data.recipient || ""
        );

        setSentTo(
          data.sentTo || ""
        );

        setPendingAction(
          "email"
        );

        setOtp("");
        setOtpStep(true);

        return;
      }

      showPopupMessage(
        data.message || "OTP verified",
        true
      );

      setOtp("");
      setOtpStep(false);

      if (pendingAction === "email") {
        setShowEmailForm(false);
        setUserData(prev => ({
          ...prev,
          currentEmail: data.emailChanged,
        }));
      }

      if (pendingAction === "mobile") {
        setShowMobileForm(false);
        setUserData(prev => ({
          ...prev,
          phone: data.mobileChanged,
        }));
      }

      if (pendingAction === "password") {
        setShowPasswordForm(false);
        setOldPassword("");
        setNewPassword("");
      }

      setPendingAction(null);
    } catch {
      showPopupMessage(
        "OTP verification failed",
        false
      );
    } finally {
      setVerifyLoading(false);
    }
  };
  const handleResendOtp = async () => {
    try {
      setResending(true);

      const response = await fetch(
        FORGOT_PASS,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action: "resend-otp",
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        showPopupMessage(
          data.message ||
          "Failed to resend OTP",
          false
        );
        return;
      }

      showPopupMessage(
        data.message ||
        "OTP resent successfully",
        true
      );

      setResendTimer(60);
    } catch {
      showPopupMessage(
        "Failed to resend OTP",
        false
      );
    } finally {
      setResending(false);
    }
  };
  useEffect(() => {
    if (!otpStep) return;

    setResendTimer(60);

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [otpStep]);
  return (
    <>


      <main className="flex-1 flex flex-col h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', fontFamily: "'Inter', sans-serif" }}>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-7 space-y-6">

              {/* Profile Card */}
              <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                {/* <div className="flex justify-between items-start mb-4">
                  <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2"><i className="fa-regular fa-id-card text-blue-500"></i> Student Profile</h2>
                  <div className="flex gap-2 flex-wrap">
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-3 py-1.5 rounded-full flex items-center gap-2 animate-softPulse">
                      <i className="fa-solid fa-trophy text-amber-500 text-[16px]"></i>
                      <span className="text-[16px] font-extrabold text-amber-700">Rank #42</span>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 px-3 py-1.5 rounded-full flex items-center gap-2">
                      <i className="fa-solid fa-coins text-yellow-600 animate-sparkle"></i>
                      <span className="text-[16px] font-bold text-yellow-700">{coinBalance}</span>
                      <span className="text-[10px] text-yellow-600">Coins</span>
                    </div>
                  </div>
                </div> */}

                {/* Mentor Badge */}
                <div className="mb-5 flex justify-center">
                  <div className="px-4 py-2 rounded-full text-white text-[16px] font-semibold flex items-center gap-2 shadow-md" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <i className="fa-solid fa-user-graduate"></i>
                    <span>{user?.username}</span>
                  </div>
                </div>

                {/* Profile Photo */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative group">
                    <img src="https://cdn.menturo.in/avatar/avatar.png" alt="Avatar" className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-50" />
                    <button onClick={() => setShowPhotoModal(true)} className="cursor-pointer absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-[16px]"><i className="fa-solid fa-camera"></i></button>
                  </div>
                  {/* <button onClick={() => setShowPhotoModal(true)} className="text-[16px] font-medium text-rose-500 mt-3 hover:underline">Remove photo</button> */}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">First Name</label>
                    <input type="text" placeholder='add first name' value={userData.firstName} onChange={(e) => setUserData({ ...userData, firstName: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[16px]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Last Name</label>
                    <input type="text" placeholder='add last name' value={userData.lastName} onChange={(e) => setUserData({ ...userData, lastName: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[16px]" />
                  </div>
                  {isNameChanged &&
                    <div className="sm:col-span-2">
                      <button
                        onClick={updateName}
                        disabled={nameLoading}
                        className="
                        cursor-pointer 
      bg-blue-600
      text-white
      px-4
      py-2
      rounded-xl
      text-[16px]
      font-medium
      hover:bg-blue-700
      disabled:opacity-50 
      disabled:cursor-not-allowed
    "
                      >
                        {nameLoading ? <Spinner size={16} /> : "Save Name"}
                      </button>
                    </div>}
                  {/* <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Exam Target</label>
                    <select value={userData.examTarget} onChange={(e) => setUserData({ ...userData, examTarget: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[16px]" >
                      <option>Hartron DEO</option>
                      <option>Junior Programmer (HSSC)</option>
                      <option>Programmer (HSSC)</option>
                      <option>SSC CGL</option>
                      <option>HSSC Clerk</option>
                      <option>State Exam (General)</option>
                    </select>
                  </div> */}

                  {/* Phone Number */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Phone Number</label>
                    <div className="relative">
                      <input type="text" placeholder='add your mobile' value={userData.phone} readOnly className="w-full pl-3 pr-28 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[16px] font-medium" />
                      <button onClick={() => setShowMobileForm(!showMobileForm)} className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-medium hover:bg-slate-50 transition shadow-sm">
                        <i className="fa-solid fa-mobile-screen-button mr-1"></i> {showMobileForm ? "Cancel" : "Change"}
                      </button>
                    </div>
                    <span className="text-[10px] text-emerald-600 mt-1 inline-flex items-center gap-1"><i className="fa-solid fa-circle-check"></i> Verified</span>
                  </div>

                  {/* Mobile Change Form */}
                  {showMobileForm && (
                    <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl">
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Enter New Mobile Number</label>
                      <div className="flex gap-2">
                        <input type="tel" ref={newMobileRef} placeholder="+91 XXXXXXXXXX" className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[16px]" />
                        <button onClick={updateMobile} disabled={mobileLoading} className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white px-4 py-2 rounded-xl text-[16px] font-medium hover:bg-blue-700"> {mobileLoading ? <Spinner size={16} /> : (
                          <>
                            <i className="fa-regular fa-floppy-disk mr-1"></i>
                            Save
                          </>
                        )}</button>
                        {/* <button onClick={() => setShowMobileForm(false)} className="border border-slate-300 px-3 py-2 rounded-xl text-[16px] hover:bg-white">Cancel</button> */}
                      </div>
                    </div>
                  )}
                  {/* Current Email */}
                  <div className="relative sm:col-span-2 mt-2">
                    <div className="relative">
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Current Email (Active)</label>
                      <span className="absolute left-37 top-1/2 -translate-y-1/2 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1"><i className="fa-solid fa-check-circle"></i> Primary</span>
                    </div>

                    <div className="relative">
                      <input type="email" placeholder='add your email' value={userData.currentEmail} readOnly className="w-full pl-3 pr-16 py-2 bg-blue-50/30 border border-blue-200 rounded-xl text-[16px] font-medium text-slate-700" />
                      <button onClick={() => setShowEmailForm(!showEmailForm)} className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-medium hover:bg-slate-50 transition shadow-sm">
                        <i className="fa-solid fa-envelope-pen mr-1"></i> {showEmailForm ? "Cancel" : "Change Email"}
                      </button>
                      {/* <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1"><i className="fa-solid fa-check-circle"></i> Primary</span> */}
                    </div>
                  </div>

                  {/* Old Email */}
                  {/* <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Old Email (Institutional)</label>
                    <div className="relative">
                      <input type="email" value={userData.oldEmail} disabled className="w-full pl-3 pr-28 py-2 bg-slate-100 border border-slate-200 rounded-xl text-[16px] text-slate-500 cursor-not-allowed" />
                      <button onClick={() => setShowEmailForm(!showEmailForm)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-medium hover:bg-slate-50 transition shadow-sm">
                        <i className="fa-solid fa-envelope-pen mr-1"></i> Change Email
                      </button>
                    </div>
                  </div> */}

                  {/* Email Change Form */}
                  {showEmailForm && (
                    <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl">
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Enter New Email Address</label>
                      <div className="flex gap-2">
                        <input type="email" ref={newEmailRef} placeholder="student.new@university.edu" className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[16px]" />
                        <button onClick={updateEmail} disabled={emailLoading} className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white px-4 py-2 rounded-xl text-[16px] font-medium hover:bg-blue-700">{emailLoading ? <Spinner size={16} /> : (
                          <>
                            <i className="fa-regular fa-floppy-disk mr-1"></i>
                            Save
                          </>
                        )}</button>
                        {/* <button onClick={() => setShowEmailForm(false)} className="cursor-pointer border border-slate-300 px-3 py-2 rounded-xl text-[16px] hover:bg-white">Cancel</button> */}
                      </div>
                    </div>
                  )}


                </div>
              </section>

              {/* Account Security */}
              <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="font-bold text-[16px] mb-4 flex items-center gap-2"><i className="fa-solid fa-shield-haltered text-slate-600"></i> Account & Security</h2>
                <div className="divide-y divide-slate-100">

                  {/* Password Change */}
                  <div className="py-3">
                    <div className="flex justify-between items-center">
                      <div><p className="font-semibold text-[16px]">Password</p><p className="text-[11px] text-slate-400">Update credentials</p></div>
                      <button onClick={() =>
                        setShowPasswordForm(
                          !showPasswordForm
                        )
                      }
                        className="cursor-pointer px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[16px]" ><i className="fa-solid fa-key mr-1"></i>{showPasswordForm ? "Cancel" : "Change Password"}</button>
                    </div>

                    {showPasswordForm && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-2">
                        <input type="password"
                          value={oldPassword}
                          onChange={(e) =>
                            setOldPassword(
                              e.target.value
                            )
                          } placeholder="Old password" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-[16px]" />
                        <input type="password"
                          value={newPassword}
                          onChange={(e) =>
                            setNewPassword(
                              e.target.value
                            )
                          } placeholder="New password (min 6)" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-[16px]" />
                        {/* <input type="password" ref={confirmPassRef} placeholder="Confirm password" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-[16px]" /> */}
                        <div className="flex justify-end gap-2">
                          {/* <button onClick={() => setShowPasswordForm(false)} className="text-[16px] px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white">Cancel</button> */}
                          <button onClick={changePassword} disabled={passwordLoading} className="cursor-pointer text-[16px] px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">{passwordLoading ? <Spinner size={16} /> : "Update"}</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Two Factor Authentication */}
                  <div className="flex justify-between items-center py-3.5">
                    <div><p className="font-semibold text-[16px]">Two-Factor Authentication (2FA)</p><p className="text-[11px] text-slate-400">Extra security on your account</p></div>
                    <label className="relative inline-flex cursor-pointer">
                      <input type="checkbox" checked={security.twoFactorEnabled} onChange={(e) => setSecurity({ ...security, twoFactorEnabled: e.target.checked })} className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-600 after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>

                  {/* Login Alerts */}
                  <div className="flex justify-between items-center py-3.5">
                    <div><p className="font-semibold text-[16px]">Login Alerts</p><p className="text-[11px] text-slate-400">Notify on unusual logins</p></div>
                    <label className="relative inline-flex cursor-pointer">
                      <input type="checkbox" checked={security.loginAlertsEnabled} onChange={(e) => setSecurity({ ...security, loginAlertsEnabled: e.target.checked })} className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-600 after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-5">
                  <button onClick={handleResetSecurity} className="cursor-pointer px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] hover:bg-slate-50">Reset</button>
                  <button onClick={handleSaveSecurity} className="cursor-pointer px-5 py-2 bg-blue-600 text-white rounded-xl text-[12px] font-semibold hover:bg-blue-700">Save Security</button>
                </div>
              </section>

              {/* Support Queries */}
              {/* <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="font-bold text-sm mb-3 flex items-center gap-2"><i className="fa-regular fa-message text-purple-500"></i> Support & Queries</h2>
                <div className="space-y-2 max-h-32 overflow-y-auto mb-3 text-[16px]">
                  {queries.map((q) => (
                    <div key={q.id} className="flex justify-between p-2 bg-slate-50 rounded">
                      <span>{q.text}</span>
                      <span className="text-slate-400">{q.status}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={queryInput} onChange={(e) => setQueryInput(e.target.value)} placeholder="Ask about exams, coins, tests..." className="flex-1 px-3 py-2 bg-slate-50 bg-slate-50 border border-slate-200 rounded-xl text-[16px]" />
                  <button onClick={handleSendQuery} className="bg-indigo-600 text-white px-4 rounded-xl text-[16px] font-medium hover:bg-indigo-700"><i className="fa-regular fa-paper-plane"></i> Send</button>
                </div>
              </section> */}
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-5 space-y-6">

              {/* Notification Settings */}
              {/* <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2"><i className="fa-regular fa-bell text-yellow-600"></i> Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <p className="text-[16px] font-semibold text-slate-700">Notification Channels</p>
                    <label className="relative inline-flex cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-600 after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-400 -mt-2">Email & SMS • Push Notifications</p>

                  <div className="space-y-3 pl-4 border-l-2 border-slate-100 mt-2">
                    {notificationChannels.map((channel, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[16px] py-1">
                        <span className="text-slate-600 font-medium">{channel.name}</span>
                        <label className="relative inline-flex cursor-pointer">
                          <input type="checkbox" checked={channel.enabled} onChange={() => toggleChannel(idx)} className="sr-only peer" />
                          <div className="w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-600 after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[16px] pt-2">
                    <div><p className="font-semibold text-slate-700">Do Not Disturb</p><p className="text-[11px] text-slate-400">Mute during set hours</p></div>
                    <label className="relative inline-flex cursor-pointer">
                      <input type="checkbox" checked={security.dndEnabled} onChange={(e) => setSecurity({ ...security, dndEnabled: e.target.checked })} className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-600 after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </section> */}

              {/* Partner Program */}
              {/* <section className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-5 border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[16px] font-bold text-amber-800"><i className="fa-solid fa-handshake"></i> Partner Program</p>
                    <p className="text-sm font-extrabold text-amber-900">Become Our Partner</p>
                    <p className="text-[11px] text-amber-700">Earn coins for every referral</p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md"><i className="fa-solid fa-coins text-amber-600 text-xl"></i></div>
                </div>
                <button onClick={handleCopyReferral} className="mt-3 w-full text-[11px] bg-amber-600 text-white px-3 py-2 rounded-full hover:bg-amber-700"><i className="fa-regular fa-copy"></i> Copy Referral Link</button>
                <div className="mt-3 p-2 bg-white/60 rounded-xl text-[16px]"><span className="font-bold">💰 Commission:</span> 250 Coins per referral</div>
                <div className="mt-2 flex justify-between text-[10px]"><span>👥 Your Partners: 3</span><span>🏅 Earned: 750 Coins</span><button onClick={handleClaimBonus} className="text-blue-600 underline hover:text-blue-800">Claim Bonus</button></div>
              </section> */}

              {/* Coin Collection */}
              {/* <section className="bg-white rounded-2xl p-5 border border-slate-100">
                <h3 className="text-[16px] font-bold"><i className="fa-solid fa-chart-line text-emerald-600"></i> Coin Activity</h3>
                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl"><p className="text-[10px] text-slate-500">Tests Attempted</p><p className="text-lg font-bold text-slate-800">{testAttempts}</p></div>
                  <div className="bg-slate-50 p-2 rounded-xl"><p className="text-[10px] text-slate-500">Total Coins</p><p className="text-lg font-bold text-yellow-600">{coinBalance}</p></div>
                </div>
                <button onClick={handleDailyBonus} className="w-full mt-3 text-[11px] border border-blue-200 text-blue-600 py-1.5 rounded-lg hover:bg-blue-50">Collect Daily Bonus → +20 Coins</button>
              </section> */}
              <section className="bg-white rounded-2xl p-5 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-bold flex items-center gap-2"><i className="fa-regular fa-message text-violet-600"></i> My Grievances</h3>
                  <span className="text-[11px] text-slate-500">{grievances.length}</span>
                </div>
                <div className="max-h-[260px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-300">
                  {!grievances.length && <p className="py-3 text-center text-xs text-slate-500">No grievances submitted yet.</p>}
                  {grievances.map((grievance) => <div key={grievance.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-3"><span className="text-xs font-bold text-slate-700">#{grievance.id.slice(-6)}</span><span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold capitalize text-amber-700">{grievance.status}</span></div>
                    <p className="mt-2 line-clamp-3 text-xs text-slate-600">{grievance.query}</p>
                    <p className="mt-2 text-[10px] text-slate-400">{new Date(grievance.createdAt).toLocaleString()}</p>
                  </div>)}
                </div>
              </section>
              <section className="bg-white rounded-2xl p-5 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-bold flex items-center gap-2">
                    <i className="fa-solid fa-shield-halved text-emerald-600"></i>
                    Login Activity
                  </h3>

                  <button
                    onClick={logoutAllSessions}
                    disabled={logoutAllLoading}
                    className="
                    cursor-pointer 
      px-3 py-1.5
      text-[11px]
      rounded-lg
      bg-rose-50
      text-rose-600
      hover:bg-rose-100
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
                  >
                    {logoutAllLoading ? (
                      <Spinner size={14} />
                    ) : (
                      "Logout All"
                    )}
                  </button>
                </div>
                <div
                  className="
    max-h-[450px]
    overflow-y-auto
    space-y-3
    pr-2
    scrollbar-thin
    scrollbar-thumb-slate-300
  "
                >
                  {[...sessions]
                    .sort((a, b) => {
                      if (a.revoked === b.revoked) {
                        return b.createdAt - a.createdAt;
                      }
                      return a.revoked ? 1 : -1;
                    })
                    .map((session) => (
                      <div
                        key={session._id}
                        className="
      border border-slate-200
      rounded-xl
      p-4
      bg-slate-50
    "
                      >
                        <div className="flex justify-between items-start gap-3">

                          <div className="flex gap-3">

                            <div className="
          w-10 h-10
          rounded-lg
          bg-blue-100
          flex items-center justify-center
        ">
                              <i
                                className={
                                  session.deviceInfo.device === "Mobile"
                                    ? "fa-solid fa-mobile-screen text-blue-600"
                                    : "fa-solid fa-laptop text-blue-600"
                                }
                              />
                            </div>

                            <div>

                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-[16px] font-semibold">
                                  {session.deviceInfo.device}
                                </h4>

                                {session.revoked ? (
                                  <span className="
                text-[10px]
                px-2 py-0.5
                rounded-full
                bg-rose-100
                text-rose-600
              ">
                                    Logged Out
                                  </span>
                                ) : (
                                  <span className="
                text-[10px]
                px-2 py-0.5
                rounded-full
                bg-emerald-100
                text-emerald-600
              ">
                                    Active
                                  </span>
                                )}
                              </div>

                              <p className="text-[11px] text-slate-500 mt-1">
                                {session.deviceInfo.browser}
                                {" • "}
                                {session.deviceInfo.os}
                              </p>

                              <p className="text-[11px] text-slate-500">
                                📍 {session.location || "Unknown Location"}
                              </p>

                              <p className="text-[11px] text-slate-400 mt-1">
                                Login:
                                {" "}
                                {new Date(
                                  session.createdAt * 1000
                                ).toLocaleString()}
                              </p>

                              <p className="text-[11px] text-slate-400">
                                Expires:
                                {" "}
                                {new Date(
                                  session.expiresAt * 1000
                                ).toLocaleString()}
                              </p>

                            </div>
                          </div>

                          {session.revoked ? (
                            <span
                              className="
      px-3 py-1.5
      text-[11px]
      rounded-lg
      bg-slate-100
      text-slate-500
      shrink-0
    "
                            >
                              Revoked
                            </span>
                          ) : (
                            <button
                              onClick={() =>
                                logoutSession(session._id)
                              }
                              disabled={
                                logoutSessionLoading === session._id
                              }
                              className="
                              cursor-pointer 
      px-3 py-1.5
      text-[11px]
      rounded-lg
      bg-rose-50
      text-rose-600
      hover:bg-rose-100
      shrink-0
      disabled:opacity-50
    "
                            >
                              {logoutSessionLoading === session._id
                                ? "..."
                                : "Logout"}
                            </button>
                          )}

                        </div>
                      </div>
                    ))}
                </div>
              </section>

              {/* Exam Corner */}
              {/* <section className="bg-indigo-50/40 rounded-2xl p-4 border border-indigo-100">
                <p className="text-[11px] font-semibold text-indigo-800"><i className="fa-regular fa-newspaper"></i> 📢 Hartron DEO 2025 Notification Soon | Junior Programmer Admit Card Released</p>
              </section> */}
            </div>
          </div>
        </div>
      </main>
      {otpStep && (
        <div className="
    fixed inset-0 z-50
    bg-black/50
    flex items-center
    justify-center
  ">
          <div className="
      bg-white
      rounded-2xl
      p-6
      max-w-md
      w-full
      mx-4
    ">
            <h3 className="
        text-lg font-bold
        text-center
      ">
              Verify OTP
            </h3>

            <p className="
        text-sm text-gray-500
        text-center mt-2
      ">
              Verification code sent to
            </p>

            <p className="
        text-sm font-medium
        text-center
      ">
              {recipient}
            </p>
            <p className="mt-2 text-sm text-center text-gray-500">
              Please check your{" "}
              <span className="font-semibold text-red-600">
                Inbox
              </span>{" "}
              or{" "}
              <span className="font-semibold text-red-600">
                Spam folder
              </span>.
            </p>

            <div className="
        flex justify-center
        gap-2 mt-5
      ">
              {Array.from({
                length: otpLength,
              }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={
                    otp[index] || ""
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value.replace(
                        /\D/g,
                        ""
                      );

                    const otpArray =
                      otp.split("");

                    otpArray[index] =
                      value;

                    setOtp(
                      otpArray.join("")
                    );

                    if (
                      value &&
                      e.target
                        .nextElementSibling
                    ) {
                      (
                        e.target
                          .nextElementSibling as HTMLInputElement
                      ).focus();
                    }
                  }}
                  className="
              h-12 w-12
              rounded-xl
              border
              text-center
            "
                />
              ))}
            </div>
            <div className="text-center mt-4">
              {resendTimer > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend OTP in {resendTimer}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="cursor-pointer text-blue-600 font-medium"
                >
                  {resending
                    ? "Sending..."
                    : "Resend OTP"}
                </button>
              )}
            </div>
            <div className="
        flex gap-3 mt-5
      ">
              <button
                onClick={() =>
                  setOtpStep(false)
                }
                className="
                cursor-pointer 
            flex-1
            border
            rounded-xl
            py-2
          "
              >
                Cancel
              </button>

              <button
                onClick={verifyOtp}
                disabled={verifyLoading}
                className="
    cursor-pointer 
    flex-1
    bg-blue-600
    text-white
    rounded-xl
    py-2
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
              >
                {verifyLoading ? (
                  <Spinner size={16} />
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Remove Photo */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowPhotoModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm">Remove photo?</h3>
              <button onClick={() => setShowPhotoModal(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <p className="text-[16px] text-slate-500 mb-5">Set default avatar image?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowPhotoModal(false)} className="cursor-pointer px-3 py-1.5 border rounded-lg text-[16px]">Cancel</button>
              <button onClick={handleRemovePhoto} className="cursor-pointer px-3 py-1.5 bg-rose-500 text-white rounded-lg text-[16px]">Remove</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
