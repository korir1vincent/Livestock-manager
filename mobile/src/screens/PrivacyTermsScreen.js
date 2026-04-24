import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Title, Text } from "react-native-paper";

const PRIVACY_POLICY = `Last updated: January 2025

1. Information We Collect
We collect information you provide directly, such as your name, email, farm location, and animal data. We also collect usage data to improve the app.

2. How We Use Your Information
We use your data to provide veterinary consultation services, send reminders, generate health reports, and improve our platform.

3. Data Sharing
We do not sell your data. We share data only with veterinarians you consult with, and only what is necessary for the consultation.

4. Data Security
We use industry-standard encryption to protect your data. Passwords are hashed and never stored in plain text.

5. Your Rights
You can request deletion of your account and data at any time by contacting support@mifugo.app.

6. Cookies & Storage
We use local device storage (AsyncStorage) to store your preferences and authentication token.

7. Contact Us
For privacy concerns, contact us at privacy@mifugo.app.`;

const TERMS = `Last updated: January 2025

1. Acceptance of Terms
By using Mifugo, you agree to these terms. If you disagree, please do not use the app.

2. Use of Service
Mifugo is a livestock management and veterinary consultation platform. You agree to use it only for lawful purposes.

3. Veterinary Consultations
Consultations provided through the app are advisory in nature. For emergencies, always contact a local vet in person.

4. User Accounts
You are responsible for maintaining the security of your account. Do not share your credentials.

5. Intellectual Property
All content, features, and functionality of Mifugo are owned by Mifugo and protected by copyright law.

6. Limitation of Liability
Mifugo is not liable for any damages resulting from use or inability to use the service.

7. Changes to Terms
We may update these terms at any time. Continued use of the app constitutes acceptance of the new terms.

8. Contact
For questions about these terms, contact legal@mifugo.app.`;

const PrivacyTermsScreen = ({ route }) => {
  const type = route?.params?.type || "privacy";
  const isPrivacy = type === "privacy";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>{isPrivacy ? "Privacy Policy" : "Terms of Service"}</Title>
            <Text style={styles.body}>
              {isPrivacy ? PRIVACY_POLICY : TERMS}
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  content: { padding: 16 },
  card: { elevation: 2 },
  body: { fontSize: 14, color: "#4b5563", lineHeight: 24, marginTop: 12 },
});

export default PrivacyTermsScreen;
