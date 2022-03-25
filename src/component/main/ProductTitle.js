import React from "react";
import { StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#191919",
    marginBottom: 16,
  },
});

export const ProductTitle = (props) => {
  const { title } = props;

  return <Text style={styles.title}>{title}</Text>;
};
