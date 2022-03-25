import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet, TouchableWithoutFeedback,
} from "react-native";
import {connect} from "react-redux";

import { TopHeader } from "../../../component/TopHeader";
import AlertModal from "../../../component/modal/AlertModal";
import SubscriptionListItem from "../../../component/tag/SubscriptionListItem";
import ConfirmModal from "../../../component/modal/ConfirmModal";

import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";
import {MyPageText, TagText, TicketText} from "../../../model/lib/Utils/Strings";

import * as ActionNtt from "../../../model/action/eNTT";
import * as ActionMber from "../../../model/action/eMBER";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  betweenCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  feedCountWrap: {
    paddingTop: 11.5,
    paddingBottom: 10,
    paddingLeft: 20,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
  },
  feedCountWrite: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#707070",
    marginRight: 5,
  },
  feedCount: {
    fontFamily: Fonts.AppleB,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#000000",
  },
});

class MyFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowTagReportModal: false,
      isShowAlertModal: false,
      isShowConfirmModal: false,
      reportItem: {},
      count: 0,
      offset: 0,
      limit: 100,
      nttList: [],
      loadMore: true,
      yOffset: 0,
    };
  }

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    const {eSESSION} = this.props;
    const {offset, limit, nttList, loadMore} = this.state;
    if(loadMore) {
      let params = {
        skip: offset,
        limit: limit,
        mber_no: eSESSION.mber_no
      }

      this.props.getList(params).then((res) => {
        if(parseInt(res.count) > (offset + limit))
          this.setState({nttList: [...nttList, ...res.list], offset: offset + limit, count: parseInt(res.count)})
        else
          this.setState({nttList: [...nttList, ...res.list], loadMore: false, count: parseInt(res.count)})
      }).catch((err) => {
      });
    }
  }

  getReList = () => {
    this.setState({offset: 0, loadMore: true, nttList: []}, () => this.getList())
  }

  isFeedCreate = () => {
    const {eSESSION, navigation} = this.props;
    let params = {
      mber_se_cd: eSESSION.mber_se_cd,
    }

    this.props.getDetail(params).then((res) => {
      if(parseInt(res.user[0].구매) > 0)
        navigation.navigate("FeedPost")
      else
        this.setState({isShowConfirmModal: true})
    }).catch((err) => {
    });
  }

  render() {
    const { navigation } = this.props;
    const { isShowAlertModal, isShowConfirmModal, count, nttList, yOffset } = this.state;
    return (
      <View style={styles.container}>
        <TopHeader
          title={MyPageText.myFeed}
          navigation={navigation}
          hasRightBtn={true}
          isText={true}
          rightBtnSource={MyPageText.subscriptionList}
          rightBtnStyle={{
            fontFamily: Fonts.AppleR,
            fontSize: 16,
            letterSpacing: -0.8,
            color: Colors.MAIN_COLOR,
          }}
          onPress={() => navigation.navigate("SubscriptionList")}
        />
        <View style={styles.feedCountWrap}>
          <Text style={styles.feedCountWrite}>
            {MyPageText.write}
          </Text>
          <Text style={styles.feedCount}>
            {`${count}건`}
          </Text>
        </View>
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 21.5 }}
            // onScrollEndDrag={(e) => {
            //   this.setState({yOffset: e.nativeEvent.contentOffset.y})
            // }}
            contentOffset={{y: yOffset}}
            onMomentumScrollEnd={(e) => {
              this.setState({yOffset: e.nativeEvent.contentOffset.y})
              this.getList();
            }}>
          {nttList.map((subscription) => {
            return (
              <TouchableWithoutFeedback>
                <SubscriptionListItem
                  item={subscription}
                  navigation={navigation}
                  isMyFeed={true}
                  listLength={subscription.img_url_addr_arr.length}
                  getReSbsList={() => this.getReSbsList()}
                  setReportModalVisibility={() =>
                    this.setState({ isShowTagReportModal: true })
                  }
                  isEdit={true}
                  setVisible={() => this.setState({reportItem: subscription, isShowAlertModal: true })}
                />
              </TouchableWithoutFeedback>
            );
          })}
          <View style={{ height: 50 }} />
        </ScrollView>
        <TouchableOpacity
          style={{ alignSelf: "center", position: "absolute", bottom: 22.5 }}
          onPress={() => this.isFeedCreate()}
        >
          <Image
            style={{ width: 187.5, height: 75 }}
            source={require("../../../assets/image/mypage/floating_write_feed_btn.png")}
          />
        </TouchableOpacity>
        {isShowAlertModal && (
          <AlertModal
            isShowAlertModal={isShowAlertModal}
            message={TicketText.deleteMessage}
            leftText={TicketText.no}
            rightText={TicketText.deleteConfirm}
            setVisible={() =>
              this.setState({ isShowAlertModal: false })
            }
            navigation={navigation}
            leftOnPress={() => this.setState({ isShowAlertModal: false })}
            rightOnPress={() => console.log("delete")}
          />
        )}

        {isShowConfirmModal && (
            <ConfirmModal
                isShowConfirmModal={isShowConfirmModal}
                setVisible={() => this.setState({isShowConfirmModal: false})}
                title={TagText.notice}
                subtitle={TagText.alertMessage}
            />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  eSESSION: state.eSESSION.eSESSION,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  getDetail: (params) => dispatch(ActionMber.getDetail(params)),
  getList: (params) => dispatch(ActionNtt.getList(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyFeed);
