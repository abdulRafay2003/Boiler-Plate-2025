import Immutable from 'seamless-immutable';
import _ from 'lodash';
import {
  CONTACTDETAILS,
  DEVICEREGISTERED,
  ONBOARDINGCOMPLETE,
  TOKEN,
  WALK_THROUGH_IMAGES,
  NOTIFICATION_COUNT,
  REFRESH,
  ALERT_STATE,
  USER_DETAIL,
  LOADER,
  CALENDAR_DATE,
  DROPDOWN_DATA,
  SINGLELEAD_SCROLL,
  MULTILEAD_SCROLL,
  PAYMENT_CONFIGS,
  SKIP_INTRO,
  MATCHID_PORTFOLIO,
  GOTO_PAYMENT,
} from '@/redux/actions/ActionTypes';

const initialState = Immutable({
  access_token: '',
  singleScroll: false,
  multiScroll: false,
  onBordingComplete: false,
  deviceRegistration: false,
  loading: false,
  contactDetails: {},
  walkThroughImages: [],
  notificationCount: 0,
  refresh: false,
  alertState: false,
  userDetail: {role: 'guest'},
  dropdownData: [],
  calendarDate: {},
  paymentConfigs: {},
  potfolioObject: {},
  skipIntro: false,
  gotoPayment: false,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADER: {
      return Immutable.merge(state, {
        loading: action.payload,
      });
    }
    case SKIP_INTRO: {
      return Immutable.merge(state, {
        skipIntro: action.payload,
      });
    }
    case TOKEN: {
      return Immutable.merge(state, {
        access_token: action.payload,
      });
    }
    case MATCHID_PORTFOLIO: {
      return Immutable.merge(state, {
        potfolioObject: action.payload,
      });
    }
    case ONBOARDINGCOMPLETE: {
      return Immutable.merge(state, {
        onBordingComplete: action.payload,
      });
    }
    case DEVICEREGISTERED:
      return Immutable.merge(state, {
        deviceRegistration: action.payload,
      });
    case CONTACTDETAILS:
      return Immutable.merge(state, {
        contactDetails: action.payload,
      });
    case WALK_THROUGH_IMAGES: {
      return Immutable.merge(state, {
        walkThroughImages: action.payload,
      });
    }
    case DROPDOWN_DATA:
      return Immutable.merge(state, {
        dropdownData: action.payload,
      });
    case NOTIFICATION_COUNT:
      return Immutable.merge(state, {
        notificationCount: action.payload,
      });
    case REFRESH:
      return Immutable.merge(state, {
        refresh: action.payload,
      });
    case ALERT_STATE:
      return Immutable.merge(state, {
        alertState: action.payload,
      });
    case USER_DETAIL:
      return Immutable.merge(state, {
        userDetail: action.payload,
      });
    case CALENDAR_DATE:
      return Immutable.merge(state, {
        calendarDate: action.payload,
      });
    case SINGLELEAD_SCROLL:
      return Immutable.merge(state, {
        singleScroll: action.payload,
      });
    case MULTILEAD_SCROLL:
      return Immutable.merge(state, {
        multiScroll: action.payload,
      });
    case PAYMENT_CONFIGS:
      return Immutable.merge(state, {
        paymentConfigs: action.payload,
      });
    case GOTO_PAYMENT:
      return Immutable.merge(state, {
        gotoPayment: action.payload,
      });
    default:
      return state;
  }
};
