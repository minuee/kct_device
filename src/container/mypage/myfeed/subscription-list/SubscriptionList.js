// 구독 리스트
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import {connect} from "react-redux";

import { MyPageText } from "../../../../model/lib/Utils/Strings";

import { TopHeader } from "../../../../component/TopHeader";
import { SubscriptionListItem } from "../../../../component/mypage/myfeed/SubscriptionListItem";

import * as ActionTag from "../../../../model/action/eTAG";

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
  logoIcon: {
    width: 74,
    height: 30,
  },
});

class SubscriptionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTabIdx: 0,
      isShowSelectPhotoModal: false,
      isPushOn: false,
      count: 0,
      offset: 0,
      limit: 100,
      sbsList: [],
      loadMore: true,
    };
  }
  componentDidMount() {
    this.getSbsList();
  }

  getSbsList = () => {
    const {offset, limit, sbsList, loadMore} = this.state;
    if(loadMore) {
      let params = {
        skip: offset,
        limit: limit,
      }

      this.props.getSbsList(params).then((res) => {
        if(parseInt(res.count) > (offset + limit))
          this.setState({sbsList: [...sbsList, ...res.list], offset: offset + limit, count: parseInt(res.count)})
        else
          this.setState({sbsList: [...sbsList, ...res.list], loadMore: false, count: parseInt(res.count)})
      }).catch((err) => {
      });
    }

  }

  render() {
    const { navigation } = this.props;
    const {sbsList} = this.state;
    return (
      <View style={styles.container}>
        <TopHeader
          title={MyPageText.subscriptionList}
          navigation={navigation}
        />
        <FlatList
          data={sbsList}
          showsVerticalScrollIndicator={false}
          onEndReached={() => this.getSbsList()}
          renderItem={({ item }) => {
            return <SubscriptionListItem navigation={navigation} item={item} createSbs={this.props.createSbs}/>
          }}
          keyExtractor={(_, i) => String(i)}
        />
      </View>
    );
  }
}

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  getSbsList: (params) => dispatch(ActionTag.getSbsList(params)),
  createSbs: (params) => dispatch(ActionTag.createSbs(params)),
});

export default connect(undefined, mapDispatchToProps)(SubscriptionList);
