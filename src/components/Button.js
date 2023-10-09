import { View, Text, Button, Pressable, TouchableOpacity } from "react-native";
import React from "react";

const ButtonCustom = ({
  style = {},
  title = "",
  backgroundColor = "#29B6F6",
  borderRadius = 12,
  marginVertical = 10,
  marginTop = 10,
  onPress= ()=>{},
  TouchableOpacityStyle = {},
  textStyle = {},
}) => {
  return (
    <View
      style={{
        width: "100%",

        borderRadius: borderRadius,
        backgroundColor: backgroundColor,
        ...style,
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: marginVertical,
        marginTop: marginTop,
        elevation: 6,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          onPress()
        }}
        style={{
          flex: 1,
          padding: 14,
          flexDirection: "row",
          justifyContent: "center",
          ...TouchableOpacityStyle,
        }}
      >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "600", ...textStyle }}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonCustom;
