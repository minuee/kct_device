// 나의 상품문의 내역
import React, { Component } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {connect} from "react-redux";
import produce from "immer";

import { MyPageText } from "../../../../model/lib/Utils/Strings";

import { TopHeader } from "../../../../component/TopHeader";
import { RadioButton } from "../../../../component/RadioButton";
import { MyProductQnAListItem } from "../../../../component/mypage/myproduct-qna/MyProductQnAListItem";

import * as ActionGoods from "../../../../model/action/eGOODS_INQRY";

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

const categories = [
  { title: MyPageText.all, id: 0 },
  { title: MyPageText.unanswered, id: 1 },
  { title: MyPageText.answerComplete, id: 2 },
];

class MyProductQnA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategoryId: 0,
      productQna: [],
    };
  }

  componentDidMount() {
    this.getInqryList();
  }

  getInqryList = () => {
    const {eSESSION} = this.props;
    const {selectedCategoryId} = this.state;
    let params = {
      skip: 0,
      limit: 100,
      mber_no: eSESSION.mber_no
    }

    if (selectedCategoryId !== 0)
      Object.assign(params, {state: selectedCategoryId})

    this.props.getInqryList(params).then((res) => {
      let newList = res.list.map((item, index) => {
        return {...item, isOpened: false}
      })
      this.setState({productQna: newList})
    }).catch((err) => {
    });
  }

  getInqryDetail = (goods_inqry_no, index) => {
    const {productQna} = this.state;
    let params = {
      goods_inqry_no: goods_inqry_no,
    }

    this.props.getInqryDetail(params).then((res) => {
      let updatedQnas = produce(productQna, (draft) => {
        draft[index].detail = res.detail;
      });
      this.setState({qnaList: updatedQnas})
    }).catch((err) => {
    });
  }

  render() {
    const { navigation } = this.props;
    const { selectedCategoryId, productQna } =
      this.state;
    return (
      <View style={styles.container}>
        <TopHeader
          title={MyPageText.myProductInquiry}
          navigation={navigation}
        />
        <FlatList
          data={productQna}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <MyProductQnAListItem
                item={item}
                updateMyProductInquiries={() => {
                  let updatedMyProductInquiries = produce(
                      productQna,
                    (draft) => {
                      draft[index].isOpened = !draft[index].isOpened;
                    }
                  );
                  this.setState({
                    productQna: updatedMyProductInquiries,
                  });
                  // this.setState({
                  //   productQna: updatedMyProductInquiries,
                  // }, () => this.getInqryDetail(item.goods_inqry_no, index));
                }}
              />
            );
          }}
          ListHeaderComponent={() => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "#dddddd",
                  paddingBottom: 19.5,
                }}
              >
                {categories.map((category, index) => {
                  return (
                    <RadioButton
                      key={`category_${index}`}
                      label={category.title}
                      isActive={category.id === selectedCategoryId}
                      setActive={() => {
                        this.setState({
                          selectedCategoryId: category.id,
                        }, () => this.getInqryList());
                      }}
                      style={{ marginRight: 15 }}
                      btnStyle={{ marginRight: 6.2 }}
                    />
                  );
                })}
              </View>
            );
          }}
          style={{ paddingHorizontal: 20 }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  eSESSION: state.eSESSION.eSESSION,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  getInqryList: (params) => dispatch(ActionGoods.getInqryList(params)),
  getInqryDetail: (params) => dispatch(ActionGoods.getInqryDetail(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyProductQnA);
