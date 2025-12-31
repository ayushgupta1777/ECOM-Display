// ============================================
// MOBILE APP - ORDER TRACKING & RETURNS
// ============================================

// 1. ORDER TRACKING SCREEN
// screens/orders/OrderTrackingScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../../services/api';

const OrderTrackingScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTracking();
    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchTracking, 120000);
    return () => clearInterval(interval);
  }, []);

  const fetchTracking = async () => {
    try {
      const response = await api.get(`/orders/${orderId}/tracking`);
      setOrder(response.data.data.order);
      setTracking(response.data.data.shiprocketTracking);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch tracking:', error);
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const statusMap = {
      pending: 'time-outline',
      confirmed: 'checkmark-circle-outline',
      processing: 'build-outline',
      packed: 'cube-outline',
      shipped: 'airplane-outline',
      delivered: 'checkmark-done-circle',
      cancelled: 'close-circle-outline'
    };
    return statusMap[status] || 'ellipsis-horizontal-circle-outline';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: '#F59E0B',
      confirmed: '#3B82F6',
      processing: '#8B5CF6',
      packed: '#10B981',
      shipped: '#0EA5E9',
      delivered: '#059669',
      cancelled: '#EF4444'
    };
    return colorMap[status] || '#6B7280';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading tracking info...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderNo}>Order #{order.orderNo}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
            <Icon name={getStatusIcon(order.status)} size={16} color={getStatusColor(order.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
          </View>
        </View>

        {order.trackingNumber && (
          <View style={styles.trackingInfo}>
            <Icon name="qr-code-outline" size={20} color="#6B7280" />
            <View style={styles.trackingDetails}>
              <Text style={styles.trackingLabel}>Tracking Number</Text>
              <Text style={styles.trackingNumber}>{order.trackingNumber}</Text>
            </View>
          </View>
        )}

        {order.courierName && (
          <View style={styles.courierInfo}>
            <Icon name="business-outline" size={20} color="#6B7280" />
            <Text style={styles.courierName}>{order.courierName}</Text>
          </View>
        )}
      </View>

      {/* Timeline */}
      <View style={styles.timelineCard}>
        <Text style={styles.sectionTitle}>Tracking Timeline</Text>
        
        {order.trackingEvents && order.trackingEvents.length > 0 ? (
          <View style={styles.timeline}>
            {order.trackingEvents.map((event, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={[styles.timelineDot, index === 0 && styles.timelineDotActive]} />
                  {index !== order.trackingEvents.length - 1 && <View style={styles.timelineLine} />}
                </View>
                
                <View style={styles.timelineContent}>
                  <Text style={styles.eventStatus}>{event.status}</Text>
                  <Text style={styles.eventDescription}>{event.description}</Text>
                  {event.location && (
                    <Text style={styles.eventLocation}>📍 {event.location}</Text>
                  )}
                  <Text style={styles.eventTime}>
                    {new Date(event.timestamp).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noTracking}>
            <Icon name="information-circle-outline" size={48} color="#9CA3AF" />
            <Text style={styles.noTrackingText}>Tracking information will appear once the order is shipped</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionsCard}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={fetchTracking}
        >
          <Icon name="refresh" size={20} color="#4F46E5" />
          <Text style={styles.actionButtonText}>Refresh Status</Text>
        </TouchableOpacity>

        {order.trackingNumber && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              // Open courier tracking website
              const trackingUrl = `https://shiprocket.co/tracking/${order.trackingNumber}`;
              Linking.openURL(trackingUrl);
            }}
          >
            <Icon name="open-outline" size={20} color="#4F46E5" />
            <Text style={styles.actionButtonText}>Track on Website</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Delivery Information */}
      {order.status === 'delivered' && (
        <View style={styles.deliveryCard}>
          <Icon name="checkmark-circle" size={48} color="#10B981" />
          <Text style={styles.deliveryTitle}>Delivered Successfully!</Text>
          <Text style={styles.deliveryDate}>
            Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
          </Text>
          
          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => navigation.navigate('InitiateReturn', { order })}
          >
            <Icon name="arrow-back-circle-outline" size={20} color="#EF4444" />
            <Text style={styles.returnButtonText}>Request Return</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',  
  },
  header: {
    padding: 16,                
  },
    loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    },
    headerCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    },
    orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    },
  orderNo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
    statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
    statusText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    },
    trackingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    },
    trackingDetails: {
    marginLeft: 8,
    },
    trackingLabel: {        
    fontSize: 12,
    color: '#6B7280',
    },    
    trackingValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',       
    },
    trackingNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    },
    courierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    }   
    ,
    courierName: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    },    
    timelineContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    },
    timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    },
    timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    },
    timelineItems: {
    marginTop: 8,
    },
    timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    },
    timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
    marginRight: 8,
    },
    timelineDate: {
    fontSize: 14,
    color: '#6B7280',
    },
    timelineStatus: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    }
  });
  
  export default OrderTrackingScreen;   