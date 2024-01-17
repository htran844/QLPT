import { View, Text, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import Dropdown from "../components/Dropdown";
import TextInputCustom from "../components/TextInput";
import ButtonCustom from "../components/Button";
import DateTimePickerComponent from "../components/DateTimePicker";
import { getData } from "../asyncStore";
import { addDoc, collection, doc, getDoc, getDocs, query, Timestamp, where } from "firebase/firestore";
import db from "../firestore";

const AddBill = ({ navigation, route }) => {
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [name, setName] = useState(null);
  const [water, setWater] = useState(null);
  const [electric, setElectric] = useState(null);
  const [date, setDate] = useState(new Date());
  const [total, setTotal] = useState(null);
  const [status, setStatus] = useState(null);
  const [electricprice, setElectricPrice] = useState(null);
  const [waterprice, setWaterPrice] = useState(null);
  useEffect(() => {
    getDaiDien()
  }, []);
  const getDaiDien = async () => {
    const q = query(collection(db, "tenants"), where("roomid", "==", route.params.roomid),  where("status", "==", true));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setName(doc.data().name)
    });
  };
  const handleAddBill = async () => {
    const uid = await getData("uid");
    const roomid = route.params.roomid;
    console.log("add", uid, roomid);
    if (!uid || !roomid) {
      return;
    }
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
    const dataSet = {
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
    console.log("dataset", dataSet);
    // return
    const docRef = await addDoc(collection(db, "bills"), dataSet);
    console.log("Document written with ID: ", docRef.id);
    if (docRef.id) {
      Alert.alert("Thông báo", "Tạo hóa đơn thành công", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
            route.params.reLoad();
          },
        },
      ]);
    }
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
      setTotal(price_set.toLocaleString('vi-VN'));
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
        title="Thêm hóa đơn"
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
            style={{ paddingVertical: 10, backgroundColor: "lightgray" }}
            value={name}
            onChangeText={(text) => {
              setName(text);
            }}
            editable={false}
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
          />
          <ButtonCustom
            title="Thêm hóa đơn"
            TouchableOpacityStyle={{ paddingVertical: 8 }}
            onPress={() => {
              handleAddBill();
            }}
            backgroundColor="#2B4BF2"
            marginTop={20}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddBill;
