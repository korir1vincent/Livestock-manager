import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, HelperText, SegmentedButtons } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddAnimalScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    tagId: '',
    type: 'Cattle',
    breed: '',
    gender: 'Female',
    dateOfBirth: new Date(),
    weight: '',
    color: '',
    healthStatus: 'Healthy',
    pregnancyStatus: 'Not Pregnant',
    notes: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { getAuthenticatedAxios } = useAuth();

  const handleSubmit = async () => {
    setError('');

    if (!formData.name || !formData.tagId || !formData.type) {
      setError('Please fill in required fields (Name, Tag ID, Type)');
      return;
    }

    setLoading(true);

    try {
      const api = getAuthenticatedAxios();
      const dataToSend = {
        ...formData,
        weight: formData.weight ? parseFloat(formData.weight) : undefined
      };
      
      await api.post('/animals', dataToSend);
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add animal');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <Title style={styles.title}>Add New Animal</Title>

          <TextInput
            label="Name *"
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Tag ID *"
            value={formData.tagId}
            onChangeText={(value) => updateField('tagId', value)}
            mode="outlined"
            style={styles.input}
          />

          <SegmentedButtons
            value={formData.type}
            onValueChange={(value) => updateField('type', value)}
            buttons={[
              { value: 'Cattle', label: 'Cattle' },
              { value: 'Goat', label: 'Goat' },
              { value: 'Sheep', label: 'Sheep' },
              { value: 'Pig', label: 'Pig' }
            ]}
            style={styles.input}
          />

          <TextInput
            label="Breed"
            value={formData.breed}
            onChangeText={(value) => updateField('breed', value)}
            mode="outlined"
            style={styles.input}
          />

          <SegmentedButtons
            value={formData.gender}
            onValueChange={(value) => updateField('gender', value)}
            buttons={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' }
            ]}
            style={styles.input}
          />

          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            Date of Birth: {formData.dateOfBirth.toLocaleDateString()}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={formData.dateOfBirth}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  updateField('dateOfBirth', selectedDate);
                }
              }}
              maximumDate={new Date()}
            />
          )}

          <TextInput
            label="Weight (kg)"
            value={formData.weight}
            onChangeText={(value) => updateField('weight', value)}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Color"
            value={formData.color}
            onChangeText={(value) => updateField('color', value)}
            mode="outlined"
            style={styles.input}
          />

          <SegmentedButtons
            value={formData.healthStatus}
            onValueChange={(value) => updateField('healthStatus', value)}
            buttons={[
              { value: 'Healthy', label: 'Healthy' },
              { value: 'Sick', label: 'Sick' }
            ]}
            style={styles.input}
          />

          {formData.gender === 'Female' && (
            <SegmentedButtons
              value={formData.pregnancyStatus}
              onValueChange={(value) => updateField('pregnancyStatus', value)}
              buttons={[
                { value: 'Not Pregnant', label: 'Not Pregnant' },
                { value: 'Pregnant', label: 'Pregnant' }
              ]}
              style={styles.input}
            />
          )}

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
            Add Animal
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
            
          >
            Cancel
          </Button>
        </View>
      </ScrollView>
      </SafeAreaView>
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
  input: {
    marginBottom: 16
  },
  button: {
    marginTop: 8,
    paddingVertical: 6
  }
});

export default AddAnimalScreen;