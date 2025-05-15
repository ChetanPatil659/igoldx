import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

export default function YourFirstGoldCoin() {
  return (
    <Svg width="266" height="26" viewBox="0 0 266 26" fill="none">
      <Path
        d="M13.5 11.5C7.9 20.7 2.16667 25 0 26H265.5C263.167 24.1667 257.5 18.5 253.5 10.5C249.5 2.5 242.5 0.166667 239.5 0H36C22.5 0 20.5 0 13.5 11.5Z"
        fill="#482B9D"
      />
      <View
        style={{
          width: "100%",
          height: "100%",
          paddingHorizontal: 25,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}>
          Your First Gold Coin
        </Text>

        <View
          style={{
            flexDirection: "row",
            // justifyContent: "space-between",
            alignItems: "center",
            gap: 4
          }}
        >
          <Image
            source={require("@/assets/images/goldcoin.png")}
            style={{ width: 20, height: 20 }}
          />
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "20%" }]} />
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </View>
        </View>
      </View>
    </Svg>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 15,
  },
  progressTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressText: {
    color: "#fff",
    fontSize: 16,
  },
  coinIcon: {
    marginLeft: 8,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginTop: 10,
  },
  progressBar: {
    // flex: 1,
    width: 50,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    marginRight: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 3,
  },
});
