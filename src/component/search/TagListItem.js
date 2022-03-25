import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
} from "react-native";

import Fonts from "../../model/lib/Utils/Fonts";
import {SearchText} from "../../model/lib/Utils/Strings";

const styles = StyleSheet.create({
    container: {
        height: 80,
        justifyContent: "center",
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
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

export const TagListItem = (props) => {
    const {navigation, item} = props;

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate("TagDetail", {tag_no: item.tag_no})}>
            <Text style={styles.title}>#{item.tag_nm}</Text>
            <View style={{flexDirection: 'row', marginTop: 4,}}>
                <Text style={[styles.subTitle, {marginRight: 10}]}>
                    {SearchText.post} {`${item.ntt_cnt || 0}개`}
                </Text>
                <Text style={styles.subTitle}>
                    {SearchText.follower} {`${item.tag_sbscrb_cnt || 0}명`}
                </Text>
            </View>
        </TouchableOpacity>
    );
};
