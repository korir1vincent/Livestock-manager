// src/screens/ChatScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { TextInput, Text, ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../context/AuthContext";

const ChatScreen = ({ route }) => {
  const { consultationId } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);
  const { getAuthenticatedAxios, user } = useAuth();

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const api = getAuthenticatedAxios();
      const res = await api.get(
        `/vet/consultations/${consultationId}/messages`
      );
      setMessages(res.data.messages);
    } catch (error) {
      console.error("Fetch messages error:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
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

  const renderMessage = ({ item }) => {
    const isMe =
      item.senderId?._id === user?.id || item.senderId === user?.id;

    return (
      <View style={[styles.messageRow, isMe ? styles.myRow : styles.theirRow]}>
        
        {!isMe && (
          <View style={styles.avatar}>
            <Icon
              name={item.senderRole === "vet" ? "doctor" : "account"}
              size={18}
              color="#fff"
            />
          </View>
        )}

        <View
          style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}
        >
          {!isMe && (
            <Text style={styles.senderName}>
              {item.senderRole === "vet" ? "🩺 Vet Doctor" : "🌾 Farmer"}
            </Text>
          )}

          <Text
            style={[
              styles.messageText,
              isMe ? styles.myText : styles.theirText,
            ]}
          >
            {item.text}
          </Text>

          <Text
            style={[styles.timeText, isMe ? styles.myTime : styles.theirTime]}
          >
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
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={90}
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
            <Icon name="chat-outline" size={64} color="#c7d2fe" />
            <Text style={styles.emptyText}>
              Start chatting with your vet 👨‍⚕️
            </Text>
          </View>
        }
      />

      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          mode="outlined"
          style={styles.input}
          dense
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            (!text.trim() || sending) && styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={!text.trim() || sending}
        >
          <Icon name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2ff",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  messageList: {
    padding: 16,
    paddingBottom: 10,
  },

  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 14,
  },

  myRow: {
    justifyContent: "flex-end",
  },

  theirRow: {
    justifyContent: "flex-start",
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },

  bubble: {
    maxWidth: "75%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },

  myBubble: {
    backgroundColor: "#2563eb",
    borderBottomRightRadius: 6,
    shadowColor: "#2563eb",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },

  theirBubble: {
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  senderName: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6b7280",
    marginBottom: 4,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },

  myText: {
    color: "#fff",
  },

  theirText: {
    color: "#111827",
  },

  timeText: {
    fontSize: 10,
    marginTop: 6,
  },

  myTime: {
    color: "#dbeafe",
    textAlign: "right",
  },

  theirTime: {
    color: "#9ca3af",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#ffffffee",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },

  input: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 20,
  },

  sendButton: {
    backgroundColor: "#2563eb",
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
    shadowColor: "#2563eb",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },

  sendButtonDisabled: {
    backgroundColor: "#93c5fd",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },

  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 16,
    textAlign: "center",
  },
});

export default ChatScreen;