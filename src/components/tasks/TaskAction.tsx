import { FlatList, Pressable, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { ICategory, ITaskRequest } from "@/types/Index";
import useSWR, { mutate } from "swr";
import Loader from "../shared/Loader";
import axiosInstance, { fetcher } from "@/services/config";
import { Calendar } from "react-native-calendars";
import useSWRMutation from "swr/dist/mutation";
import { format, isToday } from "date-fns";
import Entypo from "react-native-vector-icons/Entypo";
import { useTheme } from "react-native-paper";

type TaskActionProps = {
  categoryId: string;
};

export const today = new Date();

const todayISODate = new Date();
todayISODate.setHours(5, 30, 0, 0)

const createTaskRequest = async (
  url: string,
  { arg }: { arg: ITaskRequest }
) => {
  try {
    const res = await axiosInstance.post(url, {
      ...arg,
    })
    return res.data
  } catch (error) {
    return error
  }
}

export default function TaskAction({ categoryId }: TaskActionProps) {

  const theme = useTheme()

  const [newTask, setnewTask] = useState<ITaskRequest>({
    categoryId: categoryId,
    date: todayISODate.toISOString(),
    name: "",
    isCompleted: false,
  });

  const { trigger,data } = useSWRMutation("tasks/create", createTaskRequest)

  // if (data) {
  //   ToastAndroid.showWithGravityAndOffset(
  //     data.message,
  //     ToastAndroid.LONG,
  //     ToastAndroid.TOP,
  //     25,
  //     50,
  //   );
  // }

  const [isSelectedCategory, setIsSelectedCategory] = useState<boolean>(false);
  const [isSelectedDate, setIsSelectedDate] = useState<boolean>(false);

  const { data: categories, isLoading, error } = useSWR<ICategory[]>(
    "categories",
    fetcher
  );

  // if (isLoading || !categories) {
  //   return <Loader />;
  // }

  const selectedCategory = categories?.find(
    (_category) => _category._id === newTask.categoryId
  );

  const onCreateTask = async () => {
    try {
      if (newTask.name =='') {
        ToastAndroid.showWithGravityAndOffset(
          'Enter Task',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50,
        );
      }else{
        await trigger({
          ...newTask,
        })
        setnewTask({
          categoryId: newTask.categoryId,
          isCompleted: false,
          date: todayISODate.toISOString(),
          name: "",
        })
        await mutate("tasks/")
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
  }

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.DT_container}>
          <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
            <TextInput
              placeholder="Create a new task"
              style={styles.input}
              textAlignVertical="center"
              value={newTask.name}
              onChangeText={(text) => {
                setnewTask((prev) => {
                  return {
                    ...prev,
                    name: text,
                  };
                });
              }}
            />
            <TouchableOpacity onPress={onCreateTask}>
              <Entypo name="plus" size={25}/>
            </TouchableOpacity>
          </View>
          <Pressable onPress={() => {
            setIsSelectedDate((prev) => !prev)
          }}>
            <View>
              <Text style={styles.DT_text}>
                {isToday(new Date(newTask.date))
                  ? "Today"
                  : format(new Date(newTask.date), "MMM dd")}
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              setIsSelectedCategory((prev) => !prev);
            }}
          >
            <View>
              <Text style={[{ color: selectedCategory?.color?.code }, styles.DT_text]}>
                {selectedCategory?.name}
              </Text>
            </View>
          </Pressable>

        </View>
        {
          isSelectedCategory && (
            <View style={styles.list}>
              <FlatList
                data={categories}
                renderItem={({ item, index }) => {
                  return (
                    <Pressable onPress={() => {
                      setnewTask((prev) => {
                        return {
                          ...prev, categoryId: item._id
                        }
                      })
                      setIsSelectedCategory(false)
                    }}>
                      <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 15 }}>
                        <Text>{item.icon.symbol}</Text>
                        <Text style={{ fontWeight: newTask.categoryId === item._id ? "700" : "400", fontSize: 18 }}>{item.name}</Text>
                      </View>
                    </Pressable>
                  )
                }} />
            </View>
          )
        }
      </View>
      {
        isSelectedDate && <Calendar
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
          minDate={todayISODate.toString()}
          onDayPress={(day) => {
            setIsSelectedDate(false)
            const selectedDate = new Date(day.dateString).toISOString()
            setnewTask((prev) => {
              return {
                ...prev,
                date: selectedDate,
              }
            })
          }}
        />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D8D9DA",
  },
  input: {
    // padding: 12,
    fontSize: 16,
    width: "90%",
  },
  task: {
    flexDirection: "row",
    alignItems: "center",
  },
  text_box: {
    flexDirection: "row",
    alignContent: "center",
    backgroundColor: "#fffff",
    padding: 2,
    borderRadius: 15,
  },
  list: {
    alignItems: 'center',
    height: '75%',
  },
  DT_container: {
    gap: 10,
    padding: 10
  },
  DT_text: {
    fontSize: 16,
    fontWeight: '500'
  }
});
