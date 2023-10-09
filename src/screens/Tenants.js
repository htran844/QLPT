import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import Dropdown from "../components/Dropdown";
import TextInputCustom from "../components/TextInput";
import ButtonCustom from "../components/Button";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { getData } from "../asyncStore";
import db from "../firestore";

const Tenants = ({ navigation, route }) => {
  const DATA = [
    { name: "Trần Tuấn Vũ", address: "Tân Thịnh Thái Nguyên", status: 1 },
    { name: "Trần Tuấn Vũ", address: "Tân Thịnh Thái Nguyên", status: 0 },
    { name: "Trần Tuấn Vũ", address: "Tân Thịnh Thái Nguyên", status: 0 },
    { name: "Trần Tuấn Vũ", address: "Tân Thịnh Thái Nguyên", status: 0 },
  ];
  const [tenants, setTenants] = useState([]);
  useEffect(() => {
    getTenants();
  }, []);
  const getTenants = async () => {
    const uid = await getData("uid");
    if (!uid) {
      return;
    }
    const tenantsRef = collection(db, "tenants");
    const q = query(tenantsRef, orderBy("status"), where("roomid", "==", route.params.roomid));
    const querySnapshot = await getDocs(q);
    let arr = [];
    querySnapshot.forEach((doc) => {
      arr.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    if (querySnapshot) {
      setTenants(arr);
    }
    console.log("querySnapshot", arr);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Quản lý người thuê phòng"
        addIcon={true}
        backIcon={true}
        rightIconPress={() => {
          navigation.navigate("AddTenants", { roomid: route.params.roomid, onGoBack: ()=>{getTenants()} });
        }}
        backIconPress={() => {
          navigation.goBack();
          route.params.reLoad()
        }}
      />
      <View
        style={{
          flex: 1,
          padding: 20,
        }}
      >
        {tenants.length > 0 &&
          tenants.map((item, index) => {
            return (
              <Pressable
                key={index}
                style={{
                  backgroundColor: "#2B4BF2",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginVertical: 6,
                  borderRadius: 8,
                  paddingVertical: 8,
                }}
                onPress={() => {
                  navigation.navigate("DetailTenants", {id: item.id, reLoad: ()=>{getTenants()}});
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name={"account-outline"}
                    size={40}
                    color={"white"}
                    style={{ marginHorizontal: 4 }}
                  />
                  <View style={{ marginHorizontal: 10 }}>
                    <Text
                      style={{
                        textTransform: "uppercase",
                        fontSize: 12,
                        color: "white",
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text style={{ fontSize: 8, color: "white" }}>
                      {item.address}
                    </Text>
                  </View>
                </View>
                {item.status == true ? (
                  <Text
                    style={{ fontSize: 8, color: "white", marginRight: 20 }}
                  >
                    Đại diện thuê
                  </Text>
                ) : (
                  <Text></Text>
                )}
              </Pressable>
            );
          })}
      </View>
    </SafeAreaView>
  );
};

export default Tenants;
