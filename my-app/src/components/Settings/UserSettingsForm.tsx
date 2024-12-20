import React from "react";
import FormWrapper from "../FormWrapper";

const UserSettingsForm = () => {
    const handleSubmit = async (formData: Record<string, string>) => {
        const response = await fetch("/api/user/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Unable to update settings.");
        alert("Settings updated successfully!");
    };

    return (
        <FormWrapper
            title="Personal Settings"
            fields={[
                {
                    name: "language",
                    label: "Language",
                    type: "select",
                    options: [
                        { value: "en", label: "English" },
                        { value: "vi", label: "Vietnamese" },
                    ],
                },
                {
                    name: "theme",
                    label: "Theme",
                    type: "select",
                    options: [
                        { value: "light", label: "Light" },
                        { value: "dark", label: "Dark" },
                    ],
                },
                {
                    name: "learningGoals",
                    label: "Learning Goals",
                    type: "text",
                    placeholder: "Enter your learning goals",
                },
            ]}
            onSubmit={handleSubmit}
        />
    );
};

export default UserSettingsForm;
