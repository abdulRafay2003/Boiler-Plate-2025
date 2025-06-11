import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Image,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
  BackHandler,
  ActivityIndicator,
  Platform,
} from 'react-native';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {Headers} from '@/components/header/headers';
import {DropDownButton} from '@/components/buttons/dropDownButton';
import {ScrollView} from 'react-native-gesture-handler';
import moment from 'moment';
import FilterCalendarBottomSheet from '@/components/calenderBottomSheet';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCalendarDate,
  setGotoPayment,
  setLoader,
  setUserDetail,
} from '@/redux/actions/UserActions';
import {
  buttonBackgroundColor,
  buttonHeight,
  buttonText,
  buttonWidth,
  fianacialpaymentRecieptLink,
  finalAmountFinancials,
  formatValue,
  invoiceLink,
  isDateOlderThanCurrentDate,
  sortDate,
} from '@/utils/business.helper';
import {PaymenntApprovalPopup} from '@/components/modal/paymentApprovalPending';
import FinancialListSkeleton from '@/components/skeletons/financialListSkeleton';
import FinancialScreenSkeleton from '@/components/skeletons/financialScreen';
import {
  FinancialsListingApi,
  PaymentIntent,
  PropertyDropDownApi,
  UnitByPropertyDropDownApi,
} from '@/services/apiMethods/financials';
import crashlytics from '@react-native-firebase/crashlytics';
import {AxiosError} from 'axios';
import {AlertPopupAuth} from '@/components/modal/alertPopupAuth';
import {log} from 'react-native-reanimated';
import {useIsFocused} from '@react-navigation/native';
import FinancialsListingItem from '@/components/financialListinItem';
let screenHeight = Math.round(Dimensions.get('window').height);
let screenWidth = Math.round(Dimensions.get('window').width);

