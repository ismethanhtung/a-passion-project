import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookie from "js-cookie";
import Role from "@/interfaces/role";

interface UserState {
    user: { id: string; email: string; role: Role; name: string } | null;
    accessToken: string | null;
    refreshToken: string | null;
}

const initialState: UserState = {
    user: null,
    accessToken: null,
    refreshToken: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (
            state,
            action: PayloadAction<{
                user: { id: string; email: string; role: Role; name: string };
                accessToken: string;
                refreshToken: string;
            }>
        ) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;

            Cookie.set("user", JSON.stringify(action.payload.user), { expires: 7 }); // Lưu 7 ngày
            Cookie.set("accessToken", action.payload.accessToken, { expires: 7 });
            Cookie.set("refreshToken", action.payload.refreshToken, { expires: 7 });
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;

            Cookie.remove("user");
            Cookie.remove("accessToken");
            Cookie.remove("refreshToken");
        },
        setUser: (
            state,
            action: PayloadAction<{ user: { id: string; email: string; role: Role; name: string } }>
        ) => {
            state.user = action.payload.user;

            Cookie.set("user", JSON.stringify(action.payload.user), { expires: 7 });
        },
        setTokens: (
            state,
            action: PayloadAction<{ accessToken: string; refreshToken: string }>
        ) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;

            Cookie.set("accessToken", action.payload.accessToken, { expires: 7 });
            Cookie.set("refreshToken", action.payload.refreshToken, { expires: 7 });
        },
    },
});

export const { login, logout, setUser, setTokens } = userSlice.actions;
export default userSlice.reducer;
