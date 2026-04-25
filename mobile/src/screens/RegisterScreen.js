import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Title, HelperText } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    farmLocation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleRegister = async () => {
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.card}>
          
          {/* <Text style={styles.logo}></Text> */}

          <Title style={styles.title}>Sign Up</Title>
          <Text style={styles.subtitle}>Join and manage your farm easily</Text>

          <TextInput
            label="Full Name"
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
            mode="outlined"
            style={styles.input}
            outlineColor="#e5e7eb"
            activeOutlineColor="#16a34a"
          />

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            outlineColor="#e5e7eb"
            activeOutlineColor="#16a34a"
          />

          <TextInput
            label="Farm Location"
            value={formData.farmLocation}
            onChangeText={(value) => updateField('farmLocation', value)}
            mode="outlined"
            style={styles.input}
            outlineColor="#e5e7eb"
            activeOutlineColor="#16a34a"
          />

          <TextInput
            label="Password"
            value={formData.password}
            onChangeText={(value) => updateField('password', value)}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            outlineColor="#e5e7eb"
            activeOutlineColor="#16a34a"
          />

          <TextInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateField('confirmPassword', value)}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            outlineColor="#e5e7eb"
            activeOutlineColor="#16a34a"
          />

          {error ? <HelperText type="error">{error}</HelperText> : null}

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
            buttonColor="#16a34a"
            labelStyle={styles.buttonText}
          >
            Register
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.linkButton}
            labelStyle={styles.linkText}
          >
            Already have an account? Login
          </Button>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4'
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 28,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8
  },
  logo: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 10
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 28
  },
  input: {
    marginBottom: 14,
    backgroundColor: '#ffffff'
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 10
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  linkButton: {
    marginTop: 18
  },
  linkText: {
    fontSize: 14,
    color: '#16a34a'
  }
});

export default RegisterScreen;