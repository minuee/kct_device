// 마이페이지
// 사업자용/일반인용
import React, {Component} from "react";
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform,
    PermissionsAndroid, Linking,
} from "react-native";
import {connect} from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";

// Utils
import {StatusBarHeight} from "../../model/lib/Utils/Constants";
import Fonts from "../../model/lib/Utils/Fonts";
import {
    CodeText,
    MyPageText,
    Generic,
    TermsCode, TOKEN,
} from "../../model/lib/Utils/Strings";
import {
    clearAsyncStorage,
    formattedNumber,
    getFileName,
    maskingEmail, maskingRegNo,
    notifyMessage,
} from "../../model/lib/Utils";
import Colors from "../../model/lib/Utils/Colors";

// component
import {MainHeader} from "../../component/MainHeader";
import SelectPhotoModal from "../../component/modal/SelectPhotoModal";
import AlertModal from "../../component/modal/AlertModal";
import TaxApplicationModal from "../../component/modal/TaxApplicationModal";

// Action
import * as ActionMber from "../../model/action/eMBER";
import * as ActionUser from "../../model/action/eUSER";
import * as ActionSession from "../../model/action/eSESSION";
import * as ActionPush from "../../model/action/ePUSH";
import {build_type} from "../../model/api";

const generalMenu = [
    {title: MyPageText.email, subtitle: ""},
    {title: MyPageText.point, subtitle: "", nav: "MyPoint"},
    {title: MyPageText.productInquiry, nav: "MyProductQnA"},
    {title: MyPageText.cart, nav: "Cart"}, // MySale
    {title: MyPageText.addressSetting, nav: "MySettingAddress"},
    {title: MyPageText.account, nav: "MySettingAccount"},
    {title: MyPageText.password, nav: "MySettingPassword"},
    {title: MyPageText.logout, isUnderline: true},
    {title: MyPageText.withdraw, isUnderline: true},
];
const businessMenu = [
    {title: MyPageText.setContactInfo, subtitle: "", nav: "MySettingGroup"},
    {title: MyPageText.point, subtitle: "", nav: "MyPoint"},
    {title: MyPageText.productInquiry, nav: "MyProductQnA"},
    {title: MyPageText.cart, nav: "Cart"}, // MySale
    // { title: MyPageText.cart, nav: "MySale" },
    {title: MyPageText.addressSetting, nav: "MySettingAddress"},
    {title: MyPageText.account, nav: "MySettingAccount"},
    {title: MyPageText.taxInvoiceApplication, nav: "TaxApplication"},
    {title: MyPageText.passwordChangeInquiry, isUnderline: true},
    {title: MyPageText.logout, isUnderline: true},
    {title: MyPageText.withdraw, isUnderline: true},
];

const otherGeneralMenu = [
    {title: MyPageText.faq, nav: "FAQ"},
    {title: MyPageText.notice, nav: "Notice"},
    {title: MyPageText.qna, nav: "QnA"},
    {
        title: MyPageText.privacyPolicy,
        nav: "TermsDetail",
        params: {
            title: MyPageText.privacyPolicy,
            use_stplat_no: TermsCode.primary,
        },
    },
    {
        title: MyPageText.term,
        nav: "TermsDetail",
        params: {title: MyPageText.term, use_stplat_no: TermsCode.terms},
    },
];
const otherBusinessMenu = [
    {title: MyPageText.faq, nav: "FAQ"},
    {title: MyPageText.notice, nav: "Notice"},
    {title: MyPageText.qna, nav: "QnA"},
    {
        title: MyPageText.businessUserTerms,
        nav: "TermsDetail",
        params: {
            title: MyPageText.businessUserTerms,
            use_stplat_no: TermsCode.business,
        },
    },
    {
        title: MyPageText.term,
        nav: "TermsDetail",
        params: {title: MyPageText.term, use_stplat_no: TermsCode.terms},
    },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    rowCenter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    betweenCenter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    kctInfoWrap: {
        backgroundColor: "#f5f5f5",
        paddingTop: 22.5,
        paddingHorizontal: 20,
        paddingBottom: 80,
    },
    kctInfoDefaultText: {
        fontFamily: Fonts.AppleR,
        fontSize: 11,
        letterSpacing: -0.28,
        color: "#999999",
        lineHeight: 19,
    },
    kctInfoCallText: {
        fontFamily: Fonts.AppleR,
        fontSize: 11,
        letterSpacing: -0.28,
        lineHeight: 19,
        color: "#009dff",
        textDecorationLine: "underline",
    },

});

class MyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            push_cnt: 0,
            userDetail: {},
            currentTabIdx: 0,
            isShowSelectPhotoModal: false,
            infoOptions: [],
            isShowLogoutModal: false,
            isShowContactUsModal: false,
            isShowTaxApplicationModal: false,
            isShowCompanyModal: false,
        };
    }


    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            this.getSession();
            this.getDetail();
            this.getNewPush();
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    getNewPush = () => {
        this.props.getNewPush({}).then((res) => {
            this.setState({push_cnt: parseInt(res.count || 0)})
        }).catch((err) => {
        });
    }

    getSession = () => {
        this.props.getSession({}).then((res) => {
            this.props.setSession(res.account);
        }).catch((err) => { // 409 && 로그아웃
            let errorCode = err.response.data.error.status;
            if(errorCode === 409){
                this.handleLogout();
            }
        });
    }

    getDetail = () => {
        const {eSESSION} = this.props;
        let params = {
            mber_se_cd: eSESSION.mber_se_cd,
            // mber_no: eSESSION.mber_no,
        };

        this.props.getDetail(params).then((res) => {
            let optionData = eSESSION.mber_se_cd === CodeText.mber_se_cd_g ? generalMenu : businessMenu;
            if (eSESSION.mber_se_cd === CodeText.mber_se_cd_g) {
                // 일반회원
                optionData[0].subtitle = maskingEmail(eSESSION.email_addr);
            } else {
                optionData[0].subtitle = eSESSION.entpr_charger_nm;
            }
            optionData[1].subtitle = `${formattedNumber(res.user[0].포인트 || 0)} p`;
            this.setState({userDetail: res.user[0], infoOptions: optionData});
        }).catch((err) => {
        });
    };

    updatePhoto = (image_url) => {
        const {eSESSION} = this.props;
        const profile_image = eSESSION[CodeText.mber_img_typ_cd_p];
        // USER_UPDATE 필요
        let params = {
            img_file_nm: getFileName(image_url),
            img_url_addr: image_url,
        };

        if(profile_image.img_sn) {
            Object.assign(params, {img_sn: profile_image.img_sn})
            console.log("updatePhoto")
            console.log(params)
            this.props.updateImg(params).then((res) => {
                this.props.getSession({}).then((res) => {
                    this.props.setSession(res.account);
                    notifyMessage("정보를 수정하였습니다.");
                });
            }).catch((err) => {
            });
        } else {
            Object.assign(params, {mber_no: eSESSION.mber_no, mber_img_typ_cd: CodeText.mber_img_typ_cd_p})
            this.props.createImg(params).then((res) => {
                console.log("res : " + res);
                this.props.getSession({}).then((res) => {
                    this.props.setSession(res.account);
                    notifyMessage("정보를 수정하였습니다.");
                });
            }).catch((err) => {
            });
        }
    };

    checkCameraPermission = async () => {
        //Calling the permission function
        if (Platform.OS === "android") {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            ]).then((result) => {
                if (
                    result["android.permission.CAMERA"] &&
                    result["android.permission.WRITE_EXTERNAL_STORAGE"] &&
                    result["android.permission.READ_EXTERNAL_STORAGE"] === "granted"
                ) {
                    console.log("모든 권한 획득");
                    this.setState({isShowSelectPhotoModal: true});
                } else {
                    console.log("모든 권한 획득");
                }
            });
        } else {
            this.setState({isShowSelectPhotoModal: true});
        }
    };

    handleLogout = () => {
        this.props.logout({}).then((res) => {
            // AsyncStorage.clear();
            clearAsyncStorage().then((result) => console.log("remove All"))
            this.props.setSession({});
            this.props.navigation.navigate("Login");
        }).catch((err) => {
        });
    };

    renderMyInfoBox = () => {
        const {eSESSION} = this.props;
        const {userDetail} = this.state;
        const profile_image = eSESSION[CodeText.mber_img_typ_cd_p];

        return (
            <View style={{marginTop: 25.2, marginBottom: 35, marginHorizontal: 20}}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            left: 40,
                            top: 36,
                            zIndex: 5,
                        }}
                        onPress={() => this.checkCameraPermission()}
                        // onPress={() => this.setState({ isShowSelectPhotoModal: true })}
                    >
                        <Image
                            style={{
                                width: 24,
                                height: 24,
                            }}
                            source={require("../../assets/image/mypage/edit_profile.png")}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{marginRight: 15}}
                        onPress={() => this.setState({isShowSelectPhotoModal: true})}
                    >
                        <Image
                            style={{width: 60, height: 60, borderRadius: 30}}
                            source={
                                profile_image?.img_url_addr
                                    ? {uri: profile_image.img_url_addr}
                                    : require("../../assets/image/mypage/profile_default.png")
                            }
                        />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontFamily: Fonts.AppleL,
                            fontSize: 21,
                            letterSpacing: -1.05,
                            color: "#000000",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: Fonts.AppleB,
                            }}
                        >
                            {eSESSION.mber_se_cd === CodeText.mber_se_cd_g ? eSESSION.email_addr.split("@")[0] : maskingRegNo(eSESSION.bsnm_reg_no || "")}
                        </Text>{" "}
                        님,{"\n"}안녕하세요.
                    </Text>
                </View>
                <View
                    style={{
                        height: 70,
                        flexDirection: "row",
                        marginTop: 23.5,
                        // width: 320,
                        backgroundColor: "#ffffff",
                        borderRadius: 5,
                        paddingTop: 11.4,
                        paddingBottom: 10.6,
                        borderColor: "#14000020",
                        borderWidth: .5,
                    }}
                    shadowColor="#14000020"
                    shadowOffset={{width: 0, height: 0}}
                    shadowOpacity={1}
                    elevation={3}
                >
                    {this.renderCountBox(
                        MyPageText.feed,
                        parseInt(userDetail?.피드수 || "0"),
                        false,
                        "MyFeed"
                    )}
                    {this.renderCountBox(
                        MyPageText.purchase,
                        parseInt(userDetail?.구매 || "0"),
                        true,
                        "MyBuy"
                    )}
                    {build_type === TOKEN.build_type_txt && eSESSION.mber_se_cd === CodeText.mber_se_cd_g && this.renderCountBox(MyPageText.sale, parseInt(userDetail?.판매 || "0"), false, "MySale")}
                </View>
            </View>
        );
    };

    renderCountBox = (title, count, isCenter, nav) => {
        const {navigation, eSESSION} = this.props;
        let countbox_style = {width: "50%"}
        if(build_type === TOKEN.build_type_txt && eSESSION.mber_se_cd === CodeText.mber_se_cd_g)
            countbox_style = {width: "33%", borderRightWidth: isCenter ? 1 : 0, borderRightColor: "#dedede",}
        return (
            <TouchableOpacity
                style={[{
                    alignItems: "center",
                    borderLeftWidth: isCenter ? 1 : 0,
                    borderLeftColor: "#dedede",
                }, countbox_style]}
                onPress={() => navigation.navigate(nav)}
            >
                <Text
                    style={{
                        fontFamily: Fonts.appler,
                        fontSize: 12,
                        letterSpacing: -0.6,
                        color: "#999999",
                    }}
                >
                    {title}
                </Text>
                <Text
                    style={{
                        fontSize: 21,
                        fontWeight: "bold",
                        letterSpacing: -1.05,
                        color: "#222222",
                        marginTop: 7,
                    }}
                >
                    {count > 99 ? "99+" : count}
                </Text>
            </TouchableOpacity>
        );
    };

    renderMyPageTabs = () => {
        const {currentTabIdx} = this.state;
        return (
            <View style={{flexDirection: "row", marginLeft: 20}}>
                <TouchableOpacity
                    style={{
                        paddingVertical: 9,
                        borderBottomColor:
                            currentTabIdx === 0 ? Colors.MAIN_COLOR : "transparent",
                        borderBottomWidth: 3,
                        marginRight: 15,
                    }}
                    onPress={() => this.setState({currentTabIdx: 0})}
                >
                    <Text
                        style={{
                            fontFamily: currentTabIdx === 0 ? Fonts.AppleB : Fonts.AppleR,
                            fontSize: 15,
                            letterSpacing: -0.38,
                            color: currentTabIdx === 0 ? Colors.MAIN_COLOR : "#999999",
                        }}
                    >
                        내정보
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        paddingVertical: 9,
                        borderBottomColor:
                            currentTabIdx === 1 ? Colors.MAIN_COLOR : "transparent",
                        borderBottomWidth: 3,
                    }}
                    onPress={() => this.setState({currentTabIdx: 1})}
                >
                    <Text
                        style={{
                            fontFamily: currentTabIdx === 1 ? Fonts.AppleB : Fonts.AppleR,
                            fontSize: 15,
                            letterSpacing: -0.38,
                            color: currentTabIdx === 1 ? Colors.MAIN_COLOR : "#999999",
                        }}
                    >
                        고객센터
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    renderInfoOptionList = ({title, list}) => {
        const {navigation, eSESSION} = this.props;

        return (
            <View
                style={{
                    paddingTop: 30,
                    paddingBottom: 7.2,
                    backgroundColor: "#f5f5f5",
                    paddingHorizontal: 20,
                    borderBottomWidth: 0.5,
                    borderBottomColor: "#dddddd",
                }}
            >
                <Text
                    style={{
                        fontFamily: Fonts.AppleB,
                        fontSize: 17,
                        letterSpacing: -0.85,
                        textAlign: "left",
                        color: "#222222",
                        marginBottom: 23.8,
                    }}
                >
                    {title}
                </Text>
                {list.map((infoOption) => {
                    return (
                        <View style={[styles.betweenCenter, {marginBottom: 20}]}>
                            {infoOption.isUnderline ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        if (infoOption.title === MyPageText.logout) {
                                            this.setState({isShowLogoutModal: true});
                                        } else if (infoOption.title === MyPageText.passwordChangeInquiry) {
                                            this.setState({isShowContactUsModal: true})
                                        } else {
                                            navigation.navigate("Withdraw");
                                        }
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: Fonts.AppleR,
                                            fontSize: 14,
                                            letterSpacing: -0.7,
                                            color: "#222222",
                                            textDecorationLine: "underline",
                                        }}
                                    >
                                        {infoOption.title}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <Text
                                    style={{
                                        fontFamily: Fonts.AppleR,
                                        fontSize: 14,
                                        letterSpacing: -0.7,
                                        color: "#222222",
                                    }}
                                >
                                    {infoOption.title}
                                </Text>
                            )}

                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text
                                    style={{
                                        fontFamily: Fonts.AppleR,
                                        letterSpacing: -0.7,
                                        color: "#555555",
                                    }}
                                >
                                    {infoOption.subtitle}
                                </Text>
                                {infoOption.nav && (
                                    <TouchableOpacity
                                        style={{
                                            position: 'absolute', top: -7, right: 0, zIndex: 99,
                                            height: 35, width: 35}}
                                        onPress={() => {
                                            if (eSESSION.mber_se_cd !== CodeText.mber_se_cd_g && infoOption.nav === "TaxApplication") {
                                                if (eSESSION.entpr_join_ack_yn === "Y")
                                                    navigation.navigate(infoOption.nav)
                                                else this.setState({isShowTaxApplicationModal: true})
                                            } else if (infoOption.nav === "MySettingGroup") {
                                                navigation.push(infoOption.nav, {getDetail: this.getDetail})
                                            } else {
                                                infoOption.params
                                                    ? navigation.push(infoOption.nav, infoOption.params)
                                                    : navigation.navigate(infoOption.nav)
                                            }
                                        }}
                                    />
                                )}
                                {infoOption.nav && (
                                    <View
                                        style={{marginLeft: 5}}
                                        // onPress={() => {
                                        //     if (eSESSION.mber_se_cd !== CodeText.mber_se_cd_g && infoOption.nav === "TaxApplication") {
                                        //         if (eSESSION.entpr_join_ack_yn === "Y")
                                        //             navigation.navigate(infoOption.nav)
                                        //         else this.setState({isShowTaxApplicationModal: true})
                                        //     } else if (infoOption.nav === "MySettingGroup") {
                                        //         navigation.push(infoOption.nav, {getDetail: this.getDetail})
                                        //     } else {
                                        //         infoOption.params
                                        //             ? navigation.push(infoOption.nav, infoOption.params)
                                        //             : navigation.navigate(infoOption.nav)
                                        //     }
                                        // }}
                                    >
                                        <Image
                                            style={{width: 17, height: 17}}
                                            source={require("../../assets/image/mypage/more_chevron_small.png")}
                                        />
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };

    renderKCTInfo = () => {
        return (
            <View style={styles.kctInfoWrap}>
                <Text style={styles.kctInfoDefaultText}>
                    ㈜한국케이블텔레콤 대표이사 이준우 사업자등록번호 120-87-04918{"\n"}
                    통신판매업신고번호 : 제2011-서울중구-1279호{"\n"}
                    서울본사 : 서울특별시 중구 세종대로 50 흥국생명빌딩 7층{"\n"}
                    <TouchableOpacity
                        onPress={() => this.setState({isShowCompanyModal: true})}>
                        <Text style={[styles.kctInfoDefaultText, {marginBottom: -5}]}>대표전화 :{" "}
                            <Text style={styles.kctInfoCallText}>{Generic.callNumber}</Text>
                        </Text>
                    </TouchableOpacity>
                    {"\n"}Copyright ⓒ 2021 한국케이블텔레콤 co.ltd. All Rights Reserved.
                </Text>
            </View>
        );
    };

    render() {
        const {navigation, eSESSION} = this.props;
        const {
            push_cnt,
            infoOptions,
            currentTabIdx,
            isShowSelectPhotoModal,
            isShowLogoutModal,
            isShowContactUsModal,
            isShowTaxApplicationModal,
            isShowCompanyModal
        } = this.state;
        return (
            <View style={styles.container}>
                <View style={{height: StatusBarHeight}}/>
                <MainHeader navigation={navigation} isMyPage={true} eSESSION={eSESSION} push_cnt={push_cnt}/>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.renderMyInfoBox()}
                    {this.renderMyPageTabs()}
                    {this.renderInfoOptionList({
                        title:
                            currentTabIdx === 0
                                ? MyPageText.myInfoEdit
                                : MyPageText.serviceCenter,
                        list: currentTabIdx === 0 ? infoOptions :
                            eSESSION.mber_se_cd === CodeText.mber_se_cd_g ? otherGeneralMenu : otherBusinessMenu,
                    })}
                    {this.renderKCTInfo()}
                </ScrollView>
                <SelectPhotoModal
                    isShowSelectPhotoModal={isShowSelectPhotoModal}
                    setVisible={() => this.setState({isShowSelectPhotoModal: false})}
                    updatePhoto={(image_url) => this.updatePhoto(image_url)}
                />
                {isShowContactUsModal && (
                    <AlertModal
                        isShowAlertModal={isShowContactUsModal}
                        message={MyPageText.contactUsTitle}
                        leftText={Generic.no}
                        rightText={MyPageText.contactCall}
                        setVisible={() => this.setState({isShowContactUsModal: false})}
                        navigation={navigation}
                        leftOnPress={() => this.setState({isShowContactUsModal: false})}
                        rightOnPress={() => Linking.openURL(`tel:01011111111`)}
                    />
                )}
                {isShowCompanyModal && (
                    <AlertModal
                        isShowAlertModal={isShowCompanyModal}
                        message={MyPageText.compamyCallTitle}
                        leftText={Generic.no}
                        rightText={MyPageText.contactCall}
                        setVisible={() => this.setState({isShowCompanyModal: false})}
                        navigation={navigation}
                        leftOnPress={() => this.setState({isShowCompanyModal: false})}
                        rightOnPress={() => Linking.openURL(`tel:${Generic.callNumber}`)}
                    />
                )}
                {isShowLogoutModal && (
                    <AlertModal
                        isShowAlertModal={isShowLogoutModal}
                        message={MyPageText.logoutTitle}
                        subtitle={MyPageText.logoutMessage}
                        leftText={Generic.no}
                        rightText={MyPageText.logoutConfirm}
                        setVisible={() => this.setState({isShowLogoutModal: false})}
                        navigation={navigation}
                        leftOnPress={() => this.setState({isShowLogoutModal: false})}
                        rightOnPress={() => this.handleLogout()}
                    />
                )}
                {isShowTaxApplicationModal && (
                    <TaxApplicationModal
                        isShowCompleteModal={isShowTaxApplicationModal}
                        title={MyPageText.taxApplicationFail}
                        // subtitle={MyPageText.taxApplicationModalFail}
                        setVisible={() => this.setState({isShowTaxApplicationModal: false})}
                        isTaxModal={true}
                    />
                )}
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    eSESSION: state.eSESSION.eSESSION,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    getDetail: (params) => dispatch(ActionMber.getDetail(params)),
    logout: (params) => dispatch(ActionUser.logout(params)),
    createImg: (params) => dispatch(ActionMber.createImg(params)),
    updateImg: (params) => dispatch(ActionMber.updateImg(params)),
    getSession: (params) => dispatch(ActionSession.getSession(params)),
    setSession: (params) => dispatch(ActionSession.setSession(params)),
    getNewPush: (params) => dispatch(ActionPush.getNew(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);
