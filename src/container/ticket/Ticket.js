// 스토어 > 교환권 화면
import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { connect } from "react-redux";

import Fonts from "../../model/lib/Utils/Fonts";
import { StoreText } from "../../model/lib/Utils/Strings";

import { CategoryItem } from "../../component/store/CategoryItem";
import { VoucherListItem } from "../../component/store/VoucherListItem";
import { VoucherAlbumItem } from "../../component/store/VoucherAlbumItem";
import FilterModal from "../../component/modal/FilterModal";

const styles = StyleSheet.create({
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  voucherFilterBox: {
    flexDirection: "row",
    paddingHorizontal: 20,
    height: 55,
    justifyContent: "space-between",
    alignItems: "center",
  },
  voucherFilter: {
    width: 30,
    height: 55,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  listIcon: { width: 27.5, height: 27.5, marginRight: 5 },
  albumIcon: { width: 27.5, height: 27.5 },
  deletePostToast: {
    alignSelf: "center",
    position: "absolute",
    bottom: 29.5,
    height: 32.5,
    opacity: 0.75,
    borderRadius: 5,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});

const voucherCategories = [
  { title: "전체", type: 1 },
  { title: "즉시구매", type: 2 },
  { title: "경매거래", type: 3 },
];

const newArrival = [
  {
    image_url: require("../../assets/image/temp1.png"),
    title: "삼성 갤럭시 S21 Ultra",
    type: 1,
    price: "850,000",
    option: "퍼시픽 블루 / 128GB",
    isBundle: true,
  },
  {
    image_url: require("../../assets/image/temp1.png"),
    title: "삼성 갤럭시 S21 Ultra",
    type: 2,
    price: "1,850,000",
    option: "퍼시픽 블루 / 128GB",
  },
  {
    image_url: require("../../assets/image/temp1.png"),
    title: "삼성 갤럭시 S21 Ultra",
    type: 3,
    price: "850,000",
    option: "퍼시픽 블루 / 128GB",
  },
  {
    image_url: require("../../assets/image/temp1.png"),
    title: "삼성 갤럭시 S21 Ultra",
    type: 4,
    price: "850,000",
    option: "퍼시픽 블루 / 128GB",
  },
];

const filters = [
  { title: "최신순", id: 1 },
  { title: "최저가순", id: 2 },
  { title: "판매수량순", id: 3 },
  { title: "마감임박순", id: 4 },
];

class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voucherListType: "list",
      isShowToast: false,
      isShowFilterModal: false,
      filterId: 0,
    };
  }

  renderVoucherFilterBox = () => {
    const { currentProductCategoryIdx, voucherListType } = this.state;
    return (
      <View style={styles.voucherFilterBox}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.voucherFilter}
            onPress={() => this.setState({ isShowFilterModal: true })}
          >
            <Image
              source={require("../../assets/image/store/filter_default_btn.png")}
              style={styles.filter}
            />
          </TouchableOpacity>
          <View style={styles.rowCenter}>
            {voucherCategories.map((voucherCategory) => {
              return (
                <CategoryItem
                  title={voucherCategory.title}
                  isActive={currentProductCategoryIdx === voucherCategory.type}
                  setSelectedCategoryId={() =>
                    this.setState({
                      currentProductCategoryIdx: voucherCategory.type,
                    })
                  }
                />
              );
            })}
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                voucherListType: "list",
              })
            }
          >
            <Image
              style={styles.listIcon}
              source={
                voucherListType === "list"
                  ? require("../../assets/image/store/list_btn_on.png")
                  : require("../../assets/image/store/list_btn_off.png")
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                voucherListType: "album",
              })
            }
          >
            <Image
              style={styles.albumIcon}
              source={
                voucherListType === "album"
                  ? require("../../assets/image/store/album_btn_on.png")
                  : require("../../assets/image/store/album_btn_off.png")
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderVoucherList = () => {
    return (
      <View style={{ paddingHorizontal: 20, marginTop: 6.2 }}>
        {newArrival.map((item) => {
          return <VoucherListItem item={item} />;
        })}
      </View>
    );
  };

  renderVoucherAlbum = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 2.2,
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
      >
        {newArrival.map((item) => {
          return <VoucherAlbumItem item={item} />;
        })}
      </View>
    );
  };

  renderToast = () => {
    return (
      <View style={styles.deletePostToast}>
        <Text
          style={{
            fontFamily: Fonts.AppleR,
            fontSize: 14,
            color: "#ffffff",
          }}
        >
          {StoreText.deletePost}
        </Text>
      </View>
    );
  };

  render() {
    const { isShowToast, isShowFilterModal, filterId } = this.state;
    return (
      <>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderVoucherFilterBox()}
          {voucherListType === "list"
            ? this.renderVoucherList()
            : this.renderVoucherAlbum()}
        </ScrollView>
        <TouchableOpacity
          style={{ position: "absolute", bottom: 10, right: 5 }}
        >
          <Image
            style={{ width: 90, height: 90 }}
            source={require("../../assets/image/store/floating_sale_btn.png")}
          />
        </TouchableOpacity>
        <FilterModal
          isShowFilterModal={isShowFilterModal}
          navigation={navigation}
          setVisible={() => this.setState({ isShowFilterModal: false })}
          filters={filters}
          setCurrentFilterId={(currentFilterId) => {
            this.setState({
              filterId: currentFilterId,
            });
          }}
          currentFilterId={filterId}
        />
        {isShowToast && this.renderToast()}
      </>
    );
  }
}

// const mapStateToProps = (state) => ({
//   eSESSION: state.eSESSION.eSESSION,
// });

export default connect(null, null)(Ticket);
