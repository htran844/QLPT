import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import db from "../firestore";
import { getData } from "../asyncStore";

const Room = ({ navigation }) => {

  const [rooms, setRooms] = useState([]);
  const getRoomsFireStore = async () => {
    const uid = await getData("uid");
    if (!uid) {
      return;
    }
    const roomsRef = collection(db, "rooms");
    const q = query(roomsRef, orderBy("name"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    let arr = [];
    querySnapshot.forEach((doc) => {
      arr.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    if (querySnapshot) {
      setRooms(arr);
    }
    console.log("querySnapshot", arr);
  };
  useEffect(() => {
    getRoomsFireStore();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Quản lý phòng"
        addIcon={true}
        rightIconPress={() => {
          navigation.navigate("AddRoom", {reLoad: ()=>{getRoomsFireStore()}});
        }}
      />
      <View
        style={{
          flex: 1,
          marginHorizontal: 16,
          marginVertical: 16,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            marginHorizontal: 16,
            marginVertical: 16,
            flexDirection: "row",
            flexWrap: "wrap",
            alignSelf: "flex-start",
          }}
        >
          {rooms.length > 0 &&
            rooms.map((item, index) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={{
                    backgroundColor:
                      item.status == false ? "#475372" : "#29B6F6",
                    borderRadius: 10,
                    width: 90,
                    height: 90,
                    padding: 4,
                    margin: 8,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    navigation.navigate("DetailRoom", {id: item.id, reloadRoom: ()=>{getRoomsFireStore()}});
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                   Phòng {item.name}
                  </Text>
                  <Text
                    style={{ fontSize: 9, fontWeight: "300", color: "white" }}
                  >
                    {item.status == true
                      ? "Đã có người thuê"
                      : "Chưa có người thuê"}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Room;
