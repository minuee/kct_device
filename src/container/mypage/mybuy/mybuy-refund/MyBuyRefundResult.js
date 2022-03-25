// 환불요청 완료
import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { DEVICE_WIDTH } from "../../../../model/lib/Utils/Constants";
import { MyPageText } from "../../../../model/lib/Utils/Strings";
import Fonts from "../../../../model/lib/Utils/Fonts";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  betweenCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentResultBox: {
    flex: 1,
    alignItems: "center",
    paddingTop: 210.5,
  },
  success: { width: 60, height: 60 },
  completeWithdraw: {
    fontFamily: Fonts.AppleL,
    fontSize: 20,
    letterSpacing: -1,
    textAlign: "center",
    marginTop: 40,
  },
  resultMessage: {
    fontFamily: Fonts.AppleL,
    letterSpacing: -0.7,
    color: "#969696",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 19.5,
  },
  goToHome: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    letterSpacing: -0.5,
    color: "#ffffff",
  },
  submitBtn: {
    borderRadius: 5,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH - 40,
    height: 50,
    position: "absolute",
    bottom: 25,
    marginHorizontal: 20,
  },
});

class MyBuyRefundResult extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Image
          source={require("../../../../assets/image/ticket/success_graphic.png")}
          style={styles.success}
        />
        <Text style={styles.completeWithdraw}>
          {MyPageText.returnRequestSuccess}
        </Text>
        <Text style={styles.resultMessage}>
          {MyPageText.returnRequestMessage}
        </Text>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => navigation.navigate("MyBuy")}
        >
          <Text style={styles.goToHome}>{MyPageText.goToMyBuy}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default MyBuyRefundResult;
