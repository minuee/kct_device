// 회원가입 유입경로
import React, {Component} from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform,
} from "react-native";
import {connect} from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
//Component
import {Header} from "../../../component/signup/Header";
import {BottomBtn} from "../../../component/signup/BottomBtn";
import {RadioButton} from "../../../component/RadioButton";

//Utils
import Fonts from "../../../model/lib/Utils/Fonts";
import {notifyMessage} from "../../../model/lib/Utils";
import {CodeText, SignupText, TOKEN} from "../../../model/lib/Utils/Strings";

//Action
import * as ActionConst from "../../../model/action/eCOMM_CD";
import * as ActionMber from "../../../model/action/eMBER";
import * as ActionSession from "../../../model/action/eSESSION";

class SignupInflow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            social: "",
            social_key: "",
            inflow_course_cd: "",
            comm_cd_typ: []
        };
    }

    componentDidMount() {
        const {navigation} = this.props;
        if(navigation.state.params.params.social) {
            const {social, social_key} = navigation.state.params.params;
            this.setState({social, social_key})
        }
        this.props.getConst({}).then((res) => {
            this.setState({comm_cd_typ: res.comm_cd_typ})
        }).catch((err) => {
        });
    }


    handleSubmit = () => {
        const {navigation} = this.props;
        const {
            social,
            social_key,
            email_addr,
            passwd,
            mber_nm,
            moblphon_no,
            mber_se_cd,
            brthdy,
            sex_cd,
            use_stplat_op1_yn,
            use_stplat_op2_yn
        } = navigation.state.params.params;
        const {inflow_course_cd} = this.state;

        let params = {
            // inflow_course_cd,
            mber_id: email_addr,
            passwd,
            mber_nm,
            moblphon_no,
            mber_se_cd,
            email_addr,
            // brthdy,
            // sex_cd,
            use_stplat_op1_yn,
            use_stplat_op2_yn,
            os_cd: Platform.OS === "ios" ? CodeText.os_cd_ios : CodeText.os_cd_android,
        };
        if(brthdy)
            Object.assign(params, {brthdy})
        if(sex_cd)
            Object.assign(params, {sex_cd})
        if(inflow_course_cd)
            Object.assign(params, {inflow_course_cd})

        if(social && social_key)
            Object.assign(params, {social, social_key})

        console.log("params")
        console.log(params)

        this.props.create(params).then((res) => {
            if(social && social_key)
                this.handleSocial();
            else if (res.user)
                this.handleLogin();

        }).catch((err) => {
            notifyMessage(SignupText.signupFailErrorMessage);
        });
    };

    handleSocial = () => {
        const {navigation} = this.props;
        const {currentUserType} = navigation.state.params;
        const {
            social,
            social_key,
        } = navigation.state.params.params;
        let params = {
            social: social,
            social_key: social_key,
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
                navigation.navigate("SignupResult", { currentUserType: currentUserType })
            }

        }).catch((err) => {
        });
    };

    handleLogin = () => {
        const {navigation} = this.props;
        const {currentUserType} = navigation.state.params;
        const {email_addr, passwd} = navigation.state.params.params;
        let params = {
            email: email_addr,
            password: passwd,
            mber_se_cd: CodeText.mber_se_cd_g
        };
        console.log("handleLogin")
        console.log(params)

        this.props.login(params).then((res) => {
            if (res.detail) {
                this.props.getSession({}).then((res) => {
                    this.props.setSession(res.account);
                });
                AsyncStorage.setItem(TOKEN.user, res.access_token);
                AsyncStorage.setItem(TOKEN.remember_login, "true");
                navigation.navigate("SignupResult", { currentUserType: currentUserType })
            }
        }).catch((err) => {
        });
    };

    render() {
        const {navigation} = this.props;
        const {currentUserType} = navigation.state.params;
        const {inflow_course_cd, comm_cd_typ} = this.state;
        const isSocial = navigation.state.params.params.social;

        return (
            <View style={styles.container}>
                <Header isSocial={isSocial} step={6} total={navigation.state.params.currentUserType === 0 ? 6 : 5} navigation={navigation}/>
                <Text style={styles.signUp}>
                    {SignupText.inflow}
                </Text>
                <View style={styles.inflowWrap}>
                    {(comm_cd_typ["INFLOW_COURSE_CD"]?.comm_cd || []).map((item) => {
                        return (
                            <RadioButton
                                label={item.cd_nm}
                                isActive={item.cd_no === inflow_course_cd}
                                setActive={() =>
                                    this.setState({inflow_course_cd: item.cd_no})
                                }
                            />
                        )
                    })}
                </View>

                <BottomBtn
                    navigation={navigation}
                    // isActive={inflow_course_cd !== ""}
                    isActive={true}
                    nav="SignupResult"
                    handleSubmit={() => currentUserType === 0 ? this.handleSubmit() : null}
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
    inflowWrap: {
        flex: 1,
        paddingLeft: 20,
        paddingBottom: 100,
        justifyContent: 'flex-end'
    }
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    getConst: (params) => dispatch(ActionConst.getConst(params)),

    create: (params) => dispatch(ActionMber.create(params)),
    createImg: (params) => dispatch(ActionMber.createImg(params)),
    getSession: (params) => dispatch(ActionSession.getSession(params)),
    setSession: (params) => dispatch(ActionSession.setSession(params)),
    login: (params) => dispatch(ActionMber.login(params)),
    loginSocial: (params) => dispatch(ActionMber.loginSocial(params)),
});

export default connect(undefined, mapDispatchToProps)(SignupInflow);
