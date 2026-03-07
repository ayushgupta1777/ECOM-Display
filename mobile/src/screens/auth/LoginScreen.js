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
  ScrollView,
  Image
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, requestOTP, verifyOTP, clearError } from '../../redux/slices/authSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styling/screens/auth/LoginScreenPremiumStyles';
import AdsngrowFooter from '../../components/AdsngrowFooter';

const LoginScreen = ({ navigation }) => {
  const [loginMode, setLoginMode] = useState('otp'); // 'otp' or 'password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(0);

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', error);
      dispatch(clearError());
    }
  }, [error]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    const result = await dispatch(requestOTP({ phone, type: 'login' }));
    if (requestOTP.fulfilled.match(result)) {
      setOtpSent(true);
      setTimer(60);
      Alert.alert('OTP Sent', 'An OTP has been sent to your phone number.');
    }
  };

  const handleLogin = () => {
    if (loginMode === 'password') {
      if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      dispatch(login({ email, password }));
    } else {
      if (!otp || otp.length !== 6) {
        Alert.alert('Error', 'Please enter a valid 6-digit OTP');
        return;
      }
      dispatch(login({ phone, otp }));
    }
  };

  const renderOTPFlow = () => (
    <View>
      {/* Phone Input */}
      <View style={styles['login-premium-input-group']}>
        <Text style={styles['login-premium-input-label']}>Phone Number</Text>
        <View style={styles['login-premium-input-container']}>
          <Icon name="call-outline" size={20} color="#5E5CE6" style={styles['login-premium-input-icon']} />
          <TextInput
            style={styles['login-premium-input-field']}
            placeholder="Enter your registered phone"
            placeholderTextColor="#9CA3AF"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!otpSent}
          />
          {otpSent && (
            <TouchableOpacity onPress={() => setOtpSent(false)} style={{ padding: 10 }}>
              <Text style={{ color: '#5E5CE6', fontSize: 12, fontWeight: '600' }}>Change</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* OTP Input */}
      {otpSent && (
        <View style={styles['login-premium-input-group']}>
          <View style={styles['login-premium-password-header']}>
            <Text style={styles['login-premium-input-label']}>Verification Code</Text>
            <TouchableOpacity disabled={timer > 0} onPress={handleSendOTP}>
              <Text style={[styles['login-premium-forgot-text'], timer > 0 && { color: '#9CA3AF' }]}>
                {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles['login-premium-input-container']}>
            <Icon name="shield-checkmark-outline" size={20} color="#5E5CE6" style={styles['login-premium-input-icon']} />
            <TextInput
              style={styles['login-premium-input-field']}
              placeholder="Enter 6-digit OTP"
              placeholderTextColor="#9CA3AF"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
        </View>
      )}

      {/* Action Button */}
      {!otpSent ? (
        <TouchableOpacity
          style={styles['login-premium-button']}
          onPress={handleSendOTP}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#fff" size="small" /> : (
            <>
              <Text style={styles['login-premium-button-text']}>Request OTP</Text>
              <Icon name="flash-outline" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles['login-premium-button']]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#fff" size="small" /> : (
            <>
              <Text style={styles['login-premium-button-text']}>Verify & Sign In</Text>
              <Icon name="checkmark-circle-outline" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  const renderPasswordFlow = () => (
    <View>
      <View style={styles['login-premium-input-group']}>
        <Text style={styles['login-premium-input-label']}>Email Address</Text>
        <View style={styles['login-premium-input-container']}>
          <Icon name="mail-outline" size={20} color="#5E5CE6" style={styles['login-premium-input-icon']} />
          <TextInput
            style={styles['login-premium-input-field']}
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      <View style={styles['login-premium-input-group']}>
        <View style={styles['login-premium-password-header']}>
          <Text style={styles['login-premium-input-label']}>Password</Text>
          <TouchableOpacity>
            <Text style={styles['login-premium-forgot-text']}>Forgot?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles['login-premium-input-container']}>
          <Icon name="lock-closed-outline" size={20} color="#5E5CE6" style={styles['login-premium-input-icon']} />
          <TextInput
            style={styles['login-premium-input-field']}
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles['login-premium-eye-button']}>
            <Icon name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles['login-premium-button'], isLoading && styles['login-premium-button-disabled']]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color="#fff" size="small" /> : (
          <>
            <Text style={styles['login-premium-button-text']}>Sign In</Text>
            <Icon name="arrow-forward" size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles['login-premium-container']}
    >
      <ScrollView contentContainerStyle={styles['login-premium-scroll']} showsVerticalScrollIndicator={false}>
        <View style={styles['login-premium-header']}>
          <View style={styles['login-premium-logo-container']}>
            <View style={styles['login-premium-logo-wrapper']}>
              <Image source={require('../../assets/Logo_NRF.png')} style={styles['login-premium-logo-image']} resizeMode="contain" />
            </View>
          </View>
          <View style={styles['login-premium-brand-container']}>
            <Text style={styles['login-premium-brand-name']}>New Raj Fancy</Text>
          </View>
          <Text style={styles['login-premium-title']}>Welcome Back</Text>
          <Text style={styles['login-premium-subtitle']}>Choose your preferred login method</Text>
        </View>

        <View style={styles['login-premium-form']}>
          {/* Toggle Login Method */}
          <View style={{ flexDirection: 'row', marginBottom: 25, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4 }}>
            <TouchableOpacity
              onPress={() => { setLoginMode('otp'); setOtpSent(false); }}
              style={[{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 }, loginMode === 'otp' && { backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }]}
            >
              <Text style={[{ fontSize: 14, fontWeight: '600', color: '#6B7280' }, loginMode === 'otp' && { color: '#5E5CE6' }]}>Phone OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLoginMode('password')}
              style={[{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 }, loginMode === 'password' && { backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }]}
            >
              <Text style={[{ fontSize: 14, fontWeight: '600', color: '#6B7280' }, loginMode === 'password' && { color: '#5E5CE6' }]}>Email Login</Text>
            </TouchableOpacity>
          </View>

          {loginMode === 'otp' ? renderOTPFlow() : renderPasswordFlow()}

          <View style={styles['login-premium-footer']}>
            <Text style={styles['login-premium-footer-text']}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles['login-premium-footer-link']}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <AdsngrowFooter marginTop={30} paddingBottom={20} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
