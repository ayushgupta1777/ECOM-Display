// ============================================
// ADMIN ORDER DETAILS WITH SHIPROCKET ACTIONS
// ============================================

import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../../services/api';

const AdminOrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data.data.order);
    } catch (error) {
      Alert.alert('Error', 'Failed to load order');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      setIsProcessing(true);
      await api.put(`/admin/orders/${orderId}/status`, {
        status: newStatus
      });
      Alert.alert('Success', `Order status updated to ${newStatus}`);
      fetchOrder();
      setShowStatusModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setIsProcessing(false);
    }
  };

  const createShipment = async () => {
    Alert.alert(
      'Create Shipment',
      'This will create a shipment in Shiprocket. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: async () => {
            try {
              setIsProcessing(true);
              await api.post(`/shiprocket/shipment/${orderId}`);
              Alert.alert('Success', 'Shipment created successfully');
              fetchOrder();
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to create shipment');
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };

  const generateLabel = async () => {
    try {
      setIsProcessing(true);
      const response = await api.get(`/shiprocket/label/${orderId}`);
      Alert.alert(
        'Label Generated',
        'Shipping label has been generated',
        [
          {
            text: 'View',
            onPress: () => {
              // Open label URL
              // Linking.openURL(response.data.data.labelUrl);
            }
          },
          { text: 'OK' }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate label');
    } finally {
      setIsProcessing(false);
    }
  };

  const schedulePickup = async () => {
    Alert.alert(
      'Schedule Pickup',
      'This will schedule a pickup with the courier. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Schedule',
          onPress: async () => {
            try {
              setIsProcessing(true);
              await api.post(`/shiprocket/schedule-pickup/${orderId}`);
              Alert.alert('Success', 'Pickup scheduled successfully');
              fetchOrder();
            } catch (error) {
              Alert.alert('Error', 'Failed to schedule pickup');
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };

  const trackShipment = async () => {
    try {
      setIsProcessing(true);
      const response = await api.get(`/shiprocket/track/${orderId}`);
      navigation.navigate('ShipmentTracking', {
        trackingData: response.data.data.tracking
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch tracking');
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelShipment = async () => {
    Alert.alert(
      'Cancel Shipment',
      'This will cancel the shipment in Shiprocket. This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsProcessing(true);
              await api.delete(`/shiprocket/shipment/${orderId}`);
              Alert.alert('Success', 'Shipment cancelled');
              fetchOrder();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel shipment');
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };

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
        <Icon name="alert-circle-outline" size={64} color="#EF4444" />
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  const statusFlow = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered'];
  const currentIndex = statusFlow.indexOf(order.orderStatus);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{order.orderNo}</Text>
        <TouchableOpacity onPress={() => setShowStatusModal(true)}>
          <Icon name="pencil" size={22} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Status Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          <View style={styles.timeline}>
            {statusFlow.map((status, index) => (
              <View key={status} style={styles.timelineItem}>
                <View style={styles.timelineRow}>
                  <View
                    style={[
                      styles.timelineDot,
                      index <= currentIndex && styles.timelineDotActive
                    ]}
                  >
                    <Icon
                      name={index <= currentIndex ? 'checkmark' : 'ellipse'}
                      size={index <= currentIndex ? 16 : 12}
                      color={index <= currentIndex ? '#fff' : '#D1D5DB'}
                    />
                  </View>
                  <Text
                    style={[
                      styles.timelineLabel,
                      index <= currentIndex && styles.timelineLabelActive
                    ]}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </View>
                {index < statusFlow.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      index < currentIndex && styles.timelineLineActive
                    ]}
                  />
                )}
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.updateStatusBtn}
            onPress={() => setShowStatusModal(true)}
          >
            <Icon name="create-outline" size={20} color="#4F46E5" />
            <Text style={styles.updateStatusText}>Update Status</Text>
          </TouchableOpacity>
        </View>

        {/* Shiprocket Actions */}
        {order.orderStatus !== 'cancelled' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Actions</Text>

            {!order.shiprocket?.shipmentId ? (
              <TouchableOpacity
                style={styles.actionCard}
                onPress={createShipment}
                disabled={isProcessing}
              >
                <Icon name="rocket-outline" size={24} color="#4F46E5" />
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Create Shipment</Text>
                  <Text style={styles.actionSubtitle}>
                    Generate AWB and schedule pickup
                  </Text>
                </View>
                <Icon name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ) : (
              <>
                {/* Shipment Info */}
                <View style={styles.shipmentInfo}>
                  <View style={styles.shipmentRow}>
                    <Text style={styles.shipmentLabel}>AWB Number</Text>
                    <Text style={styles.shipmentValue}>
                      {order.shiprocket.awb || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.shipmentRow}>
                    <Text style={styles.shipmentLabel}>Courier</Text>
                    <Text style={styles.shipmentValue}>
                      {order.shiprocket.courierName || 'N/A'}
                    </Text>
                  </View>
                  {order.shiprocket.pickupScheduledDate && (
                    <View style={styles.shipmentRow}>
                      <Text style={styles.shipmentLabel}>Pickup Date</Text>
                      <Text style={styles.shipmentValue}>
                        {new Date(order.shiprocket.pickupScheduledDate).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Actions Grid */}
                <View style={styles.actionsGrid}>
                  <TouchableOpacity
                    style={styles.gridAction}
                    onPress={generateLabel}
                    disabled={isProcessing}
                  >
                    <Icon name="document-text-outline" size={28} color="#4F46E5" />
                    <Text style={styles.gridActionText}>Generate Label</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.gridAction}
                    onPress={schedulePickup}
                    disabled={isProcessing}
                  >
                    <Icon name="calendar-outline" size={28} color="#10B981" />
                    <Text style={styles.gridActionText}>Schedule Pickup</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.gridAction}
                    onPress={trackShipment}
                    disabled={isProcessing}
                  >
                    <Icon name="navigate-outline" size={28} color="#F59E0B" />
                    <Text style={styles.gridActionText}>Track</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.gridAction, styles.gridActionDanger]}
                    onPress={cancelShipment}
                    disabled={isProcessing}
                  >
                    <Icon name="close-circle-outline" size={28} color="#EF4444" />
                    <Text style={[styles.gridActionText, { color: '#EF4444' }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{order.user?.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{order.user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{order.shippingAddress.phone}</Text>
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.addressBox}>
            <Icon name="location" size={20} color="#4F46E5" />
            <View style={styles.addressContent}>
              <Text style={styles.addressName}>{order.shippingAddress.name}</Text>
              <Text style={styles.addressText}>
                {order.shippingAddress.addressLine1}
              </Text>
              <Text style={styles.addressText}>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </Text>
              <Text style={styles.addressText}>
                Pincode: {order.shippingAddress.pincode}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <Text style={styles.itemName}>{item.product?.title}</Text>
              <View style={styles.itemDetails}>
                <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                <Text style={styles.itemPrice}>₹{item.finalPrice}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Price Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>₹{order.subtotal}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping</Text>
            <Text style={styles.priceValue}>
              {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax</Text>
            <Text style={styles.priceValue}>₹{order.tax}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{order.total}</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Status Update Modal */}
      <Modal
        visible={showStatusModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Order Status</Text>
              <TouchableOpacity onPress={() => setShowStatusModal(false)}>
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {statusFlow.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    order.orderStatus === status && styles.statusOptionActive
                  ]}
                  onPress={() => updateOrderStatus(status)}
                  disabled={isProcessing}
                >
                  <Icon
                    name={order.orderStatus === status ? 'radio-button-on' : 'radio-button-off'}
                    size={24}
                    color={order.orderStatus === status ? '#4F46E5' : '#D1D5DB'}
                  />
                  <Text style={[
                    styles.statusOptionText,
                    order.orderStatus === status && styles.statusOptionTextActive
                  ]}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Processing Overlay */}
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingBox}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: { fontSize: 16, color: '#6B7280', marginTop: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827', flex: 1, textAlign: 'center' },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 20
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16 },
  timeline: { marginBottom: 16 },
  timelineItem: { marginBottom: 12 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  timelineDotActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5'
  },
  timelineLabel: { fontSize: 14, color: '#6B7280' },
  timelineLabelActive: { color: '#4F46E5', fontWeight: '600' },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginLeft: 15,
    marginVertical: 4
  },
  timelineLineActive: { backgroundColor: '#4F46E5' },
  updateStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4F46E5'
  },
  updateStatusText: { fontSize: 15, fontWeight: '600', color: '#4F46E5' },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    gap: 12
  },
  actionContent: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  actionSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  shipmentInfo: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16
  },
  shipmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  shipmentLabel: { fontSize: 14, color: '#6B7280' },
  shipmentValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  gridAction: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  gridActionDanger: {
    borderColor: '#FEE2E2'
  },
  gridActionText: { fontSize: 13, fontWeight: '600', color: '#111827' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  infoLabel: { fontSize: 14, color: '#6B7280' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  addressBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 8
  },
  addressContent: { flex: 1 },
  addressName: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 4 },
  addressText: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  itemCard: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  itemName: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 8 },
  itemDetails: { flexDirection: 'row', justifyContent: 'space-between' },
  itemQty: { fontSize: 13, color: '#6B7280' },
  itemPrice: { fontSize: 14, fontWeight: '700', color: '#4F46E5' },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  priceLabel: { fontSize: 14, color: '#6B7280' },
  priceValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#111827' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#4F46E5' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  modalBody: { padding: 20 },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F9FAFB'
  },
  statusOptionActive: {
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: '#4F46E5'
  },
  statusOptionText: { fontSize: 15, color: '#6B7280' },
  statusOptionTextActive: { color: '#4F46E5', fontWeight: '600' },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  processingBox: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center'
  },
  processingText: {
    fontSize: 16,
    color: '#111827',
    marginTop: 12
  }
});

export default AdminOrderDetailsScreen;