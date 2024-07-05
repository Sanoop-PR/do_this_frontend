import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AppStackParamList } from './types'
import ButtonTabNavigator from './ButtonTabNavigator'


const Stack = createNativeStackNavigator<AppStackParamList>()

export default function AppStackNavigator() {
  return (
    <Stack.Navigator>
        <Stack.Screen
        name= 'Root'
        component={ButtonTabNavigator}
        options={{
            headerShown:false
        }}
        />
    </Stack.Navigator>
  )
}
