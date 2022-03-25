// 배송지 설정 완료
// 일반회원 전용상품
import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import Modal from "react-native-modal";

import Fonts from "../../model/lib/Utils/Fonts";
import { Generic } from "../../model/lib/Utils/Strings";

const styles = StyleSheet.create({
  alertBox: {
    borderRadius: 5,
    backgroundColor: "#ffffff",
    paddingTop: 34,
    paddingHorizontal: 20,
    paddingBottom: 28,
    marginHorizontal: 32.5,
    alignItems: "center",
  },
  hasBtnAlertBox: {
    borderRadius: 5,
    backgroundColor: "#ffffff",
    paddingTop: 25,
    marginHorizontal: 30,
    alignItems: "center",
  },
  title: {
    marginBottom: 10,
    fontFamily: Fonts.AppleSB,
    fontSize: 18,
    color: "#393939",
  },
  subtitle: {
    // marginTop: 10,
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    color: "#747474",
    textAlign: "center",
  },
});

class MessageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isShowMessageModal, setVisible, title, subtitle, hasBtn } = this.props;

    return (
      <Modal
        isVisible={isShowMessageModal}
        onBackdropPress={() => setVisible(false)}
        onRequestClose={() => setVisible(false)}
      >
        <View style={hasBtn ? styles.hasBtnAlertBox : styles.alertBox}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {/*<Text style={styles.title}>{title}</Text>*/}
          <Text style={styles.subtitle}>{subtitle}</Text>
          {hasBtn && (
            <TouchableOpacity
              style={{
                height: 43.5,
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: "#f2f2f2",
                borderTopWidth: 0.5,
                marginTop: 25,
                width: '100%'
              }}
              onPress={setVisible}
            >
              <Text
                style={{
                  fontFamily: Fonts.AppleR,
                  fontSize: 16,
                  color: "#333333",
                }}
              >
                {Generic.confirm}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    );
  }
}

export default MessageModal;
