// 판매글 작성 화면
// 교환권 > 플로팅메뉴 선택 시 접근 화면
// 판매 교환권 선택 화면
// 교환권 결제 화면
import React, {Component} from "react";
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
import {CodeText, PaymentText, TicketText} from "../../../model/lib/Utils/Strings";
import {TimeList} from "../../../model/lib/Utils/Constants";
import {maskingAccount, maskingId, notifyMessage} from "../../../model/lib/Utils";
import * as dateUtil from "../../../model/lib/Utils/Date";
import {formatKCT} from "../../../model/lib/Utils/Date";

import TextInputStr from "../../../common/textinput/TextInput";
import {TopHeader} from "../../../component/TopHeader";
import TicketSaleMethodModal from "../../../component/modal/TicketSalesMethodModal";
import {TicketSaleOption} from "../../../component/ticket/TicketSaleOption";
import TimePickerModal from "../../../component/modal/TimePickerModal";
import DatePickerModal from "../../../component/modal/DatePickerModal";

import * as ActionExchng from "../../../model/action/eEXCHNG_VOL";
import * as ActionRefund from "../../../model/action/eREFUND_MN";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    productInfoBox: {
        flexDirection: "row",
        borderRadius: 5,
        backgroundColor: "#f5f5f5",
        paddingVertical: 10,
        paddingLeft: 15,
        marginTop: 10,
        marginBottom: 28.5,
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
    downArrow: {
        width: 16,
        height: 16,
    },
    optionBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 47,
        borderBottomColor: "#f3f3f3",
        borderBottomWidth: 1,
    },
    boxStyle: {
        height: 47,
        justifyContent: "center",
        borderBottomColor: "#f3f3f3",
        borderBottomWidth: 1,
        width: "80%",
    },
    textInput: {
        fontFamily: Fonts.AppleM,
        fontSize: 16,
        letterSpacing: -0.8,
        color: "#000000",
    },
    wonBox: {
        borderBottomColor: "#f3f3f3",
        borderBottomWidth: 1,
        width: "20%",
        alignItems: "flex-end",
        justifyContent: "center",
        height: 47,
        paddingRight: 10,
    },
    optionTitle: {
        fontFamily: Fonts.AppleL,
        fontSize: 15,
        letterSpacing: -0.75,
        color: "#999999",
    },
    won: {
        fontFamily: Fonts.AppleL,
        fontSize: 15,
        letterSpacing: -0.75,
        color: "#222222",
    },
    contentBox: {
        marginTop: 19.5,
        paddingBottom: 29.5,
        borderBottomColor: "#dddddd",
        borderBottomWidth: 1,
        height: 115,
    },
    content: {
        fontFamily: Fonts.AppleR,
        fontSize: 14,
        letterSpacing: -0.35,
        color: "#999999",
    },
    infoMessage: {
        fontFamily: Fonts.AppleR,
        fontSize: 11,
        letterSpacing: -0.28,
        color: "#999999",
        lineHeight: 18,
    },
    submitBox: {
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "#dddddd",
    },
    submit: {
        fontFamily: Fonts.AppleR,
        fontSize: 20,
        color: "#f5f5f5",
    },
    priceText: {
        fontFamily: Fonts.AppleL,
        fontSize: 15,
        letterSpacing: -0.75,
        color: "#000000",
    },
});

class TicketSaleBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUpdate: false,
            exchng_vol_trd: {},

            selectedTicket: {},
            isShowTicketSaleModal: true,
            price: "",
            content: "",
            isShowSaleMethodModal: false,
            selectedMethod: null,
            closingTime: "",
            isShowDatePickerModal: false,
            isShowTimePickerModal: false,
            salesClosingDate: "",
            return_detail: {}, // 정산계좌 정보
        };
    }

    componentDidMount() {
        const {navigation} = this.props;
        if(navigation.state.params.isUpdate) {
            const {isUpdate, exchng_vol_trd_no} = navigation.state.params
            this.setState({isUpdate, exchng_vol_trd_no});
            this.getExchngDetail(exchng_vol_trd_no);
        } else {
            const {selectedTicket} = navigation.state.params
            this.setState({isLoading: false, selectedTicket});
        }
        this.getRefundDetail();
    }

    getExchngDetail = (exchng_vol_trd_no) => {
        let params = {
            exchng_vol_trd_no: exchng_vol_trd_no
        }
        this.props.getExchngDetail(params).then((res) => {
            const exchng_vol_trd_typ_cd = res.exchng_vol_trd.exchng_vol_trd_typ_cd;
            let state = {
                isLoading: false,
                selectedTicket: res.exchng_vol_trd,
                exchng_vol_trd: res.exchng_vol_trd,
                selectedMethod: exchng_vol_trd_typ_cd,
                content: res.exchng_vol_trd.exchng_vol_trd_cont
            };
            console.log(res.exchng_vol_trd)
            if(exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_a) {
                Object.assign(state, {
                    salesClosingDate: res.exchng_vol_trd.auc_end_dt.substring(0, 8),
                    closingTime: `${res.exchng_vol_trd.auc_end_dt.substring(8, 10)}시`,
                    price: res.exchng_vol_trd.low_bid_prc
                })
            } else
                Object.assign(state, {
                    price: res.exchng_vol_trd.immedi_purchase_prc
                })
            this.setState(state);
        }).catch((err) => {
            this.setState({isLoading: false})
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

    handleCreate = () => {
        const {navigation} = this.props;
        const {isUpdate, selectedTicket, selectedMethod, salesClosingDate, closingTime, content, price, return_detail} = this.state;

        let params = {
            exchng_vol_trd_typ_cd: selectedMethod,
            exchng_vol_trd_cont: content,
            sale_mber_refund_mn_no: return_detail.refund_mn_no
        }

        if (selectedMethod === CodeText.exchng_vol_trd_typ_cd_i)
            Object.assign(params, {immedi_purchase_prc: price})
        if (selectedMethod === CodeText.exchng_vol_trd_typ_cd_a)
            Object.assign(params, {low_bid_prc: price, auc_end_dt: salesClosingDate + closingTime.substring(0, 2) + "0000"})

        if(isUpdate) {
            console.log("update called")
            Object.assign(params, {exchng_vol_trd_no: selectedTicket.exchng_vol_trd_no})
            console.log(params)
            this.props.update(params).then(async (res) => {
                navigation.pop(2);
                navigation.navigate("TicketDetail", {
                    goods_no: res.reserv_purchase.goods_no,
                    exchng_vol_trd_no: res.exchng_vol_trd.exchng_vol_trd_no
                })
            }).catch((err) => {
            });
        } else {
            console.log("create called")
            Object.assign(params, {exchng_vol_no: selectedTicket.exchng_vol[0].exchng_vol_no})
            console.log(params)
            this.props.create(params).then(async (res) => {
                navigation.pop(2);
                navigation.navigate("TicketDetail", {
                    goods_no: res.reserv_purchase.goods_no,
                    exchng_vol_trd_no: res.exchng_vol_trd.exchng_vol_trd_no
                })
            }).catch((err) => {
            });
        }
    }

    renderPriceBox = () => {
        const {price, selectedMethod} = this.state;
        return (
            <View style={{flexDirection: "row"}}>
                <View
                    style={{
                        borderBottomColor: "#f3f3f3",
                        borderBottomWidth: 1,
                        justifyContent: "center",
                        height: 47,
                    }}
                >
                    <Text style={{color: Colors.MAIN_COLOR}}>* </Text>
                </View>

                <TextInputStr
                    boxStyle={styles.boxStyle}
                    textForm={styles.priceText}
                    placeholder={selectedMethod ? selectedMethod === CodeText.exchng_vol_trd_typ_cd_i ? TicketText.price : TicketText.lowPrice : TicketText.price}
                    placeholderTextColor="#999999"
                    value={price}
                    keyboardType='numeric'
                    setValue={(str) => this.setState({price: str})}
                />
                <View style={styles.wonBox}>
                    <Text style={styles.won}>원</Text>
                </View>
            </View>
        );
    };

    renderContentBox = () => {
        const {content} = this.state;
        return (
            <TextInputStr
                boxStyle={styles.contentBox}
                textForm={styles.content}
                placeholder={TicketText.enterContent}
                placeholderTextColor="#999999"
                value={content}
                setValue={(str) => {
                    if (str.length > 500)
                        notifyMessage(TicketText.ticketBoardMessage)
                    else this.setState({content: str});
                }}
            />
        );
    };

    renderAccountBox = () => {
        const {eCOMM_CD, navigation} = this.props;
        const {return_detail} = this.state;
        return (
            <View style={{marginTop: 21.4, marginBottom: 50}}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Text
                            style={{
                                fontFamily: Fonts.AppleB,
                                fontSize: 16,
                                letterSpacing: -0.8,
                                color: "#000000",
                                marginRight: 7.5,
                            }}
                        >
                            {TicketText.settlementAccount}
                        </Text>
                        <Text style={{color: Colors.MAIN_COLOR}}>*</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.push("MySettingAccount", {getRefundDetail: this.getRefundDetail})}>
                        <Text
                            style={{
                                fontFamily: Fonts.AppleR,
                                letterSpacing: -0.35,
                                color: Colors.MAIN_COLOR,
                                textDecorationLine: "underline",
                            }}
                        >
                            {TicketText.editInfo}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text
                    style={{
                        marginTop: 10,
                        fontFamily: Fonts.AppleR,
                        letterSpacing: -0.35,
                        color: "#222222",
                    }}
                >
                    {return_detail?.refund_mn_no ?
                        `${eCOMM_CD[`${return_detail?.bank_cmpny_cd}`]?.cd_nm} ${maskingAccount(return_detail.bank_accnt_no)}, ${maskingId(return_detail.dpstr_nm || "")}`
                        : `${TicketText.refundInfoMessage}`}
                </Text>
                <View style={{marginTop: 20}}>
                    <Text style={styles.infoMessage}>
                        {TicketText.ticketBoardInfoMessage}
                    </Text>
                    <Text style={styles.infoMessage}>
                        {TicketText.ticketBoardInfoMessage_2}
                    </Text>
                    <Text style={styles.infoMessage}>
                        {TicketText.ticketBoardInfoMessage_3}
                    </Text>
                </View>
            </View>
        );
    };

    renderSubmitBtns = () => {
        const {return_detail} = this.state;
        const isEnabled = this.isEnabled();
        return (
            <TouchableOpacity
                style={[
                    styles.submitBox,
                    {backgroundColor: isEnabled ? "#000000" : "#dddddd"},
                ]}
                onPress={() => {
                    if(isEnabled) {
                        if (!return_detail?.bank_cmpny_cd)
                            notifyMessage("정산계좌 정보가 없습니다.")
                        else this.handleCreate();
                    }
                }}
            >
                <Text style={styles.submit}>
                    {TicketText.finishedAppointment}
                </Text>
            </TouchableOpacity>
        );
    };

    isEnabled = () => {
        const {price, selectedMethod, salesClosingDate, closingTime, return_detail} = this.state;
        if (!return_detail?.bank_cmpny_cd)
            return false;
        if(selectedMethod === CodeText.exchng_vol_trd_typ_cd_a) {
            return !!(price && selectedMethod && salesClosingDate && closingTime);
        } else if (price && selectedMethod) {
            return true;
        }
        return false;
    };

    render() {
        const {navigation} = this.props;
        const {
            isLoading,
            isUpdate, // update
            exchng_vol_trd, // update

            selectedTicket,
            isShowSaleMethodModal,
            selectedMethod,
            salesClosingDate,
            isShowDatePickerModal,
            isShowTimePickerModal,
            closingTime,
        } = this.state;
        const {reserv_purchase} = selectedTicket;
        const currentTime = dateUtil.format('x', new Date());
        const limitTime = moment(dateUtil.formatKCT("dash", selectedTicket?.expir_dt || selectedTicket?.exchng_vol?.expir_dt)).hours('23').minutes('59') // 한국 시간 : 23시 59분으로 변경
        const day = 1000 * 60 * 60 * 24;
        const remindTime = limitTime - currentTime;
        const sale_end_dt = moment(dateUtil.formatKCT("dash", selectedTicket?.expir_dt || selectedTicket?.exchng_vol?.expir_dt)).hours('23').minutes('59')

        const days = Math.floor(remindTime / day) + 1;

        if(isLoading)
            return null;
        else
        return (
            <View style={styles.container}>
                <TopHeader
                    title={TicketText.writeSalesArticle}
                    navigation={navigation}
                    hasRightBtn={true}
                    onPress={() => navigation.pop(2)}
                    isText={true}
                    rightBtnSource={"작성취소"}
                    rightBtnStyle={{
                        fontFamily: Fonts.AppleR,
                        fontSize: 16,
                        letterSpacing: -0.8,
                        color: Colors.MAIN_COLOR,
                    }}
                />
                <ScrollView showsVerticalScrollIndicator={false} style={{paddingHorizontal: 20}}>
                    <View style={styles.productInfoBox}>
                        <Image
                            style={styles.productImg}
                            source={{uri: reserv_purchase?.thumb_url}}
                        />
                        <View>
                            <Text style={styles.productTitle}>{reserv_purchase?.goods_nm}</Text>
                            <Text style={styles.productOption}>
                                {/*{TicketText.option}:{reserv_purchase?.goods_optn_nm}*/}
                                {`${reserv_purchase?.goods_optn_nm}`}
                                {` | ${PaymentText.quantity} : ${reserv_purchase.purchase_cnt}`}
                            </Text>
                            <Text style={styles.expDates}>
                                {TicketText.validity}:{`~${formatKCT("point", selectedTicket?.expir_dt || selectedTicket?.exchng_vol?.expir_dt)}(${days}일)`}
                            </Text>
                        </View>
                    </View>
                    <TicketSaleOption
                        title={
                            selectedMethod
                                ? selectedMethod === CodeText.exchng_vol_trd_typ_cd_i
                                    ? TicketText.buyNow
                                    : TicketText.auctionDeal
                                : TicketText.selectSalesMethod
                        }
                        onPress={() => this.setState({isShowSaleMethodModal: true})}
                        isActive={selectedMethod}
                    />
                    {selectedMethod !== CodeText.exchng_vol_trd_typ_cd_i && (
                        <TicketSaleOption
                            title={
                                salesClosingDate
                                    ? dateUtil.formatKCT("point", salesClosingDate)
                                    : TicketText.selectSalesDeadline
                            }
                            onPress={() =>
                                this.setState({
                                    isShowDatePickerModal: true,
                                })
                            }
                            isActive={salesClosingDate}
                        />
                    )}
                    {selectedMethod !== CodeText.exchng_vol_trd_typ_cd_i && salesClosingDate ? (
                        <TicketSaleOption
                            title={closingTime ? closingTime : TicketText.selectClosingTimeSale}
                            onPress={() =>
                                this.setState({
                                    isShowTimePickerModal: true,
                                })
                            }
                            isActive={closingTime}
                        />
                    ) : null}


                    {this.renderPriceBox()}
                    {this.renderContentBox()}
                    {this.renderAccountBox()}
                </ScrollView>
                <TicketSaleMethodModal
                    isShowSaleMethodModal={isShowSaleMethodModal}
                    setVisible={() => this.setState({isShowSaleMethodModal: false})}
                    setSaleMethod={(selectedMethod) =>
                        this.setState({selectedMethod: selectedMethod})
                    }
                />
                <TimePickerModal
                    isShowTimePickerModal={isShowTimePickerModal}
                    setVisible={() => this.setState({isShowTimePickerModal: false})}
                    title="판매 마감시간 선택"
                    timeList={TimeList}
                    onPressConfirm={(closingTime) =>
                        this.setState({
                            closingTime: closingTime,
                            isShowTimePickerModal: false,
                        })
                    }
                />
                <DatePickerModal
                    isShowDatePickerModal={isShowDatePickerModal}
                    isBirth={false}
                    sale_end_dt={sale_end_dt}
                    setVisible={() => this.setState({isShowDatePickerModal: false})}
                    title="판매 마감일 선택"
                    onPressConfirm={(salesClosingDate) => {
                        if(salesClosingDate > dateUtil.format("longNumber", sale_end_dt))
                            notifyMessage(TicketText.boardAucDateMessage)
                        else
                            this.setState({
                                salesClosingDate: salesClosingDate,
                                isShowDatePickerModal: false,
                            })
                    }}
                />
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
    getRefundDetail: (params) => dispatch(ActionRefund.getDetail(params)), // 정산계좌 정보
    /* EXCHNG 2차 개발 */
    create: (params) => dispatch(ActionExchng.create(params)),
    update: (params) => dispatch(ActionExchng.update(params)),
    getExchngDetail: (params) => dispatch(ActionExchng.getDetail(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TicketSaleBoard);
