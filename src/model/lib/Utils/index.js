import {
    Alert,
    Platform,
    ToastAndroid,
    PixelRatio,
    Dimensions,
} from "react-native";
import moment from "moment";
import * as dateUtil from "./Date";
import AsyncStorage from "@react-native-community/async-storage";
import {TOKEN} from "./Strings";

/* 즉시구매 CODE */
export const refund_cd = [
    // 반품진행 : completeType = 3
    // isCompleteType = 1
    "IPODSC06", // 즉시구매 : 반품진행
    "LPOSC005", // 최종구매주문 : 반품진행
    "IPODRSC1", // 반품요청
    "IPODRSC2", // 반품요청확인
    "IPODRSC3", // 반품거부
    "IPODRSC4", // 반품완료
    "IPODRSC5", // 반품요청철회
    "IPODSC06", // 반품진행
    "IPODSC07", // 결제취소
];
export const exchng_cd = [
    // 교환진행
    // isCompleteType = 1
    "IPODSC05", // 즉시구매 : 교환진행
    "LPOSC004", // 최종구매주문 : 교환진행
    "IPODESC1", // 교환요청
    "IPODESC2", // 교환요청확인
    "IPODESC3", // 교환배송진행
    "IPODESC4", // 교환구매확정
    "IPODESC5", // 교환요청철회
];
export const cancel_cd = [
    // 주문취소 상세 : completeType = 1
    // isCompleteType = 2
    "IPODSC07", // 즉시구매 : 결제취소
    "LPOSC006", // 최종구매주문 : 결제취소
];
export const feed_cd = [
    // 피드 작성 : completeType = 4
    // isCompleteType = 3
    "IPODSC04", // 즉시구매 : 구매확정
    "LPOSC003", // 최종구매주문 : 구매확정
];
export const wait_cd = [
    // 결제대기
    // isCompleteType = 4
    "IPODSC01", // 즉시구매 : 결제대기
    "LPOSC000", // 최종구매주문 : 결제대기
];
export const dlvy_cd = [
    "DSC00001", // 배송등록
    "DSC00002", // 배송시작
    "DSC00003", // 배송완료 => 하단 multi btn 노출 필요
];
export const confirm_cd = [
    // 구매 확정 : completeType = 2
    "IPODSC03", // 즉시구매 : 배송진행
    "LPOSC002", // 최종구매주문 : 배송진행
];

/* ORDER PRODUCT CODE */
export const ORD_RTNGUD = [
// 반품요청 상태 (철회가능) :: ORD_RTNGUD_7
// 반품요청 상태 (철회불가능) :: ORD_RTNGUD_8
    "ORD_RTNGUD_7",
    "ORD_RTNGUD_8",
]
export const ORD_EXCHNG = [
// 교환요청 상태 (철회가능) :: ORD_EXCHNG_9
// 교환요청 상태 (철회불가능) :: ORD_EXCHNG_10
    "ORD_EXCHNG_9",
    "ORD_EXCHNG_10",
]
export const ORD_DCSN = [
// 구매확정 상태 (피드작성) :: ORD_DCSN_5
// 구매확정 상태 (피드 이미 작성완료) :: ORD_DCSN_6
    "ORD_DCSN_5",
    "ORD_DCSN_6",
// 구매확정 상태 (피드작성) :: ORD_DTL_DCSN_5
// 구매확정 상태 (피드 이미 작성완료) :: ORD_DTL_DCSN_6
    "ORD_DTL_DCSN_5",
    "ORD_DTL_DCSN_6",
]


export const SALE_MTH_CD = [
    {
        cd_no: "SMC00001",
        cd_nm: "즉시구매",
    },
    {
        cd_no: "SMC00002",
        cd_nm: "경매거래",
    },
    {
        cd_no: "SMC00004",
        cd_nm: "예약구매",
    },
    {
        cd_no: "SMC00003",
        cd_nm: "공동구매",
    },
];

export const STTEMNT_SE_CD = [
    {
        cd_no: "SSC00001",
        cd_nm: "영리목적/홍보성",
    },
    {
        cd_no: "SSC00002",
        cd_nm: "같은 내용 도배",
    },
    {
        cd_no: "SSC00007",
        cd_nm: "욕설/인신공격",
    },
    {
        cd_no: "SSC00003",
        cd_nm: "개인정보노출",
    },
    {
        cd_no: "SSC00004",
        cd_nm: "불법정보",
    },
    {
        cd_no: "SSC00005",
        cd_nm: "음란/선정성",
    },
    {
        cd_no: "SSC00006",
        cd_nm: "기타",
    },
];

export function notifyMessage(msg) {
    if (Platform.OS === "android") {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
        Alert.alert(msg);
    }
}

export function isValidKorean(str) {
    const regExp = /[a-z0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g;
    return !regExp.test(str);
}


export function isValidEmail(email) {
    let regexp =
        /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return !regexp.test(email.trim());
}

export const validatePassword = (value) => {
    let rtn = {
        result: false,
        msg: "",
    };

    // 영어+숫자+특수문자 조합, 8~12자
    let regExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=_`-])[A-Za-z\d~!@#$%^&*()+|=_`-]{8,12}$/;
    if (!regExp.test(value)) {
        rtn.msg = "영어+숫자+특수문자 조합, 8~12 입력해주세요.";
        return rtn;
    }

    rtn.result = true;
    return rtn;
};

// 파일명 가져오는 함수
export const getFileName = (fileName) => {
    return fileName.replace(/^.*[\\\/]/, "");
};

