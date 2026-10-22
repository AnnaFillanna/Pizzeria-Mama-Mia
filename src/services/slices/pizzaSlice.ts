import { createSlice } from '@reduxjs/toolkit';

import { createOrder } from './orderSlice';

import type { PayloadAction } from '@reduxjs/toolkit';

export type TPizzaSize = 'small' | 'medium' | 'large';

export type TPizzaState = {
  doughId: string;
  size: TPizzaSize;
  toppingIds: string[];
};

const initialState: TPizzaState = {
  doughId: 'dough-classic',
  size: 'medium',
  toppingIds: ['cheese-mozzarella', 'veg-tomato', 'veg-basil'],
};

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {
    selectDough: (state, action: PayloadAction<string>) => {
      state.doughId = action.payload;
    },
    selectSize: (state, action: PayloadAction<TPizzaSize>) => {
      state.size = action.payload;
    },
    toggleTopping: (state, action: PayloadAction<string>) => {
      state.toppingIds = state.toppingIds.includes(action.payload)
        ? state.toppingIds.filter((id) => id !== action.payload)
        : [...state.toppingIds, action.payload];
    },
    setToppings: (state, action: PayloadAction<string[]>) => {
      state.toppingIds = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.fulfilled, (state) => {
      state.toppingIds = [];
    });
  },
});

export const { selectDough, selectSize, toggleTopping, setToppings } =
  pizzaSlice.actions;

export default pizzaSlice.reducer;
