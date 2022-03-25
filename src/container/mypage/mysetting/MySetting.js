// 설정
// 푸시알림/언어선택 화면
import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
} from "react-native";
import * as DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-community/async-storage";
import { connect } from "react-redux";

import {
  CodeText,
  Generic,
  MyPageText,
  TOKEN,
} from "../../../model/lib/Utils/Strings";
import Fonts from "../../../model/lib/Utils/Fonts";
import { notifyMessage } from "../../../model/lib/Utils";

import { TopHeader } from "../../../component/TopHeader";

import * as ActionConst from "../../../model/action/eCOMM_CD";
import * as ActionMber from "../../../model/action/eMBER";
import * as ActionSession from "../../../model/action/eSESSION";
import LanguageModal from "../../../component/modal/LanguageModal";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  betweenCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoIcon: {
    width: 74,
    height: 30,
  },
  versionWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },
  versionText: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    letterSpacing: -0.3,
    color: "#999999",
  },
  versionTextBorder: {
    marginHorizontal: 8,
    width: 2,
    height: 14,
    backgroundColor: "#dcdcdc",
  },
  csCallNum: {
    fontFamily: Fonts.AppleB,
    fontSize: 11,
    letterSpacing: -0.28,
    color: "#000000",
    marginTop: 31.5,
    textDecorationLine: "underline",
  },
  settingBox: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f1f1f1",
    marginTop: 62.4,
  },
  settingBoxText: {
    fontFamily: Fonts.AppleB,
    fontSize: 14,
    letterSpacing: -0.35,
    color: "#000000",
  },
  settingBoxWrap: {
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 17.5,
    paddingBottom: 20,
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
  },
  pushNoticeText: {
    fontFamily: Fonts.AppleB,
    fontSize: 15,
    letterSpacing: -0.38,
    color: "#000000",
  },
  pushNoticeMessage: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    letterSpacing: -0.3,
    color: "#999999",
    marginTop: 7.8,
  },
  setLanguageWrap: {
    paddingTop: 18,
    paddingHorizontal: 15,
    paddingBottom: 30.5,
    backgroundColor: "white",
  },
  setLanguageText: {
    fontFamily: Fonts.AppleB,
    fontSize: 15,
    letterSpacing: -0.38,
    color: "#000000",
  },
  setLanguageDropdown: {
    borderRadius: 3,
    backgroundColor: "#f9f9f9",
    borderWidth: 0.5,
    borderColor: "#999999",
    paddingLeft: 15,
    paddingRight: 10,
    height: 40,
    marginTop: 13,
  },
  setLanguageBtn: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#999999",
  },
  cacheRemove: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#555555",
  },
  cacheUse: {
    fontFamily: Fonts.AppleB,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#ef2583",
    textDecorationLine: "underline",
  },
});

class MySetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTabIdx: 0,
      isShowSelectPhotoModal: false,
      detail: {},
      versionDetail: {},
      isShowLanguageModal: false,
    };
  }

  componentDidMount() {
    this.getAppVer();
  }

  getAppVer = () => {
    let params = {
      os_cd:
        Platform.OS === "ios" ? CodeText.os_cd_ios : CodeText.os_cd_android,
    };

    this.props
      .getAppVer(params)
      .then((res) => {
        this.setState({ versionDetail: res.detail });
      })
      .catch((err) => {});
  };

  handleUpdate = () => {
    const { eSESSION } = this.props;
    let params = {
      mber_no: eSESSION.mber_no,
      push_ntcn_recptn_yn: eSESSION.push_ntcn_recptn_yn === "Y" ? "N" : "Y",
    };

    this.props
      .update(params)
      .then((res) => {
        console.log("res");
        console.log(res);
        this.props.getSession({}).then((res) => {
          this.props.setSession(res.account);
          notifyMessage("정보를 수정하였습니다.");
        });
      })
      .catch((err) => {});
  };

  renderVersionBox = () => {
    const { versionDetail } = this.state;
    return (
      <View style={{ marginTop: 70, alignItems: "center" }}>
        <Image
          style={styles.logoIcon}
          source={require("../../../assets/image/main/logo_header.png")}
        />
        <View style={styles.versionWrap}>
          <Text style={styles.versionText}>
            {MyPageText.newVersion} : {versionDetail.ver_val}{" "}
          </Text>
          <View style={styles.versionTextBorder} />
          <Text style={styles.versionText}>
            {MyPageText.currentVersion} : {DeviceInfo.getVersion()}{" "}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${Generic.callNumber}`)}
        >
          <Text style={styles.csCallNum}>{MyPageText.csCallNum}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderSettingBox = () => {
    const { eSESSION } = this.props;
    return (
      <View style={styles.settingBox}>
        <Text style={styles.settingBoxText}>{MyPageText.pushNLanguage}</Text>
        <View
          style={{ backgroundColor: "white", marginTop: 15 }}
          shadowColor="#14000020"
          shadowOffset={{ width: 0, height: 0 }}
          shadowOpacity={1}
        >
          <View style={[styles.betweenCenter, styles.settingBoxWrap]}>
            <View>
              <Text style={styles.pushNoticeText}>{MyPageText.pushNotice}</Text>
              <Text style={styles.pushNoticeMessage}>
                {MyPageText.pushNoticeMessage}
              </Text>
            </View>
            <TouchableOpacity onPress={() => this.handleUpdate()}>
              <Image
                style={{ width: 41, height: 21.8 }}
                source={
                  eSESSION.push_ntcn_recptn_yn === "Y"
                    ? require("../../../assets/image/mypage/toggle_on.png")
                    : require("../../../assets/image/mypage/toggle_off.png")
                }
              />
            </TouchableOpacity>
          </View>
          <View style={styles.setLanguageWrap}>
            <Text style={styles.setLanguageText}>{MyPageText.setLanguage}</Text>
            <TouchableOpacity
              activeOpacity={1.0}
              style={[styles.betweenCenter, styles.setLanguageDropdown]}
              // onPress={() => this.setState({ isShowLanguageModal: true })}
            >
              <Text style={styles.setLanguageBtn}>{MyPageText.korean}</Text>
              <Image
                style={{ width: 20, height: 20 }}
                source={require("../../../assets/image/mypage/dropdown_btn_regular.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/*<View style={[styles.betweenCenter, { marginTop: 25 }]}>*/}
        {/*  <Text style={styles.cacheRemove}>*/}
        {/*    {MyPageText.cacheRemove}*/}
        {/*  </Text>*/}
        {/*  <TouchableOpacity onPress={() => {*/}
        {/*    AsyncStorage.getAllKeys(items => console.log(items))*/}
        {/*    // AsyncStorage.clear();*/}
        {/*  }} >*/}
        {/*    <Text style={styles.cacheUse}>*/}
        {/*      1KB {MyPageText.cacheUse}*/}
        {/*    </Text>*/}
        {/*  </TouchableOpacity>*/}
        {/*</View>*/}
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const { isShowLanguageModal } = this.state;
    return (
      <View style={styles.container}>
        <TopHeader title={MyPageText.setting} navigation={navigation} />
        {this.renderVersionBox()}
        {this.renderSettingBox()}
        <LanguageModal
          navigation={navigation}
          isShowLanguageModal={isShowLanguageModal}
          setVisible={() => this.setState({ isShowLanguageModal: false })}
          selectedLanguageId={4}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  eSESSION: state.eSESSION.eSESSION,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  getAppVer: (params) => dispatch(ActionConst.getAppVer(params)),
  update: (params) => dispatch(ActionMber.update(params)),
  getDetail: (params) => dispatch(ActionMber.getDetail(params)),
  getSession: (params) => dispatch(ActionSession.getSession(params)),
  setSession: (params) => dispatch(ActionSession.setSession(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MySetting);
