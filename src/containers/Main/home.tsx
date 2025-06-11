import React, {useEffect, useState, useRef} from 'react';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
  ScrollView,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  ActivityIndicator,
  AppState,
  Linking,
  Alert,
} from 'react-native';
// import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import {MaterialTabBar, Tabs} from 'react-native-collapsible-tab-view';
import LinearGradient from 'react-native-linear-gradient';
import { dispatchToStore, RootState } from '@/redux/store';
import {
  setAlertState,
  setContactDetails,
  setDeviceRegistered,
  setNotificationCounts,
} from '@/redux/slice/UserSlice/userSlice';
import {
  GetHomeHeader,
  GetPaginatedProjects,
  GetProjectCategories,
} from '@/services/apiMethods/home';
import HomeSkeleton from '@/components/skeletons/home';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';
import List from '@/components/skeletons/list';
import {GetContactUs} from '@/services/apiMethods/more';
import {
  GetNotifications,
  RegisterDevice,
  ResetNotificationCountWP,
} from '@/services/apiMethods/notification';
import {useIsFocused} from '@react-navigation/native';
import {ImageProgress} from '@/components/ImageProgress';
import ProjectSkeleton from '@/components/skeletons/projectsSkeleton';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import ProjectTabSkeleton from '@/components/skeletons/projectsTab';
// import RNExitApp from 'react-native-exit-app';
import VersionCheck from 'react-native-version-check';
import {useSelector} from 'react-redux';
import axios, {AxiosError} from 'axios';
import {BASE_URL} from '@/services/mainServices/config';
import {
  GetNodeNotifications,
  ResetNotificationCount,
} from '@/services/apiMethods/notificationNode';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

