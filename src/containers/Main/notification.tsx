import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import {Headers} from '@/components/header/headers';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import NotificationSkeleton from '@/components/skeletons/notification';
import {
  GetNotifications,
  GetNotificationsPaginated,
  RequestMarkAsAllReadNotifications,
  RequestReadOneNotification,
} from '@/services/apiMethods/notification';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment';
import {Loader} from '@/components/loader';
import {useIsFocused} from '@react-navigation/native';
import {
  setNotificationCounts,
  setUserDetail,
} from '@/redux/slice/UserSlice/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import notifee from '@notifee/react-native';
import PushNotification from 'react-native-push-notification';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  GetNodeNotifications,
  GetNodePaginatedNotifications,
  RequestNodeMarkAsAllReadNotifications,
  RequestNodeReadOneNotification,
  ResetNotificationCount,
} from '@/services/apiMethods/notificationNode';
import {AxiosError} from 'axios';
import { RootState } from '@/redux/store';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
const Notification = props => {
  const focused = useIsFocused();
  const userData = useSelector((state: RootState) => state?.user?.userDetail);
  const [notificationList, setNotificationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMark, setLoadingMark] = useState(false);
  const [pagNo, setPagNo] = useState(1);
  const [wpLength, setWpLength] = useState(0);
  const [nLength, setNLength] = useState(0);
  const [bId, setBId] = useState('');
  const [dId, setDId] = useState('');
  const [fcm, setFcm] = useState('');
  const [wPData, setWPData] = useState(0);
  const [nData, setNData] = useState(0);
  const [apiCrash, setApiCrash] = useState(false);
  useEffect(() => {
    if (Platform.OS == 'ios') {
      notifee.decrementBadgeCount();
    }
    clearAll();
    getNotifications(pagNo);
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, [focused]);
  useLayoutEffect(() => {
    if (props?.route?.params?.from == 'More') {
      props?.navigation?.setOptions({
        gestureEnabled: false,
      });
    }
  }, []);
  const clearAll = async () => {
    await notifee.cancelAllNotifications();
    await PushNotification.cancelAllLocalNotifications();
    PushNotification.setApplicationIconBadgeNumber(0);
    PushNotification.removeAllDeliveredNotifications();
  };
  const getNotifications = async pageNo => {
    try {
      let bundleId = await DeviceInfo.getUniqueId();
      let device = await DeviceInfo.getDeviceName();
      const fcmToken = await messaging().getToken();
      setBId(bundleId);
      setDId(device);
      setFcm(fcmToken);
      let array = [];
      let count = 0;
      let payload = {
        fcm_token: fcmToken,
        identifier: bundleId,
        device_alias: device,
      };
      const notifications = await GetNotificationsPaginated(pageNo, payload);
      setWPData(notifications?.notifications?.length);
      setWpLength(notifications?.pagination?.total_posts);
      if (notifications?.notifications?.length > 0) {
        notifications?.notifications?.map(item => {
          if (item?.title != '' && item?.description != '') {
            array?.push({
              id: item?.id,
              type: item?.post_type,
              notification_text: item?.description,
              notification_title: item?.title,
              time: item?.utc_date,
              projectId: item?.post_id,
              newId: 1234567,
              read_at: item?.is_sent == '0' ? false : true,
              route:
                item?.post_type == 'Project'
                  ? 'ProjectDetails'
                  : item?.post_type == 'Construction Update'
                  ? 'ConstructionUpdateDetail'
                  : 'BlogDetail',
              parent_route:
                item?.post_type == 'Project'
                  ? ''
                  : item?.post_type == 'Construction Update'
                  ? ''
                  : 'Menu',
              from: 'wp',
            });
            if (item?.is_sent == '0') {
              count = count + 1;
            }
          } else if (item?.title == '' && item?.description != '') {
            array?.push({
              id: item?.id,
              type: item?.post_type,
              notification_title: item?.title,
              notification_text: item?.description,
              time: item?.utc_date,
              projectId: item?.post_id,
              newId: 1234567,
              read_at: item?.is_sent == '0' ? false : true,
              route:
                item?.post_type == 'Project'
                  ? 'ProjectDetails'
                  : item?.post_type == 'Construction Update'
                  ? 'ConstructionUpdateDetail'
                  : 'BlogDetail',
              parent_route:
                item?.post_type == 'Project'
                  ? ''
                  : item?.post_type == 'Construction Update'
                  ? ''
                  : 'Menu',
              from: 'wp',
            });
            if (item?.is_sent == '0') {
              count = count + 1;
            }
          } else if (item?.title != '' && item?.description == '') {
            array?.push({
              id: item?.id,
              type: item?.post_type,
              notification_title: item?.title,
              notification_text: item?.description,
              time: item?.utc_date,
              projectId: item?.post_id,
              newId: 1234567,
              read_at: item?.is_sent == '0' ? false : true,
              route:
                item?.post_type == 'Project'
                  ? 'ProjectDetails'
                  : item?.post_type == 'Construction Update'
                  ? 'ConstructionUpdateDetail'
                  : 'BlogDetail',
              parent_route:
                item?.post_type == 'Project'
                  ? ''
                  : item?.post_type == 'Construction Update'
                  ? ''
                  : 'Menu',
              from: 'wp',
            });
            if (item?.is_sent == '0') {
              count = count + 1;
            }
          }
        });
        if (userData?.role != 'guest') {
          const reset = await ResetNotificationCount();
          const notificationNode = await GetNodePaginatedNotifications(pageNo);

          setNData(notificationNode?.rowData?.length);
          setNLength(notificationNode?.count);

          notificationNode?.rowData?.map(itemN => {
            let data = {};
            if (itemN?.data != undefined) {
              data = JSON.parse(itemN?.data);
            }

            array?.push({
              id: itemN?.id,
              type: itemN?.postType,
              notification_text: itemN?.description,
              notification_title: itemN?.title,
              time: itemN?.createdAt,
              projectId: '',
              newId: 1234567,
              read_at: itemN?.is_read,
              route: '',
              parent_route: '',
              from: 'node',
              eventId: itemN?.eventId,
              data: data,
            });
            if (itemN?.is_read == false) {
              count = count + 1;
            }
          });
          let sortedArray = array.sort(
            (a, b) => new Date(b.time) - new Date(a.time),
          );
          setNotificationList(sortedArray);
          setLoading(false);
          dispatchToStore(setNotificationCounts(count));
        } else {
          let sortedArray = array.sort(
            (a, b) => new Date(b.time) - new Date(a.time),
          );
          setNotificationList(sortedArray);
          setLoading(false);
          dispatchToStore(setNotificationCounts(count));
        }
      } else if (userData?.role != 'guest') {
        const reset = await ResetNotificationCount();
        const notificationNode = await GetNodePaginatedNotifications(pageNo);
        setNData(notificationNode?.rowData?.length);
        setNLength(notificationNode?.count);
        if (notificationNode?.rowData?.length > 0) {
          notificationNode?.rowData?.map(itemN => {
            let data = {};
            if (itemN?.data != undefined) {
              data = JSON.parse(itemN?.data);
            }
            array?.push({
              id: itemN?.id,
              type: itemN?.postType,
              notification_text: itemN?.description,
              notification_title: itemN?.title,
              time: itemN?.createdAt,
              projectId: '',
              newId: 1234567,
              read_at: itemN?.is_read,
              route: '',
              parent_route: '',
              from: 'node',
              eventId: itemN?.eventId,
              data: data,
            });
            if (itemN?.is_read == false) {
              count = count + 1;
            }
          });
          let sortedArray = array.sort(
            (a, b) => new Date(b.time) - new Date(a.time),
          );
          setNotificationList(sortedArray);
          setLoading(false);
          dispatchToStore(setNotificationCounts(count));
        } else {
          setNotificationList([]);
          setLoading(false);
          dispatchToStore(setNotificationCounts(count));
        }
      } else {
        setNotificationList([]);
        setLoading(false);
        dispatchToStore(setNotificationCounts(count));
      }
      setLoadingMark(false);
    } catch (err) {
      setLoading(false);
      setLoadingMark(false);
      const error = err as AxiosError;
      console.log('errorerrorerrorerror', error?.response?.data);
      if (error?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 599
      ) {
        setApiCrash(true);
      } else {
        setApiCrash(true);
      }
      crashlytics().log('GetNotifications Api Notifications Screen');
      crashlytics().recordError(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      let bundleId = await DeviceInfo.getUniqueId();
      let device = await DeviceInfo.getDeviceName();
      const fcmToken = await messaging().getToken();

      let payload = {
        fcm_token: fcmToken,
        identifier: bundleId,
        device_alias: device,
      };

      setLoadingMark(true);
      const notifications = await RequestMarkAsAllReadNotifications(payload);
      if (userData?.role != 'guest') {
        const notificationNode = await RequestNodeMarkAsAllReadNotifications();
      }

      getNotifications(1);
    } catch (err) {
      setLoadingMark(false);
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      }
      crashlytics().log('Mark All As Read Api Notifications Screen');
      crashlytics().recordError(error);
    }
  };
  const markOneRead = async id => {
    try {
      let bundleId = await DeviceInfo.getUniqueId();
      let device = await DeviceInfo.getDeviceName();
      const fcmToken = await messaging().getToken();

      let payload = {
        fcm_token: fcmToken,
        identifier: bundleId,
        device_alias: device,
        id: id,
      };

      setLoadingMark(true);
      const notifications = await RequestReadOneNotification(payload);
      setLoadingMark(false);
      let arr = [...notificationList];
      let findIndex = arr?.findIndex(itemX => {
        return itemX?.id == id;
      });
      if (findIndex >= 0) {
        arr[findIndex].read_at = true;
      }
      setNotificationList(arr);
      // getPaginatedNotifications(pagNo);
    } catch (error) {
      setLoadingMark(false);

      crashlytics().log('Mark One Read Api Notifications Screen');
      crashlytics().recordError(error);
    }
  };
  const markOneReadNode = async id => {
    try {
      let payload = {
        id: id,
      };
      setLoadingMark(true);
      const notifications = await RequestNodeReadOneNotification(payload);
      setLoadingMark(false);
      let arr = [...notificationList];
      let findIndex = arr?.findIndex(itemX => {
        return itemX?.id == id;
      });
      if (findIndex >= 0) {
        arr[findIndex].read_at = true;
      }
      setNotificationList(arr);

      // getPaginatedNotifications(pagNo);
    } catch (err) {
      setLoadingMark(false);
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      }
      crashlytics().log('Mark One Read Api Notifications Screen');
      crashlytics().recordError(error);
    }
  };
  const timeFormat = time => {
    if (time.includes('minutes') || time.includes('minute')) {
      return time.replace('minute', 'min');
    } else if (time.includes('seconds') || time.includes('second')) {
      return time.replace('a few second', 'few sec');
    } else {
      return time;
    }
  };
  const renderNotificationListing = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          borderBottomWidth:
            index == notificationList?.length - 1
              ? 0
              : StyleSheet?.hairlineWidth,
          borderBottomColor: theme?.textGrey,
          paddingVertical: 20,
        }}
        activeOpacity={1}
        onPress={() => {
          if (item?.from == 'node') {
            console.log(item?.type);
            markOneReadNode(item?.id);
            if (item?.type == 'activity') {
              props?.navigation?.navigate('SingleLeadDetails', {
                keyId: item?.data?.activityId,
                LeadId: item?.data?.leadId,
                activityType: item?.data?.type,
                overview: item?.data?.overview ? true : false,
              });
            } else if (item?.type == 'lead') {
              props?.navigation?.navigate('SingleLeadDetails', {
                LeadId: item?.eventId,
                overview: item?.data?.overview ? true : false,
              });
            } else if (item?.type == 'financial') {
              // let payload = {
              //     status: item?.data?.invoiceStatus,
              //     property: item?.data?.unit?.propertyId,
              //     unit: item?.data?.unitId,
              //     itemId: item?.data?.id,
              //     from: 'financials',
              //   }
              props?.navigation?.navigate('NotificationItem', {
                status: item?.data?.invoiceStatus,
                property: item?.data?.unit?.propertyId,
                unit: item?.data?.unitId,
                itemId: item?.data?.id,
                from: 'financials',
              });
            } else if (item?.type == 'paymentPlan') {
              props?.navigation?.navigate('NotificationItem', {
                item: {
                  title:
                    item?.data?.contract?.property?.markettingName != undefined
                      ? item?.data?.contract?.property?.markettingName
                      : item?.data?.contract?.property?.name,
                },
                itemNode: {
                  property: {
                    type: item?.data?.contract?.property?.type,
                    location: item?.data?.contract?.property?.location,
                  },
                },
                id: item?.data?.contractId,
                itemId: item?.data?.id,
                unitCode: item?.data?.contract?.unit?.unitCode,
                balance: item?.data?.contract?.balance,
                year: item?.data?.updatedAt,
                from: 'paymentPlan',
              });
            } else if (item?.type == 'contract') {
              props?.navigation?.navigate('PortfolioDetail', {
                from: 'Notification',
                nProjecId: item?.data?.property?.propertyId,
                nSuiteObjectId: item?.data?.id,
                nPropertyId: item?.data?.propertyId,
                nUnitId: item?.data?.unitId,
                nParentId:
                  item?.data?.property?.parentId != null &&
                  item?.data?.property?.parentId != undefined
                    ? item?.data?.property?.parentId
                    : item?.data?.property?.propertyId,
              });
            } else if (item?.type == 'multipleactivity') {
              props?.navigation?.navigate('ActivityDetails', {
                keyId: item?.data?.eventId,
              });
            } else if (item?.type == 'agent' || item?.type == 'customer') {
              props?.navigation?.navigate('userProfile', {
                from: 'notification',
              });
            }
          } else {
            markOneRead(item?.id);
            if (item?.parent_route != '') {
              props?.navigation.navigate(item?.parent_route, {
                screen: item?.route,
                params: {
                  id: item?.projectId,
                },
              });
            } else {
              props?.navigation?.navigate(item?.route, {id: item?.projectId});
            }
          }
        }}
        key={index}>
        <View
          style={{
            height: 10,
            width: 10,
            backgroundColor: item?.read_at ? theme?.textGrey : theme?.logoColor,
            marginTop: 5,
            borderRadius: 10 / 2,
            alignSelf: 'flex-start',
          }}></View>
        <View
          style={{
            marginLeft: 20,
            // flexDirection: 'row',
            height: '100%',
            // justifyContent: 'space-between',
            width: screenWidth * 0.83,
            // backgroundColor: 'red',
          }}>
          <View
            style={{
              // backgroundColor: 'blue',
              width: screenWidth * 0.8,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              allowFontScaling={false}
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                color: theme?.black,
                fontSize: 14,
                fontFamily: item?.read_at
                  ? FONT_FAMILY?.IBMPlexRegular
                  : FONT_FAMILY?.IBMPlexSemiBold,
                flexWrap: 'wrap',
                width: screenWidth * 0.62,
              }}>
              {item?.notification_title}
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.textGrey,
                fontSize: 11,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                // width: screenWidth * 0.18,
                alignSelf: 'baseline',
                // textAlign: 'right',
              }}>
              {timeFormat(moment(item?.time).fromNow())}
            </Text>
          </View>
          <Text
            allowFontScaling={false}
            style={{
              color: theme?.black,
              fontSize: 14,
              fontFamily: item?.read_at
                ? FONT_FAMILY?.IBMPlexRegular
                : FONT_FAMILY?.IBMPlexSemiBold,
              flexWrap: 'wrap',
              width: '95%',
            }}>
            {item?.notification_text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <>
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
        heading={'NOTIFICATIONS'}
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
          if (userData?.role == 'customer') {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'DashboardCustomer'}],
            });
          } else if (userData?.role == 'agent') {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'DashboardAgent'}],
            });
          } else if (props?.route?.params?.from == 'More') {
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
        <NotificationSkeleton />
      ) : (
        <>
          {apiCrash ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  color: theme?.textGrey,
                  textAlign: 'center',
                }}>
                Unable to load data at the moment.
              </Text>
            </View>
          ) : (
            <>
              {notificationList?.length > 0 ? (
                <View style={{flex: 1, paddingHorizontal: 20, marginTop: 20}}>
                  <TouchableOpacity
                    onPress={() => {
                      markAllAsRead();
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        textDecorationLine: 'underline',
                        color: theme?.textGrey,
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      }}>
                      Mark all as read
                    </Text>
                  </TouchableOpacity>
                  <FlatList
                    bounces={false}
                    data={notificationList}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderNotificationListing}
                    onEndReachedThreshold={0}
                    onEndReached={() => {
                      // if (wPData < wpLength || nData < nLength) {
                      //   getPaginatedNotifications(pagNo + 1);
                      //   setPagNo(pagNo + 1);
                      // }
                    }}
                    ListFooterComponent={() => {
                      return (
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          {/* {wPData < wpLength || nData < nLength ? (
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
                          {''}
                        </Text>
                      )} */}
                        </View>
                      );
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: screenHeight * 0.7,

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
                    No notifications at the moment.
                  </Text>
                </View>
              )}
            </>
          )}
        </>
      )}
      {loadingMark && <Loader />}
    </>
  );
};
export default Notification;
