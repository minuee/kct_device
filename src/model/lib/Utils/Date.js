/**
 * @providesModule DateUtilService
 */

import moment from "moment";
import "moment/locale/ko";

/*
 * @params  {string} fmt
 * @params  {timestamp} date
 * @returns {string} date
 */
export const format = (fmt, date, tz) => {
  if (tz) {
    moment.locale(tz);
  } else {
    moment.locale("ko");
    moment.updateLocale("ko", {
      relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "%d초",
        ss: "%d초",
        m: "%d분",
        mm: "%d분",
        h: "%d시간",
        hh: "%d시간",
        d: "%d일",
        dd: "%d일",
        M: "%d개월",
        MM: "%d개월",
        y: "%d년",
        yy: "%d년",
      },
    });
  }
  switch (fmt) {
    case "x":
      return moment(new Date(date)).format("x");
    case "llll":
      return moment(new Date(date)).format("llll");
    case "ll":
      return moment(new Date(date)).format("ll");
    case "LT":
      return moment(new Date(date)).format("LT");
    case "HHMM":
      return moment(new Date(date)).format("HH:mm");
    case "HHMM2":
      return moment(new Date(date)).format("a hh:mm");
    case "HHMM3":
      return moment(new Date(date)).format("hh:mm a");
    case "slashDate":
      return moment(new Date(date)).format("MM/DD");
    case "lastUpdate":
      return moment(new Date(date)).format("MM.DD a hh:mm");
    case "fromNow":
      return moment(new Date(date)).fromNow();
    case "time":
      return moment(new Date(date)).format("YYYY.MM.DD HH:mm");
    case "point":
      return moment(new Date(date)).format("YYYY.MM.DD");
    case "number":
      return moment(new Date(date)).format("YYMMDD");
    case "longNumber":
      return moment(new Date(date)).format("YYYYMMDD");
    case "dash":
      return moment(new Date(date)).format("YYYY-MM-DD");
    case "dashTime":
      return moment(new Date(date)).format("YYYY-MM-DD HH:mm");
    case "fullTime":
      return moment(new Date(date)).format("YYYY-MM-DD HH:mm:ss");
    case "year":
      return moment(new Date(date)).format("YYYY");
    case "date":
      return moment(new Date(date)).format("YYYY년 MM월 DD일");
    case "shortTime":
      return moment(new Date(date)).format("HH:mm시");
    default:
      return moment(new Date(date)).format("llll");
  }
};

export const formatKCT = (fmt, date) => {
  if(date)
    switch (fmt) {
      case "dash": // 2021-10-10
        return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
      case "point": // 2021-10-10
        return `${date.substring(0, 4)}.${date.substring(4, 6)}.${date.substring(6, 8)}`;
      case "time": // 2021.10.10 10:10
        return `${date.substring(0, 4)}.${date.substring(4, 6)}.${date.substring(6, 8)} ${date.substring(8, 10)}:${date.substring(10, 12)}`;
      case "dashTime": // 2021-10-10 10:10
        return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)} ${date.substring(8, 10)}:${date.substring(10, 12)}`;
      case "dashFullTime": // 2021-10-10 10:10:10
        return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)} ${date.substring(8, 10)}:${date.substring(10, 12)}:${date.substring(12, 14)}`;
      case "fullTime": // 2021.10.10 10:10:10
        return `${date.substring(0, 4)}.${date.substring(4, 6)}.${date.substring(6, 8)} ${date.substring(8, 10)}:${date.substring(10, 12)}:${date.substring(12, 14)}`;
      case "slash": // 2021/10/10
        return `${date.substring(0, 4)}/${date.substring(4, 6)}/${date.substring(6, 8)}`;
      case "koreanFullTime": // YYYY년 10월 10일
        return `${date.substring(0, 4)}년 ${date.substring(4, 6)}월 ${date.substring(6, 8)}일`;
      case "koreanTime": // 10월 10일
        return `${date.substring(4, 6)}월 ${date.substring(6, 8)}일`;
      case "date": // 10.10 (=> MM.DD)
        return `${date.substring(4, 6)}.${date.substring(6, 8)}`;
      default: // 2021.10.10 10:10:10
        return `${date.substring(0, 4)}.${date.substring(4, 6)}.${date.substring(6, 8)} ${date.substring(8, 10)}:${date.substring(10, 12)}:${date.substring(12, 14)}`;
    }
  else return date
}

export const getUTCDay = (date) => {
  switch (date) {
    case 1:
      return "월";
    case 2:
      return "화";
    case 3:
      return "수";
    case 4:
      return "목";
    case 5:
      return "금";
    case 6:
      return "토";
    default:
      return "일";
  }
}

export const toTimeZone = (time, zone) => {
  let format = "YYYY/MM/DD HH:mm:ss ZZ";
  return moment(time, format).tz(zone).format(format);
};

export const setTimeDate = (date, target) => {
  let setTime = {};
  setTime["hour"] = moment(date).get("hour");
  setTime["minute"] = moment(date).get("minute");
  setTime["second"] = 0;
  return moment(target).set(setTime);
};

export const setTimeZero = (date, hours, minutes, seconds) => {
  let setTime = {};
  if (hours) setTime["hour"] = 0;
  if (minutes) setTime["minute"] = 0;
  if (seconds) setTime["second"] = 0;
  setTime["millisecond"] = 0;

  return moment(date).set(setTime);
};

export const setTime = (date, hours, minutes, seconds) => {
  let setTime = {};
  if (hours) setTime["hour"] = hours;
  if (minutes) setTime["minute"] = minutes;
  if (seconds) setTime["second"] = seconds;
  setTime["millisecond"] = 0;

  return moment(new Date(date)).set(setTime);
};

export const getCurrentTimeStamp = (date) => {
  let tzoffset = new Date().getTimezoneOffset() * 60000;
  let photoDate = new Date(date);
  return new Date(photoDate.getTime() - tzoffset).toISOString();
};

export const getLeftDays = (date) => {
  let endAt = moment(format("dash", date));
  let today = moment().format("YYYY-MM-DD");

  let leftDays = endAt.diff(today, "days");

  return leftDays;
};

export const getLeftDaysAhead = (date) => {
  let endAt = moment(date);
  let today = moment().format("YYYY-MM-DD");
  let leftDays = today.diff(endAt, "days");

  return leftDays > 0 ? leftDays : 0;
};

export const getLeftDaysFrom = (from, until) => {
  let start = moment(from);
  let end = moment(until);
  let leftDays = end.diff(start, "days");

  return leftDays > 0 ? leftDays : 0;
};

export const getLeftDaysFrom2 = (from, until) => {
  let start = moment(from);
  let end = moment(until);
  let leftDays = end.diff(start, "days");

  return leftDays;
};

export const countDays = (date) => {
  let createdAt = moment(date);
  return moment().diff(createdAt, "day");
};

export const subtractDays = (date, days, unit) => {
  if (!unit) unit = "day";
  return new Date(moment(date).subtract(days, unit)).toISOString();
};
export const getTodayIsWeekend = (date) => {
  let flag =
    moment(date).format("YYYY-MM-DD") ===
      moment(date).day(0).format("YYYY-MM-DD") ||
    moment(date).format("YYYY-MM-DD") ===
      moment(date).day(6).format("YYYY-MM-DD");
  return flag;
};
export const getDateIsValid = (date) => {
  return moment(date).isValid();
};
export const isInXHours = (date, x) => {
  let hours = moment(date).diff(moment(), "hours");
  return hours < x;
};
