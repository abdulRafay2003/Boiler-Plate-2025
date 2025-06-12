import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Image,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Text,
  StyleSheet,
  SectionList,
  BackHandler,
  Keyboard,
  Platform,
} from 'react-native';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {Headers} from '@/components/header/headers';
import {ScrollView} from 'react-native-gesture-handler';
import PaymentPlanSkeleton from '@/components/skeletons/paymentPlan';
import SectionListSkeleton from '@/components/skeletons/sectionList';
import {PaymenntApprovalPopup} from '@/components/modal/paymentApprovalPending';
import {
  FilterPaymentPrdLinkage,
  finalAmountPaymentPlan,
  formatValue,
  invoiceLink,
  paymentPlanBC,
  paymentPlanStatus,
  paymentRecieptLink,
  projectDescription,
  statmentOfAccLink,
} from '@/utils/business.helper';
import {
  DownPaymentStatus,
  PaymentIntent,
  PaymentPlanById,
} from '@/services/apiMethods/financials';
import moment from 'moment';
import {AxiosError} from 'axios';
import {setLoader, setUserDetail} from '@/redux/slice/UserSlice/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';
import {AlertPopupAuth} from '@/components/modal/alertPopupAuth';
import {useIsFocused} from '@react-navigation/native';
import {DateChangePopup} from '@/components/modal/dateChangedPopup';
import {DownPaymentPopup} from '@/components/modal/downpaymentPopup';
import {DropDownButton} from '@/components/buttons/dropDownButton';
import {ReciptListingPopup} from '@/components/modal/recieptPopup';
import PaymentPlanItem from '@/components/paymentPlanItem';
import { dispatchToStore } from '@/redux/store';

let screenHeight = Math.round(Dimensions.get('window').height);
let screenWidth = Math.round(Dimensions.get('window').width);

