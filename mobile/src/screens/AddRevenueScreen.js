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
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

const AddRevenueScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    category: "Sale",
    description: "",
    amount: "",
    date: new Date(),
    animalId: "",
    buyer: {
      name: "",
      contact: "",
    },
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
      const dataToSend = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      await api.post("/financial/revenues", dataToSend);
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add revenue");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const updateBuyer = (field, value) => {
    setFormData({
      ...formData,
      buyer: { ...formData.buyer, [field]: value },
    });
  };

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
            <Title style={styles.title}>Add Revenue</Title>

            <View style={styles.inputGroup}>
              <Title style={styles.label}>Category</Title>
              <SegmentedButtons
                value={formData.category}
                onValueChange={(value) => updateField("category", value)}
                buttons={[
                  { value: "Sale", label: "Sale" },
                  { value: "Milk", label: "Milk" },
                  { value: "Breeding", label: "Breeding" },
                  { value: "Other", label: "Other" },
                ]}
                style={styles.input}
              />
            </View>

            <TextInput
              label="Description *"
              value={formData.description}
              onChangeText={(value) => updateField("description", value)}
              mode="outlined"
              placeholder="e.g., Sale of cattle"
              style={styles.input}
            />

            <TextInput
              label="Amount *"
              value={formData.amount}
              onChangeText={(value) => updateField("amount", value)}
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
                  if (selectedDate) {
                    updateField("date", selectedDate);
                  }
                }}
                maximumDate={new Date()}
              />
            )}

            <View
              style={[
                styles.pickerContainer,
                { backgroundColor: isDarkMode ? "#1f2937" : "#ffffff" },
              ]}
            >
              <Title
                style={[
                  styles.label,
                  { color: isDarkMode ? "#f9fafb" : "#0f172a" },
                ]}
              >
                Animal (Optional)
              </Title>
              <Picker
                selectedValue={formData.animalId}
                onValueChange={(value) => updateField("animalId", value)}
                style={[
                  styles.picker,
                  {
                    color: isDarkMode ? "#f9fafb" : "#1f2937",
                    backgroundColor: isDarkMode ? "#374151" : "#ffffff",
                  },
                ]}
                dropdownIconColor={isDarkMode ? "#f9fafb" : "#1f2937"}
              >
                <Picker.Item label="General Revenue" value="" />
                {animals.map((animal) => (
                  <Picker.Item
                    key={animal._id}
                    label={`${animal.name} (${animal.tagId})`}
                    value={animal._id}
                  />
                ))}
              </Picker>
            </View>

            <Title style={styles.sectionTitle}>
              Buyer Information (Optional)
            </Title>

            <TextInput
              label="Buyer Name"
              value={formData.buyer.name}
              onChangeText={(value) => updateBuyer("name", value)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Buyer Contact"
              value={formData.buyer.contact}
              onChangeText={(value) => updateBuyer("contact", value)}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
            />

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
              loading={loading}
              disabled={loading}
              style={styles.button}
              buttonColor="#10b981"
            >
              Add Revenue
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
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scrollView: {
    flexGrowth: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 12,
    color: "#374151",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },
  input: {
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
});

export default AddRevenueScreen;
