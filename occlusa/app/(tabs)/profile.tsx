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
import { IconSymbol } from '@/components/atoms/IconSymbol';

const STORAGE_KEY = '@occlusa_user_account';

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  password: string;
  dateOfBirth: string;
};

type ProfileMenuItemProps = {
  title: string;
  showChevron?: boolean;
  onPress?: () => void;
  isLast?: boolean;
};

function ProfileMenuItem({
  title,
  showChevron = false,
  onPress,
  isLast = false,
}: ProfileMenuItemProps) {
  return (
    <>
      <Pressable
        style={styles.menuItem}
        onPress={onPress}
        disabled={!onPress}>
        <Text style={styles.menuItemText}>{title}</Text>
        {showChevron && (
          <IconSymbol name="chevron.right" size={24} color="#fff" />
        )}
      </Pressable>
      {!isLast && <View style={styles.divider} />}
    </>
  );
}

export default function ProfileScreen() {
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
        // Handle error silently
      }
    };

    loadUserData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <IconSymbol name="person.fill" size={60} color="#fff" />
            </View>
          </View>

          <Text style={styles.userName}>{firstName}</Text>

          <View style={styles.profileActions}>
            <ProfileMenuItem
              title="Edit Profile"
              showChevron={true}
              onPress={() => {
                router.push('/edit-profile');
              }}
            />
            <ProfileMenuItem
              title="Forms"
              showChevron={true}
              onPress={() => {
                // Navigate to forms
              }}
            />
            <ProfileMenuItem
              title="Records"
              showChevron={true}
              onPress={() => {
                // Navigate to records
              }}
            />
            <ProfileMenuItem
              title="Logout"
              isLast={true}
              onPress={() => {
                // Handle logout
              }}
            />
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
    paddingBottom: 100, // Space for bottom nav
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#005999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 28,
    fontWeight: '600',
    color: '#005999',
    textAlign: 'center',
    marginBottom: 27,
  },
  profileActions: {
    backgroundColor: '#005999',
    borderRadius: 10,
    paddingHorizontal: 36,
    paddingVertical: 37,
    width: '90%',
    maxWidth: 359,
    gap: 27,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 0,
  },
  menuItemText: {
    fontSize: 22,
    fontWeight: '400',
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    width: '100%',
    marginTop: 0,
  },
});
