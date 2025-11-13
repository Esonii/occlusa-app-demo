import React, { useMemo, useState } from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';

type PracticeOption = {
  id: string;
  name: string;
  logo: ImageSourcePropType;
};

type PracticeDropdownProps = {
  primaryColor: string;
  accentColor: string;
  option: PracticeOption;
  onSelect?: (option: PracticeOption) => void;
};

export function PracticeDropdown({ primaryColor, accentColor, option, onSelect }: PracticeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<PracticeOption | null>(null);

  const buttonLabel = useMemo(() => selectedOption?.name ?? 'Select your dental practice', [selectedOption]);

  const handleToggle = () => {
    setIsOpen((current) => !current);
  };

  const handleSelect = () => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect?.(option);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={handleToggle}
        style={[styles.button, { borderColor: accentColor, backgroundColor: '#fff' }]}>
        <Text style={[styles.buttonLabel, { color: primaryColor }]}>{buttonLabel}</Text>
        <View style={[styles.chevron, { backgroundColor: primaryColor }]}>
          <Text style={styles.chevronLabel}>{isOpen ? '▲' : '▼'}</Text>
        </View>
      </Pressable>

      {isOpen && (
        <View style={[styles.dropdown, { borderColor: accentColor, shadowColor: accentColor }]}>
          <Pressable accessibilityRole="button" onPress={handleSelect} style={styles.option}>
            <Image source={option.logo} style={styles.optionLogo} resizeMode="contain" />
            <Text style={[styles.optionLabel, { color: primaryColor }]}>{option.name}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default PracticeDropdown;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 320,
  },
  button: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  chevron: {
    alignItems: 'center',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  chevronLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    overflow: 'hidden',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionLogo: {
    borderRadius: 8,
    height: 40,
    width: 40,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
  },
});

