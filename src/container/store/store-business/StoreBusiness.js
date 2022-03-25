// 스토어 홈
import React, { Component } from "react";
import {
    ScrollView,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from "react-native";
import { connect } from "react-redux";

import {StatusBarHeight} from "../../../model/lib/Utils/Constants";
import {CodeText, StoreText} from "../../../model/lib/Utils/Strings";
import {SALE_MTH_CD} from "../../../model/lib/Utils";
import Colors from "../../../model/lib/Utils/Colors";

import { Product } from "../../../component/store/Product";
import { StoreTab } from "../../../component/store/StoreTab";
import { CategoryItem } from "../../../component/store/CategoryItem";
import FilterModal from "../../../component/modal/FilterModal";

import * as ActionGoods from "../../../model/action/eGOODS";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    storeTabText: {
        fontSize: 14,
        letterSpacing: -0.7,
    },
    storeTabs: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        height: 40,
    },
    filterBox: {
        width: 55,
        height: 55,
        alignItems: "center",
        justifyContent: "center",
    },
    filter: {
        width: 22,
        height: 22,
    },
    productList: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 14,
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },
    businessHeader: {
        height: 50,
        alignItems: "center",
        justifyContent: "center"
    },
    businessHeaderBtn: {
        position: "absolute",
        top: 0,
        left: 20,
        width: 50,
        height: 50,
        justifyContent: "center",
    },
});

const filters = [
    { title: "최신순", id: 1 },
    { title: "최저가순", id: 2 },
    { title: "판매수량순", id: 3 },
    { title: "마감임박순", id: 4 },
];

