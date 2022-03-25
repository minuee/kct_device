// URL 공유 모달
import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
} from "react-native";
import Modal from "react-native-modal";

import Fonts from "../../model/lib/Utils/Fonts";
import { TicketText } from "../../model/lib/Utils/Strings";

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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 29.2,
    marginHorizontal: 32.5,
  },
  title: {
    fontFamily: Fonts.AppleB,
    fontSize: 16,
    letterSpacing: -0.4,
    color: "#2a2e34",
  },
});

class LinkShareModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  renderShareBox = (source, share) => {
    return (
      <TouchableOpacity
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <Image source={source} style={{ width: 45, height: 45 }} />
        <Text
          style={{
            marginTop: 12.2,
            fontFamily: Fonts.AppleR,
            fontSize: 13,
            letterSpacing: -0.33,
            color: "#222222",
          }}
        >
          {share}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      isShowLinkShareModal,
      setVisible,
    } = this.props;

    return (
      <Modal
        isVisible={isShowLinkShareModal}
        onBackdropPress={() => setVisible(false)}
      >
        <View style={styles.alertBox}>
          <TouchableOpacity
            style={{ position: "absolute", top: 15, right: 15, zIndex: 5 }}
            onPress={() => setVisible(false)}
          >
            <Image
              source={require("../../assets/image/ticket/close_page.png")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
          <Text style={styles.title}>{TicketText.share}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 23.5,
            }}
          >
            {this.renderShareBox(
              require("../../assets/image/ticket/kakao_url.png"),
              TicketText.kakao
            )}
            {this.renderShareBox(
              require("../../assets/image/ticket/naverband_url.png"),
              TicketText.band
            )}
            {this.renderShareBox(
              require("../../assets/image/ticket/link_url.png"),
              TicketText.url
            )}
          </View>
        </View>
      </Modal>
    );
  }
}
// kakao_url.png;
// link_url.png;
// naverband_url.png;
export default LinkShareModal;
