import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import {
  Card,
  Title,
  Text,
  Button,
  ActivityIndicator,
  Chip,
  Avatar,
} from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const VetScreen = ({ navigation }) => {
  const [vets, setVets] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("vets");
  const { getAuthenticatedAxios } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const api = getAuthenticatedAxios();
      const [vetsRes, consultationsRes] = await Promise.all([
        api.get("/vet"),
        api.get("/vet/consultations"),
      ]);
      setVets(vetsRes.data.vets);
      setConsultations(consultationsRes.data.consultations);
    } catch (error) {
      console.error("Error fetching vet data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f59e0b";
      case "Accepted":
        return "#3b82f6";
      case "In Progress":
        return "#8b5cf6";
      case "Completed":
        return "#10b981";
      case "Cancelled":
        return "#ef4444";
      case "Rejected":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Veterinary Services</Title>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "vets" && styles.activeTab]}
          onPress={() => setActiveTab("vets")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "vets" && styles.activeTabText,
            ]}
          >
            Find Vets
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "consultations" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("consultations")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "consultations" && styles.activeTabText,
            ]}
          >
            My Consultations
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === "vets" && (
          <View>
            {/* <Card style={styles.emergencyCard}>
              <Card.Content>
                <View style={styles.emergencyHeader}>
                  <Icon name="phone-alert" size={32} color="#ef4444" />
                  <View style={styles.emergencyInfo}>
                    <Title style={styles.emergencyTitle}>
                      Emergency Contacts
                    </Title>
                    <Text style={styles.emergencyText}>
                      24/7 Emergency Veterinary Service
                    </Text>
                    <Text style={styles.emergencyPhone}>📞 1-800-VET-HELP</Text>
                  </View>
                </View>
              </Card.Content>
            </Card> */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available Veterinarians</Text>
              {vets.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Icon name="stethoscope" size={64} color="#d1d5db" />
                  <Text style={styles.emptyText}>No vets available yet</Text>
                </View>
              ) : (
                vets.map((vet) => (
                  <Card key={vet._id} style={styles.vetCard}>
                    <Card.Content>
                      <View style={styles.vetHeader}>
                        <Avatar.Text
                          size={64}
                          label={getInitials(vet.name)}
                          style={styles.avatar}
                        />
                        <View style={styles.vetInfo}>
                          <Title style={styles.vetName}>{vet.name}</Title>
                          <Text style={styles.specialty}>{vet.specialty}</Text>
                          <View style={styles.ratingRow}>
                            <Icon name="star" size={16} color="#f59e0b" />
                            <Text style={styles.rating}>
                              {vet.rating.toFixed(1)}
                            </Text>
                            <Text style={styles.reviews}>
                              ({vet.reviewCount} reviews)
                            </Text>
                          </View>
                        </View>
                        <Chip
                          style={[
                            styles.statusChip,
                            vet.availability === "Available"
                              ? styles.availableChip
                              : styles.busyChip,
                          ]}
                        >
                          {vet.availability}
                        </Chip>
                      </View>

                      <View style={styles.vetDetails}>
                        <View style={styles.detailRow}>
                          <Icon
                            name="clock-outline"
                            size={18}
                            color="#6b7280"
                          />
                          <Text style={styles.detailText}>
                            Avg response: 5 minutes
                          </Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Icon name="video" size={18} color="#6b7280" />
                          <Text style={styles.detailText}>
                            Video or text consultation
                          </Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Icon name="currency-usd" size={18} color="#6b7280" />
                          <Text style={styles.detailText}>
                            Consultation: ${vet.consultationFee}
                          </Text>
                        </View>
                        {vet.experience && (
                          <View style={styles.detailRow}>
                            <Icon name="briefcase" size={18} color="#6b7280" />
                            <Text style={styles.detailText}>
                              {vet.experience} years experience
                            </Text>
                          </View>
                        )}
                      </View>

                      {vet.languages && vet.languages.length > 0 && (
                        <View style={styles.languages}>
                          <Icon name="translate" size={16} color="#6b7280" />
                          <Text style={styles.languagesText}>
                            {vet.languages.join(", ")}
                          </Text>
                        </View>
                      )}

                      <Button
                        mode="contained"
                        icon="video"
                        onPress={() =>
                          navigation.navigate("BookConsultation", {
                            vetId: vet._id,
                          })
                        }
                        style={styles.consultButton}
                        buttonColor="#3b82f6"
                        disabled={vet.availability !== "Available"}
                      >
                        {vet.availability === "Available"
                          ? "Book Consultation"
                          : "Currently Unavailable"}
                      </Button>
                    </Card.Content>
                  </Card>
                ))
              )}
            </View>
          </View>
        )}

        {activeTab === "consultations" && (
          <View style={styles.section}>
            {consultations.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="stethoscope" size={64} color="#d1d5db" />
                <Text style={styles.emptyText}>No consultations yet</Text>
                <Button
                  mode="contained"
                  onPress={() => setActiveTab("vets")}
                  style={styles.emptyButton}
                  buttonColor="#3b82f6"
                >
                  Find a Veterinarian
                </Button>
              </View>
            ) : (
              consultations.map((consultation) => (
                <Card key={consultation._id} style={styles.consultationCard}>
                  <Card.Content>
                    <View style={styles.consultationHeader}>
                      <View>
                        <Text style={styles.consultationType}>
                          {consultation.type}
                        </Text>
                        <Title style={styles.consultationVet}>
                          Dr. {consultation.vetId?.name}
                        </Title>
                        {consultation.animalId && (
                          <Text style={styles.consultationAnimal}>
                            Animal: {consultation.animalId.name} (
                            {consultation.animalId.tagId})
                          </Text>
                        )}
                      </View>
                      <Chip
                        style={[
                          styles.statusChip,
                          {
                            backgroundColor: getStatusColor(
                              consultation.status,
                            ),
                          },
                        ]}
                        textStyle={styles.statusChipText}
                      >
                        {consultation.status}
                      </Chip>
                    </View>

                    <View style={styles.consultationDetails}>
                      <View style={styles.detailRow}>
                        <Icon name="calendar" size={18} color="#6b7280" />
                        <Text style={styles.detailText}>
                          {new Date(
                            consultation.scheduledDate,
                          ).toLocaleString()}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Icon name="currency-usd" size={18} color="#6b7280" />
                        <Text style={styles.detailText}>
                          ${consultation.cost} - {consultation.paymentStatus}
                        </Text>
                      </View>
                    </View>

                    {consultation.symptoms && (
                      <View style={styles.symptomsBox}>
                        <Text style={styles.symptomsLabel}>Symptoms:</Text>
                        <Text style={styles.symptomsText}>
                          {consultation.symptoms}
                        </Text>
                      </View>
                    )}

                    {consultation.diagnosis && (
                      <View style={styles.diagnosisBox}>
                        <Text style={styles.diagnosisLabel}>Diagnosis:</Text>
                        <Text style={styles.diagnosisText}>
                          {consultation.diagnosis}
                        </Text>
                      </View>
                    )}

                    {/* Chat button for Accepted or In Progress consultations */}
                    {["Accepted", "In Progress"].includes(
                      consultation.status,
                    ) && (
                      <Button
                        mode="contained"
                        icon="chat"
                        onPress={() =>
                          navigation.navigate("Chat", {
                            consultationId: consultation._id,
                            role: "farmer",
                          })
                        }
                        style={styles.chatButton}
                        buttonColor="#3b82f6"
                      >
                        Open Chat
                      </Button>
                    )}

                    {consultation.status === "Completed" && (
                      <Button
                        mode="outlined"
                        icon="file-document"
                        onPress={() =>
                          navigation.navigate("ConsultationDetails", {
                            consultationId: consultation._id,
                          })
                        }
                        style={styles.viewButton}
                      >
                        View Full Report
                      </Button>
                    )}
                  </Card.Content>
                </Card>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  activeTabText: {
    color: "#3b82f6",
  },
  content: {
    flex: 1,
  },
  emergencyCard: {
    margin: 16,
    backgroundColor: "#fef2f2",
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
    elevation: 3,
  },
  emergencyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 18,
    color: "#991b1b",
    marginBottom: 4,
  },
  emergencyText: {
    fontSize: 14,
    color: "#b91c1c",
    marginBottom: 8,
  },
  emergencyPhone: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ef4444",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1f2937",
  },
  vetCard: {
    marginBottom: 16,
    elevation: 2,
  },
  vetHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: "#3b82f6",
    marginRight: 16,
  },
  vetInfo: {
    flex: 1,
  },
  vetName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
  },
  reviews: {
    fontSize: 12,
    color: "#6b7280",
  },
  statusChip: {
    alignSelf: "flex-start",
  },
  availableChip: {
    backgroundColor: "#10b981",
  },
  busyChip: {
    backgroundColor: "#6b7280",
  },
  vetDetails: {
    marginBottom: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#4b5563",
  },
  languages: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  languagesText: {
    fontSize: 14,
    color: "#6b7280",
  },
  consultButton: {
    marginTop: 8,
  },
  consultationCard: {
    marginBottom: 16,
    elevation: 2,
  },
  consultationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  consultationType: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  consultationVet: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  consultationAnimal: {
    fontSize: 14,
    color: "#6b7280",
  },
  statusChipText: {
    color: "#fff",
    fontWeight: "600",
  },
  consultationDetails: {
    marginBottom: 12,
    gap: 8,
  },
  symptomsBox: {
    backgroundColor: "#fef3c7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  symptomsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 4,
  },
  symptomsText: {
    fontSize: 14,
    color: "#78350f",
  },
  diagnosisBox: {
    backgroundColor: "#dbeafe",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  diagnosisLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 4,
  },
  diagnosisText: {
    fontSize: 14,
    color: "#1e3a8a",
  },
  chatButton: {
    marginTop: 8,
    marginBottom: 4,
  },
  viewButton: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 48,
    marginTop: 48,
  },
  emptyText: {
    fontSize: 18,
    color: "#9ca3af",
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
  },
});

export default VetScreen;
