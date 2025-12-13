import React from 'react';
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle, View } from 'react-native';

type IconSymbolName = 'house.fill' | 'paperplane.fill' | 'chevron.left.forwardslash.chevron.right' | 'chevron.right' | 'chevron.down' | 'chevron.up' | 'calendar.fill' | 'cross.case.fill' | 'person.fill';

const SF_SYMBOL_MAPPING: Record<IconSymbolName, string> = {
  'house.fill': 'house.fill',
  'paperplane.fill': 'paperplane.fill',
  'chevron.left.forwardslash.chevron.right': 'chevron.left.forwardslash.chevron.right',
  'chevron.right': 'chevron.right',
  'chevron.down': 'chevron.down',
  'chevron.up': 'chevron.up',
  'calendar.fill': 'calendar.fill',
  'cross.case.fill': 'cross.fill', // Using cross.fill as fallback for cross.case.fill
  'person.fill': 'person.fill',
};

type IconSymbolProps = {
  name: IconSymbolName;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
};

export function IconSymbol({ name, size = 24, color, style, weight = 'regular' }: IconSymbolProps) {
  const symbolName = SF_SYMBOL_MAPPING[name] as SymbolViewProps['name'];
  
  if (!symbolName) {
    return <View style={[{ width: size, height: size }, style]} />;
  }

  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={symbolName}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}

