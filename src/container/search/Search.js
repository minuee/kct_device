// 검색 관련 화면
import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
  FlatList,
  ScrollView,
  BackHandler
} from "react-native";
import {StatusBarHeight} from "../../model/lib/Utils/Constants";
import {connect} from "react-redux";
import {build_type} from "../../model/api";

import Fonts from "../../model/lib/Utils/Fonts";
import {CodeText, SearchText, TOKEN} from "../../model/lib/Utils/Strings";
import {notifyMessage} from "../../model/lib/Utils";

import TextInputStr from "../../common/textinput/TextInput";
import { RecentSearchesItem } from "../../component/search/RecentSearchesItem";
import { SearchTab } from "../../component/search/SearchTab";
import { ProductListItem } from "../../component/search/ProductListItem";
import { TicketListItem } from "../../component/search/TicketListItem";
import { TagListItem } from "../../component/search/TagListItem";
import { ProductTab } from "../../component/search/ProductTab";
import { SmallProductListItem } from "../../component/search/SmallProductListItem";
import FilterModal from "../../component/modal/FilterModal";
import { ImageTagListItem } from "../../component/search/ImageTagListItem";

import * as ActionTag from "../../model/action/eTAG";
import * as ActionSearch from "../../model/action/eSRCHWRD";
import * as ActionGoods from "../../model/action/eGOODS";
import * as ActionExchng from "../../model/action/eEXCHNG_VOL"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  statusBar: { height: StatusBarHeight },
  backBtnBox: {
    width: 50,
    paddingLeft: 20,
    justifyContent: "center",
    height: 50,
  },
  searchTitle: {
    fontFamily: Fonts.AppleL,
    fontSize: 21,
    lineHeight: 27.5,
    letterSpacing: -1.05,
    color: "#000000",
  },
  textForm: {
    fontFamily: Fonts.AppleL,
    fontSize: 15,
    letterSpacing: -0.38,
    color: "#000000",
    padding: 0
  },
  betweenCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recentSearchesTitle: {
    fontFamily: Fonts.AppleB,
    fontSize: 15,
    letterSpacing: -0.38,
    color: "#222222",
  },
  deleteBtn: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#999999",
    textDecorationLine: "underline",
  },
  searchBox: {
    height: 33,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 23,
  },
  activeSearchBox: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  activeBackBtnBox: {
    justifyContent: "center",
    height: 50,
  },
  headerTitle: {
    fontFamily: Fonts.AppleB,
    fontSize: 21,
    letterSpacing: -1.05,
    color: "#000000",
  },
  filter: {
    fontFamily: Fonts.AppleM,
    fontSize: 13,
    letterSpacing: -0.65,
    color: "#595959",
  },
  productNum: {
    fontFamily: Fonts.AppleB,
    fontSize: 15,
    letterSpacing: -0.3,
    color: "#000000",
  },
  flexWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 14,
    justifyContent: "space-between",
  },
});

const sortFilters2 = [ // (1. 최신순(판매 시작) DESC, 2. 가격 ASC, 3. 판매수량 DESC, 4. 마감일 ASC, 5. 상품명 ASC, 6. 상품명 DESC)
  { title: "최신순", id: 1 },
  { title: "최저가순", id: 2 },
  { title: "판매수량순", id: 3 },
  { title: "마감임박순", id: 4 },
];

const sortFilters1 = [
  { title: SearchText.all, id: "" },
  { title: SearchText.buyNow, id: CodeText.sale_mth_cd_i },
  { title: SearchText.auctionDeal, id: CodeText.sale_mth_cd_a },
  { title: SearchText.buyReserve, id: CodeText.sale_mth_cd_r },
  { title: SearchText.groupPurchase, id: CodeText.sale_mth_cd_g },
];

const tagFilters = [
  { title: "최근 등록순", id: 4 },
  { title: "최신업데이트순", id: 8 },
  { title: "구독자순", id: 10 },
  { title: "게시물순", id: 6 },
];

