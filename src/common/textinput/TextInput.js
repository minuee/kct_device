import React, { Component } from "react";
import { View, TextInput } from "react-native";

export class TextInputStr extends Component {
  changeText(str) {
    this.props.setValue(str);
  }

  render() {
    const {
      boxStyle,
      textForm,
      value,
    } = this.props;
    return (
      <View style={boxStyle}>
        <TextInput
          ref={this.props.inputRef}
          value={value}
          style={[textForm, {color: "black"}]}
          onChangeText={(str) => this.changeText(str)}
          // multiline={true}
          {...this.props}
        />
      </View>
    );
  }
}

export default TextInputStr;
