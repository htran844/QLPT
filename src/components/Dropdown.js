import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";

const DropdownComponent = ({
  title = "",
  require = false,
  data = [
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
  ],
  valueDefault = null,
  setData = ()=>{}
}) => {
  const [value, setValue] = useState(valueDefault);
useEffect(()=>{
  console.log("valueDefault", valueDefault)
  setValue(valueDefault)
}, [valueDefault])
  return (
    <View  style={{ width: "100%", marginTop: 10 }}>
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
      </Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder=""
        value={value}
        onChange={(item) => {
          setValue(item.value);
          setData(item)
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    backgroundColor: "white",
    elevation: 4,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },

});
export default DropdownComponent;
