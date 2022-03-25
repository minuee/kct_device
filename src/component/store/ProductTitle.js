import React from "react";
import { StyleSheet, Text } from "react-native";
import Fonts from "../../model/lib/Utils/Fonts";

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.AppleB,
    fontSize: 21,
    lineHeight: 27.5,
    letterSpacing: -1.05,
    color: "#000000",
    marginBottom: 16,
  },
});

export const ProductTitle = (props) => {
  const { title } = props;

  return <Text style={styles.title}>{title}</Text>;
};
