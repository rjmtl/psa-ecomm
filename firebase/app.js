import firebase from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";

let app;


export const getFirebase = () => {
  if (!app) {
    app = firebase.app();
    firebase.initializeApp();
  }
  return app;
};

export const resetFirebase = () => {
  app = firebase.app();
  return app;
};

export const requestFCMPermissionAndToken = async () => {
  try {
    const _firebase = getFirebase();
    const authStatus = await _firebase.messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      try {
        await messaging().registerDeviceForRemoteMessages();
        const fcmToken = await getFirebase().messaging().getToken();
        if (!fcmToken) {
          throw new Error("Failed to fetch the FCM token");
        }
        return fcmToken;
      } catch (e) {
        throw e;
      }
    } else {
      return false;
    }
  } catch (e) {
    console.log("Error while generating fcm token. Reason: ", e);
    return false;
  }
};
