import React from "react";
import FormWrapper from "../FormWrapper";
import { handleChangePassword } from "@/api/auth/changePassword";

const PasswordChangeForm = () => {
    const handleSubmit = async (formData: Record<string, string>) => {
        if (formData.newPassword !== formData.confirmPassword) {
            throw new Error("New passwords do not match.");
        }
        const response = await handleChangePassword(formData.currentPassword, formData.newPassword);
        if (!response.ok) throw new Error("Unable to change password.");
        alert("Password changed successfully!");
    };

    return (
        <FormWrapper
            title="Change Password"
            fields={[
                {
                    name: "currentPassword",
                    label: "Current Password",
                    type: "password",
                    placeholder: "Enter current password",
                },
                {
                    name: "newPassword",
                    label: "New Password",
                    type: "password",
                    placeholder: "Enter new password",
                },
                {
                    name: "confirmPassword",
                    label: "Confirm New Password",
                    type: "password",
                    placeholder: "Confirm new password",
                },
            ]}
            onSubmit={handleSubmit}
        />
    );
};

export default PasswordChangeForm;
