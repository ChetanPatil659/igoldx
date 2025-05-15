import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";

const {width, height} = Dimensions.get('screen')

const PhoneLoginInput = ({ onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const inputRef = useRef(null);

  // Format phone number as user types
  const formatPhoneNumber = (text) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, "");

    // Format based on length
    let formatted = cleaned;

    setPhoneNumber(formatted);

    // Validate phone number (must be 10 digits)
    setIsValid(cleaned.length === 10);
  };

  const handleSubmit = async () => {
    // Extract digits only for validation
    const digitsOnly = phoneNumber.replace(/\D/g, "");

    if (digitsOnly.length !== 10) {
      setIsValid(false);
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid 10-digit phone number"
      );
      return;
    }

    setIsLoading(true);

    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (onSubmit) {
        onSubmit(digitsOnly);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to send verification code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Log in with your phone</Text>
        <Text style={styles.subtitle}>We'll send you a verification code</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <View
            style={[
              styles.inputWrapper,
              !isValid && phoneNumber !== "" && styles.errorInput,
            ]}
          >
            <Text style={styles.prefix}>IND +91</Text>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={phoneNumber}
              onChangeText={formatPhoneNumber}
              placeholder="76489XXXXX"
              keyboardType="phone-pad"
              maxLength={10} // (XXX) XXX-XXXX
              onSubmitEditing={handleSubmit}
              returnKeyType="done"
            />
            {phoneNumber !== "" && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setPhoneNumber("");
                  inputRef.current?.focus();
                }}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          {!isValid && phoneNumber !== "" && (
            <Text style={styles.errorText}>
              Please enter a valid phone number
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!isValid || phoneNumber === "" || isLoading) &&
              styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={!isValid || phoneNumber === "" || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing, you agree to our{" "}
          <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
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
  formContainer: {
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
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#ffffff66",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    height: 56,
    paddingHorizontal: 16,
  },
  prefix: {
    color: "#333333",
    fontWeight: "500",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  clearButton: {
    padding: 6,
  },
  clearButtonText: {
    color: "#999999",
    fontSize: 14,
  },
  errorInput: {
    borderColor: "#E53935",
  },
  errorText: {
    color: "#E53935",
    fontSize: 12,
    marginTop: 8,
  },
  button: {
    backgroundColor: "#3B82F6",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: "#A0C2F9",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: "#666666",
  },
  termsLink: {
    color: "#3B82F6",
    fontWeight: "500",
  },
});

export default PhoneLoginInput;
