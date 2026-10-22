import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import constructorReducer from './slices/constructorSlice';
import feedsReducer from './slices/feedsSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import orderInfoReducer from './slices/orderInfoSlice';
import orderReducer from './slices/orderSlice';
import pizzaReducer from './slices/pizzaSlice';
import profileOrdersReducer from './slices/profileOrdersSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  auth: authReducer,
  profileOrders: profileOrdersReducer,
  feeds: feedsReducer,
  orderInfo: orderInfoReducer,
  pizza: pizzaReducer,
});
