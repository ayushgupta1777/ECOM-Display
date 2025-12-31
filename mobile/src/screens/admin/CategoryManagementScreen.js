import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, Alert, ActivityIndicator, TextInput, Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// import * as launchImageLibrary from 'expo-image-picker';
import { launchImageLibrary } from 'react-native-image-picker';

import api from '../../services/api';

const CategoryManagementScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data.data.categories);
    } catch (error) {
      Alert.alert('Error', 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

const pickImage = () => {
  const options = {
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
  };

  launchImageLibrary(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled');
    } else if (response.error || response.errorCode) {
      Alert.alert('Error', response.error || response.errorMessage || 'Failed to pick image');
    } else if (response.assets && response.assets.length > 0) {
      uploadImage(response.assets[0]);
    }
  });
};

  const uploadImage = async (image) => {
    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', {
        uri: image.uri,
        type: 'image/jpeg',
        name: 'category.jpg'
      });

      const response = await api.post('/upload/image', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData(prev => ({
        ...prev,
        image: response.data.data.url
      }));
      
      Alert.alert('Success', 'Image uploaded!');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (text) => {
    setFormData({
      ...formData,
      name: text,
      slug: generateSlug(text)
    });
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', image: '' });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Category name is required');
      return;
    }

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData);
        Alert.alert('Success', 'Category updated successfully');
      } else {
        await api.post('/categories', formData);
        Alert.alert('Success', 'Category created successfully');
      }
      
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = (categoryId) => {
    Alert.alert(
      'Delete Category',
      'Are you sure? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/categories/${categoryId}`);
              Alert.alert('Success', 'Category deleted');
              fetchCategories();
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete category');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity onPress={openAddModal}>
          <Icon name="add-circle" size={28} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 40 }} />
        ) : categories.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="folder-open-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No categories yet</Text>
            <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
              <Text style={styles.addBtnText}>Add First Category</Text>
            </TouchableOpacity>
          </View>
        ) : (
          categories.map((category) => (
            <View key={category._id} style={styles.categoryCard}>
              {category.image ? (
                <Image source={{ uri: category.image }} style={styles.categoryImage} />
              ) : (
                <View style={styles.categoryImagePlaceholder}>
                  <Icon name="image-outline" size={32} color="#9CA3AF" />
                </View>
              )}

              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categorySlug}>/{category.slug}</Text>
                {category.description && (
                  <Text style={styles.categoryDesc} numberOfLines={2}>
                    {category.description}
                  </Text>
                )}
              </View>

              <View style={styles.categoryActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => openEditModal(category)}
                >
                  <Icon name="create-outline" size={20} color="#4F46E5" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleDelete(category._id)}
                >
                  <Icon name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Image Upload */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Category Image</Text>
                <TouchableOpacity
                  style={styles.imageUploadBox}
                  onPress={pickImage}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <ActivityIndicator color="#4F46E5" />
                  ) : formData.image ? (
                    <Image source={{ uri: formData.image }} style={styles.uploadedImage} />
                  ) : (
                    <>
                      <Icon name="cloud-upload-outline" size={40} color="#9CA3AF" />
                      <Text style={styles.uploadHint}>Tap to upload image</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter category name"
                  value={formData.name}
                  onChangeText={handleNameChange}
                />
              </View>

              {/* Slug */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Slug</Text>
                <TextInput
                  style={styles.input}
                  placeholder="auto-generated"
                  value={formData.slug}
                  onChangeText={(text) => setFormData({ ...formData, slug: text })}
                />
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter description (optional)"
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
                <Icon name="checkmark" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>
                  {editingCategory ? 'Update' : 'Create'} Category
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
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
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  content: { flex: 1, padding: 16 },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 24
  },
  addBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15
  },
  categoryCard: {
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
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 8
  },
  categoryImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoryInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center'
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4
  },
  categorySlug: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4
  },
  categoryDesc: {
    fontSize: 13,
    color: '#9CA3AF'
  },
  categoryActions: {
    justifyContent: 'space-around'
  },
  actionBtn: {
    padding: 8
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827'
  },
  modalBody: {
    padding: 20
  },
  formGroup: {
    marginBottom: 16
  },
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
    height: 80,
    textAlignVertical: 'top'
  },
  imageUploadBox: {
    height: 150,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB'
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8
  },
  uploadHint: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8
  },
  saveBtn: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius:8,
marginTop: 8
},
saveBtnText: {
fontSize: 16,
fontWeight: '700',
color: '#fff'
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
export default CategoryManagementScreen;