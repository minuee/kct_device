// 회원 탈퇴 안내
import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {connect} from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";

import {MyPageText, TOKEN} from "../../../model/lib/Utils/Strings";
import Fonts from "../../../model/lib/Utils/Fonts";
import {DEVICE_WIDTH, StatusBarHeight} from "../../../model/lib/Utils/Constants";

import * as ActionMber from "../../../model/action/eMBER";
import * as ActionUser from "../../../model/action/eUSER";
import * as ActionSession from "../../../model/action/eSESSION";
import {clearAsyncStorage} from "../../../model/lib/Utils";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  betweenCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeBtn: {
    width: 50,
    height: 50,
    marginTop: StatusBarHeight,
    marginLeft: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.7,
    color: "#555555",
    marginTop: 30,
  },
  submitBox: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH - 40 ,
    // backgroundColor: "#191919",
    marginHorizontal: 20,
    position: 'absolute',
    bottom: 25,
    borderRadius: 5,
  },
  submit: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    color: "#f5f5f5",
  },
});

class Withdraw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    };
  }

  handleDelete = () => {
    this.props.remove({}).then((res) => {
      this.handleLogout();
    }).catch((err) => {
    });
  }

  handleLogout = () => {
    const { navigation } = this.props;
    this.props.logout({}).then((res) => {
      // AsyncStorage.clear();
      clearAsyncStorage().then((result) => console.log("remove All"))
      this.props.setSession({});
      navigation.navigate("WithdrawResult");
    }).catch((err) => {
    });
  };

  renderSubmitBtns = () => {
    const { navigation } = this.props;
    const {isChecked} = this.state;
    return (
      <TouchableOpacity
        style={[styles.submitBox, isChecked? { backgroundColor: "#191919" } : { backgroundColor: "#dddddd" }]}
        onPress={() => {
          isChecked ? this.handleDelete() : null
        }}
      >
        <Text style={styles.submit}>{MyPageText.withdraw}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { navigation } = this.props;
    const {isChecked} = this.state;

    return (
      <>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require("../../../assets/image/common/close_page.png")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
          <View style={{ paddingHorizontal: 20, marginTop: 37.8 }}>
            <Text
              style={{
                fontFamily: Fonts.AppleB,
                fontSize: 23,
                lineHeight: 31,
                letterSpacing: -1.15,
                color: "#222222",
              }}
            >
              {MyPageText.withdrawTitle}
            </Text>
            <Text style={styles.message}>{MyPageText.withdrawMessage_1}</Text>
            <Text style={styles.message}>{MyPageText.withdrawMessage_3}</Text>
            <Text style={styles.message}>{MyPageText.withdrawMessage_3}</Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 25,
              }}
              onPress={() => this.setState({isChecked: !isChecked})}
            >
              <Image
                source={
                  isChecked
                      ?  require("../../../assets/image/signup/check_circle_on.png")
                      :  require("../../../assets/image/signup/check_circle_off.png")}
                style={{ width: 21, height: 21, marginRight: 10 }}
              />
              <Text
                style={{
                  fontFamily: Fonts.AppleR,
                  letterSpacing: -0.7,
                  color: "#393939",
                }}
              >
                {MyPageText.agree}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {this.renderSubmitBtns()}
      </>
    );
  }
}

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  remove: (params) => dispatch(ActionMber.remove(params)),
  logout: (params) => dispatch(ActionUser.logout(params)),
  setSession: (params) => dispatch(ActionSession.setSession(params)),
});

export default connect(undefined, mapDispatchToProps)(Withdraw);
