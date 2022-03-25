// 아니요/네 선택 모달
// 정말 삭제하시겠습니까 > 아니요/네, 삭제할게요
// 정말 입찰을 포기하시겠어요? > 아니요/네, 포기할게요
// 로그아웃 하시겠습니까?
import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import Modal from "react-native-modal";
import Colors from "../../model/lib/Utils/Colors";

import Fonts from "../../model/lib/Utils/Fonts";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: -20,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    height: 224.8,
  },
  alertBox: {
    borderRadius: 5,
    backgroundColor: "#ffffff",
    paddingTop: 19.2,
    paddingHorizontal: 20,
    paddingBottom: 16,
    marginHorizontal: 32.5,
  },
  message: {
    fontFamily: Fonts.AppleB,
    fontSize: 17,
    letterSpacing: -0.43,
    color: "#2a2e34",
  },
  subtitle: {
    fontFamily: Fonts.AppleR,
    letterSpacing: -0.35,
    color: "#555555",
    marginTop: 15,
  },
  btns: { flexDirection: "row", marginTop: 31.5, justifyContent: "flex-end" },
  leftBtn: { alignItems: "center", justifyContent: "center", marginRight: 20 },
  rightBtn: { alignItems: "center", justifyContent: "center" },
  leftBtnText: {
    fontFamily: Fonts.AppleR,
    fontSize: 15,
    letterSpacing: -0.38,
    color: "#999999",
  },
  rightBtnText: {
    fontFamily: Fonts.AppleR,
    fontSize: 15,
    letterSpacing: -0.38,
    color: Colors.MAIN_COLOR,
  },
});

class AlertModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      isShowAlertModal,
      setVisible,
      message,
      subtitle,
      leftText,
      rightText,
      leftOnPress,
      rightOnPress,
    } = this.props;

    return (
      <Modal
        isVisible={isShowAlertModal}
        onBackdropPress={() => setVisible(false)}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.alertBox}>
          <Text style={styles.message}>{message}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

          <View style={styles.btns}>
            <TouchableOpacity style={styles.leftBtn} onPress={leftOnPress}>
              <Text style={styles.leftBtnText}>{leftText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rightBtn} onPress={rightOnPress}>
              <Text style={styles.rightBtnText}>{rightText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default AlertModal;
