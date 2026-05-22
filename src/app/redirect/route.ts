import {
    NextRequest,
    NextResponse
} from "next/server"

export async function POST(
    request: NextRequest
) {

    const body =
        await request.json()

    const response =
        NextResponse.json({
            success: true,
        })

    response.cookies.set(
        "redirect_after_login",
        body.path,
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