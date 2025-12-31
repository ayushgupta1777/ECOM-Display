// ============================================
// mobile/src/screens/product/ProductListScreen.js
// PREMIUM STYLING VERSION
// ============================================
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  RefreshControl,
  Animated,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styling/screens/product/ProductListPremiumStyles';

const ProductListScreen = ({ route, navigation }) => {
  const { category } = route.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const filterAnim = new Animated.Value(0);

  const dispatch = useDispatch();
  const { items: products, isLoading, pagination } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ category, search: searchQuery }));
  }, [category, searchQuery]);

  useEffect(() => {
    Animated.timing(filterAnim, {
      toValue: showFilters ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showFilters]);

  const sortOptions = [
    { label: 'Popular', value: 'popular' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Newest First', value: 'newest' },
    { label: 'Rating', value: 'rating' }
  ];

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles['product-list-premium-card']}
      onPress={() => navigation.navigate('ProductDetails', { productId: item._id })}
      activeOpacity={0.8}
    >
      <View style={styles['product-list-premium-image-container']}>
        <Image 
          source={{ uri: item.images[0] }} 
          style={styles['product-list-premium-image']}
        />
        {item.discount > 0 && (
          <View style={styles['product-list-premium-discount-badge']}>
            <Text style={styles['product-list-premium-discount-badge-text']}>
              {item.discount}%
            </Text>
            <Text style={styles['product-list-premium-discount-label']}>OFF</Text>
          </View>
        )}
      </View>

      <View style={styles['product-list-premium-info']}>
        <Text 
          style={styles['product-list-premium-title']} 
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {item.averageRating > 0 && (
          <View style={styles['product-list-premium-rating']}>
            <Icon name="star" size={13} color="#FF9500" />
            <Text style={styles['product-list-premium-rating-text']}>
              {item.averageRating.toFixed(1)}
            </Text>
            <Text style={styles['product-list-premium-review-count']}>
              ({item.reviewCount || 0})
            </Text>
          </View>
        )}

        <View style={styles['product-list-premium-price-row']}>
          <Text style={styles['product-list-premium-price']}>
            ₹{item.price}
          </Text>
          {item.mrp > item.price && (
            <Text style={styles['product-list-premium-mrp']}>
              ₹{item.mrp}
            </Text>
          )}
        </View>

        <View style={styles['product-list-premium-stock-indicator']}>
          {item.stock > 0 ? (
            <View style={styles['product-list-premium-stock-in']}>
              <View style={styles['product-list-premium-stock-dot']} />
              <Text style={styles['product-list-premium-stock-text']}>
                In Stock
              </Text>
            </View>
          ) : (
            <View style={styles['product-list-premium-stock-out']}>
              <View style={styles['product-list-premium-stock-dot-out']} />
              <Text style={styles['product-list-premium-stock-text-out']}>
                Out of Stock
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles['product-list-premium-container']}>
      {/* Header */}
      <View style={styles['product-list-premium-header']}>
        <View style={styles['product-list-premium-search-wrapper']}>
          <Icon name="search-outline" size={18} color="#4A4A4A" />
          <TextInput
            style={styles['product-list-premium-search-input']}
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <Icon name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles['product-list-premium-filter-button']}
          onPress={() => setShowFilters(!showFilters)}
          activeOpacity={0.7}
        >
          <Icon 
            name={showFilters ? 'close' : 'filter-outline'} 
            size={20} 
            color="#0A84FF" 
          />
        </TouchableOpacity>
      </View>

      {/* Filters & Sort */}
      {showFilters && (
        <Animated.View style={styles['product-list-premium-filters-section']}>
          <Text style={styles['product-list-premium-filter-title']}>Sort By</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles['product-list-premium-sort-scroll']}
          >
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles['product-list-premium-sort-chip'],
                  sortBy === option.value && styles['product-list-premium-sort-chip-active']
                ]}
                onPress={() => setSortBy(option.value)}
                activeOpacity={0.8}
              >
                <Text 
                  style={[
                    styles['product-list-premium-sort-chip-text'],
                    sortBy === option.value && styles['product-list-premium-sort-chip-text-active']
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {/* Results Count */}
      <View style={styles['product-list-premium-results-header']}>
        <Text style={styles['product-list-premium-results-text']}>
          {pagination?.total || 0} Products
          {category && <Text style={styles['product-list-premium-results-category']}> in {category}</Text>}
        </Text>
      </View>

      {/* Product Grid */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles['product-list-premium-grid-container']}
        columnWrapperStyle={styles['product-list-premium-grid-wrapper']}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => dispatch(fetchProducts({ category, search: searchQuery }))}
            tintColor="#0A84FF"
          />
        }
        ListEmptyComponent={
          <View style={styles['product-list-premium-empty-state']}>
            <View style={styles['product-list-premium-empty-icon-bg']}>
              <Icon name="search-outline" size={56} color="#9CA3AF" />
            </View>
            <Text style={styles['product-list-premium-empty-title']}>
              No products found
            </Text>
            <Text style={styles['product-list-premium-empty-subtitle']}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default ProductListScreen;