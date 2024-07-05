import { FlatList, StyleSheet, Text, View, useColorScheme } from 'react-native'
import React from 'react'
import SafeAreaWrapper from '@/components/shared/SafeAreaWrapper'
import useSWR from 'swr'
import { fetcher } from '@/services/config'
import Loader from '@/components/shared/Loader'
import { ITask } from '@/types/Index'
import Task from '@/components/tasks/Task'
import { SkeletonHome } from './HomeScreen'
import { useTheme } from 'react-native-paper'

export default function TodayScreen() {
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    mutate: mutateTasks
  } = useSWR<ITask[]>(`tasks/today`, fetcher, { refreshInterval: 100 })

  let scheme = useTheme();

  if (!tasks || !scheme) {
    return <SafeAreaWrapper><SkeletonHome /></SafeAreaWrapper>
  }

  return (
    <SafeAreaWrapper>
      {
        isLoadingTasks ?
          <SkeletonHome />
          :
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: scheme.colors.onBackground }]}>Today</Text>
            </View>
            {
              tasks.length == 0 ?
                <View style={styles.textCenter}>
                  <Text style={{ color: scheme.colors.onBackground }}>No Task</Text>
                </View>
                :
                <FlatList
                  data={tasks}
                  renderItem={({ item }) => {
                    return (
                      <Task task={item} mutateTasks={mutateTasks} />
                    )
                  }}
                  ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
                />
            }
          </View>
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
  title: {
    fontSize: 24
  },
  textCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
})