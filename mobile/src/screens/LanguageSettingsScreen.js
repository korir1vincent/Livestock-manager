import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Card, Title, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "sw", label: "Swahili", flag: "🇰🇪" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "ar", label: "Arabic", flag: "🇸🇦" },
  { code: "pt", label: "Portuguese", flag: "🇵🇹" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
];

const LanguageSettingsScreen = () => {
  const [selected, setSelected] = useState("en");

  useEffect(() => {
    AsyncStorage.getItem("appLanguage").then((lang) => {
      if (lang) setSelected(lang);
    });
  }, []);

  const selectLanguage = async (code) => {
    setSelected(code);
    await AsyncStorage.setItem("appLanguage", code);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Select Language</Title>
            <Text style={styles.subtitle}>Choose your preferred language</Text>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langRow,
                  selected === lang.code && styles.langRowSelected,
                ]}
                onPress={() => selectLanguage(lang.code)}
              >
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text
                  style={[
                    styles.langLabel,
                    selected === lang.code && styles.langLabelSelected,
                  ]}
                >
                  {lang.label}
                </Text>
                {selected === lang.code && (
                  <Icon name="check-circle" size={22} color="#16a34a" />
                )}
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>
        <Text style={styles.note}>
          Note: Full translation support coming in a future update. Currently
          displays in English.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  content: { padding: 16 },
  card: { elevation: 2 },
  subtitle: { color: "#6b7280", fontSize: 13, marginBottom: 16 },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  langRowSelected: { backgroundColor: "#f0fdf4" },
  flag: { fontSize: 24, marginRight: 16 },
  langLabel: { flex: 1, fontSize: 16, color: "#374151" },
  langLabelSelected: { fontWeight: "700", color: "#16a34a" },
  note: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 8,
  },
});

export default LanguageSettingsScreen;
