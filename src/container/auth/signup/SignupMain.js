// 회원가입 유형 선택
// 일반회원 : 약관 동의 > 본인인증 > 필수 정보 입력 > 회원가입 완료
// 사업자 회원 : 약관 동의 > 담당자 정보 입력 > 업체인증 > 회원가입 완료
import React, {Component} from "react";
import {View, Text, Image, TouchableOpacity, StyleSheet, BackHandler} from "react-native";

import {Header} from "../../../component/signup/Header";
import {BottomBtn} from "../../../component/signup/BottomBtn";

import {CodeText, SignupText} from "../../../model/lib/Utils/Strings";
import Colors from "../../../model/lib/Utils/Colors";
import Fonts from "../../../model/lib/Utils/Fonts";

import {
  widthPercentageToDP as wp,
} from "../../../model/lib/Utils";

class SignupMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_type: false,
            currentUserType: null,
        };
    }

    componentDidMount() {
        this._navListener = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                return true;
            }
        );
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    render() {
        const {navigation} = this.props;
        const {currentUserType, user_type} = this.state;
        return (
            <View style={styles.container}>
                <Header step={1} total={user_type ? currentUserType === 1 ? 5 : 6 : null} navigation={navigation}/>
                <Text style={styles.signUp}>{SignupText.userType}</Text>
                <View style={styles.userTypeContainer}>
                    <TouchableOpacity
                        style={[
                            styles.userTypeBox,
                            {
                                borderColor:
                                    currentUserType === 0 ? Colors.MAIN_COLOR : "#c1c1c1",
                                borderWidth: currentUserType === 0 ? 1 : 0.5,
                            },
                        ]}
                        onPress={() => this.setState({currentUserType: 0, user_type: true})}
                    >
                        <Image
                            style={styles.typeIcon}
                            source={
                                currentUserType === 0
                                    ? require("../../../assets/image/signup/a_on.png")
                                    : require("../../../assets/image/signup/a_off.png")
                            }
                        />
                        {currentUserType === 0 ? (
                            <View style={styles.activeBox}>
                                <Image
                                    source={require("../../../assets/image/signup/check_pink_48_dp_1_2.png")}
                                    style={styles.checkIcon}
                                />
                                <Text
                                    style={[{
                                        fontFamily: Fonts.AppleR,
                                        fontSize: 14,
                                        lineHeight: 32,
                                    }, currentUserType === 0 ? {color: "#393939"} : {color: "#969696"}]}
                                >
                                    {SignupText.general}
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.userType}>{SignupText.general}</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.userTypeBox,
                            {
                                borderColor:
                                    currentUserType === 1 ? Colors.MAIN_COLOR : "#c1c1c1",
                                borderWidth: currentUserType === 1 ? 1 : 0.5,
                            },
                        ]}
                        onPress={() => this.setState({currentUserType: 1, user_type: true})}
                    >
                        <Image
                            style={styles.typeIcon}
                            source={
                                currentUserType === 1
                                    ? require("../../../assets/image/signup/b_on.png")
                                    : require("../../../assets/image/signup/b_off.png")
                            }
                        />
                        {currentUserType === 1 ? (
                            <View style={styles.activeBox}>
                                <Image
                                    source={require("../../../assets/image/signup/check_pink_48_dp_1_2.png")}
                                    style={styles.checkIcon}
                                />
                                <Text
                                    style={[{
                                        fontFamily: Fonts.AppleR,
                                        fontSize: 14,
                                        lineHeight: 32,
                                    }, currentUserType === 1 ? {color: "#393939"} : {color: "#969696"}]}
                                >
                                    {SignupText.business}
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.userType}>{SignupText.business}</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <BottomBtn
                    navigation={navigation}
                    isActive={currentUserType !== null}
                    nav="SignupTerms"
                    params={{mber_se_cd: currentUserType === 0 ? CodeText.mber_se_cd_g : CodeText.mber_se_cd_c}}
                    currentUserType={currentUserType}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  signUp: {
    marginTop: wp("16%"),
    marginLeft: 20,
    fontFamily: Fonts.AppleR,
    fontSize: wp("8%"),
    lineHeight: wp("12%"),
    color: "#191919",
  },
  userTypeContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 140,
    justifyContent: "space-between",
  },
  userTypeBox: {
    borderRadius: 5,
    width: "48.5%",
    height: wp("48%"),
    alignItems: "center",
    paddingTop: 36.8,
  },
  userType: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    lineHeight: 32,
    color: "#969696",
    position: "absolute",
    bottom: 20,
  },
  typeIcon: {
    width: 75,
    height: 75,
  },
  checkIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  activeBox: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
  },
});

export default SignupMain;
