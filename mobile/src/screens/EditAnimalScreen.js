import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  TextInput,
  Button,
  Title,
  HelperText,
  SegmentedButtons,
  ActivityIndicator,
} from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";

const EditAnimalScreen = ({ route, navigation }) => {
  const { animalId } = route.params;
  const [formData, setFormData] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { getAuthenticatedAxios } = useAuth();

  useEffect(() => {
    fetchAnimal();
  }, []);

  const fetchAnimal = async () => {
    try {
      const api = getAuthenticatedAxios();
      const response = await api.get(`/animals/${animalId}`);
      const animal = response.data.animal;
      setFormData({
        ...animal,
        dateOfBirth: new Date(animal.dateOfBirth),
        weight: animal.weight ? String(animal.weight) : "",
      });
    } catch (err) {
      setError("Failed to load animal");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!formData.name || !formData.tagId || !formData.type) {
      setError("Please fill in required fields (Name, Tag ID, Type)");
      return;
    }
    setSaving(true);
    try {
      const api = getAuthenticatedAxios();
      const dataToSend = {
        ...formData,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
      };
      await api.put(`/animals/${animalId}`, dataToSend);
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update animal");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  if (loading || !formData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <Title style={styles.title}>Edit Animal</Title>

          <TextInput
            label="Name *"
            value={formData.name}
            onChangeText={(value) => updateField("name", value)}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Tag ID *"
            value={formData.tagId}
            onChangeText={(value) => updateField("tagId", value)}
            mode="outlined"
            style={styles.input}
          />

          <SegmentedButtons
            value={formData.type}
            onValueChange={(value) => updateField("type", value)}
            buttons={[
              { value: "Cattle", label: "Cattle" },
              { value: "Goat", label: "Goat" },
              { value: "Sheep", label: "Sheep" },
              { value: "Pig", label: "Pig" },
            ]}
            style={styles.input}
          />

          <TextInput
            label="Breed"
            value={formData.breed}
            onChangeText={(value) => updateField("breed", value)}
            mode="outlined"
            style={styles.input}
          />

          <SegmentedButtons
            value={formData.gender}
            onValueChange={(value) => updateField("gender", value)}
            buttons={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
            ]}
            style={styles.input}
          />

          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            Date of Birth: {formData.dateOfBirth.toLocaleDateString()}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={formData.dateOfBirth}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) updateField("dateOfBirth", selectedDate);
              }}
              maximumDate={new Date()}
            />
          )}

          <TextInput
            label="Weight (kg)"
            value={formData.weight}
            onChangeText={(value) => updateField("weight", value)}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Color"
            value={formData.color}
            onChangeText={(value) => updateField("color", value)}
            mode="outlined"
            style={styles.input}
          />

          <SegmentedButtons
            value={formData.healthStatus}
            onValueChange={(value) => updateField("healthStatus", value)}
            buttons={[
              { value: "Healthy", label: "Healthy" },
              { value: "Sick", label: "Sick" },
            ]}
            style={styles.input}
          />

          {formData.gender === "Female" && (
            <SegmentedButtons
              value={formData.pregnancyStatus}
              onValueChange={(value) => updateField("pregnancyStatus", value)}
              buttons={[
                { value: "Not Pregnant", label: "Not Pregnant" },
                { value: "Pregnant", label: "Pregnant" },
              ]}
              style={styles.input}
            />
          )}

          <TextInput
            label="Notes"
            value={formData.notes}
            onChangeText={(value) => updateField("notes", value)}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          {error ? <HelperText type="error">{error}</HelperText> : null}

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={saving}
            disabled={saving}
            style={styles.button}
            buttonColor="#16a34a"
          >
            Save Changes
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
            buttonColor="#e20f1a"
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  scrollView: { flexGrow: 1 },
  content: { padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: { marginBottom: 16 },
  button: { marginTop: 8, paddingVertical: 6 },
});

export default EditAnimalScreen;
