import { createSlice } from '@reduxjs/toolkit'

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    token: "",
    id:"",
    isLogin: false
  },
  reducers: {
    login: (state, action) => {
      state.token = "Bearer "+action.payload.token;
      state.id = action.payload.id;
      state.isLogin = true;
    },
    refresh:(state, action) => {
      state.token = action.payload
    },
    logout: (state)=>{
        state.token = null;
        state.id = null;
        state.isLogin = false;
    }
  }
})

// Action creators are generated for each case reducer function
export const { login, logout, refresh } = loginSlice.actions

export default loginSlice.reducer