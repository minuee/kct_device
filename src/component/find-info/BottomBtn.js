import React from "react";
import { TouchableOpacity, Text } from "react-native";
import Fonts from "../../model/lib/Utils/Fonts";

export const BottomBtn = (props) => {
  const { isActive, buttonTitle, onPress } = props;

  return (
    <TouchableOpacity
      style={{
        backgroundColor: isActive ? "#191919" : "#c1c1c1",
        height: 60,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={onPress}
    >
      <Text
        style={{
          fontFamily: Fonts.AppleR,
          fontSize: 20,
          color: "#ffffff",
        }}
      >
        {buttonTitle}
      </Text>
    </TouchableOpacity>
  );
};
