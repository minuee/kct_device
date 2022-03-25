// 스토어 상품상세 > 상품구매 화면
import React, {Component} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    FlatList, ScrollView,
} from "react-native";
import {connect} from "react-redux";

import {DEVICE_WIDTH} from "../../../model/lib/Utils/Constants";
import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";
import {CodeText, Generic, PaymentText, StoreText, TOKEN} from "../../../model/lib/Utils/Strings";
import {formattedNumber, notifyMessage} from "../../../model/lib/Utils";
import * as dateUtil from "../../../model/lib/Utils/Date";

import {TopHeader} from "../../../component/TopHeader";
import SaleModal from "../../../component/modal/SaleModal";

import * as ActionGoods from "../../../model/action/eGOODS";
import * as ActionBasket from "../../../model/action/eBASKET";
import * as ActionImmedi from "../../../model/action/eIMMEDI_PURCHASE";
import * as ActionAuc from "../../../model/action/eAUC_TRD";
import * as ActionReserve from "../../../model/action/eRESERV_PURCHASE";
import {build_type} from "../../../model/api";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    downArrow: {
        width: 16,
        height: 16,
    },
    productImg: {
        width: 95,
        height: 95,
        borderRadius: 5,
        borderStyle: "solid",
        borderWidth: 0.3,
        borderColor: "#ffffff",
        marginRight: 14,
    },
    product: {
        fontFamily: Fonts.AppleR,
        fontSize: 17,
        color: "#2a2e34",
    },
    optionsBox: {
        width: "70%",
        height: 40,
        borderRadius: 2.5,
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: 0.3,
        borderColor: "#707070",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 14,
        alignItems: "center",
        marginTop: 6.5,
    },
    option: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        color: "#333333",
    },
    additionalOption: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        color: "#777777",
        marginTop: 12,
    },
    immediatePurchasePrice: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        color: "#969696",
    },
    priceBox: {
        marginTop: 4,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    price: {
        borderBottomColor: "#d5d5d5",
        borderBottomWidth: 1,
        marginRight: 13,
        width: "90%",
        height: 40,
        justifyContent: "center",
    },
    priceText: {
        fontFamily: Fonts.AppleB,
        fontSize: 16,
        color: "#191919",
    },
    won: {
        fontSize: 13,
        color: "#595959",
        lineHeight: 40,
    },
    desc: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        color: "#595959",
    },
    rowCenter: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    quantity: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        color: "#2d2d2d",
        marginHorizontal: 19,
    },
    plus: {width: 25, height: 25},
    quantityBox: {
        marginTop: 20,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    otherOptionBox: {
        height: 45,
        borderBottomWidth: 0.5,
        borderBottomColor: "#d5d5d5",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    divider: {
        width: "100%",
        height: 2,
        backgroundColor: "#191919",
        marginTop: 40,
    },
    submitBtns: {
        position: 'absolute',
        bottom: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        paddingBottom: 26.5,
        alignSelf: 'center'
    },
    submitBtn: {
        height: 50,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        width: "49%",
    },
    submitBtnBox: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#999999",
    },
    toastBox: {
        position: "absolute",
        bottom: 86,
        height: 35,
        opacity: 0.75,
        borderRadius: 5,
        backgroundColor: "#000000",
        paddingLeft: 13.2,
        paddingRight: 14.2,
        width: "85%",

        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        alignSelf: "center",
    },
    toast: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        color: "#f5f5f5",
    },
    goToCart: {
        fontFamily: Fonts.AppleB,
        fontSize: 12,
        color: "#ff5bc3",
        textDecorationLine: "underline",
    },
    cart: {
        fontFamily: Fonts.AppleR,
        fontSize: 18,
        color: "#000000",
    },
    productPurchase: {
        fontFamily: Fonts.AppleR,
        fontSize: 18,
        color: "white",
    },
    warningToast: {
        position: "absolute",
        bottom: 86,
        height: 30,
        opacity: 0.75,
        borderRadius: 5,
        backgroundColor: "#000000",
        paddingHorizontal: 16.2,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        alignSelf: "center",
    },
    submitOneBtn: {
        position: "absolute",
        width: DEVICE_WIDTH - 40,
        marginHorizontal: 20,
        bottom: 20,
        height: 50,

        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    optionWrap: {
        width: "70%",
        position: "absolute",
        top: 66,
        zIndex: 10,
        paddingTop: 15,
        borderWidth: 0.3,
        borderColor: "#707070",
        backgroundColor: "white",
    },
    optionBtnWrap: {
        paddingLeft: 15,
        paddingBottom: 10,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
    },
});

class StorePayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            pageType: props.navigation.state.params.pageType,
            isShowToast: false,
            isShowWarningToast: false,
            toast_type: 0, // 0 : 재입찰, 1 : 입찰
            bidPrice: "",
            isOpened: false,
            selectedOption: props.navigation.state.params?.selected_optn || null, // 상품 옵션
            selectedOptionItem: {},
            isShowSaleModal: false,

            // 즉시구매 데이터
            goods: {},
            img_list: [],
            cntnts_list: [],
            goods_optn: [],
            optn_count: 0,
            ea: 0, // 수량

            // 경매거래 데이터
            auc_trd_mine: {},
            auc_trd_recent_bid_prc: 0,
            max_limit: 0,
        };
    }

    componentDidMount() {
        this.getStoreDetail();
    }

    // 예약구매 신청
    handleReserve = () => {
        const {navigation} = this.props;
        const {goods_no, add_optn} = navigation.state.params;
        const {ea, selectedOptionItem, goods} = this.state;
        let params = {
            purchase_cnt: ea,
            goods_no: goods_no
        }
        if(selectedOptionItem?.goods_optn_no) // 옵션 선택값
            Object.assign(params, {goods_optn_no: selectedOptionItem.goods_optn_no});
        this.props.createReserve(params).then((res) => {
            if (add_optn?.add_optn_no)
                this.handleReserveOptn(res.detail.reserv_purchase_no, add_optn?.add_optn_no)
            else {
                if(build_type === TOKEN.build_type_txt) {
                    navigation.navigate("Payment", {
                        purchaseType: "reserve",
                        goods: goods,
                        reserv_purchase_no: res.detail.reserv_purchase_no
                    })
                } else {
                    navigation.navigate("PaymentResult", {
                        purchaseType: "reserve",
                        sale_mth_cd: CodeText.sale_mth_cd_r, // 예약거래
                    })
                }
            }

        }).catch((err) => {
        });
    }
    // 예약구매 추가옵션
    handleReserveOptn = (reserv_purchase_no, add_optn_no) => {
        const {navigation} = this.props;
        const {goods} = this.state;
        let params = {
            reserv_purchase_no: reserv_purchase_no,
            add_optn_no: add_optn_no,
        }
        this.props.createReserveOptn(params).then((res) => {
            if(build_type === TOKEN.build_type_txt) {
                navigation.navigate("Payment", {
                    purchaseType: "reserve",
                    goods: goods,
                    reserv_purchase_no: reserv_purchase_no
                })
            } else {
                navigation.navigate("PaymentResult", {
                    purchaseType: "reserve",
                    sale_mth_cd: CodeText.sale_mth_cd_r, // 예약거래
                })
            }
        }).catch((err) => {
        });
    }

    /*  function START */
    getStoreDetail = () => {
        const {navigation} = this.props;
        const {goods_no} = navigation.state.params;
        const {pageType} = this.state;
        console.log("goods_no", goods_no)
        let params = {
            goods_no: goods_no
        }

        this.props.getStoreDetail(params).then((res) => {
            if (pageType === "purchase" || pageType === "reserve") { // 즉시구매
                const {selected_optn} = navigation.state.params;

                const optn = res.goods_optn?.filter((item) => item.goods_optn_no === selected_optn)[0]
                console.log("selected_optn")
                console.log(optn)
                console.log(optn.goods_cnt)

                this.setState({
                    isLoading: false,
                    goods: res.goods,
                    img_list: res.img_list,
                    goods_optn: res.goods_optn,
                    optn_count: parseInt(res.optn_count),
                    ea: res.goods.min_ord_cnt ? parseInt(res.goods.min_ord_cnt) : 1,
                    selectedOptionItem: optn,
                    max_limit: optn.goods_cnt
                })
            } else if (pageType === "bid" || pageType === "reBid") // 경매구매
                this.setState({
                    isLoading: false,
                    goods: res.goods,
                    img_list: res.img_list,
                    ea: res.goods.sale_cnt,
                    auc_trd_mine: res.auc_trd_mine,
                    auc_trd_recent_bid_prc: res.auc_trd_recent_bid_prc
                })
            else if (pageType === "group") {
                const cal_cnt = parseInt(res.goods.sale_cnt || 0) - parseInt(res.goods.sale_cnt_copertn || 0);
                this.setState({
                    isLoading: false,
                    goods: res.goods,
                    img_list: res.img_list,
                    bidPrice: res.goods.sale_prc,
                    ea: res.goods.min_ord_cnt ? parseInt(res.goods.min_ord_cnt) : 1,
                    max_limit: cal_cnt
                })
            }
        }).catch((err) => {
        });
    }
    // 장바구니 생성
    createCart = () => {
        const {navigation, eSESSION} = this.props;
        const {goods_no, add_optn} = navigation.state.params;
        const {ea, selectedOption} = this.state;
        let params = {
            goods_no: goods_no,
            basket_no: eSESSION.basket_no,
            ord_cnt: ea,
        }

        if (selectedOption)
            Object.assign(params, {goods_optn_no: selectedOption})

        console.log("createCart")
        console.log(params)

        this.props.createCart(params).then((res) => {
            if (add_optn?.add_optn_no)
                this.createOptn(res.detail.basket_dtl_no)
            else {
                this.setState({isShowToast: true});
                setTimeout(() => {
                    this.setState({isShowToast: false});
                }, 3000);
            }
        }).catch((err) => {
        });
    }
    // 장바구니 추가옵션 생성
    createOptn = (basket_dtl_no) => {
        const {navigation} = this.props;
        const {add_optn} = navigation.state.params;
        let params = {
            basket_dtl_no: basket_dtl_no,
            add_optn_no: add_optn.add_optn_no
        }

        this.props.createOptn(params).then((res) => {
            this.setState({isShowToast: true});
            setTimeout(() => {
                this.setState({isShowToast: false});
            }, 3000);
        }).catch((err) => {
        });
    }
    // 주문서 생성
    handleCreate = () => {
        this.props.create({}).then((res) => {
            this.handleCreateDetail(res.detail.immedi_purchase_ord_no)
            // handleCreateDetail이 끝나고 navigation 진행 되어야 함
            // navigation.navigate("Payment", {
            //     purchaseType: "purchase",
            //     immedi_purchase_ord_no: res.detail.immedi_purchase_ord_no
            // })
        }).catch((err) => {
        });
    }
    // 주문서에 상품 생성
    handleCreateDetail = (immedi_purchase_ord_no) => {
        const {navigation} = this.props;
        const {goods_no, add_optn} = navigation.state.params;
        const {ea, selectedOptionItem} = this.state;
        let params = {
            immedi_purchase_ord_no: immedi_purchase_ord_no,
            goods_cnt: ea,
            goods_no: goods_no,
        }
        if (selectedOptionItem?.goods_optn_no)
            Object.assign(params, {goods_optn_no: selectedOptionItem.goods_optn_no});
        console.log("handleCreateDetail")
        console.log(params)
        this.props.createDetail(params).then((res) => {
            if (add_optn?.add_optn_no) { // 추가 옵션 확인 (ex. 투명 케이스, USB 충전기 등등)
                let dtl_list = (res.detail.dtl || []).filter((item) => item.goods_no === goods_no)
                if (dtl_list.length > 0)
                    this.handleCreateOptn(immedi_purchase_ord_no, dtl_list[0].immedi_purchase_ord_dtl_no, add_optn.add_optn_no)
                else this.handleDelete(immedi_purchase_ord_no)
            } else
                navigation.navigate("Payment", {
                    purchaseType: "purchase",
                    immedi_purchase_ord_no: immedi_purchase_ord_no
                })
        }).catch((err) => {
            this.handleDelete(immedi_purchase_ord_no)
        });
    }
    // 주문서에 등록된 상품에 추가옵션 생성
    handleCreateOptn = (immedi_purchase_ord_no, immedi_purchase_ord_dtl_no, add_optn_no) => {
        const {navigation} = this.props;
        let params = {
            immedi_purchase_ord_no: immedi_purchase_ord_no,
            immedi_purchase_ord_dtl_no: immedi_purchase_ord_dtl_no,
            add_optn_no: add_optn_no,
        }
        console.log("handleCreateOptn")
        console.log(params)
        this.props.createImmediOptn(params).then((res) => {
            navigation.navigate("Payment", {
                purchaseType: "purchase",
                immedi_purchase_ord_no: immedi_purchase_ord_no
            })
        }).catch((err) => {
        });
    }
    // 상품 등록 중 오류가 발생하면, 주문서 삭제
    handleDelete = (immedi_purchase_ord_no) => {
        let params = {
            immedi_purchase_ord_no: immedi_purchase_ord_no
        }
        this.props.removeImmedi(params).then((res) => {

        }).catch((err) => {
            notifyMessage(PaymentText.deletePayment);
        });
    }
    // 경매 재입찰
    handleAuc = () => {
        const {navigation} = this.props;
        const {goods, bidPrice, auc_trd_mine} = this.state;
        let params = {
            bid_prc: bidPrice,
            // goods_no: goods.goods_no,
            auc_trd_no: auc_trd_mine.auc_trd_no
        }
        console.log("params")
        console.log(params)
        this.props.updateAuc(params).then((res) => {
            // 재입찰 시, 재입찰 완료 페이지
            this.setState({isShowSaleModal: false})
            navigation.navigate("PaymentResult", {
                purchaseType: "reBid",
                selectedPaymentMethod: {},
            })
        }).catch((err) => {
        });
    }
    /*  function END */


    /*  render START */
    renderProductOtherOptions = (title, desc, fontFamily, color) => {
        return (
            <View style={styles.otherOptionBox}>
                <Text style={styles.desc}>{title}</Text>
                <Text
                    style={{
                        fontFamily: fontFamily,
                        fontSize: 14,
                        color: color,
                    }}
                >
                    {desc}
                </Text>
            </View>
        );
    };

    renderCartToast = () => {
        const {navigation} = this.props;
        const {isShowToast, pageType} = this.state;
        if (pageType === "purchase") {
            if (isShowToast) {
                return (
                    <View style={styles.toastBox}>
                        <Text style={styles.toast}>장바구니에 상품이 담겼습니다!</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Cart", {pop: true})}>
                            <Text style={styles.goToCart}>장바구니로 가기</Text>
                        </TouchableOpacity>
                    </View>
                );
            } else {
                return <View style={{height: 69.5}}/>;
            }
        }
    };

    renderPriceBox = () => {
        const {navigation} = this.props;
        const {add_optn} = navigation.state.params;
        const {pageType, bidPrice, goods, ea, auc_trd_mine, selectedOptionItem, auc_trd_recent_bid_prc} = this.state;
        const priceTitle =
            pageType === "purchase"
                ? StoreText.immediatePurchasePrice
                : pageType === "reserve"
                    ? StoreText.deposit
                    : pageType === "group"
                        ? StoreText.jointPurchasePrice
                        : StoreText.productBidPrice;
        let orderPrice = parseInt(goods.sale_prc) + parseInt(selectedOptionItem?.add_prc_sum || 0)
        if (add_optn?.add_amt)
            orderPrice += parseInt(add_optn.add_amt)
        return (
            <View style={{marginTop: 25}}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={styles.immediatePurchasePrice}>{priceTitle}</Text>
                    {(pageType === "reBid" || pageType === "bid") && (
                        <Text
                            style={{
                                fontFamily: Fonts.AppleR,
                                fontSize: 12,
                                color: Colors.MAIN_COLOR,
                            }}
                        >
                            {`${StoreText.latestBid}: ${formattedNumber(auc_trd_recent_bid_prc)}${StoreText.won}`}
                        </Text>
                    )}
                </View>

                {pageType === "group" ? (
                    <View style={styles.priceBox}>
                        <View style={styles.price}>
                            <Text style={styles.priceText}>{formattedNumber(orderPrice)}</Text>
                        </View>
                        <Text style={styles.won}>{StoreText.won}</Text>
                    </View>
                ) : pageType === "reserve" ? (
                    <View style={styles.priceBox}>
                        <View style={styles.price}>
                            <Text style={styles.priceText}>{formattedNumber(goods.dpst_amt_prc)}</Text>
                        </View>
                        <Text style={styles.won}>{StoreText.won}</Text>
                    </View>
                ) : pageType !== "bid" && pageType !== "reBid" ? (
                    <View style={styles.priceBox}>
                        <View style={styles.price}>
                            <Text style={styles.priceText}>{formattedNumber(orderPrice * ea)}</Text>
                        </View>
                        <Text style={styles.won}>{StoreText.won}</Text>
                    </View>
                ) : (
                    <View style={styles.priceBox}>
                        <TextInput
                            style={[
                                styles.price,
                                {
                                    fontFamily: Fonts.AppleR,
                                    fontSize: 16,
                                    color: "#222222",
                                },
                            ]}
                            placeholder={StoreText.enterProductBidPrice}
                            placeholderTextColor="#c1c1c1"
                            value={bidPrice}
                            keyboardType='numeric'
                            onChangeText={(str) => this.setState({bidPrice: str.replace(/[^0-9]/g, '')})}
                        />
                        <Text style={styles.won}>{StoreText.won}</Text>
                    </View>
                )}
            </View>
        );
    };

    renderQuantityBox = () => {
        const {pageType, ea, goods, max_limit} = this.state;
        if (pageType !== "bid" && pageType !== "reBid") {
            const isMinus = (goods.min_ord_cnt && ea !== parseInt(goods.min_ord_cnt)) || (!goods.min_ord_cnt && ea !== 1);
            const isPlus = (max_limit >= ea + parseInt(goods.min_ord_cnt || 1) && goods.min_ord_cnt && ea + parseInt(goods.min_ord_cnt || 1) <= goods.psnby_purchase_limit_cnt) || (max_limit >= ea + parseInt(goods.min_ord_cnt || 1) && ea + 1 <= goods.psnby_purchase_limit_cnt)
            return (
                <View style={styles.quantityBox}>
                    <Text style={styles.desc}>{StoreText.selectQuantity}</Text>
                    <View style={styles.rowCenter}>
                        <TouchableOpacity
                            onPress={() => {
                                if (isMinus) {
                                    if (goods.min_ord_cnt && ea !== parseInt(goods.min_ord_cnt)) // 최소 주문 수량 작업 필요 + 옵션 재고 확인 필요
                                        this.setState({ea: ea - parseInt(goods.min_ord_cnt)})
                                    else if (ea !== 1)
                                        this.setState({ea: ea - 1})
                                }
                            }}>
                            <Image
                                source={isMinus ? require("../../../assets/image/store/minus_btn.png") : require("../../../assets/image/store/minus_btn_disable.png")}
                                style={styles.plus}
                            />
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{ea}</Text>
                        <TouchableOpacity
                            style={{marginRight: 2}}
                            onPress={() => {
                                // 인당구매제한수량
                                if (isPlus) {
                                    if (goods.min_ord_cnt && ea + parseInt(goods.min_ord_cnt) <= goods.psnby_purchase_limit_cnt)
                                        this.setState({ea: ea + parseInt(goods.min_ord_cnt)})
                                    else if (ea + 1 <= goods.psnby_purchase_limit_cnt)
                                        this.setState({ea: ea + 1})
                                } else {
                                    let toast_type = -1
                                    if(max_limit < ea + parseInt(goods.min_ord_cnt || 1))
                                        toast_type = -2
                                    this.setState({isShowWarningToast: true, toast_type: toast_type});
                                    setTimeout(() => {
                                        this.setState({isShowWarningToast: false, toast_type: toast_type});
                                    }, 3000);
                                }
                            }}>
                            <Image
                                source={isPlus ? require("../../../assets/image/store/plus_btn.png") : require("../../../assets/image/store/plus_btn_disable.png")}
                                style={styles.plus}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else {
            return null;
        }
    };

    renderProductOtherOptionsBox = () => {
        const {navigation} = this.props;
        const {add_optn} = navigation.state.params;
        const {pageType, goods, ea, auc_trd_mine, bidPrice, selectedOptionItem} = this.state;
        let orderPrice = parseInt(goods.sale_prc)
        let optnPrice = 0 // 옵션가
        let dpstPrice = parseInt(goods.dpst_amt_prc) // 예치금
        if (selectedOptionItem?.add_prc_sum)
            optnPrice += parseInt(selectedOptionItem.add_prc_sum)
        if (add_optn?.add_amt)
            optnPrice += parseInt(add_optn.add_amt)

        if (pageType === "purchase") { // 즉시구매
            return (
                <>
                    {this.renderProductOtherOptions(
                        StoreText.transactionType,
                        StoreText.buyNow,
                        Fonts.AppleB,
                        "#191919"
                    )}
                    {this.renderProductOtherOptions(
                        StoreText.totalProduct,
                        `${formattedNumber((orderPrice + optnPrice) * ea || 0)}원`,
                        Fonts.AppleR,
                        "#191919"
                    )}
                    {this.renderProductOtherOptions(
                        StoreText.salesStatus,
                        `${goods.sale_cnt_immedi || 0}/${parseInt(goods.sale_cnt || 0)}`,
                        Fonts.AppleR,
                        "#595959"
                    )}
                </>
            );
        } else if (pageType === "bid") { // 경매구매 : 입찰
            return (
                <>
                    {this.renderProductOtherOptions(
                        StoreText.transactionType,
                        StoreText.auctionDeal,
                        Fonts.AppleB,
                        "#191919"
                    )}
                    {this.renderProductOtherOptions(
                        StoreText.paymentOfBidDeposit,
                        `${formattedNumber(goods.dpst_amt_prc || 0)}${StoreText.won}`,
                        Fonts.AppleR,
                        "#191919"
                    )}
                    {this.renderProductOtherOptions(
                        StoreText.bidAmount,
                        `${formattedNumber(bidPrice || 0)}${StoreText.won}`,
                        Fonts.AppleR,
                        "#595959"
                    )}
                    {this.renderProductOtherOptions(
                        StoreText.minimumBidAmount,
                        `${formattedNumber(goods.low_bid_prc || 0)}${StoreText.won}`,
                        Fonts.AppleR,
                        "#595959"
                    )}
                    {/*{this.renderProductOtherOptions( // 잔여금 > 경매 확정 후 필요한 부분*/}
                    {/*    StoreText.balance,*/}
                    {/*    "3,000원",*/}
                    {/*    Fonts.AppleR,*/}
                    {/*    "#595959"*/}
                    {/*)}*/}
                </>
            );
        } else if (pageType === "reBid") { // 경매구매 : 재입찰
            return (
                <>
                    {this.renderProductOtherOptions(
                        StoreText.transactionType,
                        StoreText.auctionReBid,
                        Fonts.AppleB,
                        "#191919"
                    )}
                    {this.renderProductOtherOptions(
                        StoreText.paymentOfBidDeposit,
                        `${formattedNumber(auc_trd_mine.bid_dpst_amt || 0)}${StoreText.won}`,
                        Fonts.AppleR,
                        "#191919"
                    )}
                    {this.renderProductOtherOptions(
                        StoreText.previousBidAmount,
                        `${formattedNumber(auc_trd_mine.bid_prc || 0)}${StoreText.won}`,
                        Fonts.AppleR,
                        "#595959"
                    )}
                    {this.renderProductOtherOptions(
                        StoreText.minimumBidAmount,
                        `${formattedNumber(goods.low_bid_prc || 0)}${StoreText.won}`,
                        Fonts.AppleR,
                        "#595959"
                    )}
                    {this.renderProductOtherOptions(
                        StoreText.reBidAmount,
                        `${formattedNumber(bidPrice || 0)}${StoreText.won}`,
                        Fonts.AppleR,
                        "#595959"
                    )}
                    {this.renderProductOtherOptions(
                        StoreText.bidDeadline,
                        `${dateUtil.formatKCT("dash", goods.sale_end_dt || "")} ${StoreText.deadline}`,
                        Fonts.AppleR,
                        "#595959"
                    )}
                    {/*{this.renderProductOtherOptions( // 잔여금 > 경매 확정 후 필요한 부분 */}
                    {/*    StoreText.balance,*/}
                    {/*    `${auc_trd_mine.remain_amt}${StoreText.won}`,*/}
                    {/*    Fonts.AppleR,*/}
                    {/*    "#595959"*/}
                    {/*)}*/}
                </>
            );
        } else if (pageType === "reserve") {
            return (
                <>
                    {this.renderProductOtherOptions(
                        StoreText.transactionType,
                        StoreText.reservationPurchase,
                        Fonts.AppleB,
                        "#191919"
                    )}
                    {this.renderProductOtherOptions(
                        StoreText.depositPayment,
                        `${formattedNumber(dpstPrice * ea || 0)}${StoreText.won}`,
                        Fonts.AppleR,
                        "#595959"
                    )}
                    {this.renderProductOtherOptions(
                        StoreText.salesClosingDate,
                        `${dateUtil.formatKCT("dash", goods.sale_end_dt || "")} ${StoreText.deadline}`,
                        Fonts.AppleR,
                        "#595959"
                    )}
                    {this.renderProductOtherOptions(
                        StoreText.residualPayment,
                        `${formattedNumber((orderPrice - dpstPrice + optnPrice) * ea || 0)}${StoreText.won}`,
                        Fonts.AppleR,
                        "#595959"
                    )}
                    {this.renderProductOtherOptions(
                        StoreText.residualPaymentDate,
                        `${dateUtil.formatKCT("dash", goods.sale_end_dt || "")}부터 3일 이내`,
                        Fonts.AppleR,
                        "#595959"
                    )}
                </>
            );
        } else {
            return (
                <>
                    {this.renderProductOtherOptions(
                        StoreText.transactionType,
                        StoreText.groupPurcase,
                        Fonts.AppleB,
                        "#191919"
                    )}
                    {this.renderProductOtherOptions(
                        StoreText.totalProduct,
                        `${formattedNumber(parseInt(goods.sale_prc) * ea)}${StoreText.won}`,
                        Fonts.AppleR,
                        "#595959"
                    )}
                    {this.renderProductOtherOptions(
                        StoreText.deadlineForJointPurchase,
                        `${dateUtil.formatKCT("dash", goods.sale_end_dt)} ${StoreText.deadline}`,
                        Fonts.AppleR,
                        "#595959"
                    )}
                    {this.renderProductOtherOptions(
                        StoreText.salesStatus,
                        `${goods.sale_cnt_copertn}/${parseInt(goods.sale_cnt)}`,
                        Fonts.AppleR,
                        "#595959"
                    )}
                    <Text
                        style={{
                            fontFamily: Fonts.AppleR,
                            fontSize: 12,
                            color: "#969696",
                            marginTop: 14,
                        }}
                    >
                        {StoreText.groupPurchaseDesc}
                    </Text>
                </>
            );
        }
    };

    renderSubmitBtnBox = () => {
        const {navigation} = this.props;
        const {add_optn} = navigation.state.params;
        const {pageType, ea, bidPrice, auc_trd_recent_bid_prc, goods, selectedOptionItem} = this.state;
        if (pageType === "purchase") {
            return (
                <View style={[styles.submitBtns, {zIndex: 99}]}>
                    <TouchableOpacity
                        style={[styles.submitBtn, styles.submitBtnBox]}
                        onPress={() => this.createCart()}
                    >
                        <Text style={styles.cart}>{StoreText.cart}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.submitBtn,
                            {backgroundColor: "#000000"},
                        ]}
                        onPress={() =>
                            this.handleCreate("purchase")
                        }
                    >
                        <Text style={styles.productPurchase}>
                            {StoreText.productPurchase}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        } else if (pageType === "reserve") {
            let orderPrice = parseInt(goods.sale_prc)
            let optnPrice = 0 // 옵션가
            let dpstPrice = parseInt(goods.dpst_amt_prc) // 예치금
            if (selectedOptionItem?.add_prc_sum)
                optnPrice += parseInt(selectedOptionItem.add_prc_sum)
            if (add_optn?.add_amt)
                optnPrice += parseInt(add_optn.add_amt)

            return (
                <TouchableOpacity
                    style={[
                        styles.submitOneBtn,
                        {backgroundColor: "#191919"},
                    ]}
                    onPress={() =>
                        this.handleReserve()
                    }
                >
                    <Text style={styles.productPurchase}>
                        {StoreText.reservePurchase}
                    </Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    style={[
                        styles.submitOneBtn,
                        bidPrice === "" ? {backgroundColor: "#c1c1c1"} :
                            {backgroundColor: "#191919"},
                    ]}
                    onPress={() => {
                        if (bidPrice !== "") {
                            if ((pageType === "reBid" || pageType === "bid") && parseInt(goods.low_bid_prc) > parseInt(bidPrice)) {
                                this.setState({isShowWarningToast: true, toast_type: 1});
                                setTimeout(() => {
                                    this.setState({isShowWarningToast: false});
                                }, 3000);
                            } else if ((pageType === "reBid" || pageType === "bid") && (parseInt(auc_trd_recent_bid_prc) >= parseInt(bidPrice) || bidPrice === "")) {
                                let type = 0
                                if(pageType === "bid") type = 2;
                                this.setState({isShowWarningToast: true, toast_type: type});
                                setTimeout(() => {
                                    this.setState({isShowWarningToast: false});
                                }, 3000);
                            } else if (pageType === "reBid") {
                                this.setState({isShowSaleModal: true})
                            } else if (pageType === "bid") {
                                this.setState({isShowSaleModal: true})
                            } else { // 공구상품
                                this.setState({isShowSaleModal: true})
                            }
                        }
                    }}
                >
                    <Text style={[styles.cart, {color: "#f5f5f5"}]}>
                        {pageType === "bid" ? StoreText.toBid : pageType === "reBid" ? StoreText.reBid : StoreText.productPurchase}
                    </Text>
                </TouchableOpacity>
            );
        }
    };

    renderWarningToast = () => {
        const {goods, pageType, toast_type, isShowWarningToast, max_limit} = this.state;
        if (toast_type === 0 && isShowWarningToast) {
            return (
                <View style={styles.warningToast}>
                    <Image
                        style={{width: 16, height: 16, marginRight: 5}}
                        source={require("../../../assets/image/store/information_grey.png")}
                    />
                    <Text
                        style={{
                            fontFamily: Fonts.AppleR,
                            fontSize: 12,
                            color: "#f5f5f5",
                        }}
                    >
                        {StoreText.reAuctionDealMessage}
                    </Text>
                </View>
            );
        } else if (toast_type === 2 && isShowWarningToast) {
            return (
                <View style={styles.warningToast}>
                    <Image
                        style={{width: 16, height: 16, marginRight: 5}}
                        source={require("../../../assets/image/store/information_grey.png")}
                    />
                    <Text
                        style={{
                            fontFamily: Fonts.AppleR,
                            fontSize: 12,
                            color: "#f5f5f5",
                        }}
                    >
                        {StoreText.auctionLimitMessage}
                    </Text>
                </View>
            );
        } else if (toast_type === 1 && isShowWarningToast) {
            return (
                <View style={styles.warningToast}>
                    <Image
                        style={{width: 16, height: 16, marginRight: 5}}
                        source={require("../../../assets/image/store/information_grey.png")}
                    />
                    <Text
                        style={{
                            fontFamily: Fonts.AppleR,
                            fontSize: 12,
                            color: "#f5f5f5",
                        }}
                    >
                        {StoreText.auctionDealMessage}
                    </Text>
                </View>
            );
        } else if (toast_type === -2 && isShowWarningToast) {
            return (
                <View style={styles.warningToast}>
                    <Image
                        style={{width: 16, height: 16, marginRight: 5}}
                        source={require("../../../assets/image/store/information_grey.png")}
                    />
                    <Text
                        style={{
                            fontFamily: Fonts.AppleR,
                            fontSize: 12,
                            color: "#f5f5f5",
                        }}
                    >
                        {`${StoreText.outOfStockLimitMessage} 재고량 : ${max_limit}`}
                    </Text>
                </View>
            );
        } else if ((pageType !== "bid" || pageType !== "reBid") && isShowWarningToast) {
            return (
                <View style={styles.warningToast}>
                    <Image
                        style={{width: 16, height: 16, marginRight: 5}}
                        source={require("../../../assets/image/store/information_grey.png")}
                    />
                    <Text
                        style={{
                            fontFamily: Fonts.AppleR,
                            fontSize: 12,
                            color: "#f5f5f5",
                        }}
                    >
                        {`${StoreText.purchaseLimitMessage} ${goods.psnby_purchase_limit_cnt}${StoreText.purchaseLimitMessage_2}`}
                    </Text>
                </View>
            );
        }
    };

    render() {
        const {navigation} = this.props;
        const {add_optn} = navigation.state.params;
        const {isLoading, pageType, isOpened, selectedOption, isShowSaleModal, goods, goods_optn} = this.state;
        const {ea, bidPrice, auc_trd_mine} = this.state;

        const selected_optn_title = goods_optn?.filter((item) => item.goods_optn_no === selectedOption)[0]?.goods_optn_nm;
        if (isLoading)
            return null;
        else
            return (
                <View style={styles.container}>
                    <TopHeader
                        title={StoreText.purchase}
                        navigation={navigation}
                        hasRightBtn={false}
                    />
                    <ScrollView style={{marginHorizontal: 20, paddingBottom: 76.5}}
                                showsVerticalScrollIndicator={false}>
                        <View style={{marginTop: 20, flexDirection: "row"}}>
                            <Image
                                source={{uri: goods.thumb_url}}
                                style={styles.productImg}
                            />
                            <View style={{width: DEVICE_WIDTH - 95 - 14 - 40}}>
                                <Text style={styles.product} numberOfLines={1}>{goods.goods_nm}</Text>
                                {(pageType !== "bid" || pageType !== "reBid") && (
                                    <>
                                        {goods_optn.length > 0 && (
                                            <TouchableOpacity
                                                style={styles.optionsBox}
                                                onPress={() => this.setState({isOpened: !isOpened})}
                                            >
                                                <Text style={styles.option}>{selected_optn_title}</Text>
                                                <Image
                                                    style={styles.downArrow}
                                                    source={require("../../../assets/image/signup/dropdown_btn_regular.png")}
                                                />
                                            </TouchableOpacity>
                                        )}

                                        {isOpened && (
                                            <FlatList
                                                style={styles.optionWrap}
                                                showsVerticalScrollIndicator={false}
                                                data={goods_optn}
                                                renderItem={({item}) => {
                                                    const isSoldOut = parseInt(item.goods_cnt) - parseInt(item.saled_cnt) === 0
                                                    let option_message = ""
                                                    if(parseInt(item.goods_cnt) - parseInt(item.saled_cnt) === 0) option_message = '품절'
                                                    else option_message = `(+${formattedNumber(item.add_prc_sum)})`
                                                    return (
                                                        <TouchableOpacity
                                                            style={styles.optionBtnWrap}
                                                            onPress={() => {
                                                                if(isSoldOut)
                                                                    notifyMessage(StoreText.outOfStockMessage)
                                                                else
                                                                    this.setState({
                                                                        selectedOption: item.goods_optn_no,
                                                                        selectedOptionItem: item,
                                                                        isOpened: false,
                                                                        max_limit: parseInt(item.goods_cnt) - parseInt(item.saled_cnt)
                                                                    })
                                                            }}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.option,
                                                                    {
                                                                        color:
                                                                            selectedOption &&
                                                                            selectedOption === item.goods_optn_no
                                                                                ? Colors.MAIN_COLOR
                                                                                : "#000000",
                                                                        marginRight: 5,
                                                                    },
                                                                ]}
                                                            >
                                                                {`${item.goods_optn_nm} ${option_message}`}
                                                            </Text>
                                                            {selectedOption && selectedOption === item.goods_optn_no && (
                                                                <Image
                                                                    style={{width: 20, height: 12}}
                                                                    source={require("../../../assets/image/store/select_option_check_line.png")}
                                                                />
                                                            )}
                                                        </TouchableOpacity>
                                                    );
                                                }}
                                            />
                                        )}

                                        {add_optn?.add_optn_nm && (
                                            <Text style={styles.additionalOption}>
                                                {`- 추가 옵션 : ${add_optn.add_optn_nm} (+${formattedNumber(add_optn.add_amt)}원)`}
                                            </Text>
                                        )}
                                    </>
                                )}
                            </View>
                        </View>
                        {this.renderPriceBox()}
                        {this.renderQuantityBox()}
                        <View style={styles.divider}/>
                        {this.renderProductOtherOptionsBox()}
                    </ScrollView>
                    {this.renderSubmitBtnBox()}
                    {this.renderCartToast()}
                    {this.renderWarningToast()}
                    {(pageType === "group" || pageType === "bid" || pageType === "reBid") && (
                        <SaleModal
                            isShowSaleModal={isShowSaleModal}
                            setVisible={() => this.setState({isShowSaleModal: false})}
                            handleSubmit={() => {
                                if (bidPrice !== "") {
                                    if (pageType === "reBid" && (parseInt(auc_trd_mine.bid_prc) >= parseInt(bidPrice) || bidPrice === "")) {
                                    } else if (pageType === "bid" && parseInt(goods.low_bid_prc) > parseInt(bidPrice)) {
                                    } else if (pageType === "reBid") {
                                        this.handleAuc();
                                    } else if (pageType === "bid") {
                                        this.setState({isShowSaleModal: false}, () => {
                                            navigation.navigate("Payment", {
                                                purchaseType: pageType,
                                                bid_prc: bidPrice,
                                                bid_cnt: ea,
                                                goods: goods,
                                                auc_trd_mine: auc_trd_mine
                                            });
                                        })
                                    } else { // 공구상품
                                        this.setState({isShowSaleModal: false}, () => {
                                            navigation.navigate("Payment", {
                                                purchaseType: pageType,
                                                goods: goods,
                                                bid_cnt: ea,
                                                bid_prc: bidPrice,
                                            });
                                        })
                                    }
                                }
                            }}
                            title={
                                pageType === "group"
                                    ? StoreText.groupPurcaseTitle
                                    : StoreText.auctionPurchaseTitle
                            }
                            message={
                                pageType === "group"
                                    ? StoreText.groupPurcaseMessage
                                    : StoreText.auctionPurchaseMessage
                            }
                            subMessage={
                                pageType === "group"
                                    ? StoreText.groupPurcaseSubMessage
                                    : StoreText.auctionPurchaseSubMessage
                            }
                            warningMessage={
                                pageType === "group"
                                    ? StoreText.groupPurchaseModalWarningMessage
                                    : StoreText.auctionPurchaseWarningMessage
                            }
                            warningSubMessage={
                                pageType === "group"
                                    ? StoreText.groupPurchaseModalWarningMessage_2
                                    : StoreText.auctionPurchaseWarningMessage_2
                            }
                            warningThirdMessage={
                                pageType === "group"
                                    ? ""
                                    : StoreText.auctionPurchaseWarningMessage_3
                            }
                        />
                    )}
                </View>
            );
    }

    /*  render END */
}

const mapStateToProps = (state) => ({
    eSESSION: state.eSESSION.eSESSION,
    eCOMM_CD: state.eCOMM_CD.eCOMM_CD,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    createCart: (params) => dispatch(ActionBasket.create(params)),
    createOptn: (params) => dispatch(ActionBasket.createOptn(params)),
    getStoreDetail: (params) => dispatch(ActionGoods.getStoreDetail(params)),
    create: (params) => dispatch(ActionImmedi.create(params)),
    createDetail: (params) => dispatch(ActionImmedi.createDetail(params)),
    createImmediOptn: (params) => dispatch(ActionImmedi.createOptn(params)),
    removeImmedi: (params) => dispatch(ActionImmedi.remove(params)),
    createAuc: (params) => dispatch(ActionAuc.create(params)),
    updateAuc: (params) => dispatch(ActionAuc.update(params)),

    createReserve: (params) => dispatch(ActionReserve.create(params)),
    createReserveOptn: (params) => dispatch(ActionReserve.createOptn(params)),

});
export default connect(mapStateToProps, mapDispatchToProps)(StorePayment);
