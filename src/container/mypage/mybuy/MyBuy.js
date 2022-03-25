// 구매내역
import React, {Component} from "react";
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet, ActivityIndicator,
} from "react-native";
import {connect} from "react-redux";

import {CodeText, MyPageText, TOKEN} from "../../../model/lib/Utils/Strings";
import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";

import {TopHeader} from "../../../component/TopHeader";
import {MyBuyListItem} from "../../../component/mypage/mybuy/MyBuyListItem";
import { MyBuyTicketListItem } from "../../../component/mypage/mybuy/MyBuyTicketListItem";

import * as ActionOrder from "../../../model/action/eORDER"
import * as ActionExchng from "../../../model/action/eEXCHNG_VOL";
import {build_type} from "../../../model/api";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    tabBtn: {
        width: "50%",
        paddingVertical: 12,
        borderBottomWidth: 3,
        alignItems: "center",
        justifyContent: "center",
    },
    purchaseStatusBox: {
        width: "33%",
        alignItems: "center",
        paddingTop: 14.5
    },
    purchaseTitleText: {
        fontSize: 12,
        letterSpacing: -0.3,
    },
    purchaseCountText: {
        fontFamily: Fonts.AppleB,
        fontSize: 25,
        letterSpacing: -0.63,
        marginTop: 6.8,
    },
    purchaseStatusWrap: {
        flexDirection: "row",
        paddingHorizontal: 20,
        backgroundColor: "#f5f5f5",
        height: 80,
        marginBottom: 20
    },
});

