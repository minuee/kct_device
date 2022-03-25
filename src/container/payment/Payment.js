import React, {Component} from "react";
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity, Platform,
} from "react-native";
import {connect} from "react-redux";

import styles from "./styles";

import Fonts from "../../model/lib/Utils/Fonts";
import Colors from "../../model/lib/Utils/Colors";
import {CodeText, PaymentText, StoreText, TOKEN} from "../../model/lib/Utils/Strings";
import {
    formattedNumber, maskingAccount,
    maskingAddress,
    maskingAll,
    maskingId,
    maskingPhone,
    notifyMessage
} from "../../model/lib/Utils";
import {build_type, is_pg} from "../../model/api";

import {TopHeader} from "../../component/TopHeader";
import TextInputStr from "../../common/textinput/TextInput";
import {RadioButton} from "../../component/RadioButton";

import * as ActionImmedi from "../../model/action/eIMMEDI_PURCHASE";
import * as ActionAccount from "../../model/action/eACCOUNT_DELIVERY";
import * as ActionMber from "../../model/action/eMBER";
import * as ActionAuc from "../../model/action/eAUC_TRD";
import * as ActionRefund from "../../model/action/eREFUND_MN";
import * as ActionPayment from "../../model/action/ePAYMENT";
import * as ActionCoper from "../../model/action/eCOPERTN_PURCHASE";
import * as ActionNbkk from "../../model/action/eNBKK_RCPMNY_ACCNT";
import * as ActionGoods from "../../model/action/eGOODS";
import * as ActionReserve from "../../model/action/eRESERV_PURCHASE";

const paymentMethod_prev = [
    {title: PaymentText.directDeposit, id: 1}, // 무통장입금
    {title: PaymentText.cardPayment, id: 2}, // 카드결제
];
const paymentMethod_next = [
    {title: PaymentText.directDeposit, id: 1}, // 무통장입금
    {title: PaymentText.cardPayment, id: 2}, // 카드결제
    // {title: PaymentText.easyPayment, id: 3}, // 간편결제(카카오/네이버 페이)
];
const paymentMethod = build_type === TOKEN.build_type_txt ? paymentMethod_next : paymentMethod_prev;

const shippingOptions = [
    {title: "부재시 경비실에 맡겨주세요.", id: 1},
    {title: "택배함에 놔주세요.", id: 2},
    {title: "문 앞에 놔주세요.", id: 3},
    {title: "배송 전에 꼭 연락주세요.", id: 4},
    {title: "직접입력", id: 5},
];
const isPG = is_pg;

