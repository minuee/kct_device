// 회원가입 일반회원 필수 정보 입력
import React, {Component} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Keyboard, Platform,
} from "react-native";
import {connect} from "react-redux";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

// Utils
import {CodeText, SignupText} from "../../../model/lib/Utils/Strings";
import Fonts from "../../../model/lib/Utils/Fonts";
import {getFileName, isValidEmail, notifyMessage, validatePassword} from "../../../model/lib/Utils";

// Component
import {Header} from "../../../component/signup/Header";
import {BottomBtn} from "../../../component/signup/BottomBtn";
import TextInputStr from "../../../common/textinput/TextInput";

// Action
import * as ActionMber from "../../../model/action/eMBER";

class SignupPersonalData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            passwordConfirm: "",
            errorMsgEmail: "",
            errorMsgPw: "",
            errorMsgPwC: "",
        };
    }

    componentDidMount() {
        const {navigation} = this.props;
        if(navigation.state.params.params.social) {
            const {email} = navigation.state.params.params;
            this.setState({email}, () => this.handleCheckAleady())
        }
    }

    handleCheckEmail = () => {
        const {navigation} = this.props;
        const {currentUserType} = navigation.state.params;
        const {email} = this.state;
        if(email !== "") {
            let params = {
                email_addr: email,
            }
            if(currentUserType === 0)
                Object.assign(params, {mber_se_cd: CodeText.mber_se_cd_g})
            else
                Object.assign(params, {mber_se_cd: CodeText.mber_se_cd_c})

            this.props.checkEmail(params).then((res) => {
                if (!res.available) {
                    this.setState({ errorMsgEmail: SignupText.duplicationEmail });
                } else {
                    this.setState({ errorMsgEmail: "" });
                }
            }).catch((err) => {});
        }
    }

    handleCheckAleady = () => {
        const {navigation} = this.props;
        const {currentUserType} = navigation.state.params;
        const {email} = this.state;
        if(email !== "") {
            let params = {
                email_addr: email,
            }
            if(currentUserType === 0)
                Object.assign(params, {mber_se_cd: CodeText.mber_se_cd_g})
            else
                Object.assign(params, {mber_se_cd: CodeText.mber_se_cd_c})

            this.props.checkAleady(params).then((res) => {
                if (!res.available)
                    this.setState({ errorMsgEmail: SignupText.duplicationEmail });
                else
                    this.setState({ errorMsgEmail: "" });
            }).catch((err) => {});
        }
    }

    handleSubmit = () => {
        // 기업회원 회원가입 > createImg 필요
        const {navigation} = this.props;
        const {
            mber_id,
            email_addr,
            mber_nm,
            moblphon_no,
            mber_se_cd,
            sex_cd,
            bsnm_reg_no,
            entpr_charger_nm,
            entpr_nm,
            use_stplat_op1_yn,
            use_stplat_op2_yn
        } = navigation.state.params.params;
        const {password} = this.state;

        let params = {
            mber_id, email_addr, mber_nm, entpr_nm, moblphon_no, mber_se_cd, bsnm_reg_no, entpr_charger_nm,
            use_stplat_op1_yn,
            use_stplat_op2_yn,
            passwd: password,
            os_cd: Platform.OS === "ios" ? CodeText.os_cd_ios : CodeText.os_cd_android
        }
        console.log("params")
        console.log(params)

        this.props.create(params).then((res) => {
            if (res.user) {
                this.handleRegImg(res.user.mber_no);
            }
        }).catch((err) => {
            notifyMessage(SignupText.signupFailErrorMessage);
        });
    }

    handleRegImg = (mber_no) => {
        // 기업회원 회원가입 > createImg 필요
        const {navigation} = this.props;
        const {currentUserType} = navigation.state.params;
        const {img_url_addr} = navigation.state.params.params;

        let params = {
            mber_no: mber_no,
            mber_img_typ_cd: CodeText.mber_img_typ_cd_r, // 기업회원 > 사업자등록증
            img_file_nm: getFileName(img_url_addr),
            img_url_addr: img_url_addr,
        }
        console.log("handleRegImg")
        console.log(params)

        this.props.createImg(params).then((res) => {
            // this.handleLogin();
            navigation.navigate("SignupResult", { currentUserType: currentUserType })
        }).catch((err) => {
            notifyMessage(SignupText.signupFailErrorMessage);
        });
    }

    render() {
        const {navigation} = this.props;
        const {currentUserType} = navigation.state.params;
        const {email, password, passwordConfirm, errorMsgEmail, errorMsgPw, errorMsgPwC} = this.state;
        const isSocial = navigation.state.params.params.social;
        let isActive = password !== "" && validatePassword(password).result;
        if(navigation.state.params.params.social)
            isActive = true;
        return (
            <View style={styles.container}>
                <Header isSocial={isSocial} step={navigation.state.params.currentUserType === 0 ? 4 : 5} total={navigation.state.params.currentUserType === 0 ? 6 : 5}  navigation={navigation}/>

                <KeyboardAwareScrollView
                    extraScrollHeight={150}
                    enableOnAndroid={true}
                >
                    <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
                        <Text
                            style={[
                                styles.signUp,
                                {marginBottom: currentUserType === 0 ? 150 : 215.5},
                            ]}
                        >
                            {SignupText.requiredInfo}
                        </Text>
                    </TouchableOpacity>
                    {currentUserType === 0 ? (
                        <TextInputStr
                            boxStyle={styles.boxStyle}
                            textForm={styles.textForm}
                            placeholder={SignupText.email}
                            placeholderTextColor="#d5d5d5"
                            value={email}
                            setValue={(str) => {
                                if (isValidEmail(str))
                                    this.setState({email: str, errorMsgEmail: SignupText.incorrectEmail})
                                else
                                    this.setState({email: str, errorMsgEmail: ""})
                            }}
                            onBlur={() => {
                                if (isValidEmail(email))
                                    this.setState({errorMsgEmail: SignupText.incorrectEmail})
                                else this.handleCheckAleady()

                            }}
                        />
                    ) : null}
                    {currentUserType === 0 && errorMsgEmail !== "" ? (
                        <Text style={styles.errorMsg}>{errorMsgEmail}</Text>
                    ) : null}
                    {navigation.state.params.params.social ? null
                    : (
                            <TextInputStr
                                boxStyle={styles.boxStyle}
                                textForm={styles.textForm}
                                placeholder={SignupText.password}
                                placeholderTextColor="#d5d5d5"
                                value={password}
                                secureTextEntry={true}
                                setValue={(str) => {
                                    if(str.length < 8 || str.length > 12)
                                        this.setState({password: str, errorMsgPw: SignupText.incorrectLimitPassword})
                                    else if (!validatePassword(str).result)
                                        this.setState({password: str, errorMsgPw: SignupText.incorrectPassword})
                                    else
                                        this.setState({password: str, errorMsgPw: ""})
                                }}
                            />
                        )}

                    {errorMsgPw !== "" ?
                        <Text style={styles.errorMsg}>{errorMsgPw}</Text> : null}
                    {navigation.state.params.params.social ? null :
                        (
                            <TextInputStr
                                boxStyle={styles.boxStyle}
                                textForm={styles.textForm}
                                placeholder={SignupText.passwordConfirm}
                                placeholderTextColor="#d5d5d5"
                                value={passwordConfirm}
                                secureTextEntry={true}
                                setValue={(str) => {
                                    if (password !== str)
                                        this.setState({passwordConfirm: str, errorMsgPwC: SignupText.incorrectPasswordConfirm})
                                    else
                                        this.setState({passwordConfirm: str, errorMsgPwC: ""})
                                }}
                            />
                        )}

                    {errorMsgPwC !== "" ?
                        <Text style={styles.errorMsg}>{errorMsgPwC}</Text> : null}
                    {/*<View style={{ height: 150 }} />*/}
                </KeyboardAwareScrollView>
                <BottomBtn
                    navigation={navigation}
                    isActive={
                        errorMsgEmail === ""
                        && isActive
                        && (password === passwordConfirm)
                        // && validatePassword(password).result
                    }
                    nav={
                        currentUserType === 0
                            ? "SignupOptionalPersonalData"
                            : "SignupResult"
                    }
                    handleSubmit={currentUserType === 0 ? null : this.handleSubmit}
                    params={{
                        ...navigation.state.params.params,
                        email_addr: email,
                        passwd: password,
                    }}
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
        marginTop: 60,
        marginLeft: 20,
        fontFamily: Fonts.AppleR,
        fontSize: 30,
        lineHeight: 45,
        color: "#191919",
    },
    boxStyle: {
        borderBottomWidth: 0.3,
        borderBottomColor: "#e1e1e1",
        height: 45,
        marginTop: 14.5,
        marginHorizontal: 20
    },
    textForm: {
        height: 45,
        paddingLeft: 12,
        flex: 1,
    },
    errorMsg: {
        marginTop: 8,
        fontSize: 12,
        color: "#ff6060",
        marginHorizontal: 20
    },
});


// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    create: (params) => dispatch(ActionMber.create(params)),
    createImg: (params) => dispatch(ActionMber.createImg(params)),
    checkEmail: (params) => dispatch(ActionMber.checkEmail(params)),
    checkAleady: (params) => dispatch(ActionMber.checkAleady(params)),
});

export default connect(undefined, mapDispatchToProps)(SignupPersonalData);
