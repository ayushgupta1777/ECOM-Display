import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Alert, ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getWallet, requestWithdrawal } from '../../redux/slices/resellerSlice';
import Icon from 'react-native-vector-icons/Ionicons';

const WalletScreen = () => {
  const dispatch = useDispatch();
  const { wallet, isLoading } = useSelector((state) => state.reseller);
  const { user } = useSelector((state) => state.auth);
  const [withdrawAmount, setWithdrawAmount] = React.useState('');

  useEffect(() => {
    if (user?.resellerApplication?.status === 'approved') {
      dispatch(getWallet());
    }
  }, [user]);

  if (!user?.resellerApplication?.status === 'approved') {
    return (
      <View style={styles.notApprovedContainer}>
        <Icon name="lock-closed-outline" size={48} color="#9CA3AF" />
        <Text style={styles.notApprovedText}>
          Apply as reseller first to access your wallet
        </Text>
      </View>
    );
  }

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);

    if (!amount || amount <= 0) {
      Alert.alert('Error', 'Enter valid amount');
      return;
    }

    if (amount < 100) {
      Alert.alert('Error', 'Minimum withdrawal is ₹100');
      return;
    }

    if (amount > wallet.balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    const result = await dispatch(requestWithdrawal({ amount }));
    
    if (result.payload) {
      Alert.alert('Success', 'Withdrawal request submitted! Amount will be transferred within 2-3 business days.');
      setWithdrawAmount('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View>
          <Text style={styles.cardLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₹{wallet.balance || 0}</Text>
        </View>
        <Icon name="wallet-outline" size={40} color="#fff" />
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Icon name="time-outline" size={20} color="#FF9500" />
          <Text style={styles.statLabel}>Pending</Text>
          <Text style={styles.statValue}>₹{wallet.pendingBalance || 0}</Text>
        </View>

        <View style={styles.statBox}>
          <Icon name="trending-up-outline" size={20} color="#10B981" />
          <Text style={styles.statLabel}>Total Earned</Text>
          <Text style={styles.statValue}>₹{wallet.totalEarned || 0}</Text>
        </View>
      </View>

      {/* Withdraw Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Withdraw Money</Text>

        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>Amount *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount (min ₹100)"
            value={withdrawAmount}
            onChangeText={setWithdrawAmount}
            keyboardType="decimal-pad"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <TouchableOpacity
          style={[styles.withdrawBtn, isLoading && styles.btnDisabled]}
          onPress={handleWithdraw}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Icon name="arrow-down" size={18} color="#fff" />
              <Text style={styles.withdrawBtnText}>Request Withdrawal</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>
          💡 Minimum: ₹100\n📅 Transfer in 2-3 business days\n🏦 To your registered bank account
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  notApprovedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  notApprovedText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280'
  },
  balanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    margin: 16,
    marginBottom: 24,
    padding: 24,
    borderRadius: 12
  },
  cardLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  balanceAmount: { fontSize: 32, fontWeight: '700', color: '#fff', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 24 },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center'
  },
  statLabel: { fontSize: 11, color: '#6B7280', marginTop: 8 },
  statValue: { fontSize: 16, fontWeight: '700', color: '#111827', marginTop: 4 },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  inputBox: { marginBottom: 12 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#fff'
  },
  withdrawBtn: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16
  },
  btnDisabled: { opacity: 0.6 },
  withdrawBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  note: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8
  }
});

export default WalletScreen;