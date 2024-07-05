import { Pressable, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import React, { useState } from "react";
import SafeAreaWrapper from "@/components/shared/SafeAreaWrapper";
import NavigateBack from "@/components/shared/NavigateBack";
import { ICategory, IColor, IIcon } from "@/types/Index";
import { getColors, getIcons } from "@/utils/helpers";
import ButtonComp from "@/components/shared/ButtonComp";
import { ICategoryRequest } from '../types/Index'
import useSWRMutation from 'swr/mutation'
import axiosInstance, { BASE_URL } from "@/services/config";
import { useSWRConfig } from "swr";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { CategoriesStackParamList } from "@/navigations/types";
import Octicons from "react-native-vector-icons/Octicons";

const COLORS = getColors();
const ICONS = getIcons();

const DEFAULT_COLOR = COLORS[0];
const DEFAULT_ICON = ICONS[0];

const createCategoryRequest = async (url: string, { arg }: { arg: ICategoryRequest }) => {
  try {
    const res = await axiosInstance.post(url, {
      ...arg
    })
    return res.data
  } catch (error) {
    return error
  }
}

const updateCategoryRequest = async (url: string, { arg }: { arg: ICategoryRequest }) => {
  try {
    await axiosInstance.put(url, {
      ...arg
    })
  } catch (error) {
    return error
  }
}

const deleteCategoryRequest = async (url: string, { arg }: { arg: { id: string } }) => {
  try {
    await axiosInstance.delete(url + "/" + arg.id)
  } catch (error) {
    return error
  }
}

type CreateCategoryRouteTypes = RouteProp<
  CategoriesStackParamList,
  "CreateCategory"
>

export default function CreateCategoryScreen() {

  const navigation = useNavigation()
  const route = useRoute<CreateCategoryRouteTypes>()
  const isEditable = route.params.category ? true : false;

  const { trigger, data } = useSWRMutation('categories/create', createCategoryRequest)

  const { trigger: updateTrigger } = useSWRMutation("categories/update", updateCategoryRequest)

  const { trigger: deleteTrigger } = useSWRMutation("categories/delete", deleteCategoryRequest)

  const { mutate } = useSWRConfig()

  if (data) {
    ToastAndroid.showWithGravityAndOffset(
      data.message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      25,
      50,
    );
  }

  const [newCategory, setNewCategory] = useState<
    Omit<ICategory, "_id" | "user" | "isEditable">
  >({
    name: route.params.category?.name ?? "",
    color: route.params.category?.color ?? DEFAULT_COLOR,
    icon: route.params.category?.icon ?? DEFAULT_ICON,
  });
  
  const createNewCategory = async () => {
    try {
      if (isEditable) {
        const updateCategoryItem = {
          ...route.params.category,
          ...newCategory
        }
        await updateTrigger({
          ...updateCategoryItem
        })
        await mutate(BASE_URL + "categories")
        navigation.goBack()
      } else {
        await trigger({ ...newCategory, })
        navigation.goBack()
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

  const updateColor = (color: IColor) => {
    setNewCategory((prev) => {
      return {
        ...prev,
        color,
      };
    });
  };

  const updateIcon = (icon: IIcon) => {
    setNewCategory((prev) => {
      return {
        ...prev,
        icon
      }
    })
  }

  const deleteCategory = async () => {
    try {
      if (isEditable && route.params.category?._id)
        await deleteTrigger({
          id: route.params.category?._id
        })
      await mutate(BASE_URL + "categories")
      navigation.goBack()
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
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={styles.backBtn}>
          <NavigateBack />
          {isEditable && <Pressable onPress={deleteCategory}>
            <Octicons name="trash" style={styles.trash} />
          </Pressable>}
        </View>
        <View style={styles.textbox}>
          <TextInput
            style={styles.textfield}
            maxLength={36}
            placeholder="Create new list"
            placeholderTextColor={'#B4B4B8'}
            value={newCategory.name}
            onChangeText={(text) => {
              setNewCategory((prev) => {
                return {
                  ...prev,
                  name: text,
                };
              });
            }}
          />
        </View>
        <View style={styles.color}>
          <View style={styles.colorTextBox}>
            <Text
              style={[
                styles.colortext,
                { color: newCategory?.color?.code as any },
              ]}
            >
              colors
            </Text>
          </View>
          <View style={styles.colorContainer}>
            {COLORS.map((_color) => {
              return (
                <Pressable
                  key={_color.id}
                  onPress={() => {
                    updateColor(_color);
                  }}
                >
                  <View
                    style={[styles.colorBox, { backgroundColor: _color?.code }]}
                  ></View>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={styles.color}>
          <View style={styles.colorTextBox}>
            <Text
              style={[
                styles.colortext,
                { color: newCategory?.color?.code as any },
              ]}
            >
              {newCategory.icon.symbol}
            </Text>
          </View>
          <View style={styles.colorContainer}>
            {ICONS.map((icon) => {
              return (
                <Pressable
                  key={icon.id}
                  onPress={() => {
                    updateIcon(icon);
                  }}
                >
                  <View
                    style={styles.iconBox}
                  ><Text style={{ fontSize: 24 }}>{icon.symbol}</Text></View>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View>
          <ButtonComp
            label={isEditable ? "EDIT CATEGORY" : "CREATE NEW CATEGORY"}
            onPress={createNewCategory}
            styl={styles.button}
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 4,
    gap: 10,
    padding: 10
  },
  create1: {
    height: 16,
  },
  backBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textbox: {
    backgroundColor: "#e1e4e8",
  },
  textfield: {
    fontSize: 20,
    lineHeight: 26,
    padding: 16,
    borderWidth: 1
  },
  color: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#ddeeed",
    borderWidth: 1
  },
  colorTextBox: {
    backgroundColor: "#ffffff",
    width: 80,
    padding: 2,
    marginBottom: 4,
    borderRadius: 10,
    alignItems: "center",
  },
  colortext: {
    fontWeight: "600",
    fontSize: 18
  },
  colorContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  colorBox: {
    width: 24,
    height: 24,
    borderRadius: 50,
  },
  iconBox: {
    width: 24,
    height: 30,
    borderRadius: 50,
  },
  button: {
    backgroundColor: '#F0DE36',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 50,
    elevation: 10,
  },
  trash: {
    fontSize: 22,
    color: '#ef233c'
  }
});
