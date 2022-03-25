// 결제 완료 화면
// 교환권 결제 화면
import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  BackHandler
} from "react-native";
import {connect} from "react-redux";

import { HAS_NOTCH } from "../../../model/lib/Utils/Constants";
import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";
import {CodeText, PaymentText, StoreText} from "../../../model/lib/Utils/Strings";
import {formattedNumber} from "../../../model/lib/Utils";
import * as dateUtil from "../../../model/lib/Utils/Date";

import * as ActionImmedi from "../../../model/action/eIMMEDI_PURCHASE";
import * as ActionAuc from "../../../model/action/eAUC_TRD";
import * as ActionCoper from "../../../model/action/eCOPERTN_PURCHASE";
import * as ActionReserve from "../../../model/action/eRESERV_PURCHASE";

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
  paymentResultBox: {
    flex: 1,
    alignItems: "center",
    paddingTop: 210.5,
  },
  success: { width: 60, height: 60 },
  paymentResult: {
    fontFamily: Fonts.AppleL,
    fontSize: 20,
    letterSpacing: -1,
    textAlign: "center",
    marginTop: 40,
  },
  resultMessage: {
    fontFamily: Fonts.AppleL,
    letterSpacing: -0.7,
    color: "#969696",
    marginTop: 10,
  },
  purchaseListBtn: {
    borderRadius: 5,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 50,
    position: "absolute",
    bottom: 66.8,
  },
  purchaseListOtherBtn: {
    borderRadius: 5,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 50,
    marginTop: 30,
  },
  purchaseListBtnText: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    letterSpacing: -0.5,
    color: "#ffffff",
  },
  homeBtn: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },
  homeBtnText: {
    fontFamily: Fonts.AppleL,
    letterSpacing: -0.7,
    textAlign: "center",
    color: "#969696",
    // textDecorationLine: "underline",
    width: 100,
    borderBottomWidth: 1, borderColor: '#969696',
  },
  largeBold: {
    fontFamily: Fonts.AppleB,
    fontSize: 15,
    letterSpacing: -0.38,
    color: "#222222",
  },
  mediumBold: {
    fontFamily: Fonts.AppleB,
    fontSize: 13,
    letterSpacing: -0.38,
    color: "#222222",
  },
  mediumRegular: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    letterSpacing: -0.3,
    color: "#b8b8b8",
  },
  productBox: {
    height: 45,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#dddddd",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 12.5,
    marginTop: 27.5,
  },
  title: {
    fontFamily: Fonts.AppleB,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#222222",
  },
  price: {
    fontFamily: Fonts.AppleB,
    fontSize: 15,
    letterSpacing: -0.38,
    color: "#222222",
    marginTop: 4,
  },
  option: {
    marginTop: 4.5,
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    letterSpacing: -0.3,
    color: "#777777",
  },
  purchaseTypeBox: {
    borderTopLeftRadius: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: 2.5,
    // width: 50,
    position: "absolute",
    top: 14,
    left: 15,
    zIndex: 5,
  },
  purchaseType: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    letterSpacing: -0.6,
    color: "#ffffff",
  },
  paymentInfoBox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#dddddd",
    marginTop: 10,
  },
  productBoxWrap: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#dddddd",
    marginTop: 27.5,
  },
  productBoxBtn: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 12.5,
    paddingVertical: 13.8,
  },
  productBoxTextWrap: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingTop: 14,
    paddingBottom: 17,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
  },
  productBoxImg: {
    width: 75,
    height: 75,
    borderRadius: 5,
    marginRight: 15,
  },
  paymentWrap: {
    padding: 15,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
  },
});

class PaymentResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      purchaseType: props.navigation.state.params.purchaseType,
      selectedPaymentMethod:
        props.navigation.state.params.selectedPaymentMethod,
      isOpenedProductBox: false,

      sale_mth_cd: "", // 거래 종류
      order_no: "", // 주문서 번호
      detail: {}, // 주문서 상세
      goods: [], // 상품 정보
      sts_cd: "", // 상품상태 코드
      // pay: {}, // 결제 정보
      pay_info: {}, // 결제 정보 값
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const {order_no, sale_mth_cd, purchaseType} = navigation.state.params;
    this.setState({order_no: order_no, sale_mth_cd: sale_mth_cd})
    if(purchaseType === "reBid" || purchaseType === "bid" || purchaseType === "reserve") this.setState({isLoading: false})
    if(sale_mth_cd === CodeText.sale_mth_cd_a) // 경매거래
      this.getAucDetail();
    else if(sale_mth_cd === CodeText.sale_mth_cd_i) // 즉시거래
      this.getImmediDetail();
    else if(sale_mth_cd === CodeText.sale_mth_cd_g) // 공동거래
      this.getCoperDetail();
    else if(sale_mth_cd === CodeText.sale_mth_cd_r && purchaseType === "remain_reserv")
      this.getReservDetail();

    this._navListener = BackHandler.addEventListener(
        "hardwareBackPress",
        () => navigation.pop(4)
    );
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  getAucDetail = () => {
    const {navigation} = this.props;
    const {order_no} = navigation.state.params;
    console.log(order_no)

    this.props.getAucDetail({auc_trd_no: order_no}).then((res) => {
      const pay = res.detail.pay_remain_auc_trd;
      const pay_dtl_not_paid = pay?.pay_dtl_not_paid?.length > 0 ? pay.pay_dtl_not_paid[0] : false;
      const pay_info = res.detail.pay_info;
      this.setState({
        isLoading: false,
        detail: res.detail,
        goods: [{...res.detail.goods,
          thumb_url: res.detail.thumb_url,
          payment_price: res.detail.tot_auc_trd_amt,
          order_cnt: res.detail.bid_cnt
        }],
        sts_cd: res.detail.auc_trd_sts_cd,
        pay_info: {
          ...res.detail.pay_info,
          pay_complet_dt: pay.pay_complet_dt || pay.pay_attmpt_dt,
          tot_dlvy_cost_amt: res.detail.pay_info.dlvy_cost_amt, // 배송비 : 즉시랑 통일
          tot_pay_amt: parseInt(pay_info.tot_auc_trd_amt || 0) - parseInt(pay_info.bid_dpst_amt || 0), // 총 결제금액(잔금결제) : tot_auc_trd_amt - bid_dpst_amt
          pay_dtl_not_paid: pay_dtl_not_paid, // 무통장 입금 정보
        }
      })
    }).catch((err) => {
    });
  }
  getImmediDetail = () => {
    const {navigation} = this.props;
    const {order_no} = navigation.state.params;
    // payment_price : tot_ord_dtl_amt
    // order_cnt : goods_cnt
    this.props.getImmediDetail({immedi_purchase_ord_no: order_no}).then((res) => {
      let newGoods = res.detail.dtl.map((item)=> {
        return {...item, order_cnt : item.goods_cnt, payment_price : item.tot_ord_dtl_amt}
      })
      const pay = res.detail.pay;
      const pay_dtl_not_paid = pay?.pay_dtl_not_paid.length > 0 ? pay.pay_dtl_not_paid[0] : false
      this.setState({
        isLoading: false,
        detail: res.detail,
        goods: newGoods,
        sts_cd: res.detail.immedi_purchase_ord_sts_cd,
        pay_info: {
          ...res.detail.pay_info,
          pay_complet_dt: pay.pay_complet_dt || pay.pay_attmpt_dt,
          tot_pay_amt: res.detail.pay_info.tot_pay_target_amt, // 총 결제금액
          tot_ord_amt: res.detail.tot_ord_amt, // 상품가
          pay_dtl_not_paid: pay_dtl_not_paid, // 무통장 입금 정보
        }
      })
    }).catch((err) => {
    });
  }
  getCoperDetail = () => {
    const {navigation} = this.props;
    const {order_no} = navigation.state.params;
    console.log(order_no)

    this.props.getCoperDetail({copertn_purchase_no: order_no}).then((res) => {
      const pay = res.detail.pay;
      const pay_dtl_not_paid = pay?.pay_dtl_not_paid.length > 0 ? pay?.pay_dtl_not_paid[0] : false
      this.setState({
        isLoading: false,
        detail: res.detail,
        goods: [{...res.detail.goods,
          thumb_url: res.detail.thumb_url,
          payment_price: res.detail.purchase_prc,
          order_cnt: res.detail.purchase_cnt
        }],
        sts_cd: res.detail.copertn_purchase_sts_cd,
        pay_info: {
          ...res.detail.pay_info,
          tot_ord_amt: res.detail.tot_purchase_amt, // 상품가 (수량 계산 포함)
          tot_dlvy_cost_amt: res.detail.pay_info.dlvy_cost_amt, // 배송비 : 즉시랑 통일
          tot_pay_amt: res.detail.pay_info.tot_copertn_purchase_amt, // 총 결제금액
          pay_dtl_not_paid: pay_dtl_not_paid, // 무통장 입금 정보
        }
      })
    }).catch((err) => {
    });
  }
  getReservDetail = () => {
    const {navigation} = this.props;
    const {order_no} = navigation.state.params;
    console.log(order_no)

    this.props.getReservDetail({reserv_purchase_no: order_no}).then((res) => {
      const pay = res.detail.pay_remain_reserv_purchase;
      const pay_dtl_not_paid = pay?.pay_dtl_not_paid.length > 0 ? pay?.pay_dtl_not_paid[0] : false
      this.setState({
        isLoading: false,
        detail: res.detail,
        goods: [{...res.detail.goods,
          thumb_url: res.detail.thumb_url,
          payment_price: res.detail.purchase_prc,
          order_cnt: res.detail.purchase_cnt
        }],
        sts_cd: res.detail.reserv_purchase_sts_cd,
        pay_info: {
          ...res.detail.pay_info,
          tot_ord_amt: res.detail.tot_purchase_amt, // 상품가 (수량 계산 포함)
          tot_dlvy_cost_amt: res.detail.pay_info.dlvy_cost_amt, // 배송비 : 즉시랑 통일
          tot_pay_amt: res.detail.pay_info.tot_reserv_purchase_amt, // 총 결제금액
          pay_dtl_not_paid: pay_dtl_not_paid, // 무통장 입금 정보
        }
      })
    }).catch((err) => {
    });

  }

  renderProductBox = () => {
    const {eCOMM_CD} = this.props;
    const { isOpenedProductBox, goods, sale_mth_cd } = this.state;
    const typeTitle = sale_mth_cd ? eCOMM_CD[`${sale_mth_cd}`].cd_nm : ""
    if (isOpenedProductBox) {
      return (
        <View style={styles.productBoxWrap}>
          <TouchableOpacity
            style={styles.productBoxBtn}
            onPress={() => this.setState({ isOpenedProductBox: false })}
          >
            <Text style={styles.largeBold}>주문 상품</Text>
            <Image
              style={{ width: 15, height: 15 }}
              source={require("../../../assets/image/store/dropdown_btn_regular.png")}
            />
          </TouchableOpacity>
          {goods.length > 0 && goods.map((product) => {
            return (
                <View style={styles.productBoxTextWrap}>
                  <View style={styles.purchaseTypeBox}>
                    <Text style={styles.purchaseType}>{typeTitle}</Text>
                  </View>
                  <Image
                      source={{uri: product.thumb_url}}
                      style={styles.productBoxImg}
                  />
                  <View>
                    <Text style={styles.title}>
                      {product.goods_nm}
                    </Text>
                    <Text style={styles.price}>
                      {`${formattedNumber(product.payment_price || 0)}${StoreText.won}`}
                    </Text>
                    <Text style={styles.option}>
                      {product?.goods_optn_nm ? `${StoreText.option}: ${product.goods_optn_nm}` : ""}
                    </Text>
                    <Text style={styles.option}>
                      {`${StoreText.count}: ${product.order_cnt}`}
                    </Text>
                  </View>
                </View>
            )
          })}
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.productBox}
          onPress={() => this.setState({ isOpenedProductBox: true })}
        >
          <Text style={styles.largeBold}>주문 상품</Text>
          <Image
            style={{ width: 15, height: 15 }}
            source={require("../../../assets/image/store/dropdown_btn_regular.png")}
          />
        </TouchableOpacity>
      );
    }
  };

  renderPaymentInfoBox = () => {
    const {eCOMM_CD} = this.props;
    const { selectedPaymentMethod, pay_info } = this.state;
    const isCard = selectedPaymentMethod === 2; // false : 무통장입금
    return (
      <View style={styles.paymentInfoBox}>
        <View
          style={[
            styles.betweenCenter,
            {
              paddingHorizontal: 15,
              paddingTop: 14,
              paddingBottom: 12.2,
            },
          ]}
        >
          <Text style={styles.largeBold}>
            {isCard
              ? PaymentText.amountOfPayment
              : PaymentText.expectedPaymentAmount}
          </Text>
          <Text style={[styles.largeBold, { color: Colors.MAIN_COLOR }]}>
            {`${formattedNumber(parseInt(pay_info.tot_pay_amt || 0))}${StoreText.won}`}
          </Text>
        </View>
        <View style={styles.paymentWrap}>
          {isCard ? (
            <>
              <View style={[styles.betweenCenter, { marginBottom: 12 }]}>
                <Text style={styles.mediumBold}>
                  {PaymentText.paymentMethod}
                </Text>
                <Text style={styles.mediumBold}>{PaymentText.cardPayment}</Text>
              </View>
              <View style={[styles.betweenCenter, { marginBottom: 7 }]}>
                <Text style={styles.mediumRegular}>
                  {PaymentText.orderStatus}
                </Text>
                <Text style={styles.mediumRegular}>
                  {PaymentText.purchaseComplete}
                </Text>
              </View>
              <View style={styles.betweenCenter}>
                <Text style={styles.mediumRegular}>
                  {PaymentText.orderDate}
                </Text>
                <Text style={styles.mediumRegular}>
                  {`${dateUtil.formatKCT("fullTime", pay_info.pay_complet_dt || pay_info.pay_attmpt_dt || "")}`}
                </Text>
              </View>
            </>
          ) : pay_info.pay_dtl_not_paid && (
            <>
              <View style={[styles.betweenCenter, { marginBottom: 12 }]}>
                <Text style={styles.mediumBold}>
                  {PaymentText.paymentMethod}
                </Text>
                <Text style={styles.mediumBold}>
                  {PaymentText.directDeposit}
                </Text>
              </View>
              <View style={[styles.betweenCenter, { marginBottom: 7 }]}>
                <Text style={styles.mediumRegular}>
                  {PaymentText.accountHolder}
                </Text>
                <Text style={styles.mediumRegular}>
                  {pay_info.pay_dtl_not_paid.dpstr_nm || ""}
                </Text>
              </View>
              <View style={[styles.betweenCenter, { marginBottom: 7 }]}>
                <Text style={styles.mediumRegular}>
                  {PaymentText.depositBank}
                </Text>
                <Text style={styles.mediumRegular}>
                  {pay_info.pay_dtl_not_paid?.bank_cmpny_cd ? eCOMM_CD[`${pay_info.pay_dtl_not_paid.bank_cmpny_cd}`].cd_nm : ""}
                </Text>
              </View>
              <View style={[styles.betweenCenter, { marginBottom: 7 }]}>
                <Text style={styles.mediumRegular}>
                  {PaymentText.depositAccount}
                </Text>
                <Text style={styles.mediumRegular}>{pay_info.pay_dtl_not_paid.accnt_no || ""}</Text>
              </View>
              <View style={styles.betweenCenter}>
                <Text style={styles.mediumRegular}>
                  {PaymentText.depositDeadline}
                </Text>
                <Text style={styles.mediumRegular}>
                  {`${dateUtil.formatKCT("fullTime", pay_info.pay_dtl_not_paid.pay_nbkk_due_dt || "")}`}
                </Text>
              </View>
            </>
          )}
        </View>
        <View
          style={{
            padding: 15,
            borderBottomColor: "#dddddd",
            borderBottomWidth: 1,
          }}
        >
          <View style={[styles.betweenCenter, { marginBottom: 12 }]}>
            <Text style={styles.mediumBold}>{PaymentText.productAmount}</Text>
            <Text style={styles.mediumBold}>
              {`${formattedNumber(parseInt(pay_info.tot_ord_amt || 0))}${StoreText.won}`}
            </Text>
          </View>
          <View style={[styles.betweenCenter, { marginBottom: 7 }]}>
            <Text style={styles.mediumRegular}>{PaymentText.redeemPoints}</Text>
            <Text style={styles.mediumRegular}>
              {parseInt(pay_info.tot_pnt_amt || 0) === 0 ? `0P` : `-${formattedNumber(parseInt(pay_info.tot_pnt_amt || 0))}P`}
            </Text>
          </View>
          <View style={styles.betweenCenter}>
            <Text style={styles.mediumRegular}>{PaymentText.shippingFee}</Text>
            <Text style={styles.mediumRegular}>
              {parseInt(pay_info.tot_dlvy_cost_amt || 0) === 0 ? PaymentText.free : `${formattedNumber(parseInt(pay_info.tot_dlvy_cost_amt || 0))}${StoreText.won}`}
            </Text>
          </View>
        </View>
        <View style={[styles.betweenCenter, {padding: 15}]}>
          <Text style={styles.mediumBold}>
            {PaymentText.totalPaymentAmount}
          </Text>
          <Text style={[styles.mediumBold, { color: Colors.MAIN_COLOR }]}>
            {`${formattedNumber(parseInt(pay_info.tot_pay_amt || 0))}${StoreText.won}`}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const { isLoading, purchaseType } = this.state;
    if(isLoading)
      return null;
    else
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, marginHorizontal: 20 }}>
          {purchaseType === "reserve" ||
          purchaseType === "bid" ||
          purchaseType === "reBid" ? (
            <View style={styles.paymentResultBox}>
              <Image
                source={require("../../../assets/image/ticket/success_graphic.png")}
                style={styles.success}
              />
              <Text style={styles.paymentResult}>
                {purchaseType === "reserve"
                  ? PaymentText.reserveFinised
                  : PaymentText.auctionFinished}
              </Text>
              <Text style={styles.resultMessage}>
                {purchaseType === "reserve"
                  ? PaymentText.reserveFinisedMessage
                  : PaymentText.auctionFinishedMessage}
              </Text>
              <TouchableOpacity
                  style={styles.purchaseListBtn}
                  onPress={() => {
                    navigation.pop(4);
                    navigation.navigate("MyBuy");
                  }}
              >
                <Text style={styles.purchaseListBtnText}>
                  {PaymentText.purchaseHistory}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.homeBtn}
                onPress={() => navigation.pop(4)}
              >
                <Text style={styles.homeBtnText}>{PaymentText.goToHome}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              style={{ flex: 1, paddingTop: HAS_NOTCH ? 94 : 70 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../../../assets/image/ticket/success_graphic.png")}
                  style={styles.success}
                />
                <Text style={[styles.paymentResult, { marginTop: 20 }]}>
                  {PaymentText.purchaseComplete}
                </Text>
                <Text style={[styles.resultMessage, { marginTop: 5 }]}>
                  {PaymentText.purchaseCompleteMessage}
                </Text>
              </View>
              {this.renderProductBox()}
              {this.renderPaymentInfoBox()}

              <TouchableOpacity
                style={styles.purchaseListOtherBtn}
                onPress={() => {
                  navigation.pop(4);
                  navigation.navigate("MyBuy");
                }}
              >
                <Text style={styles.purchaseListBtnText}>
                  {PaymentText.purchaseHistory}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginTop: 20, paddingBottom: 100, alignItems: 'center'}}
                onPress={() => navigation.pop(4)}
              >
                <Text style={styles.homeBtnText}>{PaymentText.goToHome}</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
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
  getReservDetail: (params) => dispatch(ActionReserve.getDetail(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentResult);

