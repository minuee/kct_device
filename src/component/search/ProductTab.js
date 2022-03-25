import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";

import Fonts from "../../model/lib/Utils/Fonts";

const styles = StyleSheet.create({
  container: {
    paddingVertical: 7.5,
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    letterSpacing: -0.7,
  },
});

export const ProductTab = (props) => {
  const { title, isActive, setCurrentProductTabIdx } = props;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderBottomColor: isActive ? "#000000" : "#dddddd",
          borderBottomWidth: isActive ? 3 : 0,
        },
      ]}
      onPress={setCurrentProductTabIdx}
    >
      {title ? (
        <Text
          style={[
            styles.title,
            {
              fontFamily: isActive ? Fonts.AppleB : Fonts.AppleR,
              color: isActive ? "#000000" : "#595959",
            },
          ]}
        >
          {title}
        </Text>
      ) : (
        <Image
          source={require("../../assets/image/search/b_2_b_mall_btn.png")}
          style={{ width: 55.5, height: 15.5, marginTop: 1 }}
        />
      )}
    </TouchableOpacity>
  );
};
