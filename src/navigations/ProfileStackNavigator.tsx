import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ProfileStackParamList } from './types'
import ProfileScreen from '@/screens/profile/ProfileScreen'
import SettingsScreen from '@/screens/profile/SettingsScreen'
import ChangeName from '@/screens/profile/ChangeName'
import ChangePassword from '@/screens/profile/ChangePassword'
import AccountDelete from '@/screens/profile/AccountDelete'
import DarkMode from '@/screens/profile/DarkMode'

const Stack = createNativeStackNavigator<ProfileStackParamList>()

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown:false}} />
      <Stack.Screen name="Setting" component={SettingsScreen} options={{headerShown:false}} />
      <Stack.Screen name="ChangeName" component={ChangeName} options={{headerShown:false}} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} options={{headerShown:false}} />
      <Stack.Screen name="DarkMode" component={DarkMode} options={{headerShown:false}} />
      <Stack.Screen name="DeleteAccount" component={AccountDelete} options={{headerShown:false}} />
    </Stack.Navigator>
  )
}
