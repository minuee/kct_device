// 회원가입 이용약관 상세보기
import React, {Component} from "react";
import {View, ScrollView, StyleSheet} from "react-native";
import {connect} from "react-redux";
import HTML from "react-native-render-html";

import {TopHeader} from "../../../component/TopHeader";
import Fonts from "../../../model/lib/Utils/Fonts";

// Action
import * as ActionStplat from "../../../model/action/eUSE_STPLAT";

class SignupTermsDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: {},
        }
    }

    componentDidMount() {
        this.getDetail();
    }

    getDetail = () => {
        const {navigation} = this.props;
        const {use_stplat_no} = navigation.state.params;

        let params = {
            use_stplat_no: use_stplat_no,
        }

        this.props.getDetail(params).then((res) => {
            this.setState({detail: res.detail})
        }).catch((err) => {
        })
    }


    render() {
        const {navigation} = this.props;
        const {title} = navigation.state.params;
        const {detail} = this.state;

        return (
            <View style={styles.container}>
                <TopHeader title={detail.use_stplat_nm} navigation={navigation}/>
                <ScrollView style={{paddingHorizontal: 30}} showsVerticalScrollIndicator={false}>
                    <HTML source={{html: detail.use_stplat_cont}}/>
                    {/*<Text style={[styles.title, {marginTop: 30}]}>서비스 이용약관</Text>*/}
                    {/*<Text style={[styles.title, {marginTop: 20.5}]}>제1장 총칙</Text>*/}
                    {/*<Text style={[styles.desc, {marginTop: 20.5}]}>*/}
                    {/*    <Text style={{color: "#333333"}}>제1조 (목적){"\n\n"}</Text>본*/}
                    {/*    약관은 ㈜한국케이블텔레콤(이하 ’회사’라 함)가 제공하는 ‘티플러스*/}
                    {/*    마켓’에 관한 모든 제품 및 서비스(이하 ‘서비스’라 함)를 이용함에 있어*/}
                    {/*    이용자의 권리_의무 및 책임에 관한 사항을 규정함을 목적으로 합니다.*/}
                    {/*    『인터넷, 정보통신망, 모바일 및 스마트 장치 등을 이용하는*/}
                    {/*    전자상거래에 대해서도 그 성질에 반하지 않는 한 이 약관을*/}
                    {/*    준용합니다』*/}
                    {/*</Text>*/}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    title: {
        fontFamily: Fonts.AppleR,
        fontSize: 20,
        lineHeight: 30,
        color: "#333333",
        marginTop: 30,
    },
    desc: {
        fontFamily: Fonts.AppleR,
        fontSize: 14,
        lineHeight: 19.5,
        color: "#969696",
    },
});


// Define the actions this component may dispatch
const mapDispatchToProps = (dispatch) => ({
    getDetail: (params) => dispatch(ActionStplat.getDetail(params)),
});

export default connect(undefined, mapDispatchToProps)(SignupTermsDetail);
