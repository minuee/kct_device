// 사진 선택 모달
// 사진찍기/앨범에서 사진선택/취소

import React, { Component } from "react";
import {StyleSheet, TouchableOpacity, View, Text, Platform, PermissionsAndroid} from "react-native";
import {connect} from "react-redux";
import Modal from "react-native-modal";
import {launchCamera, launchImageLibrary} from "react-native-image-picker";

import Fonts from "../../model/lib/Utils/Fonts";
import { Generic, MyPageText } from "../../model/lib/Utils/Strings";
import * as ActionFile from "../../model/lib/UploadManager/eFILE";
import {getFileName} from "../../model/lib/Utils";

const styles = StyleSheet.create({
  alertBox: {
    borderRadius: 5,
    backgroundColor: "#ffffff",
    paddingTop: 20,
    paddingLeft: 20,
    paddingBottom: 5,
    marginHorizontal: 32.5,
  },
  title: {
    fontFamily: Fonts.AppleB,
    fontSize: 16,
    letterSpacing: -0.4,
    color: "#2a2e34",
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: Fonts.AppleR,
    letterSpacing: -0.35,
    color: "#000000",
  },
});

class SelectPhotoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  launchImageLibrary = () => {
    const options = {
      title: 'Load Photo',
      quality: 1.0,
      maxWidth: 300,
      maxHeight: 300,
      mediaType: "photo",
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(
        options,
        (response) => {
          if (!response.didCancel) {
            console.log(response.assets[0]);
            this.uploadByFile(response.assets[0]);
          }
        }
    );
  }

  launchCamera = () => {
    const options = {
      title: 'Load Photo',
      quality: 1.0,
      maxWidth: 300,
      maxHeight: 300,
      mediaType: "photo",
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(
        options,
        (response) => {
          if (!response.didCancel) {
            this.uploadByFile(response.assets[0])
          }
        }
    );
  }

  uploadByFile = (file) => {
    const { setVisible, updatePhoto } = this.props;
    let params = {
      uri: file.uri,
      type: file.type,
      name: getFileName(file.uri),
    };
    this.props.uploadByImage(params).then((res) => {
      updatePhoto(res[0].original)
      setVisible()
    }).catch((err) => {
      setVisible()
    });
  };

  renderOptionBox = (title, onPress) => {
    return (
      <TouchableOpacity style={{ marginBottom: 15 }} onPress={onPress}>
        <Text style={styles.subtitle}>{title}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { isShowSelectPhotoModal, setVisible } = this.props;

    return (
      <Modal isVisible={isShowSelectPhotoModal}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{MyPageText.selectPhoto}</Text>
          {this.renderOptionBox(MyPageText.takePhoto, this.launchCamera)}
          {this.renderOptionBox(MyPageText.getPhoto, this.launchImageLibrary)}
          {this.renderOptionBox(Generic.cancel, setVisible)}
        </View>
      </Modal>
    );
  }
}

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
  uploadByImage: (params) => dispatch(ActionFile.uploadByImage(params)),
});

export default connect(undefined, mapDispatchToProps)(SelectPhotoModal);
