// 배송지 입력
import React, { Component } from "react";
import {View, Text, StyleSheet, TouchableOpacity, Image, BackHandler} from "react-native";
import Postcode from "@actbase/react-daum-postcode";
import { connect } from "react-redux";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

import {MyPageText} from "../../../model/lib/Utils/Strings";
import Fonts from "../../../model/lib/Utils/Fonts";
import {DEVICE_WIDTH, HAS_NOTCH, StatusBarHeight} from "../../../model/lib/Utils/Constants";

import { TopHeader } from "../../../component/TopHeader";
import TextInputStr from "../../../common/textinput/TextInput";

import * as ActionAccount from "../../../model/action/eACCOUNT_DELIVERY";
import * as ActionMber from "../../../model/action/eMBER";
import {notifyMessage} from "../../../model/lib/Utils";
import * as ActionSession from "../../../model/action/eSESSION";


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
    marginBottom: 15,
  },
  textInputForm: {
    fontFamily: Fonts.AppleR,
    fontSize: 15,
    letterSpacing: -0.38,
    color: "#222222",
  },
  zipCodeBtn: {
    width: "31%",
    height: 35,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dddddd",
    alignItems: "center",
    justifyContent: "center",
  },
  zipCode: {
    fontFamily: Fonts.AppleB,
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20.5,
    letterSpacing: -0.35,
    textAlign: "center",
    color: "#222222",
  },
  submitBtn: {
    marginHorizontal: 20,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    position: "absolute",
    bottom: 22.5,
    width: DEVICE_WIDTH - 40,
  },
  submitText: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    letterSpacing: -0.5,
    color: "#ffffff",
  },
});

class CreateAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addr_no: "",
      isShowModal: false,
      name: "",
      zipCode: "",
      address: "",
      detailedAddress: "",
      phone: "",
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    if (navigation.state.params) {
      const { addr_no } = navigation.state.params;
      if (addr_no) {
        this.setState({ addr_no: addr_no });
        this.getDeliveryDetail(addr_no);
      }
    }
    this._backListener = BackHandler.addEventListener(
        "hardwareBackPress",
        () => this.handleBackPress()
    );
  }

  componentWillUnmount() {
    this._backListener.remove();
  }

  handleBackPress = () => {
    const {navigation} = this.props;
    const {isShowModal} = this.state;
    if(isShowModal) {
      this.setState({isShowModal: false});
      return true;
    } else return false;
    // else navigation.goBack();
  }

  getDeliveryDetail = (addr_no) => {
    let params = {
      addr_no: addr_no,
    };

    this.props
      .getDeliveryDetail(params)
      .then((res) => {
        const data = res.detail;
        this.setState({
          addr_no: addr_no,
          name: data.receiver_name,
          zipCode: data.우편번호,
          address: data.주소,
          detailedAddress: data.상세주소,
          phone: data.휴대폰번호,
        });
      })
      .catch((err) => {});
  };

  handleCreate = () => {
    const { eSESSION, navigation } = this.props;
    const { addr_no, name, zipCode, address, detailedAddress, phone } =
      this.state;

    let params = {
      mber_no: eSESSION.mber_no,
      receiver_name: name,
      receiver_phonenumber: phone,
      address: address,
      address_detail: detailedAddress,
      post_no: zipCode,
    };
    console.log(params);
    if(!eSESSION.moblphon_no)
      this.handleUpdate();

    if (addr_no) {
      Object.assign(params, { addr_no: addr_no });
      this.props
        .updateDelivery(params)
        .then((res) => {
          navigation.pop();
        })
        .catch((err) => {});
    } else {
      this.props
        .createDelivery(params)
        .then((res) => {
          navigation.pop();
        })
        .catch((err) => {});
    }
  };

  handleUpdate = () => {
    const { eSESSION } = this.props;
    const { phone } = this.state;

    let params = {
      mber_no: eSESSION.mber_no,
      moblphon_no: phone,
    };
    console.log(params);

    this.props
      .update(params)
      .then((res) => {
        this.props.getSession({}).then((res) => {
          this.props.setSession(res.account);
        });
      })
      .catch((err) => {});
  };

  searchPostcode = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    this.setState({
      zipCode: data.zonecode,
      address: fullAddress,
      isShowModal: false,
    });
    // this.setState({addressSecond: `(${extraAddress})`})
    // this.setState({searchAddressModal: false})
  };

  renderSubmitBtn = () => {
    const { name, zipCode, address, phone } = this.state;
    const isActive = name && zipCode && address && phone;
    return (
      <TouchableOpacity
        style={[
          styles.submitBtn,
          { backgroundColor: isActive ? "#000000" : "#dddddd" },
        ]}
        onPress={() => {
          if (isActive) {
            this.handleCreate();
          }
        }}
      >
        <Text style={styles.submitText}>
          {MyPageText.addShippingAddressComplete}
        </Text>
      </TouchableOpacity>
    );
  };


  render() {
    const { navigation } = this.props;
    const { isShowModal, name, zipCode, address, detailedAddress, phone } =
      this.state;

    return (
      <View style={styles.container}>
        <TopHeader title={MyPageText.shippingAddress} navigation={navigation} />
        <KeyboardAwareScrollView
            extraScrollHeight={150}
            enableOnAndroid={true}>
        <View style={{ paddingHorizontal: 20, paddingTop: 15 }}>
          <TextInputStr
            boxStyle={styles.boxStyle}
            textForm={styles.textInputForm}
            placeholder={"배송지명"}
            placeholderTextColor="#dddddd"
            value={name}
            setValue={(str) => this.setState({ name: str })}
          />
          <View
            style={{
              marginBottom: 15,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextInputStr
              boxStyle={{
                height: 40,
                borderBottomWidth: 1,
                borderBottomColor: "#dddddd",
                justifyContent: "center",
                width: "66%",
                marginRight: 12
              }}
              textForm={styles.textInputForm}
              placeholder={"우편번호"}
              placeholderTextColor="#dddddd"
              value={zipCode}
              keyboardType='numeric'
              editable={false}
              setValue={(str) => this.setState({ zipCode: str })}
            />
            <TouchableOpacity
              style={styles.zipCodeBtn}
              onPress={() => this.setState({ isShowModal: true })}
            >
              <Text style={styles.zipCode}>{MyPageText.searchAddress}</Text>
            </TouchableOpacity>
          </View>
          <TextInputStr
            boxStyle={styles.boxStyle}
            textForm={styles.textInputForm}
            placeholder={"주소 입력"}
            placeholderTextColor="#dddddd"
            value={address}
            setValue={(str) => this.setState({ address: str })}
          />
          <TextInputStr
            boxStyle={styles.boxStyle}
            textForm={styles.textInputForm}
            placeholder={"상세주소 입력"}
            placeholderTextColor="#dddddd"
            value={detailedAddress}
            setValue={(str) => this.setState({ detailedAddress: str })}
          />
          <TextInputStr
            boxStyle={styles.boxStyle}
            textForm={styles.textInputForm}
            placeholder={"수신인 연락번호"}
            placeholderTextColor="#dddddd"
            value={phone}
            keyboardType='numeric'
            setValue={(str) => this.setState({ phone: str })}
          />
        </View>
        </KeyboardAwareScrollView>
        {this.renderSubmitBtn()}
        {isShowModal && (
          <TouchableOpacity
              style={{
                position: "absolute",
                top: StatusBarHeight,
                width: "100%",
                height: 50,
                justifyContent: 'center',
                paddingHorizontal: 20,
                backgroundColor: 'white'
              }}
            onPress={() => this.setState({isShowModal: false})}>
            <Image
              source={require("../../../assets/image/common/arrow_back.png")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        )}
        {isShowModal ? (
          <Postcode
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: HAS_NOTCH ? 94 : 70,
            }}
            onSelected={(data) => this.searchPostcode(data)}
          />
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  eSESSION: state.eSESSION.eSESSION,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  getDeliveryDetail: (params) => dispatch(ActionAccount.getDeliveryDetail(params)),
  createDelivery: (params) => dispatch(ActionAccount.createDelivery(params)),
  updateDelivery: (params) => dispatch(ActionAccount.updateDelivery(params)),

  update: (params) => dispatch(ActionMber.update(params)),
  getSession: (params) => dispatch(ActionSession.getSession(params)),
  setSession: (params) => dispatch(ActionSession.setSession(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateAddress);
