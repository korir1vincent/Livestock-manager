import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, HelperText, SegmentedButtons } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddInventoryScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Medicine',
    quantity: '',
    unit: '',
    minQuantity: '',
    unitPrice: '',
    supplier: {
      name: '',
      contact: ''
    },
    expiryDate: null,
    batchNumber: '',
    location: '',
    notes: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { getAuthenticatedAxios } = useAuth();

  const handleSubmit = async () => {
    setError('');

    if (!formData.name || !formData.category || !formData.quantity || !formData.unit) {
      setError('Please fill in required fields (Name, Category, Quantity, Unit)');
      return;
    }

    setLoading(true);

    try {
      const api = getAuthenticatedAxios();
      const dataToSend = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        minQuantity: formData.minQuantity ? parseFloat(formData.minQuantity) : 5,
        unitPrice: formData.unitPrice ? parseFloat(formData.unitPrice) : undefined
      };

      await api.post('/inventory', dataToSend);
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const updateSupplier = (field, value) => {
    setFormData({
      ...formData,
      supplier: { ...formData.supplier, [field]: value }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <SafeAreaView>
        <View style={styles.content}>
          <Title style={styles.title}>Add Inventory Item</Title>

          <TextInput
            label="Item Name *"
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
            mode="outlined"
            style={styles.input}
          />

          <View style={styles.inputGroup}>
            <Title style={styles.label}>Category *</Title>
            <SegmentedButtons
              value={formData.category}
              onValueChange={(value) => updateField('category', value)}
              buttons={[
                { value: 'Medicine', label: 'Medicine' },
                { value: 'Vaccine', label: 'Vaccine' },
                { value: 'Feed', label: 'Feed' }
              ]}
              style={styles.input}
            />
            <SegmentedButtons
              value={formData.category}
              onValueChange={(value) => updateField('category', value)}
              buttons={[
                { value: 'Equipment', label: 'Equipment' },
                { value: 'Supplement', label: 'Supplement' },
                { value: 'Other', label: 'Other' }
              ]}
              style={styles.input}
            />
          </View>

          <View style={styles.row}>
            <TextInput
              label="Quantity *"
              value={formData.quantity}
              onChangeText={(value) => updateField('quantity', value)}
              mode="outlined"
              keyboardType="numeric"
              style={[styles.input, styles.halfInput]}
            />
            <TextInput
              label="Unit *"
              value={formData.unit}
              onChangeText={(value) => updateField('unit', value)}
              mode="outlined"
              placeholder="kg, bottles, bags"
              style={[styles.input, styles.halfInput]}
            />
          </View>

          <View style={styles.row}>
            <TextInput
              label="Min Quantity"
              value={formData.minQuantity}
              onChangeText={(value) => updateField('minQuantity', value)}
              mode="outlined"
              keyboardType="numeric"
              placeholder="Alert threshold"
              style={[styles.input, styles.halfInput]}
            />
            <TextInput
              label="Unit Price"
              value={formData.unitPrice}
              onChangeText={(value) => updateField('unitPrice', value)}
              mode="outlined"
              keyboardType="numeric"
              placeholder="Price per unit"
              style={[styles.input, styles.halfInput]}
            />
          </View>

          <TextInput
            label="Batch Number"
            value={formData.batchNumber}
            onChangeText={(value) => updateField('batchNumber', value)}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Storage Location"
            value={formData.location}
            onChangeText={(value) => updateField('location', value)}
            mode="outlined"
            placeholder="e.g., Main Barn, Shelf A"
            style={styles.input}
          />

          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            Expiry Date: {formData.expiryDate ? formData.expiryDate.toLocaleDateString() : 'Not Set'}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={formData.expiryDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  updateField('expiryDate', selectedDate);
                }
              }}
              minimumDate={new Date()}
            />
          )}

          <Title style={styles.sectionTitle}>Supplier Information</Title>

          <TextInput
            label="Supplier Name"
            value={formData.supplier.name}
            onChangeText={(value) => updateSupplier('name', value)}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Supplier Contact"
            value={formData.supplier.contact}
            onChangeText={(value) => updateSupplier('contact', value)}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            label="Notes"
            value={formData.notes}
            onChangeText={(value) => updateField('notes', value)}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          {error ? <HelperText type="error">{error}</HelperText> : null}

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
            buttonColor="#16a34a"
          >
            Add Item
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
            
          >
            Cancel
          </Button>
        </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6'
  },
  scrollView: {
    flexGrow: 1
  },
  content: {
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    color: '#374151'
  },
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151'
  },
  input: {
    marginBottom: 16
  },
  row: {
    flexDirection: 'row',
    gap: 12
  },
  halfInput: {
    flex: 1
  },
  button: {
    marginTop: 8,
    paddingVertical: 6
  }
});

export default AddInventoryScreen;