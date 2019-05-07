import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";
import LoginScreen from "./screens/loginScreen";
import HomeScreen from "./screens/homeScreen";
import AuthLoadingScreen from "./screens/authLoading";
import ChatScreen from "./screens/chatScreen";
import ProfileScreen from "./screens/profileScreen";
const AppStack = createStackNavigator({
  Home: HomeScreen,
  Chat: ChatScreen,
  Profile: ProfileScreen
});
const AuthStack = createStackNavigator({ Login: LoginScreen });

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);
