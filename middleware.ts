import {
    NextRequest,
    NextResponse
} from "next/server"

export function middleware(
    request: NextRequest
) {

    const token =
        request.cookies
            .get("token")
            ?.value

    const pathname =
        request.nextUrl.pathname

    const protectedRoutes = [
        "/dashboard",
        "/profile",
        "/test",
    ]

    const isProtected =
        protectedRoutes.some(
            (route) =>
                pathname.startsWith(route)
        )

    if (
        isProtected &&
        !token
    ) {

        const response =
            NextResponse.redirect(
                new URL(
                    "/login",
                    request.url
                )
            )

        response.cookies.set(
            "redirect_after_login",
            pathname,
            {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                domain: ".menturo.in",
                path: "/",
                maxAge: 300,
            }
        )

        return response
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/profile/:path*",
        "/test/:path*",
    ],
}