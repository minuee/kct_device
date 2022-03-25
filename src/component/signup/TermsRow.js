import React from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";
import produce from "immer";

import { SignupText } from "../../model/lib/Utils/Strings";
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
  checkIcon: {
    width: 22,
    height: 22,
    marginRight: 3,
  },
  termsRow: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  termsText: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    lineHeight: 32,
    color: "#393939",
  },
  seeMore: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    lineHeight: 32,
    color: "#969696",
  },
});

export const TermsRow = (props) => {
  const { navigation, terms, type, updateTerms } = props;

  return (
    <View style={styles.termsRow}>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() => {
          let updatedTerms = produce(terms, (draft) => {
            draft[type].isSelected = !draft[type].isSelected;
          });
          updateTerms(updatedTerms);
        }}
      >
        <Image
          style={styles.checkIcon}
          source={
            terms[type].isSelected
              ? require("../../assets/image/signup/check_line_on.png")
              : require("../../assets/image/signup/check_line_off.png")
          }
        />
        <Text style={styles.termsText}>{`${
          terms[type].isRequired ? SignupText.required : SignupText.optional
        }${terms[type].title}`}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ alignItems: "center", justifyContent: "center" }}
        onPress={() =>
          navigation.navigate("SignupTermsDetail", {
            title: terms[type].title,
            use_stplat_no: terms[type].use_stplat_no
          })
        }
      >
        <Text style={styles.seeMore}>{SignupText.seeMore}</Text>
      </TouchableOpacity>
    </View>
  );
};
