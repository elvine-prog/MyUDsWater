import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Button, StyleSheet } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs, doc, onSnapshot, addDoc, orderBy, query } from 'firebase/firestore';

export default function EcranDiscussionAdmin() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      const querySnapshot = await getDocs(collection(db, 'discussions'));
      const convs = [];
      querySnapshot.forEach(doc => {
        convs.push({ id: doc.id, ...doc.data() });
      });
      setConversations(convs);
    };
    fetchConversations();
  }, []);

  const openConversation = (conv) => {
    setSelectedConv(conv);
    setModalVisible(true);
    const messagesRef = collection(db, 'discussions', conv.id, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedConv) return;
    const messagesRef = collection(db, 'discussions', selectedConv.id, 'messages');
    await addDoc(messagesRef, {
      text: replyText,
      senderId: 'admin',
      senderName: 'Administrateur',
      timestamp: new Date().toISOString(),
      isAdmin: true
    });
    setReplyText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discussions clients</Text>
      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.convItem} onPress={() => openConversation(item)}>
            <Text style={styles.convEmail}>{item.clientEmail}</Text>
            <Text style={styles.convDate}>Créé le {new Date(item.createdAt).toLocaleDateString()}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucune discussion</Text>}
      />

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Discussion avec {selectedConv?.clientEmail}</Text>
            <Button title="Fermer" onPress={() => setModalVisible(false)} />
          </View>
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={[styles.messageBubble, item.isAdmin ? styles.adminMsg : styles.clientMsg]}>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
              </View>
            )}
            style={styles.messagesList}
          />
          <View style={styles.replyContainer}>
            <TextInput
              style={styles.replyInput}
              placeholder="Répondre..."
              value={replyText}
              onChangeText={setReplyText}
            />
            <Button title="Envoyer" onPress={sendReply} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#0066CC' },
  convItem: { padding: 15, borderBottomWidth: 1, borderColor: '#ddd' },
  convEmail: { fontSize: 16, fontWeight: 'bold' },
  convDate: { fontSize: 12, color: '#666' },
  empty: { textAlign: 'center', marginTop: 50, color: '#888' },
  modalContainer: { flex: 1, paddingTop: 50 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  messagesList: { flex: 1, padding: 10 },
  messageBubble: { padding: 10, marginVertical: 5, borderRadius: 10, maxWidth: '80%' },
  clientMsg: { backgroundColor: '#0066CC', alignSelf: 'flex-end' },
  adminMsg: { backgroundColor: '#e0e0e0', alignSelf: 'flex-start' },
  messageText: { fontSize: 16, color: '#fff' },
  timestamp: { fontSize: 10, color: '#ddd', marginTop: 5 },
  replyContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ddd' },
  replyInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 15, marginRight: 10 }
});