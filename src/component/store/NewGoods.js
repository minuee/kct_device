import React, {useEffect, useState} from "react";
import {StyleSheet, TouchableOpacity, Image, View, Text} from "react-native";
import Colors from "../../model/lib/Utils/Colors";
import {DEVICE_WIDTH} from "../../model/lib/Utils/Constants";

import Fonts from "../../model/lib/Utils/Fonts";
import {CodeText, StoreText} from "../../model/lib/Utils/Strings";
import {formattedNumber} from "../../model/lib/Utils";
import * as dateUtil from "../../model/lib/Utils/Date";
import moment from "moment";

const styles = StyleSheet.create({
    container: {flexDirection: "row", marginTop: 3.5, width: DEVICE_WIDTH - 40},
    productImg: {width: 100, height: 100, borderRadius: 5, marginRight: 14},
    title: {
        fontFamily: Fonts.AppleR,
        fontSize: 14,
        letterSpacing: -0.4,
        color: "#2a2e34",
        marginTop: 8.5,
        width: DEVICE_WIDTH - 155,
    },
    remindTime: {
        fontFamily: Fonts.AppleB,
        fontSize: 16,
        color: "#333333",
    },
    option: {
        fontFamily: Fonts.AppleL,
        fontSize: 12,
        letterSpacing: -0.6,
        color: "#969696",
        marginTop: 6.2,
    },
    priceBox: {flexDirection: "row", marginTop: 5, alignItems: "center"},
    price: {
        fontFamily: Fonts.AppleB,
        fontSize: 14,
        letterSpacing: -0.8,
        color: "#000000",
    },
    priceText: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        letterSpacing: -0.8,
        color: "#595959",
    },
});

export const NewGoods = (props) => {
    const {navigation, item, eCOMM_CD} = props;
    const sale_type = eCOMM_CD[`${item.sale_mth_cd}`].cd_nm

    /* TIMER MODULE START */
    const [remindDays, setRemindDays] = useState(0);
    const [calFinish, setCalFinish] = useState(false);
    const [remindTimeText, setRemindTimeText] = useState("00:00:00");
    let rTLimitTimeCounter = null;
    useEffect(() => {
        rTLimitTimeCounter = setInterval(() => {
            const currentTime = dateUtil.format('x', new Date());
            const limitTime = moment(dateUtil.formatKCT("dash", item.sale_begin_dt)).hours('23').minutes('59') // 한국 시간 : 23시 59분으로 변경

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
                setRemindTimeText("00:00:00");

                clearInterval(rTLimitTimeCounter);
                return;
            }
            setRemindDays(days);
            setRemindTimeText(`${days}일 ${hours}:${minutes}:${seconds}`);
            setCalFinish(true);
        }, 1000);
    }, []);
    /* TIMER MODULE END */

    return (
        <TouchableOpacity
            style={styles.container}
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
            <Image source={{uri: item.thumb_url}} style={styles.productImg}/>
            <View>
                <Text style={styles.remindTime}>
                    {calFinish ? `${remindTimeText}` : "-"}
                </Text>
                <Text style={styles.title} numberOfLines={2}>
                    {item.goods_nm || ""}
                </Text>
                <View style={styles.priceBox}>
                    {item.sale_mth_cd === CodeText.sale_mth_cd_a ? (
                        <Text style={[styles.price, {marginRight: 2}]}>{formattedNumber(item.low_or_dpst_price)}</Text>
                    ) : (
                        <Text style={[styles.price, {marginRight: 2}]}>{`${formattedNumber(item.sale_prc)}`}</Text>
                    )}
                    <Text style={styles.priceText}>{StoreText.fromWon}</Text>
                </View>
                <View
                    style={{flexDirection: "row", marginTop: 5.8, alignItems: "center"}}
                >
                    <TouchableOpacity
                        style={{
                            paddingHorizontal: 9,
                            paddingVertical: 3.2,
                            borderWidth: 0.5,
                            borderColor: Colors.MAIN_COLOR,
                            marginRight: 8,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: Fonts.AppleR,
                                fontSize: 11,
                                letterSpacing: -0.55,
                                color: "#595959",
                            }}
                        >
                            {sale_type}
                        </Text>
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontFamily: Fonts.AppleR,
                            fontSize: 12,
                            color: "#969696",
                        }}
                    >
                        {`수량 ${item.sale_cnt}개`}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
