// @flow
const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const CANCEL = 'CANCEL';
const FAILURE = 'FAILURE';

function createRequestTypes(base) {
  const res = {};
  [REQUEST, SUCCESS, FAILURE, CANCEL].forEach(type => {
    res[type] = `${base}_${type}`;
  });
  return res;
}

export const PROFILE: any = createRequestTypes('PROFILE');
export const LOADER = 'LOADER';
export const TOKEN = createRequestTypes('TOKEN');
export const ONBOARDINGCOMPLETE = 'ONBOARDINGCOMPLETE';
export const DEVICEREGISTERED = 'DEVICEREGISTERED';
export const CONTACTDETAILS = 'CONTACTDETAILS';
export const WALK_THROUGH_IMAGES = 'WALK_THROUGH_IMAGES';
export const NOTIFICATION_COUNT = 'NOTIFICATION_COUNT';
export const REFRESH = 'REFRESH';
export const ALERT_STATE = 'ALERT_STATE';
export const USER_DETAIL = 'USER_DETAIL';
export const CALENDAR_DATE = 'CALENDAR_DATE';
export const DROPDOWN_DATA = 'DROPDOWN_DATA';
export const SINGLELEAD_SCROLL = 'SINGLELEAD_SCROLL';
export const MULTILEAD_SCROLL = 'MULTILEAD_SCROLL'
export const PAYMENT_CONFIGS = 'PAYMENT_CONFIGS';
export const MATCHID_PORTFOLIO = 'MATCHID_PORTFOLIO';
export const SKIP_INTRO = 'SKIP_INTRO';
export const GOTO_PAYMENT = 'GOTO_PAYMENT';





