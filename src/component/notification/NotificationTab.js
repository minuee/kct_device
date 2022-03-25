import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

import Fonts from "../../model/lib/Utils/Fonts";

const styles = StyleSheet.create({
  container: {
    paddingVertical: 7.5,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  title: {
    fontSize: 15,
    letterSpacing: -0.75,
  },
});

export const NotificationTab = (props) => {
  const { title, isActive, setCurrentNotificationTabIdx, isLast } = props;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderBottomColor: isActive ? "#191919" : "#dddddd",
          borderBottomWidth: isActive ? 3 : 0.5,
          marginRight: isLast ? 45: 0
        },
      ]}
      onPress={setCurrentNotificationTabIdx}
    >
      <Text
        style={[
          styles.title,
          {
            fontFamily: isActive ? Fonts.AppleB : Fonts.AppleR,
            color: "#000000",
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
