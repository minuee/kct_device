import React, {useEffect, useState} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler"
import moment from "moment";

import {DEVICE_WIDTH} from "../../model/lib/Utils/Constants";
import Fonts from "../../model/lib/Utils/Fonts";
import Colors from "../../model/lib/Utils/Colors";
import {CodeText, StoreText} from "../../model/lib/Utils/Strings";
import {formattedNumber} from "../../model/lib/Utils";
import * as dateUtil from "../../model/lib/Utils/Date";

const styles = StyleSheet.create({
  eventImg: {
    width: DEVICE_WIDTH,
    height: 319.2,
    resizeMode: "contain"
  },
  price: {
    fontFamily: Fonts.AppleB,
    fontSize: 20,
    letterSpacing: -1,
    marginTop: 22.2,
    color: "#000000",
  },
  eventBtn: {
    paddingHorizontal: 11,
    paddingVertical: 4.5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  eventBtnText: {
    fontFamily: Fonts.AppleB,
    fontSize: 15,
    letterSpacing: -0.75,
    color: "#ffffff",
  },
  eventBtnBox: {
    flexDirection: "row",
    position: "absolute",
    top: 305,
    left: 20,
    zIndex: 5,
  },
  productBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 7.8,
    width: "100%",
  },
  product: {
    fontFamily: Fonts.AppleL,
    fontSize: 16,
    letterSpacing: -0.8,
    color: "#000000",
    width: "50%",
  },
  remindTime: {
    width: "50%",
    textAlign: 'right',
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.65,
    color: Colors.MAIN_COLOR,
  },
  fromWon: {
    fontFamily: Fonts.AppleL,
    fontSize: 13,
    letterSpacing: -0.65,
    color: "#333333",
  },
});

export const EventItem = (props) => {
  const { navigation, item, eCOMM_CD } = props;
  const sale_type = eCOMM_CD[`${item.sale_mth_cd}`].cd_nm
  const goods_type = eCOMM_CD[`${item.goods_se_cd}`].cd_nm.replace("중고상품", "중고")

  /* TIMER MODULE START */
  const [remindDays, setRemindDays] = useState(0);
  const [calFinish, setCalFinish] = useState(false);
  const [remindTimeText, setRemindTimeText] = useState("00:00:00");
  let rTLimitTimeCounter = null;
  useEffect(() => {
    rTLimitTimeCounter = setInterval(() => {
      const currentTime = dateUtil.format('x', new Date());
      const limitTime = moment(dateUtil.formatKCT("dash", item.sale_end_dt)).hours('23').minutes('59') // 한국 시간 : 23시 59분으로 변경

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
      setRemindTimeText(`${hours}:${minutes}:${seconds}`);
      setCalFinish(true);
    }, 1000);
  }, []);
  /* TIMER MODULE END */

  return (
    <TouchableOpacity
      style={{ height: 410 }}
      onPress={() => {
        const nav =
          item.sale_mth_cd === CodeText.sale_mth_cd_a
            ? "StoreAuction"
            : item.sale_mth_cd === CodeText.sale_mth_cd_r
            ? "StoreReserve"
            : item.sale_mth_cd === CodeText.sale_mth_cd_g
            ? "StoreGroup"
            : "StoreDetail";
        navigation.navigate(nav, { goods_no: item.goods_no });
      }}
    >
      <View style={styles.eventBtnBox}>
        <View style={[styles.eventBtn, { backgroundColor: Colors.MAIN_COLOR }]}>
          <Text style={styles.eventBtnText}>{goods_type}</Text>
        </View>
        <View style={[styles.eventBtn, { backgroundColor: Colors.BLACK }]}>
          <Text style={styles.eventBtnText}>{sale_type}</Text>
        </View>
      </View>
      <Image source={{ uri: item.thumb_url }} style={styles.eventImg} />
      <View style={{ paddingHorizontal: 20 }}>
        {item.sale_mth_cd === CodeText.sale_mth_cd_a ? (
          <Text style={styles.price}>
            {formattedNumber(item.low_or_dpst_price)}
            <Text style={styles.fromWon}>{" "}{StoreText.fromWon}</Text>
          </Text>
        ) : (
          <Text style={styles.price}>
            {`${formattedNumber(item.sale_prc)}`}
            <Text style={styles.fromWon}>{" "}{StoreText.won}</Text>
          </Text>
        )}
        <View style={styles.productBox}>
          <Text style={styles.product} numberOfLines={1}>{item.goods_nm || ""}</Text>
          <Text style={styles.remindTime}>
            {calFinish && item.sale_end_dt ? `${remindDays}일 ${remindTimeText}` : ""}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
