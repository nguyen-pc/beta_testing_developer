import { configureStore } from "@reduxjs/toolkit";
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import accountReducer from "./slice/accountSlide";
import projectReducer from "./slice/ProjectSlide";
import campaignReducer from "./slice/CampaignSlide";
import userReducer from "./slice/userReducer";
import permissionReducer from "./slice/permissionSlide";
import roleReducer from "./slice/roleSlide";
export const store = configureStore({
  reducer: {
    account: accountReducer,
    project: projectReducer,
    campaign: campaignReducer,
    permission: permissionReducer,
    role: roleReducer,
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
