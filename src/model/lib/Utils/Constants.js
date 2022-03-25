import {Dimensions, Platform, StatusBar} from "react-native";
import { getModel, hasNotch } from "react-native-device-info";

export const DEVICE_WIDTH = Dimensions.get("window").width;
export const DEVICE_HEIGHT = Dimensions.get("window").height;
export const HAS_NOTCH = hasNotch();
export const StatusBarHeight =
    Platform.OS === 'ios' ? 44 : StatusBar.currentHeight;

export const TimeList = [
  { hour: "01시" },
  { hour: "02시" },
  { hour: "03시" },
  { hour: "04시" },
  { hour: "05시" },
  { hour: "06시" },
  { hour: "07시" },
  { hour: "08시" },
  { hour: "09시" },
  { hour: "10시" },
  { hour: "11시" },
  { hour: "12시" },
  { hour: "13시" },
  { hour: "14시" },
  { hour: "15시" },
  { hour: "16시" },
  { hour: "17시" },
  { hour: "18시" },
  { hour: "19시" },
  { hour: "20시" },
  { hour: "21시" },
  { hour: "22시" },
  { hour: "23시" },
  { hour: "24시" },
];

export const years = [
  { title: "2021" },
  { title: "2022" },
  { title: "2023" },
  { title: "2024" },
  { title: "2025" },
  { title: "2026" },
  { title: "2027" },
  { title: "2028" },
  { title: "2029" },
  { title: "2030" },
];

export const months = [
  { title: 1 },
  { title: 2 },
  { title: 3 },
  { title: 4 },
  { title: 5 },
  { title: 6 },
  { title: 7 },
  { title: 8 },
  { title: 9 },
  { title: 10 },
  { title: 11 },
  { title: 12 },
];

export const isSE = getModel() === "iPhone SE";
