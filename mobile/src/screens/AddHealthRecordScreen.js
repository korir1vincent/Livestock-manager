import React, { useState } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Title, HelperText, SegmentedButtons } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../context/ThemeContext";

const AddHealthRecordScreen = ({ route, navigation }) => {
  const { animalId } = route.params;
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    type: "Checkup",
    date: new Date(),
    diagnosis: "",
    treatment: "",
    veterinarian: "",
    notes: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { getAuthenticatedAxios } = useAuth();

  const handleSubmit = async () => {
    setError("");
    if (!formData.type) { setError("Please select a record type"); return; }
    setLoading(true);
    try {
      const api = getAuthenticatedAxios();
      await api.post(`/animals/${animalId}/health-records`, formData);
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add health record");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => setFormData({ ...formData, [field]: value });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <Title style={[styles.title, { color: colors.text }]}>Add Health Record</Title>

          <SegmentedButtons value={formData.type} onValueChange={(v) => updateField("type", v)}
            buttons={[
              { value: "Checkup", label: "Checkup" },
              { value: "Vaccination", label: "Vaccination" },
              { value: "Treatment", label: "Treatment" },
              { value: "Surgery", label: "Surgery" },
            ]} style={styles.input} />

          <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.input}>
            Date: {formData.date.toLocaleDateString()}
          </Button>

          {showDatePicker && (
            <DateTimePicker value={formData.date} mode="date" display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) updateField("date", selectedDate);
              }} maximumDate={new Date()} />
          )}

          <TextInput label="Diagnosis" value={formData.diagnosis}
            onChangeText={(v) => updateField("diagnosis", v)} mode="outlined" style={styles.input} />

          <TextInput label="Treatment" value={formData.treatment}
            onChangeText={(v) => updateField("treatment", v)} mode="outlined" style={styles.input} />

          <TextInput label="Veterinarian" value={formData.veterinarian}
            onChangeText={(v) => updateField("veterinarian", v)} mode="outlined" style={styles.input} />

          <TextInput label="Notes" value={formData.notes}
            onChangeText={(v) => updateField("notes", v)} mode="outlined"
            multiline numberOfLines={4} style={styles.input} />

          {error ? <HelperText type="error">{error}</HelperText> : null}

          <Button mode="contained" onPress={handleSubmit} loading={loading}
            disabled={loading} style={styles.button} buttonColor="#10b981">
            Save Record
          </Button>

          <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.button}>
            Cancel
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flexGrow: 1 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  input: { marginBottom: 16 },
  button: { marginTop: 8, paddingVertical: 6 },
});

export default AddHealthRecordScreen;