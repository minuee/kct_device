import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

import Fonts from "../../model/lib/Utils/Fonts";

const styles = StyleSheet.create({
  container: {
    borderRadius: 17.8,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 13,
    marginRight: 20,
    // width: "25%",
  },
  title: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,

  },
});

export const SearchTab = (props) => {
  const { title, isActive, setCurrentSearchTabIdx } = props;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: isActive ? "#000000" : "transparent" },
      ]}
      onPress={setCurrentSearchTabIdx}
    >
      <Text style={[styles.title, { color: isActive ? "#e1e1e1" : "#191919" }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
