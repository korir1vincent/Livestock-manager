// src/screens/VetDashboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Text, Button, ActivityIndicator, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';

const VetDashboardScreen = ({ navigation }) => {
  const [consultations, setConsultations] = useState([]);
  const [vetProfile, setVetProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const { getAuthenticatedAxios } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const api = getAuthenticatedAxios();
      const [consultationsRes, profileRes] = await Promise.all([
        api.get('/vet/consultations/incoming'),
        api.get('/vet/profile/me')
      ]);
      setConsultations(consultationsRes.data.consultations);
      setVetProfile(profileRes.data.vet);
    } catch (error) {
      console.error('Vet dashboard error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const handleRespond = async (consultationId, status) => {
    try {
      const api = getAuthenticatedAxios();
      await api.put(`/vet/consultations/${consultationId}/respond`, { status });
      fetchData();
    } catch (error) {
      console.error('Respond error:', error);
    }
  };

  const toggleAvailability = async () => {
    try {
      const api = getAuthenticatedAxios();
      const newStatus = vetProfile.availability === 'Available' ? 'Busy' : 'Available';
      await api.put('/vet/availability', { availability: newStatus });
      setVetProfile({ ...vetProfile, availability: newStatus });
    } catch (error) {
      console.error('Availability error:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f59e0b';
      case 'Accepted': return '#3b82f6';
      case 'In Progress': return '#8b5cf6';
      case 'Completed': return '#10b981';
      case 'Cancelled': return '#ef4444';
      case 'Rejected': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const filtered = consultations.filter(c => {
    if (activeTab === 'pending') return c.status === 'Pending';
    if (activeTab === 'active') return ['Accepted', 'In Progress'].includes(c.status);
    if (activeTab === 'done') return ['Completed', 'Cancelled', 'Rejected'].includes(c.status);
    return true;
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Title style={styles.headerTitle}>Vet Dashboard</Title>
          {vetProfile && <Text style={styles.headerSub}>{vetProfile.specialty}</Text>}
        </View>
        {vetProfile && (
          <TouchableOpacity
            style={[styles.availabilityBadge, { backgroundColor: vetProfile.availability === 'Available' ? '#10b981' : '#6b7280' }]}
            onPress={toggleAvailability}
          >
            <Text style={styles.availabilityText}>{vetProfile.availability}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {['pending', 'active', 'done'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="stethoscope" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No {activeTab} consultations</Text>
          </View>
        ) : (
          filtered.map((consultation) => (
            <Card key={consultation._id} style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.farmerName}>{consultation.userId?.name}</Text>
                    <Text style={styles.consultationType}>{consultation.type} Consultation</Text>
                    {consultation.animalId && (
                      <Text style={styles.animalInfo}>
                        Animal: {consultation.animalId.name} ({consultation.animalId.tagId})
                      </Text>
                    )}
                  </View>
                  <Chip style={{ backgroundColor: getStatusColor(consultation.status) }}
                    textStyle={{ color: '#fff', fontWeight: '600' }}>
                    {consultation.status}
                  </Chip>
                </View>

                <View style={styles.symptomsBox}>
                  <Text style={styles.symptomsLabel}>Symptoms:</Text>
                  <Text style={styles.symptomsText}>{consultation.symptoms}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Icon name="calendar" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>
                    {new Date(consultation.scheduledDate).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Icon name="currency-usd" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>${consultation.cost}</Text>
                </View>

                <View style={styles.actions}>
                  {consultation.status === 'Pending' && (
                    <>
                      <Button mode="contained" onPress={() => handleRespond(consultation._id, 'Accepted')}
                        buttonColor="#10b981" style={styles.actionBtn} compact>
                        Accept
                      </Button>
                      <Button mode="contained" onPress={() => handleRespond(consultation._id, 'Rejected')}
                        buttonColor="#ef4444" style={styles.actionBtn} compact>
                        Reject
                      </Button>
                    </>
                  )}
                  {['Accepted', 'In Progress'].includes(consultation.status) && (
                    <Button mode="contained" icon="chat"
                      onPress={() => navigation.navigate('Chat', { consultationId: consultation._id, role: 'vet' })}
                      buttonColor="#3b82f6" style={styles.actionBtn}>
                      Open Chat
                    </Button>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#1e40af', padding: 20, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerSub: { color: '#bfdbfe', fontSize: 14, marginTop: 4 },
  availabilityBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  availabilityText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#1e40af' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  activeTabText: { color: '#1e40af' },
  content: { flex: 1, padding: 16 },
  card: { marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  farmerName: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  consultationType: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  animalInfo: { fontSize: 13, color: '#3b82f6', marginTop: 2 },
  symptomsBox: { backgroundColor: '#fef3c7', padding: 10, borderRadius: 8, marginBottom: 10 },
  symptomsLabel: { fontSize: 12, fontWeight: '600', color: '#92400e', marginBottom: 4 },
  symptomsText: { fontSize: 13, color: '#78350f' },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  detailText: { fontSize: 13, color: '#4b5563' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  actionBtn: { flex: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 16, color: '#9ca3af', marginTop: 16 }
});

export default VetDashboardScreen;