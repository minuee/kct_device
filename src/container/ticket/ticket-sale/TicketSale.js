// 교환권 > 플로팅메뉴 선택 시 접근 화면
// 판매 교환권 선택 화면
// 교환권 결제 화면
import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import {connect} from "react-redux";

import Fonts from "../../../model/lib/Utils/Fonts";
import { TicketText } from "../../../model/lib/Utils/Strings";

import SaleModal from "../../../component/modal/SaleModal";
import { TopHeader } from "../../../component/TopHeader";
import { TicketSaleItem } from "../../../component/ticket/TicketSaleItem";

import * as ActionExchng from "../../../model/action/eEXCHNG_VOL";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  emptyImg: { width: 120, height: 120 },
  emptyText: {
    fontFamily: Fonts.AppleR,
    fontSize: 16,
    letterSpacing: -0.4,
    color: "#999999",
    marginTop: 5,
  },
  submitBox: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#dddddd",
  },
  submit: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    color: "#f5f5f5",
  },
  infoMessage: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    letterSpacing: -0.3,
    color: "#555555",
    marginTop: 12,
    // marginLeft: 20,
  },
});

class TicketSale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      selectedTicket: null,
      isShowSaleModal: false,

      ticketList: [],
    };
  }

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    let params = {
      skip: 0,
      limit: 100,
    }

    this.props.getList(params).then((res) => {
      this.setState({ticketList: res.list, isLoading: false})
    }).catch((err) => {
      this.setState({isLoading: false})
    });
  }

  handleSubmit = () => {
    const { navigation } = this.props;
    const { selectedTicket } = this.state;
    this.setState({isShowSaleModal: false})
    navigation.navigate("TicketSaleBoard", {selectedTicket: selectedTicket});
  }



  renderSubmitBtns = () => {
    const { selectedTicket } = this.state;
    return (
      <TouchableOpacity
        style={[
          styles.submitBox,
          { backgroundColor: selectedTicket ? "#000000" : "#dddddd" },
        ]}
        onPress={() => {
          if (selectedTicket)
            this.setState({isShowSaleModal: true})
        }}
      >
        <Text style={styles.submit}>{TicketText.next}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { navigation } = this.props;
    const { isLoading, isShowSaleModal, selectedTicket, ticketList } = this.state;

    if(isLoading)
      return null;
    else
      return (
        <View style={styles.container}>
          <TopHeader
            title={TicketText.selectTicketSale}
            navigation={navigation}
            hasRightBtn={false}
            isCloseIcon={true}
          />
          {ticketList.length === 0 ? (
            <View
              style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            >
              <Image
                style={styles.emptyImg}
                source={require("../../../assets/image/ticket/empty.png")}
              />
              <Text style={styles.emptyText}>{TicketText.emptyText}</Text>
            </View>
          ) : (
            <FlatList
              data={ticketList}
              style={{paddingHorizontal: 20}}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                return (
                  <TicketSaleItem
                    item={item}
                    isActive={selectedTicket?.reserv_purchase_no === item.reserv_purchase_no}
                    setSelectedTicketId={() =>
                      this.setState({ selectedTicket: item })
                    }
                  />
                );
              }}
              keyExtractor={(_, i) => String(i)}
              ListFooterComponent={() => {
                return (
                  <Text style={styles.infoMessage}>
                    {TicketText.saleInfoMessage}
                  </Text>
                );
              }}
            />
          )}

          {this.renderSubmitBtns()}
          <SaleModal
            isShowSaleModal={isShowSaleModal}
            setVisible={() => this.setState({ isShowSaleModal: false })}
            handleSubmit={() => {
              this.handleSubmit();
            }}
            isTicket={true}
            title={TicketText.ticketSaleModalTitle}
            message={TicketText.ticketSaleModalMessage}
            subMessage={TicketText.ticketSaleModalSubMessage}
            warningMessage={TicketText.ticketSaleModalSubMessage}
          />
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
  /* EXCHNG 2차 개발 */
  getList: (params) => dispatch(ActionExchng.getList(params)),
});
export default connect(mapStateToProps, mapDispatchToProps)(TicketSale);
