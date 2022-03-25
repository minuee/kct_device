import React, {Component} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    BackHandler
} from "react-native";
import {connect} from "react-redux";

import Fonts from "../../../model/lib/Utils/Fonts";
import {PaymentText} from "../../../model/lib/Utils/Strings";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    paymentResultBox: {
        flex: 1,
        alignItems: "center",
        paddingTop: 210.5,
    },
    success: {width: 60, height: 60},
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
        textAlign: 'center'
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
});

class PaymentResultFail extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const {navigation} = this.props;
        this._navListener = BackHandler.addEventListener(
            "hardwareBackPress",
            () => navigation.pop(4)
        );
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <View style={{flex: 1, marginHorizontal: 20}}>
                    <View style={styles.paymentResultBox}>
                        <Image
                            source={require("../../../assets/image/modal/fail_graphic_small.png")}
                            style={styles.success}
                        />
                        <Text style={styles.paymentResult}>
                            {PaymentText.paymentFail}
                        </Text>
                        <Text style={styles.resultMessage}>
                            {PaymentText.paymentFailMessage}
                        </Text>
                        <TouchableOpacity
                            style={styles.purchaseListBtn}
                            onPress={() => navigation.pop(4)}
                        >
                            <Text style={styles.purchaseListBtnText}>
                                {PaymentText.goToHome}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    eSESSION: state.eSESSION.eSESSION,
    eCOMM_CD: state.eCOMM_CD.eCOMM_CD,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentResultFail);

