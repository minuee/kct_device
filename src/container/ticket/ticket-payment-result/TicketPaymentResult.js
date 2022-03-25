// 교환권 결제 결과화면
import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import Fonts from "../../../model/lib/Utils/Fonts";
import {CodeText, TicketText} from "../../../model/lib/Utils/Strings";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    paymentResultBox: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 210.5,
    },
    success: { width: 60, height: 60 },
    paymentResult: {
        fontFamily: Fonts.AppleL,
        fontSize: 20,
        letterSpacing: -1,
        textAlign: "center",
        marginTop: 40,
    },
    resultMessage: {
        fontFamily: Fonts.AppleL,
        letterSpacing: -0.7,
        color: "#969696",
        marginTop: 10,
    },
    purchaseListBtn: {
        borderRadius: 5,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 50,
        position: "absolute",
        bottom: 66.8,
    },
    purchaseListBtnText: {
        fontFamily: Fonts.AppleR,
        fontSize: 20,
        letterSpacing: -0.5,
        color: "#ffffff",
    },
    homeBtn: { position: "absolute", bottom: 30 },
    homeBtnText: {
        fontFamily: Fonts.AppleL,
        letterSpacing: -0.7,
        textAlign: "center",
        color: "#969696",
        textDecorationLine: "underline",
    },
});

class TicketPaymentResult extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { navigation } = this.props;
        const { exchng_vol_trd_typ_cd } = navigation.state.params;

        return (
            <View style={styles.container}>
                <View style={styles.paymentResultBox}>
                    <Image
                        source={require("../../../assets/image/ticket/success_graphic.png")}
                        style={styles.success}
                    />
                    <Text style={styles.paymentResult}>
                        {exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i
                            ? TicketText.paymentFinished
                            : TicketText.auctionFinished}
                    </Text>
                    <Text style={styles.resultMessage}>
                        {exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i
                            ? TicketText.resultMessage
                            : TicketText.auctionResultMessage}
                    </Text>
                    <TouchableOpacity
                        style={styles.purchaseListBtn}
                        onPress={() => {
                            navigation.pop(4);
                            navigation.navigate("MyBuy");
                        }}>
                        <Text style={styles.purchaseListBtnText}>
                            {TicketText.purchaseHistory}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.pop(4)}>
                        <Text style={styles.homeBtnText}>
                            {TicketText.voucherStoreHome}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
export default TicketPaymentResult;
