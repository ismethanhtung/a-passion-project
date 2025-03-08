"use client";

import React from "react";
import SettingsForm from "@/components/Settings/SettingsForm";
import UserSettingsForm from "@/components/Settings/UserSettingsForm";
import LearningGoals from "@/components/Settings/LearningGoals";
import PasswordChangeForm from "@/components/Settings/PasswordChangeForm";
import CurrentLevel from "@/components/Settings/CurrentLevel";

const SettingsPage = () => {
    return (
        <div className="container mx-auto p-8 space-y-8">
            <h1 className="text-3xl font-bold text-red-300">User Settings</h1>
            <div className="flex">
                <SettingsForm />
                <PasswordChangeForm />
                <UserSettingsForm />
                <LearningGoals />
            </div>
            <div className="flex w-1/4">
                <CurrentLevel />
            </div>
        </div>
    );
};

export default SettingsPage;
