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
import ActivityItem from '@/components/cards/activityItem';
import ActivityLogItem from '@/components/cards/activityLogItem';
import LogActivityBottomSheet from '@/components/agentBottomSheets/logActivity';
import ActivityHeaderSkeleton from '@/components/skeletons/activitySkeleton';
import FilterCalendarBottomSheet from '@/components/calenderBottomSheet';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCalendarDate,
  setScrollSingle,
  setUserDetail,
} from '@/redux/actions/UserActions';
import moment from 'moment';
import {getAllActivitiesApi} from '@/services/apiMethods/activitiesApi';
import {AxiosError} from 'axios';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
const ActivityDetails = props => {
  const focused = useIsFocused();
  const swipeFlatlist = useRef(null);
  const findScrollIndex = useSelector(state => state?.user?.singleScroll);
  const dispatch = useDispatch();
  const [headerLoading, setHeaderLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [actvityFlatListLoading, setActivityFlatListLoading] = useState(true);
  const [logsDetailLoading, setLogsDetailLoading] = useState(true);
  const sheetRef = useRef(null);
  const snapPointsBottom = useMemo(() => ['1', '1', '45%'], []);
  const [month, setMonth] = useState(new Date());
  const [filterPress, setFilterpress] = useState(false);
  const [length, setLength] = useState(0);
  const [page, setPage] = useState(1);
  const [activityIndex, setActivityIndex] = useState(0);
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
    if (props?.route?.params?.keyId != undefined) {
      setLogsDetailLoading(true);
      getAllActivtiesData(0, null, null, 1, props?.route?.params?.keyId);
    } else {
      setLogsDetailLoading(true);
      getAllActivtiesData(0, null, null, 1, undefined);
    }
    setActivityIndex(0);
  }, [focused]);
  const [activitiesArray, setActivitiesArray] = useState([
    {
      id: 1,
      title: 'All Activity',
      icon: require('@/assets/images/icons/activity_Icon.png'),
      status: true,
    },
    {
      id: 2,
      title: 'Notes',
      icon: require('@/assets/images/icons/notes_icon.png'),
      status: false,
    },
    {
      id: 3,
      title: 'Calls',
      icon: require('@/assets/images/icons/phone_icon.png'),
      status: false,
    },
    {
      id: 4,
      title: 'Events',
      icon: require('@/assets/images/icons/events.png'),
      status: false,
    },
    {
      id: 5,
      title: 'Tasks',
      icon: require('@/assets/images/icons/tasks.png'),
      status: false,
    },
  ]);
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
  const [activityCrash, setActivityCrash] = useState(
    'No activities at the moment.',
  );
  const dates = useSelector(state => state?.user?.calendarDate);
  const [startDate, setStartDate] = useState(new Date());
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [edDate, setEndDate] = useState(new Date());
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [error, setError] = useState(false);
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
  const compareDates = (startDateStr, endDateStr) => {
    const startDate = moment(startDateStr).format('YYYY-MM-DD');
    const endDate = moment(endDateStr).format('YYYY-MM-DD');
    if (
      moment(startDate).isBefore(endDate) == true ||
      moment(startDate).isSame(endDate) == true
    ) {
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
      getAllActivtiesData(activityIndex, startDate, endDate, 1, undefined);
    } else {
      setError(true);
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
  const getAllActivtiesData = async (
    index,
    stDate,
    enDate,
    pageNumber,
    keyId,
  ) => {
    try {
      var payLoad;
      if (stDate == null || enDate == null) {
        if (keyId != undefined) {
          payLoad = `?pageNumber=${pageNumber}&pageSize=${10}&id=${keyId}`;
        } else if (index == 0) {
          payLoad = `?pageNumber=${pageNumber}&pageSize=${10}`;
        } else if (index == 1) {
          payLoad = `?pageNumber=${pageNumber}&pageSize=${10}&type=${'note'}`;
        } else if (index == 2) {
          payLoad =
            payLoad = `?pageNumber=${pageNumber}&pageSize=${10}&type=${'call'}`;
        } else if (index == 3) {
          payLoad =
            payLoad = `?pageNumber=${pageNumber}&pageSize=${10}&type=${'event'}`;
        } else {
          payLoad =
            payLoad = `?pageNumber=${pageNumber}&pageSize=${10}&type=${'task'}`;
        }
      } else {
        if (index == 0) {
          payLoad = `?pageNumber=${pageNumber}&pageSize=${10}&startDate=${stDate}&completedDate=${enDate}`;
        } else if (index == 1) {
          payLoad = `?pageNumber=${pageNumber}&pageSize=${10}&type=${'note'}&startDate=${stDate}&completedDate=${enDate}`;
        } else if (index == 2) {
          payLoad =
            payLoad = `?pageNumber=${pageNumber}&pageSize=${10}&type=${'call'}&startDate=${stDate}&completedDate=${enDate}`;
        } else if (index == 3) {
          payLoad =
            payLoad = `?pageNumber=${pageNumber}&pageSize=${10}&type=${'event'}&startDate=${stDate}&completedDate=${enDate}`;
        } else {
          payLoad =
            payLoad = `?pageNumber=${pageNumber}&pageSize=${10}&type=${'task'}&startDate=${stDate}&completedDate=${enDate}`;
        }
      }
      const responseAllActivties = await getAllActivitiesApi(payLoad);
      if (responseAllActivties?.data?.rowData?.length > 0) {
        if (pageNumber > 1) {
          let merge = [...logsList, ...responseAllActivties?.data?.rowData];
          setLogsList(merge);
          setLength(responseAllActivties?.data?.count);
          setLogsDetailLoading(false);
          setHeaderLoading(false);
          setLoading(false);
        } else {
          setLogsList(responseAllActivties?.data?.rowData);
          setLength(responseAllActivties?.data?.count);
          setLogsDetailLoading(false);
          setHeaderLoading(false);
          setLoading(false);
        }
      } else {
        if (pageNumber == 1) {
          setLogsList([]);
        }
        setLogsDetailLoading(false);
        setLength(0);
        setPage(1);
        setHeaderLoading(false);
        setLoading(false);
      }
      setActivityCrash('No activities at the moment.');
    } catch (err) {
      setHeaderLoading(false);
      setLogsDetailLoading(false);
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

  const RenderActivityTab = () => {
    return (
      <View style={{marginTop: 10}}>
        {headerLoading ? (
          <View style={{height: 140}}>
            <ActivityHeaderSkeleton />
          </View>
        ) : (
          <View style={{marginTop: 0, height: 140}}>
            <FlatList
              ref={swipeFlatlist}
              onLayout={() => {
                if (findScrollIndex == false) {
                  swipeFlatlist?.current?.scrollToEnd({
                    animated: true,
                  });
                  setTimeout(() => {
                    swipeFlatlist?.current?.scrollToOffset({
                      offset: 0,
                      animated: true,
                    });
                  }, 1000);
                  dispatch(setScrollSingle(true));
                }
              }}
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
                          indexs,
                          startDate,
                          edDate,
                          1,
                          undefined,
                        );
                        setPage(1);
                      } else {
                        setActivityIndex(indexs);
                        setLogsDetailLoading(true);
                        getAllActivtiesData(indexs, null, null, 1, undefined);
                        setPage(1);
                      }
                    }}
                    activeIndex={activityIndex}
                    BG={
                      index == activityIndex ? theme?.logoColor : theme?.greyRGB
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
                  getAllActivtiesData(activityIndex, null, null, 1, undefined);
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
              if (sheetOpen) {
                sheetRef?.current?.close();
                openBottomSheet();
              } else {
                openBottomSheet();
              }
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
          <View style={{height: screenHeight * 0.6}}>
            <FlatList
              bounces={false}
              data={logsList}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              style={{}}
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 90,
              }}
              renderItem={({item, index}) => {
                return (
                  <ActivityLogItem
                    item={item}
                    moveLeadScreen={() => {
                      props?.navigation?.navigate('SingleLeadDetails', {
                        LeadId: item?.lead?.id,
                      });
                    }}
                  />
                );
              }}
              onEndReached={() => {
                if (logsList?.length < length) {
                  if (filterPress) {
                    getAllActivtiesData(
                      activityIndex,
                      startDate,
                      edDate,
                      page + 1,
                      undefined,
                    );
                  } else {
                    getAllActivtiesData(
                      activityIndex,
                      null,
                      null,
                      page + 1,
                      undefined,
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
      setSheetOpen(true);
      sheetRef?.current.expand();
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
          heading={'Activities'}
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
                routes: [{name: 'ADashboard'}],
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
          <View style={{flex: 1}}>{RenderActivityTab()}</View>
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
    </>
  );
};
export default ActivityDetails;
