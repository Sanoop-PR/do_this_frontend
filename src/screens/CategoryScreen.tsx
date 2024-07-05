import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SafeAreaWrapper from '@/components/shared/SafeAreaWrapper'
import useSWR from 'swr'
import { RouteProp, useRoute } from '@react-navigation/native'
import { CategoriesStackParamList } from '@/navigations/types'
import { fetcher } from '@/services/config'
import Loader from '@/components/shared/Loader'
import { ICategory, ITask } from '@/types/Index'
import NavigateBack from '@/components/shared/NavigateBack'
import TaskAction from '@/components/tasks/TaskAction'
import Task from '@/components/tasks/Task'

type CategoryScreenRouteProp = RouteProp<CategoriesStackParamList, "Category">

export default function CategoryScreen() {

  const route = useRoute<CategoryScreenRouteProp>()

  const { id } = route.params

  const { data: category, isLoading: isLoadingCategory } = useSWR<ICategory>(`categories/${id}`, fetcher, { refreshInterval: 100 })

  const { data: tasks, isLoading: isLoadingTasks, mutate: mutateTasks, } = useSWR<ITask[]>(`tasks/task-by-categories/${id}`, fetcher,
    {
      refreshInterval: 100
    }
  )

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <NavigateBack />
        {
          isLoadingCategory ?
            <View style={styles.skeleton_title} />
            :
            <View style={styles.header}>
              <Text style={styles.header_text}>{category?.icon?.symbol}</Text>
              <Text style={[styles.header_text, { color: category?.color?.code }]}>{category?.name}</Text>
            </View>
        }
        <TaskAction categoryId={id} />
        {
          isLoadingTasks ?
            <SkeletonCategory />
            :
            <FlatList
              data={tasks}
              renderItem={({ item }) => {
                return (
                  <Task task={item} mutateTasks={mutateTasks} />
                )
              }}
              ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item._id}
            />
        }
      </View>
    </SafeAreaWrapper>
  )
}

const SkeletonCategory = () => {
  return (
    <View style={{ gap: 10 }}>
      <View style={styles.Skeleton_home}>
        <View style={[styles.Skeleton_name, { width: 100 }]} />
        <View style={[styles.Skeleton_name, { width: 200 }]} />
      </View>
      <View style={styles.Skeleton_home}>
        <View style={[styles.Skeleton_name, { width: 100 }]} />
        <View style={[styles.Skeleton_name, { width: 200 }]} />
      </View>
      <View style={styles.Skeleton_home}>
        <View style={[styles.Skeleton_name, { width: 100 }]} />
        <View style={[styles.Skeleton_name, { width: 200 }]} />
      </View>
    </View>
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
  },
  skeleton_title: {
    height: 30,
    backgroundColor: "#adadad",
    borderRadius: 5
  }
})