// 나의 구매내역 상세
import React, {Component} from "react";
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
} from "react-native";
import {connect} from "react-redux";

import {
    CodeText,
    Generic,
    MyBuyText,
    MyPageText,
    PaymentText,
    StoreText,
    TicketText
} from "../../../../model/lib/Utils/Strings";

import {TopHeader} from "../../../../component/TopHeader";
import AlertModal from "../../../../component/modal/AlertModal";
import MessageModal from "../../../../component/modal/MessageModal";

import Fonts from "../../../../model/lib/Utils/Fonts";
import Colors from "../../../../model/lib/Utils/Colors";
import {
    cancel_cd, confirm_cd, dlvy_cd, exchng_cd, feed_cd,
    formattedNumber,
    maskingAddress,
    maskingEmail,
    maskingPhone, ORD_DCSN, ORD_EXCHNG, ORD_RTNGUD,
    refund_cd, wait_cd
} from "../../../../model/lib/Utils";
import * as dateUtil from "../../../../model/lib/Utils/Date";

import * as ActionImmedi from "../../../../model/action/eIMMEDI_PURCHASE";
import * as ActionAuc from "../../../../model/action/eAUC_TRD";
import * as ActionCoper from "../../../../model/action/eCOPERTN_PURCHASE";
import * as ActionLast from "../../../../model/action/eLAST_PURCHASE";
import * as ActionReserv from "../../../../model/action/eRESERV_PURCHASE";
import {DEVICE_WIDTH} from "../../../../model/lib/Utils/Constants";
import {formatKCT} from "../../../../model/lib/Utils/Date";
import moment from "moment";

const productList = [
    {
        title: "아이폰 SE2",
        option: "퍼시픽 블루 / 128 GB",
        count: 1,
        price: "1,173,000",
        type: 1,
        createdAt: "3일 14:57:23",
        image_url: require("../../../../assets/image/temp1.png"),
    },
    {
        title: "아이폰 SE2",
        option: "퍼시픽 블루 / 128 GB",
        count: 1,
        price: "1,173,000",
        type: 2,
        createdAt: "3일 14:57:23",
        image_url: require("../../../../assets/image/temp1.png"),
    },
    {
        title: "아이폰 SE2",
        option: "퍼시픽 블루 / 128 GB",
        count: 1,
        price: "1,173,000",
        type: 3,
        createdAt: "3일 14:57:23",
        image_url: require("../../../../assets/image/temp1.png"),
    },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
    },
    betweenCenter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    infoBox: {
        height: 50,
    },
    infoTitle: {
        fontFamily: Fonts.AppleM,
        fontSize: 13,
        letterSpacing: -0.33,
        color: "#999999",
        textAlign: "left",
        marginBottom: 10,
    },
    info: {
        fontFamily: Fonts.AppleM,
        marginBottom: 10,
        fontSize: 13,
        letterSpacing: -0.33,
        color: "#000000",
        textAlign: "right",
    },
    totalPrice: {
        fontFamily: Fonts.AppleB,
        letterSpacing: -0.35,
        textAlign: "right",
        color: "#000000",
    },
    ticket: {
        flex: 1,
        height: (DEVICE_WIDTH - 40) * 0.32,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 12.5,
        marginBottom: 25,
    },
    productImg: {
        aspectRatio: 1,
        marginRight: 12.5,
        borderRadius: 100,
        width: "25%"
    },
    title: {
        fontFamily: Fonts.AppleB,
        fontSize: 16,
        letterSpacing: -0.4,
        color: "#2a2e34",
    },
    option: {
        fontFamily: Fonts.AppleL,
        fontSize: 12,
        letterSpacing: -0.6,
        color: "#969696",
        marginTop: 10,
    },
    expDates: {
        fontFamily: Fonts.AppleL,
        fontSize: 12,
        letterSpacing: -0.6,
        textAlign: "left",
        color: "#969696",
        marginTop: 3,
    },
    label: {
        position: "absolute",
        top: 0,
        left: 0,
        borderRadius: 2.5,
        backgroundColor: Colors.MAIN_COLOR,
        paddingVertical: 2,
        paddingHorizontal: 6,
        zIndex: 5,
    },
    labelText: {
        fontFamily: Fonts.AppleB,
        fontSize: 12,
        letterSpacing: -0.6,
        color: "#ffffff",
    },
    activeOptionBtn: {
        width: "23%",
        height: 35,
        backgroundColor: "#000000",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    inactiveOptionBtn: {
        width: "23%",
        height: 35,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#dddddd",
        justifyContent: "center",
        alignItems: "center",
    },
    activeOptionText: {
        fontFamily: Fonts.AppleB,
        fontSize: 13,
        letterSpacing: -0.33,
        textAlign: "center",
        color: "#ffffff",
    },
    inactiveOptionText: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        letterSpacing: -0.33,
        textAlign: "center",
        color: "#555555",
    },
    completeInfoBox: {
        paddingTop: 21,
        paddingHorizontal: 20,
        backgroundColor: "white",
        marginBottom: 10,
    },
    completeInfoBoxText: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.3,
        color: "#999999",
    },
    completeInfoBoxOrderText: {
        fontFamily: Fonts.AppleB,
        letterSpacing: -0.35,
        color: "#222222",
        marginTop: 4,
    },
    completeInfoBoxInfo: {
        height: 1,
        backgroundColor: "#dddddd",
        marginTop: 17.4,
        marginBottom: 15.6,
    },
    completeInfoBoxCheck: {
        fontFamily: Fonts.AppleB,
        fontSize: 12,
        letterSpacing: -0.3,
        color: "#000000",
        marginBottom: 9.2,
        marginTop: 2,
    },
    completeInfoBoxCheckSub: {
        fontFamily: Fonts.AppleR,
        fontSize: 11,
        letterSpacing: -0.28,
        color: "#999999",
    },
    productInfo: {
        flexDirection: "row",
        paddingTop: 16.5,
        alignItems: "center",
        paddingHorizontal: 20,
    },
    productInfoImg: {
        width: 90,
        height: 90,
        borderRadius: 5,
        borderWidth: 0.3,
        borderColor: "#e1e1e1",
        marginRight: 15,
    },
    productInfoText: {
        fontFamily: Fonts.AppleM,
        fontSize: 13,
        letterSpacing: -0.33,
        marginRight: 7.5,
    },
    productInfoMore: {
        fontFamily: Fonts.AppleM,
        fontSize: 13,
        letterSpacing: -0.33,
        color: "#000000",
        textDecorationLine: "underline",
    },
    productInfoPrice: {
        fontFamily: Fonts.AppleB,
        fontSize: 17,
        letterSpacing: -0.43,
        color: "#222222",
        marginTop: 10,
    },
    productInfoNm: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        letterSpacing: -0.33,
        color: "#000000",
        marginTop: 5,
    },
    productInfoOptn: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2.5,
    },
    productInfoOptnText: {
        fontFamily: Fonts.AppleR,
        fontSize: 11,
        letterSpacing: -0.28,
        color: "#999999",
    },
    productInfoCnt: {
        height: 10,
        width: 1,
        backgroundColor: "#999999",
        marginHorizontal: 6.5,
        marginBottom: 2,
    },
    productCancel: {
        height: 35,
        borderRadius: 5,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 20,
        marginBottom: 18.2,
    },
    productCancelText: {
        fontSize: 13,
        letterSpacing: -0.33,
        textAlign: "center",
    },
});

