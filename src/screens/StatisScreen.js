import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import { Dimensions } from "react-native";
import DropdownComponent from "../components/Dropdown";
import { getData } from "../asyncStore";
import { collection, getDocs, query, where } from "firebase/firestore";
import db from "../firestore";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const StatisScreen = () => {
  const defaultHeight = 500;

  const [year, setYear] = useState({ label: "2023", value: 2023 });
  const [data, setData] = useState([]);

  useEffect(() => {
    getBills();
  }, [year]);

  const getBills = async () => {
    const uid = await getData("uid");
    if (!uid) {
      return;
    }
    const roomsRef = collection(db, "bills");
    const q = query(
      roomsRef,
      where("uid", "==", uid),
      where("year", "==", year.label)
    );
    const querySnapshot = await getDocs(q);
    let monthArray = [];
    querySnapshot.forEach((doc) => {
      monthArray.push({
        id: doc.id,
        ...doc.data(),
      });
      console.log("s", doc.data());
    });
    if (querySnapshot) {
      const monthsInOrder = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
      ];
      let sortedArray = monthsInOrder.map((month) => {
        let sum = 0;

        monthArray.map((item) => {
          if (item.month == month) {
            sum+= parseFloat(item.total.replace(/\./g, ""))
          }
        });
        return sum

        // const monthObject = monthArray.find((obj) => obj.month == month);
        // console.log("monthObject.total", monthObject.total);
        // return monthObject
        //   ? parseFloat(monthObject.total.replace(/\./g, ""))
        //   : 0;
      });
      // const converted = sortedArray.map((num) => {
      //   if (parseFloat(num) > 0) {
      //     return (parseFloat(num) / 1000000).toFixed(1).replace(".", ",");
      //   } else {
      //     return "0";
      //   }
      // });
      setData([...sortedArray]);
      console.log("querySnapshot", sortedArray);
    }
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <Header title="Thống kê doanh thu" />
        <View style={{ height: 160 }}>
          <DropdownComponent
            title={`Tổng tiền: ${
              data.length > 0 &&
              Number(
                data.reduce(
                  (accumulator, currentValue) => accumulator + currentValue
                )
              ).toLocaleString()
            }`}
            data={[
              { label: "2019", value: 2019 },
              { label: "2020", value: 2020 },
              { label: "2021", value: 2021 },
              { label: "2022", value: 2022 },
              { label: "2023", value: 2023 },
              { label: "2024", value: 2024 },
            ]}
            valueDefault={year}
            setData={(data) => {
              setYear(data);
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            height: screenHeight - 300,
            flex: 1,
          }}
        >
          {data.length > 0 &&
            data.map((item, index) => {
              let maxNum = Math.max(...data);
              let heightCol = (item / maxNum) * 400;
              let total = "";
              if (parseFloat(item) > 0) {
                total = (parseFloat(item) / 1000000)
                  .toFixed(1)
                  .replace(".", ",");
              } else {
                total = "0";
              }
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    width: screenWidth / 16,
                    // elevation: 5,
                  }}
                >
                  <Text style={{ fontSize: 8, textAlign: "center" }}>
                    {total} Tr
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#29B6F6",
                      height: heightCol || 10,
                    }}
                  ></View>
                  <Text style={{ fontSize: 8, textAlign: "center" }}>{`T${
                    index + 1
                  }`}</Text>
                </View>
              );
            })}
        </View>
        <Pressable
          onPress={() => {
            getBills();
          }}
        >
          <Text style={{ textAlign: "center" }}>Reload</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatisScreen;
