import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import Modal from "react-native-modal";
import ScrollPicker from "react-native-wheel-scrollview-picker";

import { DEVICE_WIDTH } from "../../model/lib/Utils/Constants";
import Fonts from "../../model/lib/Utils/Fonts";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: -20,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 35,
    height: `50%`,
  },
  modalView: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: -20,
  },
  titleText: {
    fontFamily: Fonts.AppleB,
    fontSize: 20,
    letterSpacing: -0.5,
    color: "#000000",
  },
  activeText: {
    fontFamily: Fonts.AppleB,
    fontSize: 19,
    letterSpacing: -0.48,
    color: "#000000",
  },
  inactiveText: {
    fontFamily: Fonts.AppleR,
    fontSize: 16,
    letterSpacing: -0.4,
    color: "#999999",
  },
  submitBtn: {
    marginHorizontal: 20,
    height: 50,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    position: "absolute",
    bottom: 25,
    width: DEVICE_WIDTH - 40,
  },
  submitBtnText: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    letterSpacing: -1,
    color: "#f5f5f5",
  },
});

class TimePickerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectItem: props.timeList[0],
      selectIndex: 0,
    };
  }

  render() {
    const {
      isShowTimePickerModal,
      setVisible,
      title,
      timeList,
      onPressConfirm,
    } = this.props;
    const { selectIndex, selectItem } = this.state;
    return (
      <Modal
        isVisible={isShowTimePickerModal}
        onBackdropPress={() => setVisible(false)}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalView}>
          <TouchableWithoutFeedback
            style={{ height: `50%` }}
            onPress={() => setVisible(false)}
          >
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          <View style={styles.container}>
            <Text style={styles.titleText}>{title}</Text>
            <View style={{ height: 130, marginTop: 30 }}>
              <ScrollPicker
                dataSource={timeList}
                selectedIndex={selectIndex}
                renderItem={(data, index) => {
                  return (
                    <View
                      style={{
                        paddingTop: 11.2,
                        paddingBottom: 10,
                      }}
                    >
                      <Text
                        style={
                          selectIndex === index
                            ? styles.activeText
                            : styles.inactiveText
                        }
                      >
                        {data.hour}
                      </Text>
                    </View>
                  );
                }}
                onValueChange={(data, selectedIndex) => {
                  this.setState({
                    selectItem: data,
                    selectIndex: selectedIndex,
                  });
                }}
                wrapperHeight={130}
                wrapperWidth={DEVICE_WIDTH}
                wrapperColor="white"
                itemHeight={45}
                highlightColor="#555555"
                highlightBorderWidth={1}
              />
            </View>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => {
                onPressConfirm(selectItem.hour);
              }}
            >
              <Text style={styles.submitBtnText}>선택 완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default TimePickerModal;