export default function PaymentPlan(props) {
  const projectDetails = props?.route?.params?.item;
  const projectDetailsNode = props?.route?.params?.itemNode;
  const projectBalance = props?.route?.params?.balance;
  const statementOfAccountUrl = props?.route?.params?.statementOfAccount;
  const [recievedYear, setRecievedYear] = useState(props?.route?.params?.year);
  const [dropdown, setDropdown] = useState(false);
  const focused = useIsFocused();
  const [logs, setLogs] = useState([]);
  const [selectedYear, setSelecteYear] = useState(`All Years`);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionListLoading, setSectionListLoading] = useState(true);
  const [payNow, setPayNow] = useState(false);
  const [paymentValue, setPaymentValue] = useState({});
  const [length, setLength] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [apiCrashResponse, setApiCrashResponse] = useState(false);
  const [apiCrash, setApiCrash] = useState(false);
  const [url, setUrl] = useState('');
  const [clickedItem, setClickedItem] = useState(0);
  const [confirmationText, setConfirmationText] = useState([]);
  const [note, setNote] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [dPStatus, setDPStatus] = useState(true);
  const [dPPopup, setDPPopup] = useState(false);
  const [dPPopupText, setDPPopupText] = useState('');
  const [statusDropDown, setStatusDropdown] = useState(false);
  const [statusLable, setStatusLabel] = useState('All');
  const [reciepts, setReciepts] = useState({});
  const [showRecieptViewerPopup, setRecieptViewerPopup] = useState(false);
  const [instTitle, setInstTitle] = useState('');
  const [showLoader, setShowLoader] = useState('');
  const [downloadStart, setDownloadStart] = useState(false);
  const [statusArray, setStatusArray] = useState([
    {
      id: 1,
      title: 'All',
    },
    {
      id: 2,
      title: 'Paid',
    },
    {
      id: 3,
      title: 'UnPaid',
    },
  ]);
  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = new Date();
      if (newDate.getDate() !== currentDate.getDate()) {
        setApiCrash(false);
        setPayNow(false);
        setShow(true);
        setSectionListLoading(true);
        setCurrentDate(new Date());
        clearInterval(interval);
        getPaymentPlanStatus(
          props?.route?.params?.id,
          1,
          selectedYear,
          statusLable,
        );
      } else {
        setShow(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    setRecieptViewerPopup(false);
    if (recievedYear != undefined) {
      setSelecteYear(`${new Date(recievedYear).getFullYear()}`);
      getPaymentPlanStatus(
        props?.route?.params?.id,
        1,
        `${new Date(recievedYear).getFullYear()}`,
        statusLable,
      );
    } else {
      getPaymentPlanStatus(
        props?.route?.params?.id,
        1,
        selectedYear,
        statusLable,
      );
    }
  }, [focused]);
  useEffect(() => {
    // let currentDate = new Date().getFullYear();
    // generateYearsBetween(2000, currentDate);
    // setYears(yearsArray.reverse());
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);
  useEffect(() => {
    getPaymentPlanStatus(
      props?.route?.params?.id,
      1,
      selectedYear,
      statusLable,
    );

    // getPaymentPlans(props?.route?.params?.id, 1, selectedYear);
  }, [selectedYear, statusLable]);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      backHandler.remove();
    };
  }, [payNow]);
  const handleBackButtonClick = () => {
    if (payNow == true) {
      setPayNow(false);
    }

    return true;
  };

  const renderPaymentData = ({index, item}) => {
    return (
      <PaymentPlanItem
        item={item}
        viewReciept={() => {
          setRecieptViewerPopup(true);
          let arr = FilterPaymentPrdLinkage(item?.PaymentPrdLinkage);
          setReciepts(arr);
        }}
        clickedItem={clickedItem}
        onClickedItem={() => {
          if (dPStatus == false) {
            setDPPopupText(
              'Please contact GJ Properties admin and make down payment before paying installments.',
            );
            setDPPopup(true);
          } else {
            setClickedItem(item?.id);
            getUrl(item);
          }
        }}
      />
    );
  };

  const renderReciept = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 20,
          width: '100%',
          height: 50,
          justifyContent: 'flex-start',
          borderWidth: 1,
          borderRadius: 10,
          borderColor: theme?.textGrey,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        activeOpacity={0.9}
        onPress={() => {
          props?.navigation?.navigate('Reciept', {
            paymentRecieptUrl: item?.paymentPrd?.paymentRecieptUrl,
            name: `Reciept No ${index}`,
          });
        }}>
        <View
          style={{
            width: '15%',
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('@/assets/images/icons/Financials.png')}
            style={{height: 20, width: 20}}
            resizeMode="contain"
          />
        </View>
        <View style={{width: '70%', height: 70, justifyContent: 'center'}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
            }}>
            Reciept No: {index + 1}
          </Text>
        </View>
        <View
          style={{
            width: '15%',
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('@/assets/images/icons/paymentLog-arrow.png')}
            style={{height: 15, width: 15, tintColor: theme?.logoColor}}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    );
  };
  const getPaymentPlanStatus = async (id, pageNo, year, statusLable) => {
    try {
      const status = await DownPaymentStatus(id);
      console.log('getPaymentPlanStatus', status);

      if (status?.length > 0) {
        let state = true;
        status?.map(item => {
          if (item?.paymentStatus != 'Paid') {
            state = false;
          }
        });
        setDPStatus(state);
        getPaymentPlans(id, pageNo, year, statusLable);
      } else {
        setDPStatus(true);
        getPaymentPlans(id, pageNo, year, statusLable);
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log('getPaymentPlanStatus', error);

      setPageNo(0);
      setLogs([]);
      setLength(0);
      setLoading(false);
      setSectionListLoading(false);
      setShow(false);
      if (error?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 500
      ) {
        setApiCrashResponse(true);
      }
    }
  };
  const getPaymentPlans = async (id, pageNo, year, statusLable) => {
    try {
      let payload;
      let statusFomat =
        statusLable == 'All'
          ? 'All'
          : statusLable == 'UnPaid'
          ? 'unpaid'
          : 'paid';
      if (year == 'All Years' && statusLable == 'All') {
        payload = `${id}?pageNumber=${pageNo}&pageSize=20`;
      } else if (year == 'All Years' && statusLable != 'All') {
        payload = `${id}?pageNumber=${pageNo}&pageSize=20&status=${statusFomat}`;
      } else if (year != 'All Years' && statusLable == 'All') {
        payload = `${id}?pageNumber=${pageNo}&pageSize=20&date=${year.toString()}`;
      } else {
        payload = `${id}?pageNumber=${pageNo}&pageSize=20&date=${year.toString()}&status=${statusFomat}`;
      }

      const data = await PaymentPlanById(payload);
      // console.log('datadatadata', data?.rowData);

      if (data?.rowData?.length > 0) {
        let years = [];
        years.push('All Years');
        if (data?.totalYearsArray?.length > 0) {
          let finalYears = [...years, ...data?.totalYearsArray];
          setYears(finalYears);
        } else {
          setYears(years);
        }
        let arr = [];
        data?.rowData?.map((item, index) => {
          if (data?.lastUnpaid != undefined) {
            if (item?.id == data?.lastUnpaid?.id) {
              arr?.push({
                title: moment(item?.scheduleDate).format('MMMM YYYY'),
                data: [
                  {
                    ...item,
                    dueDate: moment(item?.scheduleDate).format('DD MMM YYYY'),
                    enable: true,
                    paymentStatus: item?.shouldBeDisabled
                      ? 'shouldBeDisabled'
                      : item?.paymentStatus,
                  },
                ],
              });
            } else {
              arr?.push({
                title: moment(item?.scheduleDate).format('MMMM YYYY'),
                data: [
                  {
                    ...item,
                    dueDate: moment(item?.scheduleDate).format('DD MMM YYYY'),
                    enable: false,
                    paymentStatus: item?.shouldBeDisabled
                      ? 'shouldBeDisabled'
                      : item?.paymentStatus,
                  },
                ],
              });
            }
          } else {
            arr?.push({
              title: moment(item?.scheduleDate).format('MMMM YYYY'),
              data: [
                {
                  ...item,
                  dueDate: moment(item?.scheduleDate).format('DD MMM YYYY'),
                  enable: true,
                  paymentStatus: item?.shouldBeDisabled
                    ? 'shouldBeDisabled'
                    : item?.paymentStatus,
                },
              ],
            });
          }
        });

        setShow(false);
        if (pageNo > 1) {
          let merge = [...logs, ...arr];
          setLogs(merge);
          setLength(data?.count);
          setLoading(false);
          setSectionListLoading(false);
        } else {
          setLogs(arr);
          setLength(data?.count);
          setLoading(false);
          setSectionListLoading(false);
        }
      } else {
        setPageNo(0);
        setLogs([]);
        setLength(0);
        setLoading(false);
        setSectionListLoading(false);
      }
      setApiCrashResponse(false);
    } catch (err) {
      const error = err as AxiosError;
      console.log('getPaymentPlansgetPaymentPlans', error);
      setPageNo(0);
      setLogs([]);
      setLength(0);
      setLoading(false);
      setSectionListLoading(false);
      setShow(false);
      if (error?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 500
      ) {
        setApiCrashResponse(true);
      }
    }
  };

  const getUrl = async paymentValue => {
    console.log('paymentUrl?.paylink', paymentValue);

    try {
      let payload = {
        orderParams: {
          order_id: paymentValue?.id,
          amount: paymentValue?.scheduleAmt,
          language: 'en',
          type: 'paymentPlan',
        },
      };
      const paymentUrl = await PaymentIntent(payload);
      console.log('paymentUrl?.paylink', paymentUrl?.paylink);
      setUrl(paymentUrl?.paylink);
      setPaymentValue({
        ...paymentValue,
        pay: paymentUrl?.breakdown?.totalAmt,
      });
      const getfinalAmount = finalAmountPaymentPlan(
        paymentUrl?.breakdown,
        paymentValue?.scheduleAmt,
      );
      setConfirmationText(getfinalAmount.object?.main);
      setNote(getfinalAmount?.object?.note);
      setPayNow(getfinalAmount.state);
      setApiCrash(false);
      return;
    } catch (err) {
      setClickedItem(0);
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 599
      ) {
        setPayNow(false);
        setApiCrash(true);
      }
      dispatchToStore(setLoader(false));
      crashlytics().log('Get Url Api Dashboard');
      crashlytics().recordError(error);
    }
  };
  const proceedToPay = async paymentValue => {
    try {
      if (url != '') {
        setPayNow(false);
        dispatchToStore(setLoader(false));
        setClickedItem(0);
        props?.navigation?.navigate('PaymentScreen', {
          url: url,
          from: 'paymentPlan',
          projectTitle: projectDetails?.title,
          unitCode: props?.route?.params?.unitCode,
        });
      } else {
        setClickedItem(paymentValue?.id);
        getUrl(paymentValue);
      }
      setApiCrash(false);
    } catch (err) {
      const error = err as AxiosError;
      setClickedItem(0);
      if (error?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 599
      ) {
        setPayNow(false);
        setApiCrash(true);
      }
      dispatchToStore(setLoader(false));
      crashlytics().log('ProceedToPay Api Dashboard');
      crashlytics().recordError(error);
    }
  };

  const renderGridItems = () => {
    const numColumns = 3;
    const itemWidth = screenWidth * 0.25; // Set the width of each grid item
    const containerPadding = 10;
    const containerWidth = (itemWidth + containerPadding * 2) * numColumns;

    return (
      <View
        style={{
          width: containerWidth,
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginBottom: 10,
          backgroundColor: theme.white,
          // borderRadius:20
        }}>
        {years?.map(item => {
          return (
            <TouchableOpacity
              style={{
                backgroundColor: theme?.white,
                width: screenWidth * 0.25,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: theme?.greyText,
                alignSelf: 'center',
                paddingVertical: 5,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 10,
                height: 45,
                marginVertical: 10,
                borderRadius: 5,
              }}
              activeOpacity={0.9}
              onPress={() => {
                setRecievedYear(undefined);
                setPageNo(1);
                setDropdown(false);
                setSelecteYear(item);
                setSectionListLoading(true);
                getPaymentPlanStatus(
                  props?.route?.params?.id,
                  1,
                  item,
                  statusLable,
                );
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.black,
                }}>
                {item}
              </Text>
              {selectedYear == item && (
                <Image
                  style={{
                    width: 10,
                    height: 10,
                    tintColor: theme?.logoColor,
                    marginLeft: 10,
                  }}
                  source={require('@/assets/images/icons/tick.png')}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  return (
    <View
      style={{
        backgroundColor: theme?.white,
        flex: 1,
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
        heading={'Payment Plan'}
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
          props.navigation.goBack();
        }}
        onNotificationPress={() => {
          props?.navigation?.navigate('Notification');
        }}
        notificationIcon={false}
      />
      {loading ? (
        <PaymentPlanSkeleton />
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
            <View style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                  paddingHorizontal: 20,
                  justifyContent: 'space-between',
                }}>
                <Text
                  allowFontScaling={false}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{
                    width: '70%',
                    left: 5,
                    fontSize: 20,
                    fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                    color: theme?.logoColor,
                  }}>
                  {projectDetails?.title}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: theme?.black,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    paddingVertical: 5,
                    paddingHorizontal: 20,
                    maxWidth: '30%',
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      color: theme?.white,
                    }}>
                    Unit:{' '}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      fontSize: 14,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      color: theme?.white,
                    }}>
                    {props?.route?.params?.unitCode}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                  paddingHorizontal: 20,
                  left: 5,
                }}>
                <Image
                  source={require('@/assets/images/icons/marker.png')}
                  style={{
                    width: 9,
                    height: 14,
                    resizeMode: 'contain',
                    tintColor: theme?.black,
                  }}
                />
                <Text
                  allowFontScaling={false}
                  style={{
                    left: 5,
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.black,
                  }}>
                  {projectDescription(projectDetailsNode)}

                  {/* {projectDescription(projectDetailsNode, projectDetails)} */}
                </Text>
              </View>
              {statmentOfAccLink(statementOfAccountUrl) && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={{
                    height: 30,
                    justifyContent: 'center',
                    width: screenWidth,
                    alignItems: 'flex-end',
                    paddingHorizontal: 20,
                  }}
                  onPress={() => {
                    props?.navigation?.navigate('Statement', {
                      paymentRecieptUrl: statementOfAccountUrl,
                      name: `${projectDetails?.title} - ${props?.route?.params?.unitCode} Account Statement`,
                    });
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      color: theme?.black,
                      textDecorationLine: 'underline',
                    }}
                    allowFontScaling={false}>
                    View Statment of Account
                  </Text>
                </TouchableOpacity>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10,
                  paddingHorizontal: 10,
                  marginHorizontal: 20,
                  // left: 5,
                  height: 35,
                  backgroundColor: theme?.greyRGB,
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    left: 5,
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.black,
                  }}>
                  Balance
                </Text>
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    left: 5,
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.black,
                    maxWidth: '70%',
                  }}>
                  AED {formatValue(parseInt(projectBalance))}
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: theme?.greyText,
                  width: screenWidth * 0.88,
                  alignSelf: 'center',
                  marginTop: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 20,
                }}>
                <Text
                  allowFontScaling={false}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{
                    width: '40%',
                    fontSize: 18,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.black,
                  }}>
                  Payment Plans
                </Text>
                <View style={{width: '20%', zIndex: 1}}>
                  <TouchableOpacity
                    style={{
                      width: 75,
                      height: 31,
                      backgroundColor: theme?.logoColorLight,
                      borderRadius: 6,
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                    activeOpacity={0.9}
                    onPress={() => {
                      if (sectionListLoading == false) {
                        setDropdown(!dropdown);
                        setStatusDropdown(false);
                      }
                    }}>
                    <Text
                      allowFontScaling={false}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={{
                        // width: '65%',
                        fontSize: 12,
                        fontFamily: FONT_FAMILY?.IBMPlexMedium,
                        color: theme?.logoColor,
                      }}>
                      {selectedYear}
                    </Text>
                    <Image
                      style={{
                        width: 6,
                        height: 10,
                        tintColor: theme.logoColor,
                        transform: [{rotate: '90deg'}],
                      }}
                      resizeMode="contain"
                      source={require('@/assets/images/icons/arrow.png')}
                    />
                  </TouchableOpacity>
                </View>
                {dropdown && (
                  <View
                    style={{
                      position: 'absolute',
                      left: -10,
                      top: 35,
                      width: screenWidth * 0.92,
                      maxHeight: 250,
                      backgroundColor: theme.white,
                      zIndex: 7,
                      borderRadius: 15,
                      overflow: Platform.OS == 'android' ? 'hidden' : 'visible',
                      shadowColor: theme.textGrey,
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.2,
                      shadowRadius: 1.41,
                      elevation: 2,
                    }}>
                    <ScrollView
                      bounces={false}
                      showsVerticalScrollIndicator={false}
                      style={{
                        borderRadius: 15,
                      }}
                      contentContainerStyle={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        // paddingVertical: 20,
                        // backgroundColor: theme?.white,
                        borderRadius: 15,
                        marginBottom: 10,
                        paddingBottom: 10,
                        marginHorizontal: 5,
                      }}>
                      <View
                        style={{
                          width: '100%',
                          justifyContent: 'flex-end',
                          alignItems: 'flex-end',
                          height: 40,
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.9}
                          style={{
                            height: 30,
                            width: 30,
                            backgroundColor: theme?.logoColor,
                            justifyContent: 'center',
                            alignItems: 'center',
                            right: 5,
                            zIndex: 1000,
                            borderRadius: 50,
                          }}
                          onPress={() => {
                            setDropdown(false);
                          }}>
                          <Image
                            source={require('@/assets/images/icons/white_cross.png')}
                            resizeMode={'cover'}
                            style={{
                              height: 13,
                              width: 13,
                              tintColor: theme.white,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                      {renderGridItems()}
                    </ScrollView>
                  </View>
                )}
                <View style={{width: '23%'}}>
                  <TouchableOpacity
                    style={{
                      width: 75,
                      height: 31,
                      backgroundColor: theme?.logoColorLight,
                      borderRadius: 6,
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                    activeOpacity={0.9}
                    onPress={() => {
                      if (sectionListLoading == false) {
                        setDropdown(false);
                        setStatusDropdown(!statusDropDown);
                      }
                    }}>
                    <Text
                      allowFontScaling={false}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={{
                        // width: '65%',
                        fontSize: 12,
                        fontFamily: FONT_FAMILY?.IBMPlexMedium,
                        color: theme?.logoColor,
                      }}>
                      {statusLable}
                    </Text>
                    <Image
                      style={{
                        width: 6,
                        height: 10,
                        tintColor: theme.logoColor,
                        transform: [{rotate: '90deg'}],
                      }}
                      resizeMode="contain"
                      source={require('@/assets/images/icons/arrow.png')}
                    />
                  </TouchableOpacity>
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
                                setRecievedYear(undefined);
                                setPageNo(1);
                                setDropdown(false);
                                setSectionListLoading(true);
                                setStatusLabel(item?.title);
                                setStatusDropdown(false);
                                getPaymentPlanStatus(
                                  props?.route?.params?.id,
                                  1,
                                  selectedYear,
                                  item?.title,
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
                                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
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

              {sectionListLoading ? (
                <SectionListSkeleton />
              ) : (
                <View
                  style={{
                    marginTop: 10,
                    zIndex: -2,
                    flex: 1,
                  }}>
                  <SectionList
                    bounces={false}
                    sections={logs}
                    renderItem={renderPaymentData}
                    stickySectionHeadersEnabled={false}
                    renderSectionHeader={({section}) => (
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 15,
                          fontFamily: FONT_FAMILY?.IBMPlexBold,
                          // marginTop: 10,
                          paddingTop: 10,
                          color: theme?.black,
                          backgroundColor: theme?.white,
                          width: '100%',

                          // height: 30,
                        }}>
                        {section.title}
                      </Text>
                    )}
                    style={{
                      width: screenWidth * 0.9,
                      alignSelf: 'center',
                      flex: 1,
                    }}
                    contentContainerStyle={{
                      paddingBottom: 20,
                      alignSelf: 'center',
                      width: '100%',
                    }}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => item?.id}
                    onEndReached={() => {
                      if (logs?.length < length) {
                        getPaymentPlans(
                          props?.route?.params?.id,
                          pageNo + 1,
                          selectedYear,
                          statusLable,
                        );
                        setPageNo(pageNo + 1);
                      }
                    }}
                    onEndReachedThreshold={0}
                    ListEmptyComponent={() => {
                      return (
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: screenHeight * 0.4,
                            width: screenWidth * 0.9,
                            alignSelf: 'center',
                          }}>
                          <Text
                            allowFontScaling={false}
                            style={{
                              fontSize: 16,
                              fontFamily: FONT_FAMILY?.IBMPlexMedium,
                              color: theme?.textGrey,
                              textAlign: 'center',
                            }}>
                            {
                              'No installment available for the selected period.'
                            }
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
                          {length > logs?.length ? (
                            <ActivityIndicator
                              size={'small'}
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
                              {logs?.length > 0 ? '' : ''}
                            </Text>
                          )}
                        </View>
                      );
                    }}
                  />
                </View>
              )}
            </View>
          )}
        </>
      )}
      <PaymenntApprovalPopup
        height={420}
        show={payNow}
        onClose={() => {
          setPayNow(false);
          setClickedItem(0);
        }}
        confirmationText={confirmationText}
        note={note}
        paymentAmount={paymentValue}
        onTouchOutside={() => {
          setPayNow(false);
          setClickedItem(0);
        }}
        onPressProceed={() => {
          setTimeout(() => {
            proceedToPay(paymentValue);
          }, 500);
          // setPayNow(false);
          // setTimeout(() => {
          //   props?.navigation?.navigate('PaymentScreen');
          // }, 200);
        }}
      />
      <DateChangePopup show={show} alertText={'Fetching Updated data....'} />
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
      <ReciptListingPopup
        show={showRecieptViewerPopup}
        onClose={() => {
          setReciepts([]);
          setRecieptViewerPopup(false);
          console.log('tes');
        }}
        onTouchOutside={() => {
          setReciepts([]);
          setRecieptViewerPopup(false);
        }}
        attachData={reciepts}
        renderAttach={renderReciept}
      />
      <DownPaymentPopup
        show={dPPopup}
        text={dPPopupText}
        btnTxtLabel={'OK'}
        onClose={() => {
          setDPPopup(false);
        }}
        onTouchOutside={() => {
          setDPPopup(false);
        }}
        onPressOk={() => {
          setDPPopup(false);
        }}
      />
    </View>
  );
}
