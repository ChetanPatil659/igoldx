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
import { fetchGoldPriceApi } from "@/api/auth";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

type RouteParams = {
  amount: string;
};

type GoldSavingRouteProp = RouteProp<{ params: RouteParams }, 'params'>;

// Firebase configuration
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function GoldSaving() {
  const route = useRoute<GoldSavingRouteProp>();
  const data = route.params;
  const [amount, setAmount] = useState(data?.amount || "0");
  const [gramAmount, setGramAmount] = useState("0");
  const [goldPrice, setGoldPrice] = useState(0);
  const [activeTab, setActiveTab] = useState("rupees");
  const [timeLeft, setTimeLeft] = useState(60);
  const navigation = useNavigation();  
  const [expoPushToken, setExpoPushToken] = useState('');

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) {
      navigation.goBack();
      return;
    };

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(() => {
    const fetchGoldPrice = async () => {
      const res = await fetchGoldPriceApi();
      console.log(res);
      if (res.success) {
        setGoldPrice(res?.data?.current_price);
      }
    };
    fetchGoldPrice();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      
      // Get FCM token
      if (Platform.OS === 'android') {
        const messaging = getMessaging(app);
        const fcmToken = await getToken(messaging);
        console.log('FCM Token:', fcmToken);
      }
    } else {
      Alert.alert('Must use physical device for Push Notifications');
    }

    setExpoPushToken(token);
  }

  // Function to send test notification
  const sendTestNotification = async () => {
    try {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: expoPushToken,
          sound: 'default',
          title: 'Gold Price Update',
          body: 'Gold price has changed! Check it out.',
          data: { someData: 'goes here' },
        }),
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: any) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAmountSelect = (value: string) => {
    setAmount(value);
    // Calculate gram amount based on price
    if (activeTab === "rupees") {
      const grams = (parseInt(value) / goldPrice).toFixed(4);
      setGramAmount(grams);
    } else if (activeTab === "grams") {
      const rupees = (parseInt(value) * goldPrice).toFixed(2);
      setAmount(rupees);
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
            onPress={() => setActiveTab("rupees")}
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
            onPress={() => setActiveTab("grams")}
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
            <Text style={styles.rupeeSymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={(text) => handleAmountSelect(text)}
              keyboardType="numeric"
            />
            <Text style={styles.gramAmount}>{gramAmount ? gramAmount : 0} gm</Text>
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

        {/* Available Offers */}
        <View style={styles.offersSection}>
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
        </View>
      </ScrollView>

      {/* Live Price Ticker */}
      <View style={styles.liveTickerContainer}>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <Text style={styles.livePrice}>Live Price: ₹9,035.00/gm</Text>
        <Text style={styles.validTime}>Valid For: {formatTime(timeLeft)}</Text>
      </View>

      {/* Bottom Payment Section */}
      <View style={styles.paymentContainer}>
        <View style={styles.totalContainer}>
          <View>
            <Text style={styles.totalAmount}>₹200</Text>
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
            // onPress={processCardPayment}
            style={styles.buyButton}
          >
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add this somewhere in your UI to test notifications */}
      <TouchableOpacity 
        style={styles.testNotificationButton}
        onPress={sendTestNotification}
      >
        <Text style={styles.testNotificationText}>Test Notification</Text>
      </TouchableOpacity>
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
    backgroundColor: '#6b46c1',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  testNotificationText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
