import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";

import {StatusBarHeight} from "../model/lib/Utils/Constants";
import Fonts from "../model/lib/Utils/Fonts";

export const TopHeader = (props) => {
  const {
    navigation,
    title,
    hasRightBtn,
    rightBtnSource,
    rightBtnStyle,
    onPress,
    isCloseIcon,
    isText,
    onLeftBtn,
  } = props;

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
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            position: "absolute",
            left: 20,
            justifyContent: "center",
            zIndex: 5,
          }}
          onPress={() => {
              if(onLeftBtn) onLeftBtn()
              else navigation.pop()
          }}
        >
          <Image
            source={
              isCloseIcon
                ? require("../assets/image/common/close_page.png")
                : require("../assets/image/common/arrow_back.png")
            }
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Text
            style={{
              fontFamily: Fonts.AppleR,
              fontSize: 18,
              color: "#191919",
            }}
          >
            {title}
          </Text>
        </View>
        {hasRightBtn ? (
          isText ? (
            <TouchableOpacity style={{ position: "absolute", right: 20 }} onPress={onPress}>
              <Text style={rightBtnStyle}>{rightBtnSource}</Text>
            </TouchableOpacity>
          ) : (
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
              <Image style={rightBtnStyle} source={rightBtnSource} />
            </TouchableOpacity>
          )
        ) : (
          <View />
        )}
      </View>
    </View>
  );
};
