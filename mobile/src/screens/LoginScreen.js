import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { TextInput, Button, Text, Title, HelperText } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.card}>
          {/* <Text style={styles.logo}>🌿</Text> */}

          <Title style={styles.title}>Welcome Back</Title>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateField("email", value)}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            outlineColor="#e5e7eb"
            activeOutlineColor="#16a34a"
          />

          <TextInput
            label="Password"
            value={formData.password}
            onChangeText={(value) => updateField("password", value)}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            outlineColor="#e5e7eb"
            activeOutlineColor="#16a34a"
          />

          {error ? <HelperText type="error">{error}</HelperText> : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
            buttonColor="#16a34a"
            labelStyle={styles.buttonText}
          >
            Sign In
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate("Register")}
            style={styles.linkButton}
            labelStyle={styles.linkText}
          >
            Don't have an account? Register
          </Button>
          <Button
            mode="text"
            onPress={() => navigation.navigate("ForgotPassword")}
            style={styles.linkButton}
            labelStyle={styles.linkText}
          >
            Forgot Password?
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 28,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  logo: {
    fontSize: 60,
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 28,
  },
  input: {
    marginBottom: 14,
    backgroundColor: "#ffffff",
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 18,
  },
  linkText: {
    fontSize: 14,
    color: "#16a34a",
  },
});

export default LoginScreen;
