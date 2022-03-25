import React, {useEffect, useState} from "react";
import {StyleSheet, TouchableOpacity, Text, View, Image} from "react-native";
import moment from "moment";

import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";
import * as dateUtil from "../../../model/lib/Utils/Date";
import {formattedNumber} from "../../../model/lib/Utils";
import {CodeText, StoreText} from "../../../model/lib/Utils/Strings";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginBottom: 20,
        alignItems: "center",
        paddingHorizontal: 20,
    },
    productImg: {
        width: 90,
        height: 90,
        borderRadius: 5,
        borderStyle: "solid",
        borderWidth: 0.3,
        borderColor: "#e1e1e1",
        marginRight: 15,
    },
    productTypeTitle: {
        fontFamily: Fonts.AppleM,
        fontSize: 13,
        letterSpacing: -0.33,
    },
    productDateTitle: {
        fontFamily: Fonts.AppleB,
        fontSize: 12,
        letterSpacing: -0.6,
    },
    productRemainDateTitle: {
        color: Colors.MAIN_COLOR,
        fontFamily: Fonts.AppleB,
        fontSize: 12,
        letterSpacing: -0.6,
    },
    productPriceTitle: {
        fontFamily: Fonts.AppleB,
        fontSize: 17,
        letterSpacing: -0.43,
        color: "#222222",
        marginTop: 10,
    },
    productNameTitle: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        letterSpacing: -0.33,
        color: "#000000",
        marginTop: 5,
        marginRight: 20
    },
    productOption: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2.5,
    },
    productOptionText: {
        fontFamily: Fonts.AppleR,
        fontSize: 11,
        letterSpacing: -0.28,
        color: "#999999",
    },
    productCount: {
        height: 10,
        width: 1,
        backgroundColor: "#999999",
        marginHorizontal: 6.5,
        marginBottom: 2,
    },
    productCountText: {
        fontFamily: Fonts.AppleR,
        fontSize: 11,
        letterSpacing: -0.28,
        color: "#999999",
    },
    betweenCenter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});

export const MyBuyListItem = (props) => {
    const {navigation, item, eCOMM_CD, eSESSION, purchaseStatusIdx} = props;
    const typeTitle = eCOMM_CD[`${item.ord_sts_cd}`].cd_nm;
    const isRemain = item.ord_sts_cd === CodeText.auc_trd_sts_cd_s;
    const timer_dt = isRemain ? eSESSION.mber_se_cd === CodeText.mber_se_cd_g ? item.auc_trd_end_dt_MSC00001 : item.auc_trd_end_dt_MSC00002 : item.sale_end_dt;

    /* TIMER MODULE START */
    const [calFinish, setCalFinish] = useState(false);
    const [remindTimeText, setRemindTimeText] = useState("00:00:00");
    const [remainTimeText, setRemainTimeText] = useState("유효기간");
    let rTLimitTimeCounter = null;
    useEffect(() => {
        rTLimitTimeCounter = setInterval(() => {
            if (timer_dt && purchaseStatusIdx === 1) {
                const currentTime = dateUtil.format('x', new Date());
                const limitTime = moment(dateUtil.formatKCT("dash", timer_dt)).hours('23').minutes('59') // 한국 시간 : 23시 59분으로 변경

                const second = 1000;
                const minute = second * 60;
                const hour = minute * 60;
                const day = hour * 24;
                const remindTime = limitTime - currentTime;

                let days = Math.floor(remindTime / day);
                let hours = Math.floor((remindTime % day) / hour);
                let minutes = Math.floor((remindTime % hour) / minute);
                let seconds = Math.floor((remindTime % minute) / second);

                if (hours < 10) {
                    hours = "0" + hours;
                }
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                if (currentTime > limitTime) {
                    setRemindTimeText("");
                    setRemainTimeText(``);

                    setCalFinish(true);
                    clearInterval(rTLimitTimeCounter);
                    return;
                }
                setRemainTimeText(`유효기간: ${days}일`);
                setRemindTimeText(`${days}일 ${hours}:${minutes}:${seconds}`);
                setCalFinish(true);
            } else {
                setRemainTimeText(``);
                setRemindTimeText(``);
                setCalFinish(true);
                clearInterval(rTLimitTimeCounter);
            }
        }, 1000);
    }, []);
    /* TIMER MODULE END */

    let pay_sts_code = item.ord_sts_cd;
    if(item.dlvy_sts_cd && item.ord_sts_cd === "IPODSC03") pay_sts_code = item.dlvy_sts_cd;
    if(item.canc_sts_cd) pay_sts_code = item.canc_sts_cd;
    if(item.exchng_sts_cd) pay_sts_code = item.exchng_sts_cd;
    if(item.rtngud_sts_cd) pay_sts_code = item.rtngud_sts_cd;
    let color_style = {color: Colors.MAIN_COLOR};
    if(pay_sts_code === "IPODRSC1" || pay_sts_code === "IPODESC1")
        color_style = {color: "#9a00ff"};
    if(pay_sts_code === "DSC00003" || pay_sts_code === "IPODSC04" || pay_sts_code === "IPODSC07"  || pay_sts_code === "IPOCSC02")
        color_style = {color: "#999999"};
    if(pay_sts_code === "IPODSC02" || pay_sts_code === "DSC00001")
        color_style = {color: "#000000"};


    if(!calFinish)
        return null;
    else
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => {
                        const nav =
                            item.sale_mth_cd === CodeText.sale_mth_cd_a
                                ? "StoreAuction"
                                : item.sale_mth_cd === CodeText.sale_mth_cd_r
                                    ? "StoreReserve"
                                    : item.sale_mth_cd === CodeText.sale_mth_cd_g
                                        ? "StoreGroup"
                                        : "StoreDetail";
                        navigation.navigate(nav, {goods_no: item.goods_no});
                    }}>
                    <Image source={item.thumb_url ? {uri: item.thumb_url} : null} style={styles.productImg}/>
                </TouchableOpacity>
                <View style={{flex: 1}}>
                    <View style={styles.betweenCenter}>
                        <Text style={[styles.productTypeTitle, color_style]}>{item.order_sts_nm || ""}</Text>
                        {isRemain ? (
                            <Text style={styles.productRemainDateTitle}>
                                {calFinish ? `${remainTimeText}` : ""}
                            </Text>
                        ) : (
                            <Text style={styles.productDateTitle}>
                                {purchaseStatusIdx === 1 && calFinish ? `${remindTimeText}` : ""}
                            </Text>
                        )}
                    </View>
                    <Text style={styles.productPriceTitle}>
                        {`${formattedNumber(item.prc || 0)}${StoreText.won}`}
                    </Text>
                    <Text style={styles.productNameTitle} numberOfLines={1}>{item.goods_nm}</Text>

                    <View style={styles.productOption}>
                        <Text style={styles.productOptionText}>{item.goods_optn_nm}</Text>
                        {item.goods_optn_nm ? <View style={styles.productCount}/> : null}
                        <Text style={styles.productCountText}>
                            {`${StoreText.count}: ${item.purchase_cnt}`}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={{position: "absolute", right: 20, bottom: 4}}
                    onPress={() => navigation.navigate("MyBuyProductDetail", {
                        order_no: item.order_no,
                        sale_mth_cd: item.sale_mth_cd,
                        order_dtl_no: item.order_dtl_no,
                    })}
                >
                    <Image
                        style={{width: 20, height: 20}}
                        source={require("../../../assets/image/mypage/more_chevron_small.png")}
                    />
                </TouchableOpacity>
            </View>
        );
};
