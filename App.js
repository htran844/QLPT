import * as React from "react";
import { View, Text, Pressable } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import Room from "./src/screens/Room";
import DetailRoom from "./src/screens/DetailRoom";
import AddRoom from "./src/screens/AddRoom";
import Tenants from "./src/screens/Tenants";
import DetailTenants from "./src/screens/DetailTenants";
import AddTenants from "./src/screens/AddTenants";
import ProfileScreen from "./src/screens/ProfileScreen";
import { getData } from "./src/asyncStore";
import StatisScreen from "./src/screens/StatisScreen";
import BillDetail from "./src/screens/BillDetail";
import Bill from "./src/screens/Bill";
import AddBill from "./src/screens/AddBill";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={Room} />
      <Stack.Screen name="DetailRoom" component={DetailRoom} options={{}} />
      <Stack.Screen name="AddRoom" component={AddRoom} options={{}} />
      <Stack.Screen name="Tenants" component={Tenants} options={{}} />
      <Stack.Screen
        name="DetailTenants"
        component={DetailTenants}
        options={{}}
      />
      <Stack.Screen name="AddTenants" component={AddTenants} options={{}} />
      <Stack.Screen name="Bill" component={Bill} options={{}} />
      <Stack.Screen name="BillDetail" component={BillDetail} options={{}} />
      <Stack.Screen name="AddBill" component={AddBill} options={{}} />
    </Stack.Navigator>
  );
}
function StatisStack() {
  return (
    <Stack.Navigator
      initialRouteName="Statis"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Statis" component={StatisScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack({ navigation, route }) {
  return (
    <Stack.Navigator
      initialRouteName="Profiles"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{
          checkSignIn: route.params.checkSignIn
        }}
      />
    </Stack.Navigator>
  );
}

function App() {
  const [isSignIn, setIsSignIn] = React.useState(false);
  const checkSignInStore = async () => {
    const uid = await getData("uid");
    console.log("uid", uid)
    if (uid) {
      setIsSignIn(true);
    } else {
      setIsSignIn(false);
    }
  };
  React.useEffect(()=>{
    checkSignInStore()
  }, [isSignIn])
  return (
    <NavigationContainer>
      {isSignIn == false ? (
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            initialParams={{
              checkSignIn: () => {
                checkSignInStore();
              },
            }}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          initialRouteName="Feed"
          screenOptions={({ route }) => ({
            headerStyle: { backgroundColor: "white" },
            headerTintColor: "#404969",
            headerTitleStyle: { fontWeight: "bold" },
            tabBarActiveTintColor: "#29B6F6",
            tabBarInactiveTintColor: "gray",
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === "HomeStack") {
                iconName = "home";
              } else if (route.name === "StatisStack") {
                iconName = "chart-bar";
              } else if (route.name === "ProfileStack") {
                iconName = "account-outline";
              }
              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
            },
            tabBarItemStyle: { height: 50, paddingBottom: 10 },
          })}
        >
          <Tab.Screen
            name="HomeStack"
            component={HomeStack}
            options={{
              // headerTitle: (props) => (
              //   <LogoTitle title="Quản lý phòng" addIcon={true} />
              // ),
              tabBarLabel: "Quản lý phòng",
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="StatisStack"
            component={StatisStack}
            options={{
              tabBarLabel: "Thống kê",
              // headerTitle: (props) => (
              //   <LogoTitle title="Thống kê" addIcon={true} />
              // ),
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="ProfileStack"
            component={ProfileStack}
            options={{
              tabBarLabel: "Tài khoản",
              headerShown: false,
              // headerTitle: (props) => (
              //   <LogoTitle title="Quản lý phòng" addIcon={true} />
              // ),
            }}
            initialParams={{
              checkSignIn: () => {
                checkSignInStore();
              },
            }}
          />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}
export default App;
