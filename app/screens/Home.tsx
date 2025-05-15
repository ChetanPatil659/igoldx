import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  FontAwesome5,
  Feather,
  FontAwesome6,
} from "@expo/vector-icons";
import YourFirstGoldCoin from "@/components/ui/YourFirstGoldCoin";
import GoldCoin from "@/components/ui/GoldCoin";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const { width } = Dimensions.get("window");

const Home = () => {
  const [isActiveSavings, setIsActiveSavings] = React.useState(0);
  const navigation = useNavigation<any>();
  const userState = useSelector((state: any) => state?.user);
  const user = userState?.user || { name: 'User' }; // Provide default value
  let amountMap = ['10', '20', '50', '100'];
  const [amount, setAmount] = useState(amountMap[0]);
  // Animation state for GoldCoin drag
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const dragWidth = width - 120; // 120 = coin + locker + paddings

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((event: any) => {
      const x = event.translationX;
      translateX.value = x < 0 ? 0 : x > dragWidth ? dragWidth : x;
      scale.value = 1 - (translateX.value / dragWidth) * 0.5;
    })
    .onEnd((event: any) => {
      const x = event.translationX;
      if (x > dragWidth * 0.8) {
        scale.value = withTiming(0.5, { duration: 200 });
        translateX.value = withTiming(dragWidth, { duration: 200 }, (finished) => {
          if (finished) {
            runOnJS(navigation.navigate)("GoldSavings", {
              amount: amount,
            });
            translateX.value = 0;
            scale.value = 1;
          }
        });
      } else {
        translateX.value = withTiming(0);
        scale.value = withTiming(1);
      }
    });

  // Add error boundary
  if (!userState) {
    return (
      <SafeAreaView edges={["top"]} style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'white' }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1a2e" />
      {
      <ScrollView style={{flex: 1}}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              //@ts-ignore
              navigation.navigate("Account");
            }}
            style={styles.profileButton}
          >
            <Ionicons name="person-outline" size={22} color="#fff" />
            {/* <Text>Hello</Text> */}
          </TouchableOpacity>

          <View style={styles.notificationContainer}>
            <LinearGradient
              colors={["#2D1A4A", "#1D0F30"]}
              style={styles.notificationBanner}
            >
              <FontAwesome5 name="chart-line" size={16} color="#FFD700" />
              <Text style={styles.notificationText}>Gold Buy Price</Text>
              <Text style={styles.notificationHighlight}>Dropped</Text>
            </LinearGradient>
          </View>

          <View style={styles.headerRightIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                //@ts-ignore
                navigation.navigate("Notifications");
              }}
            >
              <Ionicons name="notifications-outline" size={22} color="#fff" />
              {/* <Text>Hello</Text> */}
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <View style={{flexDirection: "row", alignItems: "flex-end", gap: 10}}>
            <Text style={styles.helloText}>Hello,</Text>
            <Text style={styles.nameText}>{user?.name}</Text>
          </View>
          {/* <View style={styles.cardsContainer}>
            <Image
              source={require("@/assets/images/magicHat.png")}
              style={styles.cardIcon}
            />
            <Text style={styles.cardsText}>You got</Text>
            <Text style={styles.cardsCount}>4/5 cards</Text>
          </View> */}
        </View>

        {/* Savings Card */}


        <View style={{ marginTop: 20, alignItems: "center", width: width }}>
          <YourFirstGoldCoin />
          <View style={styles.savingsCardContainer}>
            <View
              // colors={["#3A1F65", "#5624A0"]}
              style={styles.savingsCard}
            >
              <LinearGradient
                colors={["#5624A0", "#3A1F65"]}
                style={{
                  borderWidth: 1,
                  borderColor: "#FF6B00",
                  padding: 15,
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                <View style={styles.savingsHeader}>
                  <Text style={styles.savingsTitle}>Savings in Gold</Text>
                </View>
                <TouchableOpacity style={styles.detailsButton}>
                  <Text style={styles.detailsText}>See Details</Text>
                  <Ionicons name="chevron-forward" size={12} color="#fff" />
                </TouchableOpacity>

                <View style={styles.savingsContent}>
                  <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <Text style={styles.amountText}>{user?.balance}</Text>
                    <Text style={styles.gramText}>₹{user?.sellableBalance}</Text>
                  </View>

                  <View style={styles.goldImageContainer}>
                    <Image
                      source={require("@/assets/images/goldBox.png")}
                      style={styles.goldImage}
                      onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
                      defaultSource={require("@/assets/images/goldBox.png")}
                    />
                  </View>
                </View>

                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      //@ts-ignore
                      navigation.navigate("withdrawlScreen");
                    }}
                    style={styles.withdrawButton}
                  >
                    <Text style={styles.withdrawText}>WITHDRAW</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => {
                      //@ts-ignore
                      navigation.navigate("GoldSavings");
                    }}
                  >
                    <Feather name="zap" size={16} color="#3A1F65" />
                    <Text style={styles.saveText}>Save Instantly</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.shieldContainer}>
              <LinearGradient
                colors={["rgba(0,0,0,0.1)", "#FFA500"]}
                start={{ x: 0, y: 0 }} // Left side
                end={{ x: 1, y: 0 }} // Right side
                style={styles.shieldGradientLine}
              />

              <LinearGradient
                colors={["#FFD700", "#FFA500"]}
                style={styles.shieldGradient}
              >
                <FontAwesome5 name="shield-alt" size={18} color="#3A1F65" />
              </LinearGradient>
              <LinearGradient
                colors={["#FFA500", "rgba(0,0,0,0.1)"]}
                start={{ x: 0, y: 0 }} // Left side
                end={{ x: 1, y: 0 }} // Right side
                style={styles.shieldGradientLine}
              />
            </View>
          </View>
        </View>

        
        

        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
            Quick to Save
          </Text>
          <LinearGradient
            colors={["#383252", "#4E466E"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{
              marginTop: 10,
              width: "100%",
              borderRadius: 10,
              padding: 15,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Image
                source={require("@/assets/images/goldCoins.png")}
                style={{ width: 25, height: 25 }}
              />
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: "bold",
                }}
              >
                Swipe to Save in gold
              </Text>
            </View>
            <Text style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              Save ₹{amount} in gold instantly
            </Text>

            <View
              style={{
                marginTop: 20,
                height: 50,
                width: "100%",
                backgroundColor: "#2E2B42",
                borderRadius: 25,
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                paddingRight: 15,
              }}
            >
              <GestureDetector gesture={panGesture}>
                <Animated.View style={[animatedStyle, { zIndex: 2 }]}>
                  <GoldCoin amount={amount}/>
                </Animated.View>
              </GestureDetector>
              <Image
                source={require("@/assets/images/locker.png")}
                style={{ width: 40, height: 40 }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 20,
                width: "100%",
                gap: 4,
              }}
            >
              {amountMap.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setAmount(item)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 40,
                    backgroundColor: "#2E2B42",
                    borderRadius: 5,
                    flex: 1,
                    borderColor: "#5C38CC",
                    borderWidth: 1,
                  }}
                >
                  <Text style={{ color: "white" }}>₹{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </View>

        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
            Automate Your Savings
          </Text>
          <View
            style={{
              marginTop: 10,
              backgroundColor: "#ebf2fa",
              borderRadius: 15,
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 20,
                  padding: 15,
                }}
              >
                <Image
                  source={require("@/assets/images/calender.png")}
                  style={{ width: 40, height: 40 }}
                />
                <Text
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: 16,
                    width: "70%",
                  }}
                  numberOfLines={2}
                >
                  <Text style={{ color: "purple", fontWeight: "bold" }}>
                    Save Daily
                  </Text>{" "}
                  to fulfil every small and big goal
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  margin: 15,
                  padding: 10,
                  backgroundColor: "#f2ebfb",
                  borderRadius: 12,
                  borderColor: "rgba(46, 13, 96, 0.3)",
                  borderWidth: 1.5,
                }}
              >
                {["Daily", "Weekly", "Monthly"].map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 40,
                      backgroundColor:
                        isActiveSavings === idx ? "#fff" : "transparent",
                      borderRadius: 5,
                      flex: 1,
                      borderColor: "purple",
                      borderWidth: isActiveSavings === idx ? 1.5 : 0,
                    }}
                    onPress={() => setIsActiveSavings(idx)}
                  >
                    <Text
                      style={
                        idx === isActiveSavings
                          ? { color: "black", fontWeight: "bold" }
                          : { color: "gray" }
                      }
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View
              style={{
                backgroundColor: "#613dc1",
                borderRadius: 15,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 15,
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "60%" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#360568"
                    />
                    <Text
                      style={{
                        color: "#360568",
                        fontWeight: "bold",
                        fontSize: 14,
                      }}
                    >
                      Active 20 daily
                    </Text>
                  </View>
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                  >
                    Your emergency savings will grow upto 14% in 1 year
                  </Text>
                </View>
                <Image
                  source={require("@/assets/images/emergency.png")}
                  style={{ width: 100, height: 100 }}
                />
              </View>
              <View style={{ padding: 15, backgroundColor: "#45147e" }}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 50,
                    backgroundColor: "#fff",
                    borderRadius: 5,
                    flex: 1,
                    gap: 8,
                  }}
                >
                  <Text
                    style={{ color: "black", fontWeight: "bold", fontSize: 16 }}
                  >
                    Increase daily Savings
                  </Text>
                  <FontAwesome6
                    name="arrow-right-long"
                    size={16}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
            Recommendation
          </Text>
          <Image
            source={require("@/assets/images/recommendation.png")}
            style={{ objectFit: "contain", height: 150, width: "100%" }}
          />
        </View>

        <View style={{ marginTop: 20, paddingHorizontal: 20, width: "100%" }}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
            Quick Actions
          </Text>
          <ScrollView horizontal style={{ width: "100%" }}>
            <FlatList
              data={[
                "Refer and Earn",
                "Weekly Magic",
                "Spins",
                "Offers",
                "Spend Tracker",
                "More",
              ]}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginTop: 10,
              }}
              contentContainerStyle={{ columnGap: 20, width: width - 40 }}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: item == "More" ? "#916dd5" : "#573d7f",
                    borderRadius: 15,
                    overflow: "hidden",
                    width: (width - 40) * 0.315,

                    // marginHorizontal: 'auto',
                    aspectRatio: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  {item !== "More" && (
                    <Image
                      source={require("@/assets/images/gift.png")}
                      style={{ width: 50, height: 50 }}
                    />
                  )}
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: item == "More" ? 16 : 12,
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </ScrollView>
        </View>

        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
            Know More
          </Text>

          <FlatList
            data={[
              "Refer and Earn",
              "Weekly Magic",
              "Spins",
              "Offers",
              "Spend Tracker",
              "More",
            ]}
            horizontal
            contentContainerStyle={{ gap: 20, marginTop: 10 }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                style={{
                  // backgroundColor: "#573d7f",
                  overflow: "hidden",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <Image
                  source={{
                    uri: "https://img.freepik.com/free-vector/modern-youtube-thumbnail-with-comic-art-background_1361-2738.jpg?t=st=1741633368~exp=1741636968~hmac=518f533e78b95eee85a73e1aecf5690312147ae8bdcc9f8aae21f6ef98ca74d5&w=2000",
                  }}
                  style={{
                    width: 200,
                    // marginHorizontal: 'auto',
                    aspectRatio: 2 / 1,
                  }}
                />
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 12,
                    width: 200,
                    marginTop: 4,
                  }}
                  numberOfLines={1}
                >
                  What is the process of daily saving in iGold
                </Text>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: "bold",
                    fontSize: 12,
                    width: 200,
                  }}
                  numberOfLines={1}
                >
                  1 min 1 sec
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={{ marginTop: 100 }} />
        

      </ScrollView>
}
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1a2e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContainer: {
    flex: 1,
    alignItems: "center",
  },
  notificationBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1D0F30",
  },
  notificationText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
  },
  notificationHighlight: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 14,
  },
  headerRightIcons: {
    flexDirection: "row",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  greetingSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  helloText: {
    color: "#fff",
    fontSize: 18,
  },
  nameText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  cardsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  cardIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  cardsText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 5,
  },
  cardsCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 3,
  },
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
    marginTop: 10,
  },
  progressBar: {
    flex: 1,
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
  savingsCardContainer: {
    // marginHorizontal: 20,
    // marginTop: 20,
    position: "relative",
    paddingBottom: 15,
    width: "100%",
  },
  savingsCard: {
    overflow: "hidden",
    borderRadius: 35,
    padding: 10,
    borderWidth: 10,
    backgroundColor: "#3A1F65",
    borderColor: "#8A2BE2",
  },
  savingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  savingsTitle: {
    color: "#fff",
    fontSize: 12,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#25135F",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomStartRadius: 15,
    position: "absolute",
    top: 0,
    right: 0,
    gap: 5,
  },
  detailsText: {
    color: "#fff",
    fontSize: 12,
  },
  savingsContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currencySymbol: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  amountText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  gramText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginLeft: 5,
    alignSelf: "flex-end",
    marginBottom: 5,
  },
  goldImageContainer: {
    alignItems: "center",
  },
  karatText: {
    color: "#FFD700",
    fontSize: 12,
    marginBottom: 5,
  },
  goldImage: {
    width: 50,
    height: 50,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  withdrawButton: {
    flex: 1,
    backgroundColor: "#8A2BE2",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 10,
  },
  withdrawText: {
    color: "#fff",
    fontWeight: "bold",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  saveText: {
    color: "#3A1F65",
    fontWeight: "bold",
    marginLeft: 5,
  },
  shieldContainer: {
    position: "absolute",
    bottom: -7,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  shieldGradient: {
    width: 36,
    height: 36,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 3,
    // borderColor: "#2D1A4A",
  },
  shieldGradientLine: {
    width: 100,
    height: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  spinSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  spinHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spinTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  spinsRemaining: {
    color: "#fff",
    fontSize: 14,
  },
  spinCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
    alignItems: "center",
  },
  wheelContainer: {
    marginRight: 15,
  },
  wheelImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  spinTextContainer: {
    flex: 1,
  },
  spinCardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  spinReward: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  promoContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 80,
  },
  promoText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  promoBar: {
    height: 8,
    backgroundColor: "#8A2BE2",
    borderRadius: 4,
    marginTop: 10,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#001845",
    paddingVertical: 10,
    paddingBottom: 25,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    marginHorizontal: 10,
    borderRadius: 20,
    borderColor: "#3c096c",
    borderWidth: 1.5,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
  navTextInactive: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    marginTop: 4,
  },
});

export default Home;



