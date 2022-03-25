// 태그 홈
import React, {Component} from "react";
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    FlatList, ActivityIndicator,
} from "react-native";
import {connect} from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";

import {StatusBarHeight} from "../../model/lib/Utils/Constants";
import Fonts from "../../model/lib/Utils/Fonts";
import {Generic, TagText, TicketText} from "../../model/lib/Utils/Strings";
import Colors from "../../model/lib/Utils/Colors";

import {MainHeader} from "../../component/MainHeader";
import {TagListItem} from "../../component/tag/TagListItem";
import ConfirmModal from "../../component/modal/ConfirmModal";
import SubscriptionListItem from "../../component/tag/SubscriptionListItem";
import TagReportModal from "../../component/modal/TagReportModal";
import AlertModal from "../../component/modal/AlertModal";

import * as ActionNtt from "../../model/action/eNTT";
import * as ActionMber from "../../model/action/eMBER";
import * as ActionTag from "../../model/action/eTAG";
import * as ActionPush from "../../model/action/ePUSH";
import * as ActionBasket from "../../model/action/eBASKET";
import * as ActionSession from "../../model/action/eSESSION";
import * as ActionUser from "../../model/action/eUSER";
import {clearAsyncStorage} from "../../model/lib/Utils";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
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
    categoriesBox: {
        flexDirection: "row",
        height: 50,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
    },
    categoryBtn: {
        paddingHorizontal: 16,
        paddingVertical: 7.8,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 17.8,
        marginLeft: 5,
    },
    category: {fontFamily: Fonts.AppleB, fontSize: 16, letterSpacing: -0.8},
});

