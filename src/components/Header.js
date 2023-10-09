import { View, Text, Pressable } from "react-native";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

function Header({
  backIcon = false,
  title = "",
  editIcon = false,
  addIcon = false,
  rightIconPress = ()=>{},
  backIconPress = ()=>{},
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: "gray",
        paddingLeft: 20,
        paddingRight: 30,
      }}
    >
      <Pressable onPress={()=>{backIconPress()}} hitSlop={20}>
        {backIcon && <MaterialIcons name={"arrow-back-ios"} size={22} />}
      </Pressable>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>{title}</Text>
      <Pressable onPress={()=>{rightIconPress()}} hitSlop={20}>
        {addIcon && (
          <MaterialCommunityIcons name={"plus-circle-outline"} size={22} />
        )}
        {editIcon && (
          <MaterialCommunityIcons name={"square-edit-outline"} size={22} />
        )}
      </Pressable>
    </View>
  );
}

export default Header;
