import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import Modal from "react-native-modal";
import Colors from "../../model/lib/Utils/Colors";

import Fonts from "../../model/lib/Utils/Fonts";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: -20,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  filterBox: {
    width: "100%",
    height: 41,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  filter: {
    fontFamily: Fonts.AppleR,
    fontSize: 16,
    letterSpacing: -0.48,
    color: "#555555",
  },
  activeFilter: {
    fontFamily: Fonts.AppleB,
    fontSize: 16,
    letterSpacing: -0.48,
    color: Colors.MAIN_COLOR,
  },
});

class FilterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      isShowFilterModal,
      navigation,
      setVisible,
      filters,
      setCurrentFilterId,
      currentFilterId,
    } = this.props;
    const viewHeight = filters.length * 8.75;
    return (
      <Modal
        isVisible={isShowFilterModal}
        onBackdropPress={() => setVisible(false)}
      >
        <View
          style={{ flex: 1, justifyContent: "flex-end", marginBottom: -20 }}
        >
          <TouchableWithoutFeedback
            style={{ height: `${100 - viewHeight}%` }}
            onPress={() => setVisible(false)}
          >
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          <View
            style={[
              styles.container,
              {
                height: `${viewHeight}%`,
              },
            ]}
          >
            <TouchableOpacity
              style={{ alignSelf: "flex-end", marginTop: 20, marginRight: 20 }}
              onPress={() => setVisible(false)}
            >
              <Image
                source={require("../../assets/image/store/2.png")}
                style={{ width: 18, height: 18 }}
              />
            </TouchableOpacity>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={filters}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={styles.filterBox}
                    onPress={() => setCurrentFilterId(item.id)}
                  >
                    <Text
                      style={
                        currentFilterId === item.id
                          ? styles.activeFilter
                          : styles.filter
                      }
                    >
                      {item.title}
                    </Text>
                    {currentFilterId === item.id && (
                      <Image
                        source={require("../../assets/image/search/check_line_on.png")}
                        style={{
                          width: 23,
                          height: 23,
                          position: "absolute",
                          right: 120,
                          top: 6
                        }}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(_, i) => String(i)}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

export default FilterModal;
