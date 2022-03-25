import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
  Image,
  View,
} from "react-native";
import moment from "moment";

import Colors from "../../model/lib/Utils/Colors";
import Fonts from "../../model/lib/Utils/Fonts";
import {PaymentText, TicketText} from "../../model/lib/Utils/Strings";
import {DEVICE_WIDTH} from "../../model/lib/Utils/Constants";
import {formatKCT} from "../../model/lib/Utils/Date";
import * as dateUtil from "../../model/lib/Utils/Date";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: (DEVICE_WIDTH - 40) * 0.32,
    marginTop: 12,
  },
  containerImg: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12.5,
  },
  productImg: {
    aspectRatio: 1,
    marginRight: 12.5,
    borderRadius: 100,
    width: "25%"
  },
  title: {
    width: "75%",
    fontFamily: Fonts.AppleB,
    fontSize: 16,
    letterSpacing: -0.4,
    color: "#2a2e34",
  },
  option: {
    fontFamily: Fonts.AppleL,
    fontSize: 12,
    letterSpacing: -0.6,
    color: "#969696",
    marginTop: 10,
  },
  expDates: {
    fontFamily: Fonts.AppleL,
    fontSize: 12,
    letterSpacing: -0.6,
    textAlign: "left",
    color: "#969696",
    marginTop: 3,
  },
  label: {
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: 2.5,
    backgroundColor: Colors.MAIN_COLOR,
    paddingVertical: 2,
    paddingHorizontal: 6,
    zIndex: 5
  },
  labelText: {
    fontFamily: Fonts.AppleB,
    fontSize: 12,
    letterSpacing: -0.6,
    color: "#ffffff",
  },
});

export const TicketSaleItem = (props) => {
  const { item, isActive, setSelectedTicketId } = props;
  const {reserv_purchase} = item;
  const currentTime = dateUtil.format('x', new Date());
  const limitTime = moment(dateUtil.formatKCT("dash", item.expir_dt)).hours('23').minutes('59') // 한국 시간 : 23시 59분으로 변경
  const day = 1000 * 60 * 60 * 24;
  const remindTime = limitTime - currentTime;

  const days = Math.floor(remindTime / day) + 1;
  return (
    <TouchableOpacity style={styles.container} onPress={setSelectedTicketId}>
      <ImageBackground
        style={styles.containerImg}
        resizeMode="contain"
        source={
          isActive
            ? require("../../assets/image/ticket/ticket_on.png")
            : require("../../assets/image/ticket/ticket_off.png")
        }
      >
        {/*<View style={styles.label}>*/}
        {/*  <Text style={styles.labelText}>*/}
        {/*    {TicketText.leftover}: {item.count}*/}
        {/*  </Text>*/}
        {/*</View>*/}
        <Image source={{uri: reserv_purchase.thumb_url}} style={styles.productImg} />
        <View style={{flex: 1}}>
          <Text style={styles.title} numberOfLines={1}>{reserv_purchase.goods_nm}</Text>
          <Text style={styles.option}>
            {/*{TicketText.option}:{reserv_purchase.goods_optn_nm}*/}
            {`${reserv_purchase.goods_optn_nm}`}
            {` | ${PaymentText.quantity} : ${reserv_purchase.purchase_cnt}`}
          </Text>
          <Text style={styles.expDates}>
            {TicketText.validity}:{`~${formatKCT("point", item.expir_dt)}(${days}일)`}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
