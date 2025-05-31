import RazorpayCheckout from "react-native-razorpay";
import { createOrder, verifyPayment } from "@/api/payment";

interface PaymentOptions {
  amount: number;
  currency?: string;
  description?: string;
  name?: string;
  prefill?: {
    email?: string;
    contact?: string;
    name?: string;
  };
  theme?: {
    color: string;
  };
  preferredApp?: "phonepe" | "googlepay";
  isAutoPay?: boolean;
  frequency?: "daily" | "weekly" | "monthly";
}

interface PaymentResult {
  success: boolean;
  data?: any;
  error?: string;
}

const getSubscriptionInterval = (frequency: string) => {
  switch (frequency) {
    case "daily":
      return 1;
    case "weekly":
      return 7;
    case "monthly":
      return 30;
    default:
      return 30;
  }
};

export const initiatePayment = async ({
  amount,
  currency = "INR",
  description = "Payment for IGold",
  name = "IGold",
  prefill = {
    email: "",
    contact: "",
    name: "",
  },
  theme = { color: "#000000" },
  preferredApp = "phonepe",
  isAutoPay = false,
  frequency = "monthly",
}: PaymentOptions): Promise<PaymentResult> => {
  try {
    // First, create an order on the backend
    const orderResponse = await createOrder(amount);
    if (!orderResponse.success || !orderResponse.data) {
      return {
        success: false,
        error: orderResponse.error || "Failed to create order",
      };
    }

    const { order_id } = orderResponse.data;

    // Open Razorpay payment gateway
    const options = {
      description,
      image:
        "https://images.unsplash.com/photo-1746278925416-9d6c71f55c2d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      currency,
      key: "rzp_test_e0bHG6zomo3CEo", // Your Razorpay key
      amount: amount * 100, // Amount in smallest currency unit (paise for INR)
      name,
      prefill: {
        ...prefill,
        method: preferredApp === "phonepe" ? "phonepe" : "google_pay",
      },
      theme,
      order_id,
      method: {
        upi: true,
        card: false,
        netbanking: false,
        wallet: false,
        emi: false,
      },
      subscription_id: isAutoPay ? `sub_${Date.now()}` : undefined,
      subscription_interval: isAutoPay
        ? getSubscriptionInterval(frequency)
        : undefined,
      subscription_interval_unit: isAutoPay ? "day" : undefined,
      subscription_start_at: isAutoPay
        ? Math.floor(Date.now() / 1000) + 86400
        : undefined, // Start after 24 hours
    };

    const paymentData = await RazorpayCheckout.open(options);

    // Verify the payment on the backend
    const verificationResponse = await verifyPayment(
      paymentData.razorpay_payment_id,
      paymentData.razorpay_order_id,
      paymentData.razorpay_signature
    );

    if (!verificationResponse.success) {
      return {
        success: false,
        error: verificationResponse.error || "Payment verification failed",
      };
    }

    return {
      success: true,
      data: {
        ...paymentData,
        verification: verificationResponse.data,
        isAutoPay,
        frequency,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Payment failed",
    };
  }
};
