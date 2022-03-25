// 스토어 홈 > 상품 > 경매거래
import React, {Component} from "react";
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    Share,
} from "react-native";
import Swiper from "react-native-swiper";
import {connect} from "react-redux";
import produce from "immer";
import Video from "react-native-video";

import {DEVICE_WIDTH} from "../../../model/lib/Utils/Constants";
import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";
import {
    appScheme,
    CodeText,
    Generic,
    MyPageText,
    StoreText,
    TicketText
} from "../../../model/lib/Utils/Strings";
import {compareDate, formattedNumber, maskingId} from "../../../model/lib/Utils";
import * as dateUtil from "../../../model/lib/Utils/Date";

import {TopHeader} from "../../../component/TopHeader";
import {ProductTimerItem} from "../../../component/store/ProductTimerItem";
import {ProductImageInfoItem} from "../../../component/store/ProductImageInfoItem";
import AlertModal from "../../../component/modal/AlertModal";
import MessageModal from "../../../component/modal/MessageModal";

import styles from "./styles";

import * as ActionGoods from "../../../model/action/eGOODS";
import * as ActionNtt from "../../../model/action/eNTT";
import * as ActionInqry from "../../../model/action/eGOODS_INQRY";

class StoreAuction extends Component {
    constructor(props) {
        super(props);
        this.player;
        this.state = {
            isLoading: true,
            activeSlide: 0,
            currentMoreOptionIdx: 0,
            isShowMessageModal: false,
            isShowAlertModal: false,
            isShowDepositDescBox: false,
            isOpenReturns: false,
            isOpenDisclosure: false,
            // isShowOptionModal: false,
            isSale: true,

            goods: {},
            refund: {},
            info: {},
            goods_add_info: {},
            img_list: [],
            cntnts_list: [],
            auc_trd_list: [], // 경매참여자 리스트 (최근 5개)
            auc_trd_recent_bid_prc: 0, // 최근 입찰액
            auc_trd_recent_bid_prc_increasement: 0, // 이전 입찰가 대비 최근 입찰액의 상승률
            auc_trd_mine: {}, // 내가 이미 경매를 참여했는지 여부
            auc_trd_amt: 0,
            // pay_remain_auc_trd: {}, // 잔금결제 정보
            // goods_optn: [],
            // optn_count: 0,
            // add_optn: [],
            // add_optn_count: 0,
            ntt_list: [],

            inqryOffset: 0,
            inqry_list: [],
            inqry_count: 0,
            inqry_page: 0,
        };
    }

    componentDidMount() {
        const {navigation} = this.props;
        const {goods_no} = navigation.state.params;
        const {inqryOffset} = this.state;
        this.getStoreDetail(goods_no);
        this.getList(goods_no);
        this.getInqryList(inqryOffset);
    }

    getStoreDetail = (goods_no) => {
        const {navigation} = this.props;
        let params = {
            goods_no: goods_no
        }
        this.props.getStoreDetail(params).then((res) => {
            console.log("params")
            console.log(params)
            const goods = res.goods;
            this.setState({
                isLoading: false,
                isSale: goods.sale === StoreText.sale,
                goods: res.goods,
                refund: res.refund,
                info: res.info,
                img_list: res.img_list,
                cntnts_list: res.cntnts_list,
                // goods_optn: res.goods_optn2,
                // optn_count: parseInt(res.optn_count),
                // add_optn: res.add_optn,
                // add_optn_count: parseInt(res.add_optn_count),
                auc_trd_list: res.auc_trd_list || [],
                auc_trd_amt: parseInt(res.auc_trd_amt || 0),
                auc_trd_mine: res.auc_trd_mine || {},
                auc_trd_recent_bid_prc: parseInt(res.auc_trd_recent_bid_prc || 0),
                auc_trd_recent_bid_prc_increasement: parseInt(res.auc_trd_recent_bid_prc_increasement || 0),
                // pay_remain_auc_trd: res.detail.pay_remain_auc_trd,
            })
        }).catch((err) => {
            navigation.pop();
        });
    }

    getList = (goods_no) => {
        let params = {
            skip: 0,
            limit: 8,
            goods_no: goods_no
        }

        this.props.getList(params).then((res) => {
            this.setState({ntt_list: res.list})
        }).catch((err) => {
        });

    }

    getInqryList = (inqryOffset) => {
        const {navigation} = this.props;
        const {goods_no} = navigation.state.params;
        let params = {
            skip: 6 * (inqryOffset || 0),
            limit: 6,
            goods_no: goods_no
        }

        this.props.getInqryList(params).then((res) => {
            let newList = res.list.map((item, index) => {
                return {...item, isOpened: false}
            })
            this.setState({inqry_list: newList, inqry_count: parseInt(res.count)})
        }).catch((err) => {
        });
    }

