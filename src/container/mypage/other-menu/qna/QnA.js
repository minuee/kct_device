// 1:1 문의
import React, {Component} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from "react-native";
import produce from "immer";
import {connect} from "react-redux";

// utils
import {MyPageText} from "../../../../model/lib/Utils/Strings";
import Fonts from "../../../../model/lib/Utils/Fonts";
import Colors from "../../../../model/lib/Utils/Colors";
import * as dateUtil from "../../../../model/lib/Utils/Date";

// component
import {TopHeader} from "../../../../component/TopHeader";
import {QnACategory} from "../../../../component/mypage/qna/QnACategory";

// action
import * as ActionInqry from "../../../../model/action/eONETOONE_INQRY";

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
    betweenCenterBorder: {
        marginHorizontal: 20,
        borderBottomColor: "#191919",
        borderTopColor: "#191919",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingTop: 9,
        paddingBottom: 9,
    },
    betweenHeaderBorder: {
        paddingTop: 16,
        paddingBottom: 10.5,
        borderBottomWidth: 0.5,
        borderBottomColor: "#d5d5d5",
    },
    headerCount: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        letterSpacing: -0.65,
        color: "#333333",
    },
    titleText: {
        fontFamily: Fonts.AppleB,
        fontSize: 17,
        letterSpacing: -0.85,
        color: "#191919",
    },
    subTitleText: {
        marginTop: 7.5,
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.6,
        color: "#969696",
    },
    faq: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 60,
        borderBottomWidth: 0.5,
    },
    qnaTitle: {
        fontFamily: Fonts.AppleR,
        letterSpacing: -0.7,
        color: "#595959",
    },
    qnaDate: {
        marginTop: 6,
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        color: "#d5d5d5",
    },
    qnaRowCenter: {
        flexDirection: "row",
        alignItems: "center",
    },
    qnaContent: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        letterSpacing: -0.65,
        color: "#333333",
        marginVertical: 12,
        marginHorizontal: 10
    },
    openQnaView: {
        paddingHorizontal: 10,
        paddingVertical: 16,
        backgroundColor: "#f5f5f5",
    },
    openTagView: {
        paddingHorizontal: 10,
        paddingVertical: 2.5,
        borderWidth: 1,
        borderColor: Colors.MAIN_COLOR,
        marginRight: 10,
    },
    openTagText: {
        fontFamily: Fonts.AppleB,
        fontSize: 12,
        letterSpacing: -0.36,
        color: Colors.MAIN_COLOR,
    },
    openTagDate: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        color: "#969696",
    },
    openQnaContent: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        letterSpacing: -0.65,
        color: "#333333",
    },
});

