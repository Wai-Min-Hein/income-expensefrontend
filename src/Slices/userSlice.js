import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  errorMessage: null,
  loading: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.errorMessage = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.errorMessage = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },
    signUpStart: (state) => {
        state.loading = true;
        state.errorMessage = null;
      },
      signUpSuccess: (state) => {
        state.loading = false;
        state.errorMessage = null;
      },
      signUpFailure: (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      },

    logOutStart: (state) => {
      state.loading = true;
      state.errorMessage = null;
    },
    logOutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.errorMessage = null;
    },
    logOutFailure: (state, action) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { signInStart, signInSuccess, signInFailure, logOutStart, logOutSuccess, logOutFailure, signUpStart, signUpSuccess, signUpFailure } = userSlice.actions;

export default userSlice.reducer;
