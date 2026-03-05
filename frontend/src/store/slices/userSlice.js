import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'),
  isAuthenticated: !!localStorage.getItem('currentUser'),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      localStorage.removeItem('currentUser');
    },
    register: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    updateUser: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
      localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    },
  },
});

export const { login, logout, register, updateUser } = userSlice.actions;
export default userSlice.reducer;
