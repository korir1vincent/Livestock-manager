// src/screens/RemindersScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Card,
  Title,
  Text,
  Button,
  ActivityIndicator,
  Chip,
  FAB,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

const RemindersScreen = ({ navigation }) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("All");
  const { getAuthenticatedAxios } = useAuth();

  const reminderTypes = [
    "All",
    "Vaccination",
    "Checkup",
    "Medication",
    "Breeding",
    "Deworming",
    "Other",
  ];

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const api = getAuthenticatedAxios();
      const response = await api.get("/reminders");
      setReminders(response.data.reminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReminders();
  };

  const completeReminder = async (reminderId) => {
    try {
      const api = getAuthenticatedAxios();
      await api.put(`/reminders/${reminderId}/complete`);
      fetchReminders();
    } catch (error) {
      Alert.alert("Error", "Failed to mark reminder as complete");
    }
  };

  const deleteReminder = async (reminderId) => {
    Alert.alert(
      "Delete Reminder",
      "Are you sure you want to delete this reminder?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const api = getAuthenticatedAxios();
              await api.delete(`/reminders/${reminderId}`);
              fetchReminders();
            } catch (error) {
              Alert.alert("Error", "Failed to delete reminder");
            }
          },
        },
      ],
    );
  };

  const getFilteredReminders = () => {
    if (filter === "All") return reminders;
    return reminders.filter((r) => r.type === filter);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Vaccination":
        return "needle";
      case "Checkup":
        return "stethoscope";
      case "Medication":
        return "pill";
      case "Breeding":
        return "baby-carriage";
      case "Deworming":
        return "bug";
      default:
        return "bell";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Vaccination":
        return "#3b82f6";
      case "Checkup":
        return "#10b981";
      case "Medication":
        return "#8b5cf6";
      case "Breeding":
        return "#ec4899";
      case "Deworming":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#ef4444";
      case "Medium":
        return "#f59e0b";
      case "Low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const isOverdue = (date) => {
    return new Date(date) < new Date();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  const filteredReminders = getFilteredReminders();
  const upcomingReminders = filteredReminders.filter(
    (r) => !r.completed && !isOverdue(r.date),
  );
  const overdueReminders = filteredReminders.filter(
    (r) => !r.completed && isOverdue(r.date),
  );
  const completedReminders = filteredReminders.filter((r) => r.completed);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Reminders</Title>
          <View style={styles.stats}>
            <Text style={styles.statsText}>
              {upcomingReminders.length} upcoming
            </Text>
            {overdueReminders.length > 0 && (
              <Text style={styles.overdueText}>
                {overdueReminders.length} overdue
              </Text>
            )}
          </View>
        </View>
        
        
        <SafeAreaView>
      
      <ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          style={styles.filterSection}
        >
          {reminderTypes.map((type) => (
            <Chip
              key={type}
              selected={filter === type}
              onPress={() => setFilter(type)}
              style={styles.chip}
            >
              {type}
            </Chip>
          ))}
        </ScrollView>
        
        

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {overdueReminders.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overdue</Text>
              {overdueReminders.map((reminder) => (
                <Card
                  key={reminder._id}
                  style={[styles.reminderCard, styles.overdueCard]}
                >
                  <Card.Content>
                    <View style={styles.reminderHeader}>
                      <View
                        style={[
                          styles.iconContainer,
                          {
                            backgroundColor: `${getTypeColor(reminder.type)}20`,
                          },
                        ]}
                      >
                        <Icon
                          name={getTypeIcon(reminder.type)}
                          size={24}
                          color={getTypeColor(reminder.type)}
                        />
                      </View>
                      <View style={styles.reminderInfo}>
                        <Text style={styles.reminderType}>{reminder.type}</Text>
                        <Text style={styles.reminderDescription}>
                          {reminder.description}
                        </Text>
                        {reminder.animalId && (
                          <Text style={styles.animalName}>
                            Animal: {reminder.animalId.name} (
                            {reminder.animalId.tagId})
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.reminderFooter}>
                      <View style={styles.dateContainer}>
                        <Icon name="calendar" size={16} color="#ef4444" />
                        <Text style={styles.overdueDate}>
                          {new Date(reminder.date).toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={styles.actions}>
                        <TouchableOpacity
                          onPress={() => completeReminder(reminder._id)}
                          style={styles.actionButton}
                        >
                          <Icon name="check" size={20} color="#10b981" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => deleteReminder(reminder._id)}
                          style={styles.actionButton}
                        >
                          <Icon name="delete" size={20} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </View>
          )}

          {upcomingReminders.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upcoming</Text>
              {upcomingReminders.map((reminder) => (
                <Card key={reminder._id} style={styles.reminderCard}>
                  <Card.Content>
                    <View style={styles.reminderHeader}>
                      <View
                        style={[
                          styles.iconContainer,
                          {
                            backgroundColor: `${getTypeColor(reminder.type)}20`,
                          },
                        ]}
                      >
                        <Icon
                          name={getTypeIcon(reminder.type)}
                          size={24}
                          color={getTypeColor(reminder.type)}
                        />
                      </View>
                      <View style={styles.reminderInfo}>
                        <View style={styles.typeRow}>
                          <Text style={styles.reminderType}>
                            {reminder.type}
                          </Text>
                          {reminder.priority && (
                            <View
                              style={[
                                styles.priorityBadge,
                                {
                                  backgroundColor: getPriorityColor(
                                    reminder.priority,
                                  ),
                                },
                              ]}
                            >
                              <Text style={styles.priorityText}>
                                {reminder.priority}
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.reminderDescription}>
                          {reminder.description}
                        </Text>
                        {reminder.animalId && (
                          <Text style={styles.animalName}>
                            Animal: {reminder.animalId.name} (
                            {reminder.animalId.tagId})
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.reminderFooter}>
                      <View style={styles.dateContainer}>
                        <Icon name="calendar" size={16} color="#6b7280" />
                        <Text style={styles.reminderDate}>
                          {new Date(reminder.date).toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={styles.actions}>
                        <TouchableOpacity
                          onPress={() => completeReminder(reminder._id)}
                          style={styles.actionButton}
                        >
                          <Icon name="check" size={20} color="#10b981" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => deleteReminder(reminder._id)}
                          style={styles.actionButton}
                        >
                          <Icon name="delete" size={20} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </View>
          )}

          {completedReminders.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Completed</Text>
              {completedReminders.map((reminder) => (
                <Card
                  key={reminder._id}
                  style={[styles.reminderCard, styles.completedCard]}
                >
                  <Card.Content>
                    <View style={styles.reminderHeader}>
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: "#e5e7eb" },
                        ]}
                      >
                        <Icon
                          name={getTypeIcon(reminder.type)}
                          size={24}
                          color="#9ca3af"
                        />
                      </View>
                      <View style={styles.reminderInfo}>
                        <Text
                          style={[styles.reminderType, styles.completedText]}
                        >
                          {reminder.type}
                        </Text>
                        <Text
                          style={[
                            styles.reminderDescription,
                            styles.completedText,
                          ]}
                        >
                          {reminder.description}
                        </Text>
                        {reminder.animalId && (
                          <Text
                            style={[styles.animalName, styles.completedText]}
                          >
                            Animal: {reminder.animalId.name} (
                            {reminder.animalId.tagId})
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.reminderFooter}>
                      <View style={styles.dateContainer}>
                        <Icon name="check-circle" size={16} color="#10b981" />
                        <Text style={styles.completedDate}>
                          Completed:{" "}
                          {new Date(reminder.completedAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </View>
          )}

          {filteredReminders.length === 0 && (
            <View style={styles.emptyContainer}>
              <Icon name="bell-off" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>No reminders found</Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate("AddReminder")}
                style={styles.emptyButton}
                buttonColor="#16a34a"
              >
                Create Your First Reminder
              </Button>
            </View>
          )}
        </ScrollView>
      </ScrollView>
      </SafeAreaView>
      </SafeAreaView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("AddReminder")}
        color="#fff"
      />
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
    marginBottom: 4,
  },
  stats: {
    flexDirection: "row",
    gap: 16,
  },
  statsText: {
    color: "#6b7280",
    fontSize: 14,
  },
  overdueText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "600",
  },
  filterSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  chip: {
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1f2937",
  },
  reminderCard: {
    marginBottom: 12,
    elevation: 2,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  completedCard: {
    opacity: 0.7,
  },
  reminderHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  reminderInfo: {
    flex: 1,
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  reminderType: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  reminderDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  animalName: {
    fontSize: 14,
    color: "#6b7280",
  },
  reminderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  reminderDate: {
    fontSize: 14,
    color: "#6b7280",
  },
  overdueDate: {
    fontSize: 14,
    color: "#ef4444",
    fontWeight: "600",
  },
  completedDate: {
    fontSize: 14,
    color: "#10b981",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#16a34a",
  },
});

export default RemindersScreen;
