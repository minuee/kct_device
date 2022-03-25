// 환불요청 화면
import React, {Component} from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import {connect} from "react-redux";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

import TextInputStr from "../../../../common/textinput/TextInput";
import {TopHeader} from "../../../../component/TopHeader";

import Colors from "../../../../model/lib/Utils/Colors";
import {formattedNumber, maskingAccount} from "../../../../model/lib/Utils";
import * as dateUtil from "../../../../model/lib/Utils/Date";
import Fonts from "../../../../model/lib/Utils/Fonts";
import {CodeText, MyBuyText, MyPageText, StoreText} from "../../../../model/lib/Utils/Strings";

import * as ActionImmedi from "../../../../model/action/eIMMEDI_PURCHASE";
import * as ActionAuc from "../../../../model/action/eAUC_TRD";
import * as ActionCoper from "../../../../model/action/eCOPERTN_PURCHASE";
import * as ActionLast from "../../../../model/action/eLAST_PURCHASE";
import * as ActionReserv from "../../../../model/action/eRESERV_PURCHASE";

const returnOptions = [
    {title: "상품 오배송", id: 1},
    {title: "상품 불량/파손", id: 2},
    {title: "단순변심", id: 3},
    {title: "일부 상품누락", id: 4},
    {title: "기타", id: 5},
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    betweenCenter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    orderInfoBox: {
        paddingTop: 21,
        paddingHorizontal: 20,
        backgroundColor: "white",
    },
    cancelDates: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.3,
        color: "#999999",
    },
    orderNum: {
        fontFamily: Fonts.AppleB,
        letterSpacing: -0.35,
        color: "#222222",
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: "#dddddd",
        marginTop: 17.4,
        marginBottom: 14.4,
    },
    product: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 26.5,
    },
    productImg: {
        width: 90,
        height: 90,
        borderRadius: 5,
        borderWidth: 0.3,
        borderColor: "#e1e1e1",
        marginRight: 15,
    },
    cancelTitle: {
        fontFamily: Fonts.AppleM,
        fontSize: 13,
        letterSpacing: -0.33,
        color: "#999999",
    },
    price: {
        fontFamily: Fonts.AppleB,
        fontSize: 17,
        letterSpacing: -0.43,
        color: "#222222",
        marginTop: 10,
    },
    title: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        letterSpacing: -0.33,
        color: "#000000",
        marginTop: 5,
    },
    option: {
        fontFamily: Fonts.AppleR,
        fontSize: 11,
        letterSpacing: -0.28,
        color: "#999999",
    },
    smallDivider: {
        height: 10,
        width: 1,
        backgroundColor: "#999999",
        marginHorizontal: 6.5,
        marginBottom: 2,
    },
    optionBox: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2.5,
    },
    refundTitle: {
        fontFamily: Fonts.AppleB,
        fontSize: 15,
        letterSpacing: -0.38,
        color: "#222222",
        marginBottom: 15,
    },
    refundInfoTitle: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.3,
        color: "#555555",
        marginBottom: 7,
    },
    refundInfoDesc: {
        fontFamily: Fonts.AppleB,
        fontSize: 12,
        marginBottom: 7,
        letterSpacing: -0.3,
        textAlign: "right",
        color: "#222222",
    },
    returnOptionBox: {
        height: 40,
        borderRadius: 5,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#dddddd",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    returnOption: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.38,
        color: "#999999",
    },
    openedReturnOptionBox: {
        width: "100%",
        backgroundColor: "white",
        position: "absolute",
        top: 88,
        left: 20,
        zIndex: 200,
        borderWidth: 1,
        borderColor: "#dddddd",
        borderTopWidth: 0,
        paddingTop: 7.5,
        paddingBottom: 12,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    returnOptions: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        paddingLeft: 10,
        zIndex: 10,
    },
    reasonTextInput: {
        height: 105,
        borderRadius: 5,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#dddddd",
        // paddingTop: 12,
        paddingLeft: 10,
        marginBottom: 20,
    },
    reasonTextForm: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.3,
        color: "#000000",
    },
    returnInfoView: {
        backgroundColor: "#f4f4f4",
        height: 7.5,
        width: "100%",
        zIndex: -5,
    },
    returnInfoWrap: {
        paddingTop: 15,
        paddingHorizontal: 20,
        marginBottom: 20,
        zIndex: -5,
    },
    buttonWrap: {
        width: "100%",
        height: 60,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontFamily: Fonts.AppleL,
        fontSize: 20,
        letterSpacing: -1,
        color: "#ffffff",
    },
});

