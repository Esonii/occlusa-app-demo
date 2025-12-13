import React from 'react';
import { Image, ImageStyle, StyleSheet, View, ViewStyle } from 'react-native';

type OcclusaLogoProps = {
  size?: number;
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
};

export function OcclusaLogo({ size = 180, containerStyle, imageStyle }: OcclusaLogoProps) {
  const logo = require('@/assets/images/occlusa-logoname-v1.png');

  return (
    <View style={[styles.container, containerStyle]}>
      <Image source={logo} style={[styles.image, { height: size, width: size }, imageStyle]} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    maxWidth: '100%',
  },
});

export default OcclusaLogo;

