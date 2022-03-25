import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Colors from "../../model/lib/Utils/Colors";

import Fonts from "../../model/lib/Utils/Fonts";

const styles = StyleSheet.create({
  boxStyle: {
    height: 30,
    borderRadius: 25,
    borderStyle: "solid",
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  title: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.65,
    color: "#333333",
  },
});

export const SearchTagItem = (props) => {
  const { title, isActive, setSelectedTagId } = props;

  return (
    <TouchableOpacity
      style={[styles.boxStyle, {borderColor: isActive ? Colors.MAIN_COLOR : "#595959",},]}
      onPress={setSelectedTagId}
    >
      <Text
        style={styles.title}
      >
        #{title}
      </Text>
    </TouchableOpacity>
  );
};
