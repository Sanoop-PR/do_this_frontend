import React, { ReactNode } from 'react'
import { useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

type SafeAreaWrapperProps = {
    children : ReactNode
}

export default function SafeAreaWrapper({children}:SafeAreaWrapperProps) {
let theme = useTheme()
  return (
    <SafeAreaView style={{flex:1,backgroundColor:theme.colors.background}}>
      {children}
    </SafeAreaView>
  )
}
