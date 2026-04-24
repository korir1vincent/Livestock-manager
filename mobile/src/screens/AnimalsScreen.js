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
  Searchbar,
  Chip,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

const AnimalsScreen = ({ navigation }) => {
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const { getAuthenticatedAxios } = useAuth();

  const animalTypes = [
    "All",
    "Cattle",
    "Goat",
    "Sheep",
    "Pig",
    "Other",
  ];
  const healthStatuses = [
    "All",
    "Healthy",
    "Sick",
    "Under Treatment",
    "Quarantine",
  ];

  useEffect(() => {
    fetchAnimals();
  }, []);

  useEffect(() => {
    filterAnimals();
  }, [animals, searchQuery, selectedType, selectedStatus]);

  const fetchAnimals = async () => {
    try {
      const api = getAuthenticatedAxios();
      const response = await api.get("/animals");
      setAnimals(response.data.animals);
    } catch (error) {
      console.error("Error fetching animals:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterAnimals = () => {
    let filtered = animals;

    if (searchQuery) {
      filtered = filtered.filter(
        (animal) =>
          animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          animal.tagId.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedType !== "All") {
      filtered = filtered.filter((animal) => animal.type === selectedType);
    }

    if (selectedStatus !== "All") {
      filtered = filtered.filter(
        (animal) => animal.healthStatus === selectedStatus,
      );
    }

    setFilteredAnimals(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAnimals();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Healthy":
        return "#10b981";
      case "Sick":
        return "#ef4444";
      case "Under Treatment":
        return "#f59e0b";
      case "Quarantine":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age > 0 ? `${age} years` : "Less than 1 year";
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
      <SafeAreaView>
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Animals</Title>
          <Button
            mode="contained"
            icon="plus"
            onPress={() => navigation.navigate("AddAnimal")}
            buttonColor="#16a34a"
          >
            Add Animal
          </Button>
        </View>

        <View style={styles.searchSection}>
          <Searchbar
            placeholder="Search by name or tag ID"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          style={styles.filterSection}
        >
          <Text style={styles.filterLabel}>Type:</Text>
          {animalTypes.map((type) => (
            <Chip
              key={type}
              selected={selectedType === type}
              onPress={() => setSelectedType(type)}
              style={styles.chip}
            >
              {type}
            </Chip>
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          style={styles.filterSection}
        >
          <Text style={styles.filterLabel}>Status:</Text>
          {healthStatuses.map((status) => (
            <Chip
              key={status}
              selected={selectedStatus === status}
              onPress={() => setSelectedStatus(status)}
              style={styles.chip}
            >
              {status}
            </Chip>
          ))}
        </ScrollView>
      </SafeAreaView>
      <ScrollView>
        <ScrollView
          style={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>
              Showing {filteredAnimals.length} of {animals.length} animals
            </Text>
          </View>

          {filteredAnimals.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="cow-off" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>No animals found</Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate("AddAnimal")}
                style={styles.emptyButton}
                buttonColor="#16a34a"
              >
                Add Your First Animal
              </Button>
            </View>
          ) : (
            filteredAnimals.map((animal) => (
              <TouchableOpacity
                key={animal._id}
                onPress={() =>
                  navigation.navigate("AnimalDetail", { animalId: animal._id })
                }
              >
                <Card style={styles.animalCard}>
                  <Card.Content>
                    <View style={styles.cardHeader}>
                      <View>
                        <Title style={styles.animalName}>{animal.name}</Title>
                        <Text style={styles.animalInfo}>
                          {animal.type} • {animal.tagId}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: getStatusColor(
                              animal.healthStatus,
                            ),
                          },
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {animal.healthStatus}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailsGrid}>
                      <View style={styles.detailItem}>
                        <Icon name="calendar" size={16} color="#6b7280" />
                        <Text style={styles.detailText}>
                          {calculateAge(animal.dateOfBirth)}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Icon name="weight" size={16} color="#6b7280" />
                        <Text style={styles.detailText}>
                          {animal.weight ? `${animal.weight} kg` : "N/A"}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Icon
                          name="gender-male-female"
                          size={16}
                          color="#6b7280"
                        />
                        <Text style={styles.detailText}>{animal.gender}</Text>
                      </View>
                      {animal.breed && (
                        <View style={styles.detailItem}>
                          <Icon name="dna" size={16} color="#6b7280" />
                          <Text style={styles.detailText}>{animal.breed}</Text>
                        </View>
                      )}
                    </View>

                    {animal.pregnancyStatus === "Pregnant" && (
                      <View style={styles.pregnancyBadge}>
                        <Icon name="baby-carriage" size={16} color="#ec4899" />
                        <Text style={styles.pregnancyText}>Pregnant</Text>
                      </View>
                    )}
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchSection: {
    padding: 16,
    backgroundColor: "#fff",
  },
  searchBar: {
    elevation: 0,
    backgroundColor: "#f3f4f6",
  },
  filterSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  filterLabel: {
    alignSelf: "center",
    marginRight: 8,
    fontWeight: "600",
    color: "#6b7280",
  },
  chip: {
    marginRight: 8,
  },
  statsRow: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  statsText: {
    color: "#6b7280",
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
  },
  animalCard: {
    margin: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  animalName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  animalInfo: {
    color: "#6b7280",
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    color: "#6b7280",
    fontSize: 14,
  },
  pregnancyBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 6,
  },
  pregnancyText: {
    color: "#ec4899",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 48,
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

export default AnimalsScreen;
