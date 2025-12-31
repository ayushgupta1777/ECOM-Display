import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, RefreshControl, Alert, ActivityIndicator
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';
import api from '../../services/api';

const ResellerHubScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isReseller = user?.resellerApplication?.status === 'approved';

  useEffect(() => {
    if (isReseller) {
      fetchResellerData();
    } else {
      setIsLoading(false);
    }
  }, [isReseller]);

  const fetchResellerData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch wallet data
      const walletRes = await api.get('/reseller/wallet');
      
      // Fetch stats
      const statsRes = await api.get('/reseller/stats');
      
      // Fetch recent sales
      const salesRes = await api.get('/reseller/sales?limit=5');
      
      setStats({
        ...walletRes.data.data,
        ...statsRes.data.data
      });
      
      setRecentSales(salesRes.data.data.orders || []);
      
    } catch (error) {
      console.error('Failed to fetch reseller data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchResellerData();
    setIsRefreshing(false);
  };

  // NON-RESELLER VIEW
  if (!isReseller) {
    return (
      <ScrollView style={styles.container}>
        <View
          colors={['#4F46E5', '#7C3AED', '#EC4899']}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <Icon name="cash-outline" size={80} color="#fff" />
            <Text style={styles.heroTitle}>Start Earning Today!</Text>
            <Text style={styles.heroSubtitle}>
              Share products, earn 5-30% commission on every sale
            </Text>
            
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>5-30%</Text>
                <Text style={styles.heroStatLabel}>Commission</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>₹0</Text>
                <Text style={styles.heroStatLabel}>To Start</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>2 Min</Text>
                <Text style={styles.heroStatLabel}>Setup</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.heroCTA}
              onPress={() => navigation.navigate('BecomeReseller')}
            >
              <Text style={styles.heroCTAText}>Become a Reseller Now</Text>
              <Icon name="arrow-forward" size={20} color="#4F46E5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Join?</Text>
          
          {[
            { icon: 'rocket', color: '#10B981', title: 'No Investment', desc: 'Start earning without any upfront cost' },
            { icon: 'wallet', color: '#3B82F6', title: 'Quick Payouts', desc: 'Withdraw anytime, minimum ₹100' },
            { icon: 'trending-up', color: '#8B5CF6', title: 'Unlimited Earnings', desc: 'No cap on how much you can earn' },
            { icon: 'shield-checkmark', color: '#F59E0B', title: 'Full Support', desc: 'We handle shipping & customer service' }
          ].map((benefit, index) => (
            <View key={index} style={styles.benefitCard}>
              <View style={[styles.benefitIcon, { backgroundColor: benefit.color + '20' }]}>
                <Icon name={benefit.icon} size={24} color={benefit.color} />
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDesc}>{benefit.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  // RESELLER VIEW - Loading State
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  // RESELLER VIEW - Dashboard
  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View
        colors={['#4F46E5', '#7C3AED']}
        style={styles.resellerHeader}
      >
        <View style={styles.resellerHeaderContent}>
          <View>
            <Text style={styles.resellerGreeting}>
              Hey {user?.name?.split(' ')[0]}! 👋
            </Text>
            <Text style={styles.resellerSubtitle}>Your Earning Dashboard</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon name="notifications-outline" size={24} color="#fff" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Earnings Card */}
      <View style={styles.earningsCard}>
        <View style={styles.earningsHeader}>
          <View>
            <Text style={styles.earningsLabel}>Available Balance</Text>
            <Text style={styles.earningsAmount}>₹{stats?.availableBalance || 0}</Text>
            <Text style={styles.earningsHint}>
              Can withdraw now
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.withdrawBtn}
            onPress={() => navigation.navigate('Withdraw', { 
              availableBalance: stats?.availableBalance 
            })}
            disabled={!stats?.availableBalance || stats.availableBalance < 100}
          >
            <Icon name="arrow-down-circle" size={20} color="#fff" />
            <Text style={styles.withdrawBtnText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.earningsStats}>
          <View style={styles.earningStat}>
            <Icon name="time-outline" size={18} color="#F59E0B" />
            <Text style={styles.earningStatLabel}>Pending</Text>
            <Text style={styles.earningStatValue}>₹{stats?.pendingBalance || 0}</Text>
            <Text style={styles.earningStatHint}>
              Available in {stats?.lockPeriodDays || 7} days
            </Text>
          </View>
          <View style={styles.earningsStatsDivider} />
          <View style={styles.earningStat}>
            <Icon name="trending-up-outline" size={18} color="#10B981" />
            <Text style={styles.earningStatLabel}>Total Earned</Text>
            <Text style={styles.earningStatValue}>₹{stats?.totalEarned || 0}</Text>
            <Text style={styles.earningStatHint}>All time</Text>
          </View>
        </View>
      </View>

      {/* Performance Stats */}
      <View style={styles.performanceCard}>
        <Text style={styles.cardTitle}>Your Performance</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <View style={[styles.statIconBg, { backgroundColor: '#E8F5E9' }]}>
              <Icon name="cart" size={24} color="#34C759" />
            </View>
            <Text style={styles.statValue}>{stats?.totalSales || 0}</Text>
            <Text style={styles.statLabel}>Total Sales</Text>
          </View>
          
          <View style={styles.statBox}>
            <View style={[styles.statIconBg, { backgroundColor: '#FFF3E0' }]}>
              <Icon name="time" size={24} color="#FF9500" />
            </View>
            <Text style={styles.statValue}>{stats?.pendingOrders || 0}</Text>
            <Text style={styles.statLabel}>Pending Orders</Text>
          </View>
          
          <View style={styles.statBox}>
            <View style={[styles.statIconBg, { backgroundColor: '#E3F2FD' }]}>
              <Icon name="calendar" size={24} color="#0A84FF" />
            </View>
            <Text style={styles.statValue}>{stats?.monthSales || 0}</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
          
          <View style={styles.statBox}>
            <View style={[styles.statIconBg, { backgroundColor: '#F3E5F5' }]}>
              <Icon name="analytics" size={24} color="#5E5CE6" />
            </View>
            <Text style={styles.statValue}>{stats?.conversionRate || 0}%</Text>
            <Text style={styles.statLabel}>Conversion</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity 
          style={styles.actionCardPrimary}
          onPress={() => navigation.navigate('ProductList', { reseller: true })}
        >
          <View
            colors={['#4F46E5', '#7C3AED']}
            style={styles.actionCardGradient}
          >
            <Icon name="share-social" size={32} color="#fff" />
            <View style={styles.actionCardContent}>
              <Text style={styles.actionCardTitle}>Share Products</Text>
              <Text style={styles.actionCardSubtitle}>Browse & start earning</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.actionCardSmall}
            onPress={() => navigation.navigate('MySales')}
          >
            <Icon name="analytics" size={28} color="#3B82F6" />
            <Text style={styles.actionCardSmallTitle}>My Sales</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCardSmall}
            onPress={() => navigation.navigate('MyEarnings')}
          >
            <Icon name="wallet" size={28} color="#10B981" />
            <Text style={styles.actionCardSmallTitle}>Earnings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCardSmall}
            onPress={() => navigation.navigate('WithdrawHistory')}
          >
            <Icon name="time" size={28} color="#F59E0B" />
            <Text style={styles.actionCardSmallTitle}>History</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Sales */}
      {recentSales.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Sales</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MySales')}>
              <Text style={styles.sectionLink}>View All →</Text>
            </TouchableOpacity>
          </View>

          {recentSales.map((sale) => (
            <TouchableOpacity 
              key={sale._id}
              style={styles.saleCard}
              onPress={() => navigation.navigate('OrderDetails', { orderId: sale._id })}
            >
              <View style={styles.saleIcon}>
                <Icon name="checkmark-circle" size={20} color="#10B981" />
              </View>
              <View style={styles.saleDetails}>
                <Text style={styles.saleOrderNo}>Order #{sale.orderNo}</Text>
                <Text style={styles.saleDate}>
                  {new Date(sale.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.saleEarning}>
                <Text style={styles.saleAmount}>+₹{sale.resellerCommission}</Text>
                <View style={[
                  styles.saleStatus,
                  { backgroundColor: sale.orderStatus === 'delivered' ? '#10B981' : '#F59E0B' }
                ]}>
                  <Text style={styles.saleStatusText}>
                    {sale.orderStatus}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Help Section */}
      <View style={styles.helpCard}>
        <Icon name="help-circle" size={28} color="#4F46E5" />
        <View style={styles.helpContent}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            Contact our reseller support team for any questions
          </Text>
        </View>
        <TouchableOpacity style={styles.helpBtn}>
          <Icon name="chatbubble" size={20} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6B7280'
  },
  
  // Non-Reseller Hero
  heroGradient: { paddingTop: 60, paddingBottom: 40 },
  heroContent: { alignItems: 'center', paddingHorizontal: 24 },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#fff', marginTop: 20, textAlign: 'center' },
  heroSubtitle: { fontSize: 16, color: '#fff', opacity: 0.9, marginTop: 8, textAlign: 'center' },
  heroStats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, padding: 20, marginTop: 32, width: '100%' },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatValue: { fontSize: 24, fontWeight: '700', color: '#fff' },
  heroStatLabel: { fontSize: 12, color: '#fff', opacity: 0.8, marginTop: 4 },
  heroStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  heroCTA: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12, marginTop: 32 },
  heroCTAText: { fontSize: 16, fontWeight: '700', color: '#4F46E5' },
  
  // Benefits
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionLink: { fontSize: 14, fontWeight: '600', color: '#4F46E5' },
  benefitCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  benefitIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  benefitContent: { flex: 1 },
  benefitTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  benefitDesc: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  
  // Reseller Dashboard
  resellerHeader: { paddingTop: 60, paddingBottom: 24 },
  resellerHeaderContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  resellerGreeting: { fontSize: 24, fontWeight: '700', color: '#fff' },
  resellerSubtitle: { fontSize: 14, color: '#fff', opacity: 0.9, marginTop: 4 },
  notificationBtn: { position: 'relative' },
  notificationDot: { position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  
  // Earnings Card
  earningsCard: { backgroundColor: '#fff', marginHorizontal: 20, marginTop: -20, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  earningsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  earningsLabel: { fontSize: 14, color: '#6B7280' },
  earningsAmount: { fontSize: 36, fontWeight: '800', color: '#111827', marginTop: 4 },
  earningsHint: { fontSize: 12, color: '#10B981', marginTop: 2 },
  withdrawBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#10B981', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  withdrawBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  earningsStats: { flexDirection: 'row', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  earningStat: { flex: 1, alignItems: 'center' },
  earningStatLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  earningStatValue: { fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 4 },
  earningStatHint: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },
  earningsStatsDivider: { width: 1, backgroundColor: '#E5E7EB' },
  
  // Performance Card
  performanceCard: { backgroundColor: '#fff', marginHorizontal: 20, marginTop: 16, borderRadius: 16, padding: 20 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statBox: { width: '47%', alignItems: 'center', padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12 },
  statIconBg: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: '700', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4, textAlign: 'center' },
  
  // Actions
  actionCardPrimary: { overflow: 'hidden', borderRadius: 12, marginBottom: 12 },
  actionCardGradient: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  actionCardContent: { flex: 1, marginLeft: 12 },
  actionCardTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  actionCardSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionCardSmall: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center' },
  actionCardSmallTitle: { fontSize: 12, fontWeight: '600', color: '#111827', marginTop: 8, textAlign: 'center' },
  
  // Recent Sales
  saleCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  saleIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  saleDetails: { flex: 1 },
  saleOrderNo: { fontSize: 14, fontWeight: '600', color: '#111827' },
  saleDate: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  saleEarning: { alignItems: 'flex-end' },
  saleAmount: { fontSize: 16, fontWeight: '700', color: '#10B981' },
  saleStatus: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4 },
  saleStatusText: { fontSize: 10, fontWeight: '600', color: '#fff' },
  
  // Help Card
  helpCard: { flexDirection: 'row', backgroundColor: '#EEF2FF', marginHorizontal: 20, marginTop: 16, padding: 16, borderRadius: 12, alignItems: 'center' },
  helpContent: { flex: 1, marginLeft: 12 },
  helpTitle: { fontSize: 14, fontWeight: '700', color: '#4F46E5' },
  helpText: { fontSize: 12, color: '#4F46E5', marginTop: 2 },
  helpBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }
});

export default ResellerHubScreen;