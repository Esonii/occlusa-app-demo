import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import OcclusaLogo from '@/components/atoms/OcclusaLogo';
import PracticeDropdown from '@/components/molecules/PracticeDropdown';

const PRIMARY_COLOR = '#4490cf';
const ACCENT_COLOR = '#2f6fb5';
const BACKGROUND_COLOR = '#f5f9ff';
const PRACTICE_LOGO = require('@/assets/images/pdc-logo.png');

export default function WelcomeScreen() {
  const router = useRouter();

  const handlePracticeSelect = () => {
    router.push('/signup');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <OcclusaLogo />
        <PracticeDropdown
          primaryColor={PRIMARY_COLOR}
          accentColor={ACCENT_COLOR}
          option={{
            id: 'purcellville',
            name: 'Purcellville Dental Care',
            logo: PRACTICE_LOGO,
          }}
          onSelect={handlePracticeSelect}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 72,
    backgroundColor: BACKGROUND_COLOR,
    gap: 48,
  },
});

