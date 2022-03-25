import React from "react";
import {StyleSheet, TouchableOpacity, Image, View, Text} from "react-native";

const styles = StyleSheet.create({
    container: {marginRight: 10},
    box: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    tag: {
        fontSize: 14,
        fontWeight: "500",
        color: "#969696",
    },
    largeImg: {
        width: 211,
        height: 211,
        marginRight: 7,
    },
    smallImg: {width: 102, height: 102},
});

export const TrendTagItem = (props) => {
    const {item, navigation} = props;
    const ntt_list = item.ntt_list || [];

    return (
        <View style={styles.container}>
            <Text style={styles.tag}>{`#${item.tag_nm}`}</Text>
            <View>
                <View style={[styles.box, {marginTop: 10}]}>
                    {ntt_list.length > 0 && (
                        <TouchableOpacity
                            onPress={() => navigation.push("FeedDetail", {ntt_no: ntt_list[0].ntt_no})}>
                            <Image source={{uri: ntt_list[0].img_url_addr}} style={styles.largeImg}/>
                        </TouchableOpacity>
                    )}
                    <View style={{justifyContent: "space-between"}}>
                        {ntt_list[1] && (
                            <TouchableOpacity
                                onPress={() => navigation.push("FeedDetail", {ntt_no: ntt_list[1].ntt_no})}>
                                <Image source={{uri: ntt_list[1].img_url_addr}} style={styles.smallImg}/>
                            </TouchableOpacity>
                        )}
                        {ntt_list[2] && (
                            <TouchableOpacity
                                onPress={() => navigation.push("FeedDetail", {ntt_no: ntt_list[2].ntt_no})}>
                                <Image source={{uri: ntt_list[2].img_url_addr}} style={styles.smallImg}/>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <View style={[styles.box, {marginTop: 7}]}>
                    {ntt_list[3] && (
                        <TouchableOpacity
                            onPress={() => navigation.push("FeedDetail", {ntt_no: ntt_list[3].ntt_no})}>
                            <Image source={{uri: ntt_list[3].img_url_addr}} style={styles.smallImg}/>
                        </TouchableOpacity>
                    )}
                    {ntt_list[4] && (
                        <TouchableOpacity
                            onPress={() => navigation.push("FeedDetail", {ntt_no: ntt_list[4].ntt_no})}>
                            <Image source={{uri: ntt_list[4].img_url_addr}} style={styles.smallImg}/>
                        </TouchableOpacity>
                    )}
                    {ntt_list[5] && (
                        <TouchableOpacity
                            onPress={() => navigation.push("FeedDetail", {ntt_no: ntt_list[5].ntt_no})}>
                            <Image source={{uri: ntt_list[5].img_url_addr}} style={styles.smallImg}/>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};
