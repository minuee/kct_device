import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    View,
} from "react-native";

import Fonts from "../../model/lib/Utils/Fonts";

const styles = StyleSheet.create({
    betweenCenter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    searchRecentSearchText: {
        fontFamily: Fonts.AppleL,
        fontSize: 18,
        letterSpacing: -0.45,
        color: "#222222",
    },
});

export const RecentSearchesItem = (props) => {
    const {item, handleDelete, setRecentlySearch, getSearchList} = props;

    return (
        <View style={styles.betweenCenter}>
            <TouchableOpacity
                onPress={() => getSearchList(item.srchwrd)}>
                <Text style={styles.searchRecentSearchText}>{item.srchwrd}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    handleDelete(item.srchwrd_no)
                    setRecentlySearch()
                }}>
                <Image
                    source={require("../../assets/image/search/text_delete_btn.png")}
                    style={{width: 14, height: 14}}
                />
            </TouchableOpacity>
        </View>
    );
};
