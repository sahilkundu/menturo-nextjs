'use client'
import { useWSChatStore } from "../store/wsChat"
interface LiveProps {
    activeDot?: boolean
}

export default function Live({
    activeDot = false
}: LiveProps) {

    const wsUsers =
        useWSChatStore(
            (state) =>
                state.users
        )

    const users =
        Object.values(wsUsers)

    return (
        <>

            {/* HEADER */}
            {activeDot && (
                <div className="flex items-center justify-between mb-5">

                    <div className="flex items-center gap-3">

                        <div className="flex items-center gap-2">

                            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>

                            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                                Live Students
                            </h3>

                        </div>

                        <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs md:text-sm font-medium">
                            {users.filter(user => user.online).length} Online
                        </div>

                    </div>

                    <div className="w-8 h-8 rounded-full bg-gray-100"></div>

                </div>
            )}
            {activeDot && (
                <div className="border-b border-gray-100 mb-5"></div>
            )}

            <div className="space-y-4">

                {users.map((user, index) => (

                    <div
                        key={index}
                        className={`
                            flex
                            items-center
                            justify-between
                            p-2
                            rounded-2xl
                            ${activeDot
                                ? "bg-gray-50 hover:bg-gray-100"
                                : "hover:bg-gray-50"
                            }
                            transition-all
                        `}
                    >

                        <div className="flex items-center gap-3">

                            <div className="relative">

                                <img
                                    src={`https://i.pravatar.cc/50?img=${user.img}`}
                                    className="w-11 h-11 rounded-full"
                                    alt=""
                                />

                                {/* ACTIVE DOT */}
                                {activeDot && user.online && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></span>
                                )}

                            </div>

                            <div>

                                <h4 className="text-sm md:text-base font-medium">
                                    {user.username}
                                </h4>

                                <p className="text-xs md:text-sm text-gray-400">
                                    {user.online
                                        ? 'Online'
                                        : 'Offline'}
                                </p>

                            </div>

                        </div>

                        <button
                            className={`text-xs md:text-sm px-3 py-2 rounded-full ${activeDot
                                ? user.online
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                                : "bg-violet-100 text-violet-700"
                                }`}
                        >
                            {activeDot
                                ? user.online
                                    ? "Active"
                                    : "Offline"
                                : "Active"
                            }
                        </button>

                    </div>

                ))}

            </div>

            {/* FOOTER */}
            {activeDot && (
                <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                    <p className="text-xs md:text-sm text-gray-400">
                        {
                            users.filter(
                                user => user.online
                            ).length
                        } Student(s) online
                    </p>
                </div>
            )}

        </>
    )
}