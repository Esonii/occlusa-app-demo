import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import { IconSymbol } from '@/components/atoms/IconSymbol';

type ServiceButtonProps = {
  title: string;
  onPress?: () => void;
  isOpen?: boolean;
};

function ServiceButton({ title, onPress, isOpen = false }: ServiceButtonProps) {
  return (
    <Pressable style={styles.serviceButton} onPress={onPress}>
      <View style={styles.serviceButtonContent}>
        <Text style={styles.serviceButtonText}>{title}</Text>
        <IconSymbol
          name={isOpen ? 'chevron.up' : 'chevron.down'}
          size={20}
          color="#414651"
        />
      </View>
    </Pressable>
  );
}

const GENERAL_DENTAL_SERVICES = [
  'Preventative Dentistry',
  'Restorative Dentistry',
  'Periodontal Therapy',
  'Wisdom Teeth Extraction',
  'Dentures',
  'Digital X-Rays',
  'Laser Dentistry',
  'Emergency Dentistry',
  'Smile Makeover',
];

export default function ServicesScreen() {
  const [isGeneralDentalOpen, setIsGeneralDentalOpen] = useState(false);

  const handleGeneralDentalPress = () => {
    setIsGeneralDentalOpen(!isGeneralDentalOpen);
  };

  const handleServicePress = (serviceName: string) => {
    // Navigate to service details or expand dropdown
  };

  const handleBookAppointment = () => {
    // Navigate to booking screen
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Services</Text>
          <Text style={styles.subtitle}>Read about our services</Text>

          <View style={styles.servicesGrid}>
            <View style={styles.serviceRow}>
              <View style={styles.serviceCard}>
                <ServiceButton
                  title="General Dental Services"
                  onPress={handleGeneralDentalPress}
                  isOpen={isGeneralDentalOpen}
                />
                {isGeneralDentalOpen && (
                  <View style={styles.dropdown}>
                    {GENERAL_DENTAL_SERVICES.map((service, index) => (
                      <Pressable
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => {
                          // Handle service selection
                        }}>
                        <Text style={styles.dropdownItemText}>{service}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
              <View style={styles.serviceCard}>
                <ServiceButton
                  title="Dental Implants"
                  onPress={() => handleServicePress('Dental Implants')}
                />
              </View>
            </View>

            <View style={styles.serviceRow}>
              <View style={styles.serviceCard}>
                <ServiceButton
                  title="Cosmetic Dentistry"
                  onPress={() => handleServicePress('Cosmetic Dentistry')}
                />
              </View>
              <View style={styles.serviceCard}>
                <ServiceButton
                  title="Orthodontics"
                  onPress={() => handleServicePress('Orthodontics')}
                />
              </View>
            </View>
          </View>

          <Pressable style={styles.bookButton} onPress={handleBookAppointment}>
            <Text style={styles.bookButtonText}>Book an Appointment</Text>
          </Pressable>
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
    paddingBottom: 100, // Space for bottom nav
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#005999',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    textAlign: 'center',
    marginBottom: 35,
  },
  servicesGrid: {
    width: '100%',
    marginBottom: 24,
  },
  serviceRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 35,
    gap: 10,
  },
  serviceCard: {
    flex: 1,
    position: 'relative',
  },
  serviceButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d5d7da',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 125,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  serviceButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#414651',
    textAlign: 'center',
    maxWidth: 101,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#e9eaeb',
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
    width: '100%',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#414651',
    lineHeight: 20,
  },
  bookButton: {
    backgroundColor: '#005999',
    borderWidth: 1,
    borderColor: '#005999',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});
