import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ICategory } from '@/types/Index'
import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation } from '@react-navigation/native';
import { CategoriesNavigationType } from '@/navigations/types';

type CategoryProps = {
  category: ICategory
}

export default function Category({category}:CategoryProps) {

  const navigation = useNavigation<CategoriesNavigationType>()

  const navigationToCreateCategory = () =>{
    navigation.navigate("CreateCategory",{
      category:category
    })
  }
  
  const navigationToCategoryScreen = () =>{
    navigation.navigate("Category",{
      id:category._id
    })
  }

  return (
    <Pressable onPress={navigationToCategoryScreen}>
      <View style={styles.list}>
        <View style={styles.listItem}>
          <Text>{category.icon.symbol}</Text>
          <Text>{category.name}</Text>
        </View>
        <Pressable onPress={navigationToCreateCategory}>
          <View style={{width:50,alignItems:'flex-end'}}><Entypo name='dots-three-vertical' style={styles.dots}/></View>
        </Pressable>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  list:{
    display:"flex",
    flexDirection:'row',
    justifyContent:'space-between',
    gap:14,
    backgroundColor:'#D8D9DA',
    padding:10,
    borderRadius:10,
    marginHorizontal:10
  },
  listItem:{
    display:'flex',
    flexDirection:'row',
    gap:5
  },
  dots:{
    fontSize:15
  }
})