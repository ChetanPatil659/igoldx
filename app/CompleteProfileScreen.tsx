import React, { useState } from "react";
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import ProfileInput from "./profileInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { completeProfileApi } from "@/api/auth";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/action";

const CompleteProfileScreen = () => {
  const navigation = useNavigation();
  const token = useSelector((state: any) => state.token.token);
  const dispatch = useDispatch();
  
  // Handle profile submission
  const handleProfileSubmit = async (profileData: any) => {
    const res = await completeProfileApi(token, profileData.fullName, profileData.zipCode);
    if(res.success){
      dispatch(setUser(res.data));
      return;
    }else{
      Alert.alert("Error", res.error);
    }
    // if (res.data.name !== "" && res.data.pincode !== "") {
    //   dispatch(setUser(res.data));
    //   navigation.replace("Main");
    //   return;
    // }
    console.log(res);
    
    navigation.replace("Main");
  };

  // Handle skipping profile completion
  const handleSkipProfile = () => {
    navigation.replace("Main");
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1a2e" />
      <View style={styles.content}>
        <ProfileInput
          onSubmit={handleProfileSubmit}
          onSkip={handleSkipProfile}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  content: {
    flex: 1,
  },
  successContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#3B82F6",
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 18,
    textAlign: "center",
    color: "#333333",
    marginBottom: 32,
  },
  accountDetails: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 16,
  },
  detailsContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailsText: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 8,
  },
  startOverButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  startOverButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CompleteProfileScreen;
