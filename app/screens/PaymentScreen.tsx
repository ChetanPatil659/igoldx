import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import PayUPayment from "../components/PayUPayment";

const PaymentScreen = () => {
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");

  const handlePaymentSuccess = (response: any) => {
    setPaymentStatus("success");
    Alert.alert(
      "Payment Successful",
      "Your payment has been processed successfully.",
      [
        {
          text: "OK",
          onPress: () => {
            // Navigate to success screen or handle success
            console.log("Payment success response:", response);
          },
        },
      ]
    );
  };

  const handlePaymentError = (error: any) => {
    setPaymentStatus("failed");
    console.error("Payment error:", error);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.paymentContainer}>
          <PayUPayment
            amount="100"
            productInfo="Test Product"
            customerName="John Doe"
            customerEmail="john@example.com"
            customerPhone="9876543210"
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  paymentContainer: {
    flex: 1,
    justifyContent: "center",
  },
});

export default PaymentScreen;
