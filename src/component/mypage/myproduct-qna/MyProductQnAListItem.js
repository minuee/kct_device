import React from "react";
import { StyleSheet, TouchableOpacity, Text, Image, View } from "react-native";

import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";
import { MyPageText } from "../../../model/lib/Utils/Strings";

import * as dateUtil from "../../../model/lib/Utils/Date";
import {DEVICE_WIDTH} from "../../../model/lib/Utils/Constants";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingBottom: 20,
    paddingTop: 19.5,
  },
  productImg: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  title: {
    fontFamily: Fonts.AppleR,
    fontSize: 11,
    letterSpacing: -0.28,
    color: "#999999",
  },
  content: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#555555",
    marginTop: 7,
  },
  answerStatusBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6.6,
    width: DEVICE_WIDTH - 75 - 40,
  },
  divider: {
    marginHorizontal: 7.5,
    width: 0.5,
    height: 10,
    backgroundColor: "#999999",
  },
  answerContainer: {
    paddingHorizontal: 17,
    paddingVertical: 16,
    backgroundColor: "#f3f3f3",
  },
  answerBox: {
    width: 40,
    height: 20,
    borderWidth: 0.5,
    borderColor: Colors.MAIN_COLOR,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  answerUpdatedAt: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    letterSpacing: -0.3,
    color: "#999999",
  },
  answerContent: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#555555",
    marginTop: 11,
  },
});

export const MyProductQnAListItem = (props) => {
  const { item, updateMyProductInquiries } = props;
  return (
    <View>
      <View
        style={[
          styles.container,
          {borderBottomColor: item.isOpened ? "transparent" : "#dddddd",},
        ]}
      >
        <Image source={{uri: item.cntnts_url_addr}} style={styles.productImg} />
        <View style={{width: DEVICE_WIDTH - 115 }}>
          <Text style={styles.title}>{item.goods_nm}</Text>
          <Text style={styles.content}>
            {item.inqry_cont}{" "}
            <Image
              style={{ width: 12.4, height: 15.4 }}
              source={require("../../../assets/image/mypage/icon.png")}
            />
          </Text>
          <View style={styles.answerStatusBox}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.AppleB,
                  fontSize: 11,
                  letterSpacing: -0.28,
                  color: item.answer_yn === "Y" ? Colors.MAIN_COLOR : "#999999",
                }}
              >
                {item.answer_yn === "Y"
                  ? MyPageText.answerComplete
                  : MyPageText.unanswered}
              </Text>
              <View style={styles.divider} />
              <Text
                style={{
                  fontFamily: Fonts.AppleR,
                  fontSize: 11,
                  letterSpacing: -0.28,
                  color: "#999999",
                }}
              >
                {dateUtil.formatKCT("dash", item.inst_dt)}
              </Text>
            </View>
            {item.answer_yn === "Y" ? (
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  // marginRight: 20,
                }}
                onPress={updateMyProductInquiries}
              >
                <Image
                  style={{ width: 20, height: 20 }}
                  source={require("../../../assets/image/store/dropdown_btn_regular.png")}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
      {item.answer_yn === "Y" && item.isOpened && (
        <View style={styles.answerContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.answerBox}>
              <Text
                style={{
                  fontFamily: Fonts.AppleR,
                  fontSize: 12,
                  color: Colors.MAIN_COLOR,
                }}
              >
                {MyPageText.answer}
              </Text>
            </View>
            <Text style={styles.answerUpdatedAt}>{dateUtil.formatKCT("dash", item.updt_dt)}</Text>
          </View>
          <Text style={styles.answerContent}>{item.answer_cont}</Text>
        </View>
      )}
    </View>
  );
};
