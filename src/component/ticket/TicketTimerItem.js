import React, {useEffect, useState} from "react";
import { StyleSheet, Text } from "react-native";
import moment from "moment";

import Fonts from "../../model/lib/Utils/Fonts";
import * as dateUtil from "../../model/lib/Utils/Date";

const styles = StyleSheet.create({
    auctionReminingTime: {
        fontFamily: Fonts.AppleB,
        fontSize: 13,
        color: "#1e2328",
        zIndex: 10,
    },
});

export const TicketTimerItem = (props) => {
    const { auc_end_dt } = props;

    /* TIMER MODULE START */
    const [calFinish, setCalFinish] = useState(false);
    const [remindTimeText, setRemindTimeText] = useState("");
    let rTLimitTimeCounter = null;
    useEffect(() => {
        rTLimitTimeCounter = setInterval(() => {
            const currentTime = dateUtil.format('x', new Date());
            const limitTime = moment(dateUtil.formatKCT("dash", auc_end_dt)).hours(auc_end_dt?.substring(8, 10)).minutes('00');

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
                setRemindTimeText("마감");
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
        <Text style={styles.auctionReminingTime}>
            {calFinish ? `${remindTimeText}` : ""}
        </Text>
    );
};
