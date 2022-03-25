import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
  Image,
  View,
} from "react-native";

import Colors from "../../model/lib/Utils/Colors";
import Fonts from "../../model/lib/Utils/Fonts";

const styles = StyleSheet.create({
  downArrow: {
    width: 16,
    height: 16,
  },
  optionBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 47,
    borderBottomColor: "#f3f3f3",
    borderBottomWidth: 1,
  },
  optionTitle: {
    fontFamily: Fonts.AppleL,
    fontSize: 15,
    letterSpacing: -0.75,
  },
});

export const TicketSaleOption = (props) => {
  const { title, onPress, isActive } = props;

  return (
    <TouchableOpacity style={styles.optionBox} onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ color: Colors.MAIN_COLOR }}>* </Text>
        <Text
          style={[
            styles.optionTitle,
            { color: isActive ? "#000000" : "#999999" },
          ]}
        >
          {title}
        </Text>
      </View>

      <Image
        style={styles.downArrow}
        source={require("../../assets/image/signup/dropdown_btn_regular.png")}
      />
    </TouchableOpacity>
  );
};
