import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../firebase';
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { showLocalNotification } from '../utils/notifications';
import ToastMessage from '../components/ToastMessage';
import { colors } from '../styles/theme';

export default function EcranCommandesAdmin() {
  const [commandes, setCommandes] = useState([]);
  const [chargementId, setChargementId] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    const q = query(collection(db, 'commandes'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listeCommandes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCommandes(listeCommandes);
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const newCommande = change.doc.data();
          showLocalNotification('📦 Nouvelle commande', `${newCommande.clientEmail} a commandé ${newCommande.quantite} x ${newCommande.palette}`);
        }
      });
    }, (erreur) => {
      setToast({ visible: true, message: `Erreur chargement : ${erreur.message}`, type: 'error' });
    });
    return () => unsubscribe();
  }, []);

  const changerStatut = async (id, nouveauStatut) => {
    setChargementId(id);
    try {
      const commandeRef = doc(db, 'commandes', id);
      await updateDoc(commandeRef, { statut: nouveauStatut });
      setToast({ visible: true, message: `Commande ${nouveauStatut} avec succès`, type: 'success' });
    } catch (erreur) {
      setToast({ visible: true, message: `Erreur : ${erreur.message}`, type: 'error' });
    } finally {
      setChargementId(null);
    }
  };

  const getStatutStyle = (statut) => {
    switch(statut) {
      case 'En attente': return styles.statutAttente;
      case 'En cours': return styles.statutCours;
      case 'Livrée': return styles.statutLivree;
      default: return {};
    }
  };

  return (
    <View style={styles.conteneur}>
      <Text style={styles.titre}>Commandes clients</Text>
      <FlatList
        data={commandes}
        showsVerticalScrollIndicator={true}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.carteCommande}>
            <Text style={styles.nomClient}>👤 {item.clientEmail}</Text>
            <Text style={styles.details}>📦 {item.palette} x {item.quantite}</Text>
            <Text style={styles.details}>💰 Total : {item.prixTotal} FCFA</Text>
            <Text style={styles.details}>📅 Livraison : {item.delai}</Text>
            <Text style={styles.details}>📆 Commandé le : {new Date(item.dateCommande).toLocaleDateString()}</Text>
            <View style={styles.statutContainer}>
              <Text style={[styles.statut, getStatutStyle(item.statut)]}>{item.statut}</Text>
            </View>
            <View style={styles.boutonsContainer}>
              <TouchableOpacity
                style={[styles.boutonAction, styles.boutonCours]}
                onPress={() => changerStatut(item.id, 'En cours')}
                disabled={chargementId === item.id}
              >
                {chargementId === item.id ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.boutonActionTexte}>En cours</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boutonAction, styles.boutonLivree]}
                onPress={() => changerStatut(item.id, 'Livrée')}
                disabled={chargementId === item.id}
              >
                {chargementId === item.id ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.boutonActionTexte}>Livrée</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <ToastMessage visible={toast.visible} message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, visible: false })} />
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: { flex: 1, padding: 20, backgroundColor: '#fff' },
  titre: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: colors.primary },
  carteCommande: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  nomClient: { fontSize: 16, fontWeight: 'bold', color: colors.primary, marginBottom: 5 },
  details: { fontSize: 14, marginBottom: 3 },
  statutContainer: { marginTop: 8, marginBottom: 10 },
  statut: { fontSize: 13, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 15, textAlign: 'center', width: 100 },
  statutAttente: { backgroundColor: '#ffc107', color: '#333' },
  statutCours: { backgroundColor: '#17a2b8', color: 'white' },
  statutLivree: { backgroundColor: '#28a745', color: 'white' },
  boutonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  boutonAction: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  boutonCours: { backgroundColor: '#17a2b8' },
  boutonLivree: { backgroundColor: '#28a745' },
  boutonActionTexte: { color: 'white', fontWeight: 'bold' },
});