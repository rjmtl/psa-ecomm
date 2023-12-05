import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import UserProfileCard from "../../components/UserProfileCard/UserProfileCard";
import { Ionicons } from "@expo/vector-icons";
import OptionList from "../../components/OptionList/OptionList";
import { colors } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createTracker } from "@snowplow/react-native-tracker";

const UserProfileScreen = ({ navigation, route }) => {
  const [userInfo, setUserInfo] = useState({});
  const { user } = route.params;
  const [userId,setUserId]=useState(null);
  var COLLECTOR_URL = "https://orga.proemsportsanalytics.com";

  const convertToJSON = (obj) => {
    try {
      setUserInfo(JSON.parse(obj));
    } catch (e) {
      setUserInfo(obj);
    }
  };

  const getUserId=async()=>{
    let user = await(AsyncStorage.getItem("authUser"));
    let userId= JSON?.parse(user)?._id;
    setUserId(userId)
  }

  // covert  the user to Json object on initial render
  useEffect(() => {
    convertToJSON(user);
    getUserId();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="auto"></StatusBar>
      <View style={styles.TopBarContainer}>
        <TouchableOpacity>
          <Ionicons name="menu-sharp" size={30} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <Text style={styles.screenNameText}>Profile</Text>
      </View>
      <View style={styles.UserProfileCardContianer}>
        <UserProfileCard
          Icon={Ionicons}
          name={userInfo?.name}
          email={userInfo?.email}
        />
      </View>
      <View style={styles.OptionsContainer}>
        <OptionList
          text={"My Account"}
          Icon={Ionicons}
          iconName={"person"}
          onPress={() => navigation.navigate("myaccount", { user: userInfo })}
        />
        <OptionList
          text={"Wishlist"}
          Icon={Ionicons}
          iconName={"heart"}
          onPress={() => navigation.navigate("mywishlist", { user: userInfo })}
        />
        {/* !For future use --- */}
        {/* <OptionList
          text={"Settings"}
          Icon={Ionicons}
          iconName={"settings-sharp"}
          onPress={() => console.log("working....")}
        />
        <OptionList
          text={"Help Center"}
          Icon={Ionicons}
          iconName={"help-circle"}
          onPress={() => console.log("working....")}
        /> */}
        {/* !For future use ---- End */}
        <OptionList
          text={"Logout"}
          Icon={Ionicons}
          iconName={"log-out"}
          onPress={async () => {
            try{

              let user= await (AsyncStorage.getItem("authUser"));
              const tracker = createTracker("appTracker", {
                endpoint: COLLECTOR_URL,
                method: "post",
                customPostPath: "com.snowplowanalytics.snowplow/tp2", // A custom path which will be added to the endpoint URL to specify the complete URL of the collector when paired with the POST method.
                requestHeaders: {}, // Custom headers for HTTP requests to the Collector
              },
              {
                subjectConfig: {
                  userId: userId ?? null,
                },
              },
              {
                trackerConfig: {
                  appId: Platform.OS === "ios" ? "ecomm-ios" : "ecomm-android",
                },
              });
              tracker.trackSelfDescribingEvent({
                schema: "iglu:com.proemsportsanalytics/logout/jsonschema/1-0-0",
                data: { user_id: JSON.parse(user)._id },
              });
            }
            catch{(e)=>console.log(e)}
            await AsyncStorage.removeItem("authUser");
            navigation.replace("login");
          }}
        />
      </View>
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    flex: 1,
  },
  TopBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  UserProfileCardContianer: {
    width: "100%",
    height: "25%",
  },
  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  OptionsContainer: {
    width: "100%",
  },
});
