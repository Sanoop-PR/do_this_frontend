import { StyleSheet, Text, View, ToastAndroid, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthScreenNavigationType } from '@/navigations/types'
import SafeAreaWrapper from '@/components/shared/SafeAreaWrapper'
import Input from '@/components/shared/Input'
import ButtonComp from '@/components/shared/ButtonComp'
import { Controller, useForm } from 'react-hook-form'
import useUserGlobalStore from '@/store/useUserGlobalStore'
import { IUser } from '@/types/Index'
import { loginUser } from '@/services/api'
import { useTheme } from 'react-native-paper'
import Loader from '@/components/shared/Loader'

export default function SignInScreen() {
  let theme = useTheme()

  const navigation = useNavigation<AuthScreenNavigationType<"SignIn">>()
  const navigateToSignUpScreen = () => {
    navigation.navigate("SignUp")
  }

  const { updateUser } = useUserGlobalStore()
  const { control, handleSubmit, formState: { errors } } = useForm<Omit<IUser, "name">>({
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (data: Omit<IUser, "name">) => {
    try {
      const { email, password } = data
      const user = await loginUser({
        email: email,
        password: password
      })
      updateUser({
        email: user.email,
        name: user.name,
        id: user.id,
        ProfilePic: user.ProfilePic
      })
    } catch (error) {
      console.log(error)
      ToastAndroid.showWithGravityAndOffset(
        `${error}`,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50,
      );
    }
  }

  if (!theme) {
    return <Loader />
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={[styles.containerBorder, { borderColor: theme.colors.onBackground }]}>
          <Text style={[styles.heading, { color: theme.colors.onBackground }]}>SIGN IN</Text>
          {/* email */}
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label='Email'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email}
                maxLength={40}
              />
            )}
            name='email'
          />
          {/* password */}
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label='Password'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email}
              />
            )}
            name='password'
          />
          <ButtonComp styl={styles.signin} label="SIGN IN" onPress={handleSubmit(onSubmit)} />
          <TouchableOpacity onPress={navigateToSignUpScreen}>
            <Text style={{ color: theme.colors.onBackground }}>Sign Up ?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
  signin: {
    backgroundColor: '#8BE8E5',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 50,
    elevation: 10,
  },
  heading: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '700'
  },
  containerBorder: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    display: 'flex',
    gap: 20,
    borderWidth: 1,
    borderRadius: 20
  }
})

