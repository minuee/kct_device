import React from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";

import Fonts from "../../../model/lib/Utils/Fonts";

import {MyPageText, StoreText} from "../../../model/lib/Utils/Strings";
import {formattedNumber} from "../../../model/lib/Utils";
import * as dateUtil from "../../../model/lib/Utils/Date";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    borderWidth: 1,
    marginBottom: 12,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  betweenCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  box: {
    padding: 15,
    flexDirection: "row",
  },
  img: {
    width: 90,
    height: 90,
    borderRadius: 5,
    marginRight: 15,
  },
  typeTitle: {
    fontFamily: Fonts.AppleM,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#000000",
  },
  price: {
    marginTop: 10,
    fontFamily: Fonts.AppleB,
    fontSize: 17,
    letterSpacing: -0.43,
    color: "#222222",
  },
  title: {
    marginTop: 5,
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#000000",
  },
  optionBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2.5,
  },
  option: {
    fontFamily: Fonts.AppleR,
    fontSize: 11,
    letterSpacing: -0.28,
    color: "#999999",
  },
  divider: {
    height: 10,
    width: 1,
    backgroundColor: "#999999",
    marginHorizontal: 6.5,
    marginBottom: 2,
  },
  count: {
    fontFamily: Fonts.AppleR,
    fontSize: 11,
    letterSpacing: -0.28,
    color: "#999999",
  },
  statusGray: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#999999",
  },
  statusBlack: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#000000",
  },
  radioBox: {
    width: 20,
    height: 20,
    borderStyle: "solid",
    borderWidth: 1,
    position: "absolute",
    top: 15,
    right: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  radioBoxView: {
    width: 10.5,
    height: 10.5,
    borderRadius: 30,
  },
  arrowWrap: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  taxInfoView: {
    paddingTop: 15,
    borderTopWidth: 0.5,
    borderTopColor: "#dddddd",
    paddingHorizontal: 15,
    paddingBottom: 8,
  },
});

export const TaxApplicationListItem = (props) => {
  const { item, isActive, setSelectedItemId, eCOMM_CD, statusIdx } = props;
  const typeTitle = eCOMM_CD[`${item?.ord_sts_cd || "IPODSC04"}`].cd_nm;
  const processingStatus = parseInt(statusIdx) === 1 ? "세금계산서 발행대기" : "세금계산서 발행완료"

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isActive ? "#000000" : "#dddddd",
        },
      ]}
    >
      <TouchableOpacity style={styles.box}>
        <Image source={{ uri: item.thumb_url }} style={styles.img} />
        <View>
          <Text style={styles.typeTitle}>{typeTitle}</Text>
          <Text style={styles.price}>
            {`${formattedNumber(item.prc || 0)}${StoreText.won}`}
          </Text>
          <Text style={styles.title}>{item.goods_nm}</Text>
          <View style={styles.optionBox}>
            <Text style={styles.option}>{item.goods_optn_nm}</Text>
            <View style={styles.divider} />
            <Text style={styles.count}>수량: {item.purchase_cnt}</Text>
          </View>
        </View>
        {parseInt(statusIdx) === 0 ? (
          <TouchableOpacity
            style={[styles.radioBox, {borderColor: isActive ? "#000000" : "#dddddd"}]}
            onPress={setSelectedItemId}
          >
            <View style={[styles.radioBoxView, {backgroundColor: isActive ? "#000000" : "transparent"}]}/>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.arrowWrap}>
            <Image
              style={{ width: 17, height: 17 }}
              source={require("../../../assets/image/mypage/more_chevron_small.png")}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {parseInt(statusIdx) !== 0 ? (
        <View style={styles.taxInfoView}>
          <View style={[styles.betweenCenter, { marginBottom: 10 }]}>
            <Text style={styles.statusGray}>{MyPageText.processingStatus}</Text>
            <Text style={parseInt(statusIdx) === 1 ? styles.statusGray : styles.statusBlack}>
              {processingStatus}
            </Text>
          </View>
          <View style={[styles.betweenCenter, { marginBottom: 10 }]}>
            <Text style={styles.statusGray}>{MyPageText.applicationDate}</Text>
            <Text style={styles.statusBlack}>{dateUtil.formatKCT("dash", item.pblct_apply_dt)}</Text>
          </View>
          {parseInt(statusIdx) === 2 && (
            <View style={[styles.betweenCenter, { marginBottom: 10 }]}>
              <Text style={styles.statusGray}>{MyPageText.issueDate}</Text>
              <Text style={styles.statusBlack}>{dateUtil.formatKCT("dashFullTime", item.pblct_complet_dt)}</Text>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};
