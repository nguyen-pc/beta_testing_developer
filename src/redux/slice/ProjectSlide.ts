import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callFetchProjectByCompany } from "../../config/api";
import type { IProject } from "../../types/backend";



interface IState {
  isFetching: boolean;
  meta: {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: IProject[];
}
 
// First, create the thunk
// export const fetchJob = createAsyncThunk(
//   "project/fetchProject",
//   async ({ query }: { query: string }) => {
//     const response = await callFetchJob(query);
//     return response;
//   }
// );

export const fetchProjectByCompany = createAsyncThunk(
  "project/fetchProjectByCompany",
  async ({ id, query }: { id: string; query: string }) => {
    console.log("Fetching projects for company ID:", id, "with query:", query);
    const response = await callFetchProjectByCompany(id, query);
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

export const projectSlide = createSlice({
  name: "project",
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
    builder.addCase(fetchProjectByCompany.pending, (state, action) => {
      state.isFetching = true;
      // Add user to the state array
      // state.courseOrder = action.payload;
    });

    builder.addCase(fetchProjectByCompany.rejected, (state, action) => {
      state.isFetching = false;
      // Add user to the state array
      // state.courseOrder = action.payload;
    });

    builder.addCase(fetchProjectByCompany.fulfilled, (state, action) => {
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

export const { setActiveMenu } = projectSlide.actions;

export default projectSlide.reducer;
