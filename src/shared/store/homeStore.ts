import { create } from "zustand";
export interface HomeItem { _id: { $oid: string }; n: string; i: string; plans: any[]; lan: string[]; info: string[]; demo: boolean; tags: string[]; }
interface HomeStore {
    data: HomeItem[];
    tags: string[];
    nextPage: number;
    hasMore: boolean;
    loading: boolean;
    tagPageMap: Record<string, number>;
    hasMoreTagMap: Record<string, boolean>;
    tagCache: Record<string, HomeItem[]>;
    setTags: (tags: string[]) => void;
    setData: (data: HomeItem[]) => void;
    appendData: (data: HomeItem[]) => void;
    setNextPage: (page: number) => void;
    setHasMore: (v: boolean) => void;
    setLoading: (v: boolean) => void;
    // setTagPage: (tag: string, page: number) => void;
    setTagPage: (tag: string, count: number) => void;
    setTagHasMore: (tag: string, v: boolean) => void;
    cacheTagData: (tag: string, data: HomeItem[]) => void;
    extractMeta: (data: HomeItem[]) => void;
}
export const useHomeStore = create<HomeStore>((set, get) => ({
    data: [],
    tags: [],
    nextPage: 0,
    hasMore: true,
    loading: false,
    tagPageMap: {},
    hasMoreTagMap: {},
    tagCache: {},
    setTags: (tags) => set({ tags }),
    setData: (data) => {
        set({ data })
        get().extractMeta(data)
    },
    appendData: (newData) => {
        set((state) => ({ data: [...state.data, ...newData] }))
        get().extractMeta([...get().data, ...newData])
    },
    setNextPage: (nextPage) => set({ nextPage }),
    setHasMore: (v) => set({ hasMore: v }),
    setLoading: (v) => set({ loading: v }),
    setTagPage: (tag, count) =>
        set((state) => ({
            tagPageMap: {
                ...state.tagPageMap,
                [tag]: count
            }
        })),
    setTagHasMore: (tag, v) => set((state) => ({ hasMoreTagMap: { ...state.hasMoreTagMap, [tag]: v } })),
    cacheTagData: (tag, data) => set((state) => ({ tagCache: { ...state.tagCache, [tag]: data } })),
    extractMeta: (data) => {
        const tagSet = new Set<string>()
        for (const item of data) { item.tags?.forEach(tag => tagSet.add(tag)) }
        set({ tags: Array.from(tagSet) })
    }
}))