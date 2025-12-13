import { Tabs } from 'expo-router';
import React from 'react';

import { IconSymbol } from '@/components/atoms/IconSymbol';
import { HapticTab } from '@/components/molecules/HapticTab';

const ACTIVE_COLOR = '#A1D3F2';
const INACTIVE_COLOR = '#fff';
const TAB_BAR_BG = '#005999';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: TAB_BAR_BG,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              size={28}
              name="house.fill"
              color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Appointments',
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              size={28}
              name="calendar.fill"
              color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              size={28}
              name="cross.case.fill"
              color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              size={28}
              name="person.fill"
              color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          ),
        }}
      />
    </Tabs>
  );
}
