import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
}

interface AuthState {
    user: User | null,
    token: string | null
}

const initialState: AuthState = {
    user: null,
    token: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setSignin: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setSignout: (state) => {
            state.user = null;
            state.token = null;
            
        },
    }
})

export const { setSignin, setSignout } = authSlice.actions;
export default authSlice.reducer;