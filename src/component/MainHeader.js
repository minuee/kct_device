import React, {useState} from "react";
import {StyleSheet, TouchableOpacity, View, Image, Text} from "react-native";
import AlertModal from "./modal/AlertModal";
import {Generic, TicketText} from "../model/lib/Utils/Strings";
import Colors from "../model/lib/Utils/Colors";
import Fonts from "../model/lib/Utils/Fonts";

const styles = StyleSheet.create({
  flex: { flex: 1 },
  alignCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  naviBar: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 11,
  },
  notiBtn: {
    width: 50,
    height: 50,
    paddingLeft: 20,
    justifyContent: "center",
  },
  headerIcon: { width: 24, height: 24 },
  logoIcon: { width: 74, height: 30 },
  headerRightBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  cartNotiBox: {
    minWidth: 15,
    top: -3,
    zIndex: 10,
    position: 'absolute',
    backgroundColor: Colors.MAIN_COLOR,
    borderRadius: 6.5,
    paddingHorizontal: 2.5
  },
  cartNotiText: {
    fontFamily: Fonts.AppleB,
    textAlign: 'center',
    color: 'white',
    fontSize: 9.5
  },
});

export const MainHeader = (props) => {
  const { navigation, isMyPage, eSESSION, push_cnt, cart_cnt } = props;
  const [isShowAlertModal, setIsShowAlertModal] = useState(false);

  return (
    <View style={styles.naviBar}>
      <View style={styles.flex}>
        <TouchableOpacity
          style={styles.notiBtn}
          onPress={() => {
            if(eSESSION.mber_no !== undefined)
              navigation.navigate("Notification");
            else
              setIsShowAlertModal(true);
          }}
        >
          <Image
            style={styles.headerIcon}
            source={push_cnt === 0 ? require("../assets/image/main/notification_header.png") : require("../assets/image/main/notification_new_header.png")}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.alignCenter, styles.flex]}>
        {/*onPress={() => navigation.navigate("Event", {event_no: "20211027122139JNDYFJ"})}>*/}
        <Image
          style={styles.logoIcon}
          source={require("../assets/image/main/logo_header.png")}
        />
      </View>

      <View style={styles.headerRightBox}>
        <TouchableOpacity
          style={[styles.alignCenter, { paddingRight: 10 }]}
          onPress={() => navigation.navigate("Search")}
        >
          <Image
            style={styles.headerIcon}
            source={require("../assets/image/main/search_header.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.alignCenter, { paddingRight: 20 }]}
          onPress={() => {
            if (isMyPage) {
              navigation.navigate("MySetting");
            } else {
              if(eSESSION.mber_no !== undefined)
                navigation.navigate("Cart");
              else
                setIsShowAlertModal(true)
            }
          }}
        >
          {!isMyPage && cart_cnt ?
            <View style={styles.cartNotiBox}>
              <Text style={styles.cartNotiText}>
                {cart_cnt > 99 ? `99+` : `${cart_cnt}`}
              </Text>
            </View>
          : null}

          <Image
            style={styles.headerIcon}
            source={
              isMyPage
                ? require("../assets/image/mypage/setting_mypage.png")
                : require("../assets/image/main/cart_default.png")
            }
          />
        </TouchableOpacity>
      </View>

      {isShowAlertModal && (
          <AlertModal
              isShowAlertModal={isShowAlertModal}
              message={Generic.loginMessage}
              leftText={TicketText.no}
              rightText={Generic.goToLogin}
              setVisible={() => setIsShowAlertModal(false)}
              navigation={navigation}
              leftOnPress={() => setIsShowAlertModal(false)}
              rightOnPress={() => navigation.navigate("Login")}
          />
      )}
    </View>
  );
};
