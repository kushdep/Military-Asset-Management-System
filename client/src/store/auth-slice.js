import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    role: role || "",
    token: token || null,
    isAuthenticated: !!token,
  },
  reducers: {
    loginSuccess(state, action) {
      const { token, role } = action.payload;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      state.token = token;
      state.role = role;
      state.isAuthenticated = true;
    },
    logout(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      state.token = null;
      state.role = "";
      state.isAuthenticated = false;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
