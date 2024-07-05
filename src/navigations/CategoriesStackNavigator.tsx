import React from "react";
import { CategoriesStackParamList } from "./types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CategoriesScreen from "@/screens/CategoriesScreen";
import CategoryScreen from "@/screens/CategoryScreen";
import CreateCategoryScreen from "@/screens/CreateCategoryScreen";

const Stack = createNativeStackNavigator<CategoriesStackParamList>();

export default function CategoriesStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Categories" component={CategoriesScreen} options={{
        headerShown: false
      }} />
      <Stack.Screen name="Category" component={CategoryScreen} options={{
        headerShown: false
      }} />
      <Stack.Screen name="CreateCategory" component={CreateCategoryScreen} options={{
        headerShown: false
      }} />
    </Stack.Navigator>
  );
}