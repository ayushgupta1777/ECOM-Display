import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  Image, StyleSheet, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../../services/api';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ products: [], categories: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const debounce = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(debounce);
    } else {
      setResults({ products: [], categories: [] });
    }
  }, [query]);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/search', {
        params: { query }
      });
      setResults(response.data.data);
      
      // Save to recent searches
      if (query.trim() && !recentSearches.includes(query.trim())) {
        setRecentSearches(prev => [query.trim(), ...prev].slice(0, 5));
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductPress = (productId) => {
    navigation.navigate('ProductDetails', { productId });
  };

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('ProductList', { category: categoryId });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item._id)}
    >
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.productPriceRow}>
          <Text style={styles.productPrice}>₹{item.price}</Text>
          {item.mrp > item.price && (
            <Text style={styles.productMRP}>₹{item.mrp}</Text>
          )}
        </View>
        {item.category && (
          <Text style={styles.productCategory}>{item.category.name}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryChip}
      onPress={() => handleCategoryPress(item._id)}
    >
      <Icon name="folder-outline" size={18} color="#4F46E5" />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, categories..."
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Icon name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : query.trim().length === 0 ? (
        <View style={styles.emptyState}>
          {recentSearches.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentItem}
                  onPress={() => setQuery(search)}
                >
                  <Icon name="time-outline" size={18} color="#6B7280" />
                  <Text style={styles.recentText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={styles.emptyIconContainer}>
            <Icon name="search-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>Start typing to search</Text>
          </View>
        </View>
      ) : results.products.length === 0 && results.categories.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="sad-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>No results found</Text>
          <Text style={styles.emptySubtext}>Try different keywords</Text>
        </View>
      ) : (
        <FlatList
          data={results.products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.resultsContainer}
          ListHeaderComponent={() => (
            <>
              {results.categories.length > 0 && (
                <View style={styles.categoriesSection}>
                  <Text style={styles.sectionTitle}>Categories</Text>
                  <FlatList
                    data={results.categories}
                    renderItem={renderCategory}
                    keyExtractor={(item) => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              )}
              {results.products.length > 0 && (
                <Text style={styles.sectionTitle}>
                  Products ({results.products.length})
                </Text>
              )}
            </>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  emptyIconContainer: {
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8
  },
  recentSection: {
    alignSelf: 'stretch',
    paddingHorizontal: 16,
    marginBottom: 40
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    paddingHorizontal: 16
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  recentText: {
    fontSize: 15,
    color: '#374151'
  },
  resultsContainer: {
    paddingBottom: 20
  },
  categoriesSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 16
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5'
  },
  productCard: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5'
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center'
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5'
  },
  productMRP: {
    fontSize: 13,
    color: '#9CA3AF',
    textDecorationLine: 'line-through'
  },
  productCategory: {
    fontSize: 12,
    color: '#6B7280'
  }
});

export default SearchScreen;