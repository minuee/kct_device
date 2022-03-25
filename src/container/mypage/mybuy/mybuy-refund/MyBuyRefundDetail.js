// 환불요청 상세
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


import {TopHeader} from "../../../../component/TopHeader";
import AlertModal from "../../../../component/modal/AlertModal";

import Fonts from "../../../../model/lib/Utils/Fonts";
import Colors from "../../../../model/lib/Utils/Colors";
import * as dateUtil from "../../../../model/lib/Utils/Date";
import {formattedNumber, maskingAccount} from "../../../../model/lib/Utils";
import {CodeText, Generic, MyBuyText, MyPageText, StoreText} from "../../../../model/lib/Utils/Strings";

import * as ActionImmedi from "../../../../model/action/eIMMEDI_PURCHASE";
import * as ActionAuc from "../../../../model/action/eAUC_TRD";
import * as ActionCoper from "../../../../model/action/eCOPERTN_PURCHASE";
import * as ActionLast from "../../../../model/action/eLAST_PURCHASE";
import * as ActionReserv from "../../../../model/action/eRESERV_PURCHASE";

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
        color: "#9a00ff",
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
    reasonForReturn: {
        fontFamily: Fonts.AppleR,
        fontSize: 15,
        letterSpacing: -0.38,
        color: "#000000",
        marginTop: 10,
    },
    reasonForReturnText: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        lineHeight: 20.5,
        letterSpacing: -0.33,
        color: "#000000",
        marginTop: 10,
        marginBottom: 18,
    },
    divideBorder: {
        backgroundColor: "#f4f4f4",
        height: 7.5,
        width: "100%",
    },
    refundInfoWrap: {
        paddingTop: 15,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    refundCancel: {
        width: "100%",
        height: 60,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
    },
    refundCancelText: {
        fontFamily: Fonts.AppleL,
        fontSize: 20,
        letterSpacing: -1,
        color: "#ffffff",
    },
});

class MyBuyRefundDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isShowAlertModal: false,

            product: {}, // 요청할 상품
            sale_mth_cd: "", // 경매거래, 즉시거래, 공동거래, 예약거래
            order_no: "", // 주문서 번호
            detail: {}, // 주문서 상세
            refund_mn: {}, // 환불계좌 정보
            sts_cd: "", // 상품 상태 코드
            pay: {}, // 결제 정보
            rtngud: {}, // 반품요청 시, pay 정보
        };
    }

    componentDidMount() {
        const {navigation} = this.props;
        const {order_no, sale_mth_cd, product, sts_cd} = navigation.state.params;

        this.setState({order_no: order_no, sale_mth_cd: sale_mth_cd, sts_cd: sts_cd, product: product})
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
                rtngud: res.detail.rtngud_info
            })
        }).catch((err) => {
        });
    }
    getImmediDetail = () => {
        const {navigation} = this.props;
        const {order_no, order_dtl_no} = navigation.state.params;
        this.props.getImmediDetail({immedi_purchase_ord_no: order_no}).then((res) => {
            let rtngud_info = {}
            let rtngud_info_list = res.detail.dtl.filter((item) => item.immedi_purchase_ord_dtl_no === order_dtl_no)
            if (rtngud_info_list.length > 0) {
                rtngud_info = rtngud_info_list[0]?.rtngud_info
                rtngud_info = {...rtngud_info, rtngud: rtngud_info_list[0]?.rtngud}
            }
            this.setState({
                isLoading: false,
                detail: res.detail,
                refund_mn: res.detail.refund_mn,
                // sts_cd: res.detail.immedi_purchase_ord_sts_cd,
                pay: {
                    ...res.detail.pay,
                    tot_ord_amt: res.detail.tot_ord_amt,
                    tot_pnt_amt: res.detail.tot_pnt_amt
                },
                rtngud: rtngud_info
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
                rtngud: res.detail.rtngud_info
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
                rtngud: res.detail.rtngud_info
            })
        }).catch((err) => {
        });
    }

    handleRefundCanc = () => {
        const {sale_mth_cd} = this.state;
        if (sale_mth_cd === CodeText.sale_mth_cd_i) // 즉시거래
            this.handleImmediRefundCanc();
        else this.handleLastRefundCanc(sale_mth_cd);
    }

    handleImmediRefundCanc = () => {
        const {navigation} = this.props;
        const {product} = this.state;
        let params = {
            immedi_purchase_ord_dtl_rtngud_no: product.rtngud.immedi_purchase_ord_dtl_rtngud_no,
        }

        this.props.immediRefundCanc(params).then((res) => {
            navigation.goBack()
        }).catch((err) => {
        });
    }
    handleLastRefundCanc = (sale_mth_cd) => {
        const {detail} = this.state;
        if (detail?.rtngud?.last_purchase_ord_rtngud_n) {
            let params = {
                last_purchase_ord_rtngud_no: detail.rtngud.last_purchase_ord_rtngud_no,
            }

            this.props.lastRefundCanc(params).then((res) => {
                this.setState({isShowAlertModal: false})
                if (sale_mth_cd === CodeText.sale_mth_cd_a) // 경매거래
                    this.getAucDetail();
                else if (sale_mth_cd === CodeText.sale_mth_cd_g) // 공동거래
                    this.getCoperDetail();
                else if (sale_mth_cd === CodeText.sale_mth_cd_r) // 예약거래
                    this.getReservDetail();
            }).catch((err) => {
            });
        }
    }

    render() {
        const {navigation, eCOMM_CD} = this.props;
        const {isLoading, isShowAlertModal, detail, order_no, sts_cd, product, rtngud, refund_mn, sale_mth_cd} = this.state;
        const typeTitle = sts_cd ? eCOMM_CD[`${sts_cd}`].cd_nm : "";

        let total_price = parseInt(rtngud.dlvy_cost_amt || 0) + parseInt(rtngud.pnt_amt || 0) + parseInt(rtngud.refund_target_amt || 0)
        const isAvailable = sts_cd === CodeText.refund_cd_submit || sts_cd === CodeText.refund_cd_submit_l;
        let refund_info = `${eCOMM_CD[`${refund_mn?.bank_cmpny_cd}`]?.cd_nm || ""} ${maskingAccount(refund_mn.bank_accnt_no || "")}, ${refund_mn.dpstr_nm}`
        if (rtngud.rtngud_complet_yn === "Y")
            refund_info = ""

        if (isLoading)
            return null;
        else
            return (
                <View style={styles.container}>
                    <TopHeader
                        title={MyPageText.returnRequestDetail}
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
                        <View style={styles.divideBorder}/>
                        <View style={{paddingTop: 15, paddingHorizontal: 20}}>
                            <Text style={styles.refundTitle}>{MyPageText.reasonForReturn}</Text>
                            <Text style={styles.reasonForReturn}>
                                {sale_mth_cd === CodeText.sale_mth_cd_i && product?.rtngud ? `${product.rtngud.rtngud_resn || ""}` : ""}
                                {sale_mth_cd !== CodeText.sale_mth_cd_i && detail?.rtngud ? `${detail.rtngud.rtngud_resn || ""}` : ""}
                            </Text>
                            <Text style={styles.reasonForReturnText}>
                                {sale_mth_cd === CodeText.sale_mth_cd_i && product?.rtngud ? `${product.rtngud.rtngud_cnt || ""}` : ""}
                                {sale_mth_cd !== CodeText.sale_mth_cd_i && detail?.rtngud ? `${detail.rtngud.rtngud_cnt || ""}` : ""}
                            </Text>
                        </View>
                        <View style={styles.divideBorder}/>
                        <View style={styles.refundInfoWrap}>
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
                                <Text style={styles.refundInfoDesc}>{refund_info}</Text>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                    <TouchableOpacity
                        style={[styles.refundCancel, isAvailable ? null : {
                            borderColor: "#dddddd",
                            backgroundColor: "#eeeeee"
                        }]}
                        onPress={() =>
                            isAvailable ? this.setState({isShowAlertModal: true}) : null
                        }
                    >
                        <Text style={styles.refundCancelText}>
                            {isAvailable ? MyPageText.withdrawalOfRequest : typeTitle}
                        </Text>
                    </TouchableOpacity>
                    <AlertModal
                        isShowAlertModal={isShowAlertModal}
                        message={MyPageText.returnRequestModalTitle}
                        subtitle={MyPageText.returnRequestModalMessage}
                        leftText={Generic.no}
                        rightText={MyPageText.returnRequestModalBtn}
                        setVisible={() => this.setState({isShowAlertModal: false})}
                        navigation={navigation}
                        leftOnPress={() => this.setState({isShowAlertModal: false})}
                        rightOnPress={() => this.handleRefundCanc()}
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
    getImmediDetail: (params) => dispatch(ActionImmedi.getDetail(params)),
    immediRefundCanc: (params) => dispatch(ActionImmedi.createRefundCanc(params)),
    lastRefundCanc: (params) => dispatch(ActionLast.createRefundCanc(params)),


    getAucDetail: (params) => dispatch(ActionAuc.getDetail(params)),
    getCoperDetail: (params) => dispatch(ActionCoper.getDetail(params)),
    getReservDetail: (params) => dispatch(ActionReserv.getDetail(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyBuyRefundDetail);
