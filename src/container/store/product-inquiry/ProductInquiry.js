// 주소 설정
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { connect } from "react-redux";

import {StoreText} from "../../../model/lib/Utils/Strings";
import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";
import {notifyMessage} from "../../../model/lib/Utils";

import { TopHeader } from "../../../component/TopHeader";
import MessageModal from "../../../component/modal/MessageModal";
import TextInputStr from "../../../common/textinput/TextInput";

import * as ActionInqry from "../../../model/action/eGOODS_INQRY";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  topHeaderBtn: {
    fontFamily: Fonts.AppleR,
    letterSpacing: -0.7,
  },
  textForm: {
    fontFamily: Fonts.AppleR,
    color: "#222222",
  },
  inquiryBox: {
    marginHorizontal: 20,
    borderBottomColor: "#c1c1c1",
    borderBottomWidth: 0.5,
    paddingBottom: 14,
    paddingTop: 15,
  },
  inquiryMessage: {
    marginTop: 16.8,
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    color: "#969696",
    marginLeft: 20,
  },
});

class ProductInquiry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowMessageModal: false,
      inquiry: "",
    };
  }

  createInqry = () => {
    const {navigation} = this.props;
    const {goods_no, getInqryList} = navigation.state.params;
    const {inquiry} = this.state;
    let params = {
      goods_no: goods_no,
      inqry_sj: `${StoreText.productInquiry}_${goods_no}`,
      inqry_cont: inquiry
    }
    this.props.createInqry(params).then(async (res) => {
      this.setState({ isShowMessageModal: true });
      getInqryList()
    }).catch((err) => {
    });
  }

  render() {
    const { navigation } = this.props;
    const { inquiry, isShowMessageModal } = this.state;
    return (
      <View style={styles.container}>
        <TopHeader
          title={StoreText.productInquiry}
          navigation={navigation}
          hasRightBtn={true}
          isText={true}
          rightBtnSource={"등록"}
          rightBtnStyle={[
            styles.topHeaderBtn,
            { color: inquiry.length > 0 ? Colors.MAIN_COLOR : "#333333" },
          ]}
          onPress={() => {
            if (inquiry.length > 0) {
              this.createInqry();
            }
          }}
        />
        <View style={styles.inquiryBox}>
          <TextInputStr
            boxStyle={{width: "100%", height: 230}}
            textForm={styles.textForm}
            placeholder={StoreText.inquiryPlaceholder}
            placeholderTextColor="#c1c1c1"
            value={inquiry}
            multiline={true}
            setValue={(str) => {
              if (str.length <= 1000) this.setState({ inquiry: str });
              else notifyMessage(StoreText.inquiryLimit);
            }}
          />
          <Text
            style={{
              fontFamily: Fonts.AppleR,
              textAlign: "right",
              color: "#c1c1c1",
            }}
          >
            <Text
              style={{
                color: inquiry.length > 0 ? "#222222" : "#c1c1c1",
              }}
            >
              {inquiry.length}
            </Text>
            /1,000
          </Text>
        </View>
        <Text style={styles.inquiryMessage}>{StoreText.inquiryMessage}</Text>
        <MessageModal
          title={StoreText.notice}
          subtitle={StoreText.noticeMessage}
          isShowMessageModal={isShowMessageModal}
          setVisible={() => {
            this.setState({ isShowMessageModal: false })
            navigation.goBack();
          }}
          hasBtn={true}
        />
      </View>
    );
  }
}

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  createInqry: (params) => dispatch(ActionInqry.createInqry(params)),
});

export default connect(undefined, mapDispatchToProps)(ProductInquiry);
