import React, { useState } from "react";
import { SafeAreaView, StyleSheet, StatusBar, View } from "react-native";
import OtpInputScreen from "./OtpInputScreen";
import PhoneLoginInput from "./PhoneInput";
import { loginApi, verifyOtpApi } from "@/api/auth";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { login, setToken, setUser } from "@/store/action";

const SigninScreen = () => {
  const [currentScreen, setCurrentScreen] = useState("phone"); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handlePhoneSubmit = async (phone) => {
    setPhoneNumber(phone);
    const res = await loginApi(phone);
    if (res.error || res.success === false) {
      console.log(res.error);
      return;
    }
    setCurrentScreen("otp");
  };

  const handleVerificationComplete = async (otpCode) => {
    console.log("Verification completed with code:", otpCode);
    // Here you would typically:
    // 1. Send the OTP to your backend for verification
    // 2. Handle the authentication (set tokens, etc.)
    // 3. Navigate to the main app

    // For demo, we'll just log and go back to phone screen
    const res = await verifyOtpApi(phoneNumber, otpCode, "expo");
    console.log(res);
    if (res.error || res.success === false) {
      console.log(res.error);
      return;
    }
    // setPhoneNumber("");
    dispatch(login());

    dispatch(setUser(res.data));
    dispatch(setToken(res.token));
    console.log(res.data.name !== "", 'jjnjnnhnhnhnnhnhn============');
    
    if (res.data.name === "") {
      console.log("false============");
      navigation.replace("CompleteProfile");
    } else {
      console.log("true============");
      navigation.replace("CompleteProfile");
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
          <PhoneLoginInput onSubmit={handlePhoneSubmit} />
        ) : (
          <OtpInputScreen
            phoneNumber={phoneNumber}
            onVerificationComplete={handleVerificationComplete}
            onResendCode={handleResendCode}
            onBack={handleBackToPhone}
          />
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
});

export default SigninScreen;
