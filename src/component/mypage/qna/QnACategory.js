import React from "react";
import { StyleSheet, TouchableOpacity, Text, Image } from "react-native";

import Fonts from "../../../model/lib/Utils/Fonts";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8.5,
  },
  radioBtn: { width: 25, height: 25, marginRight: 2.5 },
});

export const QnACategory = (props) => {
  const { title, setCurrentCategoryIdx, isActive } = props;
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={setCurrentCategoryIdx}
    >
      <Image
        source={
          isActive
            ? require("../../../assets/image/mypage/radio_button_on.png")
            : require("../../../assets/image/mypage/radio_button_on_2.png")
        }
        style={styles.radioBtn}
      />
      <Text
        style={{
          fontFamily: Fonts.AppleB,
          letterSpacing: -0.35,
          color: isActive ? "#222222" : "#dddddd",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
