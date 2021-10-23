import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "features/Auth/AuthSlice";
import SettingReducer from 'features/Settings/SettingSlice';
import PlayerReducer from 'features/RentPlayer/PlayerSlice'
import MessageReducer from 'features/Settings/MessageSlice'

const rootReducer = {
  auth: AuthReducer,
  setting: SettingReducer,
  players: PlayerReducer,
  messages: MessageReducer
};
export const store = configureStore({
  reducer: rootReducer,
});
