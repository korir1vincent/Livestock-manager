// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

// Auth Screens
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

// Main Screens
import DashboardScreen from "./src/screens/DashboardScreen";
import AnimalsScreen from "./src/screens/AnimalsScreen";
import AddAnimalScreen from "./src/screens/AddAnimalScreen";
import AnimalDetailScreen from "./src/screens/AnimalDetailScreen";
import ScannerScreen from "./src/screens/ScannerScreen";
import RemindersScreen from "./src/screens/RemindersScreen";
import AddReminderScreen from "./src/screens/AddReminderScreen";
import InventoryScreen from "./src/screens/InventoryScreen";
import AddInventoryScreen from "./src/screens/AddInventoryScreen";
import FinancialScreen from "./src/screens/FinancialScreen";
import AddExpenseScreen from "./src/screens/AddExpenseScreen";
import AddRevenueScreen from "./src/screens/AddRevenueScreen";
import VetScreen from "./src/screens/VetScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import EditAnimalScreen from "./src/screens/EditAnimalScreen";
import AddHealthRecordScreen from "./src/screens/AddHealthRecordScreen";
import BookConsultationScreen from "./src/screens/BookConsultationScreen";
import VetApplicationScreen from "./src/screens/VetApplicationScreen";
import VetDashboardScreen from "./src/screens/VetDashboardScreen";
import ChatScreen from "./src/screens/ChatScreen";
import AdminVetApprovalsScreen from "./src/screens/AdminVetApprovalsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Animals":
              iconName = "cow";
              break;
            case "Scanner":
              iconName = "camera";
              break;
            case "Reminders":
              iconName = "bell";
              break;
            case "Profile":
              iconName = "account";
              break;
            default:
              iconName = "circle";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#16a34a",
        tabBarInactiveTintColor: "#6b7280",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Animals" component={AnimalsScreen} />
      <Tab.Screen name="Scanner" component={ScannerScreen} />
      <Tab.Screen name="Reminders" component={RemindersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Auth Navigator
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#f3f4f6" },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Main App Navigator
function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: "#f3f4f6" },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddAnimal"
        component={AddAnimalScreen}
        options={{ title: "Add Animal" }}
      />
      <Stack.Screen
        name="AnimalDetail"
        component={AnimalDetailScreen}
        options={{ title: "Animal Details" }}
      />
      <Stack.Screen
        name="AddReminder"
        component={AddReminderScreen}
        options={{ title: "Add Reminder" }}
      />
      <Stack.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{ title: "Inventory" }}
      />
      <Stack.Screen
        name="AddInventory"
        component={AddInventoryScreen}
        options={{ title: "Add Inventory Item" }}
      />
      <Stack.Screen
        name="Financial"
        component={FinancialScreen}
        options={{ title: "Financial Tracking" }}
      />
      <Stack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{ title: "Add Expense" }}
      />
      <Stack.Screen
        name="AddRevenue"
        component={AddRevenueScreen}
        options={{ title: "Add Revenue" }}
      />
      <Stack.Screen
        name="Vet"
        component={VetScreen}
        options={{ title: "Veterinary Services" }}
      />
      <Stack.Screen
        name="EditAnimal"
        component={EditAnimalScreen}
        options={{ title: "Edit Animal" }}
      />
      <Stack.Screen
        name="AddHealthRecord"
        component={AddHealthRecordScreen}
        options={{ title: "Add Health Record" }}
      />
      <Stack.Screen
        name="BookConsultation"
        component={BookConsultationScreen}
        options={{ title: "Book Consultation" }}
      />
      <Stack.Screen
        name="VetApplication"
        component={VetApplicationScreen}
        options={{ title: "Apply as Vet" }}
      />
      <Stack.Screen
        name="VetDashboard"
        component={VetDashboardScreen}
        options={{ title: "Vet Dashboard", headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: "Consultation Chat" }}
      />
      <Stack.Screen
        name="AdminVetApprovals"
        component={AdminVetApprovalsScreen}
        options={{ title: "Vet Applications" }}
      />
    </Stack.Navigator>
  );
}

// Root Navigator
function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PaperProvider>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          {/* <SafeAreaView style={{ flex: 1 }}> */}
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          {/* </SafeAreaView> */}
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
