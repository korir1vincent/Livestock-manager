import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "./src/context/AuthContext";

// Screens
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
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
import SupplierDetailsScreen from "./src/screens/SupplierDetailsScreen";
import SplashScreen from "./src/screens/SplashScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import NotificationsSettingsScreen from "./src/screens/NotificationsSettingsScreen";
import LanguageSettingsScreen from "./src/screens/LanguageSettingsScreen";
import DataStorageScreen from "./src/screens/DataStorageScreen";
import HelpCenterScreen from "./src/screens/HelpCenterScreen";
import PrivacyTermsScreen from "./src/screens/PrivacyTermsScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const SplashStack = createNativeStackNavigator();

// Explicit theme to fix washed out colors in production builds
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#16a34a",
    onPrimary: "#ffffff",
    secondary: "#3b82f6",
    onSecondary: "#ffffff",
    background: "#f3f4f6",
    onBackground: "#1f2937",
    surface: "#ffffff",
    onSurface: "#1f2937",
    onSurfaceVariant: "#374151",
    outline: "#d1d5db",
    error: "#ef4444",
  },
};

function SplashStackScreen({ onFinish }) {
  return (
    <SplashStack.Navigator screenOptions={{ headerShown: false }}>
      <SplashStack.Screen name="Splash">
        {(props) => <SplashScreen {...props} onFinish={onFinish} />}
      </SplashStack.Screen>
    </SplashStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Home": iconName = "home"; break;
            case "Animals": iconName = "cow"; break;
            case "Scanner": iconName = "camera"; break;
            case "Reminders": iconName = "bell"; break;
            case "Profile": iconName = "account"; break;
            default: iconName = "circle";
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

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="AddAnimal" component={AddAnimalScreen} />
      <Stack.Screen name="AnimalDetail" component={AnimalDetailScreen} />
      <Stack.Screen name="AddReminder" component={AddReminderScreen} />
      <Stack.Screen name="Inventory" component={InventoryScreen} />
      <Stack.Screen name="AddInventory" component={AddInventoryScreen} />
      <Stack.Screen name="Financial" component={FinancialScreen} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
      <Stack.Screen name="AddRevenue" component={AddRevenueScreen} />
      <Stack.Screen name="Vet" component={VetScreen} />
      <Stack.Screen name="EditAnimal" component={EditAnimalScreen} />
      <Stack.Screen name="AddHealthRecord" component={AddHealthRecordScreen} />
      <Stack.Screen name="BookConsultation" component={BookConsultationScreen} />
      <Stack.Screen name="VetApplication" component={VetApplicationScreen} />
      <Stack.Screen name="VetDashboard" component={VetDashboardScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: "Consultation Chat" }} />
      <Stack.Screen name="AdminVetApprovals" component={AdminVetApprovalsScreen} />
      <Stack.Screen name="SupplierDetails" component={SupplierDetailsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: "Edit Profile" }} />
      <Stack.Screen name="NotificationsSettings" component={NotificationsSettingsScreen} options={{ title: "Notifications" }} />
      <Stack.Screen name="LanguageSettings" component={LanguageSettingsScreen} options={{ title: "Language" }} />
      <Stack.Screen name="DataStorage" component={DataStorageScreen} options={{ title: "Data & Storage" }} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} options={{ title: "Help Center" }} />
      <Stack.Screen name="PrivacyTerms" component={PrivacyTermsScreen} options={{ title: "Legal" }} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <AppStack /> : <AuthStack />;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PaperProvider theme={theme}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <NavigationContainer>
            {showSplash ? (
              <SplashStackScreen onFinish={() => setShowSplash(false)} />
            ) : (
              <RootNavigator />
            )}
          </NavigationContainer>
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}