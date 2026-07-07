// api.ts

export const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.menturo.in"

export const LOGIN = `${BASE_URL}/login`

export const REGISTER = `${BASE_URL}/signup`
export const VERIFY_REGISTER_OTP = `${BASE_URL}/signup/verify-otp`
export const RESEND_REGISTER_OTP = `${BASE_URL}/signup/resend-otp`
export const LOGOUT = `${BASE_URL}/logout`
export const HEALTH = `${BASE_URL}/health`
export const AUTH = `${BASE_URL}/auth`
export const LOAD_SERIES = `${BASE_URL}/api/test-series/load`
export const LOAD_ONE_SERIES = `${BASE_URL}/api/test-series/loadone`
export const LOAD_SERIES_SEO = `${BASE_URL}/api/seo/series`
export const LOAD_TESTS = `${BASE_URL}/api/tests/load`
export const LOAD_TESTS_BY_SUB = `${BASE_URL}/api/tests/loadsub`
export const LOAD_TEST_CARD_METADATA = `${BASE_URL}/api/tests/card-meta`
export const START_TEST = `${BASE_URL}/api/test/start`
export const DELETE_TEST_ATTEMPT = `${BASE_URL}/api/test/attempt/delete`
export const RESUME_TEST = `${BASE_URL}/api/test/resume`
export const SAVE_TEST = `${BASE_URL}/api/test/save`
export const FETCH_SOLUTION = `${BASE_URL}/api/test/solution`
export const SUBMIT_TEST = `${BASE_URL}/api/test/result`
export const LOAD_TYPING_TESTS = `${BASE_URL}/api/typing-tests`
export const LOAD_TYPING_TEST = `${BASE_URL}/api/typing-test`
export const START_TYPING_TEST = `${BASE_URL}/api/typing/start`
export const RESUME_TYPING_TEST = `${BASE_URL}/api/typing/resume`
export const EXIT_TYPING_TEST = `${BASE_URL}/api/typing/exit`
export const TYPING_SOLUTION = `${BASE_URL}/api/typing/solution`
export const TYPING_RESULT = `${BASE_URL}/api/typing-result`
export const TYPING_HISTORY = `${BASE_URL}/api/typing-history`
export const DELETE_TYPING_HISTORY = `${BASE_URL}/api/typing-history/delete`
export const SITE_STATUS = `${BASE_URL}/api/site`
export const TRACK_VISITOR = `${BASE_URL}/api/track`
export const UPDATE_PROFILE = `${BASE_URL}/update-profile`
export const UPDATE_PASS = `${BASE_URL}/update-pass`
export const GET_SESSIONS = `${BASE_URL}/get-sessions`
export const CREATE_GRIEVANCE = `${BASE_URL}/grievances`
export const GET_GRIEVANCES = `${BASE_URL}/grievances`
export const FORGOT_PASS = `${BASE_URL}/update-pass`
export const CHECK_COUPON = `${BASE_URL}/checkCoupon`
export const CREATE_ORDER = `${BASE_URL}/create-order`
export const VERIFY_RAZORPAY_PAYMENT = `${BASE_URL}/payments/razorpay/verify`
export const USER_MY_COURSES = `${BASE_URL}/api/user/my-courses`
export const USER_SUBSCRIPTIONS = `${BASE_URL}/api/user/subscriptions`
export const WEBSOCKET =
    process.env.NEXT_PUBLIC_WEBSOCKET_URL ||
    `wss://api.menturo.in/ws`
    
