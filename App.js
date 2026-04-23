import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect } from 'react';

// Thème
import { colors } from './styles/theme';

// Notifications
import { registerForPushNotifications } from './utils/notifications';

// Écrans
import EcranSplash from './ecrans/EcranSplash';
import EcranAccueil from './ecrans/EcranAccueil';
import EcranConnexionCode from './ecrans/EcranConnexionCode';
import EcranAdmin from './ecrans/EcranAdmin';
import EcranEmploye from './ecrans/EcranEmploye';
import EcranClient from './ecrans/EcranClient';
import EcranClientConnecte from './ecrans/EcranClientConnecte';
import EcranAPropos from './ecrans/EcranAPropos';
import EcranDiscussion from './ecrans/EcranDiscussion';
import EcranCommande from './ecrans/EcranCommande';
import EcranPlanification from './ecrans/EcranPlanification';
import EcranRapport from './ecrans/EcranRapports';
import EcranPlanificationAdmin from './ecrans/EcranPlanificationAdmin';
import EcranRapportsAdmin from './ecrans/EcranRapportsAdmin';
import EcranDiscussionAdmin from './ecrans/EcranDiscussionAdmin';
import EcranBlocNotes from './ecrans/EcranBlocNotes';
import EcranCommandesAdmin from './ecrans/EcranCommandesAdmin';

// Composant Logo
import Logo from './components/Logo';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    registerForPushNotifications();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {/* Écran de chargement sans en-tête */}
        <Stack.Screen name="Splash" component={EcranSplash} options={{ headerShown: false }} />

        {/* Écran d'accueil principal avec logo personnalisé dans l'en-tête */}
        <Stack.Screen
          name="Accueil"
          component={EcranAccueil}
          options={{
            headerTitle: () => <Logo size={30} showText={false} />,
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
            title: 'My UDs Water',
          }}
        />

        {/* Connexion par code */}
        <Stack.Screen
          name="ConnexionCode"
          component={EcranConnexionCode}
          options={{
            title: 'Connexion',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />

        {/* Espace Administrateur */}
        <Stack.Screen
          name="Admin"
          component={EcranAdmin}
          options={{
            title: 'Administrateur',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />

        {/* Espace Employé */}
        <Stack.Screen
          name="Employe"
          component={EcranEmploye}
          options={{
            title: 'Employé',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />

        {/* Espace Client (connexion) */}
        <Stack.Screen
          name="Client"
          component={EcranClient}
          options={{
            title: 'Connexion Client',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />

        {/* Espace Client connecté */}
        <Stack.Screen
          name="AccueilClientConnecte"
          component={EcranClientConnecte}
          options={{
            title: 'Espace Client',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />

        {/* Autres écrans */}
       <Stack.Screen
         name="APropos"
         component={EcranAPropos}
         options={{ headerShown: false }}
         />
        <Stack.Screen
          name="Discussion"
          component={EcranDiscussion}
          options={{
            title: 'Discussion',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />
        <Stack.Screen
          name="Commande"
          component={EcranCommande}
          options={{
            title: 'Commander',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />
        <Stack.Screen
          name="Planification"
          component={EcranPlanification}
          options={{
            title: 'Planification',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />
        <Stack.Screen
          name="Rapport"
          component={EcranRapport}
          options={{
            title: 'Rapport journalier',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />
        <Stack.Screen
          name="PlanificationAdmin"
          component={EcranPlanificationAdmin}
          options={{
            title: 'Planification Admin',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />
        <Stack.Screen
          name="RapportsAdmin"
          component={EcranRapportsAdmin}
          options={{
            title: 'Rapports employés',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />
        <Stack.Screen
          name="DiscussionAdmin"
          component={EcranDiscussionAdmin}
          options={{
            title: 'Discussions clients',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />
        <Stack.Screen
          name="BlocNotes"
          component={EcranBlocNotes}
          options={{
            title: 'Bloc notes',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />
        <Stack.Screen
          name="CommandesAdmin"
          component={EcranCommandesAdmin}
          options={{
            title: 'Commandes clients',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}