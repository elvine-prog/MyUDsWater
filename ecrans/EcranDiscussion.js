import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../firebase';
import { collection, doc, getDoc, setDoc, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function EcranDiscussion() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      console.log("Aucun utilisateur connecté");
      return;
    }
    const convId = `conv_${user.uid}`;
    setConversationId(convId);
    const convRef = doc(db, 'discussions', convId);

    // Créer la conversation si elle n'existe pas
    getDoc(convRef)
      .then(docSnap => {
        if (!docSnap.exists()) {
          console.log("Création de la conversation pour", user.email);
          return setDoc(convRef, {
            clientId: user.uid,
            clientEmail: user.email,
            createdAt: new Date().toISOString()
          });
        } else {
          console.log("Conversation existante");
        }
      })
      .catch(err => console.error("Erreur création discussion:", err));

    // Écouter les messages en temps réel
    const messagesRef = collection(convRef, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      console.log(`${msgs.length} messages chargés`);
    }, (error) => {
      console.error("Erreur onSnapshot:", error);
      Alert.alert("Erreur", "Impossible de charger les messages");
    });

    return () => unsubscribe();
  }, [user]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;
    const convRef = doc(db, 'discussions', conversationId);
    const messagesRef = collection(convRef, 'messages');
    try {
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: user.uid,
        senderName: 'Client',
        timestamp: new Date().toISOString(),
        isAdmin: false
      });
      setNewMessage('');
    } catch (err) {
      console.error("Erreur envoi message:", err);
      Alert.alert("Erreur", "Message non envoyé");
    }
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>Veuillez vous connecter</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.isAdmin ? styles.adminBubble : styles.clientBubble]}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Votre message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  messagesList: { padding: 10 },
  messageBubble: { padding: 10, marginVertical: 5, borderRadius: 10, maxWidth: '80%' },
  clientBubble: { backgroundColor: '#0066CC', alignSelf: 'flex-end' },
  adminBubble: { backgroundColor: '#e0e0e0', alignSelf: 'flex-start' },
  messageText: { fontSize: 16, color: '#fff' },
  timestamp: { fontSize: 10, color: '#ddd', marginTop: 5 },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ddd' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 15, marginRight: 10 },
  sendButton: { backgroundColor: '#0066CC', borderRadius: 20, paddingHorizontal: 20, justifyContent: 'center' },
  sendButtonText: { color: '#fff', fontWeight: 'bold' }
});