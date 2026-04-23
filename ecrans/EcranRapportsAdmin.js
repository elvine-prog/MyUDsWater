import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export default function EcranRapportsAdmin() {
  const [rapports, setRapports] = useState([]);

  useEffect(() => {
    const fetchRapports = async () => {
      try {
        const q = query(collection(db, 'rapports'), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        const liste = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRapports(liste);
      } catch (err) {
        console.error("Erreur chargement rapports admin:", err);
      }
    };
    fetchRapports();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rapports des employés</Text>
      <FlatList
        data={rapports}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.email}>{item.employeEmail}</Text>
              <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
            </View>
            <Text style={styles.content}>{item.contenu}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucun rapport reçu</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#0066CC' },
  card: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  email: { fontSize: 14, fontWeight: 'bold', color: '#0066CC' },
  date: { fontSize: 12, color: '#666' },
  content: { fontSize: 14 },
  empty: { textAlign: 'center', marginTop: 50, color: '#888' }
});