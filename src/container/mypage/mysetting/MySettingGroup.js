// 이메일 재설정
// 회원가입 본인 인증
import React, {Component, useEffect, useState} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from "react-native";
import {connect} from "react-redux";

//Component
import TextInputStr from "../../../common/textinput/TextInput";
import {TopHeader} from "../../../component/TopHeader";

//Utils
import Colors from "../../../model/lib/Utils/Colors";
import Fonts from "../../../model/lib/Utils/Fonts";
import {notifyMessage} from "../../../model/lib/Utils";
import {CodeText, Generic, MyPageText, SignupText,} from "../../../model/lib/Utils/Strings";

//Action
import * as ActionUser from "../../../model/action/eUSER";
import * as ActionMber from "../../../model/action/eMBER";
import * as ActionSession from "../../../model/action/eSESSION";

const AuthNumberInput = ({setCheckAuthAvailable, setErrorMsg, isNext, isTimer, verfi_no}) => {
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

class MySettingGroup extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.state = {
            name: "", // 담당자 정보
            birth: "", // 주민번호 앞자리
            gender: "", // 주민번호 뒷자리

            isFocused: false,
            phoneNumber: "", // 전화번호
            authNumber: "",

            verfi_no: -1,
            isTimer: false,
            isReAuth: false,
            isNext: false,
            errorMsg: "",
            errorMsgName: "",
            isAuthAvailable: true,
        };
    }

    handleUpdate = () => {
        const {eSESSION, navigation} = this.props;
        const {getDetail} = navigation.state.params;
        const {name, birth, gender, phoneNumber} = this.state;

        let params = {
            mber_no: eSESSION.mber_no,
            entpr_charger_nm: name,
            moblphon_no: phoneNumber,
        }
        if ((parseInt(gender) === 1 || parseInt(gender) === 2))
            Object.assign(params, {brthdy: `19${birth}`})
        else
            Object.assign(params, {brthdy: `20${birth}`})
        if (parseInt(gender) === 1 || parseInt(gender) === 3)
            Object.assign(params, {sex_cd: CodeText.sex_cd_m})
        else
            Object.assign(params, {sex_cd: CodeText.sex_cd_w})

        this.props.update(params).then((res) => {
            this.props.getSession({}).then((res) => {
                this.props.setSession(res.account);
                getDetail();
                navigation.goBack();
            });
        }).catch((err) => {
            this.setState({errorMsg: SignupText.incorrectAuth});
        });
    }

    handleSendSMS = () => {
        const {phoneNumber} = this.state;

        if (phoneNumber.length === 0) notifyMessage(Generic.checkInput);
        else {
            this.props.sendAuthMessage({moblphon_no: phoneNumber.trim(),}).then((res) => {
                this.setState({verfi_no: res.verfi_no, isTimer: true, isReAuth: false});
                setTimeout(() => {
                    this.setState({isReAuth: true});
                }, 30000);
            }).catch((err) => {
            });
        }
    };

    setCheckAuthAvailable = (flag) => {
        this.setState({isAuthAvailable: flag})
    }

    handleCheckAuth = () => {
        const {verfi_no, authNumber, isAuthAvailable} = this.state;
        if(isAuthAvailable) {
            let params = {
                verfi_no: verfi_no,
                verfi_code: authNumber,
            };

            this.props.checkAuthNumber(params).then((res) => {
                if (res.available) {
                    this.setState({isNext: true, errorMsg: ""});
                } else {
                    this.setState({errorMsg: SignupText.incorrectAuth});
                }
            }).catch((err) => {
                this.setState({errorMsg: SignupText.incorrectAuth});
            });
        } else
            notifyMessage(SignupText.reSendVerification);
    };

    setErrorMsg = (msg) => {
        this.setState({errorMsg: msg});
    };

    renderBirthBox = () => {
        const {birth, gender, isFocused} = this.state;
        return (
            <View style={styles.inputBox}>
                <TextInputStr
                    boxStyle={[styles.boxStyle, {width: "45%"}]}
                    textForm={styles.textForm}
                    placeholder={SignupText.birth}
                    placeholderTextColor="#d5d5d5"
                    value={birth}
                    keyboardType='numeric'
                    setValue={(str) => {
                        if (str.length < 7) this.setState({birth: str});
                    }}
                />
                <View style={styles.horizontalDivider}/>
                <View
                    style={[
                        styles.boxStyle,
                        {
                            width: "45%",
                            justifyContent: "center",
                        },
                    ]}
                    activeOpacity={1.0}
                    onPress={() => this.inputRef.current?.focus()}
                >
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            paddingLeft: 10,
                            alignItems: "center",
                        }}
                    >
                        <TextInputStr
                            inputRef={this.inputRef}
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
                            keyboardType='numeric'
                            setValue={(str) => {
                                if (str.length < 2 && parseInt(str || 0) < 5 && parseInt(str || 1) > 0 ) this.setState({ gender: str });
                            }}
                        />
                        <View style={styles.secretRoundBlack}/>
                        <View style={styles.secretRoundBlack}/>
                        <View style={styles.secretRoundBlack}/>
                        <View style={styles.secretRoundBlack}/>
                        <View style={styles.secretRoundBlack}/>
                        <View style={styles.secretRoundBlack}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    renderPhoneNumber = () => {
        const {phoneNumber, isTimer, isReAuth} =
            this.state;
        return (
            <View style={styles.inputBox}>
                <TextInputStr
                    boxStyle={[styles.boxStyle, {width: "75%"}]}
                    textForm={styles.textForm}
                    placeholder={SignupText.number}
                    placeholderTextColor="#d5d5d5"
                    value={phoneNumber}
                    keyboardType='numeric'
                    setValue={(str) => {
                        if (str.length < 12) this.setState({phoneNumber: str});
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
                            ? this.handleSendSMS()
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
        const {navigation} = this.props;
        const {
            name,
            authNumber,
            errorMsg,
            errorMsgName,
            verfi_no,
            isTimer,
            isNext,
        } = this.state;
        return (
            <View style={styles.container}>
                <TopHeader title={MyPageText.setContactInfo} navigation={navigation}/>
                <View style={{paddingHorizontal: 20, marginTop: 20}}>
                    <View>
                        <TextInputStr
                            boxStyle={styles.boxStyle}
                            textForm={styles.textForm}
                            placeholder={SignupText.businessAccountName}
                            placeholderTextColor="#d5d5d5"
                            value={name}
                            setValue={(str) => {
                                if (str.length === 0 || str.length > 10)
                                    this.setState({
                                        name: str,
                                        errorMsgName: SignupText.incorrectName,
                                    });
                                else this.setState({name: str, errorMsgName: ""});
                            }}
                        />
                        {errorMsgName !== "" ? (
                            <Text style={styles.errorMsg}>{errorMsgName}</Text>
                        ) : null}
                        {this.renderBirthBox()}
                        {this.renderPhoneNumber()}
                        <View style={[styles.authNumberWrap, {zIndex: -5}]}>
                            <TextInputStr
                                boxStyle={[styles.boxStyle, {marginTop: 14.5}]}
                                textForm={styles.textForm}
                                placeholder={SignupText.authNumber}
                                placeholderTextColor="#d5d5d5"
                                value={authNumber}
                                keyboardType='numeric'
                                setValue={(str) => {
                                    if (str.length < 7)
                                        this.setState({authNumber: str}, () => {
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
                        <Text style={styles.errorMsg}>{errorMsg}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.submitBtn, isNext ? null : {backgroundColor: "#dddddd"}]}
                    onPress={() => isNext ? this.handleUpdate() : null}
                >
                    <Text
                        style={{
                            fontFamily: Fonts.AppleL,
                            fontSize: 20,
                            letterSpacing: -1,
                            color: "#ffffff",
                        }}
                    >
                        {MyPageText.updateSubmit}
                    </Text>
                </TouchableOpacity>
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
        justifyContent: "center",
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
    submitBtn: {
        height: 60,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
});


const mapStateToProps = (state) => ({
    eSESSION: state.eSESSION.eSESSION,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    sendAuthMessage: (params) => dispatch(ActionUser.sendAuthMessage(params)),
    checkAuthNumber: (params) => dispatch(ActionUser.checkAuthNumber(params)),
    update: (params) => dispatch(ActionMber.update(params)),
    getSession: (params) => dispatch(ActionSession.getSession(params)),
    setSession: (params) => dispatch(ActionSession.setSession(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MySettingGroup);
