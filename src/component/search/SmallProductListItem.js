import React from "react";
import {StyleSheet, TouchableOpacity, Text, Image, View} from "react-native";

import Fonts from "../../model/lib/Utils/Fonts";
import {
    CartText,
    CodeText,
    SearchText,
    StoreText,
} from "../../model/lib/Utils/Strings";
import {formattedNumber} from "../../model/lib/Utils";
import {DEVICE_WIDTH} from "../../model/lib/Utils/Constants";

const styles = StyleSheet.create({
    title: {
        fontFamily: Fonts.AppleL,
        fontSize: 16,
        letterSpacing: -0.8,
        color: "#191919",
        marginTop: 15,
        width: (DEVICE_WIDTH - 40) / 2 - 10
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
    statusBox: {
        paddingLeft: 9.8,
        paddingRight: 8.5,
        paddingTop: 3.2,
        paddingBottom: 3.2,
        marginRight: 5,
        marginTop: 10,
    },
    statusText: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.6,
        color: "#ffffff",
    },
    productSaleStatusBox: {
        paddingLeft: 9.8,
        paddingRight: 8.5,
        paddingTop: 3.2,
        paddingBottom: 3.2,
        backgroundColor: "#eeeeee",
        marginRight: 5,
        marginTop: 10,
    },
    productSaleStatus: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.6,
        color: "#000000",
    },
});

export const SmallProductListItem = (props) => {
    const {navigation, eCOMM_CD, item, tabIdx} = props;
    const goods_type = eCOMM_CD[`${item.goods_se_cd}`].cd_nm.replace("중고상품", "중고")
    const subTitle =
        item.sale_mth_cd === CodeText.sale_mth_cd_a
            ? StoreText.auctionStartPrice // 경매시작가
            : item.type === CodeText.sale_mth_cd_r
                ? StoreText.whenPreOrder // 예약구매시
                : item.type === CodeText.sale_mth_cd_g
                    ? StoreText.whenGroupBuying // 공동구매시
                    : StoreText.immediatePurchase; // 즉시구매시

    const cal_cnt = parseInt(item.sale_cnt || 0) - parseInt(item.sale_cnt_auc || 0) - parseInt(item.sale_cnt_immedi || 0) - parseInt(item.sale_cnt_copertn || 0) - parseInt(item.sale_cnt_reserv || 0);
    let isSold = cal_cnt <= 0;
    if (item.sale_mth_cd === CodeText.sale_mth_cd_a)
        isSold = false;
    return (
        <TouchableOpacity
            style={{width: (DEVICE_WIDTH - 40) / 2 - 10, marginBottom: 30}}
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
                style={{width: "100%", height: (DEVICE_WIDTH - 40) / 2 - 10, borderRadius: 5}}
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
            {tabIdx === 1 ?
                <View style={{flexWrap: "wrap", flexDirection: "row", marginTop: 10}}>
                    <View
                        style={[
                            styles.statusBox,
                            {backgroundColor: item.entpr_mall_prvuse_yn === "Y" ? "#02a2f5" : "#000000"}
                        ]}
                    >
                        <Text style={styles.statusText}>
                            {item.entpr_mall_prvuse_yn === "Y" ? SearchText.business : goods_type}
                        </Text>
                    </View>
                    <View style={styles.productSaleStatusBox}>
                        <Text style={styles.productSaleStatus}>{isSold ? CartText.soldOut : item.sale}</Text>
                    </View>
                </View> :
                <View style={{flexWrap: "wrap", flexDirection: "row", marginTop: 10}}>
                    <View style={styles.productSaleStatusBox}>
                        <Text style={styles.productSaleStatus}>{isSold ? CartText.soldOut : item.sale}</Text>
                    </View>
                    {/*<View style={styles.productSaleStatusBox}> CHECK_POINT:수량숨김처리 */}
                    {/*    <Text style={styles.productSaleStatus}>{`${StoreText.salesQuantity} ${item.sale_cnt}`}</Text>*/}
                    {/*</View>*/}
                </View>}
        </TouchableOpacity>
    );
};