class MyBuyRefund extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            returnRequest: "",
            isOpenedReturnOptionBox: false,
            selectedReturnOption: null,

            product: {}, // 요청할 상품
            sale_mth_cd: "", // 경매거래, 즉시거래, 공동거래, 예약거래
            order_no: "", // 주문서 번호
            detail: {}, // 주문서 상세
            refund_mn: {}, // 환불계좌 정보
            sts_cd: "", // 상품 상태 코드
        };
    }

    componentDidMount() {
        const {navigation} = this.props;
        const {order_no, sale_mth_cd, product} = navigation.state.params;

        this.setState({order_no: order_no, sale_mth_cd: sale_mth_cd, product: product})
        if (sale_mth_cd === CodeText.sale_mth_cd_a) // 경매거래
            this.getAucDetail();
        else if (sale_mth_cd === CodeText.sale_mth_cd_i) // 즉시거래
            this.getImmediDetail();
        else if (sale_mth_cd === CodeText.sale_mth_cd_g) // 공동거래
            this.getCoperDetail();
        else if (sale_mth_cd === CodeText.sale_mth_cd_r) // 예약거래
            this.getReservDetail();
    }

    getAucDetail = () => {
        const {navigation} = this.props;
        const {order_no} = navigation.state.params;
        this.props.getAucDetail({auc_trd_no: order_no}).then((res) => {
            let sts_cd = "";
            if(res.detail.dlvy && res.detail.dlvy.dlvy_sts_cd)
                sts_cd = res.detail.dlvy.dlvy_sts_cd;
            if(res.detail.rtngud && res.detail.rtngud.last_purchase_ord_rtngud_sts_cd)
                sts_cd = res.detail.rtngud.last_purchase_ord_rtngud_sts_cd;
            this.setState({
                isLoading: false,
                detail: res.detail,
                refund_mn: res.detail.refund_mn,
                sts_cd: sts_cd,
            })
        }).catch((err) => {
        });
    }
    getImmediDetail = () => {
        const {navigation} = this.props;
        const {order_no, product} = navigation.state.params;
        this.props.getImmediDetail({immedi_purchase_ord_no: order_no}).then((res) => {
            const product_list = res.detail.dtl.filter((item) => item.immedi_purchase_ord_dtl_no === product.immedi_purchase_ord_dtl_no)
            let productItem = {}
            if (product_list.length > 0)
                productItem = {
                    ...product_list[0],
                    order_cnt: product_list[0].goods_cnt,
                    payment_price: product_list[0].tot_ord_dtl_amt
                }

            this.setState({
                isLoading: false,
                detail: res.detail,
                refund_mn: res.detail.refund_mn,
                sts_cd: productItem.immedi_purchase_ord_dtl_sts_cd,
                product: productItem,
            })
        }).catch((err) => {
        });
    }
    getCoperDetail = () => {
        const {navigation} = this.props;
        const {order_no} = navigation.state.params;
        this.props.getCoperDetail({copertn_purchase_no: order_no}).then((res) => {
            let sts_cd = "";
            if(res.detail.dlvy && res.detail.dlvy.dlvy_sts_cd)
                sts_cd = res.detail.dlvy.dlvy_sts_cd;
            if(res.detail.rtngud && res.detail.rtngud.last_purchase_ord_rtngud_sts_cd)
                sts_cd = res.detail.rtngud.last_purchase_ord_rtngud_sts_cd;
            this.setState({
                isLoading: false,
                detail: res.detail,
                refund_mn: res.detail.refund_mn,
                sts_cd: sts_cd,
            })
        }).catch((err) => {
        });
    }
    getReservDetail = () => {
        const {navigation} = this.props;
        const {order_no} = navigation.state.params;
        this.props.getReservDetail({reserv_purchase_no: order_no}).then((res) => {
            let sts_cd = "";
            if(res.detail.dlvy && res.detail.dlvy.dlvy_sts_cd)
                sts_cd = res.detail.dlvy.dlvy_sts_cd;
            if(res.detail.rtngud && res.detail.rtngud.last_purchase_ord_rtngud_sts_cd)
                sts_cd = res.detail.rtngud.last_purchase_ord_rtngud_sts_cd;
            this.setState({
                isLoading: false,
                detail: res.detail,
                refund_mn: res.detail.refund_mn,
                sts_cd: sts_cd,
            })
        }).catch((err) => {
        });
    }

    handleCreateRefund = () => {
        const {sale_mth_cd} = this.state;
        if (sale_mth_cd === CodeText.sale_mth_cd_i) // 즉시거래
            this.handleImmediCreateRefund();
        else this.handleLastCreateRefund();
    }

    handleImmediCreateRefund = () => {
        const {navigation} = this.props;
        const {product, returnRequest, selectedReturnOption} = this.state;
        let params = {
            immedi_purchase_ord_dtl_no: product.immedi_purchase_ord_dtl_no,
            rtngud_resn: selectedReturnOption.title,
            rtngud_cnt: returnRequest,
        }

        this.props.immediCreateRefund(params).then((res) => {
            navigation.navigate("MyBuyRefundResult");
        }).catch((err) => {
        });
    }

    handleLastCreateRefund = () => {
        const {navigation} = this.props;
        const {detail, returnRequest, selectedReturnOption} = this.state;
        let params = {
            last_purchase_ord_no: detail.last_purchase.last_purchase_ord_no,
            rtngud_resn: selectedReturnOption.title,
            rtngud_cnt: returnRequest,
        }

        this.props.lastRefund(params).then((res) => {
            navigation.navigate("MyBuyRefundResult");
        }).catch((err) => {
        });
    }


    render() {
        const {navigation, eCOMM_CD} = this.props;
        const {
            returnRequest,
            isOpenedReturnOptionBox,
            selectedReturnOption,
            order_no,
            sale_mth_cd,
            detail,
            product,
            sts_cd,
            refund_mn,
            isLoading
        } = this.state;

        const typeTitle = sts_cd ? eCOMM_CD[`${sts_cd}`].cd_nm : "";
        const rtngud = sale_mth_cd === CodeText.sale_mth_cd_i ? product.rtngud_info || {} : detail.rtngud_info || {};
        let refund_info = `${eCOMM_CD[`${refund_mn?.bank_cmpny_cd}`]?.cd_nm || ""} ${maskingAccount(refund_mn.bank_accnt_no || "")}, ${refund_mn.dpstr_nm}`
        if (rtngud && rtngud.rtngud_complet_yn === "Y")
            refund_info = rtngud.refund_info;

        let total_price = 0;
        if (rtngud.refund_info)
            total_price = parseInt(rtngud.dlvy_cost_amt || 0) + parseInt(rtngud.pnt_amt || 0) + parseInt(rtngud.refund_target_amt || 0);

        if (isLoading)
            return null;
        else
            return (
                <View style={styles.container}>
                    <TopHeader
                        title={MyPageText.returnRequest}
                        navigation={navigation}
                        hasRightBtn={false}
                    />
                    <KeyboardAwareScrollView style={{flex: 1}} extraScrollHeight={30} enableOnAndroid>
                        <View style={styles.orderInfoBox}>
                            <Text style={styles.cancelDates}>
                                {dateUtil.formatKCT("point", detail.updt_dt || "")}
                            </Text>
                            <Text style={styles.orderNum}>
                                {`${MyBuyText.orderNo} ${order_no}`}
                            </Text>
                            <View style={styles.divider}/>
                        </View>

                        <View>
                            <View style={styles.product}>
                                <Image source={{uri: product.thumb_url}} style={styles.productImg}/>
                                <View style={{flex: 1}}>
                                    <View style={styles.betweenCenter}>
                                        <Text style={styles.cancelTitle}>
                                            {typeTitle}
                                        </Text>
                                    </View>
                                    <Text style={styles.price}>
                                        {`${formattedNumber(product.payment_price || 0)}${StoreText.won}`}
                                    </Text>
                                    <Text style={styles.title}>{product.goods_nm}</Text>

                                    <View style={styles.optionBox}>
                                        <Text style={styles.option}>
                                            {product.goods_optn_nm ? product.goods_optn_nm : ""}
                                        </Text>
                                        <View style={styles.smallDivider}/>
                                        <Text style={styles.option}>
                                            {`${StoreText.count}: ${product.order_cnt}`}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{backgroundColor: "#f4f4f4", height: 7.5, width: "100%"}}
                        />
                        <View style={{paddingTop: 15, paddingHorizontal: 20}}>
                            <Text style={styles.refundTitle}>{MyPageText.reasonForReturn}</Text>
                            <TouchableOpacity
                                style={[
                                    styles.returnOptionBox,
                                    {
                                        borderBottomLeftRadius: isOpenedReturnOptionBox ? 0 : 5,
                                        borderBottomRightRadius: isOpenedReturnOptionBox ? 0 : 5,
                                    },
                                ]}
                                onPress={() =>
                                    this.setState({
                                        isOpenedReturnOptionBox: !isOpenedReturnOptionBox,
                                    })
                                }
                            >
                                <Text
                                    style={[
                                        styles.returnOption,
                                        {color: selectedReturnOption ? "#000000" : "#999999"},
                                    ]}
                                >
                                    {selectedReturnOption
                                        ? selectedReturnOption.title
                                        : MyPageText.reasonForReturnDesc}
                                </Text>
                                <Image
                                    style={{width: 20, height: 20}}
                                    source={require("../../../../assets/image/store/dropdown_btn_regular.png")}
                                />
                            </TouchableOpacity>
                            {isOpenedReturnOptionBox ? (
                                <View style={styles.openedReturnOptionBox}>
                                    {returnOptions.map((returnOption) => {
                                        const isActive = selectedReturnOption
                                            ? selectedReturnOption.id === returnOption.id
                                            : false;
                                        return (
                                            <TouchableOpacity
                                                style={styles.returnOptions}
                                                onPress={() =>
                                                    this.setState({
                                                        selectedReturnOption: returnOption,
                                                        isOpenedReturnOptionBox: false,
                                                    })
                                                }
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        letterSpacing: -0.35,
                                                        marginRight: 7.5,
                                                        fontFamily: isActive ? Fonts.AppleB : Fonts.AppleR,
                                                        color: isActive ? Colors.MAIN_COLOR : "#000000",
                                                    }}
                                                >
                                                    {returnOption.title}
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
                            <TextInputStr
                                boxStyle={styles.reasonTextInput}
                                textForm={styles.reasonTextForm}
                                multiline={true}
                                placeholder={MyPageText.returnRequestPlaceholder}
                                placeholderTextColor="#999999"
                                value={returnRequest}
                                setValue={(str) => this.setState({returnRequest: str})}
                            />
                        </View>
                        <View style={styles.returnInfoView}/>
                        <View style={styles.returnInfoWrap}>
                            <Text style={styles.refundTitle}>{MyPageText.refundInfo}</Text>
                            <View style={styles.betweenCenter}>
                                <View>
                                    <Text style={styles.refundInfoTitle}>{MyPageText.refundInfo}</Text>
                                    {/*<Text style={styles.refundInfoTitle}>{MyPageText.discountPrice}</Text>*/}
                                    <Text style={styles.refundInfoTitle}>{MyPageText.deliveryFee}</Text>
                                    <Text style={styles.refundInfoTitle}>{MyPageText.refundPoint}</Text>
                                </View>
                                <View>
                                    <Text style={styles.refundInfoDesc}>
                                        {`${formattedNumber(total_price || 0)}${StoreText.won}`}
                                    </Text>
                                    {/*<Text style={styles.refundInfoDesc}>133,000원</Text>*/}
                                    <Text style={styles.refundInfoDesc}>
                                        {`(-) ${formattedNumber(rtngud.dlvy_cost_amt || 0)}${StoreText.won}`}
                                    </Text>
                                    <Text style={styles.refundInfoDesc}>
                                        {`${formattedNumber(rtngud.pnt_amt || 0)}P`}
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.betweenCenter, {marginTop: 13}]}>
                                <Text style={styles.refundTitle}>
                                    {MyPageText.expectedRefundAmount}
                                </Text>
                                <Text style={[styles.refundTitle, {color: Colors.MAIN_COLOR}]}>
                                    {`${formattedNumber(rtngud.refund_target_amt || 0)}${StoreText.won}`}
                                </Text>
                            </View>
                            <View style={styles.betweenCenter}>
                                <Text style={styles.refundInfoTitle}>
                                    {MyPageText.refundInfo}
                                </Text>
                                <Text style={styles.refundInfoDesc}>
                                    {refund_info}
                                </Text>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                    <TouchableOpacity
                        style={[styles.buttonWrap, {
                            backgroundColor: selectedReturnOption ? "#000000" : "#dddddd",
                        }]}
                        onPress={() => {
                            if (selectedReturnOption)
                                this.handleCreateRefund();
                        }}
                    >
                        <Text style={styles.buttonText}>
                            {MyPageText.returnRequest}
                        </Text>
                    </TouchableOpacity>
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
    getImmediDetail: (params) => dispatch(ActionImmedi.getDetail(params)),
    immediCreateRefund: (params) => dispatch(ActionImmedi.createRefund(params)),

    getAucDetail: (params) => dispatch(ActionAuc.getDetail(params)),
    getCoperDetail: (params) => dispatch(ActionCoper.getDetail(params)),
    getReservDetail: (params) => dispatch(ActionReserv.getDetail(params)),

    lastRefund: (params) => dispatch(ActionLast.createRefund(params)),
    lastRefundCanc: (params) => dispatch(ActionLast.createRefundCanc(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyBuyRefund);
