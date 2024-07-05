import { ToastAndroid, StyleSheet, Text, View, TouchableOpacity, Animated, useColorScheme } from 'react-native'
import React, { useRef, useState } from 'react'
import { ICategory, ITask } from '@/types/Index'
import Ionicons from "react-native-vector-icons/Ionicons";
import useSWRMutation from 'swr/dist/mutation';
import axiosInstance, { fetcher } from '@/services/config';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationType } from '@/navigations/types';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import useSWR from 'swr';
import * as Animatable from 'react-native-animatable';
import { RectButton, Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';


type TaskProps = {
    task: ITask
    mutateTasks: () => Promise<ITask[] | undefined>
}

interface ITaskStatusRequest {
    id: string
    isCompleted: boolean
}

const deleteTaskRequest = async (
    url: string,
    { arg }: { arg: { id: string } }
  ) => {
    try {
      await axiosInstance.delete(url + "/" + arg.id);
    } catch (error) {
      return error
    }
};

const toggleTaskStatusRequest = async (url: string, { arg }: { arg: ITaskStatusRequest }) => {
    try {
        await axiosInstance.put(url + "/" + arg.id, {
            ...arg
        })
    } catch (error) {
        return error
    }
}

export default function Task({ task, mutateTasks }: TaskProps) {


    // Animation
    const [scaleValue] = useState(new Animated.Value(1));


    const animateIcon = () => {
        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 1.2,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(scaleValue, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    };


    const { trigger } = useSWRMutation("tasks/update", toggleTaskStatusRequest)

    const { trigger: triggerDelete } = useSWRMutation(
        "tasks/",
        deleteTaskRequest
      );
    const navigation = useNavigation<HomeScreenNavigationType>()

    const toggleTaskStatus = async () => {
        animateIcon();
        try {
            const _updatedTask = {
                id: task._id,
                isCompleted: !task.isCompleted
            }
            await trigger(_updatedTask)
            await mutateTasks()
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

    const deleteTask = async () => {
        try {
          await triggerDelete({
            id: task._id,
          });
        } catch (error) {
            ToastAndroid.showWithGravityAndOffset(
                'Something Went Wrong',
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                25,
                50,
              );
        }
      };

    const navigationToEditTask = () => {
        navigation.navigate("EditTask", {
            task
        })
    }

    const { data: category, isLoading } = useSWR<ICategory>(`categories/${task.categoryId}`, fetcher, { refreshInterval: 100 })


    // swipe 

    // close swipe
    const swipeableRef = useRef<Swipeable>(null);

    const close = () => {
        setTimeout(() => {
            swipeableRef.current?.close();
        }, 1500);
    };

    //swipe to right
    const renderRightActions = (dragX: { interpolate: (arg0: { inputRange: number[]; outputRange: number[]; }) => any; }) => {
        const trans = dragX.interpolate({
          inputRange: [0, 50, 100],
          outputRange: [0, 0.3, 1],
        });
        return (
            <TouchableOpacity style={styles.deleteButton} onPress={deleteTask}>
                <Animated.Text
                  style={{
                    color: '#ef233c',
                    paddingHorizontal: 10,
                    fontWeight: '600',
                    transform: [{ translateX: trans }],
                  }}>
                  <Ionicons name='trash-outline' size={25}/>
                </Animated.Text>
            </TouchableOpacity>
        );
    };

    let scheme = useTheme();


    return (
        <GestureHandlerRootView>
            <Swipeable ref={swipeableRef} renderRightActions={renderRightActions} onSwipeableOpen={close}>
                <View style={[styles.container, { borderColor: category?.color?.code,backgroundColor:scheme.colors.background}]}>
                    <View style={styles.box}>
                        <TouchableOpacity onPress={toggleTaskStatus} activeOpacity={0.7}>
                            <Animatable.View style={{ transform: [{ scale: scaleValue }] }}>
                                <Ionicons name='checkbox' style={{ color: task.isCompleted ? '#70e000' : '#adb5bd', fontSize: 20, }} />
                            </Animatable.View>
                        </TouchableOpacity>
                        <View style={{ width: '81%' }}>
                            <Text style={[styles.category,{color:scheme.colors.onBackground}]}>{category?.name}</Text>
                            <Text style={[styles.name,{color:scheme.colors.onBackground}]}>{task.name}</Text>
                        </View>
                        <TouchableOpacity onPress={navigationToEditTask}>
                            <MaterialCommunityIcons name='dots-vertical' size={20} style={{color:scheme.colors.onBackground}} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Swipeable>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderBottomWidth: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    name: {
        fontSize: 16,
        // flexWrap:'',
        // width:200
    },
    category: {
        fontSize: 16,
        fontWeight: '800'
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
      },
})