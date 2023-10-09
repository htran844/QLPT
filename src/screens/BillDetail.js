import { View, Text, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import Dropdown from "../components/Dropdown";
import TextInputCustom from "../components/TextInput";
import ButtonCustom from "../components/Button";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../firestore";
import { getData } from "../asyncStore";
import DateTimePickerComponent from "../components/DateTimePicker";

const BillDetail = ({ navigation, route }) => {
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [name, setName] = useState(null);
  const [water, setWater] = useState(null);
  const [electric, setElectric] = useState(null);
  const [date, setDate] = useState(new Date());
  const [total, setTotal] = useState(null);
  const [status, setStatus] = useState(null);
  const [bill, setBill] = useState(null);
  const [electricprice, setElectricPrice] = useState(null);
  const [waterprice, setWaterPrice] = useState(null);
  useEffect(() => {
    getBillFireStore();
  }, []);
  const getBillFireStore = async () => {
    const docRef = doc(db, "bills", route.params.billid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(" document!", docSnap.data());
      setBill(docSnap.data());
      setMonth(docSnap.data().month);
      setYear(docSnap.data().year);

      setName(docSnap.data().name);
      setWater(docSnap.data().water);
      setElectric(docSnap.data().electric);
      setDate(
        new Date(
          docSnap.data().date.seconds * 1000 +
            docSnap.data().date.nanoseconds / 1000000
        )
      );
      setTotal(docSnap.data().total);
      setStatus(docSnap.data().status);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  const handleUpdateBill = async () => {
    if (
      !name ||
      status == null ||
      !month ||
      !year ||
      !water ||
      !electric ||
      !total ||
      !date
    ) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (
      Number(month) < 1 ||
      Number(month) > 12 ||
      Number(year) < 1900 ||
      Number(year) > 2030 ||
      Number(water) < 0 ||
      Number(electric) < 0 
    ) {
      Alert.alert("Thông báo", "Vui lòng nhập đúng định dạng");
      return;
    }
    const uid = await getData("uid");
    const roomid = route.params.roomid;

    const roomRef = doc(db, "bills", route.params.billid);
    const dataUpdate = {
      month,
      year,
      name,
      water,
      electric,
      date,
      total,
      status,
      uid,
      roomid,
    };
    console.log("dataUpdate", dataUpdate);
    // Set the "capital" field of the city 'DC'
    const result = await updateDoc(roomRef, dataUpdate);
    Alert.alert("Thông báo", "Cập nhật thành công", [
      {
        text: "OK",
        onPress: () => {
          route.params.reloadBill();
          navigation.goBack()
        },
      },
    ]);
  };
  useEffect(() => {
    if (electricprice != null && waterprice != null) {
      let price_room = route.params.price_room;
      const numPrice = parseFloat(price_room.replace(/\./g, ""));
      let price_set =
        Number(numPrice) +
        Number(electricprice) * Number(electric) +
        Number(waterprice) * Number(water);
      console.log(" document!", numPrice, price_set);
      setTotal(price_set.toLocaleString());
    }
    console.log("a", electricprice, waterprice);
  }, [electric, water]);
  useEffect(() => {
    getUserFireStore();
  }, []);
  const getUserFireStore = async () => {
    const uid = await getData("uid");
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(" document!", docSnap.data());
      setElectricPrice(docSnap.data().electricprice);
      setWaterPrice(docSnap.data().waterprice);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Chi tiết hóa đơn"
        // editIcon={true}
        backIcon={true}
        backIconPress={() => {
          navigation.goBack();
        }}
      />
      <ScrollView>
        <View
          style={{
            flex: 1,
            padding: 20,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TextInputCustom
              title="Tháng"
              style={{ paddingVertical: 10, width: "100%" }}
              styleContainer={{ width: "40%" }}
              value={month}
              onChangeText={(text) => {
                setMonth(text);
              }}
              keyboardType="numeric"
            />
            <TextInputCustom
              title="Năm"
              style={{ paddingVertical: 10, width: "100%" }}
              styleContainer={{ width: "40%" }}
              value={year}
              onChangeText={(text) => {
                setYear(text);
              }}
              keyboardType="numeric"
            />
          </View>
          <TextInputCustom
            title="Tên người đại diện"
            style={{ paddingVertical: 10 }}
            value={name}
            onChangeText={(text) => {
              setName(text);
            }}
          />

          <TextInputCustom
            title="Số nước"
            style={{ paddingVertical: 10 }}
            value={water}
            onChangeText={(text) => {
              setWater(text);
            }}
            keyboardType="numeric"
          />
          <TextInputCustom
            title="Số điện"
            style={{ paddingVertical: 10 }}
            value={electric}
            onChangeText={(text) => {
              setElectric(text);
            }}
            keyboardType="numeric"
          />
          <DateTimePickerComponent
            title="Ngày thu "
            setDateState={(date) => {
              setDate(date);
            }}
            dateValue={date}
          />
          <TextInputCustom
            title="Tổng hóa đơn"
            style={{ paddingVertical: 10 }}
            value={total}
            onChangeText={(text) => {
              setTotal(text);
            }}
            editable={false}
            keyboardType="numeric"
          />
          <Dropdown
            title="Tình trạng"
            data={[
              { label: "Chưa thu tiền", value: false },
              { label: "Đã thu tiền", value: true },
            ]}
            setData={(data) => {
              setStatus(data.value);
            }}
            valueDefault={status}
          />
          <ButtonCustom
            title="Cập nhật hóa đơn"
            TouchableOpacityStyle={{ paddingVertical: 8 }}
            onPress={() => {
              handleUpdateBill();
            }}
            backgroundColor="#2B4BF2"
            marginTop={20}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BillDetail;
