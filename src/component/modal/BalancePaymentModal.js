// 예약상품 잔금 결제일입니다. 모달
import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Image, View, Text } from "react-native";
import Modal from "react-native-modal";

import Fonts from "../../model/lib/Utils/Fonts";
import { TicketText } from "../../model/lib/Utils/Strings";

const styles = StyleSheet.create({
  auctionModalBox: {
    backgroundColor: "white",
    alignItems: "center",
    paddingHorizontal: 17.5,
    paddingBottom: 17.2,
    paddingTop: 12.2,
    marginHorizontal: 22.5,
  },
  auctionMessage: {
    marginTop: 9,
    fontFamily: Fonts.AppleB,
    fontSize: 20,
    letterSpacing: -0.5,
    color: "#222222",
  },
  subMessage: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#222222",
    lineHeight: 18,
    textAlign: 'center'
  },
  btn: {
    height: 50,
    borderRadius: 5,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 25,
  },
  btnText: {
    fontFamily: Fonts.AppleB,
    fontSize: 16,
    letterSpacing: -0.4,
    color: "#ffffff",
  },
});

class BalancePaymentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isShowBPModal, setVisible, ticketNum } = this.props;

    return (
      <Modal isVisible={isShowBPModal}>
        <TouchableOpacity
          style={{ alignSelf: "flex-end", marginRight: 32.5, marginBottom: 12 }}
          onPress={() => setVisible(false)}
        >
          <Image
            source={require("../../assets/image/modal/modal_close.png")}
            style={{ width: 16, height: 16 }}
          />
        </TouchableOpacity>

        <View style={styles.auctionModalBox}>
          <Image
            source={require("../../assets/image/modal/graphic_3.png")}
            style={{ width: 196, height: 148 }}
          />
          <Text style={styles.auctionMessage}>{TicketText.bpModalTitle}</Text>
          <Text
            style={[
              styles.subMessage,
              { fontFamily: Fonts.AppleB, marginTop: 10.2 },
            ]}
          >
            {ticketNum}
          </Text>
          <Text style={styles.subMessage}>{TicketText.bpModalDesc}</Text>

          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>
              {TicketText.bpModalBtn}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

export default BalancePaymentModal;
