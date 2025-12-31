// ============================================
// mobile/src/screens/auth/LoginScreen.js
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
import { login, clearError } from '../../redux/slices/authSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styling/screens/auth/LoginScreenPremiumStyles';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', error);
      dispatch(clearError());
    }
  }, [error]);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    dispatch(login({ email, password }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles['login-premium-container']}
    >
      <ScrollView 
        contentContainerStyle={styles['login-premium-scroll']}
        showsVerticalScrollIndicator={false}
      >
        {/* Premium Header with Gradient Background */}
        <View style={styles['login-premium-header']}>
          <View style={styles['login-premium-logo-container']}>
            <View style={styles['login-premium-logo-circle']}>
              <Icon name="storefront" size={48} color="#0A84FF" />
            </View>
          </View>
          <Text style={styles['login-premium-title']}>Welcome Back</Text>
          <Text style={styles['login-premium-subtitle']}>Sign in to continue shopping</Text>
        </View>

        {/* Premium Form Container */}
        <View style={styles['login-premium-form']}>
          {/* Email Input */}
          <View style={styles['login-premium-input-group']}>
            <Text style={styles['login-premium-input-label']}>Email Address</Text>
            <View style={styles['login-premium-input-container']}>
              <Icon 
                name="mail-outline" 
                size={20} 
                color="#5E5CE6" 
                style={styles['login-premium-input-icon']} 
              />
              <TextInput
                style={styles['login-premium-input-field']}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles['login-premium-input-group']}>
            <View style={styles['login-premium-password-header']}>
              <Text style={styles['login-premium-input-label']}>Password</Text>
              <TouchableOpacity>
                <Text style={styles['login-premium-forgot-text']}>Forgot?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles['login-premium-input-container']}>
              <Icon 
                name="lock-closed-outline" 
                size={20} 
                color="#5E5CE6"
                style={styles['login-premium-input-icon']} 
              />
              <TextInput
                style={styles['login-premium-input-field']}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles['login-premium-eye-button']}
              >
                <Icon
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Premium Login Button */}
          <TouchableOpacity
            style={[
              styles['login-premium-button'],
              isLoading && styles['login-premium-button-disabled']
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles['login-premium-button-text']}>Sign In</Text>
                <Icon name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles['login-premium-divider']}>
            <View style={styles['login-premium-divider-line']} />
            <Text style={styles['login-premium-divider-text']}>or continue with</Text>
            <View style={styles['login-premium-divider-line']} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles['login-premium-social-container']}>
            <TouchableOpacity style={styles['login-premium-social-button']}>
              <Icon name="logo-google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles['login-premium-social-button']}>
              <Icon name="logo-apple" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles['login-premium-social-button']}>
              <Icon name="logo-facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
          </View>

          {/* Sign Up Footer */}
          <View style={styles['login-premium-footer']}>
            <Text style={styles['login-premium-footer-text']}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles['login-premium-footer-link']}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;