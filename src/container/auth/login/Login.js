// 로그인 화면
import React, {Component} from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Platform, ActivityIndicator,
} from "react-native";
import {connect} from "react-redux";
import {appleAuth} from "@invertase/react-native-apple-authentication";
import AsyncStorage from "@react-native-community/async-storage";
import {
    NaverLogin,
    getProfile as getNaverUserProfile,
} from "@react-native-seoul/naver-login";
import messaging from "@react-native-firebase/messaging";
import {
    GoogleSignin,
    statusCodes,
} from "@react-native-community/google-signin";
import * as KakaoLogins from "@react-native-seoul/kakao-login";

import TextInputStr from "../../../common/textinput/TextInput";

//styles
import styles from "./styles";

//utils
import Colors from "../../../model/lib/Utils/Colors";
import {
    androidKeys,
    CodeText,
    Generic,
    iosKeys,
    LoginText,
    SocialKey,
    TOKEN,
} from "../../../model/lib/Utils/Strings";
import {clearAsyncStorage, isValidEmail, notifyMessage} from "../../../model/lib/Utils";
import ConfirmModal from "../../../component/modal/ConfirmModal";

//action
import * as ActionSession from "../../../model/action/eSESSION";
import * as ActionMber from "../../../model/action/eMBER";

const socialNaverKeys = Platform.OS === "ios" ? iosKeys : androidKeys;

