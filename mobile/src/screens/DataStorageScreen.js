import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Card, Title, Text, Button, List, Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const DataStorageScreen = () => {
  const [keys, setKeys] = useState([]);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      setKeys(allKeys);
    } catch (error) {
      console.error("Load keys error:", error);
    }
  };

  const clearItem = async (key) => {
    Alert.alert("Clear Data", `Remove "${key}" from storage?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem(key);
          loadKeys();
        },
      },
    ]);
  };

  const clearAllCache = async () => {
    Alert.alert(
      "Clear All Cache",
      "This will remove notification and language settings but keep your login. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            setClearing(true);
            try {
              const cacheKeys = keys.filter(
                (k) => !["authToken", "user"].includes(k),
              );
              await AsyncStorage.multiRemove(cacheKeys);
              loadKeys();
              Alert.alert("Done", "Cache cleared successfully");
            } finally {
              setClearing(false);
            }
          },
        },
      ],
    );
  };

  const getIcon = (key) => {
    if (key.includes("notification")) return "bell";
    if (key.includes("language")) return "translate";
    if (key === "authToken") return "key";
    if (key === "user") return "account";
    return "database";
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Stored Data</Title>
            <Text style={styles.subtitle}>
              {keys.length} items in local storage
            </Text>
            {keys.length === 0 ? (
              <Text style={styles.empty}>No data stored</Text>
            ) : (
              keys.map((key, index) => (
                <View key={key}>
                  <List.Item
                    title={key}
                    left={(props) => (
                      <List.Icon {...props} icon={getIcon(key)} />
                    )}
                    right={() =>
                      !["authToken", "user"].includes(key) && (
                        <Button
                          compact
                          mode="text"
                          textColor="#ef4444"
                          onPress={() => clearItem(key)}
                        >
                          Clear
                        </Button>
                      )
                    }
                  />
                  {index < keys.length - 1 && <Divider />}
                </View>
              ))
            )}
          </Card.Content>
        </Card>

        

        
      </View>
      <Button
          mode="contained"
          icon="trash-can"
          onPress={clearAllCache}
          loading={clearing}
          disabled={clearing}
          buttonColor="#ef4444"
          style={styles.clearButton}
        >
          Clear All Cache
        </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  content: { padding: 16 },
  card: { elevation: 2, marginBottom: 16 },
  subtitle: { color: "#6b7280", fontSize: 13, marginBottom: 16 },
  empty: { textAlign: "center", color: "#9ca3af", paddingVertical: 24 },
  clearButton: { paddingVertical: 6, marginBottom: 16 },
  note: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    paddingHorizontal: 8,
  },
});

export default DataStorageScreen;
