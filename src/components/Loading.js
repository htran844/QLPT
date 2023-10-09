import { View, Text, ActivityIndicator, Dimensions } from "react-native";
import React from "react";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Loading = () => {
  return (
    <View
      style={{
        flex: 1,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 20,
        backgroundColor:" rgba(97, 97, 97, 0.6)",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Loading;
