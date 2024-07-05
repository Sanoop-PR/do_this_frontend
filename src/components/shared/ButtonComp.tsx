import { Text, View,TouchableOpacity } from "react-native";
import React from "react";

type ButtonProps = {
  label: string;
  onPress: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  styl?:any;
  stylText?:any;
};

export default function ButtonComp({
  label,
  onLongPress,
  onPress,
  disabled,
  styl,
  stylText
}: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress} disabled={disabled} style={styl} >
      <View>
        <Text style={stylText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

