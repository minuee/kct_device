// 설정
import React, {Component} from "react";
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import produce from "immer";
import {connect} from "react-redux";

import {MyPageText, SearchText} from "../../../../model/lib/Utils/Strings";

import {TopHeader} from "../../../../component/TopHeader";
import Fonts from "../../../../model/lib/Utils/Fonts";
import TextInputStr from "../../../../common/textinput/TextInput";

// Action

import * as ActionFaq from "../../../../model/action/eFAQ";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
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
    searchBox: {
        height: 33,
        borderBottomWidth: 1,
        borderBottomColor: "#000000",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
        marginHorizontal: 20,
    },
    textForm: {
        fontFamily: Fonts.AppleR,
        fontSize: 15,
        letterSpacing: -0.38,
        color: "#000000",
        padding: 0,
    },
    categoryBtn: {
        paddingHorizontal: 23.5,
        paddingVertical: 7.5,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 17.8,
        marginRight: 5,
        height: 35,
    },
    category: {
        fontFamily: Fonts.AppleB,
        fontSize: 16,
        letterSpacing: -0.8
    },
    categories: {
        paddingLeft: 20,
        paddingTop: 12,
        paddingBottom: 15.5,
        height: 62.5,
        borderBottomWidth: 0.5,
        borderBottomColor: "#d5d5d5",
    },
    faq: {
        marginHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        height: 75,
        borderBottomWidth: 0.5,
    },
    faqView: {
        flexDirection: "row",
        alignItems: "center",
    },
    faqImgWrap: {
        width: "30%",
        alignItems: "center",
        justifyContent: "center",
    },
    faqCategory: {
        fontFamily: Fonts.AppleR,
        fontSize: 14,
        letterSpacing: -0.7,
        textAlign: "left",
        color: "#c1c1c1",
        width: "20%",
    },
    faqTitle: {
        fontFamily: Fonts.AppleR,
        fontSize: 14,
        letterSpacing: -0.7,
        textAlign: "left",
        color: "#333333",
        width: "65%",
    },
    faqOpenWrap: {
        marginHorizontal: 20,
        paddingHorizontal: 10,
        paddingVertical: 16,
        backgroundColor: "#f5f5f5",
    },
    faqOpenText: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        letterSpacing: -0.65,
        color: "#333333",
    },
});

class FAQ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            currentCategoryId: "",
            categories: [],
            faqList: [],
        };
    }

    componentDidMount() {
        this.getCtgryList();
        this.getList();
    }

    getCtgryList = () => {
        let params = {
            skip: 0,
            limit: 100,
        }

        this.props.getCtgryList(params).then((res) => {
            this.setState({categories: [{faq_ctgry_no: "", faq_ctgry_nm: "전체"}, ...res.list]})
        }).catch((err) => {
        });
    }

    getList = () => {
        const {searchText, currentCategoryId} = this.state;
        let params = {
            skip: 0,
            limit: 100,
        }
        if (currentCategoryId)
            Object.assign(params, {faq_ctgry_no: currentCategoryId})

        if (searchText) // 검색어 : 제목
            Object.assign(params, {faq_sj: searchText})

        this.props.getList(params).then((res) => {
            let newList = res.list.map((item, index) => {
                return {...item, isOpened: false}
            })
            this.setState({faqList: newList})
        }).catch((err) => {
        });
    }


    render() {
        const {navigation} = this.props;
        const {searchText, currentCategoryId, faqList, categories} = this.state;
        return (
            <View style={styles.container}>
                <TopHeader
                    title={MyPageText.faq}
                    navigation={navigation}
                    hasRightBtn={false}
                />
                <View style={styles.searchBox}>
                    <TextInputStr
                        boxStyle={{flex: 1}}
                        textForm={styles.textForm}
                        placeholder={SearchText.placeholder}
                        placeholderTextColor="#999999"
                        value={searchText}
                        setValue={(str) => this.setState({searchText: str})}
                    />
                    <TouchableOpacity
                        onPress={() => this.getList()}
                    >
                        <Image
                            source={require("../../../../assets/image/search/search_btn.png")}
                            style={{width: 21, height: 21.5}}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{height: 62.5}}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.categories}>
                        {categories.map((category, index) => {
                            return (
                                <TouchableOpacity
                                    style={[styles.categoryBtn, {backgroundColor: currentCategoryId === category.faq_ctgry_no ? "#000000" : "transparent",}]}
                                    onPress={() => this.setState({currentCategoryId: category.faq_ctgry_no}, () => this.getList())}
                                    key={`faq_category_${index}`}
                                >
                                    <Text
                                        style={[
                                            styles.category,
                                            {color: currentCategoryId === category.faq_ctgry_no ? "#f5f5f5" : "#191919",},
                                        ]}
                                    >
                                        {category.faq_ctgry_nm}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                        <View style={{width: 40}}/>
                    </ScrollView>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {faqList.map((faq, index) => {
                        return (
                            <>
                                <TouchableOpacity
                                    style={[
                                        styles.faq,
                                        {borderBottomColor: faq.isOpened ? "transparent" : "#d5d5d5",},
                                    ]}
                                    onPress={() => {
                                        let updatedFaqs = produce(faqList, (draft) => {
                                            draft[index].isOpened = !draft[index].isOpened;
                                        });
                                        this.setState({faqList: updatedFaqs});
                                    }}
                                    key={`faq_list_${index}`}
                                >
                                    <Text style={styles.faqCategory}>{faq.faq_ctgry_nm}</Text>
                                    <View style={styles.faqView}>
                                        <Text style={styles.faqTitle} numberOfLines={2}>{faq.faq_sj}</Text>
                                        <View style={styles.faqImgWrap}>
                                            <Image
                                                style={{width: 20, height: 20}}
                                                source={require("../../../../assets/image/mypage/dropdown_btn_regular.png")}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                {faq.isOpened && (
                                    <View style={styles.faqOpenWrap}>
                                        <Text style={styles.faqOpenText}>
                                            {faq.faq_cont}
                                        </Text>
                                    </View>
                                )}
                            </>
                        );
                    })}
                </ScrollView>
            </View>
        );
    }
}

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    getCtgryList: (params) => dispatch(ActionFaq.getCtgryList(params)),
    getList: (params) => dispatch(ActionFaq.getList(params)),
});

export default connect(undefined, mapDispatchToProps)(FAQ);
