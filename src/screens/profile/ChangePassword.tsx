import { StyleSheet, Text, View, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import SafeAreaWrapper from '@/components/shared/SafeAreaWrapper'
import ButtonComp from '@/components/shared/ButtonComp'
import NavigateBack from '@/components/shared/NavigateBack'
import useUserGlobalStore from '@/store/useUserGlobalStore'
import { useNavigation } from '@react-navigation/native'
import { useSWRConfig } from 'swr'
import axiosInstance from '@/services/config'
import useSWRMutation from 'swr/dist/mutation'
import Loader from '@/components/shared/Loader'
import { useTheme } from 'react-native-paper'
import Input from '@/components/shared/Input'

type changePswdType = {
  id: string
  oldPassword: string
  newPassword: string
}

const updatePswdRequest = async (url: string, { arg }: { arg: changePswdType }) => {
  try {
    const response = await axiosInstance.put(url, { ...arg })
    return response.data;
  } catch (error) {
    return error
  }
}

export default function ChangePassword() {

  const { user } = useUserGlobalStore()
  const navigation = useNavigation()
  const { mutate } = useSWRConfig();
  let theme = useTheme()

  const [userPassword, setUserPassword] = useState<changePswdType>({
    id: user?.id ?? '',
    oldPassword: '',
    newPassword: ''
  })
  const [conformPswd, setconformPswd] = useState('')

  const { trigger, isMutating, data } = useSWRMutation('users/update_password', updatePswdRequest)

  if (data) {
    ToastAndroid.showWithGravityAndOffset(
      data.message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      25,
      50,
    );
  }

  const updatePassword = async () => {
    if (userPassword.newPassword === conformPswd) {
      try {
        await trigger({ ...userPassword })
        await mutate('Profile')
        navigation.goBack()
      } catch (error) {
        console.log(error)
        throw error
      }
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'Wrong Password',
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
        <View style={styles.header}>
          <NavigateBack />
          <Text style={styles.title}>Change Password</Text>
          <View style={{ width: 28 }} />
        </View>
        <Input label='Current Password' value={userPassword.oldPassword} onChangeText={(text) => {
          setUserPassword((prev) => {
            return {
              ...prev,
              oldPassword: text
            }
          })
        }} editable={isMutating ? false : true} />
        <Input label='New Password' value={userPassword.newPassword} onChangeText={(text) => {
          setUserPassword((prev) => {
            return {
              ...prev,
              newPassword: text
            }
          })
        }} editable={isMutating ? false : true} />
        <Input label='Conform Password' value={conformPswd} onChangeText={(text) => setconformPswd(text)} editable={isMutating ? false : true} />
      </View>
      {
        isMutating &&
        <Loader />
      }
      <View style={styles.btnCont}>
        <ButtonComp label='Save' onPress={updatePassword} styl={styles.button} stylText={styles.btntxt} disabled={isMutating ? true : false} />
      </View>
    </SafeAreaWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 20
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  textinput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 20,
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
  },
  btnCont: {
    width: '100%',
    position: "absolute",
    bottom: 20,
    padding: 10
  },
  button: {
    backgroundColor: '#ffd500',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 50,
  },
  btntxt: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700'
  }
})