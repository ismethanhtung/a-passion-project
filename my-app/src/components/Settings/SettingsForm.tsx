import React from "react";
import FormWrapper from "../FormWrapper";

const SettingsForm = () => {
    const handleSubmit = async (formData: Record<string, string>) => {
        const response = await fetch("/api/user/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to update user information.");
        alert("User information updated successfully!");
    };

    return (
        <FormWrapper
            title="Edit Profile"
            fields={[
                { name: "name", label: "Name", type: "text", placeholder: "Enter your name" },
                { name: "email", label: "Email", type: "email", placeholder: "Enter your email" },
            ]}
            onSubmit={handleSubmit}
        />
    );
};

export default SettingsForm;
