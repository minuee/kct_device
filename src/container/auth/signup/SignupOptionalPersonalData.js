// 회원가입 일반회원 필수 정보 입력
import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";

//utils
import { SignupText } from "../../../model/lib/Utils/Strings";
import Fonts from "../../../model/lib/Utils/Fonts";
import * as dateUtil from "../../../model/lib/Utils/Date";

//component
import { Header } from "../../../component/signup/Header";
import { BottomBtn } from "../../../component/signup/BottomBtn";
import DatePickerModal from "../../../component/modal/DatePickerModal";
import TextInputStr from "../../../common/textinput/TextInput";

//action
import {isValidEmail} from "../../../model/lib/Utils";

class SignupOptionalPersonalData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: null,
      isShowDatePickerModal: false,
      birthDay: "",
      moblphon_no: "",
      email_addr: "",
    };
  }
  componentDidMount() {
    const {navigation} = this.props;
    const {moblphon_no, email_addr} = navigation.state.params.params;
    this.setState({moblphon_no, email_addr})
  }

  showDatePicker = () => {
    const { isShowDatePickerModal } = this.state;
    this.setState({ isShowDatePickerModal: !isShowDatePickerModal });
  };

  render() {
    const { navigation } = this.props;
    const { email_addr, gender, isShowDatePickerModal, birthDay, moblphon_no } = this.state;
    const isSocial = navigation.state.params.params.social;
    return (
      <View style={styles.container}>
        <Header isSocial={isSocial} step={5} total={navigation.state.params.currentUserType === 0 ? 6 : 5}  navigation={navigation} />
      <KeyboardAwareScrollView enableOnAndroid>
        <Text style={styles.signUp}>{SignupText.optionalInfo}</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[
              styles.genderBox,
              {
                borderColor: gender === 1 ? "#222222" : "#dddddd",
                borderWidth: gender === 1 ? 1 : 0.5,
              },
            ]}
            onPress={() => this.setState({ gender: 1 })}
          >
            <Text
              style={[
                styles.gender,
                { color: gender === 1 ? "#000000" : "#d5d5d5" },
              ]}
            >
              {SignupText.male}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderBox,
              {
                borderWidth: gender === 2 ? 1 : 0.5,
                borderLeftWidth: gender === 2 ? 1 : 0,
                borderColor: gender === 2 ? "#222222" : "#dddddd",
              },
            ]}
            onPress={() => this.setState({ gender: 2 })}
          >
            <Text
              style={[
                styles.gender,
                { color: gender === 2 ? "#000000" : "#d5d5d5" },
              ]}
            >
              {SignupText.female}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.birthDayBox}
          onPress={this.showDatePicker}
        >
          <Text
            style={{
              fontFamily: Fonts.AppleR,
              fontSize: 14,
              lineHeight: 32,
              color: birthDay === "" ? "#d5d5d5" : "#000000",
            }}
          >
            {birthDay === ""
              ? SignupText.selectBirth
              : dateUtil.formatKCT("koreanFullTime", birthDay)}
          </Text>
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../../../assets/image/signup/dropdown_btn_regular.png")}
          />
        </TouchableOpacity>
        <TextInputStr
          boxStyle={styles.boxStyle}
          textForm={styles.textForm}
          placeholder={SignupText.contact}
          placeholderTextColor="#d5d5d5"
          value={moblphon_no}
          keyboardType='numeric'
          setValue={(str) => {
            this.setState({
              moblphon_no: str,
            });
          }}
        />
        <TextInputStr
          boxStyle={styles.boxStyle}
          textForm={styles.textForm}
          placeholder={SignupText.enterEmail}
          placeholderTextColor="#d5d5d5"
          value={email_addr}
          setValue={(str) => {
            if (isValidEmail(str))
              this.setState({
                email_addr: str,
                errorMsgEmail: SignupText.incorrectEmail,
              });
            else this.setState({ email_addr: str, errorMsgEmail: "" });
          }}
        />
        <DatePickerModal
          isShowDatePickerModal={isShowDatePickerModal}
          isBirth={true}
          setVisible={() => this.setState({ isShowDatePickerModal: false })}
          title={SignupText.selectBirth}
          onPressConfirm={(birthDay) => {
            console.log(birthDay)
            this.setState({
              birthDay: birthDay,
              isShowDatePickerModal: false,
            })
          }}
        />
        <Text style={styles.desc}>* {SignupText.optionalInfoDesc}</Text>
        </KeyboardAwareScrollView>
        <BottomBtn
          navigation={navigation}
          // isActive={birthDay !== "" && gender && moblphon_no !== "" && email_addr !== ""}
          isActive={moblphon_no !== "" && email_addr !== ""}
          nav="SignupInflow"
          params={{
            ...navigation.state.params.params,
            email_addr: email_addr,
            brthdy: birthDay,
            sex_cd: gender ? gender === 1 || gender === 3 ? "SC000001" : "SC000002" : "",
          }}
          currentUserType={navigation.state.params.currentUserType}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  signUp: {
    marginTop: 60,
    marginLeft: 20,
    marginBottom: 37.8,
    fontFamily: Fonts.AppleR,
    fontSize: 30,
    lineHeight: 45,
    color: "#191919",
  },
  genderContainer: { flexDirection: "row", marginHorizontal: 20, height: 45 },
  genderBox: {
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
  },
  gender: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    lineHeight: 32,
  },
  boxStyle: {
    borderBottomWidth: 0.3,
    borderBottomColor: "#e1e1e1",
    height: 45,
    marginTop: 14.5,
    marginHorizontal: 20,
  },
  textForm: {
    height: 45,
    paddingLeft: 12,
    flex: 1,
  },
  birthDayBox: {
    marginTop: 20,
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: 0.5,
    flexDirection: "row",
    paddingLeft: 12,
    paddingRight: 10,
    justifyContent: "space-between",
    marginHorizontal: 20,
    alignItems: "center",
    height: 45,
  },
  desc: {
    marginTop: 15,
    marginLeft: 20,
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    lineHeight: 20.5,
    color: "#999999",
  },
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  // create: (params) => dispatch(ActionMber.create(params)),
  // login: (params) => dispatch(ActionUser.login(params)),
  // getSession: (params) => dispatch(ActionSession.getSession(params)),
  // setSession: (params) => dispatch(ActionSession.setSession(params)),
});

export default connect(
  undefined,
  mapDispatchToProps
)(SignupOptionalPersonalData);
