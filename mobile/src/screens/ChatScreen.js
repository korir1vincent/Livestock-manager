import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
} from "react-native";
import { TextInput, Text, ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const ChatScreen = ({ route }) => {
  const { consultationId } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [myId, setMyId] = useState(null);
  const flatListRef = useRef(null);
  const insets = useSafeAreaInsets();
  const { getAuthenticatedAxios, user } = useAuth();

  useEffect(() => {
    setMyId(user?.id || user?._id);
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const api = getAuthenticatedAxios();
      const res = await api.get(`/vet/consultations/${consultationId}/messages`);
      setMessages(res.data.messages);
    } catch (error) {
      console.error("Fetch messages error:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendTextMessage = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      const api = getAuthenticatedAxios();
      await api.post(`/vet/consultations/${consultationId}/messages`, {
        text: text.trim(),
      });
      setText("");
      await fetchMessages();
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Send message error:", error);
    } finally {
      setSending(false);
    }
  };

  const sendMediaMessage = async (uri, mediaType) => {
    setSending(true);
    try {
      const api = getAuthenticatedAxios();
      const authHeader = api.defaults.headers.Authorization;

      const filename = uri.split('/').pop();
      const ext = filename.split('.').pop().toLowerCase();
      const mime = mediaType === 'video'
        ? (ext === 'mov' ? 'video/quicktime' : 'video/mp4')
        : `image/${ext === 'jpg' ? 'jpeg' : ext}`;

      const formData = new FormData();
      formData.append('media', { uri, name: filename, type: mime });
      formData.append('text', '');

      const response = await fetch(
        `${API_URL}/vet/consultations/${consultationId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'multipart/form-data',
          },
          body: formData
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Upload failed');
      }

      await fetchMessages();
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Send media error:", error);
      Alert.alert('Error', error.message || 'Failed to send media');
    } finally {
      setSending(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 1,
      videoMaxDuration: 120,
      allowsEditing: false
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      await sendMediaMessage(asset.uri, asset.type === 'video' ? 'video' : 'image');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images', 'videos'],
      quality: 1,
      videoMaxDuration: 120
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      await sendMediaMessage(asset.uri, asset.type === 'video' ? 'video' : 'image');
    }
  };

  const showMediaOptions = () => {
    Alert.alert('Send Media', 'Choose an option', [
      { text: 'Camera', onPress: takePhoto },
      { text: 'Photo Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const isMyMessage = (item) => {
    const senderId =
      typeof item.senderId === "object"
        ? item.senderId?._id?.toString()
        : item.senderId?.toString();
    return senderId === myId?.toString();
  };

  const renderMessage = ({ item }) => {
    const isMe = isMyMessage(item);

    return (
      <View style={[styles.messageRow, isMe ? styles.myRow : styles.theirRow]}>
        {!isMe && (
          <View style={styles.avatar}>
            <Icon
              name={item.senderRole === "vet" ? "stethoscope" : "account"}
              size={16}
              color="#fff"
            />
          </View>
        )}

        <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
          {!isMe && (
            <Text style={styles.senderName}>
              {item.senderRole === "vet" ? "🩺 Vet Doctor" : "🌾 Farmer"}
            </Text>
          )}

          {item.mediaType === 'image' && item.mediaUrl && (
            <Image
              source={{ uri: item.mediaUrl }}
              style={styles.mediaImage}
              resizeMode="cover"
            />
          )}

          {item.mediaType === 'video' && item.mediaUrl && (
            <View style={styles.videoPlaceholder}>
              <Icon name="play-circle" size={48} color="#fff" />
              <Text style={styles.videoText}>Video</Text>
            </View>
          )}

          {item.text ? (
            <Text style={[styles.messageText, isMe ? styles.myText : styles.theirText]}>
              {item.text}
            </Text>
          ) : null}

          <Text style={[styles.timeText, isMe ? styles.myTime : styles.theirTime]}>
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading chat...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { paddingBottom: insets.bottom }]}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item._id || String(index)}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Icon name="chat-outline" size={48} color="#6366f1" />
              </View>
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptyText}>Start the conversation!</Text>
            </View>
          }
        />

        <View style={styles.inputRow}>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={showMediaOptions}
            disabled={sending}
          >
            <Icon name="image-plus" size={24} color="#6366f1" />
          </TouchableOpacity>

          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor="#64748b"
            mode="outlined"
            style={styles.input}
            outlineColor="#1e293b"
            activeOutlineColor="#6366f1"
            textColor="#f1f5f9"
            dense
            multiline
            maxLength={500}
            theme={{ colors: { background: '#1e293b' } }}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!text.trim() || sending) && styles.sendButtonDisabled,
            ]}
            onPress={sendTextMessage}
            disabled={!text.trim() || sending}
          >
            {sending
              ? <ActivityIndicator size={18} color="#fff" />
              : <Icon name="send" size={20} color="#fff" />
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
    gap: 12,
  },
  loadingText: {
    color: "#94a3b8",
    fontSize: 14,
  },
  messageList: {
    padding: 16,
    paddingBottom: 10,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  myRow: {
    justifyContent: "flex-end",
  },
  theirRow: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  bubble: {
    maxWidth: "75%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  myBubble: {
    backgroundColor: "#4f46e5",
    borderBottomRightRadius: 4,
    elevation: 4,
    shadowColor: "#4f46e5",
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  theirBubble: {
    backgroundColor: "#1e293b",
    borderBottomLeftRadius: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  senderName: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    marginBottom: 5,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  myText: {
    color: "#f1f5f9",
  },
  theirText: {
    color: "#e2e8f0",
  },
  timeText: {
    fontSize: 10,
    marginTop: 6,
  },
  myTime: {
    color: "#a5b4fc",
    textAlign: "right",
  },
  theirTime: {
    color: "#475569",
  },
  mediaImage: {
    width: 220,
    height: 220,
    borderRadius: 14,
    marginBottom: 6,
  },
  videoPlaceholder: {
    width: 220,
    height: 140,
    borderRadius: 14,
    backgroundColor: "#312e81",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  videoText: {
    color: "#a5b4fc",
    fontSize: 13,
    marginTop: 6,
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#0f172a",
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    gap: 8,
  },
  mediaButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 20,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#4f46e5",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#4f46e5",
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#312e81",
    elevation: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 120,
    gap: 12,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e2e8f0",
  },
  emptyText: {
    fontSize: 14,
    color: "#475569",
  },
});

export default ChatScreen;