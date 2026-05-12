'use client'
// import { useAuthFormStore } from "../../features/auth/store";
import { Search } from "lucide-react";

interface SearchBarProps {
    placeholder?: string;
    className?: string;
}

export default function SearchBar({
    placeholder = "Search...",
    className = ""
}: SearchBarProps) {

    // Zustand
    // const value = useAuthFormStore((state) => state.search);
    // const setValue = useAuthFormStore((state) => state.setSearchText);
    // const error = useAuthFormStore((state) => state.errors.search);
    // const setErrorGlobal = useAuthFormStore((state) => state.setError);

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const val = e.target.value.toLowerCase();
    //     setValue(val);

    //     // optional validation
    //     const err = val.length > 0 && val.length < 2
    //         ? "Type at least 2 characters"
    //         : null;

    //     setErrorGlobal("search", err);
    // };
    const handleChange = () => {
        ""
    }

    return (
        <div className={`w-full ${className}`}>
            <div className="relative">

                {/* Input */}
                {/* <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`
                        searchBar-theme pr-12
                        ${error ? "searchBar-theme-error" : ""}
                    `}
                /> */}
                <input
                    type="text"
                    value={""}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`
                        searchBar-theme pr-12
                       
                    `}
                />

                {/* 🔍 Right Icon */}
                <Search
                    className="
                    w-5 h-5
                    absolute right-4 top-1/2 -translate-y-1/2
                    cursor-pointer
                    "
                    style={{ color: "var(--iconSecondary)" }}
                />
            </div>

            {/* Error */}
            {/* {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )} */}
        </div>
    );
}