// 스토어 홈
import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import Swiper from "react-native-swiper";

import {StatusBarHeight} from "../../model/lib/Utils/Constants";
import Fonts from "../../model/lib/Utils/Fonts";
import {CodeText, MainText, StoreText, TOKEN} from "../../model/lib/Utils/Strings";
import Colors from "../../model/lib/Utils/Colors";
import {clearAsyncStorage, SALE_MTH_CD} from "../../model/lib/Utils";

import { MainHeader } from "../../component/MainHeader";
import { EventItem } from "../../component/store/EventItem";
import { ProductTitle } from "../../component/store/ProductTitle";
import { BestUsedItem } from "../../component/store/BestUsedItem";
import { NewGoods } from "../../component/store/NewGoods";
import { OutOfProduct } from "../../component/store/OutOfProduct";
import { Product } from "../../component/store/Product";
import { StoreTab } from "../../component/store/StoreTab";
import { CategoryItem } from "../../component/store/CategoryItem";
import { VoucherListItem } from "../../component/store/VoucherListItem";
import { VoucherAlbumItem } from "../../component/store/VoucherAlbumItem";
import FilterModal from "../../component/modal/FilterModal";

import * as ActionGoods from "../../model/action/eGOODS";
import * as ActionPush from "../../model/action/ePUSH";
import * as ActionBasket from "../../model/action/eBASKET";
import * as ActionSession from "../../model/action/eSESSION";
import * as ActionUser from "../../model/action/eUSER";
import * as ActionExchng from "../../model/action/eEXCHNG_VOL";
import {build_type} from "../../model/api";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  categoriesBox: {
    flexDirection: "row",
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7.8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17.8,
    marginLeft: 5,
  },
  category: { fontFamily: Fonts.AppleB, fontSize: 16, letterSpacing: -0.8 },
  storeTabText: {
    fontSize: 14,
    letterSpacing: -0.7,
  },
  storeTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 40,
  },
  storeTab: {
    alignItems: "center",
    justifyContent: "center",
    width: "25%",
    height: 40,
    borderBottomWidth: 3,
  },
  paginationBox: { flexDirection: "row", marginTop: 27, alignItems: "center" },
  progressBar: {
    height: 2.5,
    borderRadius: 15,
    backgroundColor: "rgba(193,193,193,0.6)",
    width: 200,
    marginRight: 10,
  },
  activeSlide: {
    height: 2.5,
    borderRadius: 15,
    backgroundColor: "#333333",
    marginRight: 10,
  },
  page: {
    fontFamily: Fonts.AppleL,
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: -0.6,
    textAlign: "left",
    color: "#969696",
  },
  outOfStockProductsTabs: { flex: 1, flexDirection: "row" },
  outOfStockProductsTab: {
    alignItems: "center",
    justifyContent: "center",

    borderBottomWidth: 3,
    marginRight: 26,
  },
  outOfStockProductsTabText: {
    fontSize: 14,
    lineHeight: 32.5,
  },
  productCategoryBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 5.8,
    borderWidth: 1,
    borderRadius: 2.5,
    height: 27.5,
    marginRight: 7.5,
  },
  productCategoryBtnText: {
    fontSize: 13,
    letterSpacing: -0.65,
  },
  filterBox: {
    width: 55,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  filter: {
    width: 22,
    height: 22,
  },
  productList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 14,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
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
  { title: "전체", type: 0 },
  { title: "즉시구매", type: "EVTTC001" },
  { title: "경매거래", type: "EVTTC002" },
];

const filters = [
  { title: "최신순", id: 1 },
  { title: "최저가순", id: 2 },
  { title: "판매수량순", id: 3 },
  { title: "마감임박순", id: 4 },
];
const exchngFilters = [
  { title: "최신순", id: 1 },
  { title: "최저가순", id: 2 },
  // { title: "입찰많은순", id: 3 },
  { title: "마감임박순", id: 4 },
];

