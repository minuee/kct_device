import React, {useEffect, useState} from "react";
import {StyleSheet, TouchableOpacity, Image, View, Text} from "react-native";
import moment from "moment";

import Fonts from "../../model/lib/Utils/Fonts";
import Colors from "../../model/lib/Utils/Colors";
import {CodeText, StoreText} from "../../model/lib/Utils/Strings";
import {formattedNumber} from "../../model/lib/Utils";
import * as dateUtil from "../../model/lib/Utils/Date";

const styles = StyleSheet.create({
    container: {flexDirection: "row", marginBottom: 8, marginTop: 12},
    productImg: {width: 80, height: 80, borderRadius: 40, marginRight: 20},
    title: {
        fontFamily: Fonts.AppleR,
        fontSize: 16,
        letterSpacing: -0.4,
        color: "#2a2e34",
        marginTop: 2.5,
    },
    typeTitle: {
        fontFamily: Fonts.AppleB,
        fontSize: 11,
        color: Colors.MAIN_COLOR,
    },
    option: {
        fontFamily: Fonts.AppleL,
        fontSize: 12,
        letterSpacing: -0.6,
        color: "#969696",
        marginTop: 6.2,
    },
    priceBox: {flexDirection: "row", marginTop: 2.5, alignItems: "center"},
    price: {
        fontFamily: Fonts.AppleB,
        fontSize: 16,
        letterSpacing: -0.8,
        color: "#191919",
    },
    priceText: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.8,
        color: "#191919",
    },
});

export const TicketListItem = (props) => {
    const {item, navigation} = props;
    const typeTitle = item.exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i ? "즉시구매" : "";
    /* TIMER MODULE START */
    let rTLimitTimeCounter = null;
    const [remindTimeText, setRemindTimeText] = useState("");
    useEffect(() => {
        rTLimitTimeCounter = setInterval(() => {
            if (item.exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_a && item.exchng_vol_trd_auc_trd_sts_cd === "EVTATSC1") {
                const currentTime = dateUtil.format("x", new Date());
                const limitTime = moment(dateUtil.formatKCT("dash", item.auc_end_dt)).hours(item.auc_end_dt.substring(8, 10)).minutes("00");

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
                    setRemindTimeText(`마감`);
                    clearInterval(rTLimitTimeCounter);
                    return;
                }
                setRemindTimeText(`${days}일 ${hours}:${minutes}:${seconds}`);
            } else {
                setRemindTimeText(``);
                clearInterval(rTLimitTimeCounter);
            }
        }, 1000);
    }, []);
    /* TIMER MODULE END */
    const isTimerText = item.exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_a && item.exchng_vol_trd_auc_trd_sts_cd === "EVTATSC1";

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() =>
                navigation.navigate("TicketDetail", {
                        goods_no: item.goods_no,
                        exchng_vol_trd_no: item.exchng_vol_trd_no
                    }
                )}
        >
            <Image source={{uri: item.thumb_url}} style={styles.productImg}/>
            <View>
                <Text style={styles.typeTitle}>
                    {isTimerText ? remindTimeText : typeTitle}
                </Text>
                <Text style={styles.title}>{item.goods_nm}</Text>
                <Text style={styles.option}>{item.goods_optn_nm}</Text>
                {item.exchng_vol_trd_typ_cd !== CodeText.exchng_vol_trd_typ_cd_i ? (
                    <View style={styles.priceBox}>
                        <Text style={[styles.price, {marginRight: 2}]}>{formattedNumber(item.low_bid_prc)}</Text>
                        <Text style={styles.priceText}>{StoreText.fromWon}</Text>
                    </View>
                ) : (
                    <Text style={[styles.price, {marginTop: 2.5}]}>
                        {formattedNumber(item.immedi_purchase_prc)}
                        {StoreText.won}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};
