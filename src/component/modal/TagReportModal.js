// tag > 신고하기 모달창
import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import Modal from "react-native-modal";
import {connect} from "react-redux";

import Colors from "../../model/lib/Utils/Colors";
import Fonts from "../../model/lib/Utils/Fonts";
import { Generic, TagText } from "../../model/lib/Utils/Strings";
import {notifyMessage, STTEMNT_SE_CD} from "../../model/lib/Utils";

import TextInputStr from "../../common/textinput/TextInput";

import * as ActionNtt from "../../model/action/eNTT";

const styles = StyleSheet.create({
  reportBtn: {
    width: "100%",
    height: 51,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  report: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    letterSpacing: -1,
    color: Colors.MAIN_COLOR,
  },
  cancel: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    letterSpacing: -1,
    color: "#333333",
  },
  boxStyle: {
    width: "100%",
    height: 120,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#d5d5d5",
    paddingHorizontal: 12,
    paddingTop: 12,
    marginBottom: 20,
    padding: 0,
  },
  textForm: {
    fontFamily: Fonts.AppleR,
    color: "#191919",
    padding: 0,
  },
  reportContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
  reportTitle: {
    fontFamily: Fonts.AppleSB,
    fontSize: 18,
    color: "#000000",
  },
  reportBox: {
    paddingTop: 25,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  flexWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 22,
    justifyContent: "space-between",
  },
  optionBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "47%",
    marginBottom: 14,
  },
  optionTitle: {
    fontFamily: Fonts.AppleR,
    color: "#191919",
  },
  btns: {
    borderTopColor: "#d5d5d5",
    borderTopWidth: 0.2,
    flexDirection: "row",
  },
  btn: {
    width: "50%",
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  reportBtnText: {
    fontFamily: Fonts.AppleR,
    fontSize: 16,
    letterSpacing: -0.4,
    color: Colors.MAIN_COLOR,
  },
  cancelBtnText: {
    fontFamily: Fonts.AppleR,
    fontSize: 16,
    letterSpacing: -0.4,
    color: "#595959",
  },
  reportCompleteMessage: {
    marginTop: 13.5,
    marginBottom: 34.2,
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    color: "#747474",
  },
});

class TagReportModal extends Component {
  constructor(props) {
    super(props);
    const {eCOMM_CD_TYPE} = this.props;
    this.state = {
      isFocus: false,
      reportStep: 0,
      etc: "",
      currentOption: {},
      // sttemnt_se_cds: eCOMM_CD_TYPE.STTEMNT_SE_CD.comm_cd
      sttemnt_se_cds: STTEMNT_SE_CD
    };
  }


  createReport = () => {
    const {reportItem} = this.props;
    const {currentOption, etc} = this.state;

    let params = {
      ntt_no: reportItem.ntt_no,
      sttemnt_se_cd: currentOption.cd_no,
      sttemnt_cont: etc
    }

    this.props.createReport(params).then(async (res) => {
      this.setState({ reportStep: 2 })
    }).catch((err) => {
    });
  }

  renderReportItems = () => {
    const { setVisible} = this.props;
    const { etc, currentOption, sttemnt_se_cds } = this.state;
    return (
        <View style={styles.reportContainer}>
          <View style={styles.reportBox}>
            <Text style={styles.reportTitle}>{TagText.reportIt}</Text>
            {/*<TouchableOpacity onPress={() => Keyboard.dismiss()} style={{borderColor: 'red', borderWidth:2, height: 5}}/>*/}
            <View style={styles.flexWrap}>
              {sttemnt_se_cds.map((item, index) => {
                return (
                    <TouchableOpacity
                        key={`sttemnt_${index}`}
                        style={styles.optionBox}
                        onPress={() =>
                            this.setState({ currentOption: item })
                        }
                    >
                      <Image
                          style={{ width: 20, height: 20, marginRight: 6 }}
                          source={
                            currentOption.cd_no === item.cd_no
                                ? require("../../assets/image/tag/radio_btn_on.png")
                                : require("../../assets/image/tag/radio_btn_off.png")
                          }
                      />
                      <Text style={styles.optionTitle}>{item.cd_nm}</Text>
                    </TouchableOpacity>
                );
              })}
            </View>
            <TextInputStr
                boxStyle={styles.boxStyle}
                textForm={styles.textForm}
                placeholder={TagText.reportPlaceholder}
                placeholderTextColor="#d5d5d5"
                value={etc}
                multiline={true}
                setValue={(str) => {
                  if(str.length > 500)
                    notifyMessage(TagText.reportErrorMessage)
                  else this.setState({ etc: str });
                }}
                onFocus={() => this.setState({isFocus: true})}
            />
          </View>
          <View style={styles.btns}>
            <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  this.setState({ reportStep: 0 });
                  setVisible(false);
                }}
            >
              <Text style={styles.cancelBtnText}>{Generic.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.btn}
                onPress={() => currentOption.cd_no ? this.createReport() : notifyMessage(TagText.reportMessage)}
            >
              <Text style={styles.reportBtnText}>{TagText.report}</Text>
            </TouchableOpacity>
          </View>
        </View>
    )
  }

  render() {
    const { isShowTagReportModal, setVisible, eSESSION, setAlertModal, reportItem } = this.props;
    const { reportStep, etc, currentOption, sttemnt_se_cds, isFocus } = this.state;
    return (
      <Modal
        isVisible={isShowTagReportModal}
        onBackdropPress={() => setVisible(false)}
        onRequestClose={() => setVisible(false)}
      >
        {reportStep === 0 ? (
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <TouchableOpacity
              style={styles.reportBtn}
              onPress={() => {
                if(eSESSION.mber_no) // && reportItem.mber_no !== eSESSION.mber_no
                  this.setState({ reportStep: 1 })
                else {
                  setVisible()
                  setAlertModal ? setAlertModal() : null
                }
              }}
            >
              <Text style={styles.report}>{TagText.report}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.reportBtn,
                {
                  marginTop: 6,
                },
              ]}
              onPress={setVisible}
            >
              <Text style={styles.cancel}>{Generic.cancel}</Text>
            </TouchableOpacity>
          </View>
        ) : reportStep === 1 ? (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {this.renderReportItems()}
          </TouchableWithoutFeedback>
        ) : (
          <View style={[styles.reportContainer, { marginHorizontal: 30 }]}>
            <View style={styles.reportBox}>
              <Text style={styles.reportTitle}>{TagText.reportComplete}</Text>
              <Text style={styles.reportCompleteMessage}>
                {TagText.reportCompleteMessage}
              </Text>
            </View>
          </View>
        )}
        {isFocus && Platform.OS === "ios" && (<View style={{height: 150}} />)}
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  eSESSION: state.eSESSION.eSESSION,
  eCOMM_CD_TYPE: state.eCOMM_CD.eCOMM_CD_TYPE,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  createReport: (params) => dispatch(ActionNtt.createReport(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TagReportModal);
