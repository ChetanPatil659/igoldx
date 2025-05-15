import { View, Text } from "react-native";
import React from "react";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";

export default function GoldCoin({amount}: {amount: string}) {
  return (
    <Svg width="50" height="50" viewBox="0 0 50 50" fill="none">
      <Circle cx="25" cy="25" r="25" fill="#DFB542" />
      <View style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center"}}>
      <Text style={{ color: "#000", fontSize: 11, fontWeight: '500'}}>₹{amount}</Text>
      </View>
      <Ellipse cx="22.5" cy="25" rx="22.5" ry="25" fill="#F9DD50" />
      <Path
        d="M37.5 25C37.5 34.1572 30.7418 41.5 22.5 41.5C14.2582 41.5 7.5 34.1572 7.5 25C7.5 15.8428 14.2582 8.5 22.5 8.5C30.7418 8.5 37.5 15.8428 37.5 25Z"
        fill="#FFEC8E"
        stroke="#E2B843"
      />
    </Svg>
  );
}
