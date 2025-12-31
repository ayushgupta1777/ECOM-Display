import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const applyAsReseller = createAsyncThunk(
  'reseller/apply',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/reseller/apply', formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getWallet = createAsyncThunk(
  'reseller/getWallet',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/reseller/wallet');
      return response.data.data.wallet;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const requestWithdrawal = createAsyncThunk(
  'reseller/requestWithdrawal',
  async ({ amount }, { rejectWithValue }) => {
    try {
      const response = await api.post('/reseller/withdrawal', { amount });
      return response.data.data.wallet;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const resellerSlice = createSlice({
  name: 'reseller',
  initialState: {
    wallet: { balance: 0, pendingBalance: 0, totalEarned: 0 },
    isLoading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyAsReseller.pending, (state) => { state.isLoading = true; })
      .addCase(applyAsReseller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wallet = action.payload.wallet;
      })
      .addCase(applyAsReseller.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getWallet.fulfilled, (state, action) => { state.wallet = action.payload; })
      .addCase(requestWithdrawal.pending, (state) => { state.isLoading = true; })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wallet = action.payload;
      })
      .addCase(requestWithdrawal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default resellerSlice.reducer;