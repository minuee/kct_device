// 회원가입 사업자 회원 담당자 정보 입력
import React, {Component} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    PermissionsAndroid, Platform,
} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {connect} from "react-redux";

//utils
import {CodeText, Generic, SignupText} from "../../../model/lib/Utils/Strings";
import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";
import {DEVICE_WIDTH} from "../../../model/lib/Utils/Constants";
import {isValidEmail} from "../../../model/lib/Utils";

//component
import {Header} from "../../../component/signup/Header";
import {BottomBtn} from "../../../component/signup/BottomBtn";
import TextInputStr from "../../../common/textinput/TextInput";
import SelectPhotoModal from "../../../component/modal/SelectPhotoModal";

//action
import * as ActionMber from "../../../model/action/eMBER";
import ConfirmModal from "../../../component/modal/ConfirmModal";

class SignupBusinessAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company: "",
            email: "",
            errorMsgEmail: "",
            companyRegistrationNumber: "",
            companyRegistrationUrl: "",
            isShowFilterModal: false,
        };
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
        const {email} = this.state;
        let params = {
            email_addr: email,
            mber_se_cd: CodeText.mber_se_cd_c
        }

        this.props.checkAleady(params).then((res) => {
            if (!res.available)
                this.setState({isShowConfirmModal: true, aleady_msg: res.msg, errorMsgEmail: SignupText.duplicationEmail})
            else this.setState({ errorMsgEmail: "" });
        }).catch((err) => {});
    }

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
                    this.setState({isShowFilterModal: true})
                } else {
                    console.log("모든 권한 획득");
                }
            });
        } else {
            this.setState({isShowFilterModal: true})
        }
    };

    updatePhoto = (image_url) => {
        this.setState({companyRegistrationUrl: image_url});
    }

    render() {
        const {navigation} = this.props;
        const {
            company,
            email,
            errorMsgEmail,
            companyRegistrationNumber,
            companyRegistrationUrl,
            isShowFilterModal,
            isShowConfirmModal, aleady_msg
        } = this.state;
        return (
            <View style={styles.container}>
                <Header step={4} total={navigation.state.params.currentUserType === 0 ? 6 : 5} navigation={navigation}/>
                <KeyboardAwareScrollView
                    style={{paddingHorizontal: 20}}
                    extraScrollHeight={150}
                    enableOnAndroid>
                    <Text style={styles.signUp}>{SignupText.companyCertification}</Text>
                    <TextInputStr
                        boxStyle={[styles.boxStyle, {marginTop: 44.2}]}
                        textForm={styles.textForm}
                        placeholder={SignupText.companyName}
                        placeholderTextColor="#d5d5d5"
                        value={company}
                        setValue={(str) => this.setState({company: str})}
                    />
                    <TextInputStr
                        boxStyle={[styles.boxStyle, {marginTop: 14}]}
                        textForm={styles.textForm}
                        placeholder={SignupText.companyEmail}
                        placeholderTextColor="#d5d5d5"
                        value={email}
                        setValue={(str) => {
                            if (isValidEmail(str))
                                this.setState({email: str, errorMsgEmail: SignupText.incorrectEmail})
                            else
                                this.setState({email: str, errorMsgEmail: ""}, () => this.handleCheckAleady())
                        }}
                        onBlur={() => {
                            // this.handleCheckEmail();
                            this.handleCheckAleady();
                        }}
                    />
                    {errorMsgEmail !== "" ? (
                        <Text style={styles.errorMsg}>{errorMsgEmail}</Text>
                    ) : null}
                    <TextInputStr
                        boxStyle={[styles.boxStyle, {marginTop: 14}]}
                        textForm={styles.textForm}
                        placeholder={SignupText.companyRegistrationNumber}
                        placeholderTextColor="#d5d5d5"
                        value={companyRegistrationNumber}
                        keyboardType='numeric'
                        setValue={(str) =>
                            this.setState({companyRegistrationNumber: str.replace(/[^0-9]/g, '')})
                        }
                    />
                    {companyRegistrationUrl ? (
                        <View style={{paddingVertical: 20}}>
                            <Image source={{uri: companyRegistrationUrl}} style={styles.feedImg}/>
                            <TouchableOpacity
                                style={{position: "absolute", top: 10, right: DEVICE_WIDTH - 160, zIndex: 5}}
                                onPress={() => this.setState({companyRegistrationUrl: ""})}>
                                <Image
                                    source={require("../../../assets/image/tag/img_delete_btn.png")}
                                    style={{width: 22.8, height: 22.8}}
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.regWrap} onPress={() => this.checkCameraPermission()}>
                            <Image
                                source={require("../../../assets/image/signup/add_img_signup.png")}
                                style={{width: 20, height: 20, marginBottom: 6}}
                            />
                            <Text style={styles.regWrapText}>
                                {SignupText.registrationOfBusinessLicense}
                            </Text>
                            <Text style={styles.regWrapSubText}>
                                {SignupText.uploadFormatInfo}
                            </Text>
                        </TouchableOpacity>
                    )}
                    <View style={{height: 150}}/>
                </KeyboardAwareScrollView>
                <SelectPhotoModal
                    isShowSelectPhotoModal={isShowFilterModal}
                    setVisible={() => this.setState({isShowFilterModal: false})}
                    updatePhoto={(image_url) => this.updatePhoto(image_url)}
                />
                <BottomBtn
                    navigation={navigation}
                    isActive={errorMsgEmail === "" && companyRegistrationNumber !== "" && companyRegistrationUrl !== ""}
                    nav="SignupPersonalData"
                    params={{
                        ...navigation.state.params.params,
                        entpr_nm: company, // 상호명
                        mber_id: companyRegistrationNumber,
                        email_addr: email,
                        bsnm_reg_no: companyRegistrationNumber,
                        img_url_addr: companyRegistrationUrl,
                    }}
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
    regWrap: {
        height: 120,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#595959",
        borderStyle: "dashed",
        marginTop: 20.5,
    },
    regWrapText: {
        fontFamily: Fonts.AppleR,
        fontSize: 14,
        lineHeight: 20.5,
        color: "#595959",
    },
    regWrapSubText: {
        marginTop: 10,
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        lineHeight: 20.5,
        color: "#c1c1c1",
    },
    errorMsg: {
        marginTop: 8,
        fontSize: 12,
        color: "#ff6060",
    },
    representativeBox: {
        backgroundColor: "rgba(255, 255, 255, 1)",
        width: 35,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 20,
        left: 0,
        zIndex: 10,
        borderTopLeftRadius: 5,
    },
    representative: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.6,
        color: Colors.MAIN_COLOR,
    },
    feedImg: {
        width: 105,
        height: 120,
        marginRight: 12,
        borderColor: "#707070",
        borderWidth: 0.3,
    },
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    createImg: (params) => dispatch(ActionMber.createImg(params)),
    checkEmail: (params) => dispatch(ActionMber.checkEmail(params)),
    checkAleady: (params) => dispatch(ActionMber.checkAleady(params)),
});

export default connect(undefined, mapDispatchToProps)(SignupBusinessAccount);