const easyPayments = [
  {
    title: PaymentText.naverPay,
    id: 1,
    imagePath: require("../../assets/image/payment/npay.png"),
  },
  {
    title: PaymentText.kakaoPay,
    id: 2,
    imagePath: require("../../assets/image/payment/kakaopay.png"),
  },
];

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isFocus: false,
            purchaseType: props.navigation.state.params.purchaseType,
            isOpened: true,
            hasDeposit: true,
            isBalancePayment: props.navigation.state.params.purchaseType === "remain" || props.navigation.state.params.purchaseType === "remain_reserv", // 잔금결제
            selectedPaymentMethod: 2,
            depositor: "",
            isRequestedCashReceipt: true,
            businessNum: "",
            isOpenedShippingInfoBox: false,
            isOpenedEasyPaymentBox: false,
            selectedEasyPayment:easyPayments[0],
            selectedShippingOption: shippingOptions[0],
            shippingInfoMessage: "",
            isOpenedAccountBox: false,
            selectedBankAccount: {},
            bankAccounts: [],

            isPoint: false, // 모두사용 여부
            point: 0, // 사용 포인트
            point_str: "", // 사용 포인트_str
            delivery_info: {}, // 배송지 정보
            mber_detail: {}, // 로그인한 회원 정보
            return_detail: {}, // 환불결제 정보

            goods: {}, // 경매구매 : 상품 정보
            auc_trd_mine: {}, // 경매구매 > 잔금결제
            reserv_purchase_mine: {}, // 예약구매 > 잔금결제
            payment_price: 0, // 결제 금액

            detail: {}, // 즉시구매 상세
            dtl: [], // 즉시구매 상품 목록
        };
    }

    componentDidMount() {
        const {navigation} = this.props;
        const {purchaseType} = navigation.state.params;
        if (purchaseType === "cart" || purchaseType === "purchase") // from Cart, StorePayment(즉시구매)
            this.getDetail();
        else if(purchaseType === "reserve")
            this.getReservDetail();
        else if (purchaseType === "bid" || purchaseType === "reBid") { // 경매구매
            const {bid_cnt, bid_prc, goods, auc_trd_mine} = navigation.state.params;
            this.setState({
                isLoading: false,
                goods: goods,
                payment_price: goods.dpst_amt_prc || 0, // 예치금
                point_str: auc_trd_mine.tot_pnt_amt || 0, // 재입찰 시, 포인트
                point: auc_trd_mine.tot_pnt_amt || 0 // 재입찰 시, 포인트
            })
        // } else if (purchaseType === "reserve") { // 예약구매
        //     const {goods} = navigation.state.params;
        //     this.setState({
        //         isLoading: false,
        //         goods: goods,
        //         payment_price: goods.dpst_amt_prc // 예약 예치금
        //     })
        } else if (purchaseType === "group") { // 공동구매
            const {bid_cnt, bid_prc, goods} = navigation.state.params;
            this.setState({
                isLoading: false,
                goods: goods,
                payment_price: (parseInt(goods.sale_prc) * parseInt(bid_cnt)) + parseInt(goods.dlvy_cost_prc) // 결제가
            })
        } else if (purchaseType === "remain" || purchaseType === "remain_reserv") // 잔금결제
            this.getStoreDetail();
        this.getRefundDetail();
        this.getDeliveryList();
        this.getMberDetail();
        this.getNbkkList();
    }

    /*  API function START */
    // 잔금결제 : goods detail
    getStoreDetail = () => {
        const {navigation} = this.props;
        const {goods_no} = navigation.state.params;
        let params = {
            goods_no: goods_no
        }
        this.props.getStoreDetail(params).then((res) => {
            if(res.goods.sale_mth_cd === CodeText.sale_mth_cd_a)
                this.setState({
                    goods: res.goods,
                    auc_trd_mine: res.auc_trd_mine,
                    payment_price: res.auc_trd_mine.remain_amt,
                    isLoading: false,
                })
            else
                this.setState({
                    goods: res.goods,
                    reserv_purchase_mine: res.reserv_purchase_mine,
                    payment_price: res.reserv_purchase_mine.remain_amt,
                    isLoading: false,
                })
        }).catch((err) => {
        });
    }
    // point available check
    checkAvailableAucDpst = (auc_trd_no) => {
        const {point} = this.state;
        let params = {
            auc_trd_no,
            pnt_amt : parseInt(point)
        }
        return this.props.availableAucDpst(params).then((res) => {
            return true;
        }).catch((err) => {
            return false;
        });
    }
    checkAvailableAucRemain = (auc_trd_no) => {
        const {point} = this.state;
        let params = {
            auc_trd_no,
            pnt_amt : parseInt(point)
        }
        return this.props.availableAucRemain(params).then((res) => {
            return true;
        }).catch((err) => {
            return false;
        });

    }
    checkAvailableReservDpst = (reserv_purchase_no) => {
        const {point} = this.state;
        let params = {
            reserv_purchase_no,
            pnt_amt : parseInt(point)
        }
        console.log("params")
        console.log(params)
        return this.props.availableReservDpst(params).then((res) => {
            return true;
        }).catch((err) => {
            return false;
        });

    }
    checkAvailableReservRemain = (reserv_purchase_no) => {
        const {point} = this.state;
        let params = {
            reserv_purchase_no,
            pnt_amt : parseInt(point)
        }
        return this.props.availableReservRemain(params).then((res) => {
            return true;
        }).catch((err) => {
            return false;
        });

    }
    checkAvailableCoper = (copertn_purchase_no) => {
        const {point} = this.state;
        let params = {
            copertn_purchase_no,
            pnt_amt : parseInt(point)
        }
        return this.props.availableCoper(params).then((res) => {
            return true;
        }).catch((err) => {
            return false;
        });

    }
    checkAvailableImmedi = (immedi_purchase_no) => {
        const {point} = this.state;
        let params = {
            immedi_purchase_no,
            pnt_amt : parseInt(point)
        }
        return this.props.availableImmedi(params).then((res) => {
            return true;
        }).catch((err) => {
            return false;
        });

    }
    // 경매거래 : 잔금결제
    handlePayAucRemain = async () => {
        const {navigation} = this.props;
        const {selectedPaymentMethod, auc_trd_mine, payment_price, point, goods} = this.state;

        const isAvailable = await this.checkAvailableAucRemain(auc_trd_mine.auc_trd_no);

        if(isAvailable)
            this.handlePayAucRemainNext().then(() => {
            if (parseInt(payment_price) - parseInt(point || 0) !== 0 && selectedPaymentMethod !== 1) {
                let params = {
                    auc_trd_no: auc_trd_mine.auc_trd_no,
                    amount: parseInt(payment_price) - parseInt(point || 0),
                }
                // PG사 연결 부분
                if (isPG) {
                    navigation.replace("PaymentWebView", {
                        isPointAvailable: isAvailable,
                        pnt_amt: parseInt(point || 0),
                        amount: parseInt(payment_price) - parseInt(point || 0),
                        order_no: auc_trd_mine.auc_trd_no,
                        sale_mth_cd: CodeText.sale_mth_cd_a, // 경매거래
                        goods_nm: goods.goods_nm, // 상품명
                        purchaseType: "remain",
                        selectedPaymentMethod: selectedPaymentMethod,
                    })
                } else {
                    this.props.createPayAucRemain(params).then((res) => {
                        navigation.navigate("PaymentResult", {
                            purchaseType: "remain",
                            selectedPaymentMethod: selectedPaymentMethod,
                            order_no: auc_trd_mine.auc_trd_no,
                            sale_mth_cd: CodeText.sale_mth_cd_a, // 경매거래
                        })
                    }).catch((err) => {
                    });
                }
            } else {
                navigation.navigate("PaymentResult", {
                    purchaseType: "remain",
                    selectedPaymentMethod: selectedPaymentMethod,
                    order_no: auc_trd_mine.auc_trd_no,
                    sale_mth_cd: CodeText.sale_mth_cd_a, // 경매거래
                })
            }

        })
    }
    handlePayAucRemainNext = async () => {
        const {auc_trd_mine, selectedPaymentMethod, point, payment_price} = this.state;
        let auc_transfer
        let auc_point
        // if (selectedPaymentMethod === 1)
        //     auc_transfer = await this.handlePayAucRemainTransfer()
        await this.handleDlvy(auc_trd_mine.auc_trd_no)
        if (parseInt(payment_price) - parseInt(point || 0) === 0)
            auc_point = await this.handlePayAucRemainPoint()
        if (parseInt(payment_price) - parseInt(point || 0) !== 0 && selectedPaymentMethod === 1)
            auc_transfer = await this.handlePayAucRemainTransfer()
        await Promise.all([auc_transfer, auc_point]);
    }
    // 경매거래(포인트) : 잔금결제
    handlePayAucRemainPoint = () => {
        const {auc_trd_mine, point} = this.state;
        let params = {
            auc_trd_no: auc_trd_mine.auc_trd_no,
            pnt_amt: point, // 포인트 사용액
        }
        return this.props.createPayAucRemainPoint(params).then((res) => {

        }).catch((err) => {
        });
    }
    // 경매거래(무통장입금) : 잔금결제
    handlePayAucRemainTransfer = () => {
        const {auc_trd_mine, selectedBankAccount, depositor, isRequestedCashReceipt, businessNum} = this.state;
        let params = {
            auc_trd_no: auc_trd_mine.auc_trd_no,
            nbkk_rcpmny_accnt_no: selectedBankAccount.nbkk_rcpmny_accnt_no,
            dpstr_nm: depositor,
            cash_rcpt_yn: isRequestedCashReceipt ? "Y" : "N",
        }
        if (isRequestedCashReceipt)
            Object.assign(params, {bsnm_reg_no: businessNum})
        return this.props.createPayAucRemainTransfer(params).then((res) => {

        }).catch((err) => {
        });
    }
    // 즉시구매 : 상세 정보
    getDetail = () => {
        const {navigation} = this.props;
        const {immedi_purchase_ord_no} = navigation.state.params;
        let params = {
            immedi_purchase_ord_no
        }
        console.log("immedi_purchase_ord_no")
        console.log(immedi_purchase_ord_no)
        this.props.getDetail(params).then((res) => {
            // detail 데이터 처리 필요
            console.log("res.detail.tot_pay_target_amt")
            console.log(res.detail.tot_pay_target_amt)
            this.setState({
                isLoading: false,
                detail: res.detail,
                dtl: res.detail.dtl,
                payment_price: res.detail.tot_pay_target_amt
            })
        }).catch((err) => {
        });
    }
    // 배송지 정보
    getDeliveryList = () => {
        let params = {
            skip: 0,
            limit: 5
        }
        this.props.getDeliveryList(params).then((res) => {
            let delivery_list = res.list.filter((item) => item.기본배송주소여부 === "Y")
            if (delivery_list.length > 0)
                this.setState({delivery_info: delivery_list[0]}, () => this.updateDelivery())
            else if (res.list.length > 0)
                this.setState({delivery_info: res.list[0]}, () => this.updateDelivery())
        }).catch((err) => {
        });
    }
    // 배송지 주문 정보 업데이트
    handleDlvy = (ord_no) => {
        const {navigation} = this.props;
        const {purchaseType} = navigation.state.params;
        const {delivery_info} = this.state;
        let params = {
            dlvy_addr_no: delivery_info.dlvy_addr_no
        }
        if (purchaseType === "cart" || purchaseType === "purchase") // from Cart, StorePayment(즉시구매)
            Object.assign(params, {immedi_purchase_ord_no: ord_no})
        else if (purchaseType === "bid" || purchaseType === "reBid" || purchaseType === "remain") // 경매구매
            Object.assign(params, {auc_trd_no: ord_no})
        else if (purchaseType === "reserve" || purchaseType === "remain_reserv") // 예약구매
            Object.assign(params, {reserv_purchase_no: ord_no})
        else // 공동구매
            Object.assign(params, {copertn_purchase_no: ord_no})

        this.props.createOrderDlvy(params).then((res) => {
        }).catch((err) => {
        });
    }
    // 배송지 주문 정보 업데이트
    updateDelivery = () => {
        const {delivery_info, selectedShippingOption, shippingInfoMessage} = this.state;
        let params = {
            addr_no: delivery_info.dlvy_addr_no
        }
        if (selectedShippingOption.id === 5)
            Object.assign(params, {dlvy_req_cont: shippingInfoMessage})
        else
            Object.assign(params, {dlvy_req_cont: selectedShippingOption.title})

        console.log("params")
        console.log(params)
        this.props.updateDelivery(params).then((res) => {
        }).catch((err) => {
        });
    }
    // 무통장입금 계좌 정보
    getNbkkList = () => {
        let params = {
            skip: 0,
            limit: 100
        }
        this.props.getNbkkList(params).then((res) => {
            this.setState({bankAccounts: res.list, selectedBankAccount: res.list[0]})
        }).catch((err) => {
        });
    }
    // 사용자 정보
    getMberDetail = () => {
        this.props.getMberDetail({}).then((res) => {
            this.setState({mber_detail: res.user[0]})
        }).catch((err) => {
        });
    }
    // 환불결제 정보
    getRefundDetail = () => {
        this.props.getRefundDetail({}).then((res) => {
            if (res?.detail)
                this.setState({return_detail: res.detail})
        }).catch((err) => {
        });
    }
    // 입찰하기
    handleAuc = async () => {
        const {navigation} = this.props;
        const {purchaseType, bid_cnt, bid_prc, goods, auc_trd_mine} = navigation.state.params;
        const {point, payment_price, selectedPaymentMethod, delivery_info} = this.state;

        let params = {
            bid_prc: bid_prc,
            goods_no: goods.goods_no
        }
        if (auc_trd_mine.auc_trd_no) {
            Object.assign(params, {auc_trd_no: auc_trd_mine.auc_trd_no})
            if (point)
                Object.assign(params, {tot_pnt_amt: auc_trd_mine.point})
            if (delivery_info?.dlvy_addr_no)
                await this.handleDlvy(auc_trd_mine.auc_trd_no)
            this.props.updateAuc(params).then((res) => {
                // 재입찰 시, 재입찰 완료 페이지
                navigation.navigate("PaymentResult", {
                    purchaseType: purchaseType,
                    selectedPaymentMethod: selectedPaymentMethod,
                    order_no: auc_trd_mine.auc_trd_no,
                    sale_mth_cd: CodeText.sale_mth_cd_a, // 경매거래
                })
            }).catch((err) => {
            });
        } else {
            Object.assign(params, {bid_cnt: bid_cnt})
            if (point && parseInt(point) === parseInt(bid_prc))
                Object.assign(params, {pay_dtl_typ_cd: CodeText.pay_dtl_typ_cd_p})
            else
                Object.assign(params, {pay_dtl_typ_cd: selectedPaymentMethod === 2 ? CodeText.pay_dtl_typ_cd_c : CodeText.pay_dtl_typ_cd_n})

            console.log("params")
            console.log(params)
            this.props.createAuc(params).then(async (res) => {
                if (delivery_info?.dlvy_addr_no)
                    await this.handleDlvy(res.detail.auc_trd_no);

                const isAvailable = await this.checkAvailableAucDpst(res.detail.auc_trd_no);

                if(isAvailable) {
                    if (parseInt(payment_price) - parseInt(point || 0) === 0)
                        await this.handleAucPoint(res.detail.auc_trd_no);

                    // 입찰 시, 예치금 결제 > PG사 연결 필요
                    if (parseInt(payment_price) - parseInt(point || 0) !== 0) {
                        let payParams = {
                            auc_trd_no: res.detail.auc_trd_no,
                            amount: parseInt(payment_price) - parseInt(point || 0),
                        }
                        // PG사 연결 부분
                        if(isPG) {
                            navigation.replace("PaymentWebView", {
                                isPointAvailable: isAvailable,
                                pnt_amt: parseInt(point || 0),
                                amount: parseInt(payment_price) - parseInt(point || 0),
                                order_no: res.detail.auc_trd_no,
                                sale_mth_cd: CodeText.sale_mth_cd_a, // 경매거래
                                goods_nm: goods.goods_nm, // 상품명
                                purchaseType: purchaseType,
                                selectedPaymentMethod: selectedPaymentMethod,
                            })
                        } else {
                            this.props.createPayAuc(payParams).then((pay) => {
                                navigation.navigate("PaymentResult", {
                                    purchaseType: purchaseType,
                                    selectedPaymentMethod: selectedPaymentMethod,
                                    order_no: res.detail.auc_trd_no,
                                    sale_mth_cd: CodeText.sale_mth_cd_a, // 경매거래
                                })
                            }).catch((err) => {
                            });
                        }
                    } else { // 포인트 결제 완료
                        navigation.navigate("PaymentResult", {
                            purchaseType: purchaseType,
                            selectedPaymentMethod: selectedPaymentMethod,
                            order_no: res.detail.auc_trd_no,
                            sale_mth_cd: CodeText.sale_mth_cd_a, // 경매거래
                        })
                    }
                }

            }).catch((err) => {
            });
        }
    }
    // 입찰하기 : 포인트 결제
    handleAucPoint = (auc_trd_no) => {
        const {point} = this.state;
        let params = {
            auc_trd_no: auc_trd_no,
            pnt_amt: parseInt(point)
        }
        this.props.createPayAucPoint(params).then((res) => {
        }).catch((err) => {
        });
    }
    // 공동구매
    handleCoper = () => {
        const {navigation} = this.props;
        const {purchaseType, bid_cnt, bid_prc, goods} = navigation.state.params;
        const {point, payment_price, selectedPaymentMethod} = this.state;
        let params = {
            purchase_cnt: bid_cnt,
            goods_no: goods.goods_no
        }
        // if (point)
        //     Object.assign(params, {tot_pnt_amt: point})
        console.log("params")
        console.log(params)
        this.props.createCoper(params).then(async (res) => {
            // 공동구매 > PG사 연결 필요
            let payParams = {
                copertn_purchase_no: res.detail.copertn_purchase_no,
                amount: parseInt(payment_price) - parseInt(point || 0),
            }
            console.log("payParams")
            console.log(payParams)

            const isAvailable = await this.checkAvailableCoper(res.detail.copertn_purchase_no);

            await this.handleDlvy(res.detail.copertn_purchase_no)

            // PG사 연결 부분
            if(isAvailable) {
                if (parseInt(point) > 0 && parseInt(payment_price) - parseInt(point || 0) === 0)
                    await this.handleCoperPoint(res.detail.copertn_purchase_no)
                if(parseInt(payment_price) - parseInt(point || 0) !== 0) {
                    if(isPG) {
                        navigation.replace("PaymentWebView", {
                            isPointAvailable: isAvailable,
                            pnt_amt: parseInt(point || 0),
                            amount: parseInt(payment_price) - parseInt(point || 0),
                            order_no: res.detail.copertn_purchase_no,
                            sale_mth_cd: CodeText.sale_mth_cd_g, // 공동구매
                            goods_nm: goods.goods_nm, // 상품명
                            purchaseType: purchaseType,
                            selectedPaymentMethod: selectedPaymentMethod,
                        })
                    } else {
                        this.props.createPayCoper(payParams).then((pay) => {
                            navigation.navigate("PaymentResult", {
                                purchaseType: purchaseType,
                                selectedPaymentMethod: selectedPaymentMethod,
                                order_no: res.detail.copertn_purchase_no,
                                sale_mth_cd: CodeText.sale_mth_cd_g, // 공동구매
                            })
                        })
                    }
                } else {
                    navigation.navigate("PaymentResult", {
                        purchaseType: purchaseType,
                        selectedPaymentMethod: selectedPaymentMethod,
                        order_no: res.detail.copertn_purchase_no,
                        sale_mth_cd: CodeText.sale_mth_cd_g, // 공동구매
                    })
                }
            }

        }).catch((err) => {
        });
    }
    // 공동구매 : 포인트 결제
    handleCoperPoint = (copertn_purchase_no) => {
        const {point} = this.state;
        let params = {
            copertn_purchase_no,
            pnt_amt: point,
        }

        return this.props.createPayCoperPoint(params).then((res) => {

        }).catch((err) => {
        });
    }
    // 즉시구매
    handleImmedi = async () => {
        const {navigation} = this.props;
        const {immedi_purchase_ord_no} = navigation.state.params;
        const {purchaseType, selectedPaymentMethod, payment_price, point, goods, dtl} = this.state;

        const isAvailable = await this.checkAvailableImmedi(immedi_purchase_ord_no);

        if(isAvailable)
            this.handleImmediNext().then(() => {
            let goods_nm = "";
            if (dtl && dtl.length > 1) goods_nm = `${dtl[0].goods_nm} 외 ${dtl.length - 1}`;
            else goods_nm = `${dtl[0].goods_nm}`;

            if (parseInt(payment_price) - parseInt(point || 0) !== 0 && selectedPaymentMethod !== 1) {
                let params = {
                    immedi_purchase_ord_no,
                    amount: parseInt(payment_price) - parseInt(point || 0),
                }
                // PG사 연결 부분
                if (isPG) {
                    navigation.replace("PaymentWebView", {
                        isPointAvailable: isAvailable,
                        pnt_amt: parseInt(point || 0),
                        amount: parseInt(payment_price) - parseInt(point || 0),
                        order_no: immedi_purchase_ord_no,
                        sale_mth_cd: CodeText.sale_mth_cd_i, // 즉시거래
                        goods_nm: goods_nm, // 상품명
                        purchaseType: purchaseType,
                        selectedPaymentMethod: selectedPaymentMethod,
                    })
                } else {
                    this.props.createImmedi(params).then((res) => {
                        navigation.navigate("PaymentResult", {
                            purchaseType: purchaseType,
                            selectedPaymentMethod: selectedPaymentMethod,
                            order_no: immedi_purchase_ord_no,
                            sale_mth_cd: CodeText.sale_mth_cd_i, // 즉시거래
                        })
                    }).catch((err) => {
                    });
                }
            } else { // 포인트 결제 완료
                navigation.replace("PaymentResult", {
                    purchaseType: purchaseType,
                    selectedPaymentMethod: selectedPaymentMethod,
                    order_no: immedi_purchase_ord_no,
                    sale_mth_cd: CodeText.sale_mth_cd_i, // 즉시거래
                })
            }
        })
    }
    handleImmediNext = async () => {
        const {navigation} = this.props;
        const {immedi_purchase_ord_no} = navigation.state.params;
        const {payment_price, selectedPaymentMethod, point} = this.state;
        await this.handleDlvy(immedi_purchase_ord_no)
        let immedi_transfer
        let immedi_point
        if (parseInt(payment_price) - parseInt(point || 0) === 0)
            immedi_point = await this.handleImmediPoint(immedi_purchase_ord_no)
        if (parseInt(payment_price) - parseInt(point || 0) !== 0 && selectedPaymentMethod === 1)
            immedi_transfer = await this.handleImmediTransfer(immedi_purchase_ord_no)
        await Promise.all([immedi_transfer, immedi_point]);
    }
    // 즉시구매 : 포인트 결제
    handleImmediPoint = (immedi_purchase_no) => {
        const {point} = this.state;
        let params = {
            immedi_purchase_no,
            pnt_amt: point,
        }

        return this.props.createImmediPoint(params).then((res) => {

        }).catch((err) => {
        });
    }
    // 즉시구매 : 무통장 입금
    handleImmediTransfer = (immedi_purchase_no) => {
        const {selectedBankAccount, depositor, isRequestedCashReceipt, businessNum} = this.state;
        let params = {
            immedi_purchase_no,
            nbkk_rcpmny_accnt_no: selectedBankAccount.nbkk_rcpmny_accnt_no,
            dpstr_nm: depositor,
            cash_rcpt_yn: isRequestedCashReceipt ? "Y" : "N",
        }
        if (isRequestedCashReceipt)
            Object.assign(params, {bsnm_reg_no: businessNum})
        return this.props.createImmediTransfer(params).then((res) => {

        }).catch((err) => {
        });
    }
    // 예약구매 : 상세 정보
    getReservDetail = () => {
        const {navigation} = this.props;
        const {reserv_purchase_no, goods} = navigation.state.params;
        let params = {
            reserv_purchase_no
        }
        console.log("reserv_purchase_no")
        console.log(params)
        this.props.getReservDetail(params).then((res) => {
            // detail 데이터 처리 필요
            this.setState({
                isLoading: false,
                detail: res.detail,
                goods: goods,
                payment_price: parseInt(res.detail.pay_dpst_amt) * parseInt(res.detail.purchase_cnt),
            })
        }).catch((err) => {
        });
    }
    // 예약구매
    handleReserve = async () => {
        const {navigation} = this.props;
        const {reserv_purchase_no} = navigation.state.params;
        const {purchaseType, selectedPaymentMethod, payment_price, point, goods} = this.state;

        const isAvailable = await this.checkAvailableReservDpst(reserv_purchase_no);

        if (isAvailable)
            this.handleReservNext().then(() => {
                if (parseInt(payment_price) - parseInt(point || 0) !== 0 && selectedPaymentMethod !== 1) {
                    // PG사 연결 부분
                    navigation.replace("PaymentWebView", {
                        isPointAvailable: isAvailable,
                        pnt_amt: parseInt(point || 0),
                        amount: parseInt(payment_price) - parseInt(point || 0),
                        order_no: reserv_purchase_no,
                        sale_mth_cd: CodeText.sale_mth_cd_r, // 예약구매
                        goods_nm: goods.goods_nm, // 상품명
                        purchaseType: purchaseType,
                        selectedPaymentMethod: selectedPaymentMethod,
                    })
                } else { // 포인트 결제 or 무통장입금 처리 완료
                    navigation.replace("PaymentResult", {
                        purchaseType: purchaseType,
                        selectedPaymentMethod: selectedPaymentMethod,
                        order_no: reserv_purchase_no,
                        sale_mth_cd: CodeText.sale_mth_cd_r, // 예약구매
                    })
                }
            })
    }
    handleReservNext = async () => {
        const {navigation} = this.props;
        const {reserv_purchase_no} = navigation.state.params;
        const {payment_price, point} = this.state;
        await this.handleDlvy(reserv_purchase_no)
        let reserv_point
        if (parseInt(payment_price) - parseInt(point || 0) === 0)
            reserv_point = await this.handleReservPoint(reserv_purchase_no)
        await Promise.all([reserv_point]);
    }
    handleReservPoint = (reserv_purchase_no) => {
        const {point} = this.state;
        let params = {
            reserv_purchase_no: reserv_purchase_no,
            pnt_amt: parseInt(point)
        }
        return this.props.createReservPoint(params).then((res) => {

        }).catch((err) => {
        });
    }
    handleReservRemain = async () => {
        const {navigation} = this.props;
        const {goods, payment_price, point, reserv_purchase_mine, selectedPaymentMethod} = this.state;

        const isAvailable = await this.checkAvailableReservRemain(reserv_purchase_mine.reserv_purchase_no);

        if(isAvailable)
            this.handleReservRemainNext().then(() => {
                if (parseInt(payment_price) - parseInt(point || 0) !== 0 && selectedPaymentMethod !== 1) {
                    // PG사 연결 부분
                    navigation.replace("PaymentWebView", {
                        isPointAvailable: isAvailable,
                        pnt_amt: parseInt(point || 0),
                        amount: parseInt(payment_price) - parseInt(point || 0),
                        order_no: reserv_purchase_mine.reserv_purchase_no,
                        sale_mth_cd: CodeText.sale_mth_cd_r, // 예약구매
                        goods_nm: goods.goods_nm, // 상품명
                        purchaseType: "remain_reserv",
                        selectedPaymentMethod: selectedPaymentMethod,
                    })
                } else {
                    navigation.navigate("PaymentResult", {
                        purchaseType: "remain_reserv",
                        selectedPaymentMethod: selectedPaymentMethod,
                        order_no: reserv_purchase_mine.reserv_purchase_no,
                        sale_mth_cd: CodeText.sale_mth_cd_r, // 예약구매
                    })
                }
            })
    }
    handleReservRemainNext = async () => {
        const {reserv_purchase_mine, selectedPaymentMethod, point, payment_price} = this.state;
        let reserv_transfer
        let reserv_point
        await this.handleDlvy(reserv_purchase_mine.reserv_purchase_no)
        if (parseInt(payment_price) - parseInt(point || 0) === 0) // 포인트 전액결제
            reserv_point = await this.handleReservRemainPoint(reserv_purchase_mine.reserv_purchase_no)
        if (parseInt(payment_price) - parseInt(point || 0) !== 0 && selectedPaymentMethod === 1)
            reserv_transfer = await this.handleReservRemainTransfer(reserv_purchase_mine.reserv_purchase_no)
        await Promise.all([reserv_transfer, reserv_point]);
    }
    handleReservRemainPoint = (reserv_purchase_no) => {
        const {point} = this.state;
        let params = {
            reserv_purchase_no: reserv_purchase_no,
            pnt_amt: parseInt(point)
        }
        return this.props.createReservRemainPoint(params).then((res) => {
        }).catch((err) => {
        });
    }
    handleReservRemainTransfer = (reserv_purchase_no) => {
        const {selectedBankAccount, depositor, isRequestedCashReceipt, businessNum} = this.state;
        let params = {
            reserv_purchase_no: reserv_purchase_no,
            nbkk_rcpmny_accnt_no: selectedBankAccount.nbkk_rcpmny_accnt_no,
            dpstr_nm: depositor,
            cash_rcpt_yn: isRequestedCashReceipt ? "Y" : "N",
        }
        if (isRequestedCashReceipt)
            Object.assign(params, {bsnm_reg_no: businessNum})
        return this.props.createReservRemainTransfer(params).then((res) => {

        }).catch((err) => {
        });
    }
    /*  API function END */
    handleIsSubmit = () => {
        const {
            delivery_info,
            return_detail,
            selectedPaymentMethod,
            selectedBankAccount,
            depositor,
            isRequestedCashReceipt,
            businessNum,
            purchaseType
        } = this.state;
        // if (!return_detail?.bank_cmpny_cd) {
        //     notifyMessage("환불계좌 정보가 없습니다.")
        //     return false;
        // }
        if (!delivery_info?.dlvy_addr_no && purchaseType !== "bid" ) {
            notifyMessage("배송지 정보가 없습니다.")
            return false;
        }
        if (selectedPaymentMethod === 1) {
            if (depositor === "") {
                notifyMessage("무통장 입금자 정보가 없습니다.")
                return false;
            }
            if (isRequestedCashReceipt) {
                if (businessNum === "" || depositor === "" || !selectedBankAccount?.nbkk_rcpmny_accnt_no)
                    notifyMessage("현금영수증 정보가 없습니다.")
                return !!(businessNum !== "" && depositor !== "" && selectedBankAccount?.nbkk_rcpmny_accnt_no)
            } else return !!(depositor !== "" && selectedBankAccount?.nbkk_rcpmny_accnt_no);
        } else return true
        // selectedPaymentMethod === 1 : 무통장 입금
        // 무통장 입금 시 > 예금주명, 현금영수증 신청여부, 현금영수증 번호
    }

    setDeliveryItem = (item) => {
        this.setState({delivery_info: item})
    }

    // 상품 정보
    renderOrderProduct = () => {
        const {navigation, eCOMM_CD} = this.props;
        const {bid_cnt, bid_prc, selectedOptionItem} = navigation.state.params;
        const {purchaseType, isOpened, hasDeposit, detail, goods, dtl, auc_trd_mine, reserv_purchase_mine} = this.state;
        let type_title = ""
        if((purchaseType === "remain" || purchaseType === "remain_reserv") && goods.sale_mth_cd)
            type_title = eCOMM_CD[`${goods.sale_mth_cd}`]?.cd_nm
        return (
            <View style={purchaseType === "cart" ? styles.cardOrderProduct : styles.orderProduct}>
                {purchaseType === "cart" ? (
                    <View style={[styles.betweenCenter, {marginBottom: 10}]}>
                        <Text style={styles.title}>
                            {PaymentText.orderProduct}{" "}
                            <Text style={{color: Colors.MAIN_COLOR}}>{dtl.length || ""}</Text>
                        </Text>
                        <TouchableOpacity
                            onPress={() => this.setState({isOpened: !isOpened})}
                        >
                            <Text style={styles.fold}>
                                {isOpened ? PaymentText.fold : PaymentText.open}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text style={[styles.title, {marginBottom: 10}]}>
                        {PaymentText.orderProduct}
                    </Text>
                )}

                {(purchaseType === "remain") && (
                    <View style={styles.productBox}>
                        <View style={styles.purchaseTypeBox}>
                            <Text style={styles.purchaseType}>{type_title}</Text>
                        </View>
                        <Image style={styles.productImg} source={{uri: goods.thumb_url}}/>
                        <View>
                            <Text style={styles.productTitle} numberOfLines={1}>{goods.goods_nm}</Text>
                            <View style={styles.productPriceWrap}>
                                {/* 상품 입찰가 */}
                                <Text style={styles.productPrice}>
                                    {`${formattedNumber(parseInt(auc_trd_mine.tot_bid_amt))}${StoreText.won}`}
                                </Text>
                                <Text
                                    style={styles.depositText}>
                                    {`${StoreText.deposit}: ${formattedNumber(goods.dpst_amt_prc)}${StoreText.won}`}
                                </Text>
                            </View>
                            <Text style={styles.productOption}>
                                {/*{PaymentText.option}: {goods.option}*/}
                            </Text>
                            <Text style={styles.productQuantity}>
                                {PaymentText.quantity}: {auc_trd_mine.bid_cnt}개
                            </Text>
                        </View>
                    </View>
                )}

                {(purchaseType === "remain_reserv") && (
                    <View style={styles.productBox}>
                        <View style={styles.purchaseTypeBox}>
                            <Text style={styles.purchaseType}>{type_title}</Text>
                        </View>
                        <Image style={styles.productImg} source={{uri: goods.thumb_url}}/>
                        <View>
                            <Text style={styles.productTitle} numberOfLines={1}>{goods.goods_nm}</Text>
                            <View style={styles.productPriceWrap}>
                                {/* 상품 입찰가 */}
                                <Text style={styles.productPrice}>
                                    {`${formattedNumber(parseInt(reserv_purchase_mine.purchase_prc))}${StoreText.won}`}
                                </Text>
                                <Text
                                    style={styles.depositText}>
                                    {`${StoreText.deposit}: ${formattedNumber(goods.low_or_dpst_price)}${StoreText.won}`}
                                </Text>
                            </View>
                            <Text style={styles.productOption}>
                                {/*{PaymentText.option}: {goods.option}*/}
                            </Text>
                            <Text style={styles.productQuantity}>
                                {PaymentText.quantity}: {reserv_purchase_mine.purchase_cnt}개
                            </Text>
                        </View>
                    </View>
                )}

                {(purchaseType === "bid" || purchaseType === "reBid") && (
                    <View style={styles.productBox}>
                        <View style={styles.purchaseTypeBox}>
                            <Text style={styles.purchaseType}>{PaymentText.buyBid}</Text>
                        </View>
                        <Image style={styles.productImg} source={{uri: goods.thumb_url}}/>
                        <View>
                            <Text style={styles.productTitle} numberOfLines={1}>{goods.goods_nm}</Text>
                            <View style={styles.productPriceWrap}>
                                {/* 상품 입찰가 */}
                                <Text style={styles.productPrice}>
                                    {`${formattedNumber(parseInt(bid_prc))}${StoreText.won}`}
                                </Text>
                                <Text
                                    style={styles.depositText}>
                                    {`${StoreText.deposit}: ${formattedNumber(goods.dpst_amt_prc)}${StoreText.won}`}
                                </Text>
                            </View>
                            <Text style={styles.productOption}>
                                {/*{PaymentText.option}: {goods.option}*/}
                            </Text>
                            <Text style={styles.productQuantity}>
                                {PaymentText.quantity}: {bid_cnt}개
                            </Text>
                        </View>
                    </View>
                )}

                {(purchaseType === "group") && (
                    <View style={styles.productBox}>
                        <View style={styles.purchaseTypeBox}>
                            <Text style={styles.purchaseType}>{PaymentText.buyGroup}</Text>
                        </View>
                        <Image style={styles.productImg} source={{uri: goods.thumb_url}}/>
                        <View>
                            <Text style={styles.productTitle} numberOfLines={1}>{goods.goods_nm}</Text>
                            <View style={styles.productPriceWrap}>
                                {/* 상품 입찰가 */}
                                <Text style={styles.productPrice}>
                                    {`${formattedNumber(parseInt(bid_prc))}${StoreText.won}`}
                                </Text>
                                {/*<Text*/}
                                {/*    style={styles.depositText}>*/}
                                {/*    {`${StoreText.deposit}: ${formattedNumber(goods.dpst_amt_prc)}${StoreText.won}`}*/}
                                {/*</Text>*/}
                            </View>
                            <Text style={styles.productOption}>
                                {/*{PaymentText.option}: {goods.option}*/}
                            </Text>
                            <Text style={styles.productQuantity}>
                                {PaymentText.quantity}: {bid_cnt}개
                            </Text>
                        </View>
                    </View>
                )}

                {(purchaseType === "reserve") && (
                    <View style={styles.productBox}>
                        <View style={styles.purchaseTypeBox}>
                            <Text style={styles.purchaseType}>{PaymentText.buyReserve}</Text>
                        </View>
                        <Image style={styles.productImg} source={{uri: goods.thumb_url}}/>
                        <View>
                            <Text style={styles.productTitle} numberOfLines={1}>{goods.goods_nm}</Text>
                            <View style={styles.productPriceWrap}>
                                {/* 상품 입찰가 */}
                                <Text style={styles.productPrice}>
                                    {`${formattedNumber(goods.sale_prc)}${StoreText.won}`}
                                </Text>
                                <Text
                                    style={styles.depositText}>
                                    {`${StoreText.deposit}: ${formattedNumber(goods.dpst_amt_prc)}${StoreText.won}`}
                                </Text>
                            </View>
                            <Text style={styles.productOption}>
                                {`${PaymentText.option}: ${detail.goods_optn_nm}`}
                            </Text>
                            <Text style={styles.productQuantity}>
                                {PaymentText.quantity}: {detail.purchase_cnt}개
                            </Text>
                        </View>
                    </View>
                )}

                {isOpened && (purchaseType === "purchase" || purchaseType === "cart") &&
                dtl.map((product) => {
                    let product_pay = parseInt(product.tot_ord_dtl_amt)
                    return (
                        <View style={styles.productBox}>
                            <View style={styles.purchaseTypeBox}>
                                <Text style={styles.purchaseType}>{PaymentText.buyNow}</Text>
                            </View>
                            <Image style={styles.productImg} source={{uri: product.thumb_url}}/>
                            <View>
                                <Text style={styles.productTitle} numberOfLines={1}>{product.goods_nm}</Text>
                                <View style={styles.productPriceWrap}>
                                    <Text style={styles.productPrice}>
                                        {`${formattedNumber(product_pay || 0)}${StoreText.won}`}
                                    </Text>
                                    {/*{hasDeposit ? (*/}
                                    {/*    <Text style={styles.depositText}>({PaymentText.deposit}: 1,000원)</Text>*/}
                                    {/*) : null}*/}
                                </View>
                                <Text style={styles.productOption}>
                                    {PaymentText.option}: {product.goods_optn_nm} {product.add_optn.length > 0 ? ` / ${product.add_optn[0].add_optn_nm}` : ""}
                                </Text>
                                <Text style={styles.productQuantity}>
                                    {PaymentText.quantity}: {product.goods_cnt}개
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };
    // 결제자 정보
    renderOrdererInformation = () => {
        const {eSESSION} = this.props;
        return (
            <View style={styles.infoBox}>
                <Text style={styles.title}>{PaymentText.ordererInformation}</Text>
                <Text style={styles.name}>
                    {`${maskingId(eSESSION.mber_nm || "")}, ${maskingPhone(eSESSION.moblphon_no || "")}`}
                </Text>
            </View>
        );
    };
    // 배송지정보
    renderShippingInformation = () => {
        const {navigation} = this.props;
        const {
            purchaseType,
            isOpenedShippingInfoBox,
            selectedShippingOption,
            shippingInfoMessage,
            delivery_info,
        } = this.state;
        return (
            <View style={styles.infoBox}>
                <View style={[styles.betweenCenter, {marginBottom: 16}]}>
                    <Text style={styles.title}>{PaymentText.shippingInformation}</Text>
                    <TouchableOpacity
                        onPress={() => navigation.push("MySettingAddress", {
                            selectedAddressId: delivery_info?.dlvy_addr_no,
                            setDeliveryItem: this.setDeliveryItem
                        })}>
                        <Text style={styles.infomationChange}>
                            {PaymentText.infomationChange}
                        </Text>
                    </TouchableOpacity>
                </View>
                {delivery_info?.receiver_name ?
                    <Text
                        style={[styles.address, {marginBottom: 5}]}>{`${delivery_info.receiver_name}, ${maskingPhone(delivery_info.휴대폰번호 || "")}`}</Text>
                    : <Text style={[styles.address, {marginBottom: 5}]}>배송지 정보가 없습니다.</Text>}
                {delivery_info?.주소 ?
                    <Text style={styles.address}>{`${maskingAddress(delivery_info.주소)}, ${maskingAll(delivery_info.상세주소)}`}</Text>
                    : <Text style={styles.address}>배송지 정보를 등록해주세요.</Text>}

                <TouchableOpacity
                    style={[
                        styles.orderOptionBox,
                        {
                            borderBottomLeftRadius: isOpenedShippingInfoBox ? 0 : 5,
                            borderBottomRightRadius: isOpenedShippingInfoBox ? 0 : 5,
                        },
                    ]}
                    onPress={() =>
                        this.setState({
                            isOpenedShippingInfoBox: !isOpenedShippingInfoBox,
                        })
                    }
                >
                    <Text style={styles.orderOption}>
                        {selectedShippingOption.title}
                    </Text>
                    <Image
                        style={{width: 20, height: 20}}
                        source={require("../../assets/image/store/dropdown_btn_regular.png")}
                    />
                </TouchableOpacity>
                {isOpenedShippingInfoBox ? (
                    <View style={styles.shippingOptionBox}>
                        {shippingOptions.map((shippingOption) => {
                            const isActive =
                                selectedShippingOption.id === shippingOption.id;
                            return (
                                <TouchableOpacity
                                    style={styles.shippingOptionWrap}
                                    onPress={() =>
                                        this.setState({
                                            selectedShippingOption: shippingOption,
                                            isOpenedShippingInfoBox: false,
                                        }, () => this.updateDelivery())
                                    }
                                >
                                    <Text
                                        style={[styles.shippingOptionTitle, {
                                            fontFamily: isActive ? Fonts.AppleB : Fonts.AppleR,
                                            color: isActive ? Colors.MAIN_COLOR : "#222222",
                                        }]}
                                    >
                                        {shippingOption.title}
                                    </Text>
                                    {isActive && (
                                        <Image
                                            style={{width: 18, height: 12, marginTop: -3}}
                                            source={require("../../assets/image/signup/check_pink_48_dp_1_2.png")}
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ) : null}
                {!isOpenedShippingInfoBox && selectedShippingOption.id === 5 && (
                    <TextInputStr
                        boxStyle={styles.shippingOptionInput}
                        textForm={styles.textForm}
                        placeholder={PaymentText.shippingInfoPlaceholder}
                        placeholderTextColor="#bbbbbb"
                        value={shippingInfoMessage}
                        setValue={(str) => {
                            this.setState({shippingInfoMessage: str});
                        }}
                        onBlur={() => this.updateDelivery()}
                    />
                )}
                {isOpenedShippingInfoBox && <View style={{height: 120}}/>}
            </View>
        );
    };
    // 환불계좌 정보
    renderRefundAccount = () => {
        const {eCOMM_CD, navigation} = this.props;
        const {return_detail} = this.state;
        return (
            <View style={[styles.infoBox, {zIndex: -5}]}>
                <View style={[styles.betweenCenter, {marginBottom: 10}]}>
                    <Text style={styles.title}>
                        {PaymentText.refundAccount}
                        {/*{purchaseType === "cart"*/}
                        {/*    ? PaymentText.directDepositRefundAccount*/}
                        {/*    : PaymentText.refundAccount}*/}
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.push("MySettingAccount", {getRefundDetail: this.getRefundDetail})}>
                        <Text style={styles.infomationChange}>
                            {PaymentText.infomationChange}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.account}>
                    {return_detail?.refund_mn_no ?
                        `${eCOMM_CD[`${return_detail?.bank_cmpny_cd}`]?.cd_nm} ${maskingAccount(return_detail.bank_accnt_no)}, ${maskingId(return_detail.dpstr_nm || "")}`
                        : `${PaymentText.refundInfoMessage}`}
                </Text>
            </View>
        );
    };
    // 포인트 정보
    renderPurchaseBox = () => {
        const {isPoint, point, mber_detail, point_str, payment_price} = this.state;
        return (
            <View style={[styles.infoBox, {zIndex: -5}]}>
                <View style={[styles.betweenCenter, {marginBottom: 10}]}>
                    <Text style={styles.title}>{PaymentText.payment}</Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <View style={styles.purchaseBox}>
                        <Text style={styles.point}>{PaymentText.point}</Text>
                        <View style={styles.pointBox}>
                            <TextInputStr
                                boxStyle={{marginRight: 7.5}}
                                textForm={styles.textForm}
                                placeholder={"0"}
                                placeholderTextColor="#999999"
                                value={point_str}
                                keyboardType='numeric'
                                setValue={(str) => {
                                    this.setState({point_str: str, isPoint: false});
                                }}
                                onBlur={() => {
                                    let use_point = Math.round(parseInt(point_str) * 0.001) * 1000;
                                    if(payment_price < use_point)
                                        while (payment_price < use_point)
                                            use_point -= 1000
                                    if(parseInt(use_point) !== parseInt(point_str)) {
                                        notifyMessage("포인트 사용은 천원 단위부터 사용 가능합니다.");
                                        this.setState({point: parseInt(use_point), point_str: use_point + ""});
                                    } else if (parseInt(mber_detail.포인트 || 0) < parseInt(point_str)) {
                                        notifyMessage("보유한 포인트보다 많습니다.");
                                        this.setState({point_str: 0});
                                    } else if(parseInt(payment_price) < parseInt(point_str)) {
                                        notifyMessage("결제 금액보다 많습니다.");
                                        this.setState({point_str: 0});
                                    } else this.setState({point: point_str});
                                }}
                            />
                            <Text style={styles.pointLeft}>P</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.useBtn}
                        onPress={() => {
                            let use_point = Math.round(parseInt(mber_detail.포인트) * 0.001) * 1000
                            if(payment_price < use_point)
                                while (payment_price < use_point)
                                    use_point -= 1000
                            isPoint ?
                            this.setState({point: 0, point_str: 0, isPoint: !isPoint})
                                : use_point ? this.setState({point: use_point, point_str: use_point + "", isPoint: !isPoint}) : null
                        }}>
                        <Text style={styles.useBtnText}>
                            {!isPoint ? PaymentText.useAll : PaymentText.useCancel}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.leftoverPoint}>
                    {PaymentText.leftover}: {formattedNumber(parseInt(mber_detail.포인트 || 0) - parseInt(point || 0) || "")}P
                </Text>
            </View>
        );
    };

    renderPaymentInfoBox = () => {
        const {navigation} = this.props;
        const {bid_cnt, bid_prc} = navigation.state.params;
        const {point, purchaseType, goods, payment_price, detail, auc_trd_mine, reserv_purchase_mine} = this.state;
        return (
            <View style={styles.infoBox}>
                {purchaseType === "cart" || purchaseType === "purchase" ? (
                    <View style={styles.betweenCenter}>
                        <View>
                            <Text style={styles.paymentInfoTitle}>
                                {PaymentText.totalProductAmount}
                            </Text>
                            <Text style={[styles.paymentInfoTitle, {marginVertical: 10}]}>
                                {PaymentText.redeemPoints}
                            </Text>
                            <Text style={styles.paymentInfoTitle}>
                                {PaymentText.shippingFee}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.paymentInfoDesc}>
                                {`${formattedNumber(detail.tot_ord_amt || 0)}${StoreText.won}`}
                            </Text>
                            <Text style={[styles.paymentInfoDesc, {marginVertical: 10}]}>
                                {`${formattedNumber(point || 0)}${StoreText.won}`}
                            </Text>
                            <Text
                                style={styles.paymentInfoDesc}>{detail.tot_dlvy_cost_amt === "0" ? PaymentText.free : formattedNumber(detail.tot_dlvy_cost_amt || 0)}</Text>
                        </View>
                    </View>
                ) : purchaseType === "group" ? (
                    <View>
                        <View
                            style={[
                                styles.betweenCenter,
                                {backgroundColor: "#f5f5f5", height: 30},
                            ]}
                        >
                            <Text style={styles.paymentOtherText}>
                                {PaymentText.productPrice}
                            </Text>
                            <Text style={styles.paymentOtherPrice}>
                                {/* 상품 입찰가 + 배송비 */}
                                {`${formattedNumber((parseInt(bid_prc)))}${StoreText.won}`}
                            </Text>
                        </View>
                        <View style={[styles.betweenCenter, {marginTop: 8}]}>
                            <Text style={styles.paymentInfoTitle}>{PaymentText.redeemPoints}</Text>
                            <Text style={styles.paymentInfoDesc}>
                                {`${formattedNumber(point || 0)}${StoreText.won}`}
                            </Text>
                        </View>
                        <View style={[styles.betweenCenter, {marginTop: 8}]}>
                            <Text style={styles.paymentInfoTitle}>
                                {PaymentText.shippingFee}
                            </Text>
                            <Text
                                style={styles.paymentInfoDesc}>{`${formattedNumber(goods.dlvy_cost_prc)}${StoreText.won}`}</Text>
                        </View>
                    </View>
                ) : purchaseType === "remain" ? ( // 잔금결제
                    <View>
                        <View style={[styles.betweenCenter, {backgroundColor: "#f5f5f5", height: 30},]}>
                            <Text style={styles.paymentOtherText}>
                                {PaymentText.paymentBalance}
                            </Text>
                            <Text style={styles.paymentOtherPrice}>
                                {`${formattedNumber((parseInt(auc_trd_mine.remain_amt || 0) - parseInt(goods.dlvy_cost_prc || 0)))}${StoreText.won}`}
                            </Text>
                        </View>
                        <View style={[styles.betweenCenter, {marginTop: 8}]}>
                            <Text style={styles.paymentInfoTitle}>{PaymentText.redeemPoints}</Text>
                            <Text style={styles.paymentInfoDesc}>
                                {`${formattedNumber(point || 0)}${StoreText.won}`}
                            </Text>
                        </View>
                        <View style={[styles.betweenCenter, {marginTop: 8}]}>
                            <Text style={styles.paymentInfoTitle}>
                                {PaymentText.shippingFee}
                            </Text>
                            <Text
                                style={styles.paymentInfoDesc}>{`${formattedNumber(goods.dlvy_cost_prc)}${StoreText.won}`}</Text>
                        </View>
                    </View>
                ) : purchaseType === "remain_reserv" ? ( // 예약구매 : 잔금결제
                    <View>
                        <View style={[styles.betweenCenter, {backgroundColor: "#f5f5f5", height: 30},]}>
                            <Text style={styles.paymentOtherText}>
                                {PaymentText.paymentBalance}
                            </Text>
                            <Text style={styles.paymentOtherPrice}>
                                {`${formattedNumber((parseInt(reserv_purchase_mine.remain_amt || 0) - parseInt(goods.dlvy_cost_prc || 0)))}${StoreText.won}`}
                            </Text>
                        </View>
                        <View style={[styles.betweenCenter, {marginTop: 8}]}>
                            <Text style={styles.paymentInfoTitle}>{PaymentText.redeemPoints}</Text>
                            <Text style={styles.paymentInfoDesc}>
                                {`${formattedNumber(point || 0)}${StoreText.won}`}
                            </Text>
                        </View>
                        <View style={[styles.betweenCenter, {marginTop: 8}]}>
                            <Text style={styles.paymentInfoTitle}>
                                {PaymentText.shippingFee}
                            </Text>
                            <Text
                                style={styles.paymentInfoDesc}>{`${formattedNumber(goods.dlvy_cost_prc)}${StoreText.won}`}</Text>
                        </View>
                    </View>
                ) : ( // 예약구매, 경매구매
                    <View>
                        <View
                            style={[
                                styles.betweenCenter,
                                {backgroundColor: "#f5f5f5", height: 30},
                            ]}
                        >
                            <Text style={styles.paymentOtherText}>
                                {purchaseType === "reserve"
                                    ? PaymentText.productPrice
                                    : PaymentText.productBid}
                            </Text>
                            <Text style={styles.paymentOtherPrice}>
                                {`${formattedNumber(parseInt(purchaseType === "reserve" ? detail.purchase_prc : bid_prc))}${StoreText.won}`}
                            </Text>
                        </View>
                        <View style={[styles.betweenCenter, {marginTop: 8}]}>
                            <Text style={styles.paymentInfoTitle}>
                                {purchaseType === "reserve"
                                    ? PaymentText.reservationDeposit
                                    : PaymentText.bidDeposit}
                            </Text>
                            <Text
                                style={styles.paymentInfoDesc}>{`${formattedNumber(goods.dpst_amt_prc)}${StoreText.won}`}</Text>
                        </View>
                        <View style={[styles.betweenCenter, {marginTop: 8}]}>
                            <Text style={styles.paymentInfoTitle}>{PaymentText.redeemPoints}</Text>
                            <Text style={styles.paymentInfoDesc}>
                                {`${formattedNumber(point || 0)}${StoreText.won}`}
                            </Text>
                        </View>
                        <View style={[styles.betweenCenter, {marginTop: 8}]}>
                            <Text style={styles.paymentInfoTitle}>
                                {PaymentText.shippingFee}
                            </Text>
                            <Text
                                style={styles.paymentInfoDesc}>{`${formattedNumber(goods.dlvy_cost_prc)}${StoreText.won}`}</Text>
                        </View>
                    </View>
                )}

                <View style={[styles.betweenCenter, styles.totalPayment]}>
                    <Text style={styles.paymentAmountTitle}>
                        {PaymentText.totalPaymentAmount}
                    </Text>
                    <Text style={styles.paymentAmount}>
                        {`${formattedNumber(parseInt(payment_price) - parseInt(point || 0))}${StoreText.won}`}
                        {/*{purchaseType === "cart" || purchaseType === "purchase" ? `${formattedNumber("4546500")}` : `${formattedNumber(payment_price)}`}{`${StoreText.won}`}*/}
                    </Text>
                </View>
            </View>
        );
    };

    renderPaymentMethod = () => {
        const {navigation, eCOMM_CD, eSESSION} = this.props;
        const {purchaseType} = navigation.state.params;
        const {
          selectedPaymentMethod,
          depositor,
          isOpenedAccountBox,
          selectedBankAccount,
          bankAccounts,
          isOpenedEasyPaymentBox,
          selectedEasyPayment,
        } = this.state;
        let top = 182;
        if(paymentMethod.length === 3) top += 38;
        return (
          <View style={styles.infoBox}>
            <Text style={styles.title}>{PaymentText.paymentMethod}</Text>
            <View style={{ marginTop: 2 }}>
              {paymentMethod.map((pm) => {
                // 무통장입금 : 기업회원 && purchase, group, remain 일 때만 가능
                if (
                  (eSESSION.mber_se_cd === CodeText.mber_se_cd_g ||
                    purchaseType === "bid" ||
                    purchaseType === "reBid" ||
                    purchaseType === "reserve") &&
                  pm.id === 1
                )
                  return null;
                else
                  return (
                    <RadioButton
                      label={pm.title}
                      isActive={pm.id === selectedPaymentMethod}
                      setActive={() =>
                        this.setState({ selectedPaymentMethod: pm.id })
                      }
                    />
                  );
              })}
            </View>
            {selectedPaymentMethod === 3 && (
              <TouchableOpacity
                style={[
                  styles.orderOptionBox,
                  {
                    borderBottomLeftRadius: isOpenedEasyPaymentBox ? 0 : 5,
                    borderBottomRightRadius: isOpenedEasyPaymentBox ? 0 : 5,
                  },
                ]}
                onPress={() =>
                  this.setState({
                    isOpenedEasyPaymentBox: !isOpenedEasyPaymentBox,
                  })
                }
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.orderOption}>
                    {selectedEasyPayment.title}
                  </Text>
                  <Image
                    style={{ width: 50, height: 20 }}
                    source={selectedEasyPayment.imagePath}
                  />
                </View>

                <Image
                  style={{ width: 20, height: 20 }}
                  source={require("../../assets/image/store/dropdown_btn_regular.png")}
                />
              </TouchableOpacity>
            )}
            {selectedPaymentMethod === 3 && isOpenedEasyPaymentBox && (
              <View
                style={styles.easyPaymentBox}
              >
                {easyPayments.map((easyPayment) => {
                  return (
                    <TouchableOpacity
                      style={[
                        styles.shippingOptionWrap,
                        { flexDirection: "row", paddingVertical: 8 },
                      ]}
                      onPress={() =>
                        this.setState({
                          selectedEasyPayment: easyPayment,
                          isOpenedEasyPaymentBox: false,
                        })
                      }
                    >
                      <Text
                        style={styles.easyPayment}
                      >
                        {easyPayment.title}
                      </Text>
                      <Image
                        style={{ width: 50, height: 20 }}
                        source={easyPayment.imagePath}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            {selectedPaymentMethod === 1 && ( // 무통장입금
              <TouchableOpacity
                style={[
                  styles.orderOptionBox,
                  {
                    borderBottomLeftRadius: isOpenedAccountBox ? 0 : 5,
                    borderBottomRightRadius: isOpenedAccountBox ? 0 : 5,
                  },
                ]}
                onPress={() =>
                  this.setState({ isOpenedAccountBox: !isOpenedAccountBox })
                }
              >
                <Text style={styles.orderOption}>
                  {`${
                    eCOMM_CD[`${selectedBankAccount.bank_cmpny_cd}`]?.cd_nm
                  } (${selectedBankAccount.accnt_no})`}
                </Text>
                <Image
                  style={{ width: 20, height: 20 }}
                  source={require("../../assets/image/store/dropdown_btn_regular.png")}
                />
              </TouchableOpacity>
            )}

            {isOpenedAccountBox ? ( // 무통장입금
              <View style={[styles.accountBox, { top: top }]}>
                {bankAccounts.map((bankAccount) => {
                  const isActive =
                    selectedBankAccount.nbkk_rcpmny_accnt_no ===
                    bankAccount.nbkk_rcpmny_accnt_no;
                  return (
                    <TouchableOpacity
                      style={styles.accountBoxWrap}
                      onPress={() =>
                        this.setState({
                          selectedBankAccount: bankAccount,
                          isOpenedAccountBox: false,
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.accountBoxText,
                          {
                            fontFamily: isActive ? Fonts.AppleB : Fonts.AppleR,
                            color: isActive ? Colors.MAIN_COLOR : "#222222",
                          },
                        ]}
                      >
                        {`${eCOMM_CD[`${bankAccount.bank_cmpny_cd}`]?.cd_nm} (${
                          bankAccount.accnt_no
                        })`}
                      </Text>
                      {isActive && (
                        <Image
                          style={{ width: 18, height: 12, marginTop: -3 }}
                          source={require("../../assets/image/signup/check_pink_48_dp_1_2.png")}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
            {selectedPaymentMethod === 1 && ( // 무통장입금
              <TextInputStr
                boxStyle={styles.depositorBox}
                textForm={styles.orderOption}
                placeholder={PaymentText.depositor}
                placeholderTextColor="#dddddd"
                value={depositor}
                setValue={(str) => {
                  this.setState({ depositor: str });
                }}
                onBlur={() => this.setState({ isFocus: false })}
                onFocus={() => this.setState({ isFocus: true })}
              />
            )}
            {selectedPaymentMethod === 1 && ( // 무통장입금
              <Text style={styles.depositorMessage}>
                {PaymentText.depositorMessage}
              </Text>
            )}
          </View>
        );
    };

    renderCashReceiptRequest = () => {
        const {isRequestedCashReceipt, businessNum} = this.state;
        return (
            <View style={{marginTop: 20, zIndex: -5}}>
                <Text style={styles.cashReceiptText}>
                    {PaymentText.cashReceiptRequest}
                </Text>
                <View
                    style={{flexDirection: "row", alignItems: "center", marginTop: 2}}
                >
                    <RadioButton
                        label={PaymentText.forProofOfExpenses}
                        isActive={isRequestedCashReceipt}
                        setActive={() => this.setState({isRequestedCashReceipt: true})}
                        style={{marginRight: 27}}
                    />
                    <RadioButton
                        label={PaymentText.notApplied}
                        isActive={!isRequestedCashReceipt}
                        setActive={() => this.setState({isRequestedCashReceipt: false})}
                    />
                </View>
                {isRequestedCashReceipt && (
                    <TextInputStr
                        boxStyle={styles.depositorBox}
                        textForm={styles.orderOption}
                        placeholder={PaymentText.businessNumber}
                        placeholderTextColor="#dddddd"
                        value={businessNum}
                        keyboardType='numeric'
                        setValue={(str) => {
                            this.setState({businessNum: str});
                        }}
                        onBlur={() => this.setState({isFocus: false})}
                        onFocus={() => this.setState({isFocus: true})}
                    />
                )}
            </View>
        );
    };

    renderSubmitBtns = () => {
        const {purchaseType, payment_price, point} = this.state;
        return (
            <View style={styles.submitBtnBox}>
                <TouchableOpacity
                    style={styles.submitBox}
                    onPress={() => {
                        if (this.handleIsSubmit())
                            if (purchaseType === "bid" || purchaseType === "reBid") { // 경매 구매 시, 입찰/재입찰
                                this.handleAuc();
                            } else if (purchaseType === "group") {
                                this.handleCoper();
                            } else if (purchaseType === "reserve") {
                                this.handleReserve();
                            } else if (purchaseType === "remain") {
                                this.handlePayAucRemain() // 경매거래 : 잔금결제
                            } else if (purchaseType === "remain_reserv") {
                                this.handleReservRemain() // 예약거래 : 잔금결제
                            } else { // PG사 연결 > 즉시구매
                                this.handleImmedi();
                            }
                    }}
                >
                    <Text style={styles.submit}>
                        {purchaseType === "bid" ||
                        purchaseType === "reBid" ||
                        purchaseType === "reserve"
                            ? `${PaymentText.deposit} `
                            : ""}
                        {`${formattedNumber(parseInt(payment_price) - parseInt(point || 0))}${StoreText.won} ${PaymentText.purchase}`}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        const {navigation} = this.props;
        const {isFocus, isLoading, purchaseType, isBalancePayment, selectedPaymentMethod, isOpenedShippingInfoBox} = this.state;
        if (isLoading)
            return null;
        else
            return (
                <View style={styles.container}>
                    <TopHeader
                        title={`${PaymentText.productPurchase}${
                            isBalancePayment ? `-${PaymentText.balancePayment}` : ""
                        }`}
                        navigation={navigation}
                        hasRightBtn={false}
                    />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{paddingHorizontal: 20}}>
                        {this.renderOrderProduct()}
                        {this.renderOrdererInformation()}
                        {(purchaseType !== "bid") &&
                        this.renderShippingInformation()}

                        {!isOpenedShippingInfoBox && this.renderRefundAccount()}
                        {this.renderPurchaseBox()}
                        {this.renderPaymentInfoBox()}
                        {this.renderPaymentMethod()}
                        {selectedPaymentMethod === 1 && this.renderCashReceiptRequest()}
                        {isFocus && Platform.OS === 'ios' ? <View style={{height: 230}}/> : <View style={{height: 50}}/>}
                    </ScrollView>

                    {this.renderSubmitBtns()}
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
    getStoreDetail: (params) => dispatch(ActionGoods.getStoreDetail(params)),
    // 배송지 정보
    getDeliveryList: (params) => dispatch(ActionAccount.getDeliveryList(params)),
    updateDelivery: (params) => dispatch(ActionAccount.updateDelivery(params)),
    createOrderDlvy: (params) => dispatch(ActionAccount.createOrderDlvy(params)),
    // 주문서 상세 API
    getMberDetail: (params) => dispatch(ActionMber.getDetail(params)), // 내 정보
    getRefundDetail: (params) => dispatch(ActionRefund.getDetail(params)), // 환불계좌 정보
    getNbkkList: (params) => dispatch(ActionNbkk.getList(params)), // 무통장 리스트
    // 경매거래
    createAuc: (params) => dispatch(ActionAuc.create(params)),
    updateAuc: (params) => dispatch(ActionAuc.update(params)),
    createPayAuc: (params) => dispatch(ActionPayment.createAuc(params)),
    createPayAucPoint: (params) => dispatch(ActionPayment.createAucPoint(params)),
    createPayAucRemain: (params) => dispatch(ActionPayment.createAucRemain(params)),
    createPayAucRemainPoint: (params) => dispatch(ActionPayment.createAucRemainPoint(params)),
    createPayAucRemainTransfer: (params) => dispatch(ActionPayment.createAucRemainTransfer(params)),
    // 공동구매
    createCoper: (params) => dispatch(ActionCoper.create(params)),
    createPayCoper: (params) => dispatch(ActionPayment.createCoper(params)),
    createPayCoperPoint: (params) => dispatch(ActionPayment.createCoperPoint(params)),
    // 즉시구매
    getDetail: (params) => dispatch(ActionImmedi.getDetail(params)),
    createImmedi: (params) => dispatch(ActionPayment.createImmedi(params)),
    createImmediPoint: (params) => dispatch(ActionPayment.createImmediPoint(params)),
    createImmediTransfer: (params) => dispatch(ActionPayment.createImmediTransfer(params)),
    // 예약구매
    getReservDetail: (params) => dispatch(ActionReserve.getDetail(params)),
    createReservPoint: (params) => dispatch(ActionPayment.createReservPoint(params)),
    createReservRemainPoint: (params) => dispatch(ActionPayment.createReservRemainPoint(params)),
    createReservRemainTransfer: (params) => dispatch(ActionPayment.createReservRemainTransfer(params)),
    // point available
    availableImmedi: (params) => dispatch(ActionPayment.availableImmedi(params)),
    availableAucDpst: (params) => dispatch(ActionPayment.availableAucDpst(params)),
    availableAucRemain: (params) => dispatch(ActionPayment.availableAucRemain(params)),
    availableReservDpst: (params) => dispatch(ActionPayment.availableReservDpst(params)),
    availableReservRemain: (params) => dispatch(ActionPayment.availableReservRemain(params)),
    availableCoper: (params) => dispatch(ActionPayment.availableCoper(params)),

});
export default connect(mapStateToProps, mapDispatchToProps)(Payment);
