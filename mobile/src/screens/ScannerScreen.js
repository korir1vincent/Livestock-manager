// src/screens/ScannerScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { Button, Text, Card, Title, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScannerScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { getAuthenticatedAxios } = useAuth();

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert('Permission Required', 'Camera and photo library permissions are needed');
    }
  };

  const pickImage = async (useCamera = false) => {
    try {
      let result;
      
      if (useCamera) {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8
        });
      }

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setAnalysisResult(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const analyzeImage = async () => {
    setIsAnalyzing(true);

    try {
      const api = getAuthenticatedAxios();
      const response = await api.post('/scan/analyze', {
        imageUrl: selectedImage
      });

      setAnalysisResult(response.data.analysis);
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Error', 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    
    <ScrollView style={styles.container}>
      <SafeAreaView>
      <View style={styles.content}>
        <Title style={styles.title}>AI Health Scanner</Title>
        <Text style={styles.subtitle}>
          Take or upload a photo of your livestock for instant health analysis
        </Text>

        {!selectedImage ? (
          <View style={styles.uploadSection}>
            <Card style={styles.uploadCard}>
              <Card.Content style={styles.uploadContent}>
                <Icon name="camera" size={64} color="#16a34a" />
                <Text style={styles.uploadText}>No image selected</Text>
              </Card.Content>
            </Card>

            <View style={styles.buttonGroup}>
              <Button
                mode="contained"
                icon="camera"
                onPress={() => pickImage(true)}
                style={styles.button}
                buttonColor="#16a34a"
              >
                Take Photo
              </Button>
              <Button
                mode="outlined"
                icon="image"
                onPress={() => pickImage(false)}
                style={styles.button}
              >
                Choose from Gallery
              </Button>
            </View>
          </View>
        ) : (
          <View style={styles.imageSection}>
            <Image source={{ uri: selectedImage }} style={styles.image} />
            
            {!analysisResult && !isAnalyzing && (
              <View style={styles.buttonGroup}>
                <Button
                  mode="contained"
                  icon="brain"
                  onPress={analyzeImage}
                  style={styles.button}
                  buttonColor="#16a34a"
                >
                  Analyze with AI
                </Button>
                <Button
                  mode="outlined"
                  icon="close"
                  onPress={resetScanner}
                  style={styles.button}
                >
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
                  <Text style={[
                    styles.resultValue,
                    { color: getSeverityColor(analysisResult.severity) }
                  ]}>
                    {analysisResult.healthStatus}
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
                {analysisResult.symptoms.map((symptom, index) => (
                  <View key={index} style={styles.listItem}>
                    <Icon name="circle-small" size={20} color="#6b7280" />
                    <Text style={styles.listText}>{symptom}</Text>
                  </View>
                ))}
              </Card.Content>
            </Card>

            {analysisResult.recommendations.map((rec, index) => (
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
                    <Text style={styles.vetText}>
                      Veterinary consultation recommended
                    </Text>
                  </View>
                  <Button
                    mode="contained"
                    icon="phone"
                    onPress={() => navigation.navigate('Vet')}
                    style={styles.button}
                    buttonColor="#3b82f6"
                  >
                    Consult a Veterinarian
                  </Button>
                </Card.Content>
              </Card>
            )}

            <View style={styles.buttonGroup}>
              <Button
                mode="contained"
                icon="content-save"
                onPress={() => {
                  Alert.alert('Success', 'Scan results saved');
                  resetScanner();
                }}
                style={styles.button}
                buttonColor="#10b981"
              >
                Save Results
              </Button>
              <Button
                mode="outlined"
                icon="camera"
                onPress={resetScanner}
                style={styles.button}
              >
                Scan Another Animal
              </Button>
            </View>
          </View>
        )}
      </View>
      </SafeAreaView>
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6'
  },
  content: {
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 20
  },
  uploadSection: {
    marginBottom: 24
  },
  uploadCard: {
    elevation: 2,
    marginBottom: 24
  },
  uploadContent: {
    alignItems: 'center',
    paddingVertical: 48
  },
  uploadText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280'
  },
  imageSection: {
    marginBottom: 24
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16
  },
  buttonGroup: {
    gap: 12
  },
  button: {
    paddingVertical: 6
  },
  card: {
    marginBottom: 16,
    elevation: 2
  },
  analyzingContent: {
    alignItems: 'center',
    paddingVertical: 32
  },
  analyzingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937'
  },
  analyzingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280'
  },
  resultsSection: {
    marginTop: 8
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280'
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937'
  },
  conditionCard: {
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b'
  },
  conditionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8
  },
  conditionTitle: {
    fontSize: 18,
    color: '#92400e'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: '#1f2937'
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20
  },
  vetCard: {
    backgroundColor: '#dbeafe',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6'
  },
  vetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8
  },
  vetText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af'
  }
});

export default ScannerScreen;