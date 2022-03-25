import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
  FlatList,
} from "react-native";
import Modal from "react-native-modal";

import { DEVICE_WIDTH, HAS_NOTCH } from "../../model/lib/Utils/Constants";

import Fonts from "../../model/lib/Utils/Fonts";
import Colors from "../../model/lib/Utils/Colors";
import { StoreText } from "../../model/lib/Utils/Strings";
import { formattedNumber, notifyMessage } from "../../model/lib/Utils";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginTop: HAS_NOTCH ? 74 : 50,
    marginHorizontal: -20,
    flex: 1,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 27.5,
    marginBottom: -20,
  },
  selectOptions: {
    fontFamily: Fonts.AppleB,
    fontSize: 20,
    color: "#191919",
  },
  subTitle: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    color: "#595959",
  },
  selectColor: {
    width: 54.5,
    height: 54.5,
    borderRadius: 30,
    marginTop: 12,
    marginRight: 12,
    borderWidth: 0.3,
    borderColor: "#707070",
  },
  additionalPrice: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    color: "#969696",
    marginTop: 5,
  },
  capacity: {
    fontFamily: Fonts.AppleB,
    fontSize: 16,
    color: "#000000",
  },
  capacityBox: {
    width: "48%",
    height: 75,
    borderRadius: 2.5,

    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  capacityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    justifyContent: "space-between",
  },
  additionalOptionsBox: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    height: 40,
    borderWidth: 0.5,
    borderColor: "#d5d5d5",
    marginTop: 12,
    paddingHorizontal: 15,
  },
  noAdditionalOptions: {
    fontFamily: Fonts.AppleR,
    fontSize: 16,
  },
  downArrow: { width: 16, height: 16 },
  nextBtn: {
    position: "absolute",
    bottom: 26.5,
    width: DEVICE_WIDTH - 40,
    alignSelf: "center",
    height: 50,
    borderRadius: 5,
    marginTop: 25.5,
    alignItems: "center",
    justifyContent: "center",
  },
  next: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    color: "#f5f5f5",
  },
  selectedOptionTitle: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    color: "#c1c1c1",
    marginLeft: 8,
  },
  selectedOptionImg: {
    width: 20,
    height: 20,
    position: "absolute",
    top: 10,
    right: 5,
  },
  selectedOptionCheck: {
    width: 20,
    height: 12,
    marginTop: 20,
  },
  dropdownWrap: {
    paddingTop: 15,
    borderWidth: 0.5,
    borderColor: "#d5d5d5",
    borderTopWidth: 0,
    height: 75.5,
    width: "100%",
  },
  dropdownItem: {
    paddingLeft: 15,
    paddingBottom: 10,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
  },
});

class OptionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCapacityId: null,
      selectedCapacityNm: null,
      sale_prc: 0,
      add_prc_sum: 0,
      isOpened: false,
      selectedAdditionalOption: null,
      colors: [],
      capacities: [],
      isSelectColor: false,
    };
  }

  componentDidMount() {
    const { goods_optn } = this.props;
    if (goods_optn.length > 0) {
      let newList = goods_optn.map((item, index) => {
        if(item.volume && item.volume[0] && item.volume[0].optn_cd === "")
          return { ...item, isSelected: false, isOnly: true};
        else
          return { ...item, isSelected: false, isOnly: false};
      });
      if(newList[0].isOnly)
        this.setState({ colors: newList, capacities: null });
      else
        this.setState({ colors: newList, capacities: goods_optn[0].volume });
    }
  }

  render() {
    const {
      isShowOptionModal,
      navigation,
      setVisible,
      goods_no,
      add_optn,
      pageType,
      sale_prc,
    } = this.props;
    const {
      selectedCapacityId,
      selectedCapacityNm,
      add_prc_sum,
      isOpened,
      selectedAdditionalOption,
      colors,
      capacities,
      isSelectColor
    } = this.state;

    const payment_price = parseInt(sale_prc || 0) + parseInt(add_prc_sum || 0) + parseInt(selectedAdditionalOption?.add_amt || 0)

    return (
      <Modal
        isVisible={isShowOptionModal}
        onBackdropPress={() => setVisible(false)}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.container}>
          <Text style={styles.selectOptions}>{StoreText.selectOptions}</Text>
          <View style={{ marginTop: 18.8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.subTitle}>{StoreText.selectColor}</Text>
              {colors.filter((item) => item.isSelected).length > 0 ? (
                <Text style={styles.selectedOptionTitle}>
                  ({colors[colors.findIndex((color) => color.isSelected)].optn_nm})
                </Text>
              ) : null}
            </View>

            <FlatList
              data={colors}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ justifyContent: "center" }}>
                    <TouchableOpacity
                      style={[
                        styles.selectColor,
                        { backgroundColor: item.color_cd },
                      ]}
                      onPress={() => {
                        let volume = [];
                        let colorsNew = colors.map((newItem, newIndex) => {
                          if(index === newIndex) volume = newItem.volume;
                          return { ...newItem, isSelected: index === newIndex };
                        });
                        const select_id = item.isOnly ? item.volume[0] : null;
                        if(selectedCapacityId) {
                          volume = volume.filter((item) => item.optn_nm === selectedCapacityNm)
                          let params = {
                            isSelectColor: true,
                            colors: colorsNew,
                          }
                          if(volume.length > 0) {
                            Object.assign(params, {capacities: item.volume})
                            Object.assign(params, {selectedCapacityId: volume[0].goods_optn_no})
                          }
                          this.setState(params);
                        } else {
                          this.setState({
                            isSelectColor: true,
                            colors: colorsNew,
                            capacities: !select_id ? item.volume : null,
                            selectedCapacityId: select_id?.goods_optn_no,
                            add_prc_sum: select_id?.add_prc_sum,
                          });
                        }
                      }}
                    />
                    {item.isSelected && (
                      <Image
                        style={styles.selectedOptionImg}
                        source={require("../../assets/image/store/select_option_checkbox.png")}
                      />
                    )}
                    <Text style={styles.additionalPrice}>{`+${formattedNumber(item.add_prc)}원`}</Text>
                  </View>
                );
              }}
              keyExtractor={(_, i) => String(i)}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            />
          </View>
          {capacities && (
          <View style={{ marginTop: 30 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.subTitle}>{StoreText.selectCapacity}</Text>
              {selectedCapacityId ? (
                <Text style={styles.selectedOptionTitle}>
                  ({capacities[capacities.findIndex((capa) => capa.goods_optn_no === selectedCapacityId)].optn_nm})
                </Text>
              ) : null}
            </View>
            {capacities && (
            <View style={styles.capacityContainer}>
              {capacities.map((capa) => {
                return (
                  <TouchableOpacity
                    style={[
                      styles.capacityBox,
                      {
                        borderWidth:
                          selectedCapacityId === capa.goods_optn_no ? 1 : 0.5,
                        borderColor:
                          selectedCapacityId === capa.goods_optn_no
                            ? Colors.MAIN_COLOR
                            : "#c1c1c1",
                      },
                    ]}
                    onPress={() => {
                      if(parseInt(capa.goods_cnt) - parseInt(capa.saled_cnt) === 0)
                        notifyMessage(StoreText.outOfStockMessage)
                      else
                        this.setState({
                          selectedCapacityId: capa.goods_optn_no,
                          selectedCapacityNm: capa.optn_nm,
                          add_prc_sum: capa.add_prc_sum,
                        })
                    }}
                  >
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Text style={styles.capacity}>{capa.optn_nm}</Text>
                      <Text style={styles.additionalPrice}>{`+${formattedNumber(capa.add_prc)}원`}</Text>
                      <Text style={styles.additionalPrice}>{`재고 : ${parseInt(capa.goods_cnt) - parseInt(capa.saled_cnt)}`}</Text>
                    </View>
                    {selectedCapacityId === capa.goods_optn_no && (
                      <Image
                        style={styles.selectedOptionCheck}
                        source={require("../../assets/image/store/select_option_check_line.png")}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            )}
          </View>
          )}
          <View style={{ marginTop: 20 }}>
            <Text style={styles.subTitle}>{StoreText.selectMoreOptions}</Text>
            <TouchableOpacity
              style={[
                styles.additionalOptionsBox, {backgroundColor: add_optn?.length === 0 ? "#f8f8f8" : "transparent"}]}
              onPress={() =>
                add_optn?.length !== 0
                  ? this.setState({ isOpened: !isOpened })
                  : null
              }
            >
              <Text
                style={[
                  styles.noAdditionalOptions,
                  { color: add_optn?.length === 0 ? "#dddddd" : "#000000" },
                ]}
              >
                {add_optn?.length === 0
                  ? StoreText.noAdditionalOptions
                  : selectedAdditionalOption
                  ? `${selectedAdditionalOption.add_optn_nm} (+${formattedNumber(selectedAdditionalOption.add_amt)}원)`
                  : `- ${StoreText.optional} ${StoreText.selectMoreOptions} -`}
              </Text>
              <Image
                style={styles.downArrow}
                source={require("../../assets/image/signup/dropdown_btn_regular.png")}
              />
            </TouchableOpacity>
            {isOpened && (
              <FlatList
                style={styles.dropdownWrap}
                data={add_optn}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() =>
                        this.setState({
                          selectedAdditionalOption: item,
                          isOpened: false,
                        })
                      }
                    >
                      <Text
                        style={{
                          fontFamily: Fonts.AppleR,
                          fontSize: 16,
                          marginRight: 5,
                          color:
                            selectedAdditionalOption &&
                            selectedAdditionalOption.add_optn_no ===
                              item.add_optn_no
                              ? Colors.MAIN_COLOR
                              : "#000000",
                        }}
                      >
                        {`${item.add_optn_nm} (+${formattedNumber(
                          item.add_amt
                        )}원)`}
                      </Text>
                      {selectedAdditionalOption &&
                        selectedAdditionalOption.add_optn_no ===
                          item.add_optn_no && (
                          <Image
                            style={{ width: 20, height: 12 }}
                            source={require("../../assets/image/store/select_option_check_line.png")}
                          />
                        )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.nextBtn, {backgroundColor: colors.length === 0 || (isSelectColor && selectedCapacityId) ? "#191919" : "#c1c1c1"}]}
            onPress={() => {
              if (isSelectColor && colors.length > 0 && selectedCapacityId) {
                setVisible(false);
                navigation.navigate("StorePayment", {
                  pageType: pageType,
                  goods_no: goods_no,
                  selected_optn: selectedCapacityId,
                  add_optn: selectedAdditionalOption,
                });
              } else if(colors.length === 0) {
                setVisible(false);
                navigation.navigate("StorePayment", {
                  pageType: pageType,
                  goods_no: goods_no,
                  add_optn: selectedAdditionalOption,
                });
              } else {
                notifyMessage("옵션을 모두 선택해주세요");
              }
            }}
          >
            <Text style={styles.next}>{colors.length === 0 || (isSelectColor && selectedCapacityId) ? `${formattedNumber(payment_price)}${StoreText.won} ${StoreText.orderNext}`: StoreText.next}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

export default OptionModal;
