import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    View,
} from "react-native";

import Fonts from "../../model/lib/Utils/Fonts";
import {CodeText, StoreText} from "../../model/lib/Utils/Strings";
import {formattedNumber} from "../../model/lib/Utils";

const styles = StyleSheet.create({
    title: {
        fontFamily: Fonts.AppleL,
        fontSize: 16,
        letterSpacing: -0.8,
        color: "#191919",
        marginTop: 14,
        width: 224.8,
    },
    subTitle: {
        fontFamily: Fonts.AppleL,
        fontSize: 12,
        letterSpacing: -0.6,
        color: "#969696",
        marginTop: 10,
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

export const ProductListItem = (props) => {
    const {navigation, item} = props;
    const subTitle =
        item.sale_mth_cd === CodeText.sale_mth_cd_a
            ? StoreText.auctionStartPrice // 경매시작가
            : item.sale_mth_cd === CodeText.sale_mth_cd_r
                ? StoreText.whenPreOrder // 예약구매시
                : item.sale_mth_cd === CodeText.sale_mth_cd_g
                    ? StoreText.whenGroupBuying // 공동구매시
                    : StoreText.immediatePurchase; // 즉시구매시
    return (
        <TouchableOpacity
            style={{marginRight: 14.2,}}
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
            <Image
                style={{width: 224.8, height: 224.8, borderRadius: 5}}
                source={{uri: item.thumb_url}}
            />
            <Text style={styles.title} numberOfLines={1}>
                {item.goods_nm}
            </Text>
            <Text style={styles.subTitle}>{subTitle}</Text>
            {item.sale_mth_cd === CodeText.sale_mth_cd_a ? (
                <View style={styles.priceBox}>
                    <Text style={[styles.price, {marginRight: 2}]}>{formattedNumber(item.low_or_dpst_price)}</Text>
                    <Text style={styles.priceText}>{StoreText.fromWon}</Text>
                </View>
            ) : (
                <Text style={[styles.price, {marginTop: 2.5}]}>
                    {formattedNumber(item.sale_prc)}
                    {StoreText.won}
                </Text>
            )}
        </TouchableOpacity>
    );
};
