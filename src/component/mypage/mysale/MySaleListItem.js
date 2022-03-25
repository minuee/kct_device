import React, {useEffect, useState} from "react";
import { StyleSheet, TouchableOpacity, Image, View, Text } from "react-native";
import Colors from "../../../model/lib/Utils/Colors";

import Fonts from "../../../model/lib/Utils/Fonts";
import {CodeText, StoreText} from "../../../model/lib/Utils/Strings";
import * as dateUtil from "../../../model/lib/Utils/Date";
import moment from "moment";

const styles = StyleSheet.create({
  container: { flexDirection: "row", marginBottom: 20 },
  productImg: { width: 80, height: 80, borderRadius: 40, marginRight: 20 },
  title: {
    fontFamily: Fonts.AppleR,
    fontSize: 16,
    letterSpacing: -0.4,
    color: "#2a2e34",
    marginTop: 3.2,
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
    marginTop: 7,
  },
  priceBox: { flexDirection: "row", marginTop: 2.5, alignItems: "center" },
  price: {
    fontFamily: Fonts.AppleB,
    fontSize: 14,
    letterSpacing: -0.7,
    color: "#191919",
    marginTop: 3,
  },
  priceText: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    letterSpacing: -0.8,
    color: "#191919",
    marginTop: 3,
  },
});

export const MySaleListItem = (props) => {
  const { item, navigation } = props;
  const {reserv_purchase} = item;
  let typeTitle = item.exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i ? "즉시구매" : "";
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
  let typeColor = Colors.MAIN_COLOR;
  const exchng_cd = item.exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i ? item.exchng_vol_trd_immedi_purchase_sts_cd : item.exchng_vol_trd_auc_trd_sts_cd;

  switch (exchng_cd) {
    case "EVTATSC3":
      typeTitle = "판매완료(정산대기중)";
      typeColor = "#999999";
      break;
    case "EVTIPSC2":
      typeTitle = "판매완료(정산대기중)";
      typeColor = "#999999";
      break;
    case "EVTATSC2":
      typeTitle = "거래실패";
      typeColor = "#9a00ff";
      break;
    case "EVTIPSC4":
      typeTitle = "거래실패";
      typeColor = "#9a00ff";
      break;
    // case 5:
    //   typeTitle = "정산완료";
    //   typeColor = "#dddddd";
    //   break;
    default:
      break;
  }
  if(item.exchng_vol_trd_excclc_complet_yn === "Y") {
    typeTitle = "정산완료";
    typeColor = "#dddddd";
  }
  const isTimerText = item.exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_a && item.exchng_vol_trd_auc_trd_sts_cd === "EVTATSC1";



  return (
    <View
      style={styles.container}
      // onPress={() => navigation.navigate("TicketDetail", {
      //   goods_no: item.reserv_purchase?.goods_no,
      //   exchng_vol_trd_no: item.exchng_vol_trd_no
      // })}
    >
      <Image source={{uri: reserv_purchase.thumb_url}} style={styles.productImg} />
      <View>
        <Text style={[styles.typeTitle, { color: typeColor }]}>
          { isTimerText ? remindTimeText : typeTitle}
        </Text>
        <Text style={styles.title}>{reserv_purchase.goods_nm}</Text>
        <Text style={styles.option}>{reserv_purchase.goods_optn_nm}</Text>
        {item.exchng_vol_trd_typ_cd !== CodeText.exchng_vol_trd_typ_cd_i ? (
          <View style={styles.priceBox}>
            <Text style={styles.price}>{item.low_bid_prc}</Text>
            <Text style={styles.priceText}>{StoreText.fromWon}</Text>
          </View>
        ) : (
          <Text style={[styles.price, { marginTop: 3 }]}>
            {item.immedi_purchase_prc}
            {StoreText.won}
          </Text>
        )}
      </View>
    </View>
  );
};
