import React, {useEffect, useState} from "react";
import {ActivityIndicator, Image, Text, View} from "react-native";
import FastImage from 'react-native-fast-image'

import {DEVICE_WIDTH} from "../../model/lib/Utils/Constants";
import Colors from "../../model/lib/Utils/Colors";

export const ProductImageInfoItem = (props) => {
    const { item } = props;
    const [imageHeight, setImageHeight] = useState(0);

    const [imgLoad, setImgLoad] = useState(false);

    useEffect(() => {
        handleImage();
    }, []);

    const handleImage = () => {
        Image.getSize(item.cntnts_url_addr, (width, height) => {
            setImageHeight(Math.floor((DEVICE_WIDTH - 40) * height / width))
        })
    }

    return (
        <View>
            {!imgLoad && (
                <View style={{width: DEVICE_WIDTH - 40, height: DEVICE_WIDTH - 40, justifyContent: 'center'}}>
                    <ActivityIndicator size="large" color={Colors.MAIN_COLOR}/>
                </View>
            )}
            <FastImage
                style={[{ height: imageHeight }, imgLoad ? {width: DEVICE_WIDTH - 40} : {width: 0}]}
                source={{
                    uri: item.cntnts_url_addr,
                    headers: { Authorization: '9876543210' },
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.immutable
                }}
                onLoadEnd={() => setImgLoad(true)}
            />
        </View>

    )
};
