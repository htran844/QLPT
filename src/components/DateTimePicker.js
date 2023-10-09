import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Button } from "react-native";
import ButtonCustom from "./Button";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const DateTimePickerComponent = ({
  title = "",
  require = false,
  dateValue = new Date(),
  setDateState = () => {},
}) => {
  const [date, setDate] = useState(dateValue);
  useEffect(() => {
    if (dateValue) {
        setDate(dateValue);
    }
    
  }, [dateValue]);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setDateState(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
      // maximumDate: new Date()
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };
  return (
    <View style={{ width: "100%", marginTop: 10 }}>
      <Text
        style={{
          marginBottom: 10,
          marginLeft: 4,
          fontSize: 18,
          color: "#404969",
        }}
      >
        {title}
        {require && <Text style={{ color: "red" }}>*</Text>}
        {/* {` ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`} */}
      </Text>
      <View>
        <ButtonCustom
          onPress={showDatepicker}
          title={date != null &&`${date?.getDate()}/${
            date?.getMonth() + 1
          }/${date?.getFullYear()}`}
          backgroundColor="white"
          borderRadius={8}
          TouchableOpacityStyle={{
            paddingVertical: 12,
            justifyContent: "flex-start",
          }}
          textStyle={{ color: "#4285F4", fontWeight: "400" }}
        />
        <MaterialIcons
          name="keyboard-arrow-down"
          size={20}
          color="gray"
          style={{ position: "absolute", right: 14, top: 30 }}
        />
      </View>
    </View>
  );
};

export default DateTimePickerComponent;
