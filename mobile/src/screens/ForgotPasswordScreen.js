import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { TextInput, Button, Text, Title, HelperText } from "react-native-paper";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const ForgotPasswordScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: email, 2: code + new password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSendCode = async () => {
    setError("");
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    if (!code) {
      setError("Please enter the reset code");
      return;
    }
    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        code,
        newPassword,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>✅</Text>
        <Title style={styles.successTitle}>Password Reset!</Title>
        <Text style={styles.successText}>
          Your password has been reset successfully.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Login")}
          buttonColor="#16a34a"
          style={styles.button}
        >
          Back to Login
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.icon}>🔐</Text>
          <Title style={styles.title}>
            {step === 1 ? "Forgot Password" : "Enter Reset Code"}
          </Title>
          <Text style={styles.subtitle}>
            {step === 1
              ? "Enter your email and we'll send you a reset code"
              : `We sent a 6-digit code to ${email}`}
          </Text>

          {step === 1 ? (
            <>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                outlineColor="#e5e7eb"
                activeOutlineColor="#16a34a"
              />
              {error ? <HelperText type="error">{error}</HelperText> : null}
              <Button
                mode="contained"
                onPress={handleSendCode}
                loading={loading}
                disabled={loading}
                style={styles.button}
                buttonColor="#16a34a"
              >
                Send Reset Code
              </Button>
            </>
          ) : (
            <>
              <TextInput
                label="6-Digit Code"
                value={code}
                onChangeText={setCode}
                mode="outlined"
                keyboardType="number-pad"
                maxLength={6}
                style={styles.input}
                outlineColor="#e5e7eb"
                activeOutlineColor="#16a34a"
              />
              <TextInput
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                mode="outlined"
                secureTextEntry
                style={styles.input}
                outlineColor="#e5e7eb"
                activeOutlineColor="#16a34a"
              />
              <TextInput
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                secureTextEntry
                style={styles.input}
                outlineColor="#e5e7eb"
                activeOutlineColor="#16a34a"
              />
              {error ? <HelperText type="error">{error}</HelperText> : null}
              <Button
                mode="contained"
                onPress={handleResetPassword}
                loading={loading}
                disabled={loading}
                style={styles.button}
                buttonColor="#16a34a"
              >
                Reset Password
              </Button>
              <Button
                mode="text"
                onPress={() => {
                  setStep(1);
                  setError("");
                }}
                style={styles.linkButton}
              >
                Change Email
              </Button>
            </>
          )}

          <Button
            mode="text"
            onPress={() => navigation.navigate("Login")}
            style={styles.linkButton}
          >
            Back to Login
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  scrollView: { flexGrow: 1, justifyContent: "center", padding: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 28,
    borderRadius: 20,
    elevation: 8,
  },
  icon: { fontSize: 48, textAlign: "center", marginBottom: 8 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 24,
  },
  input: { marginBottom: 14, backgroundColor: "#fff" },
  button: { marginTop: 8, paddingVertical: 6, borderRadius: 10 },
  linkButton: { marginTop: 8 },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#f0fdf4",
  },
  successIcon: { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  successText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
  },
});

export default ForgotPasswordScreen;
