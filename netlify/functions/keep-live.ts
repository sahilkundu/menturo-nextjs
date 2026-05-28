import { HEALTH } from "../../api"

const WS_HEALTH =
    "https://myapp-ws-latest.onrender.com/ping"

export default async () => {
    try {

        const [apiRes, wsRes] = await Promise.all([
            fetch(HEALTH),
            fetch(WS_HEALTH),
        ])

        return new Response(
            JSON.stringify({
                success: true,

                api: {
                    status: apiRes.status,
                    ok: apiRes.ok,
                },

                websocket: {
                    status: wsRes.status,
                    ok: wsRes.ok,
                },
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
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
    }
}