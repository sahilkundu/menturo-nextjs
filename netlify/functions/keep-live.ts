import { HEALTH } from "../../api"

export default async () => {
    try {
        const res = await fetch(HEALTH)

        return new Response(
            JSON.stringify({
                success: true,
                status: res.status,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
    } catch (err) {
        return new Response(
            JSON.stringify({
                success: false,
            }),
            {
                status: 500,
            }
        )
    }
}

