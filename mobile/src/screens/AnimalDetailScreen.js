import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, Button, ActivityIndicator, Chip } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from "../context/ThemeContext";

const AnimalDetailScreen = ({ route, navigation }) => {
  const { animalId } = route.params;
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getAuthenticatedAxios } = useAuth();

  useEffect(() => {
    fetchAnimalDetails();
  }, []);

  const fetchAnimalDetails = async () => {
    try {
      const api = getAuthenticatedAxios();
      const response = await api.get(`/animals/${animalId}`);
      setAnimal(response.data.animal);
    } catch (error) {
      console.error('Error fetching animal:', error);
      Alert.alert('Error', 'Failed to load animal details');
    } finally {
      setLoading(false);
    }
  };

const handleDelete = () => {
  Alert.alert(
    'Delete Animal',
    'Are you sure you want to delete this animal? This action cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const api = getAuthenticatedAxios();
            await api.delete(`/animals/${animalId}`);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete animal');
          }
        }
      }
    ]
  );
};

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
    }
    return `${months} month${months !== 1 ? 's' : ''}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy': return '#10b981';
      case 'Sick': return '#ef4444';
      case 'Under Treatment': return '#f59e0b';
      case 'Quarantine': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!animal) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Animal not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.name}>{animal.name}</Title>
        <Chip
          style={[styles.statusChip, { backgroundColor: getStatusColor(animal.healthStatus) }]}
          textStyle={styles.statusText}
        >
          {animal.healthStatus}
        </Chip>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Basic Information</Title>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tag ID:</Text>
              <Text style={styles.value}>{animal.tagId}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Type:</Text>
              <Text style={styles.value}>{animal.type}</Text>
            </View>
            {animal.breed && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Breed:</Text>
                <Text style={styles.value}>{animal.breed}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Gender:</Text>
              <Text style={styles.value}>{animal.gender}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Age:</Text>
              <Text style={styles.value}>{calculateAge(animal.dateOfBirth)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Date of Birth:</Text>
              <Text style={styles.value}>
                {new Date(animal.dateOfBirth).toLocaleDateString()}
              </Text>
            </View>
            {animal.weight && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Weight:</Text>
                <Text style={styles.value}>{animal.weight} kg</Text>
              </View>
            )}
            {animal.color && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Color:</Text>
                <Text style={styles.value}>{animal.color}</Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>

      {animal.pregnancyStatus !== 'Not Pregnant' && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Pregnancy Status</Title>
            <View style={styles.pregnancyInfo}>
              <Icon name="baby-carriage" size={24} color="#ec4899" />
              <Text style={styles.pregnancyText}>{animal.pregnancyStatus}</Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {animal.vaccinations && animal.vaccinations.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Vaccinations</Title>
            <View style={styles.vaccinationsList}>
              {animal.vaccinations.map((vac, index) => (
                <View key={index} style={styles.vaccinationItem}>
                  <Icon name="needle" size={20} color="#3b82f6" />
                  <View style={styles.vaccinationInfo}>
                    <Text style={styles.vaccinationName}>{vac.name}</Text>
                    <Text style={styles.vaccinationDate}>
                      {new Date(vac.date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {animal.notes && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Notes</Title>
            <Text style={styles.notes}>{animal.notes}</Text>
          </Card.Content>
        </Card>
      )}
      <SafeAreaView>

      <View style={styles.actions}>
        <Button
          mode="contained"
          icon="pencil"
          onPress={() => navigation.navigate('EditAnimal', { animalId: animal._id })}
          style={styles.actionButton}
          buttonColor="#3b82f6"
        >
          Edit
        </Button>
        <Button
          mode="contained"
          icon="medical-bag"
          onPress={() => navigation.navigate('AddHealthRecord', { animalId: animal._id })}
          style={styles.actionButton}
          buttonColor="#10b981"
        >
          Add Health Record
        </Button>
        <Button
          mode="outlined"
          icon="delete"
          onPress={handleDelete}
          style={styles.actionButton}
          textColor="#ef4444"
        >
          Delete
        </Button>
      </View>
      </SafeAreaView>

      {animal.healthRecords && animal.healthRecords.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Health Records</Title>
            {animal.healthRecords.map((record, index) => (
              <View key={index} style={styles.healthRecord}>
                <View style={styles.recordHeader}>
                  <Text style={styles.recordType}>{record.type}</Text>
                  <Text style={styles.recordDate}>
                    {new Date(record.date).toLocaleDateString()}
                  </Text>
                </View>
                {record.diagnosis && (
                  <Text style={styles.recordText}>Diagnosis: {record.diagnosis}</Text>
                )}
                {record.treatment && (
                  <Text style={styles.recordText}>Treatment: {record.treatment}</Text>
                )}
                {record.veterinarian && (
                  <Text style={styles.recordText}>Vet: {record.veterinarian}</Text>
                )}
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1
  },
  statusChip: {
    marginLeft: 8
  },
  statusText: {
    color: '#fff',
    fontWeight: '600'
  },
  card: {
    margin: 12,
    elevation: 2
  },
  infoGrid: {
    marginTop: 16
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  label: {
    color: '#6b7280',
    fontWeight: '600'
  },
  value: {
    color: '#1f2937',
    fontWeight: '400'
  },
  pregnancyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12
  },
  pregnancyText: {
    fontSize: 16,
    color: '#ec4899',
    fontWeight: '600'
  },
  vaccinationsList: {
    marginTop: 12
  },
  vaccinationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12
  },
  vaccinationInfo: {
    flex: 1
  },
  vaccinationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937'
  },
  vaccinationDate: {
    fontSize: 14,
    color: '#6b7280'
  },
  notes: {
    marginTop: 12,
    color: '#4b5563',
    lineHeight: 20
  },
  actions: {
    padding: 12,
    gap: 12
  },
  actionButton: {
    paddingVertical: 4
  },
  healthRecord: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6'
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  recordType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937'
  },
  recordDate: {
    fontSize: 14,
    color: '#6b7280'
  },
  recordText: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4
  }
});

export default AnimalDetailScreen;