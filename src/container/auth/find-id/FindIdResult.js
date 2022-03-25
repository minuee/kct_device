// 아이디 찾기 결과
import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { BottomBtn } from "../../../component/find-info/BottomBtn";
import { Header } from "../../../component/find-info/Header";

//Utils
import Fonts from "../../../model/lib/Utils/Fonts";
import { LoginText, SignupText } from "../../../model/lib/Utils/Strings";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  textForm: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    color: "#333333",
    marginRight: 17.2,
  },
    findInfo: {
        paddingTop: 30,
        paddingBottom: 20,
        borderBottomColor: "#c1c1c1",
        borderBottomWidth: 0.5,
        marginBottom: 11,
    },
    findInfoText: {
        fontFamily: Fonts.AppleR,
        fontSize: 16,
        color: "#333333",
        lineHeight: 24,
    },
    findInfoId: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 14,
    },
    findPwd: {
        fontFamily: Fonts.AppleR,
        fontSize: 14,
        color: "#969696",
    },
});

class FindIdResult extends Component {
  render() {
    const { navigation } = this.props;
    const {isSuccess} = navigation.state.params;
    return (
      <View style={styles.container}>
        <Header
          onPress={() => navigation.navigate("Login")}
          title={SignupText.findId}
        />
        <View style={{ flex: 1, marginHorizontal: 20 }}>
          <View style={styles.findInfo}>
            <Text style={styles.findInfoText}>
              {isSuccess ? SignupText.idAuthDesc : SignupText.idAuthDescFail}
            </Text>
          </View>
            {isSuccess && (
                <View>
                    <View style={styles.findInfoId}>
                        <Text style={styles.textForm}>{SignupText.id}</Text>
                        <Text style={[styles.textForm, { color: "#191919" }]}>
                            {navigation.state.params.userId}
                        </Text>
                    </View>
                    <View style={styles.findInfoId}>
                        <Text style={styles.textForm}>{SignupText.subscriptionDate}</Text>
                        <Text style={[styles.textForm, { color: "#191919" }]}>
                            {navigation.state.params.subscriptionDate}
                        </Text>
                    </View>
                </View>
            )}
        </View>
        <TouchableOpacity
          style={{ paddingVertical: 14, alignItems: "center" }}
          onPress={() => {
            navigation.navigate("FindPwdMain");
          }}
        >
          <Text style={styles.findPwd}>
            {SignupText.findPwd}
          </Text>
        </TouchableOpacity>
        <BottomBtn
          isActive={true}
          buttonTitle={LoginText.login}
          onPress={() => {
            navigation.navigate("Login");
          }}
        />
      </View>
    );
  }
}

export default FindIdResult;
