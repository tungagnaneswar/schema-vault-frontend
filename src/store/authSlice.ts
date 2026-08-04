import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getCookie, setCookie, removeCookie } from '../utils/cookie';

interface AuthState {
  user: { email: string; role: string } | null;
  isAuthenticated: boolean;
}

const getUserFromCookie = (): { email: string; role: string } | null => {
  const userCookie = getCookie('user');
  if (!userCookie) return null;
  try {
    return JSON.parse(userCookie);
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getUserFromCookie(),
  isAuthenticated: !!getCookie('accessToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: { email: string; role: string }; accessToken: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      setCookie('accessToken', action.payload.accessToken);
      setCookie('refreshToken', action.payload.refreshToken);
      setCookie('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      removeCookie('accessToken');
      removeCookie('refreshToken');
      removeCookie('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
