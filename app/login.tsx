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

const PRACTICE_LOGO = require('@/assets/images/pdc-logo.png');

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Navigation will be handled here - no validation for now
    router.replace('/(tabs)');
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

            <Text style={styles.title}>Login</Text>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Email*"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Password*"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <Pressable style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
              </Pressable>

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Don't have an account?{' '}
                  <Text style={styles.linkText} onPress={() => router.push('/signup')}>
                    Sign up
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
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#005999',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
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

