// 피드 > 앨범 선택
import React, {Component} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ImageBackground, Platform, PermissionsAndroid, FlatList,
} from "react-native";
import CameraRoll from "@react-native-community/cameraroll";

import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";
import {Generic, MyPageText, TagText} from "../../../model/lib/Utils/Strings";
import {DEVICE_WIDTH, StatusBarHeight} from "../../../model/lib/Utils/Constants";
import {notifyMessage} from "../../../model/lib/Utils";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    statusBar: {height: StatusBarHeight},
    naviBar: {
        width: "100%",
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    headerLeftBtn: {
        width: 50,
        height: 50,
        position: "absolute",
        left: 20,
        justifyContent: "center",
        zIndex: 5,
    },
    headerLeftText: {
        fontFamily: Fonts.AppleR,
        letterSpacing: -0.7,
        color: "#333333",
    },
    headerTitleBox: {alignItems: "center", justifyContent: "center", flex: 1},
    headerTitle: {
        fontFamily: Fonts.AppleR,
        fontSize: 18,
        color: "#191919",
    },
    headerRightBtn: {position: "absolute", right: 20},
    headerRightText: {
        fontFamily: Fonts.AppleSB,
        letterSpacing: -0.7,
        color: Colors.MAIN_COLOR,
    },
});

class FeedSelectPhoto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelectionMode: false,
            data: '',
            selectedImage: "",
            selectedImageIds: [],
            selectedImageUris: [],
        };
    }

    async componentDidMount() {
        if (Platform.OS === 'android') {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Permission Explanation',
                    message: 'ReactNativeForYou would like to access your photos!',
                },
            );
            if (result !== 'granted') {
                console.log('Access to pictures was denied');
                return;
            }
        }

        CameraRoll.getPhotos({
            first: 100000,
            assetType: 'Photos',
        }).then(res => {
            this.setState({selectedImage: {...res.edges[0].node.image, type: res.edges[0].node.type}, data: res.edges});
        }).catch((error) => {
            console.log(error);
        });

    }

    renderHeader = () => {
        const {navigation} = this.props;
        const {setImageUrls, limit} = navigation.state.params;
        const {isSelectionMode, selectedImage, selectedImageIds} = this.state;
        return (
            <View style={{backgroundColor: "white"}}>
                <View style={styles.statusBar}/>

                <View style={styles.naviBar}>
                    <TouchableOpacity
                        style={styles.headerLeftBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.headerLeftText}>{Generic.cancel}</Text>
                    </TouchableOpacity>
                    <View style={styles.headerTitleBox}>
                        <Text style={styles.headerTitle}>{TagText.album}</Text>
                    </View>

                    <TouchableOpacity style={styles.headerRightBtn}
                    onPress={() => {
                        if(limit && limit < selectedImageIds.length && isSelectionMode)
                            notifyMessage(`${MyPageText.photoMessage_1}${limit}${MyPageText.photoMessage_2}`)
                        else if(!isSelectionMode) {
                            setImageUrls([selectedImage])
                            navigation.pop();
                        }
                        else {
                            setImageUrls(selectedImageIds)
                            navigation.pop();
                        }
                    }}>
                        <Text style={styles.headerRightText}>{Generic.confirm}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    renderSelectedImageBox = () => {
        const {isSelectionMode, selectedImage} = this.state;
        return (
            <TouchableOpacity>
                <ImageBackground
                    source={{uri: selectedImage.uri}}
                    style={{width: DEVICE_WIDTH, height: DEVICE_WIDTH}}
                >
                    <TouchableOpacity
                        style={{position: "absolute", bottom: 20, right: 20}}
                        onPress={() => this.setState({isSelectionMode: !isSelectionMode, selectedImageIds: []})}
                    >
                        <Image
                            style={{width: 40, height: 40}}
                            source={
                                isSelectionMode
                                    ? require("../../../assets/image/tag/photo_selected.png")
                                    : require("../../../assets/image/tag/photo_default.png")
                            }
                        />
                    </TouchableOpacity>
                </ImageBackground>
            </TouchableOpacity>
        );
    };

    renderImageList = () => {
        const {isSelectionMode, selectedImageUris, selectedImageIds, selectedImage, data} =
            this.state;
        return (
            <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                style={{marginBottom: 4}}
                numColumns={4}
                renderItem={({item}) => {
                    const selectedIdx = selectedImageUris.findIndex(
                        (imageIdx) => imageIdx === item.node.image.uri
                    );
                    return (
                        <TouchableOpacity
                            style={{marginTop: 4, width: "24%", marginRight: "1.33%"}}
                            onPress={() => {
                                if (isSelectionMode) {
                                    let updatedImageIds = [];
                                    let updatedImageUris = [];
                                    if (selectedIdx !== -1) {
                                        selectedImageIds.splice(selectedIdx, 1);
                                        updatedImageIds = selectedImageIds;
                                        selectedImageUris.splice(selectedIdx, 1);
                                        updatedImageUris = selectedImageUris;
                                    } else {
                                        updatedImageIds = selectedImageIds.concat({...item.node.image, type: item.node.type});
                                        updatedImageUris = selectedImageUris.concat(item.node.image.uri);
                                    }

                                    console.log("[selectedImageIdsselectedImageIds]")
                                    console.log(selectedImageIds)

                                    this.setState({
                                        selectedImageUris: updatedImageUris,
                                        selectedImageIds: updatedImageIds,
                                        selectedImage: {...item.node.image, type: item.node.type},
                                    });
                                } else {
                                    this.setState({selectedImage: {...item.node.image, type: item.node.type}});
                                }
                            }}
                        >
                            <ImageBackground
                                source={{uri: item.node.image.uri}}
                                style={{width: "100%", height: 87}}
                            >
                                {isSelectionMode ? (
                                    <View style={{position: "absolute", top: 6, right: 6}}>
                                        {selectedIdx !== -1 ? (
                                            <ImageBackground
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                                source={require("../../../assets/image/tag/select_btn_on.png")}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 13,
                                                        letterSpacing: -0.65,
                                                        textAlign: "center",
                                                        color: "#ffffff",
                                                    }}
                                                >
                                                    {selectedIdx + 1}
                                                </Text>
                                            </ImageBackground>
                                        ) : (
                                            <Image
                                                style={{width: 20, height: 20}}
                                                source={require("../../../assets/image/tag/select_btn_off.png")}
                                            />
                                        )}
                                    </View>
                                ) : selectedImage.uri === item.node.image.uri ? (
                                    <View
                                        style={{
                                            width: "100%",
                                            height: 87,
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            backgroundColor: "rgba(255,255,255,0.6)",
                                        }}
                                    />
                                ) : null}
                            </ImageBackground>
                        </TouchableOpacity>
                    )
                }}
            />
        );
    };

    render() {
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                {this.renderSelectedImageBox()}
                {this.renderImageList()}
            </View>
        );
    }
}

export default FeedSelectPhoto;
