import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callFetchCampaignByProject } from "../../config/api";
import type { ICampaign } from "../../types/backend";

interface IState {
  isFetching: boolean;
  meta: {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: ICampaign[];
}

export const fetchCampaignByProject = createAsyncThunk(
  "campaign/fetchCampaignByProject",
  async ({ id, query }: { id: string; query: string }) => {
    console.log("Fetching campaigns for project ID:", id, "with query:", query);
    const response = await callFetchCampaignByProject(id, query);
    return response;
  }
);

const initialState: IState = {
  isFetching: true,
  meta: {
    page: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  },
  result: [],
};

export const campaignSlide = createSlice({
  name: "campaign",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setActiveMenu: (state, action) => {
      // state.activeMenu = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchCampaignByProject.pending, (state, action) => {
      state.isFetching = true;
      // Add user to the state array
      // state.courseOrder = action.payload;
    });

    builder.addCase(fetchCampaignByProject.rejected, (state, action) => {
      state.isFetching = false;
      // Add user to the state array
      // state.courseOrder = action.payload;
    });

    builder.addCase(fetchCampaignByProject.fulfilled, (state, action) => {
      if (action.payload && action.payload.data) {
        state.isFetching = false;
        state.meta = action.payload.data.meta;
        state.result = action.payload.data.result;
      }
      // Add user to the state array

      // state.courseOrder = action.payload;
    });
  },
});

export const { setActiveMenu } = campaignSlide.actions;

export default campaignSlide.reducer;
