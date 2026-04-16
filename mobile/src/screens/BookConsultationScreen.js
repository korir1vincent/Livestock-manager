// src/screens/BookConsultationScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, HelperText, SegmentedButtons, Text, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const BookConsultationScreen = ({ route, navigation }) => {
  const { vetId } = route.params;
  const [vet, setVet] = useState(null);
  const [formData, setFormData] = useState({
    type: 'Text',
    scheduledDate: new Date(),
    symptoms: '',
    animalId: '',
    notes: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { getAuthenticatedAxios } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const api = getAuthenticatedAxios();
      const [vetRes, animalsRes] = await Promise.all([
        api.get(`/vet/${vetId}`),
        api.get('/animals')
      ]);
      setVet(vetRes.data.vet);
      setAnimals(animalsRes.data.animals || []);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (!formData.symptoms) {
      setError('Please describe the symptoms');
      return;
    }
    setSaving(true);
    try {
      const api = getAuthenticatedAxios();
      await api.post('/vet/consultations', {
        ...formData,
        vetId,
        cost: vet.consultationFee,
        animalId: formData.animalId || undefined
      });
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book consultation');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => setFormData({ ...formData, [field]: value });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <Title style={styles.title}>Book Consultation</Title>

          {vet && (
            <View style={styles.vetSummary}>
              <Text style={styles.vetName}>Dr. {vet.name}</Text>
              <Text style={styles.vetSpecialty}>{vet.specialty}</Text>
              <Text style={styles.vetFee}>Consultation Fee: ${vet.consultationFee}</Text>
            </View>
          )}

          <Text style={styles.label}>Consultation Type</Text>
          <SegmentedButtons
            value={formData.type}
            onValueChange={(value) => updateField('type', value)}
            buttons={[
              { value: 'Text', label: 'Text' },
              { value: 'Video', label: 'Video' },
              { value: 'Phone', label: 'Phone' }
            ]}
            style={styles.input}
          />

          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            Scheduled: {formData.scheduledDate.toLocaleString()}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={formData.scheduledDate}
              mode="datetime"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) updateField('scheduledDate', selectedDate);
              }}
              minimumDate={new Date()}
            />
          )}

          <Text style={styles.label}>Select Animal (optional)</Text>
          {animals.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.animalScroll}>
              <View style={styles.animalRow}>
                <Button
                  mode={formData.animalId === '' ? 'contained' : 'outlined'}
                  onPress={() => updateField('animalId', '')}
                  style={styles.animalChip}
                  buttonColor={formData.animalId === '' ? '#16a34a' : undefined}
                  compact
                >
                  None
                </Button>
                {animals.map((animal) => (
                  <Button
                    key={animal._id}
                    mode={formData.animalId === animal._id ? 'contained' : 'outlined'}
                    onPress={() => updateField('animalId', animal._id)}
                    style={styles.animalChip}
                    buttonColor={formData.animalId === animal._id ? '#16a34a' : undefined}
                    compact
                  >
                    {animal.name}
                  </Button>
                ))}
              </View>
            </ScrollView>
          )}

          <TextInput
            label="Describe Symptoms *"
            value={formData.symptoms}
            onChangeText={(value) => updateField('symptoms', value)}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          <TextInput
            label="Additional Notes"
            value={formData.notes}
            onChangeText={(value) => updateField('notes', value)}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          {error ? <HelperText type="error">{error}</HelperText> : null}

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={saving}
            disabled={saving}
            style={styles.button}
            buttonColor="#3b82f6"
          >
            Confirm Booking
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollView: { flexGrow: 1 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  vetSummary: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24
  },
  vetName: { fontSize: 18, fontWeight: 'bold', color: '#1e40af' },
  vetSpecialty: { fontSize: 14, color: '#3b82f6', marginTop: 4 },
  vetFee: { fontSize: 16, fontWeight: '600', color: '#1e40af', marginTop: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { marginBottom: 16 },
  animalScroll: { marginBottom: 16 },
  animalRow: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  animalChip: { marginRight: 4 },
  button: { marginTop: 8, paddingVertical: 6 }
});

export default BookConsultationScreen;