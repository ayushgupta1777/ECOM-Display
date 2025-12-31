import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  Image, StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// import * as launchImageLibrary from 'expo-image-picker';
import { launchImageLibrary } from 'react-native-image-picker';

import api from '../../services/api';

const AddProductScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    mrp: '',
    stock: '',
    images: []
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data.categories);
    } catch (error) {
      Alert.alert('Error', 'Failed to load categories');
    }
  };

const pickImages = () => {
  const options = {
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    selectionLimit: 0, // 0 = unlimited, allows multiple selection
  };

  launchImageLibrary(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled');
    } else if (response.error || response.errorCode) {
      Alert.alert('Error', response.error || response.errorMessage || 'Failed to pick images');
    } else if (response.assets && response.assets.length > 0) {
      uploadImages(response.assets);
    }
  });
};

  const uploadImages = async (images) => {
    setIsUploading(true);
    const uploadedUrls = [];

    try {
      for (const image of images) {
        const formData = new FormData();
        formData.append('image', {
          uri: image.uri,
          type: 'image/jpeg',
          name: 'upload.jpg'
        });

        const response = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        uploadedUrls.push(response.data.data.url);
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      
      Alert.alert('Success', `${uploadedUrls.length} images uploaded!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload images');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const calculateDiscount = () => {
    const mrp = parseFloat(formData.mrp);
    const price = parseFloat(formData.price);
    if (mrp && price && mrp > price) {
      return Math.round(((mrp - price) / mrp) * 100);
    }
    return 0;
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Product title is required');
      return false;
    }
    if (!formData.category) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      Alert.alert('Error', 'Valid price is required');
      return false;
    }
    if (!formData.mrp || parseFloat(formData.mrp) <= 0) {
      Alert.alert('Error', 'Valid MRP is required');
      return false;
    }
    if (parseFloat(formData.price) > parseFloat(formData.mrp)) {
      Alert.alert('Error', 'Price cannot be greater than MRP');
      return false;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      Alert.alert('Error', 'Valid stock quantity is required');
      return false;
    }
    if (formData.images.length === 0) {
      Alert.alert('Error', 'At least one product image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        mrp: parseFloat(formData.mrp),
        stock: parseInt(formData.stock),
        discount: calculateDiscount()
      };

      const response = await api.post('/admin/products', productData);

      if (response.data.success) {
        Alert.alert('Success', 'Product added successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Product Images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Images *</Text>
          <Text style={styles.sectionSubtitle}>Upload up to 5 images</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {formData.images.map((uri, index) => (
              <View key={index} style={styles.imagePreview}>
                <Image source={{ uri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => removeImage(index)}
                >
                  <Icon name="close-circle" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}

            {formData.images.length < 5 && (
              <TouchableOpacity
                style={styles.uploadBox}
                onPress={pickImages}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator color="#4F46E5" />
                ) : (
                  <>
                    <Icon name="cloud-upload-outline" size={32} color="#9CA3AF" />
                    <Text style={styles.uploadText}>Upload Images</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Product Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter product title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter product description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.pickerWrapper}>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => {
                  Alert.alert(
                    'Select Category',
                    '',
                    categories.map(cat => ({
                      text: cat.name,
                      onPress: () => setFormData({ ...formData, category: cat._id })
                    }))
                  );
                }}
              >
                <Text style={styles.pickerText}>
                  {formData.category
                    ? categories.find(c => c._id === formData.category)?.name
                    : 'Select Category'}
                </Text>
                <Icon name="chevron-down" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>MRP *</Text>
              <TextInput
                style={styles.input}
                placeholder="₹0"
                value={formData.mrp}
                onChangeText={(text) => setFormData({ ...formData, mrp: text })}
                keyboardType="numeric"
              />
            </View>

            <View style={{ width: 12 }} />

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Selling Price *</Text>
              <TextInput
                style={styles.input}
                placeholder="₹0"
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                keyboardType="numeric"
              />
            </View>
          </View>

          {calculateDiscount() > 0 && (
            <View style={styles.discountBox}>
              <Icon name="pricetag" size={18} color="#10B981" />
              <Text style={styles.discountText}>
                {calculateDiscount()}% discount
              </Text>
            </View>
          )}
        </View>

        {/* Inventory */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventory</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Stock Quantity *</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={formData.stock}
              onChangeText={(text) => setFormData({ ...formData, stock: text })}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={isLoading || isUploading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="checkmark" size={22} color="#fff" />
              <Text style={styles.submitBtnText}>Add Product</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  content: { flex: 1 },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 20
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 16 },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
    position: 'relative'
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8
  },
  removeImageBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12
  },
  uploadBox: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB'
  },
  uploadText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8
  },
  formGroup: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827'
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  pickerWrapper: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  pickerText: {
    fontSize: 15,
    color: '#111827'
  },
  row: {
    flexDirection: 'row'
  },
  discountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 8
  },
  discountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981'
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB'
  },
  submitBtn: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff'
  }
});

export default AddProductScreen;