import React from 'react';
import { TextInput as RNTextInput, TextInputProps, StyleSheet } from 'react-native';

export type TextInputAtomProps = TextInputProps & {
  label?: string;
  required?: boolean;
};

export function TextInput({ label, required, style, ...rest }: TextInputAtomProps) {
  return (
    <>
      {label && (
        <RNTextInput
          style={[styles.label, style]}
          editable={false}
          value={required ? `${label}*` : label}
        />
      )}
      <RNTextInput
        style={[styles.input, style]}
        placeholderTextColor="#999"
        {...rest}
      />
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    padding: 0,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 0,
  },
});

export default TextInput;

