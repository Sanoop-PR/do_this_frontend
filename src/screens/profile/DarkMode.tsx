import { Appearance, StyleSheet, Text, View, ColorSchemeName, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import SafeAreaWrapper from '@/components/shared/SafeAreaWrapper'
import NavigateBack from '@/components/shared/NavigateBack'
import { useTheme } from 'react-native-paper';

const DarkMode = () => {

  const [theme, setTheme] = useState<ColorSchemeName>(Appearance.getColorScheme());
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);


  const scheme = useTheme();

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={[styles.header, { backgroundColor: scheme.colors.outline }]}>
          <NavigateBack />
          <Text style={styles.title}>
            Dark Mode
          </Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={{ gap: 30 }}>
          <TouchableOpacity onPress={() => Appearance.setColorScheme('light')}>
            <View style={styles.list}>
              <Text style={[styles.text, { color: scheme.colors.onBackground }]}>Off</Text>
              <View style={[styles.radio_cicle, { borderColor: theme === 'light' ? '#38b000' : '#6c757d' }]}>
                <View style={[styles.radio_button, { backgroundColor: theme === 'light' ? '#38b000' : '#6c757d' }]}></View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Appearance.setColorScheme('dark')}>
            <View style={styles.list}>
              <Text style={[styles.text, { color: scheme.colors.onBackground }]}>On</Text>
              <View style={[styles.radio_cicle, { borderColor: theme === 'dark' ? '#38b000' : '#6c757d' }]}>
                <View style={[styles.radio_button, { backgroundColor: theme === 'dark' ? '#38b000' : '#6c757d' }]}></View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
  )
}

export default DarkMode

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 50,
    height: '100%'
  },
  title: {
    fontSize: 25,
    fontWeight: '500',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  text: {
    fontSize: 20,
    fontWeight: '400'
  },
  radio_cicle: {
    width: 20,
    height: 20,
    borderRadius: 50,
    borderWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  radio_button: {
    width: 10,
    height: 10,
    borderRadius: 50,
  }
})