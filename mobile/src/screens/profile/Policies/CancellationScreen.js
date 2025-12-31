// ============================================
// CancellationScreen.js - Cancellation & Refund Policy
// mobile/screens/CancellationScreen.js
// ============================================
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CancellationScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="return-up-back" size={48} color="#FF9500" />
        <Text style={styles.title}>Cancellation & Refund</Text>
        <Text style={styles.subtitle}>Easy returns & quick refunds</Text>
      </View>

      <View style={styles.content}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Orders')}
          >
            <Icon name="close-circle" size={28} color="#FF3B30" />
            <Text style={styles.actionTitle}>Cancel Order</Text>
            <Text style={styles.actionSubtitle}>View orders</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Support')}
          >
            <Icon name="help-circle" size={28} color="#0A84FF" />
            <Text style={styles.actionTitle}>Need Help?</Text>
            <Text style={styles.actionSubtitle}>Contact support</Text>
          </TouchableOpacity>
        </View>

        {/* Cancellation Policy */}
        <View style={styles.policySection}>
          <View style={styles.policySectionHeader}>
            <Icon name="close-circle-outline" size={24} color="#FF3B30" />
            <Text style={styles.policySectionTitle}>Order Cancellation</Text>
          </View>

          <InfoCard 
            icon="time-outline"
            iconColor="#34C759"
            title="Before Shipment"
            content="You can cancel your order anytime before it's shipped. Simply go to 'My Orders' and click on 'Cancel Order'. Your refund will be processed within 2-3 business days."
          />

          <InfoCard 
            icon="cube-outline"
            iconColor="#FF9500"
            title="After Shipment"
            content="Once your order is shipped, cancellation is not available. However, you can refuse the delivery or return the product after delivery as per our return policy."
          />

          <InfoCard 
            icon="ban-outline"
            iconColor="#6B7280"
            title="Non-Cancellable Items"
            content="Certain items like perishable goods, intimate wear, custom-made products, and sale items cannot be cancelled or returned. Check product details before ordering."
          />
        </View>

        {/* Return Policy */}
        <View style={styles.policySection}>
          <View style={styles.policySectionHeader}>
            <Icon name="arrow-undo-outline" size={24} color="#0A84FF" />
            <Text style={styles.policySectionTitle}>Return Policy</Text>
          </View>

          <InfoCard 
            icon="calendar-outline"
            iconColor="#5E5CE6"
            title="7-Day Return Window"
            content="Most products can be returned within 7 days of delivery. The product must be unused, in original packaging with all tags and accessories intact."
          />

          <InfoCard 
            icon="checkmark-done-outline"
            iconColor="#10B981"
            title="How to Return"
            content="Go to 'My Orders', select the item, and click 'Return'. Schedule a pickup or drop it at our nearest partner location. Return shipping is free for defective products."
          />

          <InfoCard 
            icon="shield-checkmark-outline"
            iconColor="#0A84FF"
            title="Quality Issues"
            content="If you receive a damaged or defective product, contact us within 48 hours with photos. We'll arrange immediate replacement or full refund including shipping charges."
          />
        </View>

        {/* Refund Process */}
        <View style={styles.policySection}>
          <View style={styles.policySectionHeader}>
            <Icon name="wallet-outline" size={24} color="#10B981" />
            <Text style={styles.policySectionTitle}>Refund Process</Text>
          </View>

          <Timeline 
            steps={[
              {
                icon: 'checkmark-circle',
                title: 'Return Approved',
                description: 'Within 1-2 business days after receiving returned item',
                color: '#10B981'
              },
              {
                icon: 'sync',
                title: 'Refund Initiated',
                description: 'Processing starts immediately after approval',
                color: '#0A84FF'
              },
              {
                icon: 'cash',
                title: 'Money Credited',
                description: '2-7 business days depending on payment method',
                color: '#34C759'
              }
            ]}
          />

          <View style={styles.refundMethods}>
            <Text style={styles.refundMethodsTitle}>Refund Methods:</Text>
            <RefundMethod 
              icon="card"
              method="Credit/Debit Card"
              time="5-7 business days"
            />
            <RefundMethod 
              icon="phone-portrait"
              method="UPI / Digital Wallet"
              time="2-4 business days"
            />
            <RefundMethod 
              icon="wallet"
              method="Net Banking"
              time="3-5 business days"
            />
            <RefundMethod 
              icon="cash"
              method="Cash on Delivery"
              time="Bank transfer in 5-7 days"
            />
          </View>
        </View>

        {/* Important Notes */}
        <View style={styles.notesSection}>
          <View style={styles.notesSectionHeader}>
            <Icon name="alert-circle" size={24} color="#FF9500" />
            <Text style={styles.notesSectionTitle}>Important Notes</Text>
          </View>

          <View style={styles.notesList}>
            <NoteItem text="Refunds are processed to the original payment method" />
            <NoteItem text="Shipping charges are non-refundable unless product is defective" />
            <NoteItem text="Exchange is subject to product availability" />
            <NoteItem text="Return pickup is free for orders above ₹499" />
            <NoteItem text="Gift cards and promotional credits cannot be refunded" />
          </View>
        </View>

        {/* Contact Support */}
        <TouchableOpacity 
          style={styles.supportButton}
          onPress={() => navigation.navigate('Support')}
        >
          <Icon name="chatbubbles" size={20} color="#fff" />
          <Text style={styles.supportButtonText}>Contact Support Team</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            We're committed to making returns and refunds as smooth as possible. Your satisfaction is our priority! 🌟
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const InfoCard = ({ icon, iconColor, title, content }) => (
  <View style={styles.infoCard}>
    <View style={[styles.infoIcon, { backgroundColor: `${iconColor}15` }]}>
      <Icon name={icon} size={22} color={iconColor} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoText}>{content}</Text>
    </View>
  </View>
);

