// WebView
import React, { Component } from "react";
import WebView from "react-native-webview";

import {StatusBarHeight} from "../../model/lib/Utils/Constants";


class KCTWebView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {navigation} = this.props;
        const {web_url} = navigation.state.params;
        return (
            <WebView
                style={{ height: StatusBarHeight }}
                source={{ uri: web_url }}
            />
        );
    }
}

export default KCTWebView;
