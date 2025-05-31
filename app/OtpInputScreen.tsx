import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("screen");

const OtpInputScreen = ({
  phoneNumber,
  onVerificationComplete,
  onResendCode,
  onBack,
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isResendActive, setIsResendActive] = useState(false);

  const inputRefs = useRef([]);

  // Handle countdown for resend code option
  useEffect(() => {
    if (countdown > 0 && !isResendActive) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isResendActive) {
      setIsResendActive(true);
    }
  }, [countdown, isResendActive]);

  // Focus first input on mount
  useEffect(() => {
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 100);
  }, []);

  // Handle input change-
  const handleOtpChange = (value, index) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto advance to next input
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }

    // Auto submit when all digits are entered
    // if (index === 3 && value && !newOtp.includes("")) {
    //   Keyboard.dismiss();
    //   handleVerify();
    // }
  };

  // Handle backspace key
  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Input focus handling
  const handleFocus = (index) => {
    // If there's a value before this index but this box is empty,
    // fill from left to right
    for (let i = 0; i < index; i++) {
      if (!otp[i]) {
        inputRefs.current[i].focus();
        return;
      }
    }
  };

  // Handle OTP paste functionality
  const handleOtpPaste = (pastedText) => {
    const cleanedText = pastedText.replace(/\D/g, "").slice(0, 4);
    if (cleanedText.length === 0) return;

    const newOtp = [...otp];

    for (let i = 0; i < cleanedText.length; i++) {
      if (i < 4) {
        newOtp[i] = cleanedText.charAt(i);
      }
    }

    setOtp(newOtp);

    // Focus the next empty field or the last field if all filled
    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "");
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex].focus();
    } else if (inputRefs.current[4]) {
      inputRefs.current[4].focus();
      // Auto submit when all filled from paste
      // Keyboard.dismiss();
      // setTimeout(() => handleVerify(), 300);
    }
  };

  // Handle verification submission
  const handleVerify = async () => {
    const otpCode = otp.join("");

    setIsLoading(true);

    try {
      // Simulating API verification delay
      // await new Promise((resolve) => setTimeout(resolve, 1500));

      // Call the verification completion handler
      if (onVerificationComplete) {
        onVerificationComplete(otpCode);
      }

      // For demo purposes - show success
    } catch (error) {
      Alert.alert(
        "Verification Failed",
        "The code you entered is invalid. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    if (!isResendActive) return;

    try {
      // Call resend handler
      if (onResendCode) {
        onResendCode();
      }

      // Reset countdown
      setCountdown(30);
      setIsResendActive(false);
    } catch (error) {
      Alert.alert("Error", "Failed to resend code. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to +91 {phoneNumber}
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={[styles.otpInput, digit ? styles.otpInputFilled : {}]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => handleFocus(index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              onPaste={handleOtpPaste}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.verifyButton,
            (otp.includes("") || isLoading) && styles.disabledButton,
          ]}
          onPress={handleVerify}
          disabled={otp.includes("") || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Verify</Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Change phone number</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendCode}
            disabled={!isResendActive}
          >
            <Text
              style={[
                styles.resendText,
                !isResendActive && styles.resendInactive,
              ]}
            >
              {isResendActive ? "Resend code" : `Resend in ${countdown}s`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1a2e",
    height: height,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: "row",
    marginBottom: 40,
    gap: 20,
  },
  otpInput: {
    width: 50,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    backgroundColor: "#FFFFFF33",
  },
  otpInputFilled: {
    borderColor: "#3B82F6",
    backgroundColor: "#EBF5FF",
  },
  verifyButton: {
    backgroundColor: "#3B82F6",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: "#A0C2F9",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    color: "#666666",
    fontSize: 14,
  },
  resendButton: {
    padding: 4,
  },
  resendText: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "600",
  },
  resendInactive: {
    color: "#999999",
  },
});

export default OtpInputScreen;
