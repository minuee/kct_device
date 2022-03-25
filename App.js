import React, { Component } from "react";
import SplashScreen from "react-native-splash-screen";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";

import AppReducer from "./src/model/reducers";
import { AppContainer } from "./src/model/AppNavigator";

import thunkMiddleware from "redux-thunk";
import {Linking, Platform, StatusBar} from "react-native";
import messaging from "@react-native-firebase/messaging";
import {
  navigate,
  parseUrl,
  setTopLevelNavigator,
} from "./src/model/RootNavigation";

let store = createStore(AppReducer, applyMiddleware(...[thunkMiddleware]));

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
  // handleNavigation(remoteMessage);
});

export const handleNavigation = async (remoteMessage) => {
  console.log("handleNavigation : ", remoteMessage);
  if (
      store.getState().eSESSION &&
      store.getState().eSESSION.eSESSION &&
      store.getState().eSESSION.eSESSION.mber_no
  ) {
    const noti = remoteMessage.data;
    if (noti.app_path) {
      const link_info = await parseUrl(noti.app_path);
      if (link_info?.nav) navigate(link_info.nav, link_info.params);
    } else navigate("Notification");
  } else navigate("Login");
};

class TplusApp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    setTimeout(() => {
      SplashScreen.hide(); /** 추가 **/
    }, 2500); /** 스플래시 시간 조절 (2초) **/

    {Platform.OS === "ios" && this.checkPermission();}// FCM iOS 권한체크
    this.handleFcmMessage();
    this.handleLinkMessage();
  };

  checkPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if(enabled) {
      await this.getFirebaseToken();
    } else {
      try {
        await this.getRequestPermission();
      } catch (err) {
        console.log("you can't handle push notification")
      }
    }
  }

  getFirebaseToken = async () => {
    const token = await messaging().getToken();
    console.log(token);
  }

  getRequestPermission = async () => {
    try {
      await messaging().requestPermission();
    } catch (err) {
      console.log("you can't handle push notification")
    }
  }

  handleFcmMessage = () => {
    messaging().onMessage(async (remoteMessage) => {
      console.log(JSON.stringify(remoteMessage));
    });
    messaging().onNotificationOpenedApp((remoteMessage) => {
      // Notification 클릭 후, 앱 켜기
      handleNavigation(remoteMessage);
    });
  };


  handleLinkMessage = () => {
    Linking.getInitialURL().then(async (url) => {
      if (url) {
        const link_info = await parseUrl(url);
        if (link_info?.nav) navigate(link_info.nav, link_info.params);
      }
    });
    Linking.addEventListener("url", async (event) => {
      const url = event.url;
      if (url) {
        const link_info = await parseUrl(url);
        if (link_info?.nav) navigate(link_info.nav, link_info.params);
      }
    });
  };

  render() {
    return (
      <Provider store={store}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={"transparent"}
          translucent={true}
        />
        <AppContainer
          ref={(navigatorRef) => {
            setTopLevelNavigator(navigatorRef);
          }}
        />
      </Provider>
    );
  }
}

export default TplusApp;
