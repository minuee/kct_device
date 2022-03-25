import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
    Text,
} from "react-native";

import Fonts from "../../model/lib/Utils/Fonts";
import {CodeText, StoreText} from "../../model/lib/Utils/Strings";
import {formattedNumber} from "../../model/lib/Utils";
import { DEVICE_WIDTH } from "../../model/lib/Utils/Constants";

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        borderRadius: 5,
    },
    productDescBox: {
        position: "absolute",
        bottom: 12.5,
        left: 15,
        zIndex: 10,
    },
    title: {
        fontFamily: Fonts.AppleL,
        fontSize: 17,
        letterSpacing: -0.85,
        color: "#ffffff",
        paddingRight: 20
    },
    price: {
        fontFamily: Fonts.AppleB,
        fontSize: 15,
        letterSpacing: -0.75,
        marginTop: 3.2,
        color: "#ffffff",
    },
    count: {
        fontFamily: Fonts.AppleR,
        fontSize: 11,
        marginTop: 6,
        color: "#eeeeee",
    },
    backgroundView: {
        position: "absolute",
        top: 0,
        left: 0,
        borderRadius: 5,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.2)",
        zIndex: 5,
    },
});

export const OutOfProduct = (props) => {
    const {navigation, item} = props;

    const cal_cnt = parseInt(item.sale_cnt || 0) - parseInt(item.sale_cnt_immedi || 0) - parseInt(item.sale_cnt_copertn || 0) - parseInt(item.sale_cnt_reserv || 0)

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
          navigation.navigate(nav, { goods_no: item.goods_no });
        }}
      >
        <View style={styles.productDescBox}>
          <Text style={styles.title} numberOfLines={2}>{item.goods_nm}</Text>
          {item.sale_mth_cd === CodeText.sale_mth_cd_a ? (
            <Text style={styles.price}>
              {formattedNumber(item.top_bid_prc || item.low_bid_prc)}
            </Text>
          ) : item.sale_mth_cd === CodeText.sale_mth_cd_r ? (
              <Text style={styles.price}>
                  {formattedNumber(item.dpst_amt_prc)}
              </Text>
          ) : (
            <Text style={styles.price}>{`${formattedNumber(item.sale_prc)}`}</Text>
          )}
          {/*<Text style={styles.price}>{item.price}</Text>*/}
          {/*<Text style={styles.count}>{`${StoreText.stock} ${formattedNumber(cal_cnt)}개`}</Text>*/}
        </View>
        <View style={styles.backgroundView} />
        <Image
          source={{ uri: item.thumb_url }}
          style={{
            width: DEVICE_WIDTH * 0.43,
            height: DEVICE_WIDTH * 0.58,
            borderRadius: 5,
          }}
        />
      </TouchableOpacity>
    );
};
