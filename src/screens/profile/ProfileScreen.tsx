import { Image, StyleSheet, Text, View, Modal, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import SafeAreaWrapper from "@/components/shared/SafeAreaWrapper";
import { useNavigation } from "@react-navigation/native";
import { ProfileScreenNavigationType } from "@/navigations/types";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import useUserGlobalStore from "@/store/useUserGlobalStore";
import useSWR from "swr";
import { ITask } from "@/types/Index";
import axiosInstance, { BASE_URL, fetcher } from "@/services/config";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from 'expo-image-picker';
import useSWRMutation from "swr/dist/mutation";
import Loader from "@/components/shared/Loader";
import { useTheme } from "react-native-paper";
import ButtonComp from "@/components/shared/ButtonComp";

type changePicType = {
    id: string,
    profilePicture: string
}

const updateProfilePicRequest = async (url: string, { arg }: { arg: changePicType }) => {

    const formData = new FormData();
    formData.append('profilePicture', {
        uri: arg.profilePicture,
        name: `photo.jpg`,
        type: `image/jpg`,
    } as any);
    formData.append('id', arg.id);

    try {
        const response = await axiosInstance.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

const removeProfilePicReqest = async (url:string,{arg}:{arg:string})=>{
    try {
        const response = await axiosInstance.post(url,{arg})
        return response.data
    } catch (error) {
        return error
    }
}

export default function ProfileScreen() {

    const { user, updateUser } = useUserGlobalStore()
    // modal open / close state
    const [modalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation<ProfileScreenNavigationType>();
    
    const [profileData, setProfileData] = useState<changePicType>({
        id: user?.id || '',
        profilePicture: user?.ProfilePic || '',
    })

    const { data: tasks } = useSWR<ITask[]>("tasks/", fetcher, { refreshInterval: 100 })

    const { data: completed, } = useSWR<ITask[]>(`tasks/completed`, fetcher, { refreshInterval: 100 })

    const { data: userData } = useSWR<any>(`users/getUser/${user?.id}`, fetcher, { refreshInterval: 100 })

    const { trigger: uploadTrigger, isMutating } = useSWRMutation('users/update_profilepic', updateProfilePicRequest)
    
    const {trigger:removePicTrigger,isMutating:removePicMutating} = useSWRMutation('users/remove_profilepic',removeProfilePicReqest)

    // navigations
    const navigateToProfileSetting = () => {
        navigation.navigate('Setting');
    };
    const navigateToChangeName = () => {
        navigation.navigate("ChangeName");
    };
    const navigateToChangePassword = () => {
        navigation.navigate("ChangePassword");
    };

    const uploadProfilePicture = async () => {
        try {
            await uploadTrigger(profileData)
            setModalVisible(!modalVisible)
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

    const pickImage = async () => {
        let result: any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setProfileData({ profilePicture: result.assets[0].uri, id: user?.id || '' });
        }
    };

    const takePhoto = async () => {
        let result: any = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setProfileData({ profilePicture: result.assets[0].uri, id: user?.id || '' });
        }
    }

    const removePhoto = async()=>{
        try {
            await removePicTrigger(user?.id??'');
        } catch (error) {
            console.log(error)
        }
    }

    function logOut() {
        updateUser(null)
    }

    const theme = useTheme();

    if (!tasks || !completed || !theme || !userData || removePicMutating || isMutating) {
        return <Loader />
    }

    return (
        <SafeAreaWrapper>
            <View style={styles.container}>
                {/* header */}
                <View style={styles.header}>
                    <Text style={[styles.name, { color: theme.colors.onBackground }]}>Profile</Text>
                    <View style={styles.image_container}>
                        <Image
                            source={{ uri: `${BASE_URL}/images/${userData.profilePicture}` }}
                            style={[styles.image, {borderColor: theme.colors.onBackground}]}
                        />
                        <View style={styles.image_icon}><TouchableOpacity onPress={() => setModalVisible(!modalVisible)}><AntDesign name="pluscircleo" size={20} /></TouchableOpacity></View>
                    </View>
                    {/* email and username */}
                    <Text style={[styles.name, { color: theme.colors.onBackground }]}>{userData.name}</Text>
                    <Text style={{ fontSize: 16, color: theme.colors.onBackground }}>{userData.email}</Text>
                </View>
                {/* task box */}
                <View style={styles.taskBox}>
                    <View style={[styles.taskBoxs, { backgroundColor: theme.colors.outline }]}>
                        <Text>{tasks?.length - completed?.length} task left</Text>
                    </View>
                    <View style={[styles.taskBoxs, { backgroundColor: theme.colors.outline }]}>
                        <Text>{completed?.length} task Completed</Text>
                    </View>
                </View>
                <View style={styles.account}>
                    <TouchableOpacity onPress={navigateToProfileSetting}>
                        <Text style={[styles.setting, { color: theme.colors.onBackground }]}>
                            <Ionicons name="settings-outline" size={18} /> Setting
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigateToChangeName}>
                        <Text style={[styles.setting, { color: theme.colors.onBackground }]}>
                            <Feather name="user" size={18} /> Change Name
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigateToChangePassword}>
                        <Text style={[styles.setting, { color: theme.colors.onBackground }]}>
                            <Ionicons name="key-outline" size={18} /> Change Password
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logOut}>
                        <Text style={styles.logOut}>
                            <Ionicons name="log-out-outline" size={20} /> sign out
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { backgroundColor: theme.colors.surface, borderColor: theme.colors.onBackground }]}>
                        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}><AntDesign name="closecircleo" size={20} style={{ color: theme.colors.onBackground }} /></TouchableOpacity>
                        <View style={styles.model_icons}>
                            <TouchableOpacity onPress={pickImage}>
                                <MaterialCommunityIcons name="image-outline" style={[styles.model_icon, { color: theme.colors.onBackground }]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={takePhoto}>
                                <MaterialCommunityIcons name="camera-outline" style={[styles.model_icon, { color: theme.colors.onBackground }]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={removePhoto}><MaterialCommunityIcons name="image-remove" style={[styles.model_icon, { color: theme.colors.onBackground }]} /></TouchableOpacity>
                        </View>
                        <View style={styles.btnCont}>
                            <ButtonComp label='Save' onPress={uploadProfilePicture} styl={styles.button} stylText={styles.btntxt} disabled={isMutating ? true : false} />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        height: '100%'
    },
    header: {
        alignItems: "center",
        gap: 15
    },
    image: {
        width: 130,
        height: 130,
        borderRadius: 20,
        borderWidth: 1,
    },
    image_container: {
        position: 'relative'
    },
    image_icon: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#ffff',
        borderRadius: 50,
        borderColor: 'black'
    },
    name: {
        fontSize: 32,
        textTransform: 'uppercase'
    },
    setting: {
        fontSize: 18
    },
    logOut: {
        fontSize: 18,
        color: '#FF0000'
    },
    account: {
        display: 'flex',
        flexDirection: 'column',
        gap: 15,
        borderTopWidth: 1,
        paddingTop: 15
    },
    taskBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15
    },
    taskBoxs: {
        width: '48%',
        paddingVertical: 10,
        alignItems: 'center'
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
        width: 180,
        height: 200
    },
    model_icons: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1
    },
    model_icon: {
        fontSize: 30
    },
    btnCont: {
        width: '100%',
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
});
