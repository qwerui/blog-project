import { createSlice } from '@reduxjs/toolkit'

export const loginSlice = createSlice({
  name: 'access-token',
  initialState: {
    token: ""
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.id = action.payload.id;
      state.isLogin = true;
    },
    logout: (state)=>{
        state.token = null;
        state.id = null;
        state.isLogin = false;
    }
  }
})

// Action creators are generated for each case reducer function
export const { login, logout } = loginSlice.actions

export default loginSlice.reducer