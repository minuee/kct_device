import React, {useState} from "react";
import {StyleSheet, TouchableOpacity, Text, Image, View} from "react-native";

import Colors from "../../model/lib/Utils/Colors";
import Fonts from "../../model/lib/Utils/Fonts";
import {Generic, TagText, TicketText} from "../../model/lib/Utils/Strings";
import AlertModal from "../modal/AlertModal";
import {DEVICE_WIDTH} from "../../model/lib/Utils/Constants";

const styles = StyleSheet.create({
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
    title: {
        fontSize: 20,
        fontWeight: "bold",
        fontStyle: "italic",
        color: "#333333",
        width: DEVICE_WIDTH - 120,
    },
    subscribeBox: {
        width: 68.5,
        height: 25,
        borderRadius: 2.5,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        borderWidth: 0.5,
    },
});

export const TagListItem = (props) => {
    const {item, navigation, createSbs, eSESSION} = props;
    const [isSubscribe, setIsSubscribe] = useState(item.is_subscribe)
    const [isShowAlertModal, setIsShowAlertModal] = useState(false)


    const setCreateSbs = () => {
        if(eSESSION.mber_no !== undefined) {
            let params = {
                tag_no: item.tag_no,
            }

            createSbs(params).then((res) => {
                setIsSubscribe(!isSubscribe)
            }).catch((err) => {
                this.setState({isShowAlertModal: true})
            });
        } else
            setIsShowAlertModal(true)
    }

    return (
        <View style={{marginBottom: 40}}>
            <View style={[styles.betweenCenter, {marginBottom: 15.5}]}>
                <Text style={styles.title}>#{item.tag_nm}</Text>
                <TouchableOpacity
                    style={[
                        styles.subscribeBox,
                        {
                            backgroundColor: isSubscribe ? Colors.MAIN_COLOR : "transparent",
                            borderColor: isSubscribe ? "transparent" : Colors.MAIN_COLOR,
                        },
                    ]}
                    onPress={() => setCreateSbs()}
                >
                    <Text
                        style={{
                            fontFamily: Fonts.AppleR,
                            fontSize: 13,
                            color: isSubscribe ? "#f5f5f5" : Colors.MAIN_COLOR,
                        }}
                    >
                        {isSubscribe ? TagText.subscribing : TagText.subscribe}
                    </Text>
                    {isSubscribe && (
                        <Image
                            style={{marginLeft: 2, width: 14, height: 14}}
                            source={require("../../assets/image/tag/check_black_48_dp_1.png")}
                        />
                    )}
                </TouchableOpacity>
            </View>
            {item.ntt && (
                <TouchableOpacity
                    style={styles.betweenCenter}
                    onPress={() => navigation.navigate("TagDetail", {tag_no: item.tag_no})}
                >
                    {item.ntt[0] && (
                        <Image
                            source={{uri: item.ntt[0].img_url_addr}}
                            style={{width: "66%", height: 211}}
                        />
                    )}
                    <View style={{width: "31.8%", height: 211}}>
                        <View style={{width: "100%", height: 102}}>
                            {item.ntt[1] && (
                                <Image
                                    source={{uri: item.ntt[1].img_url_addr}}
                                    style={{width: "100%", height: "100%"}}
                                />
                            )}
                        </View>
                        <View style={{width: "100%", height: 102, marginTop: 7}}>
                            {item.ntt[2] && (
                                <Image
                                    source={{uri: item.ntt[2].img_url_addr}}
                                    style={{width: "100%", height: "100%"}}
                                />
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            )}
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
