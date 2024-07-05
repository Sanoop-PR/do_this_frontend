import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from 'react-native-paper'


export default function NavigateBack() {
  const navigation = useNavigation()
  let theme = useTheme()

  const navigateBack =()=>{
    navigation.goBack()
  }

  return (
    <TouchableOpacity onPress={navigateBack}>
      <View style={styles.container}>
        <Ionicons name='chevron-back' style={[styles.icon,{color:theme.colors.onBackground}]}/>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container:{
    borderRadius:50,
    width:28,
    alignItems:'center',
  },
  icon:{
    fontSize:24
  }
})

