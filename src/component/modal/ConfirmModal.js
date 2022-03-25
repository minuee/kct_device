// title/subtitle/확인 버튼 모달창
// 알림/구매이력 1회가 필요합니다.
// 신고완료/신고가 접수되었습니다
import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import Modal from "react-native-modal";

import Fonts from "../../model/lib/Utils/Fonts";
import { Generic } from "../../model/lib/Utils/Strings";
import {RenderHTML} from "react-native-render-html";

const styles = StyleSheet.create({
  alertBox: {
    borderRadius: 10,
    backgroundColor: "#ffffff",
    paddingTop: 19.2,
    marginHorizontal: 32.5,
    alignItems: "center",
  },
  title: {
    fontFamily: Fonts.AppleB,
    fontSize: 18,
    color: "#393939",
  },
  subtitle: {
    marginTop: 12,
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    color: "#747474",
    textAlign: 'center'
  },
  confirmBox: {
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#f2f2f2",
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  confirmText: {
    fontFamily: Fonts.AppleR,
    fontSize: 16,
    color: "#333333",
  },
});

class ConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isShowConfirmModal, setVisible, title, subtitle } = this.props;

    return (
      <Modal isVisible={isShowConfirmModal}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <TouchableOpacity style={styles.confirmBox} onPress={setVisible}>
            <Text style={styles.confirmText}>{Generic.confirm}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

export default ConfirmModal;
