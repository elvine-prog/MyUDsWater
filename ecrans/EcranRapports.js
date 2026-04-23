import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import ToastMessage from '../components/ToastMessage';
import { colors } from '../styles/theme';

export default function EcranRapport() {
  const [rapport, setRapport] = useState('');
  const [rapportsEnvoyes, setRapportsEnvoyes] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const user = auth.currentUser;

  const chargerRapports = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'rapports'),
        where('employeId', '==', user.uid),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      const liste = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRapportsEnvoyes(liste);
    } catch (err) {
      console.error("Erreur chargement rapports:", err);
    }
  };

  useEffect(() => {
    chargerRapports();
  }, [user]);

  const envoyerRapport = async () => {
    if (!user) {
      setToast({ visible: true, message: 'Vous devez être connecté', type: 'error' });
      return;
    }
    if (!rapport.trim()) {
      setToast({ visible: true, message: 'Veuillez écrire votre rapport', type: 'error' });
      return;
    }
    setChargement(true);
    try {
      await addDoc(collection(db, 'rapports'), {
        employeId: user.uid,
        employeEmail: user.email,
        contenu: rapport,
        date: new Date().toISOString(),
        lu: false
      });
      setToast({ visible: true, message: 'Rapport envoyé à l\'administrateur', type: 'success' });
      setRapport('');
      chargerRapports();
    } catch (err) {
      setToast({ visible: true, message: `Impossible d'envoyer : ${err.message}`, type: 'error' });
      console.error(err);
    } finally {
      setChargement(false);
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
      <Text style={styles.title}>Rapport de la journée</Text>
      <TextInput
        style={styles.input}
        placeholder="Décrivez votre journée, les tâches accomplies..."
        multiline
        numberOfLines={8}
        value={rapport}
        onChangeText={setRapport}
        editable={!chargement}
      />
      <TouchableOpacity style={styles.sendButton} onPress={envoyerRapport} disabled={chargement}>
        {chargement ? <ActivityIndicator color="white" /> : <Text style={styles.sendButtonText}>📤 Envoyer le rapport</Text>}
      </TouchableOpacity>

      {rapportsEnvoyes.length > 0 && (
        <>
          <Text style={styles.subtitle}>Rapports envoyés :</Text>
          <FlatList
            data={rapportsEnvoyes}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.reportCard}>
                <Text style={styles.reportDate}>
                  📅 {new Date(item.date).toLocaleDateString()} - {new Date(item.date).toLocaleTimeString()}
                </Text>
                <Text style={styles.reportContent}>{item.contenu}</Text>
              </View>
            )}
          />
        </>
      )}
      <ToastMessage visible={toast.visible} message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, visible: false })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: colors.primary },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, textAlignVertical: 'top', marginBottom: 20, minHeight: 150 },
  sendButton: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  sendButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  reportCard: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  reportDate: { fontSize: 12, color: '#666', marginBottom: 5 },
  reportContent: { fontSize: 14 },
});