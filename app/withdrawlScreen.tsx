import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WithdrawalOptionsScreen() {
  const navigation = useNavigation();
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
        <Text style={styles.headerTitle}>Withdrawal Options</Text>
      </View>

      {/* Bank Account Option */}
      <View style={[styles.optionCard, { padding: 0 }]}>
        <View style={[styles.optionRow, { padding: 16 }]}>
          <View style={styles.iconContainer}>
            <FontAwesome5
              name="money-bill"
              size={24}
              color="white"
              style={styles.iconMoney}
            />
          </View>

          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Withdraw savings in</Text>
            <Text style={styles.optionSubtitle}>Bank Account</Text>
          </View>

          <Ionicons name="chevron-forward" size={24} color="#aaa" />
        </View>

        {/* Payment options */}
        <View style={[styles.paymentOptions, { paddingHorizontal: 16 }]}>
          <View style={styles.paymentOption}>
            <Text style={styles.paymentOptionText}>PhonePe</Text>
          </View>

          <View style={styles.paymentOption}>
            <Text style={styles.paymentOptionText}>Paytm</Text>
          </View>

          <View style={styles.paymentOption}>
            <Text style={styles.paymentOptionText}>Google Pay</Text>
          </View>
        </View>

        {/* Withdrawal notice */}
        <View
          style={[
            styles.noticeContainer,
            { padding: 16, backgroundColor: "#605977" },
          ]}
        >
          <Ionicons name="chatbox-outline" size={18} color="white" />
          <Text style={styles.noticeText}>
            You can withdraw once in 24 hours
          </Text>
        </View>
        <Text style={[styles.securityText, { padding: 8 }]}>
          * Due to security reasons
        </Text>
      </View>

      {/* Gold Coins Option */}
      <View style={styles.tagContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Low Making Charges on Coins</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.optionCard}>
        <View style={styles.optionRow}>
          <Image
            source={require("@/assets/images/goldcoin.png")}
            style={styles.goldCoinImage}
            // Fallback if image isn't available
            defaultSource={require("@/assets/images/goldcoin.png")}
          />

          <View style={styles.optionTextContainer}>
            <Text style={styles.optionSubtitle}>24kt Pure Gold Coins</Text>
            <Text style={styles.optionInfo}>(Use your Jar Savings)</Text>
          </View>

          <Ionicons name="chevron-forward" size={24} color="#aaa" />
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <FontAwesome5 name="coins" size={16} color="#aaa" />
            <Text style={styles.featureText}>24K Gold</Text>
          </View>

          <View style={styles.featureDot} />

          <View style={styles.feature}>
            <FontAwesome5 name="truck" size={16} color="#aaa" />
            <Text style={styles.featureText}>Home delivery</Text>
          </View>

          <View style={styles.featureDot} />

          <View style={styles.feature}>
            <MaterialCommunityIcons
              name="shield-check"
              size={16}
              color="#aaa"
            />
            <Text style={styles.featureText}>100% secure</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Jewellery Option */}
      <View style={styles.tagContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Upto ₹20000 OFF</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.optionCard}>
        <View style={styles.optionRow}>
          <View style={styles.jewelIcon}>
            <FontAwesome5 name="gem" size={24} color="white" />
          </View>

          <View style={styles.optionTextContainer}>
            <Text style={styles.optionSubtitle}>
              Biggest Discounts on Jewellery
            </Text>
            <Text style={styles.optionInfo}>(Use your Jar Savings)</Text>
          </View>

          <Ionicons name="chevron-forward" size={24} color="#aaa" />
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <FontAwesome5 name="certificate" size={16} color="#aaa" />
            <Text style={styles.featureText}>BIS Hallmarked</Text>
          </View>

          <View style={styles.featureDot} />

          <View style={styles.feature}>
            <MaterialCommunityIcons name="refresh" size={16} color="#aaa" />
            <Text style={styles.featureText}>3 days return</Text>
          </View>

          <View style={styles.featureDot} />

          <View style={styles.feature}>
            <FontAwesome5 name="tag" size={16} color="#aaa" />
            <Text style={styles.featureText}>Up to ₹20000 off</Text>
          </View>
        </View>
      </TouchableOpacity>
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
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  optionCard: {
    backgroundColor: "#3b325a",
    borderRadius: 12,
    marginHorizontal: 16,
    // marginVertical: 8,
    padding: 16,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#8b5cf6",
    justifyContent: "center",
    alignItems: "center",
  },
  iconMoney: {
    backgroundColor: "#8b5cf6",
    padding: 10,
    borderRadius: 10,
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    color: "#ccc",
    fontSize: 14,
  },
  optionSubtitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  optionInfo: {
    color: "#aaa",
    fontSize: 14,
  },
  paymentOptions: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 12,
  },
  paymentOption: {
    marginRight: 24,
  },
  paymentOptionText: {
    color: "white",
    fontSize: 14,
  },
  noticeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#332a52",
    padding: 8,
    borderRadius: 8,
  },
  noticeText: {
    color: "white",
    marginLeft: 8,
    fontSize: 14,
  },
  securityText: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  tagContainer: {
    marginLeft: 16,
    marginTop: 16,
    // marginBottom: 8,
  },
  tag: {
    backgroundColor: "#8b5cf6",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderEndEndRadius: 0,
    borderStartEndRadius: 0,
    marginLeft: 10,
  },
  tagText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  goldCoinImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  jewelIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#8b5cf6",
    justifyContent: "center",
    alignItems: "center",
  },
  featuresContainer: {
    flexDirection: "row",
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureText: {
    color: "#aaa",
    fontSize: 12,
    marginLeft: 4,
  },
  featureDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#aaa",
    marginHorizontal: 8,
  },
});
