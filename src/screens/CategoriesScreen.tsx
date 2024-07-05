import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import SafeAreaWrapper from "@/components/shared/SafeAreaWrapper";
import useSWR from "swr";
import { fetcher } from "@/services/config";
import Loader from "@/components/shared/Loader";
import { ICategory } from "../types/Index";
import Category from "@/components/categories/Category";
import CreateNewList from "@/components/categories/CreateNewList";
import { useTheme } from "react-native-paper";

export default function CategoriesScreen() {
  const { data, isLoading } = useSWR<ICategory[]>("categories/", fetcher,
    {
      refreshInterval: 100
    }
  );

  const renderItem = ({ item }: { item: ICategory }) => (
    <Category category={item} />
  );
  
  let theme = useTheme()

  if (!theme) {
    <Loader />
  }

  return (
    <SafeAreaWrapper>
      <View>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>Categories</Text>
      </View>
      {
        isLoading ?
          <SkeletonCategories />
          :
          <FlatList
            data={data}
            renderItem={renderItem}
            ItemSeparatorComponent={() =>
              <View style={styles.heightStyle} />
            }
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item._id}
          />
      }
      <CreateNewList />
    </SafeAreaWrapper>
  );
}

const SkeletonCategories = () => {
  return (
    <View style={{ gap: 10, padding: 10 }}>
      <View style={styles.skeleton_container} />
      <View style={styles.skeleton_container} />
      <View style={styles.skeleton_container} />
      <View style={styles.skeleton_container} />
      <View style={styles.skeleton_container} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  heightStyle: {
    height: 14,
  },
  renderItem: {
    flexDirection: "row",
  },
  title: {
    padding: 10,
    fontSize: 40,
    fontWeight: '600'
  },
  list: {
    display: "flex",
    flexDirection: 'row',
    gap: 14
  },
  skeleton_container: {
    height: 35,
    backgroundColor: '#adadad',
    borderRadius: 10,
  }
});
