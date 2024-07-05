import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthScreenNavigationType } from '@/navigations/types'
import SafeAreaWrapper from '@/components/shared/SafeAreaWrapper'
import Input from '@/components/shared/Input'
import ButtonComp from '@/components/shared/ButtonComp'
import { Controller, useForm } from 'react-hook-form'
import { IUser } from '@/types/Index'
import { registerUser } from '@/services/api'
import { useTheme } from 'react-native-paper'
import Loader from '@/components/shared/Loader'

export default function SignUpScreen() {
  let theme = useTheme()

  const navigation = useNavigation<AuthScreenNavigationType<"SignUp">>()
  const navigateToSignInScreen = () => {
    navigation.navigate("SignIn")
  }

  const { control, handleSubmit, formState: { errors } } = useForm<IUser>({
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  })

  const onSubmit = async (data: IUser) => {
    try {
      const { name, email, password } = data
      await registerUser({
        name, email, password
      })
      navigateToSignInScreen()
    } catch (error) {
      console.log(error)
    }
  }

  if (!theme) {
    return <Loader />
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={[styles.containerBorder, { borderColor: theme.colors.onBackground }]}>
          <Text style={[styles.heading, { color: theme.colors.onBackground }]}>SIGN UP</Text>
          {/* username */}
          <Controller
            control={control}
            rules={{ required: 'You must enter your name', min: 3 }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label='Name'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.name} />
            )}
            name='name'
          />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
          {/* email */}
          <Controller
            control={control}
            rules={{ required: 'You must enter your email', pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email address' } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label='Email'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email} />
            )}
            name='email'
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          {/* password */}
          <Controller
            control={control}
            rules={{ required: 'You must enter your password' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input label='Password'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password}

              />
            )}
            name='password'
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          <ButtonComp styl={styles.signin} label="SIGN UP" onPress={handleSubmit(onSubmit)} />
          <TouchableOpacity onPress={navigateToSignInScreen}>
            <Text style={{ color: theme.colors.onBackground }}>Sign In ?</Text>
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
    borderRadius: 20,
  },
  errorText: {
    color: 'red',
  },
})