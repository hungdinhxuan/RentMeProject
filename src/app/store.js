import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "features/Auth/AuthSlice";
import SettingReducer from 'features/Settings/SettingSlice';
import PlayerReducer from 'features/RentPlayer/PlayerSlice'

const rootReducer = {
  auth: AuthReducer,
  setting: SettingReducer,
  players: PlayerReducer
};
export const store = configureStore({
  reducer: rootReducer,
});
