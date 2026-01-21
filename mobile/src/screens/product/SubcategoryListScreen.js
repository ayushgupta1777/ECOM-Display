import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
  ActivityIndicator, StyleSheet, SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../../services/api';

const SubcategoryListScreen = ({ route }) => {
  const { categoryId, categoryName } = route.params;
  const navigation = useNavigation();

  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubcategories();
  }, [categoryId]);

  const fetchSubcategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/categories', {
        params: { parent: categoryId }
      });
      setSubcategories(response.data.data.categories);
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSubcategory = ({ item }) => (
    <TouchableOpacity
      style={styles.subcategoryCard}
      onPress={() => navigation.navigate('ProductList', {
        subcategoryId: item._id,
        subcategoryName: item.name,
        categoryName: categoryName
      })}
      activeOpacity={0.8}
    >
      <View style={styles.subcategoryImageContainer}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.subcategoryImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.subcategoryImagePlaceholder}>
            <Icon name="image-outline" size={32} color="#9CA3AF" />
          </View>
        )}
      </View>

      <View style={styles.subcategoryInfo}>
        <Text style={styles.subcategoryName}>{item.name}</Text>
        <Text style={styles.subcategoryDescription}>
          {item.description || 'Explore our collection'}
        </Text>
      </View>

      <Icon name="chevron-forward" size={24} color="#6B7280" />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading subcategories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Subcategories List */}
      {subcategories.length > 0 ? (
        <FlatList
          data={subcategories}
          renderItem={renderSubcategory}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="folder-open-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>No subcategories found</Text>
          <Text style={styles.emptySubtext}>
            Subcategories will be added soon for {categoryName}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerRight: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  listContainer: {
    padding: 16,
  },
  subcategoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  subcategoryImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
  },
  subcategoryImage: {
    width: '100%',
    height: '100%',
  },
  subcategoryImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subcategoryInfo: {
    flex: 1,
  },
  subcategoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  subcategoryDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default SubcategoryListScreen;