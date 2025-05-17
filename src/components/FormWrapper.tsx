import React, { useState } from "react";

interface Field {
    name: string;
    label: string;
    type: "text" | "password" | "email" | "select";
    placeholder?: string;
    options?: { value: string; label: string }[];
}

interface FormWrapperProps {
    title: string;
    fields: Field[];
    onSubmit: (formData: Record<string, string>) => Promise<void>;
}

const FormWrapper: React.FC<FormWrapperProps> = ({
    title,
    fields,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <form
                onSubmit={handleSubmit}
                className="w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative"
            >
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-violet-50 opacity-70"></div>
                <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-indigo-50 opacity-70"></div>

                {/* Form content */}
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">
                        {title}
                    </h2>

                    <div className="space-y-6">
                        {fields.map((field) => (
                            <div key={field.name} className="relative">
                                <label
                                    htmlFor={field.name}
                                    className={`block text-sm font-medium mb-2 transition-all duration-200 ${
                                        focusedField === field.name
                                            ? "text-violet-600"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {field.label}
                                </label>

                                {field.type === "select" ? (
                                    <div className="relative">
                                        <select
                                            id={field.name}
                                            name={field.name}
                                            value={formData[field.name] || ""}
                                            onChange={handleChange}
                                            onFocus={() =>
                                                setFocusedField(field.name)
                                            }
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 appearance-none focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all duration-200"
                                        >
                                            {(field.options || []).map(
                                                (option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 9l-7 7-7-7"
                                                ></path>
                                            </svg>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input
                                            id={field.name}
                                            type={field.type}
                                            name={field.name}
                                            value={formData[field.name] || ""}
                                            onChange={handleChange}
                                            onFocus={() =>
                                                setFocusedField(field.name)
                                            }
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all duration-200"
                                            placeholder={field.placeholder}
                                            required
                                        />
                                        {field.type === "email" && (
                                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                                <svg
                                                    className="w-5 h-5 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                    ></path>
                                                </svg>
                                            </div>
                                        )}
                                        {field.type === "password" && (
                                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                                <svg
                                                    className="w-5 h-5 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                    ></path>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-10">
                        <button
                            type="submit"
                            className="w-full px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-md"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Processing...
                                </div>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FormWrapper;
