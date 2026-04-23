import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function EcranEmploye({ navigation, route }) {
 const { userId, userName } = route.params || { userId: null, userName: null };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Espace Employé</Text>
      <Text style={styles.subtitle}>Bienvenue, {userName || 'Employé'}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Planification', { userId })}>
        <Text style={styles.buttonText}>📅 Planification des tâches</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Rapport')}>
        <Text style={styles.buttonText}>📝 Rapport journée</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#0066CC' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 30, color: '#555' },
  button: { backgroundColor: '#0066CC', padding: 18, borderRadius: 10, marginBottom: 15 },
  buttonText: { color: 'white', fontSize: 18, textAlign: 'center', fontWeight: '500' },
});