import React from "react";
import { TouchableOpacity, Text, Image } from "react-native";

import Fonts from "../model/lib/Utils/Fonts";

export const RadioButton = (props) => {
  const { label, isActive, setActive, style, btnStyle } = props;
  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          marginTop: 13,
        },
        style,
      ]}
      onPress={setActive}
    >
      <Image
        style={[{ width: 25, height: 25, marginRight: 8.8 }, btnStyle]}
        source={
          isActive
            ? require("../assets/image/tag/radio_btn_on.png")
            : require("../assets/image/tag/radio_btn_off.png")
        }
      />
      <Text
        style={{
          fontFamily: isActive ? Fonts.AppleB : Fonts.AppleR,
          letterSpacing: -0.35,
          color: isActive ? "#222222" : "#dddddd",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
