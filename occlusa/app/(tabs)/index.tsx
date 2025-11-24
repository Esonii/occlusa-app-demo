import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@occlusa_user_account';

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  password: string;
  dateOfBirth: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>('User');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem(STORAGE_KEY);
        if (userDataString) {
          const userData: UserData = JSON.parse(userDataString);
          if (userData.firstName) {
            setFirstName(userData.firstName);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.greeting}>Hello, {firstName}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appointments</Text>
            <Text style={styles.sectionText}>You don't have any upcoming appointments</Text>
            <Pressable
              style={styles.button}
              onPress={() => router.push('/(tabs)/appointments')}>
              <Text style={styles.buttonText}>Book an Appointment</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services</Text>
            <Text style={styles.sectionText}>Want to learn more about our services?</Text>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>See our Services</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#005999',
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#005999',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
