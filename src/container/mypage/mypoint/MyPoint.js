// 포인트 내역
// 판매 내역
import React, {Component} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from "react-native";
import {connect} from "react-redux";

import {MyPageText} from "../../../model/lib/Utils/Strings";
import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";
import {formattedNumber} from "../../../model/lib/Utils";

import {TopHeader} from "../../../component/TopHeader";

import * as ActionMber from "../../../model/action/eMBER";
import * as ActionPnt from "../../../model/action/ePNT";
import * as dateUtil from "../../../model/lib/Utils/Date";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    betweenCenter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    tabBtn: {
        width: "50%",
        paddingVertical: 13.5,
        borderBottomWidth: 3,
        alignItems: "center",
        justifyContent: "center",
    },
    point: {
        fontFamily: Fonts.AppleB,
        fontSize: 19,
        letterSpacing: -0.95,
        color: "#000000",
        textAlign: "right",
    },
    updatedAt: {
        marginTop: 5,
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.3,
        color: "#bbbbbb",
    },
    title: {
        fontFamily: Fonts.AppleR,
        fontSize: 15,
        letterSpacing: -0.38,
        color: "#000000",
    },
    myPoint: {
        fontSize: 40,
        fontWeight: "bold",
        fontStyle: "italic",
        letterSpacing: -2,
        textAlign: "center",
        paddingVertical: 43.2,
    },
    shadow: {
        backgroundColor: "#dddddd",
        width: "100%",
        height: 0.6,
        shadowOffset: {
            width: 0,
            height: 0.8,
        },
        shadowOpacity: 1,
        shadowColor: "#29000060",
        elevation: 0.4,
    },
    pointListWrap: {
        padding: 20,
        paddingBottom: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: "#dddddd",
    },
});

class MyPoint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDetail: true,
            isLoading: true,
            offset: 0,
            limit: 100,
            loadMore: true,
            myPoint: 0,
            useList: [],
            accList: [],
            currentTabIdx: 0,
        };
    }

    componentDidMount() {
        this.getDetail();
        this.getAccList();
    }

    getDetail = () => {
        const {eSESSION} = this.props;
        let params = {
            mber_se_cd: eSESSION.mber_se_cd,
        };

        this.props.getDetail(params).then((res) => {
            this.setState({myPoint: res.user[0].포인트 || 0, isDetail: false,})
        }).catch((err) => {
        });
    };

    getAccList = () => {
        const {offset, limit, accList, loadMore} = this.state;
        if (loadMore) {
            let params = {
                skip: offset,
                limit: limit,
            };

            this.props.getAccList(params).then((res) => {
                if (parseInt(res.count) > (offset + limit))
                    this.setState({accList: [...accList, ...res.list], offset: offset + limit, isLoading: false})
                else
                    this.setState({accList: [...accList, ...res.list], loadMore: false, isLoading: false})
            }).catch((err) => {
            });
        }
    }

    getUseList = () => {
        const {offset, limit, useList, loadMore} = this.state;
        if (loadMore) {
            let params = {
                skip: offset,
                limit: limit,
            };

            this.props.getUseList(params).then((res) => {
                if (parseInt(res.count) > (offset + limit))
                    this.setState({useList: [...useList, ...res.list], offset: offset + limit, isLoading: false})
                else
                    this.setState({useList: [...useList, ...res.list], loadMore: false, isLoading: false})
            }).catch((err) => {
            });
        }
    }

    render() {
        const {navigation} = this.props;
        const {currentTabIdx, isLoading, isDetail, myPoint, accList, useList} = this.state;
        if(isLoading || isDetail)
            return null;
        else
        return (
            <View style={styles.container}>
                <TopHeader title={MyPageText.myPoint} navigation={navigation}/>

                <Text style={styles.myPoint}>
                    {`${formattedNumber(myPoint || 0)} p`}
                </Text>
                <View style={styles.shadow}/>
                <FlatList
                    data={currentTabIdx === 0 ? accList : useList}
                    showsVerticalScrollIndicator={false}
                    onEndReached={() => currentTabIdx === 0 ? this.getAccList() : this.getUseList()}
                    renderItem={({item}) => {
                        return (
                            <View style={[styles.betweenCenter, styles.pointListWrap]}>
                                <View>
                                    <Text style={styles.title}>
                                        {currentTabIdx === 0 ? item.pnt_accml_nm : item.pnt_use_nm}
                                    </Text>
                                    <Text style={styles.updatedAt}>
                                        {dateUtil.formatKCT("point", currentTabIdx === 0 ? item.accml_dt : item.use_dt)}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.point}>
                                        {`${currentTabIdx === 0 ? `+` : `-`}${formattedNumber(parseInt(currentTabIdx === 0 ? item.accml_pnt_amt : item.tot_use_pnt_amt || 0))}P`}
                                    </Text>
                                    {item.extsh_yn === "Y" && parseInt(item.extsh_pnt_amt) > 0 && (
                                        <Text style={styles.updatedAt}>
                                            {`(소멸: ${item.extsh_pnt_amt} P)`}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        );
                    }}
                    ListHeaderComponent={() => {
                        return (
                            <View style={{paddingTop: 11.5, flexDirection: "row"}}>
                                <TouchableOpacity
                                    style={[
                                        styles.tabBtn,
                                        {
                                            borderBottomColor:
                                                currentTabIdx === 0 ? Colors.MAIN_COLOR : "transparent",
                                        },
                                    ]}
                                    onPress={() => this.setState({
                                        currentTabIdx: 0,
                                        accList: [],
                                        loadMore: true,
                                        offset: 0
                                    }, () => this.getAccList())}
                                >
                                    <Text
                                        style={{
                                            fontFamily:
                                                currentTabIdx === 0 ? Fonts.AppleB : Fonts.AppleR,
                                            letterSpacing: -0.35,
                                            color:
                                                currentTabIdx === 0 ? Colors.MAIN_COLOR : "#999999",
                                        }}
                                    >
                                        {MyPageText.accumulate}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.tabBtn,
                                        {
                                            borderBottomColor:
                                                currentTabIdx === 1 ? Colors.MAIN_COLOR : "transparent",
                                        },
                                    ]}
                                    onPress={() => this.setState({
                                        currentTabIdx: 1,
                                        useList: [],
                                        loadMore: true,
                                        offset: 0
                                    }, () => this.getUseList())}
                                >
                                    <Text
                                        style={{
                                            fontFamily:
                                                currentTabIdx === 1 ? Fonts.AppleB : Fonts.AppleR,
                                            letterSpacing: -0.35,
                                            color:
                                                currentTabIdx === 1 ? Colors.MAIN_COLOR : "#999999",
                                        }}
                                    >
                                        {MyPageText.deduction}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
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
    getDetail: (params) => dispatch(ActionMber.getDetail(params)),
    getAccList: (params) => dispatch(ActionPnt.getAccList(params)),
    getUseList: (params) => dispatch(ActionPnt.getUseList(params)),

});

export default connect(mapStateToProps, mapDispatchToProps)(MyPoint);
