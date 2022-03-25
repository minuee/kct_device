// 주소 설정
import React, {Component} from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import {connect} from "react-redux";

import {MyPageText} from "../../../model/lib/Utils/Strings";
import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";

import {TopHeader} from "../../../component/TopHeader";
import {AddressCard} from "../../../component/mypage/mysetting/AddressCard";
import MessageModal from "../../../component/modal/MessageModal";

import * as ActionAccount from "../../../model/action/eACCOUNT_DELIVERY";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
    },
    topHeaderBtn: {
        fontFamily: Fonts.AppleR,
        fontSize: 16,
        letterSpacing: -0.4,
        color: Colors.MAIN_COLOR,
    },
    deliveryBtn: {
        height: 60,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
    },
    deliveryText: {
        fontFamily: Fonts.AppleL,
        fontSize: 20,
        letterSpacing: -1,
        color: "#ffffff",
    },

});

class MySettingAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAddressId: props.navigation?.state?.params?.selectedAddressId || "",
            isShowMessageModal: false,
            isShowLimitModal: false,
            deliveryList: []
        };
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            this.getDeliveryList();
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    getDeliveryList = () => {
        const {eSESSION} = this.props;
        const {selectedAddressId} = this.state;
        let params = {
            skip: 0,
            limit: 5,
            mber_no: eSESSION.mber_no
        }
        this.props.getDeliveryList(params).then((res) => {
            const delivery_list = res.list.filter((item) => item.기본배송주소여부 === "Y")
            if(delivery_list.length > 0) {
                if(selectedAddressId === "")
                    this.setState({deliveryList: res.list, selectedAddressId: delivery_list[0].dlvy_addr_no})
                else
                    this.setState({deliveryList: res.list})
            } else {
                if(selectedAddressId === "")
                    this.setState({deliveryList: res.list, selectedAddressId: res.list[0].dlvy_addr_no})
                else
                    this.setState({deliveryList: res.list})
            }
        }).catch((err) => {
        });
    }

    handleUpdate = () => {
        const {eSESSION} = this.props;
        const {selectedAddressId, deliveryList} = this.state;

        if (selectedAddressId) {
            let params = {
                mber_no: eSESSION.mber_no,
                addr_no: selectedAddressId,
                basis_addr: "Y",
            }

            this.props.updateDelivery(params).then((res) => {
                this.setState({isShowMessageModal: true})
                console.log("filtered")
                console.log(deliveryList.filter((item) => item.addr_no !== selectedAddressId))
                deliveryList.filter((item) => item.dlvy_addr_no !== selectedAddressId).map((item) => this.handleBasis(item.dlvy_addr_no))
                this.getDeliveryList();
            }).catch((err) => {
            });
        }
    }

    handleBasis = (addr_no) => {
        const {eSESSION} = this.props;
        console.log(addr_no)
        let params = {
            mber_no: eSESSION.mber_no,
            addr_no: addr_no,
            basis_addr: "N",
        }

        this.props.updateDelivery(params).then((res) => {
        }).catch((err) => {
        });
    }

    handleDelete = () => {
        const {eSESSION} = this.props;
        const {selectedAddressId} = this.state;

        if (selectedAddressId) {
            let params = {
                mber_no: eSESSION.mber_no,
                addr_no: selectedAddressId,
            }

            this.props.removeDelivery(params).then((res) => {
                this.getDeliveryList();
            }).catch((err) => {
            });
        }
    }

    render() {
        const {navigation} = this.props;
        const {deliveryList, selectedAddressId, isShowMessageModal, isShowLimitModal} = this.state;
        return (
            <View style={styles.container}>
                <TopHeader
                    title={MyPageText.addressSetting}
                    navigation={navigation}
                    // hasRightBtn={deliveryList.length < 5}
                    hasRightBtn={true}
                    isText={true}
                    rightBtnSource={MyPageText.addAddress}
                    rightBtnStyle={styles.topHeaderBtn}
                    onLeftBtn={() => {
                        let delivery_item = deliveryList.filter((item) => item.dlvy_addr_no === selectedAddressId)[0]
                        if(navigation?.state?.params?.setDeliveryItem)
                            navigation.state.params.setDeliveryItem(delivery_item)
                        navigation.goBack()
                    }}
                    onPress={() => {
                        if (deliveryList.length < 5)
                            navigation.navigate("CreateAddress")
                        else this.setState({isShowLimitModal: true})
                    }}
                />
                <FlatList
                    data={deliveryList}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => {
                        return (
                            <AddressCard
                                navigation={navigation}
                                item={item}
                                isActive={item.dlvy_addr_no === selectedAddressId}
                                handleDelete={this.handleDelete}
                                setSelectedAddressId={() =>
                                    this.setState({selectedAddressId: item.dlvy_addr_no})
                                }
                            />
                        );
                    }}
                    keyExtractor={(_, i) => String(i)}
                    style={{paddingHorizontal: 20, marginTop: 12.5}}
                />
                <TouchableOpacity
                    style={[styles.deliveryBtn, selectedAddressId ? null : {backgroundColor: "#dddddd"}]}
                    onPress={() => this.handleUpdate()}
                >
                    <Text style={styles.deliveryText}>{MyPageText.defaultAddress}</Text>
                </TouchableOpacity>
                <MessageModal
                    title={MyPageText.defaultAddressModal}
                    subtitle={MyPageText.defaultAddressComplete}
                    isShowMessageModal={isShowMessageModal}
                    setVisible={() => this.setState({isShowMessageModal: false})}
                />
                <MessageModal
                    // title={MyPageText.addressLimitModal}
                    subtitle={MyPageText.addressLimitMessage}
                    hasBtn={false}
                    isShowMessageModal={isShowLimitModal}
                    setVisible={() => this.setState({isShowLimitModal: false})}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    eSESSION: state.eSESSION.eSESSION,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    getDeliveryList: (params) => dispatch(ActionAccount.getDeliveryList(params)),
    updateDelivery: (params) => dispatch(ActionAccount.updateDelivery(params)),
    removeDelivery: (params) => dispatch(ActionAccount.removeDelivery(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MySettingAddress);
