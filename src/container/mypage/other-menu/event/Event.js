// 이벤트 페이지
import React, {Component} from "react";
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import {connect} from "react-redux";

import {MyPageText} from "../../../../model/lib/Utils/Strings";
import Fonts from "../../../../model/lib/Utils/Fonts";
import Colors from "../../../../model/lib/Utils/Colors";
import {formattedNumber, notifyMessage} from "../../../../model/lib/Utils";
import {DEVICE_WIDTH} from "../../../../model/lib/Utils/Constants";
import * as dateUtil from "../../../../model/lib/Utils/Date";

import EventModal from "../../../../component/modal/EventModal";

import * as ActionEvent from "../../../../model/action/eEVENT";
import * as ActionMber from "../../../../model/action/eMBER";

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
    backBtn: {
        width: 50,
        height: 50,
        top: 15,
        left: 5,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 5,
    },
    titleWrap: {
        paddingVertical: 36.5,
        paddingHorizontal: 30,
        backgroundColor: "#252525",
    },
    titleText: {
        fontSize: 21,
        letterSpacing: -1.05,
        color: "#ffffff",
        textAlign: "center",
    },
    titleDate: {
        fontFamily: Fonts.AppleR,
        letterSpacing: -0.7,
        color: "#ffffff",
        textAlign: "center",
        marginTop: 2.5,
    },
    titleIntro: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        letterSpacing: -0.65,
        textAlign: "center",
        color: "#ffffff",
        marginTop: 32.8,
    },
    eventBoxWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 22,
        justifyContent: "space-between",
    },
    eventImg: {
        width: (DEVICE_WIDTH - 60) * 0.33 - 3.75,
        height: (DEVICE_WIDTH - 60) * 0.33 - 3.75,
        borderRadius: 4,
        marginBottom: 7.5,
    },
    eventPointWrap: {
        backgroundColor: Colors.MAIN_COLOR,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    eventRound: {
        position: 'absolute',
        borderWidth: 3,
        borderColor: "white",
        width: "73.6%",
        height: "73.6%",
        borderRadius: 47.5,
    },
    eventPointText: {
        fontSize: 21,
        color: "white",
        lineHeight: 25.8,
        transform: [{rotate: "-45deg"}],
    },
    eventCondition: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.6,
        color: "rgba(255,255,255,0.8)",
        marginTop: 12.5,
    },
    eventPoint: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.6,
        color: "rgba(255,255,255,0.8)",
        marginTop: 5,
    },
    eventInfo: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        letterSpacing: -0.6,
        color: "#999999",
        marginTop: 15,
    }

});

