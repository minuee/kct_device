// 계좌 설정
import React, { Component } from "react";
import {View, Text, StyleSheet, TouchableOpacity, Image, Keyboard, TouchableWithoutFeedback} from "react-native";
import {connect} from "react-redux";

import {CodeText, MyPageText} from "../../../model/lib/Utils/Strings";
import Fonts from "../../../model/lib/Utils/Fonts";

import { TopHeader } from "../../../component/TopHeader";
import TextInputStr from "../../../common/textinput/TextInput";
import SelectModal from "../../../component/modal/SelectModal";

import * as ActionRefund from "../../../model/action/eREFUND_MN";
import {maskingAccount, maskingEmail, notifyMessage} from "../../../model/lib/Utils";
import MessageModal from "../../../component/modal/MessageModal";
import * as ActionConst from "../../../model/action/eCOMM_CD";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  boxStyle: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    justifyContent: "center",
    marginTop: 20,
  },
  textInputForm: {
    fontFamily: Fonts.AppleR,
    fontSize: 15,
    letterSpacing: -0.38,
    color: "#222222",
  },
  subtitle: {
    fontFamily: Fonts.AppleR,
    fontSize: 11,
    letterSpacing: -0.28,
    color: "#999999",
    marginTop: 7.5,
  },
  submitBtn: {
    height: 60,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  bankAccountBox: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
});

class MySettingAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowSelectModal: false,
      isShowMessageModal: false,
      refund_mn_no: "",
      bank_cmpny_cd: "", // 은행사 코드
      bank_accnt_no: "", // 은행 계좌번호
      bank_accnt_no_str: "", // 은행 계좌번호
      bank_list: [],
      isFocus: false
    };
  }
  componentDidMount() {
    const {eCOMM_CD, eCOMM_CD_TYPE} = this.props;
    if (eCOMM_CD === null || eCOMM_CD_TYPE === null ) {
      this.props.getConst({}).then((res) => {
        this.props.setConst(res.comm_cd);
        this.props.setConstType(res.comm_cd_typ);
      }).catch((err) => {
      });
    }
    this.setBankList();
    this.getDetail();
  }

  setBankList = () => {
    const {eCOMM_CD_TYPE} = this.props;
    if(eCOMM_CD_TYPE)
      this.setState({bank_list: eCOMM_CD_TYPE["BANK_CMPNY_CD"].comm_cd})
  }

  getDetail = () => {
    const {eCOMM_CD_TYPE} = this.props;
    this.props.getDetail({}).then((res) => {
      if(res?.detail)
        this.setState({
          refund_mn_no: res.detail.refund_mn_no,
          bank_cmpny_cd: res.detail.bank_cmpny_cd,
          dpstr_nm: res.detail.dpstr_nm,
          bank_accnt_no: res.detail.bank_accnt_no,
          bank_accnt_no_str: maskingAccount(res.detail.bank_accnt_no),
        })
      else {
        if(eCOMM_CD_TYPE)
          this.setState({
            bank_cmpny_cd: eCOMM_CD_TYPE["BANK_CMPNY_CD"].comm_cd[0].cd_no,
          })
      }
      }).catch((err) => {
      });

  };

  handleCreate = () => {
    const {refund_mn_no, bank_cmpny_cd, bank_accnt_no, dpstr_nm} = this.state;
    let params = {
      bank_cmpny_cd,
      bank_accnt_no,
      dpstr_nm
    }

    if(refund_mn_no) {
      Object.assign(params, {refund_mn_no: refund_mn_no})
      this.props.update(params).then((res) => {
        this.setState({ isShowMessageModal: true }, () => this.getDetail())
      }).catch((err) => {
      });
    } else {
      this.props.create(params).then((res) => {
        this.setState({ isShowMessageModal: true }, () => this.getDetail())
      }).catch((err) => {
      });
    }
  }

  render() {
    const { navigation, eCOMM_CD } = this.props;

    const { isFocus, isShowMessageModal, isShowSelectModal, bank_list, bank_cmpny_cd, dpstr_nm, bank_accnt_no, bank_accnt_no_str } = this.state;
    const isActive = dpstr_nm && bank_accnt_no;
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <TopHeader
                title={MyPageText.accountSetting}
                navigation={navigation}
                onLeftBtn={() => {
                  if (navigation.state.params) {
                    const { getRefundDetail } = navigation.state.params;
                    getRefundDetail();
                  }
                  navigation.goBack();
                }}
            />
            <View style={{ marginHorizontal: 20 }}>
              <View>
                <TextInputStr
                    boxStyle={styles.boxStyle}
                    textForm={styles.textInputForm}
                    placeholder={"예금주명"}
                    placeholderTextColor="#dddddd"
                    value={dpstr_nm}
                    setValue={(str) => this.setState({ dpstr_nm: str })}
                />
                <Text style={styles.subtitle}>* 예금주명이 일치해야 합니다</Text>
              </View>
              <TouchableOpacity
                  style={styles.bankAccountBox}
                  onPress={() => this.setState({ isShowSelectModal: true })}
              >
                <Text
                    style={{
                      fontFamily: Fonts.AppleR,
                      fontSize: 14,
                      letterSpacing: -0.35,
                      color: "#000000",
                    }}
                >
                  {eCOMM_CD[`${bank_cmpny_cd}`]?.cd_nm || bank_list[0]?.cd_nm}
                </Text>
                <Image
                    style={{ width: 20, height: 20 }}
                    source={require("../../../assets/image/mypage/dropdown_btn_regular.png")}
                />
              </TouchableOpacity>
              <View>
                <TextInputStr
                    boxStyle={styles.boxStyle}
                    textForm={styles.textInputForm}
                    placeholder={"계좌번호"}
                    placeholderTextColor="#dddddd"
                    value={isFocus ? bank_accnt_no : bank_accnt_no_str}
                    keyboardType='numeric'
                    setValue={(str) => {
                      this.setState({
                        bank_accnt_no: str.replace(/[^0-9]/g, ''),
                        bank_accnt_no_str: str.replace(/[^0-9]/g, '')
                      })
                    }}
                    onFocus={() => this.setState({isFocus: true})}
                    onBlur={() => this.setState({isFocus: false, bank_accnt_no_str: maskingAccount(bank_accnt_no_str)})}
                />
                <Text style={styles.subtitle}>
                  * 계좌번호를 정확하게 입력해주세요.
                </Text>
              </View>
            </View>

            <TouchableOpacity
                style={[
                  styles.submitBtn,
                  { backgroundColor: isActive ? "#000000" : "#dddddd" },
                ]}
                onPress={() => isActive ? this.handleCreate() : null}
            >
              <Text
                  style={{
                    fontFamily: Fonts.AppleL,
                    fontSize: 20,
                    letterSpacing: -1,
                    color: "#ffffff",
                  }}
              >
                {MyPageText.completion}
              </Text>
            </TouchableOpacity>
            <SelectModal
                isShowSelectModal={isShowSelectModal}
                setBankCode={(bank_cmpny_cd) => {
                  this.setState({ bank_cmpny_cd: bank_cmpny_cd });
                }}
                setVisible={() => {
                  this.setState({ isShowSelectModal: false });
                }}
                index={bank_list.findIndex((bank) => bank.cd_no === bank_cmpny_cd)}
                title="은행 선택"
            />
            <MessageModal
                title={MyPageText.defaultAccountModal}
                subtitle={MyPageText.defaultAccountComplete}
                isShowMessageModal={isShowMessageModal}
                setVisible={() => this.setState({ isShowMessageModal: false })}
            />
          </View>
        </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = (state) => ({
  eSESSION: state.eSESSION.eSESSION,
  eCOMM_CD: state.eCOMM_CD.eCOMM_CD,
  eCOMM_CD_TYPE: state.eCOMM_CD.eCOMM_CD_TYPE,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  getDetail: (params) => dispatch(ActionRefund.getDetail(params)),
  create: (params) => dispatch(ActionRefund.create(params)),
  update: (params) => dispatch(ActionRefund.update(params)),

  getConst: (params) => dispatch(ActionConst.getConst(params)),
  setConst: (params) => dispatch(ActionConst.setConst(params)),
  setConstType: (params) => dispatch(ActionConst.setConstType(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MySettingAccount);
