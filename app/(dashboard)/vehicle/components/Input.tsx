import React from "react";

interface InputProps {
    label: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error: string;
    name2?: string;
}

const InputWithError: React.FC<InputProps> = ({ label, value, onChange, error, name2 }) => {
    return (
        <div className={`flex ${error ? "-mb-3" : ""}`}>
            <div className="w-1/2 font-bold text-base">{label}:</div>

            <div className="relative w-1/2 flex flex-col gap-2">
                <input
                    className={`w-full dark:text-[#000000] pl-2 rounded ${error ? "border-2 border-red-500" : ""}`}
                    type="text"
                    value={value}
                    onChange={onChange}
                    name={name2 ? name2 : "Input field"}
                />
                {error && <div className="text-red-500 text-sm">{error}</div>}
            </div>
        </div>
    );
};

export default InputWithError;
