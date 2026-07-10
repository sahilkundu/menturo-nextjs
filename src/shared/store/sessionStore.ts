import { create } from "zustand";
import { GET_SESSIONS } from "../../../api";

export interface Session {
    _id: string;
    revoked: boolean;
    event: string;
    createdAt: number;
    expiresAt: number;
    current?: boolean;
    location?: string;

    deviceInfo: {
        browser: string;
        os: string;
        device: string;
        userAgent: string;
        deviceId?: string;
        screen?: string;
        timezone?: string;
        language?: string;
        platform?: string;
    };
}

interface SessionStore {
    sessions: Session[];

    setSessions: (
        sessions: Session[]
    ) => void;

    addSession: (
        session: Session
    ) => void;

    logoutSession: (
        sessionId: string
    ) => void;

    logoutAllSessions: () => void;

    removeSession: (
        sessionId: string
    ) => void;
    refreshSessions: () => Promise<void>;
    clearSessions: () => void;
}

export const useSessionStore =
    create<SessionStore>((set) => ({
        sessions: [],
        refreshSessions:
            async () => {

                try {

                    const res =
                        await fetch(
                            GET_SESSIONS,
                            {
                                credentials:
                                    "include",
                            }
                        );

                    const data =
                        await res.json();

                    if (
                        !data.success
                    ) {
                        return;
                    }

                    set({
                        sessions:
                            [...data.sessions].sort(
                                (a, b) =>
                                    b.createdAt -
                                    a.createdAt
                            ),
                    });

                } catch {
                }
            },

        setSessions: (sessions) =>
            set({
                sessions: [...sessions].sort(
                    (a, b) =>
                        b.createdAt - a.createdAt
                ),
            }),
        addSession: (session) =>
            set((state) => ({
                sessions: [
                    session,
                    ...state.sessions.filter(
                        (s) => s._id !== session._id
                    ),
                ].sort(
                    (a, b) =>
                        b.createdAt - a.createdAt
                ),
            })),

        logoutSession: (sessionId) =>
            set((state) => ({
                sessions:
                    state.sessions.map(
                        (session) =>
                            session._id === sessionId
                                ? {
                                    ...session,
                                    revoked: true,
                                    event: "logout",
                                }
                                : session
                    ),
            })),

        logoutAllSessions: () =>
            set((state) => ({
                sessions:
                    state.sessions.map(
                        (session) => ({
                            ...session,
                            revoked: true,
                            event: "logout",
                        })
                    ),
            })),

        removeSession: (sessionId) =>
            set((state) => ({
                sessions:
                    state.sessions.filter(
                        (s) => s._id !== sessionId
                    ),
            })),

        clearSessions: () =>
            set({ sessions: [] }),
    }));
