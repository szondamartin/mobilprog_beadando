import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Switch } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from 'firebase/auth';

// Firebase konfiguráció
const firebaseConfig = {
  apiKey: "AIzaSyBRDW6IflKNEcKrI8PQZ6GyuMZ6ULtn5Qo",
  authDomain: "beadando1-10f1d.firebaseapp.com",
  projectId: "beadando1-10f1d",
  storageBucket: "beadando1-10f1d.firebasestorage.app",
  messagingSenderId: "1002869907390",
  appId: "1:1002869907390:web:eefc7d64a29b9c72e663ef",
  measurementId: "G-P4WTQRF3K6"
};

// Firebase inicializálás
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const auth = getAuth();

// Alsó navigációs sáv
const Tab = createBottomTabNavigator();

function HomeScreen({ theme }) {
  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#000' : '#fff' }]}>
      <Text style={[styles.title, { color: theme === 'dark' ? '#fff' : '#000' }]}>
        Üdvözlünk az Applikációban!
      </Text>
      <Text style={[styles.text, { color: theme === 'dark' ? '#fff' : '#000' }]}>
        Ez az alkalmazás lehetőséget nyújt, hogy könnyedén foglalj orvosi időpontokat a kiválasztott kórházakba.
      </Text>
    </View>
  );
}

function BookingScreen({ theme, onBookingConfirmed }) {
  const hospital = 'Borsod-Abaúj-Zemplén Vármegyei Központi Kórház és Egyetemi Oktatókórház';
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  const handleBooking = () => {
    if (date.trim() === '' || time.trim() === '' || description.trim() === '') {
      Alert.alert('Hiba', 'Minden mezőt ki kell tölteni!');
      return;
    }

    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(time)) {
      Alert.alert('Hiba', 'Az időpont formátuma HH:MM (pl. 06:00 vagy 16:00) legyen.');
      return;
    }

    const [hours] = time.split(':').map(Number);
    if (hours < 6 || hours > 16) {
      Alert.alert('Hiba', 'Az időpontnak 06:00 és 16:00 között kell lennie.');
      return;
    }

    const bookingDetails = `Sikeres időpont foglalás: ${date} ${time}`;
    onBookingConfirmed(bookingDetails); // Értesítés hozzáadása
    Alert.alert('Foglalás sikeres!', bookingDetails);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#000' : '#fff' }]}>
      <Text style={[styles.title, { color: theme === 'dark' ? '#fff' : '#000' }]}>Időpont Foglalás</Text>
      <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>Kórház: {hospital}</Text>

      <TextInput
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
        placeholder="Dátum (pl. 2024-11-05)"
        placeholderTextColor={theme === 'dark' ? '#ccc' : '#666'}
        value={date}
        onChangeText={setDate}
      />

      <TextInput
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
        placeholder="Idő (pl. 06:00)"
        placeholderTextColor={theme === 'dark' ? '#ccc' : '#666'}
        value={time}
        onChangeText={setTime}
      />

      <TextInput
        style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
        placeholder="Írja le panaszát"
        placeholderTextColor={theme === 'dark' ? '#ccc' : '#666'}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.button} onPress={handleBooking}>
        <Text style={styles.buttonText}>Időpont Foglalása</Text>
      </TouchableOpacity>
    </View>
  );
}

function NotificationsScreen({ theme, notifications }) {
  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#000' : '#fff' }]}>
      <Text style={[styles.title, { color: theme === 'dark' ? '#fff' : '#000' }]}>Értesítések</Text>
      {notifications.length === 0 ? (
        <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>Nincsenek értesítések.</Text>
      ) : (
        notifications.map((notification, index) => (
          <View key={index} style={styles.notificationContainer}>
            <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>{notification}</Text>
            {index < notifications.length - 1 && <View style={styles.separator} />}
          </View>
        ))
      )}
    </View>
  );
}

function SettingsScreen({ theme, toggleTheme, onAccountDeleted }) {
  const handleDeleteAccount = () => {
    Alert.alert('Fiók törlése', 'Biztosan törölni szeretnéd a fiókodat?', [
      { text: 'Mégse', style: 'cancel' },
      {
        text: 'Igen',
        onPress: () => {
          const user = auth.currentUser;
          if (user) {
            deleteUser(user)
              .then(() => {
                Alert.alert('Fiók törölve', 'A fiókodat sikeresen töröltük.');
                onAccountDeleted();
              })
              .catch((error) => {
                Alert.alert('Hiba', error.message);
              });
          } else {
            Alert.alert('Hiba', 'Nincs bejelentkezett felhasználó.');
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#000' : '#fff' }]}>
      <Text style={[styles.title, { color: theme === 'dark' ? '#fff' : '#000' }]}>Beállítások</Text>
      <View style={styles.switchContainer}>
        <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>Világos/Sötét Téma</Text>
        <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={styles.deleteButtonText}>Fiók Törlése</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Sikeres regisztráció', 'Fiók létrehozva!');
      setIsAuthenticated(true);
    } catch (error) {
      Alert.alert('Regisztrációs hiba', error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Sikeres bejelentkezés', 'Bejelentkeztél!');
      setIsAuthenticated(true);
    } catch (error) {
      Alert.alert('Bejelentkezési hiba', error.message);
    }
  };

  const handleAccountDeleted = () => {
    setIsAuthenticated(false);
  };

  const handleBookingConfirmed = (bookingDetails) => {
    setNotifications([...notifications, bookingDetails]);
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Üdvözöllek!</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Jelszó"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Bejelentkezés</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSecondary} onPress={handleSignUp}>
          <Text style={styles.buttonSecondaryText}>Regisztráció</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tab.Navigator>
        <Tab.Screen name="Főoldal">
          {() => <HomeScreen theme={theme} />}
        </Tab.Screen>
        <Tab.Screen name="Időpont Foglalás">
          {() => <BookingScreen theme={theme} onBookingConfirmed={handleBookingConfirmed} />}
        </Tab.Screen>
        <Tab.Screen name="Értesítések">
          {() => <NotificationsScreen theme={theme} notifications={notifications} />}
        </Tab.Screen>
        <Tab.Screen name="Beállítások">
          {() => <SettingsScreen theme={theme} toggleTheme={toggleTheme} onAccountDeleted={handleAccountDeleted} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonSecondary: {
    backgroundColor: '#03DAC5',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#000',
    fontSize: 16,
  },
  notificationContainer: {
    marginBottom: 10,
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 5,
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
});
