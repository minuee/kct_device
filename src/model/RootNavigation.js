// APP Notification Navigation 처리

import {NavigationActions} from 'react-navigation';
import {appScheme, CodeText, NotificationText} from "./lib/Utils/Strings";
import {Linking} from "react-native";
import {notifyMessage} from "./lib/Utils";

let _navigator;

export function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

export function navigate(routeName, params) {
    if (_navigator?.dispatch)
        _navigator.dispatch(
            NavigationActions.navigate({
                routeName,
                params,
            })
        );
}

export async function parseUrl(url) {
    // KCTMARKET://kct.com/STORE/event_no=20211027122139JNDYFJ
    const app_scheme = `${appScheme.app_scheme}/`;
    if (url.includes(app_scheme) === true) {
        let url_info = url.replace(app_scheme, "").split('/');
        if (url_info.length > 1) {
            let no_info = url_info[1].split("&").reduce(function (obj, str, index) {
                let strParts = str.split("=");
                if (strParts[0] && strParts[1]) { //<-- Make sure the key & value are not undefined
                    obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim(); //<-- Get rid of extra spaces at beginning of value strings
                }
                return obj;
            }, {});
            let nav = "";
            let params = {};
            switch (url_info[0]) {
                case "STORE":
                    if (no_info.sale_mth_cd && no_info.sale_mth_cd === CodeText.sale_mth_cd_a)
                        nav = "StoreAuction";
                    else if (no_info.sale_mth_cd && no_info.sale_mth_cd === CodeText.sale_mth_cd_r)
                        nav = "StoreReserve";
                    else if (no_info.sale_mth_cd && no_info.sale_mth_cd === CodeText.sale_mth_cd_g)
                        nav = "StoreGroup";
                    else
                        nav = "StoreDetail";
                    if (no_info?.goods_no && no_info?.sale_mth_cd)
                        Object.assign(params, {goods_no: no_info.goods_no, sale_mth_cd: no_info.sale_mth_cd});
                    else nav = "";
                    break;
                case "EXCHNG": // 교환권 상세
                    nav = "";
                    break;
                case "TAG": // 태그 상세
                    nav = "TagDetail";
                    if (no_info?.tag_no) Object.assign(params, {tag_no: no_info.tag_no});
                    else nav = "";
                    break;
                case "NTT": // 피드 상세
                    nav = "FeedDetail";
                    if (no_info?.ntt_no) Object.assign(params, {ntt_no: no_info.ntt_no})
                    else nav = "";
                    break;
                case "MYBUYP": // 구매내역 상세
                    // {order_no: item.order_no, sale_mth_cd: item.sale_mth_cd, order_dtl_no: item.order_dtl_no}
                    nav = "MyBuyProductDetail";
                    break;
                case "NOTICE": // 공지사항 상세
                    nav = "NoticeDetail";
                    Object.assign(params, {notice_matter_no: no_info.notice_matter_no})
                    break;
                case "EVENT": // 이벤트 상세
                    nav = "Event";
                    Object.assign(params, {event_no: no_info.event_no})
                    break;
                case "FAQ": // FAQ 상세
                    nav = "FAQ";
                    break;
                case "MYPAGE": // 마이페이지
                    nav = "MyPage";
                    break;
                case "ONEINQRY": // 1:1문의
                    nav = "QnA";
                    break;
                case "GOODSINQRY": // 상품 문의
                    nav = "MyProductQnA";
                    break;
                default:
                    nav = "";
                    break;
            }
            if (nav === "MyBuyProductDetail") {
                if (no_info?.immedi_purchase_ord_no && no_info?.immedi_purchase_ord_dtl_no) // 즉시구매
                    Object.assign(params, {order_no: no_info?.immedi_purchase_ord_no, sale_mth_cd: CodeText.sale_mth_cd_i, order_dtl_no: no_info?.immedi_purchase_ord_dtl_no});
                else if (no_info?.auc_trd_no) // 경매구매
                    Object.assign(params, {order_no: no_info?.auc_trd_no, sale_mth_cd: CodeText.sale_mth_cd_a});
                else if (no_info?.copertn_purchase_no) // 공동구매
                    Object.assign(params, {order_no: no_info?.copertn_purchase_no, sale_mth_cd: CodeText.sale_mth_cd_g});
                else if (no_info?.reserv_purchase_no) // 예약구매
                    Object.assign(params, {order_no: no_info?.reserv_purchase_no, sale_mth_cd: CodeText.sale_mth_cd_r});
                else nav = "MyBuy";
            }
            if (nav === "")
                console.log(NotificationText.notiLinkError);

            return {nav, params};
        } else {
            console.log(NotificationText.notiLinkError);
            return null;
        }
    } else {
        url ? await Linking.canOpenURL(url).then(async supported => {
            if (!supported) {
                console.log(NotificationText.notiLinkError);
            } else {
                await Linking.openURL(url);
            }
        }).catch((err) => {}) : null;
        return null;
    }

}
