// 2. INITIATE RETURN SCREEN
// screens/returns/InitiateReturnScreen.js
const InitiateReturnScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const [selectedItems, setSelectedItems] = useState([]);
  const [returnReason, setReturnReason] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const reasons = [
    { value: 'damaged', label: 'Product Damaged' },
    { value: 'wrong_product', label: 'Wrong Product Received' },
    { value: 'not_as_described', label: 'Not as Described' },
    { value: 'quality_issue', label: 'Quality Issue' },
    { value: 'other', label: 'Other' }
  ];

  const toggleItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please select at least one item to return');
      return;
    }

    if (!returnReason) {
      Alert.alert('Error', 'Please select a return reason');
      return;
    }

    setSubmitting(true);

    try {
      const returnData = {
        orderId: order._id,
        items: selectedItems.map(itemId => ({
          orderItemId: itemId,
          quantity: 1, // You can add quantity selector
          reason: returnReason
        })),
        returnReason,
        returnDescription: description,
        returnImages: images
      };

      await api.post('/returns', returnData);

      Alert.alert(
        'Return Request Submitted',
        'Your return request has been submitted successfully. We will review it within 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MyReturns')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit return request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerInfo}>
        <Icon name="arrow-back-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.headerTitle}>Return Request</Text>
        <Text style={styles.headerSubtitle}>Order #{order.orderNo}</Text>
      </View>

      {/* Select Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Items to Return</Text>
        {order.items.map((item) => (
          <TouchableOpacity
            key={item._id}
            style={[styles.itemCard, selectedItems.includes(item._id) && styles.itemCardSelected]}
            onPress={() => toggleItem(item._id)}
          >
            <View style={styles.checkbox}>
              <Icon
                name={selectedItems.includes(item._id) ? 'checkbox' : 'square-outline'}
                size={24}
                color="#4F46E5"
              />
            </View>
            <Image source={{ uri: item.productImage }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle}>{item.productTitle}</Text>
              <Text style={styles.itemPrice}>₹{item.finalPrice} x {item.quantity}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Return Reason */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reason for Return *</Text>
        {reasons.map((reason) => (
          <TouchableOpacity
            key={reason.value}
            style={[styles.reasonOption, returnReason === reason.value && styles.reasonOptionSelected]}
            onPress={() => setReturnReason(reason.value)}
          >
            <Icon
              name={returnReason === reason.value ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color="#4F46E5"
            />
            <Text style={styles.reasonText}>{reason.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Details (Optional)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe the issue in detail..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Icon name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>Submit Return Request</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};
export default InitiateReturnScreen;