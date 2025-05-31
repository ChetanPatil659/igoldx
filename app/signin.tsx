import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  ActivityIndicator,
} from "react-native";
import OtpInputScreen from "./OtpInputScreen";
import PhoneLoginInput from "./PhoneInput";
import { loginApi, verifyOtpApi } from "@/api/auth";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { login, setToken, setUser } from "@/store/action";

const SigninScreen = () => {
  const [currentScreen, setCurrentScreen] = useState("phone"); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpData, setOtpData] = useState();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handlePhoneSubmit = async (phone: string) => {
    setIsLoading(true);
    setPhoneNumber(phone);
    try {
      const res = await loginApi(phone);
      if (res.error || res.success === false) {
        console.log(res.error);
        return;
      }
      setOtpData(res.otp);
      console.log(res.otp, "res.data.otp============");

      setCurrentScreen("otp");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationComplete = async (otpCode: string) => {
    setIsLoading(true);
    console.log("Verification completed with code:", otpCode);
    console.log(otpData, "otpData============");

    try {
      const res = await verifyOtpApi(
        phoneNumber,
        otpCode,
        "expo",
        otpData?.verificationId
      );
      console.log(res);
      if (res.error || res.data.success === false) {
        console.log(res.error);
        return;
      }
      dispatch(login());
      dispatch(setUser(res.data));
      dispatch(setToken(res.token));
      console.log(res.data.name !== "", "jjnjnnhnhnhnnhnhn============");

      if (res.data.name === "") {
        console.log("false============");
        navigation.navigate("CompleteProfile");
      } else {
        console.log("true============");
        navigation.replace("CompleteProfile");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    console.log("Resending code to:", phoneNumber);
    // Here you would call your API to resend the verification code
  };

  const handleBackToPhone = () => {
    setCurrentScreen("phone");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {currentScreen === "phone" ? (
          <>
            <View style={styles.loadingContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <PhoneLoginInput onSubmit={handlePhoneSubmit} />
              )}
            </View>
          </>
        ) : (
          <>
            <View style={styles.loadingContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <OtpInputScreen
                  phoneNumber={phoneNumber}
                  onVerificationComplete={handleVerificationComplete}
                  onResendCode={handleResendCode}
                  onBack={handleBackToPhone}
                />
              )}
            </View>
          </>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1a2e",
  },
});

export default SigninScreen;
