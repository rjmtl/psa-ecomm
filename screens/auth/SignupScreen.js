import {
  StyleSheet,
  Text,
  Image,
  StatusBar,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import header_logo from "../../assets/logo/logo.png";
import CustomButton from "../../components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import axios from "axios";
import { createTracker } from "@snowplow/react-native-tracker";
import ProgressDialog from "react-native-progress-dialog";

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  var COLLECTOR_URL = "https://orga.proemsportsanalytics.com";
  const [isloading, setIsloading] = useState(false);



  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = {
    email: email,
    password: password,
    name: name,
    userType: "USER",
    username: email
  };

  var requestOptions = {
    headers: myHeaders,
    method: 'post', // The HTTP method (e.g., 'get', 'post', 'put', 'delete', etc.)
    url: `${network.serverip}/register`, // The URL you want to send the request to
    data: raw
  };

  //method to post the user data to server for user signup using API call
  const signUpHandle = () => {
    setIsloading(true);
    if (email == "") {
      setIsloading(false)
      return setError("Please enter your email");
    }
    if (name == "") {
      setIsloading(false)
      return setError("Please enter your name");
    }
    if (password == "") {
      setIsloading(false)
      return setError("Please enter your password");
    }
    if (!email.includes("@")) {
      setIsloading(false)
      return setError("Email is not valid");
    }
    if (email.length < 6) {
      setIsloading(false)
      return setError("Email is too short");
    }
    if (password.length < 5) {
      setIsloading(false)
      return setError("Password must be 6 characters long");
    }
    if (password != confirmPassword) {
      setIsloading(false)
      return setError("password does not match");
    }
    axios(requestOptions) // API call
      .then((result) => {
        if (result.status==200) {
          navigation.navigate("login");
          const tracker = createTracker("appTracker", {
            endpoint: COLLECTOR_URL,
            method: "post",
            customPostPath: "com.snowplowanalytics.snowplow/tp2", // A custom path which will be added to the endpoint URL to specify the complete URL of the collector when paired with the POST method.
            requestHeaders: {}, // Custom headers for HTTP requests to the Collector
          },{
            trackerConfig: {
              appId: Platform.OS === "ios" ? "ecomm-ios" : "ecomm-android",
            },
          });
          tracker.trackSelfDescribingEvent({
            schema: "iglu:com.proemsportsanalytics/user_attributes/jsonschema/1-0-0",
            data: { firstName: raw.name, email: raw.email },
          });
          setIsloading(false)
        }
      })
      .catch((error) => setIsloading(false));
  };
  return (
      <KeyboardAvoidingView style={styles.container}>
        <StatusBar></StatusBar>
        <View style={styles.TopBarContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons
              name="arrow-back-circle-outline"
              size={30}
              color={colors.muted}
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={{ flex: 1, width: "100%" }}>
        <ProgressDialog visible={isloading} label={"Signing up ..."} />
          <View style={styles.welconeContainer}>
            <Image style={styles.logo} source={header_logo} />
          </View>
          <View style={styles.screenNameContainer}>
            <View>
              <Text style={styles.screenNameText}>Sign up</Text>
            </View>
            <View>
              <Text style={styles.screenNameParagraph}>
                Create your account on EasyBuy to get an access to millions of
                products
              </Text>
            </View>
          </View>
          <View style={styles.formContainer}>
            <CustomAlert message={error} type={"error"} />
            <CustomInput
              value={name}
              setValue={setName}
              placeholder={"Name"}
              placeholderTextColor={colors.muted}
              radius={5}
            />
            <CustomInput
              value={email}
              setValue={setEmail}
              placeholder={"Email"}
              placeholderTextColor={colors.muted}
              radius={5}
            />
            <CustomInput
              value={password}
              setValue={setPassword}
              secureTextEntry={true}
              placeholder={"Password"}
              placeholderTextColor={colors.muted}
              radius={5}
            />
            <CustomInput
              value={confirmPassword}
              setValue={setConfirmPassword}
              secureTextEntry={true}
              placeholder={"Confirm Password"}
              placeholderTextColor={colors.muted}
              radius={5}
            />
          </View>
        </ScrollView>
        <View style={styles.buttomContainer}>
          <CustomButton text={"Sign up"} onPress={signUpHandle} />
        </View>
        <View style={styles.bottomContainer}>
          <Text>Already have an account?</Text>
          <Text
            onPress={() => navigation.navigate("login")}
            style={styles.signupText}
          >
            Login
          </Text>
        </View>
      </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
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
  welconeContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "15%",
  },
  formContainer: {
    flex: 2,
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    width: "100%",
    flexDirecion: "row",
    padding: 5,
  },
  logo: {
    resizeMode: "contain",
    width: 80,
  },
  forgetPasswordContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  ForgetText: {
    fontSize: 15,
    fontWeight: "600",
  },
  buttomContainer: {
    width: "100%",
  },
  bottomContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    marginLeft: 2,
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  screenNameParagraph: {
    marginTop: 5,
    fontSize: 15,
  },
});
