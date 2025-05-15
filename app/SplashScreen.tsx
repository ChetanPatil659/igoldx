import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "@/store/action";
import { fetchBalanceApi, fetchUserApi } from "@/api/auth";

export default function SplashScreen() {
  const navigation = useNavigation();
  const auth = useSelector((state: any) => state.auth);
  const {user} = useSelector((state: any) => state.user);
  const {token} = useSelector((state: any) => state.token);
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(async() => {
      if (auth.isAuthenticated) {
        let res = await fetchBalanceApi(token);
        let userRes = await fetchUserApi(token);

        dispatch(setUser(userRes.data));

        // dispatch(logout());
        if(user?.name !== ""){
          navigation.replace("Main");
        }else{
          navigation.replace("CompleteProfile");
        }
      } else {
        navigation.replace("Login");
      }
    }, 1000);
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>SplashScreen</Text>
    </View>
  );
}
