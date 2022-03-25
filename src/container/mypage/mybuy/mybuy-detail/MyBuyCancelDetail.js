// 결제취소 상세
import React, {Component} from "react";
import {
    ScrollView,
    View,
    Text,
    Image,
    StyleSheet,
} from "react-native";
import {connect} from "react-redux";

import {CodeText, MyBuyText, MyPageText, StoreText} from "../../../../model/lib/Utils/Strings";
import Fonts from "../../../../model/lib/Utils/Fonts";
import Colors from "../../../../model/lib/Utils/Colors";
import {formattedNumber} from "../../../../model/lib/Utils";

import {TopHeader} from "../../../../component/TopHeader";

import * as ActionImmedi from "../../../../model/action/eIMMEDI_PURCHASE";
import * as ActionAuc from "../../../../model/action/eAUC_TRD";
import * as ActionCoper from "../../../../model/action/eCOPERTN_PURCHASE";
import * as dateUtil from "../../../../model/lib/Utils/Date";

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
        color: "#dddddd",
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
});

class MyBuyCancelDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            product: {}, // 요청할 상품
            sale_mth_cd: "", // 경매거래, 즉시거래, 공동거래, 예약거래
            sts_cd: "", // 상품 상태 코드
            order_no: "", // 주문서 번호

            detail: {}, // 주문서 상세
            pay: {}, // 결제 정보
            rtngud: {}, // 환불 정보
            canc: {},
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
    }

    getAucDetail = () => {
        const {navigation} = this.props;
        const {order_no, status} = navigation.state.params;
        this.props.getAucDetail({auc_trd_no: order_no}).then((res) => {
            this.setState({
                isLoading: false,
                detail: res.detail,
                pay: {
                    ...res.detail.pay_dpst_auc_trd,
                    tot_ord_amt: res.detail.tot_bid_amt,
                    tot_pnt_amt: res.detail.tot_pnt_amt,
                    bid_dpst_amt: res.detail.bid_dpst_amt
                },
                rtngud: res.detail.rtngud_info,
                canc: {...res.detail.canc_info, canc: res.detail.canc}
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
            if (rtngud_info_list.length > 0) rtngud_info = rtngud_info_list[0]?.rtngud_info
            this.setState({
                isLoading: false,
                detail: res.detail,
                pay: {
                    ...res.detail.pay,
                    tot_ord_amt: res.detail.tot_ord_amt,
                    tot_pnt_amt: res.detail.tot_pnt_amt
                },
                rtngud: rtngud_info,
                canc: {...res.detail.canc_info, canc: res.detail.canc}
            })
        }).catch((err) => {
        });
    }
    getCoperDetail = () => {
        const {navigation} = this.props;
        const {order_no, status} = navigation.state.params;
        this.props.getCoperDetail({copertn_purchase_no: order_no}).then((res) => {
            this.setState({
                isLoading: false,
                detail: res.detail,
                pay: {
                    ...res.detail.pay_dpst_auc_trd,
                    tot_ord_amt: res.detail.tot_bid_amt,
                    tot_pnt_amt: res.detail.tot_pnt_amt,
                },
                rtngud: res.detail.rtngud_info,
                canc: {...res.detail.canc_info, canc: res.detail.canc}
            })
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
            detail,
            product,
            sts_cd,
            rtngud,
            canc,
            isLoading,
        } = this.state;
        const typeTitle = sts_cd ? eCOMM_CD[`${sts_cd}`].cd_nm : ""

        let total_price = parseInt(canc?.dlvy_cost_amt || 0) + parseInt(canc?.pnt_amt || 0) + parseInt(canc?.canc_target_amt || 0)

        if (isLoading)
            return null;
        else
            return (
                <View style={styles.container}>
                    <TopHeader
                        title={MyPageText.paymentCancelDetail}
                        navigation={navigation}
                        hasRightBtn={false}
                    />
                    <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                        <View style={styles.orderInfoBox}>
                            <Text style={styles.cancelDates}>
                                {dateUtil.formatKCT("point", detail.inst_dt || "")}
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
                        <View style={{backgroundColor: "#f4f4f4", height: 7.5, width: "100%"}}/>
                        <View style={{paddingTop: 15, paddingHorizontal: 20}}>
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
                                        {`(-) ${formattedNumber(canc.dlvy_cost_amt || 0)}${StoreText.won}`}
                                    </Text>
                                    <Text style={styles.refundInfoDesc}>
                                        {`${formattedNumber(canc.pnt_amt || 0)}P`}
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.betweenCenter, {marginTop: 13}]}>
                                <Text style={styles.refundTitle}>
                                    {MyPageText.expectedRefundAmount}
                                </Text>
                                <Text style={[styles.refundTitle, {color: Colors.MAIN_COLOR}]}>
                                    {`${formattedNumber(canc.canc_target_amt || 0)}${StoreText.won}`}
                                </Text>
                            </View>
                            <View style={styles.betweenCenter}>
                                <Text style={styles.refundInfoTitle}>
                                    {MyPageText.refundInfo}
                                </Text>
                                <Text style={styles.refundInfoDesc}>
                                    {canc.refund_info}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
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
    getAucDetail: (params) => dispatch(ActionAuc.getDetail(params)),
    getCoperDetail: (params) => dispatch(ActionCoper.getDetail(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyBuyCancelDetail);
