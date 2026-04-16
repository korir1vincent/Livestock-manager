// src/screens/VetApplicationScreen.js
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Title, HelperText, Text } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

const VetApplicationScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    phone: "",
    specialty: "",
    licenseNumber: "",
    experience: "",
    consultationFee: "",
    bio: "",
    languages: "",
    qualifications: "",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { getAuthenticatedAxios } = useAuth();

  const handleSubmit = async () => {
    setError("");
    if (
      !formData.phone ||
      !formData.specialty ||
      !formData.licenseNumber ||
      !formData.consultationFee
    ) {
      setError("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const api = getAuthenticatedAxios();
      await api.post("/vet/apply", {
        ...formData,
        experience: formData.experience ? parseInt(formData.experience) : 0,
        consultationFee: parseFloat(formData.consultationFee),
        languages: formData.languages
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
        qualifications: formData.qualifications
          .split(",")
          .map((q) => q.trim())
          .filter(Boolean),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) =>
    setFormData({ ...formData, [field]: value });
  const updateLocation = (field, value) =>
    setFormData({
      ...formData,
      location: { ...formData.location, [field]: value },
    });

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>✅</Text>
        <Title style={styles.successTitle}>Application Submitted!</Title>
        <Text style={styles.successText}>
          Your application is under review. An admin will approve or reject it
          shortly.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          buttonColor="#16a34a"
          style={styles.button}
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.content}>
            {/* <Title style={styles.title}>Apply as Veterinarian</Title>
          <Text style={styles.subtitle}>Fill in your professional details. An admin will review your application.</Text> */}

            <Text style={styles.sectionTitle}>Contact & License</Text>

            <TextInput
              label="Phone Number *"
              value={formData.phone}
              onChangeText={(v) => updateField("phone", v)}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
            />

            <TextInput
              label="License Number *"
              value={formData.licenseNumber}
              onChangeText={(v) => updateField("licenseNumber", v)}
              mode="outlined"
              style={styles.input}
            />

            <Text style={styles.sectionTitle}>Professional Info</Text>

            <TextInput
              label="Specialty *"
              value={formData.specialty}
              onChangeText={(v) => updateField("specialty", v)}
              mode="outlined"
              style={styles.input}
              placeholder="e.g. Livestock, Poultry, Large Animals"
            />

            <TextInput
              label="Years of Experience"
              value={formData.experience}
              onChangeText={(v) => updateField("experience", v)}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />

            <TextInput
              label="Consultation Fee (USD) *"
              value={formData.consultationFee}
              onChangeText={(v) => updateField("consultationFee", v)}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />

            <TextInput
              label="Languages (comma separated)"
              value={formData.languages}
              onChangeText={(v) => updateField("languages", v)}
              mode="outlined"
              style={styles.input}
              placeholder="e.g. English, Swahili, French"
            />

            <TextInput
              label="Qualifications (comma separated)"
              value={formData.qualifications}
              onChangeText={(v) => updateField("qualifications", v)}
              mode="outlined"
              style={styles.input}
              placeholder="e.g. BVM, MVSc, PhD"
            />

            <TextInput
              label="Bio"
              value={formData.bio}
              onChangeText={(v) => updateField("bio", v)}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              placeholder="Tell farmers about your experience and expertise"
            />

            <Text style={styles.sectionTitle}>Location</Text>

            <TextInput
              label="Address"
              value={formData.location.address}
              onChangeText={(v) => updateLocation("address", v)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="City"
              value={formData.location.city}
              onChangeText={(v) => updateLocation("city", v)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="State / County"
              value={formData.location.state}
              onChangeText={(v) => updateLocation("state", v)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Country"
              value={formData.location.country}
              onChangeText={(v) => updateLocation("country", v)}
              mode="outlined"
              style={styles.input}
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
              Submit Application
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
      </SafeAreaView>
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
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 12,
    marginTop: 8,
  },
  input: { marginBottom: 16 },
  button: { marginTop: 8, paddingVertical: 6 },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#f3f4f6",
  },
  successIcon: { fontSize: 64, marginBottom: 16 },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  successText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
});

export default VetApplicationScreen;
