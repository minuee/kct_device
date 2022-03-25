// 상단 바 > 알림 화면
import React, { Component } from "react";
import {
  ScrollView,
  View,
  StyleSheet, ActivityIndicator,
} from "react-native";
import {connect} from "react-redux";

import { NotificationText } from "../../model/lib/Utils/Strings";
import Colors from "../../model/lib/Utils/Colors";

import { TopHeader } from "../../component/TopHeader";
import { NotificationTab } from "../../component/notification/NotificationTab";
import { NotificationListItem } from "../../component/notification/NotificationListItem";

import * as ActionPush from "../../model/action/ePUSH";

const styles = StyleSheet.create({
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
  container: {
    backgroundColor: "white",
    flex: 1,
  },
});

const categories = [
  { cd_nm: "전체", cd_no: 0 },
  { cd_nm: "스토어", cd_no: "PNSDT001" },
  { cd_nm: "태그", cd_no: "PNSDT002" },
  { cd_nm: "결제/배송", cd_no: "PNSDT003" },
  { cd_nm: "정산", cd_no: "PNSDT004" },
  { cd_nm: "활동", cd_no: "PNSDT005" },
  { cd_nm: "소식", cd_no: "PNSDT006" },
];

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      currentNotificationTabIdx: 0,
      noti_list: [],
      offset: 0,
      limit: 10,
      loadMore: true,
      yOffset: 0,
    };
  }

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    const {offset, limit, noti_list, loadMore, currentNotificationTabIdx} = this.state;
    if(loadMore) {
      let params = {
        skip: offset,
        limit: limit,
        sort: 2, // 1: 발송시간 ASC, 2: 발송시간 DESC
      }
      if(currentNotificationTabIdx)
        Object.assign(params, {push_ntcn_sndng_dtl_typ_cd: currentNotificationTabIdx})

      this.props.getList(params).then((res) => {
        if (parseInt(res.count) > (offset + limit))
          this.setState({noti_list: [...noti_list, ...res.list], offset: offset + limit}, () => this.getRead(res.list))
        else
          this.setState({noti_list: [...noti_list, ...res.list], loadMore: false}, () => this.getRead(res.list))
      }).catch((err) => {
        this.setState({isLoading: false});
      });
    }
  }

  getRead = (noti_list) => {
    // push_ntcn_sndng_dtl_no
    if(noti_list.length === 0) this.setState({isLoading: false})
    noti_list.map((item, index) => {
      this.setState({isLoading: true})
      if(item.ntcn_cnfirm_yn === "N") {
        let params = {
          push_ntcn_sndng_dtl_no: item.push_ntcn_sndng_dtl_no
        }
        this.props.getRead(params).then(async (res) => {
        }).catch((err) => {
        });
      }
      if(index + 1 === noti_list.length)
        this.setState({isLoading: false})
    })
  }

  renderNotificationTabs = () => {
    const { currentNotificationTabIdx } = this.state;
    return (
      <View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            paddingHorizontal: 20,
            height: 50,
          }}
        >
          {categories.map((category, index) => {
            return (
              <NotificationTab
                title={category.cd_nm}
                isActive={currentNotificationTabIdx === category.cd_no}
                setCurrentNotificationTabIdx={() =>
                  this.setState({ currentNotificationTabIdx: category.cd_no, loadMore: true, offset: 0, noti_list: [], yOffset: 0 }, () => this.getList())
                }
                isLast={categories.length - 1 === index}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  };

  renderNotificationList = () => {
    const {navigation, eCOMM_CD} = this.props;
    const {noti_list, yOffset} = this.state;
    return (
      <ScrollView
        // onScrollEndDrag={(e) => {
        //   this.setState({yOffset: e.nativeEvent.contentOffset.y})
        // }}
        contentOffset={{y: yOffset}}
        onMomentumScrollEnd={(e) => {
          this.setState({yOffset: e.nativeEvent.contentOffset.y})
          this.getList();
        }}
        showsVerticalScrollIndicator={false}>
        {noti_list.map((notification, index) => {
          return <NotificationListItem key={`${index}_${notification.push_ntcn_sndng_dtl_no}`} item={notification} eCOMM_CD={eCOMM_CD} navigation={navigation} />;
        })}
      </ScrollView>
    );
  };

  render() {
    const { navigation } = this.props;
    const {isLoading} = this.state;
    if(isLoading)
      return (
          <View style={{flex: 1, justifyContent: "center"}}>
            <ActivityIndicator size="large" color={Colors.MAIN_COLOR}/>
          </View>)
    else
    return (
      <View style={styles.container}>
        <TopHeader
          title={NotificationText.noti}
          navigation={navigation}
          hasRightBtn={false}
          isCloseIcon={true}
        />
        {this.renderNotificationTabs()}
        {this.renderNotificationList()}
      </View>
    );
  }
}


const mapStateToProps = (state) => ({
  eSESSION: state.eSESSION.eSESSION,
  eCOMM_CD: state.eCOMM_CD.eCOMM_CD,
  // eCOMM_CD_TYPE: state.eCOMM_CD.eCOMM_CD_TYPE,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  getNewPush: (params) => dispatch(ActionPush.getNew(params)),
  getRead: (params) => dispatch(ActionPush.getRead(params)),
  getList: (params) => dispatch(ActionPush.getList(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
