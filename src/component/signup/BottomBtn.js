import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

import {Generic, SignupText} from "../../model/lib/Utils/Strings";
import Fonts from "../../model/lib/Utils/Fonts";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    height: 60,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  next: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    color: "#f5f5f5",
  },
});

export const BottomBtn = (props) => {
  const { navigation, isActive, nav, currentUserType, params, handleSubmit } = props;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: isActive ? "#191919" : "#c1c1c1" },
      ]}
      onPress={() => {
        if (isActive) {
          console.log(params)
          if(handleSubmit) handleSubmit()
          else navigation.navigate(nav, { currentUserType: currentUserType, params: params });
        }
      }}
    >
      <Text style={styles.next}>{nav === "SignupResult" ? Generic.finish : SignupText.next}</Text>
    </TouchableOpacity>
  );
};
