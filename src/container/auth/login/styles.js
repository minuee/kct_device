import {Platform, StyleSheet} from "react-native";
import {HAS_NOTCH, StatusBarHeight} from "../../../model/lib/Utils/Constants";
import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    statusBar: {
        height: StatusBarHeight,
    },
    naviBar: {
        height: 50,
        alignSelf: "flex-end",
        alignItems: "center",
        justifyContent: "center",
        paddingRight: 20,
    },
    headerText: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 47.5,
        letterSpacing: -0.52,
        textAlign: "center",
        color: "#595959",
    },
    logo: {
        marginTop: 30,
        width: 158,
        height: 64.5,
        alignSelf: "center",
    },
    snsIcon: {width: 50, height: 50},
    userTabs: {
        flexDirection: "row",
        marginTop: 35,
        justifyContent: "space-around",
    },
    userTabTitle: {
        fontFamily: Fonts.AppleR,
        fontSize: 16,
        lineHeight: 24,
        color: "#333333",
    },
    tab: {
        height: 50,
        borderBottomWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    boxStyle: {
        borderBottomWidth: 0.3,
        borderBottomColor: "#d5d5d5",
        height: 42,
    },
    textForm: {
        height: 42,
        paddingLeft: 15,
        flex: 1,
    },
    loginBtn: {
        marginTop: 23,
        marginHorizontal: 20,
        height: 50,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    login: {
        fontFamily: Fonts.AppleR,
        fontSize: 16,
        color: "#f5f5f5",
    },
    findUserInfoContainer: {
        flexDirection: "row",
        marginHorizontal: 20,
        alignItems: "center",
    },
    findUserInfoBox: {
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        width: "50%",
    },
    verticalDivider: {height: 16, width: 0.3, backgroundColor: "#c1c1c1"},
    signUpBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 45,
    },
    normalText: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        color: "#969696",
    },
    signUp: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        color: Colors.MAIN_COLOR,
    },
    socialLoginContainer: {marginTop: 34, alignItems: "center"},
    socialLoginBox: {
        flexDirection: "row",
        marginTop: 12,
        justifyContent: "space-around",
        marginHorizontal: 20,
        // width: Platform.OS === 'ios' ? "75%" : "70%",
        width: "70%",
    },
    socialLoginText: {
        fontFamily: Fonts.AppleR,
        fontSize: 14,
        color: "#969696",
    },
});

export default styles;
