import React, {Component} from "react";
import {ScrollView, View, Text, Image, StyleSheet} from "react-native";
import {connect} from "react-redux";


import {TopHeader} from "../../../../component/TopHeader";

import Fonts from "../../../../model/lib/Utils/Fonts";
import Colors from "../../../../model/lib/Utils/Colors";
import * as dateUtil from "../../../../model/lib/Utils/Date";
import {maskingAddress} from "../../../../model/lib/Utils";
import {MyBuyText, MyPageText, StoreText} from "../../../../model/lib/Utils/Strings";
import {DEVICE_WIDTH} from "../../../../model/lib/Utils/Constants";

import * as ActionTracker from "../../../../model/lib/DeliveryTracker/eDELIVERY_TRACKER";
import * as ActionConst from "../../../../model/action/eCOMM_CD";

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
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "white",
    },
    productImg: {
        width: 40,
        height: 40,
        borderRadius: 5,
        marginRight: 10,
        resizeMode: "contain"
    },
    title: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        letterSpacing: -0.33,
        color: "#000000",
        width: DEVICE_WIDTH - 90,
    },
    option: {
        fontFamily: Fonts.AppleR,
        fontSize: 11,
        letterSpacing: -0.28,
        color: "#999999",
    },
    smallDivider: {
        height: 10,
        width: 1,
        backgroundColor: "#999999",
        marginHorizontal: 6.5,
        marginBottom: 2,
    },
    optionBox: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    deliveryInfoTitle: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.3,
        textAlign: "left",
        color: "#555555",
        marginBottom: 10,
    },
    deliveryInfoDesc: {
        fontFamily: Fonts.AppleB,
        fontSize: 12,
        letterSpacing: -0.3,
        color: "#222222",
        marginBottom: 10,
    },
    deliveryStatusDate: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.3,
        textAlign: "right",
        color: "#222222",
        marginBottom: 13,
    },
    deliveryInfoWrap: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingBottom: 25,
        backgroundColor: "white",
    },
    deliveryStatusWrap: {
        width: 1,
        backgroundColor: "#dddddd",
        height: 70,
        position: "absolute",
        top: 10,
        left: 5,
    },
    deliveryLastItemImg: {
        width: 12,
        height: 12,
        marginRight: 7.5,
        marginTop: 3,
    },
    deliveryItemImg: {
        width: 12,
        height: 12,
        backgroundColor: "#999999",
        borderRadius: 30,
        marginRight: 7.5,
        marginTop: 3,
    },
    deliveryItemTime: {
        marginTop: 5,
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.3,
        color: "#999999",
        marginRight: 15.5,
    },
    deliveryItemLocation: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.3,
    },
    deliveryItemStatus: {
        fontFamily: Fonts.AppleB,
        letterSpacing: -0.35,
    },
});

