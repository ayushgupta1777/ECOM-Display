// ============================================
// mobile/src/screens/auth/OnboardingScreen.js
// ============================================
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styling/screens/auth/OnboardingScreenPremiumStyles';

const OnboardingScreen = ({ navigation }) => {
  return (
    <View style={styles['onboarding-premium-container']}>
      {/* Gradient Background Overlay */}
      <View style={styles['onboarding-premium-gradient']} />
      
      {/* Premium Content */}
      <View style={styles['onboarding-premium-content']}>
        {/* Logo Section */}
        <View style={styles['onboarding-premium-logo-section']}>
          <View style={styles['onboarding-premium-logo-container']}>
            <Icon name="storefront" size={64} color="#0A84FF" />
          </View>
          <Text style={styles['onboarding-premium-brand']}>ERA</Text>
        </View>

        {/* Hero Text */}
        <View style={styles['onboarding-premium-hero']}>
          <Text style={styles['onboarding-premium-title']}>
            Welcome to{'\n'}Premium Shopping
          </Text>
          <Text style={styles['onboarding-premium-subtitle']}>
            Shop exclusive products, become a vendor, or earn as a reseller
          </Text>
        </View>

        {/* Feature Cards */}
        <View style={styles['onboarding-premium-features']}>
          <View style={styles['onboarding-premium-feature-card']}>
            <View style={[styles['onboarding-premium-feature-icon'], { backgroundColor: '#E3F2FD' }]}>
              <Icon name="cart" size={24} color="#0A84FF" />
            </View>
            <Text style={styles['onboarding-premium-feature-text']}>Shop Premium</Text>
          </View>

          <View style={styles['onboarding-premium-feature-card']}>
            <View style={[styles['onboarding-premium-feature-icon'], { backgroundColor: '#F3E5F5' }]}>
              <Icon name="storefront" size={24} color="#5E5CE6" />
            </View>
            <Text style={styles['onboarding-premium-feature-text']}>Sell Products</Text>
          </View>

          <View style={styles['onboarding-premium-feature-card']}>
            <View style={[styles['onboarding-premium-feature-icon'], { backgroundColor: '#FFF3E0' }]}>
              <Icon name="share-social" size={24} color="#FF9500" />
            </View>
            <Text style={styles['onboarding-premium-feature-text']}>Earn Money</Text>
          </View>
        </View>
      </View>

      {/* Premium Buttons */}
      <View style={styles['onboarding-premium-buttons']}>
        <TouchableOpacity
          style={styles['onboarding-premium-button-primary']}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles['onboarding-premium-button-primary-text']}>Sign In</Text>
          <Icon name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles['onboarding-premium-button-secondary']}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles['onboarding-premium-button-secondary-text']}>Create Account</Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles['onboarding-premium-terms']}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </View>
  );
};

export default OnboardingScreen;