const InfoBox = ({title, isOpened, onPress, openedComp}) => {
    return (
        <View
            style={{
                flex: 1,
                marginBottom: 10,
                paddingHorizontal: 20,
                backgroundColor: "white",
            }}
        >
            <TouchableOpacity
                style={[styles.betweenCenter, styles.infoBox]}
                onPress={onPress}
            >
                <Text
                    style={{
                        fontFamily: Fonts.AppleB,
                        fontSize: 15,
                        letterSpacing: -0.38,
                        color: "#222222",
                    }}
                >
                    {title}
                </Text>
                <Image
                    style={{width: 20, height: 20}}
                    source={require("../../../../assets/image/mypage/dropdown_btn_regular.png")}
                />
            </TouchableOpacity>
            {isOpened && openedComp}
        </View>
    );
};

class MyBuyProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isOrderCancel: true,
            isComplete: false,
            currentPurchaseTabIdx: 0,
            purchaseStatusIdx: 0,
            isShowMessageModal: false, // 교환/환불 요청 가능여부
            isShowAlertModal: false, // 요청 철회 alert
            isShowConfirmModal: false, // 구매확정 alert
            isCancel: true,
            isTicket: false,
            isTicketInfoBoxOpened: false,
            isOrdererInfoBoxOpened: false,
            isPaymentInfoBoxOpened: false,
            isShippingInfoBoxOpened: false,

            pay_sts_code: "", // 현재 상태
            product: {}, // 선택한 상품

            sale_mth_cd: "",
            order_no: "", // 주문서 번호
            order_dtl_no: "", // N개 주문 시, 특정 주문 번호
            detail: {}, // 주문서 상세
            refund_mn: {}, // 환불계좌 정보
            mber: {}, // 거래자 정보
            goods: [], // 상품 정보
            sts_cd: "", // > 경매거래, 즉시거래, 공동거래, 예약거래 코드
            dlvy: {}, // 배송지 정보
            pay_info: {}, // 결제 정보 값
            last_purchase: {}, // 경매, 공동, 예약
        };
    }

    componentDidMount() {
        const {navigation} = this.props;
        const {order_no, sale_mth_cd, order_dtl_no} = navigation.state.params;
        this.setState({order_no: order_no, sale_mth_cd: sale_mth_cd, order_dtl_no: order_dtl_no})
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            if (sale_mth_cd === CodeText.sale_mth_cd_a) // 경매거래
                this.getAucDetail();
            else if (sale_mth_cd === CodeText.sale_mth_cd_i) // 즉시거래
                this.getImmediDetail();
            else if (sale_mth_cd === CodeText.sale_mth_cd_g) // 공동거래
                this.getCoperDetail();
            else if (sale_mth_cd === CodeText.sale_mth_cd_r) // 예약거래
                this.getReservDetail();
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    getAucDetail = () => {
        const {navigation} = this.props;
        const {order_no, status} = navigation.state.params;
        console.log(order_no)

        this.props.getAucDetail({auc_trd_no: order_no}).then((res) => {
            this.setState({
                pay_sts_code: res.detail.pay_sts_code || "",
                isLoading: false,
                detail: res.detail,
                refund_mn: res.detail.refund_mn,
                mber: res.detail.mber,
                goods: [{
                    ...res.detail.goods,
                    thumb_url: res.detail.thumb_url,
                    payment_price: res.detail.tot_auc_trd_amt,
                    order_cnt: res.detail.bid_cnt,
                    dlvy: res.detail.dlvy,
                    pay_sts_code: res.detail.pay_sts_code || "",
                }],
                sts_cd: res.detail.auc_trd_sts_cd,
                isComplete: status !== 1,
                dlvy: res.detail.dlvy,
                pay_info: {
                    ...res.detail.pay_info,
                    tot_dlvy_cost_amt: res.detail.pay_info.dlvy_cost_amt, // 배송비 : 즉시랑 통일
                    tot_pay_amt: res.detail.pay_info.tot_auc_trd_amt, // 총 결제금액
                },
                last_purchase: res.detail.last_purchase
            })
        }).catch((err) => {
        });
    }
    getImmediDetail = () => {
        const {navigation} = this.props;
        const {order_no} = navigation.state.params;

        this.props.getImmediDetail({immedi_purchase_ord_no: order_no}).then((res) => {
            let delivery_data = {}
            let isOrderCancel = true;
            let newGoods = res.detail.dtl.map((item) => {
                if(item.immedi_purchase_ord_dtl_sts_cd !== CodeText.ord_dtl_sts_cd_p)
                    isOrderCancel = false;
                if (!delivery_data?.dlvy_no && item.dlvy?.dlvy_no) delivery_data = item.dlvy
                return {...item, order_cnt: item.goods_cnt, payment_price: item.tot_ord_dtl_amt, pay_sts_code: item.pay_dtl_sts_code || ""}
            })
            this.setState({
                pay_sts_code: res.detail.pay_sts_code || "",
                isLoading: false,
                isOrderCancel: isOrderCancel,
                detail: res.detail,
                refund_mn: res.detail.refund_mn,
                mber: res.detail.mber,
                goods: newGoods,
                sts_cd: res.detail.immedi_purchase_ord_sts_cd,
                isComplete: true,
                dlvy: delivery_data,
                pay_info: {
                    ...res.detail.pay_info,
                    tot_pay_amt: res.detail.pay_info.tot_pay_target_amt, // 총 결제금액
                    tot_ord_amt: res.detail.tot_ord_amt // 상품가
                }
            })
        }).catch((err) => {
        });
    }
    getCoperDetail = () => {
        const {navigation} = this.props;
        const {order_no, status} = navigation.state.params;

        this.props.getCoperDetail({copertn_purchase_no: order_no}).then((res) => {
            this.setState({
                pay_sts_code: res.detail.pay_sts_code || "",
                isLoading: false,
                detail: res.detail,
                refund_mn: res.detail.refund_mn,
                mber: res.detail.mber,
                goods: [{
                    ...res.detail.goods,
                    thumb_url: res.detail.thumb_url,
                    payment_price: res.detail.purchase_prc,
                    order_cnt: res.detail.purchase_cnt,
                    dlvy: res.detail.dlvy,
                    pay_sts_code: res.detail.pay_sts_code || "",
                }],
                sts_cd: res.detail.copertn_purchase_sts_cd,
                isComplete: status !== 1,
                dlvy: res.detail.dlvy,
                pay_info: {
                    ...res.detail.pay_info,
                    tot_ord_amt: res.detail.tot_purchase_amt, // 상품가 (수량 계산 포함)
                    tot_dlvy_cost_amt: res.detail.pay_info.dlvy_cost_amt, // 배송비 : 즉시랑 통일
                    tot_pay_amt: res.detail.pay_info.tot_copertn_purchase_amt, // 총 결제금액
                },
                last_purchase: res.detail.last_purchase
            })
        }).catch((err) => {
        });

    }
    getReservDetail = () => {
        const {navigation} = this.props;
        const {order_no, status} = navigation.state.params;

        this.props.getReservDetail({reserv_purchase_no: order_no}).then((res) => {
            this.setState({
                pay_sts_code: res.detail.pay_sts_code || "",
                isLoading: false,
                isTicket: true,
                detail: res.detail,
                refund_mn: res.detail.refund_mn,
                mber: res.detail.mber,
                goods: [{
                    ...res.detail.goods,
                    thumb_url: res.detail.thumb_url,
                    payment_price: res.detail.purchase_prc,
                    goods_optn_nm: res.detail.goods_optn_nm,
                    order_cnt: res.detail.purchase_cnt,
                    dlvy: res.detail.dlvy,
                    pay_sts_code: res.detail.pay_sts_code || "",
                }],
                sts_cd: res.detail.reserv_purchase_sts_cd,
                isComplete: status !== 1,
                dlvy: res.detail.dlvy,
                pay_info: {
                    ...res.detail.pay_info,
                    tot_ord_amt: res.detail.tot_purchase_amt, // 상품가 (수량 계산 포함)
                    tot_dlvy_cost_amt: res.detail.pay_info.dlvy_cost_amt, // 배송비 : 즉시랑 통일
                    tot_pay_amt: res.detail.pay_info.tot_reserv_purchase_amt, // 총 결제금액
                },
                last_purchase: res.detail.last_purchase
            })
        }).catch((err) => {
        });
    }

    // 결제 취소 요청
    handleCanc = () => {
        const {sale_mth_cd} = this.state;
        if (sale_mth_cd === CodeText.sale_mth_cd_a) // 경매거래
            console.log("")
        else if (sale_mth_cd === CodeText.sale_mth_cd_i) // 즉시거래
            this.handleImmediCanc();
        else if (sale_mth_cd === CodeText.sale_mth_cd_g) // 공동거래
            console.log("")
    }
    handleImmediCanc = () => {
        const {order_no} = this.state;
        let params = {
            immedi_purchase_ord_no: order_no
        }
        console.log("params")
        console.log(params)
        this.props.immediCanc(params).then((res) => {
            this.getImmediDetail()
            this.setState({isShowConfirmModal: false})
        }).catch((err) => {
        });
    }
    // 반품/교환 요청 구분
    handleRequest = () => {
        const {detail, product, sale_mth_cd, sts_cd, pay_sts_code} = this.state;

        let product_type = ""; // 상품 상태 코드
        if (sale_mth_cd === CodeText.sale_mth_cd_a) // 경매거래
            product_type = sts_cd;
        else if (sale_mth_cd === CodeText.sale_mth_cd_i) // 즉시거래
            product_type = product.immedi_purchase_ord_dtl_sts_cd;
        else if (sale_mth_cd === CodeText.sale_mth_cd_g) // 공동거래
            console.log("")

        if(ORD_RTNGUD.indexOf(pay_sts_code) > -1 && sale_mth_cd !== CodeText.sale_mth_cd_i)
            this.handleRefundCanc();
        else if(ORD_EXCHNG.indexOf(pay_sts_code) > -1 && sale_mth_cd !== CodeText.sale_mth_cd_i)
            this.handleExchngCanc();
        else if (refund_cd.indexOf(product_type) > -1 && sale_mth_cd === CodeText.sale_mth_cd_i) // 반품
            this.handleRefundCanc();
        else if (exchng_cd.indexOf(product_type) > -1 && sale_mth_cd === CodeText.sale_mth_cd_i) // 교환
            this.handleExchngCanc();

    }
    // 교환취소 요청
    handleExchngCanc = () => {
        console.log("handleExchngCanc")
        const {sale_mth_cd} = this.state;
        if (sale_mth_cd === CodeText.sale_mth_cd_i) // 즉시거래
            this.handleImmediExchngCanc();
        else // 경매거래, 공동거래
            this.handleLastExchngCanc(sale_mth_cd);
    }
    handleImmediExchngCanc = () => {
        console.log("handleImmediExchngCanc")
        const {product} = this.state;
        if (product?.exchng) {
            let params = {
                immedi_purchase_ord_dtl_exchng_no: product.exchng.immedi_purchase_ord_dtl_exchng_no,
            }

            console.log(params)

            this.props.immediExchngCanc(params).then((res) => {
                this.setState({isShowAlertModal: false})
                this.getImmediDetail()
            }).catch((err) => {
            });
        }
    }
    handleLastExchngCanc = (sale_mth_cd) => {
        const {product} = this.state;
        if (product?.exchng) {
            let params = {
                last_purchase_ord_exchng_no: product.exchng.last_purchase_ord_exchng_no,
            }

            this.props.lastExchngCanc(params).then((res) => {
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
    // 반품취소 요청
    handleRefundCanc = () => {
        const {sale_mth_cd} = this.state;
        if (sale_mth_cd === CodeText.sale_mth_cd_i) // 즉시거래
            this.handleImmediRefundCanc();
        else // 경매거래, 공동거래
            this.handleLastRefundCanc(sale_mth_cd);
    }
    handleImmediRefundCanc = () => {
        const {product} = this.state;
        if (product?.rtngud) {
            let params = {
                immedi_purchase_ord_dtl_rtngud_no: product.rtngud.immedi_purchase_ord_dtl_rtngud_no,
            }

            console.log(params)

            this.props.immediRefundCanc(params).then((res) => {
                this.setState({isShowAlertModal: false})
                this.getImmediDetail()
            }).catch((err) => {
            });
        }
    }
    handleLastRefundCanc = (sale_mth_cd) => {
        const {product} = this.state;
        if (product?.rtngud) {
            let params = {
                last_purchase_ord_rtngud_no: product.rtngud.last_purchase_ord_rtngud_no,
            }

            console.log(params)

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
    // 구매확정
    handleConfirm = () => {
        const {sale_mth_cd} = this.state;
        if (sale_mth_cd === CodeText.sale_mth_cd_i) // 즉시거래
            this.handleImmediConfirm();
        else // 경매거래, 공동거래
            this.handleLastConfirm(sale_mth_cd);
    }
    handleImmediConfirm = () => {
        const {product} = this.state;
        let params = {
            immedi_purchase_ord_dtl_no: product.immedi_purchase_ord_dtl_no,
        }

        this.props.immediConfirm(params).then((res) => {
            this.getImmediDetail()
            this.setState({isShowConfirmModal : false})
        }).catch((err) => {
        });
    }
    handleLastConfirm = () => {
        const {product} = this.state;
        let params = {
            last_purchase_ord_no: product.last_purchase_ord_no,
        }

        this.props.lastConfirm(params).then((res) => {
            this.getImmediDetail()
            this.setState({isShowConfirmModal : false})
        }).catch((err) => {
        });
    }

    /* RENDER START */
    renderCompleteInfoBox = () => {
        const {order_no, detail} = this.state;
        return (
            <View style={styles.completeInfoBox}>
                <Text style={styles.completeInfoBoxText}>
                    {dateUtil.formatKCT("point", detail.inst_dt || "")}
                </Text>
                <Text style={styles.completeInfoBoxOrderText}>
                    {`${MyBuyText.orderNo} ${order_no}`}
                </Text>
                <View style={styles.completeInfoBoxInfo}/>
                <View style={{paddingBottom: 23}}>
                    <View style={{flexDirection: "row"}}>
                        <Image
                            source={require("../../../../assets/image/mypage/info_icon_pink.png")}
                            style={{width: 18, height: 18, marginRight: 7.2}}
                        />
                        <View>
                            <Text style={styles.completeInfoBoxCheck}>
                                {MyBuyText.checkMessage1}
                            </Text>
                            <Text style={styles.completeInfoBoxCheckSub}>
                                {MyBuyText.checkMessage2}
                            </Text>
                            <Text style={[styles.completeInfoBoxCheckSub, {marginTop: 4}]}>
                                {MyBuyText.checkMessage3}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    renderInfoContainer = (product) => {
        const {
            isTicketInfoBoxOpened,
            isOrdererInfoBoxOpened,
            isPaymentInfoBoxOpened,
            isShippingInfoBoxOpened,
            mber, isComplete, dlvy, sale_mth_cd,
            pay_info,
            isTicket,
            detail
        } = this.state;
        const isImmedi = sale_mth_cd === CodeText.sale_mth_cd_i;
        const isCoper = sale_mth_cd === CodeText.sale_mth_cd_g;
        const isReserv = sale_mth_cd === CodeText.sale_mth_cd_r;
        const isAuc = sale_mth_cd === CodeText.sale_mth_cd_a;

        let days = 0
        if(isTicket) {
            const currentTime = dateUtil.format('x', new Date());
            const limitTime = moment(dateUtil.formatKCT("dash", detail.exchng_vol.expir_dt)).hours('23').minutes('59') // 한국 시간 : 23시 59분으로 변경
            const day = 1000 * 60 * 60 * 24;
            const remindTime = limitTime - currentTime;
            days = Math.floor(remindTime / day) + 1;
        }
        return (
            <>
                {isTicket && (
                    <InfoBox
                        title={MyPageText.ticketInfo}
                        onPress={() => {
                            this.setState({
                                isTicketInfoBoxOpened: !isTicketInfoBoxOpened,
                            });
                        }}
                        isOpened={isTicketInfoBoxOpened}
                        openedComp={
                            <TouchableOpacity activeOpacity={1.0}>
                                <Text style={{marginBottom: 7, fontSize: 14, color: "#555555"}}>{`${TicketText.serialNumber} : ${detail.exchng_vol.exchng_vol_serial_no}`}</Text>
                                <ImageBackground
                                    style={styles.ticket}
                                    resizeMode="contain"
                                    source={require("../../../../assets/image/ticket/ticket_off.png")}
                                >
                                    <Image source={{uri: detail.thumb_url}} style={styles.productImg}/>
                                    <View style={{flex: 1}}>
                                        <Text style={[styles.title, {marginBottom: 5}]}>
                                            {`${detail.goods_nm}`}
                                        </Text>
                                        <Text style={styles.expDates}>
                                            {`${detail.goods_optn_nm}`}
                                            {` | ${PaymentText.quantity} : ${detail.purchase_cnt}`}
                                        </Text>
                                        <Text style={styles.expDates}>
                                            {TicketText.validity}:{`~${formatKCT("point", detail.exchng_vol.expir_dt)}(${days}일)`}
                                        </Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        }
                    />
                )}
                <InfoBox
                    title={MyPageText.ordererInformation}
                    onPress={() => {
                        this.setState({
                            isOrdererInfoBoxOpened: !isOrdererInfoBoxOpened,
                        });
                    }}
                    isOpened={isOrdererInfoBoxOpened}
                    openedComp={
                        <View style={[styles.betweenCenter, {paddingBottom: 11}]}>
                            <View>
                                <Text style={styles.infoTitle}>{MyPageText.orderer}</Text>
                                <Text style={styles.infoTitle}>{MyPageText.contact}</Text>
                                <Text style={styles.infoTitle}>{MyPageText.email}</Text>
                            </View>
                            <View>
                                <Text style={styles.info}>{mber.mber_nm}</Text>
                                <Text style={styles.info}>{maskingPhone(mber.moblphon_no || "")}</Text>
                                <Text style={styles.info}>{maskingEmail(mber.email_addr || "")}</Text>
                            </View>
                        </View>
                    }
                />
                <InfoBox
                    title={MyPageText.paymentInfo}
                    onPress={() => {
                        this.setState({
                            isPaymentInfoBoxOpened: !isPaymentInfoBoxOpened,
                        });
                    }}
                    isOpened={isPaymentInfoBoxOpened}
                    openedComp={
                        <>
                            <View style={styles.betweenCenter}>
                                <View>
                                    <Text style={styles.infoTitle}>{MyPageText.paymentMethod}</Text>
                                    <Text style={styles.infoTitle}>{!isAuc ? PaymentText.productPrice : MyPageText.productBid}</Text>
                                    {!isImmedi && !isCoper && (<Text style={styles.infoTitle}>{isReserv ? MyPageText.reservDeposit : MyPageText.bidDeposit}</Text>)}
                                    <Text style={styles.infoTitle}>{PaymentText.shippingFee}</Text>
                                    <Text style={styles.infoTitle}>{MyPageText.redeemPoints}</Text>
                                </View>
                                <View>
                                    <Text style={styles.info}>{pay_info.pay_dtl_nm || ""}</Text>
                                    <Text style={styles.info}>{`${formattedNumber(!isAuc ? pay_info.tot_ord_amt : pay_info.bid_prc || 0)}${StoreText.won}`}</Text>
                                    {!isImmedi && !isCoper && (<Text style={styles.info}>{isReserv ? "예약예치금 값 필요" : `${formattedNumber(pay_info.bid_dpst_amt || 0)}${StoreText.won}`}</Text>)}
                                    <Text style={styles.info}>{`${formattedNumber(pay_info.tot_dlvy_cost_amt || 0)}${StoreText.won}`}</Text>
                                    <Text style={styles.info}>{`${formattedNumber(pay_info.tot_pnt_amt || 0)}${StoreText.won}`}</Text>
                                </View>
                            </View>
                            <View
                                style={[
                                    styles.betweenCenter,
                                    {
                                        paddingTop: 14.5,
                                        paddingBottom: 16.5,
                                        borderTopWidth: 1,
                                        borderTopColor: "#dddddd",
                                    },
                                ]}
                            >
                                <Text style={styles.totalPrice}>{MyPageText.totalPaymentAmount}</Text>
                                <Text
                                    style={styles.totalPrice}>{`${formattedNumber(pay_info.tot_pay_amt || 0)}${StoreText.won}`}</Text>
                            </View>
                        </>
                    }
                />
                {dlvy?.dlvy_no && isComplete && ( // pay_sts_code 적용 필요 : 원본 (completeType === 2 || completeType === 3)
                    <InfoBox
                        title={MyPageText.shippingInfo}
                        onPress={() => {
                            this.setState({
                                isShippingInfoBoxOpened: !isShippingInfoBoxOpened,
                            });
                        }}
                        isOpened={isShippingInfoBoxOpened}
                        openedComp={
                            <View style={[styles.betweenCenter, {paddingBottom: 11}]}>
                                <View>
                                    <Text style={styles.infoTitle}>{MyPageText.recipient}</Text>
                                    <Text style={styles.infoTitle}>{MyPageText.address}</Text>
                                    <Text style={styles.infoTitle}>{MyPageText.contact}</Text>
                                </View>
                                <View>
                                    <Text style={styles.info}>{dlvy.dlvy_addr_nm || "-"}</Text>
                                    <Text style={styles.info}>
                                        {maskingAddress(dlvy.addr || "")}
                                    </Text>
                                    <Text style={styles.info}>{maskingPhone(dlvy.moblphon_no || "")}</Text>
                                </View>
                            </View>
                        }
                    />
                )}
                <View style={{height: 35}}/>
            </>
        );
    };

    /* PRODUCT DETAIL START */
    renderBtnCreateCancel = () => {
        return (
            <TouchableOpacity
                style={[styles.productCancel, {
                    borderColor: Colors.MAIN_COLOR,
                    margin: 0,
                }]}

                onPress={() => this.setState({isCancel: true, isShowConfirmModal: true})}
            >
                <Text
                    style={[styles.productCancelText, {
                        fontFamily: Fonts.AppleB,
                        color: Colors.MAIN_COLOR,
                    }]}
                >
                    {MyPageText.paymentCancel}
                </Text>
            </TouchableOpacity>
        )
    }

    renderBtnCancelDetail = (product, product_type) => {
        const {navigation} = this.props;
        const {order_no, sale_mth_cd} = this.state;

        let order_dtl_no = ""; // 상품 상태 코드
        if (sale_mth_cd === CodeText.sale_mth_cd_i) // 즉시거래
            order_dtl_no = product.immedi_purchase_ord_dtl_no;

        return (
            <TouchableOpacity
                style={[styles.productCancel, {borderColor: "#dddddd"}]}
                onPress={() => {
                    navigation.navigate("MyBuyCancelDetail", {
                        order_no: order_no,
                        product: product,
                        sale_mth_cd: sale_mth_cd,
                        sts_cd: product_type,
                        order_dtl_no: order_dtl_no
                    });
                }}
            >
                <Text
                    style={[styles.productCancelText, {
                        fontFamily: Fonts.AppleR,
                        color: "#555555",
                    }]}
                >
                    {MyPageText.cancelDetail}
                </Text>
            </TouchableOpacity>
        )
    }

    renderBtnMultiDetail = (product, isRequest) => {
        const {navigation} = this.props;
        const {sale_mth_cd, order_no, sts_cd, detail} = this.state;

        let product_type = "";
        let order_dtl_no = ""; // 상품 dtl_no
        if (sale_mth_cd === CodeText.sale_mth_cd_a) // 경매거래
            product_type = sts_cd;
        else if (sale_mth_cd === CodeText.sale_mth_cd_i) {// 즉시거래
            product_type = product.immedi_purchase_ord_dtl_sts_cd;
            order_dtl_no= product.immedi_purchase_ord_dtl_no;
        } else if (sale_mth_cd === CodeText.sale_mth_cd_g) // 공동거래
            console.log("")


        return (
            <View
                style={[
                    styles.betweenCenter,
                    {paddingHorizontal: 20, marginBottom: 18},
                ]}
            >
                <TouchableOpacity
                    style={styles.activeOptionBtn}
                    onPress={() => this.setState({product: product, isCancel: false, isShowConfirmModal: true})}
                >
                    <Text style={styles.activeOptionText}>
                        {MyPageText.confirmationOfPurchase}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.inactiveOptionBtn}
                    onPress={() => isRequest ? navigation.navigate("MyBuyRefund", {
                        order_no: order_no,
                        sale_mth_cd: sale_mth_cd,
                        product: product,
                    }) : this.setState({isShowMessageModal: true})}
                >
                    <Text style={styles.inactiveOptionText}>
                        {MyPageText.returnRequest}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.inactiveOptionBtn}
                    onPress={() => isRequest ? navigation.navigate("MyBuyChange", {
                        order_no: order_no,
                        sale_mth_cd: sale_mth_cd,
                        sts_cd: product_type,
                        product: product,
                        order_dtl_no: order_dtl_no
                    }) : this.setState({isShowMessageModal: true})}
                >
                    <Text style={styles.inactiveOptionText}>
                        {MyPageText.exchangeRequest}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.inactiveOptionBtn}
                    onPress={() => navigation.navigate("MyBuyDelivery", {
                        order_no: order_no,
                        product: product,
                        inst_dt: detail.inst_dt
                    })}
                >
                    <Text style={styles.inactiveOptionText}>
                        {MyPageText.deliveryTracking}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderBtnRefund = (product, product_type) => {
        const {eCOMM_CD} = this.props;
        const typeTitle = product_type ? eCOMM_CD[`${product_type}`].cd_nm : ""
        const isPress = product_type === CodeText.refund_cd_submit || product_type === CodeText.refund_cd_submit_l || product_type === CodeText.exchng_cd_submit;
        return (
            <TouchableOpacity
                style={[styles.productCancel, isPress ? {backgroundColor: "#000000"} : {borderColor: "#dddddd", backgroundColor: "#eeeeee"}]}
                onPress={() => isPress ? this.setState({isShowAlertModal: true, product: product}) : null}
            >
                <Text
                    style={[styles.productCancelText,
                        isPress ? {fontFamily: Fonts.AppleB, color: "white"}
                    : {fontFamily: Fonts.AppleB, color: "#999999"}]}
                >
                    {isPress ? MyPageText.withdrawalOfRequest : typeTitle}
                </Text>
            </TouchableOpacity>
        )
    }

    renderBtnFeedComplete = (product) => {
        const {navigation} = this.props;
        const {pay_sts_code} = this.state;
        const isFeedWrite =
            !product?.ntt?.ntt_no // 즉시구매
            || pay_sts_code === ORD_DCSN[0] // 경매,공동,예약
            || product.pay_sts_code === ORD_DCSN[2]; // 즉시구매
        return (
            <TouchableOpacity
                style={[styles.productCancel,
                    isFeedWrite ? {borderColor: "#555555"} : {
                        borderColor: "#dddddd",
                        backgroundColor: "#eeeeee"
                    }]}
                onPress={() => isFeedWrite ?
                    navigation.navigate("FeedPost", {selectProduct: product}) : null}
            >
                <Text
                    style={[styles.productCancelText,
                        isFeedWrite ? {fontFamily: Fonts.AppleB, color: "#555555"}
                            : {fontFamily: Fonts.AppleB, color: "#999999"}]}
                >
                    {isFeedWrite ? MyPageText.writeFeed : MyPageText.wroteFeed}
                </Text>
            </TouchableOpacity>
        )
    }

    renderProductInfo = (product) => {
        const {navigation, eCOMM_CD} = this.props;
        const {pay_sts_code, sale_mth_cd, order_no, sts_cd, last_purchase, detail} = this.state;

        let isCompleteType = -1;
        let isRequest = false;
        let product_type = ""; // 상품 상태 코드
        let order_dtl_no = ""; // 상품 dtl_no
        let nav = ""; // 상품 상세 이동
        if (sale_mth_cd === CodeText.sale_mth_cd_a) { // 경매거래
            nav = "StoreAuction";
            product_type = sts_cd;
        } else if (sale_mth_cd === CodeText.sale_mth_cd_i) { // 즉시거래
            nav = "StoreDetail";
            product_type = product.immedi_purchase_ord_dtl_sts_cd;
            order_dtl_no= product.immedi_purchase_ord_dtl_no;
        } else if (sale_mth_cd === CodeText.sale_mth_cd_g) { // 공동거래
            nav = "StoreGroup";
            product_type = sts_cd;
        } else { // 예약거래
            nav = "StoreReserve";
            product_type = sts_cd;
        }

        if (refund_cd.indexOf(product_type) > -1) {
            isCompleteType = 1
            if(product?.rtngud && product.rtngud.immedi_purchase_ord_dtl_rtngud_sts_cd)
                product_type = product.rtngud.immedi_purchase_ord_dtl_rtngud_sts_cd || ""
        }
        if (exchng_cd.indexOf(product_type) > -1) {
            isCompleteType = 1
            if(product?.exchng && product.exchng.immedi_purchase_ord_dtl_exchng_sts_cd)
                product_type = product.exchng.immedi_purchase_ord_dtl_exchng_sts_cd || ""
        }
        if (cancel_cd.indexOf(product_type) > -1)
            isCompleteType = 2
        if (feed_cd.indexOf(product_type) > -1)
            isCompleteType = 3
        if (wait_cd.indexOf(product_type) > -1)
            isCompleteType = 4
        if (confirm_cd.indexOf(product_type) > -1) {
            isCompleteType = 5
            if(product?.dlvy) {
                product_type = product.dlvy.dlvy_sts_cd || ""
                if(product_type === dlvy_cd[2])
                    isRequest = true;
            }
        }
        // 즉시거래 제외
        console.log("pay_sts_code")
        console.log(pay_sts_code)
        if(pay_sts_code === "ORD_PAID_3" && sale_mth_cd !== CodeText.sale_mth_cd_i) {
            // last_purchase.last_purchase_ord_sts_cd
            console.log(product.dlvy.dlvy_sts_cd)
            console.log(last_purchase.last_purchase_ord_sts_cd)
            isCompleteType = 5
            if(product?.dlvy) { // 배송 시작 여부
                product_type = product.dlvy.dlvy_sts_cd || ""
                if(product_type === dlvy_cd[2])
                    isRequest = true;
            }
            if (exchng_cd.indexOf(last_purchase.last_purchase_ord_sts_cd) > -1) {
                isCompleteType = 1
                if(detail?.exchng && detail.exchng.immedi_purchase_ord_dtl_exchng_sts_cd)
                    product_type = detail.exchng.immedi_purchase_ord_dtl_exchng_sts_cd || ""
            }
        }
        if(pay_sts_code === "ORD_DLVY_4" && sale_mth_cd !== CodeText.sale_mth_cd_i) {
            isCompleteType = 5;
            isRequest = true;
            if (exchng_cd.indexOf(last_purchase.last_purchase_ord_sts_cd) > -1) {
                isCompleteType = 1
                if(detail?.exchng && detail.exchng.immedi_purchase_ord_dtl_exchng_sts_cd)
                    product_type = detail.exchng.immedi_purchase_ord_dtl_exchng_sts_cd || ""
            }
        }
        if(ORD_RTNGUD.indexOf(pay_sts_code) > -1 && sale_mth_cd !== CodeText.sale_mth_cd_i) {
            isCompleteType = 1;
            if(detail?.rtngud && detail.rtngud.last_purchase_ord_rtngud_sts_cd)
                product_type = detail.rtngud.last_purchase_ord_rtngud_sts_cd || ""
        }

        if(ORD_EXCHNG.indexOf(pay_sts_code) > -1 && sale_mth_cd !== CodeText.sale_mth_cd_i) {
            if(detail?.exchng && detail.exchng.last_purchase_ord_exchng_sts_cd)
                product_type = detail.exchng.last_purchase_ord_exchng_sts_cd || ""
        }

        const typeTitle = product_type ? eCOMM_CD[`${product_type}`].cd_nm : ""

        let color_style = {color: Colors.MAIN_COLOR};
        if(product_type === "IPODRSC1" || product_type === "IPODESC1")
            color_style = {color: "#9a00ff"};
        if(product_type === "DSC00003" || product_type === "IPODSC04" || product_type === "IPODSC07" || product_type === "IPOCSC02")
            color_style = {color: "#999999"};
        if(product_type === "IPODSC02" || product_type === "DSC00001")
            color_style = {color: "#000000"};

        return (
            <View style={{marginBottom: 20, backgroundColor: "white",}}>
                <View style={[styles.productInfo, {paddingBottom: 25,}]}>
                    <TouchableOpacity
                        style={styles.productInfoImg}
                        onPress={() => navigation.push(nav, {goods_no: product.goods_no})}
                    >
                        <Image
                            source={{uri: product.thumb_url}}
                            style={{width: "100%", height: "100%"}}
                        />
                    </TouchableOpacity>

                    <View style={{flex: 1}}>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Text style={[styles.productInfoText, color_style]}>
                                {typeTitle}
                            </Text>
                            {((isCompleteType === 1 && refund_cd.indexOf(product_type) > -1) || ORD_RTNGUD.indexOf(pay_sts_code) > -1) && ( // 반품요청 상세
                                <TouchableOpacity onPress={() => navigation.navigate("MyBuyRefundDetail", {
                                    order_no: order_no,
                                    sale_mth_cd: sale_mth_cd,
                                    sts_cd: product_type,
                                    product: product,
                                    order_dtl_no: order_dtl_no
                                })}>
                                    <Text style={styles.productInfoMore}>
                                        {MyPageText.seeMore}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {((isCompleteType === 1 && exchng_cd.indexOf(product_type) > -1) || ORD_EXCHNG.indexOf(pay_sts_code) > -1) && ( // 교환요청 상세
                                <TouchableOpacity onPress={() => navigation.navigate("MyBuyChange", {
                                    order_no: order_no,
                                    sale_mth_cd: sale_mth_cd,
                                    sts_cd: product_type,
                                    product: product,
                                    order_dtl_no: order_dtl_no
                                })}>
                                    <Text style={styles.productInfoMore}>
                                        {MyPageText.seeMore}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text style={styles.productInfoPrice}>
                            {`${formattedNumber(product.payment_price || 0)}${StoreText.won}`}
                        </Text>
                        <Text style={styles.productInfoNm}>
                            {product.goods_nm}
                        </Text>

                        <View style={styles.productInfoOptn}>
                            <Text style={styles.productInfoOptnText}>
                                {product.goods_optn_nm ? product.goods_optn_nm : ""}
                            </Text>
                            {product.goods_optn_nm && (<View style={styles.productInfoCnt}/>)}
                            <Text style={styles.productInfoOptnText}>
                                {`${StoreText.count}: ${product.order_cnt}`}
                            </Text>
                        </View>
                    </View>
                </View>

                {isCompleteType === 1 ? (
                    this.renderBtnRefund(product, product_type)
                ) : isCompleteType === 2 ? (
                    this.renderBtnCancelDetail(product, product_type)
                ) : isCompleteType === 3 || ORD_DCSN.indexOf(pay_sts_code) > -1 || ORD_DCSN.indexOf(product.pay_sts_code) > -1 ? (
                    this.renderBtnFeedComplete(product)
                ) : isCompleteType === 5 ? (
                    this.renderBtnMultiDetail(product, isRequest)
                ) : null}
            </View>
        );
    };

    /* PRODUCT DETAIL END */

    render() {
        const {navigation} = this.props;
        const {sale_mth_cd} = navigation.state.params;
        const {pay_sts_code, isLoading, isShowAlertModal, goods, isComplete, isShowConfirmModal, isCancel, isShowMessageModal} = this.state;

        const product = productList[0];

        if (isLoading)
            return null;
        else
            return (
                <View style={styles.container}>
                    <TopHeader
                        title={MyPageText.details}
                        navigation={navigation}
                        hasRightBtn={false}
                        isCloseIcon={true}
                    />
                    <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                        {isComplete && this.renderCompleteInfoBox()}
                        {goods.length > 0 && goods.map((item) => {
                            return (
                                this.renderProductInfo(item)
                            )
                        })}
                        {pay_sts_code === "ORD_PAID_2" && sale_mth_cd === CodeText.sale_mth_cd_i && ( // 즉시구매일 경우, 결제취소 가능상태
                            <View style={{backgroundColor: 'white', paddingTop: 18.2, marginBottom: 18.2}}>
                                {this.renderBtnCreateCancel()}
                            </View>
                        )}

                        {this.renderInfoContainer(product)}
                    </ScrollView>
                    <MessageModal
                        title={StoreText.notice}
                        subtitle={MyPageText.dlvyModalMessage}
                        isShowMessageModal={isShowMessageModal}
                        setVisible={() => {
                            this.setState({ isShowMessageModal: false })
                        }}
                        hasBtn={false}
                    />
                    <AlertModal // 구매확정, 결제취소 confirm창
                        isShowAlertModal={isShowConfirmModal}
                        message={isCancel ? MyPageText.calcelConfirmModalTitle : MyPageText.confirmModalTitle}
                        subtitle={isCancel ? MyPageText.calcelConfirmModalMessage : ""}
                        leftText={Generic.no}
                        rightText={isCancel ? MyPageText.calcelConfirmModalBtn : MyPageText.confirmModalBtn}
                        setVisible={() => this.setState({isShowConfirmModal: false})}
                        navigation={navigation}
                        leftOnPress={() => this.setState({isShowConfirmModal: false})}
                        rightOnPress={() => isCancel ? this.handleCanc() : this.handleConfirm()}
                    />
                    <AlertModal // 요청 철회 message
                        isShowAlertModal={isShowAlertModal}
                        message={MyPageText.returnRequestModalTitle}
                        subtitle={MyPageText.returnRequestModalMessage}
                        leftText={Generic.no}
                        rightText={MyPageText.returnRequestModalBtn}
                        setVisible={() => this.setState({isShowAlertModal: false})}
                        navigation={navigation}
                        leftOnPress={() => this.setState({isShowAlertModal: false})}
                        rightOnPress={() => this.handleRequest()}
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
    immediCanc: (params) => dispatch(ActionImmedi.canc(params)), // 결제취소
    immediRefundCanc: (params) => dispatch(ActionImmedi.createRefundCanc(params)), // 반품요청 철회
    immediExchngCanc: (params) => dispatch(ActionImmedi.createExchngCanc(params)), // 반품요청 철회
    immediConfirm: (params) => dispatch(ActionImmedi.confirm(params)), // 구매확정

    getAucDetail: (params) => dispatch(ActionAuc.getDetail(params)),
    getCoperDetail: (params) => dispatch(ActionCoper.getDetail(params)),
    getReservDetail: (params) => dispatch(ActionReserv.getDetail(params)),

    lastConfirm: (params) => dispatch(ActionLast.confirm(params)),
    lastExchng: (params) => dispatch(ActionLast.createExchng(params)),
    lastExchngCanc: (params) => dispatch(ActionLast.createExchngCanc(params)),
    lastRefund: (params) => dispatch(ActionLast.createRefund(params)),
    lastRefundCanc: (params) => dispatch(ActionLast.createRefundCanc(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyBuyProductDetail);
