"use client";

import React from "react";
import SettingsForm from "@/components/Settings/SettingsForm";
import UserSettingsForm from "@/components/Settings/UserSettingsForm";
import PasswordChangeForm from "@/components/Settings/PasswordChangeForm";

const SettingsPage = () => {
    return (
        <div className="container mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-red-300">User Settings</h1>
            <div className="flex">
                <SettingsForm />
                <PasswordChangeForm />
                <UserSettingsForm />
            </div>
        </div>
    );
};

export default SettingsPage;
