import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ToastMessage from '../components/ToastMessage';
import { colors } from '../styles/theme';

export default function EcranConnexionCode({ navigation, route }) {
  const [code, setCode] = useState('');
  const [chargement, setChargement] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const roleAttendu = route.params?.role;

  const handleConnexion = async () => {
    if (!code.trim()) {
      setToast({ visible: true, message: 'Veuillez entrer un code', type: 'error' });
      return;
    }
    setChargement(true);
    try {
      const q = query(collection(db, 'codes'), where('code', '==', code.trim()));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setToast({ visible: true, message: 'Code invalide', type: 'error' });
        return;
      }
      const docData = snapshot.docs[0];
      const userData = docData.data();
      if (userData.role !== roleAttendu) {
        setToast({ visible: true, message: `Ce code n'est pas destiné à un ${roleAttendu}`, type: 'error' });
        return;
      }
      const screenName = roleAttendu === 'admin' ? 'Admin' : 'Employe';
      navigation.replace(screenName, {
        userId: docData.id,
        userRole: roleAttendu,
        userName: userData.nom || (roleAttendu === 'admin' ? 'Administrateur' : 'Employé')
      });
    } catch (err) {
      console.error(err);
      setToast({ visible: true, message: 'Vérifiez votre connexion internet', type: 'error' });
    } finally {
      setChargement(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Connexion {roleAttendu === 'admin' ? 'Administrateur' : 'Employé'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Code d'accès"
        value={code}
        onChangeText={setCode}
        autoCapitalize="characters"
        editable={!chargement}
      />
      <TouchableOpacity style={styles.button} onPress={handleConnexion} disabled={chargement}>
        {chargement ? <ActivityIndicator color={colors.primary} /> : <Text style={styles.buttonText}>Se connecter</Text>}
      </TouchableOpacity>
      <ToastMessage visible={toast.visible} message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, visible: false })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.primary },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: 'white', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: colors.primary, fontSize: 18, fontWeight: 'bold' },
});