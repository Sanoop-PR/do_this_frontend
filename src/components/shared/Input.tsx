import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import React from "react";
import { FieldError } from "react-hook-form"
import { useTheme } from 'react-native-paper'
import Loader from "./Loader";

type InputProps = {
  label: string;
  error?:FieldError| undefined;
} & TextInputProps;

export default function Input({ label,error,...props }: InputProps) {
  let theme = useTheme()
  // if (!theme) {
  //   return <Loader/>
  // }
  return (
    <View>
      <Text style={{color:theme.colors.onBackground,textTransform: 'uppercase'}}>{label}</Text>
      <TextInput placeholder={label} style={[styles.input,{color:theme.colors.onBackground}]} {...props} placeholderTextColor={theme.colors.outline} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: "#322C2B",
    borderRadius: 50,
    marginTop:10,
  }
});
