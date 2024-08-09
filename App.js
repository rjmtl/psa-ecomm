import React from "react";
import Routes from "./routes/Routes";
import { Provider } from "react-redux";
import { store } from "./states/store";
import { Platform } from "react-native";
import { createTracker } from "@snowplow/react-native-tracker";
// import { getFirebase, requestFCMPermissionAndToken } from "./firebase/app";;n
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from '@react-native-firebase/messaging';



export default function App() {
  console.reportErrorsAsExceptions = false;
  const [userId, setUserId] = React.useState(null);
  var COLLECTOR_URL = "https://bfc.proemsportsanalytics.com";

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

  // React.useEffect(() => {
  //   (async () => {
  //     const fcmToken = await requestFCMPermissionAndToken();
  //     try {
  //       if (fcmToken) {
  //         tracker.trackSelfDescribingEvent({
  //           schema:
  //             "iglu:com.proemsportsanalytics/update_fcm_token/jsonschema/1-0-0",
  //           data: { fcm_token: fcmToken },
  //         });
  //       }
  //     } catch {
  //       (e) => console.log("erorrr>>>>>>>>>>>>>>>>>>>.",e);
  //     }
  //   })();
  // }, []);


  React.useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      
      console.log("recieved",remoteMessage)
      tracker.trackSelfDescribingEvent({
        schema: "iglu:com.proemsportsanalytics/notification_received/jsonschema/1-0-0",
        data: {
          psa_ma_id: remoteMessage.data.psa_ma_id ?? null,
          psa_event_id: remoteMessage.data.psa_event_id ?? null,
          psa_campaign_id: remoteMessage.data.psa_campaign_id ?? null,
          userId: userId ?? null
        },
      });
    });
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("recieved",remoteMessage)

      tracker.trackSelfDescribingEvent({
        schema: "iglu:com.proemsportsanalytics/notification_received/jsonschema/1-0-0",
        data: {
          psa_ma_id: remoteMessage.data.psa_ma_id ?? null,
          psa_event_id: remoteMessage.data.psa_event_id ?? null,
          psa_campaign_id: remoteMessage.data.psa_campaign_id ?? null,
          userId: userId ?? null
        },
      });
    });

    const unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log("recieved",remoteMessage)
      
      tracker.trackSelfDescribingEvent({
        schema: "iglu:com.proemsportsanalytics/notification_opened/jsonschema/1-0-0",
        data: {
          psa_ma_id: remoteMessage.data.psa_ma_id ?? null,
          psa_event_id: remoteMessage.data.psa_event_id ?? null,
          psa_campaign_id: remoteMessage.data.psa_campaign_id ?? null,
          userId: userId ?? null
        },
      });
      // Perform action on notification open
    });

    // Check if the app was opened by a notification when the app was in quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
      console.log("recieved",remoteMessage)

        console.log('opened from quit state', remoteMessage.data.psa_campaign_id, remoteMessage.data.psa_event_id, remoteMessage.data.psa_ma_id);
        if (remoteMessage?.data) {
          tracker.trackSelfDescribingEvent({
            schema: "iglu:com.proemsportsanalytics/notification_opened/jsonschema/1-0-0",
            data: {
              psa_ma_id: remoteMessage.data.psa_ma_id ?? null,
              psa_event_id: remoteMessage.data.psa_event_id ?? null,
              psa_campaign_id: remoteMessage.data.psa_campaign_id ?? null,
              userId: userId ?? null
            },
          });
          // Handle the initial notification
        }
      });

    // Cleanup function
    return () => {
      unsubscribe();
      unsubscribeOnNotificationOpened();
    };


    //   getUserId();
  }, []);

  return (
    <Provider store={store}>
      <Routes tracker={tracker} />
    </Provider>
  );
}
