import React from "react";
import {StyleSheet, TouchableOpacity, Text, Image, View} from "react-native";

import Fonts from "../../../model/lib/Utils/Fonts";
import {Generic} from "../../../model/lib/Utils/Strings";
import {maskingAddress, maskingAll, maskingPhone} from "../../../model/lib/Utils";

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#000000",
        paddingTop: 18.8,
        paddingLeft: 15,
        paddingBottom: 15,
        marginBottom: 12.5,
    },
    radioBtn: {
        width: 20,
        height: 20,
        position: "absolute",
        top: 17.2,
        right: 17.2,
    },
    editBtns: {
        flexDirection: "row",
        position: "absolute",
        bottom: 14.5,
        right: 17,
    },
    btn: {
        height: 30,
        borderRadius: 5,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#dddddd",
        paddingHorizontal: 10.5,
        paddingVertical: 5.5,
        zIndex: 200,
    },
    btnText: {
        fontFamily: Fonts.AppleB,
        letterSpacing: -0.35,
        color: "#222222",
    },
    name: {
        fontFamily: Fonts.AppleB,
        fontSize: 16,
        letterSpacing: -0.4,
        color: "#222222",
    },
    address: {
        marginTop: 22.2,
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.3,
        color: "#222222",
        lineHeight: 19,
    },
    phone: {
        marginTop: 17.5,
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.3,
        color: "#222222",
    },
});

export const AddressCard = (props) => {
    const {navigation, item, isActive, handleDelete, setSelectedAddressId} = props;
    return (
        <View
            style={[styles.container, {borderColor: isActive ? "#000000" : "#dddddd", zIndex: -1}]}
            onPress={setSelectedAddressId}
        >
            <TouchableOpacity
                style={[styles.radioBtn, {zIndex: 100}]}
                onPress={setSelectedAddressId}
            >
                <Image
                    style={{width: 20, height: 20}}
                    source={isActive ? require("../../../assets/image/mypage/radio_button_on.png") : require("../../../assets/image/mypage/radio_button_on_2.png")}
                />
            </TouchableOpacity>
            <View style={styles.editBtns}>
                <TouchableOpacity
                    style={[styles.btn, {marginRight: 5}]}
                    onPress={() => isActive ? navigation.navigate("CreateAddress", {addr_no: item.dlvy_addr_no}) : null}>
                    <Text style={[styles.btnText, {color: isActive ? "#222222" : "#dddddd"},]}>
                        {Generic.edit}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => handleDelete()}>
                    <Text style={[styles.btnText, {color: isActive ? "#222222" : "#dddddd"},]}>
                        {Generic.delete}
                    </Text>
                </TouchableOpacity>
            </View>
            <Text style={[styles.name, {color: isActive ? "#222222" : "#dddddd"}]}>
                {item.receiver_name}
            </Text>
            <Text
                style={[styles.address, {color: isActive ? "#222222" : "#dddddd"}]}
            >
                {`${maskingAddress(item.주소)}\n${maskingAll(item.상세주소)}`}
            </Text>
            <Text style={[styles.phone, {color: isActive ? "#222222" : "#dddddd"}]}>
                {maskingPhone(item.휴대폰번호 || "")}
            </Text>
        </View>
    );
};
