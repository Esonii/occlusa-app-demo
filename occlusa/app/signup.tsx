import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TextInput,
  Pressable,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRACTICE_LOGO = require('@/assets/images/pdc-logo.png');

type SignupFormData = {
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  password: string;
  dateOfBirth: string;
};

const STORAGE_KEY = '@occlusa_user_account';

export default function SignupScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    mobilePhone: '',
    password: '',
    dateOfBirth: '',
  });

  const updateField = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateAccount = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      console.log('Account data saved locally:', formData);
      // Navigate to home screen after account creation
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving account data:', error);
      alert('Error saving account. Please try again.');
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
            <Image source={PRACTICE_LOGO} style={styles.logo} resizeMode="contain" />

            <Text style={styles.title}>Sign up</Text>

            <View style={styles.form}>
              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <TextInput
                    style={styles.input}
                    placeholder="First name*"
                    placeholderTextColor="#999"
                    value={formData.firstName}
                    onChangeText={(text) => updateField('firstName', text)}
                  />
                </View>
                <View style={styles.halfWidth}>
                  <TextInput
                    style={styles.input}
                    placeholder="Last name*"
                    placeholderTextColor="#999"
                    value={formData.lastName}
                    onChangeText={(text) => updateField('lastName', text)}
                  />
                </View>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Email*"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Mobile Phone*"
                placeholderTextColor="#999"
                value={formData.mobilePhone}
                onChangeText={(text) => updateField('mobilePhone', text)}
                keyboardType="phone-pad"
              />

              <TextInput
                style={styles.input}
                placeholder="Password*"
                placeholderTextColor="#999"
                value={formData.password}
                onChangeText={(text) => updateField('password', text)}
                secureTextEntry
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Date of birth*"
                placeholderTextColor="#999"
                value={formData.dateOfBirth}
                onChangeText={(text) => updateField('dateOfBirth', text)}
              />

              <Pressable style={styles.createButton} onPress={handleCreateAccount}>
                <Text style={styles.createButtonText}>Create Account</Text>
              </Pressable>

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Already have an account?{' '}
                  <Text style={styles.linkText} onPress={() => router.push('/login')}>
                    Log in
                  </Text>
                </Text>
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.linkText}>Terms</Text> and{' '}
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
              </View>
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
  logo: {
    width: '100%',
    height: 80,
    marginBottom: 32,
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 32,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#005999',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    gap: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  linkText: {
    color: '#005999',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

