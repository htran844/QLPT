import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import Dropdown from "../components/Dropdown";
import TextInputCustom from "../components/TextInput";
import ButtonCustom from "../components/Button";
import DateTimePickerComponent from "../components/DateTimePicker";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../firestore";
import { ScrollView } from "react-native";
import Loading from "../components/Loading";

const DetailRoom = ({ navigation, route }) => {
  const [status, setStatus] = useState(null);
  const [date, setDate] = useState(null);
  const [rent_date, setRentdate] = useState(null);
  const [price, setPrice] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getRoomFireStore();
  }, []);

  const getRoomFireStore = async () => {
    setLoading(true);
    const docRef = doc(db, "rooms", route.params.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setRoom(docSnap.data());
      setStatus(docSnap.data().status);
      setDate(
        new Date(
          docSnap.data().date.seconds * 1000 +
            docSnap.data().date.nanoseconds / 1000000
        )
      );
      setRentdate(docSnap.data().rent_date);
      setPrice(docSnap.data().price);
      console.log(
        "date",
        new Date(
          docSnap.data().date.seconds * 1000 +
            docSnap.data().date.nanoseconds / 1000000
        )
      );
      setLoading(false);
    } else {
      // doc.data() will be undefined in this case
      setLoading(false);
      console.log("No such document!");
    }
  };
  const updateRoom = async () => {
    if ((date.getMonth() + 1) == 2 && Number(rent_date)>28 ) {
      Alert.alert("Thông báo", "invalid ngày thu tiền");
      return;
    }
    if (Number(rent_date) < 1 || Number(rent_date) > 31) {
      Alert.alert("Thông báo", "invalid ngày thu tiền");
      return;
    }
    setLoading(true);

    const roomRef = doc(db, "rooms", route.params.id);
    const dataUpdate = {
      date: date,
      price: price,
      rent_date: rent_date,
      status: status,
    };
    console.log("dataUpdate", dataUpdate);
    // Set the "capital" field of the city 'DC'
    const result = await updateDoc(roomRef, dataUpdate);
    Alert.alert("Thông báo", "Cập nhật thành công", [
      {
        text: "OK",
        onPress: () => {
          route.params.reloadRoom();
        },
      },
    ]);
    setLoading(false);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading && <Loading />}
      <Header
        title={`Chi tiết phòng ${room?.name}`}
        backIcon={true}
        backIconPress={() => {
          navigation.goBack();
          route.params.reloadRoom();
        }}
      />
      <ScrollView
        style={{
          flex: 1,
          padding: 20,
        }}
      >
         <TextInputCustom
          title="Tình trạng"
          style={{ paddingVertical: 10, backgroundColor: "lightgray" }}
          value={room?.status ? "Đã thuê" : "Chưa thuê"}
          onChangeText={(text) => {
            setRentdate(text);
          }}
          keyboardType="numeric"
          editable={false}
        />
        {/* <Dropdown
          title="Tình trạng"
          data={[
            { label: "Chưa thuê", value: false },
            { label: "Đã thuê", value: true },
          ]}
          require={true}
          setData={(data) => {
            setStatus(data.value);
          }}
          valueDefault={room?.status}
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
          title="Giá phòng"
          style={{ paddingVertical: 10 }}
          value={price}
          onChangeText={(text) => {
            setPrice(text);
          }}
          onBlur={() => {
            setPrice(Number(price))
          }}
          keyboardType="numeric"
        />
        <ButtonCustom
          title="Cập nhật thông tin phòng"
          TouchableOpacityStyle={{ paddingVertical: 8 }}
          marginTop={30}
          backgroundColor="#2B4BF2"
          onPress={() => {
            updateRoom();
          }}
        />
        <ButtonCustom
          title="Chi tiết hóa đơn"
          TouchableOpacityStyle={{ paddingVertical: 8 }}
          marginTop={30}
          onPress={() => {
            navigation.navigate("Bill", { roomid: route.params.id, price: price });
          }}
        />
        <ButtonCustom
          title="Chi tiết người thuê"
          TouchableOpacityStyle={{ paddingVertical: 8 }}
          onPress={() => {
            navigation.navigate("Tenants", { roomid: route.params.id, reLoad: ()=>{getRoomFireStore()} });
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailRoom;
