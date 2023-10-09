import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const TextInputCustom = ({
  placeholder = "",
  onChangeText = () => {},
  value = null,
  title = "",
  require = false,
  secureTextEntry = false,
  type = "",
  setIsShow = () => {},
  style = {},
  keyboardType = "default",
  styleContainer = {},
  onBlur = ()=>{},
  editable = true
}) => {
  return (
    <View style={{ width: "100%", marginTop: 10, ...styleContainer }}>
      <Text style={{ marginBottom: 10, marginLeft: 4, fontSize: 18, color: "#404969" }}>
        {title}
        {require && <Text style={{ color: "red" }}>*</Text>}
      </Text>
      <View style={{elevation: 10,}}>
        <TextInput
          onChangeText={(text) => {
            onChangeText(text);
          }}
          onBlur={() => {
            onBlur()
          }}
          value={value}
          style={{
            backgroundColor: "white",
            paddingHorizontal: 14,
            paddingVertical: 14,
            fontSize: 14,
            borderRadius: 6,
            width: "100%",
            ...style,
          }}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          editable={editable}
        />
        {type == "password" && (
          <Pressable
            style={{
              position: "absolute",
              right: 10,
              top: "30%",
              borderRadius: 24,
            }}
            onPress={(value) => {
              setIsShow(value);
            }}
            hitSlop={10}
          >
            {secureTextEntry ? (
              <MaterialCommunityIcons
                name={"eye-off-outline"}
                size={20}
              />
            ) : (
              <MaterialCommunityIcons
                name={"eye-outline"}
                size={20}
              />
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default TextInputCustom;
