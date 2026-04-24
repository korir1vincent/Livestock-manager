import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, HelperText, SegmentedButtons } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
const AddExpenseScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    category: 'Feed',
    description: '',
    amount: '',
    date: new Date(),
    animalId: '',
    notes: ''
  });
  const [animals, setAnimals] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { getAuthenticatedAxios } = useAuth();

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const api = getAuthenticatedAxios();
      const response = await api.get('/animals');
      setAnimals(response.data.animals);
    } catch (error) {
      console.error('Error fetching animals:', error);
    }
  };

  const handleSubmit = async () => {
    setError('');

    if (!formData.description || !formData.amount) {
      setError('Please fill in required fields (Description, Amount)');
      return;
    }

    setLoading(true);

    try {
      const api = getAuthenticatedAxios();
      const dataToSend = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      await api.post('/financial/expenses', dataToSend);
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <Title style={styles.title}>Add Expense</Title>

          <View style={styles.inputGroup}>
            <Title style={styles.label}>Category</Title>
            <SegmentedButtons
              value={formData.category}
              onValueChange={(value) => updateField('category', value)}
              buttons={[
                { value: 'Feed', label: 'Feed' },
                { value: 'Veterinary', label: 'Veterinary' },
                { value: 'Medicine', label: 'Medicine' }
              ]}
              style={styles.input}
            />
            <SegmentedButtons
              value={formData.category}
              onValueChange={(value) => updateField('category', value)}
              buttons={[
                { value: 'Equipment', label: 'Equipment' },
                { value: 'Labor', label: 'Labor' },
                { value: 'Other', label: 'Other' }
              ]}
              style={styles.input}
            />
          </View>

          <TextInput
            label="Description *"
            value={formData.description}
            onChangeText={(value) => updateField('description', value)}
            mode="outlined"
            placeholder="e.g., Monthly feed purchase"
            style={styles.input}
          />

          <TextInput
            label="Amount *"
            value={formData.amount}
            onChangeText={(value) => updateField('amount', value)}
            mode="outlined"
            keyboardType="numeric"
            placeholder="0.00"
            left={<TextInput.Affix text="$" />}
            style={styles.input}
          />

          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            Date: {formData.date.toLocaleDateString()}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  updateField('date', selectedDate);
                }
              }}
              maximumDate={new Date()}
            />
          )}

          <View style={styles.pickerContainer}>
            <Title style={styles.label}>Animal (Optional)</Title>
            <Picker
              selectedValue={formData.animalId}
              onValueChange={(value) => updateField('animalId', value)}
              style={styles.picker}
            >
              <Picker.Item label="General Expense" value="" />
              {animals.map((animal) => (
                <Picker.Item
                  key={animal._id}
                  label={`${animal.name} (${animal.tagId})`}
                  value={animal._id}
                />
              ))}
            </Picker>
          </View>

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
            Add Expense
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
            buttonColor="#e20f1a"
          >
            Cancel
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
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
  pickerContainer: {
    marginBottom: 16
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db'
  },
  button: {
    marginTop: 8,
    paddingVertical: 6
  }
});

export default AddExpenseScreen;