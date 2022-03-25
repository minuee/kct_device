// 피드 등록 > 태그 추가 화면
import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import {connect} from "react-redux";

import {StatusBarHeight} from "../../../model/lib/Utils/Constants";
import Fonts from "../../../model/lib/Utils/Fonts";
import { Generic, TagText } from "../../../model/lib/Utils/Strings";

import TextInputStr from "../../../common/textinput/TextInput";
import { ProductListItem } from "../../../component/tag/ProductListItem";

import * as ActionGoods from "../../../model/action/eGOODS";
import * as ActionSearch from "../../../model/action/eSRCHWRD";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  statusBar: { height: StatusBarHeight },
  searchText: {
    fontFamily: Fonts.AppleR,
    color: "#191919",
    padding: 0
  },
  product: {
    fontFamily: Fonts.AppleR,
    color: "#595959",
  },
  close: {
    fontFamily: Fonts.AppleSB,
    fontSize: 14,
    color: "#595959",
  },
  searchBox: { height: 50, alignItems: "center", flexDirection: "row" },
  searchForm: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 20,
    borderBottomColor: "#191919",
    borderBottomWidth: 1,
    paddingVertical: 10,
    width: "78%",
  },
  closeBtn: {
    paddingLeft: 17,
    justifyContent: "center",
    width: "22%",
  },
  trendProduct: {
    fontFamily: Fonts.AppleR,
    fontSize: 16,
    color: "#191919",
    marginBottom: 10,
  },
  trendProductBox: { height: 45, justifyContent: "center", paddingLeft: 10 },
});

class FeedSearchProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: props.navigation.state.params.searchText,
      isSearching: false,

      offset: 0,
      limit: 100,
      searchList: [],
      trendList: [],
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const {searchText} = navigation.state.params;
    if(searchText !== "") this.getSearchList();
    else this.getTrendList();
  }

  getTrendList = () => {
    let params = {
      skip: 0,
      limit: 8
    }
    this.props.getTrendList(params).then(async (res) => {
      this.setState({trendList: res.list})
    }).catch((err) => {
    });
  }

  getSearchList = () => {
    const {offset, limit, searchText, searchList, loadMore} = this.state;
    if(loadMore) {
      let params = {
        skip: offset,
        limit: limit,
        goods_nm: searchText,
        goods_se: 1,
      }

      this.props.getSearchList(params).then(async (res) => {
        if(parseInt(res.count) > (offset + limit))
          this.setState({searchList: [...searchList, ...res.list], isSearching: true, offset: offset + limit})
        else
          this.setState({searchList: [...searchList, ...res.list], isSearching: true, loadMore: false})
      }).catch((err) => {
      });
    }
  }

  handleCreate = (srchwrd) => {
    let params = {
      search: srchwrd
    }
    this.props.create(params).then((res) => {
    }).catch((err) => {
    });
  }

  renderSearchBox = () => {
    const { navigation } = this.props;
    const { searchText } = this.state;
    return (
      <View style={styles.searchBox}>
        <View style={styles.searchForm}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {!searchText ? (
              <Image
                style={{ width: 16, height: 16, marginRight: 10 }}
                source={require("../../../assets/image/mypage/search_product.png")}
              />
            ) : null}

            <TextInputStr
              textForm={styles.searchText}
              placeholder={TagText.searchPlaceholder}
              placeholderTextColor="#e1e1e1"
              value={searchText}
              setValue={(str) => this.setState({ searchText: str })}
              onSubmitEditing={() => this.setState({offset: 0, loadMore: true, searchList: []}, () => this.getSearchList())}


            />
          </View>
          {searchText ? (
            <TouchableOpacity onPress={() => this.setState({ searchText: "", isSearching: false })}>
              <Image
                source={require("../../../assets/image/search/text_delete_btn.png")}
                style={{ width: 14, height: 14 }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.close}>{Generic.close}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderTrendProductList = () => {
    const {navigation} = this.props;
    const {setProductItem} = navigation.state.params;
    const {searchList} = this.state;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 25,
            justifyContent: "space-between",
            marginHorizontal: 20,
          }}
        >
          {searchList.map((item) => {
            return <ProductListItem item={item} setProductItem={() => {
              setProductItem(item)
              navigation.pop();
            }} isSelected={true}/>;
          })}
        </View>
      </ScrollView>
    );
  };

  renderTrendProductTagList = () => {
    const {trendList} = this.state;
    return (
      <FlatList
        data={trendList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
                style={styles.trendProductBox}
            onPress={() => {
              this.handleCreate(item.srchwrd);
              this.setState({searchText: item.srchwrd, offset: 0, loadMore: true, searchList: []}, () => this.getSearchList())
            }}>
              <Text style={styles.product}>#{item.srchwrd}</Text>
            </TouchableOpacity>
          );
        }}
        ListHeaderComponent={() => {
          return (
            <Text style={styles.trendProduct}>{TagText.trendProduct}</Text>
          );
        }}
        style={{ paddingHorizontal: 20, paddingTop: 20 }}
      />
    );
  };

  render() {
    const { isSearching } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        {this.renderSearchBox()}
        {isSearching
          ? this.renderTrendProductList()
          : this.renderTrendProductTagList()}
      </View>
    );
  }
}

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  getSearchList: (params) => dispatch(ActionGoods.getSearchList(params)),
  getTrendList: (params) => dispatch(ActionSearch.getTrendList(params)),
  create: (params) => dispatch(ActionSearch.create(params)),
});

export default connect(undefined, mapDispatchToProps)(FeedSearchProduct);
