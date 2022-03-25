// 앱 접근 권한 안내 모달
// URL 공유 모달
import React, { Component } from "react";
import {StyleSheet, TouchableOpacity, Image, View, Text, Platform, PermissionsAndroid, Linking} from "react-native";
import Modal from "react-native-modal";

import Fonts from "../../model/lib/Utils/Fonts";
import {Generic, MainText, TOKEN} from "../../model/lib/Utils/Strings";
import AsyncStorage from "@react-native-community/async-storage";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: -20,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  alertBox: {
    borderRadius: 5,
    backgroundColor: "#ffffff",
    marginHorizontal: 9,
  },
  title: {
    textAlign: "center",
    fontFamily: Fonts.AppleB,
    fontSize: 15,
    letterSpacing: -0.38,
    color: "#222222",
    marginTop: 15.2,
    marginBottom: 14,
  },
});

class PermissionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderPermissionBox = (icon, title, desc) => {
    return (
      <View style={{ flexDirection: "row", marginTop: 12, marginBottom: 8 }}>
        <Image
          source={icon}
          style={{ width: 32, height: 32, marginRight: 10 }}
        />
        <View>
          <Text
            style={{
              fontFamily: Fonts.AppleR,
              letterSpacing: -0.35,
              color: "#222222",
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              marginTop: 2,
              fontFamily: Fonts.AppleR,
              fontSize: 12,
              letterSpacing: -0.3,
              color: "#555555",
            }}
          >
            {desc}
          </Text>
        </View>
      </View>
    );
  };

  handlePermission = () => {
      const { setVisible } = this.props;
      this.checkPermission()
      AsyncStorage.setItem(TOKEN.permission_modal, "true");
      setVisible(false)
    }

    checkPermission = async () => {
        //Calling the permission function
        if (Platform.OS === "android") {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            ]).then((result) => {
                if (
                    result["android.permission.CAMERA"] &&
                    result["android.permission.WRITE_EXTERNAL_STORAGE"] &&
                    result["android.permission.READ_EXTERNAL_STORAGE"] === "granted"
                ) {
                    console.log("모든 권한 획득");
                } else {
                    console.log("모든 권한 획득");
                }
            });
        } else {
            await Linking.openURL('app-settings:')
        }
    };

  render() {
    const { isShowPermissionModal } = this.props;

    return (
      <Modal
        isVisible={isShowPermissionModal}
        onBackdropPress={() => this.handlePermission()}
      >
        <View style={styles.alertBox}>
          <TouchableOpacity
            style={{ position: "absolute", top: 15, right: 15, zIndex: 5 }}
            onPress={() => this.handlePermission()}
          >
            <Image
              source={require("../../assets/image/ticket/close_page.png")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
          <Text style={styles.title}>{MainText.permissionModalTitle}</Text>
          <View
            style={{
              paddingTop: 17,
              paddingBottom: 13,
              paddingLeft: 20,
              borderBottomColor: "#dddddd",
              borderBottomWidth: 0.5,
              borderTopColor: "#dddddd",
              borderTopWidth: 0.5,
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.AppleL,
                fontSize: 14,
                letterSpacing: -0.35,
                color: "#222222",
                lineHeight: 17,
              }}
            >
              {MainText.permissionModalDesc}
            </Text>
          </View>
          <View
            style={{ paddingTop: 12.5, paddingLeft: 20, paddingBottom: 30 }}
          >
            <Text
              style={{
                fontFamily: Fonts.AppleB,
                letterSpacing: -0.35,
                color: "#222222",
              }}
            >
              {MainText.accessRights}
            </Text>
            {this.renderPermissionBox(
              require("../../assets/image/main/push.png"),
              `${MainText.optional} ${MainText.push}`,
              MainText.pushDesc
            )}
            {this.renderPermissionBox(
              require("../../assets/image/main/album.png"),
              `${MainText.optional} ${MainText.album}`,
              MainText.cameraDesc
            )}
            {this.renderPermissionBox(
              require("../../assets/image/main/camera.png"),
              `${MainText.optional} ${MainText.camera}`,
              MainText.cameraDesc
            )}
            <Text
              style={{
                marginTop: 19.5,
                fontFamily: Fonts.AppleR,
                fontSize: 11,
                lineHeight: 15,
                letterSpacing: -0.28,
                color: "#999999",
              }}
            >
              {MainText.permissionModalDesc_2}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              backgroundColor: "#000000",
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
              marginBottom: -1
            }}
            onPress={() => this.handlePermission()}
          >
            <Text
              style={{
                fontFamily: Fonts.AppleB,
                fontSize: 16,
                letterSpacing: -0.4,
                color: "#ffffff",
              }}
            >
              {Generic.confirm}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

export default PermissionModal;
