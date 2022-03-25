import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import Fonts from "../../model/lib/Utils/Fonts";

import {StatusBarHeight} from "../../model/lib/Utils/Constants";


export const Header = (props) => {
  const { title, onPress } = props;

  return (
    <View style={{ backgroundColor: "white" }}>
      <View style={{ height: StatusBarHeight }} />

      <View
        style={{
          width: "100%",
          height: 50,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Text
            style={{
              fontFamily: Fonts.AppleM,
              fontSize: 18,
              color: "#000000",
            }}
          >
            {title}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            marginTop: -3,
            position: "absolute",
            right: 0,
            zIndex: 5,
          }}
          onPress={onPress}
        >
          <Image
            style={{ width: 24, height: 24 }}
            source={require("../../assets/image/signup/close_page.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
