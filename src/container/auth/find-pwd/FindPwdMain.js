// 아이디 찾기 메인 (정보입력)
import React, {Component, useEffect, useState} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
} from "react-native";
import {connect} from "react-redux";

//Component
import {Header} from "../../../component/find-info/Header";
import {BottomBtn} from "../../../component/find-info/BottomBtn";
import {TermsRow} from "../../../component/signup/TermsRow";
import TextInputStr from "../../../common/textinput/TextInput";

//Utils
import Colors from "../../../model/lib/Utils/Colors";
import Fonts from "../../../model/lib/Utils/Fonts";
import {isValidKorean, notifyMessage} from "../../../model/lib/Utils";
import {
    CodeText,
    Generic,
    SignupText,
    TermsCode,
} from "../../../model/lib/Utils/Strings";

//Action
import * as ActionUser from "../../../model/action/eUSER";
import * as ActionMber from "../../../model/action/eMBER";

const generalTerms = [
    {
        title: SignupText.identification,
        type: 0,
        isRequired: true,
        isSelected: false,
        use_stplat_no: TermsCode.selfTerms,
    },
    // {
    //     title: SignupText.uniqueNumber,
    //     type: 1,
    //     isRequired: true,
    //     isSelected: false,
    //     use_stplat_no: TermsCode.uniqueNumber,
    // },
    // {
    //     title: SignupText.service,
    //     type: 2,
    //     isRequired: true,
    //     isSelected: false,
    //     use_stplat_no: TermsCode.service,
    // },
];

const businessTerms = [
    {
        title: SignupText.identification,
        type: 0,
        isRequired: true,
        isSelected: false,
        use_stplat_no: TermsCode.selfTerms,
    },
    // {
    //     title: SignupText.primary,
    //     type: 1,
    //     isRequired: true,
    //     isSelected: false,
    //     use_stplat_no: TermsCode.selfTerms,
    // },
    // {
    //     title: SignupText.uniqueNumber,
    //     type: 2,
    //     isRequired: true,
    //     isSelected: false,
    //     use_stplat_no: TermsCode.uniqueNumber,
    // },
    // {
    //     title: SignupText.service,
    //     type: 3,
    //     isRequired: true,
    //     isSelected: false,
    //     use_stplat_no: TermsCode.service,
    // },
];

