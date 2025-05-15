import React, { useState, useRef } from "react";
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
  ScrollView,
  Dimensions,
} from "react-native";

const {width, height} = Dimensions.get('screen')

const ProfileInput = ({ onSubmit, onSkip }) => {
  const [fullName, setFullName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: false,
    zipCode: false,
  });

  const lastNameRef = useRef(null);
  const zipCodeRef = useRef(null);

  // Format ZIP code as user types
  const formatZipCode = (text) => {
    // Remove all non-digit and non-hyphen characters
    let cleaned = text.replace(/[^\d-]/g, "");

    setZipCode(cleaned);
  };

  // Validate all fields
  const validateFields = () => {
    const newErrors = {
      fullName: fullName.trim() === "",
      zipCode: zipCode !== "" && zipCode.length !== 6,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  // Handle form submission
  const handleSubmit = async () => {
    Keyboard.dismiss();

    if (!validateFields()) {
      Alert.alert(
        "Please check your information",
        "Some fields contain errors or are missing."
      );
      return;
    }

    setIsLoading(true);

    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userProfile = {
        fullName: fullName.trim(),
        zipCode: zipCode.trim(),
      };

      if (onSubmit) {
        onSubmit(userProfile);
      }

    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to save your information. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Complete your profile</Text>
          <Text style={styles.subtitle}>Let us know a bit about you</Text>

          <View style={styles.formSection}>
            {/* First Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                placeholderTextColor={"#ffffff66"}
                style={[styles.input, errors.fullName && styles.inputError]}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
                blurOnSubmit={false}
                autoCapitalize="words"
              />
              {errors.fullName && (
                <Text style={styles.errorText}>First name is required</Text>
              )}
            </View>

            {/* ZIP Code Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput
                placeholderTextColor={"#ffffff66"}
                ref={zipCodeRef}
                style={[styles.input, errors.zipCode && styles.inputError]}
                value={zipCode}
                onChangeText={formatZipCode}
                placeholder="123456"
                keyboardType="number-pad"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                maxLength={6} // 5 digits + hyphen + 4 digits
              />
              {errors.zipCode && (
                <Text style={styles.errorText}>
                  Please enter a valid ZIP code
                </Text>
              )}
              <Text style={styles.helperText}>
                Used to provide relevant local services
              </Text>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (isLoading ||
                  (fullName === "" && zipCode === "")) &&
                  styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={
                isLoading ||
                (fullName === "" && zipCode === "")
              }
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Save Profile</Text>
              )}
            </TouchableOpacity>

            {onSkip && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={onSkip}
                disabled={isLoading}
              >
                <Text style={styles.skipButtonText}>Skip for now</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1a2e",
    height: height,
  },
  scrollContent: {
    flexGrow: 1,
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
    marginBottom: 32,
  },
  formSection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#ffffff66",
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF20",
    color: "#fff",
  },
  inputError: {
    borderColor: "#E53935",
  },
  errorText: {
    color: "#E53935",
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    color: "#666666",
    fontSize: 12,
    marginTop: 4,
  },
  buttonsContainer: {
    marginTop: 16,
  },
  submitButton: {
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
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  skipButtonText: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ProfileInput;
