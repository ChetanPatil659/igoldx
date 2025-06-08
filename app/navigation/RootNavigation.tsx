import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../OnboardingScreen";
import Signin from "../signin";
import SplashScreen from "../SplashScreen";
import NotificationsScreen from "../notificationScreen";
import CompleteProfileScreen from "../CompleteProfileScreen";
import Layout from "../screens/_layout";
import GoldSaving from "../goldSavings";
import SavedAddresses from "../SavedAddresses";
import AddAddress from "../AddAddress";
import WithdrawalOptionsScreen from "../withdrawlScreen";
import Home from "../screens/Home";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import GoldSelling from "../goldSelling";
const Stack = createNativeStackNavigator();
export default function RootLayout() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const { user } = useSelector((state: any) => state.user);
  const navigation = useNavigation();

  useEffect(() => {
    if (isAuthenticated && !isNaN(user.phone)) {
      if (!user.name && user.name == "") {
        navigation.navigate("CompleteProfile");
        return;
      }
      navigation.navigate("Main");
    } else {
      navigation.navigate("Login");
    }
  }, [isAuthenticated]);

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Main" component={Layout} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={Signin} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
      <Stack.Screen name="GoldSavings" component={GoldSaving} />
      <Stack.Screen name="SavedAddresses" component={SavedAddresses} />
      <Stack.Screen name="AddAddress" component={AddAddress} />
      <Stack.Screen name="withdrawlScreen" component={GoldSelling} />
    </Stack.Navigator>
  );
}
