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
  Linking,
  Animated,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import api from '../../services/api';

const { width } = Dimensions.get('window');

const OrderTrackingScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchTracking();
    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchTracking, 120000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

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

  const getStatusSteps = () => {
    return ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered'];
  };

  const currentStatusIndex = order ? getStatusSteps().indexOf(order.status) : -1;
  const progressWidth = currentStatusIndex >= 0 ? ((currentStatusIndex + 1) / getStatusSteps().length) * 100 : 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading tracking info...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header Card with Gradient */}
        <LinearGradient
          colors={['#4F46E5', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderNo}>Order #{order.orderNo}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Icon name={getStatusIcon(order.status)} size={16} color="#FFFFFF" />
                <Text style={[styles.statusText, { color: '#FFFFFF' }]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progressWidth}%`,
                      backgroundColor: getStatusColor(order.status)
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(progressWidth)}% Complete
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Tracking Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Tracking Details</Text>

          {order.trackingNumber && (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Icon name="qr-code-outline" size={24} color="#4F46E5" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Tracking Number</Text>
                <Text style={styles.detailValue}>{order.trackingNumber}</Text>
              </View>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => {/* Copy to clipboard */}}
              >
                <Icon name="copy-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}

          {order.courierName && (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Icon name="business-outline" size={24} color="#4F46E5" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Courier Partner</Text>
                <Text style={styles.detailValue}>{order.courierName}</Text>
              </View>
            </View>
          )}

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Icon name="location-outline" size={24} color="#4F46E5" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Delivery Address</Text>
              <Text style={styles.detailValue}>
                {order.shippingAddress?.street}, {order.shippingAddress?.city}
              </Text>
            </View>
          </View>
        </View>

        {/* Enhanced Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>Order Timeline</Text>

          {order.trackingEvents && order.trackingEvents.length > 0 ? (
            <View style={styles.timeline}>
              {order.trackingEvents.map((event, index) => (
                <View key={index} style={styles.timelineEvent}>
                  <View style={styles.timelineLeft}>
                    <View style={[
                      styles.timelineDot,
                      index === 0 && styles.timelineDotActive
                    ]}>
                      <Icon
                        name={index === 0 ? 'radio-button-on' : 'radio-button-off'}
                        size={16}
                        color={index === 0 ? '#4F46E5' : '#D1D5DB'}
                      />
                    </View>
                    {index !== order.trackingEvents.length - 1 && (
                      <View style={styles.timelineConnector} />
                    )}
                  </View>

                  <View style={styles.timelineRight}>
                    <View style={styles.eventHeader}>
                      <Text style={styles.eventStatus}>{event.status}</Text>
                      <Text style={styles.eventTime}>
                        {new Date(event.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>
                    <Text style={styles.eventDescription}>{event.description}</Text>
                    {event.location && (
                      <View style={styles.eventLocation}>
                        <Icon name="location-outline" size={14} color="#6B7280" />
                        <Text style={styles.eventLocationText}>{event.location}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noTracking}>
              <View style={styles.noTrackingIcon}>
                <Icon name="information-circle-outline" size={48} color="#9CA3AF" />
              </View>
              <Text style={styles.noTrackingTitle}>No Tracking Updates Yet</Text>
              <Text style={styles.noTrackingText}>
                Tracking information will appear once your order is shipped
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={fetchTracking}
          >
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButtonGradient}
            >
              <Icon name="refresh" size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Refresh Status</Text>
            </LinearGradient>
          </TouchableOpacity>

          {order.trackingNumber && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                const trackingUrl = `https://shiprocket.co/tracking/${order.trackingNumber}`;
                Linking.openURL(trackingUrl);
              }}
            >
              <Icon name="open-outline" size={20} color="#4F46E5" />
              <Text style={styles.secondaryButtonText}>Track on Website</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => navigation.navigate('OrderDetails', { orderId })}
          >
            <Icon name="document-text-outline" size={20} color="#6B7280" />
            <Text style={styles.outlineButtonText}>View Order Details</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Success Card */}
        {order.status === 'delivered' && (
          <View style={styles.deliveryCard}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.deliveryGradient}
            >
              <View style={styles.deliveryContent}>
                <Icon name="checkmark-circle" size={48} color="#FFFFFF" />
                <Text style={styles.deliveryTitle}>Delivered Successfully!</Text>
                <Text style={styles.deliveryDate}>
                  Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>

                <TouchableOpacity
                  style={styles.returnButton}
                  onPress={() => navigation.navigate('InitiateReturn', { order })}
                >
                  <Icon name="arrow-back-circle-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.returnButtonText}>Request Return</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  headerGradient: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  headerContent: {
    alignItems: 'center',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 20,
  },
  orderNo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
  },
  copyButton: {
    padding: 8,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  timeline: {
    marginTop: 8,
  },
  timelineEvent: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotActive: {
    backgroundColor: '#4F46E5',
  },
  timelineConnector: {
    width: 2,
    height: 40,
    backgroundColor: '#E2E8F0',
    marginTop: 8,
  },
  timelineRight: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  eventTime: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  eventDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 8,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocationText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  noTracking: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noTrackingIcon: {
    marginBottom: 16,
  },
  noTrackingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  noTrackingText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },
  outlineButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deliveryCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  deliveryGradient: {
    padding: 24,
  },
  deliveryContent: {
    alignItems: 'center',
  },
  deliveryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  deliveryDate: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
    textAlign: 'center',
  },
  returnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  returnButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default OrderTrackingScreen;