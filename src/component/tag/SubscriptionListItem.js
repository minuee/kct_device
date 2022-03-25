import React, { Component } from "react";
import {StyleSheet, TouchableOpacity, Text, Image, View, TouchableWithoutFeedback} from "react-native";
import Swiper from "react-native-swiper";
import { connect } from "react-redux";

import { DEVICE_WIDTH } from "../../model/lib/Utils/Constants";
import Fonts from "../../model/lib/Utils/Fonts";
import {CodeText, MyPageText, TagText, TicketText} from "../../model/lib/Utils/Strings";
import { formattedNumber } from "../../model/lib/Utils";
import * as dateUtil from "../../model/lib/Utils/Date";
import AlertModal from "../modal/AlertModal";

import * as ActionNtt from "../../model/action/eNTT";

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
  // title: {
  //   fontSize: 20,
  //   fontWeight: "bold",
  //   fontStyle: "italic",
  //   color: "#333333",
  // },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#333333",
  },
  updatedAt: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    color: "#c1c1c1",
    marginTop: 3,
  },
  headerOptionText: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    letterSpacing: -0.7,
    color: "#222222",
  },
  headerOptionBox: {
    height: 40,
    width: 85,
    alignItems: "center",
    justifyContent: "center",
  },
  headerOptionContainer: {
    position: "absolute",
    right: 20,
    top: DEVICE_WIDTH + 50,
    zIndex: 20,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#dddddd",
  },
  swiperWrap: {
    height: 2.5,
    width: 120,
    borderRadius: 15,
    backgroundColor: "#c1c1c1",
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },
  swiperView: {
    height: 2.5,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
  },
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 3.3,
  },
  tagItem: {
    height: 30,
    borderRadius: 25,
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#e1e1e1",
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 8,
  },
  tagText: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.65,
    color: "#595959",
  },
  productWrap: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f5f5f5",
    marginTop: 16,
  },
  productName: {
    fontFamily: Fonts.AppleR,
    fontSize: 16,
    color: "#595959",
  },
  productPrice: {
    fontFamily: Fonts.AppleB,
    fontSize: 14,
    color: "#191919",
    marginTop: 8,
  },
});

class SubscriptionListItem extends Component {
  constructor(props) {
    super(props);
    const { item } = this.props;
    this.state = {
      isLike: !!item.like_sn,
      activeIdx: 0,
      isShowEditBox: false,
      isShowAlertModal: false,
    };
  }

  clickLike = () => {
    const { item } = this.props;
    const { isLike } = this.state;
    let params = {
      ntt_no: item.ntt_no,
    };

    this.props
      .clickLike(params)
      .then(async (res) => {
        this.setState({ isLike: !isLike });
      })
      .catch((err) => {});
  };

  handleDelete = () => {
    const { item, getReSbsList } = this.props;
    let params = {
      ntt_no: item.ntt_no,
    };

    this.props
      .remove(params)
      .then(async (res) => {
        getReSbsList();
        this.setState({ isShowAlertModal: false })
      })
      .catch((err) => {});
  };

