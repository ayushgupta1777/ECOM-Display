// ============================================
// TermsScreen.js - Terms & Conditions
// mobile/screens/TermsScreen.js
// ============================================
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const TermsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="document-text" size={48} color="#4F46E5" />
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.subtitle}>Last updated: December 2024</Text>
      </View>

      <View style={styles.content}>
        <Section 
          number="1"
          title="Acceptance of Terms"
          content="By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
        />

        <Section 
          number="2"
          title="Use License"
          content="Permission is granted to temporarily download one copy of the materials on our application for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title."
        />

        <Section 
          number="3"
          title="User Account"
          content="When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account."
        />

        <Section 
          number="4"
          title="Purchases & Pricing"
          content="All purchases through our application are subject to product availability. We reserve the right to limit quantities purchased per person, per household or per order. Prices are subject to change without notice."
        />

        <Section 
          number="5"
          title="User Conduct"
          content="You agree not to use the application to: violate any laws, infringe upon intellectual property rights, transmit harmful code, impersonate any person or entity, or interfere with the application's functionality."
        />

        <Section 
          number="6"
          title="Intellectual Property"
          content="All content included in or made available through our application, such as text, graphics, logos, images, and software, is the property of our company or our content suppliers and protected by copyright laws."
        />

        <Section 
          number="7"
          title="Limitation of Liability"
          content="In no event shall our company be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use our application."
        />

        <Section 
          number="8"
          title="Account Termination"
          content="We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms."
        />

        <Section 
          number="9"
          title="Changes to Terms"
          content="We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page. Your continued use of the application after such modifications will constitute acknowledgment."
        />

        <Section 
          number="10"
          title="Contact Information"
          content="If you have any questions about these Terms, please contact us through our support channels available in the app or via email at support@yourcompany.com"
        />

        <View style={styles.footer}>
          <Icon name="shield-checkmark" size={24} color="#10B981" />
          <Text style={styles.footerText}>
            By using our app, you acknowledge that you have read and understood these terms.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const Section = ({ number, title, content }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{number}</Text>
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
    marginBottom: 16,
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
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  numberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5'
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
  footer: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    alignItems: 'center'
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    color: '#065F46',
    marginLeft: 12,
    lineHeight: 20
  }
});

export default TermsScreen;