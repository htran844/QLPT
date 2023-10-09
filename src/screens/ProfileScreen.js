import { View, Text, ScrollView, Alert, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import Dropdown from "../components/Dropdown";
import TextInputCustom from "../components/TextInput";
import ButtonCustom from "../components/Button";
import { getData, removeItemValue } from "../asyncStore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../firestore";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = ({ navigation, route }) => {
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [electricprice, setElectricPrice] = useState(null);
  const [waterprice, setWaterPrice] = useState(null);
  const nav = useNavigation();
  useEffect(() => {
    getUserFireStore();
  }, []);
  const getUserFireStore = async () => {
    const uid = await getData("uid");
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setName(docSnap.data().name);
      setPhone(docSnap.data().phone);
      setElectricPrice(docSnap.data().electricprice);
      setWaterPrice(docSnap.data().waterprice);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  const regexPhoneNumber = (phone) => {
    const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

    return phone.match(regexPhoneNumber) ? true : false;
  };
  const updateProfile = async () => {
    if (name == "" || phone == "" || waterprice == "" || electricprice == "") {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ");
      return;
    }
    if (!regexPhoneNumber(phone)) {
      Alert.alert("Thông báo", "Sai định dạng số điện thoại");
      return;
    }
    if (
      Number(waterprice) < 0 ||
      Number(electricprice) < 0 ||
      Number(electricprice) < 0 
    ) {
      Alert.alert("Thông báo", "Vui lòng nhập đúng định dạng");
      return;
    }
    const uid = await getData("uid");
    const proffileRef = doc(db, "users", uid);
    const dataUpdate = {
      name: name,
      phone: phone,
      waterprice: waterprice,
      electricprice: electricprice,
    };
    console.log("dataUpdate", dataUpdate);
    // Set the "capital" field of the city 'DC'
    const result = await updateDoc(proffileRef, dataUpdate);
    Alert.alert("Thông báo", "Cập nhật thành công", [
      { text: "OK", onPress: () => {} },
    ]);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{
          flex: 1,
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            marginTop: 40,
            marginBottom: 20,
          }}
        >
          Thông tin tài khoản
        </Text>
        <TextInputCustom
          title="Họ tên chủ trọ"
          style={{ paddingVertical: 10 }}
          value={name}
          onChangeText={(text) => {
            setName(text);
          }}
        />
        <TextInputCustom
          title="Số điện thoại"
          style={{ paddingVertical: 10 }}
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
          }}
          keyboardType="numeric"
        />
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          Giá điện nước
        </Text>

        <TextInputCustom
          title="Giá nước"
          style={{ paddingVertical: 10 }}
          value={waterprice}
          onChangeText={(text) => {
            setWaterPrice(text);
          }}
          keyboardType="numeric"
        />
        <TextInputCustom
          title="Giá điện"
          style={{ paddingVertical: 10 }}
          value={electricprice}
          onChangeText={(text) => {
            setElectricPrice(text);
          }}
          keyboardType="numeric"
        />

        <ButtonCustom
          title="Lưu chỉnh sửa"
          TouchableOpacityStyle={{ paddingVertical: 8 }}
          onPress={() => {
            updateProfile();
          }}
          backgroundColor="#2B4BF2"
          marginTop={20}
        />
        <ButtonCustom
          title="Đăng xuất"
          TouchableOpacityStyle={{ paddingVertical: 8 }}
          onPress={() => {
            removeItemValue("uid");
            route.params.checkSignIn();
          }}
          backgroundColor="#2B4BF2"
          marginTop={20}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
