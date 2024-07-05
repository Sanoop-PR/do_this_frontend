import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { CategoriesNavigationType } from '@/navigations/types'
import Entypo from "react-native-vector-icons/Entypo";


export default function CreateNewList() {

  const navigation = useNavigation<CategoriesNavigationType>()

  const navigateToCreateCategory = () => {
    navigation.navigate("CreateCategory", {})
  }

  return (
    <TouchableOpacity onPress={navigateToCreateCategory}>
      <View style={styles.container}>
        <Entypo name='plus' style={[styles.text,styles.icon]} />
        <Text>&nbsp;&nbsp;</Text>
        <Text style={styles.text}>Create New List</Text>
      </View>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#caf0f8',
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    borderWidth:1,
    borderColor:'#00509d'
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
    color: '#00509d',
  },
  icon: {
    backgroundColor: 'white',
    borderRadius:50
  }
})

