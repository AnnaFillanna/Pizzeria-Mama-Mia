import { combineReducers, type UnknownAction } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import constructorReducer from './slices/constructorSlice';
import feedsReducer from './slices/feedsSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import orderInfoReducer from './slices/orderInfoSlice';
import orderReducer from './slices/orderSlice';
import pizzaReducer from './slices/pizzaSlice';
import profileOrdersReducer from './slices/profileOrdersSlice';

const combinedReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  auth: authReducer,
  profileOrders: profileOrdersReducer,
  feeds: feedsReducer,
  orderInfo: orderInfoReducer,
  pizza: pizzaReducer,
});

// Clear cached order details and the cart when changing the local identity.
export const rootReducer = (
  state: ReturnType<typeof combinedReducer> | undefined,
  action: UnknownAction
): ReturnType<typeof combinedReducer> => {
  if (
    action.type === 'auth/loginDemoGuest/fulfilled' ||
    action.type === 'auth/logoutUser/fulfilled'
  ) {
    state = state
      ? {
          ...combinedReducer(undefined, { type: 'reset' }),
          ingredients: state.ingredients,
        }
      : undefined;
  }
  return combinedReducer(state, action);
};
