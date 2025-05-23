"use client";

import { Provider } from "react-redux";
import store from "@/store/store";
import { SessionProvider } from "next-auth/react";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}
