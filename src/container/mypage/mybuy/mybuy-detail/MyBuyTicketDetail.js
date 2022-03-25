// 나의 구매내역 > 교환권내역 상세
import React, {Component, useEffect, useState} from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import moment from "moment";

import { TopHeader } from "../../../../component/TopHeader";

import Fonts from "../../../../model/lib/Utils/Fonts";
import Colors from "../../../../model/lib/Utils/Colors";
import * as dateUtil from "../../../../model/lib/Utils/Date";
import {formattedNumber} from "../../../../model/lib/Utils";
import {CodeText, MyPageText} from "../../../../model/lib/Utils/Strings";

import * as ActionExchng from "../../../../model/action/eEXCHNG_VOL";
import * as ActionGoods from "../../../../model/action/eGOODS";

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
  subtitle: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    letterSpacing: -0.3,
    color: "#999999",
    marginBottom: 15,
  },
  desc: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    letterSpacing: -0.3,
    color: "#222222",
    marginBottom: 15,
  },
  option: {
    fontFamily: Fonts.AppleR,
    fontSize: 11,
    letterSpacing: -0.28,
    color: "#999999",
  },

  warningMessage: {
    fontFamily: Fonts.AppleR,
    fontSize: 11,
    letterSpacing: -0.28,
    color: "#999999",
    marginBottom: 4,
  },
  warningTitle: {
    fontFamily: Fonts.AppleB,
    fontSize: 12,
    letterSpacing: -0.3,
    color: "#000000",
    marginBottom: 9.2,
    marginTop: 2,
  },
  productInfoWrap: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "white",
    marginBottom: 30,
  },
  productInfoView: {
    paddingBottom: 24.5,
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  productInfoTitle: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#555555",
    marginTop: 15,
  },
  productInfoOptn: {
    fontFamily: Fonts.AppleB,
    fontSize: 21,
    letterSpacing: -0.53,
    color: "#000000",
    marginTop: 4,
  },
  productInfoPrc: {
    fontFamily: Fonts.AppleB,
    fontSize: 17,
    letterSpacing: -0.43,
    color: Colors.MAIN_COLOR,
    marginTop: 12,
  },
  productTypWrap: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: "#bbbbbb",
    marginTop: 4,
  },
  productTypText: {
    fontFamily: Fonts.AppleB,
    fontSize: 15,
    letterSpacing: -0.75,
    color: "#ffffff",
  },
  remainPaymentBtn: {
    width: "100%",
    height: 60,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  remainPaymentBtnText: {
    fontFamily: Fonts.AppleL,
    fontSize: 20,
    letterSpacing: -1,
    color: "#ffffff",
    textAlign: 'center'
  },
  deadlineWrap: {
    paddingLeft: 17.5,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
});

class MyBuyTicketDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      goods_no: "",
      exchng_vol_trd_no: "",

      purchase_sts_cd: "",
      exchng_vol_trd_typ_cd: "",

      goods: {},
      reserv_purchase_mine: {},

      exchng_vol_trd: {},
      exchng_vol: {},
      reserv_purchase: {},
      auc_trd_mine: {},
      exchng_vol_auc_trd_no: "",
      exchng_str_nm: "",
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const {exchng_vol_trd_no} = navigation.state.params;
    this.setState({exchng_vol_trd_no});
    if(navigation.state.params.exchng_vol_auc_trd_no)
      this.getExchngAucDetail();
    this.getExchngDetail(exchng_vol_trd_no);
  }

  getExchngDetail = (exchng_vol_trd_no) => {
    let params = {
      exchng_vol_trd_no: exchng_vol_trd_no
    }
    this.props.getExchngDetail(params).then((res) => {
      const exchng_vol_trd_typ_cd = res.exchng_vol_trd.exchng_vol_trd_typ_cd;
      let purchase_sts_cd = exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i ? res.exchng_vol_trd.exchng_vol_trd_immedi_purchase_sts_cd : res.exchng_vol_trd.exchng_vol_trd_auc_trd_sts_cd;

      let exchng_str_nm = "거래완료";
      if(purchase_sts_cd === "EVTATSC1") exchng_str_nm = "입찰진행";
      if(purchase_sts_cd === "EVTATSC2") exchng_str_nm = "입찰실패";
      if(purchase_sts_cd === "EVTATSC3") exchng_str_nm = "입찰성공";

      this.setState({
        isLoading: false,
        exchng_vol_trd_typ_cd: exchng_vol_trd_typ_cd,
        purchase_sts_cd: purchase_sts_cd,
        exchng_vol_trd: res.exchng_vol_trd,
        exchng_vol: res.exchng_vol_trd.exchng_vol,
        reserv_purchase: res.exchng_vol_trd.reserv_purchase,
        // auc_trd_mine: res.exchng_vol_trd.auc_trd_mine,
        exchng_str_nm: exchng_str_nm,
      })
      this.getStoreDetail(res.exchng_vol_trd.reserv_purchase.goods_no);
    }).catch((err) => {
      this.setState({isTicketLoading: false})
    });
  }

  getExchngAucDetail = () => {
    const {navigation} = this.props;
    const {exchng_vol_auc_trd_no} = navigation.state.params;
    console.log("exchng_vol_auc_trd_no", exchng_vol_auc_trd_no)
    this.props.getExchngAucDetail({exchng_vol_auc_trd_no}).then((res) => {
      this.setState({
        exchng_vol_auc_trd_no,
        auc_trd_mine: res.exchng_vol_auc_trd,
      })
      // this.setState({
      //   goods: res.goods,
      //   reserv_purchase_mine: res.reserv_purchase_mine
      // })
    }).catch((err) => {
      navigation.pop();
    });
  }

  getStoreDetail = (goods_no) => {
    const {navigation} = this.props;
    let params = {
      goods_no: goods_no
    }
    this.props.getStoreDetail(params).then((res) => {
      this.setState({
        goods: res.goods,
        reserv_purchase_mine: res.reserv_purchase_mine
      })
    }).catch((err) => {
      navigation.pop();
    });
  }

  renderCompleteInfoBox = () => {
    const {exchng_vol_trd, exchng_vol_trd_typ_cd} = this.state;
    const prog_dt = exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i ? exchng_vol_trd.immedi_purchase_prog_dt : exchng_vol_trd.auc_trd_prog_dt
    return (
      <View style={styles.orderInfoBox}>
        <Text style={styles.cancelDates}>{prog_dt ? dateUtil.formatKCT("point", prog_dt) : ""}</Text>
        <Text style={styles.orderNum}>{`주문번호 ${exchng_vol_trd.exchng_vol_trd_no}`}</Text>
        <View style={styles.divider} />

        <View style={{ paddingBottom: 11.5 }}>
          <View style={{ flexDirection: "row" }}>
            <Image
              source={require("../../../../assets/image/mypage/info_icon_pink.png")}
              style={{ width: 18, height: 18, marginRight: 7.2 }}
            />
            <View>
              <Text style={styles.warningTitle}>꼭 확인해주세요.</Text>
              <Text style={styles.warningMessage}>
                - 교환권 상품에 문제가 있을 경우, 고객센터를 이용해주세요.
              </Text>
              <Text style={styles.warningMessage}>
                - 교환권은 교환/환불이 불가합니다.
              </Text>
              <Text style={styles.warningMessage}>
                - 잔금 결제는 명시된 날짜까지 완료해주세요.
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const {isLoading, goods, auc_trd_mine, reserv_purchase_mine, exchng_vol_trd, reserv_purchase, exchng_vol, exchng_vol_trd_typ_cd, exchng_str_nm} = this.state;

    const ticket_prc = exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i ? exchng_vol_trd.immedi_purchase_prc : exchng_vol_trd.low_bid_prc;
    const ticket_end_dt = exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i ? "즉시구매" : dateUtil.formatKCT("koreanFullTime", exchng_vol_trd.auc_end_dt);

    const isRemain = (reserv_purchase_mine?.reserv_purchase_sts_cd === CodeText.reserv_purchase_sts_cd_s || reserv_purchase_mine?.reserv_purchase_sts_cd === CodeText.reserv_purchase_sts_cd_r); // 잔금결제 필요||완료
    const remain_amt_pay_valid_dt = goods.remain_amt_pay_valid_dt;

    let exchng_auc_str_nm = exchng_str_nm;
    if(auc_trd_mine.exchng_vol_auc_trd_sts_cd === "EVATSC06") exchng_auc_str_nm = "입찰포기"

    if(isLoading)
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
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {this.renderCompleteInfoBox()}
            <View style={styles.productInfoWrap}>
              <View style={styles.productInfoView}>
                <Image
                  source={{uri : reserv_purchase.thumb_url}}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                />
                <Text style={styles.productInfoTitle}>
                  {reserv_purchase.goods_nm}
                </Text>
                <Text style={styles.productInfoOptn}>
                  {reserv_purchase.goods_optn_nm}
                </Text>
                <Text style={styles.productInfoPrc}>
                  {formattedNumber(parseInt(ticket_prc || 0))}원
                </Text>
                <View style={styles.productTypWrap}>
                  <Text style={styles.productTypText}>
                    {exchng_auc_str_nm}
                  </Text>
                </View>
              </View>
              <View style={[styles.betweenCenter, styles.deadlineWrap]}>
                <View>
                  <Text style={styles.subtitle}>{MyPageText.biddingDeadline}</Text>
                  <Text style={styles.subtitle}>{MyPageText.productDetail}</Text>
                  <Text style={styles.subtitle}>{MyPageText.serialNum}</Text>
                  <Text style={styles.subtitle}>{MyPageText.ticketExpDates}</Text>
                  <Text style={styles.subtitle}>{MyPageText.paymentDate}</Text>
                </View>
                <View>
                  <Text style={styles.desc}>{ticket_end_dt}</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("StoreReserve", {goods_no: reserv_purchase.goods_no})}>
                    <Text style={[styles.desc, {color: Colors.MAIN_COLOR, textDecorationLine: "underline"}]}>
                      상품상세 보러가기
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.desc}>{exchng_vol_trd.exchng_vol_serial_no}</Text>
                  <Text style={styles.desc}>{dateUtil.formatKCT("koreanFullTime", exchng_vol.expir_dt)}까지</Text>
                  <Text style={styles.desc}>{reserv_purchase.remain_amt_pay_yn === "Y" ? dateUtil.formatKCT("koreanFullTime", reserv_purchase.remain_amt_pay_dt): MyPageText.outstanding}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
          {reserv_purchase.remain_amt_pay_yn === "N" && auc_trd_mine.exchng_vol_auc_trd_sts_cd !== "EVATSC06" && (
            <TouchableOpacity
              style={[styles.remainPaymentBtn, isRemain ? null : {backgroundColor: "#bbbbbb"}]}
              onPress={() => {
                if(isRemain)
                  navigation.navigate("Payment", {
                    purchaseType: "remain_reserv",
                    goods_no: goods.goods_no,
                  })
              }}
            >
              <Text style={styles.remainPaymentBtnText}>
                {MyPageText.payTheBalance}
                {isRemain && remain_amt_pay_valid_dt && (<TicketTimerItem remain_amt_pay_valid_dt={remain_amt_pay_valid_dt} />)}
                {!isRemain && goods.sale_end_dt && (
                  <Text style={{fontSize: 15}}>
                    {`\n(${dateUtil.formatKCT("koreanFullTime", goods.sale_end_dt)}부터)`}
                  </Text>
                )}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
  }
}

