import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type UserState = {
  access_token: string;
  singleScroll: boolean;
  multiScroll: boolean;

  deviceRegistration: boolean;
  loading: boolean;
  contactDetails: Record<string, any>;
  notificationCount: number;
  refresh: boolean;
  alertState: boolean;
  userDetail: {role: string};
  dropdownData: any[];
  calendarDate: Record<string, any>;
  paymentConfigs: Record<string, any>;
  potfolioObject: Record<string, any>;
  skipIntro: boolean;
  gotoPayment: boolean;
};

const initialState: UserState = {
  access_token: '',
  singleScroll: false,
  multiScroll: false,

  deviceRegistration: false,
  loading: false,
  contactDetails: {},
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
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload;
    },
    setLoader: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setScrollSingle: (state, action: PayloadAction<boolean>) => {
      state.singleScroll = action.payload;
    },
    setScrollMulti: (state, action: PayloadAction<boolean>) => {
      state.multiScroll = action.payload;
    },
    setDeviceRegistered: (state, action: PayloadAction<boolean>) => {
      state.deviceRegistration = action.payload;
    },
    setContactDetails: (state, action: PayloadAction<any>) => {
      state.contactDetails = action.payload;
    },
    setNotificationCounts: (state, action: PayloadAction<number>) => {
      state.notificationCount = action.payload;
    },
    setRefresh: (state, action: PayloadAction<boolean>) => {
      state.refresh = action.payload;
    },
    setAlertState: (state, action: PayloadAction<boolean>) => {
      state.alertState = action.payload;
    },
    setUserDetail: (state, action: PayloadAction<any>) => {
      state.userDetail = action.payload;
    },
    setDropDownData: (state, action: PayloadAction<any[]>) => {
      state.dropdownData = action.payload;
    },
    setCalendarDate: (state, action: PayloadAction<any>) => {
      state.calendarDate = action.payload;
    },
    setPaymentConfigs: (state, action: PayloadAction<any>) => {
      state.paymentConfigs = action.payload;
    },
    setPortfolioMatch: (state, action: PayloadAction<any>) => {
      state.potfolioObject = action.payload;
    },
    setSkipIntro: (state, action: PayloadAction<boolean>) => {
      state.skipIntro = action.payload;
    },
    setGotoPayment: (state, action: PayloadAction<boolean>) => {
      state.gotoPayment = action.payload;
    },
  },
});

export const {
  setToken,
  setLoader,
  setScrollSingle,
  setScrollMulti,
  setDeviceRegistered,
  setContactDetails,
  setNotificationCounts,
  setRefresh,
  setAlertState,
  setUserDetail,
  setDropDownData,
  setCalendarDate,
  setPaymentConfigs,
  setPortfolioMatch,
  setSkipIntro,
  setGotoPayment,
} = userSlice.actions;

export default userSlice.reducer;
