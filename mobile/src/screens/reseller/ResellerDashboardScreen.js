// ============================================
// mobile/src/screens/reseller/ResellerDashboardScreen.js
// ============================================
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styling/screens/reseller/ResellerDashboardPremiumStyles';

const ResellerDashboardScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);

  // Mock data - in real app, fetch from API
  const stats = {
    walletBalance: 2500,
    totalEarnings: 15000,
    totalSales: 45,
    pendingOrders: 3
  };

  return (
    <ScrollView 
      style={styles['reseller-premium-container']}
      showsVerticalScrollIndicator={false}
    >
      {/* Premium Header with Gradient */}
      <View style={styles['reseller-premium-header']}>
        <View style={styles['reseller-premium-header-content']}>
          <View>
            <Text style={styles['reseller-premium-greeting']}>Hey {user?.name?.split(' ')[0] || 'Reseller'}!</Text>
            <Text style={styles['reseller-premium-title']}>Your Dashboard</Text>
          </View>
          <TouchableOpacity style={styles['reseller-premium-notification-btn']}>
            <Icon name="notifications-outline" size={24} color="#fff" />
            <View style={styles['reseller-premium-notification-badge']} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Wallet Balance Card */}
      <View style={styles['reseller-premium-wallet-section']}>
        <View style={styles['reseller-premium-wallet-card']}>
          <View style={styles['reseller-premium-wallet-header']}>
            <View>
              <Text style={styles['reseller-premium-wallet-label']}>Wallet Balance</Text>
              <Text style={styles['reseller-premium-wallet-amount']}>₹{stats.walletBalance}</Text>
              <Text style={styles['reseller-premium-wallet-earnings']}>
                Total Earned: ₹{stats.totalEarnings}
              </Text>
            </View>
            <View style={styles['reseller-premium-wallet-icon']}>
              <Icon name="wallet" size={40} color="#0A84FF" />
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles['reseller-premium-wallet-button']}
            onPress={() => navigation.navigate('Wallet')}
          >
            <Text style={styles['reseller-premium-wallet-button-text']}>Withdraw Money</Text>
            <Icon name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles['reseller-premium-stats-section']}>
        <View style={styles['reseller-premium-stats-grid']}>
          {/* Total Sales */}
          <View style={[styles['reseller-premium-stat-card'], { backgroundColor: '#E8F5E9' }]}>
            <View style={styles['reseller-premium-stat-icon']}>
              <Icon name="cart" size={28} color="#34C759" />
            </View>
            <Text style={styles['reseller-premium-stat-value']}>{stats.totalSales}</Text>
            <Text style={styles['reseller-premium-stat-label']}>Total Sales</Text>
          </View>

          {/* Pending Orders */}
          <View style={[styles['reseller-premium-stat-card'], { backgroundColor: '#FFF3E0' }]}>
            <View style={styles['reseller-premium-stat-icon']}>
              <Icon name="time" size={28} color="#FF9500" />
            </View>
            <Text style={styles['reseller-premium-stat-value']}>{stats.pendingOrders}</Text>
            <Text style={styles['reseller-premium-stat-label']}>Pending</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles['reseller-premium-actions-section']}>
        <Text style={styles['reseller-premium-section-title']}>Quick Actions</Text>

        <TouchableOpacity
          style={styles['reseller-premium-action-card']}
          onPress={() => navigation.navigate('Home', { screen: 'ProductList' })}
        >
          <View style={[styles['reseller-premium-action-icon-container'], { backgroundColor: '#E3F2FD' }]}>
            <Icon name="share-social" size={28} color="#0A84FF" />
          </View>
          <View style={styles['reseller-premium-action-content']}>
            <Text style={styles['reseller-premium-action-title']}>Share Products</Text>
            <Text style={styles['reseller-premium-action-subtitle']}>Browse products and start earning</Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles['reseller-premium-action-card']}
          onPress={() => navigation.navigate('Wallet')}
        >
          <View style={[styles['reseller-premium-action-icon-container'], { backgroundColor: '#E8F5E9' }]}>
            <Icon name="wallet" size={28} color="#34C759" />
          </View>
          <View style={styles['reseller-premium-action-content']}>
            <Text style={styles['reseller-premium-action-title']}>My Wallet</Text>
            <Text style={styles['reseller-premium-action-subtitle']}>View transactions & withdraw funds</Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles['reseller-premium-action-card']}>
          <View style={[styles['reseller-premium-action-icon-container'], { backgroundColor: '#F3E5F5' }]}>
            <Icon name="bar-chart" size={28} color="#5E5CE6" />
          </View>
          <View style={styles['reseller-premium-action-content']}>
            <Text style={styles['reseller-premium-action-title']}>My Orders</Text>
            <Text style={styles['reseller-premium-action-subtitle']}>Track your sales performance</Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Referral Code Section */}
      <View style={styles['reseller-premium-referral-section']}>
        <Text style={styles['reseller-premium-section-title']}>Your Referral Code</Text>
        <View style={styles['reseller-premium-referral-card']}>
          <View style={styles['reseller-premium-referral-icon']}>
            <Icon name="gift" size={32} color="#FF9500" />
          </View>
          <View style={styles['reseller-premium-referral-content']}>
            <Text style={styles['reseller-premium-referral-label']}>Share & Earn More</Text>
            <View style={styles['reseller-premium-referral-code-container']}>
              <Text style={styles['reseller-premium-referral-code']}>JOHN2024</Text>
              <TouchableOpacity style={styles['reseller-premium-copy-btn']}>
                <Icon name="copy-outline" size={18} color="#0A84FF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

export default ResellerDashboardScreen;