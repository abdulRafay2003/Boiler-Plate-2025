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
import MyInvoiceSkeleton from '@/components/skeletons/myInvoiceSkeleton';
import MyPropertiesSkeleton from '@/components/skeletons/myPropertiesSkeleton';
import {ImageProgress} from '@/components/ImageProgress';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
const MyProperties = props => {
  const focused = useIsFocused();
  const [notificationList, setNotificationList] = useState([]);
  const [invoiceList, setInvoiceList] = useState([
    {
      id: 1,
      invoiceNum: 1,
      projectName: 'Bluebell Residence',
      dueAmount: 55000,
      dueDate: '10 Nov 2023',
    },
    {
      id: 2,
      invoiceNum: 2,
      projectName: 'Gulfa Tower',
      dueAmount: 50000,
      dueDate: '11 Nov 2023',
    },
    {
      id: 3,
      invoiceNum: 3,
      projectName: 'Al Ameera Village',
      dueAmount: 45000,
      dueDate: '12 Nov 2023',
    },
    {
      id: 4,
      invoiceNum: 4,
      projectName: 'Bluebell Residence',
      dueAmount: 55000,
      dueDate: '13 Nov 2023',
    },
    {
      id: 5,
      invoiceNum: 5,
      projectName: 'Oasis Tower',
      dueAmount: 65000,
      dueDate: '14 Nov 2023',
    },
  ]);
  const [myPropertiesList, setMyPropertiesList] = useState([]);
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

      setLoadingMark(false);
      getNotifications();
    } catch (error) {
      setLoadingMark(false);

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
  const renderMyPropertyListing = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          marginBottom: 20,
          width: 340,
        }}
        activeOpacity={1}
        onPress={() => {
          //   markOneRead(item?.id);
          //   if (item?.parent_route != '') {
          //     props?.navigation.navigate(item?.parent_route, {
          //       screen: item?.route,
          //       params: {
          //         id: item?.projectId,
          //       },
          //     });
          //   } else {
          props?.navigation?.navigate('ProjectDetails', {id: 5706});
          //   }
        }}>
        {item?.image ? (
          <ImageProgress
            imageSource={item?.image}
            imageStyles={{height: 210, width: 340}}
            imageStyle={{borderRadius: 20, height: 198, width: 335}}
            resizeMode={'contain'}
            activityIndicatorSize={'small'}
            activityIndicatorColor={theme?.logoColor}
          />
        ) : (
          <Image
            source={require('@/assets/images/icons/logo_PH.png')}
            style={{height: 140, width: 140, borderRadius: 10}}
            resizeMode="contain"
          />
        )}
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontSize: 24,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.black,
            width: '100%',
          }}>
          {item?.projectName}
        </Text>
        <View
          style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('@/assets/images/icons/marker.png')}
            style={{
              height: 15,
              width: 15,
              tintColor: theme?.black,
              marginRight: 10,
            }}
            resizeMode="contain"
          />
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 18,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.black,
            }}>
            {item?.location}
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
        heading={'MY PROPERTIES'}
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
      <Text
        allowFontScaling={false}
        style={{
          paddingHorizontal: 20,
          paddingTop: 20,
          fontSize: 20,
          fontFamily: FONT_FAMILY?.IBMPlexMedium,
        }}>
        My Properties
      </Text>
      {loading ? (
        <MyPropertiesSkeleton />
      ) : (
        <>
          {myPropertiesList?.length > 0 ? (
            <View style={{flex: 1, paddingHorizontal: 20, marginTop: 20}}>
              <FlatList
                bounces={false}
                data={myPropertiesList}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={renderMyPropertyListing}
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
                No Property at the moment.
              </Text>
            </View>
          )}
        </>
      )}
      {loadingMark && <Loader />}
    </>
  );
};
export default MyProperties;
