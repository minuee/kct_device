// 교환권 상세
// 판매자 화면/구매자 화면/경매참여완료 화면/입찰완료 화면/입찰자 화면 > 모두 해당 화면에서 처리
import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground, Share,
} from "react-native";
import moment from "moment";
import {connect} from "react-redux";

import styles from "./styles";

import { DEVICE_WIDTH } from "../../../model/lib/Utils/Constants";
import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";
import {appScheme, CodeText, Generic, StoreText, TicketText} from "../../../model/lib/Utils/Strings";
import * as dateUtil from "../../../model/lib/Utils/Date";
import {formattedNumber, maskingId} from "../../../model/lib/Utils";

import AlertModal from "../../../component/modal/AlertModal";
import LinkShareModal from "../../../component/modal/LinkShareModal";
import ConfirmModal from "../../../component/modal/ConfirmModal";
import { TopHeader } from "../../../component/TopHeader";
import {TicketTimerItem} from "../../../component/ticket/TicketTimerItem";

import * as ActionGoods from "../../../model/action/eGOODS";
import * as ActionExchng from "../../../model/action/eEXCHNG_VOL";

class TicketDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isTicketLoading: true,
      purchase_sts_cd: "",
      exchng_vol_trd_typ_cd: "",
      goods_no: "",
      exchng_vol_trd_no: "",
      isShowHeaderOptionBox: false,
      isShowAlertModal: false,
      isShowLinkShareModal: false,
      isShowMessageModal: false,

      goods: {},
      info: {},

      exchng_vol_trd: {},
      exchng_vol: {},
      reserv_purchase: {},
      auc_list: [],
      auc_trd_mine: {},
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const {goods_no, exchng_vol_trd_no} = navigation.state.params;
    this.setState({goods_no, exchng_vol_trd_no})
    this.getStoreDetail(goods_no);
    this.getExchngDetail(exchng_vol_trd_no);
    this.getAucList(exchng_vol_trd_no);
  }

  getStoreDetail = (goods_no) => {
    const {navigation} = this.props;
    let params = {
      goods_no: goods_no
    }
    this.props.getStoreDetail(params).then((res) => {
      this.setState({
        goods: res.goods,
        info: res.info,
        isLoading: false,
      })
    }).catch((err) => {
      navigation.pop();
    });
  }

  getExchngDetail = (exchng_vol_trd_no) => {
    let params = {
      exchng_vol_trd_no: exchng_vol_trd_no
    }
    this.props.getExchngDetail(params).then((res) => {
      const exchng_vol_trd_typ_cd = res.exchng_vol_trd.exchng_vol_trd_typ_cd;
      let purchase_sts_cd = exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i ? res.exchng_vol_trd.exchng_vol_trd_immedi_purchase_sts_cd : res.exchng_vol_trd.exchng_vol_trd_auc_trd_sts_cd;
      this.setState({
        isTicketLoading: false,
        exchng_vol_trd_typ_cd: exchng_vol_trd_typ_cd,
        purchase_sts_cd: purchase_sts_cd,
        exchng_vol_trd: res.exchng_vol_trd,
        exchng_vol: res.exchng_vol_trd.exchng_vol,
        reserv_purchase: res.exchng_vol_trd.reserv_purchase,
        auc_trd_mine: res.exchng_vol_trd.auc_trd_mine,
      })
    }).catch((err) => {
      this.setState({isTicketLoading: false})
    });
  }

  getAucList = (exchng_vol_trd_no) => {
    let params = {
      exchng_vol_trd_no: exchng_vol_trd_no,
      skip:0,
      limit: 5,
    }
    this.props.getAucList(params).then((res) => {
      this.setState({
        auc_list: res.list,
      })
    }).catch((err) => {
    });
  }

  onShare = async () => {
    const {exchng_vol_trd_no, goods_no} = this.state;
    const link = `${appScheme.app_scheme}/EXCHNG/goods_no=${goods_no}&exchng_vol_trd_no=${exchng_vol_trd_no}`
    try {
      const result = await Share.share({message: link});
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('activityType!');
        } else {
          console.log('Share!');

          this.props.getShare({exchng_vol_trd_no}).then((res) => {
          }).catch((err) => {
          });
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('dismissed');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  handleDelete = () => {
    const {navigation} = this.props;
    const {exchng_vol_trd, exchng_vol_trd_no} = this.state;
    let params = {
      // exchng_vol_no: exchng_vol_trd.exchng_vol_no
      exchng_vol_trd_no: exchng_vol_trd_no
    }
    console.log(params)
    this.props.remove(params).then((res) => {
      const {setIsShowToast} = navigation.state.params;
      this.setState({isShowAlertModal: false});
      setIsShowToast();
      navigation.pop();
    }).catch((err) => {
    });
  }

  renderHeaderOptionBox = () => {
    const {navigation} = this.props;
    const { isShowHeaderOptionBox, exchng_vol_trd_no, exchng_vol_trd, auc_list, purchase_sts_cd } = this.state;
    if (isShowHeaderOptionBox) {
      return (
        <View
          style={styles.headerOptionContainer}
          shadowColor="#29000000"
          shadowOffset={{ width: 2.5, height: 2.5 }}
          shadowOpacity={1}
          elevation={0.4}
        >
          <TouchableOpacity
            style={styles.headerOptionBox}
            onPress={() => {
              if(auc_list.length === 0 && (purchase_sts_cd === "EVTATSC1" || purchase_sts_cd === "EVTIPSC1")) { // 입찰자가 없을 경우 + 판매 진행 중일 때
                this.setState({isShowHeaderOptionBox: false})
                navigation.push("TicketSaleBoard", {isUpdate: true, selectedTicket: exchng_vol_trd, exchng_vol_trd_no: exchng_vol_trd_no})
              }
              else
                this.setState({isShowHeaderOptionBox: false, isShowMessageModal: true})
            }}
          >
            <Text style={styles.headerOptionText}>{TicketText.editPost}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerOptionBox}
            onPress={() => {
              if(auc_list.length === 0 && (purchase_sts_cd === "EVTATSC1" || purchase_sts_cd === "EVTIPSC1")) // 입찰자가 없을 경우 + 판매 진행 중일 때
                this.setState({isShowHeaderOptionBox: false, isShowAlertModal: true})
              else
                this.setState({isShowHeaderOptionBox: false, isShowMessageModal: true})
            }}
          >
            <Text style={styles.headerOptionText}>{TicketText.deletePost}</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };

  renderProductImageBox = () => {
    const { goods, exchng_vol_trd_typ_cd, exchng_vol_trd, purchase_sts_cd } = this.state;

    let isFinish =
      (purchase_sts_cd === "EVTIPSC2" && exchng_vol_trd.immedi_purchase_complet_yn === "Y")
      || (purchase_sts_cd === "EVTATSC3" && exchng_vol_trd.auc_trd_complet_yn === "Y")
      || purchase_sts_cd === "EVTATSC3"
      || goods.sale !== StoreText.sale;

    return (
      <View style={{ alignItems: "center" }}>
        <View style={styles.eventBtnBox}>
          <View
            style={[
              styles.eventBtn,
              {backgroundColor: !isFinish ? Colors.MAIN_COLOR : "#dddddd",},
            ]}
          >
            <Text style={styles.eventBtnText}>
              {exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i
                ? isFinish
                  ? TicketText.purchaseComplete
                  : TicketText.sale
                : !isFinish
                ? TicketText.auctionInProgress
                : TicketText.transactionComplete}
            </Text>
          </View>
        </View>
        {isFinish ? (
          <ImageBackground
            source={{uri: goods.thumb_url}}
            style={{ width: DEVICE_WIDTH, height: DEVICE_WIDTH }}
          >
            <View style={styles.completeView}>
              <Image
                source={require("../../../assets/image/ticket/success_white.png")}
                style={{ width: 60, height: 60 }}
              />
              <Text style={styles.completeText}>
                {TicketText.purchaseComplete}
              </Text>
            </View>
          </ImageBackground>
        ) : (
          <Image
            source={{uri: goods.thumb_url}}
            style={{ width: DEVICE_WIDTH, height: DEVICE_WIDTH }}
          />
        )}
      </View>
    );
  };

  renderProductInfo = () => {
    const {navigation, eSESSION} = this.props;
    const { goods, auc_list, info, exchng_vol_trd_typ_cd, goods_no, exchng_vol_trd, exchng_vol, reserv_purchase } = this.state;

    const currentTime = dateUtil.format('x', new Date());
    const limitTime = moment(dateUtil.formatKCT("dash", exchng_vol.expir_dt)).hours('23').minutes('59') // 한국 시간 : 23시 59분으로 변경
    const day = 1000 * 60 * 60 * 24;
    const remindTime = limitTime - currentTime;

    const remainDays = Math.floor(remindTime / day) + 1;

    let auc_top_prc = exchng_vol_trd?.low_bid_prc;
    let auc_gap_prc = 0;
    if(exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_a && auc_list.length > 0) {
      auc_top_prc = auc_list[0].bid_prc;
      if(auc_list.length > 1)
        auc_gap_prc = auc_list[0].bid_prc - auc_list[1].bid_prc;
    }

    return (
      <View style={{ marginHorizontal: 20, marginTop: 24 }}>
        <Text style={styles.productTitle}>{reserv_purchase.goods_nm}</Text>
        <Text style={styles.productOption}>{reserv_purchase.goods_optn_nm || ""}</Text>
        {exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i ? (
          <View style={styles.immediatePurchaseBox}>
            <Text style={styles.productInfoTitle}>
              {TicketText.immediatePurchasePrice}
            </Text>
            <Text style={styles.currentPrice}>{`${formattedNumber(exchng_vol_trd?.immedi_purchase_prc)}${StoreText.won}`}</Text>
          </View>
        ) : (
          <View style={styles.auctionPriceBox}>
            <View style={styles.rowBetween}>
              <Text style={styles.productInfoTitle}>
                {TicketText.auctionLowestBid}
              </Text>
              <Text style={styles.productInfoTitle}>{`${formattedNumber(exchng_vol_trd?.low_bid_prc)}${StoreText.won}`}</Text>
            </View>
            <View style={styles.latestBidBox}>
              <Text style={styles.productInfoTitle}>
                {TicketText.latestBid}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={require("../../../assets/image/store/up_graphic_icon_2.png")}
                  style={styles.upArrow}
                />
                <Text style={styles.changedPrice}>{formattedNumber(auc_gap_prc)}</Text>
                <Text style={styles.currentPrice}>{`${formattedNumber(auc_top_prc)}${StoreText.won}`}</Text>
              </View>
            </View>
          </View>
        )}
        {exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i ? ( /* 즉시거래 : 구매자 */
            exchng_vol_trd.purchase_mber_no === eSESSION.mber_no && this.renderReminingTimeBox(false)
        ) : (
          <>
            {this.renderAuctionStatus()}
            {this.renderBiddingStatus()}
          </>
        )}

        <View style={styles.productInfoContainer}>
          <View style={styles.productInfoBox}>
            <View>
              <Text style={styles.productInfoSubTitle}>
                {TicketText.manufacturer}
              </Text>
              <Text style={styles.productInfoSubTitle}>
                {TicketText.modelNumber}
              </Text>
              <Text style={styles.productInfoSubTitle}>
                {TicketText.releaseDate}
              </Text>
              <Text style={styles.productInfoSubTitle}>
                {TicketText.releasePrice}
              </Text>
              <Text style={styles.productInfoSubTitle}>
                {TicketText.dateOfPurchase}
              </Text>
              <Text style={styles.productInfoSubTitle}>
                {TicketText.productDetails}
              </Text>
              <Text style={styles.productInfoSubTitle}>
                {TicketText.voucherSerialNumber}
              </Text>
              <Text style={styles.productInfoSubTitle}>
                {TicketText.voucherValidityPeriod}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.productInfo}>{info.makr_nm}</Text>
              <Text style={styles.productInfo}>{info.model_no}</Text>
              <Text style={styles.productInfo}>{dateUtil.formatKCT("slash", info.cmt_de)}</Text>
              <Text style={styles.productInfo}>{`${formattedNumber(info.sellng_prc)} ${StoreText.won}`}</Text>
              <Text style={styles.productInfo}>{dateUtil.formatKCT("dash", reserv_purchase.reserv_purchase_prog_dt)}</Text>
              <TouchableOpacity
                onPress={() => navigation.push("StoreReserve", {goods_no: goods_no})}>
                <Text style={[styles.productInfo, {color: "#ef2583", textDecorationLine: "underline"}]}>
                  상품상세 보러가기
                </Text>
              </TouchableOpacity>

              <Text style={styles.productInfo}>{exchng_vol.exchng_vol_serial_no}</Text>
              <Text style={styles.productInfo}>{remainDays}일</Text>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.productInfoContainer,
            {
              paddingBottom: 59.5,
            },
          ]}
        >
          <Text style={styles.productInfoSubTitle}>
            {TicketText.productDescription}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.AppleR,
              letterSpacing: -0.35,
              color: "#000000",
              marginTop: -5,
            }}
          >
            {exchng_vol_trd.exchng_vol_trd_cont}
          </Text>
        </View>

        <View
          style={[styles.productInfoBox, { marginTop: 19.5, marginBottom: 40 }]}
        >
          <View>
            <Text style={styles.productInfoSubTitle2}>
              {TicketText.registrationDate}
            </Text>
            <Text style={styles.productInfoSubTitle2}>{TicketText.seller}</Text>
            <Text style={styles.productInfoSubTitle2}>
              {TicketText.paymentBalance}
            </Text>
            <Text style={styles.productInfoSubTitle2}>
              {TicketText.balancePaymentDate}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.productInfo2}>{dateUtil.formatKCT("dash", exchng_vol_trd.inst_dt)}</Text>
            <Text style={styles.productInfo2}>{maskingId(exchng_vol_trd.sale_mber_email_addr.split("@")[0])}</Text>
            <Text style={styles.productInfo2}>{formattedNumber(reserv_purchase.remain_amt)}{StoreText.won}</Text>
            <Text style={styles.productInfo2}>{dateUtil.formatKCT("dash", goods.sale_end_dt)} 부터 3일 이내</Text>
          </View>
        </View>
      </View>
    );
  };

  renderReminingTimeBox = (isAuction) => {
    const {exchng_vol_trd} = this.state;
    // auc_end_dt
    return (
      <View
        style={
          isAuction ? styles.reminingAuctionTimeBox : styles.reminingTimeBox
        }
      >
        <View>
          <Text style={styles.regularTitle}>
            {isAuction
              ? TicketText.auctionDeadline
              : TicketText.salesClosingDate}
          </Text>
          <Text style={styles.auctionDeadline}>{dateUtil.formatKCT("koreanTime", exchng_vol_trd?.auc_end_dt)}{exchng_vol_trd?.auc_end_dt?.substring(8, 10)}시</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../../../assets/image/store/time_graphic_icon.png")}
            style={{ width: 16, height: 16, marginRight: 8 }}
          />
          <View>
            {exchng_vol_trd?.auc_end_dt && (<TicketTimerItem auc_end_dt={exchng_vol_trd?.auc_end_dt} />)}
            <View style={styles.textUnderline} />
          </View>
        </View>
      </View>
    );
  };

  renderAuctionStatus = () => {
    const {exchng_vol_trd, auc_list, goods, purchase_sts_cd} = this.state;

    const startTime = moment(dateUtil.formatKCT("dash", exchng_vol_trd.inst_dt));
    const currentTime = dateUtil.format('x', new Date());
    const endTime = moment(dateUtil.formatKCT("dash", exchng_vol_trd.auc_end_dt));
    const day = 1000 * 60 * 60 * 24;
    const remindTime = endTime - startTime;
    const remindTime1 = currentTime - startTime;

    const remainDays = Math.floor(remindTime / day) + 1;
    const currentDays = Math.floor(remindTime1 / day) + 1;
    const barWidth = 100 / remainDays;

    let auc_top_prc = exchng_vol_trd?.low_bid_prc;
    if(auc_list.length > 0) {
      auc_top_prc = auc_list[0].bid_prc;
    }

    let isFinish =
        (purchase_sts_cd === "EVTIPSC2" && exchng_vol_trd.immedi_purchase_complet_yn === "Y")
        || (purchase_sts_cd === "EVTATSC3" && exchng_vol_trd.auc_trd_complet_yn === "Y")
        || purchase_sts_cd === "EVTATSC3"
        || goods.sale !== StoreText.sale;
    return (
      <View style={styles.auctionStatusBox}>
        <Text style={styles.auctionStatus}>{TicketText.auctionStatus}</Text>
        <View style={{ flexDirection: "row" }}>
          <View style={[styles.pinkRound, isFinish ? {backgroundColor: "#333333"} : null]} />
          <Text style={styles.proceeding}>{isFinish ? TicketText.finishAuc : TicketText.proceeding}</Text>
        </View>

        <View style={{ marginTop: 45.8, width: "100%", paddingHorizontal: 25 }}>
          <View style={styles.auctionProgressBar}>
            <View
              style={[
                styles.auctionActiveProgressBar,
                {
                  width: `${barWidth * parseInt(currentDays) >= 100 ? 100 : barWidth * parseInt(currentDays)}%`,
                },
              ]}
            />
          </View>
          {barWidth * parseInt(currentDays) > 60 && barWidth * parseInt(currentDays) < 100 ? (
            <View style={{ marginTop: 2 }}>
              <View
                style={[
                  styles.triangle,
                  {
                    marginLeft: `${barWidth * parseInt(currentDays) - 2.4}%`,
                    transform: [{ rotate: "180deg" }],
                  },
                ]}
              />
              <View
                style={[
                  styles.remainingNumberBox,
                  { marginLeft: `${barWidth * parseInt(currentDays) - 24}%` },
                ]}
              >
                <Text style={styles.remainingNumber}>{`${formattedNumber(auc_top_prc)}${StoreText.won}`}</Text>
              </View>
            </View>
          ) : barWidth * parseInt(currentDays) >= 100 ? (
              <View style={{ marginTop: 2 }}>
                <View
                    style={[
                      styles.triangle,
                      {
                        marginLeft: `${100 - 2.4}%`,
                        transform: [{ rotate: "180deg" }],
                      },
                    ]}
                />
                <View
                    style={[
                      styles.remainingNumberBox,
                      { marginLeft: `${100 - 24}%` },
                    ]}
                >
                  <Text style={styles.remainingNumber}>{`${formattedNumber(auc_top_prc)}${StoreText.won}`}</Text>
                </View>
              </View>
          ) : (
            <View style={{ marginLeft: `${barWidth * parseInt(currentDays)}%`, marginTop: 2 }}>
              <View
                style={[
                  styles.triangle,
                  {
                    transform: [{ rotate: "270deg" }],
                  },
                ]}
              />
              <View style={[styles.remainingNumberBox, {alignSelf: 'flex-start', width: 68.8 }]}>
                <Text style={[styles.remainingNumber, {paddingHorizontal: 2}]} numberOfLines={1}>{`${formattedNumber(auc_top_prc)}${StoreText.won}`}</Text>
              </View>
            </View>
          )}
        </View>
        {this.renderReminingTimeBox(true)}
      </View>
    );
  };

  renderBiddingStatus = () => {
    const {auc_list} = this.state;
    return (
      <View style={styles.biddingStatusContainer}>
        <Text style={styles.auctionStatus}>{TicketText.biddingStatus}</Text>
        <View style={{ marginTop: 13.5 }}>
          <View style={styles.biddingStatusBox}>
            <View style={[styles.alignCenter, { width: "60%" }]}>
              <Text style={styles.biddingTitle}>{TicketText.biddingDate}</Text>
            </View>

            <View style={[styles.alignCenter, { width: "35%" }]}>
              <Text style={styles.biddingTitle}>
                {TicketText.purchasePrice}
              </Text>
            </View>
          </View>
          {auc_list.map((bidding) => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  height: 35,
                }}
              >
                <View style={[styles.alignCenter, { width: "60%" }]}>
                  <Text style={styles.biddingTitle}>{dateUtil.formatKCT("dashTime", bidding.bid_prog_dt)}</Text>
                </View>

                <View style={[styles.alignCenter, { width: "35%" }]}>
                  <Text style={styles.biddingTitle}>{formattedNumber(bidding.bid_prc)}</Text>
                </View>
              </View>
            );
          })}
          <Text style={styles.biddingDesc}>{TicketText.bidMessage}</Text>
        </View>
      </View>
    );
  };

  renderSubmitBtns = () => {
    const { navigation } = this.props;
    const { goods, goods_no, exchng_vol_trd_typ_cd, auc_trd_mine, purchase_sts_cd, exchng_vol_trd_no, exchng_vol_trd } = this.state;
    // EVTIPSC2 : 즉시거래 종료 // EVTATSC3 : 겅매거래 종료
    const auctionType = !auc_trd_mine?.exchng_vol_auc_trd_no;
    let isFinish =
        (purchase_sts_cd === "EVTIPSC2" && exchng_vol_trd.immedi_purchase_complet_yn === "Y")
        || (purchase_sts_cd === "EVTATSC3" && exchng_vol_trd.auc_trd_complet_yn === "Y")
        || purchase_sts_cd === "EVTATSC3"
        || goods.sale !== StoreText.sale;
    return (
      <View style={styles.submitBtnBox}>
        <TouchableOpacity
          style={[
            styles.submitBox,
            {
              width: "100%",
              backgroundColor: !isFinish ? Colors.MAIN_COLOR : "#dddddd",
            },
          ]}
          onPress={() => {
            if (exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i) {
              if (!isFinish)
                navigation.navigate("TicketPayment", {
                  exchng_vol_trd_typ_cd: exchng_vol_trd_typ_cd,
                  exchng_vol_trd_no: exchng_vol_trd_no,
                  immedi_purchase_prc: exchng_vol_trd?.immedi_purchase_prc
                });
            } else {
              if(!isFinish)
              navigation.navigate("TicketAuction", {
                goods_no: goods_no,
                exchng_vol_trd_typ_cd: exchng_vol_trd_typ_cd,
                exchng_vol_trd_no: exchng_vol_trd_no,
                bidType: auctionType ? "bid" : "reBid",
              });
            }
          }}
        >
          {exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_a ? (
            !auctionType ? (
              <>
                <Text style={styles.submit}>{TicketText.rebidAndWaiver}</Text>
                <Text
                  style={{
                    fontFamily: Fonts.AppleL,
                    fontSize: 11,
                    letterSpacing: -0.55,
                    color: "#ffffff",
                    textAlign: "center",
                    marginTop: 1.8,
                  }}
                >
                  {TicketText.myBid}: {formattedNumber(auc_trd_mine.bid_prc)}원
                </Text>
              </>
            ) : (
              <Text style={styles.submit}>
                {isFinish
                  ? TicketText.transactionCompleteDesc
                  : TicketText.toBid}
              </Text>
            )
          ) : (
            <Text style={styles.submit}>
              {!isFinish
                ? TicketText.purchase
                : TicketText.purchaseComplete}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { navigation, eSESSION } = this.props;
    const { isLoading, isTicketLoading, isShowHeaderOptionBox, isShowAlertModal, isShowLinkShareModal, isShowMessageModal, exchng_vol_trd } =
      this.state;
    if(isLoading || isTicketLoading)
      return null;
    else
      return (
        <View style={styles.container}>
          <TopHeader
            title={TicketText.detail}
            navigation={navigation}
            hasRightBtn={true}
            rightBtnStyle={{ width: 27.5, height: 27.5 }}
            rightBtnSource={
              exchng_vol_trd.sale_mber_no === eSESSION.mber_no
                ? require("../../../assets/image/ticket/more_grey.png")
                : null // require("../../../assets/image/store/share_product_store.png")
            }
            onPress={() => {
              if (exchng_vol_trd.sale_mber_no === eSESSION.mber_no) {
                this.setState({ isShowHeaderOptionBox: !isShowHeaderOptionBox });
              } else {
                // this.onShare();
                // this.setState({ isShowLinkShareModal: !isShowLinkShareModal });
              }
            }}
          />
          {this.renderHeaderOptionBox()}

          <ScrollView showsVerticalScrollIndicator={false}>
            {this.renderProductImageBox()}
            {this.renderProductInfo()}
          </ScrollView>
          {exchng_vol_trd.sale_mber_no !== eSESSION.mber_no && this.renderSubmitBtns()}
          {isShowAlertModal && (
            <AlertModal
              isShowAlertModal={isShowAlertModal}
              message={TicketText.deleteMessage}
              leftText={TicketText.no}
              rightText={TicketText.deleteConfirm}
              setVisible={() => this.setState({ isShowAlertModal: false })}
              navigation={navigation}
              leftOnPress={() => this.setState({ isShowAlertModal: false })}
              rightOnPress={() => this.handleDelete()}
            />
          )}
          {isShowMessageModal && (
            <ConfirmModal
              isShowConfirmModal={isShowMessageModal}
              setVisible={() => this.setState({isShowMessageModal: false})}
              title={Generic.notice}
              subtitle={TicketText.ticketBoardConfirmMessage}
            />
          )}
          {isShowLinkShareModal && (
            <LinkShareModal
              isShowLinkShareModal={isShowLinkShareModal}
              setVisible={() => this.setState({ isShowLinkShareModal: false })}
            />
          )}
        </View>
      );
  }
}

const mapStateToProps = (state) => ({
  eSESSION: state.eSESSION.eSESSION,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  getStoreDetail: (params) => dispatch(ActionGoods.getStoreDetail(params)),
  getShare: (params) => dispatch(ActionExchng.getShare(params)),
  getExchngDetail: (params) => dispatch(ActionExchng.getDetail(params)),
  getAucList: (params) => dispatch(ActionExchng.getAucList(params)),
  remove: (params) => dispatch(ActionExchng.remove(params)),
});
export default connect(mapStateToProps, mapDispatchToProps)(TicketDetail);
