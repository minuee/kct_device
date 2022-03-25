import React, {useState} from "react";
import {StyleSheet, TouchableOpacity, View, Text, BackHandler} from "react-native";

import Colors from "../../model/lib/Utils/Colors";
import Fonts from "../../model/lib/Utils/Fonts";

import {StatusBarHeight} from "../../model/lib/Utils/Constants";
import {Generic, SignupText} from "../../model/lib/Utils/Strings";
import AlertModal from "../modal/AlertModal";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  statusBar: { height: StatusBarHeight },
  naviBar: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
  },
  naviBarBox: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  backBtnBox: {
    // height: 25,
    marginLeft: 20,
    paddingVertical: 4.5,
    alignSelf: 'center',

    borderRadius: 3,
    borderColor: Colors.MAIN_COLOR,
    borderWidth: 1,
  },
  backBtnBoxText: {
    textAlign: 'center',
    color: Colors.MAIN_COLOR,
    fontSize: 13,
    paddingHorizontal: 18.3
  },
  stepBox: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  step: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    lineHeight: 32,
    color: "#393939",
  },
  stepBarBox: { height: 2, backgroundColor: "#f5f5f5" },
});

export const Header = (props) => {
  const { navigation, step, total, isSocial } = props;
  const [isShowAlertModal, setIsShowAlertModal] = useState(false)
  let step_ = parseInt(step);
  if(isSocial) step_ -= 1;
  let total_ = parseInt(total);
  if(isSocial) total_ -= 1;

  return (
    <View style={styles.container}>
      <View style={styles.statusBar} />

      <View style={styles.naviBar}>
        <View style={styles.naviBarBox}>
          <TouchableOpacity
              style={styles.backBtnBox}
              onPress={() => setIsShowAlertModal(true)}
          >
            <Text style={styles.backBtnBoxText}>{SignupText.signupGiveUp}</Text>
          </TouchableOpacity>
          <View style={styles.stepBox}>
            {total !== null ? <Text style={styles.step}>{step_}/{total_}</Text> : null}
          </View>
        </View>
        <View style={styles.stepBarBox}>
          <View
            style={{
              height: 2,
              width: total_ === step_ ? `100%` : total === 5  ? `${step_ * 20}%` : `${step_ * 16.5}%`,
              backgroundColor: Colors.MAIN_COLOR,
            }}
          />
        </View>
      </View>

      {isShowAlertModal && (
        <AlertModal
          isShowAlertModal={isShowAlertModal}
          message={SignupText.signupFirstPageMessage}
          leftText={Generic.no}
          rightText={SignupText.signupFirstPage}
          setVisible={() => setIsShowAlertModal(false)}
          leftOnPress={() => setIsShowAlertModal(false)}
          rightOnPress={() => {
          setIsShowAlertModal(false)
          navigation.navigate("Login")
          }}
        />
      )}
    </View>
  );
};
