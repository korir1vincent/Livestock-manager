// src/screens/ScannerScreen.js
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Alert, ScrollView, TouchableOpacity } from "react-native";
import {
  Button,
  Text,
  Card,
  Title,
  ActivityIndicator,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const ScannerScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("scanner");
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [expandedScan, setExpandedScan] = useState(null);
  const { getAuthenticatedAxios } = useAuth();

  useEffect(() => { requestPermissions(); }, []);

  useEffect(() => {
    if (activeTab === "history") fetchScanHistory();
  }, [activeTab]);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      Alert.alert("Permission Required", "Camera and photo library permissions are needed");
    }
  };

  const fetchScanHistory = async () => {
    setLoadingHistory(true);
    try {
      const api = getAuthenticatedAxios();
      const response = await api.get("/scan");
      setScanHistory(response.data.scans);
    } catch (error) {
      console.error("Fetch history error:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const pickImage = async (useCamera = false) => {
    try {
      let result;
      if (useCamera) {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"], allowsEditing: true, aspect: [4, 3], quality: 0.9,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"], allowsEditing: true, aspect: [4, 3], quality: 0.9,
        });
      }
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setAnalysisResult(null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    try {
      const api = getAuthenticatedAxios();
      const authHeader = api.defaults.headers.Authorization;
      const filename = selectedImage.split("/").pop();
      const ext = filename.split(".").pop().toLowerCase();
      const mime = `image/${ext === "jpg" ? "jpeg" : ext}`;
      const formData = new FormData();
      formData.append("image", { uri: selectedImage, name: filename, type: mime });
      const response = await fetch(`${API_URL}/scan/analyze`, {
        method: "POST",
        headers: { Authorization: authHeader, "Content-Type": "multipart/form-data" },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Analysis failed");
      setAnalysisResult(data.analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      Alert.alert("Error", error.message || "Failed to analyze image");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveResults = async () => {
    if (!analysisResult) return;
    setIsSaving(true);
    try {
      const api = getAuthenticatedAxios();
      await api.post("/scan", {
        livestock: analysisResult.livestock,
        healthStatus: analysisResult.healthStatus,
        condition: analysisResult.condition,
        severity: analysisResult.severity,
        confidence: analysisResult.confidence,
        symptoms: analysisResult.symptoms,
        recommendations: analysisResult.recommendations,
        vetConsultRequired: analysisResult.vetConsultRequired,
        imageUrl: selectedImage,
        scannedAt: new Date()
      });
      Alert.alert("Saved!", "Scan results saved to history", [
        { text: "View History", onPress: () => { resetScanner(); setActiveTab("history"); } },
        { text: "Scan Another", onPress: resetScanner }
      ]);
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save scan results");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteScan = async (scanId) => {
    Alert.alert("Delete Scan", "Are you sure you want to delete this scan?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: async () => {
          try {
            const api = getAuthenticatedAxios();
            await api.delete(`/scan/${scanId}`);
            if (expandedScan?._id === scanId) setExpandedScan(null);
            fetchScanHistory();
          } catch (error) {
            Alert.alert("Error", "Failed to delete scan");
          }
        }
      }
    ]);
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High": return "#ef4444";
      case "Medium": return "#f59e0b";
      case "Low": return "#10b981";
      default: return "#6b7280";
    }
  };

  const renderFullResults = (scan) => (
    <View style={styles.expandedResults}>
      {/* Summary */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Detected:</Text>
            <Text style={styles.resultValue}>{scan.livestock}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Confidence:</Text>
            <Text style={styles.resultValue}>
              {scan.confidence ? (scan.confidence * 100).toFixed(0) + "%" : "N/A"}
            </Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Health Status:</Text>
            <Text style={[styles.resultValue, { color: getSeverityColor(scan.severity) }]}>
              {scan.healthStatus}
            </Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Severity:</Text>
            <Text style={[styles.resultValue, { color: getSeverityColor(scan.severity) }]}>
              {scan.severity}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Condition & Symptoms */}
      <Card style={[styles.card, styles.conditionCard]}>
        <Card.Content>
          <View style={styles.conditionHeader}>
            <Icon name="alert-circle" size={24} color="#f59e0b" />
            <Title style={styles.conditionTitle}>{scan.condition}</Title>
          </View>
          {scan.symptoms?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Observed Symptoms:</Text>
              {scan.symptoms.map((symptom, i) => (
                <View key={i} style={styles.listItem}>
                  <Icon name="circle-small" size={20} color="#6b7280" />
                  <Text style={styles.listText}>{symptom}</Text>
                </View>
              ))}
            </>
          )}
        </Card.Content>
      </Card>

      {/* Recommendations */}
      {scan.recommendations?.map((rec, index) => (
        <Card key={index} style={styles.card}>
          <Card.Content>
            <Title>{rec.type}</Title>
            {rec.items?.map((item, i) => (
              <View key={i} style={styles.listItem}>
                <Icon name="check-circle" size={18} color="#16a34a" />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      ))}

      {/* Vet consult */}
      {scan.vetConsultRequired && (
        <Card style={[styles.card, styles.vetCard]}>
          <Card.Content>
            <View style={styles.vetHeader}>
              <Icon name="stethoscope" size={24} color="#3b82f6" />
              <Text style={styles.vetText}>Veterinary consultation recommended</Text>
            </View>
            <Button mode="contained" icon="phone"
              onPress={() => navigation.navigate("Vet")}
              style={styles.button} buttonColor="#3b82f6">
              Consult a Veterinarian
            </Button>
          </Card.Content>
        </Card>
      )}

      <Button mode="outlined" icon="delete" onPress={() => deleteScan(scan._id)}
        style={styles.button} textColor="#ef4444">
        Delete This Scan
      </Button>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "scanner" && styles.activeTab]}
          onPress={() => setActiveTab("scanner")}
        >
          <Icon name="camera" size={18} color={activeTab === "scanner" ? "#16a34a" : "#6b7280"} />
          <Text style={[styles.tabText, activeTab === "scanner" && styles.activeTabText]}>
            Scanner
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <Icon name="history" size={18} color={activeTab === "history" ? "#16a34a" : "#6b7280"} />
          <Text style={[styles.tabText, activeTab === "history" && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scanner Tab */}
      {activeTab === "scanner" && (
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            <Title style={styles.title}>AI Health Scanner</Title>
            <Text style={styles.subtitle}>
              Take or upload a photo of your livestock for instant AI health analysis
            </Text>

            {!selectedImage ? (
              <View style={styles.uploadSection}>
                <Card style={styles.uploadCard}>
                  <Card.Content style={styles.uploadContent}>
                    <Icon name="camera" size={64} color="#16a34a" />
                    <Text style={styles.uploadText}>No image selected</Text>
                    <Text style={styles.uploadHint}>
                      Take a clear photo of the animal for best results
                    </Text>
                  </Card.Content>
                </Card>
                <View style={styles.buttonGroup}>
                  <Button mode="contained" icon="camera" onPress={() => pickImage(true)}
                    style={styles.button} buttonColor="#16a34a">
                    Take Photo
                  </Button>
                  <Button mode="outlined" icon="image" onPress={() => pickImage(false)}
                    style={styles.button}>
                    Choose from Gallery
                  </Button>
                </View>
              </View>
            ) : (
              <View style={styles.imageSection}>
                <Image source={{ uri: selectedImage }} style={styles.image} />
                {!analysisResult && !isAnalyzing && (
                  <View style={styles.buttonGroup}>
                    <Button mode="contained" icon="brain" onPress={analyzeImage}
                      style={styles.button} buttonColor="#16a34a">
                      Analyze with AI
                    </Button>
                    <Button mode="outlined" icon="close" onPress={resetScanner}
                      style={styles.button}>
                      Choose Different Image
                    </Button>
                  </View>
                )}
              </View>
            )}

            {isAnalyzing && (
              <Card style={styles.card}>
                <Card.Content style={styles.analyzingContent}>
                  <ActivityIndicator size="large" color="#16a34a" />
                  <Text style={styles.analyzingText}>AI is analyzing your livestock...</Text>
                  <Text style={styles.analyzingSubtext}>This may take a few moments</Text>
                </Card.Content>
              </Card>
            )}

            {analysisResult && !isAnalyzing && (
              <View style={styles.resultsSection}>
                <Card style={styles.card}>
                  <Card.Content>
                    <Title>Analysis Results</Title>
                    <View style={styles.resultItem}>
                      <Text style={styles.resultLabel}>Detected:</Text>
                      <Text style={styles.resultValue}>{analysisResult.livestock}</Text>
                    </View>
                    <View style={styles.resultItem}>
                      <Text style={styles.resultLabel}>Confidence:</Text>
                      <Text style={styles.resultValue}>
                        {(analysisResult.confidence * 100).toFixed(0)}%
                      </Text>
                    </View>
                    <View style={styles.resultItem}>
                      <Text style={styles.resultLabel}>Health Status:</Text>
                      <Text style={[styles.resultValue, { color: getSeverityColor(analysisResult.severity) }]}>
                        {analysisResult.healthStatus}
                      </Text>
                    </View>
                    <View style={styles.resultItem}>
                      <Text style={styles.resultLabel}>Severity:</Text>
                      <Text style={[styles.resultValue, { color: getSeverityColor(analysisResult.severity) }]}>
                        {analysisResult.severity}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>

                <Card style={[styles.card, styles.conditionCard]}>
                  <Card.Content>
                    <View style={styles.conditionHeader}>
                      <Icon name="alert-circle" size={24} color="#f59e0b" />
                      <Title style={styles.conditionTitle}>{analysisResult.condition}</Title>
                    </View>
                    <Text style={styles.sectionTitle}>Observed Symptoms:</Text>
                    {analysisResult.symptoms?.map((symptom, index) => (
                      <View key={index} style={styles.listItem}>
                        <Icon name="circle-small" size={20} color="#6b7280" />
                        <Text style={styles.listText}>{symptom}</Text>
                      </View>
                    ))}
                  </Card.Content>
                </Card>

                {analysisResult.recommendations?.map((rec, index) => (
                  <Card key={index} style={styles.card}>
                    <Card.Content>
                      <Title>{rec.type}</Title>
                      {rec.items.map((item, i) => (
                        <View key={i} style={styles.listItem}>
                          <Icon name="check-circle" size={18} color="#16a34a" />
                          <Text style={styles.listText}>{item}</Text>
                        </View>
                      ))}
                    </Card.Content>
                  </Card>
                ))}

                {analysisResult.vetConsultRequired && (
                  <Card style={[styles.card, styles.vetCard]}>
                    <Card.Content>
                      <View style={styles.vetHeader}>
                        <Icon name="stethoscope" size={24} color="#3b82f6" />
                        <Text style={styles.vetText}>Veterinary consultation recommended</Text>
                      </View>
                      <Button mode="contained" icon="phone"
                        onPress={() => navigation.navigate("Vet")}
                        style={styles.button} buttonColor="#3b82f6">
                        Consult a Veterinarian
                      </Button>
                    </Card.Content>
                  </Card>
                )}

                <View style={styles.buttonGroup}>
                  <Button mode="contained" icon="content-save" onPress={saveResults}
                    loading={isSaving} disabled={isSaving}
                    style={styles.button} buttonColor="#10b981">
                    Save Results
                  </Button>
                  <Button mode="outlined" icon="camera" onPress={resetScanner} style={styles.button}>
                    Scan Another Animal
                  </Button>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            <Title style={styles.title}>Scan History</Title>

            {loadingHistory ? (
              <View style={styles.analyzingContent}>
                <ActivityIndicator size="large" color="#16a34a" />
              </View>
            ) : scanHistory.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Icon name="history" size={64} color="#d1d5db" />
                <Text style={styles.emptyText}>No scans yet</Text>
                <Button mode="contained" onPress={() => setActiveTab("scanner")}
                  buttonColor="#16a34a" style={styles.button}>
                  Start Scanning
                </Button>
              </View>
            ) : (
              scanHistory.map((scan) => (
                <View key={scan._id}>
                  {/* Scan summary card - tap to expand */}
                  <TouchableOpacity onPress={() =>
                    setExpandedScan(expandedScan?._id === scan._id ? null : scan)
                  }>
                    <Card style={[styles.historyCard, expandedScan?._id === scan._id && styles.historyCardActive]}>
                      <Card.Content>
                        <View style={styles.historyHeader}>
                          <View style={styles.historyInfo}>
                            <Text style={styles.historyLivestock}>{scan.livestock}</Text>
                            <Text style={styles.historyDate}>
                              {new Date(scan.createdAt).toLocaleDateString()} ·{" "}
                              {new Date(scan.createdAt).toLocaleTimeString([], {
                                hour: "2-digit", minute: "2-digit"
                              })}
                            </Text>
                            <Text style={styles.historyCondition}>{scan.condition}</Text>
                          </View>
                          <View style={styles.historyRight}>
                            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(scan.severity) }]}>
                              <Text style={styles.severityText}>{scan.severity}</Text>
                            </View>
                            <Icon
                              name={expandedScan?._id === scan._id ? "chevron-up" : "chevron-down"}
                              size={20} color="#6b7280"
                            />
                          </View>
                        </View>

                        <View style={styles.historyStatus}>
                          <Icon name="heart-pulse" size={16} color={getSeverityColor(scan.severity)} />
                          <Text style={[styles.historyStatusText, { color: getSeverityColor(scan.severity) }]}>
                            {scan.healthStatus}
                          </Text>
                        </View>
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>

                  {/* Expanded full results */}
                  {expandedScan?._id === scan._id && renderFullResults(scan)}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#f3f4f6" },
  container: { flex: 1 },
  tabBar: {
    flexDirection: "row", backgroundColor: "#fff",
    borderBottomWidth: 1, borderBottomColor: "#e5e7eb",
  },
  tab: {
    flex: 1, paddingVertical: 12, alignItems: "center",
    flexDirection: "row", justifyContent: "center", gap: 6
  },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#16a34a" },
  tabText: { fontSize: 14, fontWeight: "600", color: "#6b7280" },
  activeTabText: { color: "#16a34a" },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  subtitle: { textAlign: "center", color: "#6b7280", marginBottom: 24, lineHeight: 20 },
  uploadSection: { marginBottom: 24 },
  uploadCard: { elevation: 2, marginBottom: 24 },
  uploadContent: { alignItems: "center", paddingVertical: 48 },
  uploadText: { marginTop: 16, fontSize: 16, color: "#6b7280" },
  uploadHint: { marginTop: 8, fontSize: 13, color: "#9ca3af", textAlign: "center" },
  imageSection: { marginBottom: 24 },
  image: { width: "100%", height: 300, borderRadius: 12, marginBottom: 16 },
  buttonGroup: { gap: 12 },
  button: { paddingVertical: 6 },
  card: { marginBottom: 16, elevation: 2 },
  analyzingContent: { alignItems: "center", paddingVertical: 32 },
  analyzingText: { marginTop: 16, fontSize: 16, fontWeight: "600", color: "#1f2937" },
  analyzingSubtext: { marginTop: 8, fontSize: 14, color: "#6b7280" },
  resultsSection: { marginTop: 8 },
  resultItem: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f3f4f6"
  },
  resultLabel: { fontSize: 16, fontWeight: "600", color: "#6b7280" },
  resultValue: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  conditionCard: { backgroundColor: "#fef3c7", borderLeftWidth: 4, borderLeftColor: "#f59e0b" },
  conditionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 },
  conditionTitle: { fontSize: 18, color: "#92400e", flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 12, marginBottom: 8, color: "#1f2937" },
  listItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8, gap: 8 },
  listText: { flex: 1, fontSize: 14, color: "#4b5563", lineHeight: 20 },
  vetCard: { backgroundColor: "#dbeafe", borderLeftWidth: 4, borderLeftColor: "#3b82f6" },
  vetHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 },
  vetText: { flex: 1, fontSize: 16, fontWeight: "600", color: "#1e40af" },
  emptyHistory: { alignItems: "center", paddingTop: 64, gap: 16 },
  emptyText: { fontSize: 18, color: "#9ca3af" },
  historyCard: { marginBottom: 4, elevation: 2 },
  historyCardActive: { borderTopWidth: 2, borderTopColor: "#16a34a" },
  historyHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  historyInfo: { flex: 1 },
  historyLivestock: { fontSize: 16, fontWeight: "700", color: "#1f2937", marginBottom: 2 },
  historyDate: { fontSize: 12, color: "#9ca3af", marginBottom: 4 },
  historyCondition: { fontSize: 14, color: "#4b5563" },
  historyRight: { alignItems: "flex-end", gap: 8 },
  severityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  severityText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  historyStatus: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  historyStatusText: { fontSize: 13, fontWeight: "600" },
  expandedResults: { marginBottom: 16, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: "#16a34a" },
});

export default ScannerScreen;