const AuthNumberInput = ({ setCheckAuthAvailable, setErrorMsg, isNext, isTimer, verfi_no}) => {
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

class FindPwdMain extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.state = {
            currentTabIdx: 0,
            name: "",
            bsnm_reg_no: "",
            birth: "",
            gender: "",
            isOpened: false,
            isFocused: false,
            phoneNumber: "",
            authNumber: "",
            isSelectedAll: false,
            terms: generalTerms,
            verfi_no: -1,
            isTimer: false,
            isReAuth: false,
            isNext: false,
            errorMsg: "",
            errorMsgName: "",
            isAuthAvailable: true,
        };
    }

    handleFindPwd = () => {
        const {navigation} = this.props;
        const {currentTabIdx, bsnm_reg_no, name, birth, gender, phoneNumber, verfi_no} = this.state;
        let params = {
            verfi_no,
            moblphon_no: phoneNumber
        }
        // if ((parseInt(gender) === 1 || parseInt(gender) === 2))
        //     Object.assign(params, {brthdy: `19${birth}`})
        // else
        //     Object.assign(params, {brthdy: `20${birth}`})
        // if (parseInt(gender) === 1 || parseInt(gender) === 3)
        //     Object.assign(params, {sex_cd: CodeText.sex_cd_m})
        // else
        //     Object.assign(params, {sex_cd: CodeText.sex_cd_w})

        if (currentTabIdx === 0) {
            Object.assign(params, {
                mber_nm: name,
            })
            console.log("params")
            console.log(params)

            this.props.findPwdGeneral(params).then((res) => {
                navigation.navigate("FindPwdResult");
            }).catch((err) => {
            });
        } else {
            Object.assign(params, {
                bsnm_reg_no: bsnm_reg_no,
                entpr_charger_nm: name
            })
            console.log("params")
            console.log(params)

            this.props.findPwdCompany(params).then((res) => {
                navigation.navigate("FindPwdResult");
            }).catch((err) => {
            });
        }

    }

    handleSendSMS = () => {
        const {phoneNumber} = this.state;

        if (phoneNumber.length === 0) notifyMessage(Generic.checkInput);
        else {
            this.props.sendAuthMessage({
                moblphon_no: phoneNumber.trim(),
            }).then((res) => {
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

    updateTerms = (terms) => {
        this.setState({terms});
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
                >
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            paddingLeft: 10,
                            alignItems: "center",
                        }}
                        activeOpacity={1.0}
                        onPress={() => this.inputRef.current?.focus()}
                    >
                        <TextInputStr
                            inputRef={this.inputRef}
                            boxStyle={
                                isFocused
                                    ? {
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
        const {phoneNumber, isTimer, currentTabIdx, isReAuth} =
            this.state;
        return (
            <View style={styles.inputBox}>
                <TextInputStr
                    boxStyle={[styles.boxStyle, {width: "75%"}]}
                    textForm={styles.textForm}
                    placeholder={currentTabIdx === 0 ? SignupText.number : SignupText.numberCompany}
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
            terms,
            isOpened,
            name,
            bsnm_reg_no,
            authNumber,
            isSelectedAll,
            errorMsg,
            errorMsgName,
            verfi_no,
            isTimer,
            isNext,
            currentTabIdx,
        } = this.state;
        return (
            <View style={styles.container}>
                <Header
                    onPress={() => navigation.goBack()}
                    title={SignupText.findPwd}
                />
                <View style={{height: 50, width: "100%", flexDirection: "row"}}>
                    <TouchableOpacity
                        style={{
                            height: 50,
                            width: "50%",
                            alignItems: "center",
                            justifyContent: "center",
                            borderBottomColor:
                                currentTabIdx === 0 ? Colors.MAIN_COLOR : "transparent",
                            borderBottomWidth: 1,
                        }}
                        onPress={() =>
                            this.setState({currentTabIdx: 0, terms: generalTerms})
                        }
                    >
                        <Text
                            style={{
                                fontFamily: Fonts.AppleR,
                                fontSize: 16,
                                color: "#333333",
                            }}
                        >
                            {SignupText.general}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            height: 50,
                            width: "50%",
                            alignItems: "center",
                            justifyContent: "center",
                            borderBottomColor:
                                currentTabIdx === 1 ? Colors.MAIN_COLOR : "transparent",
                            borderBottomWidth: 1,
                        }}
                        onPress={() =>
                            this.setState({currentTabIdx: 1, terms: businessTerms})
                        }
                    >
                        <Text
                            style={{
                                fontFamily: Fonts.AppleR,
                                fontSize: 16,
                                color: "#333333",
                            }}
                        >
                            {SignupText.businessUser}
                        </Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{paddingHorizontal: 20}} showsVerticalScrollIndicator={false}>
                    <KeyboardAvoidingView
                        behavior="position"
                        keyboardVerticalOffset={0}
                    >
                        <Text style={styles.idAuth}>
                            {currentTabIdx === 0
                                ? SignupText.idAuth
                                : SignupText.businessIdAuth}
                        </Text>
                        <View
                            style={[
                                styles.rowCenterBox,
                                {
                                    justifyContent: "space-between",
                                    marginTop: 20,
                                },
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.rowCenterBox}
                                onPress={() => {
                                    let updatedTerms = [];
                                    if (!terms.some((term) => !term.isSelected)) {
                                        terms.forEach((term) => {
                                            const updatedTerm = {...term, isSelected: false};
                                            updatedTerms.push(updatedTerm);
                                        });
                                    } else {
                                        terms.forEach((term) => {
                                            const updatedTerm = {...term, isSelected: true};
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
                                onPress={() => this.setState({isOpened: !isOpened})}
                            >
                                <Image
                                    style={{width: 16, height: 16}}
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
                                {terms.map((term, index) => {
                                    return (
                                        <TermsRow
                                            navigation={navigation}
                                            terms={terms}
                                            type={terms[index].type}
                                            updateTerms={(updatedTerms) => {
                                                this.updateTerms(updatedTerms);
                                                this.setState({isSelectedAll: !isSelectedAll,});
                                            }}
                                        />
                                    );
                                })}
                            </View>
                        ) : null}
                        <View>
                            {currentTabIdx !== 0 && (
                                <TextInputStr
                                    boxStyle={[styles.boxStyle, {marginTop: 12}]}
                                    textForm={styles.textForm}
                                    placeholder={SignupText.companyRegistrationNumber}
                                    placeholderTextColor="#d5d5d5"
                                    value={bsnm_reg_no}
                                    keyboardType='numeric'
                                    setValue={(str) => this.setState({bsnm_reg_no: str})}
                                />
                            )}

                            <TextInputStr
                                boxStyle={[styles.boxStyle, currentTabIdx === 0 ? {marginTop: 12} : {marginTop: 14}]}
                                textForm={styles.textForm}
                                placeholder={currentTabIdx === 0 ? SignupText.name : SignupText.businessAccountName}
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
                                    else this.setState({name: str, errorMsgName: ""});
                                }}
                            />
                            {errorMsgName !== "" ? (
                                <Text style={styles.errorMsg}>{errorMsgName}</Text>
                            ) : null}
                            {false && this.renderBirthBox()}
                            {this.renderPhoneNumber()}
                            {isTimer && (
                                <>
                                    <View style={[styles.authNumberWrap, {zIndex: -5}]}>
                                        <TextInputStr
                                            boxStyle={[styles.boxStyle, {marginTop: 14}]}
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
                                </>
                            )}
                        </View>
                        <View style={{height: 150}}/>
                    </KeyboardAvoidingView>
                </ScrollView>
                <BottomBtn
                    isActive={isNext}
                    buttonTitle={Generic.confirm}
                    onPress={() => {
                        this.handleFindPwd();
                        // const replaceAction = StackActions.replace("FindIdResult", {
                        //   userId: "KCT****@ka***.com",
                        //   subscriptionDate: "2021-04-31",
                        // });
                        // navigation.dispatch(replaceAction);

                    }}
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
    idAuth: {
        marginTop: 35,
        fontFamily: Fonts.AppleR,
        fontSize: 16,
        lineHeight: 24,
        color: "#333333",
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
        fontFamily: Fonts.AppleR,
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
        marginTop: 14,
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
    findPwdGeneral: (params) => dispatch(ActionMber.findPwdGeneral(params)),
    findPwdCompany: (params) => dispatch(ActionMber.findPwdCompany(params)),
});

export default connect(undefined, mapDispatchToProps)(FindPwdMain);