class MyBuyDelivery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hdlvy: [],
            order_no: props.navigation.state.params.order_no,
            product: props.navigation.state.params.product,
            inst_dt: props.navigation.state.params.inst_dt,
            deliveryCompany: "",
            deliveryCode: "",
            deliveryTrack: [],
        };
    }

    componentDidMount() {
        const {navigation} = this.props;
        const {product} = navigation.state.params;
        if(product.dlvy)
            this.setState({deliveryCompany: product.dlvy.hdlvy_cmpny_cd, deliveryCode: product.dlvy.waybil_no}, () => this.getHdlvy())
    }

    getHdlvy = () => {
        this.props.getHdlvy({}).then((res) => {
            this.setState({hdlvy: res.hdlvy_cmpny}, () => this.getTracking())
        }).catch((err) => {
            this.setState({deliveryTrack: []});
        });
    }

    getTracking = () => {
        const {deliveryCompany, deliveryCode, hdlvy} = this.state
        let hdlvy_cmpny = hdlvy.filter((item) => item.hdlvy_cmpny_cd === deliveryCompany)
        if (hdlvy_cmpny.length > 0 && deliveryCompany && deliveryCode) {
            // let params = {
            //     carrier_id: "kr.cjlogistics",
            //     track_id: "386701069535", // sample
            // };
            let params = {
                carrier_id: hdlvy_cmpny[0].hdlvy_cmpny_id,
                track_id: deliveryCode,
            };
            this.props.getDeliveryTrack(params).then((res) => {
                this.setState({deliveryTrack: res.progresses.reverse()});
            }).catch((err) => {
                this.setState({deliveryTrack: []});
            });
        }
    };

    render() {
        const {navigation} = this.props;
        const {inst_dt, order_no, product, deliveryTrack, deliveryCompany, hdlvy} = this.state;
        let hdlvy_cmpny = hdlvy.filter((item) => item.hdlvy_cmpny_cd === deliveryCompany)
        let deliveryCmpny = "";
        if(hdlvy_cmpny.length > 0 && deliveryCompany)
            deliveryCmpny = hdlvy_cmpny[0].hdlvy_cmpny_nm

        return (
            <View style={styles.container}>
                <TopHeader
                    title={MyPageText.deliveryTracking}
                    navigation={navigation}
                    hasRightBtn={false}
                />
                <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                    <View style={styles.orderInfoBox}>
                        <Text style={styles.cancelDates}>
                            {dateUtil.formatKCT("point", inst_dt || "")}
                        </Text>
                        <Text style={styles.orderNum}>
                            {`${MyBuyText.orderNo} ${order_no}`}
                        </Text>
                        <View style={styles.divider}/>
                    </View>

                    <View style={styles.product}>
                        <Image source={{uri: product.thumb_url}} style={styles.productImg}/>
                        <View>
                            <Text style={styles.title} numberOfLines={2}>{product.goods_nm}</Text>

                            <View style={styles.optionBox}>
                                <Text style={styles.option}>
                                    {product.goods_optn_nm ? product.goods_optn_nm : ""}
                                </Text>
                                <View style={styles.smallDivider}/>
                                <Text style={styles.option}>
                                    {`${StoreText.count}: ${product.order_cnt}`}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.deliveryInfoWrap}>
                        <View style={{width: "25%"}}>
                            <Text style={styles.deliveryInfoTitle}>{MyPageText.courier}</Text>
                            <Text style={styles.deliveryInfoTitle}>
                                {MyPageText.invoiceNumber}
                            </Text>
                            <Text style={styles.deliveryInfoTitle}>
                                {MyPageText.recipient}
                            </Text>
                            <Text style={styles.deliveryInfoTitle}>{MyPageText.address}</Text>
                        </View>
                        <View>
                            <Text style={styles.deliveryInfoDesc}>{deliveryCmpny}</Text>
                            <Text style={[styles.deliveryInfoDesc, {color: Colors.MAIN_COLOR}]}>
                                {product.dlvy.waybil_no || ""}
                            </Text>
                            <Text style={styles.deliveryInfoDesc}>
                                {product.dlvy.dlvy_addr_nm || ""}
                            </Text>
                            <Text style={styles.deliveryInfoDesc}>
                                {maskingAddress(product.dlvy.addr || "")}
                                {/*{maskingAddress(product.dlvy.addr_dtl || "")}*/}
                            </Text>
                        </View>
                    </View>

                    <View style={{padding: 20}}>
                        <Text style={styles.deliveryStatusDate}>
                            <Text style={{color: "#999999"}}>{MyPageText.lastUpdate}</Text>
                            {` ${dateUtil.format("lastUpdate", new Date())}`}
                        </Text>
                        {deliveryTrack.length === 0 && (
                            <View style={{flexDirection: "row", paddingBottom: 18.2}}>
                                <View style={styles.deliveryItemImg}/>
                                <Text style={styles.deliveryItemStatus}>조회 결과가 없습니다.</Text>
                            </View>
                        )}
                        {deliveryTrack.map((ds, dsIdx) => {
                            const isComplete = dsIdx === 0;
                            return (
                                <View>
                                    <View style={styles.deliveryStatusWrap}/>
                                    <View style={{flexDirection: "row", paddingBottom: 18.2}}>
                                        {isComplete ? (
                                            <Image
                                                source={require("../../../../assets/image/mypage/2730.png")}
                                                style={styles.deliveryLastItemImg}
                                            />
                                        ) : (
                                            <View style={styles.deliveryItemImg}/>
                                        )}

                                        <View>
                                            <Text
                                                style={[styles.deliveryItemStatus, {
                                                    color: isComplete ? Colors.MAIN_COLOR : "#999999",
                                                }]}
                                            >
                                                {dateUtil.format("slashDate", ds.time)}
                                            </Text>
                                            <View style={{flexDirection: "row"}}>
                                                <Text style={styles.deliveryItemTime}>
                                                    {dateUtil.format("HHMM3", ds.time)}
                                                </Text>
                                                <View style={{marginTop: 5}}>
                                                    <Text
                                                        style={[styles.deliveryItemLocation, {
                                                            color: isComplete ? "#555555" : "#999999",
                                                        }]}
                                                    >
                                                        [{ds.location.name}]
                                                    </Text>
                                                    <Text
                                                        style={[styles.deliveryItemStatus, {
                                                            marginTop: 5,
                                                            color: isComplete ? "#222222" : "#999999",
                                                        }]}
                                                    >
                                                        {ds.status.text}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
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
    getHdlvy: (params) => dispatch(ActionConst.getHdlvy(params)),
    getDeliveryTrack: (params) => dispatch(ActionTracker.getDeliveryTrack(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyBuyDelivery);
