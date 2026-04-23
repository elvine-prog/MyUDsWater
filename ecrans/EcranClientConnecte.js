import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { colors } from '../styles/theme';

export default function EcranClientConnecte({ navigation }) {
  const deconnexion = async () => {
    await signOut(auth);
    navigation.replace('Client');
  };

  useEffect(() => {
    // Ajouter un bouton de déconnexion dans l'en-tête droit
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={deconnexion} style={{ marginRight: 15 }}>
          <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 16 }}>Déconnexion</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Espace Client</Text>
      <Text style={styles.welcome}>Bienvenue {auth.currentUser?.email}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('APropos')}>
        <Text style={styles.buttonText}>📖 À propos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Discussion')}>
        <Text style={styles.buttonText}>💬 Discuter</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Commande')}>
        <Text style={styles.buttonText}>🛒 Commander</Text>
      </TouchableOpacity>

      {/* Le bouton de déconnexion a été déplacé dans l'en-tête */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: colors.primary },
  welcome: { fontSize: 16, textAlign: 'center', marginBottom: 30, color: colors.black },
  button: { backgroundColor: colors.primary, padding: 18, borderRadius: 10, marginBottom: 15 },
  buttonText: { color: colors.white, fontSize: 18, textAlign: 'center', fontWeight: '500' },
});