import React from "react";
import {StyleSheet, TouchableOpacity, Text, Image, View} from "react-native";
import Colors from "../../model/lib/Utils/Colors";

import Fonts from "../../model/lib/Utils/Fonts";
import * as dateUtil from "../../model/lib/Utils/Date";
import {parseUrl} from "../../model/RootNavigation";

/* 1차 알림 UI */
// const styles = StyleSheet.create({
//     container: {
//         paddingVertical: 15,
//         paddingHorizontal: 20,
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     img: {width: 60, height: 60, borderRadius: 30, marginRight: 9},
//     title: {
//         fontFamily: Fonts.AppleR,
//         color: "#2a2e34",
//     },
//     updatedAt: {
//         fontFamily: Fonts.AppleR,
//         fontSize: 12,
//         color: "#c1c1c1",
//         marginTop: 6,
//     },
//     rightIcon: {width: "30%", alignItems: "center", justifyContent: "center"},
//     round: {
//         width: 14,
//         height: 14,
//         opacity: 0.68,
//         backgroundColor: Colors.MAIN_COLOR,
//         borderRadius: 30,
//         position: "absolute",
//         top: 15,
//         left: 65,
//         zIndex: 5,
//     },
// });
// export const NotificationListItem = (props) => {
//     const {item, eCOMM_CD, navigation} = props;
//     const isActive = item.ntcn_cnfirm_yn === "N";
//
//     return (
//         <TouchableOpacity
//             style={styles.container}
//             onPress={async () => {
//                 if (item.push_ntcn_link_url_addr) {
//                     const link_info = await parseUrl(item.push_ntcn_link_url_addr);
//                     if (link_info?.nav)
//                         navigation.navigate(link_info.nav, link_info.params);
//                 }
//             }}
//         >
//             {isActive && <View style={styles.round}/>}
//
//             <Image
//                 source={item.push_ntcn_img_url_addr ? {uri: item.push_ntcn_img_url_addr} : require("../../assets/image/main/notification_circle_icon.png")}
//                 style={styles.img}/>
//             <View style={{width: "60%"}}>
//                 <Text style={styles.title} numberOfLines={2}>
//                     {`${item.push_ntcn_sj || ""}`}
//                 </Text>
//                 <Text style={styles.updatedAt}>{dateUtil.formatKCT("dashFullTime", item.inst_dt || "")}</Text>
//             </View>
//             {item.push_ntcn_link_url_addr ? (
//                 <View style={styles.rightIcon}>
//                     <Image
//                         style={{width: 20, height: 20}}
//                         source={require("../../assets/image/store/more_chevron_small.png")}
//                     />
//                 </View>
//             ) : null}
//         </TouchableOpacity>
//     );
// };


/* 2차 알림 UI */
const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: .5,
        borderBottomColor: "#dddddd",
    },
    type: {
        fontFamily: Fonts.AppleB,
        color: Colors.MAIN_COLOR,
        fontSize: 14,
    },
    title: {
        fontFamily: Fonts.AppleB,
        color: "#2a2e34",
        fontSize: 14,
        marginTop: 7,
    },
    cont: {
        fontFamily: Fonts.AppleR,
        color: "#333333",
        fontSize: 12,
        marginTop: 10,
    },
    updatedAt: {
        fontFamily: Fonts.AppleR,
        fontSize: 12,
        color: "#bbbbbb",
        marginTop: 15,
    },
    rightIcon: {
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        position: 'absolute',
        bottom: 15,
        right: 20,
    },
});
export const NotificationListItem = (props) => {
    const {item, navigation} = props;
    const isActive = item.ntcn_cnfirm_yn === "N";
    const type_idx = item.push_ntcn_sj.indexOf("]");
    const type_txt = item.push_ntcn_sj.substring(0, type_idx + 1);
    const push_ntcn_sj = item.push_ntcn_sj.replace(type_txt, "");
    const push_ntcn_cont = item.push_ntcn_cont || "";

    return (
        <TouchableOpacity
            style={[styles.container, isActive ? {backgroundColor: "#fff3f9"} : null]}
            onPress={async () => {
                if (item.push_ntcn_link_url_addr) {
                    const link_info = await parseUrl(item.push_ntcn_link_url_addr);
                    if (link_info?.nav)
                        navigation.navigate(link_info.nav, link_info.params);
                }
            }}
        >
            <View style={{width: "100%"}}>
                {type_txt ? <Text style={styles.type}>{`${type_txt || ""}`}</Text> : null}
                {push_ntcn_sj ? <Text style={styles.title} numberOfLines={2}>{`${push_ntcn_sj || ""}`}</Text> : null}
                {push_ntcn_cont ? <Text style={styles.cont}>{`${push_ntcn_cont}`}</Text> : null}
                <Text style={styles.updatedAt}>{dateUtil.formatKCT("dashFullTime", item.inst_dt || "")}</Text>
            </View>
            {item.push_ntcn_link_url_addr ? (
                <View style={styles.rightIcon}>
                    <Image
                        style={{width: "100%", height: "100%"}}
                        source={require("../../assets/image/store/more_chevron_small.png")}
                    />
                </View>
            ) : null}
        </TouchableOpacity>
    );
};
