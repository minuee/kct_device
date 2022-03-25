// 메인 화면
import React, {Component} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ScrollView, Platform, AppState, PermissionsAndroid, Linking,
} from "react-native";
import {connect} from "react-redux";
import Swiper from "react-native-swiper";
import AsyncStorage from "@react-native-community/async-storage";
import messaging from "@react-native-firebase/messaging";

// Utils
import {StatusBarHeight} from "../../model/lib/Utils/Constants";
import Fonts from "../../model/lib/Utils/Fonts";
import {AppScr, CodeText, MainText, TOKEN} from "../../model/lib/Utils/Strings";

// component
import {ProductTitle} from "../../component/main/ProductTitle";
import {NewArrivalItem} from "../../component/main/NewArrivalItem";
import {HotStuffItem} from "../../component/main/HotStuffItem";
import {TrendTagItem} from "../../component/main/TrendTagItem";
import {NewRedeemItem} from "../../component/main/NewRedeemItem";
import {EventItem} from "../../component/main/EventItem";
import {MainHeader} from "../../component/MainHeader";
import PermissionModal from "../../component/modal/PermissionModal";
import BalancePaymentModal from "../../component/modal/BalancePaymentModal";
import CompleteModal from "../../component/modal/CompleteModal";

// Action
import * as ActionBanner from "../../model/action/eBANNER";
import * as ActionConst from "../../model/action/eCOMM_CD";
import * as ActionGoods from "../../model/action/eGOODS";
import * as ActionTag from "../../model/action/eTAG";
import * as ActionNtt from "../../model/action/eNTT";
import * as ActionMber from "../../model/action/eMBER";
import * as ActionSession from "../../model/action/eSESSION";
import * as ActionPush from "../../model/action/ePUSH";
import * as ActionBasket from "../../model/action/eBASKET";
import * as ActionUser from "../../model/action/eUSER";
import {build_type} from "../../model/api";
import {clearAsyncStorage} from "../../model/lib/Utils";

