import React, {useState} from "react";
import {
    View,
    TouchableOpacity,
    Image,
    Text,
    StyleSheet,
} from "react-native";
import {connect} from "react-redux";

import Colors from "../model/lib/Utils/Colors";
import Fonts from "../model/lib/Utils/Fonts";
import {HAS_NOTCH} from "../model/lib/Utils/Constants";
import {Generic, TicketText} from "../model/lib/Utils/Strings";

import AlertModal from "./modal/AlertModal";

const tabIcons = [
    {
        inactive: require("../assets/image/main/home_off.png"),
        active: require("../assets/image/main/home_on.png"),
    },
    {
        inactive: require("../assets/image/main/store_off.png"),
        active: require("../assets/image/main/store_on.png"),
    },
    {
        inactive: require("../assets/image/main/tag_off.png"),
        active: require("../assets/image/main/tag_on.png"),
    },
    {
        inactive: require("../assets/image/main/mypage_off.png"),
        active: require("../assets/image/main/mypage_on.png"),
    },
];

const styles = StyleSheet.create({
    bottomTab: {
        height: HAS_NOTCH ? 90 : 56,
        paddingVertical: 5,
        backgroundColor: "white",
        flexDirection: "row",
    },
    bottomTabItem: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        // justifyContent: "center",
    },
    tabIcon: {
        width: 30,
        height: 30,
        marginBottom: 2.5
    },
    tabText: {
        fontSize: 9,
        fontFamily: Fonts.AppleR,
        // lineHeight: 13
    },
});

const BottomTabBar = ({navigation, eSESSION}) => {
    const [isShowAlertModal, setIsShowAlertModal] = useState(false)
    const {state} = navigation;
    const list = state.routes.map((route, index) => {
        const {key, routeName} = route;
        const isFocused = state.index === index;
        const onPress = (e) => {
            if (!isFocused) {
                if (routeName === "MyPage" && eSESSION.mber_no !== undefined)
                    navigation.navigate(routeName);
                else if (routeName !== "MyPage")
                    navigation.navigate(routeName);
                else
                    setIsShowAlertModal(true)
            }
        };
        const iconPath = isFocused
            ? tabIcons[index].active
            : tabIcons[index].inactive;
        const tabName =
            index === 0
                ? Generic.home
                : index === 1
                    ? Generic.store
                    : index === 2
                        ? Generic.tag
                        : Generic.mypage;

        return {
            iconPath,
            isFocused,
            key,
            tabName,
            onPress,
        };
    });

    return (
        <View style={styles.bottomTab}>
            {list.map((item, index) => {
                return (
                    <TouchableOpacity
                        key={item.key}
                        onPress={item.onPress}
                        style={styles.bottomTabItem}
                    >
                        <Image style={styles.tabIcon} source={item.iconPath}/>

                        <Text
                            style={[
                                styles.tabText,
                                {
                                    color: item.isFocused ? Colors.MAIN_COLOR : "#969696",
                                    fontWeight: item.isFocused ? "500" : "normal",
                                },
                            ]}
                        >
                            {item.tabName}
                        </Text>
                    </TouchableOpacity>
                );
            })}
            {isShowAlertModal && (
                <AlertModal
                    isShowAlertModal={isShowAlertModal}
                    message={Generic.loginMessage}
                    leftText={TicketText.no}
                    rightText={Generic.goToLogin}
                    setVisible={() => setIsShowAlertModal(false)}
                    navigation={navigation}
                    leftOnPress={() => setIsShowAlertModal(false)}
                    rightOnPress={() => navigation.navigate("Login")}
                />
            )}
        </View>
    );
};

const mapStateToProps = (state) => ({
    eSESSION: state.eSESSION.eSESSION,
});

export default connect(mapStateToProps, undefined)(BottomTabBar);
