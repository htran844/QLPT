import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { ScrollView } from "react-native";
import { getData } from "../asyncStore";
import db from "../firestore";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

const Bill = ({ navigation, route }) => {
  const [bills, setBills] = useState([]);
  const getBillFireStore = async () => {
    const uid = await getData("uid");
    const roomid = route.params.roomid;
    if (!uid || !roomid) {
      return;
    }
    const roomsRef = collection(db, "bills");
    const q = query(
      roomsRef,
      orderBy("year"),
      orderBy("month"),
      where("roomid", "==", roomid)
    );
    const querySnapshot = await getDocs(q);
    let arr = [];
    querySnapshot.forEach((doc) => {
      arr.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    if (querySnapshot) {
      setBills(arr);
    }
    console.log("querySnapshot", arr);
  };
  useEffect(() => {
    getBillFireStore();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Danh sách hóa đơn"
        addIcon={true}
        backIcon={true}
        backIconPress={() => {
          navigation.goBack();
        }}
        rightIconPress={() => {
          navigation.navigate("AddBill", {
            roomid: route.params.roomid,
            price_room: route.params.price,
            reLoad: ()=>{getBillFireStore()}
          });
        }}
      />
      <ScrollView>
        <View
          style={{
            flex: 1,
            padding: 20,
          }}
        >
          <View style={{ flexDirection: "column" }}>
            {bills.length > 0 &&
              bills.map((item) => {
                return (
                  <Pressable
                    key={item.id}
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      marginVertical: 6,
                      backgroundColor: "#2B4BF2",
                      borderRadius: 8,
                    }}
                    onPress={() => {
                      navigation.navigate("BillDetail", {
                        billid: item.id,
                        roomid: route.params.roomid,
                        reloadBill: () => {
                          getBillFireStore();
                        },
                        price_room: route.params.price,
                      });
                    }}
                  >
                    <Text
                      style={{ color: "white" }}
                    >{`Tháng ${item.month} Năm ${item.year}`}</Text>
                  </Pressable>
                );
              })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Bill;
