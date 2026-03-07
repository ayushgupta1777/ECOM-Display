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
  ScrollView,
  BackHandler
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { register, requestOTP, verifyOTP, clearError } from '../../redux/slices/authSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styling/screens/auth/RegisterScreenPremiumStyles';

const RegisterScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Profile
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(0);

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error);
      dispatch(clearError());
    }
  }, [error]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const backAction = () => {
      if (step > 1 && step < 3) {
        setStep(step - 1);
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [step]);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    const result = await dispatch(requestOTP({ phone, type: 'signup' }));
    if (requestOTP.fulfilled.match(result)) {
      setStep(2);
      setTimer(60);
      Alert.alert('OTP Sent', 'Please verify your phone number to continue.');
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Invalid OTP');
      return;
    }
    const result = await dispatch(verifyOTP({ phone, otp }));
    if (verifyOTP.fulfilled.match(result)) {
      if (result.payload.isNewUser) {
        setStep(3);
      } else {
        Alert.alert('Account Exists', 'This phone number is already registered. Please log in.', [
          { text: 'Login', onPress: () => navigation.navigate('Login') }
        ]);
      }
    }
  };

  const handleRegister = () => {
    const { name, email, password, confirmPassword, role } = formData;

    if (!name || !password) {
      Alert.alert('Error', 'Name and Password are required');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    dispatch(register({ name, email, password, phone, role }));
  };

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const renderStepIndicator = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 30, gap: 10 }}>
      {[1, 2, 3].map((s) => (
        <View key={s} style={[{ width: 30, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB' }, step >= s && { backgroundColor: '#5E5CE6' }]} />
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles['register-premium-container']}>
      <ScrollView contentContainerStyle={styles['register-premium-scroll']} showsVerticalScrollIndicator={false}>
        <View style={styles['register-premium-header']}>
          <Text style={styles['register-premium-title']}>Join Us</Text>
          <Text style={styles['register-premium-subtitle']}>Step {step} of 3: {step === 1 ? 'Phone Verification' : step === 2 ? 'Enter OTP' : 'Complete Profile'}</Text>
        </View>

        <View style={styles['register-premium-form']}>
          {renderStepIndicator()}

          {step === 1 && (
            <View>
              <View style={styles['register-premium-input-group']}>
                <Text style={styles['register-premium-input-label']}>Phone Number</Text>
                <View style={styles['register-premium-input-container']}>
                  <Icon name="call-outline" size={20} color="#5E5CE6" style={styles['register-premium-input-icon']} />
                  <TextInput
                    style={styles['register-premium-input-field']}
                    placeholder="Enter mobile number"
                    placeholderTextColor="#9CA3AF"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
              <TouchableOpacity style={styles['register-premium-button']} onPress={handleSendOTP} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : (
                  <>
                    <Text style={styles['register-premium-button-text']}>Continue</Text>
                    <Icon name="arrow-forward" size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View>
              <View style={styles['register-premium-input-group']}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles['register-premium-input-label']}>Enter OTP</Text>
                  <TouchableOpacity disabled={timer > 0} onPress={handleSendOTP}>
                    <Text style={{ color: timer > 0 ? '#9CA3AF' : '#5E5CE6', fontSize: 12 }}>{timer > 0 ? `Resend in ${timer}s` : 'Resend'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles['register-premium-input-container']}>
                  <Icon name="shield-checkmark-outline" size={20} color="#5E5CE6" style={styles['register-premium-input-icon']} />
                  <TextInput
                    style={styles['register-premium-input-field']}
                    placeholder="6-digit code"
                    placeholderTextColor="#9CA3AF"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                    maxLength={6}
                  />
                </View>
              </View>
              <TouchableOpacity style={styles['register-premium-button']} onPress={handleVerifyOTP} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : (
                  <>
                    <Text style={styles['register-premium-button-text']}>Verify OTP</Text>
                    <Icon name="checkmark-done" size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStep(1)} style={{ alignItems: 'center', marginTop: 15 }}>
                <Text style={{ color: '#6B7280' }}>Change Phone Number</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View>
              <View style={styles['register-premium-input-group']}>
                <Text style={styles['register-premium-input-label']}>Full Name</Text>
                <View style={styles['register-premium-input-container']}>
                  <Icon name="person-outline" size={20} color="#5E5CE6" style={styles['register-premium-input-icon']} />
                  <TextInput
                    style={styles['register-premium-input-field']}
                    placeholder="Your Name"
                    value={formData.name}
                    onChangeText={(v) => updateFormData('name', v)}
                  />
                </View>
              </View>

              <View style={styles['register-premium-input-group']}>
                <Text style={styles['register-premium-input-label']}>Email Address (Optional)</Text>
                <View style={styles['register-premium-input-container']}>
                  <Icon name="mail-outline" size={20} color="#5E5CE6" style={styles['register-premium-input-icon']} />
                  <TextInput
                    style={styles['register-premium-input-field']}
                    placeholder="your@email.com"
                    value={formData.email}
                    onChangeText={(v) => updateFormData('email', v)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles['register-premium-input-group']}>
                <Text style={styles['register-premium-input-label']}>Create Password</Text>
                <View style={styles['register-premium-input-container']}>
                  <Icon name="lock-closed-outline" size={20} color="#5E5CE6" style={styles['register-premium-input-icon']} />
                  <TextInput
                    style={styles['register-premium-input-field']}
                    placeholder="Password"
                    value={formData.password}
                    onChangeText={(v) => updateFormData('password', v)}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles['register-premium-eye-button']}>
                    <Icon name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles['register-premium-input-group']}>
                <Text style={styles['register-premium-input-label']}>Confirm Password</Text>
                <View style={styles['register-premium-input-container']}>
                  <Icon name="lock-closed-outline" size={20} color="#5E5CE6" style={styles['register-premium-input-icon']} />
                  <TextInput
                    style={styles['register-premium-input-field']}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChangeText={(v) => updateFormData('confirmPassword', v)}
                    secureTextEntry={!showPassword}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles['register-premium-button']} onPress={handleRegister} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : (
                  <>
                    <Text style={styles['register-premium-button-text']}>Complete Registration</Text>
                    <Icon name="checkmark-circle" size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

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