// 이메일 마스킹 : email_addr
export const maskingEmail = (email) => {
    if (!isValidEmail(email)) {
        let skipFirstChars = 2;
        let firstThreeChar = email.slice(0, skipFirstChars);

        let domainIndexStart = email.lastIndexOf("@");
        let maskedEmail = email.slice(skipFirstChars, domainIndexStart);
        maskedEmail = maskedEmail.replace(/./g, "*");

        let domain = email.slice(domainIndexStart + 1, email.length);
        let domainThreeChar = domain.slice(0, skipFirstChars);

        let pointIndexStart = domain.lastIndexOf(".");
        let maskedDomain = domain.slice(skipFirstChars, pointIndexStart);
        maskedDomain = maskedDomain.replace(/./g, "*");
        let point = domain.slice(pointIndexStart, email.length);

        return firstThreeChar
            .concat(maskedEmail)
            .concat("@")
            .concat(domainThreeChar)
            .concat(maskedDomain)
            .concat(point);
    } else return email;
};

// 아이디 마스킹 : mber_nm
export const maskingId = (id) => {
    if (id !== "") {
        let skipLastChars = 4;
        if (id.length <= 4) skipLastChars = 3;
        if (id.length <= 3) skipLastChars = 2;
        let firstChar = id.slice(0, id.length - skipLastChars);
        let maskedId = id.slice(id.length - skipLastChars, id.length);
        maskedId = maskedId.replace(/./g, "*");
        return firstChar.concat(maskedId);
    } else return id;
};

// 휴대폰번호 마스킹 : moblphon_no
export const maskingPhone = (phone) => {
    let phoneStr = "";
    if (phone.length === 10) {
        phoneStr = phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    } else if (12 === phone.length) {
        phoneStr = phone
            .replace(/-/g, "")
            .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    } else if (13 === phone.length || 11 === phone.length) {
        phoneStr = phone
            .replace(/-/g, "")
            .replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    } else {
        return phone;
    }
    if (/-[0-9]{3}-/.test(phoneStr)) {
        // 2.1) 00-000-0000
        phoneStr = phoneStr.replace(
            phoneStr,
            phoneStr.toString().replace(/-[0-9]{3}-/g, "-***-")
        );
    } else if (/-[0-9]{4}-/.test(phoneStr)) {
        // 2.2) 00-0000-0000
        phoneStr = phoneStr.replace(
            phoneStr,
            phoneStr.toString().replace(/-[0-9]{4}-/g, "-****-")
        );
    }

    phoneStr = phoneStr.replace(
        phoneStr,
        phoneStr.toString().replace(/-[0-9]{4}/g, "-****")
    );
    return phoneStr;
};

// 사업자번호 마스킹 : bsnm_reg_no
export const maskingRegNo = (reg_no) => {
    let resNo = reg_no;
    if (reg_no.length > 4) resNo = reg_no.slice(0, 3);
    return resNo.concat("-**-*****");
};

// 주소 마스킹 : dlvy.addr
export const maskingAddress = (address) => {
    let mask_idx = address.indexOf("구 ")
    if(mask_idx <= 0) mask_idx = address.indexOf("읍 ")
    if(mask_idx <= 0) mask_idx = address.indexOf("면 ")

    let intro_str = address.substring(0, mask_idx + 1);
    let last_str = address.substring(mask_idx + 1);
    last_str = last_str.replace(/\S/gi, "*");
    return intro_str.concat(last_str);
};
// 주소 마스킹 : dlvy.addr_dtl
export const maskingAll = (address) => {
    return address.replace(/\S/gi, "*");
};

// 계좌번호 마스킹 : bank_accnt_no
export const maskingAccount = (accnt_no) => {
    let intro_str = accnt_no.substring(0, 6);
    let last_str = accnt_no.substring(6);
    last_str = last_str.replace(/[0-9]/g, "*");
    return intro_str.concat(last_str);
};

// 카드번호 마스킹
export const maskingCardNum = (card_no) => {
    let intro_str = card_no.substring(0, 6);
    return intro_str.concat("-**-****-****");
};

export function formatPhoneNumber(str) {
    if (str.length === 10) {
        return str.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    } else if (12 === str.length) {
        return str.replace(/-/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    } else if (13 === str.length || 11 === str.length) {
        return str.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    } else {
        return str;
    }
}

// 가격 표시
export const formattedNumber = (value) => {
    if (Platform.OS === "ios") {
        if (value) {
            return parseInt(value).toLocaleString(navigator.language, {
                maximumFractionDigits: 0,
            });
        } else {
            return 0;
        }
    } else {
        let intValue = Math.floor(value);
        return intValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
};

// 날짜 비교
export const compareDate = (date) => {
    const currentTime = dateUtil.format("time", new Date());
    let compareTime = moment(dateUtil.formatKCT("dash", date))
        .hours("23")
        .minutes("59"); // 한국 시간 : 23시 59분으로 변경
    compareTime = dateUtil.format("time", compareTime);
    return currentTime < compareTime;
};

export const widthPercentageToDP = (widthPercent) => {
    // Parse string percentage input and convert it to number.
    const elemWidth =
        typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);

    // Use PixelRatio.roundToNearestPixel method in order to round the layout
    // size (dp) to the nearest one that correspons to an integer number of pixels.
    return PixelRatio.roundToNearestPixel(
        (Dimensions.get("window").width * elemWidth) / 100
    );
};

export const clearAsyncStorage = async () => {
    // Parse string percentage input and convert it to number.
    try {
        AsyncStorage.removeItem(TOKEN.conn_begin_dt);
        AsyncStorage.removeItem(TOKEN.remember_login);
        AsyncStorage.removeItem(TOKEN.user);
        console.log('Data removed')
    } catch (exception) {
        console.log(exception)
    }
};


