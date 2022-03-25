import React, { Component } from "react";
import {StyleSheet, TouchableOpacity, View, Text, Image, TouchableWithoutFeedback} from "react-native";
import Modal from "react-native-modal";

import {
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
} from "../../model/lib/Utils/Constants";
import Fonts from "../../model/lib/Utils/Fonts";
import Colors from "../../model/lib/Utils/Colors";
import { MyPageText } from "../../model/lib/Utils/Strings";

const Languages = [
  { title: "English", id: 1 },
  { title: "Français", id: 2 },
  { title: "日本語", id: 3 },
  { title: "한국어", id: 4 },
  { title: "Filipino", id: 5 },
  { title: "繁體中文, 澳門", id: 6 },
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: -20,
    flex: 1,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 27.5,
    marginBottom: -20,
  },
  selectOptions: {
    fontFamily: Fonts.AppleB,
    fontSize: 20,
    color: "#191919",
    marginBottom: 10,
  },

  nextBtn: {
    position: "absolute",
    bottom: 26.5,
    width: DEVICE_WIDTH - 40,
    alignSelf: "center",
    height: 50,
    borderRadius: 5,
    marginTop: 25.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },
  next: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    color: "#f5f5f5",
  },
  betweenCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  language: {
    color: "#555555",
    fontFamily: Fonts.AppleR,
    fontSize: 15,
    letterSpacing: -0.38,
  },
});

class LanguageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguageId: props.selectedLanguageId,
    };
  }

  render() {
    const { isShowLanguageModal, setVisible } = this.props;
    const { selectedLanguageId } = this.state;

    const viewHeight = Languages.length * 8.75;
    return (
      <Modal
        isVisible={isShowLanguageModal}
        onBackdropPress={() => setVisible(false)}
        onRequestClose={() => setVisible(false)}
      >
        <View style={[styles.container, {marginTop: `${viewHeight}%`}]}>
          <Text style={styles.selectOptions}>{MyPageText.selectLanguage}</Text>
          {Languages.map((language) => {
            return (
              <TouchableOpacity
                style={[styles.betweenCenter, { paddingVertical: 12.5 }]}
                onPress={() => this.setState({ selectedLanguageId: language.id})}
              >
                <Text
                  style={[
                    styles.language,
                    {
                      color:
                        selectedLanguageId === language.id
                          ? Colors.MAIN_COLOR
                          : "#555555",
                      fontWeight:
                        selectedLanguageId === language.id ? "bold" : "normal",
                    },
                  ]}
                >
                  {language.title}
                </Text>
                {selectedLanguageId === language.id && (
                  <Image
                    style={{ width: 18, height: 12, marginTop: -3 }}
                    source={require("../../assets/image/signup/check_pink_48_dp_1_2.png")}
                  />
                )}
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => setVisible(false)}
          >
            <Text style={styles.next}>{MyPageText.selectComplete}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

export default LanguageModal;
