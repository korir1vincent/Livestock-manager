import React from "react";
import { View, Text, StyleSheet, Linking, ScrollView } from "react-native";
import { Card, Button, Avatar, Divider } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

const SupplierDetailsScreen = ({ route }) => {
  const { colors } = useTheme();
  const { itemId } = route.params;

  const supplier = {
    name: "ABC Agro Suppliers",
    phone: "+254712345678",
    location: "Nairobi Industrial Area",
    delivery: "1 - 2 Days",
    rating: 4.7,
    products: ["Animal Feed", "Vaccines", "Farm Tools"],
  };

  const callSupplier = () => {
    Linking.openURL(`tel:${supplier.phone}`);
  };

  const whatsappSupplier = () => {
    Linking.openURL(
      `https://wa.me/${supplier.phone}?text=Hello, I want to reorder livestock supplies`
    );
  };

  return (
    
    <ScrollView style={[styles.container, {backgroundColor: colors.background}]}>
      <SafeAreaView>

      {/* Supplier Profile */}
      <Card style={styles.card}>
        <Card.Content style={styles.profile}>
          <Avatar.Icon size={60} icon="store" style={styles.avatar} />
          <View>
            <Text style={styles.name}>{supplier.name}</Text>
            <View style={styles.ratingRow}>
              <Icon name="star" size={18} color="#facc15" />
              <Text style={styles.rating}>{supplier.rating} Supplier Rating</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Supplier Information */}
      <Card style={styles.card}>
        <Card.Title title="Supplier Information" />
        <Card.Content>

          <View style={styles.infoRow}>
            <Icon name="map-marker" size={20} color="#16a34a" />
            <Text style={styles.infoText}>{supplier.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="truck-delivery" size={20} color="#16a34a" />
            <Text style={styles.infoText}>
              Delivery Time: {supplier.delivery}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="barcode" size={20} color="#16a34a" />
            <Text style={styles.infoText}>Item ID: {itemId}</Text>
          </View>

        </Card.Content>
      </Card>

      {/* Products */}
      <Card style={styles.card}>
        <Card.Title title="Products Supplied" />
        <Card.Content>
          {supplier.products.map((product, index) => (
            <Text key={index} style={styles.product}>
              • {product}
            </Text>
          ))}
        </Card.Content>
      </Card>

      {/* Contact Actions */}
      <Card style={styles.card}>
        <Card.Title title="Contact Supplier" />
        <Card.Content>

          <Button
            icon="phone"
            mode="contained"
            style={styles.button}
            onPress={callSupplier}
          >
            Call Supplier
          </Button>

          <Button
            icon="whatsapp"
            mode="contained"
            buttonColor="#25D366"
            style={styles.button}
            onPress={whatsappSupplier}
          >
            Order via WhatsApp
          </Button>

        </Card.Content>
      </Card>

      {/* Reorder Section */}
      <Card style={styles.card}>
        <Card.Title title="Reorder Stock" />
        <Card.Content>

          <Text style={styles.reorderText}>
            Your inventory is running low. You can reorder supplies directly
            from this supplier.
          </Text>

          <Button
            icon="cart-plus"
            mode="contained"
            buttonColor="#ef4444"
            style={styles.reorderBtn}
          >
            Place Reorder
          </Button>

        </Card.Content>
      </Card>
      </SafeAreaView>

    </ScrollView>
  );
};

export default SupplierDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },

  card: {
    marginBottom: 15,
  },

  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  avatar: {
    backgroundColor: "#16a34a",
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  rating: {
    marginLeft: 5,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },

  infoText: {
    fontSize: 15,
  },

  product: {
    fontSize: 15,
    marginBottom: 5,
  },

  button: {
    marginBottom: 10,
  },

  reorderText: {
    marginBottom: 10,
  },

  reorderBtn: {
    marginTop: 5,
  },
});