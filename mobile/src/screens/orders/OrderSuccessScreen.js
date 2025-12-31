// ============================================
// mobile/src/screens/orders/OrderSuccessScreen.js
// ============================================
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styling/screens/orders/OrderSuccessScreenPremiumStyles';

const OrderSuccessScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  return (
    <View style={styles['order-success-premium-screen']}>
      <Animated.View
        style={[
          styles['order-success-premium-animation'],
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles['order-success-premium-circle']}>
          <View style={styles['order-success-premium-circle-inner']}>
            <Icon name="checkmark" size={60} color="#FFFFFF" />
          </View>
        </View>
      </Animated.View>

      <Text style={styles['order-success-premium-title']}>
        Order Placed Successfully!
      </Text>
      <Text style={styles['order-success-premium-subtitle']}>
        Thank you for your order
      </Text>

      <View style={styles['order-success-premium-details-card']}>
        <View style={styles['order-success-premium-detail-row']}>
          <Text style={styles['order-success-premium-detail-label']}>Order Number</Text>
          <Text style={styles['order-success-premium-detail-value']}>#{order.orderNo}</Text>
        </View>

        <View style={styles['order-success-premium-divider']} />

        <View style={styles['order-success-premium-detail-row']}>
          <Text style={styles['order-success-premium-detail-label']}>Total Amount</Text>
          <Text style={styles['order-success-premium-detail-value-highlight']}>₹{order.total}</Text>
        </View>

        <View style={styles['order-success-premium-divider']} />

        <View style={styles['order-success-premium-detail-row']}>
          <Text style={styles['order-success-premium-detail-label']}>Payment Method</Text>
          <View style={styles['order-success-premium-payment-badge']}>
            <Icon 
              name={order.paymentMethod === 'cod' ? 'cash-outline' : 'card-outline'} 
              size={14} 
              color="#5E5CE6" 
            />
            <Text style={styles['order-success-premium-detail-value']}>
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
            </Text>
          </View>
        </View>

        <View style={styles['order-success-premium-divider']} />

        <View style={styles['order-success-premium-detail-row']}>
          <Text style={styles['order-success-premium-detail-label']}>Estimated Delivery</Text>
          <Text style={styles['order-success-premium-detail-value']}>5-7 Business Days</Text>
        </View>
      </View>

      <View style={styles['order-success-premium-delivery-info']}>
        <View style={styles['order-success-premium-delivery-icon-wrapper']}>
          <Icon name="location" size={20} color="#0A84FF" />
        </View>
        <View style={styles['order-success-premium-delivery-info-text']}>
          <Text style={styles['order-success-premium-delivery-info-title']}>
            Delivering to
          </Text>
          <Text style={styles['order-success-premium-delivery-info-address']}>
            {order.shippingAddress.city}, {order.shippingAddress.state}
          </Text>
        </View>
      </View>

      <View style={styles['order-success-premium-action-buttons']}>
        <TouchableOpacity
          style={styles['order-success-premium-btn-track-order']}
          onPress={() => navigation.navigate('Orders', {
            screen: 'OrderDetails',
            params: { orderId: order._id }
          })}
        >
          <Icon name="navigate" size={20} color="#fff" />
          <Text style={styles['order-success-premium-btn-track-order-text']}>
            Track Order
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles['order-success-premium-btn-continue-shopping']}
          onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }]
          })}
        >
          <Text style={styles['order-success-premium-btn-continue-shopping-text']}>
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles['order-success-premium-help-section']}>
        <Icon name="help-circle-outline" size={20} color="#0A84FF" />
        <Text style={styles['order-success-premium-help-text']}>
          Need help? Contact our support team
        </Text>
      </View>
    </View>
  );
};

export default OrderSuccessScreen;