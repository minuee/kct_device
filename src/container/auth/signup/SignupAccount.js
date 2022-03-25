// 회원가입 본인 인증
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {isValidKorean} from "../../../model/lib/Utils";

//Component
import { Header } from "../../../component/signup/Header";
import { BottomBtn } from "../../../component/signup/BottomBtn";
import { TermsRow } from "../../../component/signup/TermsRow";
import TextInputStr from "../../../common/textinput/TextInput";

//Utils
import Colors from "../../../model/lib/Utils/Colors";
import Fonts from "../../../model/lib/Utils/Fonts";
import { notifyMessage } from "../../../model/lib/Utils";
import {
  CodeText,
  Generic,
  SignupText,
  TermsCode,
} from "../../../model/lib/Utils/Strings";

//Action
import * as ActionUser from "../../../model/action/eUSER";
import * as ActionMber from "../../../model/action/eMBER";
import ConfirmModal from "../../../component/modal/ConfirmModal";

const AuthNumberInput = ({ setCheckAuthAvailable, setErrorMsg, isNext, isTimer, verfi_no }) => {
  const [minutes, setMinutes] = useState(3);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setMinutes(3);
    setSeconds(0);
  }, [isTimer, verfi_no]);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (verfi_no !== -1 && !isNext && minutes === 0 && seconds === 0) {
        setErrorMsg(SignupText.reSendVerification);
        setCheckAuthAvailable(false);
      } else setCheckAuthAvailable(true);
      if (parseInt(seconds) > 0) {
        if (!isNext) setSeconds(parseInt(seconds) - 1);
      }
      if (parseInt(seconds) === 0) {
        if (parseInt(minutes) === 0) {
          clearInterval(countdown);
        } else {
          if (!isNext) {
            setMinutes(parseInt(minutes) - 1);
            setSeconds(59);
          }
        }
      }
    }, 1000);
    return () => {
      clearInterval(countdown);
    };
  }, [minutes, seconds]);
  return isTimer ? (
    <Text style={styles.authTimer}>
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </Text>
  ) : null;
};

class SignupAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      birth: "",
      gender: "",
      isOpened: false,
      isFocused: false,
      phoneNumber: "",
      authNumber: "",
      isSelectedAll: false,
      terms: [
        {
          title: SignupText.identification,
          type: 0,
          isRequired: true,
          isSelected: false,
          use_stplat_no: TermsCode.selfTerms,
        },
        {
          title: SignupText.uniqueNumber,
          type: 1,
          isRequired: true,
          isSelected: false,
          use_stplat_no: TermsCode.uniqueNumber,
        },
        {
          title: SignupText.service,
          type: 2,
          isRequired: true,
          isSelected: false,
          use_stplat_no: TermsCode.service,
        },
      ],
      verfi_no: -1,
      isTimer: false,
      isReAuth: false,
      isNext: false,
      errorMsg: "",
      errorMsgName: "",
      errorMsgMobile: "",
      isAuthAvailable: true,


      isShowConfirmModal: false,
      aleady_msg: ""
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    if (navigation.state.params.params.social) {
      const { name, birth, mobile, social } = navigation.state.params.params;
      this.setState({ name, birth, phoneNumber: mobile });
      if(social === "apple")
        this.setState({isNext: true});
    }
  }

  handleSendSMS = () => {
    const { phoneNumber } = this.state;

    if (phoneNumber.length === 0) notifyMessage(Generic.checkInput);
    else {
      this.props
        .sendAuthMessage({
          moblphon_no: phoneNumber.trim(),
        })
        .then((res) => {
          this.setState({ verfi_no: res.verfi_no, isTimer: true, isReAuth: false });
          setTimeout(() => {
            this.setState({isReAuth: true});
          }, 30000);
        })
        .catch((err) => {});
    }
  };

  handleCheckMobile = () => {
    const {navigation} = this.props;
    const {currentUserType} = navigation.state.params;
    const { phoneNumber } = this.state;
    let params = {
      moblphon_no: phoneNumber.trim(),
    }

    if(currentUserType === 0)
      Object.assign(params, {mber_se_cd: CodeText.mber_se_cd_g})
    else
      Object.assign(params, {mber_se_cd: CodeText.mber_se_cd_c})

    if (phoneNumber.length === 0) notifyMessage(Generic.checkInput);
    else {
      this.props
        .checkMobile(params)
        .then((res) => {
          if (!res.available) {
            this.setState({ errorMsgMobile: SignupText.duplicationMobile });
          } else {
            this.setState({ errorMsgMobile: "" });
            this.handleSendSMS();
          }
        })
        .catch((err) => {});
      this.handleCheckAleady();
    }
  }

  handleCheckAleady = () => {
    const {navigation} = this.props;
    const {currentUserType} = navigation.state.params;
    const { phoneNumber } = this.state;
    let params = {
      moblphon_no: phoneNumber,
    }

    if(currentUserType === 0)
      Object.assign(params, {mber_se_cd: CodeText.mber_se_cd_g})
    else
      Object.assign(params, {mber_se_cd: CodeText.mber_se_cd_c})

    console.log(params)
    this.props.checkAleady(params).then((res) => {
      console.log(res)
      if (!res.available)
        this.setState({isShowConfirmModal: true, aleady_msg: res.msg,  errorMsgMobile: SignupText.duplicationMobile })
      else {
        this.setState({ errorMsgMobile: "" });
        this.handleSendSMS();
      }
    }).catch((err) => {});
  }

  setCheckAuthAvailable = (flag) => {
    this.setState({isAuthAvailable: flag})
  }

  handleCheckAuth = () => {
    const { verfi_no, authNumber, isAuthAvailable } = this.state;
    if(isAuthAvailable) {
      let params = {
        verfi_no: verfi_no,
        verfi_code: authNumber,
      };

      this.props
        .checkAuthNumber(params)
        .then((res) => {
          if (res.available) {
            this.setState({ isNext: true, errorMsg: "" });
          } else {
            this.setState({ errorMsg: SignupText.incorrectAuth });
          }
        })
        .catch((err) => {
          this.setState({ errorMsg: SignupText.incorrectAuth });
        });
    } else
      notifyMessage(SignupText.reSendVerification);
  };

  setErrorMsg = (msg) => {
    this.setState({ errorMsg: msg });
  };

  updateTerms = (terms) => {
    this.setState({ terms });
  };

  renderBirthBox = () => {
    const { birth, gender, isFocused } = this.state;
    return (
      <View style={styles.inputBox}>
        <TextInputStr
          boxStyle={[styles.boxStyle, { width: "45%" }]}
          textForm={styles.textForm}
          placeholder={SignupText.birth}
          placeholderTextColor="#d5d5d5"
          value={birth}
          keyboardType="numeric"
          setValue={(str) => {
            if (str.length < 7) this.setState({ birth: str });
          }}
        />
        <View style={styles.horizontalDivider} />
        <View
          style={[
            styles.boxStyle,
            {
              width: "45%",
              justifyContent: "center",
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              paddingLeft: 10,
              alignItems: "center",
            }}
          >
            <TextInputStr
              boxStyle={
                isFocused
                  ? Platform.OS === "ios"
                    ? {
                        width: 10,
                        marginRight: 5,
                      }
                    : {
                        width: 17,
                        height: 45,
                        marginRight: 5,
                      }
                  : styles.secretRoundGray
              }
              onFocus={() =>
                this.setState({
                  isFocused: true,
                })
              }
              value={gender}
              keyboardType="numeric"
              setValue={(str) => {
                if (str.length < 2 && parseInt(str || 0) < 5 && parseInt(str || 1) > 0 ) this.setState({ gender: str });
              }}
            />
            <View style={styles.secretRoundBlack} />
            <View style={styles.secretRoundBlack} />
            <View style={styles.secretRoundBlack} />
            <View style={styles.secretRoundBlack} />
            <View style={styles.secretRoundBlack} />
            <View style={styles.secretRoundBlack} />
          </View>
        </View>
      </View>
    );
  };

  renderPhoneNumber = () => {
    const { phoneNumber, isTimer, isReAuth } =
      this.state;
    return (
      <View style={styles.inputBox}>
        <TextInputStr
          boxStyle={[styles.boxStyle, { width: "75%" }]}
          textForm={styles.textForm}
          placeholder={SignupText.number}
          placeholderTextColor="#d5d5d5"
          value={phoneNumber}
          keyboardType="numeric"
          setValue={(str) => {
            if (str.length < 12) this.setState({ phoneNumber: str });
            else notifyMessage(SignupText.number);
          }}
        />
        <TouchableOpacity
          style={{
            width: "30%",
            height: 45,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            const isNext = phoneNumber.length === 11;
            isNext && (!isTimer || isTimer && isReAuth)
                ? this.handleCheckAleady()
                : isNext ? notifyMessage(Generic.checkInput) : null;
          }}
        >
          <Text style={[styles.placeholder, !isTimer || isTimer && isReAuth ? { color: Colors.MAIN_COLOR } : { color: "#c1c1c1" }]}>
            {isTimer ? SignupText.reRequestAuth : SignupText.requestAuth}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const {
      terms,
      isOpened,
      name,
      authNumber,
      isSelectedAll,
      errorMsg,
      errorMsgName,
      phoneNumber,
      verfi_no,
      isTimer,
      isNext,
      errorMsgMobile,
      isShowConfirmModal,
      aleady_msg
    } = this.state;
    let isSocialApple = navigation.state.params.params.social && navigation.state.params.params.social === "apple";
    const isSocial = navigation.state.params.params.social;

    return (
      <View style={styles.container}>
        <Header
          step={3}
          isSocial={isSocial}
          total={navigation.state.params.currentUserType === 0 ? 6 : 5}
          navigation={navigation}
        />
        <KeyboardAwareScrollView
          style={{ paddingHorizontal: 20 }}
          extraScrollHeight={150}
          enableOnAndroid={true}
        >
          <Text style={styles.signUp}>
            {navigation.state.params.currentUserType === 0
              ? SignupText.account
              : SignupText.businessAccount}
          </Text>
          <View
            style={[
              styles.rowCenterBox,
              {
                justifyContent: "space-between",
                marginTop: 38.2,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.rowCenterBox}
              onPress={() => {
                let updatedTerms = [];
                if (!terms.some((term) => !term.isSelected)) {
                  terms.forEach((term) => {
                    const updatedTerm = { ...term, isSelected: false };
                    updatedTerms.push(updatedTerm);
                  });
                } else {
                  terms.forEach((term) => {
                    const updatedTerm = { ...term, isSelected: true };
                    updatedTerms.push(updatedTerm);
                  });
                }

                this.updateTerms(updatedTerms);
                this.setState({
                  isSelectedAll: !isSelectedAll,
                  isOpened: true,
                });
              }}
            >
              <Image
                style={styles.checkIcon}
                source={
                  isSelectedAll && terms.some((term) => term.isSelected)
                    ? require("../../../assets/image/signup/check_circle_on.png")
                    : require("../../../assets/image/signup/check_circle_off.png")
                }
              />
              <Text style={styles.termsText}>{SignupText.accountTerms}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.rowCenterBox,
                {
                  justifyContent: "center",
                },
              ]}
              onPress={() => this.setState({ isOpened: !isOpened })}
            >
              <Image
                style={{ width: 16, height: 16 }}
                source={require("../../../assets/image/signup/dropdown_btn_l.png")}
              />
            </TouchableOpacity>
          </View>
          {isOpened ? (
            <View
              style={{
                backgroundColor: "#f5f5f5",
                paddingVertical: 6.5,
                paddingHorizontal: 10,
                marginTop: 9.5,
              }}
            >
              <TermsRow
                navigation={navigation}
                terms={terms}
                type={terms[0].type}
                updateTerms={(updatedTerms) => {
                  this.updateTerms(updatedTerms);
                  this.setState({isSelectedAll: !isSelectedAll,});
                }}
              />
              {/*<TermsRow*/}
              {/*  navigation={navigation}*/}
              {/*  terms={terms}*/}
              {/*  type={terms[1].type}*/}
              {/*  updateTerms={(updatedTerms) => this.updateTerms(updatedTerms)}*/}
              {/*/>*/}
              {/*<TermsRow*/}
              {/*  navigation={navigation}*/}
              {/*  terms={terms}*/}
              {/*  type={terms[2].type}*/}
              {/*  updateTerms={(updatedTerms) => this.updateTerms(updatedTerms)}*/}
              {/*/>*/}
            </View>
          ) : null}
          <View>
            <TextInputStr
              boxStyle={styles.boxStyle}
              textForm={styles.textForm}
              placeholder={
                navigation.state.params.currentUserType === 0
                  ? SignupText.name
                  : SignupText.businessAccountName
              }
              placeholderTextColor="#d5d5d5"
              value={name}
              setValue={(str) => {
                if (str.length === 0 || str.length > 10)
                  this.setState({
                    name: str,
                    errorMsgName: SignupText.incorrectName,
                  });
                else if(!isValidKorean(str))
                  this.setState({name: str, errorMsgName: SignupText.incorrectKorName})
                else this.setState({ name: str, errorMsgName: "" });
              }}
            />
            {errorMsgName !== "" ? (
              <Text style={styles.errorMsg}>{errorMsgName}</Text>
            ) : null}
            {/*{this.renderBirthBox()}*/}
            {!isSocialApple && this.renderPhoneNumber()}
            {errorMsgMobile !== "" ? (
                <Text style={styles.errorMsg}>{errorMsgMobile}</Text>
            ) : null}
            {!isSocialApple && (
                <View style={styles.authNumberWrap}>
                  <TextInputStr
                      boxStyle={[styles.boxStyle, { marginTop: 14.5 }]}
                      textForm={styles.textForm}
                      placeholder={SignupText.authNumber}
                      placeholderTextColor="#d5d5d5"
                      value={authNumber}
                      keyboardType="numeric"
                      setValue={(str) => {
                        if (str.length < 7)
                          this.setState({ authNumber: str }, () => {
                            if (str.length === 6) this.handleCheckAuth();
                          });
                      }}
                  />
                  {/*<Text style={styles.authTimer}>02:53</Text>*/}
                  <AuthNumberInput
                      setErrorMsg={this.setErrorMsg}
                      setCheckAuthAvailable={this.setCheckAuthAvailable}
                      isNext={isNext}
                      isTimer={isTimer}
                      verfi_no={verfi_no}
                  />
                </View>
            )}
            <Text style={styles.errorMsg}>{errorMsg}</Text>
            <View
              style={{
                width: "100%",
                height: 150,
                backgroundColor: "white",
                zIndex: -10,
              }}
            />
          </View>
        </KeyboardAwareScrollView>
        <BottomBtn
          navigation={navigation}
          isActive={
            !terms.some((term) => term.isRequired && !term.isSelected) &&
            isNext &&
            // birth !== "" &&
            // birth.length === 6 &&
            name !== "" &&
            errorMsgName === ""
          }
          nav={
            navigation.state.params.currentUserType === 0
              ? "SignupPersonalData"
              : "SignupBusinessAccount"
          }
          params={
            Object.assign(
              {
                ...navigation.state.params.params,
                // brthdy: birth,
                moblphon_no: phoneNumber,
                // sex_cd:
                //   gender === "1" || gender === "3"
                //     ? CodeText.sex_cd_m
                //     : CodeText.sex_cd_w,
              },
              navigation.state.params.currentUserType === 0
                ? { mber_nm: name } // 이름
                : { mber_nm: name, entpr_charger_nm: name }
            ) // 기업담당자명
          }
          currentUserType={navigation.state.params.currentUserType}
        />
        {isShowConfirmModal && (
          <ConfirmModal
            isShowConfirmModal={isShowConfirmModal}
            setVisible={() => this.setState({isShowConfirmModal: false})}
            title={Generic.notice}
            subtitle={aleady_msg}
          />
        )}
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
    marginTop: 60,
    fontFamily: Fonts.AppleR,
    fontSize: 30,
    lineHeight: 45,
    color: "#191919",
  },
  accountTermsBox: {
    flexDirection: "row",
    height: 45,
    alignItems: "center",
    marginBottom: 6.5,
  },
  termsText: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    lineHeight: 32,
    color: "#393939",
  },
  checkIcon: {
    width: 22,
    height: 22,
    marginRight: 4.3,
  },
  rowCenterBox: {
    flexDirection: "row",
    height: 45,
    alignItems: "center",
  },
  boxStyle: {
    borderBottomWidth: 0.3,
    borderBottomColor: "#e1e1e1",
    height: 45,
  },
  textForm: {
    height: 45,
    paddingLeft: 12,
    flex: 1,
  },
  horizontalDivider: {
    width: "5.5%",
    height: 0.5,
    backgroundColor: "#e9e9e9",
    marginHorizontal: 8,
  },
  secretRoundGray: {
    width: 10,
    height: 10,
    backgroundColor: "#d5d5d5",
    borderRadius: 30,
    marginRight: 5,
  },
  secretRoundBlack: {
    width: 10,
    height: 10,
    backgroundColor: "#393939",
    borderColor: "#707070",
    borderWidth: 0.3,
    borderRadius: 30,
    marginRight: 5,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14.5,
  },
  newsAgencyBox: {
    width: "25%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginRight: 10,
  },
  placeholder: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    lineHeight: 32,
  },
  authNumberWrap: {
    position: "relative",
  },
  authTimer: {
    position: "absolute",
    right: 0,
    bottom: 12.3,
    color: Colors.MAIN_COLOR,
  },
  errorMsg: {
    marginTop: 8,
    fontSize: 12,
    color: "#ff6060",
  },
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  sendAuthMessage: (params) => dispatch(ActionUser.sendAuthMessage(params)),
  checkAuthNumber: (params) => dispatch(ActionUser.checkAuthNumber(params)),
  checkMobile: (params) => dispatch(ActionMber.checkMobile(params)),
  checkAleady: (params) => dispatch(ActionMber.checkAleady(params)),
});

export default connect(undefined, mapDispatchToProps)(SignupAccount);
