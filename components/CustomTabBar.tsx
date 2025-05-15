import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  AntDesign,
  MaterialCommunityIcons,
  Feather,
  Foundation,
} from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  Keyframe,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const enteringAnimation = new Keyframe({
  from: {
    width: 0,
    overflow: "hidden",
  },
  to: {
    width: width * 0.8,
    overflow: "hidden",
  },
});

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const PRIMARY_COLOR = "#360568";
const SECONDARY_COLOR = "#fff";

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View
      style={{ width: width, justifyContent: "center", alignItems: "center" }}
    >
      <Animated.View
        layout={LinearTransition.springify().mass(0.5).stiffness(100)}
        style={styles.container}
        // entering={enteringAnimation.duration(15000)}
      >
        {state.routes.map((route, index) => {
          if (["_sitemap", "+not-found"].includes(route.name)) return null;

          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <AnimatedTouchableOpacity
              layout={LinearTransition.springify().mass(0.5).stiffness(100)}
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabItem,
                {
                  backgroundColor: isFocused ? SECONDARY_COLOR : "transparent",
                },
              ]}
            >
              {getIconByRouteName(
                route.name,
                isFocused ? PRIMARY_COLOR : SECONDARY_COLOR
              )}
              {isFocused && (
                <Animated.Text
                  entering={FadeIn.duration(200)}
                  exiting={FadeOut.duration(200)}
                  style={styles.text}
                >
                  {label as string}
                </Animated.Text>
              )}
            </AnimatedTouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );

  function getIconByRouteName(routeName: string, color: string) {
    switch (routeName) {
      case "index":
        return <Feather name="home" size={18} color={color} />;
      case "Transaction":
        return <Foundation name="book" size={18} color={color} />;
      case "Account":
        return (
          <MaterialCommunityIcons name="account" size={18} color={color} />
        );
      default:
        return <Feather name="home" size={18} color={color} />;
    }
  }
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    width: "80%",
    alignSelf: "center",
    bottom: 20,
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tabItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 36,
    paddingHorizontal: 13,
    borderRadius: 30,
  },
  text: {
    color: PRIMARY_COLOR,
    marginLeft: 8,
    fontWeight: "500",
  },
});

export default CustomTabBar;
