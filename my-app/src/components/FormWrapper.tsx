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

const FormWrapper: React.FC<FormWrapperProps> = ({ title, fields, onSubmit }) => {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        <form onSubmit={handleSubmit} className="w-full mx-8 p-4 border-2 rounded shadow">
            <h2 className="text-lg font-medium mb-4">{title}</h2>
            {fields.map((field) => (
                <div key={field.name} className="mb-4">
                    <label className="block text-sm font-medium mb-1">{field.label}</label>
                    {field.type === "select" ? (
                        <select
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                        >
                            {(field.options || []).map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                            placeholder={field.placeholder}
                            required
                        />
                    )}
                </div>
            ))}
            <button
                type="submit"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                disabled={loading}
            >
                {loading ? "Processing..." : "Submit"}
            </button>
        </form>
    );
};

export default FormWrapper;