class Tag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            push_cnt: 0,
            cart_cnt: 0,
            currentCategoryId: 0,
            isShowConfirmModal: false,
            isShowTagReportModal: false,
            isShowAlertModal: false,
            sbsList: [],
            nttList: [],
            offset: 0,
            limit: 100,
            loadMore: true,
            reportItem: {},
            isSbsLoading: false,
        };
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            this.getSession();
            this.getNewPush();
            this.getCartList();
        });
        this.getNttList();
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    getSession = () => {
        this.props.getSession({}).then((res) => {
            this.props.setSession(res.account);
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
    }

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

    getSbsList = () => {
        const {offset, limit, sbsList, loadMore} = this.state;
        if(loadMore) {
            let params = {
                skip: offset,
                limit: limit,
            }

            this.props.getSbsList(params).then(async (res) => {
                if (parseInt(res.count) > (offset + limit))
                    this.setState({sbsList: [...sbsList, ...res.list], offset: offset + limit, isSbsLoading: false})
                else
                    this.setState({sbsList: [...sbsList, ...res.list], loadMore: false, isSbsLoading: false})
            }).catch((err) => {
                this.setState({isSbsLoading: false})
            });
        }
    }

    getNttList = () => {
        const {offset, limit, nttList, loadMore} = this.state;
        if(loadMore) {
            let params = {
                skip: offset,
                limit: limit,
                popular_tag_yn: "Y"
            }

            this.props.getNttList(params).then(async (res) => {
                if (parseInt(res.count) > (offset + limit))
                    this.setState({nttList: [...nttList, ...res.list], offset: offset + limit})
                else
                    this.setState({nttList: [...nttList, ...res.list], loadMore: false})
            }).catch((err) => {
            });
        }
    }

    getReSbsList = () => {
        this.setState({currentCategoryId: 1, offset: 0, loadMore: true, sbsList: [], isSbsLoading: true}, () => this.getSbsList())
    }

    isSubscribeView = () => {
        const {eSESSION} = this.props;
        if(eSESSION.mber_no)
            this.setState({currentCategoryId: 1, offset: 0, loadMore: true, sbsList: [], isSbsLoading: true}, () => this.getSbsList())
        else
            this.setState({isShowAlertModal: true})
    }

    isFeedCreate = () => {
        const {eSESSION, navigation} = this.props;

        // navigation.navigate("FeedPost")

        let params = {
            mber_se_cd: eSESSION.mber_se_cd,
            // mber_no: eSESSION.mber_no,
        }

        this.props.getDetail(params).then((res) => {
            if(parseInt(res.user[0].구매) > 0)
                navigation.navigate("FeedPost")
            else
                this.setState({isShowConfirmModal: true})
        }).catch((err) => {
            this.setState({isShowAlertModal: true})
        });
    }

    renderCategories = () => {
        const {currentCategoryId} = this.state;
        return (
            <View style={styles.categoriesBox}>
                <TouchableOpacity
                    style={[
                        styles.categoryBtn,
                        {backgroundColor: currentCategoryId === 0 ? "#000000" : "transparent",},
                    ]}
                    onPress={() => this.setState({currentCategoryId: 0, offset: 0, loadMore: true, nttList: []}, () => this.getNttList())}
                >
                    <Text
                        style={[
                            styles.category,
                            {color: currentCategoryId === 0 ? "#f5f5f5" : "#191919"},
                        ]}
                    >
                        {TagText.popularity}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.categoryBtn,
                        {backgroundColor: currentCategoryId === 1 ? "#000000" : "transparent",},
                    ]}
                    onPress={() => this.isSubscribeView()}
                >
                    <Text
                        style={[
                            styles.category,
                            {color: currentCategoryId === 1 ? "#f5f5f5" : "#191919"},
                        ]}
                    >
                        {TagText.subscribe}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    renderTagList = () => {
        const {navigation, eSESSION} = this.props;
        const {nttList} = this.state;
        return (
            <FlatList
                data={nttList}
                showsVerticalScrollIndicator={false}
                onEndReached={() => this.getNttList()}
                renderItem={({item}) => {
                    return <TagListItem eSESSION={eSESSION} item={item} navigation={navigation} createSbs={this.props.createSbs}/>;
                }}
                keyExtractor={(_, i) => String(i)}
                style={{paddingHorizontal: 20}}
            />
        );
    };

    renderTagSubscription = () => {
        const {navigation} = this.props;
        const {sbsList, isSbsLoading} = this.state;
        if(isSbsLoading)
            return (
                <View style={{flex: 1, justifyContent: "center"}}>
                    <ActivityIndicator size="large" color={Colors.MAIN_COLOR}/>
                </View>
            )
        else
        return (
            <>
                <ScrollView
                    style={{marginTop: 31.5}}
                    onMomentumScrollEnd={this.getSbsList}
                    showsVerticalScrollIndicator={false}>
                    {sbsList.map((subscription, index) => {
                        return (
                            <SubscriptionListItem
                                item={subscription}
                                isMyFeed={false}
                                navigation={navigation}
                                // isEdit={eSESSION.mber_no === subscription.mber_no}
                                isEdit={false}
                                listLength={subscription.img_url_addr_arr.length || 1}
                                getReSbsList={() => this.getReSbsList()}
                                setReportModalVisibility={() =>
                                    this.setState({reportItem: subscription, isShowTagReportModal: true})
                                }
                                key={`subscription_${index}`}
                            />
                        );
                    })}
                    <View style={{height: 50}}/>
                </ScrollView>
            </>
        );
    };

    render() {
        const {navigation, eSESSION} = this.props;
        const {push_cnt, cart_cnt, isShowConfirmModal, isShowTagReportModal, isShowAlertModal, currentCategoryId, reportItem} = this.state;
        return (
            <View style={styles.container}>
                <View style={{height: StatusBarHeight}}/>
                <MainHeader navigation={navigation} eSESSION={eSESSION} push_cnt={push_cnt} cart_cnt={cart_cnt} />
                {this.renderCategories()}
                {currentCategoryId === 0
                    ? this.renderTagList()
                    : this.renderTagSubscription()}
                <TouchableOpacity
                    style={{position: "absolute", right: 5, bottom: 10}}
                    onPress={() => this.isFeedCreate()}
                >
                    <Image
                        source={require("../../assets/image/tag/floating_write_btn.png")}
                        style={{width: 90, height: 90}}
                    />
                </TouchableOpacity>

                {isShowConfirmModal && (
                    <ConfirmModal
                        isShowConfirmModal={isShowConfirmModal}
                        setVisible={() => this.setState({isShowConfirmModal: false})}
                        title={TagText.notice}
                        subtitle={TagText.alertMessage}
                    />
                )}
                {isShowTagReportModal && (
                    <TagReportModal
                        reportItem={reportItem}
                        navigation={navigation}
                        eSESSION={eSESSION}
                        isShowTagReportModal={isShowTagReportModal}
                        setVisible={() => this.setState({isShowTagReportModal: false})}
                    />
                )}
                {isShowAlertModal && (
                    <AlertModal
                        isShowAlertModal={isShowAlertModal}
                        message={Generic.loginMessage}
                        leftText={TicketText.no}
                        rightText={Generic.goToLogin}
                        setVisible={() => this.setState({ isShowAlertModal: false })}
                        navigation={navigation}
                        leftOnPress={() => this.setState({ isShowAlertModal: false })}
                        rightOnPress={() => navigation.navigate("Login")}
                    />
                )}
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    eSESSION: state.eSESSION.eSESSION,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    getDetail: (params) => dispatch(ActionMber.getDetail(params)),
    getSbsList: (params) => dispatch(ActionNtt.getSbsList(params)),
    getNttList: (params) => dispatch(ActionTag.getNttList(params)),
    createSbs: (params) => dispatch(ActionTag.createSbs(params)),
    getNewPush: (params) => dispatch(ActionPush.getNew(params)),
    getCartList: (params) => dispatch(ActionBasket.getList(params)),

    getSession: (params) => dispatch(ActionSession.getSession(params)),
    setSession: (params) => dispatch(ActionSession.setSession(params)),
    logout: (params) => dispatch(ActionUser.logout(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Tag);
