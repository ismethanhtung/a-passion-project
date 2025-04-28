import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import Cookie from "js-cookie";

const preloadedState = () => {
    const user = Cookie.get("user");
    const accessToken = Cookie.get("accessToken");
    const refreshToken = Cookie.get("refreshToken");

    return {
        user: {
            user: user ? JSON.parse(user) : null,
            accessToken: accessToken || null,
            refreshToken: refreshToken || null,
        },
    };
};

const store = configureStore({
    reducer: {
        user: userReducer,
    },
    preloadedState: preloadedState(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
