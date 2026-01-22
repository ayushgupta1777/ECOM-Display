import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ✅ CORRECT: Named export that matches import in ApplyResellerScreen
export const applyForReseller = createAsyncThunk(
  'reseller/apply',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/reseller/apply', formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply as reseller');
    }
  }
);

export const generateShareLink = createAsyncThunk(
  'reseller/generateShareLink',
  async ({ productId, margin }, { rejectWithValue }) => {
    try {
      const response = await api.post('/reseller/share-link', { productId, margin });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate share link');
    }
  }
);

export const getWallet = createAsyncThunk(
  'reseller/getWallet',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/reseller/wallet');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const requestWithdrawal = createAsyncThunk(
  'reseller/requestWithdrawal',
  async ({ amount, bankDetails }, { rejectWithValue }) => {
    try {
      const response = await api.post('/reseller/withdraw', { amount, bankDetails });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const resellerSlice = createSlice({
  name: 'reseller',
  initialState: {
    wallet: {
      availableBalance: 0,
      pendingBalance: 0,
      totalEarned: 0,
      totalSales: 0,
      pendingOrders: 0,
      lockPeriodDays: 7
    },
    shareData: null,
    isLoading: false,
    error: null,
    successMessage: null
  },
  extraReducers: (builder) => {
    // Apply for Reseller
    builder
      .addCase(applyForReseller.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyForReseller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = 'Application submitted successfully!';
        state.error = null;
      })
      .addCase(applyForReseller.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to submit application';
      })

    // Generate Share Link
      .addCase(generateShareLink.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateShareLink.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shareData = action.payload;
        state.error = null;
      })
      .addCase(generateShareLink.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // Get Wallet
      .addCase(getWallet.fulfilled, (state, action) => {
        state.wallet = action.payload;
      })
      .addCase(getWallet.rejected, (state, action) => {
        state.error = action.payload;
      })

    // Request Withdrawal
      .addCase(requestWithdrawal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wallet = action.payload.wallet;
        state.successMessage = 'Withdrawal request submitted successfully!';
      })
      .addCase(requestWithdrawal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default resellerSlice.reducer;