// ============================================
// ShippingScreen.js - Shipping & Delivery Policy
// mobile/screens/ShippingScreen.js
// ============================================
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ShippingScreen = () => {
  const [pincode, setPincode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState(null);

  const checkDelivery = () => {
    if (pincode.length === 6) {
      // Simulate delivery check
      setDeliveryEstimate({
        available: true,
        days: '3-5 business days',
        charges: 'FREE'
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="cube" size={48} color="#0A84FF" />
        <Text style={styles.title}>Shipping & Delivery</Text>
        <Text style={styles.subtitle}>Fast & reliable delivery to your doorstep</Text>
      </View>

      <View style={styles.content}>
        {/* Pincode Checker */}
        <View style={styles.pincodeChecker}>
          <Text style={styles.pincodeTitle}>Check Delivery Availability</Text>
          <View style={styles.pincodeInputContainer}>
            <Icon name="location" size={20} color="#6B7280" />
            <TextInput
              style={styles.pincodeInput}
              placeholder="Enter your pincode"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="numeric"
              maxLength={6}
            />
            <TouchableOpacity 
              style={styles.checkButton}
              onPress={checkDelivery}
            >
              <Text style={styles.checkButtonText}>Check</Text>
            </TouchableOpacity>
          </View>

          {deliveryEstimate && (
            <View style={styles.deliveryEstimate}>
              <Icon name="checkmark-circle" size={24} color="#10B981" />
              <View style={styles.estimateInfo}>
                <Text style={styles.estimateText}>
                  Delivery in {deliveryEstimate.days}
                </Text>
                <Text style={styles.estimateCharges}>
                  Shipping: {deliveryEstimate.charges}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Shipping Options */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="rocket" size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Shipping Options</Text>
          </View>

          <ShippingOption 
            icon="flash"
            iconColor="#FF9500"
            title="Express Delivery"
            time="1-2 business days"
            price="₹99"
            features={[
              'Priority processing',
              'Real-time tracking',
              'Weekend delivery available'
            ]}
          />

          <ShippingOption 
            icon="bicycle"
            iconColor="#34C759"
            title="Standard Delivery"
            time="3-5 business days"
            price="FREE on orders above ₹499"
            features={[
              'Reliable delivery',
              'SMS & email updates',
              'Secure packaging'
            ]}
          />

          <ShippingOption 
            icon="home"
            iconColor="#0A84FF"
            title="Same Day Delivery"
            time="Within 24 hours"
            price="₹149"
            features={[
              'Available in select cities',
              'Order before 12 PM',
              'Premium packaging'
            ]}
            badge="Limited"
          />
        </View>

        {/* Delivery Process */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="timer" size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Delivery Process</Text>
          </View>

          <DeliveryStep 
            number="1"
            icon="checkmark-done"
            title="Order Confirmed"
            description="Your order is confirmed and payment processed"
            color="#10B981"
          />

          <DeliveryStep 
            number="2"
            icon="cube"
            title="Order Packed"
            description="Your items are carefully packed and quality checked"
            color="#0A84FF"
          />

          <DeliveryStep 
            number="3"
            icon="airplane"
            title="Shipped"
            description="Your order is on its way to you"
            color="#5E5CE6"
          />

          <DeliveryStep 
            number="4"
            icon="home"
            title="Out for Delivery"
            description="Your order will be delivered today"
            color="#FF9500"
          />

          <DeliveryStep 
            number="5"
            icon="checkmark-circle"
            title="Delivered"
            description="Order successfully delivered to you"
            color="#34C759"
            isLast
          />
        </View>

        {/* Tracking */}
        <View style={styles.trackingSection}>
          <View style={styles.trackingHeader}>
            <Icon name="navigate" size={28} color="#fff" />
            <View style={styles.trackingHeaderText}>
              <Text style={styles.trackingTitle}>Real-Time Tracking</Text>
              <Text style={styles.trackingSubtitle}>
                Track your order every step of the way
              </Text>
            </View>
          </View>

          <View style={styles.trackingFeatures}>
            <TrackingFeature 
              icon="notifications"
              title="Instant Updates"
              description="Get notified at every milestone"
            />
            <TrackingFeature 
              icon="map"
              title="Live Location"
              description="See delivery partner's location"
            />
            <TrackingFeature 
              icon="person"
              title="Delivery Partner"
              description="Contact details shared before delivery"
            />
          </View>
        </View>

        {/* Delivery Charges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="pricetag" size={24} color="#FF9500" />
            <Text style={styles.sectionTitle}>Delivery Charges</Text>
          </View>

          <View style={styles.chargesTable}>
            <ChargeRow 
              label="Orders above ₹499"
              value="FREE"
              valueColor="#10B981"
            />
            <ChargeRow 
              label="Orders below ₹499"
              value="₹49"
              valueColor="#6B7280"
            />
            <ChargeRow 
              label="Express Delivery"
              value="₹99"
              valueColor="#FF9500"
            />
            <ChargeRow 
              label="Same Day Delivery"
              value="₹149"
              valueColor="#FF3B30"
            />
            <ChargeRow 
              label="Bulky/Heavy Items"
              value="As per weight"
              valueColor="#6B7280"
            />
          </View>
        </View>

        {/* Important Information */}
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Icon name="information-circle" size={24} color="#0A84FF" />
            <Text style={styles.infoTitle}>Important Information</Text>
          </View>

          <InfoItem 
            icon="time"
            text="Delivery timings: Monday to Saturday, 9 AM to 7 PM"
          />
          <InfoItem 
            icon="calendar"
            text="Orders placed on Sunday/holidays will be processed next working day"
          />
          <InfoItem 
            icon="location"
            text="Remote areas may take 1-2 additional days"
          />
          <InfoItem 
            icon="alert-circle"
            text="Delivery partner will call 30 minutes before arrival"
          />
          <InfoItem 
            icon="shield-checkmark"
            text="Open box delivery available for high-value items"
          />
          <InfoItem 
            icon="receipt"
            text="Invoice and warranty card included in package"
          />
        </View>

        {/* Coverage Area */}
        <View style={styles.coverageSection}>
          <Text style={styles.coverageTitle}>📍 Delivery Coverage</Text>
          <Text style={styles.coverageText}>
            We deliver to 20,000+ pincodes across India including metros, tier 2 & 3 cities, and most rural areas. Check pincode availability at checkout.
          </Text>
        </View>

        {/* Contact */}
        <View style={styles.contactSection}>
          <Icon name="headset" size={32} color="#4F46E5" />
          <Text style={styles.contactTitle}>Need Help with Delivery?</Text>
          <Text style={styles.contactText}>
            Our support team is here to help with any delivery-related queries
          </Text>
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButton}>
              <Icon name="call" size={18} color="#4F46E5" />
              <Text style={styles.contactButtonText}>Call Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton}>
              <Icon name="chatbubbles" size={18} color="#4F46E5" />
              <Text style={styles.contactButtonText}>Chat Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const ShippingOption = ({ icon, iconColor, title, time, price, features, badge }) => (
  <View style={styles.shippingOption}>
    <View style={styles.optionHeader}>
      <View style={[styles.optionIcon, { backgroundColor: `${iconColor}15` }]}>
        <Icon name={icon} size={24} color={iconColor} />
      </View>
      <View style={styles.optionInfo}>
        <View style={styles.optionTitleRow}>
          <Text style={styles.optionTitle}>{title}</Text>
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        <Text style={styles.optionTime}>{time}</Text>
        <Text style={styles.optionPrice}>{price}</Text>
      </View>
    </View>
    <View style={styles.optionFeatures}>
      {features.map((feature, index) => (
        <View key={index} style={styles.feature}>
          <Icon name="checkmark" size={14} color="#10B981" />
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}
    </View>
  </View>
);

const DeliveryStep = ({ number, icon, title, description, color, isLast }) => (
  <View style={styles.deliveryStep}>
    <View style={styles.stepIndicator}>
      <View style={[styles.stepNumber, { backgroundColor: color }]}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      {!isLast && <View style={styles.stepLine} />}
    </View>
    <View style={styles.stepContent}>
      <View style={[styles.stepIcon, { backgroundColor: `${color}15` }]}>
        <Icon name={icon} size={18} color={color} />
      </View>
      <View style={styles.stepText}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDescription}>{description}</Text>
      </View>
    </View>
  </View>
);

const TrackingFeature = ({ icon, title, description }) => (
  <View style={styles.trackingFeature}>
    <Icon name={icon} size={20} color="#fff" />
    <Text style={styles.trackingFeatureTitle}>{title}</Text>
    <Text style={styles.trackingFeatureDesc}>{description}</Text>
  </View>
);

const ChargeRow = ({ label, value, valueColor }) => (
  <View style={styles.chargeRow}>
    <Text style={styles.chargeLabel}>{label}</Text>
    <Text style={[styles.chargeValue, { color: valueColor }]}>{value}</Text>
  </View>
);

const InfoItem = ({ icon, text }) => (
  <View style={styles.infoItem}>
    <Icon name={icon} size={18} color="#0A84FF" />
    <Text style={styles.infoItemText}>{text}</Text>
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
  pincodeChecker: {
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
  pincodeTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 },
  pincodeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  pincodeInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 15,
    color: '#111827'
  },
  checkButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6
  },
  checkButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  deliveryEstimate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#ECFDF5',
    borderRadius: 8
  },
  estimateInfo: { marginLeft: 12 },
  estimateText: { fontSize: 15, fontWeight: '600', color: '#065F46' },
  estimateCharges: { fontSize: 13, color: '#059669', marginTop: 2 },
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
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginLeft: 10 },
  shippingOption: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 12
  },
  optionHeader: { flexDirection: 'row', marginBottom: 12 },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  optionInfo: { flex: 1 },
  optionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  optionTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  badge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  badgeText: { fontSize: 10, fontWeight: '600', color: '#92400E' },
  optionTime: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  optionPrice: { fontSize: 14, fontWeight: '600', color: '#4F46E5', marginTop: 4 },
  optionFeatures: { gap: 6 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  featureText: { fontSize: 12, color: '#6B7280' },
  deliveryStep: { flexDirection: 'row', marginBottom: 16 },
  stepIndicator: { alignItems: 'center', marginRight: 12 },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  stepNumberText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 4
  },
  stepContent: { flex: 1, flexDirection: 'row' },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  stepText: { flex: 1, paddingTop: 4 },
  stepTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  stepDescription: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  trackingSection: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16
  },
  trackingHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  trackingHeaderText: { marginLeft: 12, flex: 1 },
  trackingTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  trackingSubtitle: { fontSize: 13, color: '#C7D2FE', marginTop: 2 },
  trackingFeatures: { flexDirection: 'row', gap: 12 },
  trackingFeature: {
    flex: 1,
    backgroundColor: '#FFFFFF15',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  trackingFeatureTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
    textAlign: 'center'
  },
  trackingFeatureDesc: {
    fontSize: 11,
    color: '#C7D2FE',
    marginTop: 4,
    textAlign: 'center'
  },
  chargesTable: { gap: 8 },
  chargeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 6
  },
  chargeLabel: { fontSize: 14, color: '#374151' },
  chargeValue: { fontSize: 14, fontWeight: '600' },
  infoSection: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
    marginLeft: 8
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
    gap: 10
  },
  infoItemText: {
    flex: 1,
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 20
  },
  coverageSection: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  coverageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8
  },
  coverageText: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 20
  },
  contactSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5'
  }
});

export default ShippingScreen;