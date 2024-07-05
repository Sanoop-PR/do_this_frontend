import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import React, { useState } from "react";
import SafeAreaWrapper from "@/components/shared/SafeAreaWrapper";
import NavigateBack from "@/components/shared/NavigateBack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { HomeStackParamsList } from "@/navigations/types";
import useSWRMutation from "swr/dist/mutation";
import useSWR, { useSWRConfig } from "swr";
import axiosInstance, { fetcher } from "@/services/config";
import { ICategory, ITask } from "@/types/Index";
import Loader from "@/components/shared/Loader";
import { Calendar } from "react-native-calendars";
import ButtonComp from "@/components/shared/ButtonComp";
import { format, isToday } from "date-fns";
import { useTheme } from "react-native-paper";

type EditTaskRouteType = RouteProp<HomeStackParamsList, "EditTask">;

const todayISODate = new Date();
todayISODate.setHours(5, 30, 0, 0)
const today = new Date()

const updateTaskRequest = async (url: string, { arg }: { arg: ITask }) => {
  try {
    await axiosInstance.put(url + "/" + arg._id, {
      ...arg,
    });
  } catch (error) {
    return error
  }
};

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

export default function EditTaskScreen() {
  const route = useRoute<EditTaskRouteType>();

  const navigation = useNavigation();

  let theme = useTheme()

  const { trigger, isMutating } = useSWRMutation("tasks/edit", updateTaskRequest);
  const { trigger: triggerDelete } = useSWRMutation(
    "tasks/",
    deleteTaskRequest
  );

  const { task } = route.params;
  const [updatedTask, setupdatedTask] = useState(task);

  const { mutate } = useSWRConfig();

  const [isSelectingCategory, setIsSelectingCategory] =
    useState<boolean>(false);
  const [isSelectingDate, setIsSelectingDate] = useState<boolean>(false);

  const { data: categories, isLoading } = useSWR<ICategory[]>(
    "categories",
    fetcher
  );
  const deleteTask = async () => {
    try {
      await triggerDelete({
        id: task._id,
      });
      await mutate("tasks");
      navigation.goBack();
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

  const updateTask = async () => {
    if (updatedTask.name == '') {
      return (
        ToastAndroid.showWithGravityAndOffset(
          'Enter something',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50,
        )
      )
    }
    try {
      if (updateTask.name.length.toString().trim().length > 0) {
        await trigger({ ...updatedTask });
        await mutate("tasks");
        navigation.goBack();
      }
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

  if (!theme) {
    return <Loader />;
  }
  // if (isMutating) {
  //   return <Loader />;
  // }

  const selectedCategory = categories?.find(
    (_category) => _category._id === updatedTask.categoryId
  );

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={styles.inner_container}>
          <NavigateBack />
          <Pressable onPress={deleteTask} disabled={isMutating ? true : false}>
            <MaterialCommunityIcons name="delete-forever" style={styles.deleteIcon} />
          </Pressable>
        </View>
        <View style={{ gap: 30 }}>
          <TextInput
            placeholder="Create a new task"
            style={[styles.input, { color: theme.colors.onBackground, borderColor: theme.colors.onBackground }]}
            textAlignVertical="center"
            value={updatedTask.name}
            onChangeText={(text) => {
              setupdatedTask((prev) => {
                return {
                  ...prev,
                  name: text,
                };
              });
            }}
            onSubmitEditing={updateTask}
            editable={isMutating ? false : true}
          />
          {
            isLoading ?
              <SkeletonEditTask />
              :
              <View style={{ gap: 20 }}>
                <Pressable
                  onPress={() => {
                    setIsSelectingCategory((prev) => !prev);
                  }}
                  disabled={isMutating ? true : false}
                >
                  <View>
                    <Text style={{ color: selectedCategory?.color?.code, fontSize: 24, textTransform: 'uppercase' }}>
                      {selectedCategory?.name}
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setIsSelectingDate((prev) => !prev);
                  }}
                  disabled={isMutating ? true : false}
                >
                  <View>
                    <Text style={{ fontSize: 24, color: theme.colors.onBackground }}>
                      {isToday(new Date(updatedTask.date))
                        ? "Today"
                        : format(new Date(updatedTask.date), "MMM dd")}
                    </Text>
                  </View>
                </Pressable>
              </View>
          }
          {isSelectingCategory && (
            <View style={styles.list}>
              <FlatList
                data={categories}
                renderItem={({ item, index }) => {
                  return (
                    <Pressable
                      onPress={() => {
                        setupdatedTask((prev) => {
                          return {
                            ...prev,
                            categoryId: item._id,
                          };
                        });
                        setIsSelectingCategory(false);
                      }}
                    >
                      <View style={styles.list_item}>
                        <Text>{item.icon.symbol}</Text>
                        <Text
                          style={{
                            fontWeight:
                              updatedTask.categoryId === item._id
                                ? "800"
                                : "400", textTransform: 'uppercase',
                                color:theme.colors.onBackground
                          }}
                        >
                          {item.name}
                        </Text>
                      </View>
                    </Pressable>
                  );
                }}
              />
            </View>
          )}
          {
            isSelectingDate && <Calendar
            style={{
              borderWidth: 1,
              borderColor: theme.colors.outline,
              height: 350,
            }}
            theme={{
              calendarBackground:theme.colors.background,
              todayTextColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
            }}
              minDate={Date()}
              onDayPress={(day) => {
                setIsSelectingDate(false)
                const selectedDate = new Date(day.dateString).toISOString()
                setupdatedTask((prev) => {
                  return {
                    ...prev,
                    date: selectedDate,
                  }
                })
              }}
            />
          }
        </View>
        {
          isMutating &&
          <Loader />
        }
      </View>
      <View style={styles.update_btn_Box}>
        <ButtonComp onPress={updateTask} label="UPDATE" styl={styles.update_btn} disabled={isMutating ? true : false} />
      </View>
    </SafeAreaWrapper>
  );
}

const SkeletonEditTask = () => {
  return (
    <View style={{ gap: 10 }}>
      <View style={styles.skeleton} />
      <View style={styles.skeleton} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 30,
    gap: 40,
  },
  inner_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deleteIcon: {
    fontSize: 22,
    color: "#ff0f35",
  },
  input: {
    padding: 12,
    fontSize: 16,
    borderWidth: 1
  },
  list: {
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderBottomWidth: 5,
    borderEndWidth: 5
  },
  list_item: {
    flexDirection: "row",
    paddingVertical: 10,
    gap: 20,
    borderBottomWidth: 1
  },
  update_btn_Box: {
    position: 'absolute',
    bottom: 20,
    width: "100%",
    paddingHorizontal: 10
  },
  update_btn: {
    backgroundColor: '#F0DE36',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 50,
    elevation: 10,
  },
  skeleton: {
    height: 30,
    borderRadius: 15,
    backgroundColor: "#adadad",
  }
});
