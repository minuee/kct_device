// 공지사항 상세
import React, {Component} from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from "react-native";
import {connect} from "react-redux";

// Utils
import {MyPageText} from "../../../../model/lib/Utils/Strings";
import Fonts from "../../../../model/lib/Utils/Fonts";
import * as dateUtil from "../../../../model/lib/Utils/Date";

// component
import {TopHeader} from "../../../../component/TopHeader";

// Action
import * as ActionNotice from "../../../../model/action/eNOTICE_MATTER";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
    },
    labelBox: {
        borderStyle: "solid",
        borderWidth: 0.5,
        borderColor: "#333333",
        paddingVertical: 4.2,
        paddingHorizontal: 15.2,
        marginRight: 12.5,
    },
    label: {
        fontFamily: Fonts.AppleM,
        fontSize: 12,
        letterSpacing: -0.6,
        color: "#333333",
    },
    updatedAt: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        color: "#969696",
    },
    contentWrap: {
        marginHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#333333",
    },
    title: {
        marginTop: 13.5,
        fontFamily: Fonts.AppleR,
        fontSize: 16,
        letterSpacing: -0.8,
        color: "#333333",
    },
    content: {
        fontFamily: Fonts.AppleR,
        letterSpacing: -0.7,
        lineHeight: 21,
        color: "#595959",
        marginHorizontal: 30,
        marginTop: 24,
    },
});

class NoticeDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noticeDetail: {}
        };
    }

    componentDidMount() {
        this.getDetail();
    }

    getDetail = () => {
        const {navigation} = this.props;
        const {notice_matter_no} = navigation.state.params;
        let params = {
            notice_matter_no: notice_matter_no
        }

        this.props.getDetail(params).then((res) => {
            this.setState({noticeDetail: res.detail})
        }).catch((err) => {
        });
    }

    render() {
        const {navigation} = this.props;
        const {noticeDetail} = this.state;
        return (
            <View style={styles.container}>
                <TopHeader
                    title={MyPageText.noticeDetail}
                    navigation={navigation}
                    hasRightBtn={false}
                />
                <View style={styles.contentWrap}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <View style={styles.labelBox}>
                            <Text style={styles.label}>공지</Text>
                        </View>
                        <Text style={styles.updatedAt}>{dateUtil.formatKCT("dash", noticeDetail.updt_dt)}</Text>
                    </View>
                    <Text style={styles.title}>{noticeDetail.notice_matter_nm}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.content}>
                        {noticeDetail.notice_matter_cont}
                    </Text>
                </ScrollView>
            </View>
        );
    }
}

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    getDetail: (params) => dispatch(ActionNotice.getDetail(params)),
});

export default connect(undefined, mapDispatchToProps)(NoticeDetail);
