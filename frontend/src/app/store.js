import { configureStore } from '@reduxjs/toolkit';
import authReducers from "../features/auth/authSlice";
import goalReducer from '../features/goals/goalSlice'


export const store = configureStore({
  reducer: {
    auth: authReducers,
    goals: goalReducer
  },
});
