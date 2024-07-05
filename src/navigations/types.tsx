import { ICategory, ITask } from "@/types/Index";
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
};
export type RootButtonTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamsList>;
  Today: undefined;
  Completed: undefined;
  CategoriesStack: NavigatorScreenParams<CategoriesStackParamList>;
  ProfileStack:NavigatorScreenParams<ProfileStackParamList>;
};
export type HomeStackParamsList = {
  Home: undefined;
  EditTask: {
    task:ITask
  };
};
export type CategoriesStackParamList = {
  Categories: undefined;
  Category: {
    id: string;
  };
  CreateCategory: {
    category?: ICategory;
  };
};

export type ProfileStackParamList ={
  Profile:undefined;
  Setting:undefined;
  ChangeName:undefined;
  ChangePassword:undefined;
  DarkMode: undefined;
  DeleteAccount: undefined;
}

export type AppStackParamList = {
  Root: NavigatorScreenParams<RootButtonTabParamList>;
  Setting: undefined;
};
export type RootStackParamList = {
  AppStack: NavigatorScreenParams<AppStackParamList>;
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type AuthScreenNavigationType<
  RouteName extends keyof AuthStackParamList
> = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList, RouteName>,
  NativeStackNavigationProp<AppStackParamList, "Root">
>;

export type CategoriesNavigationType = 
  NativeStackNavigationProp<CategoriesStackParamList>

export type HomeScreenNavigationType = 
  NativeStackNavigationProp<HomeStackParamsList>

export type ProfileScreenNavigationType = 
  NativeStackNavigationProp<ProfileStackParamList>