// app/store/createAccountStore.ts
import { create } from "zustand";

export interface RegistrationData {
    username: string;
    email: string;
    mobile: string;
    state: string;
    password: string;
    confirmPassword: string;
}

interface RegistrationStore {
    regForm: RegistrationData;
    loginForm: {
        mobile: string;
        password: string;
    };
    isLoading: boolean;
    setRegField: (field: keyof RegistrationData, value: string) => void;
    setLoginField: (field: 'email' | 'password', value: string) => void;
    setLoading: (loading: boolean) => void;
    resetRegForm: () => void;
    resetLoginForm: () => void;
}

const initialRegForm: RegistrationData = {
    username: '',
    email: '',
    mobile: '',
    state: '',
    password: '',
    confirmPassword: ''
};

const initialLoginForm = {
    email: '',
    password: ''
};

export const useRegistrationStore = create<RegistrationStore>((set) => ({
    regForm: initialRegForm,
    loginForm: initialLoginForm,
    isLoading: false,

    setRegField: (field, value) =>
        set((state) => ({
            regForm: { ...state.regForm, [field]: value }
        })),

    setLoginField: (field, value) =>
        set((state) => ({
            loginForm: { ...state.loginForm, [field]: value }
        })),

    setLoading: (loading) => set({ isLoading: loading }),

    resetRegForm: () => set({ regForm: initialRegForm }),

    resetLoginForm: () => set({ loginForm: initialLoginForm })
}));