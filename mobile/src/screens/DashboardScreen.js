import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Card, Title } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../context/AuthContext";
import * as Location from "expo-location";

const WEATHER_API_KEY = "9f3a28609c7627d64f929d1b0e70c7d5"; 

const DashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weather, setWeather] = useState(null);
  const { getAuthenticatedAxios, user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
    fetchWeather();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const api = getAuthenticatedAxios();
      const [statsRes, remindersRes] = await Promise.all([
        api.get("/animals/stats"),
        api.get("/reminders/upcoming"),
      ]);
      setStats(statsRes.data.stats);
      setReminders(remindersRes.data.reminders);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchWeather = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
    );

    const data = await res.json();

    // 🔴 HANDLE API ERROR HERE
    if (data.cod !== 200) {
      console.log("Weather API error:", data.message);
      return;
    }

    // ✅ SAFE TO USE DATA NOW
    setWeather({
      temp: Math.round(data.main.temp),
      description: data.weather[0].description
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      humidity: data.main.humidity,
      city: data.name,
      icon: data.weather[0].main,
    });
  } catch (error) {
    console.error("Weather error:", error);
  }
};

  const getWeatherIcon = (icon) => {
    switch (icon) {
      case "Clear": return "weather-sunny";
      case "Clouds": return "weather-cloudy";
      case "Rain": return "weather-rainy";
      case "Drizzle": return "weather-partly-rainy";
      case "Thunderstorm": return "weather-lightning-rainy";
      case "Snow": return "weather-snowy";
      case "Mist":
      case "Fog":
      case "Haze": return "weather-fog";
      default: return "weather-cloudy";
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
    fetchWeather();
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
      {/* Header */}
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Dashboard</Title>
        <Text style={styles.headerSubtitle}>Welcome back, {user?.name}</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Icon name="cow" size={32} color="#16a34a" />
            <Text style={styles.statNumber}>{stats?.total || 0}</Text>
            <Text style={styles.statLabel}>Total Animals</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Icon name="check-circle" size={32} color="#10b981" />
            <Text style={styles.statNumber}>{stats?.healthy || 0}</Text>
            <Text style={styles.statLabel}>Healthy</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Icon name="alert-circle" size={32} color="#ef4444" />
            <Text style={styles.statNumber}>{stats?.sick || 0}</Text>
            <Text style={styles.statLabel}>Sick</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Icon name="heart" size={32} color="#f59e0b" />
            <Text style={styles.statNumber}>{stats?.pregnant || 0}</Text>
            <Text style={styles.statLabel}>Pregnant</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Weather Widget */}
      <View style={styles.weatherWidget}>
        {weather ? (
          <>
            <View>
              <Text style={styles.weatherCity}>{weather.city}</Text>
              <Text style={styles.weatherLabel}>Current Weather</Text>
              <Text style={styles.weatherTemp}>{weather.temp}°C</Text>
              <Text style={styles.weatherDesc}>
                {weather.description} · Humidity {weather.humidity}%
              </Text>
            </View>
            <Icon name={getWeatherIcon(weather.icon)} size={56} color="#fff" />
          </>
        ) : (
          <>
            <View>
              <Text style={styles.weatherLabel}>Current Weather</Text>
              <Text style={styles.weatherTemp}>--°C</Text>
              <Text style={styles.weatherDesc}>Fetching location...</Text>
            </View>
            <Icon name="weather-cloudy" size={56} color="#fff" />
          </>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#16a34a" }]}
            onPress={() => navigation.navigate("Scanner")}
          >
            <Icon name="camera" size={32} color="#fff" />
            <Text style={styles.actionTitle}>AI Health Scan</Text>
            <Text style={styles.actionDesc}>Instant detection</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#3b82f6" }]}
            onPress={() => navigation.navigate("Animals")}
          >
            <Icon name="book-open" size={32} color="#fff" />
            <Text style={styles.actionTitle}>Animal Records</Text>
            <Text style={styles.actionDesc}>View history</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#9333ea" }]}
            onPress={() => navigation.navigate("Reminders")}
          >
            <Icon name="bell" size={32} color="#fff" />
            <Text style={styles.actionTitle}>Reminders</Text>
            <Text style={styles.actionDesc}>Vaccinations</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#f97316" }]}
            onPress={() => navigation.navigate("Inventory")}
          >
            <Icon name="package-variant" size={32} color="#fff" />
            <Text style={styles.actionTitle}>Inventory</Text>
            <Text style={styles.actionDesc}>Medicine & feed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#14b8a6" }]}
            onPress={() => navigation.navigate("Financial")}
          >
            <Icon name="currency-usd" size={32} color="#fff" />
            <Text style={styles.actionTitle}>Financials</Text>
            <Text style={styles.actionDesc}>Track expenses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#6366f1" }]}
            onPress={() => navigation.navigate("Vet")}
          >
            <Icon name="stethoscope" size={32} color="#fff" />
            <Text style={styles.actionTitle}>Vet Consult</Text>
            <Text style={styles.actionDesc}>From $10</Text>
          </TouchableOpacity>

          {user?.role === "farmer" && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#0891b2" }]}
              onPress={() => navigation.navigate("VetApplication")}
            >
              <Icon name="medical-bag" size={32} color="#fff" />
              <Text style={styles.actionTitle}>Apply as Vet</Text>
              <Text style={styles.actionDesc}>Join our network</Text>
            </TouchableOpacity>
          )}

          {user?.role === "vet" && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#0891b2" }]}
              onPress={() => navigation.navigate("VetDashboard")}
            >
              <Icon name="view-dashboard" size={32} color="#fff" />
              <Text style={styles.actionTitle}>Vet Dashboard</Text>
              <Text style={styles.actionDesc}>Your consultations</Text>
            </TouchableOpacity>
          )}

          {user?.role === "admin" && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#be123c" }]}
              onPress={() => navigation.navigate("AdminVetApprovals")}
            >
              <Icon name="shield-check" size={32} color="#fff" />
              <Text style={styles.actionTitle}>Vet Approvals</Text>
              <Text style={styles.actionDesc}>Review applications</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Upcoming Reminders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
        <Card style={styles.card}>
          <Card.Content>
            {reminders.length === 0 ? (
              <Text style={styles.emptyText}>No upcoming reminders</Text>
            ) : (
              reminders
                .filter((r) => !r.completed && new Date(r.date) >= new Date())
                .slice(0, 3)
                .map((reminder) => (
                  <View key={reminder._id} style={styles.reminderItem}>
                    <View style={styles.reminderIcon}>
                      <Icon name="bell" size={20} color="#f59e0b" />
                    </View>
                    <View style={styles.reminderContent}>
                      <Text style={styles.reminderTitle}>{reminder.description}</Text>
                      <Text style={styles.reminderDate}>
                        {new Date(reminder.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.markDoneButton}
                      onPress={() => navigation.navigate("Reminders")}
                    >
                      <Text style={styles.markDoneText}>Open</Text>
                    </TouchableOpacity>
                  </View>
                ))
            )}
          </Card.Content>
        </Card>
      </View>

      {/* Health Alerts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Alerts</Text>
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <Icon name="alert-circle" size={20} color="#ef4444" />
            <Text style={styles.alertTitle}>Charlie (G-001) - Respiratory Issue</Text>
          </View>
          <Text style={styles.alertDesc}>Showing signs of infection. Treatment started.</Text>
          <TouchableOpacity>
            <Text style={styles.alertLink}>View Details →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" },
  header: { backgroundColor: "#16a34a", padding: 24, paddingTop: 60, paddingBottom: 32 },
  headerTitle: { color: "#fff", fontSize: 32, fontWeight: "bold" },
  headerSubtitle: { color: "#dcfce7", fontSize: 16 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", padding: 12, marginTop: -24 },
  statCard: { width: "48%", margin: "1%", elevation: 3 },
  statNumber: { fontSize: 32, fontWeight: "bold", marginTop: 12, marginBottom: 4, color: "#1f2937" },
  statLabel: { fontSize: 14, color: "#6b7280" },
  weatherWidget: {
    margin: 16,
    backgroundColor: "#3b82f6",
    borderRadius: 16,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weatherCity: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 2 },
  weatherLabel: { color: "#dbeafe", fontSize: 13, marginBottom: 4 },
  weatherTemp: { color: "#fff", fontSize: 36, fontWeight: "bold", marginBottom: 4 },
  weatherDesc: { color: "#dbeafe", fontSize: 13 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#1f2937", marginBottom: 16 },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  actionButton: { width: "48%", margin: "1%", borderRadius: 16, padding: 20, minHeight: 140 },
  actionTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginTop: 12, marginBottom: 4 },
  actionDesc: { color: "rgba(255,255,255,0.9)", fontSize: 13 },
  card: { elevation: 2 },
  reminderItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  reminderIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fef3c7", justifyContent: "center", alignItems: "center", marginRight: 12 },
  reminderContent: { flex: 1 },
  reminderTitle: { fontSize: 14, fontWeight: "600", color: "#1f2937", marginBottom: 2 },
  reminderDate: { fontSize: 12, color: "#6b7280" },
  markDoneButton: { backgroundColor: "#16a34a", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  markDoneText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  emptyText: { textAlign: "center", color: "#9ca3af", paddingVertical: 24 },
  alertCard: { backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fecaca", borderRadius: 12, padding: 16 },
  alertHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  alertTitle: { fontSize: 15, fontWeight: "600", color: "#991b1b", marginLeft: 8, flex: 1 },
  alertDesc: { fontSize: 13, color: "#b91c1c", marginBottom: 8 },
  alertLink: { fontSize: 13, color: "#dc2626", fontWeight: "600" },
});

export default DashboardScreen;