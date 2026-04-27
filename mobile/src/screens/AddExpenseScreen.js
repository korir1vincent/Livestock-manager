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
import { SafeAreaView } from "react-native-safe-area-context";

const AddExpenseScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    category: "Feed",
    description: "",
    amount: "",
    date: new Date(),
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
    if (!formData.description || !formData.amount) {
      setError("Please fill in required fields (Description, Amount)");
      return;
    }
    setLoading(true);
    try {
      const api = getAuthenticatedAxios();
      await api.post("/financial/expenses", {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) =>
    setFormData({ ...formData, [field]: value });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.content}>
            <Title style={[styles.title, { color: colors.text }]}>
              Add Expense
            </Title>

            <View style={styles.inputGroup}>
              <Title style={[styles.label, { color: colors.textMuted }]}>
                Category
              </Title>
              <SegmentedButtons
                value={formData.category}
                onValueChange={(v) => updateField("category", v)}
                buttons={[
                  { value: "Feed", label: "Feed" },
                  { value: "Veterinary", label: "Veterinary" },
                  { value: "Medicine", label: "Medicine" },
                ]}
                style={styles.input}
              />
              <SegmentedButtons
                value={formData.category}
                onValueChange={(v) => updateField("category", v)}
                buttons={[
                  { value: "Equipment", label: "Equipment" },
                  { value: "Labor", label: "Labor" },
                  { value: "Other", label: "Other" },
                ]}
                style={styles.input}
              />
            </View>

            <TextInput
              label="Description *"
              value={formData.description}
              onChangeText={(v) => updateField("description", v)}
              mode="outlined"
              placeholder="e.g., Monthly feed purchase"
              style={styles.input}
            />

            <TextInput
              label="Amount *"
              value={formData.amount}
              onChangeText={(v) => updateField("amount", v)}
              mode="outlined"
              keyboardType="numeric"
              placeholder="0.00"
              left={<TextInput.Affix text="KES" />}
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
                maximumDate={new Date()}
              />
            )}

            <View style={styles.pickerContainer}>
              <Title style={[styles.label, { color: colors.textMuted }]}>
                Animal (Optional)
              </Title>
              <View
                style={[
                  styles.pickerWrapper,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Picker
                  selectedValue={formData.animalId}
                  onValueChange={(v) => updateField("animalId", v)}
                  style={{ color: colors.text }}
                >
                  <Picker.Item label="General Expense" value="" />
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
              Add Expense
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
    </SafeAreaView>
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

export default AddExpenseScreen;
