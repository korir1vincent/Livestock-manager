// src/context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

const lightTheme = {
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

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#16a34a",
    onPrimary: "#ffffff",
    secondary: "#3b82f6",
    onSecondary: "#ffffff",
    background: "#0f172a",
    onBackground: "#f1f5f9",
    surface: "#1e293b",
    onSurface: "#f1f5f9",
    onSurfaceVariant: "#94a3b8",
    outline: "#334155",
    error: "#ef4444",
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("darkMode").then((value) => {
      if (value !== null) setIsDarkMode(JSON.parse(value));
    });
  }, []);

  const toggleDarkMode = async (value) => {
    setIsDarkMode(value);
    await AsyncStorage.setItem("darkMode", JSON.stringify(value));
  };

  const theme = isDarkMode ? darkTheme : lightTheme;
  const colors = {
    background: isDarkMode ? "#0f172a" : "#f3f4f6",
    surface: isDarkMode ? "#1e293b" : "#ffffff",
    text: isDarkMode ? "#f1f5f9" : "#1f2937",
    textMuted: isDarkMode ? "#94a3b8" : "#6b7280",
    border: isDarkMode ? "#334155" : "#e5e7eb",
    card: isDarkMode ? "#1e293b" : "#ffffff",
    header: isDarkMode ? "#0f172a" : "#16a34a",
    primary: "#16a34a",
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, theme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};