const UserTab = ({title, isActive, setCurrentUserType}) => {
    return (
        <TouchableOpacity
            style={[
                styles.tab,
                {borderBottomColor: isActive ? Colors.MAIN_COLOR : "transparent"},
            ]}
            onPress={setCurrentUserType}
        >
            <Text style={styles.userTabTitle}>{title}</Text>
        </TouchableOpacity>
    );
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isShowConfirmModal: false,
            aleady_msg: "",
            currentUserType: 0,
            email: "",
            password: "",

            naverToken: null,
            kakaoToken: null,
            socialType: "",
            socialId: -1,
            socialName: "",
            socialEmail: "",
            socialBirth: "",
            socialMobile: "",
        };
    }

    componentDidMount() {
        GoogleSignin.configure({
            webClientId: SocialKey.google_client_id,
        });
    }

    /* SOCIAL LOGIN START */
    handleSocial = () => {
        const {navigation} = this.props;
        const {socialId, socialType, socialName, socialEmail, socialBirth, socialMobile} = this.state;
        let params = {
            social: socialType,
            social_key: socialId,
            mber_se_cd: CodeText.mber_se_cd_g,
            remember_login: true
        }
        this.props.loginSocial(params).then((res) => {
            if (res.detail) {
                this.props.getSession({}).then((res) => {
                    this.props.setSession(res.account);
                    this.handleToken(res.account.mber_no);
                });
                AsyncStorage.setItem(TOKEN.user, res.access_token);
                AsyncStorage.setItem(TOKEN.remember_login, "true");
                navigation.navigate("Main");
            }
        }).catch((err) => {
            if (socialType === "apple") {
                let social_param = {
                    mber_se_cd: CodeText.mber_se_cd_g,
                    social: socialType,
                    social_key: socialId,
                    name: "",
                    email: "",
                    birth: "",
                    mobile: "",
                }
                navigation.navigate("SignupAppleTerms", {params: social_param, currentUserType: 0})
            } else if (socialMobile) { // 휴대폰번호가 있을 때, check
                this.handleCheckAleady();
            } else { // 이외의 경우, 회원가입 로직 진행
                let social_param = {
                    mber_se_cd: CodeText.mber_se_cd_g,
                    social: socialType,
                    social_key: socialId,
                    name: socialName,
                    email: socialEmail,
                    birth: socialBirth,
                    mobile: socialMobile,
                }
                navigation.navigate("SignupTerms", {params: social_param, currentUserType: 0})
                // this.handleCheckEmail();
            }
        });
    };

    handleCheckEmail = () => {
        const {navigation} = this.props;
        const {socialId, socialType, socialName, socialEmail, socialBirth, socialMobile} = this.state;
        let params = {
            email_addr: socialEmail,
            mber_se_cd: CodeText.mber_se_cd_g
        }

        this.props.checkEmail(params).then((res) => {
            if (!res.available) {
                // notifyMessage(res.msg)
                // notifyMessage("중복된 이메일 정보가 있습니다.\n아이디 찾기를 이용해주세요.");
            } else {
                let social_param = {
                    mber_se_cd: CodeText.mber_se_cd_g,
                    social: socialType,
                    social_key: socialId,
                    name: socialName,
                    email: socialEmail,
                    birth: socialBirth,
                    mobile: socialMobile,
                }
                navigation.navigate("SignupTerms", {params: social_param, currentUserType: 0})
            }
        }).catch((err) => {
        });
    }

    handleCheckAleady = () => {
        const {navigation} = this.props;
        const {socialId, socialType, socialName, socialEmail, socialBirth, socialMobile} = this.state;
        let params = {
            moblphon_no: socialMobile,
            mber_se_cd: CodeText.mber_se_cd_g
        }

        this.props.checkAleady(params).then((res) => {
            if (!res.available) {
                this.setState({isShowConfirmModal: true, aleady_msg: res.msg})
            } else {
                let social_param = {
                    mber_se_cd: CodeText.mber_se_cd_g,
                    social: socialType,
                    social_key: socialId,
                    name: socialName,
                    email: socialEmail,
                    birth: socialBirth,
                    mobile: socialMobile,
                }
                navigation.navigate("SignupTerms", {params: social_param, currentUserType: 0})
            }
        }).catch((err) => {
        });
    }

    handleSNS = (platform) => {
        if (platform === "naver") {
            this.naverLogin(socialNaverKeys)
                .then((res) => {
                    console.log(`\n\n  Token is fetched  :: ${res} \n\n`);
                    console.log(res);
                    this.setState({naverToken: res});
                    this.getNaverUserProfile()
                        .then((profile) => {
                            console.log("getNaverUserProfile");
                            console.log(profile.response);
                            this.setState({
                                socialType: "naver",
                                socialId: profile.response.id,
                                socialEmail: profile.response.email,
                                socialName: profile.response.name,
                            });
                            if (profile.response.birthday !== undefined && profile.response.birthyear !== undefined)
                                this.setState({socialBirth: profile.response.birthyear + "-" + profile.response.birthday});
                            if (profile.response.mobile)
                                this.setState({socialMobile: profile.response.mobile.replace(/\-/g, '')});
                            this.handleSocial();
                        })
                        .catch((err) => {
                        });
                })
                .catch((err) => {
                });
        }
        if (platform === "google") {
            console.log("call");
            this.googleLogin().then((userInfo) => {
                console.log("userInfo");
                console.log(userInfo.user);
                this.setState({
                    socialType: "google",
                    socialId: userInfo.user.id,
                    socialEmail: userInfo.user.email,
                    socialName: userInfo.user.name,
                });
                this.handleSocial();
            });
        }
        if (platform === "kakao") {
            this.kakaoLogin().then((res) => {
                console.log(`\n\n  Token is fetched  :: ${res} \n\n`);
                console.log(res);
                this.setState({kakaoToken: res});
                this.getKakaoUserProfile().then((profile) => {
                    console.log("getKakaoUserProfile");
                    console.log(profile);
                    this.setState({
                        socialType: "kakao",
                        socialId: profile.id,
                        socialEmail: profile.email,
                    });
                    if (profile.birthday !== "null" && profile.birthyear !== "null")
                        this.setState({socialBirth: profile.birthyear + "-" + profile.birthday.substring(0, 2) + "-" + profile.birthday.substring(2, 4),});
                    this.handleSocial();
                }).catch((err) => {
                });
            }).catch((err) => {
            });
        }
        if (platform === "apple") {
            this.appleLogin().then(response => {
                this.setState({
                    socialType: "apple",
                    socialId: response.user,
                    socialEmail: response.email,
                    socialName: response.fullName,
                });
                this.handleSocial();
            });
        }
    };

    kakaoLogin = async () => {
        const result = await KakaoLogins.login();
        if (result === null) {
            return Promise.reject(result);
        }
        return Promise.resolve(result);
    };

    getKakaoUserProfile = async () => {
        const result = await KakaoLogins.getProfile();
        if (result === null) {
            return Promise.reject(result);
        }
        return Promise.resolve(result);
    };

    googleLogin = async () => {
        try {
            console.log("googleLogin");
            await GoogleSignin.hasPlayServices();
            return await GoogleSignin.signIn();
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log("SIGN_IN_CANCELLED");
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log("IN_PROGRESS");
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log("PLAY_SERVICES_NOT_AVAILABLE");
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    };

    naverLogin = (props) => {
        return new Promise((resolve, reject) => {
            NaverLogin.login(props, (err, token) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(token);
            });
        });
    };

    getNaverUserProfile = async () => {
        const profileResult = await getNaverUserProfile(
            this.state.naverToken.accessToken
        );
        if (profileResult.resultcode === "024") {
            return Promise.reject(profileResult);
        }
        return Promise.resolve(profileResult);
    };

    appleLogin = async () => {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });
        const credentialState = await appleAuth.getCredentialStateForUser(
            appleAuthRequestResponse.user
        );
        if (credentialState === appleAuth.State.AUTHORIZED) {
            const {identityToken, user, email, fullName, authorizationCode} = appleAuthRequestResponse;
            let userName = `${fullName.familyName ? fullName.familyName : ""}${
                fullName.givenName ? fullName.givenName : ""
            }`;
            return {user, email, fullName};
        }
    }


    /* SOCIAL LOGIN END */
    handleLogin = () => {
        const {navigation} = this.props;
        const {email, password, currentUserType} = this.state;
        // navigation.navigate("Main");
        if (isValidEmail(email) && currentUserType === 0) {
            notifyMessage(LoginText.generalCheckEmail);
        } else if (password === "") {
            notifyMessage(Generic.checkInput);
        } else {
            this.setState({isLoading: true});
            let params = {
                email: email.trim(),
                password: password,
            };

            if (currentUserType === 1)
                Object.assign(params, {mber_se_cd: CodeText.mber_se_cd_c});
            else
                Object.assign(params, {mber_se_cd: CodeText.mber_se_cd_g});

            this.props
                .login(params)
                .then((res) => {
                    if (res.detail) {
                        this.props.getSession({}).then((res) => {
                            this.props.setSession(res.account);
                            this.handleToken(res.account.mber_no);
                        });
                        AsyncStorage.setItem(TOKEN.user, res.access_token);
                        AsyncStorage.setItem(TOKEN.remember_login, "true");
                        navigation.navigate("Main");
                    }
                })
                .catch((err) => {
                    this.setState({isLoading: false})
                });
        }
    };

    handleToken = async (mber_no) => {
        const token = await messaging().getToken();
        let params = {
            mber_no,
            firebase_os_cd:
                Platform.OS === "ios" ? CodeText.os_cd_ios : CodeText.os_cd_android,
            firebase_token: token,
        };
        console.log("params");
        console.log(params);
        this.props
            .update(params)
            .then((res) => {
            })
            .catch((err) => {
            });
    };

    handleMain = () => {
        console.log("click go to main");
        // AsyncStorage.clear();
        clearAsyncStorage().then((result) => console.log("remove All"))
        this.props.navigation.navigate("Main");
    };

    setCurrentUserType = (type) => {
        this.setState({currentUserType: type, email: "", password: ""});
    };

    renderUserTabs = () => {
        const {currentUserType} = this.state;
        return (
            <View style={styles.userTabs}>
                <UserTab
                    title={LoginText.general}
                    isActive={currentUserType === 0}
                    setCurrentUserType={() => {
                        this.setCurrentUserType(0);
                    }}
                />
                <UserTab
                    title={LoginText.business}
                    isActive={currentUserType === 1}
                    setCurrentUserType={() => {
                        this.setCurrentUserType(1);
                    }}
                />
            </View>
        );
    };

    renderUserForm = () => {
        const {currentUserType, email, password} = this.state;
        return (
            <View style={{marginTop: 14, marginHorizontal: 20}}>
                <TextInputStr
                    boxStyle={styles.boxStyle}
                    textForm={styles.textForm}
                    placeholder={
                        currentUserType === 0
                            ? LoginText.generalPlaceHolder
                            : LoginText.businessPlaceHolder
                    }
                    placeholderTextColor="#cccccc"
                    value={email}
                    setValue={(str) => this.setState({email: str})}
                />
                <TextInputStr
                    boxStyle={[styles.boxStyle, {marginTop: 14}]}
                    textForm={styles.textForm}
                    placeholder={LoginText.passwordPlaceHolder}
                    placeholderTextColor="#cccccc"
                    value={password}
                    setValue={(str) => this.setState({password: str})}
                    secureTextEntry={true}
                />
            </View>
        );
    };

    renderLoginBtn = () => {
        const {email, password} = this.state;
        return (
            <TouchableOpacity
                style={[
                    styles.loginBtn,
                    {backgroundColor: email && password ? Colors.MAIN_COLOR : "#c1c1c1"}
                ]}
                onPress={() => this.handleLogin()}
            >
                <Text style={styles.login}>{LoginText.login}</Text>
            </TouchableOpacity>
        );
    };

    renderFindUserInfo = () => {
        const {navigation} = this.props;
        return (
            <View style={styles.findUserInfoContainer}>
                <TouchableOpacity
                    style={styles.findUserInfoBox}
                    onPress={() => navigation.navigate("FindIdMain")}
                >
                    <Text style={styles.normalText}>{LoginText.findEmail}</Text>
                </TouchableOpacity>
                <View style={styles.verticalDivider}/>
                <TouchableOpacity
                    style={styles.findUserInfoBox}
                    onPress={() => navigation.navigate("FindPwdMain")}
                >
                    <Text style={styles.normalText}>{LoginText.findPassword}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    renderSNSLoginBox = () => {
        return (
            <View style={styles.socialLoginContainer}>
                <Text style={styles.socialLoginText}>{LoginText.socialLogin}</Text>
                <View style={styles.socialLoginBox}>
                    <TouchableOpacity
                        onPress={() => this.setState({
                                socialType: "",
                                socialId: "",
                                socialEmail: "",
                                socialMobile: "",
                                socialName: ""
                            },
                            () => this.handleSNS("kakao"))}>
                        <Image
                            style={styles.snsIcon}
                            source={require("../../../assets/image/login/kakao.png")}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.setState({
                                socialType: "",
                                socialId: "",
                                socialEmail: "",
                                socialMobile: "",
                                socialName: ""
                            },
                            () => this.handleSNS("naver"))}>
                        <Image
                            style={styles.snsIcon}
                            source={require("../../../assets/image/login/naver.png")}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.setState({
                                socialType: "",
                                socialId: "",
                                socialEmail: "",
                                socialMobile: "",
                                socialName: ""
                            },
                            () => this.handleSNS("google"))}>
                        <Image
                            style={styles.snsIcon}
                            source={require("../../../assets/image/login/google.png")}
                        />
                    </TouchableOpacity>
                    {Platform.OS === 'ios' && (
                        <TouchableOpacity
                            onPress={() => this.setState({
                                    socialType: "",
                                    socialId: "",
                                    socialEmail: "",
                                    socialMobile: "",
                                    socialName: ""
                                },
                                () => this.handleSNS("apple"))}>
                            <Image
                                style={styles.snsIcon}
                                source={require("../../../assets/image/login/apple.png")}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    renderSignUpBox = () => {
        const {navigation} = this.props;
        return (
            <View style={styles.signUpBox}>
                <Text style={[styles.normalText, {marginRight: 10}]}>
                    {LoginText.signUpDesc}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignupMain")}>
                    <Text style={styles.signUp}>{LoginText.signUp}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        const {isLoading, isShowConfirmModal, aleady_msg} = this.state;
        if (isLoading)
            return (
                <View style={{flex: 1, justifyContent: "center"}}>
                    <ActivityIndicator size="large" color={Colors.MAIN_COLOR}/>
                </View>)
        else
            return (
                <View style={styles.container}>
                    <View style={styles.statusBar}/>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <TouchableOpacity
                            style={styles.naviBar}
                            onPress={() => this.handleMain()}
                        >
                            <Text style={styles.headerText}>{LoginText.headerText}</Text>
                        </TouchableOpacity>
                        <Image
                            style={styles.logo}
                            source={require("../../../assets/image/logo_login_page.png")}
                        />
                        {this.renderUserTabs()}
                        {this.renderUserForm()}
                        {this.renderLoginBtn()}
                        {this.renderFindUserInfo()}
                        {Platform.OS !== "ios" && this.renderSNSLoginBox()}
                        {this.renderSignUpBox()}
                        <View style={{height: 28}}/>
                    </ScrollView>
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

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    // login: (params) => dispatch(ActionUser.login(params)),
    login: (params) => dispatch(ActionMber.login(params)),
    loginSocial: (params) => dispatch(ActionMber.loginSocial(params)),
    getSession: (params) => dispatch(ActionSession.getSession(params)),
    setSession: (params) => dispatch(ActionSession.setSession(params)),
    update: (params) => dispatch(ActionMber.update(params)),

    checkEmail: (params) => dispatch(ActionMber.checkEmail(params)),
    checkAleady: (params) => dispatch(ActionMber.checkAleady(params)),
});

export default connect(undefined, mapDispatchToProps)(Login);
