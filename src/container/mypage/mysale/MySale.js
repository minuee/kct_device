// 판매 내역
import React, {Component} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from "react-native";
import {connect} from "react-redux";

import {CodeText, MyPageText} from "../../../model/lib/Utils/Strings";
import Fonts from "../../../model/lib/Utils/Fonts";

import {TopHeader} from "../../../component/TopHeader";
import {MySaleListItem} from "../../../component/mypage/mysale/MySaleListItem";
import FilterModal from "../../../component/modal/FilterModal";

import * as ActionExchng from "../../../model/action/eEXCHNG_VOL";

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
    sale: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        letterSpacing: -0.33,
        color: "#707070",
        marginRight: 5,
    },
    count: {
        fontFamily: Fonts.AppleB,
        fontSize: 13,
        letterSpacing: -0.33,
        color: "#000000",
    },
    filter: {
        fontFamily: Fonts.AppleM,
        fontSize: 13,
        letterSpacing: -0.65,
        color: "#595959",
        marginRight: 2.5,
    },
    saleBoard: {
        width: "52%",
        aspectRatio: 4,
        position: "absolute",
        bottom: 37.5,
        alignSelf: "center",
    }
});

const filters = [
    {title: "최근 등록순", id: 5}, // sort
    {title: "즉시구매", id: 3}, // exchng_vol_trd_typ_cd
    {title: "경매거래", id: 4}, // exchng_vol_trd_typ_cd
    {title: "판매중", id: 1}, // exchng_vol_trd_sts
    {title: "판매완료", id: 2}, // exchng_vol_trd_sts
];

class MySale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isFilterLoading: true,
            loadMore: true,
            offset: 0,
            limit: 100,
            saleList: [],
            count: 0,
            isShowFilterModal: false,
            filterId: 5
        };
    }

    componentDidMount() {
        this.getList();
    }

    getList = () => {
        const {offset, limit, saleList, loadMore, filterId} = this.state;
        if (loadMore) {
            let params = {
                skip: offset,
                limit: limit,
            }

            if (filterId === 1 || filterId === 2)
                Object.assign(params, {exchng_vol_trd_sts: filterId})
            if (filterId === 3)
                Object.assign(params, {exchng_vol_trd_typ_cd: CodeText.exchng_vol_trd_typ_cd_i})
            if (filterId === 4)
                Object.assign(params, {exchng_vol_trd_typ_cd: CodeText.exchng_vol_trd_typ_cd_a})
            if (filterId === 5)
                Object.assign(params, {sort: 1})

            this.props.getList(params).then((res) => {
                if (parseInt(res.count) > (offset + limit))
                    this.setState({
                        saleList: [...saleList, ...res.list],
                        offset: offset + limit,
                        count: parseInt(res.count),
                        isLoading: false,
                        isFilterLoading: false
                    })
                else
                    this.setState({
                        saleList: [...saleList, ...res.list],
                        loadMore: false,
                        count: parseInt(res.count),
                        isLoading: false,
                        isFilterLoading: false
                    })
            }).catch((err) => {
                this.setState({isLoading: false})
            });
        }
    }

    render() {
        const {navigation} = this.props;
        const {isLoading, isFilterLoading, count, saleList, isShowFilterModal, filterId} = this.state;
        if (isLoading)
            return null;
        else
            return (
                <View style={styles.container}>
                    <TopHeader title={MyPageText.mySale} navigation={navigation}/>
                    {!isFilterLoading && (
                        <FlatList
                            data={saleList}
                            showsVerticalScrollIndicator={false}
                            renderItem={({item}) => {
                                return <MySaleListItem item={item} navigation={navigation}/>;
                            }}
                            ListFooterComponent={() => {
                                return <View style={{height: 100}}/>
                            }}
                            ListHeaderComponent={() => {
                                return (
                                    <View
                                        style={[
                                            styles.betweenCenter,
                                            {marginTop: 15, marginBottom: 30},
                                        ]}
                                    >
                                        <View style={{flexDirection: "row", alignItems: "center"}}>
                                            <Text style={styles.sale}>{MyPageText.sale}</Text>
                                            <Text style={styles.count}>{count}건</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={{flexDirection: "row", alignItems: "center"}}
                                            onPress={() => this.setState({isShowFilterModal: true})}
                                        >
                                            <Text
                                                style={styles.filter}>{filters.filter((item) => item.id === filterId)[0]?.title}</Text>
                                            <Image
                                                source={require("../../../assets/image/mypage/dropdown_btn_small.png")}
                                                style={{width: 17, height: 17}}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                );
                            }}
                            style={{paddingHorizontal: 20}}
                            keyExtractor={(_, i) => String(i)}
                        />
                    )}
                    <TouchableOpacity
                        style={styles.saleBoard}
                        onPress={() => navigation.push("TicketSale")}>
                        <Image
                            source={require("../../../assets/image/mypage/floating_sale_btn_2_2.png")}
                            style={{width: "100%", height: "100%"}}
                        />
                    </TouchableOpacity>
                    <FilterModal
                        isShowFilterModal={isShowFilterModal}
                        navigation={navigation}
                        setVisible={() => this.setState({isShowFilterModal: false})}
                        filters={filters}
                        setCurrentFilterId={(currentFilterId) => {
                            this.setState({
                                isSetFilter: true,
                                filterId: currentFilterId,
                                saleList: [],
                                offset: 0,
                                loadMore: true,
                                isFilterLoading: true,
                            }, () => this.getList());
                        }}
                        currentFilterId={filterId}
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
    getList: (params) => dispatch(ActionExchng.getTrdList(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MySale);
