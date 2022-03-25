// 비밀번호 설정
import React, {Component, useEffect, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {connect} from "react-redux";

// utils
import {Generic, MyPageText, SignupText} from "../../../model/lib/Utils/Strings";
import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";
import {notifyMessage, validatePassword} from "../../../model/lib/Utils";

// component
import {TopHeader} from "../../../component/TopHeader";
import TextInputStr from "../../../common/textinput/TextInput";

// action
import * as ActionMber from "../../../model/action/eMBER";
import * as ActionUser from "../../../model/action/eUSER";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
    },
    dropdown: {
        height: 45,
        borderBottomColor: "#e1e1e1",
        borderBottomWidth: 0.5,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "26%",
        marginRight: 10,
        paddingHorizontal: 10,
    },
    dropdownText: {
        fontFamily: Fonts.AppleR,
        fontSize: 14,
        color: "#191919",
    },
    sendBtn: {
        height: 45,
        width: "21%",
        alignItems: "center",
        justifyContent: "center",
    },
    sendBtnText: {
        fontFamily: Fonts.AppleR,
        color: Colors.MAIN_COLOR,
    },
    authView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomColor: "#333333",
        borderBottomWidth: 0.5,
        marginTop: 15,
    },
    boxStyle: {
        height: 45,
        borderBottomColor: "#e1e1e1",
        borderBottomWidth: 0.5,
        justifyContent: "center",
    },
    textInputForm: {
        fontFamily: Fonts.AppleR,
        fontSize: 14,
        color: "#191919",
    },
    submitBtn: {
        height: 60,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
    submitBtnText: {
        fontFamily: Fonts.AppleL,
        fontSize: 20,
        letterSpacing: -1,
        color: "#ffffff",
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

const AuthNumberInput = ({setCheckAuthAvailable, setErrorMsg, isTimer, isNext, verfi_no}) => {
    const [minutes, setMinutes] = useState(3);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        setMinutes(3);
        setSeconds(0);
    }, [verfi_no]);

    useEffect(() => {
        const countdown = setInterval(() => {
            if (verfi_no !== -1 && minutes === 0 && seconds === 0) {
                setErrorMsg(SignupText.reSendVerification)
                setCheckAuthAvailable(false);
            } else setCheckAuthAvailable(true);
            if (parseInt(seconds) > 0) {
                if (!isNext)
                    setSeconds(parseInt(seconds) - 1);
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
    return (
        isTimer ?
            <Text style={styles.authTimer}>
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</Text> : null
    );
};

class MySettingPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: "",
            authNumber: "",
            password: "",
            passwordConfirm: "",
            verfi_no: -1,
            isNext: false,
            isTimer: false,
            isReAuth: false,
            errorMsg: "",
            errorMsgPw: "",
            errorMsgPwC: "",
            isActive: false,
            isAuthAvailable: true,
        };
    }

    handleSendSMS = () => {
        const {phoneNumber} = this.state;

        if (phoneNumber.length === 0)
            notifyMessage(Generic.checkInput);
        else {
            this.props.sendAuthMessage({
                moblphon_no: phoneNumber.trim(),
            }).then((res) => {
                this.setState({verfi_no: res.verfi_no, isTimer: true, isReAuth: false});
                setTimeout(() => {
                    this.setState({isReAuth: true});
                }, 30000);
            }).catch((err) => {
            })
        }
    }

    setCheckAuthAvailable = (flag) => {
        this.setState({isAuthAvailable: flag})
    }

    handleCheckAuth = () => {
        const {verfi_no, authNumber, isAuthAvailable} = this.state;
        if (isAuthAvailable) {
            let params = {
                verfi_no: verfi_no,
                verfi_code: authNumber
            }

            this.props.checkAuthNumber(params).then((res) => {
                if (res.available) {
                    this.setState({isNext: true, errorMsg: ""}, () => this.isCheckActive())
                } else {
                    this.setState({errorMsg: SignupText.incorrectAuth})
                }
            }).catch((err) => {
                this.setState({errorMsg: SignupText.incorrectAuth})
            })
        } else
            notifyMessage(SignupText.reSendVerification);
    }

    setErrorMsg = (msg) => {
        this.setState({errorMsg: msg});
    };

    isCheckActive = () => {
        const {isNext, errorMsgPw, password, passwordConfirm} = this.state;
        this.setState({isActive: isNext && errorMsgPw === "" && password !== "" && password === passwordConfirm})
    };

    handleUpdate = () => {
        const {eSESSION, navigation} = this.props;
        const {password} = this.state;
        let params = {
            mber_no: eSESSION.mber_no,
            passwd: password
        }

        this.props.update(params).then((res) => {
            navigation.pop();
        }).catch((err) => {
        })
    }

    render() {
        const {navigation, eSESSION} = this.props;
        const {
            isActive,
            phoneNumber,
            verfi_no,
            isTimer,
            isNext,
            errorMsg,
            errorMsgPw,
            errorMsgPwC,
            authNumber,
            password,
            passwordConfirm,
            isReAuth
        } = this.state;
        return (
            <View style={styles.container}>
                <TopHeader title={MyPageText.passwordSetting} navigation={navigation}/>
                <View style={{marginHorizontal: 20}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <TextInputStr
                            boxStyle={[styles.boxStyle, {width: "75%"}]}
                            textForm={styles.textInputForm}
                            placeholder={SignupText.number}
                            placeholderTextColor="#e1e1e1"
                            value={phoneNumber}
                            keyboardType='numeric'
                            setValue={(str) => {
                                if (str.length < 12) this.setState({phoneNumber: str})
                                else notifyMessage(SignupText.number)
                            }}
                        />
                        <TouchableOpacity
                            style={styles.sendBtn}
                            onPress={() => {
                                if (eSESSION.moblphon_no !== phoneNumber)
                                    notifyMessage("회원가입 시 작성한 휴대폰번호와\n동일하지 않습니다.");
                                else {
                                    const isNext = phoneNumber.length === 11;
                                    isNext && (!isTimer || isTimer && isReAuth)
                                        ? this.handleSendSMS()
                                        : isNext ? notifyMessage(Generic.checkInput) : null;
                                }
                            }}>
                            <Text
                                style={[styles.placeholder, !isTimer || isTimer && isReAuth ? {color: Colors.MAIN_COLOR} : {color: "#c1c1c1"}]}>
                                {isTimer ? SignupText.reRequestAuth : SignupText.requestAuth}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.authView}>
                        <TextInputStr
                            boxStyle={[styles.boxStyle, {
                                width: "80%",
                                paddingLeft: 10,
                            }]}
                            textForm={styles.textInputForm}
                            placeholder={SignupText.authNumber}
                            placeholderTextColor="#e1e1e1"
                            value={authNumber}
                            keyboardType='numeric'
                            setValue={(str) => {
                                if (str.length < 7) this.setState({authNumber: str}, () => {
                                    if (str.length === 6) this.handleCheckAuth();
                                })
                            }}
                        />
                        <AuthNumberInput
                            setErrorMsg={this.setErrorMsg}
                            setCheckAuthAvailable={this.setCheckAuthAvailable}
                            isNext={isNext}
                            isTimer={isTimer}
                            verfi_no={verfi_no}/>
                    </View>
                    {errorMsg !== "" ? <Text style={styles.errorMsg}>{errorMsg}</Text> : null}
                    <TextInputStr
                        boxStyle={[styles.boxStyle, {
                            paddingLeft: 10,
                            marginTop: 14,
                        }]}
                        textForm={styles.textInputForm}
                        placeholder={SignupText.newPassword}
                        placeholderTextColor="#e1e1e1"
                        value={password}
                        secureTextEntry={true}
                        setValue={(str) => {
                            if (str.length < 8 || str.length > 12)
                                this.setState({password: str, errorMsgPw: SignupText.incorrectLimitPassword})
                            else if (!validatePassword(str).result)
                                this.setState({password: str, errorMsgPw: SignupText.incorrectPassword})
                            else
                                this.setState({password: str, errorMsgPw: ""}, () =>
                                    this.isCheckActive())
                        }}
                    />
                    {errorMsgPw !== "" ?
                        <Text style={styles.errorMsg}>{errorMsgPw}</Text> : null}
                    <TextInputStr
                        boxStyle={[styles.boxStyle, {
                            paddingLeft: 10,
                            marginTop: 14,
                        }]}
                        textForm={styles.textInputForm}
                        placeholder={SignupText.passwordConfirm}
                        placeholderTextColor="#e1e1e1"
                        value={passwordConfirm}
                        secureTextEntry={true}
                        setValue={(str) => {
                            if (password !== str)
                                this.setState({passwordConfirm: str, errorMsgPwC: SignupText.incorrectPasswordConfirm})
                            else
                                this.setState({passwordConfirm: str, errorMsgPwC: ""}, () =>
                                    this.isCheckActive())
                        }}
                    />
                    {errorMsgPwC !== "" ?
                        <Text style={styles.errorMsg}>{errorMsgPwC}</Text> : null}
                </View>
                <TouchableOpacity
                    style={[styles.submitBtn, {backgroundColor: isActive ? "#191919" : "#c1c1c1"}]}
                    onPress={() => {
                        if (isActive) this.handleUpdate()
                    }}
                >
                    <Text style={styles.submitBtnText}>
                        {Generic.finish}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    eSESSION: state.eSESSION.eSESSION,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    update: (params) => dispatch(ActionMber.update(params)),
    sendAuthMessage: (params) => dispatch(ActionUser.sendAuthMessage(params)),
    checkAuthNumber: (params) => dispatch(ActionUser.checkAuthNumber(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MySettingPassword);