const Timeline = ({ steps }) => (
  <View style={styles.timeline}>
    {steps.map((step, index) => (
      <View key={index} style={styles.timelineItem}>
        <View style={styles.timelineIconContainer}>
          <View style={[styles.timelineIcon, { backgroundColor: step.color }]}>
            <Icon name={step.icon} size={18} color="#fff" />
          </View>
          {index < steps.length - 1 && <View style={styles.timelineLine} />}
        </View>
        <View style={styles.timelineContent}>
          <Text style={styles.timelineTitle}>{step.title}</Text>
          <Text style={styles.timelineDescription}>{step.description}</Text>
        </View>
      </View>
    ))}
  </View>
);

const RefundMethod = ({ icon, method, time }) => (
  <View style={styles.refundMethod}>
    <Icon name={icon} size={20} color="#4F46E5" />
    <View style={styles.refundMethodInfo}>
      <Text style={styles.refundMethodName}>{method}</Text>
      <Text style={styles.refundMethodTime}>{time}</Text>
    </View>
  </View>
);

const NoteItem = ({ text }) => (
  <View style={styles.noteItem}>
    <Icon name="checkmark-circle" size={18} color="#10B981" />
    <Text style={styles.noteText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginTop: 12 },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  content: { padding: 16 },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  actionTitle: { fontSize: 14, fontWeight: '600', color: '#111827', marginTop: 8 },
  actionSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  policySection: {
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
  policySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  policySectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 10
  },
  infoCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 12
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 4 },
  infoText: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  timeline: { marginVertical: 12 },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 12
  },
  timelineIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 4
  },
  timelineContent: { flex: 1, paddingTop: 4 },
  timelineTitle: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 4 },
  timelineDescription: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  refundMethods: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8
  },
  refundMethodsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12
  },
  refundMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  refundMethodInfo: { marginLeft: 12, flex: 1 },
  refundMethodName: { fontSize: 14, fontWeight: '500', color: '#374151' },
  refundMethodTime: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  notesSection: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  notesSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  notesSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginLeft: 8
  },
  notesList: { gap: 8 },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#78350F',
    marginLeft: 8,
    lineHeight: 20
  },
  supportButton: {
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
  footer: {
    padding: 16,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20
  }
});

export default CancellationScreen;