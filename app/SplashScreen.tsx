import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "@/store/action";
import { fetchBalanceApi, fetchUserApi } from "@/api/auth";

export default function SplashScreen() {
  const navigation = useNavigation();
  const auth = useSelector((state: any) => state.auth);
  const { user } = useSelector((state: any) => state.user);
  const { token } = useSelector((state: any) => state.token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    if (auth.isAuthenticated) {
      let res = await fetchBalanceApi(token);
      let userRes = await fetchUserApi(token);

      dispatch(setUser(userRes.data));

      // dispatch(logout());
      if (user?.name !== "") {
        setLoading(false);
        navigation.replace("Main");
      } else {
        setLoading(false);
        navigation.replace("CompleteProfile");
      }
    } else {
      setLoading(false);
      navigation.replace("Login");
    }
  };
  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>SplashScreen</Text>
    </View>
  );
}
