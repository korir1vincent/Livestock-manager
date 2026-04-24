import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { TextInput, Button, Title, HelperText, Text } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

const EditProfileScreen = ({ navigation }) => {
  const { user, getAuthenticatedAxios, login } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    farmLocation: user?.farmLocation || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setError("New passwords do not match");
      return;
    }
    if (formData.newPassword && formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const api = getAuthenticatedAxios();
      const payload = {
        name: formData.name,
        farmLocation: formData.farmLocation,
      };
      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }
      await api.put("/auth/profile", payload);
      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => setFormData({ ...formData, [field]: value });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <Title style={styles.title}>Edit Profile</Title>

          <Text style={styles.sectionTitle}>Basic Info</Text>

          <TextInput
            label="Name"
            value={formData.name}
            onChangeText={(v) => update("name", v)}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Farm Location"
            value={formData.farmLocation}
            onChangeText={(v) => update("farmLocation", v)}
            mode="outlined"
            style={styles.input}
          />

          <Text style={styles.sectionTitle}>Change Password</Text>
          <Text style={styles.sectionSubtitle}>
            Leave blank to keep current password
          </Text>

          <TextInput
            label="Current Password"
            value={formData.currentPassword}
            onChangeText={(v) => update("currentPassword", v)}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />

          <TextInput
            label="New Password"
            value={formData.newPassword}
            onChangeText={(v) => update("newPassword", v)}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />

          <TextInput
            label="Confirm New Password"
            value={formData.confirmPassword}
            onChangeText={(v) => update("confirmPassword", v)}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />

          {error ? <HelperText type="error">{error}</HelperText> : null}

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
            buttonColor="#16a34a"
          >
            Save Changes
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
          >
            Cancel
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  scrollView: { flexGrow: 1 },
  content: { padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 4,
    marginTop: 8,
  },
  sectionSubtitle: { fontSize: 13, color: "#9ca3af", marginBottom: 12 },
  input: { marginBottom: 16 },
  button: { marginTop: 8, paddingVertical: 6 },
});

export default EditProfileScreen;
