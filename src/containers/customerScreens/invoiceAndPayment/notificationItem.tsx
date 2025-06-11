import React, {useEffect, useState} from 'react';
import {
  View,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {Headers} from '@/components/header/headers';
import {
  FilterPaymentPrdLinkage,
  buttonBackgroundColor,
  buttonHeight,
  buttonText,
  buttonWidth,
  fianacialpaymentRecieptLink,
  finalAmountFinancials,
  finalAmountPaymentPlan,
  formatValue,
  invoiceLink,
  isDateOlderThanCurrentDate,
  paymentPlanBC,
  paymentPlanStatus,
  paymentRecieptLink,
} from '@/utils/business.helper';
import {
  DownPaymentStatus,
  FinancialsListingApi,
  PaymentIntent,
  PaymentPlanById,
} from '@/services/apiMethods/financials';
import moment from 'moment';
import {AxiosError} from 'axios';
import {
  setGotoPayment,
  setLoader,
  setUserDetail,
} from '@/redux/actions/UserActions';
import {useDispatch, useSelector} from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';
import {useIsFocused} from '@react-navigation/native';
import {PaymenntApprovalPopup} from '@/components/modal/paymentApprovalPending';
import {DateChangePopup} from '@/components/modal/dateChangedPopup';
import {AlertPopupAuth} from '@/components/modal/alertPopupAuth';
import {DownPaymentPopup} from '@/components/modal/downpaymentPopup';
import SingleItemSkeleton from '@/components/skeletons/singleItemSkeleton';
import {ReciptListingPopup} from '@/components/modal/recieptPopup';

let screenHeight = Math.round(Dimensions.get('window').height);
let screenWidth = Math.round(Dimensions.get('window').width);

export default function NotificationItem(props) {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const from = props?.route?.params?.from;
  const contractId = props?.route?.params?.id;
  const propertyId = props?.route?.params?.property;
  const unitId = props?.route?.params?.unit;
  const statusLable = props?.route?.params?.status;
  const itemId = props?.route?.params?.itemId;
  const paymentConfigs = useSelector(state => state?.user?.paymentConfigs);
  const backFromPayment = useSelector(state => state?.user?.gotoPayment);
  const [clickedItem, setClickedItem] = useState(0);
  const [fianancialItem, setFinancialItem] = useState({});
  const [paymentPlanItem, setpaymentPlanItem] = useState({});
  const [loading, setLoading] = useState(true);
  console.log('propsprops', props?.route?.params);
  const [logs, setLogs] = useState([]);
  const [selectedYear, setSelecteYear] = useState(`All Years`);
  const [payNow, setPayNow] = useState(false);
  const [paymentValue, setPaymentValue] = useState({});
  const [apiCrashResponse, setApiCrashResponse] = useState(false);
  const [apiCrash, setApiCrash] = useState(false);
  const [note, setNote] = useState('');
  const [url, setUrl] = useState('');
  const [buttonLoader, setButtonLoader] = useState(false);
  const [confirmationText, setConfirmationText] = useState([]);
  const [show, setShow] = useState(false);
  const [dPStatus, setDPStatus] = useState(true);
  const [dPPopup, setDPPopup] = useState(false);
  const [dPPopupText, setDPPopupText] = useState('');
  const [reciepts, setReciepts] = useState([]);
  const [showRecieptViewerPopup, setRecieptViewerPopup] = useState(false);
  const [showLoader, setShowLoader] = useState('');
  const [downloadStart, setDownloadStart] = useState(false);
  useEffect(() => {
    setRecieptViewerPopup(false);
    if (focused == true) {
      if (from == 'financials') {
        getFinancialListing(
          itemId,
          propertyId,
          unitId,
          1,
          statusLable == 'Paid' ? 'paid' : 'unpaid',
          moment(new Date()).format('YYYY-MM-DD'),
          moment(new Date()).format('YYYY-MM-DD'),
        );
      } else {
        getPaymentPlanStatus(contractId, 1, selectedYear, 'All Years');
      }
    }
  }, [focused]);
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);

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

      setLogs([]);

      setShow(false);
      if (error?.response?.status == 401) {
        dispatch(setUserDetail({role: 'guest'}));
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
      let payload = `${id}?id=${itemId}&pageNumber=${pageNo}&pageSize=20`;
      console.log('getPaymentPlanspayload', payload);

      const data = await PaymentPlanById(payload);

      if (data?.rowData?.length > 0) {
        let arr = [];
        data?.rowData?.map(item => {
          arr?.push({
            title: moment(item?.scheduleDate).format('MMMM YYYY'),
            data: [
              {
                ...item,
                dueDate: moment(item?.scheduleDate).format('DD MMM YYYY'),
              },
            ],
          });
        });
        // console.log('getPaymentPlans', arr);

        setpaymentPlanItem({...arr[0]?.data[0], title: arr[0]?.title});
      } else {
        setpaymentPlanItem({});
      }
      setLoading(false);

      setApiCrashResponse(false);
    } catch (err) {
      const error = err as AxiosError;
      console.log('getPaymentPlansgetPaymentPlans', error);

      setLogs([]);

      setShow(false);
      if (error?.response?.status == 401) {
        dispatch(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 500
      ) {
        setApiCrashResponse(true);
      }
      setLoading(false);
    }
  };
  const getFinancialListing = async (
    itemId,
    propertyId,
    unitId,
    pageNum,
    status,
    startDate,
    endDate,
  ) => {
    try {
      let payload = `?id=${itemId}name=${propertyId}&unitId=${unitId}&pageNumber=${pageNum}&pageSize=10&status=${status}&start_date=${startDate}&end_date=${endDate}`;
      console.log('======>', payload);
      const financialListData = await FinancialsListingApi(payload);
      console.log('getFinancialListingpayload', financialListData);
      if (financialListData?.rowData?.length > 0) {
        setFinancialItem(financialListData?.rowData[0]);
        setApiCrashResponse(false);
        setLoading(false);
      } else {
        setFinancialItem({});
        setApiCrashResponse(false);
        setLoading(false);
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log('getFinancialListingerror', error);
      if (error?.response?.status == 401) {
        dispatch(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 599
      ) {
        setApiCrashResponse(true);
      }
      setLoading(false);
      crashlytics().log('Get Portofilio Listing Api on Dashboard');
      crashlytics().recordError(error);
    }
  };

  const getUrlPaymentPlan = async paymentValue => {
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
      setUrl(paymentUrl?.paylink);
      setPaymentValue({
        ...paymentValue,
        pay: paymentUrl?.breakdown?.totalAmt,
      });
      const getfinalAmount = finalAmountPaymentPlan(
        paymentUrl?.breakdown,
        paymentValue?.scheduleAmt,
      );
      setConfirmationText(getfinalAmount?.object?.main);
      setNote(getfinalAmount?.object?.note);
      setPayNow(getfinalAmount?.state);

      setApiCrash(false);
      return;
    } catch (err) {
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
      dispatch(setLoader(false));
      crashlytics().log('Get Url Api Dashboard');
      crashlytics().recordError(error);
    }
  };

  const getUrlFinancials = async paymentValue => {
    try {
      let payload = {
        orderParams: {
          order_id: paymentValue?.invoiceId,
          amount: paymentValue?.foreignamount,
          language: 'en',
        },
      };
      const paymentUrl = await PaymentIntent(payload);
      console.log('sdfghjkl;', paymentUrl);
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
        // dispatch(setGotoPayment(true));
        props?.navigation?.navigate('PaymentScreen', {
          url: url,
        });
      } else {
        setButtonLoader(true);
        if (from == 'financials') {
          getUrlFinancials(paymentValue);
        } else {
        }
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
            name: `Reciept No ${index + 1}`,
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
        heading={from == 'financials' ? 'Financials' : 'Payment Plan'}
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
        <SingleItemSkeleton from={from} />
      ) : (
        <View
          style={{
            width: screenWidth * 0.9,
            alignSelf: 'center',
            marginTop: 40,
          }}>
          {from == 'financials' ? (
            <>
              {fianancialItem?.transactionId != undefined ? (
                <View
                  style={{
                    minHeight: 140,
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    backgroundColor: theme?.paymentPlanGrey,
                    marginTop: 10,
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: StyleSheet?.hairlineWidth,
                    borderColor: theme?.greyText,
                    width: '100%',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 16,
                        fontFamily: FONT_FAMILY?.IBMPlexMedium,
                        color: theme?.black,
                        width: '65%',
                      }}>
                      {fianancialItem?.transactionId}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 16,
                        fontFamily: FONT_FAMILY?.IBMPlexMedium,
                        color: theme?.black,
                      }}>
                      {`${fianancialItem?.currency} ${formatValue(
                        fianancialItem?.foreignamount,
                      )}`}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 14,
                        fontFamily: FONT_FAMILY?.IBMPlexMedium,
                        color: theme?.textGrey,
                        width: '50%',
                      }}>
                      {fianancialItem?.invoiceType}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 14,
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                        color:
                          isDateOlderThanCurrentDate(
                            fianancialItem?.invoiceStatus,
                            fianancialItem?.dueDate,
                          ) == 'Less than a day' &&
                          isDateOlderThanCurrentDate(
                            fianancialItem?.invoiceStatus,
                            fianancialItem?.dueDate,
                          ) == ''
                            ? theme?.lightGreen
                            : theme?.brightRed,
                      }}>
                      {fianancialItem?.invoiceStatus == 'Invoice : Open'
                        ? isDateOlderThanCurrentDate(
                            fianancialItem?.invoiceStatus,
                            fianancialItem?.dueDate,
                          )
                        : isDateOlderThanCurrentDate(
                            fianancialItem?.invoiceStatus,
                            new Date(),
                          )}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View style={{}}>
                      {fianancialItem?.createdAt != null && (
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: 14,
                            fontFamily: FONT_FAMILY?.IBMPlexMedium,
                            color: theme?.textGrey,
                          }}>
                          {`Invoice Date: ${moment(
                            fianancialItem?.createdAt,
                          ).format('DD MMM YYYY')}`}
                        </Text>
                      )}
                      {fianancialItem?.dueDate != null && (
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: 14,
                            fontFamily: FONT_FAMILY?.IBMPlexMedium,
                            color: theme?.textGrey,
                          }}>
                          {`Due Date: ${moment(fianancialItem?.dueDate).format(
                            'DD MMM YYYY',
                          )}`}
                        </Text>
                      )}
                      {fianancialItem?.paymentDate != null && (
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: 14,
                            fontFamily: FONT_FAMILY?.IBMPlexMedium,
                            color: theme?.textGrey,
                          }}>
                          {`Transaction Date: ${moment(
                            fianancialItem?.paymentDate,
                          ).format('DD MMM YYYY')}`}
                        </Text>
                      )}
                    </View>
                    {fianacialpaymentRecieptLink(
                      fianancialItem?.paymentRecieptUrl,
                      fianancialItem?.invoiceStatus,
                    ) == true ? (
                      <TouchableOpacity
                        activeOpacity={0.9}
                        style={{height: 30, justifyContent: 'center'}}
                        onPress={() => {
                          props?.navigation?.navigate('Reciept', {
                            paymentRecieptUrl:
                              fianancialItem?.paymentRecieptUrl,
                            name: fianancialItem?.transactionId,
                          });
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: 12,
                            fontFamily: FONT_FAMILY?.IBMPlexRegular,
                            color: theme?.black,
                            textDecorationLine: 'underline',
                          }}>
                          View Reciept
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View
                        style={{
                          height: 30,
                          width: 70,
                          justifyContent: 'center',
                        }}
                      />
                    )}
                  </View>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    {invoiceLink(fianancialItem?.invoiceUrl) == true ? (
                      <TouchableOpacity
                        activeOpacity={0.9}
                        style={{
                          height: 30,
                          width: 70,
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          props?.navigation?.navigate('Invoice', {
                            invoiceUrl: fianancialItem?.invoiceUrl,
                            name: fianancialItem?.transactionId,
                          });
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: 12,
                            fontFamily: FONT_FAMILY?.IBMPlexRegular,
                            color: theme?.black,
                            textDecorationLine: 'underline',
                          }}>
                          View Invoice
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View
                        style={{
                          height: 30,
                          width: 70,
                          justifyContent: 'center',
                        }}
                      />
                    )}
                    <>
                      {fianancialItem?.allowPayment ? (
                        <>
                          {fianancialItem?.invoiceStatus == 'Invoice : Open' ? (
                            <TouchableOpacity
                              style={{
                                height: buttonHeight(
                                  fianancialItem?.invoiceStatus,
                                ),
                                width: buttonWidth(
                                  fianancialItem?.invoiceStatus,
                                ),
                                backgroundColor: buttonBackgroundColor(
                                  fianancialItem?.invoiceStatus,
                                ),
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              activeOpacity={1}
                              disabled={clickedItem > 0}
                              onPress={() => {
                                setClickedItem(fianancialItem?.id);
                                getUrlFinancials(fianancialItem);
                              }}>
                              {clickedItem == fianancialItem?.id ? (
                                <ActivityIndicator
                                  size={'small'}
                                  color={theme?.white}
                                />
                              ) : (
                                <Text
                                  allowFontScaling={false}
                                  style={{
                                    fontSize: 12,
                                    fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                                    color: theme?.white,
                                  }}>
                                  {buttonText(fianancialItem?.invoiceStatus)}
                                </Text>
                              )}
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={{
                                height: buttonHeight(
                                  fianancialItem?.invoiceStatus,
                                ),
                                width: buttonWidth(
                                  fianancialItem?.invoiceStatus,
                                ),
                                backgroundColor: buttonBackgroundColor(
                                  fianancialItem?.invoiceStatus,
                                ),
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              activeOpacity={1}
                              disabled={true}
                              onPress={() => {
                                setClickedItem(fianancialItem?.id);
                                getUrlFinancials(fianancialItem);
                              }}>
                              {clickedItem == fianancialItem?.id ? (
                                <ActivityIndicator
                                  size={'small'}
                                  color={theme?.white}
                                />
                              ) : (
                                <Text
                                  allowFontScaling={false}
                                  style={{
                                    fontSize: 12,
                                    fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                                    color:
                                      fianancialItem?.invoiceStatus ==
                                      'Invoice : Open'
                                        ? theme?.white
                                        : theme?.white,
                                  }}>
                                  {buttonText(fianancialItem?.invoiceStatus)}
                                </Text>
                              )}
                            </TouchableOpacity>
                          )}
                        </>
                      ) : (
                        <View
                          style={{
                            height: 26,
                            width: 200,
                            backgroundColor: theme?.transparent,
                            borderRadius: 8,
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                          }}>
                          <Text
                            allowFontScaling={false}
                            style={{
                              fontSize: 11,
                              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                              color: theme?.logoColor,
                            }}>
                            {fianancialItem?.unallowPaymentText}
                          </Text>
                        </View>
                      )}
                    </>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: theme?.white,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 100,
                    alignSelf: 'center',
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
              )}
            </>
          ) : (
            <>
              {paymentPlanItem.title != undefined ? (
                <View style={{marginTop: 0}}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 15,
                      fontFamily: FONT_FAMILY?.IBMPlexBold,
                      paddingTop: 10,
                      color: theme?.black,
                      backgroundColor: theme?.white,
                      width: '100%',
                    }}>
                    {paymentPlanItem.title}
                  </Text>
                  <View
                    style={{
                      height: 150,
                      justifyContent: 'space-between',
                      backgroundColor: theme?.paymentPlanGrey,
                      marginTop: 10,
                      padding: 10,
                      borderRadius: 10,
                      borderWidth: StyleSheet?.hairlineWidth,
                      borderColor: theme?.greyText,
                    }}>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        width: '100%',
                        flexDirection: 'row',
                      }}>
                      <Text
                        allowFontScaling={false}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          fontSize: 16,
                          fontFamily: FONT_FAMILY?.IBMPlexMedium,
                          color: theme?.black,
                          width: '70%',
                        }}>
                        {paymentPlanItem?.installmentNo}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 16,
                          fontFamily: FONT_FAMILY?.IBMPlexMedium,
                          color: theme?.black,
                        }}>
                        AED {formatValue(paymentPlanItem?.scheduleAmt)}
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        width: '100%',
                        flexDirection: 'row',
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 13,
                          fontFamily: FONT_FAMILY?.IBMPlexMedium,
                          color: theme?.greyText,
                        }}>
                        Due Date
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 13,
                          fontFamily: FONT_FAMILY?.IBMPlexMedium,
                          color: theme?.black,
                        }}>
                        {paymentPlanItem?.dueDate}
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        width: '100%',
                        flexDirection: 'row',
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 13,
                          fontFamily: FONT_FAMILY?.IBMPlexMedium,
                          color: theme?.greyText,
                        }}>
                        Recieved Amount
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 13,
                          fontFamily: FONT_FAMILY?.IBMPlexMedium,
                          color: theme?.black,
                        }}>
                        AED {formatValue(paymentPlanItem?.receivedAmount)}
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        width: '100%',
                        flexDirection: 'row',
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 13,
                          fontFamily: FONT_FAMILY?.IBMPlexMedium,
                          color: theme?.greyText,
                        }}>
                        Realized Amount
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 13,
                          fontFamily: FONT_FAMILY?.IBMPlexMedium,
                          color: theme?.black,
                        }}>
                        AED {formatValue(paymentPlanItem?.realisedAmount)}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '100%',
                        alignItems: 'flex-end',

                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      {paymentRecieptLink(
                        paymentPlanItem?.PaymentPrdLinkage,
                        paymentPlanItem?.paymentStatus,
                      ) == true ? (
                        <TouchableOpacity
                          activeOpacity={0.9}
                          style={{height: 30, justifyContent: 'center'}}
                          onPress={() => {
                            setRecieptViewerPopup(true);
                            let arr = FilterPaymentPrdLinkage(
                              paymentPlanItem?.PaymentPrdLinkage,
                            );
                            setReciepts(arr);
                          }}>
                          <Text
                            allowFontScaling={false}
                            style={{
                              fontSize: 11,
                              fontFamily: FONT_FAMILY?.IBMPlexRegular,
                              color: theme?.black,
                              textDecorationLine: 'underline',
                            }}>
                            View Reciept
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View
                          style={{
                            height: 30,
                            width: 70,
                            justifyContent: 'center',
                          }}
                        />
                      )}

                      {paymentPlanItem?.allowPayment ? (
                        <>
                          {paymentPlanStatus(paymentPlanItem?.paymentStatus) ? (
                            <TouchableOpacity
                              style={{
                                height: 26,
                                width: 78,
                                backgroundColor: theme?.logoColor,
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              activeOpacity={1}
                              onPress={() => {
                                getUrlPaymentPlan(paymentPlanItem);
                              }}
                              disabled={clickedItem > 0}>
                              <Text
                                allowFontScaling={false}
                                style={{
                                  fontSize: 12,
                                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                                  color: theme?.white,
                                }}>
                                Pay Now
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <View
                              style={{
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Text
                                allowFontScaling={false}
                                style={{
                                  fontSize: 12,
                                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                                  color: theme?.logoColor,
                                }}>
                                {paymentPlanItem?.shouldBeDisabled
                                  ? paymentPlanItem?.shouldBeDisabledText
                                  : paymentPlanItem?.paymentStatusText}
                              </Text>
                            </View>
                          )}
                        </>
                      ) : (
                        <View
                          style={{
                            height: 26,
                            width: 200,
                            backgroundColor: theme?.transparent,
                            borderRadius: 8,
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                          }}>
                          <Text
                            allowFontScaling={false}
                            style={{
                              fontSize: 11,
                              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                              color: theme?.logoColor,
                            }}>
                            {paymentPlanItem?.unallowPaymentText}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: theme?.white,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 100,
                    alignSelf: 'center',
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
              )}
            </>
          )}
        </View>
      )}

      <PaymenntApprovalPopup
        height={from == 'financials' ? 270 : 420}
        show={payNow}
        onClose={() => {
          setClickedItem(0);
          setPayNow(false);
        }}
        confirmationText={confirmationText}
        note={note == '' ? undefined : note}
        paymentAmount={paymentValue}
        onTouchOutside={() => {
          setClickedItem(0);

          setPayNow(false);
        }}
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
