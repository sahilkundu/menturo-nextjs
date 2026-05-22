// api.ts

const BASE_URL =
    process.env.NODE_ENV === "production"
        ? "https://betaws.menturo.in"
        : "http://localhost:8080"
export const LOGIN = `${BASE_URL}/login`

export const REGISTER = `${BASE_URL}/signup`

export const LOGOUT = `${BASE_URL}/logout`
export const HEALTH = `${BASE_URL}/health`