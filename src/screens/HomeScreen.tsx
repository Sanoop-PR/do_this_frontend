import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import SafeAreaWrapper from '@/components/shared/SafeAreaWrapper'
import useSWR from 'swr'
import { fetcher } from '@/services/config'
import useUserGlobalStore from '@/store/useUserGlobalStore'
import { ITask } from '@/types/Index'
import Loader from '@/components/shared/Loader'
import Task from '@/components/tasks/Task'
import { format } from 'date-fns'
import { useTheme } from 'react-native-paper'

const today = new Date()

export default function HomeScreen() {

  const { user } = useUserGlobalStore()

  const {
    data: tasks,
    isLoading,
    mutate: mutateTasks,
  } = useSWR<ITask[]>("tasks/", fetcher, { refreshInterval: 100 })

  let theme = useTheme()

  if (!tasks || !theme) {
    return <SafeAreaWrapper><SkeletonHome /></SafeAreaWrapper>
  }

  return (
    <SafeAreaWrapper>
      {
        isLoading ?
          <SkeletonHome />
          :
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={[styles.name, { color: theme.colors.onBackground }]}>Hello {user?.name}</Text>
              <Text style={{ color: theme.colors.onBackground }}>
                It’s {format(today, "eeee, LLL dd")} - {tasks.length} tasks
              </Text>
            </View>
            <FlatList
              data={tasks}
              renderItem={({ item }) => (
                <Task task={item} mutateTasks={mutateTasks} />
              )}
              ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item._id}
            />
          </View>
      }
    </SafeAreaWrapper>
  )
}


export const SkeletonHome = () => {
  return (
    <View style={{ gap: 15, padding: 10 }}>
      <View style={{ gap: 10 }}>
        <View style={[styles.Skeleton_name, { width: 110 }]}></View>
        <View style={[styles.Skeleton_name, { width: 210 }]}></View>
      </View>
      <View style={styles.Skeleton_home}>
        <View style={[styles.Skeleton_name, { width: 100 }]}></View>
        <View style={[styles.Skeleton_name, { width: 200 }]}></View>
      </View>
      <View style={styles.Skeleton_home}>
        <View style={[styles.Skeleton_name, { width: 100 }]}></View>
        <View style={[styles.Skeleton_name, { width: 200 }]}></View>
      </View>
      <View style={styles.Skeleton_home}>
        <View style={[styles.Skeleton_name, { width: 100 }]}></View>
        <View style={[styles.Skeleton_name, { width: 200 }]}></View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 10
  },
  name: {
    textTransform: 'capitalize',
    fontSize: 24,
    fontWeight: '600'
  },
  header: {
    paddingBottom: 10
  },
  Skeleton_home: {
    borderColor: '#adadad',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderBottomWidth: 5,
    gap: 10,
  },
  Skeleton_name: {
    backgroundColor: "#adadad",
    height: 16,
    borderRadius: 5
  }
})