import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  Card,
  Title,
  Text,
  TextInput,
  Button,
  HelperText,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const FAQS = [
  {
    q: "How do I add a new animal?",
    a: "Go to the Animals tab and tap the + button in the top right corner. Fill in the animal details and tap Save.",
  },
  {
    q: "How do I book a vet consultation?",
    a: "Go to Vet Consult from the Dashboard, browse available vets, and tap Book Consultation on the vet you want.",
  },
  {
    q: "How do I set a reminder?",
    a: "Go to the Reminders tab and tap Add Reminder. Select the animal, type, date and priority.",
  },
  {
    q: "How do I apply to become a veterinarian?",
    a: "Go to Profile → Apply as Veterinarian. Fill in your professional details and submit. An admin will review your application.",
  },
  {
    q: "How do I track expenses?",
    a: "Go to Dashboard → Financials. You can add expenses and revenue entries and view summaries.",
  },
  {
    q: "How do I scan an animal for health issues?",
    a: "Go to the Scanner tab and point your camera at the animal. The AI will analyze and return a health report.",
  },
  {
    q: "What do I do if the app shows a network error?",
    a: "Check that your backend server is running and your phone is on the same network. Update the API URL in your .env file if your IP has changed.",
  },
];

const HelpCenterScreen = () => {
  const [expanded, setExpanded] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = () => {
    if (!subject || !message) {
      setError("Please fill in both subject and message");
      return;
    }
    // Opens email client
    Linking.openURL(
      `mailto:support@mifugo.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`,
    );
    setSent(true);
    setSubject("");
    setMessage("");
    setError("");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Frequently Asked Questions</Title>
            {FAQS.map((faq, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={styles.faqRow}
                  onPress={() => setExpanded(expanded === index ? null : index)}
                >
                  <Text style={styles.faqQuestion}>{faq.q}</Text>
                  <Icon
                    name={expanded === index ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
                {expanded === index && (
                  <Text style={styles.faqAnswer}>{faq.a}</Text>
                )}
                {index < FAQS.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Contact Support</Title>
            <Text style={styles.subtitle}>
              Can't find your answer? Send us a message.
            </Text>

            {sent ? (
              <View style={styles.sentContainer}>
                <Icon name="check-circle" size={48} color="#16a34a" />
                <Text style={styles.sentText}>
                  Message sent! We'll get back to you within 24 hours.
                </Text>
                <Button mode="text" onPress={() => setSent(false)}>
                  Send another
                </Button>
              </View>
            ) : (
              <>
                <TextInput
                  label="Subject"
                  value={subject}
                  onChangeText={setSubject}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label="Message"
                  value={message}
                  onChangeText={setMessage}
                  mode="outlined"
                  multiline
                  numberOfLines={5}
                  style={styles.input}
                />
                {error ? <HelperText type="error">{error}</HelperText> : null}
                <Button
                  mode="contained"
                  onPress={handleSend}
                  buttonColor="#16a34a"
                  style={styles.button}
                >
                  Send Message
                </Button>
              </>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Other Ways to Reach Us</Title>
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => Linking.openURL("mailto:korirv09@gmail.com")}
            >
              <Icon name="email" size={22} color="#3b82f6" />
              <Text style={styles.contactText}>korirv09@gmail.com</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => Linking.openURL("tel:+254790326063")}
            >
              <Icon name="phone" size={22} color="#16a34a" />
              <Text style={styles.contactText}>+254 790 326 063</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  content: { padding: 16 },
  card: { elevation: 2, marginBottom: 16 },
  subtitle: { color: "#6b7280", fontSize: 13, marginBottom: 16 },
  faqRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 22,
    paddingBottom: 12,
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  divider: { height: 1, backgroundColor: "#e5e7eb" },
  input: { marginBottom: 16 },
  button: { paddingVertical: 6 },
  sentContainer: { alignItems: "center", paddingVertical: 24 },
  sentText: {
    fontSize: 15,
    color: "#374151",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  contactText: { fontSize: 15, color: "#374151" },
});

export default HelpCenterScreen;
