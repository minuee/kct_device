import React from "react";
import {StyleSheet, Text, View, Image} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler"

import {DEVICE_WIDTH} from "../../model/lib/Utils/Constants";
import Fonts from "../../model/lib/Utils/Fonts";
import Colors from "../../model/lib/Utils/Colors";
import {CodeText} from "../../model/lib/Utils/Strings";
import * as dateUtil from "../../model/lib/Utils/Date";

const styles = StyleSheet.create({
    eventImg: {
        width: DEVICE_WIDTH,
        height: 230,
        resizeMode: "contain",
    },
    eventDescBox: {alignItems: "center", marginTop: 14},
    remindTime: {
        fontSize: 30,
        fontWeight: "900",
        fontStyle: "italic",
        color: "#000000",
    },
    limitDays: {
        fontFamily: Fonts.AppleR,
        fontSize: 14,
        color: "#595959",
        marginTop: 5,
    },
    product: {
        fontFamily: Fonts.AppleR,
        fontSize: 18,
        color: "#191919",
        marginTop: 7.5,
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
});

export const EventItem = (props) => {
    const {navigation, item, eCOMM_CD} = props;
    const sale_type = eCOMM_CD[`${item.sale_mth_cd}`].cd_nm
    const goods_type = eCOMM_CD[`${item.goods_se_cd}`].cd_nm.replace("중고상품", "중고")
    const limitDay = dateUtil.formatKCT("date", item.sale_begin_dt)
    const date = dateUtil.getUTCDay(new Date(dateUtil.formatKCT("dash", item.sale_begin_dt)).getUTCDay())

    let now = new Date()
    let dayTime = new Date(dateUtil.formatKCT("dash", item.sale_begin_dt)).getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    let remindDay = Math.ceil(dayTime / (1000 * 60 * 60 * 24)) - 1;
    if(remindDay === 0) remindDay = "DAY";

    return (
      <TouchableOpacity
        style={{ width: DEVICE_WIDTH, height: 380 }}
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
        <Image style={styles.eventImg} source={{ uri: item.thumb_url }} />
        <View style={styles.eventDescBox}>
          <Text style={styles.remindTime}>{`D - ${remindDay}`}</Text>
          <Text style={styles.limitDays}>{`(${limitDay} ${date} 12:00)`}</Text>
          <Text style={styles.product}>{item.goods_nm}</Text>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <View style={[styles.eventBtn, { backgroundColor: Colors.MAIN_COLOR }]}>
              <Text style={styles.eventBtnText}>{goods_type}</Text>
            </View>
            <View style={[styles.eventBtn, { backgroundColor: Colors.BLACK }]}>
              <Text style={styles.eventBtnText}>{sale_type}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
};
