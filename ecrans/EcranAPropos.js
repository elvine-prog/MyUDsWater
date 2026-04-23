import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function EcranAPropos() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={require('../assets/fond_ecran.jpg')} // ← ton image
        style={styles.background}
        resizeMode="cover"
      >
        {/* Bouton retour flottant (en haut à gauche) */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        {/* Contenu principal – commence dès le haut */}
        <View style={styles.contentContainer}>
          <View style={styles.overlay}>
            <Text style={styles.title}>My UDs Water</Text>
            <Text style={styles.text}>
              My UDs Water est une application dédiée à l'optimisation et la distribution d'eau potable de qualité.
              {'\n\n'}
              Notre mission : assurer un accès fiable à l'eau potable pour tous les ménages et entreprises de la région en temps réel.
              {'\n\n'}
              Nous proposons des livraisons à domicile avec différents formats de palettes adaptés à vos besoins.
              {'\n\n'}
              Notre engagement : qualité, ponctualité et service client réactif.
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,            // à ajuster selon la barre d'état
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 30,
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center', // ou 'flex-start' si tu veux coller en haut
    padding: 20,
    paddingTop: 80,    // pour descendre le contenu sous le bouton retour
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    textAlign: 'justify',
  },
});