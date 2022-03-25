// 회원가입 이용약관
import React, {Component} from "react";
import {View, Text, Image, TouchableOpacity, StyleSheet, Platform} from "react-native";
import {connect} from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";

import {CodeText, SignupText, TermsCode, TOKEN} from "../../../model/lib/Utils/Strings";
import Fonts from "../../../model/lib/Utils/Fonts";
import {notifyMessage, widthPercentageToDP as wp} from "../../../model/lib/Utils";

import {Header} from "../../../component/signup/Header";
import {BottomBtn} from "../../../component/signup/BottomBtn";
import {TermsRow} from "../../../component/signup/TermsRow";

import * as ActionSession from "../../../model/action/eSESSION";
import * as ActionMber from "../../../model/action/eMBER";

class SignupAppleTerms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUserType: null,
            isSelectedAll: false,
            terms: [
                {
                    title: SignupText.mainInfo,
                    type: 0,
                    isRequired: true,
                    isSelected: false,
                    use_stplat_no: TermsCode.terms
                },
                {
                    title: SignupText.primary,
                    type: 1,
                    isRequired: true,
                    isSelected: false,
                    use_stplat_no: TermsCode.primary
                },
                {
                    title: SignupText.thirdParty,
                    type: 2,
                    isRequired: false,
                    isSelected: false,
                    use_stplat_no: TermsCode.policy3rd
                },
                {
                    title: SignupText.marketing,
                    type: 3,
                    isRequired: false,
                    isSelected: false,
                    use_stplat_no: TermsCode.marketing
                },
            ],
        };
    }

    handleSubmit = () => {
        const {navigation} = this.props;
        const {
            social,
            social_key,
        } = navigation.state.params.params;
        const {terms} = this.state;

        let params = {
            mber_id: "",
            email_addr: "",
            mber_nm: "",
            moblphon_no: "",
            mber_se_cd: CodeText.mber_se_cd_g,
            use_stplat_op1_yn: terms[2].isSelected === true ? "Y" : "N",
            use_stplat_op2_yn: terms[3].isSelected === true ? "Y" : "N",
            os_cd: Platform.OS === "ios" ? CodeText.os_cd_ios : CodeText.os_cd_android,
        };
        if (social && social_key)
            Object.assign(params, {social, social_key})

        console.log("params")
        console.log(params)

        this.props.create(params).then((res) => {
            if (social && social_key)
                this.handleSocial();
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
                navigation.navigate("SignupResult", {currentUserType: currentUserType})
            }

        }).catch((err) => {
        });
    };

    updateTerms = (terms) => {
        this.setState({terms: terms});
    };

    render() {
        const {navigation} = this.props;
        const {terms, isSelectedAll} = this.state;
        const isSocial = navigation.state.params.params.social;
        return (
            <View style={styles.container}>
                <Header isSocial={isSocial} step={4} total={null} navigation={navigation}/>
                <Text style={styles.signUp}>{SignupText.terms}</Text>
                <View style={{marginTop: wp("26.9%"), marginHorizontal: 30}}>
                    <TouchableOpacity
                        style={styles.fullConsent}
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
                            this.setState({isSelectedAll: !isSelectedAll});
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
                        <Text style={styles.termsText}>{SignupText.fullConsent}</Text>
                    </TouchableOpacity>
                    <TermsRow
                        navigation={navigation}
                        terms={terms}
                        type={terms[0].type}
                        updateTerms={(updatedTerms) => this.updateTerms(updatedTerms)}
                    />
                    <TermsRow
                        navigation={navigation}
                        terms={terms}
                        type={terms[1].type}
                        updateTerms={(updatedTerms) => this.updateTerms(updatedTerms)}
                    />
                    <TermsRow
                        navigation={navigation}
                        terms={terms}
                        type={terms[2].type}
                        updateTerms={(updatedTerms) => this.updateTerms(updatedTerms)}
                    />
                    <TermsRow
                        navigation={navigation}
                        terms={terms}
                        type={terms[3].type}
                        updateTerms={(updatedTerms) => this.updateTerms(updatedTerms)}
                    />
                </View>

                <BottomBtn
                    navigation={navigation}
                    isActive={!terms.some((term) => term.isRequired && !term.isSelected)}
                    nav={"SignupResult"}
                    handleSubmit={() => this.handleSubmit()}
                    currentUserType={navigation.state.params.currentUserType}
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
    fullConsent: {
        flexDirection: "row",
        borderBottomColor: "#c1c1c1",
        borderBottomWidth: 0.5,
        height: wp("12%"),
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
        marginRight: 2.5,
    },
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    create: (params) => dispatch(ActionMber.create(params)),
    getSession: (params) => dispatch(ActionSession.getSession(params)),
    setSession: (params) => dispatch(ActionSession.setSession(params)),
    loginSocial: (params) => dispatch(ActionMber.loginSocial(params)),
});

export default connect(undefined, mapDispatchToProps)(SignupAppleTerms);
