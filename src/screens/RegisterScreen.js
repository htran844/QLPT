import { View, Text, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import TextInputCustom from "../components/TextInput";
import ButtonCustom from "../components/Button";
import db from "../firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Loading from "../components/Loading";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [rePass, setRePass] = useState("");
  const [isShow, setIsShow] = useState(true);
  const [isShow2, setIsShow2] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleRegister = () => {
    
    const auth = getAuth();
    if (email == "" || pass == "") {
      Alert.alert("Lỗi", "Email và mật khẩu không được để trống");
      return;
    }
    if (pass != rePass) {
      Alert.alert("Lỗi", "Mật khẩu nhập lại không đúng");
      return;
    }
    setLoading(true)
    // tạo email vào auth
    createUserWithEmailAndPassword(auth, email, pass)
      .then(async (userCredential) => {
        const user = userCredential.user;
        // nếu thành công thì lưu vào bảng users
        if (user.uid) {
          const docData = {
            electricprice: 0,
            email: email,
            name: name,
            phone: "",
            waterprice: 0,
          };
          await setDoc(doc(db, "users", user.uid), docData);
          setLoading(false)
          Alert.alert("Thông báo", "Đăng ký thành công, vui lòng đăng nhập", [
            { text: "OK", onPress: () => navigation.navigate("Login", {}) },
          ]);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("err", errorCode, errorMessage);
        setLoading(false)
        if (errorCode == "auth/email-already-in-use") {
           Alert.alert("Lỗi", "Tài khoản đã tồn tại");
        }else{
          Alert.alert("Lỗi",  errorMessage);
        }
       
      });
    const dataRegister = {};
  };
  return (
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
       {loading && <Loading/> }
      <Text style={{ color: "#404969", fontSize: 28, fontWeight: "800" }}>
        Đăng ký
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
        title="Họ và tên"
        placeholder="Họ và tên"
        value={name}
        onChangeText={(text) => {
          setName(text);
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
      <TextInputCustom
        title="Nhập lại mật khẩu"
        placeholder="Nhập lại mật khẩu"
        value={rePass}
        onChangeText={(text) => {
          setRePass(text);
        }}
        secureTextEntry={isShow}
        type="password"
        setIsShow={() => {
          setIsShow2(!isShow2);
        }}
      />
      <ButtonCustom
        title="Đăng ký"
        backgroundColor="#29B6F6"
        borderRadius={32}
        marginVertical={16}
        marginTop={30}
        onPress={() => {
          handleRegister();
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
          <Text style={{ color: "#404969" }}>Đã có tài khoản?</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate("Login", {});
          }}
          hitSlop={20}
        >
          <Text style={{ color: "#29B6F6" }}>Đăng nhập</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default RegisterScreen;
