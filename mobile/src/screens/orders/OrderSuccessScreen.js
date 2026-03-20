import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { 
  FadeInUp, 
  FadeInDown, 
  ScaleInCenter,
  BounceIn
} from 'react-native-reanimated';
import { styles } from '../../styling/screens/orders/OrderSuccessScreenPremiumStyles';

const OrderSuccessScreen = ({ route, navigation }) => {
  const { order } = route.params;

  return (
    <View style={styles['order-success-premium-screen']}>
      <StatusBar barStyle="light-content" transparent backgroundColor="transparent" />
      <LinearGradient
        colors={['#4F46E5', '#7C3AED', '#C026D3']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ alignItems: 'center', width: '100%' }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            entering={ScaleInCenter.delay(200).duration(600)}
            style={styles['order-success-premium-animation']}
          >
            <View style={styles['order-success-premium-circle']}>
              <Animated.View 
                entering={BounceIn.delay(500).duration(800)}
                style={styles['order-success-premium-circle-inner']}
              >
                <Icon name="checkmark" size={60} color="#4F46E5" />
              </Animated.View>
            </View>
          </Animated.View>

          <Animated.Text 
            entering={FadeInDown.delay(400).duration(600)}
            style={styles['order-success-premium-title']}
          >
            Order Placed Successfully!
          </Animated.Text>
          
          <Animated.Text 
            entering={FadeInDown.delay(500).duration(600)}
            style={styles['order-success-premium-subtitle']}
          >
            Thank you for your order
          </Animated.Text>

          <Animated.View 
            entering={FadeInUp.delay(600).duration(700)}
            style={styles['order-success-premium-details-card']}
          >
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
                  name={order.paymentMethod === 'cod' ? 'cash' : 'card'} 
                  size={16} 
                  color="#FFFFFF" 
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
          </Animated.View>

          <Animated.View 
            entering={FadeInUp.delay(750).duration(700)}
            style={styles['order-success-premium-delivery-info']}
          >
            <View style={styles['order-success-premium-delivery-icon-wrapper']}>
              <Icon name="location" size={24} color="#FFFFFF" />
            </View>
            <View style={styles['order-success-premium-delivery-info-text']}>
              <Text style={styles['order-success-premium-delivery-info-title']}>
                Delivering to
              </Text>
              <Text style={styles['order-success-premium-delivery-info-address']}>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </Text>
            </View>
          </Animated.View>

          <Animated.View 
            entering={FadeInUp.delay(900).duration(700)}
            style={styles['order-success-premium-action-buttons']}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles['order-success-premium-btn-track-order']}
              onPress={() => navigation.navigate('Orders', {
                screen: 'OrderDetails',
                params: { orderId: order._id }
              })}
            >
              <Icon name="navigate-circle" size={24} color="#4F46E5" />
              <Text style={styles['order-success-premium-btn-track-order-text']}>
                Track Order
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
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
          </Animated.View>

          <Animated.View 
            entering={FadeInUp.delay(1100).duration(600)}
            style={styles['order-success-premium-help-section']}
          >
            <Icon name="chatbubble-ellipses-outline" size={20} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles['order-success-premium-help-text']}>
              Need help? Contact support
            </Text>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default OrderSuccessScreen;