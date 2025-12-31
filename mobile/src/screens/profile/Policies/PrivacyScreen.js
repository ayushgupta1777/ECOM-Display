// ============================================
// PrivacyScreen.js - Privacy Policy
// mobile/screens/PrivacyScreen.js
// ============================================
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PrivacyScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="shield-checkmark" size={48} color="#10B981" />
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.subtitle}>Your privacy is important to us</Text>
      </View>

      <View style={styles.content}>
        <Section 
          icon="information-circle"
          iconColor="#0A84FF"
          title="Information We Collect"
          content="We collect information that you provide directly to us, including your name, email address, phone number, delivery address, and payment information. We also collect information about your device, usage patterns, and browsing behavior within our app."
        />

        <Section 
          icon="compass"
          iconColor="#5E5CE6"
          title="How We Use Your Information"
          content="We use the information we collect to: process your orders and payments, provide customer support, send you updates about your orders, improve our services, personalize your experience, and send promotional communications (with your consent)."
        />

        <Section 
          icon="share-social"
          iconColor="#FF9500"
          title="Information Sharing"
          content="We do not sell your personal information. We may share your information with: service providers who help us operate our business, payment processors, delivery partners, and law enforcement when required by law. All third parties are contractually obligated to protect your data."
        />

        <Section 
          icon="lock-closed"
          iconColor="#FF3B30"
          title="Data Security"
          content="We implement industry-standard security measures to protect your personal information. This includes encryption of sensitive data, secure servers, regular security audits, and restricted access to personal information. However, no method of transmission over the internet is 100% secure."
        />

        <Section 
          icon="card"
          iconColor="#34C759"
          title="Payment Information"
          content="Your payment information is processed securely through PCI-compliant payment gateways. We do not store complete credit card details on our servers. Payment processors may retain certain payment information in accordance with their own privacy policies."
        />

        <Section 
          icon="analytics"
          iconColor="#AF52DE"
          title="Cookies & Tracking"
          content="We use cookies and similar tracking technologies to enhance your experience, remember your preferences, and analyze usage patterns. You can control cookie settings through your device preferences, though some features may not function properly without them."
        />

        <Section 
          icon="people"
          iconColor="#0A84FF"
          title="Your Rights"
          content="You have the right to: access your personal data, request corrections to your data, request deletion of your account and data, opt-out of marketing communications, and export your data. Contact our support team to exercise these rights."
        />

        <Section 
          icon="location"
          iconColor="#FF9500"
          title="Location Data"
          content="With your permission, we may collect and use your location data to provide location-based services such as store locators, delivery tracking, and personalized recommendations. You can disable location services at any time in your device settings."
        />

        <Section 
          icon="notifications"
          iconColor="#FF3B30"
          title="Push Notifications"
          content="We may send you push notifications about order updates, special offers, and other relevant information. You can manage notification preferences in your account settings or device settings at any time."
        />

        <Section 
          icon="time"
          iconColor="#6B7280"
          title="Data Retention"
          content="We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When data is no longer needed, it is securely deleted or anonymized."
        />

        <Section 
          icon="people-circle"
          iconColor="#5E5CE6"
          title="Children's Privacy"
          content="Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately."
        />

        <Section 
          icon="refresh"
          iconColor="#34C759"
          title="Policy Updates"
          content="We may update this Privacy Policy from time to time. We will notify you of significant changes via email or app notification. Your continued use of our services after such modifications constitutes your acknowledgment of the modified policy."
        />

        <View style={styles.contactBox}>
          <Icon name="mail" size={24} color="#4F46E5" />
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>Questions About Privacy?</Text>
            <Text style={styles.contactText}>
              Contact our privacy team at privacy@yourcompany.com
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Last updated: December 2024
          </Text>
          <Text style={styles.footerSubtext}>
            We are committed to protecting your privacy and ensuring transparency in how we handle your data.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const Section = ({ icon, iconColor, title, content }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View style={[styles.iconBadge, { backgroundColor: `${iconColor}15` }]}>
        <Icon name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <Text style={styles.sectionContent}>{content}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4
  },
  content: {
    padding: 20
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827'
  },
  sectionContent: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22
  },
  contactBox: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center'
  },
  contactContent: {
    flex: 1,
    marginLeft: 12
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 4
  },
  contactText: {
    fontSize: 13,
    color: '#6366F1',
    lineHeight: 18
  },
  footer: {
    padding: 16,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18
  }
});

export default PrivacyScreen;