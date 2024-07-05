import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeStackParamsList } from './types'
import HomeScreen from '@/screens/HomeScreen'
import EditTaskScreen from '@/screens/EditTaskScreen'

const Stack = createNativeStackNavigator<HomeStackParamsList>()

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='EditTask'
        component={EditTaskScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}