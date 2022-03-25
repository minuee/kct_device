import React, { Component } from 'react'
import {View, StatusBar, Platform, BackHandler, Linking} from 'react-native'
import * as DeviceInfo from "react-native-device-info";

//dependencies
import {connect} from "react-redux";
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';

//utils
import {CodeText, Generic, LinkInfo, TOKEN} from "../model/lib/Utils/Strings";
import {clearAsyncStorage} from "../model/lib/Utils";

//action
import * as ActionSession from "../model/action/eSESSION";
import * as ActionMber from "../model/action/eMBER";
import * as ActionConst from "../model/action/eCOMM_CD";

import ConfirmModal from "../component/modal/ConfirmModal";
import AlertModal from "../component/modal/AlertModal";

class Splash extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isShowConfirmModal: false,
      isShowAppVerModal: false,
    };
  }

  componentDidMount() {
    this.getAppVer();
  }

  setInit = () => {
    const {eCOMM_CD, eCOMM_CD_TYPE} = this.props;
    this.props.getConst({}).then((res) => {
    }).catch((err) => {
      this.props.getConst({}).then((res) => {
      }).catch((err) => {
        this.setState({isShowConfirmModal: true});
      });
    });

    if (eCOMM_CD === null || eCOMM_CD_TYPE === null ) {
      this.props.getConst({}).then((res) => {
        this.props.setConst(res.comm_cd);
        this.props.setConstType(res.comm_cd_typ);
      }).catch((err) => {
      });
    }
    AsyncStorage.getItem(TOKEN.user).then((userToken) => {
      if (userToken === null) {
        // AsyncStorage.clear();
        clearAsyncStorage().then((result) => console.log("remove All"))
        this.props.navigation.navigate("Auth");
      } else {
        AsyncStorage.getItem(TOKEN.remember_login).then((autoLogin) => {
          this.props.getSession({}).then((res) => {
            this.props.setSession(res.account);
            this.handleToken(res.account.mber_no);
            this.props.navigation.navigate("Main"); // Login 화면 먼저
          }).catch((err) => { // 409 : 사용자 차단 && 501 : 세션 아웃
            let errorCode = err.response.data.error.status;
            // AsyncStorage.clear();
            clearAsyncStorage().then((result) => console.log("remove All"))
            this.props.setSession({});
            if(errorCode === 409 || errorCode === 501)
              this.props.navigation.navigate("Auth");
            else
              this.props.navigation.navigate("Main");
          });
        }).catch((err) => {
          // AsyncStorage.clear();
          clearAsyncStorage().then((result) => console.log("remove All"))
          this.props.navigation.navigate("Auth");
        });
      }
    }).catch((err) => {
      // AsyncStorage.clear();
      clearAsyncStorage().then((result) => console.log("remove All"))
      this.props.navigation.navigate("Auth");
    });
  }

  getAppVer = () => {
    const app_ver = DeviceInfo.getVersion();
    let params = {
      os_cd: Platform.OS === "ios" ? CodeText.os_cd_ios : CodeText.os_cd_android,
      ver_val: app_ver
    };

    console.log("getAppVer")
    console.log(params)

    this.props
      .getAppVer(params)
      .then((res) => {
        console.log(res.force_close_yn)
        if(res.force_close_yn === "Y") {
          const isUpdate = this.handleCompareVer(res.detail.ver_val, app_ver)
          if(isUpdate)
            this.setState({isShowAppVerModal: true});
          else this.setInit();
        } else this.setInit();
      })
      .catch((err) => {
        this.setState({isShowConfirmModal: true});
      });
  };

  handleCompareVer = (ver_app, ver_ser) => {
    let serverVersion = ver_ser.split(".");
    let appVersion = ver_app.split(".");

    let isUpdate = true;
    const length = Math.max( serverVersion.length, appVersion.length );
    for ( let i = 0; i < length ; i ++ ){
      let a = serverVersion[i] ? parseInt(serverVersion[i], 10 ) : 0;
      let b = appVersion[i] ? parseInt(appVersion[i], 10 ) : 0;
      if ( a > b ) { isUpdate = false; break; }
      if ( a < b ) { isUpdate = true; break; }
    }
    return isUpdate;
  }

  handleToken = async (mber_no) => {
    const token = await messaging().getToken();
    let params = {
      mber_no,
      firebase_os_cd: Platform.OS === "ios" ? CodeText.os_cd_ios : CodeText.os_cd_android,
      firebase_token: token
    }
    this.props.update(params).then((res) => {

    }).catch((err) => {
    });
  }

  handleAppUpdate = () => {
    if (Platform.OS === 'android') {
      this.handlePress(LinkInfo.GOOGLE_PLAY_STORE_LINK, LinkInfo.GOOGLE_PLAY_STORE_WEB_LINK);
    } else {
      this.handlePress(LinkInfo.APPLE_APP_STORE_LINK, LinkInfo.APPLE_APP_STORE_WEB_LINK);
    }
  }
  handlePress = async (url, alterUrl) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) { // 설치되어 있으면
      await Linking.openURL(url);
    } else { // 앱이 없으면
      await Linking.openURL(alterUrl);
    }
  }

  render() {
    const { isShowConfirmModal, isShowAppVerModal } = this.state;
    return (
      <View style={{flex:1, backgroundColor: "#F6E4ED"}}>
        <StatusBar hidden={true} />
        {isShowConfirmModal && (
            <ConfirmModal
                isShowConfirmModal={isShowConfirmModal}
                setVisible={() =>
                  this.setState({isShowConfirmModal: false}, () => BackHandler.exitApp())
                }
                title={Generic.notice}
                subtitle={Generic.alertMessage}
            />
        )}
        {isShowAppVerModal && (
          <AlertModal
            isShowAlertModal={isShowAppVerModal}
            message={Generic.appVerMessage}
            // leftText={Generic.cancel}
            leftText={""}
            rightText={Generic.goToUpdate}
            setVisible={() => this.setState({isShowAppVerModal: false}, () => BackHandler.exitApp())}
            leftOnPress={() => this.setState({isShowAppVerModal: false}, () => BackHandler.exitApp())}
            rightOnPress={() => this.handleAppUpdate()}
          />
        )}
      </View>
    );
  }

}

// Define which part of the state we're passing to this component
const mapStateToProps = (state) => ({
  eCOMM_CD: state.eCOMM_CD.eCOMM_CD,
  eCOMM_CD_TYPE: state.eCOMM_CD.eCOMM_CD_TYPE,
});

// Define the actions this component may dispatch
const mapDispatchToProps = dispatch => ({
  getSession: (params) => dispatch(ActionSession.getSession(params)),
  setSession: (params) => dispatch(ActionSession.setSession(params)),
  update: (params) => dispatch(ActionMber.update(params)),

  getConst: (params) => dispatch(ActionConst.getConst(params)),
  setConst: (params) => dispatch(ActionConst.setConst(params)),
  setConstType: (params) => dispatch(ActionConst.setConstType(params)),
  getAppVer: (params) => dispatch(ActionConst.getAppVer(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
