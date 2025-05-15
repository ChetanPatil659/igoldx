import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const navigation = useNavigation();
  // Notification data
  const notifications = [
    {
      id: 1,
      type: "Auto-Save",
      title: "Auto-Save",
      message:
        "Yay!! ₹10.0 has been auto saved today. We have successfully added gold to your locker.",
      time: "14 Mar '25, 08:06am",
      icon: "building",
      color: "#3b82f6",
    },
    {
      id: 2,
      type: "ManualPurchase",
      title: "Manual Gold Purchase",
      message:
        "Yay! You got 5 winnings on successful gold purchase of 0.0112 gms.",
      time: "13 Mar '25, 10:14pm",
      icon: "coins",
      color: "#f59e0b",
    },
    {
      id: 3,
      type: "ShubhMuhurat",
      title: "Shubh Muhurat",
      message:
        "Yay! Your Shubh Muhurat purchase of 0.0112 gms of gold is successfully added to your locker.",
      time: "13 Mar '25, 10:14pm",
      icon: "circle",
      color: "#8b5cf6",
    },
    {
      id: 4,
      type: "SpinWinnings",
      title: "Spin Winnings",
      message:
        "Congratulations! ₹1.0 has been added to your Jar winnings for spinning the bottle.",
      time: "13 Mar '25, 10:13pm",
      icon: "fan",
      color: "#3b82f6",
    },
    {
      id: 5,
      type: "SpinWinnings",
      title: "Spin Winnings",
      message:
        "Congratulations! ₹1.0 has been added to your Jar winnings for spinning the bottle.",
      time: "13 Mar '25, 10:13pm",
      icon: "fan",
      color: "#3b82f6",
    },
    {
      id: 6,
      type: "SpinWinnings",
      title: "Spin Winnings",
      message:
        "Congratulations! ₹1.0 has been added to your Jar winnings for spinning the bottle.",
      time: "13 Mar '25, 10:13pm",
      icon: "fan",
      color: "#3b82f6",
    },
    {
      id: 7,
      type: "SpinWinnings",
      title: "Spin Winnings",
      message:
        "Congratulations! ₹1.0 has been added to your Jar winnings for spinning the bottle.",
      time: "13 Mar '25, 10:13pm",
      icon: "fan",
      color: "#3b82f6",
    },
    {
      id: 8,
      type: "SpinWinnings",
      title: "Spin Winnings",
      message:
        "Congratulations! ₹3.0 has been added to your Jar winnings for spinning the bottle.",
      time: "13 Mar '25, 10:12pm",
      icon: "fan",
      color: "#3b82f6",
    },
  ];

  // Render each notification item
  const renderNotificationItem = (item: any) => {
    return (
      <TouchableOpacity key={item.id} style={styles.notificationItem}>
        <View
          style={[styles.iconContainer, { backgroundColor: item.color + "22" }]}
        >
          {item.type === "Auto-Save" && (
            <FontAwesome5 name="building" size={24} color={item.color} />
          )}
          {item.type === "ManualPurchase" && (
            <FontAwesome5 name="coins" size={24} color={item.color} />
          )}
          {item.type === "ShubhMuhurat" && (
            <View style={[styles.circleIcon, { backgroundColor: item.color }]}>
              <FontAwesome5 name="circle" size={18} color="#fff8e1" />
            </View>
          )}
          {item.type === "SpinWinnings" && (
            <MaterialCommunityIcons name="fan" size={28} color={item.color} />
          )}
        </View>

        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#aaa"
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.notificationsList}>
        {notifications.map((notification) =>
          renderNotificationItem(notification)
        )}

        {/* Bottom padding for better scrolling */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d2644",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3b325a",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3b325a",
    position: "relative",
  },
  leftIndicator: {
    position: "absolute",
    left: 0,
    top: "50%",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#3b82f6",
    marginTop: -2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
    marginRight: 12,
  },
  circleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
    paddingRight: 12,
  },
  notificationTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  notificationMessage: {
    color: "#cccccc",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    color: "#999999",
    fontSize: 12,
  },
  arrowIcon: {
    marginRight: 16,
  },
});
