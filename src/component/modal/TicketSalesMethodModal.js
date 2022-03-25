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
import {CodeText, TicketText} from "../../model/lib/Utils/Strings";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: -20,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    height: "42%",
    paddingHorizontal: 20,
    paddingTop: 35,
  },
  title: {
    fontFamily: Fonts.AppleB,
    fontSize: 20,
    letterSpacing: -0.5,
    color: "#000000",
    marginBottom: 10,
  },
  activeOption: {
    fontFamily: Fonts.AppleB,
    fontSize: 15,
    letterSpacing: -0.38,
    color: Colors.MAIN_COLOR,
  },
  inactiveOption: {
    fontFamily: Fonts.AppleR,
    fontSize: 15,
    letterSpacing: -0.38,
    color: "#555555",
  },
  btn: {
    height: 50,
    borderRadius: 6,
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontFamily: Fonts.AppleL,
    fontSize: 20,
    letterSpacing: -1,
    color: "#ffffff",
  },
});

class TicketSaleMethodModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMethod: null,
    };
  }

  render() {
    const { isShowSaleMethodModal, navigation, setVisible, setSaleMethod } =
      this.props;
    const { selectedMethod } = this.state;

    return (
      <Modal
        isVisible={isShowSaleMethodModal}
        onBackdropPress={() => setVisible(false)}
        onRequestClose={() => setVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: -20 }}>
          <TouchableWithoutFeedback style={{ height: "58%" }} onPress={() => setVisible(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          <View style={styles.container}>
            <Text style={styles.title}>{TicketText.selectSalesMethod}</Text>
            <TouchableOpacity
              style={{
                height: 40,
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
              onPress={() => {
                this.setState({ selectedMethod: CodeText.exchng_vol_trd_typ_cd_i });
              }}
            >
              <Text
                style={
                  selectedMethod === CodeText.exchng_vol_trd_typ_cd_i
                    ? styles.activeOption
                    : styles.inactiveOption
                }
              >
                {TicketText.buyNow}
              </Text>
              {selectedMethod === CodeText.exchng_vol_trd_typ_cd_i && (
                <Image
                  source={require("../../assets/image/ticket/selected.png")}
                  style={{ width: 16, height: 16 }}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 40,
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
              onPress={() => {
                this.setState({ selectedMethod: CodeText.exchng_vol_trd_typ_cd_a });
              }}
            >
              <Text
                style={
                  selectedMethod === CodeText.exchng_vol_trd_typ_cd_a
                    ? styles.activeOption
                    : styles.inactiveOption
                }
              >
                {TicketText.auctionDeal}
              </Text>
              {selectedMethod === CodeText.exchng_vol_trd_typ_cd_a && (
                <Image
                  source={require("../../assets/image/ticket/selected.png")}
                  style={{ width: 16, height: 16 }}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                { backgroundColor: selectedMethod ? "#000000" : "#dddddd" },
              ]}
              onPress={() => {
                setSaleMethod(selectedMethod);
                setVisible(false);
              }}
            >
              <Text style={styles.btnText}>{TicketText.selectComplete}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default TicketSaleMethodModal;
