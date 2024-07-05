import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootButtonTabParamList } from "./types";
import HomeStackNavigator from "./HomeStackNavigator";
import CompletedScreen from "@/screens/CompletedScreen";
import TodayScreen from "@/screens/TodayScreen";
import CategoriesStackNavigator from "./CategoriesStackNavigator";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import ProfileStackNavigator from "./ProfileStackNavigator";
import { useColorScheme } from "react-native";

const Tab = createBottomTabNavigator<RootButtonTabParamList>();

export default function ButtonTabNavigator() {
  const scheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: scheme=='dark'?'#fdfffc' :'#0a0a04',
        tabBarInactiveTintColor: scheme=='dark'?'#343a40' :'#adb5bd',
        tabBarHideOnKeyboard: true,
        tabBarStyle:{
          backgroundColor:scheme=='dark'?'#000000':'#ffffff',
        },
        tabBarShowLabel:false,
      }}
      >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({color}) => <AntDesign name="home" size={20} color={color} />,
          headerShown: false,
        }}
        
      />
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="today-outline" size={20} color={color} />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name="CategoriesStack"
        component={CategoriesStackNavigator}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="layers-outline" size={20} color={color} />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Completed"
        component={CompletedScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="checkbox-multiple-marked-outline"
              size={20} color={color}
            />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({color}) => (
            <FontAwesome name="user-o" size={20} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

