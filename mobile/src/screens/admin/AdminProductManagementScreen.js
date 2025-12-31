import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, TextInput, Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../../services/api';

const AdminProductManagementScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, approved, pending, rejected

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/admin/products', {
        params: { status: filter !== 'all' ? filter : undefined }
      });
      setProducts(response.data.data.products);
    } catch (error) {
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (productId) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/admin/products/${productId}`);
              Alert.alert('Success', 'Product deleted');
              fetchProducts();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product');
            }
          }
        }
      ]
    );
  };

  const toggleActive = async (productId, currentStatus) => {
    try {
      await api.patch(`/admin/products/${productId}/toggle`, {
        isActive: !currentStatus
      });
      fetchProducts();
    } catch (error) {
      Alert.alert('Error', 'Failed to update product status');
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      draft: '#6B7280',
      pending: '#F59E0B',
      approved: '#10B981',
      rejected: '#EF4444'
    };
    return colors[status] || '#6B7280';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product Management</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Icon name="add-circle" size={28} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        {['all', 'approved', 'pending', 'rejected'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterChip, filter === status && styles.filterChipActive]}
            onPress={() => setFilter(status)}
          >
            <Text style={[
              styles.filterChipText,
              filter === status && styles.filterChipTextActive
            ]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products List */}
      <ScrollView style={styles.productsList}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 40 }} />
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="cube-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        ) : (
          filteredProducts.map((product) => (
            <View key={product._id} style={styles.productCard}>
              <Image
                source={{ uri: product.images[0] }}
                style={styles.productImage}
              />
              
              <View style={styles.productDetails}>
                <Text style={styles.productTitle} numberOfLines={2}>
                  {product.title}
                </Text>
                
                <View style={styles.productMeta}>
                  <Text style={styles.productPrice}>₹{product.price}</Text>
                  <Text style={styles.productMRP}>₹{product.mrp}</Text>
                  <Text style={styles.productDiscount}>{product.discount}% OFF</Text>
                </View>

                <View style={styles.productStats}>
                  <View style={styles.statItem}>
                    <Icon name="eye-outline" size={14} color="#6B7280" />
                    <Text style={styles.statText}>{product.viewCount}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Icon name="cart-outline" size={14} color="#6B7280" />
                    <Text style={styles.statText}>{product.soldCount}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Icon name="cube-outline" size={14} color="#6B7280" />
                    <Text style={styles.statText}>Stock: {product.stock}</Text>
                  </View>
                </View>

                <View style={styles.productFooter}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(product.status) + '20' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(product.status) }
                    ]}>
                      {product.status.toUpperCase()}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.activeToggle, !product.isActive && styles.inactiveToggle]}
                    onPress={() => toggleActive(product._id, product.isActive)}
                  >
                    <Icon
                      name={product.isActive ? 'checkmark-circle' : 'close-circle'}
                      size={16}
                      color="#fff"
                    />
                    <Text style={styles.activeText}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.productActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => navigation.navigate('EditProduct', { productId: product._id })}
                >
                  <Icon name="create-outline" size={20} color="#4F46E5" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleDelete(product._id)}
                >
                  <Icon name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827'
  },
  addBtn: {
    padding: 4
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  searchIcon: {
    marginRight: 12
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827'
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  filterChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5'
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280'
  },
  filterChipTextActive: {
    color: '#fff'
  },
  productsList: {
    flex: 1,
    paddingHorizontal: 16
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8
  },
  productDetails: {
    flex: 1,
    marginLeft: 12
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827'
  },
  productMRP: {
    fontSize: 13,
    color: '#9CA3AF',
    textDecorationLine: 'line-through'
  },
  productDiscount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981'
  },
  productStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  statText: {
    fontSize: 12,
    color: '#6B7280'
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700'
  },
  activeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  inactiveToggle: {
    backgroundColor: '#EF4444'
  },
  activeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff'
  },
  productActions: {
    justifyContent: 'space-between'
  },
  actionBtn: {
    padding: 8
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4F46E5',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  }
});

export default AdminProductManagementScreen;