import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllStocks, getMarketOverview } from '../../services/stockService';

export const fetchStocks = createAsyncThunk(
  'stocks/fetchStocks',
  async () => {
    const stocks = await getAllStocks();
    return stocks;
  }
);

export const fetchMarketOverview = createAsyncThunk(
  'stocks/fetchMarketOverview',
  async () => {
    const overview = await getMarketOverview();
    return overview;
  }
);

const initialState = {
  stocks: [],
  marketOverview: null,
  loading: false,
  error: null,
  watchlist: JSON.parse(localStorage.getItem('watchlist') || '[]'),
};

const stockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    addToWatchlist: (state, action) => {
      if (!state.watchlist.includes(action.payload)) {
        state.watchlist.push(action.payload);
        localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
      }
    },
    removeFromWatchlist: (state, action) => {
      state.watchlist = state.watchlist.filter(symbol => symbol !== action.payload);
      localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
    },
    setStocks: (state, action) => {
      state.stocks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMarketOverview.fulfilled, (state, action) => {
        state.marketOverview = action.payload;
      });
  },
});

export const { addToWatchlist, removeFromWatchlist, setStocks } = stockSlice.actions;
export default stockSlice.reducer;
