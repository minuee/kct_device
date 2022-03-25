// 상단 바 > 알림 화면
import React, {Component} from "react";
import {
    ScrollView,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
} from "react-native";
import {connect} from "react-redux";

import {TagText} from "../../../model/lib/Utils/Strings";
import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";
import {DEVICE_WIDTH} from "../../../model/lib/Utils/Constants";

import {TopHeader} from "../../../component/TopHeader";

import * as ActionTag from "../../../model/action/eTAG";
import * as ActionNtt from "../../../model/action/eNTT";

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
        backgroundColor: "white",
        flex: 1,
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        fontStyle: "italic",
        color: "#333333",
    },
    subtitle: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        color: "#333333",
        marginRight: 14,
    },
    subscribeBox: {
        width: 68.5,
        height: 25,
        borderRadius: 2.5,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        borderWidth: 0.5,
    },
    playIcon: {
        width: 40,
        height: 40,
    },
    img: {
        width: "100%",
        height: "100%"
    },
    bigImg: {
        width: DEVICE_WIDTH - 40,
        height: DEVICE_WIDTH - 40,
        marginBottom: 4,
        // alignItems: "center",
        // justifyContent: "center",
    },
    smallImg: {
        width: (DEVICE_WIDTH - 40) / 3 - 4,
        height: (DEVICE_WIDTH - 40) / 3 - 4,
        marginBottom: 4,
    },
    mediumImg: {
        width: (DEVICE_WIDTH - 40) / 2 - 4,
        height: (DEVICE_WIDTH - 40) / 2 - 4,
        marginBottom: 4,
    },
    spriteImg: {
        width: DEVICE_WIDTH - 40,
        height: 180,
        marginBottom: 4,
    },
});

class TagDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            detail: {},
            nttList: [],
            offset: 0,
            limit: 100,
            loadMore: true,
        };
    }

    componentDidMount() {
        const {navigation} = this.props;
        const {tag_no} = navigation.state.params;
        if (tag_no) {
            this.getDetail(tag_no);
            this.getList(tag_no);

        }
    }

    setCreateSbs = () => {
        const {navigation} = this.props;
        const {tag_no} = navigation.state.params;
        let params = {
            tag_no: tag_no,
        }
        this.props.createSbs(params).then(async (res) => {
            this.getDetail(tag_no);
        }).catch((err) => {
        });
    }

    getDetail = (tag_no) => {
        let params = {
            tag_no: tag_no,
        }

        this.props.getDetail(params).then(async (res) => {
            this.setState({detail: res.detail, isLoading: false})
        }).catch((err) => {
        });
    }

    getList = (tag_no) => {
        const {offset, limit, nttList, loadMore} = this.state;
        if (loadMore) {
            let params = {
                skip: offset,
                limit: limit,
                tag_no: tag_no,
            }

            this.props.getList(params).then(async (res) => {
                if (parseInt(res.count) > (offset + limit))
                    this.setState({nttList: [...nttList, ...res.list], offset: offset + limit})
                else
                    this.setState({nttList: [...nttList, ...res.list], loadMore: false})

            }).catch((err) => {
            });
        }
    }


    renderHeaderBox = () => {
        const {detail} = this.state;
        return (
            <View style={[styles.betweenCenter, {marginTop: 14, marginBottom: 30}]}>
                <View>
                    <Text style={styles.title}>{`#${detail.tag_nm || ""}`}</Text>
                    <View style={{flexDirection: "row", marginTop: 12.8}}>
                        <Text style={styles.subtitle}>{TagText.post} {`${detail.ntt_cnt || 0}개`}</Text>
                        <Text style={styles.subtitle}>{TagText.subscribing} {`${detail.tag_sbscrb_cnt || 0}명`}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={[
                        styles.subscribeBox,
                        {
                            backgroundColor: detail.is_subscribe ? Colors.MAIN_COLOR : "transparent",
                            borderColor: detail.is_subscribe ? "transparent" : Colors.MAIN_COLOR,
                        },
                    ]}
                    onPress={() => this.setCreateSbs()}
                >
                    <Text
                        style={{
                            fontFamily: Fonts.AppleR,
                            fontSize: 13,
                            color: detail.is_subscribe ? "#f5f5f5" : Colors.MAIN_COLOR,
                        }}
                    >
                        {detail.is_subscribe ? TagText.subscribing : TagText.subscribe}
                    </Text>
                    {detail.is_subscribe && (
                        <Image
                            style={{marginLeft: 2, width: 14, height: 14}}
                            source={require("../../../assets/image/tag/check_black_48_dp_1.png")}
                        />
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    renderImage = (item, style) => {
        const {navigation} = this.props;
        // if(item.ytb_url_addr) {
        //     const url = item.ytb_url_addr.replace("watch?v=", "embed/")
        //     return (
        //         <WebView source={{uri : url}} style={style}/>
        //     )
        // }
        // else
        return (
            <TouchableOpacity
                style={style} onPress={() => navigation.navigate("FeedDetail", {ntt_no: item.ntt_no})}>
                <Image style={styles.img} source={{uri: item.img_url_addr}}/>
            </TouchableOpacity>
        )
    }

    renderSmallImage = (items) => {
        if (items.length === 2)
            return (
                this.renderMediumImage(items)
            )
        else if (items.length === 5) {
            return (
                <>
                    {this.renderSmallImage(items.slice(0, 3))}
                    {this.renderMediumImage(items.slice(3, 5))}
                </>
            )
        } else
            return (
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        marginTop: 5.5,
                        justifyContent: "space-between",
                    }}
                >
                    {items.map((item) => {
                        return this.renderImage(item, styles.smallImg)
                    })}

                </View>
            )
    }

    renderMediumImage = (items) => {
        return (
            <View style={styles.betweenCenter}>
                {items.map((item) => {
                    console.log(items)
                    return this.renderImage(item, styles.mediumImg)
                })}
            </View>
        )
    }

    render() {
        const {navigation} = this.props;
        const {isLoading, detail, nttList} = this.state;

        if (isLoading)
            return null;
        else
            return (
                <View style={styles.container}>
                    <TopHeader
                        title={`#${detail.tag_nm || ""}`}
                        navigation={navigation}
                        hasRightBtn={false}
                    />
                    <ScrollView
                        style={{paddingHorizontal: 20}}
                        showsVerticalScrollIndicator={false}
                        onMomentumScrollEnd={this.getList}>
                        {this.renderHeaderBox()}
                        {nttList.map((item, index) => {
                            const idx = index % 16
                            if (idx === 0)
                                return this.renderImage(item, styles.bigImg)
                            else if (idx === 7)
                                return this.renderMediumImage(nttList.slice(index, index + 2))
                            else if (idx === 9)
                                return this.renderImage(item, styles.spriteImg)
                            else if (idx === 1 || idx === 11) {
                                return this.renderSmallImage(nttList.slice(index, index + 6))
                            }
                        })}
                    </ScrollView>
                </View>
            );
    }
}

const mapStateToProps = (state) => ({
    eSESSION: state.eSESSION.eSESSION,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    getDetail: (params) => dispatch(ActionTag.getDetail(params)),
    createSbs: (params) => dispatch(ActionTag.createSbs(params)),
    getList: (params) => dispatch(ActionNtt.getList(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TagDetail);
