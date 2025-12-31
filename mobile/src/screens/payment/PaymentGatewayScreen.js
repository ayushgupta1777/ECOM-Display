import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, BackHandler, ScrollView
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../../services/api';

const PaymentGatewayScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [debugInfo, setDebugInfo] = useState([]);
  const paymentStarted = useRef(false);
  const paymentCompleted = useRef(false);

  const addDebugLog = (message, data = null) => {
    const log = `[${new Date().toLocaleTimeString()}] ${message}`;
    console.log(log, data || '');
    setDebugInfo(prev => [...prev, { message, data, time: new Date().toLocaleTimeString() }]);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isProcessing) {
        Alert.alert(
          'Payment in Progress',
          'Please complete or cancel the payment first.',
          [{ text: 'OK' }]
        );
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isProcessing]);

  const initiatePayment = async () => {
    if (paymentStarted.current || paymentCompleted.current) {
      addDebugLog('Payment already started or completed');
      return;
    }

    paymentStarted.current = true;
    setIsProcessing(true);
    setPaymentError(null);

    try {
      addDebugLog('Creating Razorpay order');

      const response = await api.post('/payments/create-order', {
        orderId: order._id
      });

      const { razorpayOrderId, amount, keyId } = response.data.data;

      addDebugLog('Razorpay order created', { razorpayOrderId, amount });

      const options = {
        key: keyId,
        amount: amount,
        currency: 'INR',
        order_id: razorpayOrderId,
        name: 'ERA Store',
        description: `Order #${order.orderNo}`,

        prefill: {
          email: order.user?.email || '',
          contact: order.shippingAddress?.phone || '',
          name: order.shippingAddress?.name || ''
        },

        theme: {
          color: '#4F46E5'
        },

        modal: {
          ondismiss: () => {
            addDebugLog('Modal dismissed by user');
            if (!paymentCompleted.current) {
              handlePaymentCancel();
            }
          },
          escape: true,
          backdropclose: false
        },

        notes: {
          order_id: order._id,
          order_no: order.orderNo
        }
      };

      addDebugLog('Opening Razorpay with options', {
        keyId,
        amount,
        orderId: razorpayOrderId
      });

      RazorpayCheckout.open(options)
        .then((data) => {
          addDebugLog('Payment success callback', data);
          handlePaymentSuccess(data);
        })
        .catch((error) => {
          addDebugLog('Payment error callback', {
            code: error.code,
            description: error.description,
            source: error.source,
            step: error.step,
            reason: error.reason,
            metadata: error.metadata,
            fullError: JSON.stringify(error)
          });
          handlePaymentError(error);
        });

    } catch (error) {
      addDebugLog('Payment initialization error', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      paymentStarted.current = false;
      setIsProcessing(false);
      
      const errorMessage = error.response?.data?.message || 'Failed to initialize payment';
      setPaymentError(errorMessage);
      
      Alert.alert(
        'Payment Initialization Failed',
        `${errorMessage}\n\nPlease check:\n• Internet connection\n• Server is running\n• Razorpay credentials are valid`,
        [
          {
            text: 'Show Debug Info',
            onPress: () => showDebugInfo()
          },
          {
            text: 'Try Again',
            onPress: () => {
              paymentStarted.current = false;
              setDebugInfo([]);
              initiatePayment();
            }
          },
          {
            text: 'Use COD Instead',
            onPress: () => navigation.goBack(),
            style: 'cancel'
          }
        ]
      );
    }
  };

  const handlePaymentSuccess = async (data) => {
    if (paymentCompleted.current) return;
    paymentCompleted.current = true;

    try {
      setIsProcessing(true);
      addDebugLog('Verifying payment', data);

      const response = await api.post('/payments/verify', {
        razorpay_order_id: data.razorpay_order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
        orderId: order._id
      });

      addDebugLog('Payment verified successfully');
      
      // Wait for state to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsProcessing(false);

      navigation.replace('OrderSuccess', {
        order: response.data.data.order
      });

    } catch (error) {
      addDebugLog('Payment verification failed', {
        message: error.message,
        response: error.response?.data
      });

      setIsProcessing(false);
      paymentCompleted.current = false;

      Alert.alert(
        'Verification Failed',
        `Payment ID: ${data.razorpay_payment_id}\n\nYour payment was successful but verification failed. Please contact support with the above payment ID.`,
        [
          {
            text: 'Copy Payment ID',
            onPress: () => {
              Alert.alert('Payment ID', data.razorpay_payment_id);
            }
          },
          {
            text: 'Go to Orders',
            onPress: () => navigation.navigate('Orders')
          }
        ]
      );
    }
  };

  const handlePaymentError = async (error) => {
    if (paymentCompleted.current) return;

    paymentStarted.current = false;
    setIsProcessing(false);

    let errorTitle = 'Payment Failed';
    let errorMessage = error?.description || error?.reason || 'Payment could not be completed';
    let actions = [];

    if (error.code === 0 || error.code === 2) {
      errorTitle = 'Payment Cancelled';
      errorMessage = 'You cancelled the payment.';
      actions = [
        {
          text: 'Try Again',
          onPress: () => {
            paymentStarted.current = false;
            initiatePayment();
          }
        },
        {
          text: 'Go Back',
          style: 'cancel',
          onPress: () => navigation.goBack()
        }
      ];
    } else if (error.code === 1) {
      errorTitle = 'Network Error';
      errorMessage = 'Please check your internet connection and try again.';
      actions = [
        {
          text: 'Retry',
          onPress: () => {
            paymentStarted.current = false;
            initiatePayment();
          }
        }
      ];
    } else {
      errorMessage = `${errorMessage}\n\nError Code: ${error.code || 'Unknown'}`;
      actions = [
        {
          text: 'Show Debug Info',
          onPress: () => showDebugInfo()
        },
        {
          text: 'Try Again',
          onPress: () => {
            paymentStarted.current = false;
            initiatePayment();
          }
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => navigation.goBack()
        }
      ];
    }

    try {
      await api.post('/payments/failure', {
        orderId: order._id,
        error: JSON.stringify({
          code: error.code,
          description: error.description,
          reason: error.reason
        })
      });
    } catch (err) {
      addDebugLog('Failed to log payment failure', err);
    }

    Alert.alert(errorTitle, errorMessage, actions);
  };

  const handlePaymentCancel = () => {
    if (paymentCompleted.current) return;

    Alert.alert(
      'Payment Cancelled',
      'You closed the payment window. Would you like to try again?',
      [
        {
          text: 'Try Again',
          onPress: () => {
            paymentStarted.current = false;
            initiatePayment();
          }
        },
        {
          text: 'Go Back',
          style: 'cancel',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const showDebugInfo = () => {
    const debugText = debugInfo.map(log => 
      `[${log.time}] ${log.message}\n${log.data ? JSON.stringify(log.data, null, 2) : ''}`
    ).join('\n\n');

    Alert.alert(
      'Debug Information',
      debugText.substring(0, 500) + '...\n\n(Check console for full logs)',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {isProcessing && !paymentError && (
          <>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.title}>
              {paymentCompleted.current ? 'Verifying Payment...' : 'Ready to Pay'}
            </Text>
            <Text style={styles.subtitle}>
              {paymentCompleted.current 
                ? 'Please wait while we verify your payment'
                : 'Click the button below to proceed with payment'}
            </Text>
          </>
        )}

        {paymentError && (
          <>
            <Icon name="alert-circle" size={64} color="#EF4444" />
            <Text style={styles.errorTitle}>Payment Error</Text>
            <Text style={styles.errorText}>{paymentError}</Text>
          </>
        )}

        <View style={styles.orderInfo}>
          <Text style={styles.label}>Order Number</Text>
          <Text style={styles.value}>{order.orderNo}</Text>
        </View>

        <View style={styles.orderInfo}>
          <Text style={styles.label}>Amount to Pay</Text>
          <Text style={styles.amount}>₹{order.total}</Text>
        </View>

        <View style={styles.secureNote}>
          <Icon name="shield-checkmark" size={20} color="#10B981" />
          <Text style={styles.secureText}>
            Secure payment powered by Razorpay
          </Text>
        </View>

        <View style={styles.testModeNote}>
          <Icon name="information-circle" size={20} color="#F59E0B" />
          <Text style={styles.testModeText}>
            Test Mode: Use Razorpay test cards
          </Text>
        </View>

        {__DEV__ && (
          <TouchableOpacity
            style={styles.debugBtn}
            onPress={showDebugInfo}
          >
            <Text style={styles.debugText}>Show Debug Info ({debugInfo.length})</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* PAY NOW BUTTON */}
      <TouchableOpacity
        style={[
          styles.payBtn,
          (isProcessing || paymentStarted.current) && styles.payBtnDisabled
        ]}
        onPress={initiatePayment}
        disabled={isProcessing || paymentStarted.current}
        activeOpacity={0.8}
      >
        {isProcessing && paymentCompleted.current ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Icon name="card" size={20} color="#fff" />
            <Text style={styles.payBtnText}>PAY ₹{order.total} NOW</Text>
          </>
        )}
      </TouchableOpacity>

      {!paymentCompleted.current && (
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => {
            Alert.alert(
              'Cancel Payment?',
              'Are you sure you want to cancel the payment?',
              [
                { text: 'No', style: 'cancel' },
                {
                  text: 'Yes',
                  onPress: () => navigation.goBack(),
                  style: 'destructive'
                }
              ]
            );
          }}
          disabled={isProcessing && paymentCompleted.current}
        >
          <Text style={styles.cancelText}>Cancel Payment</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EF4444',
    marginTop: 20,
    marginBottom: 8
  },
  errorText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500'
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827'
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F46E5'
  },
  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#F0FDF4',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  secureText: {
    fontSize: 13,
    color: '#059669',
    marginLeft: 8,
    fontWeight: '500'
  },
  testModeNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#FEF3C7',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  testModeText: {
    fontSize: 13,
    color: '#D97706',
    marginLeft: 8,
    fontWeight: '500'
  },
  debugBtn: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8
  },
  debugText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500'
  },
  payBtn: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  payBtnDisabled: {
    opacity: 0.6
  },
  payBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700'
  },
  cancelBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280'
  }
});

export default PaymentGatewayScreen;