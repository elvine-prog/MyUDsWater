import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../styles/theme';

export default function Logo({ size = 80, showText = true }) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="water" size={size} color={colors.primary} />
      {showText && (
        <Text style={[styles.text, { fontSize: size * 0.5, color: colors.primary }]}>My UDs Water</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  text: { fontWeight: 'bold', marginTop: 10 },
});