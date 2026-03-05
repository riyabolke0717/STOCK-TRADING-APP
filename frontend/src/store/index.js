import { configureStore } from '@reduxjs/toolkit';
import stockReducer from './slices/stockSlice';
import userReducer from './slices/userSlice';
import portfolioReducer from './slices/portfolioSlice';

export const store = configureStore({
  reducer: {
    stocks: stockReducer,
    user: userReducer,
    portfolio: portfolioReducer,
  },
});

export default store;
