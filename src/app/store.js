import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "features/Auth/AuthSlice";
import counterReducer from "../features/counter/counterSlice";

const rootReducer = {
  counter: counterReducer,
  auth: AuthReducer,
};
export const store = configureStore({
  reducer: rootReducer,
});
