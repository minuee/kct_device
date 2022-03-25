// 아이디 찾기 결과
import React, { Component } from "react";
import { View, Text, Image } from "react-native";

import { BottomBtn } from "../../../component/find-info/BottomBtn";

//Utils
import {HAS_NOTCH} from "../../../model/lib/Utils/Constants";
import Fonts from "../../../model/lib/Utils/Fonts";
import { Generic, SignupText } from "../../../model/lib/Utils/Strings";

class FindPwdResult extends Component {
  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View
          style={{
            paddingTop: HAS_NOTCH ? 204 : 180,
            alignItems: "center",
            flex: 1,
          }}
        >
          <Image
            style={{ width: 60, height: 60 }}
            source={require("../../../assets/image/signup/success_graphic.png")}
          />
          <Text
            style={{
              fontFamily: Fonts.AppleR,
              fontSize: 20,
              color: "#191919",
              marginTop: 50,
            }}
          >
            {SignupText.tempPwd}
          </Text>
          <Text
            style={{
              marginTop: 8,
              fontFamily: Fonts.AppleL,
              color: "#969696",
            }}
          >
            {SignupText.tempPwdDesc}
          </Text>
        </View>
        <BottomBtn
          isActive={true}
          buttonTitle={Generic.finish}
          onPress={() => {
            navigation.navigate("Login");
          }}
        />
      </View>
    );
  }
}

export default FindPwdResult;