    getInqryDetail = (goods_inqry_no, index) => {
        const {inqry_list} = this.state;
        let params = {
            goods_inqry_no: goods_inqry_no,
        }

        this.props.getInqryDetail(params).then((res) => {
            let updatedQnas = produce(inqry_list, (draft) => {
                draft[index].detail = res.detail;
            });
            this.setState({inqry_list: updatedQnas})
        }).catch((err) => {
        });
    }

    onShare = async () => {
        const {goods} = this.state;
        const link = `${appScheme.app_scheme}/STORE/goods_no=${goods.goods_no}&sale_mth_cd=${CodeText.sale_mth_cd_a}`
        try {
            const result = await Share.share({message: link});
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('activityType!');
                } else {
                    console.log('Share!');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('dismissed');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    renderProductCarousel = () => {
        const {eCOMM_CD} = this.props;
        const {img_list, activeSlide, goods, isSale} = this.state;
        // const isSale = goods.sale === StoreText.sale

        const sale_type = eCOMM_CD[`${goods.sale_mth_cd}`]?.cd_nm
        const goods_type = eCOMM_CD[`${goods.goods_se_cd}`]?.cd_nm.replace("중고상품", "중고")
        return (
            <View style={{alignItems: "center"}}>
                {img_list.length > 0 && (
                    <View style={styles.paginationBox}>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.activeSlide,
                                    {width: (200 / img_list.length) * (activeSlide + 1)},
                                ]}
                            />
                        </View>
                        <Text style={styles.page}>
                            <Text style={{ color: "#191919" }}>{activeSlide + 1}</Text>/
                            {img_list.length}
                        </Text>
                    </View>
                )}


                <View style={styles.eventBtnBox}>
                    <View style={[styles.eventBtn, {backgroundColor: Colors.MAIN_COLOR}]}>
                        <Text style={styles.eventBtnText}>{goods_type}</Text>
                    </View>
                    <View
                        style={[styles.eventBtn, !isSale ? {backgroundColor: "#c1c1c1"} : {backgroundColor: Colors.BLACK}]}>
                        <Text style={styles.eventBtnText}>{goods.sale}</Text>
                    </View>
                </View>

                <Swiper
                    style={{height: DEVICE_WIDTH}}
                    showsPagination={false}
                    loop={false}
                    key={img_list.length}
                    onIndexChanged={(index) => {
                        this.setState({activeSlide: index});
                    }}
                >
                    {img_list.map((item, index) => {
                        return (
                            <View style={{width: DEVICE_WIDTH, height: DEVICE_WIDTH, padding: 40, paddingTop: 0}}>
                                <Image
                                    key={`cntnts_url_addr_${index}`}
                                    source={{uri: item.cntnts_url_addr}}
                                    style={{width: DEVICE_WIDTH - 80, height: DEVICE_WIDTH - 40, resizeMode: "contain"}}
                                />
                            </View>
                        );
                    })}
                </Swiper>
            </View>
        );
    };

