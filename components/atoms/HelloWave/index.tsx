import React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

export function HelloWave() {
  return (
    <Animated.Text
      style={[
        styles.text,
        {
          animationName: {
            '50%': { transform: [{ rotate: '25deg' }] },
          },
          animationIterationCount: 4,
          animationDuration: '300ms',
        },
      ]}>
      👋
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});

