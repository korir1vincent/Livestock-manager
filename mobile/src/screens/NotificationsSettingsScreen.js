import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Title, Text, List, Switch, Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";

const DEFAULTS = {
  reminders: true,
  healthAlerts: true,
  consultationUpdates: true,
  inventoryAlerts: false,
  financialReports: false,
  vetResponses: true,
};

const NotificationsSettingsScreen = () => {
  const { colors } = useTheme();
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem("notificationSettings");
      if (stored) setSettings(JSON.parse(stored));
    } catch (error) {
      console.error("Load notification settings error:", error);
    }
  };

  const toggle = async (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    await AsyncStorage.setItem("notificationSettings", JSON.stringify(updated));
  };

  const items = [
    {
      key: "reminders",
      title: "Reminders",
      desc: "Vaccination and treatment reminders",
    },
    {
      key: "healthAlerts",
      title: "Health Alerts",
      desc: "Alerts for sick or at-risk animals",
    },
    {
      key: "consultationUpdates",
      title: "Consultation Updates",
      desc: "Status changes on your consultations",
    },
    {
      key: "vetResponses",
      title: "Vet Responses",
      desc: "Messages from veterinarians",
    },
    {
      key: "inventoryAlerts",
      title: "Inventory Alerts",
      desc: "Low stock warnings",
    },
    {
      key: "financialReports",
      title: "Financial Reports",
      desc: "Weekly expense summaries",
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background}]}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Notification Preferences</Title>
            <Text style={styles.subtitle}>
              Choose what you want to be notified about
            </Text>
            {items.map((item, index) => (
              <View key={item.key}>
                <List.Item
                  title={item.title}
                  description={item.desc}
                  left={(props) => <List.Icon {...props} icon="bell-outline" />}
                  right={() => (
                    <Switch
                      value={settings[item.key]}
                      onValueChange={() => toggle(item.key)}
                      color="#16a34a"
                    />
                  )}
                />
                {index < items.length - 1 && <Divider />}
              </View>
            ))}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  content: { padding: 16 },
  card: { elevation: 2 },
  subtitle: { color: "#6b7280", fontSize: 13, marginBottom: 16 },
});

export default NotificationsSettingsScreen;
