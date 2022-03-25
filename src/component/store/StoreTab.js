import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
} from "react-native";

import Fonts from "../../model/lib/Utils/Fonts";

const styles = StyleSheet.create({
  storeTab: {
    alignItems: "center",
    justifyContent: "center",

    height: 40,
    borderBottomWidth: 3,
  },
  storeTabText: {
    fontSize: 14,
    letterSpacing: -0.7,
  },
});

export const StoreTab = (props) => {
  const { title, isActive, setActive, width } = props;

  return (
    <TouchableOpacity
      style={[
        styles.storeTab,
        {
          width: width,
          borderBottomColor: isActive ? "#000000" : "transparent",
        },
      ]}
      onPress={setActive}
    >
      <Text
        style={[
          styles.storeTabText,
          {
            fontFamily: isActive ? Fonts.AppleB : Fonts.AppleR,
            color: isActive ? "#000000" : "#595959",
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
