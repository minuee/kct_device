import { StyleSheet } from "react-native";

import {DEVICE_WIDTH, StatusBarHeight} from "../../../model/lib/Utils/Constants";
import Fonts from "../../../model/lib/Utils/Fonts";
import Colors from "../../../model/lib/Utils/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  activeSlide: {
    height: 2.5,
    borderRadius: 15,
    backgroundColor: Colors.MAIN_COLOR,
  },
  paginationBox: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    // top: DEVICE_WIDTH - StatusBarHeight - 15,
    top: DEVICE_WIDTH - 13 - 20,
    zIndex: 5,
  },
  progressBar: {
    height: 2.5,
    borderRadius: 15,
    backgroundColor: "rgba(231,7,118, 0.12)",
    width: 200,
    marginRight: 10,
  },
  page: {
    fontFamily: Fonts.AppleL,
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: -0.6,
    textAlign: "left",
    color: "#969696",
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
    fontFamily: Fonts.AppleSB,
    fontSize: 20,
    color: "#191919",
    marginTop: 30,
  },
  latestBidBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32.5,
    paddingBottom: 20,
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: 0.5,
  },
  productInfoTitle: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    color: "#969696",
  },
  rowCenter: { flexDirection: "row", alignItems: "center" },
  upArrow: { width: 10, height: 8.5, marginRight: 6.8 },
  changedPrice: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    color: "#c1c1c1",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  currentPrice: {
    fontFamily: Fonts.AppleB,
    fontSize: 20,
    color: "#191919",
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
  auctionStatusBox: { marginTop: 30 },
  auctionStatus: {
    fontFamily: Fonts.AppleB,
    fontSize: 16,
    color: "#1e2328",
  },
  round: {
    width: 6,
    height: 6,
    opacity: 0.64,
    borderRadius: 30,
    marginTop: 2,
    marginRight: 2,
  },
  proceeding: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    color: "#595959",
    marginTop: 3,
  },
  salesQuantity: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    color: "#595959",
    textAlign: "right",
  },
  groupPurchaseWarningMessage: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    color: "#969696",
    marginTop: 20,
  },
  remainingNumberBox: {
    paddingVertical: 7,
    backgroundColor: Colors.MAIN_COLOR,
    alignItems: "center",
    justifyContent: "center",
    // width: 87,
    width: "24%",
    height: 30,
  },
  remainingNumber: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    color: "#f5f5f5",
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
  regularTitle: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    color: "#595959",
  },
  productInfo: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    color: "#595959",
    marginBottom: 13.5,
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

  biddingStatusContainer: {
    marginTop: 40,
    alignItems: "center",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  thumbnail: {
    width: "100%",
    height: 191.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  playIcon: { width: 40, height: 40 },
  videoDuration: {
    fontSize: 12,
    fontWeight: "300",
    color: "#ffffff",
    marginTop: 4,
  },
  moreProductInfoTabs: {
    borderTopColor: "#595959",
    borderTopWidth: 1,
    flexDirection: "row",
  },
  moreProductInfoTab: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: "33%",
    borderColor: "#969696",
  },
  otherInfomationBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 45,
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: 1,
  },
  otherInfomationOpen: {
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1'
  },
  otherInfomation: {
    fontFamily: Fonts.AppleR,
    fontSize: 14,
    letterSpacing: -0.35,
    color: "#222222",
  },
  downArrow: { width: 20, height: 20 },
  contactUsBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  qnaCount: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    color: "#595959",
  },
  alignCenter: { alignItems: "center", justifyContent: "center" },
  contactUs: {
    fontFamily: Fonts.AppleSB,
    fontSize: 14,
    color: "#191919",
    textDecorationLine: "underline",
  },
  qnaBox: {
    paddingTop: 21,
    paddingBottom: 15,
    borderBottomColor: "#e1e1e1",
  },
  secretQna: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    letterSpacing: -0.33,
    color: "#555555",
    marginRight: 7,
  },
  lockIcon: { width: 12.44, height: 15.4 },
  qnaStatus: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 10,
    backgroundColor: "#e1e1e1",
    marginHorizontal: 7,
  },
  qnaText: {
    fontFamily: Fonts.AppleR,
    fontSize: 11,
    color: "#999999",
  },
  qnaPage: {
    fontSize: 11,
    color: "#aaaaaa",
  },
  answerBox: {
    padding: 17,
    backgroundColor: "#f3f3f3",
    marginTop: 13,
  },
  answerLabelBox: {
    paddingHorizontal: 9.5,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: Colors.MAIN_COLOR,
    marginRight: 8,
  },
  answerLabel: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    color: Colors.MAIN_COLOR,
  },
  answerDate: {
    fontFamily: Fonts.AppleR,
    fontSize: 12,
    color: "#999999",
  },
  answerContent: {
    fontFamily: Fonts.AppleR,
    fontSize: 13,
    color: "#555555",
    marginTop: 8,
  },
  qnaPageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 11,
    marginBottom: 10,
  },
  qnaPageBox: {
    width: 40,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  qnaArrow: { width: 25, height: 25 },
  feedBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  largeFeedImg: { width: 158, height: 158 },
  smallFeedImg: { width: 104, height: 104 },
  seeMoreBtn: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: "100%",
    marginTop: 12,
    marginBottom: 20,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "#c1c1c1",
  },
  seeMore: {
    fontFamily: Fonts.AppleB,
    fontSize: 13,
    color: "#555555",
  },
  submitBtnBox: { flexDirection: "row", height: 60, width: "100%" },
  submitBox: {
    width: "50%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  buyNow: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    color: "#e1e1e1",
  },
  optionalText: {
    fontFamily: Fonts.AppleR,
    fontSize: 11,
    color: "#c1c1c1",
  },
  submit: {
    fontFamily: Fonts.AppleR,
    fontSize: 20,
    color: "#f5f5f5",
  },
});

export default styles;
