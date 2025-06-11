import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import {Headers} from '@/components/header/headers';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import NotificationSkeleton from '@/components/skeletons/notification';
import {
  GetNotifications,
  RequestMarkAsAllReadNotifications,
  RequestReadOneNotification,
} from '@/services/apiMethods/notification';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment';
import {Loader} from '@/components/loader';
import {useIsFocused} from '@react-navigation/native';
import {setNotificationCounts} from '@/redux/slice/UserSlice/userSlice';
import { dispatchToStore } from '@/redux/store';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import PushNotification from 'react-native-push-notification';
import crashlytics from '@react-native-firebase/crashlytics';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
const ServiceCharges = props => {
  const focused = useIsFocused();
  const [notificationList, setNotificationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMark, setLoadingMark] = useState(false);
  useEffect(() => {
    clearAll();
    getNotifications();
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
  const getNotifications = async () => {
    try {
      let bundleId = await DeviceInfo.getUniqueId();
      let device = await DeviceInfo.getDeviceName();
      const fcmToken = await messaging().getToken();

      let payload = {
        fcm_token: fcmToken,
        identifier: bundleId,
        device_alias: device,
      };
      const notifications = await GetNotifications(payload);

      let array = [];
      let count = 0;
      notifications?.map(item => {
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
              item?.post_type == 'Project' ? 'ProjectDetails' : 'BlogDetail',
            parent_route: item?.post_type == 'Project' ? '' : 'Menu',
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
              item?.post_type == 'Project' ? 'ProjectDetails' : 'BlogDetail',
            parent_route: item?.post_type == 'Project' ? '' : 'Menu',
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
              item?.post_type == 'Project' ? 'ProjectDetails' : 'BlogDetail',
            parent_route: item?.post_type == 'Project' ? '' : 'Menu',
          });
          if (item?.is_sent == '0') {
            count = count + 1;
          }
        }
      });
      setNotificationList(array);
      setLoading(false);
      dispatchToStore(setNotificationCounts(count));
    } catch (error) {
      crashlytics().log('GetNotifications Api Notifications Screen');
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
      getNotifications();
    } catch (error) {
      setLoadingMark(false);

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

          borderBottomWidth: index == notificationList?.length - 1 ? 0 : 0.2,
          borderBottomColor: theme?.textGrey,
          paddingVertical: 20,
        }}
        activeOpacity={1}
        onPress={() => {
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
        }}>
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
            flexDirection: 'row',
            height: '100%',
            justifyContent: 'space-between',
            width: screenWidth * 0.81,
          }}>
          <View style={{}}>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: theme?.black,
                fontSize: 14,
                fontFamily: item?.read_at
                  ? FONT_FAMILY?.IBMPlexRegular
                  : FONT_FAMILY?.IBMPlexSemiBold,
                flexWrap: 'wrap',
                width: screenWidth * 0.63,
              }}>
              {item?.notification_title}
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.black,
                fontSize: 14,
                fontFamily: item?.read_at
                  ? FONT_FAMILY?.IBMPlexRegular
                  : FONT_FAMILY?.IBMPlexSemiBold,
                flexWrap: 'wrap',
                width: screenWidth * 0.63,
              }}>
              {item?.notification_text}
            </Text>
          </View>

          <Text
            allowFontScaling={false}
            style={{
              color: theme?.textGrey,
              fontSize: 12,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              // flexWrap:'wrap',
              // width: screenWidth * 0.19,
            }}>
            {timeFormat(moment(item?.time).fromNow())}
            {/* {moment(item?.time).fromNow().replace('minute','min')||moment(item?.time).fromNow().replace('a few seconds ago','sec')} */}
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
        heading={'SERVICE CHARGES'}
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
        <NotificationSkeleton />
      ) : (
        <>
          {notificationList?.length > 0 ? (
            <View style={{flex: 1, paddingHorizontal: 20, marginTop: 20}}>
              <FlatList
                bounces={false}
                data={notificationList}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={renderNotificationListing}
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
                No new notifications at the moment.
              </Text>
            </View>
          )}
        </>
      )}
      {loadingMark && <Loader />}
    </>
  );
};
export default ServiceCharges;
