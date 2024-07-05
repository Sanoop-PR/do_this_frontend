import { StyleSheet, Text, View, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import SafeAreaWrapper from '@/components/shared/SafeAreaWrapper'
import ButtonComp from '@/components/shared/ButtonComp'
import NavigateBack from '@/components/shared/NavigateBack'
import useUserGlobalStore from '@/store/useUserGlobalStore'
import axiosInstance from '@/services/config'
import useSWRMutation from 'swr/dist/mutation'
import { IAuthenticatedUser } from '@/types/Index'
import { useNavigation } from '@react-navigation/native'
import { useSWRConfig } from 'swr'
import Loader from '@/components/shared/Loader'
import { useTheme } from 'react-native-paper'
import Input from '@/components/shared/Input'


const updateNameRequest = async (url: string, { arg }: { arg: Omit<IAuthenticatedUser, 'email'> }) => {
  try {
    const response = await axiosInstance.put(url, { ...arg })
    return response.data;
  } catch (error) {
    console.log(error)
    return error
  }
}

export default function ChangeName() {
  const { user, updateUser } = useUserGlobalStore()
  const navigation = useNavigation()
  const { mutate } = useSWRConfig();
  let theme = useTheme()

  const [userName, setUserName] = useState<Omit<IAuthenticatedUser, 'email'>>({
    id: user?.id ?? '',
    name: user?.name ?? ''
  })

  const { trigger, isMutating,data } = useSWRMutation('users/update_name', updateNameRequest)

  if (data) {
    ToastAndroid.showWithGravityAndOffset(
      data.message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      25,
      50,
    );
  }
  
  const updateName = async () => {
    try {
      await trigger({ ...userName })
      updateUser({
        name: userName.name,
        email: user?.email ?? '',
        id: user?.id ?? ''
      })
      await mutate('Profile')
      navigation.goBack()
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(
        'Something Went Wrong',
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
          <Text style={styles.title}>Change Name</Text>
          <View style={{ width: 28 }} />
        </View>
        <Input label='name' value={userName?.name} onChangeText={(text) => {
          setUserName((prev) => {
            return {
              ...prev,
              name: text
            }
          })
        }}
          editable={isMutating ? false : true}
        />
      </View>
      {
        isMutating &&
        <Loader />
      }
      <View style={styles.btnCont}>
        <ButtonComp label='Save' onPress={updateName} styl={styles.button} stylText={styles.btntxt} disabled={isMutating ? true : false} />
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