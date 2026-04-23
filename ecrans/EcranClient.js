import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import ToastMessage from '../components/ToastMessage';
import { colors } from '../styles/theme';

export default function EcranClient({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [estInscription, setEstInscription] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      setToast({ visible: true, message: 'Veuillez remplir tous les champs', type: 'error' });
      return;
    }
    setChargement(true);
    try {
      if (estInscription) {
        await createUserWithEmailAndPassword(auth, email, password);
        setToast({ visible: true, message: 'Compte créé ! Connectez-vous', type: 'success' });
        setEstInscription(false);
        setEmail('');
        setPassword('');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setToast({ visible: true, message: 'Connexion réussie', type: 'success' });
        navigation.replace('AccueilClientConnecte');
      }
    } catch (erreur) {
      setToast({ visible: true, message: erreur.message, type: 'error' });
    } finally {
      setChargement(false);
    }
  };

  const handleGoogle = async () => {
    setChargement(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setToast({ visible: true, message: `Connecté avec Google : ${result.user.email}`, type: 'success' });
      navigation.replace('AccueilClientConnecte');
    } catch (erreur) {
      setToast({ visible: true, message: erreur.message, type: 'error' });
    } finally {
      setChargement(false);
    }
  };

  return (
    <View style={styles.conteneur}>
      <Text style={styles.titre}>My UDs Water</Text>
      <Text style={styles.sousTitre}>{estInscription ? 'Inscription' : 'Connexion'}</Text>

      <TextInput
        style={styles.champ}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        editable={!chargement}
      />

      <TextInput
        style={styles.champ}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!chargement}
      />

      <TouchableOpacity style={styles.bouton} onPress={handleAuth} disabled={chargement}>
        {chargement ? <ActivityIndicator color={colors.primary} /> : <Text style={styles.boutonTexte}>{estInscription ? "S'inscrire" : "Se connecter"}</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.boutonGoogle} onPress={handleGoogle} disabled={chargement}>
        {chargement ? <ActivityIndicator color="white" /> : <Text style={styles.boutonGoogleTexte}>🅶 Se connecter avec Google</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setEstInscription(!estInscription)} disabled={chargement}>
        <Text style={styles.lien}>
          {estInscription ? "Déjà un compte ? Connectez-vous" : "Pas de compte ? Inscrivez-vous"}
        </Text>
      </TouchableOpacity>

      <ToastMessage visible={toast.visible} message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, visible: false })} />
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.primary },
  titre: { fontSize: 32, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 50 },
  sousTitre: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 30, textAlign: 'center' },
  champ: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  bouton: { backgroundColor: 'white', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  boutonTexte: { color: colors.primary, fontSize: 18, fontWeight: 'bold' },
  boutonGoogle: { backgroundColor: '#db4437', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  boutonGoogleTexte: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  lien: { color: 'white', textAlign: 'center', marginTop: 20, fontSize: 14 },
});