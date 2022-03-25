// 교환권 결제 화면
import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {connect} from "react-redux";
import moment from "moment";

import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";
import {CodeText, StoreText, TicketText} from "../../../model/lib/Utils/Strings";
import {formattedNumber, maskingEmail, maskingId, maskingPhone, notifyMessage} from "../../../model/lib/Utils";
import * as dateUtil from "../../../model/lib/Utils/Date";

import { TopHeader } from "../../../component/TopHeader";
import TextInputStr from "../../../common/textinput/TextInput";

import * as ActionMber from "../../../model/action/eMBER";
import * as ActionExchng from "../../../model/action/eEXCHNG_VOL";
import * as ActionPayment from "../../../model/action/ePAYMENT";
import {availableAucExchng, createAucExchngPoint} from "../../../model/action/ePAYMENT";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  productInfoContainer: {
    marginTop: 21.8,
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    paddingBottom: 34.6,
  },
  title: {
    fontFamily: Fonts.AppleB,
    fontSize: 18,
    letterSpacing: -0.9,
    color: "#000000",
  },
  productInfoBox: {
    flexDirection: "row",
    borderRadius: 5,
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    paddingLeft: 15,
    marginTop: 10,
    alignItems: "center",
  },
  productImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  productTitle: {
    fontFamily: Fonts.AppleB,
    letterSpacing: -0.35,
    color: "#222222",
  },
  productOption: {
    marginTop: 5,
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    letterSpacing: -0.3,
    color: "#777777",
  },
  expDates: {
    marginTop: 2.5,
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    letterSpacing: -0.3,
    color: "#777777",
  },
  payerBox: {
    paddingBottom: 20.4,
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    paddingTop: 19.6,
  },
  payer: {
    marginTop: 15.2,
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    letterSpacing: -0.35,
    color: "#222222",
  },
  point: {
    fontFamily: Fonts.AppleR,
    letterSpacing: -0.35,
    color: "#222222",
  },
  pointInput: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    height: 40,
    paddingTop: 5,
  },
  textForm: {
    fontFamily: Fonts.AppleR,
    letterSpacing: -0.35,
    color: "#222222",
    padding: 0,
  },
  pointBox: { marginVertical: 10, flexDirection: "row", height: 40 },
  pointView: {
    borderBottomColor: "#222222",
    borderBottomWidth: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "70%",
    marginRight: 20,
  },
  pointLeft: {
    fontFamily: Fonts.AppleR,
    letterSpacing: -0.35,
    color: "#222222",
  },
  pointBtn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: "#000000",
    width: "24%",
  },
  pointBtnText: {
    fontFamily: Fonts.AppleB,
    letterSpacing: -0.35,
    color: "#ffffff",
  },
  priceBox: {
    marginTop: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  priceTitle: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#999999",
  },
  price: {
    fontFamily: Fonts.AppleB,
    letterSpacing: -0.35,
    color: "#222222",
  },
  submitBtnBox: { flexDirection: "row", height: 60, width: "100%" },
  submitBox: {
    // width: "50%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#000000",
  },
  submit: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    color: "#f5f5f5",
  },
  totalPriceBox: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    marginBottom: 25,
  },
  totalPriceTitle: {
    fontFamily: Fonts.AppleB,
    fontSize: 18,
    letterSpacing: -0.45,
    color: "#000000",
  },
  totalPrice: {
    fontFamily: Fonts.AppleB,
    fontSize: 18,
    letterSpacing: -0.45,
    color: Colors.MAIN_COLOR,
  },
  paymentResultBox: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
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
  purchaseListBtnText: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    letterSpacing: -0.5,
    color: "#ffffff",
  },
  homeBtn: { position: "absolute", bottom: 30 },
  homeBtnText: {
    fontFamily: Fonts.AppleL,
    letterSpacing: -0.7,
    textAlign: "center",
    color: "#969696",
    textDecorationLine: "underline",
  },
});

class TicketPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exchng_vol_trd_no: "", // 교환권 번호
      exchng_vol_trd_typ_cd: "", // 교환권 타입
      payment_price: 0, // 결제 금액

      isPoint: false, // 모두사용 여부
      point: 0, // 사용 포인트
      point_str: "", // 사용 포인트_str

      mber_detail: {}, // 로그인한 회원 정보
      exchng_vol: {},
      reserv_purchase: {},
      auc_trd_mine: {},

    };
  }
  componentDidMount() {
    const {navigation} = this.props;
    const {exchng_vol_trd_typ_cd, exchng_vol_trd_no} = navigation.state.params;
    this.setState({exchng_vol_trd_no})
    if(exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i) {
      const {immedi_purchase_prc} = navigation.state.params;
      this.setState({payment_price: parseInt(immedi_purchase_prc), exchng_vol_trd_typ_cd})
    } else {
      const {desiredBid} = navigation.state.params;
      this.setState({payment_price: parseInt(desiredBid), exchng_vol_trd_typ_cd})
    }
    this.getMberDetail();
    this.getExchngDetail();
  }
  // 교환권 정보
  getExchngDetail = () => {
    const {navigation} = this.props;
    const {exchng_vol_trd_no} = navigation.state.params;
    let params = {
      exchng_vol_trd_no: exchng_vol_trd_no
    }
    this.props.getExchngDetail(params).then((res) => {
      const exchng_vol_trd_typ_cd = res.exchng_vol_trd.exchng_vol_trd_typ_cd;
      let purchase_sts_cd = exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i ? res.exchng_vol_trd.exchng_vol_trd_immedi_purchase_sts_cd : res.exchng_vol_trd.exchng_vol_trd_auc_trd_sts_cd;
      this.setState({
        isTicketLoading: false,
        exchng_vol: res.exchng_vol_trd.exchng_vol,
        reserv_purchase: res.exchng_vol_trd.reserv_purchase,
        auc_trd_mine: res.exchng_vol_trd.auc_trd_mine
      })
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
  // 경매 입찰
  //
  handleAband = () => {
    const {navigation} = this.props;
    const {exchng_vol_auc_trd_no} = navigation.state.params;
    let params = {
      exchng_vol_auc_trd_no: exchng_vol_auc_trd_no
    }
    console.log("handleAband params")
    console.log(params)
    this.props.abandAuc(params).then((res) => {
      this.handleAuc();
    }).catch((err) => {
    });
  }
  handleAuc = () => {
    // createAuc
    const {navigation} = this.props;
    const {exchng_vol_trd_no, exchng_vol_trd_typ_cd, payment_price, point, reserv_purchase} = this.state;
    // desiredBid
    let params = {
      bid_prc: payment_price,
      exchng_vol_trd_no: exchng_vol_trd_no
    }

    console.log("params")
    console.log(params)

    this.props.createAuc(params).then(async (res) => {
      // 입찰 시, PG사 연결 필요
      // available && 포인트 처리
      const isAvailable = await this.checkAvailableAuc(res.detail.exchng_vol_auc_trd_no);
      if(isAvailable)
        this.handleAucNext(res.detail.exchng_vol_auc_trd_no).then(() => {
          if (parseInt(payment_price) - parseInt(point || 0) !== 0) {
            navigation.replace("PaymentWebView", {
              isPointAvailable: isAvailable,
              pnt_amt: parseInt(point || 0),
              amount: parseInt(payment_price) - parseInt(point || 0),
              exchng_vol_trd_no: exchng_vol_trd_no,
              exchng_vol_auc_trd_no: res.detail.exchng_vol_auc_trd_no,
              exchng_vol_trd_typ_cd: exchng_vol_trd_typ_cd,
              goods_nm: reserv_purchase.goods_nm, // 상품명
            })
          } else {
            navigation.navigate("TicketPaymentResult", {
              exchng_vol_trd_typ_cd: exchng_vol_trd_typ_cd,
            })
          }
        })
    }).catch((err) => {
      navigation.navigation("TicketPaymentResultFail");
    });
  }
  handleAucNext = async (exchng_vol_auc_trd_no) => {
    const {exchng_vol_trd_no, payment_price, point} = this.state;
    let auc_point
    if (parseInt(payment_price) - parseInt(point || 0) === 0)
      auc_point = await this.handleAucPoint(exchng_vol_auc_trd_no)
    await Promise.all([auc_point]);
  }
  handleAucPoint = (exchng_vol_auc_trd_no) => {
    const {point} = this.state;
    let params = {
      exchng_vol_auc_trd_no,
      pnt_amt: parseInt(point)
    }

    return this.props.createAucExchngPoint(params).then((res) => {

    }).catch((err) => {
    });
  }
  checkAvailableAuc = (exchng_vol_auc_trd_no) => {
    const {point} = this.state;
    let params = {
      exchng_vol_auc_trd_no,
      pnt_amt : parseInt(point)
    }
    console.log("params")
    console.log(params)
    return this.props.availableAucExchng(params).then((res) => {
      return true;
    }).catch((err) => {
      return false;
    });
  }
  // 즉시구매
  handleImmedi = async () => {
    const {navigation} = this.props;
    const {exchng_vol_trd_no, exchng_vol_trd_typ_cd, payment_price, point, reserv_purchase} = this.state;

    const isAvailable = await this.checkAvailableImmedi(exchng_vol_trd_no);

    if(isAvailable)
      this.handleImmediNext().then(() => {
        if (parseInt(payment_price) - parseInt(point || 0) !== 0) {
          navigation.replace("PaymentWebView", {
            isPointAvailable: isAvailable,
            pnt_amt: parseInt(point || 0),
            amount: parseInt(payment_price) - parseInt(point || 0),
            exchng_vol_trd_no: exchng_vol_trd_no,
            exchng_vol_trd_typ_cd: exchng_vol_trd_typ_cd,
            goods_nm: reserv_purchase.goods_nm, // 상품명
          })
        } else {
          navigation.navigate("TicketPaymentResult", {
            exchng_vol_trd_typ_cd: exchng_vol_trd_typ_cd,
          })
        }
      })
  }
  handleImmediNext = async () => {
    const {exchng_vol_trd_no, payment_price, point} = this.state;
    let immedi_point
    if (parseInt(payment_price) - parseInt(point || 0) === 0)
      immedi_point = await this.handleImmediPoint(exchng_vol_trd_no)
    await Promise.all([immedi_point]);
  }
  handleImmediPoint = (exchng_vol_trd_no) => {
    const {point} = this.state;
    let params = {
      exchng_vol_trd_no,
      pnt_amt: parseInt(point)
    }

    return this.props.createImmediExchngPoint(params).then((res) => {

    }).catch((err) => {
    });
  }
  checkAvailableImmedi = (exchng_vol_trd_no) => {
    const {point} = this.state;
    let params = {
      exchng_vol_trd_no,
      pnt_amt : parseInt(point)
    }
    return this.props.availableImmediExchng(params).then((res) => {
      return true;
    }).catch((err) => {
      return false;
    });
  }

  renderProductInfo = () => {
    const {reserv_purchase, exchng_vol} = this.state;

    const currentTime = dateUtil.format('x', new Date());
    const limitTime = moment(dateUtil.formatKCT("dash", exchng_vol.expir_dt)).hours('23').minutes('59') // 한국 시간 : 23시 59분으로 변경
    const day = 1000 * 60 * 60 * 24;
    const remindTime = limitTime - currentTime;

    const remainDays = Math.floor(remindTime / day) + 1;
    return (
      <View style={styles.productInfoContainer}>
        <Text style={styles.title}>{TicketText.purchaseVoucher}</Text>
        <View style={styles.productInfoBox}>
          <Image
            style={styles.productImg}
            source={{uri: reserv_purchase.thumb_url}}
          />
          <View>
            <Text style={styles.productTitle}>{reserv_purchase.goods_nm}</Text>
            <Text style={styles.productOption}>
              {TicketText.option} : {reserv_purchase.goods_optn_nm || ""}
            </Text>
            <Text style={styles.expDates}>
              {TicketText.validity} :
              ~{dateUtil.formatKCT("point", exchng_vol.expir_dt)}({remainDays}일)
            </Text>
          </View>
        </View>
      </View>
    );
  };

  renderPayerInfo = () => {
    const {eSESSION} = this.props;
    return (
      <View style={styles.payerBox}>
        <Text style={styles.title}>{TicketText.payerInformation}</Text>
        <Text style={styles.payer}>
          {`${maskingId(eSESSION.mber_nm || "")}, ${maskingPhone(eSESSION.moblphon_no || "")}`}
          {eSESSION.mber_se_cd === CodeText.mber_se_cd_c && `\n${maskingId(eSESSION.entpr_nm || "")}, ${maskingEmail(eSESSION.email_addr || "")}`}
        </Text>
      </View>
    );
  };

  // 포인트 정보
  renderPaymentInfo = () => {
    const {isPoint, point, mber_detail, point_str, payment_price, exchng_vol_trd_typ_cd} = this.state;
    return (
      <View style={{ paddingTop: 19.6 }}>
        <Text style={styles.title}>{TicketText.payment}</Text>
        <View style={styles.pointBox}>
          <View style={styles.pointView}>
            <Text style={styles.point}>{TicketText.point}</Text>
            <View style={styles.pointInput}>
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
              style={styles.pointBtn}
              onPress={() => {
                let use_point = Math.round(parseInt(mber_detail.포인트) * 0.001) * 1000
                if(payment_price < use_point)
                  while (payment_price < use_point)
                    use_point -= 1000
                isPoint ?
                    this.setState({point: 0, point_str: 0, isPoint: !isPoint})
                    : use_point ? this.setState({point: use_point, point_str: use_point + "", isPoint: !isPoint}) : null
              }}>
            <Text style={styles.pointBtnText}>
              {!isPoint ? TicketText.allUse : TicketText.cancelUse}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.point}>
          {TicketText.leftover}: {formattedNumber(parseInt(mber_detail.포인트 || 0) - parseInt(point || 0) || "")}P
        </Text>
        <View style={styles.priceBox}>
          <View style={styles.rowBetween}>
            <Text style={styles.priceTitle}>
              {exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i ? TicketText.voucherAmount : TicketText.voucherBidAmount}
            </Text>
            <Text style={styles.price}>
              {`${formattedNumber(parseInt(payment_price))}${StoreText.won}`}
            </Text>
          </View>
          <View style={[styles.rowBetween, {marginTop: 11}]}>
            <Text style={styles.priceTitle}>{TicketText.redeemPoints}</Text>
            <Text style={styles.price}>{formattedNumber(parseInt(point || 0) || "")}P</Text>
          </View>
        </View>
        <View style={styles.totalPriceBox}>
          <View style={styles.rowBetween}>
            <Text style={styles.totalPriceTitle}>{TicketText.totalPaymentAmount}</Text>
            <Text style={styles.totalPrice}>
              {`${formattedNumber(parseInt(payment_price) - parseInt(point || 0))}${StoreText.won}`}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  renderSubmitBtns = () => {
    const {navigation} = this.props;
    const {exchng_vol_trd_typ_cd, payment_price, point} = this.state;
    let isAband = false;
    if(navigation.state.params.exchng_vol_auc_trd_no)
      isAband = true;
    return (
      <View style={styles.submitBtnBox}>
        <TouchableOpacity
          style={styles.submitBox}
          onPress={() => {
            if(exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i)
              this.handleImmedi();
            else {
              console.log("isAband", isAband)
              if(isAband) this.handleAband();
              else this.handleAuc();
            }
          }}
        >
          <Text style={styles.submit}>
            {`${formattedNumber(parseInt(payment_price) - parseInt(point || 0))}${StoreText.won}`} {TicketText.makeAPayment}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <TopHeader
            title={TicketText.ticketPurchase}
            navigation={navigation}
            hasRightBtn={false}
        />
        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20 }}>
          {this.renderProductInfo()}
          {this.renderPayerInfo()}
          {this.renderPaymentInfo()}
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
  getExchngDetail: (params) => dispatch(ActionExchng.getDetail(params)),
  createAuc: (params) => dispatch(ActionExchng.createAuc(params)),
  abandAuc: (params) => dispatch(ActionExchng.abandAuc(params)),
  // 주문서 상세 API
  getMberDetail: (params) => dispatch(ActionMber.getDetail(params)), // 내 정보
  // point available
  availableImmediExchng: (params) => dispatch(ActionPayment.availableImmediExchng(params)),
  createImmediExchngPoint: (params) => dispatch(ActionPayment.createImmediExchngPoint(params)),
  availableAucExchng: (params) => dispatch(ActionPayment.availableAucExchng(params)),
  createAucExchngPoint: (params) => dispatch(ActionPayment.createAucExchngPoint(params)),
});
export default connect(mapStateToProps, mapDispatchToProps)(TicketPayment);