class StoreBusiness extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSetFilter: false,
            categoriesSaleCD: [],

            currentProductCategoryIdx: 0,
            currentTabIdx: CodeText.goods_se_cd_r,

            isShowBusinessMallModal: false,
            voucherListType: "list",
            isShowToast: false,
            isShowFilterModal: false,

            banner: [], // 상품배너 (최대 5개)
            best_used_list: [], // 중고상품 BEST (최대 5개)
            new_plan: [], // 새상품 발매 일정 (최대 3개)
            almost_sold_out_used_list: [], // 품절임박 중고 (최대 4개)
            almost_sold_out_new_list: [], // 품절임박 새 (최대 4개)

            offset: 0,
            limit: 100,
            loadMore: true,
            filterId: 1, // sort
            storeList: [],
        };
    }

    componentDidMount() {
        let newCDList = [{cd_no: 0, cd_nm: "전체"}, ...SALE_MTH_CD]
        this.setState({categoriesSaleCD: newCDList})
        this.getStoreList();
    }

    getStoreList = () => {
        // currentTabIdx > 중고상품 : 0, 새상품 : 1
        // currentProductCategoryIdx > 전체 : 1, ...sale_mth_cd
        // 정렬 유형 (1. 최신순(판매 시작) DESC, 2. 가격 ASC, 3. 판매수량 DESC, 4. 마감일 ASC)

        const {currentTabIdx, currentProductCategoryIdx, offset, limit, loadMore, storeList, filterId} = this.state;
        if(loadMore) {
            let params = {
                skip: offset,
                limit: limit,
                sort: filterId,
                entpr_mall_prvuse_yn: "Y",
            }

            if(currentTabIdx)
                Object.assign(params, {goods_se_cd: currentTabIdx})
            if(currentProductCategoryIdx)
                Object.assign(params, {sale_mth_cd: currentProductCategoryIdx})

            console.log("params")
            console.log(params)
            this.props.getStoreList(params).then((res) => {
                if(parseInt(res.count) > (offset + limit))
                    this.setState({storeList: [...storeList, ...res.list], offset: offset + limit})
                else
                    this.setState({storeList: [...storeList, ...res.list], loadMore: false})
            }).catch((err) => {
            });
        }
    }

    renderProductsCategories = (flag) => {
        const { isSetFilter, currentProductCategoryIdx, categoriesSaleCD } = this.state;
        return (
            <FlatList
                data={categoriesSaleCD}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    if(flag && item.cd_no === CodeText.sale_mth_cd_g)
                        return null;
                    else
                        return (
                            <CategoryItem
                                title={item.cd_nm}
                                isActive={currentProductCategoryIdx === item.cd_no}
                                setSelectedCategoryId={() =>
                                    this.setState({
                                        isSetFilter: false, filterId: 1,
                                        currentProductCategoryIdx: item.cd_no,
                                        storeList: [],
                                        offset: 0,
                                        loadMore: true
                                    }, () => this.getStoreList())
                                }
                            />
                        );
                }}
                ListHeaderComponent={() => {
                    return (
                        <TouchableOpacity
                            style={styles.filterBox}
                            onPress={() => this.setState({ isShowFilterModal: true })}
                        >
                            {isSetFilter ? <View style={{position: "absolute", top: 10, right: 10, backgroundColor: Colors.MAIN_COLOR, width: 7, height: 7, borderRadius: 5}} /> : null}
                            <Image
                                source={isSetFilter ? require("../../../assets/image/store/filter_btn.png") : require("../../../assets/image/store/filter_default_btn.png")}
                                style={styles.filter}
                            />
                        </TouchableOpacity>
                    );
                }}
                keyExtractor={(_, i) => String(i)}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                style={{ height: 55 }}
                contentContainerStyle={{ alignItems: "center" }}
            />
        );
    };

    renderProductList = () => {
        const { navigation } = this.props;
        const {storeList} = this.state;
        return (
            <View style={styles.productList}>
                {storeList.map((item) => {
                    return <Product item={item} navigation={navigation} />;
                })}
            </View>
        );
    };

    renderBusinessMallTabs = () => {
        const { currentTabIdx } = this.state;

        return (
            <View style={styles.storeTabs}>
                <StoreTab
                    title={StoreText.usedGoods}
                    isActive={currentTabIdx === CodeText.goods_se_cd_r}
                    setActive={() => this.setState({ isSetFilter: false, filterId: 1, currentTabIdx: CodeText.goods_se_cd_r, currentProductCategoryIdx: 0, storeList: [], offset: 0, loadMore: true }, () => this.getStoreList())}
                    width="50%"
                />
                <StoreTab
                    title={StoreText.newGoods}
                    isActive={currentTabIdx === CodeText.goods_se_cd_n}
                    setActive={() => this.setState({ isSetFilter: false, filterId: 1, currentTabIdx: CodeText.goods_se_cd_n, currentProductCategoryIdx: 0, storeList: [], offset: 0, loadMore: true }, () => this.getStoreList())}
                    width="50%"
                />
            </View>
        );
    };

    render() {
        const {navigation} = this.props;
        const {isShowFilterModal, filterId} = this.state;

        return (
            <View style={styles.container}>
                <View style={{ height: StatusBarHeight }} />
                <View style={styles.businessHeader}>
                    <TouchableOpacity
                        style={styles.businessHeaderBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Image
                            source={require("../../../assets/image/store/2.png")}
                            style={{ width: 16, height: 16 }}
                        />
                    </TouchableOpacity>
                    <Image
                        source={require("../../../assets/image/store/b_2_b_mall_header_l.png")}
                        style={{ width: 70, height: 20 }}
                    />
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.renderBusinessMallTabs()}
                    {this.renderProductsCategories(true)}
                    {this.renderProductList()}
                </ScrollView>
                <FilterModal
                    isShowFilterModal={isShowFilterModal}
                    navigation={navigation}
                    setVisible={() => this.setState({ isShowFilterModal: false })}
                    filters={filters}
                    setCurrentFilterId={(currentFilterId) => {
                        this.setState({
                            isSetFilter: true,
                            filterId: currentFilterId,
                            storeList: [],
                            offset: 0,
                            loadMore: true
                        }, () => this.getStoreList());
                    }}
                    currentFilterId={filterId}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    eSESSION: state.eSESSION.eSESSION,
    eCOMM_CD: state.eCOMM_CD.eCOMM_CD,
    eCOMM_CD_TYPE: state.eCOMM_CD.eCOMM_CD_TYPE,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    getStoreList: (params) => dispatch(ActionGoods.getStoreList(params)),
});
export default connect(mapStateToProps, mapDispatchToProps)(StoreBusiness);
