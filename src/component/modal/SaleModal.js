import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import Modal from "react-native-modal";
import Colors from "../../model/lib/Utils/Colors";

import Fonts from "../../model/lib/Utils/Fonts";
import { TicketText } from "../../model/lib/Utils/Strings";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: -20,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: Fonts.AppleB,
    fontSize: 20,
    letterSpacing: -0.5,
    color: Colors.MAIN_COLOR,
  },
  message: {
    fontFamily: Fonts.AppleB,
    fontSize: 16,
    letterSpacing: -0.8,
    color: "#000000",
    marginTop: 2,
  },
  infoIcon: {
    width: 18,
    height: 18,
    marginRight: 7.5,
  },
  subMessage: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#000000",

    lineHeight: 19.5,
  },
  warningMessage: {
    fontFamily: Fonts.AppleR,
    fontSize: 11,
    letterSpacing: -0.28,
    color: "#999999",
    lineHeight: 19,
  },
  btn: {
    marginBottom: 20,
    height: 50,
    borderRadius: 6,
    backgroundColor: Colors.MAIN_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontFamily: Fonts.AppleB,
    fontSize: 17,
    letterSpacing: -0.43,
    color: "#ffffff",
  },
});

class SaleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      isShowSaleModal,
      navigation,
      setVisible,
      handleSubmit,
      isTicket,
      title,
      message,
      subMessage,
      warningMessage,
      warningSubMessage,
      warningThirdMessage,
    } = this.props;

    return (
      <Modal
        isVisible={isShowSaleModal}
        onBackdropPress={() => setVisible(false)}
        onRequestClose={() => setVisible(false)}
      >
        <View
          style={{ flex: 1, justifyContent: "flex-end", marginBottom: -20 }}
        >
          <TouchableWithoutFeedback
            // style={{ height: "40%" }}
            onPress={() => setVisible(false)}
          >
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          <View
            style={[
              styles.container,
              {
                // height: isTicket || warningThirdMessage? "65%" :"58%",
                paddingTop: isTicket ? 35 : 32.5,
              },
            ]}
          >
            <Text style={styles.title}>{title}</Text>
            <View style={{ marginTop: 34 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={styles.infoIcon}
                  source={require("../../assets/image/ticket/info_icon_black.png")}
                />
                <Text style={styles.message}>{message}</Text>
              </View>
              <Text style={[styles.subMessage, {marginTop: isTicket ? 7.5 : 15}]}>
                {subMessage}
              </Text>
              <Text style={[styles.warningMessage, { marginTop: isTicket ? 7.5 : 12 },]}>
                {warningMessage}
              </Text>
              {warningSubMessage ? (
                <Text style={[styles.warningMessage, { marginTop: 3 }]}>
                  {warningSubMessage}
                </Text>
              ) : null}
              {warningThirdMessage ? (
                <Text style={[styles.warningMessage, { marginTop: 7 }]}>
                  {warningThirdMessage}
                </Text>
              ) : null}
            </View>
            {isTicket && (
              <View style={{ marginTop: 30 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    style={styles.infoIcon}
                    source={require("../../assets/image/ticket/info_icon_black.png")}
                  />
                  <Text style={styles.message}>
                    {TicketText.ticketSaleModalMessage_2}
                  </Text>
                </View>
                <Text style={styles.subMessage}>
                  {TicketText.ticketSaleModalSubMessage_2}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.btn, { marginTop: isTicket ? 41.5 : 37.5 }]}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.btnText}>
                {TicketText.ticketSaleModalBtn}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default SaleModal;
