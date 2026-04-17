// src/screens/SplashScreen.js

import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const sweep = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.sequence([
      // fade + scale in
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),

      // glow pulse
      Animated.timing(glow, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),

      // light sweep
      Animated.timing(sweep, {
        toValue: width,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  return (
    <View style={styles.container}>
      {/* light sweep */}
      <Animated.View
        style={[
          styles.sweep,
          {
            transform: [{ translateX: sweep }],
          },
        ]}
      />

      {/* center content */}
      <Animated.View
        style={[
          styles.center,
          {
            opacity: fade,
            transform: [{ scale }],
          },
        ]}
      >
        {/* glow behind logo */}
        
        {/* 🔥 YOUR LOGO IMAGE HERE */}
        <Animated.Image
          source={require("../../assets/icoon.jpeg")} // <-- adjust if needed
          style={[
            styles.logoImage,
            {
              opacity: fade,
              transform: [{ scale }],
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
  },

  logoImage: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },

  glowCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#22c55e",
  },

  sweep: {
    position: "absolute",
    width: 120,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.08)",
    transform: [{ rotate: "20deg" }],
  },
});