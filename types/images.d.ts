import type { ImageSourcePropType } from 'react-native';

declare module '*.png' {
  const value: ImageSourcePropType;
  export default value;
}

declare module '@/assets/images/occlusa-logo.png' {
  const value: ImageSourcePropType;
  export default value;
}

declare module '@/assets/images/pdc-logo.png' {
  const value: ImageSourcePropType;
  export default value;
}


