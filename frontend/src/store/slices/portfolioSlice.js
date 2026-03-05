import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  holdings: JSON.parse(localStorage.getItem('portfolio') || '[]'),
  transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    buyStock: (state, action) => {
      const { symbol, quantity, price } = action.payload;
      const existingHolding = state.holdings.find(h => h.symbol === symbol);
      
      if (existingHolding) {
        const totalQuantity = existingHolding.quantity + quantity;
        const totalValue = (existingHolding.avgPrice * existingHolding.quantity) + (price * quantity);
        existingHolding.avgPrice = totalValue / totalQuantity;
        existingHolding.quantity = totalQuantity;
      } else {
        state.holdings.push({
          symbol,
          quantity,
          avgPrice: price,
        });
      }
      
      // Add transaction
      state.transactions.unshift({
        id: Date.now(),
        symbol,
        type: 'BUY',
        quantity,
        price,
        total: quantity * price,
        date: new Date().toISOString(),
      });
      
      localStorage.setItem('portfolio', JSON.stringify(state.holdings));
      localStorage.setItem('transactions', JSON.stringify(state.transactions));
    },
    sellStock: (state, action) => {
      const { symbol, quantity, price } = action.payload;
      const existingHolding = state.holdings.find(h => h.symbol === symbol);
      
      if (existingHolding && existingHolding.quantity >= quantity) {
        existingHolding.quantity -= quantity;
        
        if (existingHolding.quantity === 0) {
          state.holdings = state.holdings.filter(h => h.symbol !== symbol);
        }
        
        // Add transaction
        state.transactions.unshift({
          id: Date.now(),
          symbol,
          type: 'SELL',
          quantity,
          price,
          total: quantity * price,
          date: new Date().toISOString(),
        });
        
        localStorage.setItem('portfolio', JSON.stringify(state.holdings));
        localStorage.setItem('transactions', JSON.stringify(state.transactions));
      }
    },
    loadDemoPortfolio: (state) => {
      const demoPortfolio = [
        { symbol: 'RELIANCE', quantity: 10, avgPrice: 2400 },
        { symbol: 'TCS', quantity: 5, avgPrice: 3500 },
        { symbol: 'INFY', quantity: 20, avgPrice: 1400 },
      ];
      state.holdings = demoPortfolio;
      localStorage.setItem('portfolio', JSON.stringify(demoPortfolio));
    },
    clearPortfolio: (state) => {
      state.holdings = [];
      state.transactions = [];
      localStorage.removeItem('portfolio');
      localStorage.removeItem('transactions');
    },
  },
});

export const { buyStock, sellStock, loadDemoPortfolio, clearPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
