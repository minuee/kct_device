import React from "react";
import {StyleSheet, TouchableOpacity, Text, View, Image} from "react-native";

import Fonts from "../../model/lib/Utils/Fonts";
import {SearchText} from "../../model/lib/Utils/Strings";

const styles = StyleSheet.create({
    container: {
        height: 70,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 5,
    },
    productImg: {
        width: 70,
        height: 70,
        borderRadius: 5,
        marginRight: 14,
    },
    title: {
        fontFamily: Fonts.AppleB,
        fontSize: 16,
        color: "#333333",
    },
    subTitle: {
        fontFamily: Fonts.AppleR,
        fontSize: 13,
        color: "#969696",
    },
});

export const ImageTagListItem = (props) => {
    const {navigation, item} = props;

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.push("TagDetail", {tag_no: item.tag_no})}>
            <Image source={{uri: item.img_url_addr}} style={styles.productImg}/>
            <View>
                <Text style={styles.title}>#{item.tag_nm}</Text>
                <View style={{flexDirection: "row", marginTop: 4}}>
                    <Text style={[styles.subTitle, {marginRight: 10}]}>
                        {SearchText.post} {`${item.ntt_cnt || 0}개`}
                    </Text>
                    <Text style={styles.subTitle}>
                        {SearchText.follower} {`${item.tag_sbscrb_cnt || 0}명`}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
