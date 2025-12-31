import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrder } from '../../redux/slices/orderSlice';
import Icon from 'react-native-vector-icons/Ionicons';

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const dispatch = useDispatch();
  const { selectedOrder: order, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrder(orderId));
  }, [orderId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  const getStatusSteps = () => {
    const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    return steps;
  };

  const currentStatusIndex = getStatusSteps().indexOf(order.orderStatus);

  return (
    <ScrollView style={styles.container}>
      {/* Order Status */}
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Order Status</Text>
        <View style={styles.timelineContainer}>
          {getStatusSteps().map((step, index) => (
            <View key={step} style={styles.timelineItem}>
              <View style={styles.timelineRow}>
                <View
                  style={[
                    styles.timelineDot,
                    index <= currentStatusIndex && styles.timelineDotActive
                  ]}
                >
                  <Icon
                    name={index <= currentStatusIndex ? 'checkmark' : 'ellipse-outline'}
                    size={16}
                    color={index <= currentStatusIndex ? '#fff' : '#E5E7EB'}
                  />
                </View>
                <Text
                  style={[
                    styles.timelineLabel,
                    index <= currentStatusIndex && styles.timelineLabelActive
                  ]}
                >
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </Text>
              </View>
              {index < getStatusSteps().length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    index < currentStatusIndex && styles.timelineLineActive
                  ]}
                />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Order Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Order Number</Text>
          <Text style={styles.infoValue}>{order.orderNo}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Order Date</Text>
          <Text style={styles.infoValue}>
            {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Payment Method</Text>
          <Text style={styles.infoValue}>{order.paymentMethod.toUpperCase()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Payment Status</Text>
          <Text style={styles.infoValue}>{order.paymentStatus.toUpperCase()}</Text>
        </View>
      </View>

      {/* Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.items.map((item, idx) => (
          <View key={idx} style={styles.itemBox}>
            <Text style={styles.itemName}>{item.product?.title || 'Product'}</Text>
            <View style={styles.itemDetails}>
              <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
              <Text style={styles.itemPrice}>₹{item.finalPrice} each</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Shipping Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <View style={styles.addressBox}>
          <Icon name="location-outline" size={20} color="#4F46E5" />
          <View style={styles.addressContent}>
            <Text style={styles.addressName}>{order.shippingAddress.name}</Text>
            <Text style={styles.addressText}>{order.shippingAddress.addressLine1}</Text>
            <Text style={styles.addressText}>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </Text>
            <Text style={styles.addressPhone}>{order.shippingAddress.phone}</Text>
          </View>
        </View>
      </View>

      {/* Price Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Details</Text>
        <View style={styles.priceRow}>
          <Text>Subtotal</Text>
          <Text>₹{order.subtotal}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text>Shipping</Text>
          <Text>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text>Tax (18%)</Text>
          <Text>₹{order.tax}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{order.total}</Text>
        </View>
      </View>

      {/* Actions */}
      {['pending', 'confirmed'].includes(order.orderStatus) && (
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() =>
              Alert.alert('Cancel Order', 'Are you sure?', [
                { text: 'No', style: 'cancel' },
                { text: 'Yes', onPress: () => {} }
              ])
            }
          >
            <Text style={styles.cancelBtnText}>Cancel Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 14, color: '#6B7280' },
  statusSection: { backgroundColor: '#fff', padding: 16, marginVertical: 8 },
  section: { backgroundColor: '#fff', padding: 16, marginVertical: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  timelineContainer: { paddingLeft: 16 },
  timelineItem: { marginBottom: 12 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timelineDot: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  timelineDotActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  timelineLabel: { fontSize: 13, color: '#6B7280' },
  timelineLabelActive: { color: '#4F46E5', fontWeight: '600' },
  timelineLine: { width: 2, height: 20, backgroundColor: '#E5E7EB', marginLeft: 15, marginVertical: 4 },
  timelineLineActive: { backgroundColor: '#4F46E5' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  infoLabel: { fontSize: 13, color: '#6B7280' },
  infoValue: { fontSize: 13, fontWeight: '600', color: '#111827' },
  itemBox: { backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8, marginBottom: 8 },
  itemName: { fontWeight: '600', color: '#111827', marginBottom: 6 },
  itemDetails: { flexDirection: 'row', gap: 12 },
  itemQty: { fontSize: 12, color: '#6B7280' },
  itemPrice: { fontSize: 12, fontWeight: '600', color: '#4F46E5' },
  addressBox: { flexDirection: 'row', gap: 12, backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8 },
  addressContent: { flex: 1 },
  addressName: { fontWeight: '600', color: '#111827' },
  addressText: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  addressPhone: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 },
  totalLabel: { fontWeight: '700', color: '#111827' },
  totalValue: { fontWeight: '700', color: '#4F46E5', fontSize: 16 },
  cancelBtn: { backgroundColor: '#EF4444', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  cancelBtnText: { color: '#fff', fontWeight: '600' }
});

export default OrderDetailsScreen;