import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
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

export default function EditProfileScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    mobilePhone: '',
    password: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem(STORAGE_KEY);
        if (userDataString) {
          const userData: UserData = JSON.parse(userDataString);
          setFormData(userData);
        }
      } catch (error) {
        // Handle error silently
      }
    };

    loadUserData();
  }, []);

  const updateField = (field: keyof UserData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      Alert.alert('Changes saved successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>

            <View style={styles.form}>
              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <TextInput
                    style={styles.input}
                    placeholder="First Name*"
                    placeholderTextColor="#999"
                    value={formData.firstName}
                    onChangeText={(text) => updateField('firstName', text)}
                  />
                </View>
                <View style={styles.halfWidth}>
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name*"
                    placeholderTextColor="#999"
                    value={formData.lastName}
                    onChangeText={(text) => updateField('lastName', text)}
                  />
                </View>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Email *"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Phone Number *"
                placeholderTextColor="#999"
                value={formData.mobilePhone}
                onChangeText={(text) => updateField('mobilePhone', text)}
                keyboardType="phone-pad"
              />

              <TextInput
                style={styles.input}
                placeholder="Password *"
                placeholderTextColor="#999"
                value={formData.password}
                onChangeText={(text) => updateField('password', text)}
                secureTextEntry
                autoCapitalize="none"
              />

              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#005999',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#005999',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#005999',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

