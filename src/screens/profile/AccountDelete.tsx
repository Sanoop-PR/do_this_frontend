import { Modal, Pressable, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import SafeAreaWrapper from '@/components/shared/SafeAreaWrapper'
import NavigateBack from '@/components/shared/NavigateBack'
import { useTheme } from 'react-native-paper'
import Loader from '@/components/shared/Loader'
import ButtonComp from '@/components/shared/ButtonComp'
import AntDesign from 'react-native-vector-icons/AntDesign'
import useUserGlobalStore from '@/store/useUserGlobalStore'
import Input from '@/components/shared/Input'
import axiosInstance from '@/services/config'
import useSWRMutation from 'swr/dist/mutation'

type deleteAccType = {
  id: string
  password: string
}

const deleteAccRequest = async (url:string,{arg}:{arg:deleteAccType})=>{
try {
  const response = await axiosInstance.put(url,{...arg})
  return response.data
} catch (error) {
  console.log(error)
  return error
}
}

const AccountDelete = () => {
  let theme = useTheme()
  const [modalVisible, setModalVisible] = useState(false);
  const { user,updateUser } = useUserGlobalStore()

  const [conformPassword, setConformPassword] = useState<deleteAccType>({
    id: user?.id ?? '',
    password: ''
  })

  const {trigger,isMutating,data} = useSWRMutation('users/delete_account',deleteAccRequest)

  if (data) {
    ToastAndroid.showWithGravityAndOffset(
      data.message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      25,
      50,
    );
  }

  function modalOpen() {
    if (conformPassword.password=='') {
      ToastAndroid.showWithGravityAndOffset(
        'Enter Password',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50,
      );
    } else {
      setModalVisible(true)
    }
  }

  const deleteAcc = async ()=>{
    try {
     await trigger({...conformPassword})
     updateUser(null)
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  
  if (!theme) {
    return <Loader />
  }
  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={[styles.header, { backgroundColor: theme.colors.outline }]}>
          <NavigateBack />
          <Text style={styles.title}>
            Delete Account
          </Text>
          <View style={{ width: 28 }} />
        </View>
        <View>
          <Input label='enter password' value={conformPassword.password} onChangeText={(text)=>{
            setConformPassword((prev)=>{
              return{
                ...prev,
                password:text
              }
            })
          }} />
        </View>
      </View>
      <View style={styles.btnCont}>
        <ButtonComp label='Continue' onPress={modalOpen} styl={[styles.button,{backgroundColor:'#ffd500'}]} stylText={styles.btntxt} />
      </View>
      <Modal animationType="fade"
        transparent={true}
        visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: theme.colors.surface, borderColor: theme.colors.onBackground }]}>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}><AntDesign name="closecircleo" size={20} style={{ color: theme.colors.onBackground }} /></TouchableOpacity>
            <View style={styles.model_icons}>
              <Text style={{color: theme.colors.onBackground}}>
                When you delete your DoThis Account, you won't be able to retrieve the data
              </Text>
              <ButtonComp label='Continue' onPress={deleteAcc} styl={[styles.button,{backgroundColor:'#0096c7'}]} stylText={styles.btntxt} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaWrapper>
  )
}

export default AccountDelete

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
  textinput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 20,
    backgroundColor: '#ffffff'
  },
  button: {
    // backgroundColor: '#ffd500',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 50,
  },
  btntxt: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700'
  },
  btnCont: {
    width: '100%',
    position: "absolute",
    bottom: 20,
    padding: 10
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    width: 200,
    height: 150
  },
  model_icons: {
    gap:10
  },
  model_icon: {
    fontSize: 30
  }

})