class Event extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isShowEventModal: false,
            isParticipated: false,
            eventDetail: {},
            eventImg: {},
            rand_box: [],
            rand_box_list: [],
            rand_box_total_cnt: 0,
            getPoint: 0,
            my_point: 0,
        };
    }

    componentDidMount() {
        const {navigation, eSESSION} = this.props;
        const {event_no} = navigation.state.params;
        if (event_no)
            this.getEventDetail(event_no);
        if (eSESSION?.mber_no)
            this.getDetail();
    }

    getDetail = () => {
        const {eSESSION} = this.props;
        let params = {
            mber_se_cd: eSESSION.mber_se_cd,
        };

        this.props.getDetail(params).then((res) => {
            this.setState({my_point: parseInt(res.user[0].포인트 || 0)})
        }).catch((err) => {
        });
    };

    getEventDetail = (event_no) => {
        let params = {
            event_no: event_no,
        }

        this.props.getEventDetail(params).then((res) => {
            const rand_box_total_cnt = parseInt(res.event.rand_box_total_cnt || 0)
            let rand_box_list = new Array(rand_box_total_cnt).fill({});
            this.setState({
                isLoading: false,
                eventDetail: res.event,
                rand_box: res.event.rand_box,
                rand_box_total_cnt: rand_box_total_cnt,
                eventImg: res.event_img,
                rand_box_list: rand_box_list
            }, () => this.setRandomBox())
        }).catch((err) => {
        });
    }

    setRandomBox = () => {
        const {rand_box_list, rand_box, rand_box_total_cnt} = this.state;
        let new_rand_box_list = rand_box_list;
        rand_box.map((randItem) => {
            const rand_idx = Math.floor(Math.random() * rand_box_total_cnt);
            if (!new_rand_box_list[rand_idx]?.rand_box_no)
                new_rand_box_list[rand_idx] = randItem;
        })
        this.setState({rand_box_list: new_rand_box_list})
    }

    getOpen = () => {
        const {navigation} = this.props;
        const {event_no} = navigation.state.params;
        let params = {
            event_no: event_no,
        }

        this.props.getOpen(params).then((res) => {
            if (res.available)
                this.setState({
                    getPoint: res.prize[0].pnt_amt || 0
                }, () => this.setState({
                    isParticipated: !res.available,
                    isShowEventModal: true,
                }, () => this.getEventDetail(event_no)))
            else
                this.setState({
                    isParticipated: !res.available,
                    isShowEventModal: true,
                });
        }).catch((err) => {
        });

    }

    render() {
        const {navigation, eCOMM_CD} = this.props;
        const {
            isLoading,
            isShowEventModal,
            isParticipated,
            eventDetail,
            eventImg,
            rand_box_list,
            getPoint,
            my_point
        } = this.state;

        const event_cd = eventDetail?.event_se_cd ? eCOMM_CD[`${eventDetail.event_se_cd}`].cd_nm : "";
        const isFree = parseInt(eventDetail.partcptn_deduct_pnt_amt || "0") === 0

        if (isLoading)
            return null;
        else
            return (
                <>
                    <TouchableOpacity
                        style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Image
                            source={require("../../../../assets/image/common/close_page.png")}
                            style={{width: 24, height: 24}}
                        />
                    </TouchableOpacity>
                    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                        <Image
                            source={{uri: eventImg.이미지URL}}
                            style={{width: "100%", height: 440}}
                        />
                        <View style={styles.titleWrap}>
                            <Text style={styles.titleText}>
                                {eventDetail.event_nm || ""}
                            </Text>
                            <Text style={styles.titleDate}>
                                {`${dateUtil.formatKCT("dash", eventDetail.event_begin_dt || "")} ~ ${dateUtil.formatKCT("dash", eventDetail.event_end_dt || "")}`}
                            </Text>
                            <Text style={styles.titleIntro}>
                                {eventDetail.event_cont || ""}
                            </Text>
                            <View style={styles.eventBoxWrap}>
                                {rand_box_list.map((event) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (!event?.rand_box_no) {
                                                    if (parseInt(eventDetail.partcptn_deduct_pnt_amt || 0) <= my_point)
                                                        this.getOpen();
                                                    else
                                                        notifyMessage("참여할 수 있는 포인트가 없습니다.")
                                                }
                                            }}
                                        >
                                            {event?.rand_box_no ? (
                                                <View style={[styles.eventImg, styles.eventPointWrap]}>
                                                    <View style={styles.eventRound}/>
                                                    <Text
                                                        style={styles.eventPointText}>{`${formattedNumber(event.pnt_amt)}P`}</Text>
                                                </View>
                                                // <Image
                                                //     source={require("../../../../assets/image/event/gift_box_select_diable.png")}
                                                //     style={styles.eventImg}
                                                // />
                                            ) : (
                                                <Image
                                                    source={require("../../../../assets/image/event/gift_box.png")}
                                                    style={styles.eventImg}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                            <Text style={styles.eventCondition}>
                                {`- ${MyPageText.eventConditions} : ${event_cd}`}
                            </Text>
                            <Text style={styles.eventPoint}>
                                {`- ${MyPageText.eventPoint} : ${isFree ? "무료" : eventDetail.partcptn_deduct_pnt_amt}P`}
                            </Text>
                            <Text style={styles.eventInfo}>
                                {`** ${eventDetail.event_guide}`}
                            </Text>
                        </View>
                        <EventModal
                            isShowEventModal={isShowEventModal}
                            setVisible={() => this.setState({isShowEventModal: false})}
                            isParticipated={isParticipated}
                            getPoint={getPoint}
                        />
                    </ScrollView>
                </>
            );
    }
}

const mapStateToProps = (state) => ({
    eSESSION: state.eSESSION.eSESSION,
    eCOMM_CD: state.eCOMM_CD.eCOMM_CD,
});

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    getDetail: (params) => dispatch(ActionMber.getDetail(params)),
    getEventDetail: (params) => dispatch(ActionEvent.getDetail(params)),
    getOpen: (params) => dispatch(ActionEvent.getOpen(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Event);
