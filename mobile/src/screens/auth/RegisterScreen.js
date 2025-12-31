// ============================================
// mobile/src/screens/auth/RegisterScreen.js
// ============================================
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../redux/slices/authSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../../styling/screens/auth/RegisterScreenPremiumStyles';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer'
  });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      Alert.alert('Registration Failed', error);
      dispatch(clearError());
    }
  }, [error]);

  const handleRegister = () => {
    const { name, email, password, confirmPassword, role } = formData;

    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    dispatch(register({ name, email, password, role }));
  };

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const roles = [
    { label: 'Shop as Customer', value: 'customer', icon: 'cart', color: '#0A84FF' },
    { label: 'Sell as Vendor', value: 'vendor', icon: 'storefront', color: '#5E5CE6' },
    { label: 'Earn as Reseller', value: 'reseller', icon: 'share-social', color: '#FF9500' },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles['register-premium-container']}
    >
      <ScrollView 
        contentContainerStyle={styles['register-premium-scroll']}
        showsVerticalScrollIndicator={false}
      >
        {/* Premium Header */}
        <View style={styles['register-premium-header']}>
          <Text style={styles['register-premium-title']}>Create Account</Text>
          <Text style={styles['register-premium-subtitle']}>Join our premium marketplace</Text>
        </View>

        {/* Premium Form Container */}
        <View style={styles['register-premium-form']}>
          {/* Full Name */}
          <View style={styles['register-premium-input-group']}>
            <Text style={styles['register-premium-input-label']}>Full Name</Text>
            <View style={styles['register-premium-input-container']}>
              <Icon 
                name="person-outline" 
                size={20} 
                color="#5E5CE6"
                style={styles['register-premium-input-icon']} 
              />
              <TextInput
                style={styles['register-premium-input-field']}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles['register-premium-input-group']}>
            <Text style={styles['register-premium-input-label']}>Email Address</Text>
            <View style={styles['register-premium-input-container']}>
              <Icon 
                name="mail-outline" 
                size={20} 
                color="#5E5CE6"
                style={styles['register-premium-input-icon']} 
              />
              <TextInput
                style={styles['register-premium-input-field']}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Phone (Optional) */}
          <View style={styles['register-premium-input-group']}>
            <Text style={styles['register-premium-input-label']}>
              Phone Number <Text style={styles['register-premium-optional']}>( Optional )</Text>
            </Text>
            <View style={styles['register-premium-input-container']}>
              <Icon 
                name="call-outline" 
                size={20} 
                color="#5E5CE6"
                style={styles['register-premium-input-icon']} 
              />
              <TextInput
                style={styles['register-premium-input-field']}
                placeholder="Enter your phone"
                placeholderTextColor="#9CA3AF"
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Role Selection - Premium Cards */}
          <View style={styles['register-premium-input-group']}>
            <Text style={styles['register-premium-input-label']}>I want to</Text>
            <View style={styles['register-premium-role-container']}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.value}
                  style={[
                    styles['register-premium-role-card'],
                    formData.role === role.value && styles['register-premium-role-card-active']
                  ]}
                  onPress={() => updateFormData('role', role.value)}
                >
                  <View style={[
                    styles['register-premium-role-icon-container'],
                    { backgroundColor: `${role.color}15` }
                  ]}>
                    <Icon name={role.icon} size={24} color={role.color} />
                  </View>
                  <Text style={[
                    styles['register-premium-role-text'],
                    formData.role === role.value && styles['register-premium-role-text-active']
                  ]}>
                    {role.label}
                  </Text>
                  {formData.role === role.value && (
                    <View style={styles['register-premium-role-check']}>
                      <Icon name="checkmark-circle" size={20} color={role.color} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Password */}
          <View style={styles['register-premium-input-group']}>
            <Text style={styles['register-premium-input-label']}>Password</Text>
            <View style={styles['register-premium-input-container']}>
              <Icon 
                name="lock-closed-outline" 
                size={20} 
                color="#5E5CE6"
                style={styles['register-premium-input-icon']} 
              />
              <TextInput
                style={styles['register-premium-input-field']}
                placeholder="Create a strong password"
                placeholderTextColor="#9CA3AF"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles['register-premium-eye-button']}
              >
                <Icon
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles['register-premium-input-group']}>
            <Text style={styles['register-premium-input-label']}>Confirm Password</Text>
            <View style={styles['register-premium-input-container']}>
              <Icon 
                name="lock-closed-outline" 
                size={20} 
                color="#5E5CE6"
                style={styles['register-premium-input-icon']} 
              />
              <TextInput
                style={styles['register-premium-input-field']}
                placeholder="Re-enter your password"
                placeholderTextColor="#9CA3AF"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Premium Register Button */}
          <TouchableOpacity
            style={[
              styles['register-premium-button'],
              isLoading && styles['register-premium-button-disabled']
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles['register-premium-button-text']}>Create Account</Text>
                <Icon name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles['register-premium-terms']}>
            By signing up, you agree to our{' '}
            <Text style={styles['register-premium-terms-link']}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles['register-premium-terms-link']}>Privacy Policy</Text>
          </Text>

          {/* Login Footer */}
          <View style={styles['register-premium-footer']}>
            <Text style={styles['register-premium-footer-text']}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles['register-premium-footer-link']}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;