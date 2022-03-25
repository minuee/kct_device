// WebView
import React, {Component} from "react";
import WebView from "react-native-webview";
import {connect} from "react-redux";
import {ActivityIndicator, Linking, Platform, View} from "react-native";
import SendIntentAndroid from "react-native-send-intent";

import {getMallID, getPGCallbackUrl, getPGUrl} from "../../../model/api";
import {DEVICE_WIDTH, StatusBarHeight} from "../../../model/lib/Utils/Constants";
import {notifyMessage} from "../../../model/lib/Utils";
import Colors from "../../../model/lib/Utils/Colors";

import * as ActionPayment from "../../../model/action/ePAYMENT";
import {CodeText} from "../../../model/lib/Utils/Strings";


class PaymentWebView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authPageUrl: "",
            isPointAvailable: false,
            pnt_amt: 0,
            order_no: "",
            sale_mth_cd: "",
            purchaseType: "",

            exchng_vol_trd_no: "",
            exchng_vol_trd_typ_cd: "",
        };
    }
    componentDidMount() {
        const {navigation} = this.props;
        if(navigation.state.params.sale_mth_cd) {
            const {isPointAvailable, pnt_amt, sale_mth_cd, purchaseType, order_no} = navigation.state.params; // pay info
            this.setState({isPointAvailable, pnt_amt, sale_mth_cd, purchaseType, order_no}, () => this.createPayView())
        } else if(navigation.state.params.exchng_vol_trd_no) {
            const {isPointAvailable, pnt_amt, exchng_vol_trd_typ_cd} = navigation.state.params; // pay info
            this.setState({isPointAvailable, pnt_amt, exchng_vol_trd_no, exchng_vol_trd_typ_cd}, () => this.createExchngPayView())
        }
    }

    createPayView = () => {
        const {eSESSION, navigation} = this.props;
        const {amount, order_no, sale_mth_cd, goods_nm} = navigation.state.params; // pay info
        // 결제가격 : amount,
        // order_no/SALE_MTH_CD :  shopOrderNo,
        // goodsName: "상품명"
        const link = getPGUrl();
        let params = {
            mallId: getMallID(),
            payMethodTypeCode: "11",
            currency: "00",
            clientTypeCode: "00",
            returnUrl: getPGCallbackUrl(),
            deviceTypeCode: "mobile",
            langFlag: "KOR",
            mallName: "Tplus 마켓",

            amount: amount,
            shopOrderNo: `${order_no}/${sale_mth_cd}`, // "order_no/SALE_MTH_CD"
        }
        let orderInfo = {
            goodsTypeCode: 0, // 추후 교환권일 때, 1로 처리
            goodsName: goods_nm,
            customerInfo : {
                customerId: eSESSION.mber_no || "",
                customerName: eSESSION.mber_nm || "",
                customerMail: eSESSION.email_addr || "",
                customerContactNo: eSESSION.moblphon_no || "",
            }
        }
        Object.assign(params, {orderInfo: orderInfo})
        this.props.createPayView(link, params).then((res) => {
            if(res.authPageUrl)
                this.setState({authPageUrl: res.authPageUrl})
            else if(res.resMsg)
                notifyMessage(res.resMsg)
        }).catch((err) => {
        });
    };
    createExchngPayView = () => { // 교환권 결제
        const {eSESSION, navigation} = this.props;
        const {amount, exchng_vol_trd_no, exchng_vol_trd_typ_cd, goods_nm} = navigation.state.params; // pay info
        // 결제가격 : amount,
        // order_no/SALE_MTH_CD :  shopOrderNo,
        // goodsName: "상품명"
        const link = getPGUrl();
        let params = {
            mallId: getMallID(),
            payMethodTypeCode: "11",
            currency: "00",
            clientTypeCode: "00",
            returnUrl: getPGCallbackUrl(),
            deviceTypeCode: "mobile",
            langFlag: "KOR",
            mallName: "Tplus 마켓",

            amount: amount,
            shopOrderNo: `${exchng_vol_trd_no}/${exchng_vol_trd_typ_cd}`,
        }
        let orderInfo = {
            goodsTypeCode: 1, // 추후 교환권일 때, 1로 처리
            goodsName: goods_nm,
            customerInfo : {
                customerId: eSESSION.mber_no || "",
                customerName: eSESSION.mber_nm || "",
                customerMail: eSESSION.email_addr || "",
                customerContactNo: eSESSION.moblphon_no || "",
            }
        }
        Object.assign(params, {orderInfo: orderInfo})
        this.props.createPayView(link, params).then((res) => {
            if(res.authPageUrl)
                this.setState({authPageUrl: res.authPageUrl})
            else if(res.resMsg)
                notifyMessage(res.resMsg)
        }).catch((err) => {
        });
    }

    onShouldStartLoadWithRequest = (event) => {
        if (
            event.url.startsWith('http://') ||
            event.url.startsWith('https://') ||
            event.url.startsWith('about:blank')
        ) {
            return true;
        }
        if (Platform.OS === 'android') {
            let splittedUrl = event.url.replace('://', ' ').split(' ');
            let scheme = splittedUrl[0];
            let path = "";
            let package_info = "";

            if (scheme.includes('intent')) {
                let intentUrl = splittedUrl[1].split('#Intent;');
                let host = intentUrl[0];
                let args = intentUrl[1].split(';');

                if (scheme !== 'intent') {
                    scheme = scheme.split(':')[1];
                    path = scheme + '://' + host;
                }
                args.forEach((s) => {
                    if (s.startsWith('scheme')) {
                        let scheme_info = s.split('=')[1];
                        path = scheme_info + '://' + host;
                        scheme = scheme_info;
                    } else if (s.startsWith('package')) {
                        package_info = s.split('=')[1];
                    }
                });
            } else {
                path = this.url;
            }
            try {
                Linking.openURL(path).catch(err => {
                    SendIntentAndroid.openAppWithUri(event.url).then(wasOpened => {
                            if (!wasOpened) {
                                notifyMessage('앱 실행에 실패했습니다. 설치가 되어있지 않은 경우 설치하기 버튼을 눌러주세요.');
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                });
            } catch(err) {
                return false;
            }
            return false;
        } else {
            Linking.openURL(event.url).catch(err => {
                notifyMessage('앱 실행에 실패했습니다. 설치가 되어있지 않은 경우 설치하기 버튼을 눌러주세요.');
            });
            return false;
        }
    };

    handleKICCSuccess = async (event) => {
        const {navigation} = this.props;
        const {sale_mth_cd, order_no, exchng_vol_trd_typ_cd, purchaseType} = this.state;
        if (event) { // 실제 데이터 처리
            let {data} = event.nativeEvent;
            data = JSON.parse(data);
            if (data.success_yn === 'Y') {

                if (sale_mth_cd === CodeText.sale_mth_cd_i)
                    await this.handleImmediPoint();
                else if (sale_mth_cd === CodeText.sale_mth_cd_a && purchaseType === "remain")
                    await this.handlePayAucRemainPoint();
                else if (sale_mth_cd === CodeText.sale_mth_cd_a && purchaseType !== "remain")
                    await this.handleAucPoint();
                else if (sale_mth_cd === CodeText.sale_mth_cd_r && purchaseType === "remain_reserv")
                    await this.handleReservRemainPoint();
                else if (sale_mth_cd === CodeText.sale_mth_cd_r && purchaseType !== "remain_reserv")
                    await this.handleReservPoint();
                else if (sale_mth_cd === CodeText.sale_mth_cd_g)
                    await this.handleCoperPoint();

                if(exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_i) // 즉시
                    await this.handleImmediExchngPoint();
                else if(exchng_vol_trd_typ_cd === CodeText.exchng_vol_trd_typ_cd_a) // 경매
                    await this.handleAucExchngPoint();

                if(sale_mth_cd) {
                    const {purchaseType, selectedPaymentMethod} = navigation.state.params; // "PaymentResult" navigate
                    navigation.navigate("PaymentResult", {
                        purchaseType: purchaseType,
                        selectedPaymentMethod: selectedPaymentMethod,
                        order_no: order_no,
                        sale_mth_cd: sale_mth_cd, // 즉시거래
                    })
                } else { // 교환권 관련
                    navigation.navigate("TicketPaymentResult", {
                        exchng_vol_trd_typ_cd: exchng_vol_trd_typ_cd,
                    })
                }
            } else {
                if(sale_mth_cd)
                    navigation.navigate("PaymentResultFail");
                else
                    navigation.navigation("TicketPaymentResultFail");
            }
        } else {
            if(sale_mth_cd)
                navigation.navigate("PaymentResultFail");
            else
                navigation.navigation("TicketPaymentResultFail");
        }
    }

    handleImmediPoint = () => {
        const {order_no, pnt_amt} = this.state;
        let params = {
            immedi_purchase_no: order_no,
            pnt_amt,
        }
        this.props.createImmediPoint(params).then((res) => {
        }).catch((err) => {
        });
    }
    handleCoperPoint = () => {
        const {order_no, pnt_amt} = this.state;
        let params = {
            copertn_purchase_no: order_no,
            pnt_amt,
        }

        this.props.createPayCoperPoint(params).then((res) => {
        }).catch((err) => {
        });
    }
    handleAucPoint = () => {
        const {order_no, pnt_amt} = this.state;
        let params = {
            auc_trd_no: order_no,
            pnt_amt,
        }
        this.props.createPayAucPoint(params).then((res) => {
        }).catch((err) => {
        });
    }
    handlePayAucRemainPoint = () => {
        const {order_no, pnt_amt} = this.state;
        let params = {
            auc_trd_no: order_no,
            pnt_amt,
        }
        return this.props.createPayAucRemainPoint(params).then((res) => {

        }).catch((err) => {
        });
    }
    handleReservPoint = () => {
        const {order_no, pnt_amt} = this.state;
        let params = {
            reserv_purchase_no: order_no,
            pnt_amt,
        }
        this.props.createReservPoint(params).then((res) => {
        }).catch((err) => {
        });
    }
    handleReservRemainPoint = () => {
        const {order_no, pnt_amt} = this.state;
        let params = {
            reserv_purchase_no: order_no,
            pnt_amt,
        }
        this.props.createReservRemainPoint(params).then((res) => {
        }).catch((err) => {
        });
    }

    handleImmediExchngPoint = () => {
        const {exchng_vol_trd_no, pnt_amt} = this.state;
        let params = {
            exchng_vol_trd_no,
            pnt_amt,
        }

        return this.props.createImmediExchngPoint(params).then((res) => {

        }).catch((err) => {
        });
    }
    handleAucExchngPoint = () => {
        const {navigation} = this.props;
        const {exchng_vol_auc_trd_no} = navigation.state.params;
        const {point} = this.state;
        let params = {
            exchng_vol_auc_trd_no,
            pnt_amt: parseInt(point)
        }

        return this.props.createAucExchngPoint(params).then((res) => {

        }).catch((err) => {
        });
    }

    render() {
        const {authPageUrl} = this.state;
        if(authPageUrl === "")
            return (
                <View style={{flex: 1, justifyContent: "center"}}>
                    <ActivityIndicator size="large" color={Colors.MAIN_COLOR}/>
                </View>
            );
        else
            return (
                <WebView
                    style={{ marginTop: StatusBarHeight, width: DEVICE_WIDTH }}
                    source={{ uri: authPageUrl }}
                    originWhitelist={['*']}
                    sharedCookiesEnabled={true}
                    onMessage={this.handleKICCSuccess}
                    onShouldStartLoadWithRequest={event => {
                        return this.onShouldStartLoadWithRequest(event);
                    }}
                />
            );
    }
}

const mapStateToProps = (state) => ({
    eSESSION: state.eSESSION.eSESSION,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    createPayView: (link, params) => dispatch(ActionPayment.createPayView(link, params)),
    // point 처리
    createImmediPoint: (params) => dispatch(ActionPayment.createImmediPoint(params)),
    createPayCoperPoint: (params) => dispatch(ActionPayment.createCoperPoint(params)),
    createReservPoint: (params) => dispatch(ActionPayment.createReservPoint(params)),
    createReservRemainPoint: (params) => dispatch(ActionPayment.createReservRemainPoint(params)),
    createPayAucPoint: (params) => dispatch(ActionPayment.createAucPoint(params)),
    createPayAucRemainPoint: (params) => dispatch(ActionPayment.createAucRemainPoint(params)),
    // point 처리
    createImmediExchngPoint: (params) => dispatch(ActionPayment.createImmediExchngPoint(params)),
    createAucExchngPoint: (params) => dispatch(ActionPayment.createAucExchngPoint(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentWebView);
