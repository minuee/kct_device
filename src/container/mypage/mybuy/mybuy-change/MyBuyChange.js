// 결제취소 상세
import React, {Component} from "react";
import {
    ScrollView,
    View,
    Text,
    Image,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableOpacity,
} from "react-native";
import {connect} from "react-redux";

import Fonts from "../../../../model/lib/Utils/Fonts";
import * as dateUtil from "../../../../model/lib/Utils/Date";
import {formattedNumber, ORD_EXCHNG} from "../../../../model/lib/Utils";
import {CodeText, Generic, MyBuyText, MyPageText, StoreText} from "../../../../model/lib/Utils/Strings";

import {TopHeader} from "../../../../component/TopHeader";
import AlertModal from "../../../../component/modal/AlertModal";
import TextInputStr from "../../../../common/textinput/TextInput";

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
    exchangeRequest: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        letterSpacing: -0.33,
        color: "#000000",
    },
    exchangeRequestTextBox: {
        height: 105,
        borderRadius: 5,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#dddddd",
        // paddingTop: 12,
        paddingLeft: 10,
    },
    exchangeRequestTextForm: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.3,
        color: "#000000",
    },
    exchangeRequestBtn: {
        width: "100%",
        height: 60,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
    },
    exchangeRequestBtnText: {
        fontFamily: Fonts.AppleL,
        fontSize: 20,
        letterSpacing: -1,
        color: "#ffffff",
    },
});

class MyBuyChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isShowAlertModal: false,
            exchangeRequest: "",
            isRequested: false,
            exchng: {},

            product: {}, // 요청할 상품
            sale_mth_cd: "", // 경매거래, 즉시거래, 공동거래, 예약거래
            order_no: "", // 주문서 번호
            detail: {}, // 주문서 상세
            sts_cd: "", // 상품 상태 코드
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
        const {order_no, status} = navigation.state.params;
        this.props.getAucDetail({auc_trd_no: order_no}).then((res) => {
            let sts_cd = "";
            if(res.detail.dlvy && res.detail.dlvy.dlvy_sts_cd)
                sts_cd = res.detail.dlvy.dlvy_sts_cd;
            if(res.detail.exchng && res.detail.exchng.last_purchase_ord_exchng_sts_cd)
                sts_cd = res.detail.exchng.last_purchase_ord_exchng_sts_cd;
            const isRequested = !res.detail?.exchng || !!res.detail?.exchng.last_purchase_ord_exchng_no;
            this.setState({
                isLoading: false,
                detail: res.detail,
                isRequested: isRequested,
                refund_mn: res.detail.refund_mn,
                sts_cd: sts_cd,
                exchangeRequest: res.detail?.exchng ? res.detail.exchng.exchng_resn || "" : "",
                pay_sts_code: res.detail.pay_sts_code
            })
        }).catch((err) => {
        });
    }
    getImmediDetail = () => {
        const {navigation} = this.props;
        const {order_no, product} = navigation.state.params;
        this.props.getImmediDetail({immedi_purchase_ord_no: order_no}).then((res) => {
            // immedi_purchase_ord_dtl_exchng_no
            const product_list = res.detail.dtl.filter((item) => item.immedi_purchase_ord_dtl_no === product.immedi_purchase_ord_dtl_no)
            let productItem = {}
            if (product_list.length > 0) {
                productItem = {
                    ...product_list[0],
                    order_cnt: product_list[0].goods_cnt,
                    payment_price: product_list[0].tot_ord_dtl_amt
                }
            }

            const isRequested = !productItem?.exchng || !!productItem?.exchng.immedi_purchase_ord_dtl_exchng_no;
            let sts_cd = productItem.dlvy.dlvy_sts_cd;
            if(productItem.exchng && productItem.exchng.immedi_purchase_ord_dtl_exchng_sts_cd)
                sts_cd = productItem.exchng.immedi_purchase_ord_dtl_exchng_sts_cd;

            this.setState({
                isLoading: false,
                detail: res.detail,
                isRequested: isRequested,
                refund_mn: res.detail.refund_mn,
                sts_cd: sts_cd,
                product: productItem,
                exchangeRequest: productItem?.exchng ? productItem.exchng.exchng_resn || "" : "",
                pay_sts_code: res.detail.pay_sts_code
            })
        }).catch((err) => {
        });
    }
    getCoperDetail = () => {
        const {navigation} = this.props;
        const {order_no, status} = navigation.state.params;
        this.props.getCoperDetail({copertn_purchase_no: order_no}).then((res) => {

            let sts_cd = "";
            if(res.detail.dlvy && res.detail.dlvy.dlvy_sts_cd)
                sts_cd = res.detail.dlvy.dlvy_sts_cd;
            if(res.detail.exchng && res.detail.exchng.last_purchase_ord_exchng_sts_cd)
                sts_cd = res.detail.exchng.last_purchase_ord_exchng_sts_cd;
            const isRequested = !res.detail?.exchng || !!res.detail?.exchng.last_purchase_ord_exchng_no;
            this.setState({
                isLoading: false,
                detail: res.detail,
                isRequested: isRequested,
                refund_mn: res.detail.refund_mn,
                sts_cd: sts_cd,
                exchangeRequest: res.detail?.exchng ? res.detail.exchng.exchng_resn || "" : "",
                pay_sts_code: res.detail.pay_sts_code
            })
        }).catch((err) => {
        });
    }
    getReservDetail = () => {
        const {navigation} = this.props;
        const {order_no, status} = navigation.state.params;
        this.props.getReservDetail({reserv_purchase_no: order_no}).then((res) => {

            let sts_cd = "";
            if(res.detail.dlvy && res.detail.dlvy.dlvy_sts_cd)
                sts_cd = res.detail.dlvy.dlvy_sts_cd;
            if(res.detail.exchng && res.detail.exchng.last_purchase_ord_exchng_sts_cd)
                sts_cd = res.detail.exchng.last_purchase_ord_exchng_sts_cd;
            const isRequested = !res.detail?.exchng || !!res.detail?.exchng.last_purchase_ord_exchng_no;
            this.setState({
                isLoading: false,
                detail: res.detail,
                isRequested: isRequested,
                refund_mn: res.detail.refund_mn,
                sts_cd: sts_cd,
                exchangeRequest: res.detail?.exchng ? res.detail.exchng.exchng_resn || "" : "",
                pay_sts_code: res.detail.pay_sts_code
            })
        }).catch((err) => {
        });
    }

    // 교환 신청
    handleCreateExchng = () => {
        const {sale_mth_cd} = this.state;
        if (sale_mth_cd === CodeText.sale_mth_cd_i) // 즉시거래
            this.handleImmediCreateExchng();
        else this.handleLastCreateExchng(sale_mth_cd);
    }
    handleImmediCreateExchng = () => {
        const {product, exchangeRequest} = this.state;
        let params = {
            immedi_purchase_ord_dtl_no: product.immedi_purchase_ord_dtl_no,
            exchng_resn: exchangeRequest
        }

        this.props.immediCreateExchng(params).then((res) => {
            this.getImmediDetail();
        }).catch((err) => {
        });
    }
    handleLastCreateExchng = (sale_mth_cd) => {
        const {detail, exchangeRequest} = this.state;
        let params = {
            last_purchase_ord_no: detail?.last_purchase.last_purchase_ord_no,
            exchng_resn: exchangeRequest
        }
        this.props.lastExchng(params).then((res) => {
            if (sale_mth_cd === CodeText.sale_mth_cd_a) // 경매거래
                this.getAucDetail();
            else if (sale_mth_cd === CodeText.sale_mth_cd_g) // 공동거래
                this.getCoperDetail();
            else if (sale_mth_cd === CodeText.sale_mth_cd_r) // 예약거래
                this.getReservDetail();
        }).catch((err) => {
        });
    }

    handleExchngCanc = () => {
        const {sale_mth_cd} = this.state;
        if (sale_mth_cd === CodeText.sale_mth_cd_i) // 즉시거래
            this.handleImmediExchngCanc();
        else this.handleLastExchngCanc(sale_mth_cd);
    }
    handleImmediExchngCanc = () => {
        const {product} = this.state;

        let params = {
            immedi_purchase_ord_dtl_exchng_no: product.exchng.immedi_purchase_ord_dtl_exchng_no,
        }
        console.log("params")
        console.log(params)

        this.props.immediExchngCanc(params).then((res) => {
            this.getImmediDetail();
            this.setState({isShowAlertModal: false})
        }).catch((err) => {
        });
    }
    handleLastExchngCanc = (sale_mth_cd) => {
        const {detail} = this.state;
        let params = {
            last_purchase_ord_exchng_no: detail.exchng.last_purchase_ord_exchng_no,
        }

        this.props.lastExchngCanc(params).then((res) => {
            if (sale_mth_cd === CodeText.sale_mth_cd_a) // 경매거래
                this.getAucDetail();
            else if (sale_mth_cd === CodeText.sale_mth_cd_g) // 공동거래
                this.getCoperDetail();
            else if (sale_mth_cd === CodeText.sale_mth_cd_r) // 예약거래
                this.getReservDetail();
            this.setState({isShowAlertModal: false})
        }).catch((err) => {
        });
    }

    render() {
        const {navigation, eCOMM_CD} = this.props;
        const {isLoading, isShowAlertModal, exchangeRequest, isRequested, order_no, detail, sts_cd, product, pay_sts_code} = this.state;

        const typeTitle = sts_cd ? eCOMM_CD[`${sts_cd}`].cd_nm : "";
        const isDelivery = sts_cd === CodeText.dlvy_sts_cd_s; // 배송완료 상태인지 확인
        const isCancel = sts_cd === CodeText.exchng_cd_c; // 교환요청 철회 상태인지 확인

        if (isLoading)
            return null;
        else
            return (
                <View style={styles.container}>
                    <TopHeader
                        title={MyPageText.exchangeRequest}
                        navigation={navigation}
                        hasRightBtn={false}
                    />
                    <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                        <KeyboardAvoidingView
                            behavior="position"
                            keyboardVerticalOffset={100}
                        >
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
                                            <Text
                                                style={[
                                                    styles.cancelTitle,
                                                    {color: isRequested ? "#9a00ff" : "#999999"},
                                                ]}
                                            >
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
                                <Text style={styles.refundTitle}>
                                    {MyPageText.exchangeRequestTitle}
                                </Text>
                                {!isDelivery && isRequested ? (
                                    <Text style={styles.exchangeRequest}>{exchangeRequest}</Text>
                                ) : (
                                    <TextInputStr
                                        boxStyle={styles.exchangeRequestTextBox}
                                        textForm={styles.exchangeRequestTextForm}
                                        placeholder={MyPageText.exchangeRequestPlaceholder}
                                        placeholderTextColor="#999999"
                                        value={exchangeRequest}
                                        setValue={(str) => this.setState({exchangeRequest: str})}
                                    />
                                )}
                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                    <TouchableOpacity // "#000000" : "#dddddd"
                        style={[styles.exchangeRequestBtn, {
                            backgroundColor: pay_sts_code === ORD_EXCHNG[1] ? "#dddddd" : isDelivery && !isRequested ? "#000000"
                                : isRequested && !isCancel ? "#000000" : "#dddddd"
                        }]}
                        onPress={() => {
                            if(pay_sts_code !== ORD_EXCHNG[1]) {
                                if(isDelivery && !isRequested) {
                                    if(exchangeRequest !== "")
                                        this.handleCreateExchng();
                                } else if(isRequested && !isCancel) {
                                    this.setState({isShowAlertModal: true});
                                } else console.log("onPress ~~~~~~~~~~~~~~~~~~~~~~")
                            }
                        }}
                    >
                        <Text style={styles.exchangeRequestBtnText}>
                            {pay_sts_code === ORD_EXCHNG[1] ? MyPageText.notWithdrawalOfRequest :
                                isDelivery && !isRequested ? MyPageText.exchangeRequest
                                    : isRequested && !isCancel ? MyPageText.withdrawalOfRequest : MyPageText.notWithdrawalOfRequest
                            }
                            {/*{isDelivery && !isRequested ? MyPageText.exchangeRequest*/}
                            {/*: isRequested && !isCancel ? MyPageText.withdrawalOfRequest : MyPageText.notWithdrawalOfRequest}*/}
                        </Text>
                    </TouchableOpacity>
                    <AlertModal // 요청 철회 message
                        isShowAlertModal={isShowAlertModal}
                        message={MyPageText.returnRequestModalTitle}
                        subtitle={MyPageText.returnRequestModalMessage}
                        leftText={Generic.no}
                        rightText={MyPageText.returnRequestModalBtn}
                        setVisible={() => this.setState({isShowAlertModal: false})}
                        navigation={navigation}
                        leftOnPress={() => this.setState({isShowAlertModal: false})}
                        rightOnPress={() => this.handleExchngCanc()}
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
    immediCreateExchng: (params) => dispatch(ActionImmedi.createExchng(params)),
    immediExchngCanc: (params) => dispatch(ActionImmedi.createExchngCanc(params)),

    getAucDetail: (params) => dispatch(ActionAuc.getDetail(params)),
    getCoperDetail: (params) => dispatch(ActionCoper.getDetail(params)),
    getReservDetail: (params) => dispatch(ActionReserv.getDetail(params)),

    lastExchng: (params) => dispatch(ActionLast.createExchng(params)),
    lastExchngCanc: (params) => dispatch(ActionLast.createExchngCanc(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyBuyChange);
