import { StyleSheet, View,ActivityIndicator } from 'react-native'
import React from 'react'
import SafeAreaWrapper from './SafeAreaWrapper'


export default function Loader() {
  return (
    <SafeAreaWrapper>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
    </SafeAreaWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})