class QnA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            currentCategoryId: 0,
            qnaList: [],
            qnaCount: 0
        };
    }


    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            this.getList();
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    getList = () => {
        const {eCOMM_CD} = this.props;
        const {currentCategoryId} = this.state;
        let params = {
            skip: 0,
            limit: 100,
        }

        if (currentCategoryId !== 0)
            Object.assign(params, {state: currentCategoryId})

        this.props.getList(params).then((res) => {
            let newList = res.list.map((item) => {
                return {...item, isOpened: false, inqry_se_nm: eCOMM_CD[`${item.inqry_se_cd}`]?.cd_nm || "---"}
            })
            this.setState({qnaList: newList, qnaCount: parseInt(res.count)})
        }).catch((err) => {
        });
    }

    getDetail = (onetoone_inqry_no, index) => {
        const {qnaList} = this.state;
        let params = {
            onetoone_inqry_no: onetoone_inqry_no,
        }

        this.props.getDetail(params).then((res) => {
            let updatedQnas = produce(qnaList, (draft) => {
                draft[index].detail = res.detail;
            });
            this.setState({qnaList: updatedQnas})
        }).catch((err) => {
        });
    }

    render() {
        const {navigation} = this.props;
        const {currentCategoryId, qnaList, qnaCount} = this.state;
        return (
            <View style={styles.container}>
                <TopHeader
                    title={MyPageText.qna}
                    navigation={navigation}
                    hasRightBtn={false}
                />
                <View style={[styles.betweenCenter, styles.betweenCenterBorder]}>
                    <View>
                        <Text style={styles.titleText}>
                            {MyPageText.qnaDetail}
                        </Text>
                        {/*<Text style={styles.subTitleText}>*/}
                        {/*    {MyPageText.qnaDetailInfo}*/}
                        {/*</Text>*/}
                    </View>
                    <TouchableOpacity onPress={() => navigation.push("QnABoard")}>
                        <Image
                            source={require("../../../../assets/image/mypage/write_enable_4.png")}
                            style={{width: 80, height: 80}}
                        />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={qnaList}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item, index}) => {
                        return (
                            <>
                                <TouchableOpacity
                                    style={[
                                        styles.faq,
                                        {borderBottomColor: item.isOpened ? "transparent" : "#d5d5d5",},
                                    ]}
                                    onPress={() => {
                                        let updatedQnas = produce(qnaList, (draft) => {
                                            draft[index].isOpened = !draft[index].isOpened;
                                        });
                                        this.setState({qnaList: updatedQnas}, () => this.getDetail(item.onetoone_inqry_no, index));
                                    }}
                                >
                                    <View>
                                        <Text style={styles.qnaTitle}>
                                            <Text style={{color: "#333333"}}>
                                                [{item.inqry_se_nm}]
                                            </Text>{" "}
                                            {item.inqry_sj}
                                        </Text>
                                        <Text style={styles.qnaDate}>
                                            {dateUtil.formatKCT("dash", item.inqry_reg_dt)}
                                        </Text>
                                    </View>

                                    <View style={styles.qnaRowCenter}>
                                        <View style={[styles.qnaRowCenter, {marginRight: 10,}]}>
                                            {item.inqry_anw_dt && (
                                                <Image
                                                    style={{width: 11.7, height: 11.7, marginRight: 6}}
                                                    source={require("../../../../assets/image/signup/check_circle_on.png")}
                                                />
                                            )}

                                            <Text
                                                style={{
                                                    fontFamily: item.inqry_anw_dt ? Fonts.AppleB : Fonts.AppleR,
                                                    fontSize: 12,
                                                    letterSpacing: -0.36,
                                                    color: item.inqry_anw_dt ? Colors.MAIN_COLOR : "#969696",
                                                }}
                                            >
                                                {item.inqry_anw_dt ? "답변완료" : "답변대기"}
                                            </Text>
                                        </View>
                                        <Image
                                            style={{width: 20, height: 20}}
                                            source={require("../../../../assets/image/mypage/dropdown_btn_regular.png")}
                                        />
                                    </View>
                                </TouchableOpacity>
                                {item.isOpened && item.detail && (
                                    <>
                                        {item.detail?.img && item.detail?.img.map((imgItem) => {
                                            return (
                                                <Image source={{uri: imgItem.img_url_addr}} style={{width: "100%", height: 231.5}}/>
                                            )
                                        })}
                                        {item.inqry_cont && (<Text style={styles.qnaContent}>{item.inqry_cont}</Text>)}
                                        {item.inqry_anw_dt && item.detail && (
                                            <View style={styles.openQnaView}>
                                                <View style={[styles.qnaRowCenter, {marginBottom: 10,}]}>
                                                    <View style={styles.openTagView}>
                                                        <Text style={styles.openTagText}>답변</Text>
                                                    </View>
                                                    <Text style={styles.openTagDate}>
                                                        {dateUtil.formatKCT("dash", item.detail.inqry_anw_dt)}
                                                    </Text>
                                                </View>
                                                <Text style={styles.openQnaContent}>
                                                    {item.detail.answer?.answer_cont}
                                                </Text>
                                            </View>
                                        )}
                                    </>
                                )}
                            </>
                        );
                    }}
                    keyExtractor={(_, i) => String(i)}
                    ListHeaderComponent={() => {
                        return (
                            <View style={[styles.betweenCenter, styles.betweenHeaderBorder]}>
                                <Text style={styles.headerCount}>
                                    {`총 ${qnaCount}건`}
                                </Text>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <QnACategory
                                        title="전체"
                                        isActive={currentCategoryId === 0}
                                        setCurrentCategoryIdx={() =>
                                            this.setState({currentCategoryId: 0}, () => this.getList())
                                        }
                                    />
                                    <QnACategory
                                        title="답변대기"
                                        isActive={currentCategoryId === 1}
                                        setCurrentCategoryIdx={() =>
                                            this.setState({currentCategoryId: 1}, () => this.getList())
                                        }
                                    />
                                    <QnACategory
                                        title="답변완료"
                                        isActive={currentCategoryId === 2}
                                        setCurrentCategoryIdx={() =>
                                            this.setState({currentCategoryId: 2}, () => this.getList())
                                        }
                                    />
                                </View>
                            </View>
                        );
                    }}
                    style={{paddingHorizontal: 20,}}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    eSESSION: state.eSESSION.eSESSION,
    eCOMM_CD: state.eCOMM_CD.eCOMM_CD,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    getList: (params) => dispatch(ActionInqry.getList(params)),
    getDetail: (params) => dispatch(ActionInqry.getDetail(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QnA);
