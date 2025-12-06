import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: null,
    refreshToken: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action) {
            const data = action.payload;

            state.accessToken = data.accessToken || null;
            state.refreshToken = data.refreshToken || null;
        },

        clearUser(state) {
            state.accessToken = null;
            state.refreshToken = null;
        },
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;