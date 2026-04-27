import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import {
  Card,
  Title,
  Text,
  Button,
  ActivityIndicator,
  Chip,
  TextInput,
} from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const AdminVetApprovalsScreen = ({ navigation }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [note, setNote] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { getAuthenticatedAxios } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const api = getAuthenticatedAxios();
      const res = await api.get("/vet/admin/applications");
      setApplications(res.data.vets);
    } catch (error) {
      console.error("Fetch applications error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplications();
  };

  const handleReview = (id, status) => {
    Alert.alert(
      `${status === "approved" ? "Approve" : "Reject"} Application`,
      `Are you sure you want to ${status} this vet application?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: status === "rejected" ? "destructive" : "default",
          onPress: async () => {
            try {
              const api = getAuthenticatedAxios();
              await api.put(`/vet/admin/applications/${id}`, { status, note });
              setNote("");
              setSelectedId(null);
              fetchApplications();
            } catch (error) {
              Alert.alert("Error", "Failed to update application");
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Vet Applications</Title>
        <Text style={styles.headerSub}>{applications.length} pending</Text>
      </View>

      <View style={styles.content}>
        {applications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="check-all" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No pending applications</Text>
          </View>
        ) : (
          applications.map((vet) => (
            <Card key={vet._id} style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <View>
                    <Title style={styles.vetName}>{vet.name}</Title>
                    <Text style={styles.vetEmail}>{vet.email}</Text>
                  </View>
                  <Chip
                    style={styles.pendingChip}
                    textStyle={{ color: "#fff" }}
                  >
                    Pending
                  </Chip>
                </View>

                <View style={styles.infoGrid}>
                  <View style={styles.infoRow}>
                    <Icon name="stethoscope" size={16} color="#6b7280" />
                    <Text style={styles.infoText}>{vet.specialty}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Icon name="license" size={16} color="#6b7280" />
                    <Text style={styles.infoText}>
                      License: {vet.licenseNumber}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Icon name="briefcase" size={16} color="#6b7280" />
                    <Text style={styles.infoText}>
                      {vet.experience} years experience
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Icon name="currency-usd" size={16} color="#6b7280" />
                    <Text style={styles.infoText}>
                      Fee: ${vet.consultationFee}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Icon name="phone" size={16} color="#6b7280" />
                    <Text style={styles.infoText}>{vet.phone}</Text>
                  </View>
                  {vet.location?.city && (
                    <View style={styles.infoRow}>
                      <Icon name="map-marker" size={16} color="#6b7280" />
                      <Text style={styles.infoText}>
                        {vet.location.city}, {vet.location.country}
                      </Text>
                    </View>
                  )}
                </View>

                {vet.bio && (
                  <View style={styles.bioBox}>
                    <Text style={styles.bioLabel}>Bio:</Text>
                    <Text style={styles.bioText}>{vet.bio}</Text>
                  </View>
                )}

                {vet.languages?.length > 0 && (
                  <Text style={styles.languages}>
                    Languages: {vet.languages.join(", ")}
                  </Text>
                )}

                {selectedId === vet._id && (
                  <TextInput
                    label="Note (optional)"
                    value={note}
                    onChangeText={setNote}
                    mode="outlined"
                    style={styles.noteInput}
                    placeholder="Add a note for the applicant"
                  />
                )}

                <View style={styles.actions}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setSelectedId(vet._id);
                      handleReview(vet._id, "approved");
                    }}
                    buttonColor="#10b981"
                    style={styles.actionBtn}
                    icon="check"
                  >
                    Approve
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setSelectedId(vet._id);
                      handleReview(vet._id, "rejected");
                    }}
                    buttonColor="#ef4444"
                    style={styles.actionBtn}
                    icon="close"
                  >
                    Reject
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { backgroundColor: "#1e40af", padding: 20, paddingTop: 20 },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  headerSub: { color: "#bfdbfe", fontSize: 14, marginTop: 4 },
  content: { padding: 16 },
  card: { marginBottom: 16, elevation: 2 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  vetName: { fontSize: 18, fontWeight: "bold" },
  vetEmail: { fontSize: 13, color: "#6b7280" },
  pendingChip: { backgroundColor: "#f59e0b" },
  infoGrid: { gap: 8, marginBottom: 12 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoText: { fontSize: 14, color: "#4b5563" },
  bioBox: {
    backgroundColor: "#f9fafb",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  bioLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  bioText: { fontSize: 13, color: "#4b5563", lineHeight: 18 },
  languages: { fontSize: 13, color: "#6b7280", marginBottom: 12 },
  noteInput: { marginBottom: 12 },
  actions: { flexDirection: "row", gap: 8, marginTop: 8 },
  actionBtn: { flex: 1 },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  emptyText: { fontSize: 16, color: "#9ca3af", marginTop: 16 },
});

export default AdminVetApprovalsScreen;