  render() {
    const { item, navigation, listLength, setReportModalVisibility, isEdit, isMyFeed } =
      this.props;
    const { activeIdx, isShowEditBox, isLike, isShowAlertModal } = this.state;
    const tag_title = item.tag.length > 0 ? item.tag[0].tag_nm : "";

    return (
      <TouchableOpacity
        style={{ marginBottom: 40 }}
        activeOpacity={1.0}
        onPress={() =>
          navigation.navigate("FeedDetail", { ntt_no: item.ntt_no })
        }
      >
        {!isMyFeed ? (
          <View style={[styles.betweenCenter, { marginHorizontal: 20 }]}>
            <View>
              <Text style={styles.title}>#{tag_title}</Text>
              <Text style={styles.updatedAt}>
                {dateUtil.formatKCT("dash", item.writng_dt)}
              </Text>
            </View>
            <TouchableOpacity onPress={setReportModalVisibility}>
              <Image style={{ width: 20, height: 20 }} source={require("../../assets/image/tag/more_report_btn.png")}/>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.betweenCenter, { marginHorizontal: 20 }]}>
            <Text style={styles.title}>#{tag_title}</Text>
            <Text style={styles.updatedAt}>
              {dateUtil.formatKCT("dash", item.writng_dt)}
            </Text>
          </View>
        )}
        {isShowEditBox && (
          <View
            style={styles.headerOptionContainer}
            shadowColor="#29000000"
            shadowOffset={{ width: 2.5, height: 2.5 }}
            shadowOpacity={1}
            elevation={0.4}
          >
            <TouchableOpacity
              style={styles.headerOptionBox}
              onPress={() =>
                navigation.navigate("FeedPost", { ntt_no: item.ntt_no })
              }
            >
              <Text style={styles.headerOptionText}>{MyPageText.editPost}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerOptionBox}
              onPress={() => this.setState({isShowAlertModal: true})}
            >
              <Text style={styles.headerOptionText}>
                {MyPageText.deletePost}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ marginTop: 10 }}>
          <Swiper
            style={{ height: DEVICE_WIDTH - 40 }}
            loop={false}
            key={item.img_url_addr_arr.length}
            showsPagination={false}
            onIndexChanged={(index) => this.setState({ activeIdx: index })}
          >
            {item.img_url_addr_arr.map((image) => {
              return (
                <TouchableWithoutFeedback>
                  <Image
                    style={{ width: "100%", height: DEVICE_WIDTH - 40 }}
                    source={{ uri: image }}
                  />
                </TouchableWithoutFeedback>
              );
            })}
          </Swiper>
          {listLength > 1 ?
            <View style={styles.swiperWrap}>
              <View
                style={[
                  styles.swiperView,
                  { width: (120 / listLength) * (activeIdx + 1) },
                ]}
              />
            </View>: null}
        </View>
        <View style={{ paddingTop: 10, paddingHorizontal: 20 }}>
          <View style={styles.betweenCenter}>
            <Text style={{ fontFamily: Fonts.AppleR, color: "#595959" }}>
              {item.ntt_cont}
            </Text>
            {isEdit && (
              <TouchableOpacity
                onPress={() => this.setState({ isShowEditBox: !isShowEditBox })}
              >
                <Image
                  style={{ width: 20, height: 20 }}
                  source={require("../../assets/image/ticket/more_grey.png")}
                />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.likeBtn}
            onPress={() => this.clickLike()}
          >
            <Image
              source={
                isLike
                  ? require("../../assets/image/tag/likes_on.png")
                  : require("../../assets/image/tag/likes_off.png")
              }
              style={{ width: 26, height: 26, marginRight: 6 }}
            />
            <Text
              style={{
                fontFamily: Fonts.AppleR,
                fontSize: 13,
                color: isLike ? "#333333" : "#c1c1c1",
              }}
            >
              {`${TagText.like} ${
                isLike ? parseInt(item.like_cnt) + 1 : item.like_cnt || 0
              }`}
            </Text>
          </TouchableOpacity>
          <View style={styles.tagWrap}>
            {(item.tag || []).map((tag) => {
              return (
                <TouchableOpacity
                  style={styles.tagItem}
                  onPress={() =>
                    navigation.push("TagDetail", { tag_no: tag.tag_no })
                  }>
                  <Text style={styles.tagText}>#{tag.tag_nm}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity
            style={[styles.betweenCenter, styles.productWrap]}
            onPress={() => {
              const nav =
                item.sale_mth_cd === CodeText.sale_mth_cd_a
                  ? "StoreAuction"
                  : item.sale_mth_cd === CodeText.sale_mth_cd_r
                  ? "StoreReserve"
                  : item.sale_mth_cd === CodeText.sale_mth_cd_g
                  ? "StoreGroup"
                  : "StoreDetail";
              navigation.navigate(nav, { goods_no: item.goods_no });
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{ uri: item.goods_img_url_addr }}
                style={{ width: 50, height: 50, marginRight: 10 }}
              />
              <View style={{width: "75%"}}>
                <Text style={styles.productName} numberOfLines={1}>{item.goods_nm}</Text>
                <Text style={styles.productPrice}>
                  {formattedNumber(item.sale_prc || 0)}
                </Text>
              </View>
            </View>
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../../assets/image/feed/more_chevron.png")}
            />
          </TouchableOpacity>
        </View>
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
                rightOnPress={() => this.handleDelete()}
            />
        )}
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state) => ({
  eSESSION: state.eSESSION.eSESSION,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  clickLike: (params) => dispatch(ActionNtt.clickLike(params)),
  remove: (params) => dispatch(ActionNtt.remove(params)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionListItem);