export default function Financials(props) {
  const dispatch = useDispatch();
  const focus = useIsFocused();
  const dates = useSelector(state => state?.user?.calendarDate);
  const paymentConfigs = useSelector(state => state?.user?.paymentConfigs);
  const backFromPayment = useSelector(state => state?.user?.gotoPayment);
  const [bSOpen, setBSOpen] = useState(false);
  const [propertyDropDown, setPropertyDropdown] = useState(false);
  const [unitDropDown, setUnitDropdown] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState(
    props?.route?.params?.status,
  );
  const [statusDropDown, setStatusDropdown] = useState(false);
  const [propertyLable, setPropertyLabel] = useState('');
  const [propertyId, setPropertyId] = useState(0);
  const [unitLable, setUnitLabel] = useState('');
  const [unitId, setUnitId] = useState('');
  const [statusLable, setStatusLabel] = useState('');
  const [payNow, setPayNow] = useState(false);
  const [paymentValue, setPaymentValue] = useState('');
  const [url, setUrl] = useState('');
  const [buttonLoader, setButtonLoader] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [length, setLength] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sU, setSU] = useState(false);
  const [propertyArray, setPropertyArray] = useState([]);
  const [unitArray, setUnitArray] = useState([]);
  const [clickedItem, setClickedItem] = useState(0);
  const [statusArray, setStatusArray] = useState([
    {
      id: 1,
      title: 'Paid',
    },
    {
      id: 2,
      title: 'UnPaid',
    },
    // {
    //   id: 3,
    //   title: 'Closed',
    // },
    // {
    //   id: 4,
    //   title: 'Pending',
    // },
    // {
    //   id: 5,
    //   title: 'Rejected',
    // },
  ]);
  const [paymentLogs, setpaymentLogs] = useState([]);
  const [filterDropDown, setFilterDropDown] = useState(false);
  const [filterDropDownArray, setFilterDropDownArray] = useState([
    {
      id: 1,
      title: 'Last Two Months',
    },
    {
      id: 1,
      title: 'Last Six Months',
    },
    {
      id: 1,
      title: 'Select Custom Date',
    },
  ]);
  const [startDate, setStartDate] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 2,
      new Date().getDate(),
    ),
  );
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [endDate, setEndDate] = useState(new Date());
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [error, setError] = useState(false);
  const [apiCrashResponse, setApiCrashResponse] = useState(false);
  const [apiCrash, setApiCrash] = useState(false);
  const [confirmationText, setConfirmationText] = useState([]);
  //========================== Start Date =========================================
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const dayRef = useRef(null);
  const [days, setDays] = useState([]);
  const [months, setMonths] = useState([
    {key: 0, value: 'Jan'},
    {key: 1, value: 'Feb'},
    {key: 2, value: 'Mar'},
    {key: 3, value: 'Apr'},
    {key: 4, value: 'May'},
    {key: 5, value: 'Jun'},
    {key: 6, value: 'Jul'},
    {key: 7, value: 'Aug'},
    {key: 8, value: 'Sep'},
    {key: 9, value: 'Oct'},
    {key: 10, value: 'Nov'},
    {key: 11, value: 'Dec'},
  ]);
  const [years, setYears] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedDayDate, setSelectedDayDate] = useState(0);
  const [selectedDayDateEnd, setSelectedDayDateEnd] = useState(0);
  const [isLastItem, setSelectedDayisLastItem] = useState(false);
  const [selectedYear, setselectedYear] = useState(0);
  const [selectedMonth, setselectedMonth] = useState(0);
  //========================== Start Date =========================================

  //========================== End Date =========================================
  const monthRefEndDate = useRef(null);
  const yearRefEndDate = useRef(null);
  const dayRefEndDate = useRef(null);
  const [daysEndDate, setDaysEndDate] = useState([]);
  const [monthsEndDate, setMonthsEndDate] = useState([
    {key: 0, value: 'Jan'},
    {key: 1, value: 'Feb'},
    {key: 2, value: 'Mar'},
    {key: 3, value: 'Apr'},
    {key: 4, value: 'May'},
    {key: 5, value: 'Jun'},
    {key: 6, value: 'Jul'},
    {key: 7, value: 'Aug'},
    {key: 8, value: 'Sep'},
    {key: 9, value: 'Oct'},
    {key: 10, value: 'Nov'},
    {key: 11, value: 'Dec'},
  ]);
  const [yearsEndDate, setYearsEndDate] = useState([]);
  const [selectedDayEndDate, setSelectedDayEndDate] = useState(0);
  const [isLastItemEndDate, setSelectedDayisLastItemEndDate] = useState(false);
  const [selectedYearEndDate, setselectedYearEndDate] = useState(0);
  const [selectedMonthEndDate, setselectedMonthEndDate] = useState(0);
  //========================== End Date =========================================
  const snapPoints = useMemo(() => ['90%'], []);
  const calendarRef = useRef(null);
  useEffect(() => {}, [notificationStatus]);
  useEffect(() => {
    getProperties();
    let currentDate = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let currentDay = new Date().getDate();
    let yearsArray = generateYearsBetween(2000, currentDate);
    setYears(yearsArray);
    let yearsArrayEndDate = generateYearsBetweenEndDate(2000, currentDate);
    setYearsEndDate(yearsArrayEndDate);
    let currentYearIndex = yearsArray?.findIndex(item => {
      return item === currentDate;
    });
    let currentMonthIndex = months?.findIndex(item => {
      return item?.key === currentMonth;
    });
    let currentYearIndexEndDate = yearsArrayEndDate?.findIndex(item => {
      return item === currentDate;
    });
    let currentMonthIndexEndDate = monthsEndDate?.findIndex(item => {
      return item?.key === currentMonth;
    });
    setselectedYear(currentYearIndex);
    setselectedMonth(currentMonthIndex);
    getAllDaysInMonth(currentMonthIndex, currentYearIndex);
    setSelectedDay(currentDay - 1);
    setSelectedDayDate(currentDay - 1);

    setselectedYearEndDate(currentYearIndexEndDate);
    setselectedMonthEndDate(currentMonthIndexEndDate);
    getAllDaysInMonthEndDate(currentMonthIndexEndDate, currentYearIndexEndDate);
    setSelectedDayEndDate(currentDay - 1);
    setSelectedDayDateEnd(currentDay - 1);
    dispatch(
      setCalendarDate({
        startDay: currentDay - 1,
        startMonth: currentMonthIndex,
        startYear: currentYearIndex,
        endDay: currentDay - 1,
        endMonth: currentMonthIndexEndDate,
        endYear: currentYearIndexEndDate,
      }),
    );
    setSelectedDateRange('Last Two Months');
    setPropertyLabel(propertyArray[0]?.title);
    setUnitLabel(unitArray[0]?.title);
    setStatusLabel(statusArray[1]?.title);

    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);
  useEffect(() => {
    setNotificationStatus(props?.route?.params?.status);
    if (backFromPayment == true) {
      dispatch(setGotoPayment(false));
      setListLoading(true);
      getFinancialListing(
        propertyId,
        unitId,
        1,
        statusLable == 'Paid' ? 'paid' : 'unpaid',
        moment(startDate).format('YYYY-MM-DD'),
        moment(endDate).format('YYYY-MM-DD'),
        false,
      );
    } else {
      if (
        notificationStatus != undefined &&
        props?.route?.params?.status != undefined
      ) {
        setNotificationStatus(props?.route?.params?.status);
        getProperties();
      }
    }
  }, [focus]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      // BackHandler.removeEventListener(
  //      'hardwareBackPress',
 //       handleBackButtonClick,
 //     );
    };
  }, [payNow]);
  const handleBackButtonClick = () => {
    if (payNow == true) {
      setPayNow(false);
    }

    return true;
  };
  //========================== Start Date =========================================
  useEffect(() => {
    if (days?.length - 1 == selectedDay) {
      setSelectedDayisLastItem(true);
    } else {
      setSelectedDayisLastItem(false);
    }
  }, [selectedDay]);
  useEffect(() => {
    const nextMonthIndex = (selectedMonth + 1) % months.length;
    const allDatesInOctober = getAllDaysInMonth(
      months[nextMonthIndex].key,
      years[selectedYear],
    );

    setDays(
      allDatesInOctober.map(x =>
        x.toLocaleDateString([], {
          day: 'numeric',
          weekday: 'short',
        }),
      ),
    );

    let days = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    if (days < selectedDay + 1) {
      let count = days - (selectedDay + 1) < 0 && days - 1;
      dayRef?.current?.snapToItem(count);
    }
  }, [selectedMonth]);
  useEffect(() => {
    const nextMonthIndex = (selectedMonth + 1) % months.length;
    const allDatesInOctober = getAllDaysInMonth(
      months[nextMonthIndex].key,
      years[selectedYear],
    );
    setDays(
      allDatesInOctober.map(x =>
        x.toLocaleDateString([], {
          day: 'numeric',
          weekday: 'short',
        }),
      ),
    );
    let days = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    if (days < selectedDay + 1) {
      let count = days - (selectedDay + 1) < 0 && days - 1;
      dayRef?.current?.snapToItem(count);
    }
  }, [selectedYear]);
  useEffect(() => {}, [isLastItem]);
  //========================== Start Date =========================================

  //========================== End Date =========================================
  useEffect(() => {
    if (daysEndDate?.length - 1 == selectedDayEndDate) {
      setSelectedDayisLastItemEndDate(true);
    } else {
      setSelectedDayisLastItemEndDate(false);
    }
  }, [selectedDayEndDate]);
  useEffect(() => {
    const nextMonthIndex = (selectedMonthEndDate + 1) % monthsEndDate.length;
    const allDatesInOctober = getAllDaysInMonth(
      monthsEndDate[nextMonthIndex].key,
      yearsEndDate[selectedYearEndDate],
    );
    setDaysEndDate(
      allDatesInOctober.map(x =>
        x.toLocaleDateString([], {
          day: 'numeric',
          weekday: 'short',
        }),
      ),
    );

    let days = new Date(
      selectedYearEndDate,
      selectedMonthEndDate + 1,
      0,
    ).getDate();
    if (days < selectedDayEndDate + 1) {
      let count = days - (selectedDayEndDate + 1) < 0 && days - 1;
      dayRefEndDate?.current?.snapToItem(count);
    }
  }, [selectedMonthEndDate]);
  useEffect(() => {
    const nextMonthIndex = (selectedMonthEndDate + 1) % monthsEndDate.length;
    const allDatesInOctober = getAllDaysInMonth(
      monthsEndDate[nextMonthIndex].key,
      yearsEndDate[selectedYearEndDate],
    );
    setDaysEndDate(
      allDatesInOctober.map(x =>
        x.toLocaleDateString([], {
          day: 'numeric',
          weekday: 'short',
        }),
      ),
    );
    let days = new Date(
      selectedYearEndDate,
      selectedMonthEndDate + 1,
      0,
    ).getDate();
    if (days < selectedDayEndDate + 1) {
      let count = days - (selectedDayEndDate + 1) < 0 && days - 1;
      dayRefEndDate?.current?.snapToItem(count);
    }
  }, [selectedYearEndDate]);
  useEffect(() => {}, [isLastItemEndDate]);
  //========================== End Date =========================================

  const openBottomSheet = () => {
    setBSOpen(true);
    if (calendarRef?.current) {
      setError(false);
      calendarRef?.current.expand();

      setSkeletonLoading(false);
      setTimeout(() => {
        if (yearRef != null) {
          yearRef?.current?.snapToItem(dates?.startYear);
        }
        if (monthRef != null) {
          monthRef?.current?.snapToItem(dates?.startMonth);
        }
        if (dayRef != null) {
          dayRef?.current?.snapToItem(dates?.startDay);
        }
        if (yearRefEndDate != null) {
          yearRefEndDate?.current?.snapToItem(dates?.endYear);
        }
        if (monthRefEndDate != null) {
          monthRefEndDate?.current?.snapToItem(dates?.endMonth);
        }
        if (dayRefEndDate != null) {
          dayRefEndDate?.current?.snapToItem(dates?.endDay);
        }
      }, 1500);
    }
  };
  //========================== Start Date =========================================
  const onClickStartDay = item => {
    let dayIndex = days?.findIndex(itemx => {
      return itemx == item;
    });

    setSelectedDay(dayIndex);
    setTimeout(() => {
      if (dayRef != null) {
        dayRef?.current?.snapToItem(dayIndex);
      }
    }, 1000);
  };
  const onClickStartMonth = item => {
    setselectedMonth(item?.key);
    setTimeout(() => {
      if (monthRef != null) {
        monthRef?.current?.snapToItem(item?.key);
      }
    }, 1000);
  };
  const onClickStartYear = item => {
    let yearIndex = years?.findIndex(itemx => {
      return itemx == item;
    });
    setselectedYear(yearIndex);

    setTimeout(() => {
      if (yearRef != null) {
        yearRef?.current?.snapToItem(yearIndex);
      }
    }, 1000);
  };
  const getAllDaysInMonth = (month, year) =>
    Array.from(
      {length: new Date(year, month, 0).getDate()}, // get next month, zeroth's (previous) day
      (_, i) => new Date(year, month - 1, i + 1), // get current month (0 based index)
    );
  const generateYearsBetween = (startYear = 2000, endYear) => {
    const endDate = endYear || new Date().getFullYear();
    let years = [];

    for (var i = startYear; i <= endDate; i++) {
      years.push(startYear);
      startYear++;
    }
    return years;
  };
  const renderCarouselYears = ({item, index}, parallaxProps) => {
    return (
      <TouchableOpacity
        style={{
          alignItems: 'center',
          alignSelf: 'center',
          width: 70,
          marginTop: 10,
          height: 50,
          borderRadius: 10,
          marginHorizontal: 10,
        }}
        activeOpacity={1}
        onPress={() => {
          onClickStartYear(item);
        }}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 24,
            fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
            textAlign: 'center',
            color: theme?.black,
          }}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderCarouselMonth = ({item, index}, parallaxProps) => {
    return (
      <TouchableOpacity
        style={{
          alignItems: 'center',
          backgroundColor: selectedMonth + 3 == index ? '#000000' : 'white',
          alignSelf: 'center',
          width: 70,
          marginTop: 3,
          height: 35,
          borderRadius: 10,
        }}
        activeOpacity={1}
        onPress={() => {
          onClickStartMonth(item);
        }}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 18,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            textAlign: 'center',
            top: 5,
            color: selectedMonth + 3 == index ? theme.white : theme.black,
          }}>
          {item?.value}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderCarouselDays = ({item, index}, parallaxProps) => {
    if (item.split(' ')[1] != 32) {
      return (
        <TouchableOpacity
          style={{
            alignItems: 'center',
            backgroundColor: selectedDay + 3 == index ? '#42434433' : 'white',
            alignSelf: 'center',
            width: 70,
            height: 70,
            borderRadius: 10,
          }}
          activeOpacity={1}
          onPress={() => {
            onClickStartDay(item);
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              textAlign: 'center',
              textAlignVertical: 'center',
              top: 3,
              color: theme?.black,
            }}>
            {item.split(' ')[0]}
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 20,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              textAlign: 'center',
              textAlignVertical: 'center',
              top: 3,
              color: theme?.black,
            }}>
            {item.split(' ')[1]}
          </Text>
        </TouchableOpacity>
      );
    }
  };
  //========================== Start Date =========================================

  //========================== End Date =========================================
  const onClickEndtDay = item => {
    let dayIndex = daysEndDate?.findIndex(itemx => {
      return itemx == item;
    });

    setSelectedDayEndDate(dayIndex);
    setTimeout(() => {
      if (dayRefEndDate != null) {
        dayRefEndDate?.current?.snapToItem(dayIndex);
      }
    }, 1000);
  };
  const onClickEndtMonth = item => {
    setselectedMonthEndDate(item?.key);
    setTimeout(() => {
      if (monthRefEndDate != null) {
        monthRefEndDate?.current?.snapToItem(item?.key);
      }
    }, 1000);
  };
  const onClickEndtYear = item => {
    let yearIndex = years?.findIndex(itemx => {
      return itemx == item;
    });
    setselectedYearEndDate(yearIndex);

    setTimeout(() => {
      if (yearRefEndDate != null) {
        yearRefEndDate?.current?.snapToItem(yearIndex);
      }
    }, 1000);
  };
  const getAllDaysInMonthEndDate = (month, year) =>
    Array.from(
      {length: new Date(year, month, 0).getDate()}, // get next month, zeroth's (previous) day
      (_, i) => new Date(year, month - 1, i + 1), // get current month (0 based index)
    );
  const generateYearsBetweenEndDate = (startYear = 2000, endYear) => {
    const endDate = endYear || new Date().getFullYear();
    let years = [];

    for (var i = startYear; i <= endDate; i++) {
      years.push(startYear);
      startYear++;
    }
    return years;
  };
  const renderCarouselYearsEndDate = ({item, index}, parallaxProps) => {
    return (
      <TouchableOpacity
        style={{
          alignItems: 'center',
          alignSelf: 'center',
          width: 70,
          marginTop: 10,
          height: 50,
          borderRadius: 10,
        }}
        activeOpacity={1}
        onPress={() => {
          onClickEndtYear(item);
        }}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 24,
            fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
            textAlign: 'center',
            color: theme?.black,
          }}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderCarouselMonthEndDate = ({item, index}, parallaxProps) => {
    return (
      <TouchableOpacity
        style={{
          alignItems: 'center',
          backgroundColor:
            selectedMonthEndDate + 3 == index ? '#000000' : 'white',
          alignSelf: 'center',
          width: 70,
          marginTop: 3,
          height: 35,
          borderRadius: 10,
        }}
        activeOpacity={1}
        onPress={() => {
          onClickEndtMonth(item);
        }}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 18,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            textAlign: 'center',
            top: 5,
            color:
              selectedMonthEndDate + 3 == index ? theme.white : theme.black,
          }}>
          {item?.value}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderCarouselDaysEndDate = ({item, index}, parallaxProps) => {
    if (item.split(' ')[1] != 32) {
      return (
        <TouchableOpacity
          style={{
            // justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor:
              selectedDayEndDate + 3 == index ? '#42434433' : 'white',
            alignSelf: 'center',
            width: 70,
            height: 70,
            borderRadius: 10,
          }}
          activeOpacity={1}
          onPress={() => {
            onClickEndtDay(item);
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              textAlign: 'center',
              textAlignVertical: 'center',
              // justifyContent: 'center',
              top: 3,
              color: theme?.black,
            }}>
            {item.split(' ')[0]}
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 20,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              textAlign: 'center',
              textAlignVertical: 'center',
              // justifyContent: 'center',
              top: 3,
              color: theme?.black,
            }}>
            {item.split(' ')[1]}
          </Text>
        </TouchableOpacity>
      );
    }
  };
  //========================== End Date =========================================
  const compareDates = (startDateStr, endDateStr) => {
    const startDate = moment(startDateStr).format('YYYY-MM-DD');
    const endDate = moment(endDateStr).format('YYYY-MM-DD');
    if (
      moment(startDate).isBefore(endDate) == true ||
      moment(startDate).isSame(endDate) == true
    ) {
      setListLoading(true);
      setError(false);
      setSelectedDateRange(
        moment(startDateStr).format('DD-MM-YYYY') +
          ' to ' +
          moment(endDateStr).format('DD-MM-YYYY'),
      );
      dispatch(
        setCalendarDate({
          startDay: new Date(startDate).getDate() - 1,
          startMonth: new Date(startDate).getMonth(),
          startYear: new Date(startDate).getFullYear(),
          endDay: new Date(endDate).getDate() - 1,
          endMonth: new Date(endDate).getMonth(),
          endYear: new Date(endDate).getFullYear(),
        }),
      );
      getFinancialListing(
        propertyId,
        unitId,
        1,
        statusLable == 'Paid'
          ? 'paid'
          : // : statusLable == 'Closed'
            // ? 'closed'
            // : statusLable == 'Pending'
            // ? 'pending'
            // : statusLable == 'Rejected'
            // ? 'rejected'
            'unpaid',
        moment(startDate).format('YYYY-MM-DD'),
        moment(endDate).format('YYYY-MM-DD'),
        false,
      );
      calendarRef?.current.close();
      setTimeout(() => {
        setListLoading(false);
      }, 1000);
    } else {
      setError(true);
    }
  };
  const renderPaymentData = ({index, item}) => {
    return (
      <FinancialsListingItem
        item={item}
        viewReciept={() => {
          props?.navigation?.navigate('Reciept', {
            paymentRecieptUrl: item?.paymentRecieptUrl,
            name: item?.transactionId,
          });
        }}
        viewInvoice={() => {
          props?.navigation?.navigate('Invoice', {
            invoiceUrl: item?.invoiceUrl,
            name: item?.transactionId,
          });
        }}
        clickedItem={clickedItem}
        onClickedItem={() => {
          setClickedItem(item?.id);
          getUrl(item);
        }}
        from={'Financials'}
      />
      // <View
      //   style={{
      //     minHeight: 140,
      //     justifyContent: 'space-between',
      //     alignItems: 'flex-start',
      //     backgroundColor: theme?.paymentPlanGrey,
      //     marginTop: 10,
      //     padding: 10,
      //     borderRadius: 10,
      //     borderWidth: StyleSheet?.hairlineWidth,
      //     borderColor: theme?.greyText,
      //   }}>
      //   <View
      //     style={{
      //       width: '100%',
      //       flexDirection: 'row',
      //       justifyContent: 'space-between',
      //       alignItems: 'center',
      //     }}>
      //     <Text
      //       allowFontScaling={false}
      //       style={{
      //         fontSize: 16,
      //         fontFamily: FONT_FAMILY?.IBMPlexMedium,
      //         color: theme?.black,
      //         width: '65%',
      //       }}>
      //       {item?.transactionId}
      //     </Text>
      //     <Text
      //       allowFontScaling={false}
      //       style={{
      //         fontSize: 16,
      //         fontFamily: FONT_FAMILY?.IBMPlexMedium,
      //         color: theme?.black,
      //       }}>
      //       {`${item?.currency} ${formatValue(item?.foreignamount)}`}
      //     </Text>
      //   </View>
      //   <View
      //     style={{
      //       width: '100%',
      //       flexDirection: 'row',
      //       justifyContent: 'space-between',
      //       alignItems: 'center',
      //     }}>
      //     <Text
      //       allowFontScaling={false}
      //       style={{
      //         fontSize: 14,
      //         fontFamily: FONT_FAMILY?.IBMPlexMedium,
      //         color: theme?.textGrey,
      //         width: '50%',
      //       }}>
      //       {item?.invoiceType}
      //     </Text>
      //     <Text
      //       allowFontScaling={false}
      //       style={{
      //         fontSize: 14,
      //         fontFamily: FONT_FAMILY?.IBMPlexRegular,
      //         color:
      //           isDateOlderThanCurrentDate(
      //             item?.invoiceStatus,
      //             item?.dueDate,
      //           ) == 'Less than a day' &&
      //           isDateOlderThanCurrentDate(
      //             item?.invoiceStatus,
      //             item?.dueDate,
      //           ) == ''
      //             ? theme?.lightGreen
      //             : theme?.brightRed,
      //       }}>
      //       {item?.invoiceStatus == 'Invoice : Open'
      //         ? isDateOlderThanCurrentDate(item?.invoiceStatus, item?.dueDate)
      //         : isDateOlderThanCurrentDate(item?.invoiceStatus, new Date())}
      //     </Text>
      //   </View>
      //   <View
      //     style={{
      //       width: '100%',
      //       flexDirection: 'row',
      //       justifyContent: 'space-between',
      //       alignItems: 'center',
      //     }}>
      //     <View style={{}}>
      //       {item?.createdAt != null && (
      //         <Text
      //           allowFontScaling={false}
      //           style={{
      //             fontSize: 14,
      //             fontFamily: FONT_FAMILY?.IBMPlexMedium,
      //             color: theme?.textGrey,
      //           }}>
      //           {`Invoice Date: ${moment(item?.createdAt).format(
      //             'DD MMM YYYY',
      //           )}`}
      //         </Text>
      //       )}
      //       {item?.dueDate != null && (
      //         <Text
      //           allowFontScaling={false}
      //           style={{
      //             fontSize: 14,
      //             fontFamily: FONT_FAMILY?.IBMPlexMedium,
      //             color: theme?.textGrey,
      //           }}>
      //           {`Due Date: ${moment(item?.dueDate).format('DD MMM YYYY')}`}
      //         </Text>
      //       )}
      //       {item?.paymentDate != null && (
      //         <Text
      //           allowFontScaling={false}
      //           style={{
      //             fontSize: 14,
      //             fontFamily: FONT_FAMILY?.IBMPlexMedium,
      //             color: theme?.textGrey,
      //           }}>
      //           {`Transaction Date: ${moment(item?.paymentDate).format(
      //             'DD MMM YYYY',
      //           )}`}
      //         </Text>
      //       )}
      //     </View>
      //     {fianacialpaymentRecieptLink(
      //       item?.paymentRecieptUrl,
      //       item?.invoiceStatus,
      //     ) == true ? (
      //       <TouchableOpacity
      //         activeOpacity={0.9}
      //         style={{height: 30, justifyContent: 'center'}}
      //         onPress={() => {
      //           props?.navigation?.navigate('Reciept', {
      //             paymentRecieptUrl: item?.paymentRecieptUrl,
      //             name: item?.transactionId,
      //           });
      //         }}>
      //         <Text
      //           allowFontScaling={false}
      //           style={{
      //             fontSize: 12,
      //             fontFamily: FONT_FAMILY?.IBMPlexRegular,
      //             color: theme?.black,
      //             textDecorationLine: 'underline',
      //           }}>
      //           View Reciept
      //         </Text>
      //       </TouchableOpacity>
      //     ) : (
      //       <View style={{height: 30, width: 70, justifyContent: 'center'}} />
      //     )}
      //   </View>
      //   <View
      //     style={{
      //       width: '100%',
      //       flexDirection: 'row',
      //       justifyContent: 'space-between',
      //       alignItems: 'center',
      //     }}>
      //     {invoiceLink(item?.invoiceUrl) == true ? (
      //       <TouchableOpacity
      //         activeOpacity={0.9}
      //         style={{height: 30, width: 70, justifyContent: 'center'}}
      //         onPress={() => {
      //           props?.navigation?.navigate('Invoice', {
      //             invoiceUrl: item?.invoiceUrl,
      //             name: item?.transactionId,
      //           });
      //         }}>
      //         <Text
      //           allowFontScaling={false}
      //           style={{
      //             fontSize: 12,
      //             fontFamily: FONT_FAMILY?.IBMPlexRegular,
      //             color: theme?.black,
      //             textDecorationLine: 'underline',
      //           }}>
      //           View Invoice
      //         </Text>
      //       </TouchableOpacity>
      //     ) : (
      //       <View style={{height: 30, width: 70, justifyContent: 'center'}} />
      //     )}
      //     {item?.invoiceStatus == 'Invoice : Open' ? (
      //       <TouchableOpacity
      //         style={{
      //           height: buttonHeight(item?.invoiceStatus),
      //           width: buttonWidth(item?.invoiceStatus),
      //           backgroundColor: buttonBackgroundColor(item?.invoiceStatus),
      //           borderRadius: 8,
      //           justifyContent: 'center',
      //           alignItems: 'center',
      //         }}
      //         activeOpacity={1}
      //         disabled={clickedItem > 0}
      //         onPress={() => {
      //           // console.log('jkbvhcgxfchvjk',item?.dueDate)
      //           setClickedItem(item?.id);
      //           getUrl(item);
      //         }}>
      //         {clickedItem == item?.id ? (
      //           <ActivityIndicator size={'small'} color={theme?.white} />
      //         ) : (
      //           <Text
      //             allowFontScaling={false}
      //             style={{
      //               fontSize: 12,
      //               fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
      //               color:
      //                 item?.invoiceStatus == 'Invoice : Open'
      //                   ? theme?.white
      //                   : theme?.white,
      //             }}>
      //             {buttonText(item?.invoiceStatus)}
      //           </Text>
      //         )}
      //       </TouchableOpacity>
      //     ) : (
      //       <TouchableOpacity
      //         style={{
      //           height: buttonHeight(item?.invoiceStatus),
      //           width: buttonWidth(item?.invoiceStatus),
      //           backgroundColor: buttonBackgroundColor(item?.invoiceStatus),
      //           borderRadius: 8,
      //           justifyContent: 'center',
      //           alignItems: 'center',
      //         }}
      //         activeOpacity={1}
      //         disabled={true}
      //         onPress={() => {
      //           console.log('dfghjkl', item);
      //           // let pay = finalAmount(item?.foreignamount);
      //           // setPaymentValue({...item, pay: pay});
      //           setClickedItem(item?.id);
      //           getUrl(item);
      //         }}>
      //         {clickedItem == item?.id ? (
      //           <ActivityIndicator size={'small'} color={theme?.white} />
      //         ) : (
      //           <Text
      //             allowFontScaling={false}
      //             style={{
      //               fontSize: 12,
      //               fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
      //               color:
      //                 item?.invoiceStatus == 'Invoice : Open'
      //                   ? theme?.white
      //                   : theme?.white,
      //             }}>
      //             {buttonText(item?.invoiceStatus)}
      //           </Text>
      //         )}
      //       </TouchableOpacity>
      //     )}
      //   </View>
      // </View>
    );
  };
  const getProperties = async () => {
    try {
      setLoading(true);
      const data = await PropertyDropDownApi();

      if (data?.rowData?.length > 0) {
        setPropertyArray(data?.rowData);
        if (props?.route?.params?.property != undefined) {
          let find = data?.rowData?.find(item => {
            return item?.id == props?.route?.params?.property;
          });
          if (find) {
            setPropertyLabel(find?.name);
            setPropertyId(find?.id);
            getUnits(find?.id);
          } else {
            setPropertyLabel(data?.rowData[0]?.name);
            setPropertyId(data?.rowData[0]?.id);
            getUnits(data?.rowData[0]?.id);
          }
        } else {
          setPropertyLabel(data?.rowData[0]?.name);
          setPropertyId(data?.rowData[0]?.id);
          getUnits(data?.rowData[0]?.id);
        }
      } else {
        setPropertyArray([]);
        setLoading(false);
      }
      setApiCrashResponse(false);
    } catch (err) {
      setLoading(false);
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatch(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 599
      ) {
        setApiCrashResponse(true);
      }
      crashlytics().log('Get Property Dropdown Api on Financials Screen');
      crashlytics().recordError(error);
    }
  };
  useEffect(() => {}, [statusLable]);
  const statusss = () => {
    if (props?.route?.params?.status == 'Invoice : Open') {
      setStatusLabel('UnPaid');
      return 'unpaid';
    } else if (props?.route?.params?.status == 'Invoice : Paid In Full') {
      setStatusLabel('Paid');
      return 'paid';
    }
    //  else if (props?.route?.params?.status == 'Invoice : Close') {
    //   setStatusLabel('Closed');
    //   return 'closed';
    // } else if (props?.route?.params?.status == 'Invoice : Pending Approval') {
    //   setStatusLabel('Pending');
    //   return 'pending';
    // } else if (props?.route?.params?.status == 'Invoice : Rejected') {
    //   setStatusLabel('Rejected');
    //   return 'rejected';
    // }
    else {
      return '';
    }
  };
  const getUnits = async id => {
    try {
      const data = await UnitByPropertyDropDownApi(id);

      if (data?.rowData?.length > 0) {
        setUnitArray(data?.rowData);
        if (props?.route?.params?.unit != undefined) {
          let find = data?.rowData?.find(item => {
            return item?.id == props?.route?.params?.unit;
          });
          if (find) {
            setUnitLabel(find?.unitCode);
            setUnitId(find?.id);
            if (notificationStatus != undefined) {
              getFinancialListing(
                id,
                find?.id,
                1,
                statusss(),
                moment(startDate).format('YYYY-MM-DD'),
                moment(endDate).format('YYYY-MM-DD'),
                true,
              );
            } else {
              getFinancialListing(
                id,
                find?.id,
                1,
                statusLable == 'Paid'
                  ? 'paid'
                  : // : statusLable == 'Closed'
                    // ? 'closed'
                    // : statusLable == 'Pending'
                    // ? 'pending'
                    // : statusLable == 'Rejected'
                    // ? 'rejected'
                    'unpaid',
                moment(startDate).format('YYYY-MM-DD'),
                moment(endDate).format('YYYY-MM-DD'),
                false,
              );
            }
          } else {
            setUnitLabel(data?.rowData[0]?.unitCode);
            setUnitId(data?.rowData[0]?.id);
            getFinancialListing(
              id,
              data?.rowData[0]?.id,
              1,
              statusLable == 'Paid'
                ? 'paid'
                : // : statusLable == 'Closed'
                  // ? 'closed'
                  // : statusLable == 'Pending'
                  // ? 'pending'
                  // : statusLable == 'Rejected'
                  // ? 'rejected'
                  'unpaid',
              moment(startDate).format('YYYY-MM-DD'),
              moment(endDate).format('YYYY-MM-DD'),
              false,
            );
          }
        } else {
          setUnitLabel(data?.rowData[0]?.unitCode);
          setUnitId(data?.rowData[0]?.id);
          getFinancialListing(
            id,
            data?.rowData[0]?.id,
            1,
            statusLable == 'Paid'
              ? 'paid'
              : // : statusLable == 'Closed'
                // ? 'closed'
                // : statusLable == 'Pending'
                // ? 'pending'
                // : statusLable == 'Rejected'
                // ? 'rejected'
                'unpaid',
            moment(startDate).format('YYYY-MM-DD'),
            moment(endDate).format('YYYY-MM-DD'),
            false,
          );
        }
      } else {
        setPropertyArray([]);
        setUnitArray([]);
        setLoading(false);
      }
      setApiCrashResponse(false);
    } catch (err) {
      setLoading(false);
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatch(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 599
      ) {
        setApiCrashResponse(true);
      }
      crashlytics().log('Get Units Dropdown Api on Financials Screen');
      crashlytics().recordError(error);
    }
  };
  const getFinancialListing = async (
    propertyId,
    unitId,
    pageNum,
    status,
    startDate,
    endDate,
    routeFrom,
  ) => {
    try {
      let payload =
        // if (notificationStatus != undefined && routeFrom == true) {
        //   payload = `?id=${props?.route?.params?.itemId}&name=${propertyId}&unitId=${unitId}&pageNumber=${pageNum}&pageSize=10&status=${status}&start_date=${startDate}&end_date=${endDate}`;
        // } else {
        // payload =
        `?name=${propertyId}&unitId=${unitId}&pageNumber=${pageNum}&pageSize=10&status=${status}&start_date=${startDate}&end_date=${endDate}`;
      // }
      // console.log('getFinancialListingpayload', payload);
      const financialListData = await FinancialsListingApi(payload);
      if (financialListData?.rowData?.length > 0) {
        if (pageNum > 1) {
          let merge = [...paymentLogs, ...financialListData?.rowData];
          setpaymentLogs(merge);
          setListLoading(false);
          setLoading(false);
          setLength(financialListData?.count);
        } else {
          setpaymentLogs(financialListData?.rowData);
          setListLoading(false);
          setLoading(false);
          setLength(financialListData?.count);
        }
      } else {
        if (pageNum <= 1) {
          setpaymentLogs([]);
        }
        setLength(0);
        setListLoading(false);
        setLoading(false);
      }
      setApiCrashResponse(false);
    } catch (err) {
      setLoading(false);

      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatch(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 599
      ) {
        setApiCrashResponse(true);
      }
      crashlytics().log('Get Portofilio Listing Api on Dashboard');
      crashlytics().recordError(error);
    }
  };

  const getUrl = async paymentValue => {
    try {
      let payload = {
        orderParams: {
          order_id: paymentValue?.invoiceId,
          amount: paymentValue?.foreignamount,
          language: 'en',
        },
      };
      const paymentUrl = await PaymentIntent(payload);
      // console.log('sdfghjkl;', paymentUrl);
      setUrl(paymentUrl?.paylink);
      setPaymentValue({
        ...paymentValue,
        pay: paymentUrl?.breakdown?.totalAmt,
      });
      const getfinalAmount = finalAmountFinancials(
        paymentUrl?.breakdown,
        paymentValue?.foreignamount,
      );
      setConfirmationText(getfinalAmount?.text);
      setPayNow(getfinalAmount?.state);
      setApiCrash(false);
    } catch (err) {
      const error = err as AxiosError;
      setClickedItem(0);
      if (error?.response?.status == 401) {
        dispatch(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 599
      ) {
        setPayNow(false);
        setApiCrash(true);
      }
      dispatch(setLoader(false));
      crashlytics().log('Get Url Api Dashboard');
      crashlytics().recordError(error);
    }
  };
  const proceedToPay = async paymentValue => {
    try {
      if (url != '') {
        setPayNow(false);
        dispatch(setLoader(false));
        setClickedItem(0);
        props?.navigation?.navigate('PaymentScreen', {
          url: url,
          projectTitle: propertyLable,
          unitCode: unitLable,
        });
      } else {
        setClickedItem(paymentValue?.id);
        getUrl(paymentValue);
      }
    } catch (err) {
      dispatch(setLoader(false));
      setClickedItem(0);
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatch(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 599
      ) {
        setPayNow(false);
        setApiCrash(true);
      }
      crashlytics().log('ProceedToPay Api Dashboard');
      crashlytics().recordError(error);
    }
  };
  return (
    <>
      <View
        style={{
          backgroundColor: theme?.white,
          flex: 1,
        }}
        onStartShouldSetResponder={() => {
          setBSOpen(false);
          setPropertyDropdown(false);
          setUnitDropdown(false);
          setFilterDropDown(false);
          setStatusDropdown(false);
          if (calendarRef?.current) {
            calendarRef?.current?.close();
          }
        }}>
        <Headers
          bgStyles={{
            backgroundColor: theme?.logoColor,
            height: 100,
            width: screenWidth,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            justifyContent: 'center',
          }}
          internalViewStyles={{
            flexDirection: 'row',

            alignItems: 'flex-end',
            paddingHorizontal: 10,
            height: 80,
          }}
          backArrowViewStyles={{
            width: 47,
            height: 47,
            borderRadius: 47 / 2,
            backgroundColor: theme?.transparentWhite,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          notificationViewStyles={{
            width: 47,
            height: 47,
            borderRadius: 47 / 2,
            backgroundColor: theme?.transparentWhite,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          notificationIconStyles={{height: 17, width: 17}}
          backArrowStyles={{
            height: 17,
            width: 10,
            tintColor: theme?.white,
            transform: [{rotate: '180 deg'}],
          }}
          heading={'Financials'}
          headingViewStyles={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
          headingStyles={{
            color: theme?.white,
            fontSize: 20,
            fontFamily: FONT_FAMILY?.IBMPlexBold,
            marginLeft: 10,
          }}
          onBackArrowPress={() => {
            if (props?.route?.params?.from == 'More') {
              props.navigation.reset({
                index: 0,
                routes: [{name: 'Dashboard'}],
              });
            } else {
              props.navigation.goBack();
            }
          }}
          onNotificationPress={() => {
            props?.navigation?.navigate('Notification');
          }}
          notificationIcon={false}
        />
        {loading ? (
          <FinancialScreenSkeleton />
        ) : (
          <>
            {apiCrashResponse ? (
              <View
                style={{
                  backgroundColor: theme?.white,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: screenWidth,
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 16,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.textGrey,
                  }}>
                  Unable to load data at the moment.
                </Text>
              </View>
            ) : (
              <>
                {propertyArray?.length > 0 ? (
                  <View
                  // showsVerticalScrollIndicator={false}
                  // bounces={false}
                  // nestedScrollEnabled={true}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: screenWidth * 0.9,
                        alignSelf: 'center',
                        marginTop: 20,
                      }}>
                      <View style={{width: '45%'}}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            marginBottom: 10,
                            fontSize: 14,
                            fontFamily: FONT_FAMILY?.IBMPlexRegular,
                            color: theme?.black,
                          }}>
                          Property
                        </Text>
                        <DropDownButton
                          onPress={() => {
                            setFilterDropDown(false);
                            setPropertyDropdown(!propertyDropDown);
                            setStatusDropdown(false);
                            setUnitDropdown(false);
                          }}
                          showDropDown={propertyDropDown}
                          btnContainer={{
                            paddingLeft: 10,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: theme?.logoColor,
                            width: '100%',
                            height: 50,
                            justifyContent: 'center',
                          }}
                          label={propertyLable}
                          labelStyle={{
                            color: theme?.black,
                            fontFamily: FONT_FAMILY?.IBMPlexRegular,
                            fontSize: 14,
                          }}
                        />
                        {propertyDropDown && (
                          <View
                            style={{
                              position: 'absolute',
                              top: 70,
                              width: '100%',
                              maxHeight: 200,
                            }}>
                            <ScrollView
                              style={{
                                backgroundColor: theme?.white,
                                maxHeight: 120,
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                                width: '100%',
                                borderWidth: 0.7,
                                borderColor: theme?.inputBorder,
                              }}
                              showsVerticalScrollIndicator={false}
                              bounces={false}>
                              {propertyArray?.map(item => {
                                return (
                                  <TouchableOpacity
                                    onPress={() => {
                                      setNotificationStatus(undefined);
                                      setPropertyLabel(item?.name);
                                      setPropertyId(item?.id);
                                      getUnits(item?.id);
                                      setPropertyDropdown(false);
                                      setSelectedDateRange('');
                                      setStatusLabel('UnPaid');
                                      setSelectedDateRange('Last Two Months');
                                      setListLoading(true);
                                    }}
                                    activeOpacity={0.8}
                                    style={{
                                      paddingVertical: 10,
                                      justifyContent: 'center',
                                    }}>
                                    <Text
                                      allowFontScaling={false}
                                      style={{
                                        alignSelf: 'flex-start',
                                        marginLeft: 15,
                                        fontSize: 14,
                                        fontFamily: FONT_FAMILY?.IBMPlexMedium,
                                        color: theme?.black,
                                        marginBottom: 5,
                                      }}>
                                      {item?.name}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              })}
                            </ScrollView>
                          </View>
                        )}
                      </View>
                      <View style={{width: '45%'}}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            marginBottom: 10,
                            fontSize: 14,
                            fontFamily: FONT_FAMILY?.IBMPlexRegular,
                            color: theme?.black,
                          }}>
                          Select Unit
                        </Text>
                        <DropDownButton
                          onPress={() => {
                            setFilterDropDown(false);
                            setUnitDropdown(!unitDropDown);
                            setPropertyDropdown(false);
                            setStatusDropdown(false);
                          }}
                          showDropDown={unitDropDown}
                          btnContainer={{
                            paddingLeft: 10,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: theme?.logoColor,
                            width: '100%',
                            height: 50,
                            justifyContent: 'center',
                          }}
                          label={unitLable == '' ? 'Select Unit' : unitLable}
                          labelStyle={{
                            color: theme?.black,
                            fontFamily: FONT_FAMILY?.IBMPlexRegular,
                            fontSize: 14,
                          }}
                        />
                        {sU && (
                          <View
                            style={{
                              justifyContent: 'flex-end',
                              width: '100%',
                              height: '100%',
                              alignItems: 'flex-end',
                              paddingRight: 2,
                              position: 'absolute',
                              zIndex: -1,
                              marginTop: 15,
                            }}>
                            <Text
                              allowFontScaling={false}
                              style={{
                                color: theme.brightRed,
                                fontSize: 11,
                                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                              }}>
                              Required
                            </Text>
                          </View>
                        )}
                        {unitDropDown && (
                          <View
                            style={{
                              position: 'absolute',
                              top: 70,
                              width: '100%',
                              maxHeight: 120,
                            }}>
                            <ScrollView
                              style={{
                                backgroundColor: theme?.white,
                                maxHeight: 120,
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                                width: '100%',
                                borderWidth: 0.7,
                                borderColor: theme?.inputBorder,
                              }}
                              showsVerticalScrollIndicator={false}
                              bounces={false}>
                              {unitArray?.map(item => {
                                return (
                                  <TouchableOpacity
                                    onPress={() => {
                                      setNotificationStatus(undefined);
                                      setUnitLabel(item?.unitCode);
                                      setUnitId(item?.id);
                                      getFinancialListing(
                                        propertyId,
                                        item?.id,
                                        1,
                                        statusLable == 'Paid'
                                          ? 'paid'
                                          : // : statusLable == 'Closed'
                                            // ? 'closed'
                                            // : statusLable == 'Pending'
                                            // ? 'pending'
                                            // : statusLable == 'Rejected'
                                            // ? 'rejected'
                                            'unpaid',
                                        moment(startDate).format('YYYY-MM-DD'),
                                        moment(endDate).format('YYYY-MM-DD'),
                                        false,
                                      );
                                      setSU(false);
                                      setUnitDropdown(false);
                                      setListLoading(true);
                                    }}
                                    activeOpacity={0.8}
                                    style={{
                                      paddingVertical: 10,
                                      justifyContent: 'center',
                                    }}>
                                    <Text
                                      allowFontScaling={false}
                                      style={{
                                        alignSelf: 'flex-start',
                                        marginLeft: 15,
                                        fontSize: 14,
                                        fontFamily: FONT_FAMILY?.IBMPlexMedium,
                                        color: theme?.black,
                                        marginBottom: 5,
                                      }}>
                                      {item?.unitCode}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              })}
                            </ScrollView>
                          </View>
                        )}
                      </View>
                    </View>
                    <View
                      style={{
                        width: screenWidth * 0.9,
                        alignSelf: 'center',
                        marginTop: 20,
                        zIndex: -1,
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          alignSelf: 'flex-start',
                          fontSize: 18,
                          fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                          color: theme?.black,
                          flexWrap: 'wrap',
                        }}>
                        Statement of Account For
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={{
                          alignSelf: 'flex-start',
                          fontSize: 18,
                          fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                          color: theme?.black,
                          marginBottom: 5,
                          flexWrap: 'wrap',
                        }}>
                        {propertyLable} | Unit: {unitLable}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          width: screenWidth * 0.9,
                          alignSelf: 'center',
                          marginTop: 20,
                        }}>
                        <View style={{width: '70%', height: 50, zIndex: 1000}}>
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                              if (listLoading == false) {
                                setPropertyDropdown(false);
                                setStatusDropdown(false);
                                setUnitDropdown(false);
                                setFilterDropDown(!filterDropDown);
                              }
                            }}
                            style={{
                              width: '100%',
                              borderWidth: 1,
                              borderColor: theme?.logoColor,
                              borderRadius: 10,
                              justifyContent: 'center',
                              alignItems: 'flex-start',
                              paddingHorizontal: 10,
                              height: '100%',
                            }}>
                            <Text
                              allowFontScaling={false}
                              style={{
                                fontSize: 14,
                                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                                color: theme?.textGrey,
                              }}>
                              {selectedDateRange}
                            </Text>
                            <Image
                              style={{
                                transform: [{rotate: '0deg'}],
                                width: 20,
                                height: 20,
                                position: 'absolute',
                                right: 12,
                              }}
                              source={require('@/assets/images/icons/country_arrow.png')}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                          {filterDropDown && (
                            <View
                              style={{
                                position: 'absolute',
                                top: 40,
                                width: '100%',
                                maxHeight: 120,
                              }}>
                              <ScrollView
                                style={{
                                  backgroundColor: theme?.white,
                                  maxHeight: 120,
                                  borderBottomLeftRadius: 10,
                                  borderBottomRightRadius: 10,
                                  width: '100%',
                                  borderWidth: 0.7,
                                  borderColor: theme?.inputBorder,
                                }}
                                showsVerticalScrollIndicator={false}
                                bounces={false}>
                                {filterDropDownArray?.map(item => {
                                  return (
                                    <TouchableOpacity
                                      onPress={() => {
                                        setNotificationStatus(undefined);
                                        if (
                                          item?.title == 'Select Custom Date'
                                        ) {
                                          setSkeletonLoading(true);
                                          openBottomSheet();
                                          setFilterDropDown(false);
                                        } else {
                                          setSelectedDateRange(item?.title);
                                          setFilterDropDown(false);
                                          setListLoading(true);
                                          if (
                                            item?.title == 'Last Six Months'
                                          ) {
                                            setStartDate(
                                              new Date(
                                                new Date().getFullYear(),
                                                new Date().getMonth() - 6,
                                                new Date().getDate(),
                                              ),
                                            );
                                            getFinancialListing(
                                              propertyId,
                                              unitId,
                                              1,
                                              statusLable == 'Paid'
                                                ? 'paid'
                                                : // : statusLable == 'Closed'
                                                  // ? 'closed'
                                                  // : statusLable == 'Pending'
                                                  // ? 'pending'
                                                  // : statusLable == 'Rejected'
                                                  // ? 'rejected'
                                                  'unpaid',
                                              moment(
                                                new Date(
                                                  new Date().getFullYear(),
                                                  new Date().getMonth() - 6,
                                                  new Date().getDate(),
                                                ),
                                              ).format('YYYY-MM-DD'),
                                              moment(
                                                new Date(
                                                  new Date().getFullYear(),
                                                  new Date().getMonth(),
                                                  new Date().getDate(),
                                                ),
                                              ).format('YYYY-MM-DD'),
                                              false,
                                            );
                                          } else {
                                            setStartDate(
                                              new Date(
                                                new Date().getFullYear(),
                                                new Date().getMonth() - 2,
                                                new Date().getDate(),
                                              ),
                                            );
                                            getFinancialListing(
                                              propertyId,
                                              unitId,
                                              1,
                                              statusLable == 'Paid'
                                                ? 'paid'
                                                : // : statusLable == 'Closed'
                                                  // ? 'closed'
                                                  // : statusLable == 'Pending'
                                                  // ? 'pending'
                                                  // : statusLable == 'Rejected'
                                                  // ? 'rejected'
                                                  'unpaid',
                                              moment(
                                                new Date(
                                                  new Date().getFullYear(),
                                                  new Date().getMonth() - 2,
                                                  new Date().getDate(),
                                                ),
                                              ).format('YYYY-MM-DD'),
                                              moment(
                                                new Date(
                                                  new Date().getFullYear(),
                                                  new Date().getMonth(),
                                                  new Date().getDate(),
                                                ),
                                              ).format('YYYY-MM-DD'),
                                              false,
                                            );
                                          }
                                        }
                                      }}
                                      activeOpacity={0.8}
                                      style={{
                                        paddingVertical: 10,
                                        justifyContent: 'center',
                                      }}>
                                      <Text
                                        allowFontScaling={false}
                                        style={{
                                          alignSelf: 'flex-start',
                                          marginLeft: 15,
                                          fontSize: 14,
                                          fontFamily:
                                            FONT_FAMILY?.IBMPlexMedium,
                                          color: theme?.black,
                                          marginBottom: 5,
                                        }}>
                                        {item?.title}
                                      </Text>
                                    </TouchableOpacity>
                                  );
                                })}
                              </ScrollView>
                            </View>
                          )}
                        </View>
                        <View style={{width: '28%'}}>
                          <DropDownButton
                            onPress={() => {
                              if (listLoading == false) {
                                setFilterDropDown(false);
                                setStatusDropdown(!statusDropDown);
                                setPropertyDropdown(false);
                                setUnitDropdown(false);
                              }
                            }}
                            showDropDown={statusDropDown}
                            btnContainer={{
                              paddingLeft: 10,
                              borderRadius: 10,
                              borderWidth: 1,
                              borderColor: theme?.logoColor,
                              width: '100%',
                              height: 50,
                              justifyContent: 'center',
                            }}
                            label={
                              statusLable == '' ? 'Select Status' : statusLable
                            }
                            labelStyle={{
                              color:
                                statusLable == ''
                                  ? theme?.greyText
                                  : theme?.black,
                              fontFamily: FONT_FAMILY?.IBMPlexRegular,
                              fontSize: 14,
                            }}
                          />
                          {statusDropDown && (
                            <View
                              style={{
                                position: 'absolute',
                                top: 40,
                                width: '100%',
                                maxHeight: 220,
                              }}>
                              <ScrollView
                                style={{
                                  backgroundColor: theme?.white,
                                  maxHeight: 220,
                                  borderBottomLeftRadius: 10,
                                  borderBottomRightRadius: 10,
                                  width: '100%',
                                  borderWidth: 0.7,
                                  borderColor: theme?.inputBorder,
                                  zIndex: 9999,
                                }}
                                // showsVerticalScrollIndicator={true}
                                bounces={false}>
                                {statusArray?.map(item => {
                                  return (
                                    <TouchableOpacity
                                      onPress={() => {
                                        setNotificationStatus(undefined);
                                        setStatusLabel(item?.title);
                                        setStatusDropdown(false);
                                        setListLoading(true);
                                        getFinancialListing(
                                          propertyId,
                                          unitId,
                                          1,
                                          item?.title == 'Paid'
                                            ? 'paid'
                                            : // : item?.title == 'Closed'
                                              // ? 'closed'
                                              // : item?.title == 'Pending'
                                              // ? 'pending'
                                              // : item?.title == 'Rejected'
                                              // ? 'rejected'
                                              'unpaid',
                                          moment(startDate).format(
                                            'YYYY-MM-DD',
                                          ),
                                          moment(endDate).format('YYYY-MM-DD'),
                                          false,
                                        );
                                      }}
                                      activeOpacity={0.8}
                                      style={{
                                        paddingVertical: 10,
                                        justifyContent: 'center',
                                      }}>
                                      <Text
                                        allowFontScaling={false}
                                        style={{
                                          alignSelf: 'flex-start',
                                          marginLeft: 15,
                                          fontSize: 14,
                                          fontFamily:
                                            FONT_FAMILY?.IBMPlexMedium,
                                          color: theme?.black,
                                          marginBottom: 5,
                                        }}>
                                        {item?.title}
                                      </Text>
                                    </TouchableOpacity>
                                  );
                                })}
                              </ScrollView>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                    {listLoading ? (
                      <FinancialListSkeleton />
                    ) : (
                      <View style={{marginTop: 20, zIndex: -2}}>
                        <FlatList
                          bounces={false}
                          nestedScrollEnabled={true}
                          showsHorizontalScrollIndicator={false}
                          showsVerticalScrollIndicator={false}
                          style={{
                            width: screenWidth * 0.9,
                            alignSelf: 'center',
                            height: screenHeight * 0.52,
                            // flex: 1,
                            // height:screenHeight,
                            // backgroundColor: 'red',
                          }}
                          contentContainerStyle={{
                            paddingBottom: 60,
                            alignSelf: 'center',
                            width: '100%',
                          }}
                          data={paymentLogs}
                          renderItem={renderPaymentData}
                          onEndReachedThreshold={0}
                          onEndReached={() => {
                            if (paymentLogs?.length < length) {
                              getFinancialListing(
                                propertyId,
                                unitId,
                                pageNo + 1,
                                statusLable == 'Paid'
                                  ? 'paid'
                                  : // : statusLable == 'Closed'
                                    // ? 'closed'
                                    // : statusLable == 'Pending'
                                    // ? 'pending'
                                    // : statusLable == 'Rejected'
                                    // ? 'rejected'
                                    'unpaid',
                                moment(startDate).format('YYYY-MM-DD'),
                                moment(endDate).format('YYYY-MM-DD'),
                                false,
                              );
                              setPageNo(pageNo + 1);
                            }
                          }}
                          ListEmptyComponent={() => {
                            return (
                              <View
                                style={{alignItems: 'center', marginTop: 60}}>
                                <Text
                                  allowFontScaling={false}
                                  style={{
                                    fontSize: 16,
                                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                                    color: theme?.textGrey,
                                  }}
                                  //  onPress={()=>{
                                  //   props?.navigation?.navigate('PaymentScreen', {url: url});
                                  // }}
                                >
                                  No transactions at the moment.
                                </Text>
                              </View>
                            );
                          }}
                          ListFooterComponent={() => {
                            return (
                              <View
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                {paymentLogs?.length < length ? (
                                  <ActivityIndicator
                                    size={'large'}
                                    color={theme?.logoColor}
                                  />
                                ) : (
                                  <Text
                                    allowFontScaling={false}
                                    style={{
                                      fontSize: 14,
                                      fontFamily: FONT_FAMILY?.IBMPlexBold,
                                      color: theme?.textGrey,
                                    }}>
                                    {paymentLogs?.length > 0 ? '' : ''}
                                  </Text>
                                )}
                              </View>
                            );
                          }}
                        />
                      </View>
                    )}
                  </View>
                ) : (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                      width: screenWidth * 0.99,
                      alignSelf: 'center',
                    }}>
                    <Image
                      source={require('@/assets/images/icons/smallAlert_Icon.png')}
                      style={{
                        height: 50,
                        width: 50,
                        tintColor: theme?.textGrey,
                      }}
                      resizeMode="contain"
                    />
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 18,
                        fontFamily: FONT_FAMILY?.IBMPlexBold,
                        color: theme?.textGrey,
                      }}>
                      No Data Found
                    </Text>
                  </View>
                )}
              </>
            )}
          </>
        )}
      </View>

      {!loading && (
        <FilterCalendarBottomSheet
          snapPoints={snapPoints}
          sheetRef={calendarRef}
          monthRef={monthRef}
          months={months}
          renderCarouselMonth={renderCarouselMonth}
          selectedMonth={selectedMonth}
          onSnapToItemMonth={index => {
            setSelectedDayDate(days[selectedDay]?.split(' ')[1]);
            setselectedMonth(index);
          }}
          onSnapToItemDay={index => {
            setSelectedDay(index);
          }}
          dayRef={dayRef}
          days={days}
          renderCarouselDays={renderCarouselDays}
          yearRef={yearRef}
          years={years}
          renderCarouselYears={renderCarouselYears}
          onSnapToItemYear={index => {
            setselectedYear(index);
          }}
          monthRefEndDate={monthRefEndDate}
          monthsEndDate={monthsEndDate}
          renderCarouselMonthEndDate={renderCarouselMonthEndDate}
          selectedMonthEndDate={selectedMonthEndDate}
          onSnapToItemMonthEndDate={index => {
            setSelectedDayDateEnd(
              daysEndDate[selectedDayEndDate]?.split(' ')[1],
            );

            setselectedMonthEndDate(index);
          }}
          onSnapToItemDayEndDate={index => {
            setSelectedDayEndDate(index);
          }}
          dayRefEndDate={dayRefEndDate}
          daysEndDate={daysEndDate}
          renderCarouselDaysEndDate={renderCarouselDaysEndDate}
          yearRefEndDate={yearRefEndDate}
          yearsEndDate={yearsEndDate}
          renderCarouselYearsEndDate={renderCarouselYearsEndDate}
          onSnapToItemYearEndDate={index => {
            setselectedYearEndDate(index);
          }}
          onSubmit={() => {
            let startDate =
              selectedDay <= 9
                ? parseInt(`0${selectedDay + 1}`)
                : selectedDay + 1;
            let startMonth =
              selectedMonth + 1 <= 9
                ? parseInt(`0${selectedMonth + 1}`)
                : selectedMonth + 1;
            let endDate =
              selectedDayEndDate <= 9
                ? parseInt(`0${selectedDayEndDate + 1}`)
                : selectedDayEndDate + 1;
            let endMonth =
              selectedMonthEndDate + 1 <= 9
                ? parseInt(`0${selectedMonthEndDate + 1}`)
                : selectedMonthEndDate + 1;
            setStartDate(
              new Date(`${years[selectedYear]}-${startMonth}-${startDate}`),
            );
            setEndDate(
              new Date(
                `${yearsEndDate[selectedYearEndDate]}-${endMonth}-${endDate}`,
              ),
            );
            compareDates(
              new Date(`${years[selectedYear]}-${startMonth}-${startDate}`),
              new Date(
                `${yearsEndDate[selectedYearEndDate]}-${endMonth}-${endDate}`,
              ),
            );
          }}
          error={error}
          skeleton={skeletonLoading}
        />
      )}
      <PaymenntApprovalPopup
        height={270}
        show={payNow}
        onClose={() => {
          setPayNow(false);
          setClickedItem(0);
        }}
        confirmationText={confirmationText}
        paymentAmount={paymentValue}
        onTouchOutside={() => {
          setClickedItem(0);
          setPayNow(false);
        }}
        buttonLoader={buttonLoader}
        onPressProceed={() => {
          setTimeout(() => {
            proceedToPay(paymentValue);
          }, 500);
        }}
      />
      <AlertPopupAuth
        show={apiCrash}
        onClose={() => {
          setApiCrash(false);
        }}
        alertText={'Unable to proceed.'}
        onTouchOutside={() => {
          setApiCrash(false);
        }}
      />
    </>
  );
}
