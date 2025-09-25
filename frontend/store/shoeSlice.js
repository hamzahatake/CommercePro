import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedShoe: null,
  currentIndex: 0,
};

const shoeSlice = createSlice({
  name: 'shoe',
  initialState,
  reducers: {
    setSelectedShoe: (state, action) => {
      state.selectedShoe = action.payload;
    },
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload;
    },
    clearSelectedShoe: (state) => {
      state.selectedShoe = null;
      state.currentIndex = 0;
    },
  },
});

export const { setSelectedShoe, setCurrentIndex, clearSelectedShoe } = shoeSlice.actions;
export default shoeSlice.reducer;


