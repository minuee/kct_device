import { StyleSheet } from "react-native";

import { DEVICE_WIDTH, HAS_NOTCH } from "../../../model/lib/Utils/Constants";
import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  eventBtn: {
    paddingHorizontal: 11,
    paddingVertical: 4.5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  eventBtnText: {
    fontFamily: Fonts.AppleB,
    fontSize: 15,
    letterSpacing: -0.75,
    color: "#ffffff",
  },
  eventBtnBox: {
    flexDirection: "row",
    position: "absolute",
    top: DEVICE_WIDTH - 13,
    left: 20,
    zIndex: 5,
  },
  productTitle: {
    fontFamily: Fonts.AppleB,
    fontSize: 21,
    letterSpacing: -0.53,
    color: "#222222",
  },
  productOption: {
    marginTop: 5,
    fontFamily: Fonts.AppleM,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#555555",
  },
  immediatePurchaseBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    paddingBottom: 14.5,
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
  },
  productInfoTitle: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    letterSpacing: -0.35,
    color: "#999999",
  },
  currentPrice: {
    fontFamily: Fonts.AppleB,
    fontSize: 18,
    letterSpacing: -0.45,
    color: "#222222",
  },
  point: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    color: "#191919",
  },
  priceTitle: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    color: "#969696",
  },
  priceDesc: {
    fontFamily: Fonts.AppleSB,
    fontSize: 14,
    color: "#333333",
    marginTop: 5,
  },
  priceBox: {
    backgroundColor: "#f5f5f5",
    height: 75,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  pointBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 20,
  },
  productInfoSubTitle: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    letterSpacing: -0.3,
    color: "#999999",
    marginBottom: 15,
  },
  productInfo: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    letterSpacing: -0.3,
    color: "#222222",
    marginBottom: 15,
  },
  productInfoSubTitle2: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    letterSpacing: -0.3,
    color: "#999999",
    marginBottom: 10,
  },
  productInfo2: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    letterSpacing: -0.3,
    color: "#222222",
    marginBottom: 10,
  },
  productInfoContainer: {
    paddingVertical: 19.5,
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
  },
  productInfoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  headerOptionText: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    letterSpacing: -0.7,
    color: "#222222",
  },
  headerOptionBox: {
    height: 40,
    width: 85,
    alignItems: "center",
    justifyContent: "center",
  },
  headerOptionContainer: {
    position: "absolute",
    right: 20,
    top: HAS_NOTCH ? 94 : 70,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#dddddd",
  },
  regularTitle: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    color: "#595959",
  },
  auctionDeadline: {
    marginTop: 5,
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    color: "#595959",
  },
  auctionReminingTime: {
    fontFamily: Fonts.AppleB,
    fontSize: 13,
    color: "#1e2328",
    zIndex: 10,
  },
  textUnderline: {
    height: 4.8,
    opacity: 0.82,
    backgroundColor: "#e1e1e1",
    marginTop: -5,
  },
  reminingTimeBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  submitBtnBox: { flexDirection: "row", height: 60, width: "100%" },
  submitBox: {
    width: "50%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  submit: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    color: "#f5f5f5",
  },
  completeView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  completeText: {
    fontFamily: Fonts.AppleR,
    fontSize: 18,
    letterSpacing: -0.45,
    color: "#ffffff",
    marginTop: 15,
  },
  upArrow: { width: 10, height: 8.5, marginRight: 6.8 },
  auctionPriceBox: {
    marginTop: 30,
    paddingBottom: 20,
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  latestBidBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    alignItems: "center",
  },
  changedPrice: {
    fontFamily: Fonts.AppleB,
    fontSize: 12,
    letterSpacing: -0.3,
    color: Colors.MAIN_COLOR,
    marginRight: 12.5,
    marginTop: 2,
  },
  auctionStatusBox: { alignItems: "center", marginTop: 30 },
  auctionStatus: {
    fontFamily: Fonts.AppleB,
    fontSize: 16,
    color: "#1e2328",
  },
  pinkRound: {
    width: 6,
    height: 6,
    opacity: 0.64,
    borderRadius: 30,
    backgroundColor: Colors.MAIN_COLOR,
    marginTop: 2,
    marginRight: 2,
  },
  proceeding: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    color: "#595959",
    marginTop: 3,
  },
  auctionProgressBar: {
    backgroundColor: "#d5d5d5",
    height: 5,
    width: "100%",
    marginTop: 7,
  },
  auctionActiveProgressBar: { backgroundColor: "#191919", height: 5 },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderRightColor: "transparent",
    borderTopColor: Colors.MAIN_COLOR,
  },
  remainingNumberBox: {
    paddingVertical: 7,
    backgroundColor: Colors.MAIN_COLOR,
    alignItems: "center",
    justifyContent: "center",
    // width: 68.8,
    width: "24%",
    height: 30,
  },
  remainingNumber: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    color: "#f5f5f5",
  },
  reminingAuctionTimeBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 25,
  },
  biddingDesc: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    color: "#969696",
    marginTop: 10,
    textAlign: "center",
  },
  biddingStatusContainer: {
    marginTop: 40,
    alignItems: "center",
    paddingBottom: 29.5,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  biddingTitle: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    color: "#595959",
  },
  biddingStatusBox: {
    flexDirection: "row",
    height: 35,
    backgroundColor: "#f5f5f5",
  },
  alignCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
