// 1:1 문의 등록
// 1:1 문의
import React, {Component} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform,
    FlatList,
} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {connect} from "react-redux";

import TextInputStr from "../../../../common/textinput/TextInput";
import {TopHeader} from "../../../../component/TopHeader";

import Fonts from "../../../../model/lib/Utils/Fonts";
import Colors from "../../../../model/lib/Utils/Colors";
import {getFileName, notifyMessage} from "../../../../model/lib/Utils";
import {DEVICE_WIDTH} from "../../../../model/lib/Utils/Constants";
import {MyPageText, StoreText} from "../../../../model/lib/Utils/Strings";

import * as ActionInqry from "../../../../model/action/eONETOONE_INQRY";
import * as ActionFile from "../../../../model/lib/UploadManager/eFILE";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
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
    searchBox: {
        height: 33,
        borderBottomWidth: 1,
        borderBottomColor: Platform.OS === "ios" ? "#000000" : "transparent",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
        marginHorizontal: 20,
    },
    textForm: {
        fontFamily: Fonts.AppleR,
        fontSize: 15,
        letterSpacing: -0.38,
        color: "#000000",
    },
    categoryBtn: {
        paddingHorizontal: 23.5,
        paddingVertical: 7.5,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 17.8,
        marginRight: 5,
        height: 35,
    },
    category: {fontFamily: Fonts.AppleB, fontSize: 16, letterSpacing: -0.8},
    categories: {
        paddingLeft: 20,
        paddingTop: 12,
        paddingBottom: 15.5,
        height: 62.5,
        borderBottomWidth: 0.5,
        borderBottomColor: "#d5d5d5",
    },
    faq: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 60,
        borderBottomWidth: 0.5,
    },
    faqTitle: {
        fontFamily: Fonts.AppleR,
        fontSize: 14,
        letterSpacing: -0.7,
        textAlign: "left",
        color: "#333333",
        width: "65%",
    },
    addPhotoBox: {
        width: 80,
        height: 80,
        borderRadius: 5,
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#dddddd",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginLeft: 20,
        marginRight: 12,
    },
    addPhoto: {
        fontFamily: Fonts.AppleR,
        fontSize: 12.3,
        color: "#595959",
        marginTop: 7.8,
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
        width: 80,
        height: 80,
        borderRadius: 5,
        marginRight: 12,
    },
    inquiryTypeTitle: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.36,
        color: "#333333",
    },
    inquiryTypeBtn: {
        marginTop: 6,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: "#dddddd",
        paddingLeft: 15,
        paddingRight: 10,
        height: 40,
    },
    inquiryTypeBox: {
        width: "100%",
        backgroundColor: "white",
        position: "absolute",
        top: 60,
        left: 0,
        zIndex: 200,
        borderWidth: 1,
        borderColor: "#dddddd",
        borderTopWidth: 0,
        paddingTop: 7.5,
        paddingBottom: 12,
    },
    dropdownWrap: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
        paddingLeft: 15,
    },
    inputTextForm: {
        fontFamily: Fonts.AppleR,
        letterSpacing: -0.7,
        color: "#999999",
    },
    inquriesWrap: {
        marginHorizontal: 20,
        marginTop: 30,
        zIndex: -5
    },
    inquriesText: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.36,
        color: "#333333",
    },
    inquriesInputWrap: {
        marginTop: 6,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: "#dddddd",
        paddingLeft: 15,
        height: 45,
    },
    inquriesContentWrap: {
        marginTop: 10,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: "#dddddd",
        height: 195,
    },
    inquriesCountText: {
        fontFamily: Fonts.AppleB,
        fontSize: 12,
        letterSpacing: -0.3,
        color: "#999999",
        marginRight: 15,
        marginBottom: 15,
        alignSelf: "flex-end",
    },
    photoMessage: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.36,
        color: "#c1c1c1",
        marginLeft: 20,
        marginTop: 10
    },
    submitBtn: {
        marginHorizontal: 20,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        position: "absolute",
        bottom: 15,
        width: DEVICE_WIDTH - 40,
    },
    submitText: {
        fontFamily: Fonts.AppleR,
        fontSize: 20,
        letterSpacing: -1,
        color: "#f5f5f5",
    }
});

class QnABoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            inquiryType: {},
            inqry_se_cd: "",
            inquiryTitle: "",
            inquiries: "",
            qnas: [
                {
                    category: "구매",
                    title: "구매중 오류가 생겼는데요",
                    isOpened: false,
                    reviewStatus: 1,
                    updatedAt: "2021-07-21",
                    image_url: require("../../../../assets/image/temp1.png"),
                    content:
                        "답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 ",
                    review:
                        "답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 ",
                },
                {
                    category: "구매",
                    title: "구매중 오류가 생겼는데요",
                    isOpened: false,
                    reviewStatus: 2,
                    updatedAt: "2021-07-21",
                    review:
                        "답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 ",
                },
                {
                    category: "구매",
                    title: "구매중 오류가 생겼는데요",
                    isOpened: false,
                    reviewStatus: 2,
                    updatedAt: "2021-07-21",
                    review:
                        "답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 답변 내용 텍스트 ",
                },
            ],
            image_urls: [],
            isOpenedInquryTypeBox: false,
            selectedInquryType: null,
        };
    }

    componentDidMount() {
        const {eCOMM_CD_TYPE} = this.props;
        this.setState({categories: eCOMM_CD_TYPE["INQRY_SE_CD"].comm_cd})
    }

    handleCreate = () => {
        const {navigation} = this.props;
        const {inquiryType, inquiryTitle, inquiries} = this.state;
        let params = {
            inqry_se_cd: inquiryType.cd_no,
            inqry_sj: inquiryTitle,
            inqry_cont: inquiries,
        };

        console.log("params")
        console.log(params)

        this.props.create(params).then(async (res) => {
            await this.uploadByFile(res.detail.onetoone_inqry_no);
        }).catch((err) => {
        });
        navigation.pop();
    };

    uploadByFile = (onetoone_inqry_no) => {
        const {image_urls} = this.state;
        image_urls.filter((item) => !item.img_sn).map((item) => {
            let params = {
                uri: item.uri,
                type: item.type,
                name: getFileName(item.uri),
            };

            this.props.uploadByImage(params).then((res) => {
                this.handleCreateImg(onetoone_inqry_no, res[0].original)
            }).catch((err) => {
            });
        })
    };


    handleCreateImg = (onetoone_inqry_no, image_url) => {
        let params = {
            onetoone_inqry_no: onetoone_inqry_no,
            img_file_nm: getFileName(image_url),
            img_url_addr: image_url,
        }
        console.log("createImg : params")
        console.log(params)

        this.props.createImg(params).then((res) => {
        }).catch((err) => {
        });
    }

    setImageUrls = (image_urls) => {
        this.setState({image_urls: image_urls});
    };

    renderInquryTypeBox = () => {
        // categories > dropdown || select value > inqry_se_cd
        const {isOpenedInquryTypeBox, inquiryType, categories} = this.state;
        return (
            <View style={{marginHorizontal: 20, marginTop: 20}}>
                <Text style={styles.inquiryTypeTitle}>{MyPageText.inquiryType}</Text>
                <TouchableOpacity
                    style={[
                        styles.betweenCenter,
                        styles.inquiryTypeBtn,
                        isOpenedInquryTypeBox && {
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                        },
                    ]}
                    onPress={() =>
                        this.setState({isOpenedInquryTypeBox: !isOpenedInquryTypeBox})
                    }
                >
                    <Text
                        style={{
                            fontFamily: Fonts.AppleR,
                            letterSpacing: -0.7,
                            color: inquiryType ? "#222222" : "#bbbbbb",
                        }}
                    >
                        {inquiryType.cd_nm ? inquiryType.cd_nm : MyPageText.inquiryTypePlaceholder}
                    </Text>
                    <Image
                        style={{width: 20, height: 20}}
                        source={require("../../../../assets/image/mypage/dropdown_btn_regular.png")}
                    />
                </TouchableOpacity>
                {isOpenedInquryTypeBox ? (
                    <View
                        style={styles.inquiryTypeBox}
                    >
                        {categories.map((item) => {
                            console.log("cagetory")
                            console.log(categories)
                            const isActive = inquiryType && inquiryType.cd_no === item.cd_no;
                            return (
                                <TouchableOpacity
                                    style={styles.dropdownWrap}
                                    onPress={() =>
                                        this.setState({
                                            inquiryType: item,
                                            isOpenedInquryTypeBox: false,
                                        })
                                    }
                                >
                                    <Text
                                        style={{
                                            fontFamily: isActive ? Fonts.AppleB : Fonts.AppleR,
                                            fontSize: 14,
                                            letterSpacing: -0.38,
                                            color: isActive ? Colors.MAIN_COLOR : "#222222",
                                            marginRight: 7.5,
                                        }}
                                    >
                                        {item.cd_nm}
                                    </Text>
                                    {isActive && (
                                        <Image
                                            style={{width: 18, height: 12, marginTop: -3}}
                                            source={require("../../../../assets/image/signup/check_pink_48_dp_1_2.png")}
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ) : null}
            </View>
        );
    };

    renderInquries = () => {
        const {inquiryTitle, inquiries} = this.state;
        return (
            <View style={styles.inquriesWrap}>
                <Text style={styles.inquriesText}>
                    {MyPageText.inquiries}
                </Text>
                <View style={styles.inquriesInputWrap}>
                    <TextInputStr
                        boxStyle={{flex: 1, justifyContent: "center"}}
                        textForm={styles.inputTextForm}
                        placeholder={MyPageText.inquiryTitle}
                        placeholderTextColor="#d5d5d5"
                        value={inquiryTitle}
                        setValue={(str) => {
                            if (str.length <= 20) this.setState({inquiryTitle: str});
                            else notifyMessage(StoreText.inquiryLimit);
                        }}
                    />
                </View>

                <View style={styles.inquriesContentWrap}>
                    <TextInputStr
                        boxStyle={{flex: 1, paddingHorizontal: 15, paddingTop: 10}}
                        textForm={styles.inputTextForm}
                        placeholder={MyPageText.inquiryPlaceholder}
                        placeholderTextColor="#d5d5d5"
                        value={inquiries}
                        multiline={true}
                        setValue={(str) => {
                            if (str.length <= 1000) this.setState({inquiries: str});
                        }}
                    />
                    <Text style={styles.inquriesCountText}>
                        {inquiries.length}/1,000
                    </Text>
                </View>
            </View>
        );
    };

    renderAddPhotoBox = () => {
        const {navigation} = this.props;
        const {image_urls} = this.state;
        return (
            <View>
                <FlatList
                    data={image_urls}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item, index}) => {
                        return (
                            <View style={{paddingVertical: 20}}>
                                {index === 0 ? (
                                    <View style={styles.representativeBox}>
                                        <Text style={styles.representative}>
                                            {MyPageText.representative}
                                        </Text>
                                    </View>
                                ) : null}

                                <Image source={{uri: item.uri}} style={styles.feedImg}/>
                                <TouchableOpacity
                                    style={{position: "absolute", top: 10, right: 3, zIndex: 5}}
                                >
                                    <Image
                                        source={require("../../../../assets/image/tag/img_delete_btn.png")}
                                        style={{width: 22.8, height: 22.8,}}
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                    ListHeaderComponent={() => {
                        return (
                            <TouchableOpacity
                                style={styles.addPhotoBox}
                                onPress={() =>
                                    navigation.navigate("FeedSelectPhoto", {
                                        setImageUrls: this.setImageUrls,
                                        limit: 4
                                    })
                                }
                            >
                                <Image
                                    source={require("../../../../assets/image/tag/photo_graphic_icon.png")}
                                    style={{width: 30.8, height: 30.8}}
                                />
                                <Text style={styles.addPhoto}>{MyPageText.addPhoto}</Text>
                            </TouchableOpacity>
                        );
                    }}
                    horizontal={true}
                />
                <Text style={styles.photoMessage}>
                    {MyPageText.photoMessage}
                </Text>
            </View>
        );
    };

    renderSubmitBtn = () => {
        const {inquiryTitle, inquiries, inquiryType} = this.state;
        const isDisabled = !inquiryTitle || !inquiries || !inquiryType.cd_nm;
        return (
            <TouchableOpacity
                style={[styles.submitBtn, {backgroundColor: isDisabled ? "#dddddd" : "#000000",}]}
                onPress={() => !isDisabled ? this.handleCreate() : null}>
                <Text style={styles.submitText}>
                    {MyPageText.addInquiry}
                </Text>
            </TouchableOpacity>
        );
    };

    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <TopHeader
                    title={MyPageText.writeQna}
                    navigation={navigation}
                    hasRightBtn={false}
                    isCloseIcon={true}
                />
                <KeyboardAwareScrollView enableOnAndroid>
                    {this.renderInquryTypeBox()}
                    {this.renderInquries()}
                    {this.renderAddPhotoBox()}
                </KeyboardAwareScrollView>
                {this.renderSubmitBtn()}
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    eSESSION: state.eSESSION.eSESSION,
    eCOMM_CD: state.eCOMM_CD.eCOMM_CD,
    eCOMM_CD_TYPE: state.eCOMM_CD.eCOMM_CD_TYPE,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    create: (params) => dispatch(ActionInqry.create(params)),
    createImg: (params) => dispatch(ActionInqry.createImg(params)),
    uploadByImage: (params) => dispatch(ActionFile.uploadByImage(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QnABoard);
