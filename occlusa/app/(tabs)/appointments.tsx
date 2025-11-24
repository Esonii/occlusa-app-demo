import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

type TabType = 'upcoming' | 'past';

export default function AppointmentsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const handleBookAppointment = () => {
    // Route to booking screen - will be created later
    // router.push('/book-appointment');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Appointments</Text>

          <View style={styles.tabsContainer}>
            <Pressable
              style={styles.tab}
              onPress={() => setActiveTab('upcoming')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'upcoming' && styles.tabTextActive,
                ]}>
                Upcoming
              </Text>
              {activeTab === 'upcoming' && <View style={styles.tabUnderline} />}
            </Pressable>

            <Pressable
              style={styles.tab}
              onPress={() => setActiveTab('past')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'past' && styles.tabTextActive,
                ]}>
                Past
              </Text>
              {activeTab === 'past' && <View style={styles.tabUnderline} />}
            </Pressable>
          </View>

          <View style={styles.contentContainer}>
            {activeTab === 'upcoming' ? (
              <>
                <Text style={styles.messageText}>
                  You don't have any upcoming appointments
                </Text>
                <Pressable
                  style={styles.button}
                  onPress={handleBookAppointment}>
                  <Text style={styles.buttonText}>Book an Appointment</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.messageText}>
                  You don't have any past appointments
                </Text>
                <Pressable
                  style={styles.button}
                  onPress={handleBookAppointment}>
                  <Text style={styles.buttonText}>Book an Appointment</Text>
                </Pressable>
              </>
            )}
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#005999',
    marginBottom: 24,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    marginHorizontal: 24,
    paddingBottom: 8,
    position: 'relative',
  },
  tabText: {
    fontSize: 19.2,
    color: '#333',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#005999',
    fontWeight: '600',
    fontSize: 19.2,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: -9,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#005999',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#005999',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    minWidth: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
