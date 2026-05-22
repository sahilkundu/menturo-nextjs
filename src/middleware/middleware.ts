import { NextRequest, NextResponse }
    from "next/server"

export function middleware(
    request: NextRequest
) {

    const token =
        request.cookies.get("token")

    const protectedRoutes = [
        "/test",
        "/dashboard",
        "/profile",
    ]

    const isProtected =
        protectedRoutes.some((route) =>
            request.nextUrl.pathname.startsWith(
                route
            )
        )

    if (isProtected && !token) {

        const loginUrl =
            new URL("/login", request.url)

        loginUrl.searchParams.set(
            "redirect",
            request.nextUrl.pathname
        )

        return NextResponse.redirect(
            loginUrl
        )
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/test/:path*",
        "/dashboard/:path*",
        "/profile/:path*",
    ],
}