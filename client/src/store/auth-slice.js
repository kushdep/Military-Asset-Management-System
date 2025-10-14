import { createSlice } from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode"

const token = localStorage.getItem("token");

let role = "";
if (token) {
  try {
    const decoded = jwtDecode(token);
    role = decoded.role || "";
  } catch(error) {
    console.error("Error in hydration",error)
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    role: role || "",
    token: token || null,
    isAuthenticated: !!token,
  },
  reducers: {
    loginSuccess(state, action) {
      try {
        const { token, role, name } = action.payload;
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        
        state.token = token;
        state.role = role;
        state.isAuthenticated = true;
      } catch (error) {
        console.error("Error in loginSuccess"+error)
      }
    },
    logout(state) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        
        state.token = null;
        state.role = "";
        state.isAuthenticated = false;
      } catch (error) {
        console.error("Error in logout"+error)
      }
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
