import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      console.log('📤 Creating order:', orderData);
      
      const response = await api.post('/orders/checkout', orderData);
      
      console.log('✅ Order created successfully:', response.data.data.order);
      
      return response.data.data.order;
    } catch (error) {
      console.error('❌ Create order error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to create order';
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      console.log('📥 Fetching orders...');
      const response = await api.get('/orders');
      console.log('✅ Orders fetched:', response.data.data.orders?.length || 0);
      return response.data.data.orders || [];
    } catch (error) {
      console.error('❌ Fetch orders error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      console.log('📥 Fetching order:', orderId);
      const response = await api.get(`/orders/${orderId}`);
      console.log('✅ Order fetched:', response.data.data.order);
      return response.data.data.order;
    } catch (error) {
      console.error('❌ Fetch order error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'orders/updatePaymentStatus',
  async ({ orderId, paymentStatus, paymentId }, { rejectWithValue }) => {
    try {
      console.log('📤 Updating payment status:', { orderId, paymentStatus });
      
      const response = await api.put(`/orders/${orderId}/payment`, {
        paymentStatus,
        paymentId
      });
      
      console.log('✅ Payment status updated');
      return response.data.data.order;
    } catch (error) {
      console.error('❌ Update payment status error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to update payment');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (orderId, { rejectWithValue }) => {
    try {
      console.log('📤 Cancelling order:', orderId);
      const response = await api.put(`/orders/${orderId}/cancel`);
      console.log('✅ Order cancelled');
      return response.data.data.order;
    } catch (error) {
      console.error('❌ Cancel order error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    selectedOrder: null,
    isLoading: false,
    error: null
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // CREATE ORDER
      .addCase(createOrder.pending, (state) => { 
        state.isLoading = true;
        state.error = null;
        console.log('⏳ Creating order...');
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOrder = action.payload;
        state.error = null;
        console.log('✅ Order created in state:', action.payload._id);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.error('❌ Order creation failed in state:', action.payload);
      })
      
      // FETCH ORDERS
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // FETCH ORDER
      .addCase(fetchOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // UPDATE PAYMENT STATUS
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
        // Update in list if exists
        const index = state.items.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      
      // CANCEL ORDER
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOrder = action.payload;
        // Update in list
        const index = state.items.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearOrderError, clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;