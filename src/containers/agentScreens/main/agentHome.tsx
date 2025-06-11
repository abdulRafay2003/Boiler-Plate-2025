import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  AppState,
  Alert,
  Linking,
} from 'react-native';
import {Headers} from '@/components/header/headers';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import NotificationSkeleton from '@/components/skeletons/notification';
import {
  GetNotifications,
  RegisterDevice,
  RequestMarkAsAllReadNotifications,
  RequestReadOneNotification,
  ResetNotificationCountWP,
} from '@/services/apiMethods/notification';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment';
import {Loader} from '@/components/loader';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import PushNotification from 'react-native-push-notification';
import crashlytics from '@react-native-firebase/crashlytics';
import {ImageProgress} from '@/components/ImageProgress';
import LogActivityBottomSheet from '@/components/agentBottomSheets/logActivity';
import AgentLeadSkeleton from '@/components/skeletons/agentLeads';
import AgentActivitiesSkeleton from '@/components/skeletons/agentActivities';
import {AxiosError} from 'axios';
import {dashboardLeadsApi} from '@/services/apiMethods/leadsApis';
import {dashboardActivitiesApi} from '@/services/apiMethods/activitiesApi';
import {getAllDropDownApi} from '@/services/apiMethods/dropDown';
import {AttachmentViewerPopup} from '@/components/modal/attachmentViewer';
import PDFView from 'react-native-view-pdf';
import {
  getProfilePicUrlApi,
  getUserProfileApi,
} from '@/services/apiMethods/authApis';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import {updateFcmApi} from '@/services/apiMethods/updateFcm';
import {
  GetNodeNotifications,
  ResetNotificationCount,
} from '@/services/apiMethods/notificationNode';
import VersionCheck from 'react-native-version-check';
import {dispatchToStore, RootState} from '@/redux/store';
import {
  setAlertState,
  setDropDownData,
  setNotificationCounts,
  setUserDetail,
} from '@/redux/slice/UserSlice/userSlice';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
const AgentHome = props => {
  const alertState = useSelector((state: RootState) => state?.user?.alertState);
  const userData = useSelector((state: RootState) => state?.user?.userDetail);
  const focused = useIsFocused();
  const navigation = useNavigation();
  const [showLoader, setShowLoader] = useState('');
  const [downloadStart, setDownloadStart] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [upcomingListing, setupcomingListing] = useState([
    // {
    //   id: 1,
    //   leadNo: '123456',
    //   projectName: 'Al Helio Villas',
    //   personName: 'Mohammad Ali',
    //   time: '07: 00 AM - 08: 00 AM',
    // },
    // {
    //   id: 2,
    //   leadNo: '123456',
    //   projectName: 'Al Ameera Tower',
    //   personName: 'Mohammad Ali',
    //   time: '08: 00 AM - 10: 00 AM',
    // },
    // {
    //   id: 3,
    //   leadNo: '123456',
    //   personName: 'Mohammad Ali',
    //   projectName: 'Oasis Tower',
    //   time: '08: 00 AM - 10: 00 AM',
    // },
  ]);
  const [latestLeads, setLatestLeads] = useState([
    // {
    //   id: 1,
    //   leadNo: '5390 Husnain Raza',
    //   date: '02 jan 2023',
    // },
    // {
    //   id: 2,
    //   leadNo: '2647 Farhat Jabeen',
    //   date: '02 feb 2023',
    // },
    // {
    //   id: 3,
    //   leadNo: '2647 Farhat Jabeen',
    //   date: '02 feb 2023',
    // },
  ]);
  const [latestActivities, setLatestActivities] = useState([
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
  const [loading, setLoading] = useState(false);
  const [leadsSkeleton, setLeadsSkeleton] = useState(true);
  const [activitiesSkeleton, setActivitiesSkeleton] = useState(true);
  const sheetRef = useRef(null);
  const [showAttachViewerPopup, setShowAttachViewerPopup] = useState(false);
  const snapPoints = useMemo(() => ['1%', '1%', '45%'], []);
  const [showMore, setShowMore] = useState(false);
  const [renderAttachData, setRenderAttachData] = useState([]);
  const [activityCrash, setActivityCrash] = useState(
    'No activities at the moment.',
  );
  const [leadCrash, setLeadCrash] = useState('No leads at the moment.');
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
              ? 'ADashboard'
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
          }
          // else if (route == 'PaymentPlan') {
          //   if (notification?.data?.data != undefined) {
          //     let jsonData = JSON.parse(notification.data.data);

          //     params = {
          //       item: {
          //         title:
          //           jsonData?.contract?.property?.markettingName != undefined
          //             ? jsonData?.contract?.property?.markettingName
          //             : jsonData?.contract?.property?.name,
          //       },
          //       itemNode: {
          //         property: {
          //           type: jsonData?.contract?.property?.type,
          //           location: jsonData?.contract?.property?.location,
          //         },
          //       },
          //       id: jsonData?.contractId,
          //       itemId: jsonData?.id,
          //       unitCode: jsonData?.contract?.unit?.unitCode,
          //       balance: jsonData?.contract?.balance,
          //       year: jsonData?.updatedAt,
          //     };
          //   }
          // }
          else if (route == 'PortfolioDetail') {
            let jsonData = JSON.parse(notification?.data?.data);

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

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
        }
      });

    const unsubscribe = messaging().onMessage(async remoteMessage => {});

    const unsubscribeForegroundOpenApp = notifee.onForegroundEvent(
      async ({type, detail}) => {
        switch (type) {
          case EventType.PRESS:
            // console.debug('User pressed notification');
            let jsonData = JSON.parse(detail?.notification.data.data);
            console.log('notification json data  Agent', jsonData);
            if (detail.notification && detail.notification.data) {
              if (Platform.OS == 'ios') {
                await notifee.decrementBadgeCount();
              }
              const route =
                detail?.notification?.data?.post_type == 'Project'
                  ? 'ProjectDetails'
                  : detail?.notification?.data?.post_type ==
                      'Construction Update'
                    ? 'ConstructionUpdateDetail'
                    : detail?.notification?.data?.type == 'agent'
                      ? 'userProfile'
                      : detail?.notification?.data?.type == 'customer'
                        ? 'userProfile'
                        : detail?.notification?.data?.type == 'activity'
                          ? 'SingleLeadDetails'
                          : detail?.notification?.data?.type ==
                              'multipleactivity'
                            ? 'ActivityDetails'
                            : detail?.notification?.data?.type == 'lead'
                              ? 'SingleLeadDetails'
                              : detail?.notification?.data?.type == 'financial'
                                ? 'NotificationItem'
                                : detail?.notification?.data?.type == 'contract'
                                  ? 'PortfolioDetail'
                                  : detail?.notification?.data?.type ==
                                      'paymentPlan'
                                    ? 'PaymentPlan'
                                    : detail?.notification?.data?.type ==
                                        'general'
                                      ? 'Notification'
                                      : 'BlogDetail';
              const parent_route =
                detail?.notification?.data?.post_type == 'Project'
                  ? ''
                  : detail?.notification?.data?.post_type ==
                      'Construction Update'
                    ? 'ADashboard'
                    : detail?.notification?.data?.type == 'agent'
                      ? ''
                      : detail?.notification?.data?.type == 'customer'
                        ? ''
                        : detail?.notification?.data?.type == 'activity'
                          ? 'ADashboard'
                          : detail?.notification?.data?.type ==
                              'multipleactivity'
                            ? 'ADashboard'
                            : detail?.notification?.data?.type == 'lead'
                              ? 'ADashboard'
                              : detail?.notification?.data?.type == 'financial'
                                ? 'CDashboard'
                                : detail?.notification?.data?.type == 'contract'
                                  ? 'CDashboard'
                                  : detail?.notification?.data?.type ==
                                      'paymentPlan'
                                    ? 'CDashboard'
                                    : detail?.notification?.data?.type ==
                                        'general'
                                      ? ''
                                      : 'Menu';
              if (parent_route != '') {
                let params;
                if (route == 'SingleLeadDetails') {
                  if (detail?.notification?.data?.data != undefined) {
                    let jsonData = JSON.parse(detail.notification.data.data);
                    params = {
                      LeadId:
                        detail?.notification.data?.type == 'activity'
                          ? jsonData?.lead?.id
                          : jsonData?.id,
                      keyId: jsonData?.activityId,
                      activityType: jsonData?.type,
                      overview: jsonData?.overview ? true : false,
                    };
                  }
                  // else {
                  //   let jsonData = JSON.parse(detail.notification.data.data);
                  //   params = {
                  //     LeadId: detail.notification?.data?.id,
                  //     overview: jsonData?.overview ? true : false,
                  //   };
                  // }
                } else if (route == 'userProfile') {
                  params = {
                    from: 'notification',
                  };
                } else if (route == 'NotificationItem') {
                  if (detail?.notification?.data?.data != undefined) {
                    let jsonData = JSON.parse(detail.notification?.data?.data);
                    if (detail?.notification?.data?.type == 'paymentPlan') {
                      params = {
                        item: {
                          title:
                            jsonData?.contract?.property?.markettingName !=
                            undefined
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
                }
                // else if (route == 'PaymentPlan') {
                //   if (detail?.notification?.data?.data != undefined) {
                //     let jsonData = JSON.parse(detail?.notification?.data?.data);
                //     params = {
                //       item: {
                //         title:
                //           jsonData?.contract?.property?.markettingName !=
                //           undefined
                //             ? jsonData?.contract?.property?.markettingName
                //             : jsonData?.contract?.property?.name,
                //       },
                //       itemNode: {
                //         property: {
                //           type: jsonData?.contract?.property?.type,
                //           location: jsonData?.contract?.property?.location,
                //         },
                //       },
                //       id: jsonData?.contractId,
                //       itemId: jsonData?.id,
                //       unitCode: jsonData?.contract?.unit?.unitCode,
                //       balance: jsonData?.contract?.balance,
                //       year: jsonData?.updatedAt,
                //     };
                //   }
                // }
                else if (route == 'PortfolioDetail') {
                  let jsonData = JSON.parse(detail?.notification?.data?.data);

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
                    keyId: detail?.notification?.data?.eventId,
                  };
                } else {
                  params = {
                    id: detail?.notification?.data?.post_id,
                  };
                }
                props?.navigation.navigate(parent_route, {
                  screen: route,
                  params: params,
                });
              } else {
                props?.navigation?.navigate(route, {
                  id: detail?.notification?.data?.post_id,
                });
              }
            }
            break;
        }
      },
    );

    return () => {
      unsubscribe();
      unsubscribeForegroundOpenApp();
    };
  }, []);

  useEffect(() => {
    if (focused == true) {
      checkVersion();
      getProfileUrl();
      getDashboardLeads();
      getDashboardActivities();
      getAllDropDownData();
      registerDeviceOnBackend();
    }
  }, [focused]);

  useEffect(() => {
    clearAll();
    getNotifications();
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, [focused]);
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
  useLayoutEffect(() => {
    if (props?.route?.params?.from == 'More') {
      props?.navigation?.setOptions({
        gestureEnabled: false,
      });
    }
  }, []);

  const getDashboardLeads = async () => {
    try {
      const responseleadsDashboard = await dashboardLeadsApi();
      setLatestLeads(responseleadsDashboard?.data);
      setLeadsSkeleton(false);
      setLeadCrash('No leads at the moment.');
    } catch (err) {
      setLeadsSkeleton(false);
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 500
      ) {
        setLatestLeads([]);
        setLeadCrash('Unable to load data at the moment.');
      }
      console.log('leadsError', error?.response?.data?.message);
    }
  };
  const getDashboardActivities = async () => {
    try {
      const responseActivityDashboard = await dashboardActivitiesApi();
      setLatestActivities(responseActivityDashboard?.data);
      setActivitiesSkeleton(false);
      setActivityCrash('No activities at the moment.');
    } catch (err) {
      setActivitiesSkeleton(false);
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 500
      ) {
        setLatestActivities([]);
        setActivityCrash('Unable to load data at the moment.');
      }
      console.log('leadsError', error?.response?.data?.message);
    }
  };
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
      let count = 0;
      if (notifications?.length > 0) {
        notifications?.map(item => {
          if (item?.read_at == '0') {
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
          }
          dispatchToStore(setNotificationCounts(count));
        }
        dispatchToStore(setNotificationCounts(count));
      } else if (userData?.role != 'guest') {
        const notificationNode = await GetNodeNotifications();
        if (notificationNode?.rowData?.length > 0) {
          notificationNode?.rowData?.map(itemN => {
            if (itemN?.is_read == false) {
              count = count + 1;
            }
          });
        }
        dispatchToStore(setNotificationCounts(count));
      } else {
        count = 0;
        dispatchToStore(setNotificationCounts(0));
      }
    } catch (error) {
      crashlytics().log('GetNotifications Api Notifications Screen');
      crashlytics().recordError(error);
    }
  };
  const getProfileUrl = async () => {
    try {
      const userProfile = await getUserProfileApi();
      if (userProfile?.profileImage != null) {
        const profileImage = await getProfilePicUrlApi(
          userProfile?.profileImage,
          userData?.token?.access_token,
        );
        if (profileImage) {
          const response = await ReactNativeBlobUtil.config({
            fileCache: true,
          }).fetch('GET', profileImage);
          const base64Data = await response.base64();

          dispatchToStore(
            setUserDetail({
              ...userData,
              profileImage: base64Data,
            }),
          );
        } else {
          dispatchToStore(
            setUserDetail({
              ...userData,
              profileImage: null,
            }),
          );
        }
      } else {
        dispatchToStore(
          setUserDetail({
            ...userData,
            profileImage: null,
          }),
        );
      }
    } catch (err) {
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      }
      dispatchToStore(
        setUserDetail({
          ...userData,
          profileImage: null,
        }),
      );
    }
  };
  const renderLatestLeads = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          paddingVertical: 3,
          marginTop: 10,
          paddingRight: 15,
        }}
        activeOpacity={1}
        onPress={() => {
          sheetRef?.current?.close();
          props?.navigation?.navigate('SingleLeadDetails', {
            LeadId: item?.id,
          });
        }}>
        <View
          style={{
            width: screenWidth * 0.893,
            height: 70,
            borderWidth: 1.14,
            borderRadius: 10,
            borderColor: theme?.greyColor,
            paddingHorizontal: 15,
            justifyContent: 'center',
            // paddingVertical: 13,
          }}>
          <View>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: theme?.bottomTab,
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                width: '100%',
              }}>
              Lead ID:
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: theme?.logoColor,
                  fontSize: 20,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                  width: '100%',
                }}>
                {' '}
                {item?.title}
              </Text>
            </Text>
          </View>
          <View>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.bottomTab,
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              }}>
              Date:
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: theme?.bottomTab,
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  flexWrap: 'wrap',
                  width: screenWidth * 0.53,
                }}>
                {' '}
                {moment(item?.leadCreationDate)?.format('DD MMM YYYY')}
              </Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const renderLatestActivities = ({item, index}) => {
    var lines = item?.message?.split(/\r\n|\r|\n/).length;
    const dateShow = item?.createdAt ? item?.createdAt.split('T')[0] : null;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}>
        <View
          style={{
            width: screenWidth * 0.89,
            borderBottomWidth: StyleSheet?.hairlineWidth,
            paddingVertical: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              allowFontScaling={false}
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                width: screenWidth * 0.67,
                color: theme?.black,
                fontSize: 18,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                flexWrap: 'wrap',
              }}>
              {item?.title}
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                position: 'absolute',
                right: 0,
                top: 5,
                color: theme?.black,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              }}>
              {dateShow ? moment(dateShow)?.format('DD/MM/YYYY') : null}
            </Text>
          </View>

          <View
            style={{
              marginTop: 5,
            }}>
            {item?.message?.length > 108 && lines < 3 ? (
              showMore == item?.id ? (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setShowMore(null)}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      color: theme?.black,
                    }}>
                    {item?.message}{' '}
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 14,
                        color: theme?.logoColor,
                        fontFamily: FONT_FAMILY?.IBMPlexBold,
                      }}>
                      Show less
                    </Text>
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setShowMore(item?.id)}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      color: theme?.black,
                    }}>
                    {`${item?.message?.slice(0, 74)}... `}{' '}
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 14,
                        color: theme.logoColor,
                        fontFamily: FONT_FAMILY?.IBMPlexBold,
                      }}>
                      Show more
                    </Text>
                  </Text>
                </TouchableOpacity>
              )
            ) : (
              <>
                {lines > 3 ? (
                  showMore == item?.id ? (
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setShowMore(null)}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 14,
                          color: theme?.black,
                          fontFamily: FONT_FAMILY?.IBMPlexRegular,
                        }}>
                        {item?.message}{' '}
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: 14,
                            color: theme.logoColor,
                            fontFamily: FONT_FAMILY?.IBMPlexBold,
                          }}>
                          Show less
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setShowMore(item?.id)}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 14,
                          color: theme?.black,
                          fontFamily: FONT_FAMILY?.IBMPlexRegular,
                        }}>
                        {`${item?.message?.slice(0, 15)}... `}{' '}
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: 14,
                            color: theme.logoColor,
                            fontFamily: FONT_FAMILY?.IBMPlexBold,
                          }}>
                          Show more
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  )
                ) : (
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      color: theme?.black,
                    }}>
                    {item?.message}
                  </Text>
                )}
              </>
            )}
          </View>
          {item?.status != undefined && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.black,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                Status
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.greyText,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                {item?.status}
              </Text>
            </View>
          )}
          {item?.location != undefined && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.black,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                Location
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.greyText,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                {item?.location}
              </Text>
            </View>
          )}
          {item?.phone != undefined && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.black,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                Phone
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.greyText,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                {item?.phone}
              </Text>
            </View>
          )}
          {item?.accessLevel != undefined && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.black,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                Event Access
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.greyText,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                {item?.accessLevel}
              </Text>
            </View>
          )}
          {item?.NoteType != undefined && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.black,
                  textAlign: 'center',
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                Note Type
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.greyText,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                {item?.NoteType}
              </Text>
            </View>
          )}
          {item?.direction != undefined && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.black,
                  textAlign: 'center',
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                Direction
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.greyText,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                {item?.direction}
              </Text>
            </View>
          )}
          {item?.type != 'NOTE' && item?.completedDate != undefined && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.black,
                  textAlign: 'center',
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                Completed Date
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.greyText,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                {moment(item?.completedDate)?.format('DD/MM/YYYY')}
              </Text>
            </View>
          )}
          {item?.type == 'NOTE' && item?.noteDate != undefined && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.black,
                  textAlign: 'center',
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                Selected Date
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.greyText,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                {moment(item?.noteDate)?.format('DD/MM/YYYY')}
              </Text>
            </View>
          )}
          {item?.startDate != undefined && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.black,
                  textAlign: 'center',
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                Start Date
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.greyText,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                {moment(item?.startDate)?.format('DD/MM/YYYY')}
              </Text>
            </View>
          )}
          {item?.type == 'NOTE' && item?.time != undefined && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.black,
                  textAlign: 'center',
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                Time
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.greyText,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                {item?.time}
              </Text>
            </View>
          )}
          {item?.type != 'NOTE' && item?.startTime != undefined && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.black,
                  textAlign: 'center',
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                Start Time
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.greyText,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                {item?.startTime}
              </Text>
            </View>
          )}
          {item?.type != 'NOTE' && item?.endTime != undefined && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.black,
                  textAlign: 'center',
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                End Time
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.greyText,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}>
                {/* {moment(item?.endTime)?.format('HH:mm a')} */}
                {item?.endTime}
              </Text>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.bottomTab,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                }}>
                Lead ID:
              </Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  props?.navigation?.navigate('SingleLeadDetails', {
                    LeadId: item?.lead?.id,
                  });
                }}>
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: theme?.logoColor,
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                    width: screenWidth * 0.57,
                  }}>
                  {' '}
                  {item?.lead?.title}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                paddingHorizontal: 7,
                height: 28,
                borderWidth: 1,
                borderColor: theme?.logoColor,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  width: 45,
                  textAlign: 'center',
                  color: theme?.logoColor,
                  fontSize: 13,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                }}>
                {item?.type}
              </Text>
            </View>
          </View>
          {item?.AttachmentsOnActivities?.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setRenderAttachData(item?.AttachmentsOnActivities);
                setShowAttachViewerPopup(true);
              }}
              activeOpacity={0.9}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: theme?.logoColor,
                width: screenWidth * 0.41,
                paddingHorizontal: 5,
              }}>
              <Image
                source={require('@/assets/images/icons/attachments.png')}
                style={{
                  width: 14,
                  height: 14,
                  resizeMode: 'contain',
                  tintColor: theme?.logoColor,
                }}
              />
              <Text
                allowFontScaling={false}
                style={{
                  // textDecorationLine: 'underline',
                  color: theme?.logoColor,
                  fontSize: 13,
                  left: 5,
                  fontFamily: FONT_FAMILY?.IBMPlexBold,
                }}>
                Show Attachements
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
  const openBottomSheet = () => {
    if (sheetRef?.current) {
      sheetRef?.current.expand();
    }
  };
  const getAllDropDownData = async () => {
    try {
      const responseDropData = await getAllDropDownApi();
      const mappedObject = responseDropData?.data.reduce((acc, item) => {
        if (!acc[item.enumType]) {
          acc[item.enumType] = [];
        }
        const mappedKeys = item.keys.map(keyF => ({
          id:
            keyF.id != undefined
              ? keyF?.id
              : keyF.recordid != undefined
                ? keyF?.recordid
                : keyF?.key != undefined
                  ? keyF?.key
                  : keyF?.id,

          title: keyF.name != undefined ? keyF.name : keyF?.value,
        }));
        acc[item.enumType].push(...mappedKeys);
        return acc;
      }, {});

      dispatchToStore(setDropDownData(mappedObject));
    } catch (err) {
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      }
      console.log('dataErrorr', error?.response?.data);
    }
  };
  const downloadBrochure = async name => {
    const source = await getProfilePicUrlApi(name, userData?.access_token);

    if (source) {
      const extension = name.slice(((name.lastIndexOf('.') - 1) >>> 0) + 2);

      let dirs = ReactNativeBlobUtil.fs.dirs;
      ReactNativeBlobUtil.config({
        fileCache: true,
        appendExt: extension,
        path: `${dirs.DocumentDir}/${name}.${extension}`,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: name,
          description: 'File downloaded by download manager.',
          mime:
            extension == 'png' ||
            extension == 'jpg' ||
            extension == 'jpeg' ||
            extension == 'heic'
              ? `image/${extension}`
              : `application/${extension}`,
          // mime: extension,
        },
      })
        .fetch('GET', source)
        .then(res => {
          setDownloadStart(false);
          setShowLoader('');
          if (Platform.OS === 'ios') {
            const filePath = res.path();
            let options = {
              type: extension,
              url: filePath,
              saveToFiles: true,
            };
            Share.open(options)
              .then(resp => {
                console.log(resp);
              })
              .catch(err => console.log(err));
          } else {
          }
        })
        .catch(err => {
          console.log('BLOB ERROR -> ', err);
          setDownloadStart(false);
          setShowLoader('');
        });
    }
  };
  const renderAttachments = ({item}) => {
    return (
      <View
        style={{
          marginTop: 25,
          width: screenWidth * 0.9,
          height: 33,
          justifyContent: 'center',
          borderWidth: 1,
          borderRadius: 10,
          borderColor: theme?.textGrey,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: 25,
            height: 25,
            borderRadius: 25 / 2,
            backgroundColor: theme?.logoColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('@/assets/images/icons/attachments.png')}
            style={{height: 12, width: 12, tintColor: theme?.white}}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            if (downloadStart == false) {
              setDownloadStart(true);
              setShowLoader(item?.Attachment?.filename);
              downloadBrochure(item?.Attachment?.filename);
            }
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '90%',
          }}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              width: screenWidth * 0.7,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              fontSize: 15,
              color: theme?.black,
            }}>
            {item?.Attachment?.filename}
          </Text>

          <View
            style={{
              width: 25,
              height: 25,
              borderRadius: 25 / 2,
              backgroundColor: theme?.logoColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {item?.Attachment?.filename == showLoader ? (
              <ActivityIndicator size={'small'} color={theme?.white} />
            ) : (
              <Image
                source={require('@/assets/images/icons/download.png')}
                style={{height: 12, width: 12, tintColor: theme?.white}}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const registerDeviceOnBackend = async () => {
    try {
      let bundleId = await DeviceInfo.getUniqueId();
      let device = await DeviceInfo.getDeviceName();
      const fcmToken = await messaging().getToken();
      console.log('FCM', fcmToken);
      let payloadWp = {
        fcm_token: fcmToken,
        identifier: bundleId,
        device_alias: device,
      };
      let payloadNode = {
        deviceToken: fcmToken,
      };

      const register = await RegisterDevice(payloadWp);
      const registerNode = await updateFcmApi(payloadNode);
      const reset = await ResetNotificationCount();
      const resetWp = await ResetNotificationCountWP({fcm_token: fcmToken});
      getNotifications();
    } catch (err) {
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      }
      crashlytics().log('RegisterDevice On Backend Api Agent Dashboard');
      crashlytics().recordError(error);
    }
  };
  return (
    <>
      <View
        onStartShouldSetResponder={() => {
          if (sheetRef?.current) {
            sheetRef?.current?.close();
          }
        }}
        style={{
          flex: 1,
          backgroundColor: theme?.white,
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
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingHorizontal: 10,
            height: 80,
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
          heading={'Dashboard'}
          headingViewStyles={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: 10,
            paddingLeft: 20,
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
          notificationIcon={true}
        />
        <ScrollView
          style={{backgroundColor: theme?.white}}
          nestedScrollEnabled={true}
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}>
          {/* ------------------------  Latest Leads -----------------------------------                      */}
          <View style={{flex: 1, paddingHorizontal: 20, marginTop: 20}}>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: screenWidth * 0.7,
                  justifyContent: 'space-between',
                }}>
                <Image
                  source={require('@/assets/images/icons/latestLeads.png')}
                  style={{height: 23, width: 23}}
                  resizeMode="contain"
                />
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 22,
                    width: screenWidth * 0.62,
                    fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                    color: theme?.black,
                  }}>
                  Latest Leads
                </Text>
              </View>

              {latestLeads?.length > 0 && (
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => {
                    sheetRef?.current?.close();
                    props?.navigation?.navigate('AllLeads');
                  }}
                  activeOpacity={1}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                      color: theme?.logoColor,
                    }}>
                    View All
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View>
              {leadsSkeleton ? (
                <AgentLeadSkeleton />
              ) : (
                <FlatList
                  bounces={false}
                  style={{marginTop: 10}}
                  data={latestLeads}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  renderItem={renderLatestLeads}
                  ListEmptyComponent={() => {
                    return (
                      <View
                        style={{
                          alignItems: 'center',
                          marginTop: 20,
                          justifyContent: 'center',
                          width: screenWidth,
                          alignSelf: 'center',
                          height: screenHeight * 0.25,
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: 16,
                            fontFamily: FONT_FAMILY?.IBMPlexMedium,
                            color: theme?.textGrey,
                          }}>
                          {leadCrash}
                        </Text>
                      </View>
                    );
                  }}
                />
              )}
            </View>
          </View>
          {/* ------------------------  Latest Activities -----------------------------------                      */}
          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,
              marginTop: 20,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: screenWidth * 0.7,
                  justifyContent: 'space-between',
                }}>
                <Image
                  source={require('@/assets/images/icons/activities.png')}
                  style={{height: 23, width: 23}}
                  resizeMode="contain"
                />
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 22,
                    width: screenWidth * 0.62,
                    fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                    color: theme?.black,
                  }}>
                  Latest Activities
                </Text>
              </View>

              {latestActivities?.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    sheetRef?.current?.close();
                    props?.navigation?.navigate('ActivityDetails');
                  }}
                  activeOpacity={1}
                  style={{alignSelf: 'center'}}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                      color: theme?.logoColor,
                    }}>
                    View All
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {activitiesSkeleton ? (
              <AgentActivitiesSkeleton />
            ) : (
              <FlatList
                bounces={false}
                style={{marginTop: 20}}
                data={latestActivities}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={renderLatestActivities}
                ListEmptyComponent={() => {
                  return (
                    <View
                      style={{
                        alignItems: 'center',
                        marginTop: 20,
                        justifyContent: 'center',
                        width: screenWidth,
                        height: screenHeight * 0.25,
                        alignSelf: 'center',
                      }}>
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
            )}
          </View>
        </ScrollView>

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
            openBottomSheet();
          }}>
          <Image
            source={require('@/assets/images/icons/plus.png')}
            style={{height: 25, width: 25}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <AttachmentViewerPopup
        show={showAttachViewerPopup}
        onClose={() => {
          setRenderAttachData([]);
          setShowAttachViewerPopup(false);
        }}
        onTouchOutside={() => {
          setRenderAttachData([]);
          setShowAttachViewerPopup(false);
        }}
        attachData={renderAttachData}
        renderAttach={renderAttachments}
      />
      <LogActivityBottomSheet
        logListingData={logListing}
        renderLogListing={renderLogListing}
        sheetRef={sheetRef}
        snapPoints={snapPoints}
      />
    </>
  );
};
export default AgentHome;
