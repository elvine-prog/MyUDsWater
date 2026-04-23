import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { showLocalNotification } from '../utils/notifications';

export default function EcranAccueil({ navigation }) {
  const testerNotification = async () => {
    await showLocalNotification('🔔 Test notification', 'Ceci est une notification de test. Si vous la voyez, les notifications fonctionnent !');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ConnexionCode', { role: 'admin' })}>
        <Text style={styles.buttonText}>Administrateur</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ConnexionCode', { role: 'employe' })}>
        <Text style={styles.buttonText}>Employé</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Client')}>
        <Text style={styles.buttonText}>Client</Text>
      </TouchableOpacity>

      {/* Bouton de test des notifications */}
      <TouchableOpacity style={[styles.button, styles.testButton]} onPress={testerNotification}>
        <Text style={styles.buttonText}>🔔 Tester notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0066CC',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 50,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  testButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#28a745',
  },
});