import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import Modal from "react-native-modal";
import ScrollPicker from "react-native-wheel-scrollview-picker";

import { DEVICE_WIDTH, months } from "../../model/lib/Utils/Constants";
import Fonts from "../../model/lib/Utils/Fonts";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: -20,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 35,
    height: `50%`,
  },
  modalView: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: -20,
  },
  titleText: {
    fontFamily: Fonts.AppleB,
    fontSize: 20,
    letterSpacing: -0.5,
    color: "#000000",
  },
  activeText: {
    fontFamily: Fonts.AppleB,
    fontSize: 19,
    letterSpacing: -0.48,
    color: "#000000",
  },
  inactiveText: {
    fontFamily: Fonts.AppleR,
    fontSize: 16,
    letterSpacing: -0.4,
    color: "#999999",
  },
  submitBtn: {
    marginHorizontal: 20,
    height: 50,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    position: "absolute",
    bottom: 25,
    width: DEVICE_WIDTH - 40,
  },
  submitBtnText: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    letterSpacing: -1,
    color: "#f5f5f5",
  },
});

class DatePickerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      years: [],
      days: [],
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth() + 1,
      selectedDay: new Date().getDate(),
      selectedYearIdx: 0,
      selectedMonthIdx: new Date().getMonth(),
      selectedDayIdx: new Date().getDate() - 1,
    };
  }

  componentDidMount = () => {
    const { isBirth } = this.props;
    const { selectedYear, selectedMonth } = this.state;
    let currentYear = new Date().getFullYear();
    if(isBirth) currentYear -= 18
    this.setState({
      selectedYear: currentYear,
      years: this.getYears(),
      days: this.getDays(selectedYear, selectedMonth),
      selectedYearIdx: isBirth ? this.getYears().length - 1 : 0,
    });
  };

  getNumDaysInMonth = (year, month) => {
    return year === 0 && month === 1 ? 29 : new Date(year, month, 0).getDate();
  };

  getYears = () => {
    const { isBirth, sale_end_dt } = this.props;
    let currentYear = new Date().getFullYear();
    if(isBirth) currentYear -= 18;

    let endYear = currentYear;

    let years = [];
    if (isBirth) {
      let startYear = 1921;
      for (let i = startYear; i <= endYear; i++) {
        years.push({ title: i.toString() });
      }
    } else {
      let sale_end_year = currentYear - new Date(sale_end_dt).getFullYear();
      if(sale_end_year < 0) sale_end_year = 0
      let startYear = currentYear + sale_end_year;
      for (let i = endYear; i <= startYear; i++) {
        years.push({ title: i.toString() });
      }
    }

    return years;
  };

  getDays = (selectedYear, selectedMonth) => {
    let numDays = this.getNumDaysInMonth(selectedYear, selectedMonth);

    let days = [];
    for (let i = 1; i <= numDays; i++) {
      days.push({ title: i.toString() });
    }

    return days;
  };

  render() {
    const { isShowDatePickerModal, setVisible, title, onPressConfirm } =
      this.props;
    const {
      years,
      selectedYear,
      selectedMonth,
      selectedDay,
      selectedYearIdx,
      selectedMonthIdx,
      selectedDayIdx,
      days,
    } = this.state;

    return (
      <Modal
        isVisible={isShowDatePickerModal}
        onBackdropPress={() => {
          setVisible(false);
          this.setState({
            years: [],
            days: [],
            selectedYear: new Date().getFullYear(),
            selectedMonth: new Date().getMonth() + 1,
            selectedDay: new Date().getDate(),
            selectedYearIdx: 0,
            selectedMonthIdx: new Date().getMonth(),
            selectedDayIdx: new Date().getDate() - 1,
          });
        }}
      >
        <View style={styles.modalView}>
          <TouchableWithoutFeedback
            style={{ height: `50%` }}
            onPress={() => setVisible(false)}
          >
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          <View style={styles.container}>
            <Text style={styles.titleText}>{title}</Text>
            <View
              style={{
                height: 130,
                marginTop: 30,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <ScrollPicker
                dataSource={years}
                selectedIndex={selectedYearIdx}
                renderItem={(data, index) => {
                  return (
                    <View
                      style={{
                        paddingTop: 11.2,
                        paddingBottom: 10,
                      }}
                    >
                      <Text
                        style={
                          selectedYearIdx === index
                            ? styles.activeText
                            : styles.inactiveText
                        }
                      >
                        {data.title}년
                      </Text>
                    </View>
                  );
                }}
                onValueChange={(data, selectedIndex) => {
                  this.setState({
                    selectedYear: data.title,
                    selectedYearIdx: selectedIndex,
                    days: this.getDays(data.title, selectedMonth),
                  });
                }}
                wrapperHeight={130}
                wrapperColor="white"
                itemHeight={45}
                highlightColor="#555555"
                highlightBorderWidth={1}
              />
              <View style={{ width: 25 }} />
              <ScrollPicker
                dataSource={months}
                selectedIndex={selectedMonthIdx}
                renderItem={(data, index) => {
                  return (
                    <View
                      style={{
                        paddingTop: 11.2,
                        paddingBottom: 10,
                      }}
                    >
                      <Text
                        style={
                          selectedMonthIdx === index
                            ? styles.activeText
                            : styles.inactiveText
                        }
                      >
                        {data.title}월
                      </Text>
                    </View>
                  );
                }}
                onValueChange={(data, selectedIndex) => {
                  this.setState({
                    selectedMonth: data.title,
                    selectedMonthIdx: selectedIndex,
                    days: this.getDays(selectedYear, data.title),
                  });
                }}
                wrapperHeight={130}
                wrapperColor="white"
                itemHeight={45}
                highlightColor="#555555"
                highlightBorderWidth={1}
              />
              <View style={{ width: 25 }} />
              <ScrollPicker
                dataSource={days}
                selectedIndex={selectedDayIdx}
                renderItem={(data, index) => {
                  return (
                    <View
                      style={{
                        paddingTop: 11.2,
                        paddingBottom: 10,
                      }}
                    >
                      <Text
                        style={
                          selectedDayIdx === index
                            ? styles.activeText
                            : styles.inactiveText
                        }
                      >
                        {data.title}일
                      </Text>
                    </View>
                  );
                }}
                onValueChange={(data, selectedIndex) => {
                  this.setState({
                    selectedDay: data.title,
                    selectedDayIdx: selectedIndex,
                  });
                }}
                wrapperHeight={130}
                wrapperColor="white"
                itemHeight={45}
                highlightColor="#555555"
                highlightBorderWidth={1}
              />
            </View>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => {
                console.log(selectedMonth);
                let month = selectedMonth;
                let day = selectedDay;
                if(parseInt(selectedMonth)< 10)
                  month = `0${selectedMonth}`;
                if(parseInt(selectedDay)< 10)
                  day = `0${selectedDay}`;
                onPressConfirm(`${selectedYear}${month}${day}`);
              }}
            >
              <Text style={styles.submitBtnText}>선택 완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default DatePickerModal;
