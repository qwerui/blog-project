import { configureStore } from '@reduxjs/toolkit'
import login from './login-store';

export default configureStore({
  reducer: {
    login: login
  }
})