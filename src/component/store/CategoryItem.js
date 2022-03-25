import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

import Colors from "../../model/lib/Utils/Colors";
import Fonts from "../../model/lib/Utils/Fonts";

const styles = StyleSheet.create({
  productCategoryBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 2.5,
    height: 27.5,
    marginRight: 7.5,
  },
  productCategoryBtnText: {
    fontSize: 13,
    letterSpacing: -0.65,
  },
});

export const CategoryItem = (props) => {
  const { title, isActive, setSelectedCategoryId } = props;

  return (
    <TouchableOpacity
      style={[
        styles.productCategoryBtn,
        {
          borderColor: isActive ? Colors.MAIN_COLOR : "#dddddd",
        },
      ]}
      onPress={setSelectedCategoryId}
    >
      <Text
        style={[
          styles.productCategoryBtnText,
          {
            fontFamily: isActive ? Fonts.AppleB : Fonts.AppleR,
            color: isActive ? Colors.MAIN_COLOR : "#999999",
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
