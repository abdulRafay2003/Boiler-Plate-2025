import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StatusBar,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Headers} from '@/components/header/headers';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {useIsFocused} from '@react-navigation/native';
import LeadDetailLogDetailSkeleton from '@/components/skeletons/leadDetailLogsDetailSkeleton';
import LeadDetailHeaderSkeleton from '@/components/skeletons/leadDetailSkeleton';
import LeadDetailLogListSkeleton from '@/components/skeletons/leadActivityListSkeleton';
import ActivityItem from '@/components/cards/activityItem';
import RenderOverview from '@/components/renderOverview';
import {Tabs, MaterialTabBar} from 'react-native-collapsible-tab-view';
import OverviewSkeleton from '@/components/skeletons/overViewSkeleton';
import LeadActivityListSkeleton from '@/components/skeletons/leadActivityListSkeleton';
import LeadTabSkeleton from '@/components/skeletons/leadTabSkeleton';
import {DropDownButton} from '@/components/buttons/dropDownButton';
import moment from 'moment';
import ActivityLogItem from '@/components/cards/activityLogItem';
import LogActivityBottomSheet from '@/components/agentBottomSheets/logActivity';
import FilterCalendarBottomSheet from '@/components/calenderBottomSheet';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCalendarDate,
  setLoader,
  setScrollMulti,
  setUserDetail,
} from '@/redux/actions/UserActions';
import {LeadsDetailApi, LeadsStatusApi} from '@/services/apiMethods/leadsApis';
import {AxiosError} from 'axios';
import LoaderNew from '@/components/loaderNew';
import {ThankYouPopup} from '@/components/modal/thankyouPopUp';
import {Loader} from '@/components/loader';
import {
  getActivitieDetailApi,
  getAllActivitiesApi,
} from '@/services/apiMethods/activitiesApi';
import {AlertPopupAuth} from '@/components/modal/alertPopupAuth';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
const SingleLeadDetails = props => {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const swipeFlatlist = useRef(null);
  const overViewData = props?.route?.params?.overview;
  const leadIdData = props?.route?.params?.LeadId;
  const activityId = props?.route?.params?.keyId;
  const activityType = props?.route?.params?.activityType;
  const [headerLoading, setHeaderLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(true);
  const [overViewLoading, setOverViewLoading] = useState(true);
  const [actvityFlatListLoading, setActivityFlatListLoading] = useState(true);
  const [logsDetailLoading, setLogsDetailLoading] = useState(true);
  const [showThankyou, setShowThankyou] = useState(false);
  const sheetRef = useRef(null);
  const activeRef = useRef(null);
  const snapPointsBottom = useMemo(() => ['1', '1', '45%'], []);
  const [loadingMark, setLoadingMark] = useState(false);
  const [activityIndex, setActivityIndex] = useState(0);
  const [tabList, setTabList] = useState([
    {uuid: '1', name: 'Overview'},
    {uuid: '2', name: 'Activities'},
  ]);
  const [activitiesArray, setActivitiesArray] = useState([
    {
      id: 1,
      title: 'All Activity',
      icon: require('@/assets/images/icons/activity_Icon.png'),
    },
    {
      id: 2,
      title: 'Notes',
      icon: require('@/assets/images/icons/notes_icon.png'),
    },
    {
      id: 3,
      title: 'Calls',
      icon: require('@/assets/images/icons/phone_icon.png'),
    },
    {
      id: 4,
      title: 'Events',
      icon: require('@/assets/images/icons/events.png'),
    },
    {
      id: 5,
      title: 'Tasks',
      icon: require('@/assets/images/icons/tasks.png'),
    },
  ]);
  const [overviewData, setOverviewData] = useState({});
  const [logsList, setLogsList] = useState([
    // {
    //   id: 1,
    //   head: 'Share Property Pricing',
    //   info: 'Share property pricing and copy of property documents.',
    //   date: '21/04/2023',
    //   status: 'Completed',
    //   notes: 'Tasks',
    // },
    // {
    //   id: 2,
    //   head: 'Client Call',
    //   info: 'We discussed the property plans, pricing, and amenities',
    //   date: '2:00 PM - 21/04/2023',
    //   status: 'Completed',
    //   notes: 'Call',
    //   phone: '+971 50 610 1482',
    // },
    // {
    //   id: 3,
    //   head: 'Follow Up',
    //   info: '3BHK already forwarded the details to him by WhatsApp.',
    //   date: '2:00 PM - 21/04/2023',
    //   type: 'Note',
    //   direction: 'Incoming',
    //   notes: 'Note',
    // },
    // {
    //   id: 4,
    //   head: 'Closing Meeting',
    //   info: 'We discussed the property documents and the final pricing.',
    //   date: '2:00 PM - 21/04/2023',
    //   status: 'Completed',
    //   location: 'Al Helio-Ajman, UAE',
    //   eventAccess: 'Private',
    //   notes: 'Event',
    // },
  ]);
  const [logListing, setLogListing] = useState([
    {
      id: 1,
      activityName: 'Note',
      route: 'NoteLogs',
    },
    {
      id: 2,
      activityName: 'Call',
      route: 'CallLogs',
    },
    {
      id: 3,
      activityName: 'Event',
      route: 'EventLogs',
    },
    {
      id: 4,
      activityName: 'Tasks',
      route: 'TaskLogs',
    },
  ]);

  useEffect(() => {}, [tabList]);
  useEffect(() => {
    getLeadsDetail();
    setActivityIndex(0);
  }, [focused]);
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }

    if (activityType != undefined) {
      let index = 0;
      if (activityType == 'NOTE') {
        index = 1;
      } else if (activityType == 'CALL') {
        index = 2;
      } else if (activityType == 'EVENT') {
        index = 3;
      } else if (activityType == 'TASK') {
        index = 4;
      }
      setActivityIndex(index);
      getAllActivtiesData(leadIdData, index, null, null, 1);
    } else {
      getAllActivtiesData(leadIdData, 0, null, null, 1);
    }
  }, [focused]);

  const dates = useSelector(state => state?.user?.calendarDate);
  const [startDate, setStartDate] = useState(new Date());
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [edDate, setEndDate] = useState(new Date());
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState(false);
  const [activityCrash, setActivityCrash] = useState(
    'No activities at the moment.',
  );
  const [overviewCrash, setoverviewCrash] = useState(
    'No overview at the moment.',
  );
  const [overviewApiCrash, setoverviewApiCrash] = useState(false);

  //========================== Start Date =========================================

  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const dayRef = useRef(null);
  const [days, setDays] = useState([]);
  const [listLoading, setListLoading] = useState(true);
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
  const [filterPress, setFilterpress] = useState(false);
  const [length, setLength] = useState(0);
  const [page, setPage] = useState(1);
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

  const snapPoints = useMemo(() => ['1', '1', '80%'], []);
  const calendarRef = useRef(null);
  useEffect(() => {
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

    setselectedYearEndDate(currentYearIndexEndDate);
    setselectedMonthEndDate(currentMonthIndexEndDate);
    getAllDaysInMonthEndDate(currentMonthIndexEndDate, currentYearIndexEndDate);
    setSelectedDayEndDate(currentDay - 1);
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
    // setSelectedDateRange('Please Select Date');
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);

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
      setFilterpress(true);
      setLogsDetailLoading(true);
      calendarRef?.current.close();
      getAllActivtiesData(leadIdData, activityIndex, startDate, endDate, 1);

      setTimeout(() => {
        setListLoading(false);
      }, 1000);
    } else {
      setError(true);
      setErrorMessage('End date must be greater than start date.');
    }
  };
  //========================== End Date =========================================
  const deleteSelectDate = () => {
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

    setselectedYearEndDate(currentYearIndexEndDate);
    setselectedMonthEndDate(currentMonthIndexEndDate);
    getAllDaysInMonthEndDate(currentMonthIndexEndDate, currentYearIndexEndDate);
    setSelectedDayEndDate(currentDay - 1);
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
  };
  const getAllActivtiesData = async (id, index, stDate, enDate, pageNumber) => {
    try {
      var payLoad;
      if (stDate == null || enDate == null) {
        if (index == 0) {
          payLoad = `${id}?pageNumber=${pageNumber}&pageSize=${10}`;
        } else if (index == 1) {
          payLoad = `${id}?pageNumber=${pageNumber}&pageSize=${10}&type=${'note'}`;
        } else if (index == 2) {
          payLoad =
            payLoad = `${id}?pageNumber=${pageNumber}&pageSize=${10}&type=${'call'}`;
        } else if (index == 3) {
          payLoad =
            payLoad = `${id}?pageNumber=${pageNumber}&pageSize=${10}&type=${'event'}`;
        } else {
          payLoad =
            payLoad = `${id}?pageNumber=${pageNumber}&pageSize=${10}&type=${'task'}`;
        }
      } else {
        if (index == 0) {
          payLoad = `${id}?pageNumber=${pageNumber}&pageSize=${10}&startDate=${stDate}&completedDate=${enDate}`;
        } else if (index == 1) {
          payLoad = `${id}?pageNumber=${pageNumber}&pageSize=${10}&type=${'note'}&startDate=${stDate}&completedDate=${enDate}`;
        } else if (index == 2) {
          payLoad =
            payLoad = `${id}?pageNumber=${pageNumber}&pageSize=${10}&type=${'call'}&startDate=${stDate}&completedDate=${enDate}`;
        } else if (index == 3) {
          payLoad =
            payLoad = `${id}?pageNumber=${pageNumber}&pageSize=${10}&type=${'event'}&startDate=${stDate}&completedDate=${enDate}`;
        } else {
          payLoad =
            payLoad = `${id}?pageNumber=${pageNumber}&pageSize=${10}&type=${'task'}&startDate=${stDate}&completedDate=${enDate}`;
        }
      }
      const responseAllActivties = await getActivitieDetailApi(payLoad);
      if (responseAllActivties?.data?.rowData?.length > 0) {
        if (pageNumber > 1) {
          let merge = [...logsList, ...responseAllActivties?.data?.rowData];
          setLogsList(merge);
          setLength(responseAllActivties?.data?.count);
          setLogsDetailLoading(false);
          setHeaderLoading(false);
          setOverViewLoading(false);
          setActivityFlatListLoading(false);
          setTabLoading(false);
          setLoading(false);
          if (swipeFlatlist) {
            setTimeout(() => {
              swipeFlatlist?.current?.scrollToIndex({
                animated: true,
                index: index,
              });
            }, 1000);
          }
        } else {
          setLogsList(responseAllActivties?.data?.rowData);
          setLength(responseAllActivties?.data?.count);
          setLogsDetailLoading(false);
          setHeaderLoading(false);
          setOverViewLoading(false);
          setActivityFlatListLoading(false);
          setTabLoading(false);
          setLoading(false);
          if (swipeFlatlist?.current != null) {
            setTimeout(() => {
              swipeFlatlist?.current?.scrollToIndex({
                animated: true,
                index: index,
              });
            }, 1000);
          }
        }
      } else {
        if (pageNumber == 1) {
          setLogsList([]);
        }
        setLogsDetailLoading(false);
        setLength(0);
        setPage(1);
        setHeaderLoading(false);
        setOverViewLoading(false);
        setActivityFlatListLoading(false);
        setTabLoading(false);
        setLoading(false);
        if (swipeFlatlist?.current != null) {
          setTimeout(() => {
            swipeFlatlist?.current?.scrollToIndex({
              animated: true,
              index: index,
            });
          }, 500);
        }
      }
      setActivityCrash('No activities at the moment.');
    } catch (err) {
      setHeaderLoading(false);
      setOverViewLoading(false);
      setActivityFlatListLoading(false);
      setLogsDetailLoading(false);
      setTabLoading(false);
      setLoading(false);
      setLogsList([]);
      setLength(0);
      setPage(1);
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatch(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 500
      ) {
        setLogsList([]);
        setActivityCrash('Unable to load data at the moment.');
      }
    }
  };
  const renderTabBar = props => {
    return (
      <MaterialTabBar
        {...props}
        indicatorStyle={{
          backgroundColor: theme?.logoColor,
          height: 4,
          width: '50%',
          bottom: 2,
        }}
        activeColor={theme.logoColor}
        inactiveColor={theme.black}
        labelStyle={{
          fontSize: 17,
          textTransform: 'capitalize',
          fontFamily: FONT_FAMILY?.IBMPlexMedium,
          color: theme?.white,
        }}
        style={{
          height: 50,
        }}
        contentContainerStyle={{
          alignSelf: 'center',
          height: 50,
          marginVertical: 10,
        }}
        tabStyle={{
          width: screenWidth * 0.5,
          borderBottomWidth: 1,
          borderBottomColor: theme?.textGrey,
        }}
        scrollEnabled
      />
    );
  };
  const RenderOverviewTab = () => {
    return (
      <View style={{height: '100%'}}>
        {overViewLoading ? (
          <OverviewSkeleton />
        ) : (
          <View style={{padding: 20, marginTop: 50, flex: 1}}>
            {overviewApiCrash ? (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 18,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.black,
                  textAlign: 'center',
                }}>
                {overviewCrash}
              </Text>
            ) : (
              <RenderOverview
                data={overviewData}
                onPressEdit={() => {
                  postStatus(1);
                }}
                onPressEditNot={() => {
                  postStatus(2);
                }}
                onPressResetNot={() => {
                  postStatus(5);
                }}
              />
            )}
          </View>
        )}
      </View>
    );
  };
  const RenderActivityTab = () => {
    return (
      <View style={{height: '100%'}}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 150,
          }}
          style={{marginTop: 50, flex: 1}}
          nestedScrollEnabled={true}>
          {actvityFlatListLoading ? (
            <LeadActivityListSkeleton />
          ) : (
            <View style={{marginTop: 0, height: 140}}>
              <FlatList
                ref={swipeFlatlist}
                bounces={false}
                horizontal
                data={activitiesArray}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 20,
                }}
                renderItem={({item, index}) => {
                  return (
                    <ActivityItem
                      item={item}
                      index={index}
                      onPressItem={indexs => {
                        setActivityIndex(indexs);
                        setLogsDetailLoading(true);
                        if (filterPress) {
                          getAllActivtiesData(
                            leadIdData,
                            indexs,
                            startDate,
                            edDate,
                            1,
                          );
                          setPage(1);
                        } else {
                          getAllActivtiesData(
                            leadIdData,
                            indexs,
                            null,
                            null,
                            1,
                          );
                          setPage(1);
                        }
                      }}
                      activeIndex={activityIndex}
                      BG={
                        index == activityIndex
                          ? theme?.logoColor
                          : theme?.greyRGB
                      }
                      fontFamilyStyle={
                        index == activityIndex
                          ? FONT_FAMILY?.IBMPlexMedium
                          : FONT_FAMILY?.IBMPlexRegular
                      }
                      lineShow={
                        index < activitiesArray?.length - 1 ? true : false
                      }
                    />
                  );
                }}
                onScrollToIndexFailed={info => {
                  const wait = new Promise(resolve => setTimeout(resolve, 500));
                  wait.then(() => {
                    swipeFlatlist.current?.scrollToIndex({
                      index: info.index,
                      animated: true,
                    });
                  });
                }}
              />
            </View>
          )}

          <View
            style={{
              height: 54,
              width: screenWidth,
              backgroundColor: theme?.greyRGB,
              borderTopWidth: 1,
              borderTopColor: theme?.greyText,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}>
            {selectedDateRange != '' ? (
              <View
                style={{
                  backgroundColor: theme?.iphoneGrey,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.white,
                  }}>
                  {selectedDateRange}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedDateRange('');
                    deleteSelectDate();
                    setFilterpress(false);
                    setLogsDetailLoading(true);
                    getAllActivtiesData(
                      leadIdData,
                      activityIndex,
                      null,
                      null,
                      1,
                    );
                  }}
                  activeOpacity={0.9}
                  style={{
                    position: 'absolute',
                    width: 18,
                    height: 18,
                    right: -5,
                    bottom: 22,
                    backgroundColor: theme?.textGrey,
                    borderRadius: 16 / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('@/assets/images/icons/white_cross.png')}
                    style={{
                      width: 8,
                      height: 8,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View></View>
            )}

            <TouchableOpacity
              style={{
                width: 79,
                height: 34,
                borderRadius: 5,
                backgroundColor: theme?.logoColor,
                justifyContent: 'center',
                alignItems: 'center',

                flexDirection: 'row',
              }}
              activeOpacity={1}
              onPress={() => {
                openBottomSheet();
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  color: theme?.white,
                }}>
                Filter
              </Text>
              <Image
                source={require('@/assets/images/icons/filter.png')}
                style={{
                  height: 16,
                  width: 14,
                  tintColor: theme?.white,
                  marginLeft: 5,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {logsDetailLoading ? (
            <View
              style={{
                marginTop: 10,
              }}>
              <LeadDetailLogDetailSkeleton />
            </View>
          ) : (
            <View style={{height: '100%'}}>
              <FlatList
                nestedScrollEnabled={true}
                bounces={false}
                data={logsList}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={{}}
                contentContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 110,
                }}
                renderItem={({item, index}) => {
                  return <ActivityLogItem item={item} moveLeadScreen={null} />;
                }}
                onEndReached={() => {
                  if (logsList?.length < length) {
                    if (filterPress) {
                      getAllActivtiesData(
                        leadIdData,
                        activityIndex,
                        startDate,
                        edDate,
                        page + 1,
                      );
                    } else {
                      getAllActivtiesData(
                        leadIdData,
                        activityIndex,
                        null,
                        null,
                        page + 1,
                      );
                    }
                    setPage(page + 1);
                  }
                }}
                onEndReachedThreshold={0}
                ListFooterComponent={() => {
                  return (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {logsList?.length < length ? (
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
                          {logsList?.length > 0 ? '' : ''}
                        </Text>
                      )}
                    </View>
                  );
                }}
                ListEmptyComponent={() => {
                  return (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: screenHeight * 0.4,
                        width: screenWidth * 0.99,
                        alignSelf: 'center',
                      }}>
                      {/* <Image
                      source={require('@/assets/images/icons/smallAlert_Icon.png')}
                      style={{
                        height: 50,
                        width: 50,
                        tintColor: theme?.textGrey,
                      }}
                      resizeMode="contain"
                    /> */}
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 16,
                          fontFamily: FONT_FAMILY?.IBMPlexMedium,
                          color: theme?.textGrey,
                        }}>
                        {activityCrash}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  };
  const renderLogListing = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          sheetRef?.current?.close();
          props?.navigation?.navigate(item?.route);
        }}>
        <View
          style={{
            // backgroundColor:'red'
            borderBottomWidth: 0.6,
            borderBottomColor: theme?.greyText,
            paddingBottom: 10,
            margin: 10,
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
            }}>
            {item?.activityName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const openBottomSheetLogs = () => {
    if (sheetRef?.current) {
      sheetRef?.current.expand();
    }
  };
  const getLeadsDetail = async () => {
    try {
      var payLoad = {
        id: leadIdData,
      };
      const responseleadsDatails = await LeadsDetailApi(payLoad);
      setOverviewData(responseleadsDatails?.data);
      setOverViewLoading(false);
      setLoadingMark(false);
      setoverviewCrash('No overview at the moment.');
      setoverviewApiCrash(false);
    } catch (err) {
      setLoadingMark(false);
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatch(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 599
      ) {
        setoverviewApiCrash(true);
        setoverviewCrash('Unable to load data at the moment..');
      }
    }
  };
  const postStatus = async status => {
    setLoadingMark(true);
    try {
      var payLoad = {
        leadId: overviewData?.id,
        state: status,
      };
      const responseStatus = await LeadsStatusApi(payLoad);
      setShowThankyou(true);
      setShowError(false);
      setSuccessMessage(responseStatus?.message);
      getLeadsDetail();
    } catch (err) {
      setLoadingMark(false);
      setShowThankyou(false);
      setShowError(true);
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatch(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 599
      ) {
        setErrorMessage('Unable to change status at the moment.');
      } else {
        setErrorMessage(error?.response?.data?.message);
      }
    }
  };
  return (
    <>
      <View
        onStartShouldSetResponder={() => {
          if (sheetRef?.current || calendarRef?.current) {
            sheetRef?.current?.close();
            calendarRef?.current?.close();
          }
        }}
        style={{flex: 1, backgroundColor: theme?.white}}>
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
          heading={'LEAD DETAILS'}
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
        <View style={{height: screenHeight}}>
          {headerLoading ? (
            <LeadDetailHeaderSkeleton />
          ) : (
            <View
              style={{
                height: 120,
                padding: 20,
                width: screenWidth,
                justifyContent: 'space-around',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <Text
                    allowFontScaling={false}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                      fontSize: 23,
                      fontFamily: FONT_FAMILY?.IBMPlexMedium,
                      color: theme?.black,
                      flexWrap: 'wrap',
                    }}>
                    {overviewData?.name}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '47%',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.textGrey,
                  }}>
                  {overviewData?.leadCreationDate
                    ? moment(overviewData?.leadCreationDate)?.format(
                        'DD/MM/YYYY',
                      )
                    : null}
                </Text>
                <View
                  style={{
                    height: 14,
                    width: 2,
                    backgroundColor: theme?.textGrey,
                  }}
                />
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.textGrey,
                  }}>
                  {moment(leadIdData?.leadCreationDate)?.format('hh:mm a')}
                </Text>
              </View>
            </View>
          )}
          {tabLoading ? (
            <LeadTabSkeleton />
          ) : (
            <View style={{flex: 1}}>
              <Tabs.Container
                initialTabName={overViewData ? 'Overview' : 'Activities'}
                ref={activeRef}
                renderTabBar={renderTabBar}
                headerContainerStyle={{
                  width: screenWidth,
                  shadowColor: theme?.white,
                }}
                containerStyle={{height: screenHeight}}
                onIndexChange={index => {}}>
                <Tabs.Tab name={tabList[0]?.name}>
                  {RenderOverviewTab()}
                </Tabs.Tab>
                <Tabs.Tab name={tabList[1]?.name}>
                  {RenderActivityTab()}
                </Tabs.Tab>
              </Tabs.Container>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={{
            width: 70,
            height: 70,
            backgroundColor: theme?.logoColor,
            borderRadius: 70 / 2,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-end',
            bottom: 20,
            position: 'absolute',
            right: 15,
          }}
          activeOpacity={1}
          onPress={() => {
            openBottomSheetLogs();
          }}>
          <Image
            source={require('@/assets/images/icons/plus.png')}
            style={{height: 25, width: 25}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <LogActivityBottomSheet
        logListingData={logListing}
        renderLogListing={renderLogListing}
        sheetRef={sheetRef}
        snapPoints={snapPointsBottom}
      />
      <ThankYouPopup
        onTouchOutside={() => {
          setShowThankyou(false);
        }}
        onClose={() => {
          setShowThankyou(false);
        }}
        show={showThankyou}
        thankyouText={successMessage}
      />
      <AlertPopupAuth
        show={error}
        onClose={() => {
          setErrorMessage('');
          setShowError(false);
        }}
        alertText={errorMessage}
        onTouchOutside={() => {
          setErrorMessage('');
          setShowError(false);
        }}
      />
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
      {loadingMark && <Loader />}
    </>
  );
};
export default SingleLeadDetails;
