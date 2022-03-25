import React, {useEffect, useState} from "react";
import { StyleSheet, TouchableOpacity, Image, View, Text } from "react-native";
import Colors from "../../model/lib/Utils/Colors";

import Fonts from "../../model/lib/Utils/Fonts";
import {CodeText, StoreText} from "../../model/lib/Utils/Strings";
import {DEVICE_WIDTH} from "../../model/lib/Utils/Constants";
import {formattedNumber} from "../../model/lib/Utils";
import * as dateUtil from "../../model/lib/Utils/Date";
import moment from "moment";

const styles = StyleSheet.create({
  container: { marginBottom: 30, width: (DEVICE_WIDTH - 40) / 2 - 10 },
  productImg: { width: "100%", height: (DEVICE_WIDTH - 40) / 2 - 10, borderRadius: 5 },
  title: {
    fontFamily: Fonts.AppleR,
    fontSize: 16,
    color: "#2a2e34",
    marginTop: 3.2
  },
  subTitle: {
    fontFamily: Fonts.AppleB,
    fontSize: 11,
    color: Colors.MAIN_COLOR,
    marginTop: 15,
  },
  priceBox: { flexDirection: "row", marginTop: 2.5, alignItems: "center" },
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
    marginTop:2.5
  },
  options: {
    fontFamily: Fonts.AppleL,
    fontSize: 12,
    marginTop: 10,
    color: "#969696",
  },
});

export const VoucherAlbumItem = (props) => {
  const { item, navigation, setIsShowToast } = props;
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
          exchng_vol_trd_no: item.exchng_vol_trd_no,
          setIsShowToast: setIsShowToast
        })
      }
    >
      <Image source={{uri: item.thumb_url}} style={styles.productImg} />
      <Text style={styles.subTitle}>
        { isTimerText ? remindTimeText : typeTitle }
      </Text>
      <Text style={styles.title} numberOfLines={1}>
        {item.goods_nm}
      </Text>
      <Text style={styles.options}>{item.goods_optn_nm}</Text>
      {item.exchng_vol_trd_typ_cd !== CodeText.exchng_vol_trd_typ_cd_i ? (
        <View style={styles.priceBox}>
          <Text style={[styles.price, { marginRight: 2 }]}>{formattedNumber(item.low_bid_prc)}</Text>
          <Text style={styles.priceText}>{StoreText.fromWon}</Text>
        </View>
      ) : (
        <Text style={[styles.price, { marginTop: 2.5 }]}>{formattedNumber(item.immedi_purchase_prc)}{StoreText.won}</Text>
      )}
    </TouchableOpacity>
  );
};
