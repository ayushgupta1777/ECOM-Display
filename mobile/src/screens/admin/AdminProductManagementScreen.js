import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, TextInput, Image
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import api, { getImageUrl } from '../../services/api';

const AdminProductManagementScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, approved, pending, rejected
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Refresh when screen focuses or filter changes
  useFocusEffect(
    useCallback(() => {
      setPage(1);
      fetchProducts(1, true);
    }, [filter])
  );

  // Debounced Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        setPage(1);
        fetchProducts(1, true);
      } else if (searchQuery === '' && products.length > 0) {
        // Only reset if it was previously filtered
        setPage(1);
        fetchProducts(1, true);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchProducts = async (pageNumber = 1, shouldReset = false) => {
    try {
      if (pageNumber === 1) {
        setIsLoading(true);
      } else {
        setIsMoreLoading(true);
      }

      const response = await api.get('/admin/products', {
        params: {
          status: filter !== 'all' ? filter : undefined,
          page: pageNumber,
          limit: 20,
          search: searchQuery || undefined
        }
      });

      const newProducts = response.data.data.products;
      if (shouldReset) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }

      setTotalPages(response.data.data.pagination.pages);
      setPage(pageNumber);
    } catch (error) {
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!isMoreLoading && page < totalPages) {
      fetchProducts(page + 1);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchProducts(1, true);
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

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      await api.patch(`/admin/products/${productId}/toggle`, {
        isActive: !currentStatus
      });
      // Update local state to reflect change immediately
      setProducts(prev => prev.map(p =>
        p._id === productId ? { ...p, isActive: !currentStatus } : p
      ));
    } catch (error) {
      Alert.alert('Error', 'Failed to update product status');
    }
  };

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
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => {
            setSearchQuery('');
            setPage(1);
            fetchProducts(1, true);
          }}>
            <Icon name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={{ height: 60 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={{ alignItems: 'center', paddingRight: 16 }}
        >
          {['all', 'approved', 'pending', 'rejected'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                filter === status && styles.filterChipActive
              ]}
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
      </View>

      {/* Products List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item: product }) => (
          <View style={styles.productCard}>
            <Image
              source={{ uri: getImageUrl(product.images[0]) }}
              style={styles.productImage}
            />

            <View style={styles.productDetails}>
              <Text style={styles.productTitle} numberOfLines={2}>
                {product.title}
              </Text>
              <View style={styles.productIdRow}>
                <Text style={styles.productIdText}>ID: {product._id}</Text>
                <Text style={styles.productIdText}> | SKU: {product.sku}</Text>
              </View>

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
                  onPress={() => handleToggleStatus(product._id, product.isActive)}
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
                onPress={() => navigation.navigate('AddProduct', { product })}
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
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.emptyState}>
              <Icon name="cube-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          )
        }
        ListHeaderComponent={
          isLoading && page === 1 ? (
            <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 40 }} />
          ) : null
        }
        ListFooterComponent={
          isMoreLoading ? (
            <ActivityIndicator size="small" color="#4F46E5" style={{ marginVertical: 20 }} />
          ) : <View style={{ height: 100 }} />
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      />

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
    paddingLeft: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    height: 36, // Explicit height to avoid stretching
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
    marginBottom: 2
  },
  productIdRow: {
    flexDirection: 'row',
    marginBottom: 6
  },
  productIdText: {
    fontSize: 10,
    color: '#6B7280',
    fontFamily: 'monospace'
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