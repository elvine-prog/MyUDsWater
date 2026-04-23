import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Logo from '../components/Logo';
import { colors } from '../styles/theme';

export default function EcranSplash({ navigation }) {
  useEffect(() => {
    setTimeout(() => navigation.replace('Accueil'), 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Logo size={100} showText={true} />
      <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
});