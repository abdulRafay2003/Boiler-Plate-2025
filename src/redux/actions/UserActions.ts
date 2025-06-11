import {
  LOADER,
  ALERT_STATE,
  CONTACTDETAILS,
  DEVICEREGISTERED,
  NOTIFICATION_COUNT,
  ONBOARDINGCOMPLETE,
  REFRESH,
  TOKEN,
  WALK_THROUGH_IMAGES,
  USER_DETAIL,
  CALENDAR_DATE,
  DROPDOWN_DATA,
  SINGLELEAD_SCROLL,
  MULTILEAD_SCROLL,
  MATCHID_PORTFOLIO,
  PAYMENT_CONFIGS,
  SKIP_INTRO,
  GOTO_PAYMENT
} from '@/redux/actions/ActionTypes';

export function setTokenRedux(payload) {
  return {
    payload,
    type: TOKEN,
  };
}
export function setSkipIntro(payload) {
  return {
    payload,
    type: SKIP_INTRO,
  };
}
export function setLoader(payload) {
  return {
    payload,
    type: LOADER,
  };
}

export function setPortfolioMatch(payload) {
  return {
    payload,
    type: MATCHID_PORTFOLIO,
  };
}

export function setScrollSingle(payload) {
  return {
    payload,
    type: SINGLELEAD_SCROLL,
  };
}

export function setScrollMulti(payload) {
  return {
    payload,
    type: MULTILEAD_SCROLL,
  };
}

export function setOnBoardingComplete(payload) {
  return {
    payload,
    type: ONBOARDINGCOMPLETE,
  };
}
export function setDeviceRegistered(payload) {
  return {
    payload,
    type: DEVICEREGISTERED,
  };
}
export function setContactDetails(payload) {
  return {
    payload,
    type: CONTACTDETAILS,
  };
}
export function setWalkThroughImages(payload) {
  return {
    payload,
    type: WALK_THROUGH_IMAGES,
  };
}
export function setNotificationCounts(payload) {
  return {
    payload,
    type: NOTIFICATION_COUNT,
  };
}
export function setRefresh(payload) {
  return {
    payload,
    type: REFRESH,
  };
}
export function setAlertState(payload) {
  return {
    payload,
    type: ALERT_STATE,
  };
}
export function setUserDetail(payload) {
  return {
    payload,
    type: USER_DETAIL,
  };
}
export function setDropDownData(payload) {
  return {
    payload,
    type: DROPDOWN_DATA,
  };
}
export function setCalendarDate(payload) {
  return {
    payload,
    type: CALENDAR_DATE,
  };
}
export function setPaymentConfigs(payload) {
  return {
    payload,
    type: PAYMENT_CONFIGS,
  };
}
export function setGotoPayment(payload) {
  return {
    payload,
    type: GOTO_PAYMENT,
  };
}