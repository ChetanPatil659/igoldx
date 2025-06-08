import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  sellGoldApi,
  sellGoldConfirmApi,
  fetchSellGoldPriceApi,
} from "@/api/auth";
import { initiatePayment } from "@/helper/razorpay";
import { sendTestNotificationWithImage } from "@/hooks/usePushNotifications";
import { useSelector } from "react-redux";

interface GoldPrice {
  current_price: number;
  rate_id: number;
  applicable_tax: number;
}

type GoldSavingRouteProp = RouteProp<
  {
    GoldSaving: {
      amount?: string;
    };
  },
  "GoldSaving"
>;

export default function GoldSelling() {
  const route = useRoute<GoldSavingRouteProp>();
  const data = route.params;
  const [amount, setAmount] = useState(data?.amount || "0");
  const [gramAmount, setGramAmount] = useState("0");
  const [goldPrice, setGoldPrice] = useState<GoldPrice | null>(null);
  const [activeTab, setActiveTab] = useState("rupees");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGramsInput, setIsGramsInput] = useState(false);
  const [isGramsCalculating, setIsGramsCalculating] = useState(false);
  const navigation = useNavigation();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isAutoPay, setIsAutoPay] = useState(false);
  const [autoPayFrequency, setAutoPayFrequency] = useState<
    "daily" | "weekly" | "monthly"
  >("monthly");

  const token = useSelector((state: any) => state.token.token);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) {
      fetchGoldPrice();
      setTimeLeft(60);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const fetchGoldPrice = async () => {
    const res = await fetchSellGoldPriceApi();
    if (res.success) {
      setGoldPrice(res?.data);
    }
  };
  useEffect(() => {
    fetchGoldPrice();
  }, []);
  // Format time as MM:SS
  const formatTime = (seconds: any) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAmountSelect = (value: string) => {
    if (!goldPrice?.current_price) return;

    // Remove any non-numeric characters except decimal point
    const sanitizedValue = value.replace(/[^0-9.]/g, "");

    if (activeTab === "rupees") {
      setIsGramsInput(false);
      setAmount(sanitizedValue);
      // Calculate gram amount based on price
      const grams = (
        parseFloat(sanitizedValue || "0") /
        (goldPrice.current_price * 1.03)
      ).toFixed(4);
      setGramAmount(grams);
    } else if (activeTab === "grams") {
      setIsGramsInput(true);
      setGramAmount(sanitizedValue);
      // Calculate rupees amount based on price
      setIsGramsCalculating(true);
      const rupees = (
        parseFloat(sanitizedValue || "0") *
        (goldPrice.current_price * 1.03)
      ).toFixed(2);
      setAmount(rupees);
      setIsGramsCalculating(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "grams") {
      setIsGramsInput(true);
    } else {
      setIsGramsInput(false);
    }
  };

  const handlePayment = async () => {
    try {
      setIsProcessingPayment(true);

      console.log(gramAmount);

      const res = await sellGoldApi(
        token,
        goldPrice?.rate_id,
        parseFloat(gramAmount),
        parseFloat(amount)
      );

      console.log(res, "res");

      Alert.alert(
        "Confirm Purchase",
        `Are you sure you want to purchase ${gramAmount} grams of gold for ₹${amount}?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: async () => {
              const paymentResult = await sellGoldConfirmApi(
                token,
                res?.data?.tx_id
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1a2e" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buy Gold</Text>
        </View>
        <TouchableOpacity style={styles.goldIcon}>
          <FontAwesome5 name="coins" size={20} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "rupees" && styles.activeTab]}
            onPress={() => handleTabChange("rupees")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "rupees" && styles.activeTabText,
              ]}
            >
              In Rupees
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "grams" && styles.activeTab]}
            onPress={() => handleTabChange("grams")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "grams" && styles.activeTabText,
              ]}
            >
              In Grams
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <View style={styles.amountInputContainer}>
            <Text style={styles.rupeeSymbol}>{isGramsInput ? "gm" : "₹"}</Text>
            <TextInput
              style={styles.amountInput}
              value={isGramsInput ? gramAmount : amount}
              onChangeText={(text) => handleAmountSelect(text)}
              keyboardType="numeric"
              placeholder={isGramsInput ? "Enter grams" : "Enter amount"}
              placeholderTextColor="#666"
            />
            <Text style={styles.gramAmount}>
              {isGramsInput ? `₹${amount}` : `${gramAmount} gm`}
            </Text>
          </View>
        </View>

        {/* Quick Amount Selection */}
        <View style={styles.quickAmountContainer}>
          <TouchableOpacity
            style={styles.quickAmountButton}
            onPress={() => handleAmountSelect("20")}
          >
            <Text style={styles.quickAmountText}>₹20</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAmountButton}
            onPress={() => handleAmountSelect("50")}
          >
            <Text style={styles.quickAmountText}>₹50</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAmountButton}
            onPress={() => handleAmountSelect("100")}
          >
            <Text style={styles.quickAmountText}>₹100</Text>
          </TouchableOpacity>
          <View style={styles.popularContainer}>
            <TouchableOpacity
              style={styles.quickAmountButton}
              onPress={() => handleAmountSelect("500")}
            >
              <Text style={styles.quickAmountText}>₹500</Text>
            </TouchableOpacity>
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>POPULAR</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.quickAmountButton}
            onPress={() => handleAmountSelect("1000")}
          >
            <Text style={styles.quickAmountText}>₹1000</Text>
          </TouchableOpacity>
        </View>

        {/* Security Message */}
        <View style={styles.securityContainer}>
          <FontAwesome5 name="shield-alt" size={16} color="#FFD700" />
          <Text style={styles.securityText}>
            Your gold will be stored in 100% safe & secure locker
          </Text>
        </View>

        {/* Auto Pay Option */}
        <View style={styles.autoPayContainer}>
          <View style={styles.autoPayRow}>
            <View style={styles.autoPayLeft}>
              <MaterialIcons name="autorenew" size={20} color="#FFD700" />
              <Text style={styles.autoPayText}>Auto Pay</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.autoPayToggle,
                isAutoPay && styles.autoPayToggleActive,
              ]}
              onPress={() => setIsAutoPay(!isAutoPay)}
            >
              <View
                style={[
                  styles.toggleCircle,
                  isAutoPay && styles.toggleCircleActive,
                ]}
              />
            </TouchableOpacity>
          </View>

          {isAutoPay && (
            <View style={styles.frequencyRow}>
              <Text style={styles.frequencyLabel}>Frequency:</Text>
              <View style={styles.frequencyButtons}>
                <TouchableOpacity
                  style={[
                    styles.freqButton,
                    autoPayFrequency === "daily" && styles.freqButtonActive,
                  ]}
                  onPress={() => setAutoPayFrequency("daily")}
                >
                  <Text
                    style={[
                      styles.freqButtonText,
                      autoPayFrequency === "daily" &&
                        styles.freqButtonTextActive,
                    ]}
                  >
                    Daily
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.freqButton,
                    autoPayFrequency === "weekly" && styles.freqButtonActive,
                  ]}
                  onPress={() => setAutoPayFrequency("weekly")}
                >
                  <Text
                    style={[
                      styles.freqButtonText,
                      autoPayFrequency === "weekly" &&
                        styles.freqButtonTextActive,
                    ]}
                  >
                    Weekly
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.freqButton,
                    autoPayFrequency === "monthly" && styles.freqButtonActive,
                  ]}
                  onPress={() => setAutoPayFrequency("monthly")}
                >
                  <Text
                    style={[
                      styles.freqButtonText,
                      autoPayFrequency === "monthly" &&
                        styles.freqButtonTextActive,
                    ]}
                  >
                    Monthly
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Available Offers */}
        {/* <View style={styles.offersSection}>
          <Text style={styles.sectionTitle}>Available Offers</Text>

          <View style={styles.offerCard}>
            <View style={styles.bestOfferBadge}>
              <Ionicons name="flash" size={14} color="white" />
              <Text style={styles.bestOfferText}>BEST OFFER</Text>
            </View>

            <View style={styles.offerHeader}>
              <View style={styles.offerTitleContainer}>
                <Ionicons name="medal" size={20} color="white" />
                <Text style={styles.offerTitle}>JAR WINNINGS</Text>
              </View>
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyButtonText}>APPLY</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.offerDescription}>
              Get upto Rs. 230/gm discount on minimum purchase of Rs. 50
            </Text>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.viewDetailsButton}>
              <Text style={styles.viewDetailsText}>View Details</Text>
              <Ionicons name="chevron-down" size={16} color="#a8a8a8" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.viewAllOffersButton}>
            <Text style={styles.viewAllOffersText}>View all offers</Text>
            <Ionicons name="chevron-forward" size={16} color="#a8a8a8" />
          </TouchableOpacity>
        </View> */}
      </ScrollView>

      {/* Live Price Ticker */}
      <View style={styles.liveTickerContainer}>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <Text style={styles.livePrice}>
          Live Price: ₹{goldPrice?.current_price?.toFixed(2)}/gm
        </Text>
        <Text style={styles.validTime}>Valid For: {formatTime(timeLeft)}</Text>
      </View>

      {/* Bottom Payment Section */}
      <View style={styles.paymentContainer}>
        <View style={styles.totalContainer}>
          <View>
            <Text style={styles.totalAmount}>₹{amount}</Text>
            <Text style={styles.taxInfo}>Incl. (GST)</Text>
          </View>
          <TouchableOpacity style={styles.breakdownButton}>
            <Text style={styles.breakdownText}>View Breakdown</Text>
            <Ionicons name="chevron-down" size={16} color="#a8a8a8" />
          </TouchableOpacity>
        </View>

        <View style={styles.paymentMethodContainer}>
          <View style={styles.paymentMethod}>
            <View style={styles.phonepeIcon}>
              <Text style={styles.phonepeText}>P</Text>
            </View>
            <View>
              <Text style={styles.paymentMethodName}>Phonepe</Text>
              <Text style={styles.paymentMethodInfo}>Last used</Text>
            </View>
            <Ionicons
              name="chevron-down"
              size={20}
              color="#a8a8a8"
              style={{ marginLeft: 10 }}
            />
          </View>

          <TouchableOpacity
            onPress={handlePayment}
            style={[
              styles.buyButton,
              isProcessingPayment && styles.buyButtonDisabled,
            ]}
            disabled={isProcessingPayment}
          >
            {isProcessingPayment ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buyButtonText}>Buy Now</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1a2e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#1e1a2e",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusIcons: {
    position: "absolute",
    top: 10,
    right: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    color: "white",
    fontSize: 14,
    marginRight: 10,
  },
  iconGroup: {
    flexDirection: "row",
  },
  goldIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2a2642",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: "#2a2642",
  },
  activeTab: {
    backgroundColor: "#3a3a4c",
  },
  tabText: {
    color: "#a8a8a8",
    fontSize: 14,
  },
  activeTabText: {
    color: "white",
    fontWeight: "bold",
  },
  amountContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2a2642",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#3a3a4c",
  },
  rupeeSymbol: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  amountInput: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 5,
  },
  gramAmount: {
    color: "#a8a8a8",
    fontSize: 16,
  },
  quickAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  quickAmountButton: {
    backgroundColor: "#2a2642",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  quickAmountText: {
    color: "white",
    fontSize: 14,
  },
  popularContainer: {
    position: "relative",
  },
  popularBadge: {
    position: "absolute",
    top: "-25%",
    right: "-25%",
    backgroundColor: "#6b46c1",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  popularText: {
    color: "white",
    fontSize: 9,
    fontWeight: "bold",
  },
  securityContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  securityText: {
    color: "#FFD700",
    fontSize: 14,
    marginLeft: 10,
  },
  offersSection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  offerCard: {
    backgroundColor: "#2a2642",
    borderRadius: 10,
    padding: 15,
    position: "relative",
  },
  bestOfferBadge: {
    position: "absolute",
    top: -10,
    left: 15,
    backgroundColor: "#6b46c1",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  bestOfferText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
  offerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  offerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  offerTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  applyButton: {
    backgroundColor: "transparent",
  },
  applyButtonText: {
    color: "#4cd964",
    fontSize: 14,
    fontWeight: "bold",
  },
  offerDescription: {
    color: "#a8a8a8",
    fontSize: 14,
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#3a3a4c",
    marginVertical: 10,
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  viewDetailsText: {
    color: "#a8a8a8",
    fontSize: 14,
    marginRight: 5,
  },
  viewAllOffersButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  viewAllOffersText: {
    color: "#a8a8a8",
    fontSize: 14,
    marginRight: 5,
  },
  liveTickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ff7675",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
    marginRight: 5,
  },
  liveText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  livePrice: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  validTime: {
    color: "white",
    fontSize: 14,
  },
  paymentContainer: {
    backgroundColor: "#1e1a2e",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#3a3a4c",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  totalAmount: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  taxInfo: {
    color: "#a8a8a8",
    fontSize: 12,
  },
  breakdownButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  breakdownText: {
    color: "#a8a8a8",
    fontSize: 14,
    marginRight: 5,
  },
  paymentMethodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
  },
  phonepeIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#6b46c1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  phonepeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  paymentMethodName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentMethodInfo: {
    color: "#a8a8a8",
    fontSize: 12,
  },
  buyButton: {
    backgroundColor: "#6b46c1",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  testNotificationButton: {
    backgroundColor: "#6b46c1",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  testNotificationText: {
    color: "white",
    fontWeight: "bold",
  },
  buyButtonDisabled: {
    opacity: 0.7,
  },
  autoPayContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#2a2642",
    borderRadius: 10,
    padding: 15,
  },
  autoPayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  autoPayLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  autoPayText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  autoPayToggle: {
    width: 40,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3a3a4c",
    padding: 2,
  },
  autoPayToggleActive: {
    backgroundColor: "#6b46c1",
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
  },
  toggleCircleActive: {
    transform: [{ translateX: 16 }],
  },
  frequencyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#3a3a4c",
  },
  frequencyLabel: {
    color: "#a8a8a8",
    fontSize: 14,
    marginRight: 10,
  },
  frequencyButtons: {
    flexDirection: "row",
    flex: 1,
  },
  freqButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#3a3a4c",
    marginHorizontal: 5,
    alignItems: "center",
  },
  freqButtonActive: {
    backgroundColor: "#6b46c1",
  },
  freqButtonText: {
    color: "#a8a8a8",
    fontSize: 14,
  },
  freqButtonTextActive: {
    color: "white",
    fontWeight: "bold",
  },
});
