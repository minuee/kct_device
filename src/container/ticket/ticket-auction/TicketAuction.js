// 교환권 입찰
// 교환권 결제 화면
import React, {Component} from "react";
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
} from "react-native";
import {connect} from "react-redux";
import moment from "moment";

import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";
import {CodeText, StoreText, TicketText} from "../../../model/lib/Utils/Strings";
import {formattedNumber, notifyMessage} from "../../../model/lib/Utils";
import * as dateUtil from "../../../model/lib/Utils/Date";

import {TopHeader} from "../../../component/TopHeader";
import TextInputStr from "../../../common/textinput/TextInput";
import AlertModal from "../../../component/modal/AlertModal";
import AuctionModal from "../../../component/modal/AuctionModal";

import styles from "./styles";

import * as ActionExchng from "../../../model/action/eEXCHNG_VOL";
import * as ActionGoods from "../../../model/action/eGOODS";
import {abandAuc} from "../../../model/action/eEXCHNG_VOL";

class TicketAuction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isTicketLoading: true,
            exchng_vol_trd_typ_cd: "",

            exchng_vol_trd_no: "",
            bidType: "",
            isPurchaseComplete: false,
            desiredBid: "",
            isShowAlertModal: false,
            isShowAuctionModal: false,

            exchng_vol_trd: {},
            exchng_vol: {},
            reserv_purchase: {},
            auc_list: [],
            auc_trd_mine: {},
            goods: {},
        };
    }

    componentDidMount() {
        const {navigation} = this.props;
        const {exchng_vol_trd_no, exchng_vol_trd_typ_cd, bidType, goods_no} = navigation.state.params;
        this.setState({exchng_vol_trd_no, exchng_vol_trd_typ_cd, bidType, goods_no});
        this.getExchngDetail(exchng_vol_trd_no);
        this.getAucList(exchng_vol_trd_no);
        this.getStoreDetail(goods_no);
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
        });
    }

    getAucList = (exchng_vol_trd_no) => {
        let params = {
            exchng_vol_trd_no: exchng_vol_trd_no,
            skip: 0,
            limit: 5,
        }
        this.props.getAucList(params).then((res) => {
            this.setState({
                auc_list: res.list,
            })
        }).catch((err) => {
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
            })
        }).catch((err) => {
            navigation.pop();
        });
    }

    handleAband = () => {
        const {navigation} = this.props;
        const {auc_trd_mine} = this.state;
        let params = {
            exchng_vol_auc_trd_no: auc_trd_mine.exchng_vol_auc_trd_no
        }
        console.log("params")
        console.log(params)
        this.props.abandAuc(params).then((res) => {
            this.setState({isShowAlertModal: false})
            navigation.pop(2);
        }).catch((err) => {
        });
    }

    renderBidInfoBox = (title, desc) => {
        return (
            <View style={styles.bidInfoBox}>
                <Text style={{fontFamily: Fonts.AppleR, color: "#595959"}}>{title}</Text>
                <Text style={{fontFamily: Fonts.AppleSB, color: "#191919",}}>{desc}</Text>
            </View>
        );
    };

    renderSubmitBtns = () => {
        const {navigation} = this.props;
        const {auc_trd_mine, bidType, desiredBid, exchng_vol_trd_typ_cd, exchng_vol_trd, auc_list, exchng_vol_trd_no} = this.state;

        let auc_top_prc = exchng_vol_trd?.low_bid_prc;
        if (auc_list.length > 0)
            auc_top_prc = auc_list[0].bid_prc;
        if (bidType === "bid") {
            return (
                <TouchableOpacity
                    style={styles.submitBox}
                    onPress={() => {
                        if(parseInt(desiredBid) >= parseInt(exchng_vol_trd?.low_bid_prc))
                            navigation.navigate("TicketPayment", {
                                exchng_vol_trd_no: exchng_vol_trd_no,
                                exchng_vol_trd_typ_cd: exchng_vol_trd_typ_cd,
                                desiredBid: desiredBid
                            })
                        else
                            notifyMessage(TicketText.auctionLimitMessage)
                    }}
                >
                    <Text style={styles.submit}>{TicketText.toBid}</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <View style={styles.reBidSubmitBox}>
                    <TouchableOpacity
                        style={styles.reBidSubmitBtn}
                        onPress={() => this.setState({isShowAlertModal: true})}
                    >
                        <Text style={styles.reBidSubmitTxt}>
                            {TicketText.waiverOfBid}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            height: 50,
                            width: "48%",
                            borderRadius: 5,
                            backgroundColor: desiredBid ? "#000000" : "#dddddd",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onPress={() => {
                            console.log("click~~~~~~~~~~~~~")
                            if(parseInt(desiredBid) > parseInt(auc_top_prc)) {
                                navigation.navigate("TicketPayment", {
                                    exchng_vol_trd_no: exchng_vol_trd_no,
                                    exchng_vol_trd_typ_cd: exchng_vol_trd_typ_cd,
                                    exchng_vol_auc_trd_no: auc_trd_mine.exchng_vol_auc_trd_no,
                                    desiredBid: desiredBid
                                })
                                // this.setState({isShowAuctionModal: true});
                            }
                            else
                                notifyMessage(TicketText.reAuctionLimitMessage)
                        }}
                    >
                        <Text style={[styles.reBidSubmitTxt, {color: "#f5f5f5"}]}>
                            {TicketText.reBid}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    render() {
        const {navigation} = this.props;
        const {
            isTicketLoading,
            bidType,
            desiredBid,
            isShowAlertModal,
            isShowAuctionModal,
            exchng_vol,
            reserv_purchase,
            exchng_vol_trd,
            auc_list,
            goods,
            auc_trd_mine
        } =
            this.state;

        const currentTime = dateUtil.format('x', new Date());
        const limitTime = moment(dateUtil.formatKCT("dash", exchng_vol.expir_dt)).hours('23').minutes('59') // 한국 시간 : 23시 59분으로 변경
        const day = 1000 * 60 * 60 * 24;
        const remindTime = limitTime - currentTime;

        const remainDays = Math.floor(remindTime / day) + 1;

        let auc_top_prc = exchng_vol_trd?.low_bid_prc;
        if (auc_list.length > 0)
            auc_top_prc = auc_list[0].bid_prc;

        if (isTicketLoading)
            return null;
        else
            return (
                <View style={styles.container}>
                    <TopHeader
                        title={TicketText.voucherBid}
                        navigation={navigation}
                        hasRightBtn={false}
                    />

                    <ScrollView showsVerticalScrollIndicator={false} style={{paddingHorizontal: 20}}>
                        <View style={styles.productInfoContainer}>
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
                            <View style={styles.voucherBidInfoBox}>
                                <Text style={styles.voucherBid}>교환권 입찰가</Text>
                                <Text style={[styles.voucherBid, {color: Colors.MAIN_COLOR}]}>
                                    최저 : {`${formattedNumber(exchng_vol_trd?.low_bid_prc)}${StoreText.won}`} / 최근
                                    : {`${formattedNumber(auc_top_prc)}${StoreText.won}`}
                                </Text>
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <TextInputStr
                                    boxStyle={styles.boxStyle}
                                    textForm={styles.textInput}
                                    placeholder={TicketText.enterDesiredBid}
                                    placeholderTextColor="#d5d5d5"
                                    value={desiredBid}
                                    keyboardType='numeric'
                                    setValue={(str) => this.setState({desiredBid: str})}
                                />
                                <View style={styles.wonBox}>
                                    <Text style={styles.won}>원</Text>
                                </View>
                            </View>
                        </View>

                        {bidType === "reBid" &&
                        this.renderBidInfoBox(TicketText.previousBidAmount, `${formattedNumber(auc_trd_mine.bid_prc)}${StoreText.won}`)}
                        {this.renderBidInfoBox(
                            bidType === "reBid" ? TicketText.reBidAmount : TicketText.bidPrice,
                            `${formattedNumber(desiredBid)}${StoreText.won}`
                        )}
                        {this.renderBidInfoBox(TicketText.bidDeadline, `${dateUtil.formatKCT("dash", exchng_vol_trd?.auc_end_dt)} 마감`)}
                        {this.renderBidInfoBox(TicketText.paymentBalance, `${formattedNumber(reserv_purchase.tot_purchase_amt)}${StoreText.won}`)}
                        {this.renderBidInfoBox(
                            TicketText.balancePaymentDate,
                            `${dateUtil.formatKCT("dash", goods.sale_end_dt)} 부터 3일 이내`
                        )}
                    </ScrollView>
                    {this.renderSubmitBtns()}
                    <AlertModal
                        isShowAlertModal={isShowAlertModal}
                        message={TicketText.bidAlertMessage}
                        leftText={TicketText.no}
                        rightText={TicketText.waiverConfirm}
                        setVisible={() => this.setState({isShowAlertModal: false})}
                        navigation={navigation}
                        leftOnPress={() => this.setState({isShowAlertModal: false})}
                        rightOnPress={() => this.handleAband()} // 입찰포기
                    />
                    <AuctionModal
                        isTicket={true}
                        isShowAuctionModal={isShowAuctionModal}
                        setVisible={() => this.setState({isShowAuctionModal: false})}
                        title={"NDFKW283FF"} // isTicket true, 교환권 번호 || isTicket false 상품 이름과 옵션
                    />
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
    getExchngDetail: (params) => dispatch(ActionExchng.getDetail(params)),
    getAucList: (params) => dispatch(ActionExchng.getAucList(params)),
    abandAuc: (params) => dispatch(ActionExchng.abandAuc(params)),
});
export default connect(mapStateToProps, mapDispatchToProps)(TicketAuction);
