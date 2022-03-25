// 세금계산서 신청 불가 모달
// 업체 인증 완료. 모달
import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Image, View, Text } from "react-native";
import Modal from "react-native-modal";

import Fonts from "../../model/lib/Utils/Fonts";
import {MyPageText} from "../../model/lib/Utils/Strings";

const styles = StyleSheet.create({
    auctionModalBox: {
        backgroundColor: "white",
        alignItems: "center",
        paddingHorizontal: 15.5,
        paddingBottom: 28.5,
        paddingTop: 25,
        marginHorizontal: 22.5,
        borderRadius: 5,
    },
    title: {
        marginTop: 25,
        fontFamily: Fonts.AppleB,
        fontSize: 20,
        letterSpacing: -0.5,
        color: "#222222",
    },
    taxModalTitle: {
        marginTop: 7.5,
        fontFamily: Fonts.AppleB,
        fontSize: 17,
        letterSpacing: -0.43,
        color: "#2a2e34",
    },
    subMessage: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        letterSpacing: -0.33,
        color: "#222222",
        lineHeight: 19,
        textAlign: "center",
        marginTop: 12.7,
    },
    taxModalSubMessasge: {
        fontFamily: Fonts.AppleR,
        fontSize: 14,
        letterSpacing: -0.35,
        color: "#555555",
        marginTop: 15,
        lineHeight: 20,
        textAlign: "center",
    },
    btn: {
        height: 50,
        borderRadius: 5,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginTop: 25,
    },
    btnText: {
        fontFamily: Fonts.AppleB,
        fontSize: 16,
        letterSpacing: -0.4,
        color: "#ffffff",
    },
});

class TaxApplicationModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { isShowCompleteModal, isTaxModal, setVisible, title } = this.props;

        return (
            <Modal
                isVisible={isShowCompleteModal}
                onBackdropPress={() => {
                    if (isTaxModal) setVisible(false);
                }}
            >
                {!isTaxModal && (
                    <TouchableOpacity
                        style={{
                            alignSelf: "flex-end",
                            marginRight: 32.5,
                            marginBottom: 12,
                        }}
                        onPress={() => setVisible(false)}
                    >
                        <Image
                            source={require("../../assets/image/modal/modal_close.png")}
                            style={{ width: 16, height: 16 }}
                        />
                    </TouchableOpacity>
                )}

                <View style={styles.auctionModalBox}>
                    <Image
                        source={require("../../assets/image/modal/fail_graphic_small.png")}
                        style={
                            isTaxModal ? { width: 37, height: 37 } : { width: 60, height: 60 }
                        }
                    />
                    <Text style={isTaxModal ? styles.taxModalTitle : styles.title}>
                        {title}
                    </Text>
                    <Text style={isTaxModal ? styles.taxModalSubMessasge : styles.subMessage}>
                        {MyPageText.taxFailMessage1}<Text style={{color: "#9a00ff"}}>{MyPageText.taxFailMessage2}</Text>{MyPageText.taxFailMessage3}
                    </Text>
                </View>
            </Modal>
        );
    }
}

export default TaxApplicationModal;
