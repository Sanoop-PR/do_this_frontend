import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStackNavigator from './AuthStackNavigator'
import AppStackNavigator from './AppStackNavigator'
import useUserGlobalStore from '@/store/useUserGlobalStore'
import { DarkTheme, LightTheme } from '@/utils/theme'
import { useColorScheme } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper';


export default function Navigation() {
  const { user, updateUser } = useUserGlobalStore()

  useEffect(() => {
    updateUser(null)
    return () => { }
  }, [])

  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? DarkTheme : LightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        {user ? <AppStackNavigator /> : <AuthStackNavigator />}
      </NavigationContainer>
    </PaperProvider>
  )
}
