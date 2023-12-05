import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "../screens/auth/Splash";
import ForgetPasswordScreen from "../screens/auth/ForgetPasswordScreen";
import UpdatePasswordScreen from "../screens/profile/UpdatePasswordScreen";
import MyAccountScreen from "../screens/profile/MyAccountScreen";
import AddProductScreen from "../screens/admin/AddProductScreen";
import DashboardScreen from "../screens/admin/DashboardScreen";
import ViewProductScreen from "../screens/admin/ViewProductScreen";
import Tabs from "./tabs/Tabs";
import CartScreen from "../screens/user/CartScreen";
import CheckoutScreen from "../screens/user/CheckoutScreen.js";
import OrderConfirmScreen from "../screens/user/OrderConfirmScreen";
import ProductDetailScreen from "../screens/user/ProductDetailScreen";
import EditProductScreen from "../screens/admin/EditProductScreen";
import ViewOrdersScreen from "../screens/admin/ViewOrdersScreen";
import ViewOrderDetailScreen from "../screens/admin/ViewOrderDetailScreen";
import MyOrderScreen from "../screens/user/MyOrderScreen";
import MyOrderDetailScreen from "../screens/user/MyOrderDetailScreen";
import ViewCategoryScreen from "../screens/admin/ViewCategoryScreen";
import AddCategoryScreen from "../screens/admin/AddCategoryScreen";
import ViewUsersScreen from "../screens/admin/ViewUsersScreen";
import CategoriesScreen from "../screens/user/CategoriesScreen";
import EditCategoryScreen from "../screens/admin/EditCategoryScreen";
import MyWishlistScreen from "../screens/profile/MyWishlistScreen";
import {
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createTracker } from "@snowplow/react-native-tracker";

const Stack = createNativeStackNavigator();

const Routes = () => {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = React.useRef();
  var COLLECTOR_URL = "https://orga.proemsportsanalytics.com";
  const [userId,setUserId]=React.useState(null);


  const getUserId=async()=>{
    let user = await(AsyncStorage.getItem("authUser"));
    let userId= JSON?.parse(user)?._id;
    setUserId(userId)
  }

  useEffect(()=>{
    getUserId();
  },[])


  const tracker = createTracker("appTracker", {
    endpoint: COLLECTOR_URL,
    method: "post",
    customPostPath: "com.snowplowanalytics.snowplow/tp2", // A custom path which will be added to the endpoint URL to specify the complete URL of the collector when paired with the POST method.
    requestHeaders: {}, // Custom headers for HTTP requests to the Collector
  }, {
    trackerConfig: {
      appId: Platform.OS === "ios" ? "ecomm-ios" : "ecomm-android",
    },
    subjectConfig:{
      userId: userId ?? null
    }
  });

  return (
    <NavigationContainer
    ref={navigationRef}
    onReady={() => {
      routeNameRef.current = navigationRef.getCurrentRoute().name;
    }}
    onStateChange={async () => {
      const previousRouteName = routeNameRef.current;
      const currentRouteName = navigationRef.getCurrentRoute().name;
      const trackScreenView = (currentRouteName,previousRouteName) => {
        // Your implementation of analytics goes here!
        tracker.trackPageViewEvent({
          pageUrl: currentRouteName,
          pageTitle: currentRouteName,
          referrer: previousRouteName
        });
      };

      if (previousRouteName !== currentRouteName) {
        // Save the current route name for later comparison
        routeNameRef.current = currentRouteName;
        
        // Replace the line below to add the tracker from a mobile analytics SDK
        await trackScreenView(currentRouteName,previousRouteName);
      }
    }}
    
    >
      <Stack.Navigator
        initialRouteName="splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="splash" component={Splash} />
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="signup" component={SignupScreen} />
        <Stack.Screen name="forgetpassword" component={ForgetPasswordScreen} />
        <Stack.Screen name="updatepassword" component={UpdatePasswordScreen} />
        <Stack.Screen name="myaccount" component={MyAccountScreen} />
        <Stack.Screen name="mywishlist" component={MyWishlistScreen} />
        <Stack.Screen name="dashboard" component={DashboardScreen} />
        <Stack.Screen name="addproduct" component={AddProductScreen} />
        <Stack.Screen name="viewproduct" component={ViewProductScreen} />
        <Stack.Screen name="editproduct" component={EditProductScreen} />
        <Stack.Screen name="tab" component={Tabs} />
        <Stack.Screen name="cart" component={CartScreen} />
        <Stack.Screen name="checkout" component={CheckoutScreen} />
        <Stack.Screen name="orderconfirm" component={OrderConfirmScreen} />
        <Stack.Screen name="productdetail" component={ProductDetailScreen} />
        <Stack.Screen name="vieworder" component={ViewOrdersScreen} />
        <Stack.Screen
          name="vieworderdetails"
          component={ViewOrderDetailScreen}
        />
        <Stack.Screen name="myorder" component={MyOrderScreen} />
        <Stack.Screen name="myorderdetail" component={MyOrderDetailScreen} />
        <Stack.Screen name="viewcategories" component={ViewCategoryScreen} />
        <Stack.Screen name="addcategories" component={AddCategoryScreen} />
        <Stack.Screen name="editcategories" component={EditCategoryScreen} />
        <Stack.Screen name="viewusers" component={ViewUsersScreen} />
        <Stack.Screen name="categories" component={CategoriesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
