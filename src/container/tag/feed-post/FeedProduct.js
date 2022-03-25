// 상품 관련 피드
import React, { Component } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import {connect} from "react-redux";

import { TagText } from "../../../model/lib/Utils/Strings";
import { DEVICE_WIDTH } from "../../../model/lib/Utils/Constants";

import { TopHeader } from "../../../component/TopHeader";

import * as ActionNtt from "../../../model/action/eNTT";

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
  bigImg: {
    width: DEVICE_WIDTH - 40,
    height: DEVICE_WIDTH - 40,
    marginTop: 20,
    marginBottom: 5.5
    // alignItems: "center",
    // justifyContent: "center",
  },
  smallImg: {
    width: (DEVICE_WIDTH - 40) / 3 - 4,
    height: (DEVICE_WIDTH - 40) / 3 - 4,
    marginBottom: 4,
  },
  mediumImg: {
    width: (DEVICE_WIDTH - 40) / 2 - 4,
    height: (DEVICE_WIDTH - 40) / 2 - 4,
    marginBottom: 4,
  },
});

class FeedProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      loadMore: true,
      offset: 0,
      limit: 100,
      ntt_list: [],
      yOffset: 0,
    };
  }

  componentDidMount() {
    this.getList();
  }



  getList = () => {
    const {navigation} = this.props;
    const {goods_no} = navigation.state.params;
    const {offset, limit, ntt_list, loadMore} = this.state;
    if(loadMore) {
      let params = {
        skip: offset,
        limit: limit,
        goods_no: goods_no
      }

      console.log("params")
      console.log(params)

      this.props.getList(params).then((res) => {
        if(parseInt(res.count) > (offset + limit))
          this.setState({ntt_list: [...ntt_list, ...res.list], offset: offset + limit, isLoading: false})
        else
          this.setState({ntt_list: [...ntt_list, ...res.list], loadMore: false, isLoading: false})
      }).catch((err) => {
      });
    }
  }

  renderImage = (item, styles) => {
    const { navigation } = this.props;

    return (
      <TouchableOpacity
          onPress={() => navigation.navigate("FeedDetail", {ntt_no: item.ntt_no})}>
        <Image style={styles} source={{uri: item.img_url_addr}} />
      </TouchableOpacity>
    );
  };

  renderSmallImage = (items) => {
    if (items.length === 2) return this.renderMediumImage(items);
    else if (items.length === 5) {
      return (
        <>
          {this.renderMediumImage(items.slice(3, 5))}
          {this.renderSmallImage(items.slice(0, 3))}
        </>
      );
    } else
      return (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {items.map((item) => {
            return this.renderImage(item, styles.smallImg);
          })}
        </View>
      );
  };

  renderMediumImage = (items) => {
    return (
      <View style={styles.betweenCenter}>
        {items.map((item) => {
          return this.renderImage(item, styles.mediumImg);
        })}
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const {isLoading, ntt_list, yOffset} = this.state;

    if (isLoading)
      return null;
    return (
      <View style={styles.container}>
        <TopHeader
          title={TagText.productFeed}
          navigation={navigation}
          hasRightBtn={false}
        />
        <ScrollView
          style={{ paddingHorizontal: 20 }}
          // onScrollEndDrag={(e) => {
          //   this.setState({yOffset: e.nativeEvent.contentOffset.y})
          // }}
          onMomentumScrollEnd={(e) => {
            this.setState({yOffset: e.nativeEvent.contentOffset.y})
            this.getList();
          }}
          contentOffset={{y: yOffset}}
          showsVerticalScrollIndicator={false}>
          {ntt_list.map((item, index) => {
            const idx = index % 16
            if (idx === 0)
              return this.renderImage(item, styles.bigImg)
            else if (idx === 7)
              return this.renderMediumImage(ntt_list.slice(index, index + 2))
            else if (idx === 9)
              return this.renderImage(item, styles.spriteImg)
            else if (idx === 1 || idx === 11) {
              return this.renderSmallImage(ntt_list.slice(index, index + 6))
            }
          })}
          <View style={{ height: 70 }} />
        </ScrollView>
      </View>
    );
  }
}

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  getList: (params) => dispatch(ActionNtt.getList(params)),
});

export default connect(undefined, mapDispatchToProps)(FeedProduct);
