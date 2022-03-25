import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
    Text,
} from "react-native";

import Fonts from "../../model/lib/Utils/Fonts";
import {CartText, CodeText, StoreText} from "../../model/lib/Utils/Strings";
import {formattedNumber} from "../../model/lib/Utils";
import { DEVICE_WIDTH } from '../../model/lib/Utils/Constants';

const styles = StyleSheet.create({
    container: {
        marginBottom: 30,
        width: DEVICE_WIDTH * 0.43,
    },
    productDescBox: {
        marginTop: 14,
        width: "100%",
    },
    title: {
        fontFamily: Fonts.AppleL,
        fontSize: 16,
        letterSpacing: -0.8,
        color: "#191919",
    },
    subTitle: {
        fontFamily: Fonts.AppleL,
        fontSize: 12,
        letterSpacing: -0.6,
        color: "#969696",
        marginTop: 10,
    },
    priceBox: {flexDirection: "row", marginTop: 5, alignItems: "center"},
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
    countBox: {
        marginTop: 10,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 9.2,
        paddingVertical: 3.5,
        marginRight: 5,
    },
    count: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        textAlign: "left",
        color: "#333333",
    },
    isBundle: {
        width: 56,
        height: 25,
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 5,
    },
});

export const Product = (props) => {
    const {item, navigation} = props;

    //     sale_mth_cd_r: "SMC00004", // 예약구매
    //     sale_mth_cd_a: "SMC00002", // 경매거래
    //     sale_mth_cd_i: "SMC00001", // 즉시구매
    //     sale_mth_cd_g: "SMC00003", // 공동구매
    const subTitle =
        item.sale_mth_cd === CodeText.sale_mth_cd_a
            ? StoreText.auctionStartPrice // 경매시작가
            : item.sale_mth_cd === CodeText.sale_mth_cd_r
                ? StoreText.whenPreOrder // 예약구매시
                : item.sale_mth_cd === CodeText.sale_mth_cd_g
                    ? StoreText.whenGroupBuying // 공동구매시
                    : StoreText.immediatePurchase; // 즉시구매시

    const cal_cnt = parseInt(item.sale_cnt || 0) - parseInt(item.sale_cnt_auc || 0) - parseInt(item.sale_cnt_immedi || 0) - parseInt(item.sale_cnt_copertn || 0) - parseInt(item.sale_cnt_reserv || 0);
    let isSold = cal_cnt <= 0;
    if(item.sale_mth_cd === CodeText.sale_mth_cd_a)
        isSold = false;
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
          navigation.push(nav, { goods_no: item.goods_no });
        }}
      >
        {item.bundle_sale_yn === "Y" ? (
          <Image
            source={require("../../assets/image/store/graphic.png")}
            style={styles.isBundle}
          />
        ) : null}
        <Image
          source={{ uri: item.thumb_url }}
          style={{
            width: DEVICE_WIDTH * 0.43,
            height: DEVICE_WIDTH * 0.43,
            borderRadius: 5,
          }}
        />
        <View style={styles.productDescBox}>
          <Text style={styles.title} numberOfLines={2}>{item.goods_nm}</Text>
          <Text style={styles.subTitle}>{subTitle}</Text>
          {item.sale_mth_cd === CodeText.sale_mth_cd_a ? (
            <View style={styles.priceBox}>
              <Text style={[styles.price, { marginRight: 2 }]}>
                {formattedNumber(item.low_or_dpst_price)}
              </Text>
              <Text style={styles.priceText}>{StoreText.fromWon}</Text>
            </View>
          ) : (
            <Text style={[styles.price, { marginTop: 5 }]}>
              {formattedNumber(item.sale_prc)}
              {StoreText.won}
            </Text>
          )}
          <View style={{flexWrap: "wrap", flexDirection: "row" }}>
            <View style={styles.countBox}>
              <Text style={styles.count}>{isSold ? CartText.soldOut : item.sale}</Text>
            </View>
              {/*{item.sale_mth_cd === CodeText.sale_mth_cd_a ? null : CHECK_POINT:수량숨김처리*/}
              {/*  <View style={styles.countBox}>*/}
              {/*    <Text style={styles.count} numberOfLines={1}>*/}
              {/*      {`${StoreText.salesQuantity} ${item.sale_cnt}`}*/}
              {/*    </Text>*/}
              {/*  </View>}*/}
          </View>
        </View>
      </TouchableOpacity>
    );
};
