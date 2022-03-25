import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";
import moment from "moment";

import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";
import * as dateUtil from "../../../model/lib/Utils/Date";
import { formattedNumber } from "../../../model/lib/Utils";
import {
  CodeText,
  StoreText,
  MyPageText,
} from "../../../model/lib/Utils/Strings";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  productImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderStyle: "solid",
    borderWidth: 0.3,
    borderColor: "#e1e1e1",
    marginRight: 20,
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
  productPriceTitle: {
    fontFamily: Fonts.AppleB,
    fontSize: 16,
    letterSpacing: -0.4,
    color: "#2a2e34",
    marginTop: 10,
    marginRight: 20
  },
  productNameTitle: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#000000",
    marginTop: 5,
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
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    marginTop: 2.5,
    fontFamily: Fonts.AppleL,
    fontSize: 12,
    letterSpacing: -0.6,
    color: "#969696",
  },
  seeMore: {
    fontFamily: Fonts.AppleM,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#000000",
  },
  seeMoreBtn: {
    borderBottomColor: "#000000",
    borderBottomWidth: 1,
    marginLeft: 5,
  },
});

export const MyBuyTicketListItem = (props) => {
  const { navigation, item, eCOMM_CD, purchaseStatusIdx } = props;
  const {reserv_purchase} = item;
  const purchase_sts_cd =
      item.exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i ?
          item.exchng_vol_trd_immedi_purchase_sts_cd
          : item.exchng_vol_auc_trd_sts_cd;
  const typeTitle = item.exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i ? "즉시구매" : eCOMM_CD[`${purchase_sts_cd}`].cd_nm;

  /* TIMER MODULE START */
  const [calFinish, setCalFinish] = useState(false);
  const [remindTimeText, setRemindTimeText] = useState("00:00:00");
  let rTLimitTimeCounter = null;
  useEffect(() => {
    rTLimitTimeCounter = setInterval(() => {
      if (item.auc_end_dt && purchaseStatusIdx === 1) {
        const currentTime = dateUtil.format("x", new Date());
        const limitTime = moment(dateUtil.formatKCT("dash", item.auc_end_dt))
          .hours("23")
          .minutes("59"); // 한국 시간 : 23시 59분으로 변경

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

          setCalFinish(true);
          clearInterval(rTLimitTimeCounter);
          return;
        }
        setRemindTimeText(`${days}일 ${hours}:${minutes}:${seconds}`);
        setCalFinish(true);
      } else {
        setRemindTimeText(``);
        setCalFinish(true);
        clearInterval(rTLimitTimeCounter);
      }
    }, 1000);
  }, []);
  /* TIMER MODULE END */

  // EVATSC08 : 구매포기
  // EVATSC07 : 입찰포기 환불
  // EVATSC06 : 입찰포기
  // EVATSC05 : 입찰실패 환불
  // EVATSC04 : 입찰실패
  // EVATSC03 : 입찰성공
  // EVATSC02 : 입찰금액 결제완료
  // EVATSC01 : 입찰진행

  let color_style = { color: "#000000" };
  if (purchase_sts_cd === "EVATSC08") // 구매포기
    color_style = { color: "#999999" };
  else if (purchase_sts_cd === "EVATSC01" || purchase_sts_cd === "EVATSC02") // 입찰진행
    color_style = { color: Colors.MAIN_COLOR };

  if(!calFinish)
    return null;
  else
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            const nav = "TicketDetail";
            navigation.navigate(nav, { goods_no: reserv_purchase.goods_no, exchng_vol_trd_no: item.exchng_vol_trd_no });
          }}
        >
          <Image source={ reserv_purchase.thumb_url ? { uri: reserv_purchase.thumb_url } : null } style={styles.productImg} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <View style={[purchaseStatusIdx === 2 ? styles.rowCenter : styles.betweenCenter,]}>
            <Text style={[styles.productTypeTitle, color_style]}>
              {typeTitle}
            </Text>
            {purchaseStatusIdx !== 1 ? (
              <TouchableOpacity
                style={styles.seeMoreBtn}
                onPress={() => navigation.navigate("StoreReserve", { goods_no: reserv_purchase.goods_no })}
              >
                <Text style={styles.seeMore}>{MyPageText.seeMore}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.productDateTitle}>
                {purchaseStatusIdx === 1 && calFinish ? `${remindTimeText}` : ""}
              </Text>
            )}
          </View>

          <Text style={styles.productPriceTitle} numberOfLines={1}>{reserv_purchase.goods_nm}</Text>
          <View style={styles.productOption}>
            <Text style={styles.optionText}>
              {StoreText.option}:{reserv_purchase.goods_optn_nm}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{ position: "absolute", right: 20, bottom: 4 }}
          onPress={() => {
            // exchng_vol_auc_trd_no
            let params = {
              exchng_vol_trd_no: item.exchng_vol_trd_no
            }
            if(item.exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_a)
              Object.assign(params, {exchng_vol_auc_trd_no: item.exchng_vol_auc_trd_no})
            navigation.navigate("MyBuyTicketDetail", params)
          }}
        >
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../../../assets/image/mypage/more_chevron_small.png")}
          />
        </TouchableOpacity>
      </View>
    );
};
