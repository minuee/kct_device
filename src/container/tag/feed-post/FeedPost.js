// 피드 등록
import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";
import { TagText } from "../../../model/lib/Utils/Strings";
import { formattedNumber, getFileName } from "../../../model/lib/Utils";

import { TopHeader } from "../../../component/TopHeader";
import TextInputStr from "../../../common/textinput/TextInput";

import * as ActionNtt from "../../../model/action/eNTT";
import * as ActionFile from "../../../model/lib/UploadManager/eFILE";
import * as dateUtil from "../../../model/lib/Utils/Date";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  addPhotoBox: {
    width: 80,
    height: 80,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dddddd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginVertical: 20,
  },
  addPhoto: {
    fontFamily: Fonts.AppleR,
    fontSize: 12.3,
    color: "#595959",
    marginTop: 7.8,
  },
  feedInputBox: {
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: 0.5,
  },
  textForm: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    color: "#191919",
  },
  boxStyle: { width: "100%", height: 120, padding: 10 },
  title: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    color: "#969696",
  },
  representativeBox: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    width: 35,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 20,
    left: 0,
    zIndex: 10,
    borderTopLeftRadius: 5,
  },
  representative: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    letterSpacing: -0.6,
    color: Colors.MAIN_COLOR,
  },
  feedImg: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 12,
  },
  tag: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.65,
    color: "#333333",
    marginRight: 4,
  },
  searchTagBtn: {
    marginTop: 5,
    height: 45,
    alignItems: "center",
    paddingLeft: 10,
    flexDirection: "row",
  },
  searchTagText: {
    fontFamily: Fonts.AppleR,
    letterSpacing: -0.7,
    color: "#595959",
  },
  tagListWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
  },
  tagListView: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    borderWidth: 0.5,
    borderColor: "#e1e1e1",
    paddingLeft: 12,
    paddingRight: 8,
    marginRight: 10,
    marginBottom: 8,
  },
  productWrap: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 13.5,
  },
  productImg: {
    borderRadius: 2.5,
    width: 60,
    height: 60,
    marginRight: 12,
  },
  productTitle: {
    fontFamily: Fonts.AppleR,
    color: "#333333",
  },
  productPrice: {
    fontFamily: Fonts.AppleSB,
    color: "#191919",
    marginTop: 6,
  },
  productSearchWrap: {
    marginTop: 5,
    height: 45,
    alignItems: "center",
    paddingLeft: 12,
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e1e1e1",
  },
  linkView: {
    flexDirection: "row",
    marginTop: 5,
    width: "100%",
    height: 45,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e1e1e1",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerRightText: {
    fontFamily: Fonts.AppleR,
    letterSpacing: -0.7,
    color: "#dddddd",
  },
});

class FeedPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      youtubeLink: "",
      productName: "",
      title: "",
      tagList: [],
      image_urls: [],
      selectProduct: null,

      deleteTagList: [],
      deleteImageUrls: [],
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    if (navigation.state.params) {
      const { ntt_no } = navigation.state.params;
      if (ntt_no) {
        this.getDetail(ntt_no);
      }
      const { selectProduct } = navigation.state.params;
      if (selectProduct) this.setState({ selectProduct: selectProduct });
    }
  }

  getDetail = (ntt_no) => {
    let params = {
      ntt_no: ntt_no,
    };

    this.props
      .getDetail(params)
      .then(async (res) => {
        const data = res.detail;
        let tag_list = data.tag.map((item) => {
          return {...item, isNot: true}
        })
        this.setState({
          content: data.ntt_cont,
          title: data.ntt_sj,
          tagList: tag_list,
          image_urls: data.img,
          selectProduct: {
            thumb_url: data.goods_img_url_addr,
            goods_nm: data.goods_nm,
            sale_prc: data.sale_prc,
          },
          youtubeLink: data.ytb_url_addr
        });
      })
      .catch((err) => {});
  };

  isCreate = () => {
    const { navigation } = this.props;
    if (navigation.state.params) {
      const { ntt_no } = navigation.state.params;
      if (ntt_no) this.updateNtt(ntt_no);
      else this.createNtt();
    } else this.createNtt();
  };

  createNtt = () => {
    const { eSESSION, navigation } = this.props;
    const { content, youtubeLink, selectProduct } = this.state;
    let params = {
      ntt_sj: `${eSESSION.mber_nm}_${dateUtil.format("longNumber", new Date())}`,
      ntt_cont: content,
      goods_no: selectProduct.goods_no,
      ytb_url_addr: youtubeLink,
    };

    this.props
      .create(params)
      .then(async (res) => {
        await this.createTag(res.detail.ntt_no);
        await this.uploadByFile(res.detail.ntt_no);
      })
      .catch((err) => {});
    navigation.pop();
  };

  updateNtt = (ntt_no) => {
    const { navigation } = this.props;
    const { content, youtubeLink, title, selectProduct } = this.state;
    let params = {
      ntt_no: ntt_no,
      ntt_sj: title,
      ntt_cont: content,
      goods_no: selectProduct.goods_no,
      ytb_url_addr: youtubeLink,
    };
    console.log("createNtt");
    console.log(params);

    this.props
      .update(params)
      .then(async (res) => {
        await this.removeTag(ntt_no);
        await this.removeImg(ntt_no);
        await this.createTag(ntt_no);
        await this.uploadByFile(ntt_no);
      })
      .catch((err) => {});
    navigation.pop();
  };

  uploadByFile = (ntt_no) => {
    const { image_urls } = this.state;
    image_urls
      .filter((item) => !item.img_sn)
      .map((item) => {
        console.log("item");
        console.log(item);
        let params = {
          uri: item.uri,
          type: item.type,
          name: getFileName(item.uri),
        };

        this.props
          .uploadByImage(params)
          .then((res) => {
            this.createImg(ntt_no, res[0].original);
          })
          .catch((err) => {});
      });
  };

  createImg = (ntt_no, image_url) => {
    let params = {
      ntt_no: ntt_no,
      img_file_nm: getFileName(image_url),
      img_url_addr: image_url,
    };
    console.log("createImg : params");
    console.log(params);

    this.props
      .createImg(params)
      .then((res) => {})
      .catch((err) => {});
  };

  removeImg = (ntt_no) => {
    const { deleteImageUrls } = this.state;
    deleteImageUrls
      .filter((item) => item.img_sn)
      .map((item) => {
        let params = {
          ntt_no: ntt_no,
          img_sn: item.img_sn,
        };
        console.log("removeImg : params");
        console.log(params);

        this.props
          .removeImg(params)
          .then((res) => {})
          .catch((err) => {});
      });
  };

  createTag = (ntt_no) => {
    const { tagList } = this.state;
    tagList.filter((item) => item.isNot === undefined).map((item) => {
      let params = {
        ntt_no: ntt_no,
        tag_no: item.tag_no,
      };

      this.props
        .createTag(params)
        .then((res) => {})
        .catch((err) => {});
    });
  };

  removeTag = (ntt_no) => {
    const { deleteTagList } = this.state;
    deleteTagList.map((item) => {
      let params = {
        ntt_no: ntt_no,
        tag_no: item.tag_no,
      };
      console.log("removeTag : params");
      console.log(params);

      this.props
        .removeTag(params)
        .then((res) => {})
        .catch((err) => {});
    });
  };

  setTagList = (items) => {
    const { tagList } = this.state;
    this.setState({ tagList: [...tagList, ...items] });
  };

  setImageUrls = (imageUrls) => {
    const { image_urls } = this.state;
    this.setState({ image_urls: [...image_urls, ...imageUrls] });
  };

  setProductItem = (productItem) => {
    this.setState({ selectProduct: productItem });
  };

  renderAddPhotoBox = () => {
    const { navigation } = this.props;
    const { image_urls, deleteImageUrls } = this.state;
    return (
      <FlatList
        data={image_urls}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <View style={{ paddingVertical: 20 }}>
              {index === 0 ? (
                <View style={styles.representativeBox}>
                  <Text style={styles.representative}>
                    {TagText.representative}
                  </Text>
                </View>
              ) : null}

              <Image
                source={{ uri: item.uri || item.img_url_addr }}
                style={styles.feedImg}
              />
              <TouchableOpacity
                style={{ position: "absolute", top: 10, right: 3, zIndex: 5 }}
                onPress={() => {
                  let newImgList = image_urls.filter(
                    (image, imgIndex) => image !== item
                  );
                  this.setState({
                    image_urls: newImgList,
                    deleteImageUrls: [...deleteImageUrls, item],
                  });
                }}
              >
                <Image
                  source={require("../../../assets/image/tag/img_delete_btn.png")}
                  style={{ width: 22.8, height: 22.8 }}
                />
              </TouchableOpacity>
            </View>
          );
        }}
        ListHeaderComponent={() => {
          return (
            <TouchableOpacity
              style={styles.addPhotoBox}
              onPress={() =>
                navigation.navigate("FeedSelectPhoto", {
                  setImageUrls: this.setImageUrls,
                  limit: 5
                })
              }
            >
              <Image
                source={require("../../../assets/image/tag/photo_graphic_icon.png")}
                style={{ width: 30.8, height: 30.8 }}
              />
              <Text style={styles.addPhoto}>{TagText.addPhoto}</Text>
            </TouchableOpacity>
          );
        }}
        horizontal={true}
      />
    );
  };

  renderFeedInputBox = () => {
    const { content } = this.state;
    return (
      <View style={styles.feedInputBox}>
        <TextInputStr
          boxStyle={styles.boxStyle}
          textForm={styles.textForm}
          placeholder={TagText.feedPlaceholder}
          placeholderTextColor="#d5d5d5"
          value={content}
          multiline={true}
          setValue={(str) => this.setState({ content: str })}
        />
      </View>
    );
  };

  renderRelatedTagBox = () => {
    const { navigation } = this.props;
    const { tagList, deleteTagList } = this.state;
    return (
      <View style={{ marginTop: 25 }}>
        <Text style={styles.title}>{TagText.relatedTag}</Text>
        <TouchableOpacity
          style={styles.searchTagBtn}
          onPress={() =>
            navigation.navigate("FeedSearchTag", {
              setTagList: this.setTagList,
            })
          }
        >
          <Image
            style={{ width: 20, height: 20, marginRight: 5 }}
            source={require("../../../assets/image/tag/add_tag_btn.png")}
          />
          <Text style={styles.searchTagText}>{TagText.addTag}</Text>
        </TouchableOpacity>
        <View style={styles.tagListWrap}>
          {tagList.map((item) => {
            return (
              <View style={styles.tagListView}>
                <Text style={styles.tag}>#{item.tag_nm}</Text>
                <TouchableOpacity
                  onPress={() => {
                    let newImgList = tagList.filter(
                      (tag, tagIndex) => tag !== item
                    );
                    this.setState({
                      tagList: newImgList,
                      deleteTagList: [...deleteTagList, item],
                    });
                  }}
                >
                  <Image
                    style={{ width: 20, height: 20 }}
                    source={require("../../../assets/image/tag/delete_btn.png")}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  renderRelatedProductBox = () => {
    const { productName, selectProduct } = this.state;
    const { navigation } = this.props;
    return (
      <View style={{ marginTop: 30 }}>
        <Text style={styles.title}>{TagText.relatedProducts}</Text>
        {selectProduct ? (
          <View style={styles.productWrap}>
            <TouchableOpacity
              style={{ position: "absolute", top: 0, right: 20 }}
              onPress={() => this.setState({ selectProduct: null })}
            >
              <Image
                style={{ width: 20, height: 20 }}
                source={require("../../../assets/image/tag/close_page.png")}
              />
            </TouchableOpacity>
            <Image
              style={styles.productImg}
              source={{ uri: selectProduct.thumb_url }}
            />
            <View>
              <Text style={styles.productTitle}>{selectProduct.goods_nm}</Text>
              <Text style={styles.productPrice}>
                {formattedNumber(selectProduct.sale_prc)}
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.productSearchWrap}
            onPress={() => navigation.navigate("FeedSearchProduct", {
              searchText: productName,
              setProductItem: this.setProductItem,
            })}
          >
            <Image
              style={{ width: 20, height: 20, marginRight: 5 }}
              source={require("../../../assets/image/tag/search_product.png")}
            />
            <TextInputStr
              textForm={styles.textForm}
              placeholder={TagText.searchPlaceholder}
              placeholderTextColor="#c1c1c1"
              value={productName}
              setValue={(str) => this.setState({ productName: str })}
              editable={false}
              // onFocus={() => {
              //   navigation.navigate("FeedSearchProduct", {
              //     searchText: productName,
              //     setProductItem: this.setProductItem,
              //   });
              // }}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  renderAddYoutubeLinkBox = () => {
    const { youtubeLink } = this.state;
    return (
      <View style={{ marginTop: 30 }}>
        <Text style={styles.title}>{TagText.youtubeUrl}</Text>
        <View style={styles.linkView}>
          <TextInputStr
            boxStyle={{
              alignItems: "center",
              paddingLeft: 10,
              flexDirection: "row",
            }}
            textForm={styles.textForm}
            placeholder={TagText.addLink}
            placeholderTextColor="#c1c1c1"
            value={youtubeLink}
            setValue={(str) => this.setState({ youtubeLink: str })}
          />
          {youtubeLink ? (
            <TouchableOpacity
              onPress={() => this.setState({ youtubeLink: "" })}
            >
              <Image
                source={require("../../../assets/image/search/text_delete_btn.png")}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    let ntt_no = "";
    if (navigation.state.params) ntt_no = navigation.state.params.ntt_no;

    const { content, selectProduct, tagList, image_urls } = this.state;

    const isActive = content !== "" && selectProduct && tagList.length > 0 && image_urls.length > 0;

    return (
      <View style={styles.container}>
        <TopHeader
          title={ntt_no ? TagText.updateFeed : TagText.addFeed}
          navigation={navigation}
          hasRightBtn={true}
          isText={true}
          rightBtnSource={ntt_no ? TagText.edit : TagText.add}
          rightBtnStyle={[
            styles.headerRightText,
            isActive ? { color: Colors.MAIN_COLOR } : { color: "#dddddd" },
          ]}
          onPress={() => isActive ? this.isCreate() : null}
        />
        <KeyboardAwareScrollView
          style={{ paddingHorizontal: 20 }}
          extraScrollHeight={30}
          enableOnAndroid
        >
          {this.renderAddPhotoBox()}
          {this.renderFeedInputBox()}
          {this.renderRelatedTagBox()}
          {this.renderRelatedProductBox()}
          {this.renderAddYoutubeLinkBox()}
          <View style={{ height: 60 }} />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  eSESSION: state.eSESSION.eSESSION,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  create: (params) => dispatch(ActionNtt.create(params)),
  update: (params) => dispatch(ActionNtt.update(params)),
  createTag: (params) => dispatch(ActionNtt.createTag(params)),
  removeTag: (params) => dispatch(ActionNtt.removeTag(params)),
  createImg: (params) => dispatch(ActionNtt.createImg(params)),
  removeImg: (params) => dispatch(ActionNtt.removeImg(params)),
  uploadByImage: (params) => dispatch(ActionFile.uploadByImage(params)),
  getDetail: (params) => dispatch(ActionNtt.getDetail(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedPost);
