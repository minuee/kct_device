// 스토어 > 교환권 화면
import React, {Component} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ImageBackground,
} from "react-native";
import {connect} from "react-redux";
import produce from "immer";

import {TopHeader} from "../../component/TopHeader";
import {CartText, PaymentText} from "../../model/lib/Utils/Strings";
import Fonts from "../../model/lib/Utils/Fonts";
import {formattedNumber, notifyMessage} from "../../model/lib/Utils";

import * as ActionBasket from "../../model/action/eBASKET";
import * as ActionImmedi from "../../model/action/eIMMEDI_PURCHASE";

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
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    message: {
        fontFamily: Fonts.AppleB,
        fontSize: 13,
        letterSpacing: -0.33,
        color: "#000000",
        marginTop: 2,
    },
    subMessage: {
        fontFamily: Fonts.AppleR,
        fontSize: 11,
        letterSpacing: -0.28,
        color: "#777777",
    },
    infoIcon: {
        width: 18,
        height: 18,
        marginRight: 7.2,
    },
    footerTitle: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        letterSpacing: -0.33,
        color: "#999999",
    },
    footerDesc: {
        fontFamily: Fonts.AppleB,
        fontSize: 14,
        letterSpacing: -0.35,
        color: "#222222",
    },
    purchasePrice: {
        fontFamily: Fonts.AppleB,
        fontSize: 16,
        letterSpacing: -0.4,
        color: "#ff3884",
    },
    quantity: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        marginHorizontal: 19,
    },
    plus: {width: 25, height: 25},
    quantityBox: {
        marginTop: 7.5,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    submitBox: {
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "#dddddd",
    },
    submit: {
        fontFamily: Fonts.AppleR,
        fontSize: 20,
        color: "#f5f5f5",
    },
    infoWrap: {
        width: "100%",
        paddingLeft: 20,
        paddingVertical: 15.8,
        backgroundColor: "#f8f8f8",
        flexDirection: "row",
    },
    basketWrap: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 25,
    },
    basketProductImg: {
        width: 90,
        height: 90,
        borderRadius: 5,
        marginRight: 15,
    },
    basketProductSoldOut: {
        width: 90,
        height: 90,
        borderRadius: 5,
        backgroundColor: "rgba(0,0,0,0.4)",
        position: "absolute",
        top: 0,
        left: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    basketProductSoldOutText: {
        fontFamily: Fonts.AppleB,
        fontSize: 15,
        letterSpacing: -0.38,
        color: "#ffffff",
    },
    basketProductName: {
        fontFamily: Fonts.AppleR,
        letterSpacing: -0.35,
        color: "#000000",
    },
    basketOptionName: {
        fontFamily: Fonts.AppleR,
        fontSize: 11,
        letterSpacing: -0.28,
        color: "#000000",
        marginTop: 2.5,
    },
    basketPrice: {
        fontFamily: Fonts.AppleB,
        letterSpacing: -0.38,
        marginTop: 7.5,
    },
    basketSelectAll: {
        fontFamily: Fonts.AppleR,
        letterSpacing: -0.35,
        color: "#999999",
    },
    basketSelectDelete: {
        borderRadius: 2.5,
        borderStyle: "solid",
        borderWidth: 1,
        width: 56,
        height: 24,
        marginRight: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    basketDeleteAllBtn: {
        borderRadius: 2.5,
        width: 56,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    basketDeleteAll: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.3,
    },
    basketPaymentWrap: {
        paddingLeft: 20,
        paddingRight: 22.2,
        paddingTop: 18.2,
        paddingBottom: 15,
        borderRadius: 5,
        backgroundColor: "#f9f9f9",
        marginBottom: 50,
    },
    basketPaymentBorder: {
        height: 1,
        width: "100%",
        backgroundColor: "#dddddd",
        marginTop: 14.6,
        marginBottom: 12.4,
    },
});

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            voucherListType: "list",
            isShowToast: false,
            isShowFilterModal: false,
            filterId: 0,
            isSelectedAll: true,
            cartList: [],
            cartCount: 0,

            delivery_pay: 0,
            product_pay: 0
        };
    }

    componentDidMount() {
        this.getList();
    }

    getList = () => {
        const {eSESSION} = this.props;
        if(eSESSION.basket_no) {
            let params = {
                skip: 0,
                limit: 100,
                basket_no: eSESSION.basket_no,
                // basket_no: "2021110223585461G95U"
            }

            this.props.getList(params).then((res) => {
                if (res.list.length > 0) {
                    let newList = res.list.map((item, index) => {
                        return {...item, isSelected: true}
                    })
                    this.setState({
                        cartList: newList,
                        cartCount: parseInt(res.count),
                        isLoading: false
                    }, () => this.calculateCart())
                } else {
                    this.setState({
                        cartList: [],
                        cartCount: 0,
                        isSelectedAll: false,
                        isLoading: false
                    }, () => this.calculateCart())
                }
            }).catch((err) => {
            });
        }
    }

    calculateCart = () => {
        const {cartList} = this.state;
        let delivery_pay = 0
        let product_pay = 0
        cartList.filter((item) => item.isSelected).map((item) => {
            if (item.dlvy_cost_free_yn === "N")
                delivery_pay += parseInt(item.dlvy_cost_prc || 0)
            // product_pay += (parseInt(item.sale_prc || 0) + parseInt(item.add_prc_sum || 0)) // (상품가 + 옵션가)
            if (item?.add_optn.length > 0)
                product_pay += ((parseInt(item.sale_prc || 0) + parseInt(item.add_prc_sum || 0)) + parseInt(item.add_optn[0].add_amt) * parseInt(item.ord_cnt))
            else
                product_pay += ((parseInt(item.sale_prc || 0) + parseInt(item.add_prc_sum || 0)) * parseInt(item.ord_cnt)) // (상품가 + 옵션가)
            // product_pay *= parseInt(item.ord_cnt) // + 추가 옵션가
        })
        this.setState({delivery_pay, product_pay}) // * 수량
    }

    // 주문서 생성
    handleCreate = () => {
        this.props.create({}).then((res) => {
            this.handleCreateDetail(res.detail.immedi_purchase_ord_no)
        }).catch((err) => {
        });
    }
    // 주문서에 상품 생성
    handleCreateDetail = (immedi_purchase_ord_no) => {
        const {navigation} = this.props;
        const {cartList} = this.state;

        cartList.filter((item) => item.isSelected).map((item, index) => {
            let params = {
                immedi_purchase_ord_no: immedi_purchase_ord_no,
                goods_cnt: item.ord_cnt,
                goods_no: item.goods_no,
                goods_optn_no: item.goods_optn_no,
                basket_dtl_no: item.basket_dtl_no,
            }
            console.log("handleCreateDetail")
            console.log(params)
            this.props.createDetail(params).then((res) => {
                if (item.add_optn.length > 0) { // 추가 옵션 확인 (ex. 투명 케이스, USB 충전기 등등)
                    let dtl_list = (res.detail.dtl || []).filter((filterItem) => filterItem.goods_no === item.goods_no)
                    if (dtl_list.length > 0)
                        this.handleCreateOptn(index, immedi_purchase_ord_no, dtl_list[0].immedi_purchase_ord_dtl_no, item.add_optn[0].add_optn_no)
                    else this.handleDelete(immedi_purchase_ord_no)
                } else if (index + 1 === cartList.filter((item) => item.isSelected).length)
                    navigation.navigate("Payment", {
                        purchaseType: "cart",
                        immedi_purchase_ord_no: immedi_purchase_ord_no
                    })
            }).catch((err) => {
                this.handleDelete(immedi_purchase_ord_no);
            });
        })
    }
    // 주문서에 등록된 상품에 추가옵션 생성
    handleCreateOptn = (index, immedi_purchase_ord_no, immedi_purchase_ord_dtl_no, add_optn_no) => {
        const {navigation} = this.props;
        const {cartList} = this.state;
        let params = {
            immedi_purchase_ord_no: immedi_purchase_ord_no,
            immedi_purchase_ord_dtl_no: immedi_purchase_ord_dtl_no,
            add_optn_no: add_optn_no,
        }
        this.props.createOptn(params).then((res) => {
            if (index + 1 === cartList.filter((item) => item.isSelected).length)
                navigation.navigate("Payment", {purchaseType: "cart", immedi_purchase_ord_no: immedi_purchase_ord_no})
        }).catch((err) => {
        });
    }
    // 상품 등록 중 오류가 발생하면, 주문서 삭제
    handleDelete = (immedi_purchase_ord_no) => {
        let params = {
            immedi_purchase_ord_no: immedi_purchase_ord_no
        }
        this.props.removeImmedi(params).then((res) => {

        }).catch((err) => {
            notifyMessage(PaymentText.deletePayment);
        });
    }

    renderSubmitBtns = () => {
        const {cartList} = this.state;
        const isSubmit = cartList.filter((item) => item.isSelected).length > 0
        return (
            <TouchableOpacity
                style={[styles.submitBox, isSubmit ? {backgroundColor: "#000000"} : null]}
                onPress={() => {
                    if (isSubmit)
                        this.handleCreate()
                    // navigation.navigate("Payment", {purchaseType: "cart"})
                }}
            >
                <Text style={styles.submit}>{CartText.purchase}</Text>
            </TouchableOpacity>
        );
    };

    updateCart = (cartList, isSelected, item, isDelete) => {
        if (isSelected) {
            if (isDelete) { // 선택 삭제
                cartList.filter((cart) => cart.isSelected).map((cart) => {
                    let params = {
                        basket_dtl_no: cart.basket_dtl_no,
                    }
                    this.props.remove(params).then((res) => {
                    }).catch((err) => {
                    });
                })
                const updatedProducts = cartList.filter(
                    (product) => !product.isSelected
                );
                this.setState({cartList: updatedProducts}, () => this.calculateCart());
            } else // 체크박스 업데이트
                this.setState({cartList}, () => this.calculateCart());
        } else if (isDelete) {
            if (item === null) { // 품절 삭제
                cartList.map((cart) => {
                    if (parseInt(cart.sale_cnt) - parseInt(cart.saled_cnt) === 0) {
                        let params = {
                            basket_dtl_no: cart.basket_dtl_no,
                        }
                        this.props.remove(params).then((res) => {
                        }).catch((err) => {
                        });
                    }
                })
                const updatedCarts = cartList.filter(
                    (cart) => (parseInt(cart.sale_cnt) - parseInt(cart.saled_cnt)) !== 0
                );
                this.setState({updatedCarts}, () => this.calculateCart());
            } else { // 특정 아이템 삭제
                let params = {
                    basket_dtl_no: item.basket_dtl_no,
                }
                this.props.remove(params).then((res) => {
                    this.setState({cartList}, () => this.calculateCart());
                }).catch((err) => {
                });
            }
        } else { // 수량 업데이트
            let params = {
                basket_dtl_no: item.basket_dtl_no,
                ord_cnt: item.ord_cnt,
            }
            this.props.update(params).then((res) => {
                this.setState({cartList}, () => this.calculateCart());
            }).catch((err) => {
            });
        }
    };

    render() {
        const {navigation} = this.props;
        const {isLoading, isSelectedAll, cartList, cartCount, delivery_pay, product_pay} = this.state;
        let onLeftBtn = false;
        if(navigation.state.params?.pop)
            onLeftBtn = true;

        if (isLoading)
            return null;
        else
            return (
                <View style={styles.container}>
                    <TopHeader
                        title={CartText.cart}
                        navigation={navigation}
                        hasRightBtn={false}
                        isCloseIcon={true}
                        onLeftBtn={() => {
                           if(onLeftBtn) navigation.pop(2);
                           else navigation.pop()
                        }}
                    />
                    <View style={{flex: 1}}>
                        <View style={styles.infoWrap}>
                            <Image
                                style={styles.infoIcon}
                                source={require("../../assets/image/ticket/info_icon_black.png")}
                            />
                            <View>
                                <Text style={styles.message}>{CartText.infoMessage}</Text>
                                <Text style={[styles.subMessage, {marginTop: 9.2}]}>
                                    {CartText.infoMessage_2}
                                </Text>
                                <Text style={[styles.subMessage, {marginTop: 4}]}>
                                    {CartText.infoMessage_3}
                                </Text>
                            </View>
                        </View>
                        <FlatList
                            data={cartList}
                            showsVerticalScrollIndicator={false}
                            renderItem={({item, index}) => {
                                let product_pay = (parseInt(item.sale_prc || 0) + parseInt(item.add_prc_sum || 0)) // (상품가 + 옵션가)
                                if (item?.add_optn.length > 0)
                                    product_pay += parseInt(item.add_optn[0].add_amt)
                                product_pay *= parseInt(item.ord_cnt) // + 추가 옵션가

                                const isMinus = (item.min_ord_cnt && parseInt(item.ord_cnt) - parseInt(item.min_ord_cnt) >= parseInt(item.min_ord_cnt)) || (!item.min_ord_cnt && parseInt(item.ord_cnt) !== 1);
                                const isPlus = parseInt(item.sale_cnt) !== 0
                                    && parseInt(item.sale_cnt) > parseInt(item.ord_cnt) + parseInt(item.min_ord_cnt || 1)
                                    && parseInt(item.ord_cnt) + parseInt(item.min_ord_cnt || 1) <= parseInt(item.psnby_purchase_limit_cnt);
                                return (
                                    <View style={styles.basketWrap}>
                                        <TouchableOpacity
                                            style={{position: "absolute", right: 0, top: 3}}
                                            onPress={() => {
                                                // 장바구니에서 삭제
                                                const updatedProducts = produce(cartList, (draft) => {
                                                    draft.splice(index, 1);
                                                });
                                                this.updateCart(updatedProducts, false, item, true);
                                            }}
                                        >
                                            <Image
                                                style={{width: 20, height: 20}}
                                                source={require("../../assets/image/cart/delete_btn.png")}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                // 체크박스 업데이트
                                                if (parseInt(item.sale_cnt) === 0) { // 재고 수량 0일 때, 품절
                                                    return;
                                                }
                                                let updatedProducts = produce(cartList, (draft) => {
                                                    draft[index].isSelected = !draft[index].isSelected;
                                                });
                                                this.updateCart(updatedProducts, true, item);
                                                this.setState({
                                                    isSelectedAll: updatedProducts.filter((product) => product.isSelected).length === updatedProducts.length,
                                                });
                                            }}
                                        >
                                            <Image
                                                style={{width: 17, height: 17, marginRight: 8.2}}
                                                source={
                                                    item.isSelected
                                                        ? require("../../assets/image/cart/checkbox_on.png")
                                                        : require("../../assets/image/cart/checkbox_disable.png")
                                                }
                                            />
                                        </TouchableOpacity>

                                        <ImageBackground
                                            style={styles.basketProductImg}
                                            source={{uri: item.cntnts_url_addr}}
                                        >
                                            {parseInt(item.sale_cnt) === 0 ? (
                                                <View style={styles.basketProductSoldOut}>
                                                    <Text style={styles.basketProductSoldOutText}>
                                                        {CartText.soldOut}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <View/>
                                            )}
                                        </ImageBackground>
                                        <View>
                                            <Text style={styles.basketProductName}>
                                                {item.goods_nm}
                                            </Text>
                                            <Text style={styles.basketOptionName}>
                                                {`${item.goods_optn_nm || ""}${item.add_optn[0] ? " / " : ""}${item.add_optn[0] ? item.add_optn[0]?.add_optn_nm : ""}${item.goods_optn_nm ? " | " : ""}${PaymentText.quantity} : ${item.ord_cnt}`}
                                            </Text>
                                            <Text
                                                style={[styles.basketPrice, {color: parseInt(item.sale_cnt) === 0 ? "#dddddd" : "#222222",}]}>
                                                {`${formattedNumber(product_pay)}원`}
                                            </Text>
                                            <View style={styles.quantityBox}>
                                                <View style={styles.rowCenter}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            // minus
                                                            if (parseInt(item.sale_cnt) !== 0) {
                                                                if (item.min_ord_cnt && parseInt(item.ord_cnt) - parseInt(item.min_ord_cnt) >= parseInt(item.min_ord_cnt)) {
                                                                    let updatedProducts = produce(
                                                                        cartList,
                                                                        (draft) => {
                                                                            if (parseInt(draft[index].ord_cnt) !== parseInt(item.min_ord_cnt)) {
                                                                                draft[index].ord_cnt = parseInt(draft[index].ord_cnt) - parseInt(item.min_ord_cnt);
                                                                            }
                                                                        }
                                                                    );
                                                                    this.updateCart(updatedProducts, false, {
                                                                        ...item,
                                                                        ord_cnt: parseInt(item.ord_cnt) - parseInt(item.min_ord_cnt)
                                                                    }, false);
                                                                } else if (!item.min_ord_cnt && parseInt(item.ord_cnt) !== 1) {
                                                                    let updatedProducts = produce(
                                                                        cartList,
                                                                        (draft) => {
                                                                            if (parseInt(draft[index].ord_cnt) !== parseInt(item.min_ord_cnt)) {
                                                                                draft[index].ord_cnt = parseInt(draft[index].ord_cnt) - 1;
                                                                            }
                                                                        }
                                                                    );
                                                                    this.updateCart(updatedProducts, false, {
                                                                        ...item,
                                                                        ord_cnt: parseInt(item.ord_cnt) - 1
                                                                    }, false);
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <Image
                                                            source={isMinus ? require("../../assets/image/store/minus_btn.png") : require("../../assets/image/store/minus_btn_disable.png")}
                                                            style={styles.plus}
                                                        />
                                                    </TouchableOpacity>
                                                    <Text
                                                        style={[
                                                            styles.quantity,
                                                            {color: item.isSoldOut ? "#dddddd" : "#2d2d2d"},
                                                        ]}
                                                    >
                                                        {item.ord_cnt}
                                                    </Text>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            // plus
                                                            if (parseInt(item.sale_cnt) !== 0
                                                                && parseInt(item.sale_cnt) > parseInt(item.ord_cnt) + parseInt(item.min_ord_cnt || 1)
                                                                && parseInt(item.ord_cnt) + parseInt(item.min_ord_cnt || 1) <= parseInt(item.psnby_purchase_limit_cnt)) {
                                                                let updatedProducts = produce(
                                                                    cartList,
                                                                    (draft) => {
                                                                        draft[index].ord_cnt = parseInt(draft[index].ord_cnt) + parseInt(item.min_ord_cnt || 1);
                                                                    }
                                                                );
                                                                this.updateCart(updatedProducts, false, {
                                                                    ...item,
                                                                    ord_cnt: parseInt(item.ord_cnt) + parseInt(item.min_ord_cnt || 1)
                                                                }, false);
                                                            }
                                                        }}
                                                    >
                                                        <Image
                                                            source={isPlus ? require("../../assets/image/store/plus_btn.png") : require("../../assets/image/store/plus_btn_disable.png")}
                                                            style={styles.plus}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                );
                            }}
                            keyExtractor={(_, i) => String(i)}
                            ListHeaderComponent={() => {
                                return (
                                    <View style={[styles.betweenCenter, {marginBottom: 25}]}>
                                        <TouchableOpacity
                                            style={styles.rowCenter}
                                            onPress={() => {
                                                let updatedProducts = [];
                                                if (!cartList.some((product) => !product.isSelected)) {
                                                    cartList.forEach((product) => {
                                                        const updatedProduct = {
                                                            ...product,
                                                            isSelected: !isSelectedAll,
                                                        };
                                                        updatedProducts.push(updatedProduct);
                                                    });
                                                } else {
                                                    cartList.forEach((product) => {
                                                        const updatedProduct = {
                                                            ...product,
                                                            isSelected: !isSelectedAll,
                                                        };
                                                        updatedProducts.push(updatedProduct);
                                                    });
                                                }

                                                this.updateCart(updatedProducts, true);
                                                this.setState({
                                                    isSelectedAll: !isSelectedAll,
                                                });
                                            }}
                                        >
                                            <Image
                                                style={{width: 17, height: 17, marginRight: 5}}
                                                source={
                                                    isSelectedAll
                                                        ? require("../../assets/image/cart/checkbox_on.png")
                                                        : require("../../assets/image/cart/checkbox_disable.png")
                                                }
                                            />

                                            <Text style={styles.basketSelectAll}>
                                                전체선택{" "}
                                                {`(${
                                                    cartList.filter((product) => product.isSelected).length
                                                }/${cartList.length})`}
                                            </Text>
                                        </TouchableOpacity>
                                        <View style={styles.rowCenter}>
                                            <TouchableOpacity
                                                style={[styles.basketSelectDelete, {
                                                    backgroundColor: cartList.some((product) => product.isSelected)
                                                        ? "#ffffff" : "#ebebeb",
                                                    borderColor: cartList.some((product) => product.isSelected)
                                                        ? "#999999" : "#bbbbbb",
                                                }]}
                                                onPress={() => cartList.some((product) => product.isSelected) ? this.updateCart(cartList, true, null, true) : null}
                                            >
                                                <Text
                                                    style={[styles.basketDeleteAll, {
                                                        color: cartList.some((product) => product.isSelected) ? "#555555" : "#999999",
                                                    }]}
                                                >
                                                    {CartText.selectDelete}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.basketDeleteAllBtn, {
                                                    backgroundColor: cartList.some((cart) => (parseInt(cart.sale_cnt) - parseInt(cart.saled_cnt)) === 0)
                                                        ? "#000000" : "#bbbbbb",
                                                }]}
                                                onPress={() => cartList.some((cart) => (parseInt(cart.sale_cnt) - parseInt(cart.saled_cnt)) === 0) ? this.updateCart(cartList, false, null, true) : null}
                                            >
                                                <Text style={[styles.basketDeleteAll, {color: "#ffffff"}]}>
                                                    {CartText.soldOutDelete}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            }}
                            ListFooterComponent={() => {
                                return (
                                    <View style={styles.basketPaymentWrap}>
                                        <View style={[styles.betweenCenter, {marginBottom: 10.9}]}>
                                            <Text style={styles.footerTitle}>
                                                {CartText.totalPrice}
                                            </Text>
                                            <Text style={styles.footerDesc}>{`${formattedNumber(product_pay)}원`}</Text>
                                        </View>
                                        <View style={styles.betweenCenter}>
                                            <Text style={styles.footerTitle}>
                                                {CartText.deliveryFee}
                                            </Text>
                                            <Text
                                                style={styles.footerDesc}>{delivery_pay ? `${formattedNumber(delivery_pay)}원` : CartText.free}</Text>
                                        </View>
                                        <View style={styles.basketPaymentBorder}/>
                                        <View style={styles.betweenCenter}>
                                            <Text style={styles.footerTitle}>
                                                {CartText.purchasePrice}
                                            </Text>
                                            <Text
                                                style={styles.purchasePrice}>{`${formattedNumber(product_pay + delivery_pay)}원`}</Text>
                                        </View>
                                    </View>
                                );
                            }}
                            style={{paddingHorizontal: 20, paddingTop: 21.5, flex: 1}}
                        />
                    </View>
                    {this.renderSubmitBtns()}
                </View>
            );
    }
}

const mapStateToProps = (state) => ({
    eSESSION: state.eSESSION.eSESSION,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    getList: (params) => dispatch(ActionBasket.getList(params)),
    update: (params) => dispatch(ActionBasket.update(params)),
    remove: (params) => dispatch(ActionBasket.remove(params)),
    create: (params) => dispatch(ActionImmedi.create(params)),
    createDetail: (params) => dispatch(ActionImmedi.createDetail(params)),
    createOptn: (params) => dispatch(ActionImmedi.createOptn(params)),
    removeImmedi: (params) => dispatch(ActionImmedi.remove(params)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Cart);
