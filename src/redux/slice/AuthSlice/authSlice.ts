import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
  onBordingComplete: false,
  walkThroughImages: [],
};

export const authSlice = createSlice({
  name: 'onBoarding',
  initialState,
  reducers: {
    setOnBoardingComplete: (state, action: PayloadAction<boolean>) => {
      state.onBordingComplete = action.payload;
    },
    setWalkThroughImages: (state, action: PayloadAction<any[]>) => {
      state.walkThroughImages = action.payload;
    },
  },
});
export const {setOnBoardingComplete, setWalkThroughImages} = authSlice.actions;

export default authSlice.reducer;
