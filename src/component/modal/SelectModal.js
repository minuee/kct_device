import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { connect } from "react-redux";
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
  bankText: {
    fontFamily: Fonts.AppleB,
    fontSize: 19,
    letterSpacing: -0.48,
    textAlign: "center",
    color: "#000000",
  },
  inactiveBankText: {
    fontFamily: Fonts.AppleR,
    fontSize: 16,
    letterSpacing: -0.4,
    textAlign: "center",
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

class SelectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bank_cmpny_cd: "",
      bank_list: [],
      selectItem: {},
      selectIndex: 0,
    };
  }

  componentDidMount() {
    const { index } = this.props;
    this.setState({ selectIndex: index });
    this.setBankList();
  }

  setBankList = () => {
    const { eCOMM_CD_TYPE } = this.props;
    this.setState({ bank_list: eCOMM_CD_TYPE["BANK_CMPNY_CD"].comm_cd });
  };

  render() {
    const { isShowSelectModal, setVisible, setBankCode, title } = this.props;
    const { bank_list, selectIndex, selectItem } = this.state;
    return (
      <Modal
        isVisible={isShowSelectModal}
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
                dataSource={bank_list}
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
                            ? styles.bankText
                            : styles.inactiveBankText
                        }
                      >
                        {data.cd_nm}
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
                // wrapperBackground='#fff'
                itemHeight={45}
                highlightColor="#555555"
                highlightBorderWidth={2}
              />
            </View>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => {
                setBankCode(selectItem.cd_no);
                setVisible();
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

const mapStateToProps = (state) => ({
  eSESSION: state.eSESSION.eSESSION,
  eCOMM_CD_TYPE: state.eCOMM_CD.eCOMM_CD_TYPE,
});

export default connect(mapStateToProps, undefined)(SelectModal);