const exchngFilters = [
  { title: "최신순", id: 1 },
  { title: "최저가순", id: 2 },
  { title: "마감임박순", id: 4 },
];

const exchngFilters1 = [
  { title: SearchText.all, id: "" },
  { title: SearchText.buyNow, id: CodeText.exchng_vol_trd_typ_cd_i },
  { title: SearchText.auctionDeal, id: CodeText.exchng_vol_trd_typ_cd_a },
];

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      isSearching: false,
      currentSearchTabIdx: 0,
      currentProductTabIdx: 1,
      filterType: 1,

      recentlySearch: [], // 최근 검색 기록
      goodsList: [], // 상품 검색 목록
      goods_count: 0, // 상품 검색 개수
      tagList: [], // 태그 검색 목록
      tag_count: 0, // 태그 검색 개수
      exchngList: [], // 교환권 검색 목록
      exchng_count: 0, // 교환권 검색 개수

      offset: 0,
      limit: 100,
      loadMore: true,
      sale_mth_cd: "", // 거래경매 코드
      sort_g: 1, // 상품 sort
      sort_t: 4, // 태그 sort


      exchng_vol_trd_typ_cd: "", // 교환권 코드
      sort_e: 1, // 교환권 sort
    };
  }

  componentDidMount() {
    this.setRecentlySearch(); // 최근 검색 기록
    this._searchListener = BackHandler.addEventListener(
        "hardwareBackPress",
        () => this.handleBackPress()
    );
  }

  componentWillUnmount() {
    this._searchListener.remove();
  }

  handleBackPress = () => {
    const {navigation} = this.props;
    const {isSearching} = this.state;
    if(isSearching)
      this.setState({isSearching: false}, () => this.setRecentlySearch());
    else navigation.goBack();
    return true;
  }

  setRecentlySearch = () => {
    let params = {
      skip: 0,
      limit: 5,
    }
    this.props.getSearchList(params).then((res) => {
      this.setState({recentlySearch: res.list});
    }).catch((err) => {
    });
  };

  handleCreate = () => {
    const {searchText} = this.state;
    let params = {
      search: searchText
    }
    this.props.create(params).then((res) => {
    }).catch((err) => {
    });
  }

  handleDelete = (srchwrd_no) => {
    let params = {
      srchwrd_no: srchwrd_no
    }
    this.props.remove(params).then((res) => {
      this.setState({recentlySearch: res.list});
    }).catch((err) => {
    });
  };

  getSearchList = () => {
    this.handleCreate();
    this.getGoodsList();
    this.getTagList();
    this.getExchngList();
  }

  getGoodsList = () => {
    const {currentProductTabIdx, offset, limit, searchText, sale_mth_cd, goodsList, loadMore, sort_g} = this.state;
    if(loadMore) {
      let params = {
        skip: offset,
        limit: limit,
        goods_se: currentProductTabIdx,
        sort: sort_g
      }

      if(sale_mth_cd !== "")
        Object.assign(params, {sale_mth_cd: sale_mth_cd})

      if(searchText !== "")
        Object.assign(params, {goods_nm: searchText})

      this.props.getGoodsList(params).then((res) => {
        if(parseInt(res.count) > (offset + limit))
          this.setState({goodsList: [...goodsList, ...res.list], isSearching: true, offset: offset + limit, goods_count: parseInt(res.count)})
        else
          this.setState({goodsList: [...goodsList, ...res.list], isSearching: true, loadMore: false, goods_count: parseInt(res.count)})
      }).catch((err) => {
      });
    }
  }

  getTagList = () => {
    const {offset, limit, searchText, tagList, loadMore, sort_t} = this.state;
    if(loadMore) {
      let params = {
        skip: offset,
        limit: limit,
        sort: sort_t
      }

      if(searchText !== "")
        Object.assign(params, {tag_nm: searchText})

      this.props.getTagList(params).then((res) => {
        if(parseInt(res.count) > (offset + limit))
          this.setState({tagList: [...tagList, ...res.list], isSearching: true, offset: offset + limit, tag_count: parseInt(res.count)})
        else
          this.setState({tagList: [...tagList, ...res.list], isSearching: true, loadMore: false, tag_count: parseInt(res.count)})
      }).catch((err) => {
      });
    }
  }

  getExchngList = () => {
    const {currentProductTabIdx, offset, limit, searchText, exchng_vol_trd_typ_cd, exchngList, loadMore, sort_e} = this.state;
    if(loadMore) {
      let params = {
        skip: offset,
        limit: limit,
        goods_se: currentProductTabIdx,
        sort: sort_e
      }

      if(exchng_vol_trd_typ_cd !== "")
        Object.assign(params, {exchng_vol_trd_typ_cd})

      if(searchText !== "")
        Object.assign(params, {goods_nm: searchText})

      this.props.getExchngList(params).then((res) => {
        if(parseInt(res.count) > (offset + limit))
          this.setState({exchngList: [...exchngList, ...res.list], isSearching: true, offset: offset + limit, exchng_count: parseInt(res.count)})
        else
          this.setState({exchngList: [...exchngList, ...res.list], isSearching: true, loadMore: false, exchng_count: parseInt(res.count)})
      }).catch((err) => {
      });
    }
  }

  renderSearchBox = () => {
    const { searchText } = this.state;
    return (
      <View style={{ marginTop: 38.2 }}>
        <Text style={styles.searchTitle}>{SearchText.searchTitle}</Text>
        <View style={styles.searchBox}>
          <TextInputStr
            boxStyle={{ flex: 1 }}
            textForm={styles.textForm}
            placeholder={SearchText.placeholder}
            placeholderTextColor="#999999"
            value={searchText}
            setValue={(str) => this.setState({ searchText: str })}
            onSubmitEditing={() => {
              searchText !== "" ?
                this.setState({loadMore: true, offset: 0, goodsList: [], tagList: []}, () => this.getSearchList())
                  : notifyMessage(SearchText.placeholder)
            }}
          />
          <TouchableOpacity
            onPress={() => searchText !== "" ? this.setState({loadMore: true, offset: 0, goodsList: [], tagList: []}, () => this.getSearchList()) : notifyMessage(SearchText.placeholder)}
          >
            <Image
              source={require("../../assets/image/search/search_btn.png")}
              style={{ width: 21, height: 21.5 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderRecentSearchList = () => {
    const {recentlySearch} = this.state;
    return (
      <FlatList
        data={recentlySearch}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return <RecentSearchesItem
              item={item}
              handleDelete={this.handleDelete}
              setRecentlySearch={this.setRecentlySearch}
              getSearchList={(srchwrd) => {
                this.setState({searchText: srchwrd, offset: 0, goodsList: [], tagList: [], loadMore: true}, () => this.getSearchList())
              }}
          />;
        }}
        keyExtractor={(_, i) => String(i)}
        ListHeaderComponent={() => {
          return (
            <View style={[styles.betweenCenter, { marginBottom: 20 }]}>
              <Text style={styles.recentSearchesTitle}>
                {SearchText.latestSearchText}
              </Text>
              <TouchableOpacity
              onPress={() => {
                recentlySearch.map((item) => this.handleDelete(item.srchwrd_no))
              }}>
                <Text style={styles.deleteBtn}>{SearchText.allDelete}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        style={{ marginTop: 52 }}
      />
    );
  };

  renderActiveSearchBox = () => {
    const { navigation } = this.props;
    const { searchText } = this.state;
    return (
      <View style={styles.activeSearchBox}>
        <TouchableOpacity
          style={styles.activeBackBtnBox}
          onPress={() => this.handleBackPress()}
        >
          <Image
            // source={require("../../assets/image/common/arrow_back.png")}
            source={require("../../assets/image/search/previous_search.png")}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <TextInputStr
          boxStyle={{ flex: 1, paddingLeft: 5 }}
          textForm={styles.textForm}
          placeholder={searchText}
          placeholderTextColor="#000000"
          value={searchText}
          setValue={(str) => this.setState({ searchText: str })}
          onSubmitEditing={() => {
            searchText !== "" ?
              this.setState({loadMore: true, offset: 0, goodsList: [], tagList: []}, () => this.getSearchList())
                : notifyMessage(SearchText.placeholder)
          }}
        />
        <TouchableOpacity
          onPress={() => this.setState({ searchText: "" })}
        >
          <Image
            source={require("../../assets/image/search/text_delete_btn.png")}
            style={{ width: 14, height: 14 }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderSearchTabs = () => {
    const { currentSearchTabIdx } = this.state;
    return (
      <View
        style={[
          styles.betweenCenter,
          { justifyContent: "flex-start", marginTop: 17, marginHorizontal: 20, paddingBottom: 15 },
        ]}
      >
        <SearchTab
          title={SearchText.allSearch}
          isActive={currentSearchTabIdx === 0}
          setCurrentSearchTabIdx={() =>
            this.setState({ currentSearchTabIdx: 0, loadMore: true, offset: 0, goodsList: [], tagList: [], exchngList: [] }, () => this.getSearchList())
          }
        />
        <SearchTab // 상품검색
          title={SearchText.product}
          isActive={currentSearchTabIdx === 1}
          setCurrentSearchTabIdx={() =>
            this.setState({ currentSearchTabIdx: 1, loadMore: true, offset: 0, goodsList: [] }, () => this.getGoodsList())
          }
        />
        {build_type === TOKEN.build_type_txt && (
          <SearchTab // 1차 개발범위 제외
            title={SearchText.ticket}
            isActive={currentSearchTabIdx === 2}
            setCurrentSearchTabIdx={() =>
                this.setState({ currentSearchTabIdx: 2, loadMore: true, offset: 0, exchngList: [] }, () => this.getExchngList())
            }
          />
        )}
        <SearchTab // 태그검색
          title={SearchText.tag}
          isActive={currentSearchTabIdx === 3}
          setCurrentSearchTabIdx={() =>
            this.setState({ currentSearchTabIdx: 3, loadMore: true, offset: 0, tagList: [] }, () => this.getTagList())
          }
        />
      </View>
    );
  };

  renderListHeader = (title, index) => {
    // index 1: 상품, 2: 교환권, 3: 태그
    return (
      <View style={styles.betweenCenter}>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity
        onPress={() => {
          if(index === 1)
            this.setState({currentSearchTabIdx: index, offset: 0, tagList: [], goodsList: [], exchngList: [], loadMore: true}, () => this.getGoodsList())
          if(index === 2)
            this.setState({currentSearchTabIdx: index, offset: 0, tagList: [], goodsList: [], exchngList: [], loadMore: true}, () => this.getExchngList())
          if(index === 3)
            this.setState({currentSearchTabIdx: index, offset: 0, tagList: [], goodsList: [], exchngList: [], loadMore: true}, () => this.getTagList())
        }}>
          <Image
            source={require("../../assets/image/search/more_chevron.png")}
            style={{ width: 20, height: 20, marginRight: 20 }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderProducts = () => {
    const {navigation} = this.props;
    const {goodsList} = this.state;
    return (
      <View style={{ marginTop: 7, marginLeft: 20 }}>
        {this.renderListHeader(SearchText.product, 1)}
        <FlatList
          data={goodsList.slice(0, 5)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return <ProductListItem navigation={navigation} item={item} />;
          }}
          keyExtractor={(_, i) => String(i)}
          style={{ marginTop: 12 }}
          horizontal={true}
        />
      </View>
    );
  };

  renderTicketProducts = () => {
    const {navigation} = this.props;
    const {exchngList} = this.state;
    return (
      <View style={{ marginTop: 50, marginLeft: 20 }}>
        {this.renderListHeader(SearchText.ticket, 2)}
        {exchngList.map((item) => {
          return <TicketListItem item={item} navigation={navigation} />;
        })}
      </View>
    );
  };

  renderTags = () => {
    const {navigation} = this.props;
    const {tagList} = this.state;
    return (
      <View style={{ marginTop: 40, marginLeft: 20, marginBottom: 64.5 }}>
        {this.renderListHeader(SearchText.tag, 3)}
        <View style={{ height: 14 }} />
        {tagList.slice(0, 5).map((product) => {
          return <TagListItem navigation={navigation} item={product} />;
        })}
      </View>
    );
  };

  renderFilterHeader = () => {
    const { currentSearchTabIdx, goods_count, tag_count, exchng_count, sale_mth_cd, sort_t, sort_g, exchng_vol_trd_typ_cd, sort_e } = this.state;
    return (
      <View style={[styles.betweenCenter, { marginTop: 25 }]}>
        <Text style={styles.productNum}>
          {`${currentSearchTabIdx === 3 ? tag_count : currentSearchTabIdx === 2 ? exchng_count : goods_count}`}개{" "}
          <Text
            style={{
              fontFamily: Fonts.AppleL,
              fontSize: 15,
              color: "#969696",
            }}
          >
            {`의 ${currentSearchTabIdx === 3 ? SearchText.tag : currentSearchTabIdx === 2 ? SearchText.ticket : SearchText.product}`}
          </Text>
        </Text>
        {currentSearchTabIdx === 3 ? ( // 태그
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() =>
              this.setState({ isShowFilterModal: true, filterType: 3 })
            }
          >
            <Text style={styles.filter}>{tagFilters.filter((item) => item.id === sort_t)[0]?.title}</Text>
            <Image
              source={require("../../assets/image/search/dropdown_btn_small.png")}
              style={{ width: 17, height: 17 }}
            />
          </TouchableOpacity>
        ) : currentSearchTabIdx === 2 ? ( // 교환권
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                  onPress={() =>
                      this.setState({ isShowFilterModal: true, filterType: 4 })
                  }
              >
                <Text style={styles.filter}>{sale_mth_cd === "" ? "거래방식" : exchngFilters1.filter((item) => item.id === exchng_vol_trd_typ_cd)[0]?.title}</Text>
                <Image
                    source={require("../../assets/image/search/dropdown_btn_small.png")}
                    style={{ width: 17, height: 17 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() =>
                      this.setState({ isShowFilterModal: true, filterType: 5 })
                  }
              >
                <Text style={styles.filter}>{exchngFilters.filter((item) => item.id === sort_e)[0]?.title}</Text>
                <Image
                    source={require("../../assets/image/search/dropdown_btn_small.png")}
                    style={{ width: 17, height: 17 }}
                />
              </TouchableOpacity>
            </View>
        ) : ( // 상품
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 10,
              }}
              onPress={() =>
                this.setState({ isShowFilterModal: true, filterType: 1 })
              }
            >
              <Text style={styles.filter}>{sale_mth_cd === "" ? "거래방식" : sortFilters1.filter((item) => item.id === sale_mth_cd)[0]?.title}</Text>
              <Image
                source={require("../../assets/image/search/dropdown_btn_small.png")}
                style={{ width: 17, height: 17 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() =>
                this.setState({ isShowFilterModal: true, filterType: 2 })
              }
            >
              <Text style={styles.filter}>{sortFilters2.filter((item) => item.id === sort_g)[0]?.title}</Text>
              <Image
                source={require("../../assets/image/search/dropdown_btn_small.png")}
                style={{ width: 17, height: 17 }}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  renderProductTabs = () => {
    const {eSESSION} = this.props;
    const { currentProductTabIdx } = this.state;
    return (
      <View
        style={[styles.betweenCenter, { marginTop: 5, marginHorizontal: 20,
          borderBottomColor: "#dddddd",
          borderBottomWidth: 0.5}]}
      >
        <ProductTab
          title={SearchText.all}
          isActive={currentProductTabIdx === 1}
          setCurrentProductTabIdx={() =>
            this.setState({ currentProductTabIdx: 1, offset: 0, loadMore: true, goodsList: [] }, () => this.getGoodsList())
          }
        />
        <ProductTab
          title={SearchText.usedGoods}
          isActive={currentProductTabIdx === 3}
          setCurrentProductTabIdx={() =>
            this.setState({ currentProductTabIdx: 3, offset: 0, loadMore: true, goodsList: [] }, () => this.getGoodsList())
          }
        />
        <ProductTab
          title={SearchText.newGoods}
          isActive={currentProductTabIdx === 2}
          setCurrentProductTabIdx={() =>
            this.setState({ currentProductTabIdx: 2, offset: 0, loadMore: true, goodsList: [] }, () => this.getGoodsList())
          }
        />
        {eSESSION.mber_se_cd === CodeText.mber_se_cd_c && (
          <ProductTab
            title={null}
            isActive={currentProductTabIdx === 4}
            setCurrentProductTabIdx={() =>
              this.setState({ currentProductTabIdx: 4, offset: 0, loadMore: true, goodsList: [] }, () => this.getGoodsList())
            }
          />
        )}
      </View>
    );
  };

  renderProductList = () => {
    const {eCOMM_CD, navigation} = this.props;
    const {goodsList, currentProductTabIdx} = this.state;
    return (
      <View style={{ marginHorizontal: 20 }}>
        {this.renderFilterHeader()}
        {goodsList.length === 0 && (
            <View
                style={{
                  alignItems: "center",
                  marginTop: 100,
                }}
            >
              <Image
                  style={{ width: 120, height: 120 }}
                  source={require("../../assets/image/search/search_empty.png")}
              />
              <Text
                  style={{
                    fontFamily: Fonts.AppleR,
                    fontSize: 16,
                    color: "#c1c1c1",
                    marginTop: 34,
                  }}
              >
                {SearchText.empty}
              </Text>
            </View>
        )}
        <View style={styles.flexWrap}>
          {goodsList.map((item) => {
            return <SmallProductListItem navigation={navigation} eCOMM_CD={eCOMM_CD} item={item} tabIdx={currentProductTabIdx} />;
          })}
        </View>
      </View>
    );
  };

  renderTicketProductList = () => {
    const {navigation} = this.props;
    const {exchngList} = this.state;
    return (
      <View style={{ marginHorizontal: 20 }}>
        {this.renderFilterHeader()}
        {exchngList.map((item) => {
          return <TicketListItem item={item} navigation={navigation} />;
        })}
      </View>
    );
  };

  renderTagList = () => {
    const {navigation} = this.props;
    const {tagList} = this.state;
    return (
      <View style={{ marginHorizontal: 20 }}>
        {this.renderFilterHeader()}
        {tagList.map((tag) => {
          return <ImageTagListItem navigation={navigation} item={tag} />;
        })}
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const {
      isSearching,
      currentSearchTabIdx,
      currentProductTabIdx,
      isShowFilterModal,
      filterType,
      tagList,
      goodsList,
      sale_mth_cd,
      sort_g,
      sort_t,
      exchngList,
      exchng_count,
      exchng_vol_trd_typ_cd,
      sort_e
    } = this.state;

    const isEmpty =
        (currentSearchTabIdx === 0 && goodsList.length === 0 && tagList.length === 0)
        || (currentSearchTabIdx === 1 && currentProductTabIdx === 1 && goodsList.length === 0)
        || (currentSearchTabIdx === 2 && exchngList.length === 0)
        || (currentSearchTabIdx === 3 && tagList.length === 0)

    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        {isSearching ? (
          <View style={{ flex: 1 }}>
            {this.renderActiveSearchBox()}
            {this.renderSearchTabs()}
            {isEmpty && (
                <View
                    style={{
                      alignItems: "center",
                      marginTop: 100,
                    }}
                >
                  <Image
                      style={{ width: 120, height: 120 }}
                      source={require("../../assets/image/search/search_empty.png")}
                  />
                  <Text
                      style={{
                        fontFamily: Fonts.AppleR,
                        fontSize: 16,
                        color: "#c1c1c1",
                        marginTop: 34,
                      }}
                  >
                    {SearchText.empty}
                  </Text>
                </View>
            )}
            {!isEmpty && (
              <ScrollView
                  style={{ flex: 1 }}
                  showsVerticalScrollIndicator={false}
                  onMomentumScrollEnd={currentSearchTabIdx === 1 ? this.getGoodsList : currentSearchTabIdx === 3 ? this.getTagList : this.getExchngList}>
                {currentSearchTabIdx === 0 ? (
                  <>
                    {this.renderProducts()}
                    {build_type === TOKEN.build_type_txt && this.renderTicketProducts()}
                    {this.renderTags()}
                  </>
                ) : currentSearchTabIdx === 1 ? (
                  <>
                    <View>
                      {this.renderProductTabs()}
                      {this.renderProductList()}
                    </View>
                  </>
                ) : currentSearchTabIdx === 2 ? (
                  this.renderTicketProductList()
                ) : (
                  this.renderTagList()
                )}
              </ScrollView>
            )}

            <FilterModal
              isShowFilterModal={isShowFilterModal}
              navigation={navigation}
              setVisible={() => this.setState({ isShowFilterModal: false })}
              filters={
                filterType === 1 ? sortFilters1
                  : filterType === 2 ? sortFilters2
                        : filterType === 4 ? exchngFilters1
                            : filterType === 5 ? exchngFilters
                  : tagFilters
              }
              setCurrentFilterId={(currentFilterId) => {
                if (filterType === 1) { // 상품 거래방식 필터
                  this.setState({
                    sale_mth_cd: currentFilterId,
                    offset: 0,
                    loadMore: true,
                    goodsList: []
                  }, () => this.getGoodsList());
                } else if (filterType === 2) { // 상품 sort 필터
                  this.setState({
                    sort_g: currentFilterId,
                    offset: 0,
                    loadMore: true,
                    goodsList: []
                  }, () => this.getGoodsList());
                } else if (filterType === 4) { // 교환권 거래방식 필터
                  this.setState({
                    exchng_vol_trd_typ_cd: currentFilterId,
                    offset: 0,
                    loadMore: true,
                    exchngList: []
                  }, () => this.getExchngList());
                } else if (filterType === 5) { // 교환권 sort 필터
                  this.setState({
                    sort_e: currentFilterId,
                    offset: 0,
                    loadMore: true,
                    exchngList: []
                  }, () => this.getExchngList());
                } else { // 태그 sort 필터
                  this.setState({
                    sort_t: currentFilterId,
                    offset: 0,
                    loadMore: true,
                    tagList: []
                  }, () => this.getTagList());
                }
              }}
              currentFilterId={
                filterType === 1 ? sale_mth_cd
                  : filterType === 2 ? sort_g
                        : filterType === 4 ? exchng_vol_trd_typ_cd
                            : filterType === 5 ? sort_e
                  : sort_t
              }
            />
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.backBtnBox}
              onPress={() => navigation.goBack()}
            >
              <Image
                source={require("../../assets/image/common/arrow_back.png")}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
            <View style={{ paddingHorizontal: 20 }}>
              {this.renderSearchBox()}
              {this.renderRecentSearchList()}
            </View>
          </>
        )}
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
  getSearchList: (params) => dispatch(ActionSearch.getList(params)),
  create: (params) => dispatch(ActionSearch.create(params)),
  remove: (params) => dispatch(ActionSearch.remove(params)),
  getGoodsList: (params) => dispatch(ActionGoods.getSearchList(params)),
  getTagList: (params) => dispatch(ActionTag.getList(params)),
  getExchngList: (params) => dispatch(ActionExchng.getStoreList(params)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Search);
