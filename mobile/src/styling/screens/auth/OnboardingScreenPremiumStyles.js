// ============================================
// mobile/src/screens/auth/OnboardingScreenPremiumStyles.js
// ============================================
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  'onboarding-premium-container': {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  
  'onboarding-premium-gradient': {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: '#E3F2FD',
    opacity: 0.5,
  },
  
  'onboarding-premium-content': {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingHorizontal: 24,
  },
  
  'onboarding-premium-logo-section': {
    alignItems: 'center',
    marginBottom: 48,
  },
  
  'onboarding-premium-logo-container': {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  
  'onboarding-premium-brand': {
    fontSize: 24,
    fontWeight: '800',
    color: '#0A84FF',
    letterSpacing: 3,
  },
  
  'onboarding-premium-hero': {
    alignItems: 'center',
    marginBottom: 48,
  },
  
  'onboarding-premium-title': {
    fontSize: 36,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 44,
    letterSpacing: -1,
  },
  
  'onboarding-premium-subtitle': {
    fontSize: 17,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 16,
    fontWeight: '500',
  },
  
  'onboarding-premium-features': {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  
  'onboarding-premium-feature-card': {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  
  'onboarding-premium-feature-icon': {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  'onboarding-premium-feature-text': {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  
  'onboarding-premium-buttons': {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 48 : 32,
  },
  
  'onboarding-premium-button-primary': {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A84FF',
    borderRadius: 16,
    height: 58,
    marginBottom: 16,
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  
  'onboarding-premium-button-primary-text': {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginRight: 8,
    letterSpacing: 0.5,
  },
  
  'onboarding-premium-button-secondary': {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    height: 58,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  
  'onboarding-premium-button-secondary-text': {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A84FF',
    letterSpacing: 0.5,
  },
  
  'onboarding-premium-terms': {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});