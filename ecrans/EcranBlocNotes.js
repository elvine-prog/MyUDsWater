import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import ToastMessage from '../components/ToastMessage';
import { colors } from '../styles/theme';

export default function EcranBlocNotes({ route }) {
  const userId = route.params?.userId || 'admin_default';
  const [entrees, setEntrees] = useState([]);
  const [sorties, setSorties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chargementAjout, setChargementAjout] = useState(false);
  const [montant, setMontant] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('entree');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    chargerTransactions();
  }, [userId]);

  const chargerTransactions = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'transactions'), where('userId', '==', userId), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const liste = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntrees(liste.filter(t => t.type === 'entree'));
      setSorties(liste.filter(t => t.type === 'sortie'));
    } catch (err) {
      setToast({ visible: true, message: 'Impossible de charger les transactions', type: 'error' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const ajouterTransaction = async () => {
    const montantNum = parseFloat(montant);
    if (isNaN(montantNum) || montantNum <= 0) {
      setToast({ visible: true, message: 'Montant invalide', type: 'error' });
      return;
    }
    if (!description.trim()) {
      setToast({ visible: true, message: 'Description requise', type: 'error' });
      return;
    }
    setChargementAjout(true);
    try {
      await addDoc(collection(db, 'transactions'), {
        userId,
        type,
        montant: montantNum,
        description: description.trim(),
        date: new Date().toISOString(),
      });
      setToast({ visible: true, message: 'Transaction ajoutée', type: 'success' });
      setMontant('');
      setDescription('');
      chargerTransactions();
    } catch (err) {
      setToast({ visible: true, message: "Impossible d'ajouter", type: 'error' });
      console.error(err);
    } finally {
      setChargementAjout(false);
    }
  };

  const supprimerTransaction = async (id) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
      setToast({ visible: true, message: 'Transaction supprimée', type: 'success' });
      chargerTransactions();
    } catch (err) {
      setToast({ visible: true, message: 'Suppression impossible', type: 'error' });
    }
  };

  const totalEntrees = entrees.reduce((sum, e) => sum + (e.montant || 0), 0);
  const totalSorties = sorties.reduce((sum, s) => sum + (s.montant || 0), 0);
  const solde = totalEntrees - totalSorties;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titre}>📒 Bloc notes financier</Text>
      <Text style={styles.userIdText}>ID: {userId}</Text>

      <View style={styles.formContainer}>
        <View style={styles.typeSwitch}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'entree' && styles.typeButtonActif]}
            onPress={() => setType('entree')}
            disabled={chargementAjout}
          >
            <Text style={[styles.typeButtonTexte, type === 'entree' && styles.typeButtonTexteActif]}>➕ Entrée</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'sortie' && styles.typeButtonActif]}
            onPress={() => setType('sortie')}
            disabled={chargementAjout}
          >
            <Text style={[styles.typeButtonTexte, type === 'sortie' && styles.typeButtonTexteActif]}>➖ Sortie</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Montant (FCFA)"
          keyboardType="numeric"
          value={montant}
          onChangeText={setMontant}
          editable={!chargementAjout}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          editable={!chargementAjout}
        />
        <TouchableOpacity style={styles.ajouterButton} onPress={ajouterTransaction} disabled={chargementAjout}>
          {chargementAjout ? <ActivityIndicator color="white" /> : <Text style={styles.ajouterButtonTexte}>Ajouter</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.tableauContainer}>
        <View style={styles.enTete}>
          <Text style={styles.enTeteColonne}>📥 ENTRÉES</Text>
          <Text style={styles.enTeteColonne}>📤 SORTIES</Text>
        </View>
        <View style={styles.corpsTableau}>
          <View style={styles.colonne}>
            {entrees.length === 0 ? (
              <Text style={styles.vide}>Aucune entrée</Text>
            ) : (
              entrees.map(item => (
                <TouchableOpacity key={item.id} onLongPress={() => supprimerTransaction(item.id)}>
                  <View style={styles.ligneEntree}>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.montantEntree}>+ {item.montant.toLocaleString()} FCFA</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
          <View style={styles.colonne}>
            {sorties.length === 0 ? (
              <Text style={styles.vide}>Aucune sortie</Text>
            ) : (
              sorties.map(item => (
                <TouchableOpacity key={item.id} onLongPress={() => supprimerTransaction(item.id)}>
                  <View style={styles.ligneSortie}>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.montantSortie}>- {item.montant.toLocaleString()} FCFA</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </View>

      <View style={styles.pied}>
        <Text style={styles.totalTexte}>Total entrées : {totalEntrees.toLocaleString()} FCFA</Text>
        <Text style={styles.totalTexte}>Total sorties : {totalSorties.toLocaleString()} FCFA</Text>
        <Text style={[styles.soldeTexte, solde >= 0 ? styles.soldePositif : styles.soldeNegatif]}>
          Solde : {solde.toLocaleString()} FCFA
        </Text>
      </View>

      <ToastMessage visible={toast.visible} message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, visible: false })} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titre: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: colors.primary },
  userIdText: { fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 10 },
  formContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2 },
  typeSwitch: { flexDirection: 'row', marginBottom: 15, justifyContent: 'space-around' },
  typeButton: { flex: 1, paddingVertical: 10, marginHorizontal: 5, borderRadius: 8, backgroundColor: '#e0e0e0', alignItems: 'center' },
  typeButtonActif: { backgroundColor: colors.primary },
  typeButtonTexte: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  typeButtonTexteActif: { color: 'white' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 10 },
  ajouterButton: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  ajouterButtonTexte: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  tableauContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 10, elevation: 2, marginBottom: 10 },
  enTete: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 5, borderBottomWidth: 2, borderBottomColor: colors.primary },
  enTeteColonne: { flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 16, color: colors.primary },
  corpsTableau: { flexDirection: 'row', justifyContent: 'space-between' },
  colonne: { flex: 1, marginHorizontal: 5 },
  ligneEntree: { backgroundColor: '#e8f5e9', padding: 8, borderRadius: 6, marginBottom: 5 },
  ligneSortie: { backgroundColor: '#ffebee', padding: 8, borderRadius: 6, marginBottom: 5 },
  description: { fontSize: 13, color: '#333' },
  montantEntree: { fontSize: 14, fontWeight: 'bold', color: '#28a745', marginTop: 4 },
  montantSortie: { fontSize: 14, fontWeight: 'bold', color: '#dc3545', marginTop: 4 },
  vide: { textAlign: 'center', marginTop: 10, color: '#888', fontSize: 12 },
  pied: { backgroundColor: '#fff', padding: 12, borderRadius: 12, elevation: 2, marginBottom: 10 },
  totalTexte: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  soldeTexte: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 5 },
  soldePositif: { color: '#28a745' },
  soldeNegatif: { color: '#dc3545' },
});