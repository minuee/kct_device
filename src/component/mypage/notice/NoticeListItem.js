import React from "react";
import { StyleSheet, TouchableOpacity, Text, Image, View } from "react-native";

import Fonts from "../../../model/lib/Utils/Fonts";

import * as dateUtil from "../../../model/lib/Utils/Date";

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  labelBox: {
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#333333",
    paddingVertical: 4.2,
    paddingHorizontal: 15.2,
    marginRight: 8,
  },
  label: {
    fontFamily: Fonts.AppleM,
    fontSize: 12,
    letterSpacing: -0.6,
    color: "#333333",
  },
  updatedAt: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    color: "#969696",
  },
  title: {
    marginTop: 10,
    fontFamily: Fonts.AppleR,
    letterSpacing: -0.7,
    color: "#333333",
  },
  rightIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export const NoticeListItem = (props) => {
  const { item, navigation } = props;
  return (
    <View style={styles.container}>
      <View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.labelBox}>
            <Text style={styles.label}>공지</Text>
          </View>
          <Text style={styles.updatedAt}>{dateUtil.formatKCT("dash", item.updt_dt)}</Text>
        </View>
        <Text style={styles.title}>{item.notice_matter_nm}</Text>
      </View>
      <TouchableOpacity style={styles.rightIcon} onPress={() => navigation.navigate("NoticeDetail", {notice_matter_no: item.notice_matter_no})}>
        <Image
          style={{ width: 20, height: 20 }}
          source={require("../../../assets/image/store/more_chevron_small.png")}
        />
      </TouchableOpacity>
    </View>
  );
};
