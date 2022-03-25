// 세금계산서 신청 화면
// 미신청/신청완료/발행완료
import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { connect } from "react-redux";

import {CodeText, MyPageText} from "../../../model/lib/Utils/Strings";
import Fonts from "../../../model/lib/Utils/Fonts";

import { TopHeader } from "../../../component/TopHeader";
import { TaxApplicationListItem } from "../../../component/mypage/tax-application/TaxApplicationListItem";
import CompleteModal from "../../../component/modal/CompleteModal";

import * as ActionTax from "../../../model/action/eTAX_BILL"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  tabBtn: {
    width: "50%",
    paddingVertical: 12,
    borderBottomWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomBtn: {
    height: 60,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomBtnText: {
    fontFamily: Fonts.AppleL,
    fontSize: 20,
    letterSpacing: -1,
    color: "#ffffff",
  },
  statusBoxWrap: {
    flexDirection: "row",
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
    height: 80,
    marginBottom: 15,
  },
});

class TaxApplication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusIdx: 0,
      selectedItemId: null,
      isShowCompleteModal: false,

      count: {},
      offset: 0,
      limit: 100,
      tax_list: [],
      loadMore: true,
    };
  }
  componentDidMount() {
    this.getCount();
    this.getList();
  }

  getList = () => {
    // state : 구매 상태값 || 주문상태 (0: 진행중, 1:완료, 2: 교환/반품/환불)
    const {statusIdx, offset, limit, tax_list, loadMore} = this.state;
    if (loadMore) {
      let params = {
        skip: offset,
        limit: limit,
        state: statusIdx,
      }
      this.props.getList(params).then((res) => {
        if (parseInt(res.count) > (offset + limit))
          this.setState({tax_list: [...tax_list, ...res.list], offset: offset + limit})
        else
          this.setState({tax_list: [...tax_list, ...res.list], loadMore: false})
      }).catch((err) => {
      });
    }

  }

  getCount = () => {
    this.props.getCount({}).then((res) => {
      if (res.list.length > 0)
        this.setState({count: res.list[0]})
    }).catch((err) => {
    });
  }

  handleCreate = () => {
    const {selectedItemId} = this.state;
    // TBPSC001: 즉시주문상세 / TBPSC002: 최종구매 주문
    let params = {
      req_amt: selectedItemId.prc
    }
    if(selectedItemId.sale_mth_cd === CodeText.sale_mth_cd_i)
      Object.assign(params, {tax_bill_pblct_se_cd: "TBPSC001", ord_no: selectedItemId.order_dtl_no})
    else
      Object.assign(params, {tax_bill_pblct_se_cd: "TBPSC002", ord_no: selectedItemId.order_no})

    this.props.create(params).then((res) => {
      this.setState({ isShowCompleteModal: true, tax_list: [], offset: 0, loadMore: true }, () => {
        this.getCount();
        this.getList();
      });
    }).catch((err) => {
    });
  }

  renderStatusBox = (title, statusId, count) => {
    const { statusIdx } = this.state;
    const isActive = statusId === statusIdx;
    return (
      <TouchableOpacity
        style={{ width: "33%", alignItems: "center", paddingTop: 14.5 }}
        onPress={() => this.setState({
          statusIdx: statusId,
          tax_list: [],
          offset: 0,
          loadMore: true
        }, () => this.getList())}
      >
        <Text
          style={{
            fontFamily: isActive ? Fonts.AppleB : Fonts.AppleR,
            fontSize: 12,
            letterSpacing: -0.3,
            color: isActive ? "#000000" : "#888888",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: Fonts.AppleB,
            fontSize: 25,
            letterSpacing: -0.63,
            color: isActive ? "#000000" : "#888888",
            marginTop: 6.8,
          }}
        >
          {count}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { navigation, eCOMM_CD } = this.props;
    const { selectedItemId, isShowCompleteModal, statusIdx, count, tax_list } = this.state;

    return (
      <View style={styles.container}>
        <TopHeader title={MyPageText.taxApplication} navigation={navigation} />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.statusBoxWrap}>
            {this.renderStatusBox(MyPageText.notApplied, 0, count[`미신청`])}
            {this.renderStatusBox(MyPageText.completeApplied, 1, count[`신청완료`])}
            {this.renderStatusBox(MyPageText.published, 2, count[`발행완료`])}
          </View>
          {tax_list.map((pl) => {
            return (
              <TaxApplicationListItem
                item={pl}
                eCOMM_CD={eCOMM_CD}
                statusIdx={statusIdx}
                isActive={selectedItemId?.order_no === pl.order_no}
                setSelectedItemId={() =>
                  this.setState({ selectedItemId: pl })
                }
              />
            );
          })}
        </ScrollView>
        {statusIdx === 0 && (
          <TouchableOpacity
            style={[
              styles.bottomBtn,
              { backgroundColor: selectedItemId ? "#000000" : "#dddddd" },
            ]}
            onPress={() => {
              if (selectedItemId) this.handleCreate();
            }}
          >
            <Text style={styles.bottomBtnText}>
              {MyPageText.taxApplicationBtn}
            </Text>
          </TouchableOpacity>
        )}

        {isShowCompleteModal && (
          <CompleteModal
            isShowCompleteModal={isShowCompleteModal}
            title={MyPageText.taxApplicationModalTitle}
            subtitle={MyPageText.taxApplicationModalDesc}
            setVisible={() => this.setState({ isShowCompleteModal: false })}
            isTaxModal={true}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  eSESSION: state.eSESSION.eSESSION,
  eCOMM_CD: state.eCOMM_CD.eCOMM_CD,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  getCount: (params) => dispatch(ActionTax.getCount(params)),
  getList: (params) => dispatch(ActionTax.getList(params)),
  create: (params) => dispatch(ActionTax.create(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TaxApplication);