class MyBuy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            currentPurchaseTabIdx: 0,
            purchaseStatusIdx: 0,
            count: {},
            offset: 0,
            limit: 100,
            order_list: [],
            loadMore: true,
            yOffset: 0,
        };
    }


    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            const {currentPurchaseTabIdx} = this.state;
            this.setState({offset: 0, order_list: [], loadMore: true, yOffset: 0}, () => {
                // this.setState({offset: 0, order_list: [], loadMore: true, yOffset: 0, currentPurchaseTabIdx: 0});
                if(currentPurchaseTabIdx === 0) {
                    this.getCount();
                    this.getList();
                } else {
                    this.getExchngCount();
                    this.getExchngList();
                }
            });
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    getList = () => {
        // state : 구매 상태값 || 주문상태 (0: 진행중, 1:완료, 2: 교환/반품/환불)
        const {purchaseStatusIdx, offset, limit, order_list, loadMore} = this.state;
        if (loadMore) {
            let params = {
                skip: offset,
                limit: limit,
                state: purchaseStatusIdx,
            }
            this.props.getList(params).then((res) => {
                if (parseInt(res.count) > (offset + limit))
                    this.setState({order_list: [...order_list, ...res.list], offset: offset + limit})
                else
                    this.setState({order_list: [...order_list, ...res.list], loadMore: false})
                this.setState({isLoading: false})
            }).catch((err) => {
            });
        }
    }

    getCount = () => {
        this.props.getCount({}).then((res) => {
            if (res.list.length > 0)
                this.setState({count: res.list[0]})
        }).catch((err) => {
        });
    }

    getExchngList = () => {
        // state : 구매 상태값 || 주문상태 (0: 진행중, 1:완료, 2: 교환/반품/환불)
        const {purchaseStatusIdx, offset, limit, order_list, loadMore} = this.state;
        if (loadMore) {
            let params = {
                skip: offset,
                limit: limit,
                state: purchaseStatusIdx,
            }
            this.props.getExchngList(params).then((res) => {
                if (parseInt(res.count) > (offset + limit))
                    this.setState({order_list: [...order_list, ...res.list], offset: offset + limit})
                else
                    this.setState({order_list: [...order_list, ...res.list], loadMore: false})
                this.setState({isLoading: false})
            }).catch((err) => {
            });
        }
    }

    getExchngCount = () => {
        this.props.getExchngCount({}).then((res) => {
            if (res.list.length === 3) {
                let data = {
                    진행중 : res.list.filter((item) => 0 === parseInt(item.state))[0]?.count || 0,
                    완료 : res.list.filter((item) => 1 === parseInt(item.state))[0]?.count || 0,
                    사용 : res.list.filter((item) => 2 === parseInt(item.state))[0]?.count || 0,
                }
                this.setState({count: data})
            }
        }).catch((err) => {
        });
    }

    renderPurchaseStatusBox = (title, statusId, count) => {
        const {purchaseStatusIdx, currentPurchaseTabIdx} = this.state;
        const isActive = statusId === purchaseStatusIdx;
        return (
            <TouchableOpacity
                style={styles.purchaseStatusBox}
                onPress={() => this.setState({
                    purchaseStatusIdx: statusId,
                    order_list: [],
                    offset: 0,
                    loadMore: true,
                    yOffset: 0
                }, () => {
                    if(currentPurchaseTabIdx === 0) this.getList();
                    else this.getExchngList();
                })}
            >
                <Text
                    style={[styles.purchaseTitleText, {
                        fontFamily: isActive ? Fonts.AppleB : Fonts.AppleR,
                        color: isActive ? "#000000" : "#888888",
                    }]}
                >
                    {title}
                </Text>
                <Text style={[styles.purchaseCountText, {color: isActive ? "#000000" : "#888888",}]}>
                    {count}
                </Text>
            </TouchableOpacity>
        );
    };

    renderTabStatusBox = () => {
        const {currentPurchaseTabIdx} = this.state;
        return (
            <View style={{flexDirection: "row", paddingTop: 5}}>
                <TouchableOpacity
                    style={[
                        styles.tabBtn,
                        {
                            borderBottomColor:
                                currentPurchaseTabIdx === 0 ? Colors.MAIN_COLOR : "transparent",
                        },
                    ]}
                    onPress={() => this.setState({
                        currentPurchaseTabIdx: 0,
                        offset: 0,
                        order_list: [],
                        loadMore: true,
                        yOffset: 0,
                    }, () => {
                        this.getList();
                        this.getCount();
                    })}
                >
                    <Text
                        style={{
                            fontFamily:
                                currentPurchaseTabIdx === 0 ? Fonts.AppleB : Fonts.AppleR,
                            letterSpacing: -0.35,
                            color:
                                currentPurchaseTabIdx === 0 ? Colors.MAIN_COLOR : "#999999",
                        }}
                    >
                        {MyPageText.productPurchase}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tabBtn,
                        {
                            borderBottomColor:
                                currentPurchaseTabIdx === 1 ? Colors.MAIN_COLOR : "transparent",
                        },
                    ]}
                    onPress={() => this.setState({
                        currentPurchaseTabIdx: 1,
                        offset: 0,
                        order_list: [],
                        loadMore: true,
                        yOffset: 0,
                    }, () => {
                        this.getExchngList();
                        this.getExchngCount();
                    })}
                >
                    <Text
                        style={{
                            fontFamily:
                                currentPurchaseTabIdx === 1 ? Fonts.AppleB : Fonts.AppleR,
                            letterSpacing: -0.35,
                            color:
                                currentPurchaseTabIdx === 1 ? Colors.MAIN_COLOR : "#999999",
                        }}
                    >
                        {MyPageText.ticketPurchase}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        const {navigation, eCOMM_CD, eSESSION} = this.props;
        const {isLoading, count, order_list, purchaseStatusIdx, yOffset, currentPurchaseTabIdx} = this.state;
        if (isLoading)
            return (
                <View style={{flex: 1, justifyContent: "center"}}>
                    <ActivityIndicator size="large" color={Colors.MAIN_COLOR}/>
                </View>
            );
        else
            return (
                <View style={styles.container}>
                    <TopHeader title={MyPageText.myBuy} navigation={navigation}/>
                    {build_type === TOKEN.build_type_txt && eSESSION.mber_se_cd === CodeText.mber_se_cd_g && this.renderTabStatusBox()}
                    <ScrollView
                        style={{flex: 1}}
                        // onScrollEndDrag={(e) => {
                        //     this.setState({yOffset: e.nativeEvent.contentOffset.y})
                        // }}
                        contentOffset={{y: yOffset}}
                        showsVerticalScrollIndicator={false}
                        onMomentumScrollEnd={(e) => {
                            this.setState({yOffset: e.nativeEvent.contentOffset.y})
                            this.getList();
                        }}>
                        {currentPurchaseTabIdx === 0 ? ( /* 상품 구매*/
                            <View style={styles.purchaseStatusWrap}>
                                {this.renderPurchaseStatusBox(MyPageText.proceeding, 0, count[`진행중`])}
                                {this.renderPurchaseStatusBox(MyPageText.completion, 1, count[`완료`])}
                                {this.renderPurchaseStatusBox(MyPageText.exchange, 2, count[`교환/반품/환불`])}
                            </View>
                        ) : ( /* 교환권 구매*/
                            <View style={styles.purchaseStatusWrap}>
                                {this.renderPurchaseStatusBox(MyPageText.proceeding, 0, count[`진행중`])}
                                {this.renderPurchaseStatusBox(MyPageText.completion, 1, count[`완료`])}
                                {this.renderPurchaseStatusBox(MyPageText.ticketExchange, 2, count[`사용`])}
                            </View>
                        )}
                        {order_list.map((item) => {
                            if(currentPurchaseTabIdx === 0)
                                return (
                                    <MyBuyListItem
                                        purchaseStatusIdx={purchaseStatusIdx + 1}
                                        eCOMM_CD={eCOMM_CD}
                                        eSESSION={eSESSION}
                                        item={item}
                                        navigation={navigation}
                                    />
                                )
                            else
                                return (
                                  <MyBuyTicketListItem
                                    purchaseStatusIdx={purchaseStatusIdx + 1}
                                    eCOMM_CD={eCOMM_CD}
                                    item={item}
                                    navigation={navigation}
                                  />
                                );
                        })}
                    </ScrollView>
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
    getCount: (params) => dispatch(ActionOrder.getCount(params)),
    getList: (params) => dispatch(ActionOrder.getList(params)),

    getExchngCount: (params) => dispatch(ActionExchng.getCount(params)),
    getExchngList: (params) => dispatch(ActionExchng.getOrderList(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyBuy);
