// import {
//   PixelRatio,
//   StyleSheet,
//   Text,
//   View,
//   useWindowDimensions,
// } from "react-native";
// import React, { useRef, useState } from "react";
// import data from "@/components/src/data/data";
// import RenderItem from "@/components/src/components/RenderItem";
// import CustomButton from "@/components/src/components/CustomButton";
// import {
//   Canvas,
//   Circle,
//   Group,
//   Image,
//   Mask,
//   SkImage,
//   makeImageFromView,
// } from "@shopify/react-native-skia";
// import { useSharedValue, withTiming } from "react-native-reanimated";
// import Pagination from "@/components/src/components/Pagination";
// import { useNavigation } from "@react-navigation/native";

// const OnboardingScreen = () => {
//   const navigation = useNavigation();

//   const pd = PixelRatio.get();
//   const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
//   const ref = useRef(null);
//   const [active, setActive] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [overlay, setOverlay] = useState<SkImage | null>(null);
//   const mask = useSharedValue(0);
//   const buttonVal = useSharedValue(0);

//   const wait = async (ms: number) =>
//     new Promise((resolve) => setTimeout(resolve, ms));

//   const handlePress = async () => {
//     if (currentIndex === data.length - 1 && !active) {
//       console.log("END");
//       // navigation.navigate("Home");
//       // setLoggedIn(true);
//       return;
//     }
//     if (!active) {
//       console.log("active");
//       // setActive(true);

//       //@ts-ignore
//       const snapshot1 = await makeImageFromView(ref);
//       if (!snapshot1) {
//         console.error("makeImageFromView returned null or undefined");
//         return;
//       }
//       setOverlay(snapshot1);
//       console.log(overlay);
//       // await wait(80);
//       setCurrentIndex((prev) => prev + 1);
//       mask.value = withTiming(SCREEN_HEIGHT, { duration: 1000 });
//       buttonVal.value = withTiming(buttonVal.value + SCREEN_HEIGHT);
//       // await wait(1000);
//       setOverlay(null);
//       mask.value = 0;
//       setActive(false);
//     }
//   };
//   return (
//     <View style={styles.container}>
//       <View ref={ref} collapsable={false}>
//         {data.map((item, index) => {
//           return (
//             currentIndex === index && <RenderItem item={item} key={index} />
//           );
//         })}
//       </View>
//       {overlay && (
//         // <Canvas style={StyleSheet.absoluteFill} pointerEvents={"none"}>
//         //   <Mask
//         //     mode="luminance"
//         //     mask={
//         //       <Group>
//         //         <Circle
//         //           cx={SCREEN_WIDTH / 2}
//         //           cy={SCREEN_HEIGHT - 160}
//         //           r={SCREEN_HEIGHT}
//         //           color="white"
//         //         />
//         //         <Circle
//         //           cx={SCREEN_WIDTH / 2}
//         //           cy={SCREEN_HEIGHT - 160}
//         //           r={mask}
//         //           color="black"
//         //         />
//         //       </Group>
//         //     }
//         //   >
//         //     <Image
//         //       image={overlay}
//         //       x={0}
//         //       y={0}
//         //       width={overlay.width ? overlay.width() / pd : 0}
//         //       height={overlay.height ? overlay.height() / pd : 0}
//         //     />
//         //   </Mask>
//         // </Canvas>
//         <></>
//       )}
//       <CustomButton handlePress={handlePress} buttonVal={buttonVal} />
//       <Pagination data={data} buttonVal={buttonVal} />
//     </View>
//   );
// };

// export default OnboardingScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//   },
//   credit: {
//     position: "absolute",
//     bottom: 22,
//     color: "white",
//   },
// });