const Home = props => {
  const flatListRef = useRef();
  const flatListRef1 = useRef();
  const alertState = useSelector((state: RootState) => state?.user?.alertState);
  const count = useSelector((state: RootState) => state?.user?.notificationCount);
  const userData = useSelector((state: RootState) => state?.user?.userDetail);
  const [page, setPage] = useState(1);
  const [lengthRTM, setLengthRTM] = useState(0);
  const [lengthUC, setLengthUC] = useState(0);
  const [listLoader, setListLoader] = useState(true);
  const [loading, setLoading] = useState(true);
  const [headerSke, setHeaderSke] = useState(true);
  const [tabSke, setTabSke] = useState(true);
  const [bannerData, setBannerData] = useState([]);
  const [rTMIPageNo, setRTMIPageNo] = useState(1);
  const [uCPageNo, setUCPageNo] = useState(1);
  const [tabList, setTabList] = useState([
    {uuid: '1', name: 'Ready To Move In'},
    {uuid: '2', name: 'Under Construction'},
  ]);
  const [readyToMove, setReadyToMove] = useState([]);
  const [underConstruction, setUnderConstruction] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedBanner, setselectedBanner] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [listEmptyLoader, setListEmptyLoader] = useState(true);
  const [projectLoader, setProjectLoader] = useState(true);
  const [apiCrash, setApiCrash] = useState(false);
  const paginationDotWidth = 16; // Customize based on your dot width
  const paginationDotMargin = 8; // Customize based on your dot margin
  const carouselRef = useRef(null);
  const scrollViewRef = useRef(null);
  const focused = useIsFocused();

  PushNotification.configure({
    onRegister: function (token) {},

    onNotification: async function (notification) {
      if (notification.userInteraction) {
        getNotifications();
        const route =
          notification?.data?.post_type == 'Project'
            ? 'ProjectDetails'
            : notification?.data?.post_type == 'Construction Update'
            ? 'ConstructionUpdateDetail'
            : notification?.data?.type == 'agent'
            ? 'userProfile'
            : notification?.data?.type == 'customer'
            ? 'userProfile'
            : notification?.data?.type == 'activity'
            ? 'SingleLeadDetails'
            : notification?.data?.type == 'multipleactivity'
            ? 'ActivityDetails'
            : notification?.data?.type == 'lead'
            ? 'SingleLeadDetails'
            : notification?.data?.type == 'financial'
            ? 'NotificationItem'
            : notification?.data?.type == 'contract'
            ? 'PortfolioDetail'
            : notification?.data?.type == 'paymentPlan'
            ? 'NotificationItem'
            : notification?.data?.type == 'general'
            ? 'Notification'
            : 'BlogDetail';
        const parent_route =
          notification?.data?.post_type == 'Project'
            ? ''
            : notification?.data?.post_type == 'Construction Update'
            ? userData?.role == 'agent'
              ? 'ADashboard'
              : 'CDashboard'
            : notification?.data?.type == 'agent'
            ? ''
            : notification?.data?.type == 'customer'
            ? ''
            : notification?.data?.type == 'activity'
            ? 'ADashboard'
            : notification?.data?.type == 'multipleactivity'
            ? 'ADashboard'
            : notification?.data?.type == 'lead'
            ? 'ADashboard'
            : notification?.data?.type == 'financial'
            ? 'CDashboard'
            : notification?.data?.type == 'contract'
            ? 'CDashboard'
            : notification?.data?.type == 'paymentPlan'
            ? 'CDashboard'
            : notification?.data?.type == 'general'
            ? ''
            : 'Menu';

        if (parent_route != '') {
          let params;
          if (route == 'SingleLeadDetails') {
            if (notification?.data?.data != undefined) {
              let jsonData = JSON.parse(notification.data.data);
              params = {
                LeadId:
                  notification.data?.type == 'activity'
                    ? jsonData?.lead?.id
                    : jsonData?.id,
                keyId: jsonData?.activityId,
                activityType: jsonData?.type,
                overview: jsonData?.overview ? true : false,
              };
            }
            // else {
            //   let jsonData = JSON.parse(notification.data.data);
            //   params = {
            //     LeadId: notification?.data?.id,
            //     overview: jsonData?.overview ? true : false,
            //   };
            // }
          } else if (route == 'userProfile') {
            params = {
              from: 'notification',
            };
          } else if (route == 'NotificationItem') {
            if (notification?.data?.data != undefined) {
              let jsonData = JSON.parse(notification.data.data);
              if (notification?.data?.type == 'paymentPlan') {
                params = {
                  item: {
                    title:
                      jsonData?.contract?.property?.markettingName != undefined
                        ? jsonData?.contract?.property?.markettingName
                        : jsonData?.contract?.property?.name,
                  },
                  itemNode: {
                    property: {
                      type: jsonData?.contract?.property?.type,
                      location: jsonData?.contract?.property?.location,
                    },
                  },
                  id: jsonData?.contractId,
                  itemId: jsonData?.id,
                  unitCode: jsonData?.contract?.unit?.unitCode,
                  balance: jsonData?.contract?.balance,
                  year: jsonData?.updatedAt,
                  from: 'paymentPlan',
                };
              } else {
                params = {
                  status: jsonData?.invoiceStatus,
                  property: jsonData?.unit?.propertyId,
                  unit: jsonData?.unitId,
                  itemId: jsonData?.id,
                  from: 'financials',
                };
              }
            }
          } else if (route == 'PortfolioDetail') {
            let jsonData = JSON.parse(notification?.data?.data);
            // console.log('notification json data', jsonData);
            params = {
              from: 'Notification',
              nProjecId: jsonData?.property?.propertyId,
              nSuiteObjectId: jsonData?.id,
              nPropertyId: jsonData?.propertyId,
              nUnitId: jsonData?.unitId,
              nParentId:
                jsonData?.property?.parentId != null &&
                jsonData?.property?.parentId != undefined
                  ? jsonData?.property?.parentId
                  : jsonData?.property?.propertyId,
            };
          } else if (route == 'ActivityDetails') {
            params = {
              keyId: notification?.data?.eventId,
            };
          } else {
            params = {
              id: notification?.data?.post_id,
            };
          }
          props?.navigation.navigate(parent_route, {
            screen: route,
            params: params,
          });
        } else {
          props?.navigation?.navigate(route, {id: notification?.data?.post_id});
        }
      }
    },

    onAction: async function (notification) {
      console.log('onAction', notification);
    },
    onRegistrationError: function (err) {},
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });

  PushNotification.createChannel(
    {
      channelId: 'myGJChannel', // (required)
      channelName: 'myGJChannel', // (required)
      channelDescription: 'A channel to categorise your notifications',
      soundName: 'default',
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    created => console.log(`createChannel returned '${created}'`),
  );

  // useEffect(() => {
  //   if (AppState.currentState == 'background' && Platform.OS == 'ios') {
  //     RNExitApp.exitApp();
  //   }
  //   messaging()
  //     .getInitialNotification()
  //     .then(remoteMessage => {
  //       if (remoteMessage) {
  //       }
  //     });

  //   const unsubscribe = messaging().onMessage(async remoteMessage => {});

  //   const unsubscribeForegroundOpenApp = notifee.onForegroundEvent(
  //     async ({type, detail}) => {
  //       switch (type) {
  //         case EventType.PRESS:
  //           let jsonData = JSON.parse(detail?.notification.data.data);

  //           if (detail.notification && detail.notification.data) {
  //             const route =
  //               detail?.notification?.data?.post_type == 'Project'
  //                 ? 'ProjectDetails'
  //                 : detail?.notification?.data?.post_type ==
  //                   'Construction Update'
  //                 ? 'ConstructionUpdateDetail'
  //                 : detail?.notification?.data?.type == 'agent'
  //                 ? 'userProfile'
  //                 : detail?.notification?.data?.type == 'customer'
  //                 ? 'userProfile'
  //                 : detail?.notification?.data?.type == 'activity'
  //                 ? 'SingleLeadDetails'
  //                 : detail?.notification?.data?.type == 'multipleactivity'
  //                 ? 'ActivityDetails'
  //                 : detail?.notification?.data?.type == 'lead'
  //                 ? 'SingleLeadDetails'
  //                 : detail?.notification?.data?.type == 'financial'
  //                 ? 'NotificationItem'
  //                 : detail?.notification?.data?.type == 'contract'
  //                 ? 'PortfolioDetail'
  //                 : detail?.notification?.data?.type == 'paymentPlan'
  //                 ? 'NotificationItem'
  //                 : detail?.notification?.data?.type == 'general'
  //                 ? 'Notification'
  //                 : 'BlogDetail';
  //             const parent_route =
  //               detail?.notification?.data?.post_type == 'Project'
  //                 ? ''
  //                 : detail?.notification?.data?.post_type ==
  //                   'Construction Update'
  //                 ? userData?.role == 'agent'
  //                   ? 'ADashboard'
  //                   : 'CDashboard'
  //                 : detail?.notification?.data?.type == 'agent'
  //                 ? ''
  //                 : detail?.notification?.data?.type == 'customer'
  //                 ? ''
  //                 : detail?.notification?.data?.type == 'activity'
  //                 ? 'ADashboard'
  //                 : detail?.notification?.data?.type == 'multipleactivity'
  //                 ? 'ADashboard'
  //                 : detail?.notification?.data?.type == 'lead'
  //                 ? 'ADashboard'
  //                 : detail?.notification?.data?.type == 'financial'
  //                 ? 'CDashboard'
  //                 : detail?.notification?.data?.type == 'contract'
  //                 ? 'CDashboard'
  //                 : detail?.notification?.data?.type == 'paymentPlan'
  //                 ? 'CDashboard'
  //                 : detail?.notification?.data?.type == 'general'
  //                 ? ''
  //                 : 'Menu';
  //             if (parent_route != '') {
  //               let params;
  //               if (route == 'SingleLeadDetails') {
  //                 if (detail?.notification?.data?.data != undefined) {
  //                   let jsonData = JSON.parse(detail.notification.data.data);
  //                   params = {
  //                     LeadId:
  //                       detail?.notification.data?.type == 'activity'
  //                         ? jsonData?.lead?.id
  //                         : jsonData?.id,
  //                     keyId: jsonData?.activityId,
  //                     activityType: jsonData?.type,
  //                     overview: jsonData?.overview ? true : false,
  //                   };
  //                 }
  //                 // else {
  //                 //   let jsonData = JSON.parse(detail.notification.data.data);
  //                 //   params = {
  //                 //     LeadId: detail.notification?.data?.id,
  //                 //     overview: jsonData?.overview ? true : false,
  //                 //   };
  //                 // }
  //               } else if (route == 'userProfile') {
  //                 params = {
  //                   from: 'notification',
  //                 };
  //               } else if (route == 'NotificationItem') {
  //                 if (detail?.notification?.data?.data != undefined) {
  //                   let jsonData = JSON.parse(detail?.notification.data.data);
  //                   if (detail?.notification?.data?.type == 'paymentPlan') {
  //                     params = {
  //                       item: {
  //                         title:
  //                           jsonData?.contract?.property?.markettingName !=
  //                           undefined
  //                             ? jsonData?.contract?.property?.markettingName
  //                             : jsonData?.contract?.property?.name,
  //                       },
  //                       itemNode: {
  //                         property: {
  //                           type: jsonData?.contract?.property?.type,
  //                           location: jsonData?.contract?.property?.location,
  //                         },
  //                       },
  //                       id: jsonData?.contractId,
  //                       itemId: jsonData?.id,
  //                       unitCode: jsonData?.contract?.unit?.unitCode,
  //                       balance: jsonData?.contract?.balance,
  //                       year: jsonData?.updatedAt,
  //                       from: 'paymentPlan',
  //                     };
  //                   } else {
  //                     params = {
  //                       status: jsonData?.invoiceStatus,
  //                       property: jsonData?.unit?.propertyId,
  //                       unit: jsonData?.unitId,
  //                       itemId: jsonData?.id,
  //                       from: 'financials',
  //                     };
  //                   }
  //                 }
  //               } else if (route == 'PortfolioDetail') {
  //                 let jsonData = JSON.parse(detail?.notification?.data?.data);
  //                 params = {
  //                   from: 'Notification',
  //                   nProjecId: jsonData?.property?.propertyId,
  //                   nSuiteObjectId: jsonData?.id,
  //                   nPropertyId: jsonData?.propertyId,
  //                   nUnitId: jsonData?.unitId,
  //                   nParentId:
  //                     jsonData?.property?.parentId != null &&
  //                     jsonData?.property?.parentId != undefined
  //                       ? jsonData?.property?.parentId
  //                       : jsonData?.property?.propertyId,
  //                 };
  //               } else if (route == 'ActivityDetails') {
  //                 params = {
  //                   keyId: detail?.notification?.data?.eventId,
  //                 };
  //               } else {
  //                 params = {
  //                   id: detail?.notification?.data?.post_id,
  //                 };
  //               }
  //               props?.navigation.navigate(parent_route, {
  //                 screen: route,
  //                 params: params,
  //               });
  //             } else {
  //               props?.navigation?.navigate(route, {
  //                 id: detail?.notification?.data?.post_id,
  //               });
  //             }
  //             // const route =
  //             //   detail?.notification?.data?.post_type == 'Project'
  //             //     ? 'ProjectDetails'
  //             //     : detail?.notification?.data?.type == 'lead'
  //             //     ? 'SingleLeadDetails'
  //             //     : detail?.notification?.data?.type == 'activity'
  //             //     ? 'ActivityDetails'
  //             //     : 'BlogDetail';

  //             // const parent_route =
  //             //   detail?.notification?.data?.post_type == 'Project'
  //             //     ? ''
  //             //     : detail?.notification?.data?.type == 'activity'
  //             //     ? 'ADashboard'
  //             //     : detail?.notification?.data?.type == 'lead'
  //             //     ? 'ADashboard'
  //             //     : 'Menu';
  //             // if (parent_route != '') {
  //             //   let params;
  //             //   if (detail?.notification?.data?.type == 'activity') {
  //             //     params = {
  //             //       keyId: detail?.notification?.data?.id,
  //             //     };
  //             //   } else if (detail?.notification?.data?.type == 'lead') {
  //             //     params = {
  //             //       LeadId: detail?.notification?.data?.id,
  //             //     };
  //             //   } else {
  //             //     params = {
  //             //       id: detail?.notification?.data?.post_id,
  //             //     };
  //             //   }
  //             //   props?.navigation.navigate(parent_route, {
  //             //     screen: route,
  //             //     params: params,
  //             //   });
  //             // } else {
  //             //   props?.navigation?.navigate(route, {
  //             //     id: detail?.notification?.data?.post_id,
  //             //   });
  //             // }
  //           }
  //           break;
  //       }
  //     },
  //   );

  //   return () => {
  //     unsubscribe();
  //     unsubscribeForegroundOpenApp();
  //   };
  // }, []);
  useEffect(() => {
    checkVersion();
    requestUserPermissionForNotification();
    notificationConfigure();
    getWholeData();
    // getHeaderData();
    // getProjectCategories();
    registerDeviceOnBackend();
    getContact();
    requestPermission();
    setTabIndex(0);
    setLengthRTM(0);
    setLengthUC(0);
    setRTMIPageNo(1);
    setUCPageNo(1);
    if (flatListRef) {
      flatListRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
    }
    if (flatListRef1) {
      flatListRef1?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
    }
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, [focused]);

  useEffect(() => {
    // Scroll the pagination dots horizontally
    if (scrollViewRef) {
      // setTimeout(() => {
      scrollViewRef?.current?.scrollTo({
        x: selectedBanner * (paginationDotWidth + paginationDotMargin), // Adjust based on your dot size and margin
        animated: true,
      });
      // }, 200);
    }
  }, [selectedBanner]);
  // =============================

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      // Unsubscribe from the app state change event when component is unmounted
      subscription.remove();
    };
  }, [alertState]);

  const handleAppStateChange = async nextAppState => {
    if (nextAppState === 'active') {
      // The app is back in the foreground

      if (!alertState) {
        dispatchToStore(setAlertState(true));

        checkVersion();
      }

      // You can trigger any action you want here
    }
  };
  // ===========================
  const checkVersion = async () => {
    try {
      let currentVersion = await VersionCheck.getCurrentVersion();

      let latestVersion;
      if (Platform.OS == 'ios') {
        latestVersion = await VersionCheck.getLatestVersion({
          provider: 'appStore', // for iOS
        });
      } else {
        latestVersion = await VersionCheck.getLatestVersion({
          provider: 'playStore', // for android
        });
        // latestVersion = '2.4';
      }

      let cv = parseInt(currentVersion);
      let lv = parseInt(latestVersion);

      if (cv < lv) {
        dispatchToStore(setAlertState(true));
        updateAppAlert(currentVersion, latestVersion);
      } else {
        dispatchToStore(setAlertState(false));
      }
    } catch (error) {
      console.log('checkVersionerror', error);
    }
  };
  const updateAppAlert = (currentVersion, latestVersion) => {
    Alert.alert(
      'GJ Properties',
      'A new version is available, please update before proceed.',
      [
        {
          text: 'Update',
          onPress: () => {
            dispatchToStore(setAlertState(false));
            updateApp(currentVersion, latestVersion);
          },
        },
      ],
    );
  };
  const updateApp = async (currentVersion, latestVersion) => {
    try {
      await VersionCheck.needUpdate({
        currentVersion: currentVersion,
        latestVersion: latestVersion,
      }).then(res => {
        if (Platform.OS == 'ios') {
          Linking.openURL(
            'https://apps.apple.com/us/app/gj-properties/id6466648986',
          );
        } else {
          Linking.openURL(
            'https://play.google.com/store/apps/details?id=com.gjproperties',
          );
        }
      });
    } catch (error) {}
  };
  const getNotifications = async () => {
    let bundleId = await DeviceInfo.getUniqueId();
    let device = await DeviceInfo.getDeviceName();
    const fcmToken = await messaging().getToken();
    try {
      let payload = {
        fcm_token: fcmToken,
        identifier: bundleId,
        device_alias: device,
      };

      const notifications = await GetNotifications(payload);
      let count = 0;
      notifications?.map(item => {
        if (item?.is_sent == '0') {
          count = count + 1;
        }
      });
      if (userData?.role != 'guest') {
        const notificationNode = await GetNodeNotifications();
        if (notificationNode?.rowData?.length > 0) {
          notificationNode?.rowData?.map(itemN => {
            if (itemN?.is_read == false) {
              count = count + 1;
            }
          });
          setNotificationCount(count);
          dispatchToStore(setNotificationCounts(count));
        }
      } else {
        setNotificationCount(count);
        dispatchToStore(setNotificationCounts(count));
      }
    } catch (error) {
      crashlytics().log('GetNotifications Api Home');
      crashlytics().recordError(error);
    }
  };
  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATION,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const requestUserPermissionForNotification = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const firstTimeEnter = await AsyncStorage.getItem('firstTimeEnter');
      if (firstTimeEnter != '1') {
        await AsyncStorage.setItem('firstTimeEnter', '1');
      }
    }
  };
  const notificationConfigure = async () => {
    await messaging().registerDeviceForRemoteMessages();
    let enabled = await messaging().hasPermission();

    if (enabled === messaging.AuthorizationStatus.AUTHORIZED) {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
      } else {
        // user doesn't have a device token yet
      }
    } else {
      await messaging().requestPermission();

      enabled = await messaging().hasPermission();
      if (!enabled) {
        return false;
      }
    }

    return true;
  };
  const getContact = async () => {
    try {
      const contactData = await GetContactUs();
      let payload = {
        whatsapp: contactData?.pages?.['contact-us']?.data?.global_settings?.[
          'wa_number'
        ].replace(/ /g, ''),
        phone: contactData?.pages?.['contact-us']?.data?.global_settings?.[
          'phone_number'
        ].replace(/ /g, ''),
      };
      dispatchToStore(setContactDetails(payload));
    } catch (error) {
      crashlytics().log('GetContacts Api Home');
      crashlytics().recordError(error);
    }
  };
  const getWholeData = async () => {
    try {
      const apiData = await axios.get(`${BASE_URL}/api.json`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setApiCrash(false);
      let array = [];
      let array1 = [];
      apiData?.data?.header?.map(item => {
        array.push({
          id: item?.id,
          title: item?.type == 'news' ? 'Latest News' : 'Featured Properties',
          text: item?.title,
          image: item?.image,
          type: item?.type,
        });
      });
      apiData?.data?.project_categories?.map(item => {
        array1?.push({id: item?.id, name: item?.name, slug: item?.slug});
        if (item?.slug == 'ready-to-move-in') {
          setReadyToMove(item?.projects);
        } else {
          setUnderConstruction(item?.projects);
        }
      });
      setTabList(array1);
      setBannerData(array);
      setHeaderSke(false);
      setProjectLoader(false);
      setTabSke(false);
      setLoading(false);
      setListLoader(false);
      setListEmptyLoader(false);
    } catch (error) {
      const err = error as AxiosError;
      if (err?.response?.status >= 500 && err?.response?.status <= 599) {
        setApiCrash(true);
        setBannerData([]);
        setHeaderSke(false);
        setProjectLoader(false);
        setTabSke(false);
        setLoading(false);
        setListLoader(false);
        setListEmptyLoader(false);
      } else {
        setApiCrash(true);
        setBannerData([]);
        setHeaderSke(false);
        setProjectLoader(false);
        setTabSke(false);
        setLoading(false);
        setListLoader(false);
        setListEmptyLoader(false);
      }
    }
  };
  const getHeaderData = async () => {
    try {
      const headerData = await GetHomeHeader();
      let array = [];
      headerData?.map(item => {
        array.push({
          id: item?.id,
          title: item?.type == 'news' ? 'Latest News' : 'Featured Properties',
          text: item?.title,
          image: item?.image,
          type: item?.type,
        });
      });
      setBannerData(array);
      setHeaderSke(false);
    } catch (error) {
      setHeaderSke(false);

      crashlytics().log('Get Header Api Home');
      crashlytics().recordError(error);
    }
  };
  const getProjectCategories = async () => {
    try {
      const projectCategories = await GetProjectCategories();
      setTabList(projectCategories);
      setProjectLoader(false);
      setTabSke(false);

      getRTMDData(projectCategories);
    } catch (error) {
      crashlytics().log('GetProjects Api Home');
      crashlytics().recordError(error);
    }
  };
  const getRTMDData = async projectCategories => {
    try {
      const rtmd = await GetPaginatedProjects(1, projectCategories[0]?.slug);
      const ucd = await GetPaginatedProjects(1, projectCategories[1]?.slug);
      setLengthRTM(rtmd?.projects?.length);
      setLengthUC(ucd?.projects?.length);
      let array = [];
      let arrays = [];
      if (rtmd?.projects?.length > 0) {
        rtmd?.projects?.map(item => {
          let img = item?.image;
          array?.push({
            lang: item?.lang,
            id: item?.id,
            image: img,
            title: item?.title,
          });
        });

        setReadyToMove(array);
        setLoading(false);
      } else {
        setLoading(false);
      }

      if (ucd?.projects?.length > 0) {
        ucd?.projects?.map(item => {
          let img = item?.image;
          arrays?.push({
            lang: item?.lang,
            id: item?.id,
            image: img,
            title: item?.title,
          });
        });

        setUnderConstruction(arrays);

        setTimeout(() => {
          setListLoader(false);
        }, 1500);
      } else {
        setTimeout(() => {
          setListLoader(false);

          setLoading(false);
        }, 1500);
      }
    } catch (error) {
      crashlytics().log('GetRTMData Api Home');
      crashlytics().recordError(error);
      setTimeout(() => {
        setListEmptyLoader(false);
        setListLoader(false);
        // setTabSke(false);
        setLoading(false);
      }, 1500);
    }
  };
  const getProjectsData = async (page, category, index) => {
    try {
      const projectData = await GetPaginatedProjects(page, category);
      console.log(
        'getProjectsData',
        projectData?.projects?.length,
        page,
        category,
      );

      if (index == 0) {
        setRTMIPageNo(page);
        setLengthRTM(projectData?.pagination?.total_posts);
        let array = [];
        if (projectData?.projects?.length > 0) {
          projectData?.projects?.map(item => {
            let img =
              // item?.image === 'null' ||
              // item?.image === null ||
              // item?.image === 'false' ||
              // item?.image === false ||
              // item?.image === ''
              //   ? null
              //   :
              item?.image;
            array?.push({
              lang: item?.lang,
              id: item?.id,
              image: img,
              title: item?.title,
              // location: {
              //   lat: item?.location?.lat,
              //   lng: item?.location?.lng,
              // },
              // description: item?.description,
            });
          });
          let mergeArray = [];
          if (page == 1) {
            mergeArray = [...array];
          } else {
            mergeArray = [...readyToMove, ...array];
          }

          // const sorted = [...mergeArray].sort((a, b) =>
          //   a.title.localeCompare(b.title),
          // );
          setReadyToMove(mergeArray);
          setTimeout(() => {
            setListLoader(false);
          }, 1500);
        } else {
          setTimeout(() => {
            setListLoader(false);
          }, 1500);
        }
      } else {
        setUCPageNo(page);

        setLengthUC(projectData?.pagination?.total_posts);
        let arrays = [];
        if (projectData?.projects?.length > 0) {
          projectData?.projects?.map(item => {
            let img =
              // item?.image === 'null' ||
              // item?.image === null ||
              // item?.image === 'false' ||
              // item?.image === false ||
              // item?.image === ''
              //   ? null
              //   :
              item?.image;
            arrays?.push({
              lang: item?.lang,
              id: item?.id,
              image: img,
              title: item?.title,
              // location: {
              //   lat: item?.location?.lat,
              //   lng: item?.location?.lng,
              // },
              // description: item?.description,
            });
          });
          let mergeArrays = [];
          if (page == 1) {
            mergeArrays = [...arrays];
          } else {
            mergeArrays = [...underConstruction, ...arrays];
          }
          // const sorted = [...mergeArrays].sort((a, b) =>
          //   a.title.localeCompare(b.title),
          // );
          setUnderConstruction(mergeArrays);
          setTimeout(() => {
            setListLoader(false);
          }, 1500);
        } else {
          setTimeout(() => {
            setListLoader(false);
          }, 1500);
        }
      }
    } catch (error) {
      crashlytics().log('GetProjectsData Api Home');
      crashlytics().recordError(error);
      setTimeout(() => {
        setListEmptyLoader(false);

        setListLoader(false);
      }, 1500);
    }
  };

  const registerDeviceOnBackend = async () => {
    try {
      let bundleId = await DeviceInfo.getUniqueId();
      let device = await DeviceInfo.getDeviceName();
      const fcmToken = await messaging().getToken();
      let payload = {
        fcm_token: fcmToken,
        identifier: bundleId,
        device_alias: device,
      };

      const register = await RegisterDevice(payload);
      if (fcmToken) {
        const resetWp = await ResetNotificationCountWP({fcm_token: fcmToken});
        console.log('===========>', resetWp);
      }

      dispatchToStore(setDeviceRegistered(true));
      getNotifications();
    } catch (error) {
      console.log('===========>error', error);
      crashlytics().log('RegisterDevice On Backend Api Home');
      crashlytics().recordError(error);
    }
  };
  const renderCarouselImageSlider = ({item, index}, parallaxProps) => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
          width: 280,
          height: 260,
          borderRadius: 10,
        }}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 18,
            fontFamily: FONT_FAMILY?.IBMPlexBold,
            textAlign: 'center',

            color: theme?.white,
          }}>
          {item?.title.toUpperCase()}
        </Text>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (item?.type == 'project') {
              props?.navigation?.navigate('ProjectDetails', {id: item?.id});
            } else {
              props?.navigation?.navigate('BlogDetail', {
                id: item?.id,
                from: 'Home',
              });
            }
          }}
          style={{
            marginTop: 20,
          }}>
          {item?.image != null && item?.image != false ? (
            <ImageProgress
              source={item?.image}
              imageStyles={{
                width: 260,
                height: 240,
                backgroundColor: theme?.white,
                borderRadius: 23,
              }}
              imageStyle={{borderRadius: 23}}
              resizeMode={'contain'}
              activityIndicatorSize={'small'}
              activityIndicatorColor={theme?.logoColor}
            />
          ) : (
            <Image
              source={require('@/assets/images/icons/logo_PH.png')}
              style={{
                width: 260,
                height: 240,
                backgroundColor: theme?.white,
                borderRadius: 23,
              }}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (item?.type == 'project') {
              props?.navigation?.navigate('ProjectDetails', {id: item?.id});
            } else {
              props?.navigation?.navigate('BlogDetail', {
                id: item?.id,
                from: 'Home',
              });
            }
          }}
          style={{
            position: 'absolute',
            bottom: Platform.OS == 'ios' ? -45 : -47,
            width: 260,
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
            height: 200,
            justifyContent: 'flex-end',
            paddingBottom: 20,
          }}>
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0)',
              'rgba(0, 0, 0, 0.2)',
              'rgba(0, 0, 0, 0.8)',
            ]}
            style={{
              width: 260,
              borderBottomLeftRadius: 23,
              borderBottomRightRadius: 23,
              height: 200,
              justifyContent: 'flex-end',
              paddingBottom: 20,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                color: theme?.white,

                flexWrap: 'wrap',
              }}>
              {item?.text}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const renderReadyToMove = ({index, item}) => {
    return (
      <View
        style={{
          // height: 190,
          width: screenWidth * 0.45,

          // paddingRight: 20,
        }}>
        <View style={{}}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              props?.navigation?.navigate('ProjectDetails', {id: item?.id});
            }}
            style={{
              width: screenWidth * 0.45,
              borderRadius: 23,
            }}>
            <View
              style={{
                width: screenWidth * 0.45,
                height: 140,
                borderRadius: 20,
              }}>
              {item?.image == null ? (
                <Image
                  source={require('@/assets/images/icons/logo_PH.png')}
                  style={{
                    width: screenWidth * 0.4,
                    height: 130,
                    alignSelf: 'center',
                    borderRadius: 20,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <ImageProgress
                  source={item?.image}
                  imageStyles={{
                    width: screenWidth * 0.4,
                    height: 130,
                    alignSelf: 'center',
                  }}
                  imageStyle={{borderRadius: 20}}
                  resizeMode={'cover'}
                  activityIndicatorSize={'small'}
                  activityIndicatorColor={theme?.logoColor}
                />
              )}
            </View>

            <Text
              allowFontScaling={false}
              ellipsizeMode="tail"
              numberOfLines={2}
              style={{
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexBold,
                color: theme?.black,
                width: screenWidth * 0.43,
                paddingLeft: 10,
                marginBottom: 10,
                // backgroundColor:'red',
              }}>
              {item?.title}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const RenderRTMI = () => {
    return (
      <>
        {listLoader ? (
          <List />
        ) : (
          <FlatList
            ref={flatListRef}
            bounces={false}
            style={{marginTop: 90}}
            nestedScrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 20,
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingLeft: screenWidth * 0.05,
            }}
            numColumns={2}
            data={readyToMove}
            renderItem={renderReadyToMove}
            onEndReached={() => {
              // if (lengthRTM >= 6) {
              //   getProjectsData(rTMIPageNo + 1, tabList[0]?.slug, 0);
              // }
            }}
            onEndReachedThreshold={0.2}
            ListFooterComponent={() => {
              return (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: screenWidth,
                    marginTop: 10,
                    // backgroundColor:'red',
                    paddingRight: screenWidth * 0.1,
                  }}>
                  {lengthRTM >= 6 ? (
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
                        textAlign: 'center',
                        paddingRight: screenWidth * 0.06,
                      }}>
                      {readyToMove?.length > 0
                        ? ''
                        : // ? ' Currently, there are no more projects available.'
                          ''}
                    </Text>
                  )}
                </View>
              );
            }}
            ListEmptyComponent={() => {
              return (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexBold,
                    color: theme?.textGrey,
                    textAlign: 'center',
                    paddingLeft: screenWidth * 0.04,
                    // paddingRight: screenWidth * 0.1,
                  }}>
                  {readyToMove?.length > 0
                    ? 'Currently, there are no more projects available.'
                    : // ? ' Currently, there are no more projects available.'
                      ''}
                </Text>
              );
            }}
          />
        )}
      </>
    );
  };
  const RenderUnderConstruction = () => {
    return (
      <>
        {listLoader ? (
          <List />
        ) : (
          <FlatList
            ref={flatListRef1}
            bounces={false}
            style={{marginTop: 90}}
            nestedScrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 20,
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingLeft: screenWidth * 0.05,
            }}
            numColumns={2}
            data={underConstruction}
            renderItem={renderReadyToMove}
            onEndReached={() => {
              // if (lengthUC >= 6) {
              //   getProjectsData(uCPageNo + 1, tabList[1]?.slug, 1);
              // }
            }}
            onEndReachedThreshold={0.2}
            ListFooterComponent={() => {
              return (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: screenWidth,
                    marginTop: 10,
                    paddingRight: screenWidth * 0.1,
                  }}>
                  {lengthUC >= 6 ? (
                    <ActivityIndicator
                      size={'large'}
                      color={theme?.logoColor}
                    />
                  ) : (
                    // <Image
                    //   source={require('@/assets/images/icons/loader.gif')}
                    //   style={{height: 100, width: 100}}
                    //   resizeMode="contain"
                    // />
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 14,
                        fontFamily: FONT_FAMILY?.IBMPlexBold,
                        color: theme?.textGrey,
                        textAlign: 'center',
                        paddingRight: screenWidth * 0.1,
                      }}>
                      {underConstruction?.length > 0
                        ? ''
                        : // ? ' Currently, there are no more projects available.'
                          ''}
                    </Text>
                  )}
                </View>
              );
            }}
            ListEmptyComponent={() => {
              return (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexBold,
                    color: theme?.textGrey,
                    textAlign: 'center',
                    paddingLeft: screenWidth * 0.04,
                  }}>
                  {readyToMove?.length > 0
                    ? 'Currently, there are no more projects available.'
                    : // ? ' Currently, there are no more projects available.'
                      ''}
                </Text>
              );
            }}
          />
        )}
      </>
    );
  };
  const renderTabBar = props => {
    return (
      <MaterialTabBar
        {...props}
        indicatorStyle={{
          backgroundColor: theme?.logoColor,
          height: '100%',
          zIndex: -1,
          borderRadius: 50,
          marginLeft: 0.6,
        }}
        activeColor={theme.white}
        inactiveColor={theme.darkGrey}
        labelStyle={{
          fontSize: 13,
          textTransform: 'capitalize',
          fontFamily: FONT_FAMILY?.IBMPlexBold,
          color: theme?.white,
        }}
        style={{
          width: screenWidth * 0.91,
          alignSelf: 'center',

          height: 50,

          paddingHorizontal: 5,
        }}
        contentContainerStyle={{
          width: screenWidth * 0.91,
          alignSelf: 'center',

          height: 50,
          marginVertical: 10,
        }}
        tabStyle={{
          width: screenWidth == 838 ? screenWidth * 0.447 : screenWidth * 0.44,
        }}
        scrollEnabled
      />
    );
  };
  const handleDotPress = index => {
    setselectedBanner(index);

    setTimeout(() => {
      carouselRef?.current?.scrollToIndex({
        animate: true,
        index: index,
      });
    }, 1100);
  };

  return (
    <View style={{flex: 1, backgroundColor: theme?.white}}>
      {apiCrash ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 5,
            height:
              Platform.OS == 'ios' ? screenHeight * 1.15 : screenHeight * 1.25,
          }}
          nestedScrollEnabled={true}>
          <View
            style={{
              width: screenWidth,
              height: 250,
              backgroundColor: theme?.logoColor,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: screenWidth * 0.9,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 50,
              }}>
              <View style={{height: 47, width: 47}}></View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}>
                <Image
                  source={require('@/assets/images/icons/logo.png')}
                  style={{
                    width: 65,
                    height: 65,
                    resizeMode: 'contain',
                    tintColor: theme?.white,
                  }}
                />
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    props?.navigation?.navigate('Notification');
                  }}
                  style={{
                    width: 47,
                    height: 47,
                    borderRadius: 47 / 2,
                    backgroundColor: theme?.transparentWhite,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={
                      count > 0
                        ? require('@/assets/images/icons/notification.png')
                        : require('@/assets/images/icons/notification_white_fill.png')
                    }
                    style={{
                      width: 20,
                      height: 20,
                      // backgroundColor:'red',
                      alignSelf: 'center',
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {headerSke ? (
            <View
              style={{
                marginTop: -140,
                width: screenWidth,
                alignSelf: 'center',
                alignItems: 'center',
                height: 365,
              }}>
              <SkeletonPlaceholder backgroundColor="#D8E0E4">
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: screenWidth,
                    height: 365,
                    // top: 160,
                  }}>
                  <View
                    style={{
                      width: 150,
                      height: 40,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      width: screenWidth,
                      // top: 160,
                    }}>
                    <View
                      style={{
                        width: 40,
                        height: 240,
                        borderTopRightRadius: 23,
                        borderBottomRightRadius: 23,
                      }}
                    />
                    <View
                      style={{
                        width: 260,
                        height: 240,
                        borderRadius: 23,
                        marginHorizontal: 20,
                      }}
                    />
                    <View
                      style={{
                        width: 100,
                        height: 240,
                        borderRadius: 23,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      // backgroundColor:'red',
                      justifyContent: 'center',
                      width: screenWidth,
                      marginTop: 30,
                    }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 10 / 2,
                      }}
                    />
                    <View
                      style={{
                        width: 30,
                        height: 10,
                        borderRadius: 10 / 2,
                        marginHorizontal: 10,
                      }}
                    />
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 10 / 2,
                      }}
                    />
                  </View>
                </View>
              </SkeletonPlaceholder>
            </View>
          ) : (
            <>
              {bannerData?.length > 0 ? (
                <View
                  style={{
                    marginTop: -120,
                    width: 400,
                    alignSelf: 'center',
                    alignItems: 'center',
                    height: 365,
                  }}>
                  {/* <Carousel
                    loop={false}
                    autoplay={false}
                    autoplayInterval={2000}
                    sliderWidth={screenWidth}
                    sliderHeight={screenWidth}
                    itemWidth={280}
                    data={bannerData}
                    renderItem={renderCarouselImageSlider}
                    hasParallaxImages={true}
                    onSnapToItem={index => {
                      setselectedBanner(index);
                    }}
                    enableMomentum={true}
                    decelerationRate={Platform.OS == 'ios' ? 0.9 : 0}
                    firstItem={bannerData?.length > 2 ? 1 : 0}
                  /> */}

                  <View
                    style={{
                      position: 'absolute',
                      width: screenWidth * 0.5,
                      bottom: 16,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <ScrollView
                      ref={scrollViewRef}
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      {bannerData.map((_, index) => (
                        <TouchableOpacity
                          key={index}
                          // onPress={() => handleDotPress(index)}
                          style={[
                            styles.paginationDot,
                            index === selectedBanner &&
                              styles.activePaginationDot,
                          ]}>
                          {/* Custom pagination dot */}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    marginTop: -120,
                    width: 400,
                    // backgroundColor:'red',
                    borderRadius: 23,
                    alignSelf: 'center',
                    alignItems: 'center',
                    height: 330,
                  }}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      alignSelf: 'center',
                      width: 300,
                      backgroundColor: 'white',
                      height: 320,
                      borderRadius: 10,
                    }}>
                    <LinearGradient
                      colors={[
                        'rgba(255, 255, 255, 0)',
                        'rgba(0, 0, 0, 0.2)',
                        'rgba(0, 0, 0, 0.8)',
                      ]}
                      style={{
                        width: 300,
                        borderBottomLeftRadius: 23,
                        borderBottomRightRadius: 23,
                        height: 280,
                        justifyContent: 'flex-end',
                        paddingBottom: 20,
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          textAlign: 'center',
                          fontSize: 16,
                          fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                          color: theme?.white,

                          flexWrap: 'wrap',
                        }}>
                        Either latest news or featured properties are not
                        available.
                      </Text>
                    </LinearGradient>
                  </View>
                </View>
              )}
            </>
          )}

          {tabSke ? (
            <ProjectSkeleton />
          ) : (
            <Tabs.Container
              renderTabBar={renderTabBar}
              headerContainerStyle={{
                shadowColor: theme?.white,
                width: screenWidth * 0.904,
                alignSelf: 'center',
                backgroundColor: theme?.homeTabColor,
                borderRadius: 50,
                paddingVertical: 5,
              }}
              onIndexChange={index => {
                // setListLoader(true);
                // setListEmptyLoader(true);
                // getProjectsData(1, tabList[index]?.slug, index);
                if (index == 0) {
                  // setRTMIPageNo(1);
                  // setUCPageNo(1);
                  flatListRef1?.current?.scrollToOffset({
                    animated: true,
                    offset: 0,
                  });
                } else {
                  // setRTMIPageNo(1);
                  // setUCPageNo(1);
                  flatListRef?.current?.scrollToOffset({
                    animated: true,
                    offset: 0,
                  });
                }
                setTabIndex(index);
                // setTimeout(() => {
                //   setListEmptyLoader(false);
                // }, 1500);
              }}>
              <Tabs.Tab name={tabList[0]?.name}>{RenderRTMI()}</Tabs.Tab>
              <Tabs.Tab name={tabList[1]?.name}>
                {RenderUnderConstruction()}
              </Tabs.Tab>
            </Tabs.Container>
            //   )}
            // </>
          )}
        </ScrollView>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 13,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
    backgroundColor: theme.greyRGB,
  },
  activePaginationDot: {
    width: 25,
    height: 8,
    borderRadius: 10 / 2,
    backgroundColor: theme?.bulletGrey,
  },
  // ==========================
  item: {
    width: screenWidth - 60,
    height: screenWidth - 60,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});

export default Home;
