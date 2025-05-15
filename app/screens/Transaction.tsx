import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  Platform,
  FlatList,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";


const Tab = createMaterialTopTabNavigator();

const { width } = Dimensions.get("window");

export default function Transaction() {
  const [activeTab, setActiveTab] = useState("Gold");

  const renderHistoryItem = (
    type,
    description,
    amount,
    date,
    time,
    success = true
  ) => (
    <View style={styles.historyItem}>
      <View style={styles.historyLeft}>
        <View style={styles.coinContainer}>
          {type === "spin" ? (
            <FontAwesome5
              name="spinner"
              size={24}
              color="#4287f5"
              style={styles.coinIcon}
            />
          ) : (
            <Image
              source={require("@/assets/images/goldcoin.png")}
              style={styles.coinIcon}
            />
          )}
        </View>
        <View style={styles.historyDetails}>
          <Text style={styles.historyTitle}>{type}</Text>
          <Text style={styles.historyDescription}>{description}</Text>
          <Text
            style={[
              styles.historyStatus,
              { color: success ? "#4cd964" : "#ff3b30" },
            ]}
          >
            {success ? "Success" : "Failed"}
          </Text>
        </View>
      </View>
      <View style={styles.historyRight}>
        <Text style={styles.historyAmount}>₹{amount}</Text>
        <Text style={styles.historyTime}>
          {date}, {time}
        </Text>
      </View>
    </View>
  );

  const transactions = [
    {
      id: "1",
      type: "Daily Saving",
      amount: "₹10.00",
      goldAmount: "0.001 gm Gold",
      status: "Success",
      date: "13 Mar '25, 04:34am",
      icon: "building",
    },
    {
      id: "2",
      type: "Daily Saving",
      amount: "₹10.00",
      goldAmount: "0.001 gm Gold",
      status: "Success",
      date: "12 Mar '25, 03:54am",
      icon: "building",
    },
    {
      id: "3",
      type: "Daily Saving",
      amount: "₹10.00",
      goldAmount: "0.001 gm Gold",
      status: "Success",
      date: "11 Mar '25, 04:41am",
      icon: "building",
    },
    {
      id: "4",
      type: "Daily Saving",
      amount: "₹10.00",
      goldAmount: "0.001 gm Gold",
      status: "Success",
      date: "10 Mar '25, 04:00pm",
      icon: "building",
    },
    {
      id: "5",
      type: "Weekly Magic Reward",
      amount: "₹2.00",
      goldAmount: "0.0002 gm Gold",
      status: "Success",
      date: "10 Mar '25, 07:43am",
      icon: "magic",
    },
    {
      id: "6",
      type: "Instant Saving",
      amount: "₹52.50",
      goldAmount: "0.0057 gm Gold",
      status: "Success",
      date: "10 Mar '25, 07:43am",
      icon: "gold",
    },
  ];

  const getIconStyle = (type) => {
    if (type === "Weekly Magic Reward") {
      return { backgroundColor: "#4a3b76" };
    } else if (type === "Instant Saving") {
      return { backgroundColor: "#b38728" };
    } else {
      return { backgroundColor: "#3b76ca" };
    }
  };

  const TransactionItem = ({ item }: any) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="coins" size={18} color="#fff" />
        </View>
        <View>
          <Text style={styles.transactionType}>{item.type}</Text>
          <Text style={styles.goldAmount}>{item.goldAmount}</Text>
        </View>
      </View>
      <View>
        <Text style={styles.amount}>{item.amount}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
  );

  function GoldScreen() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>History</Text>
          <View style={styles.historyActions}>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="funnel" size={16} color="#fff" />
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton}>
              <Ionicons name="logo-whatsapp" size={16} color="#fff" />
              <Text style={styles.contactText}>Contact Us</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={transactions}
          renderItem={({ item }) => <TransactionItem item={item} />}
          keyExtractor={(item) => item.id}
          style={{ paddingHorizontal: 10 }}
        />
      </SafeAreaView>
    );
  }

  function WinningScreen() {
    return (
      <>
        <LinearGradient
          colors={["#4c669f", "#3b5998", "#6b46c1"]}
          style={styles.mainContent}
        >
          <View style={styles.winningsContainer}>
            <View style={styles.winningsHeader}>
              <FontAwesome5 name="medal" size={20} color="white" />
              <Text style={styles.winningsTitle}>My Winnings</Text>
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.amount}>₹92</Text>
              <TouchableOpacity style={styles.dropdownButton}>
                <Ionicons name="chevron-down" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Instantly</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* History section */}
        <View style={styles.historyContainer}>
          <>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>History</Text>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="logo-whatsapp" size={20} color="white" />
                <Text style={styles.contactButtonText}>Contact Us</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.historyList}
              showsVerticalScrollIndicator={false}
            >
              {renderHistoryItem(
                "Winnings added",
                "Jar Cashback Reward",
                "5.00",
                "13 Mar '25",
                "10:14pm"
              )}
              {renderHistoryItem(
                "Winnings used",
                "Gold Purchase",
                "3.00",
                "13 Mar '25",
                "10:14pm"
              )}
              {renderHistoryItem(
                "Winnings added",
                "Spin rewarded",
                "3.00",
                "13 Mar '25",
                "10:12pm"
              )}
              {renderHistoryItem(
                "Winnings added",
                "Spin Winnings",
                "1.00",
                "13 Mar '25",
                "10:13pm",
                true,
                "spin"
              )}

              <View style={{ height: 100 }} />
            </ScrollView>
          </>
        </View>
      </>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1a2e" />

      {/* <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={28} color="white" />
        </TouchableOpacity>
        <View style={styles.statusIcons}>
        </View>
      </View> */}

      {/* Main content */}
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: "#1e1a2e" },
          tabBarIndicatorStyle: { backgroundColor: "white", height: 3 },

          tabBarLabelStyle: {
            fontWeight: "bold",
            fontSize: 16,
            color: "white",
          },
          swipeEnabled: true,
          animationEnabled: true,
        }}
      >
        <Tab.Screen name="Gold" component={GoldScreen} />
        {/* <Tab.Screen name="Winnings" component={WinningScreen} /> */}
      </Tab.Navigator>
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#1e1a2e",
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3a3a4c",
    justifyContent: "center",
    alignItems: "center",
  },
  time: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  statusIcons: {
    flexDirection: "row",
    width: 70,
    justifyContent: "space-between",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#1e1a2e",
    borderBottomWidth: 3,
    borderBottomColor: "#1e1a2e",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "white",
  },
  tabText: {
    color: "#a8a8a8",
    fontSize: 16,
  },
  activeTabText: {
    color: "white",
    fontWeight: "bold",
  },
  mainContent: {
    padding: 20,
  },
  winningsContainer: {
    marginBottom: 20,
  },
  winningsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  winningsTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  amount: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#1e1a2e",
    fontSize: 16,
    fontWeight: "bold",
  },
  historyContainer: {
    flex: 1,
    backgroundColor: "#1e1a2e",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  historyTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  contactButton: {
    flexDirection: "row",
    backgroundColor: "rgba(37, 211, 102, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  contactButtonText: {
    color: "white",
    marginLeft: 5,
  },
  historyList: {
    flex: 1,
    // pb: 100,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2a2642",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  historyLeft: {
    flexDirection: "row",
    flex: 1,
  },
  coinContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1e1a2e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  coinIcon: {
    width: 30,
    height: 30,
  },
  historyDetails: {
    flex: 1,
  },
  historyDescription: {
    color: "#a8a8a8",
    fontSize: 14,
    marginBottom: 5,
  },
  historyStatus: {
    fontSize: 14,
  },
  historyRight: {
    alignItems: "flex-end",
  },
  historyAmount: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  historyTime: {
    color: "#a8a8a8",
    fontSize: 12,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#1e1a2e",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#3a3a4c",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activeNavItem: {
    borderTopWidth: 3,
    borderTopColor: "#ffffff",
    marginTop: -3,
  },
  navText: {
    color: "#a8a8a8",
    fontSize: 12,
    marginTop: 5,
  },
  activeNavText: {
    color: "#ffffff",
  },
  historyActions: {
    flexDirection: "row",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#33304a",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  filterText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 14,
  },
  contactText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 14,
  },
  transactionList: {
    // paddingHorizontal: 20,
    width: width - 40,
  },
  timeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#fff",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2a283a",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: "100%",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  transactionInfo: {
    justifyContent: "center",
  },
  transactionType: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  goldAmount: {
    color: "#8e8e9a",
    fontSize: 14,
    marginVertical: 2,
  },
  statusText: {
    color: "#4caf50",
    fontSize: 14,
  },
  transactionRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  date: {
    color: "#8e8e9a",
    fontSize: 12,
  },
  homeIndicator: {
    width: 120,
    height: 5,
    backgroundColor: "#fff",
    alignSelf: "center",
    borderRadius: 2.5,
    marginVertical: 8,
  },
});
