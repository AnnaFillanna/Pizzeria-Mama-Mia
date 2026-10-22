import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { submitDemoOrder } from '../../utils/local-demo-api';

import type { TPizzaOrderInput } from '../../utils/local-demo-api';
import type { TOrder } from '@utils-types';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (order: string[] | TPizzaOrderInput) => {
    const response = await submitDemoOrder(order);
    return response.order;
  }
);

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error =
          action.error.message ?? 'Deine Demo-Bestellung konnte nicht erstellt werden.';
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
