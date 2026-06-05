import { create } from "zustand";

export interface QuestionHistory {
    _id: string;
    ta: number;
    c: number;
    w: number;
    pr: number;
}

interface QHistoryStore {
    qHistory: Record<string, QuestionHistory>;

    setQHistory: (
        history: Record<string, QuestionHistory>
    ) => void;

    updateQuestionHistory: (
        qid: string,
        data: QuestionHistory
    ) => void;

    clearQHistory: () => void;
}

export const useQHistoryStore =
    create<QHistoryStore>((set) => ({
        qHistory: {},

        setQHistory: (history) =>
            set({
                qHistory: history,
            }),

        updateQuestionHistory: (qid, data) =>
            set((state) => ({
                qHistory: {
                    ...state.qHistory,
                    [qid]: data,
                },
            })),

        clearQHistory: () =>
            set({
                qHistory: {},
            }),
    }));