    renderProduct = () => {
        const {
            isShowDepositDescBox,
            currentMoreOptionIdx,
            goods,
            auc_trd_recent_bid_prc_increasement,
            auc_trd_recent_bid_prc
        } = this.state;
        return (
            <View style={{marginHorizontal: 20}}>
                <Text style={styles.productTitle}>{goods.goods_nm}</Text>
                <View style={styles.latestBidBox}>
                    <Text style={styles.productInfoTitle}>{StoreText.latestBid}</Text>
                    <View style={styles.rowCenter}>
                        <Image
                            source={require("../../../assets/image/store/up_graphic_icon_2.png")}
                            style={styles.upArrow}
                        />
                        <Text
                            style={styles.changedPrice}>{formattedNumber(auc_trd_recent_bid_prc_increasement || 0)}</Text>
                        <Text style={styles.currentPrice}>{formattedNumber(auc_trd_recent_bid_prc || 0)}</Text>
                    </View>
                </View>
                <View style={styles.latestBidBox}>
                    <View style={styles.rowCenter}>
                        <Text style={styles.productInfoTitle}>
                            {StoreText.auctionStartPrice}
                        </Text>
                    </View>
                    <Text style={styles.residualPayment}>{formattedNumber(goods.low_bid_prc || 0)}</Text>
                </View>
                <View style={[styles.latestBidBox, styles.latestBidBoxBorder]}>
                    <View style={styles.rowCenter}>
                        <Text style={styles.productInfoTitle}>
                            {StoreText.deposit}
                        </Text>
                        <TouchableOpacity
                            style={{marginLeft: 4}}
                            onPress={() => this.setState({isShowDepositDescBox: !isShowDepositDescBox})}>
                            <Image
                                source={require("../../../assets/image/store/information_graphic_icon.png")}
                                style={{width: 16, height: 16}}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.residualPayment}>{formattedNumber(goods.dpst_amt_prc || 0)}</Text>
                </View>
                {isShowDepositDescBox && (
                    <View>
                        <View style={styles.grayTriangle}/>
                        <View style={styles.depositDescBox}>
                            <Text
                                style={{
                                    fontFamily: Fonts.AppleR,
                                    fontSize: 13,
                                    color: "#e1e1e1",
                                }}
                            >
                                {StoreText.depositAucDesc}
                            </Text>
                        </View>
                    </View>
                )}
                <View style={styles.pointBox}>
                    <Text style={styles.productInfoTitle}>
                        {StoreText.pointsEarnedOnPurchases}{/* goods.purchase_dcsn_accml_yn === "Y"*/}
                    </Text>
                    <Text
                        style={styles.point}>{`${(parseInt(goods.purchase_dcsn_accml_yn_pnt_rate || 0) * parseInt(goods.sale_prc || 0) * 0.01)}P`}</Text>
                </View>
                {/*<View style={styles.priceBox}>*/}
                {/*    <View style={{alignItems: "center"}}>*/}
                {/*        <Text style={styles.priceTitle}>*/}
                {/*            {StoreText.immediatePurchasePrice}*/}
                {/*        </Text>*/}
                {/*        <Text style={styles.priceDesc}>*/}
                {/*            {goods.immedi_purchase_posbl_yn === "Y" ? formattedNumber(goods.sale_prc) : StoreText.availableImmediatePurchase}</Text>*/}
                {/*    </View>*/}
                {/*    <View style={{alignItems: "center"}}>*/}
                {/*        <Text style={styles.priceTitle}>{StoreText.auctionStartPrice}</Text>*/}
                {/*        <Text style={styles.priceDesc}>{formattedNumber(goods.low_or_dpst_price)}</Text>*/}
                {/*    </View>*/}
                {/*</View>*/}
                {this.renderAuctionStatus()}
                {this.renderBiddingStatus()}
                {this.renderProductInfo()}
                {this.renderMoreProductInfoTabs()}
                {currentMoreOptionIdx === 0
                    ? this.renderMoreInfomation()
                    : currentMoreOptionIdx === 1
                        ? this.renderQna()
                        : this.renderRelatedFeeds()}
                {this.renderReturnsAndRefunds()}
                {this.renderDisclosure()}
                <View style={{height: 50}}/>
            </View>
        );
    };

    renderAuctionStatus = () => {
        const {goods, isSale, auc_trd_amt} = this.state;

        const isProceeding = compareDate(goods.sale_end_dt) // 판매 종료일 체크 === 경매종료일

        return (
            <View style={styles.auctionStatusBox}>
                <Text style={styles.auctionStatus}>{StoreText.auctionStatus}</Text>
                <View style={{flexDirection: "row"}}>
                    <View
                        style={[
                            styles.pinkRound,
                            {backgroundColor: isSale ? isProceeding ? Colors.MAIN_COLOR : "#333333" : "#333333"},
                        ]}/>
                    <Text style={styles.proceeding}>
                        {isSale ? isProceeding ? StoreText.proceeding : StoreText.finishAuction : goods.sale}
                    </Text>
                </View>

                <View style={{marginTop: 23, width: "100%"}}>
                    <Text style={styles.salesQuantity}>
                        {StoreText.salesQuantity} {formattedNumber(parseInt(goods.sale_cnt || 0))}개
                    </Text>
                    <View style={styles.auctionProgressBar}>
                        <View
                            style={[
                                styles.auctionActiveProgressBar,
                                {width: `${parseInt(goods.sale_cnt_auc) === 0 ? 0 : 100}%`},
                            ]}
                        />
                    </View>
                    {parseInt(auc_trd_amt) !== 0 ? (
                        <View style={{marginTop: 2}}>
                            <View
                                style={[
                                    styles.triangle,
                                    {
                                        marginLeft: DEVICE_WIDTH - 48,
                                        transform: [{rotate: "180deg"}],
                                    },
                                ]}
                            />
                            <View style={[styles.remainingNumberBox, {marginLeft: DEVICE_WIDTH - 87 - 40}]}>
                                <Text style={styles.remainingNumber}>
                                    {`${auc_trd_amt}명 ${StoreText.joining}`}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View style={{marginLeft: `0%`, marginTop: 2}}>
                            <View style={[styles.triangle, {transform: [{rotate: "270deg"}]}]}/>
                            <View style={styles.remainingNumberBox}>
                                <Text style={styles.remainingNumber}>
                                    {`${auc_trd_amt}명 ${StoreText.joining}`}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 20,
                        width: "100%",
                    }}
                >
                    <View>
                        <Text style={styles.regularTitle}>{StoreText.auctionDeadline}</Text>
                        <Text style={styles.auctionDeadline}>
                            {`${dateUtil.formatKCT("koreanTime", goods.sale_end_dt)}`}
                        </Text>
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        {compareDate(goods.sale_end_dt) && (
                            <Image
                                source={require("../../../assets/image/store/time_graphic_icon.png")}
                                style={{width: 16, height: 16, marginRight: 8}}
                            />
                        )}
                        <View>
                            {goods.sale_end_dt ? <ProductTimerItem item={goods}/> : null}
                            {/*<Text style={styles.auctionReminingTime}>*/}
                            {/*    13일 06시간 52분남음*/}
                            {/*</Text>*/}
                            <View style={styles.textUnderline}/>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    renderBiddingStatus = () => {
        const {auc_trd_list} = this.state;

        return (
            <View style={styles.biddingStatusContainer}>
                <Text style={styles.auctionStatus}>{StoreText.biddingStatus}</Text>
                <View style={{marginTop: 13.5}}>
                    <View style={styles.biddingStatusBox}>
                        <View style={[styles.biddingDateBox, {width: "63%"}]}>
                            <Text style={styles.biddingTitle}>{StoreText.biddingDate}</Text>
                        </View>
                        <View style={[styles.biddingPriceBox, {width: "37%"}]}>
                            <Text style={styles.biddingTitle}>
                                {StoreText.desiredBidPrice}
                            </Text>
                        </View>
                    </View>
                    {auc_trd_list.map((auc) => {
                        return (
                            <View style={{flexDirection: "row", height: 35,}}>
                                <View style={[styles.biddingDateBox, {width: "63%"}]}>
                                    <Text
                                        style={styles.biddingTitle}>{dateUtil.formatKCT("dashTime", auc.bid_prog_dt)}</Text>
                                </View>
                                <View style={[styles.biddingPriceBox, {width: "37%"}]}>
                                    <Text style={styles.biddingTitle}>{formattedNumber(auc.bid_prc)}</Text>
                                </View>
                            </View>
                        );
                    })}
                    {/*<Text style={styles.biddingDesc}>{StoreText.biddingDesc}</Text>*/}
                </View>
            </View>
        );
    };

    renderProductInfo = () => {
        const {info, cntnts_list, goods} = this.state;
        let videoList = cntnts_list.filter((item) => item.goods_cntnts_typ_cd === CodeText.goods_cntnts_cd_v)
        let isVideo = videoList.length > 0
        //goods_cntnts_cd_v: "GCTC0001", // 상품 > 동영상
        return (
            <View style={{paddingTop: 25, paddingBottom: 50}}>
                <View style={{flexDirection: "row"}}>
                    <View style={{width: "27%"}}>
                        <Text style={styles.productInfo}>{StoreText.manufacturer}</Text>
                        <Text style={styles.productInfo}>{StoreText.modelNumber}</Text>
                        <Text style={styles.productInfo}>{StoreText.releaseDate}</Text>
                        <Text style={styles.productInfo}>{StoreText.releasePrice}</Text>
                        <Text style={styles.productInfo}>
                            {StoreText.shippingInformation}
                        </Text>
                    </View>
                    <View style={{width: "73%"}}>
                        <Text style={styles.productInfo}>{info.makr_nm}</Text>
                        <Text style={styles.productInfo}>{info.model_no}</Text>
                        <Text style={styles.productInfo}>{dateUtil.formatKCT("slash", info.cmt_de)}</Text>
                        <Text style={styles.productInfo}>{`${formattedNumber(info.sellng_prc)} 원`}</Text>
                        <Text style={styles.productInfo}>
                            {info.dlvy_cost_free_yn === "Y" ? `배송비 무료` : `배송비 ${formattedNumber(parseInt(goods.dlvy_cost_prc || 0))}원`}
                            {"\n\n"}{info.dlvy_policy}
                            {"\n\n"}{info.dlvy_period}
                        </Text>
                    </View>
                </View>
                <View>
                    {isVideo && (
                        <View style={styles.thumbnail}>
                            <Video
                                source={{uri: videoList[0].cntnts_url_addr}}   // Can be a URL or a local file.
                                ref={ref => (this.player = ref)}
                                resizeMode='cover'
                                repeat={false}
                                // controls
                                playWhenInactive={false} // this.player.presentFullscreenPlayer();
                                style={{position: "absolute", width: "100%", height: "100%"}}
                            />
                        </View>
                    )}
                </View>
            </View>
        );
    };

    renderMoreProductInfoTabs = () => {
        const {currentMoreOptionIdx} = this.state;
        return (
            <View style={styles.moreProductInfoTabs}>
                <TouchableOpacity
                    style={[
                        styles.moreProductInfoTab,
                        {
                            borderRightWidth: currentMoreOptionIdx === 0 ? 0.3 : 0,
                            borderBottomWidth: currentMoreOptionIdx === 0 ? 0 : 0.3,
                        },
                    ]}
                    onPress={() => this.setState({currentMoreOptionIdx: 0})}
                >
                    <Text
                        style={{
                            fontFamily:
                                currentMoreOptionIdx === 0 ? Fonts.AppleSB : Fonts.AppleR,
                            fontSize: 13,
                            color: "#191919",
                        }}
                    >
                        {StoreText.productInfo}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.moreProductInfoTab,
                        {
                            borderLeftWidth: currentMoreOptionIdx === 1 ? 0.3 : 0,
                            borderRightWidth: currentMoreOptionIdx === 1 ? 0.3 : 0,
                            borderBottomWidth: currentMoreOptionIdx === 1 ? 0 : 0.3,
                        },
                    ]}
                    onPress={() => this.setState({currentMoreOptionIdx: 1})}
                >
                    <Text
                        style={{
                            fontFamily:
                                currentMoreOptionIdx === 1 ? Fonts.AppleSB : Fonts.AppleR,
                            fontSize: 13,
                            color: "#191919",
                        }}
                    >
                        {StoreText.contactUs}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.moreProductInfoTab,
                        {
                            borderLeftWidth: currentMoreOptionIdx === 2 ? 0.3 : 0,
                            borderBottomWidth: currentMoreOptionIdx === 2 ? 0 : 0.3,
                        },
                    ]}
                    onPress={() => this.setState({currentMoreOptionIdx: 2})}
                >
                    <Text
                        style={{
                            fontFamily:
                                currentMoreOptionIdx === 2 ? Fonts.AppleSB : Fonts.AppleR,
                            fontSize: 13,
                            color: "#191919",
                        }}
                    >
                        {StoreText.relatedFeeds}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    renderMoreInfomation = () => {
        const {goods, cntnts_list} = this.state;
        return (
            <View style={{marginTop: 15, marginBottom: 30}}>
                {cntnts_list.filter((item) => item.goods_cntnts_typ_cd === CodeText.goods_cntnts_cd_c).map((item, index) => {
                    return (
                        <ProductImageInfoItem key={`cntnts_list_${index}`} item={item}/>
                    )
                })}
                <Text>{goods.goods_dtl_info}</Text>
            </View>
        );
    };

    renderQna = () => {
        const {eSESSION, navigation} = this.props;
        const {goods_no} = navigation.state.params;
        const {inqry_list, inqry_count, inqry_page} = this.state;

        const total_p = inqry_count / 6 > 1 ? inqry_count / 6 : 1;
        let pagination = new Array(Math.ceil(total_p));
        for (let i = 0; i < pagination.length; ++i) {
            pagination[i] = i;
        }
        const isLeft = inqry_page !== 0;
        const isRight = inqry_page !== (Math.ceil(total_p) -1);

        return (
            <View style={{paddingTop: 20}}>
                <View style={styles.contactUsBox}>
                    <Text style={styles.qnaCount}>{`총 ${inqry_count}개`}</Text>
                    <TouchableOpacity
                        style={styles.alignCenter}
                        onPress={() => {
                            if (eSESSION.mber_no !== undefined)
                                navigation.push("ProductInquiry", {goods_no: goods_no, getInqryList: this.getInqryList})
                            else this.setState({isShowAlertModal: true})
                        }}>
                        <Text style={styles.contactUs}>{StoreText.contactUs}</Text>
                    </TouchableOpacity>
                </View>
                {inqry_list.map((qna, index) => {
                    return (
                      <View
                        style={[
                          styles.qnaBox,
                          {
                            borderBottomWidth:
                              inqry_list.length - 1 === index ? 0 : 1,
                          },
                        ]}
                        key={`inqry_list_${index}`}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.secretQna}>
                            {eSESSION.mber_no !== qna.mber_no
                              ? "비밀글입니다."
                              : qna.inqry_cont}
                          </Text>
                          {eSESSION.mber_no !== qna.mber_no && (
                            <Image
                              style={styles.lockIcon}
                              source={require("../../../assets/image/store/lock_graphic_icon.png")}
                            />
                          )}
                        </View>
                        <View style={styles.qnaStatus}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: Fonts.AppleB,
                                fontSize: 11,
                                color:
                                  qna.answer_yn === "Y"
                                    ? Colors.MAIN_COLOR
                                    : "#999999",
                              }}
                            >
                              {qna.answer_yn === "Y"
                                ? StoreText.answerComplete
                                : StoreText.unanswered}
                            </Text>
                            <View style={styles.divider} />
                            <Text style={styles.qnaText}>
                              {maskingId(qna.mber_nm || "")}
                            </Text>
                            <View style={styles.divider} />
                            <Text style={styles.qnaText}>
                              {dateUtil.formatKCT("point", qna.inqry_dt)}
                            </Text>
                          </View>
                          {!eSESSION.mber_no !== qna.mber_no &&
                            qna.answer_yn === "Y" && (
                              <TouchableOpacity
                                onPress={() => {
                                  let updatedInquiries = produce(
                                    inqry_list,
                                    (draft) => {
                                      draft[index].isOpened =
                                        !draft[index].isOpened;
                                    }
                                  );
                                  this.setState(
                                    {
                                      inqry_list: updatedInquiries,
                                    },
                                    () =>
                                      this.getInqryDetail(
                                        qna.goods_inqry_no,
                                        index
                                      )
                                  );
                                }}
                              >
                                <Image
                                  source={require("../../../assets/image/store/dropdown_btn_regular.png")}
                                  style={styles.downArrow}
                                />
                              </TouchableOpacity>
                            )}
                        </View>
                        {qna.isOpened && qna.detail && (
                          <View style={styles.answerBox}>
                            <View style={styles.rowCenter}>
                              <View style={styles.answerLabelBox}>
                                <Text style={styles.answerLabel}>
                                  {StoreText.answer}
                                </Text>
                              </View>
                              <Text style={styles.answerDate}>
                                {qna.detail.date}
                              </Text>
                            </View>
                            <Text style={styles.answerContent}>
                              {qna.detail.content}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                })}
                <View style={styles.qnaPageContainer}>
                    <TouchableOpacity
                        style={styles.qnaPageBox}
                        onPress={() => {
                            const {inqry_page} = this.state;
                            if(isLeft) {
                                this.setState({inqry_page: inqry_page -1})
                                this.getInqryList(inqry_page -1)
                            }
                        }}
                    >
                        <Image
                            style={[styles.qnaArrow, isLeft ? {tintColor: '#333333'} : {tintColor: '#c1c1c1'}]}
                            source={require("../../../assets/image/store/chevron_btn_disable.png")}
                        />
                    </TouchableOpacity>
                    {pagination.map((item) => {
                        return (
                            <TouchableOpacity
                                style={styles.qnaPageBox}
                                onPress={() => {
                                    this.setState({inqry_page: item})
                                    this.getInqryList(item)
                                }}
                            >
                                <Text style={[styles.qnaPage, item === inqry_page ? {color: "#191919"} : {color: "#aaaaaa"}]}>{item + 1}</Text>
                            </TouchableOpacity>
                        )
                    })}
                    <TouchableOpacity
                        style={styles.qnaPageBox}
                        onPress={() => {
                            const {inqry_page} = this.state;
                            if(isRight) {
                                this.setState({inqry_page: inqry_page + 1})
                                this.getInqryList(inqry_page + 1)
                            }
                        }}>
                        <Image
                            style={[styles.qnaArrow, isRight ? {tintColor: '#333333'} : {tintColor: '#c1c1c1'}]}
                            source={require("../../../assets/image/store/chevron_btn.png")}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    renderRelatedFeeds = () => {
        const {navigation} = this.props;
        const {goods_no} = navigation.state.params;
        const {ntt_list} = this.state;
        return (
            <View style={{marginTop: 15}}>
                <View style={styles.feedBox}>
                    {ntt_list[0] && (
                        <TouchableOpacity
                            onPress={() => navigation.push("FeedDetail", {ntt_no: ntt_list[0].ntt_no})}>
                            <Image style={styles.largeFeedImg} source={{uri: ntt_list[0].img_url_addr}}/>
                        </TouchableOpacity>
                    )}
                    {ntt_list[1] && (
                        <TouchableOpacity
                            onPress={() => navigation.push("FeedDetail", {ntt_no: ntt_list[1].ntt_no})}>
                            <Image style={styles.largeFeedImg} source={{uri: ntt_list[1].img_url_addr}}/>
                        </TouchableOpacity>
                    )}
                </View>
                {ntt_list[2] && (
                    <View style={styles.feedBox}>
                        <TouchableOpacity
                            onPress={() => navigation.push("FeedDetail", {ntt_no: ntt_list[2].ntt_no})}>
                            <Image style={styles.smallFeedImg} source={{uri: ntt_list[2].img_url_addr}}/>
                        </TouchableOpacity>
                        {ntt_list[3] && (
                            <TouchableOpacity
                                onPress={() => navigation.push("FeedDetail", {ntt_no: ntt_list[3].ntt_no})}>
                                <Image style={styles.smallFeedImg} source={{uri: ntt_list[3].img_url_addr}}/>
                            </TouchableOpacity>
                        )}
                        {ntt_list[4] && (
                            <TouchableOpacity
                                onPress={() => navigation.push("FeedDetail", {ntt_no: ntt_list[4].ntt_no})}>
                                <Image style={styles.smallFeedImg} source={{uri: ntt_list[4].img_url_addr}}/>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {ntt_list[5] && (
                    <View style={styles.feedBox}>
                        <TouchableOpacity
                            onPress={() => navigation.push("FeedDetail", {ntt_no: ntt_list[5].ntt_no})}>
                            <Image style={styles.smallFeedImg} source={{uri: ntt_list[5].img_url_addr}}/>
                        </TouchableOpacity>
                        {ntt_list[6] && (
                            <TouchableOpacity
                                onPress={() => navigation.push("FeedDetail", {ntt_no: ntt_list[6].ntt_no})}>
                                <Image style={styles.smallFeedImg} source={{uri: ntt_list[6].img_url_addr}}/>
                            </TouchableOpacity>
                        )}
                        {ntt_list[7] && (
                            <TouchableOpacity
                                onPress={() => navigation.push("FeedDetail", {ntt_no: ntt_list[7].ntt_no})}>
                                <Image style={styles.smallFeedImg} source={{uri: ntt_list[7].img_url_addr}}/>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                {ntt_list.length === 8 && (
                    <TouchableOpacity
                        style={styles.seeMoreBtn}
                        onPress={() => navigation.push("FeedProduct", {goods_no: goods_no})}
                    >
                        <Text style={styles.seeMore}>{StoreText.seeMore}</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    renderReturnsAndRefunds = () => {
        const {isOpenReturns, refund} = this.state;
        return (
            <>
                <TouchableOpacity
                    style={[styles.otherInfomationBox, isOpenReturns ? {borderBottomWidth: 0} : null]}
                    onPress={() => this.setState({isOpenReturns: !isOpenReturns})}
                >
                    <Text style={styles.otherInfomation}>
                        {StoreText.returnsAndRefunds}
                    </Text>
                    <Image
                        source={require("../../../assets/image/store/dropdown_btn_l.png")}
                        style={styles.downArrow}
                    />
                </TouchableOpacity>
                {isOpenReturns ?
                    <View
                        style={{
                            paddingTop: 12,
                            paddingBottom: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: '#e1e1e1'
                        }}
                    >
                        <Text style={styles.otherInfomation}>
                            {refund.rtngud_exchng_guide || ""}
                        </Text>
                    </View>
                    : null}
            </>

        );
    };

    renderDisclosure = () => {
        const {isOpenDisclosure, info, goods_add_info} = this.state;
        return (
            <>
                <TouchableOpacity
                    style={[styles.otherInfomationBox, {borderTopWidth: 0}, isOpenDisclosure ? {borderBottomWidth: 0} : null]}
                    onPress={() => this.setState({isOpenDisclosure: !isOpenDisclosure})}
                >
                    <Text style={styles.otherInfomation}>{StoreText.disclosure}</Text>
                    <Image
                        source={require("../../../assets/image/store/dropdown_btn_l.png")}
                        style={styles.downArrow}
                    />
                </TouchableOpacity>
                {isOpenDisclosure ?
                    <View style={styles.otherInfomationOpen}>
                        <Text style={styles.otherInfomation}>
                            {`${StoreText.manufacturer}: ${info.makr_nm || ""}\n`}
                            {`${StoreText.manufactureNation}: ${info.manufac_nation_nm || ""}\n`}
                            {`${StoreText.manufactureManager}: ${info.as_rspnber || ""}\n`}
                            {`${StoreText.manufactureQuality}: ${info.qlity_assrnc_skill || ""}\n`}
                            {goods_add_info.length > 0 && goods_add_info.map((item) => {
                                return (`${item.add_info_nm}: ${item.add_info_cont || ""}\n`)
                            })}
                        </Text>
                    </View>
                    : null}
            </>
        );
    };

    renderSubmitBtns = () => {
        const {eSESSION} = this.props;
        const {goods, auc_trd_mine, isSale} = this.state;
        const isPrev = goods.sale === StoreText.toBeSold;

        const auctionType = !auc_trd_mine?.auc_trd_no;
        let isRemain = !auctionType && (auc_trd_mine?.auc_trd_sts_cd === CodeText.auc_trd_sts_cd_s || auc_trd_mine?.auc_trd_sts_cd === CodeText.auc_trd_sts_cd_r)
        return (
            <View style={styles.submitBtnBox}>
                {isSale || (isRemain && auc_trd_mine.remain_amt_pay_yn === "N") ? (
                    <>
                        <TouchableOpacity
                            style={[
                                styles.submitBox,
                                {width: "100%"},
                                {backgroundColor: isRemain && auc_trd_mine.remain_amt_pay_yn === "Y" ? "#595959" : Colors.MAIN_COLOR},
                            ]}
                            onPress={() => {
                                const {navigation} = this.props;
                                if (eSESSION.mber_no) {
                                    if (eSESSION.mber_se_cd === CodeText.mber_se_cd_c && goods.entpr_mall_prvuse_yn !== "Y")
                                        this.setState({isShowMessageModal: true})
                                    else {
                                        if (isRemain && auc_trd_mine.remain_amt_pay_yn === "N")
                                            navigation.navigate("Payment", {
                                                purchaseType: "remain",
                                                goods_no: goods.goods_no,
                                            })
                                        else if (isRemain && auc_trd_mine.remain_amt_pay_yn === "Y")
                                            console.log("finish")
                                        else
                                            navigation.navigate("StorePayment", {
                                                pageType: auctionType ? "bid" : "reBid",
                                                goods_no: goods.goods_no,
                                            })
                                    }

                                } else this.setState({isShowAlertModal: true})
                            }}
                        >
                            <Text style={styles.submit}>
                                {auctionType ? StoreText.toBid
                                    : isRemain && auc_trd_mine.remain_amt_pay_yn === "N" ? MyPageText.payTheBalance
                                        : isRemain && auc_trd_mine.remain_amt_pay_yn === "Y" ? MyPageText.payTheBalanceComplete : StoreText.reBid}
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={[styles.submitBox, {width: "100%", backgroundColor: "#c1c1c1"}]}>
                        <Text style={styles.submit}>{isPrev ? StoreText.toBeSold : StoreText.notPurchase}</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    render() {
        const {navigation} = this.props;
        const {isLoading, isShowMessageModal, isShowAlertModal} = this.state;
        if (isLoading)
            return null;
        else
            return (
                <View style={styles.container}>
                    <TopHeader
                        title={StoreText.productInfo}
                        navigation={navigation}
                        hasRightBtn={false}
                        rightBtnStyle={{width: 27.5, height: 27.5}}
                        rightBtnSource={require("../../../assets/image/store/share_product_store.png")}
                        onPress={() => this.onShare()}
                    />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {this.renderProductCarousel()}
                        {this.renderProduct()}
                    </ScrollView>
                    {this.renderSubmitBtns()}
                    {/*<OptionModal*/}
                    {/*  isShowOptionModal={isShowOptionModal}*/}
                    {/*  navigation={navigation}*/}
                    {/*  goods_optn={goods_optn}*/}
                    {/*  add_optn={add_optn}*/}
                    {/*  setVisible={() => this.setState({ isShowOptionModal: false })}*/}
                    {/*/>*/}
                    <MessageModal
                        title={StoreText.onlyGeneral}
                        subtitle={StoreText.onlyGeneralMessage}
                        isShowMessageModal={isShowMessageModal}
                        setVisible={() => {
                            this.setState({isShowMessageModal: false})
                        }}
                        hasBtn={false}
                    />
                    {isShowAlertModal && (
                        <AlertModal
                            isShowAlertModal={isShowAlertModal}
                            message={Generic.loginMessage}
                            leftText={TicketText.no}
                            rightText={Generic.goToLogin}
                            setVisible={() => this.setState({isShowAlertModal: false})}
                            navigation={navigation}
                            leftOnPress={() => this.setState({isShowAlertModal: false})}
                            rightOnPress={() => navigation.navigate("Login")}
                        />
                    )}
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
    getList: (params) => dispatch(ActionNtt.getList(params)),
    getInqryList: (params) => dispatch(ActionInqry.getInqryList(params)),
    getInqryDetail: (params) => dispatch(ActionInqry.getInqryDetail(params)),
});
export default connect(mapStateToProps, mapDispatchToProps)(StoreAuction);
