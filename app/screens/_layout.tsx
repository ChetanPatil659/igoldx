import { View, Text, Alert } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Transaction from "./Transaction";
import Home from "./Home";
import Account from "./Account";
import CustomTabBar from "@/components/CustomTabBar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tabs = createMaterialTopTabNavigator();
export default function Layout() {
  return (
    <Tabs.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "blue",
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
      tabBarPosition="bottom"
      backBehavior="history"
    >
      <Tabs.Screen name="Transaction" component={Transaction} />
      <Tabs.Screen name="Home" component={Home} />
      <Tabs.Screen name="Account" component={Account} />
    </Tabs.Navigator>
  );
}
