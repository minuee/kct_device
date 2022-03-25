import React, {useState} from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";

import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";
import { SearchText, TagText } from "../../../model/lib/Utils/Strings";

const styles = StyleSheet.create({
  container: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 20,
      marginTop: 20,
  },
    image: {
        width: 70,
        height: 70,
        borderRadius: 5,
        borderWidth: 0.3,
        borderColor: "#ffffff",
        marginRight: 14,
    },
  title: {
    fontFamily: Fonts.AppleB,
    fontSize: 16,
    color: "#333333",
    minWidth: "55%",
  },
  subTitle: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    color: "#969696",
  },
  subscribeBox: {
    width: 68.5,
    height: 25,
    borderRadius: 2.5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 0.5,
    position: 'absolute',
    top:0,
    right: 0,
  },
});

export const SubscriptionListItem = (props) => {
  const { item, createSbs, navigation } = props;
  const [is_subscribe, setIsSubscribe] = useState(item.is_subscribe)

    const setCreateSbs = () => {
        let params = {
            tag_no: item.tag_no,
        }

        createSbs(params).then((res) => {
            setIsSubscribe(!is_subscribe)
        }).catch((err) => {
            this.setState({isShowAlertModal: true})
        });
    }
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.push("TagDetail", {tag_no: item.tag_no})}
    >
      <Image
        style={styles.image}
        source={{uri: item.img_url_addr}}
      />
      <View>
        <Text style={styles.title} numberOfLines={1}>#{item.tag_nm}</Text>
        <View style={{ flexDirection: "row", marginTop: 4 }}>
          <Text style={[styles.subTitle, { marginRight: 10 }]}>
            {SearchText.post} {item.ntt_cnt}개
          </Text>
          <Text style={styles.subTitle}>
            {SearchText.follower} {item.tag_sbscrb_cnt}명
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.subscribeBox,
          {
            backgroundColor: is_subscribe
              ? Colors.MAIN_COLOR
              : "transparent",
            borderColor: is_subscribe ? "transparent" : Colors.MAIN_COLOR,
          },
        ]}
        onPress={() => setCreateSbs()}
      >
        <Text
          style={{
            fontFamily: Fonts.AppleR,
            fontSize: 13,
            color: is_subscribe ? "#f5f5f5" : Colors.MAIN_COLOR,
          }}
        >
          {is_subscribe ? TagText.subscribing : TagText.subscribe}
        </Text>
        {is_subscribe && (
          <Image
            style={{ marginLeft: 2, width: 14, height: 14 }}
            source={require("../../../assets/image/tag/check_black_48_dp_1.png")}
          />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
