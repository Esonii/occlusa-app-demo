import React, { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/atoms/IconSymbol';
import { ThemedText } from '@/components/atoms/ThemedText';
import { ThemedView } from '@/components/atoms/ThemedView';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type CollapsibleProps = PropsWithChildren<{ title: string }>;

export function Collapsible({ children, title }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <View style={styles.iconContainer}>
          <IconSymbol
            name="chevron.right"
            size={18}
            color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
            style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
          />
        </View>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.childrenContainer}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 6,
  },
  childrenContainer: {
    marginTop: 6,
    marginLeft: 24,
  },
});

