// 회원가입 결과 화면
import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

import { SignupText } from "../../../model/lib/Utils/Strings";
import Fonts from "../../../model/lib/Utils/Fonts";

class SignupResult extends Component {
  render() {
    const { navigation } = this.props;
    const { currentUserType } = navigation.state.params;
    return (
      <View style={styles.container}>
        <View style={styles.resultBox}>
          <Image
            style={styles.completeIcon}
            source={require("../../../assets/image/signup/success_graphic.png")}
          />
          <Text style={styles.complete}>
            {currentUserType === 0
              ? SignupText.complete
              : SignupText.BASignupComplete}
          </Text>
          {currentUserType === 0 ? (
            <Text style={styles.completeMessage}>
              {SignupText.completeMessage}
            </Text>
          ) : (
            <Text style={styles.BACompleteMessage}>
              {SignupText.BASignupCompleteMessage}
            </Text>
          )}
        </View>
        <TouchableOpacity style={styles.goHomeBtn} onPress={() => navigation.navigate('Main')}>
          <Text style={styles.goHome}>{SignupText.goHome}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  resultBox: { flex: 1, alignItems: "center", justifyContent: "center" },
  completeIcon: {
    width: 60,
    height: 60,
    marginTop: 30,
  },
  complete: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    lineHeight: 30,
    color: "#191919",
    marginTop: 50,
  },
  completeMessage: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    lineHeight: 30,
    color: "#969696",
    marginTop: 12,
  },
  BACompleteMessage: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    color: "#969696",
    marginTop: 12,
  },
  goHomeBtn: {
    height: 50,
    marginHorizontal: 20,
    backgroundColor: "#191919",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  goHome: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    lineHeight: 31,
    color: "#f5f5f5",
  },
});

export default SignupResult;