export const TicketTimerItem = (props) => {
  const { remain_amt_pay_valid_dt } = props;

  /* TIMER MODULE START */
  const [calFinish, setCalFinish] = useState(false);
  const [remindTimeText, setRemindTimeText] = useState("");
  let rTLimitTimeCounter = null;
  useEffect(() => {
    rTLimitTimeCounter = setInterval(() => {
      const currentTime = dateUtil.format('x', new Date());
      const limitTime = moment(dateUtil.formatKCT("dash", remain_amt_pay_valid_dt)).hours(remain_amt_pay_valid_dt?.substring(8, 10)).minutes(remain_amt_pay_valid_dt?.substring(10, 12));

      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;
      const day = hour * 24;
      const remindTime = limitTime - currentTime;

      let days = Math.floor(remindTime / day);
      let hours = Math.floor((remindTime % day) / hour);
      let minutes = Math.floor((remindTime % hour) / minute);

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (currentTime > limitTime) {
        setRemindTimeText("결제기간이 만료되었습니다.");
        setCalFinish(true);
        clearInterval(rTLimitTimeCounter);
        return;
      }
      setRemindTimeText(`${days}일 ${hours}시간 ${minutes}분 남음`);
      setCalFinish(true);
    }, 1000);
  }, []);
  /* TIMER MODULE END */

  return (
      <Text style={{fontSize: 15}}>
        {calFinish ? `${remindTimeText}` : ""}
      </Text>
  );
};

const mapStateToProps = (state) => ({
  eSESSION: state.eSESSION.eSESSION,
  eCOMM_CD: state.eCOMM_CD.eCOMM_CD,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  getExchngDetail: (params) => dispatch(ActionExchng.getDetail(params)),
  getExchngAucDetail: (params) => dispatch(ActionExchng.getAucDetail(params)),
  getStoreDetail: (params) => dispatch(ActionGoods.getStoreDetail(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyBuyTicketDetail);
