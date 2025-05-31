import axios from "axios";
import { URL } from "./client";

interface CreateOrderResponse {
  success: boolean;
  data?: {
    order_id: string;
    amount: number;
    currency: string;
  };
  error?: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  data?: {
    payment_id: string;
    order_id: string;
    signature: string;
    amount: number;
    currency: string;
  };
  error?: string;
}

export const createOrder = async (
  amount: number
): Promise<CreateOrderResponse> => {
  try {
    const response = await axios.post(`${URL}/payments/orders`, {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `buy_order_${Date.now()}`,
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
  }
};

export const verifyPayment = async (
  paymentId: string,
  orderId: string,
  signature: string
): Promise<VerifyPaymentResponse> => {
  try {
    const response = await axios.post(`${URL}/payments/verify`, {
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      razorpay_signature: signature,
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Payment verification failed",
    };
  }
};
