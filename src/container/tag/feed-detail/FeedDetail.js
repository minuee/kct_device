// 피드 상세 화면
// 상단 바 > 알림 화면
import React, { Component } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { connect } from "react-redux";
import Swiper from "react-native-swiper";
import LinearGradient from "react-native-linear-gradient";

import {
  CodeText,
  Generic,
  TagText,
  TicketText,
} from "../../../model/lib/Utils/Strings";
import Fonts from "../../../model/lib/Utils/Fonts";
import {HAS_NOTCH, StatusBarHeight} from "../../../model/lib/Utils/Constants";
import * as dateUtil from "../../../model/lib/Utils/Date";
import { formattedNumber, maskingId } from "../../../model/lib/Utils";

import * as ActionNtt from "../../../model/action/eNTT";

import TagReportModal from "../../../component/modal/TagReportModal";
import AlertModal from "../../../component/modal/AlertModal";
import WebView from "react-native-webview";

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
  playIcon: {
    width: 40,
    height: 40,
  },
  headerOptionContainer: {
    position: "absolute",
    right: 20,
    top: HAS_NOTCH ? 94 : 70,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#dddddd",
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
  feedInfoDate: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    color: "#c1c1c1",
  },
  feedInfoBar: {
    width: 0.5,
    height: 20,
    backgroundColor: "#e1e1e1",
    marginHorizontal: 10,
  },
  feedInfoName: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    color: "#c1c1c1",
  },
  feedInfoCont: {
    marginTop: 15,
    fontFamily: Fonts.AppleR,
    color: "#595959",
    lineHeight: 21,
  },
  tagWrap: {
    marginTop: 11.3,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
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
    marginBottom: 8,
  },
  tagItemText: {
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
    width: "100%"
  },
  productText: {
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
  backBtn: {
    paddingLeft: 20,
    width: 50,
    height: 50,
    justifyContent: "center",
  },
  moreInfo: {
    fontFamily: Fonts.AppleB,
    fontSize: 20,
    letterSpacing: -1,
    textAlign: "center",
    color: "#ffffff",
  },
  moreInfoBtn: {
    alignItems: "center",
    width: 50,
    height: 50,
    justifyContent: "center",
  },
});

class FeedDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLike: false,
      isShowHeaderOptionBox: false,
      isShowTagReportModal: false,
      isShowAlertModal: false,
      isShowDeleteModal: false,
      activeIdx: 0,
      detail: {},
      otherList: [],
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const { ntt_no } = navigation.state.params;
    if (ntt_no) this.getDetail(ntt_no);
  }

  getDetail = (ntt_no) => {
    let params = {
      ntt_no: ntt_no,
    };

    this.props
      .getDetail(params)
      .then(async (res) => {
        this.setState({ detail: res.detail, isLike: !!res.detail.like_sn, isLoading: false });
        this.getList(res.detail.mber_no);
      })
      .catch((err) => {
      });
  };

  getList = (mber_no) => {
    const { navigation } = this.props;
    const { ntt_no } = navigation.state.params;
    let params = {
      skip: 0,
      limit: 100,
      mber_no: mber_no,
    };

    this.props
      .getList(params)
      .then(async (res) => {
        this.setState({ otherList: res.list.filter((item) => item.ntt_no !== ntt_no) });
      })
      .catch((err) => {
      });
  };

  clickLike = () => {
    const { navigation } = this.props;
    const { ntt_no } = navigation.state.params;
    const { isLike } = this.state;
    let params = {
      ntt_no: ntt_no,
    };

    this.props
      .clickLike(params)
      .then(async (res) => {
        this.setState({ isLike: !isLike });
      })
      .catch((err) => {
      });
  };

  handleDelete = () => {
    const { navigation } = this.props;
    const { ntt_no } = navigation.state.params;

    let params = {
      ntt_no: ntt_no,
    };

    this.props
      .remove(params)
      .then(async (res) => {
        navigation.goBack();
      })
      .catch((err) => {
      });
  };

  renderFeedHeader = () => {
    const { detail, activeIdx } = this.state;
    let swiper_len = detail?.img.length;
    if(detail?.ytb_url_addr) swiper_len += 1;
    return (
      <View>
        <LinearGradient
          colors={['#000000', '#00000000']}
          style={{
            height: 150,
            width: "100%",
            opacity: .4,
            top: 0,
            zIndex: 10,
            position: 'absolute'}}/>
        {detail?.img && swiper_len > 0 && (
          <Swiper
            style={{ height: 430}}
            loop={false}
            key={swiper_len}
            showsPagination={false}
            onIndexChanged={(index) => this.setState({ activeIdx: index })}
          >
            {detail?.ytb_url_addr && (
              <WebView source={{uri : detail?.ytb_url_addr.replace("watch?v=", "embed/")}} style={{ width: "100%", height: 430 }}/>
            )}
            {detail?.img.map((image) => {
              return (
                <Image style={{ width: "100%", height: 430 }} source={{ uri: image.img_url_addr }}/>
              );
            })}
          </Swiper>
        )}
        {detail?.img && swiper_len && swiper_len > 1 && (
          <View style={styles.swiperWrap}>
            <View style={[styles.swiperView, { width: (120 / swiper_len) * (activeIdx + 1) }]}/>
          </View>
        )}
      </View>
    );
  };

  renderFeedInfo = () => {
    const { navigation, eSESSION } = this.props;
    const { detail, isLike } = this.state;
    return (
      <View style={{ marginTop: 23, paddingHorizontal: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.feedInfoDate}>
              {dateUtil.formatKCT("dash", detail.writng_dt)}
            </Text>
            <View style={styles.feedInfoBar} />
            <Text style={styles.feedInfoName}>
              {maskingId(detail.mber_nm || "")}
            </Text>
          </View>
          {/*<TouchableOpacity*/}
          {/*    // onPress={() => this.setState({ isShowTagReportModal: true })}*/}
          {/*>*/}
          {/*  <Image*/}
          {/*      style={{ width: 20, height: 20 }}*/}
          {/*      source={require("../../../assets/image/tag/more_report_btn.png")}*/}
          {/*  />*/}
          {/*</TouchableOpacity>*/}
        </View>
        <Text style={styles.feedInfoCont}>{detail.ntt_cont || ""}</Text>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}
          onPress={() => this.clickLike()}
        >
          <Image
            source={
              isLike
                ? require("../../../assets/image/tag/likes_on.png")
                : require("../../../assets/image/tag/likes_off.png")
            }
            style={{ width: 26, height: 26, marginRight: 6 }}
          />
          <Text
            style={{
              fontFamily: Fonts.AppleR,
              fontSize: 13,
              color: "#333333",
            }}
          >
            {`${TagText.like} ${isLike ? parseInt(detail.like_cnt) + 1 : detail.like_cnt || 0}`}
          </Text>
        </TouchableOpacity>
        <View style={styles.tagWrap}>
          {detail.tag &&
            detail.tag.map((item) => {
              return (
                <TouchableOpacity
                  style={styles.tagItem}
                  onPress={() =>
                    navigation.push("TagDetail", { tag_no: item.tag_no })
                  }
                >
                  <Text style={styles.tagItemText}>{`#${item.tag_nm || ""}`}</Text>
                </TouchableOpacity>
              );
            })}
        </View>
        <TouchableOpacity
          style={[styles.betweenCenter, styles.productWrap]}
          onPress={() => {
            const nav =
              detail.sale_mth_cd === CodeText.sale_mth_cd_a
                ? "StoreAuction"
                : detail.sale_mth_cd === CodeText.sale_mth_cd_r
                ? "StoreReserve"
                : detail.sale_mth_cd === CodeText.sale_mth_cd_g
                ? "StoreGroup"
                : "StoreDetail";
            navigation.navigate(nav, { goods_no: detail.goods_no });
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: detail.goods_img_url_addr }}
              style={{ width: 50, height: 50, marginRight: 10 }}
            />
            <View style={{width: "75%"}}>
              <Text style={styles.productText} numberOfLines={1}>{detail.goods_nm || ""}</Text>
              <Text style={styles.productPrice}>
                {formattedNumber(detail.sale_prc || 0)}
              </Text>
            </View>
          </View>
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../../../assets/image/feed/more_chevron.png")}
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderOtherFeeds = () => {
    const { navigation } = this.props;
    const { detail, otherList } = this.state;
    return (
      <View style={{ marginTop: 40, marginBottom: 47, paddingLeft: 20 }}>
        <Text
          style={{
            fontFamily: Fonts.AppleR,
            fontSize: 16,
            color: "#333333",
            marginBottom: 14,
          }}
        >
          {`${maskingId(detail.mber_nm || "")}${TagText.otherFeed}`}
        </Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {otherList.map((item) => {
            if (item.img_url_addr)
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.push("FeedDetail", { ntt_no: item.ntt_no })
                  }
                >
                  <Image
                    source={{ uri: item.img_url_addr }}
                    style={{
                      width: 116.3,
                      height: 116.3,
                      borderRadius: 5,
                      marginRight: 14,
                    }}
                  />
                </TouchableOpacity>
              );
            else return null;
          })}
        </ScrollView>
      </View>
    );
  };

  renderHeaderOptionBox = () => {
    const { navigation } = this.props;
    const { isShowHeaderOptionBox, detail } = this.state;

    if (isShowHeaderOptionBox) {
      return (
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
              navigation.navigate("FeedPost", {
                ntt_no: detail.ntt_no,
              })
            }
          >
            <Text style={styles.headerOptionText}>{TagText.editPost}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerOptionBox}
            onPress={() => this.setState({isShowDeleteModal: true})}
          >
            <Text style={styles.headerOptionText}>{TagText.deletePost}</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };

  render() {
    const { navigation, eSESSION } = this.props;
    const { isLoading, isShowTagReportModal, isShowDeleteModal, detail, isShowAlertModal, isShowHeaderOptionBox } = this.state;

    if(isLoading)
      return null;
    else
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.betweenCenter,
            {
              position: "absolute",
              top: StatusBarHeight,
              left: 0,
              width: "100%",
              zIndex: 10,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.pop()}
          >
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../../assets/image/feed/arrow_back_lightgrey.png")}
            />
          </TouchableOpacity>
          <Text style={styles.moreInfo}>{TagText.moreInfo}</Text>
          <TouchableOpacity
            style={styles.moreInfoBtn}
            onPress={() => {
              if (eSESSION.mber_no) {
                if (detail.mber_no === eSESSION.mber_no) {
                  this.setState({
                    isShowHeaderOptionBox: !isShowHeaderOptionBox,
                  });
                }
                else {
                  this.setState({ isShowTagReportModal: true });
                }
              } else {
                this.setState({ isShowAlertModal: true });
              }
            }}
          >
            <Image
              style={{ width: 27.5, height: 27.5 }}
              source={require("../../../assets/image/feed/more_white.png")}
            />
          </TouchableOpacity>
        </View>
        {this.renderHeaderOptionBox()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderFeedHeader()}
          <View>
            {this.renderFeedInfo()}
            {this.renderOtherFeeds()}
          </View>
        </ScrollView>

        {isShowTagReportModal && (
          <TagReportModal
            reportItem={detail}
            navigation={navigation}
            isShowTagReportModal={isShowTagReportModal}
            eSESSION={eSESSION}
            setAlertModal={() => this.setState({isShowAlertModal: true})}
            setVisible={() => this.setState({ isShowTagReportModal: false })}
          />
        )}
        {isShowAlertModal && (
          <AlertModal
            isShowAlertModal={isShowAlertModal}
            message={Generic.loginMessage}
            leftText={TicketText.no}
            rightText={Generic.goToLogin}
            setVisible={() => this.setState({ isShowAlertModal: false })}
            navigation={navigation}
            leftOnPress={() => this.setState({ isShowAlertModal: false })}
            rightOnPress={() => navigation.navigate("Login")}
          />
        )}
        {isShowDeleteModal && (
            <AlertModal
                isShowAlertModal={isShowDeleteModal}
                message={TicketText.deleteMessage}
                leftText={TicketText.no}
                rightText={TicketText.deleteConfirm}
                setVisible={() =>
                    this.setState({ isShowDeleteModal: false })
                }
                navigation={navigation}
                leftOnPress={() => this.setState({ isShowDeleteModal: false })}
                rightOnPress={() => this.handleDelete()}
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
  clickLike: (params) => dispatch(ActionNtt.clickLike(params)),
  getDetail: (params) => dispatch(ActionNtt.getDetail(params)),
  getList: (params) => dispatch(ActionNtt.getList(params)),
  remove: (params) => dispatch(ActionNtt.remove(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedDetail);
