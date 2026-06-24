import {
    NextRequest,
    NextResponse
} from "next/server"

export async function POST(
    request: NextRequest
) {

    const body =
        await request.json()
    const path =
        typeof body.path === "string" &&
            body.path.startsWith("/") &&
            !body.path.startsWith("/login")
            ? body.path
            : "/"

    const response =
        NextResponse.json({
            success: true,
        })

    response.cookies.set(
        "redirect_after_login",
        path,
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
