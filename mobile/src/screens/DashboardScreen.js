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
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import * as Location from "expo-location";
import { useTheme } from "../context/ThemeContext";

const WEATHER_API_KEY = "9f3a28609c7627d64f929d1b0e70c7d5";

const healthTips = [
  {
    title: "Regular Deworming",
    tip: "Deworm your livestock every 3-4 months to prevent internal parasites that reduce productivity and cause weight loss.",
  },
  {
    title: "Clean Water Access",
    tip: "Ensure all animals have access to clean, fresh water at all times. Dehydration reduces milk production by up to 25%.",
  },
  {
    title: "Vaccination Schedule",
    tip: "Keep up with vaccination schedules. FMD, Brucellosis, and Blackleg vaccines are critical for cattle health.",
  },
  {
    title: "Body Condition Scoring",
    tip: "Check your animals' body condition score monthly. A score of 3.0-3.5 is ideal for most livestock breeds.",
  },
  {
    title: "Hoof Care",
    tip: "Trim hooves every 3-6 months to prevent lameness. Lame animals eat less and produce less milk or meat.",
  },
  {
    title: "Isolate Sick Animals",
    tip: "Always isolate sick animals immediately to prevent disease spread. A sick animal can infect an entire herd within days.",
  },
  {
    title: "Balanced Nutrition",
    tip: "Supplement grazing with mineral blocks especially during dry seasons. Mineral deficiencies cause reproductive failures.",
  },
  {
    title: "Observe Daily",
    tip: "Spend 10-15 minutes daily observing your herd. Early detection of illness saves lives and reduces treatment costs.",
  },
  {
    title: "Proper Ventilation",
    tip: "Ensure animal shelters are well ventilated. Poor ventilation causes respiratory diseases especially in young animals.",
  },
  {
    title: "Record Keeping",
    tip: "Keep detailed health records for each animal. Records help identify patterns and improve herd management decisions.",
  },
  {
    title: "Pregnancy Monitoring",
    tip: "Monitor pregnant animals closely in the last trimester. Ensure they have extra nutrition and a clean, quiet space for calving.",
  },
  {
    title: "Colostrum Feeding",
    tip: "Ensure newborns receive colostrum within the first 6 hours of birth. Colostrum provides essential antibodies for survival.",
  },
  {
    title: "Tick Control",
    tip: "Dip or spray animals regularly to control ticks. Ticks transmit East Coast Fever, Anaplasmosis, and Babesiosis.",
  },
  {
    title: "Separation by Age",
    tip: "Separate young animals from adults to prevent competition for feed and reduce disease transmission to vulnerable young stock.",
  },
  {
    title: "Dry Season Feeding",
    tip: "Stock hay, silage, or crop residues before the dry season. Feed shortage during dry seasons is the leading cause of weight loss.",
  },
  {
    title: "Salt Supplementation",
    tip: "Provide salt licks year-round. Sodium deficiency causes animals to lick soil, fences, and urine, spreading disease.",
  },
  {
    title: "Castration Timing",
    tip: "Castrate male animals not kept for breeding at 2-4 weeks of age. Early castration reduces stress and speeds recovery.",
  },
  {
    title: "Biosecurity Measures",
    tip: "Control farm entry — quarantine new animals for at least 21 days before introducing them to your existing herd.",
  },
  {
    title: "Fly Control",
    tip: "Control flies around your farm. Flies spread pinkeye, wounds infections, and cause significant stress that reduces productivity.",
  },
  {
    title: "Ear Tag Maintenance",
    tip: "Check ear tags monthly. Lost tags make record keeping difficult and can lead to mix-ups in treatment and breeding records.",
  },
  {
    title: "Milk Hygiene",
    tip: "Clean udders thoroughly before milking. Poor milking hygiene causes mastitis, which can permanently reduce milk production.",
  },
  {
    title: "Mastitis Testing",
    tip: "Do a California Mastitis Test monthly on dairy cows. Subclinical mastitis has no visible signs but drastically cuts milk yield.",
  },
  {
    title: "Shade and Shelter",
    tip: "Provide adequate shade during hot seasons. Heat stress in cattle reduces feed intake, milk production, and conception rates.",
  },
  {
    title: "Rotational Grazing",
    tip: "Rotate pastures every 3-4 weeks. Rotational grazing reduces parasite loads, improves grass quality, and prevents overgrazing.",
  },
  {
    title: "Breeding Records",
    tip: "Record all breeding dates accurately. Knowing the expected calving date allows you to prepare and reduce calving complications.",
  },
  {
    title: "Neonatal Care",
    tip: "Dip newborn navels in iodine solution immediately after birth to prevent navel ill, a common and fatal bacterial infection.",
  },
  {
    title: "Phosphorus Supplementation",
    tip: "Supplement phosphorus especially in dry seasons. Deficiency causes poor reproduction, weak bones, and low milk production.",
  },
  {
    title: "Lice and Mite Control",
    tip: "Inspect animals for lice and mites regularly, especially in cold seasons. Heavy infestations cause severe weight loss and anemia.",
  },
  {
    title: "Water Trough Cleaning",
    tip: "Clean water troughs at least twice a week. Algae and bacteria in dirty water cause diarrhea and reduce water intake.",
  },
  {
    title: "Proper Waste Disposal",
    tip: "Dispose of dead animals and placenta promptly and properly. Rotting carcasses attract predators and spread disease.",
  },
  {
    title: "Stress Reduction",
    tip: "Minimize unnecessary handling and loud noises around livestock. Chronic stress suppresses immunity and reduces productivity.",
  },
  {
    title: "Vitamin A Supplementation",
    tip: "Supplement Vitamin A during dry seasons when green fodder is scarce. Deficiency causes night blindness and poor reproduction.",
  },
  {
    title: "Goat Browsing Needs",
    tip: "Goats prefer browsing shrubs and trees over grazing grass. Mixed vegetation farms suit goats better than pure grass pastures.",
  },
  {
    title: "Sheep Foot Rot Prevention",
    tip: "Walk sheep through a zinc sulfate footbath monthly to prevent foot rot, especially during wet seasons.",
  },
  {
    title: "Pig Feeding Hygiene",
    tip: "Never feed pigs raw meat or kitchen scraps containing meat. This spreads African Swine Fever, which has no treatment or vaccine.",
  },
  {
    title: "Poultry Newcastle Disease",
    tip: "Vaccinate poultry against Newcastle Disease every 3 months. It spreads rapidly and can wipe out an entire flock within a week.",
  },
  {
    title: "Antibiotic Stewardship",
    tip: "Only use antibiotics prescribed by a vet and complete the full course. Overuse creates resistant bacteria that become untreatable.",
  },
  {
    title: "Weight Monitoring",
    tip: "Weigh animals monthly if possible. Unexpected weight loss is often the first sign of disease, parasites, or nutritional deficiency.",
  },
  {
    title: "Drenching Technique",
    tip: "When drenching animals, administer medication slowly over the tongue base to prevent aspiration pneumonia.",
  },
  {
    title: "Calving Assistance",
    tip: "If a cow has been in labor for more than 2 hours without progress, call a vet immediately. Delayed assistance causes calf and cow deaths.",
  },
  {
    title: "Bloat Prevention",
    tip: "Avoid turning cattle onto lush legume pastures when hungry. Sudden diet changes cause bloat, which can be fatal within hours.",
  },
  {
    title: "Copper Toxicity in Sheep",
    tip: "Never feed sheep cattle mineral supplements. Sheep are highly sensitive to copper and even small excesses cause fatal liver damage.",
  },
  {
    title: "Livestock Insurance",
    tip: "Consider livestock insurance for your herd. A single disease outbreak or drought can wipe out years of investment overnight.",
  },
  {
    title: "Feeding Consistency",
    tip: "Feed animals at the same times daily. Consistent feeding routines reduce stress, improve digestion, and increase productivity.",
  },
  {
    title: "Night Security",
    tip: "Secure livestock in predator-proof enclosures at night. Predator attacks cause direct losses and long-term stress in survivors.",
  },
  {
    title: "Pregnancy Toxemia Prevention",
    tip: "Feed ewes and does extra energy in late pregnancy to prevent pregnancy toxemia. Twins and triplets dramatically increase energy needs.",
  },
  {
    title: "Liver Fluke Control",
    tip: "Treat for liver fluke in areas with wet conditions. Liver fluke causes bottle jaw, weight loss, and death if left untreated.",
  },
  {
    title: "Zinc Deficiency",
    tip: "Watch for skin thickening and poor wound healing — signs of zinc deficiency. Supplement zinc especially in high-cereal diets.",
  },
  {
    title: "Seasonal Vaccinations",
    tip: "Time vaccinations before high-risk seasons. Vaccinate against Orf and Pasteurella before cold, wet seasons in small ruminants.",
  },
  {
    title: "Equipment Sterilization",
    tip: "Sterilize all syringes, dehorning tools, and surgical equipment between animals to prevent transmission of bloodborne diseases.",
  },
];

const DashboardScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weather, setWeather] = useState(null);
  const [currentTip, setCurrentTip] = useState(
    Math.floor(Math.random() * healthTips.length),
  );
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
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`,
      );

      const data = await res.json();

      if (data.cod !== 200) {
        console.log("Weather API error:", data.message);
        return;
      }

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
      case "Clear":
        return "weather-sunny";
      case "Clouds":
        return "weather-cloudy";
      case "Rain":
        return "weather-rainy";
      case "Drizzle":
        return "weather-partly-rainy";
      case "Thunderstorm":
        return "weather-lightning-rainy";
      case "Snow":
        return "weather-snowy";
      case "Mist":
      case "Fog":
      case "Haze":
        return "weather-fog";
      default:
        return "weather-cloudy";
    }
  };

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % healthTips.length);
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
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: isDarkMode ? "#0f172a" : "#16a34a" },
        ]}
      >
        <Title style={styles.headerTitle}>Livestock Care</Title>
        <Text style={styles.headerSubtitle}>Welcome back, {user?.name}</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Icon name="cow" size={32} color="#16a34a" />
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {stats?.total || 0}
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: isDarkMode ? "#9ca3af" : "#6b7280" },
              ]}
            >
              Total Animals
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Icon name="check-circle" size={32} color="#10b981" />
            <Text style={[styles.statNumber, { color: colors.text }]}>{stats?.healthy || 0}</Text>
            <Text
              style={[
                styles.statLabel,
                { color: isDarkMode ? "#9ca3af" : "#6b7280" },
              ]}
            >
              Healthy
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Icon name="alert-circle" size={32} color="#ef4444" />
            <Text style={[styles.statNumber, { color: colors.text }]}>{stats?.sick || 0}</Text>
            <Text
              style={[
                styles.statLabel,
                { color: isDarkMode ? "#9ca3af" : "#6b7280" },
              ]}
            >
              Sick
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Icon name="heart" size={32} color="#f59e0b" />
            <Text style={[styles.statNumber, { color: colors.text }]}>{stats?.pregnant || 0}</Text>
            <Text
              style={[
                styles.statLabel,
                { color: isDarkMode ? "#9ca3af" : "#6b7280" },
              ]}
            >
              Pregnant
            </Text>
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
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Quick Actions
        </Text>
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
            <Text style={styles.actionDesc}>From KES 300</Text>
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
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Reminders</Text>
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
  <Card.Content>
    {reminders.length === 0 ? (
      <Text
        style={[
          styles.emptyText,
          { color: isDarkMode ? "#9ca3af" : "#6b7280" }
        ]}
      >
        No upcoming reminders
      </Text>
    ) : (
      reminders
        .filter((r) => !r.completed && new Date(r.date) >= new Date())
        .slice(0, 3)
        .map((reminder) => (
          <View
            key={reminder._id}
            style={[
              styles.reminderItem,
              { borderBottomColor: isDarkMode ? "#374151" : "#e5e7eb" }
            ]}
          >
            <View style={styles.reminderIcon}>
              <Icon name="bell" size={20} color="#f59e0b" />
            </View>

            <View style={styles.reminderContent}>
              <Text
                style={[
                  styles.reminderTitle,
                  { color: colors.text }
                ]}
              >
                {reminder.description}
              </Text>

              <Text
                style={[
                  styles.reminderDate,
                  { color: isDarkMode ? "#9ca3af" : "#6b7280" }
                ]}
              >
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

      {/* Daily Health Tip */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Health Tip</Text>
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Icon name="lightbulb-on" size={20} color="#16a34a" />
            <Text style={styles.tipTitle}>{healthTips[currentTip].title}</Text>
          </View>
          <Text style={styles.tipDesc}>{healthTips[currentTip].tip}</Text>
          <TouchableOpacity onPress={nextTip}>
            <Text style={styles.nextTipLink}>Next Tip →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  header: {
    backgroundColor: "#16a34a",
    padding: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  headerTitle: { color: "#fff", fontSize: 32, fontWeight: "bold" },
  headerSubtitle: { color: "#dcfce7", fontSize: 16 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    marginTop: -24,
  },
  statCard: { width: "48%", margin: "1%", elevation: 3 },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
    color: "#1f2937",
  },
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
  weatherCity: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  weatherLabel: { color: "#dbeafe", fontSize: 13, marginBottom: 4 },
  weatherTemp: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 4,
  },
  weatherDesc: { color: "#dbeafe", fontSize: 13 },
  section: { padding: 16 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  actionButton: {
    width: "48%",
    margin: "1%",
    borderRadius: 16,
    padding: 20,
    minHeight: 140,
  },
  actionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
  },
  actionDesc: { color: "rgba(255,255,255,0.9)", fontSize: 13 },
  card: { elevation: 2 },
  reminderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fef3c7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  reminderContent: { flex: 1 },
  reminderTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  reminderDate: { fontSize: 12, color: "#6b7280" },
  markDoneButton: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  markDoneText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  emptyText: { textAlign: "center", color: "#9ca3af", paddingVertical: 24 },
  tipCard: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 12,
    padding: 16,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#15803d",
    flex: 1,
  },
  tipDesc: {
    fontSize: 13,
    color: "#166534",
    marginBottom: 10,
    lineHeight: 20,
  },
  nextTipLink: {
    fontSize: 13,
    color: "#16a34a",
    fontWeight: "600",
  },
});

export default DashboardScreen;
