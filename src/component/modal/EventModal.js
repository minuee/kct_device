// 이벤트 : 포인트 획득 모달
import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";
import Modal from "react-native-modal";

import Fonts from "../../model/lib/Utils/Fonts";
import { Generic } from "../../model/lib/Utils/Strings";

const styles = StyleSheet.create({
  alertBox: {
    borderRadius: 10,
    backgroundColor: "#ffffff",
    paddingTop: 19.2,
    marginHorizontal: 32.5,
    alignItems: "center",
  },
  completeAlertBox: {
    borderRadius: 10,
    backgroundColor: "#ffffff",
    paddingTop: 30,
    paddingBottom: 28,
    marginHorizontal: 32.5,
    alignItems: "center",
  },
  title: {
    fontFamily: Fonts.AppleB,
    fontSize: 21,
    letterSpacing: -0.53,
    textAlign: "center",
    color: "#2a2e34",
  },
  subtitle: {
    marginTop: 5,
    fontFamily: Fonts.AppleR,
    lineHeight: 20,
    letterSpacing: -0.35,
    textAlign: "center",
    color: "#555555",
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

class EventModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isShowEventModal, setVisible, isParticipated, getPoint } = this.props;

    return (
      <Modal isVisible={isShowEventModal} onBackdropPress={setVisible}>
        <View
          style={!isParticipated ? styles.alertBox : styles.completeAlertBox}
        >
          {!isParticipated && (
            <Image
              source={require("../../assets/image/event/coin_graphic.png")}
              style={{ width: 90, height: 90 }}
            />
          )}
          <Text style={styles.title}>
            {isParticipated ? "참여된 이벤트" : `${getPoint}포인트 획득`}
          </Text>
          <Text style={styles.subtitle}>
            {isParticipated
              ? "해당 이벤트에 이미 참여하셨습니다.\n이벤트는 최대 1회에 한해 참여 가능합니다."
              : `축하합니다. ${getPoint}Point를 획득하여\n포인트가 적립되었습니다.`}
          </Text>
          {!isParticipated && (
            <TouchableOpacity style={styles.confirmBox} onPress={setVisible}>
              <Text style={styles.confirmText}>{Generic.confirm}</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    );
  }
}

export default EventModal;
