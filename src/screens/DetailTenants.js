import { View, Text, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import Dropdown from "../components/Dropdown";
import TextInputCustom from "../components/TextInput";
import ButtonCustom from "../components/Button";
import Checkbox from "expo-checkbox";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../firestore";
import { Linking } from "react-native";

const DetailTenants = ({ navigation, route }) => {
  const [name, setName] = useState(null);
  const [cccd, setCCCD] = useState(null);
  const [phone, setPhone] = useState(null);
  const [address, setAddress] = useState(null);
  const [isChecked, setChecked] = useState(false);
  useEffect(() => {
    getTenantFireStore();
  }, []);
  const regexPhoneNumber = (phone) => {
    const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

    return phone.match(regexPhoneNumber) ? true : false;
  };
  const getTenantFireStore = async () => {
    const docRef = doc(db, "tenants", route.params.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setName(docSnap.data().name);
      setCCCD(docSnap.data().cccd);
      setPhone(docSnap.data().phone);
      setAddress(docSnap.data().address);
      setChecked(docSnap.data().status);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  const updateTenant = async () => {
    if (!name || !cccd || !phone || !address) {
      Alert.alert("Thông báo", "Không được bỏ trống");
      return;
    }
    if (!regexPhoneNumber(phone)) {
      Alert.alert("Thông báo", "Sai định dạng số điện thoại");
      return;
    }
    if (cccd.length != 12) {
      Alert.alert("Thông báo", "cccd có 12 số");
      return;
    }
    const tenantRef = doc(db, "tenants", route.params.id);
    const dataUpdate = {
      name: name,
      cccd: cccd,
      phone: phone,
      address: address,
      status: isChecked,
    };
    console.log("dataUpdate", dataUpdate);
    // Set the "capital" field of the city 'DC'
    const result = await updateDoc(tenantRef, dataUpdate);
    Alert.alert("Thông báo", "Cập nhật thành công", [
      {
        text: "OK",
        onPress: () => {
          route.params.reLoad();
          navigation.goBack();
        },
      },
    ]);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Chi tiết người thuê"
        editIcon={false}
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
          title="Cập nhật thông tin"
          TouchableOpacityStyle={{ paddingVertical: 8 }}
          marginTop={60}
          backgroundColor="#2B4BF2"
          onPress={() => {
            updateTenant();
          }}
        />
        <ButtonCustom
          title="Liên hệ người thuê"
          TouchableOpacityStyle={{ paddingVertical: 8 }}
          marginTop={20}
          backgroundColor="#2B4BF2"
          onPress={() => {
            Linking.openURL(`tel:${phone}`);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailTenants;
