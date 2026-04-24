import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, FlatList, ActivityIndicator, Image } from 'react-native';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { showLocalNotification } from '../utils/notifications';
import ToastMessage from '../components/ToastMessage';
import { colors } from '../styles/theme';

export default function EcranCommande() {
  const [paletteChoisie, setPaletteChoisie] = useState(null);
  const [quantite, setQuantite] = useState('');
  const [delai, setDelai] = useState('');
  const [chargement, setChargement] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [utilisateur, setUtilisateur] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    setUtilisateur(user);
    if (!user) {
      setToast({ visible: true, message: 'Vous devez être connecté pour passer une commande', type: 'error' });
    }
  }, []);

  const palettes = [
    { id: 1, nom: 'Palette 250mL', volume: '24 bouteilles', prix: 1500, image: require('../assets/palette250.png') },
    { id: 2, nom: 'Palette 0.5L', volume: '12 bouteilles', prix: 2800, image: require('../assets/palette500.png') },
    { id: 3, nom: 'Palette 1L', volume: '6 bouteilles', prix: 5000, image: require('../assets/palette1l.png') },
  ];

  const validerCommande = async () => {
    if (!utilisateur) {
      setToast({ visible: true, message: 'Vous devez être connecté', type: 'error' });
      return;
    }
    if (!paletteChoisie) {
      setToast({ visible: true, message: 'Veuillez sélectionner une palette', type: 'error' });
      return;
    }
    const quantiteNombre = parseInt(quantite);
    if (isNaN(quantiteNombre) || quantiteNombre <= 0) {
      setToast({ visible: true, message: 'Quantité invalide', type: 'error' });
      return;
    }
    if (!delai || delai.trim() === '') {
      setToast({ visible: true, message: 'Veuillez indiquer le délai de livraison', type: 'error' });
      return;
    }

    setChargement(true);

    try {
      const prixTotal = quantiteNombre * paletteChoisie.prix;
      
      const docRef = await addDoc(collection(db, 'commandes'), {
        clientId: utilisateur.uid,
        clientEmail: utilisateur.email,
        palette: paletteChoisie.nom,
        quantite: quantiteNombre,
        prixUnitaire: paletteChoisie.prix,
        prixTotal: prixTotal,
        delai: delai.trim(),
        dateCommande: new Date().toISOString(),
        statut: 'En attente'
      });

      await showLocalNotification(
        '✓ Commande enregistrée',
        `${quantiteNombre} x ${paletteChoisie.nom} - Livraison prévue le ${delai}`
      );

      setToast({
        visible: true,
        message: `✓ Commande envoyée ! ${quantiteNombre} x ${paletteChoisie.nom} - Total: ${prixTotal.toLocaleString()} FCFA`,
        type: 'success'
      });
      
      setPaletteChoisie(null);
      setQuantite('');
      setDelai('');
      
    } catch (erreur) {
      console.error('Erreur Firestore:', erreur);
      setToast({
        visible: true,
        message: `Erreur : ${erreur.message}`,
        type: 'error'
      });
    } finally {
      setChargement(false);
    }
  };

  const renderPalette = ({ item }) => (
    <TouchableOpacity
      style={[styles.cartePalette, paletteChoisie?.id === item.id && styles.carteChoisie]}
      onPress={() => setPaletteChoisie(item)}
      activeOpacity={0.8}
      disabled={chargement}
    >
      <Image source={item.image} style={styles.imagePalette} resizeMode="contain" />
      <Text style={styles.nomPalette}>{item.nom}</Text>
      <Text style={styles.volumePalette}>{item.volume}</Text>
      <Text style={styles.prixPalette}>{item.prix.toLocaleString()} FCFA</Text>
    </TouchableOpacity>
  );

  if (!utilisateur) {
    return (
      <View style={styles.centre}>
        <Text style={styles.erreurTexte}>Veuillez vous connecter pour commander</Text>
        <ToastMessage visible={toast.visible} message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, visible: false })} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.conteneur}>
      <Text style={styles.sousTitre}>Choisissez votre palette :</Text>
      <FlatList
        data={palettes}
        renderItem={renderPalette}
        keyExtractor={item => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listeHorizontale}
      />

      <Text style={styles.label}>Quantité :</Text>
      <TextInput
        style={styles.champ}
        keyboardType="numeric"
        placeholder="Nombre de palettes"
        value={quantite}
        onChangeText={setQuantite}
        editable={!chargement}
      />

      <Text style={styles.label}>Délai de livraison :</Text>
      <TextInput
        style={styles.champ}
        placeholder="JJ/MM/AAAA"
        value={delai}
        onChangeText={setDelai}
        editable={!chargement}
      />

      <TouchableOpacity 
        style={[styles.boutonValider, chargement && styles.boutonDesactive]} 
        onPress={validerCommande}
        disabled={chargement}
      >
        {chargement ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.boutonValiderTexte}>Valider la commande</Text>
        )}
      </TouchableOpacity>

      <ToastMessage visible={toast.visible} message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, visible: false })} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteneur: { flex: 1, padding: 20, backgroundColor: '#fff' },
  centre: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  sousTitre: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  listeHorizontale: { paddingVertical: 10, paddingRight: 20 },
  cartePalette: { 
    width: 160, 
    height: 200, 
    backgroundColor: '#f9f9f9', 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 12, 
    marginRight: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 2 
  },
  carteChoisie: { borderColor: colors.primary, borderWidth: 3, backgroundColor: '#e6f0ff' },
  imagePalette: { width: 100, height: 100, marginBottom: 10 },
  nomPalette: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  volumePalette: { fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 8 },
  prixPalette: { fontSize: 14, color: colors.primary, fontWeight: 'bold', textAlign: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 5 },
  champ: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 15, backgroundColor: '#fff' },
  boutonValider: { backgroundColor: colors.primary, padding: 15, borderRadius: 10, marginTop: 20, marginBottom: 40, alignItems: 'center' },
  boutonDesactive: { backgroundColor: '#999' },
  boutonValiderTexte: { color: 'white', fontSize: 18, textAlign: 'center', fontWeight: 'bold' },
  erreurTexte: { fontSize: 18, color: 'red', textAlign: 'center' },
});