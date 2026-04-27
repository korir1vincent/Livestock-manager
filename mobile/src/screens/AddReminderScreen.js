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
} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const AddReminderScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    type: "Vaccination",
    description: "",
    date: new Date(),
    priority: "Medium",
    animalId: "",
    notes: "",
  });
  const [animals, setAnimals] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { getAuthenticatedAxios } = useAuth();

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const api = getAuthenticatedAxios();
      const response = await api.get("/animals");
      setAnimals(response.data.animals);
    } catch (error) {
      console.error("Error fetching animals:", error);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!formData.description) {
      setError("Please enter a description");
      return;
    }
    setLoading(true);
    try {
      const api = getAuthenticatedAxios();
      await api.post("/reminders", formData);
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create reminder");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) =>
    setFormData({ ...formData, [field]: value });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <Title style={[styles.title, { color: colors.text }]}>
            Create Reminder
          </Title>

          <View style={styles.inputGroup}>
            <Title style={[styles.label, { color: colors.textMuted }]}>
              Type
            </Title>
            <SegmentedButtons
              value={formData.type}
              onValueChange={(v) => updateField("type", v)}
              buttons={[
                { value: "Vaccination", label: "Vaccination" },
                { value: "Checkup", label: "Checkup" },
                { value: "Medication", label: "Medication" },
              ]}
              style={styles.input}
            />
          </View>

          <TextInput
            label="Description *"
            value={formData.description}
            onChangeText={(v) => updateField("description", v)}
            mode="outlined"
            placeholder="e.g., Annual vaccination for FMD"
            style={styles.input}
          />

          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            Date: {formData.date.toLocaleDateString()}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) updateField("date", selectedDate);
              }}
              minimumDate={new Date()}
            />
          )}

          <View style={styles.inputGroup}>
            <Title style={[styles.label, { color: colors.textMuted }]}>
              Priority
            </Title>
            <SegmentedButtons
              value={formData.priority}
              onValueChange={(v) => updateField("priority", v)}
              buttons={[
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" },
              ]}
              style={styles.input}
            />
          </View>

          <View style={styles.pickerContainer}>
            <Title style={[styles.label, { color: colors.textMuted }]}>
              Animal (Optional)
            </Title>
            <View
              style={[
                styles.pickerWrapper,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Picker
                selectedValue={formData.animalId}
                onValueChange={(v) => updateField("animalId", v)}
                style={{ color: colors.text }}
              >
                <Picker.Item label="All Animals" value="" />
                {animals.map((animal) => (
                  <Picker.Item
                    key={animal._id}
                    label={`${animal.name} (${animal.tagId})`}
                    value={animal._id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <TextInput
            label="Notes"
            value={formData.notes}
            onChangeText={(v) => updateField("notes", v)}
            mode="outlined"
            multiline
            numberOfLines={4}
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
            Create Reminder
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
  container: { flex: 1 },
  scrollView: { flexGrow: 1 },
  content: { padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  input: { marginBottom: 16 },
  pickerContainer: { marginBottom: 16 },
  pickerWrapper: { borderRadius: 4, borderWidth: 1 },
  button: { marginTop: 8, paddingVertical: 6 },
});

export default AddReminderScreen;
