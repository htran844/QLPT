import { View, Text, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import Dropdown from "../components/Dropdown";
import TextInputCustom from "../components/TextInput";
import ButtonCustom from "../components/Button";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import db from "../firestore";
import { getData } from "../asyncStore";
import DateTimePickerComponent from "../components/DateTimePicker";

const AddRoom = ({ navigation, route }) => {
  const [name, setName] = useState(null);
  const [status, setStatus] = useState(null);
  const [date, setDate] = useState(new Date());
  const [rent_date, setRentdate] = useState(null);
  const [price, setPrice] = useState(null);
  const [mota, setMota] = useState(null);
  useEffect(() => {
   setStatus(false)
  }, [status]);
  const handleAddRoom = async () => {
    console.log("date", date.getMonth())
    if ((date.getMonth() + 1) == 2 && Number(rent_date)>28 ) {
      Alert.alert("Thông báo", "invalid ngày thu tiền");
      return;
    }
    const uid = await getData("uid");
    if (!uid) {
      return;
    }
    if (!name || status == null) {
      Alert.alert("Thông báo", "Tên phòng hoặc tình trạng không được bỏ trống");
      return;
    }
    console.log(typeof Number(rent_date))

    if (Number(rent_date)< 1 || Number(rent_date) > 31 ) {
      Alert.alert("Thông báo", "invalid ngày thu tiền");
      return;
    }
    
    const dataSet = {
      date: Timestamp.fromDate(new Date(date)),
      name: name,
      price: price,
      rent_date: rent_date,
      status: status,
      uid: uid,
      mota: mota
    };
    console.log("dataset", dataSet);
    // return
    const docRef = await addDoc(collection(db, "rooms"), dataSet);
    console.log("Document written with ID: ", docRef.id);
    if (docRef.id) {
      Alert.alert("Thông báo", "Tạo phòng thành công", [
        { text: "OK", onPress: () => {
          route.params.reLoad()
          navigation.goBack()
        } },
      ]);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Thêm phòng"
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
          title="Nhập tên phòng"
          style={{ paddingVertical: 10 }}
          require={true}
          value={name}
          onChangeText={(text) => {
            setName(text);
          }}
          keyboardType="numeric"
        />
        {/* <Dropdown
          title="Chọn tình trạng"
          data={[
            { label: "Chưa thuê", value: false },
            { label: "Đã thuê", value: true },
          ]}
          require={true}
          setData={(data) => {
            setStatus(data.value);
          }}
        /> */}
        <DateTimePickerComponent
          title="Ngày thuê: "
          setDateState={(date) => {
            setDate(date);
          }}
          dateValue={date}
        />
        <TextInputCustom
          title="Ngày thu tiền hàng tháng"
          style={{ paddingVertical: 10 }}
          value={rent_date}
          onChangeText={(text) => {
            setRentdate(text);
          }}
          keyboardType="numeric"
        />
        <TextInputCustom
          title="Nhập giá phòng"
          style={{ paddingVertical: 10 }}
          value={price}
          onChangeText={(text) => {
            setPrice(text);
          }}
          onBlur={()=>{
            if (price.includes(".")) {
              setPrice(Number(price.replace(/\./g, "")).toLocaleString())
            } else{
              setPrice(Number(price).toLocaleString())
            }
           
          }}
          keyboardType="numeric"
        />
        <TextInput
          multiline={true}
          numberOfLines={10}
          onChangeText={(text) => setMota(text)}
          value={mota}
        />
        <Text style={{ color: "#4285F4", marginVertical: 10 }}>
          Chưa có thông tin có thể để trống
        </Text>
        <ButtonCustom
          title="Thêm phòng"
          TouchableOpacityStyle={{ paddingVertical: 8 }}
          marginTop={30}
          backgroundColor="#2B4BF2"
          onPress={() => {
            handleAddRoom();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddRoom;
