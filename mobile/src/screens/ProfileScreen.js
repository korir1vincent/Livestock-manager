import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Switch } from "react-native";
import {
  Card,
  Title,
  Text,
  Button,
  List,
  Avatar,
  Divider,
} from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";

const ProfileScreen = ({ navigation }) => {
  
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode, colors } = useTheme();

  // const toggleDarkMode = async (value) => {
  //   setIsDarkMode(value);
  //   await AsyncStorage.setItem("darkMode", JSON.stringify(value));
    // Alert.alert(
    //   "Theme Changed",
    //   `${value ? "Dark" : "Light"} mode will be fully applied on next app restart.`
    // );
  // };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <View style={styles.header}>
          <Avatar.Text size={80} label={getInitials()} style={styles.avatar} />
          <Title style={styles.name}>{user?.name || "User"}</Title>
          <Text style={styles.email}>{user?.email || "user@example.com"}</Text>
          {user?.farmLocation && (
            <View style={styles.locationRow}>
              <Icon name="map-marker" size={16} color="#6b7280" />
              <Text style={styles.location}>{user.farmLocation}</Text>
            </View>
          )}
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Account Information</Title>
            <List.Item
              title="Name"
              description={user?.name}
              left={(props) => <List.Icon {...props} icon="account" />}
            />
            <Divider />
            <List.Item
              title="Email"
              description={user?.email}
              left={(props) => <List.Icon {...props} icon="email" />}
            />
            <Divider />
            <List.Item
              title="Farm Location"
              description={user?.farmLocation || "Not set"}
              left={(props) => <List.Icon {...props} icon="map-marker" />}
            />
            <Divider />
            <List.Item
              title="Role"
              description={user?.role || "Farmer"}
              left={(props) => <List.Icon {...props} icon="briefcase" />}
            />
          </Card.Content>
        </Card>

        {/* Role-based actions */}
        {user?.role === "farmer" && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Veterinary</Title>
              <List.Item
                title="Apply as Veterinarian"
                description="Submit your professional details for review"
                left={(props) => <List.Icon {...props} icon="stethoscope" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => navigation.navigate("VetApplication")}
              />
            </Card.Content>
          </Card>
        )}

        {user?.role === "vet" && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Veterinary</Title>
              <List.Item
                title="Vet Dashboard"
                description="View and manage your consultations"
                left={(props) => <List.Icon {...props} icon="view-dashboard" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => navigation.navigate("VetDashboard")}
              />
            </Card.Content>
          </Card>
        )}

        {user?.role === "admin" && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Admin</Title>
              <List.Item
                title="Vet Approvals"
                description="Review and approve vet applications"
                left={(props) => <List.Icon {...props} icon="shield-check" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => navigation.navigate("AdminVetApprovals")}
              />
            </Card.Content>
          </Card>
        )}

        <Card style={styles.card}>
          <Card.Content>
            <Title>App Settings</Title>
            <List.Item
              title="Notifications"
              description="Manage your notifications"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate("NotificationsSettings")}
            />
            <Divider />
            <List.Item
              title="Dark Mode"
              description={isDarkMode ? "Dark theme enabled" : "Light theme enabled"}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={isDarkMode ? "weather-night" : "white-balance-sunny"}
                />
              )}
              right={() => (
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleDarkMode}
                  color="#16a34a"
                />
              )}
            />
            <Divider />
            <List.Item
              title="Data & Storage"
              description="Manage offline data"
              left={(props) => <List.Icon {...props} icon="database" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate("DataStorage")}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Support</Title>
            <List.Item
              title="Help Center"
              description="Get help and support"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate("HelpCenter")}
            />
            <Divider />
            <List.Item
              title="Privacy Policy"
              left={(props) => <List.Icon {...props} icon="shield-check" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() =>
                navigation.navigate("PrivacyTerms", { type: "privacy" })
              }
            />
            <Divider />
            <List.Item
              title="Terms of Service"
              left={(props) => <List.Icon {...props} icon="file-document" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() =>
                navigation.navigate("PrivacyTerms", { type: "terms" })
              }
            />
            <Divider />
            {/* <List.Item
              title="About"
              description="Version 1.0.0"
              left={(props) => <List.Icon {...props} icon="information" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            /> */}
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            icon="account-edit"
            onPress={() => navigation.navigate("EditProfile")}
            style={styles.button}
          >
            Edit Profile
          </Button>
          <Button
            mode="contained"
            icon="logout"
            onPress={handleLogout}
            style={styles.button}
            buttonColor="#ef4444"
          >
            Logout
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Mifugo</Text>
          <Text style={styles.footerSubtext}>© 2025 All Rights Reserved</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    backgroundColor: "#0f172a",
    padding: 32,
    alignItems: "center",
  },
  avatar: {
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#dcfce7",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: "#dcfce7",
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 6,
  },
  footer: {
    padding: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: "#9ca3af",
  },
});

export default ProfileScreen;