const newArrival = [
    {
        image_url: require("../../assets/image/temp1.png"),
        title: "삼성 갤럭시 S21 Ultra",
        type: 1,
        price: "850,000",
        option: "퍼시픽 블루 / 128GB",
    },
    {
        image_url: require("../../assets/image/temp1.png"),
        title: "삼성 갤럭시 S21 Ultra",
        type: 2,
        price: "1,850,000",
        option: "퍼시픽 블루 / 128GB",
    },
    {
        image_url: require("../../assets/image/temp1.png"),
        title: "삼성 갤럭시 S21 Ultra",
        type: 3,
        price: "850,000",
        option: "퍼시픽 블루 / 128GB",
    },
    {
        image_url: require("../../assets/image/temp1.png"),
        title: "삼성 갤럭시 S21 Ultra",
        type: 4,
        price: "850,000",
        option: "퍼시픽 블루 / 128GB",
    },
];

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMainLoading: true,
            isTagLoading: true,
            isBannerLoading: true,
            push_cnt: 0,
            cart_cnt: 0,
            activeSlide: 0,
            hotStuffType: 0,
            bannerList: [],
            plan_list: [], // 발매 예정
            plan_list_count: "",
            recently_list: [], // 최근 등록된 상품(5개)
            best_used_list: [], // 중고 인기상품
            best_new_list: [], // 새 인기상품
            trend_tag_list: [], // trend_tag

            isShowPermissionModal: false,
            isShowBPModal: false,
            isShowCompleteModal: false,

            appState: AppState.currentState,

            exchng_vol_store_use_yn: "N",
            exchng_vol_trd_list: [],

        };
    }

    componentDidMount() {
        this._navListener = AppState.addEventListener('change', this._handleAppStateChange);
        this.checkPermission();
        const {eCOMM_CD, eCOMM_CD_TYPE} = this.props;
        if (eCOMM_CD === null || eCOMM_CD_TYPE === null ) {
            this.props.getConst({}).then((res) => {
                this.props.setConst(res.comm_cd);
                this.props.setConstType(res.comm_cd_typ);
            }).catch((err) => {
            });
        }
        this.props.getSession({}).then((res) => {
            this.props.setSession(res.account);
            this.handleToken(res.account.mber_no);
        }).catch((err) => { // 409 && 로그아웃
            let errorCode = err.response.data.error.status;
            if(errorCode === 409){
                this.props.logout({}).then((res) => {
                    // AsyncStorage.clear();
                    clearAsyncStorage().then((result) => console.log("remove All"))
                    this.props.setSession({});
                    this.props.navigation.navigate("Login");
                }).catch((err) => {
                });
            }
        });
        this._navHeaderListener = this.props.navigation.addListener('didFocus', () => {
            this.getNewPush();
            this.getCartList();
        });
        this.getBannerList();
        this.getMainList();
        this.getNttList();
    }

    componentWillUnmount() {
        this._navListener.remove();
        this._navHeaderListener.remove();
    }

    checkPermission = async () => {
        if (Platform.OS === 'android') {
            this.checkPermissionNext().then((permissions) => {
                let flag = false;
                permissions.map((item) => {
                    if (!item)
                        flag = true;
                })
                this.setState({isShowPermissionModal: flag})
            })
        } else {
            await AsyncStorage.getItem(TOKEN.permission_modal).then((value) => {
                if(value !== "true")
                    this.setState({isShowPermissionModal: true})
            });
        }
    }

    checkPermissionNext = async () => {
        if (Platform.OS === 'android') {
            const camera = await PermissionsAndroid.check("android.permission.CAMERA");
            const write = await PermissionsAndroid.check("android.permission.WRITE_EXTERNAL_STORAGE");
            const read = await PermissionsAndroid.check("android.permission.READ_EXTERNAL_STORAGE");
            return await Promise.all([camera, write, read]);
        }
    }

    _handleAppStateChange = nextAppState => {
        const {appState} = this.state;
        const {eCOMM_CD, eCOMM_CD_TYPE} = this.props;
        if (eCOMM_CD === null || eCOMM_CD_TYPE === null ) {
            this.props.getConst({}).then((res) => {
                this.props.setConst(res.comm_cd);
                this.props.setConstType(res.comm_cd_typ);
            }).catch((err) => {
            });
        }
        if (appState.match(/inactive|background/) && nextAppState === 'active')
            this.createConn();
        else
            AsyncStorage.getItem(TOKEN.conn_begin_dt).then((conn) => {
                if (conn !== null)
                    this.updateConn(conn)
            });
        this.setState({ appState: nextAppState });
    };

    handleToken = async (mber_no) => {
        const token = await messaging().getToken();
        let params = {
            mber_no,
            firebase_os_cd:
                Platform.OS === "ios" ? CodeText.os_cd_ios : CodeText.os_cd_android,
            firebase_token: token,
        };
        console.log("params");
        console.log(params);
        this.props
            .update(params)
            .then((res) => {})
            .catch((err) => {
            });
    };
    createConn = () => {
        let params = {
            app_scr_no: AppScr.main,
            os_cd: Platform.OS === "ios" ? CodeText.os_cd_ios : CodeText.os_cd_android
        }
        this.props.createConn(params).then((res) => {
            AsyncStorage.setItem(TOKEN.conn_begin_dt, res.conn_begin_dt);
        }).catch((err) => {
        });
    };
    updateConn = (conn) => {
        let params = {
            app_scr_no: AppScr.main,
            conn_begin_dt: conn
        }
        this.props.updateConn(params).then((res) => {
        }).catch((err) => {
        });
    };

    getNewPush = () => {
        this.props.getNewPush({}).then((res) => {
            this.setState({push_cnt: parseInt(res.count || 0)})
        }).catch((err) => {
        });
    }
    getCartList = () => {
        const {eSESSION} = this.props;
        if(eSESSION.basket_no) {
            let params = {
                skip: 0,
                limit: 100,
                basket_no: eSESSION.basket_no,
                // basket_no: "2021110223585461G95U"
            }
            this.props.getCartList(params).then((res) => {
                this.setState({cart_cnt: parseInt(res.count || 0)})
            }).catch((err) => {
            });
        }
    }

    getMainList = () => {
        this.props.getMainList({}).then((res) => {
            this.setState({
                plan_list: res.plan_list,
                plan_list_count: parseInt(res.plan_list_count),
                recently_list: res.recently_list,
                best_used_list: res.best_used_list,
                best_new_list: res.best_new_list,
                isMainLoading: false,
                exchng_vol_store_use_yn: res?.exchng_vol_trd?.exchng_vol_store_use_yn || "N",
                exchng_vol_trd_list: res?.exchng_vol_trd?.list || []
            });
        }).catch((err) => {
        });
    };

    getNttList = () => {
        let params = {
            skip: 0,
            limit: 3,
            popular_tag_yn: "Y"
        }
        this.props.getNttList(params).then((res) => {
            this.setState({trend_tag_list: res.list}, () => this.getList());
        }).catch((err) => {
        });
    };

    getList = async () => {
        const {trend_tag_list} = this.state;
        let newTrendPromise = trend_tag_list.map(async (item) => {
            let params = {
                skip: 0,
                limit: 6,
                tag_no: item.tag_no
            }
            console.log("getList")
            console.log(params)
            return await this.props.getList(params).then((res) => {
                return {...item, ntt_list: res.list}
            }).catch((err) => {
            });
        })
        const newTrendList = await Promise.all(newTrendPromise);
        this.setState({trend_tag_list: newTrendList, isTagLoading: false})
    };

    getBannerList = () => {
        let params = {
            skip: 0,
            limit: 3,
        };

        this.props.getBannerList(params).then((res) => {
            this.setState({bannerList: res.list, isBannerLoading: false});
        }).catch((err) => {
        });
    };

    handleBanner = (banner) => {
        const {navigation} = this.props;
        let params = {
            banner_no: banner.banner_no,
        };

        this.props.createView(params).then((res) => {
            Linking.openURL(banner.banner_URL)
            // navigation.navigate("KCTWebView", {web_url: banner.banner_URL});
        }).catch((err) => {
        });
    };

    renderBanner = () => {
        const {bannerList} = this.state;
        return (
            <Swiper
                style={{height: 105}}
                loop={true}
                showsPagination={false}
                key={bannerList.length}
                autoplay={true}
                autoplayTimeout = {5}
                scrollEnabled={true}
            >
                {bannerList.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={`banner_list_${index}`}
                            style={styles.banner}
                            onPress={() => this.handleBanner(item)}
                        >
                            <Image style={styles.bannerImg} source={{uri: item.file_URL}}/>
                        </TouchableOpacity>
                    );
                })}
            </Swiper>
        );
    };


    renderEventCarousel = () => {
        const {navigation, eCOMM_CD} = this.props;
        const {activeSlide, plan_list, plan_list_count} = this.state;

        return (
            <View style={{alignItems: "center"}}>
                <Swiper
                    style={{height: 380}}
                    showsPagination={false}
                    loop={false}
                    key={plan_list.length}
                    onIndexChanged={(index) => {
                        this.setState({activeSlide: index})
                    }}
                >
                    {plan_list.map((item, index) => {
                        return <EventItem key={`plan_list_${index}`} navigation={navigation} item={item} eCOMM_CD={eCOMM_CD}/>;
                    })}
                </Swiper>
                {plan_list.length > 0 && (
                    <View style={styles.paginationBox}>
                        <View style={styles.progressBar}>
                            <View style={[styles.activeSlide, {width: (200 / plan_list.length) * (activeSlide + 1)}]}/>
                        </View>
                        <Text style={styles.page}>
                            <Text style={{color: "#191919"}}>{activeSlide + 1}</Text>
                            /{plan_list_count}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    renderNewArrival = () => {
        const {navigation} = this.props;
        const {recently_list} = this.state;
        return (
            <View style={{marginTop: 50, paddingLeft: 20}}>
                <ProductTitle title="NEW ARRIVAL"/>
                <FlatList
                    data={recently_list}
                    renderItem={({item}) => {
                        return <NewArrivalItem navigation={navigation} item={item}/>;
                    }}
                    keyExtractor={(_, i) => String(i)}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                />
            </View>
        );
    };

    renderHotStuff = () => {
        const {navigation} = this.props;
        const {hotStuffType, best_new_list, best_used_list} = this.state; // 0: 중고상품, 1: 새상품
        const hotStuffList = hotStuffType ? best_new_list : best_used_list
        const HotStuffTabs = () => {
            return (
                <View style={styles.hotStuffTabs}>
                    <TouchableOpacity
                        style={[
                            styles.hotStuffTab,
                            {
                                borderBottomColor:
                                    hotStuffType === 0 ? "#333333" : "transparent",
                            },
                        ]}
                        onPress={() => this.setState({hotStuffType: 0})}
                    >
                        <Text
                            style={[
                                styles.hotStuffTabText,
                                {
                                    fontFamily: hotStuffType === 0 ? Fonts.AppleB : Fonts.AppleR,
                                    color: hotStuffType === 0 ? "#333333" : "#595959",
                                },
                            ]}
                        >
                            {MainText.usedGoods}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.hotStuffTab,
                            {
                                borderBottomColor:
                                    hotStuffType === 1 ? "#333333" : "transparent",
                            },
                        ]}
                        onPress={() => this.setState({hotStuffType: 1})}
                    >
                        <Text
                            style={[
                                styles.hotStuffTabText,
                                {
                                    fontFamily: hotStuffType === 1 ? Fonts.AppleB : Fonts.AppleR,
                                    color: hotStuffType === 1 ? "#333333" : "#595959",
                                },
                            ]}
                        >
                            {MainText.newGoods}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        };
        return (
            <View style={{marginTop: 50, paddingHorizontal: 20}}>
                <ProductTitle title="HOT STUFF"/>
                <HotStuffTabs/>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        marginTop: 14,
                        justifyContent: "space-between",
                    }}
                >
                    {hotStuffList.map((item, index) => {
                        return <HotStuffItem key={`hot_stuff_${index}`} item={item} navigation={navigation}/>;
                    })}
                </View>
            </View>
        );
    };

    renderTrendTag = () => {
        const {navigation} = this.props;
        const {trend_tag_list} = this.state;
        const filteredTagList = trend_tag_list.filter((item) => item.ntt_list && item.ntt_list.length !== 0)
        return (
            <View style={{marginTop: 25, paddingLeft: 20}}>
                <ProductTitle title="TREND TAG"/>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {filteredTagList.map((item, index) => {
                        return <TrendTagItem key={`tag_filter_${index}`} item={item} navigation={navigation}/>;
                    })}
                </ScrollView>
            </View>
        );
    };

    renderNewRedeem = () => {
        const {navigation} = this.props;
        const {exchng_vol_trd_list} = this.state;
        // 추가 개발 내용
        return (
            <View style={{marginTop: 50, paddingHorizontal: 20}}>
                <ProductTitle title="New Redeem"/>
                {exchng_vol_trd_list.map((item, index) => {
                    return <NewRedeemItem key={`exchng_product_${index}`} item={item} navigation={navigation}/>;
                })}
            </View>
        );
    };

    render() {
        const {navigation, eSESSION} = this.props;
        const {isMainLoading, isTagLoading, isBannerLoading, exchng_vol_store_use_yn} = this.state;
        const {isShowPermissionModal, isShowBPModal, isShowCompleteModal, push_cnt, cart_cnt} = this.state;
        if(isMainLoading || isTagLoading || isBannerLoading)
            return null;
        else
        return (
            <View style={styles.container}>
                <View style={{height: StatusBarHeight}}/>
                <MainHeader navigation={navigation} eSESSION={eSESSION} push_cnt={push_cnt} cart_cnt={cart_cnt} />
                <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                    {this.renderBanner()}
                    {this.renderEventCarousel()}
                    {this.renderNewArrival()}
                    {this.renderHotStuff()}
                    {this.renderTrendTag()}
                    {build_type === TOKEN.build_type_txt && eSESSION.mber_se_cd === CodeText.mber_se_cd_g && exchng_vol_store_use_yn === "Y" && this.renderNewRedeem()}
                    <View style={{height: 50}}/>
                </ScrollView>
                <PermissionModal
                    isShowPermissionModal={isShowPermissionModal}
                    setVisible={() => this.setState({isShowPermissionModal: false})}
                />
                <BalancePaymentModal
                    isShowBPModal={isShowBPModal}
                    setVisible={() => this.setState({isShowBPModal: false})}
                    ticketNum={"NDFKW283FF"}
                />
                <CompleteModal
                    isShowCompleteModal={isShowCompleteModal}
                    title={MainText.companyCertificationCompleted}
                    subtitle={MainText.companyCertificationCompletedDesc}
                    setVisible={() => this.setState({isShowCompleteModal: false})}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    hotStuffTabs: {flex: 1, flexDirection: "row"},
    hotStuffTab: {
        alignItems: "center",
        justifyContent: "center",

        borderBottomWidth: 3,
        marginRight: 26,
    },
    hotStuffTabText: {
        fontSize: 14,
        lineHeight: 32.5,
    },
    banner: {
        marginHorizontal: 20,
        backgroundColor: "#222222",
        height: 70,
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 20,
    },
    bannerImg: {
        height: 70,
        width: "100%",
        borderRadius: 5,
    },
    paginationBox: {flexDirection: "row", marginTop: 15, alignItems: "center"},
    progressBar: {
        height: 2.5,
        borderRadius: 15,
        backgroundColor: "rgba(193,193,193,0.6)",
        width: 200,
        marginRight: 10,
    },
    activeSlide: {
        height: 2.5,
        borderRadius: 15,
        backgroundColor: "#333333",
        marginRight: 10,
    },
    page: {
        fontFamily: Fonts.AppleL,
        fontSize: 12,
        lineHeight: 15,
        letterSpacing: -0.6,
        textAlign: "left",
        color: "#969696",
    },
});

const mapStateToProps = (state) => ({
    eSESSION: state.eSESSION.eSESSION,
    eCOMM_CD: state.eCOMM_CD.eCOMM_CD,
    eCOMM_CD_TYPE: state.eCOMM_CD.eCOMM_CD_TYPE,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    getMainList: (params) => dispatch(ActionGoods.getMainList(params)),
    getNttList: (params) => dispatch(ActionTag.getNttList(params)),
    getList: (params) => dispatch(ActionNtt.getList(params)),
    getBannerList: (params) => dispatch(ActionBanner.getList(params)),
    createView: (params) => dispatch(ActionBanner.createView(params)),

    getConst: (params) => dispatch(ActionConst.getConst(params)),
    setConst: (params) => dispatch(ActionConst.setConst(params)),
    setConstType: (params) => dispatch(ActionConst.setConstType(params)),
    createConn: (params) => dispatch(ActionMber.createConn(params)),
    updateConn: (params) => dispatch(ActionMber.updateConn(params)),
    update: (params) => dispatch(ActionMber.update(params)),

    getSession: (params) => dispatch(ActionSession.getSession(params)),
    setSession: (params) => dispatch(ActionSession.setSession(params)),
    logout: (params) => dispatch(ActionUser.logout(params)),

    getNewPush: (params) => dispatch(ActionPush.getNew(params)),
    getCartList: (params) => dispatch(ActionBasket.getList(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
