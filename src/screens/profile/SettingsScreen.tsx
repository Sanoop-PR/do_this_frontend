import {  TouchableOpacity, StyleSheet, Text, View,Dimensions  } from 'react-native'
import React from 'react'
import SafeAreaWrapper from '@/components/shared/SafeAreaWrapper'
import { ProfileScreenNavigationType } from '@/navigations/types';
import { useNavigation } from '@react-navigation/native';
import NavigateBack from '@/components/shared/NavigateBack';
import { useTheme } from 'react-native-paper';
import Loader from '@/components/shared/Loader';


const { height } = Dimensions.get('window');

export default function SettingsScreen() {

  const navigation = useNavigation<ProfileScreenNavigationType>();

  const navigateToDarkMode = () => {
    navigation.navigate("DarkMode");
  };

  const navigateToDeleteAccount = () => {
    navigation.navigate("DeleteAccount");
  };
  const theme = useTheme();

  if (!theme) {
    return <Loader/>
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={[styles.header,{backgroundColor:theme.colors.outline}]}>
          <NavigateBack />
          <Text style={styles.title}>Settings</Text>
          <View style={{width:28}}/>
        </View>
        <View style={styles.body}>
          <TouchableOpacity onPress={navigateToDarkMode}>
            <Text style={{fontSize:18,fontWeight:'400',color:theme.colors.onBackground}}>Dark Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToDeleteAccount}>
            <Text style={{fontSize:18,fontWeight:'400',color:theme.colors.onBackground}}>Delete My account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
  )
}

const styles = StyleSheet.create({
  container:{
    padding:10,
    gap:50,
    height:height
  },
  title:{
    fontSize:32,
    fontWeight:'600',
  },
header:{
  display:'flex',
  justifyContent:'space-between',
  flexDirection:'row',
  alignItems:'center',
  paddingVertical:10
},
body:{
  gap:30
}
})