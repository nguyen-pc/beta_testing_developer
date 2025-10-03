import { configureStore } from "@reduxjs/toolkit";
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import accountReducer from "./slice/accountSlide";
import projectReducer from "./slice/ProjectSlide";
import campaignReducer from "./slice/CampaignSlide";
// import userReducer from "./slice/userReducer";
export const store = configureStore({
  reducer: {
    account: accountReducer,
    project: projectReducer,
    campaign: campaignReducer,
    // user: userReducer,
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
