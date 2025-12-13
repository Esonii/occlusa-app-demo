import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const typeStyles = {
    default: styles.default,
    defaultSemiBold: styles.defaultSemiBold,
    title: styles.title,
    subtitle: styles.subtitle,
    link: styles.link,
  };

  return (
    <Text
      style={[typeStyles[type], { color }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});

