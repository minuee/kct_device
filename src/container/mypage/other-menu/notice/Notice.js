// 공지사항
import React, {Component} from "react";
import {
    View,
    StyleSheet,
    FlatList,
} from "react-native";
import {connect} from "react-redux";

import {MyPageText} from "../../../../model/lib/Utils/Strings";

import {TopHeader} from "../../../../component/TopHeader";
import {NoticeListItem} from "../../../../component/mypage/notice/NoticeListItem";

// Action
import * as ActionNotice from "../../../../model/action/eNOTICE_MATTER";

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
    rightIcon: {
        alignItems: "center",
        justifyContent: "center",
    },
});

class Notice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noticeList: []
        };
    }

    componentDidMount() {
        this.getList();
    }

    getList = () => {
        let params = {
            skip: 0,
            limit: 100,
        }

        this.props.getList(params).then((res) => {
            this.setState({noticeList: res.list})
        }).catch((err) => {
        });
    }

    render() {
        const {navigation} = this.props;
        const {noticeList} = this.state;
        return (
            <View style={styles.container}>
                <TopHeader
                    title={MyPageText.notice}
                    navigation={navigation}
                    hasRightBtn={false}
                />
                <FlatList
                    data={noticeList}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => {
                        return <NoticeListItem item={item} navigation={navigation}/>;
                    }}
                    keyExtractor={(_, i) => String(i)}
                    style={{paddingHorizontal: 20}}
                />
            </View>
        );
    }
}

// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    getList: (params) => dispatch(ActionNotice.getList(params)),
});

export default connect(undefined, mapDispatchToProps)(Notice);
