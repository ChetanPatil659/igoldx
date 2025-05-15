import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { Stack, useNavigation } from "expo-router";
// import Swiper from 'react-native-swiper';

export default function OnboardingScreen({ setLoggedIn }: any) {
  const navigation = useNavigation();
  return (
    <Onboarding
      onSkip={() => console.log("Skipped")}
      //@ts-ignore
      onDone={() => navigation.navigate("/signin")}
      pages={[
        {
          backgroundColor: "#598392",
          image: <View></View>,
          title: "Onboarding",
          subtitle: "Done with React Native Onboarding Swiper",
        },
        {
          backgroundColor: "#124559",
          image: <View></View>,
          title: "Onboarding",
          subtitle: "Done with React Native Onboarding Swiper",
        },
        {
          backgroundColor: "#0f4c5c",
          image: <View></View>,
          title: "Onboarding",
          subtitle: "Done with React Native Onboarding Swiper",
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB",
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5",
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92BBD9",
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
});
