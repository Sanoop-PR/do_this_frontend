import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SafeAreaWrapper from '@/components/shared/SafeAreaWrapper'
import useSWR from 'swr'
import { fetcher } from '@/services/config'
import Loader from '@/components/shared/Loader'
import { ITask } from '@/types/Index'
import Task from '@/components/tasks/Task'
import { SkeletonHome } from './HomeScreen'
import { useTheme } from 'react-native-paper'

export default function CompletedScreen() {
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    mutate: mutateTasks,
  } = useSWR<ITask[]>(`tasks/completed`, fetcher, { refreshInterval: 100 })

  let theme = useTheme()

  if (!theme) {
    return <Loader />
  }

  return (
    <SafeAreaWrapper>
      {
        isLoadingTasks || tasks ?
          <View style={[styles.container, {}]}>
            <View style={styles.header}>
              <Text style={{ fontSize: 23, fontWeight: '500', color: theme.colors.onBackground }}>Completed</Text>
            </View>
            <FlatList
              data={tasks}
              renderItem={({ item }) => {
                return (
                  <Task task={item} mutateTasks={mutateTasks} />
                )
              }}
              ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
            />
          </View>
          :
          <SkeletonHome />
      }
    </SafeAreaWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    display: 'flex',
    gap: 10,
    height: '100%'
  },
  backBtn: {
    width: 25
  },
  header: {
    flexDirection: 'row',
    gap: 10
  },
  header_text: {
    fontSize: 30,
    fontWeight: '600'
  },

})