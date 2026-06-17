// api.ts

const BASE_URL = "http://localhost:8080"
// const BASE_URL = "https://betaws.menturo.in"

export const LOGIN = `${BASE_URL}/login`

export const REGISTER = `${BASE_URL}/signup`
export const VERIFY_REGISTER_OTP = `${BASE_URL}/signup/verify-otp`
export const RESEND_REGISTER_OTP = `${BASE_URL}/signup/resend-otp`
export const LOGOUT = `${BASE_URL}/logout`
export const HEALTH = `${BASE_URL}/health`
export const AUTH = `${BASE_URL}/auth`
export const LOAD_SERIES = `${BASE_URL}/api/test-series/load`
export const LOAD_ONE_SERIES = `${BASE_URL}/api/test-series/loadone`
export const LOAD_TESTS = `${BASE_URL}/api/tests/load`
export const LOAD_TESTS_BY_SUB = `${BASE_URL}/api/tests/loadsub`
export const START_TEST = `${BASE_URL}/api/test/start`
export const RESUME_TEST = `${BASE_URL}/api/test/resume`
export const SAVE_TEST = `${BASE_URL}/api/test/save`
export const FETCH_SOLUTION = `${BASE_URL}/api/test/solution`
export const SUBMIT_TEST = `${BASE_URL}/api/test/result`
export const SITE_STATUS = `${BASE_URL}/api/site`
export const UPDATE_PROFILE = `${BASE_URL}/update-profile`
export const UPDATE_PASS = `${BASE_URL}/update-pass`
export const GET_SESSIONS = `${BASE_URL}/get-sessions`
export const FORGOT_PASS = `${BASE_URL}/update-pass`
export const CHECK_COUPON = `${BASE_URL}/checkCoupon`
export const CREATE_ORDER = `${BASE_URL}/create-order`
export const WEBSOCKET = `ws://localhost:8080/ws`
// export const WEBSOCKET =
//     `wss://betaws.menturo.in/ws`
