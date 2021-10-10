import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "features/Auth/AuthSlice";
import SettingReducer from 'features/Settings/SettingSlice';


const rootReducer = {
  auth: AuthReducer,
  setting: SettingReducer,
};
export const store = configureStore({
  reducer: rootReducer,
});
