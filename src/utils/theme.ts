// theme.ts
import { DefaultTheme, MD3DarkTheme } from 'react-native-paper';


export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200EE',
    background: '#FFFFFF',
    text: '#000000',
    customColors: '#FF6347',
    customColorss: '#1E90FF',
  },
};

export const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',
    background: '#121212',
    text: '#FFFFFF',
    customColors: '#FF6347',
  customColorss: '#1E90FF',
  },
};


