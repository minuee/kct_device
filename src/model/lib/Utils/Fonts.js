import { Platform } from "react-native";
let Fonts;
export default Fonts = {
  AppleB: Platform.OS === "ios" ? "AppleSDGothicNeo-Bold" : "AppleSDGothicNeoB",
  AppleSB: Platform.OS === "ios" ? "AppleSDGothicNeo-SemiBold" : "AppleSDGothicNeoSB",
  AppleL: Platform.OS === "ios" ? "AppleSDGothicNeo-Light" : "AppleSDGothicNeoL",
  AppleM: Platform.OS === "ios" ? "AppleSDGothicNeo-Medium" : "AppleSDGothicNeoM",
  // AppleH: Platform.OS === "ios" ? "AppleSDGothicNeoH00" : "AppleSDGothicNeoH",
  AppleR: Platform.OS === "ios" ? "AppleSDGothicNeo-Regular" : "AppleSDGothicNeoR",
  // RobotoB: "Roboto-Bold",
  // RobotoBI: "Roboto-BoldItalic",
};
