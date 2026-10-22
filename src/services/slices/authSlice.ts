import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  loginUserApi,
  loginDemoGuestApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  type TRegisterData,
  type TLoginData,
} from '../../utils/local-demo-api';

import type { TUser } from '@utils-types';

type TAuthState = {
  user: TUser | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  error: string | null;
};

export const loginDemoGuest = createAsyncThunk('auth/loginDemoGuest', loginDemoGuestApi);

export const loginUser = createAsyncThunk('auth/loginUser', (data: TLoginData) =>
  loginUserApi(data)
);
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  (data: TRegisterData) => registerUserApi(data)
);

export const checkUserAuth = createAsyncThunk('auth/checkUserAuth', async () => {
  const response = await getUserApi();
  return response.user;
});
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: { name?: string; email?: string; password?: string }) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);
export const logoutUser = createAsyncThunk('auth/logoutUser', () => logoutApi());
const initialState: TAuthState = {
  user: null,
  isLoading: false,
  isAuthChecked: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginDemoGuest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginDemoGuest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(loginDemoGuest.rejected, (state) => {
        state.isLoading = false;
        state.error =
          'Demo konnte nicht gestartet werden. Bitte erlaube Sitzungsspeicher im Browser.';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Die Anmeldung ist fehlgeschlagen.';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Das Konto konnte nicht erstellt werden.';
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ?? 'Dein Profil konnte nicht aktualisiert werden.';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Die Abmeldung ist fehlgeschlagen.';
      });
  },
});

export default authSlice.reducer;
