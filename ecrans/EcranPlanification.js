import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { showLocalNotification, scheduleNotification } from '../utils/notifications';
import ToastMessage from '../components/ToastMessage';
import { colors } from '../styles/theme';

export default function EcranPlanification({ route }) {
  const userId = route.params?.userId;
  const [taches, setTaches] = useState([]);
  const [nouvelleTache, setNouvelleTache] = useState('');
  const [dateTache, setDateTache] = useState('');
  const [chargement, setChargement] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    if (userId) chargerTaches();
  }, [userId]);

  useEffect(() => {
    if (taches.length === 0) return;
    const today = new Date().toISOString().slice(0, 10);
    const tachesAujourdhui = taches.filter(t => t.date === today);
    tachesAujourdhui.forEach(tache => {
      showLocalNotification('📅 Rappel tâche', `Aujourd'hui : ${tache.description}`);
    });
  }, [taches]);

  const chargerTaches = async () => {
    try {
      const q = query(collection(db, 'taches'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const liste = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTaches(liste);
    } catch (err) {
      setToast({ visible: true, message: 'Impossible de charger les tâches', type: 'error' });
      console.error(err);
    }
  };

  const ajouterTache = async () => {
    if (!nouvelleTache.trim() || !dateTache.trim()) {
      setToast({ visible: true, message: 'Veuillez remplir tous les champs', type: 'error' });
      return;
    }
    setChargement(true);
    try {
      await addDoc(collection(db, 'taches'), {
        userId: userId,
        role: 'employe',
        description: nouvelleTache,
        date: dateTache,
        statut: 'en attente',
        createdAt: new Date().toISOString()
      });

      await showLocalNotification('✅ Tâche ajoutée', `${nouvelleTache} prévue le ${dateTache}`);

      const [jour, mois, annee] = dateTache.split('/');
      const dateObj = new Date(`${annee}-${mois}-${jour}T08:00:00`);
      if (dateObj > new Date()) {
        await scheduleNotification('📌 Tâche planifiée', nouvelleTache, dateObj);
      }

      setToast({ visible: true, message: 'Tâche ajoutée avec succès', type: 'success' });
      setNouvelleTache('');
      setDateTache('');
      chargerTaches();
    } catch (err) {
      setToast({ visible: true, message: "Impossible d'ajouter la tâche", type: 'error' });
    } finally {
      setChargement(false);
    }
  };

  const supprimerTache = async (id) => {
    try {
      await deleteDoc(doc(db, 'taches', id));
      setToast({ visible: true, message: 'Tâche supprimée', type: 'success' });
      chargerTaches();
    } catch (err) {
      setToast({ visible: true, message: 'Suppression impossible', type: 'error' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planification des tâches</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={nouvelleTache}
          onChangeText={setNouvelleTache}
          editable={!chargement}
        />
        <TextInput
          style={styles.input}
          placeholder="Date (JJ/MM/AAAA)"
          value={dateTache}
          onChangeText={setDateTache}
          editable={!chargement}
        />
        <TouchableOpacity style={styles.addButton} onPress={ajouterTache} disabled={chargement}>
          {chargement ? <ActivityIndicator color="white" /> : <Text style={styles.addButtonText}>+ Ajouter</Text>}
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Mes tâches :</Text>
      <FlatList
        data={taches}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View style={styles.taskInfo}>
              <Text style={styles.taskText}>{item.description}</Text>
              <Text style={styles.taskDate}>📅 {item.date}</Text>
            </View>
            <TouchableOpacity onPress={() => supprimerTache(item.id)} disabled={chargement}>
              <Text style={styles.delete}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucune tâche</Text>}
      />
      <ToastMessage visible={toast.visible} message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, visible: false })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: colors.primary },
  form: { marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 10 },
  addButton: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  taskCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8, marginBottom: 10 },
  taskInfo: { flex: 1 },
  taskText: { fontSize: 16, fontWeight: '500' },
  taskDate: { fontSize: 14, color: '#666', marginTop: 5 },
  delete: { fontSize: 20, padding: 5 },
  empty: { textAlign: 'center', marginTop: 30, color: '#888' },
});