class Store extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSetFilter: false,
      push_cnt: 0,
      cart_cnt: 0,
      categoriesSaleCD: [],
      currentCategoryId: 0,
      currentVoucherCategoryId: 0,
      currentTabIdx: 0,
      currentProductCategoryIdx: 0,
      currentBusinessMallTabIdx: CodeText.goods_se_cd_r,
      activeSlide: 0,
      bannerTopLength: 3,
      outOfStockProductType: 0,

      voucherListType: "list",
      isShowToast: false,
      isShowFilterModal: false,

      banner: [], // 상품배너 (최대 5개)
      best_used_list: [], // 중고상품 BEST (최대 5개)
      new_plan: [], // 새상품 발매 일정 (최대 3개)
      almost_sold_out_used_list: [], // 품절임박 중고 (최대 4개)
      almost_sold_out_new_list: [], // 품절임박 새 (최대 4개)

      offset: 0,
      limit: 100,
      loadMore: true,
      filterId: 1, // sort
      storeList: [],
      exchngList: [],
      use_yn: "N",
    };
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      this.getSession();
      this.getNewPush();
      this.getCartList();
    });
    let newCDList = [{cd_no: 0, cd_nm: "전체"}, ...SALE_MTH_CD]
    this.setState({categoriesSaleCD: newCDList});
    this.getMainStoreList();
    this.getExchngList();
    this.getUse();
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  getSession = () => {
    this.props.getSession({}).then((res) => {
      this.props.setSession(res.account);
    }).catch((err) => { // 409 && 로그아웃
      let errorCode = err.response.data.error.status;
      if(errorCode === 409){
        this.props.logout({}).then((res) => {
          // AsyncStorage.clear();
          clearAsyncStorage().then((result) => console.log("remove All"))
          this.props.setSession({});
          this.props.navigation.navigate("Login");
        }).catch((err) => {
        });
      }
    });
  }

  getNewPush = () => {
    this.props.getNewPush({}).then((res) => {
      this.setState({push_cnt: parseInt(res.count || 0)})
    }).catch((err) => {
    });
  }

  getCartList = () => {
    const {eSESSION} = this.props;
    if(eSESSION.basket_no) {
      let params = {
        skip: 0,
        limit: 100,
        basket_no: eSESSION.basket_no,
        // basket_no: "2021110223585461G95U"
      }
      this.props.getCartList(params).then((res) => {
        this.setState({cart_cnt: parseInt(res.count || 0)})
      }).catch((err) => {
      });
    }
  }

  getMainStoreList = () => {
    this.props.getMainStoreList({}).then((res) => {
      this.setState({
        banner: res.banner,
        best_used_list: res.best_used_list,
        new_plan: res.new_plan,
        almost_sold_out_used_list: res.almost_sold_out_used_list,
        almost_sold_out_new_list: res.almost_sold_out_new_list,
      })
    }).catch((err) => {
    });
  }

  getStoreList = () => {
    // currentTabIdx > 상품홈 : 0, 중고상품 : 1, 새상품 : 2
    // currentBusinessMallTabIdx > 중고상품 : 0, 새상품 : 1
    // currentProductCategoryIdx > 전체 : 1, ...sale_mth_cd
    // 정렬 유형 (1. 최신순(판매 시작) DESC, 2. 가격 ASC, 3. 판매수량 DESC, 4. 마감일 ASC)
    const {currentTabIdx, currentProductCategoryIdx, offset, limit, loadMore, storeList, filterId} = this.state;
    if(loadMore) {
      let params = {
        skip: offset,
        limit: limit,
        sort: filterId,
      }

      if(currentTabIdx)
        Object.assign(params, {goods_se_cd: currentTabIdx})
      if(currentProductCategoryIdx)
        Object.assign(params, {sale_mth_cd: currentProductCategoryIdx})

      console.log("params")
      console.log(params)
      this.props.getStoreList(params).then((res) => {
        if(parseInt(res.count) > (offset + limit))
          this.setState({storeList: [...storeList, ...res.list], offset: offset + limit})
        else
          this.setState({storeList: [...storeList, ...res.list], loadMore: false})
      }).catch((err) => {
      });
    }
  }

  getExchngList = () => {
    const {currentVoucherCategoryId, offset, limit, loadMore, exchngList, filterId} = this.state;
    if(loadMore) {
      let params = {
        skip: offset,
        limit: limit,
        sort: filterId,
      }

      if(currentVoucherCategoryId)
        Object.assign(params, {exchng_vol_trd_typ_cd: currentVoucherCategoryId})

      console.log("params")
      console.log(params)
      this.props.getExchngList(params).then((res) => {
        if(parseInt(res.count) > (offset + limit))
          this.setState({exchngList: [...exchngList, ...res.list], offset: offset + limit})
        else
          this.setState({exchngList: [...exchngList, ...res.list], loadMore: false})
      }).catch((err) => {
      });
    }
  }

  getUse = () => {
    this.props.getUse({}).then((res) => {
      this.setState({use_yn: res.use_yn})
    }).catch((err) => {
    });
  }

  renderCategories = () => {
    {/*상품/교환권 tab*/}
    const { currentCategoryId } = this.state;
    return (
      <View style={styles.categoriesBox}>
        <TouchableOpacity
          style={[
            styles.categoryBtn,
            {
              backgroundColor:
                currentCategoryId === 0 ? "#000000" : "transparent",
            },
          ]}
          onPress={() => this.setState({ currentCategoryId: 0, filterId: 1 })}
        >
          <Text
            style={[
              styles.category,
              { color: currentCategoryId === 0 ? "#f5f5f5" : "#191919" },
            ]}
          >
            상품
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.categoryBtn,
            {
              backgroundColor:
                currentCategoryId === 1 ? "#000000" : "transparent",
            },
          ]}
          onPress={() => this.setState({ currentCategoryId: 1, filterId: 1, currentVoucherCategoryId: 0, loadMore: true, offset: 0, exchngList: [] }, () => this.getExchngList())}
        >
          <Text
            style={[
              styles.category,
              { color: currentCategoryId === 1 ? "#f5f5f5" : "#191919" },
            ]}
          >
            교환권
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderStoreTabs = () => {
    const { navigation, eSESSION } = this.props;
    const { currentTabCD, currentTabIdx } = this.state;
    return (
      <View style={styles.storeTabs}>
        <StoreTab
          title={StoreText.goods}
          isActive={currentTabIdx === 0}
          setActive={() => this.setState({ isSetFilter: false, currentTabIdx: 0, filterId: 1 }, () => this.getMainStoreList())}
          width="25%"
        />
        <StoreTab
          title={StoreText.usedGoods}
          isActive={currentTabIdx === CodeText.goods_se_cd_r}
          setActive={() => this.setState({ isSetFilter: false, filterId: 1, currentTabIdx: CodeText.goods_se_cd_r, offset: 0, loadMore: true, storeList: [], currentProductCategoryIdx: 0 }, () => this.getStoreList())}
          width="25%"
        />
        <StoreTab
          title={StoreText.newGoods}
          isActive={currentTabIdx === CodeText.goods_se_cd_n}
          setActive={() => this.setState({ isSetFilter: false, filterId: 1, currentTabIdx: CodeText.goods_se_cd_n, offset: 0, loadMore: true, storeList: [], currentProductCategoryIdx: 0 }, () => this.getStoreList())}
          width="25%"
        />
        {eSESSION.mber_se_cd === CodeText.mber_se_cd_c && (
          <TouchableOpacity
            style={[
              styles.storeTab,
              {
                borderBottomColor: "transparent",
              },
            ]}
            onPress={() =>
                navigation.push("StoreBusiness")
                // this.setState({ isShowBusinessMallModal: true, loadMore: true, offset: 0, storeList: [] }, () => this.getStoreList())
            }
          >
            <Image
              style={{ width: 55.5, height: 15.5 }}
              source={require("../../assets/image/store/b_2_b_mall_btn.png")}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  renderStoreHome = () => {
    {/* 상품홈 */}
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {this.renderEventCarousel()}
        {this.renderBestUsedGoods()}
        {this.renderNewGoodsReleaseSchedule()}
        {this.renderOutOfStockProduct()}
        <View style={{ height: 50 }} />
      </ScrollView>
    );
  };

  renderEventCarousel = () => {
    const {navigation, eCOMM_CD} = this.props;
    const { activeSlide, banner } = this.state;
    let listLength = (banner || []).length || 1
    return (
      <View style={{ alignItems: "center" }}>
        <Swiper
          style={{ height: 410 }}
          loop={false}
          key={banner.length}
          showsPagination={false}
          onIndexChanged={(index) => {
            this.setState({activeSlide: index})
          }}
        >
          {banner.map((item) => {
            return <EventItem navigation={navigation} item={item} eCOMM_CD={eCOMM_CD} />;
          })}
        </Swiper>
        <View style={styles.paginationBox}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.activeSlide,
                { width: (200 / listLength) * (activeSlide + 1) },
              ]}
            />
          </View>
          <Text style={styles.page}>
            <Text style={{ color: "#191919" }}>{activeSlide + 1}</Text>/
            {listLength}
          </Text>
        </View>
      </View>
    );
  };

  renderBestUsedGoods = () => {
    const {navigation} = this.props;
    const {best_used_list} = this.state;
    return (
      <View style={{ marginTop: 50, paddingLeft: 20 }}>
        <ProductTitle title={`${StoreText.usedGoods} BEST`} />
        <FlatList
          data={best_used_list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return <BestUsedItem navigation={navigation} item={item} />;
          }}
          keyExtractor={(_, i) => String(i)}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
        />
      </View>
    );
  };

  renderNewGoodsReleaseSchedule = () => {
    const {eCOMM_CD, navigation} = this.props;
    const {new_plan} = this.state;
    return (
      <View style={{ marginTop: 50, paddingLeft: 20 }}>
        <ProductTitle
          title={`${StoreText.newGoods} ${StoreText.releaseSchedule}`}
        />
        <FlatList
          data={new_plan}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return <NewGoods navigation={navigation} item={item} eCOMM_CD={eCOMM_CD} />;
          }}
          keyExtractor={(_, i) => String(i)}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
        />
      </View>
    );
  };

  renderOutOfStockProduct = () => {
    const {navigation} = this.props;
    const { outOfStockProductType, almost_sold_out_used_list, almost_sold_out_new_list } = this.state;
    const product_list = outOfStockProductType === 0 ? almost_sold_out_used_list : almost_sold_out_new_list
    const OutOfStockProductTabs = () => {
      return (
        <View style={styles.outOfStockProductsTabs}>
          <TouchableOpacity
            style={[
              styles.outOfStockProductsTab,
              {
                borderBottomColor:
                  outOfStockProductType === 0 ? "#333333" : "transparent",
              },
            ]}
            onPress={() => this.setState({ outOfStockProductType: 0 })}
          >
            <Text
              style={[
                styles.outOfStockProductsTabText,
                {
                  fontFamily:
                    outOfStockProductType === 0 ? Fonts.AppleB : Fonts.AppleR,
                  color: outOfStockProductType === 0 ? "#333333" : "#595959",
                },
              ]}
            >
              {MainText.usedGoods}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.outOfStockProductsTab,
              {
                borderBottomColor:
                  outOfStockProductType === 1 ? "#333333" : "transparent",
              },
            ]}
            onPress={() => this.setState({ outOfStockProductType: 1 })}
          >
            <Text
              style={[
                styles.outOfStockProductsTabText,
                {
                  fontFamily:
                    outOfStockProductType === 1 ? Fonts.AppleB : Fonts.AppleR,
                  color: outOfStockProductType === 1 ? "#333333" : "#595959",
                },
              ]}
            >
              {MainText.newGoods}
            </Text>
          </TouchableOpacity>
        </View>
      );
    };
    return (
      <View style={{ marginTop: 50, paddingHorizontal: 20 }}>
        <ProductTitle title={StoreText.outOfStockProducts} />
        <OutOfStockProductTabs />
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 14,
            justifyContent: "space-between",
          }}
        >
          {product_list.map((item) => {
            return <OutOfProduct navigation={navigation} item={item} />;
          })}
        </View>
      </View>
    );
  };

  renderProductsCategories = () => {
    const {eSESSION} = this.props;
    const { isSetFilter, currentProductCategoryIdx, categoriesSaleCD } = this.state;
    return (
      <FlatList
        data={categoriesSaleCD}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <CategoryItem
              title={item.cd_nm}
              isActive={currentProductCategoryIdx === item.cd_no}
              setSelectedCategoryId={() =>
                this.setState({
                  isSetFilter: false,
                  filterId: 1,
                  currentProductCategoryIdx: item.cd_no,
                  storeList: [],
                  offset: 0,
                  loadMore: true
                }, () => this.getStoreList())
              }
            />
          );
        }}
        ListHeaderComponent={() => {
          return (
            <TouchableOpacity
              style={styles.filterBox}
              onPress={() => this.setState({ isShowFilterModal: true })}
            >
              {isSetFilter ? <View style={{position: "absolute", top: 10, right: 10, backgroundColor: Colors.MAIN_COLOR, width: 7, height: 7, borderRadius: 5}} /> : null}
              <Image
                source={isSetFilter ? require("../../assets/image/store/filter_btn.png") : require("../../assets/image/store/filter_default_btn.png")}
                style={styles.filter}
              />
            </TouchableOpacity>
          );
        }}
        keyExtractor={(_, i) => String(i)}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={{ height: 55 }}
        contentContainerStyle={{ alignItems: "center" }}
      />
    );
  };

  renderProductList = () => {
    const { navigation } = this.props;
    const {storeList} = this.state;
    return (
      <View style={styles.productList}>
        {storeList.map((item) => {
          return <Product item={item} navigation={navigation} />;
        })}
      </View>
    );
  };

  renderUsedGoods = () => {
    {/* 중고상품 */}
    return (
      <ScrollView
          onMomentumScrollEnd={this.getStoreList}
          showsVerticalScrollIndicator={false}>
        {this.renderProductsCategories()}
        {this.renderProductList()}
      </ScrollView>
    );
  };

  renderNewGoods = () => {
    {/* 새상품 */}
    return (
      <ScrollView
          onMomentumScrollEnd={this.getStoreList}
          showsVerticalScrollIndicator={false}>
        {this.renderProductsCategories()}
        {this.renderProductList()}
      </ScrollView>
    );
  };

  renderVoucherPage = () => {
    const { navigation } = this.props;
    const { voucherListType } = this.state;
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
          onPress={() => navigation.navigate("TicketSale")}
        >
          <Image
            style={{ width: 90, height: 90 }}
            source={require("../../assets/image/store/floating_sale_btn.png")}
          />
        </TouchableOpacity>
      </>
    );
  };

  renderVoucherFilterBox = () => {
    const { currentVoucherCategoryId, voucherListType, isSetFilter } = this.state;
    return (
      <View style={styles.voucherFilterBox}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.voucherFilter}
            onPress={() => this.setState({ isShowFilterModal: true })}
          >
            {isSetFilter ? <View style={{position: "absolute", top: 10, right: 0, backgroundColor: Colors.MAIN_COLOR, width: 7, height: 7, borderRadius: 5}} /> : null}
            <Image
              source={isSetFilter ? require("../../assets/image/store/filter_btn.png") : require("../../assets/image/store/filter_default_btn.png")}
              style={styles.filter}
            />
          </TouchableOpacity>
          <View style={styles.rowCenter}>
            {voucherCategories.map((voucherCategory) => {
              return (
                <CategoryItem
                  title={voucherCategory.title}
                  isActive={currentVoucherCategoryId === voucherCategory.type}
                  setSelectedCategoryId={() =>
                    this.setState({
                      isSetFilter: false,
                      currentVoucherCategoryId: voucherCategory.type,
                      filterId: 1,
                      exchngList: [],
                      offset: 0,
                      loadMore: true
                    }, () => this.getExchngList())
                  }
                />
              );
            })}
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => this.setState({voucherListType: "list",})}>
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

  setIsShowToast = () => {
    this.setState({isShowToast: true});
    setTimeout(() => {
      this.setState({isShowToast: false});
    }, 3000);
  }

  renderVoucherList = () => {
    const { navigation } = this.props;
    const {exchngList} = this.state;
    return (
      <View style={{ paddingHorizontal: 20, marginTop: 6.2 }}>
        {exchngList.map((item, index) => {
          return <VoucherListItem key={`exchng_${index}`} item={item} navigation={navigation} setIsShowToast={this.setIsShowToast} />;
        })}
      </View>
    );
  };

  renderVoucherAlbum = () => {
    const { navigation } = this.props;
    const {exchngList} = this.state;
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
        {exchngList.map((item, index) => {
          return <VoucherAlbumItem key={`exchng_${index}`} item={item} navigation={navigation} setIsShowToast={this.setIsShowToast} />;
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
    const { eSESSION, navigation } = this.props;
    const {
      push_cnt,
      cart_cnt,
      currentCategoryId,
      currentTabIdx,
      isShowToast,
      isShowFilterModal,
      filterId,
      use_yn
    } = this.state;

    return (
      <View style={styles.container}>
        <View style={{ height: StatusBarHeight }} />
        <MainHeader navigation={navigation} eSESSION={eSESSION} push_cnt={push_cnt} cart_cnt={cart_cnt} />
        {build_type === TOKEN.build_type_txt && eSESSION.mber_se_cd === CodeText.mber_se_cd_g && use_yn === "Y" && this.renderCategories()}
        {currentCategoryId === 0 ? this.renderStoreTabs() : null}
        {currentCategoryId === 0
          ? currentTabIdx === 0
            ? this.renderStoreHome()
            : currentTabIdx === CodeText.goods_se_cd_r
            ? this.renderUsedGoods()
            : this.renderNewGoods()
          : this.renderVoucherPage()}
        <FilterModal
          isShowFilterModal={isShowFilterModal}
          navigation={navigation}
          setVisible={() => this.setState({ isShowFilterModal: false })}
          filters={currentCategoryId === 0 ? filters : exchngFilters}
          setCurrentFilterId={(currentFilterId) => {
            this.setState({
              isSetFilter: true,
              filterId: currentFilterId,
              storeList: [],
              exchngList: [],
              offset: 0,
              loadMore: true,
            }, () => currentCategoryId === 0 ? this.getStoreList() : this.getExchngList());
          }}
          currentFilterId={filterId}
        />
        {isShowToast && this.renderToast()}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  eSESSION: state.eSESSION.eSESSION,
  eCOMM_CD: state.eCOMM_CD.eCOMM_CD,
  eCOMM_CD_TYPE: state.eCOMM_CD.eCOMM_CD_TYPE,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  getStoreList: (params) => dispatch(ActionGoods.getStoreList(params)),
  getMainStoreList: (params) => dispatch(ActionGoods.getMainStoreList(params)),
  getNewPush: (params) => dispatch(ActionPush.getNew(params)),
  getCartList: (params) => dispatch(ActionBasket.getList(params)),

  getSession: (params) => dispatch(ActionSession.getSession(params)),
  setSession: (params) => dispatch(ActionSession.setSession(params)),
  logout: (params) => dispatch(ActionUser.logout(params)),

  /* EXCHNG 2차 개발 */
  getExchngList: (params) => dispatch(ActionExchng.getStoreList(params)),
  getUse: (params) => dispatch(ActionExchng.getUse(params)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Store);
