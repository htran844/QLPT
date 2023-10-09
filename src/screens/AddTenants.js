import { View, Text, Alert, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import Dropdown from "../components/Dropdown";
import TextInputCustom from "../components/TextInput";
import ButtonCustom from "../components/Button";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import db from "../firestore";
import { getData } from "../asyncStore";
import Checkbox from "expo-checkbox";
const AddTenants = ({ navigation, route }) => {
  const [name, setName] = useState(null);
  const [cccd, setCCCD] = useState(null);
  const [phone, setPhone] = useState(null);
  const [address, setAddress] = useState(null);
  const [isChecked, setChecked] = useState(false);
  const [isdaiDien, setDaiDien] = useState(false);
  const checkdaidien = async () => {
    console.log("id", route.params.roomid)
    const q = query(
      collection(db, "tenants"),
      where("roomid", "==", route.params.roomid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setDaiDien(true)
    });
  };
  useEffect(() => {
   
    checkdaidien();
  }, []);
  const regexPhoneNumber = (phone) => {
    const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

    return phone.match(regexPhoneNumber) ? true : false;
  };
  const handleAddTenants = async () => {
    const roomid = route.params.roomid;
    if (!roomid) {
      console.log("roomid null");
      return;
    }
    if (isChecked == true && isdaiDien == true) {
      Alert.alert("Thông báo", "Đã tồn tại đại diện thuê");
      return;
    }
    if (!name || !cccd || !phone || !address) {
      Alert.alert("Thông báo", "Không được bỏ trống");
      return;
    }
    if (!regexPhoneNumber(phone)) {
      Alert.alert("Thông báo", "Sai số điện thoại");
      return;
    }
    if (cccd.length != 12) {
      Alert.alert("Thông báo", "cccd có 12 số");
      return;
    }
    const dataSet = {
      name: name,
      cccd: cccd,
      address: address,
      phone: phone,
      roomid: roomid,
      status: isChecked,
      delete: false,
    };
    console.log("dataset", dataSet);
    // return
    const docRef = await addDoc(collection(db, "tenants"), dataSet);
    console.log("Document written with ID: ", docRef.id);
    if (docRef.id) {
      // chuyen trang thai phong
      updateRoom()
      Alert.alert("Thông báo", "Thêm thành công", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
            route.params.onGoBack();
          },
        },
      ]);
    }
  };
  const updateRoom = async () => {

    const roomRef = doc(db, "rooms", route.params.roomid);
    const dataUpdate = {
      status: true,
    };
    console.log("dataUpdate", dataUpdate);
    // Set the "capital" field of the city 'DC'
    const result = await updateDoc(roomRef, dataUpdate);
   
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Thêm người thuê phòng"
        backIcon={true}
        backIconPress={() => {
          navigation.goBack();
        }}
      />
      <ScrollView
        style={{
          flex: 1,
          padding: 20,
        }}
      >
        <TextInputCustom
          title="Nhập tên người thuê"
          style={{ paddingVertical: 10 }}
          require={true}
          value={name}
          onChangeText={(text) => {
            setName(text);
          }}
        />

        <TextInputCustom
          title="CCCD"
          style={{ paddingVertical: 10 }}
          require={true}
          value={cccd}
          onChangeText={(text) => {
            setCCCD(text);
          }}
          keyboardType="numeric"
        />
        <TextInputCustom
          title="Số điện thoại"
          style={{ paddingVertical: 10 }}
          require={true}
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
          }}
          keyboardType="numeric"
        />
        <TextInputCustom
          title="Địa chỉ thường trú"
          style={{ paddingVertical: 10 }}
          require={true}
          value={address}
          onChangeText={(text) => {
            setAddress(text);
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <Checkbox
            style={{
              margin: 8,
            }}
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? "#4630EB" : undefined}
          />
          <Text
            style={{
              fontSize: 15,
            }}
          >
            Đại diện thuê
          </Text>
        </View>
        {/* <Text style={{color: "#4285F4", marginVertical: 10}}>Chưa có thông tin có thể để trống</Text> */}
        <ButtonCustom
          title="Thêm người thuê"
          TouchableOpacityStyle={{ paddingVertical: 8 }}
          marginTop={60}
          backgroundColor="#2B4BF2"
          onPress={() => {
            handleAddTenants();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddTenants;
