import React from "react";
import Routes from "./routes/Routes";
import { Provider } from "react-redux";
import { store } from "./states/store";
import { Platform } from "react-native";
import { createTracker } from "@snowplow/react-native-tracker";
import { requestFCMPermissionAndToken } from "./firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  console.reportErrorsAsExceptions = false;
  const [userId, setUserId] = React.useState(null);
  var COLLECTOR_URL = "https://orga.proemsportsanalytics.com";

  const getUserId = async () => {
    let user = await AsyncStorage.getItem("authUser");
    let userId = JSON?.parse(user)?._id;
    setUserId(userId);
  };
  
  
  const tracker = createTracker(
    "appTracker",
    {
      endpoint: COLLECTOR_URL,
      method: "post",
      customPostPath: "com.snowplowanalytics.snowplow/tp2", // A custom path which will be added to the endpoint URL to specify the complete URL of the collector when paired with the POST method.
      requestHeaders: {}, // Custom headers for HTTP requests to the Collector
    },
    {
      trackerConfig: {
        appId: Platform.OS === "ios" ? "ecomm-ios" : "ecomm-android",
        devicePlatform: "mob",
        base64Encoding: true,
        logLevel: "off",
        applicationContext: true,
        platformContext: true,
        geoLocationContext: false,
        sessionContext: true,
        deepLinkContext: true,
        screenContext: true,
        screenViewAutotracking: true,
        lifecycleAutotracking: true,
        installAutotracking: true,
        exceptionAutotracking: true,
        diagnosticAutotracking: false,
        userAnonymisation: false, // Whether to anonymise client-side user identifiers in session and platform context entities
      },
      subjectConfig: {
        userId: userId ?? null,
      },
      sessionConfig: {
        foregroundTimeout: 300, // seconds
        backgroundTimeout: 300, //seconds
      },
    }
  );

  React.useEffect(() => {
    (async () => {
      const fcmToken = await requestFCMPermissionAndToken();
      try {
        if (fcmToken) {
          tracker.trackSelfDescribingEvent({
            schema:
              "iglu:com.proemsportsanalytics/update_fcm_token/jsonschema/1-0-0",
            data: { fcm_token: fcmToken },
          });
        }
      } catch {
        (e) => console.log("erorrr>>>>>>>>>>>>>>>>>>>.",e);
      }
    })();
    getUserId();
  }, []);

  return (
    <Provider store={store}>
      <Routes tracker={tracker}/>
    </Provider>
  );
}
