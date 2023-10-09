import { View, Text, Pressable, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import TextInputCustom from "../components/TextInput";
import ButtonCustom from "../components/Button";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { storeData } from "../asyncStore";
import Loading from "../components/Loading";

const LoginScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isShow, setIsShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const signIn = () => {
    setLoading(true)
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, pass)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log("user", user);
        if (user.uid) {
          await storeData("uid", user.uid);
          Alert.alert("Thông báo", "Đăng nhập thành công", [
            { text: "OK", onPress: () => route.params.checkSignIn() },
          ]);
        }
        setLoading(false)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("err", errorCode, errorMessage);
        if (errorCode == "auth/invalid-email") {
          Alert.alert("Lỗi", "Email hoặc mật khẩu không đúng");
        }
        setLoading(false)
      });
  };
  return (
    <View style={{flex: 1, position: "relative"}}>
      {loading && <Loading/> }
      
     
      <View
        style={{
          flexDirection: "column",
          paddingHorizontal: 20,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#BDE4F4",
          flex: 1,
        }}
      >
        
        <Text style={{ color: "#404969", fontSize: 28, fontWeight: "800" }}>
          Đăng nhập
        </Text>
        <TextInputCustom
          title="Email"
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />
        <TextInputCustom
          title="Mật khẩu"
          placeholder="Mật khẩu"
          value={pass}
          onChangeText={(text) => {
            setPass(text);
          }}
          secureTextEntry={isShow}
          type="password"
          setIsShow={() => {
            setIsShow(!isShow);
          }}
        />

        <ButtonCustom
          title="Đăng nhập"
          backgroundColor="#29B6F6"
          borderRadius={32}
          marginVertical={16}
          marginTop={50}
          onPress={() => {
            signIn();
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <Pressable>
            <Text style={{ color: "#404969" }}>Chưa có tài khoản?</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate("Register", {});
            }}
            hitSlop={20}
          >
            <Text style={{ color: "#29B6F6" }}>Đăng ký</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
