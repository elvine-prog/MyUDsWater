import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function EcranAdmin({ navigation, route }) {
   const { userId, userName } = route.params || { userId: null, userName: null };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Espace Administrateur</Text>
      <Text style={styles.subtitle}>Bienvenue, {userName || 'Admin'}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PlanificationAdmin', { userId })}>
        <Text style={styles.buttonText}>📅 Planificateur des tâches</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RapportsAdmin')}>
        <Text style={styles.buttonText}>📊 Rapports des employés</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DiscussionAdmin')}>
        <Text style={styles.buttonText}>💬 Discussions clients</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BlocNotes')}>
        <Text style={styles.buttonText}>📒 Bloc notes (entrées/sorties)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CommandesAdmin')}>
        <Text style={styles.buttonText}>🛒 Commandes clients</Text>
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