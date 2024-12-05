import React from "react";

interface InputProps {
    type?: string;
    placeholder?: string;
    value?: string;
    // onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({
    type = "text",
    placeholder = "",
    value = "",
    // onChange,
    className = "",
    label,
    error,
}) => {
    return (
        <div className={`flex flex-col ${className}`}>
            {label && (
                <label className="mb-2 text-sm font-medium">{label}</label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                // onChange={onChange}
                className="border-2 border-gray-200 rounded-md px-4 py-2"
            />
            {error && (
                <span className="text-sm text-red-500 mt-1">{error}</span>
            )}
        </div>
    );
};

export default Input;
