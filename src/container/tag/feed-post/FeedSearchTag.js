// 피드 등록 > 태그 추가 화면
import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, StyleSheet, ScrollView} from "react-native";
import {connect} from "react-redux";

import Fonts from "../../../model/lib/Utils/Fonts";
import {notifyMessage} from "../../../model/lib/Utils";
import {Generic, TagText} from "../../../model/lib/Utils/Strings";
import {DEVICE_WIDTH, StatusBarHeight} from "../../../model/lib/Utils/Constants";

import TextInputStr from "../../../common/textinput/TextInput";
import { SearchTagItem } from "../../../component/tag/SearchTagItem";

import * as ActionTag from "../../../model/action/eTAG";

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
  searchBox: {
    width: "100%",
    height: 50,
    alignItems: "center",
    flexDirection: "row",
  },
  searchForm: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 20,
    borderBottomColor: "#191919",
    borderBottomWidth: 1,
    paddingVertical: 10,
    flex: 1,
  },
  closeBtn: {
    paddingLeft: 17,
    paddingRight: 20,
    justifyContent: "center",
  },
  popularTags: {
    fontFamily: Fonts.AppleR,
    fontSize: 16,
    color: "#191919",
    marginTop: 20,
    marginBottom: 12,
    marginLeft: 20,
  },
  submitBtn: {
    marginHorizontal: 20,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    position: "absolute",
    bottom: 22.5,
    width: DEVICE_WIDTH - 40,
  },
  submitText: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    letterSpacing: -0.5,
    color: "#ffffff",
  },
});

class FeedSearchTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      isSearching: false,
      loadMore: true,
      selectedTagItems: [],
      offset: 0,
      limit: 100,
      searchList: [],
    };
  }

  componentDidMount() {
    this.getNttList();
  }

  getNttList = () => {
    let params = {
      skip: 0,
      limit: 100,
    }

    this.props.getNttList(params).then((res) => {
      this.setState({searchList: res.list})
    }).catch((err) => {
    });
  }

  getList = () => {
    const {offset, limit, searchText, searchList, loadMore} = this.state;
    if(loadMore) {
      let params = {
        skip: offset,
        limit: limit,
      }

      if(searchText !== "")
        Object.assign(params, {tag_nm: searchText})

      this.props.getList(params).then((res) => {
        if(parseInt(res.count) > (offset + limit))
          this.setState({searchList: [...searchList, ...res.list], isSearching: true, offset: offset + limit})
        else
          this.setState({searchList: [...searchList, ...res.list], isSearching: true, loadMore: false})
      }).catch((err) => {
      });
    }
  }

  resetLimit = () => {
    this.setState({offset: 0, searchList: [], loadMore: true }, () => this.getList())
  }


  renderSearchBox = () => {
    const { navigation } = this.props;
    const { searchText } = this.state;
    return (
      <View style={styles.searchBox}>
        <View style={styles.searchForm}>
          <View style={{ flexDirection: "row", alignItems: "center", position: 'relative' }}>
            {!searchText ? (
              <Image
                style={{ width: 16, height: 16, marginRight: 10 }}
                source={require("../../../assets/image/mypage/search_product.png")}
              />
            ) : null}

            <TextInputStr
              boxStyle={{ flex: 1}}
              textForm={styles.searchText}
              placeholder={TagText.searchTag}
              placeholderTextColor="#e1e1e1"
              value={searchText}
              setValue={(str) => this.setState({ searchText: str })}
              onSubmitEditing={() => this.resetLimit()}
            />
          </View>
          {searchText ? (
            <TouchableOpacity
                style={{position: 'absolute', right: 0}}
                onPress={() => this.setState({ searchText: "" })}>
              <Image
                source={require("../../../assets/image/search/text_delete_btn.png")}
                style={{ width: 18, height: 18 }}
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

  renderTagList = () => {
    const { isSearching, selectedTagItems, searchList } = this.state;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {!isSearching ? (
          <Text style={styles.popularTags}>{TagText.popularTags}</Text>
        ) : <View style={{ marginTop: 20 }}/>}

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginHorizontal: 20,
          }}
        >
          {searchList.map((item) => {
            const isActive = selectedTagItems.filter((filterItem) => filterItem.tag_no === item.tag_no).length !== 0
            return (
              <SearchTagItem
                title={item.tag_nm}
                isActive={isActive}
                setSelectedTagId={() => {
                  if(isActive)
                    this.setState({ selectedTagItems: selectedTagItems.filter((filterItem) => filterItem.tag_no !== item.tag_no) })
                  else
                    this.setState({ selectedTagItems: [...selectedTagItems, item] })
                }}
              />
            );
          })}
        </View>
      </ScrollView>
    );
  };

  renderSubmitBtn = () => {
    const {navigation} = this.props;
    const {setTagList} = navigation.state.params;
    const { selectedTagItems } = this.state;
    return (
      <TouchableOpacity
        style={[
          styles.submitBtn,
          {backgroundColor: selectedTagItems.length !== 0 ? "#000000" : "#969696",},
        ]}
        onPress={() => {
          if(selectedTagItems.length !== 0) {
            setTagList(selectedTagItems)
            navigation.pop();
          } else notifyMessage("태그를 선택해주세요.")
        }}
      >
        <Text style={styles.submitText}>{TagText.addTag}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        {this.renderSearchBox()}
        {this.renderTagList()}
        <View style={{ height: 95 }}/>
        {this.renderSubmitBtn()}
      </View>
    );
  }
}

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  getList: (params) => dispatch(ActionTag.getList(params)),
  getNttList: (params) => dispatch(ActionTag.getNttList(params)),
});

export default connect(undefined, mapDispatchToProps)(FeedSearchTag);
