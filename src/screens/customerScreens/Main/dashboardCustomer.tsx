import React, {useEffect, useLayoutEffect, useState} from 'react';
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
  ImageBackground,
  BackHandler,
  Platform,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator,
  AppState,
  Alert,
  Linking,
} from 'react-native';
import {Headers} from '@/components/header/headers';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {
  GetNotifications,
  RegisterDevice,
  ResetNotificationCountWP,
} from '@/services/apiMethods/notification';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment';
import {Loader} from '@/components/loader';
import {useIsFocused} from '@react-navigation/native';
import {
  setAlertState,
  setGotoPayment,
  setLoader,
  setNotificationCounts,
  setPaymentConfigs,
  setPortfolioMatch,
  setUserDetail,
} from '@/redux/slice/UserSlice/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import notifee, {EventType} from '@notifee/react-native';
import PushNotification from 'react-native-push-notification';
import crashlytics from '@react-native-firebase/crashlytics';
import DashboardPortfolioSkeleton from '@/components/skeletons/dashboardPortfolio';
import DashboardFinancialsSkeleton from '@/components/skeletons/dashboardFinancials';
import DashboardConstructionUpdateSkeleton from '@/components/skeletons/dashboardConstructionUpdate';
import {PaymenntApprovalPopup} from '@/components/modal/paymentApprovalPending';
import {
  buttonBackgroundColor,
  buttonHeight,
  buttonText,
  buttonWidth,
  fianacialpaymentRecieptLink,
  finalAmountFinancials,
  formatValue,
  invoiceLink,
  projectDescription,
  sortDate,
} from '@/utils/business.helper';
import {ConstructionListApiDashboard} from '@/services/apiMethods/construction';
import {
  PortfoliListingApi,
  PortfoliListingDashboardApi,
} from '@/services/apiMethods/customerDashboard';
import {
  FinancialsListingApi,
  PaymentIntent,
} from '@/services/apiMethods/financials';
import LoaderNew from '@/components/loaderNew';
import {GetAllProjects} from '@/services/apiMethods/vrTour';
import {AxiosError} from 'axios';
import {updateFcmApi} from '@/services/apiMethods/updateFcm';
import {
  getProfilePicUrlApi,
  getUserProfileApi,
} from '@/services/apiMethods/authApis';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {
  GetNodeNotifications,
  ResetNotificationCount,
} from '@/services/apiMethods/notificationNode';
import {AlertPopupAuth} from '@/components/modal/alertPopupAuth';
import {GetConfigApi} from '@/services/apiMethods/configApi';
import FinancialsListingItem from '@/components/financialListinItem';
import VersionCheck from 'react-native-version-check';
import { dispatchToStore, RootState } from '@/redux/store';

let screenWidth = Math.round(Dimensions.get('window').width);
const DashBoardCustomer = props => {
  const focused = useIsFocused();
  const alertState = useSelector((state: RootState) => state?.user?.alertState);
  const userData = useSelector((state: RootState) => state?.user?.userDetail);
  const isLoadingRedux = useSelector((state: RootState) => state?.user?.loading);
  const paymentConfigs = useSelector((state: RootState) => state?.user?.paymentConfigs);
  const backFromPayment = useSelector((state: RootState) => state?.user?.gotoPayment);
  const [clickedItem, setClickedItem] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [portfolioListing, setPortfolioListing] = useState([]);
  const [constructionUpdateList, setConstructionUpdateList] = useState([]);
  const [financialsListing, setFinancialsListing] = useState([]);
  const [protfolioLoader, setPortfolioLoader] = useState(true);
  const [financialLoader, setFinancialLoader] = useState(true);
  const [constructionLoader, setConstructionLoader] = useState(true);
  const [payNow, setPayNow] = useState(false);
  const [paymentValue, setPaymentValue] = useState('');
  const [url, setUrl] = useState('');
  const [buttonLoader, setButtonLoader] = useState(false);
  const [apiCrash, setApiCrash] = useState(false);
  const [portfolioCrash, setPortfolioCrash] = useState(
    'No portfolio at the moment.',
  );
  const [financialCrash, setFinancialCrash] = useState(
    'No transactions at the moment.',
  );
  const [constructionCrash, setConstructionCrash] = useState(
    'No construction updates at the moment.',
  );
  const [confirmationText, setConfirmationText] = useState([]);

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
            ? 'CDashboard'
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
                  : detail?.notification?.data?.type == 'multipleactivity'
                  ? 'ActivityDetails'
                  : detail?.notification?.data?.type == 'lead'
                  ? 'SingleLeadDetails'
                  : detail?.notification?.data?.type == 'financial'
                  ? 'NotificationItem'
                  : detail?.notification?.data?.type == 'contract'
                  ? 'PortfolioDetail'
                  : detail?.notification?.data?.type == 'paymentPlan'
                  ? 'NotificationItem'
                  : detail?.notification?.data?.type == 'general'
                  ? 'Notification'
                  : 'BlogDetail';
              const parent_route =
                detail?.notification?.data?.post_type == 'Project'
                  ? ''
                  : detail?.notification?.data?.post_type ==
                    'Construction Update'
                  ? 'CDashboard'
                  : detail?.notification?.data?.type == 'agent'
                  ? ''
                  : detail?.notification?.data?.type == 'customer'
                  ? ''
                  : detail?.notification?.data?.type == 'activity'
                  ? 'ADashboard'
                  : detail?.notification?.data?.type == 'multipleactivity'
                  ? 'ADashboard'
                  : detail?.notification?.data?.type == 'lead'
                  ? 'ADashboard'
                  : detail?.notification?.data?.type == 'financial'
                  ? 'CDashboard'
                  : detail?.notification?.data?.type == 'contract'
                  ? 'CDashboard'
                  : detail?.notification?.data?.type == 'paymentPlan'
                  ? 'CDashboard'
                  : detail?.notification?.data?.type == 'general'
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
                    let jsonData = JSON.parse(detail?.notification.data.data);
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
                } else if (route == 'PortfolioDetail') {
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
    getProfileUrl();
    getConfig();
    clearAll();
    getNotifications();
    getConstructionListing();
    getPortfolioListing();
    getFinancialListing();
    dispatchToStore(setLoader(false));
    registerDeviceOnBackend();
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);
  useEffect(() => {
    if (focused == true) {
      checkVersion();
      if (backFromPayment == true) {
        dispatchToStore(setGotoPayment(false));
        setFinancialLoader(true);
        getFinancialListing();
      } else {
        setPortfolioLoader(true);
        setFinancialLoader(true);
        setConstructionLoader(true);
        getConfig();
        getNotifications();
        getConstructionListing();
        getPortfolioListing();
        getFinancialListing();
        dispatchToStore(setLoader(false));
      }
    }
  }, [focused]);
  useLayoutEffect(() => {
    if (props?.route?.params?.from == 'More') {
      props?.navigation?.setOptions({
        gestureEnabled: false,
      });
    }
  }, []);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      backHandler.remove();
    };
  }, [payNow]);
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

  const handleBackButtonClick = () => {
    if (payNow == true) {
      setPayNow(false);
    }

    return true;
  };
  const registerDeviceOnBackend = async () => {
    try {
      let bundleId = await DeviceInfo.getUniqueId();
      let device = await DeviceInfo.getDeviceName();
      const fcmToken = await messaging().getToken();
      // console.log('FCM', fcmToken);
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
      console.log('errorregisterDeviceOnBackend', error);
      if (error?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      }
      crashlytics().log('RegisterDevice On Backend Api Agent Dashboard');
      crashlytics().recordError(error);
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
  const getConfig = async () => {
    try {
      const getConfigData = await GetConfigApi();
      if (getConfigData?.data) {
        dispatchToStore(setPaymentConfigs(getConfigData?.data));
        // dispatch(
        //   setPaymentConfigs({
        //     vat: 0,
        //     processingFee: 0,
        //     chequeCancellation: 0,
        //   }),
        // );
      }
    } catch (err) {
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else {
        dispatchToStore(
          setPaymentConfigs({
            vat: 0,
            processingFee: 0,
            chequeCancellation: 0,
          }),
        );
      }
    }
  };
  const renderPortfolioListing = ({item, index}) => {
    console.log(
      `item?.image=> ${item?.image},\nitem?.unit?.unitCode=> ${item?.unit?.unitCode},\nitem?.projectName=> ${item?.projectName},\nitem?.property?.markettingName=> ${item?.property?.markettingName},\nitem?.property?.type=> ${item?.property?.type},\nitem?.property?.buildingAddress=> ${item?.property?.buildingAddress}\n.\n.\n.`,
    );
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          paddingVertical: 20,
          marginLeft: index == 0 ? 0 : 10,
        }}
        activeOpacity={1}
        onPress={() => {
          props?.navigation?.navigate('PortfolioDetail', {
            wpProjectId: item?.wpId,
            nProjecId: item?.property?.propertyId,
            nPropertyId: item?.property?.id,
            nUnitId: item?.unit?.id,
            nSuiteObjectId: item?.id,
            nParentId:
              item?.property?.parentId != null &&
              item?.property?.parentId != undefined
                ? item?.property?.parentId
                : item?.property?.propertyId,
          });
        }}>
        <View
          style={{
            width: 200,
          }}>
          <ImageBackground
            source={
              item?.image != null
                ? {uri: item?.image}
                : require('@/assets/images/icons/logo_PH.png')
            }
            style={{
              width: 200,
              height: 150,
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
              borderRadius: 35,
            }}
            imageStyle={{
              width: 200,
              height: 150,
              borderRadius: 10,
              alignSelf: 'center',
            }}
            resizeMode={'cover'}>
            <View
              style={{
                backgroundColor: theme?.black,
                borderRadius: 8,
                top: 10,
                right: 10,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 12,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  color: theme?.white,
                }}>
                Unit: {item?.unit?.unitCode}
              </Text>
            </View>
          </ImageBackground>
          {item?.projectName != undefined ? (
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: theme?.logoColor,
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
                flexWrap: 'wrap',
                width: 190,
                marginTop: 10,
              }}>
              {item?.projectName}
            </Text>
          ) : (
            // <View
            //   style={{
            //     height: 35,
            //   }}
            // />
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: theme?.logoColor,
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
                flexWrap: 'wrap',
                width: 190,
                marginTop: 10,
              }}>
              {item?.property?.markettingName}
            </Text>
          )}
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: theme?.black,
              fontSize: 14,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              flexWrap: 'wrap',
              width: 190,
              marginTop: 5,
            }}>
            {`${
              item?.unit?.bedRooms != null
                ? item?.unit?.bedRooms + ' Bed - '
                : ''
            }${
              item?.unit?.bathRooms != null
                ? item?.unit?.bathRooms + ' Bath - '
                : ''
            }${
              item?.unit?.totalArea != null
                ? item?.unit?.totalArea + ' Sq.ft'
                : ''
            }`}
          </Text>
          {projectDescription(item) != '' ? (
            <View style={{flexDirection: 'row', marginTop: 5}}>
              <Image
                source={require('@/assets/images/icons/marker.png')}
                style={{
                  height: 15,
                  width: 15,
                  tintColor: theme?.black,
                  marginRight: 5,
                }}
                resizeMode="contain"
              />
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: theme?.black,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  flexWrap: 'wrap',
                  width: 180,
                }}>
                {projectDescription(item)}

                {/* {projectDescription(item, {title: item?.projectName})} */}
              </Text>
            </View>
          ) : (
            <View style={{flexDirection: 'row', marginTop: 5}} />
          )}
        </View>
      </TouchableOpacity>
    );
  };
  const renderFinancialsListing = ({item, index}) => {
    console.log('renderFinancialsListing', item);
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
        from={'Dashboard'}
      />
    );
  };
  const renderConstructionUpdateListing = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{marginTop: 20, width: 180, marginLeft: index > 0 ? 20 : 0}}
        activeOpacity={1}
        onPress={() => {
          props?.navigation?.navigate('ConstructionUpdateDetail', {
            id: item?.id,
          });
        }}>
        <ImageBackground
          source={
            item?.dashboard_image != null
              ? {uri: item?.dashboard_image}
              : require('@/assets/images/icons/logo_PH.png')
          }
          style={{
            width: 170,
            height: 150,
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            borderRadius: 35,
          }}
          imageStyle={{
            width: 170,
            height: 150,
            borderRadius: 10,
            alignSelf: 'center',
          }}
          resizeMode="cover">
          <View
            style={{
              backgroundColor: theme?.black,
              borderRadius: 8,
              top: 10,
              right: 10,
              paddingVertical: 5,
              paddingHorizontal: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 12,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
                color: theme?.white,
              }}>
              {item?.completion_percentage} Complete
            </Text>
          </View>
        </ImageBackground>
        <View
          style={{
            justifyContent: 'center',
            width: screenWidth,
          }}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: theme?.logoColor,
              fontSize: 16,
              flexWrap: 'wrap',
              width: 170,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              marginVertical: 5,
            }}>
            {item?.title}
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              color: theme?.black,
              fontSize: 14,
              flexWrap: 'wrap',
              width: 170,
              marginBottom: 5,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
            }}>
            {item?.short_description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const getFinancialListing = async () => {
    try {
      const financialListData = await FinancialsListingApi(
        '?pageNumber=1&pageSize=3',
      );
      if (financialListData?.rowData?.length > 0) {
        setFinancialsListing(financialListData?.rowData);
        setFinancialLoader(false);
        setFinancialCrash('No transactions at the moment.');
      } else {
        setFinancialsListing([]);
        setFinancialLoader(false);
        setFinancialCrash('No transactions at the moment.');
      }
    } catch (error) {
      const err = error as AxiosError;
      setFinancialsListing([]);
      setFinancialLoader(false);
      if (err?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (err?.response?.status >= 500 && err?.response?.status <= 599) {
        setFinancialCrash('Unable to load data at the moment.');
      }
      setFinancialLoader(false);
      crashlytics().log('Get Portofilio Listing Api on Dashboard');
      crashlytics().recordError(error);
    }
  };
  const getPortfolioListing = async () => {
    try {
      const projectsData = await GetAllProjects();
      // console.log('dsxfcgvhbjnkm,', projectsData);
      dispatchToStore(setPortfolioMatch(projectsData));
      const portfolioListData = await PortfoliListingDashboardApi();
      if (portfolioListData?.length > 0) {
        let arr = [];
        let idsArr = [];
        portfolioListData?.map(item => {
          idsArr?.push(item?.property?.id.toString());
          const find = projectsData?.find(itemx => {
            console.log(
              'item?.property?.parentId == itemx?.netsuite_details_id',
              // item?.property?.parentId,
              // itemx?.netsuite_details_id,
              itemx,
            );
            return item?.property?.parentId == itemx?.netsuite_details_id;
          });
          if (find) {
            arr?.push({
              ...item,
              image: find?.protfolio_dashboard_image,
              projectName: find?.title,
              wpId: find?.id,
            });
          } else {
            arr?.push(item);
          }
        });
        // console.log('projectsData', arr);
        setPortfolioListing(arr);
        setPortfolioLoader(false);
        setPortfolioCrash('No portfolio at the moment.');
        // getConstructionListing(idsArr);
      } else {
        setPortfolioListing([]);
        setConstructionUpdateList([]);
        setConstructionLoader(false);
        setPortfolioLoader(false);
        setPortfolioCrash('No portfolio at the moment.');
      }
    } catch (error) {
      const err = error as AxiosError;
      console.log('errorerrorerrorerror', err?.response?.data);

      setPortfolioListing([]);
      setPortfolioLoader(false);
      setConstructionUpdateList([]);
      setConstructionLoader(false);
      if (err?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (err?.response?.status >= 500 && err?.response?.status <= 599) {
        setPortfolioCrash('Unable to load data at the moment.');
      }
      setPortfolioLoader(false);
      crashlytics().log('Get Portofilio Listing Api on Dashboard');
      crashlytics().recordError(error);
    }
  };
  const getConstructionListing = async () => {
    try {
      const portfolioListAll = await PortfoliListingApi(1, 100000);
      if (portfolioListAll?.rowData?.length > 0) {
        let idsArray = [];
        portfolioListAll?.rowData?.map(item => {
          idsArray.push(item?.property?.propertyId?.toString());
        });
        let body = {
          ids: idsArray,
        };
        const constructionListData = await ConstructionListApiDashboard(
          5,
          1,
          body,
        );
        if (constructionListData?.construction_updates?.length > 0) {
          setConstructionUpdateList(constructionListData?.construction_updates);
          setConstructionLoader(false);
        } else {
          setConstructionUpdateList([]);
          setConstructionLoader(false);
          setConstructionCrash('No construction updates at the moment.');
        }
      } else {
        setConstructionUpdateList([]);
        setConstructionLoader(false);
        setConstructionCrash('No construction updates at the moment.');
      }
    } catch (error) {
      const err = error as AxiosError;
      setConstructionUpdateList([]);
      setConstructionLoader(false);
      crashlytics().log('Get Construction Listing Api Dashboard');
      crashlytics().recordError(error);
      if (err?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        err?.response?.status >= 500 &&
        error?.response?.status <= 500
      ) {
        setConstructionCrash('Unable to load data at the moment.');
      }
    }
  };

  const getUrl = async paymentValue => {
    // console.log('sdfghjkl;', paymentValue);
    // return;
    try {
      let payload = {
        orderParams: {
          order_id: paymentValue?.invoiceId,
          amount: paymentValue?.foreignamount,
          language: 'en',
        },
      };
      const paymentUrl = await PaymentIntent(payload);

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
        dispatchToStore(setGotoPayment(true));
        setClickedItem(0);
        props?.navigation?.navigate('PaymentScreen', {
          url: url,
          projectTitle: paymentValue?.propertyText,
          unitCode: paymentValue?.unit?.unitCode,
        });
      } else {
        setButtonLoader(true);
        getUrl(paymentValue);
      }
    } catch (err) {
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
      crashlytics().log('ProceedToPay Api Dashboard');
      crashlytics().recordError(error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setPortfolioLoader(true);
    setFinancialLoader(true);
    setConstructionLoader(true);
    getConfig();
    getNotifications();
    getConstructionListing();
    getPortfolioListing();
    getFinancialListing();
    dispatchToStore(setLoader(false));
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
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
          if (
            props?.route?.params?.from == 'More' &&
            userData?.role == 'guest'
          ) {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'Dashboard'}],
            });
          } else if (
            props?.route?.params?.from == 'More' &&
            userData?.role == 'customer'
          ) {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'DashboardCustomer'}],
            });
          } else if (
            props?.route?.params?.from == 'More' &&
            userData?.role == 'agent'
          ) {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'DashboardAgent'}],
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
        //  contentContainerStyle={{flex:1}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme?.logoColor}
          />
        }
        nestedScrollEnabled={true}
        // bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, marginTop: 20}}>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexDirection: 'row',
              paddingHorizontal: 20,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 22,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                color: theme?.black,
              }}>
              Portfolio
            </Text>
            {portfolioListing?.length > 0 && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  props?.navigation?.navigate('CustomerPropertyPortfolio');
                }}>
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
          {protfolioLoader ? (
            <DashboardPortfolioSkeleton />
          ) : (
            <FlatList
              bounces={false}
              horizontal
              data={portfolioListing}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: portfolioListing?.length > 0 ? 20 : 0,
              }}
              renderItem={renderPortfolioListing}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      alignItems: 'center',
                      marginTop: 20,
                      justifyContent: 'center',
                      width: screenWidth,
                      height: 245,
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 16,
                        fontFamily: FONT_FAMILY?.IBMPlexMedium,
                        color: theme?.textGrey,
                      }}>
                      {portfolioCrash}
                    </Text>
                  </View>
                );
              }}
            />
          )}
        </View>

        <View style={{flex: 1}}>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexDirection: 'row',
              paddingHorizontal: 20,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 22,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                color: theme?.black,
              }}>
              Financials
            </Text>
            {financialsListing?.length > 0 && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  props?.navigation?.navigate('Financials');
                }}>
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
          {financialLoader ? (
            <DashboardFinancialsSkeleton />
          ) : (
            <FlatList
              bounces={false}
              data={financialsListing}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              style={{
                paddingHorizontal: financialsListing?.length > 0 ? 20 : 0,
              }}
              renderItem={renderFinancialsListing}
              contentContainerStyle={{
                paddingBottom: 20,
              }}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      alignItems: 'center',
                      marginTop: 20,
                      justifyContent: 'center',
                      width: screenWidth,
                      height: 460,
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 16,
                        fontFamily: FONT_FAMILY?.IBMPlexMedium,
                        color: theme?.textGrey,
                      }}>
                      {financialCrash}
                    </Text>
                  </View>
                );
              }}
            />
          )}
        </View>

        <View style={{flex: 1, marginTop: 20, marginBottom: 20}}>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexDirection: 'row',
              paddingHorizontal: 20,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 22,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                color: theme?.black,
              }}>
              Construction Updates
            </Text>
            {constructionUpdateList?.length > 3 && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  props?.navigation?.navigate('ConstructionUpdateList');
                }}>
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
          {constructionLoader ? (
            <DashboardConstructionUpdateSkeleton />
          ) : (
            <FlatList
              bounces={false}
              horizontal
              data={constructionUpdateList}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: constructionUpdateList?.length > 0 ? 20 : 0,
              }}
              renderItem={renderConstructionUpdateListing}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      alignItems: 'center',
                      marginTop: 20,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      width: screenWidth,
                      height: 220,
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 16,
                        fontFamily: FONT_FAMILY?.IBMPlexMedium,
                        color: theme?.textGrey,
                      }}>
                      {constructionCrash}
                    </Text>
                  </View>
                );
              }}
            />
          )}
        </View>
      </ScrollView>
      <PaymenntApprovalPopup
        height={270}
        show={payNow}
        onClose={() => {
          setClickedItem(0);
          setPayNow(false);
        }}
        confirmationText={confirmationText}
        paymentAmount={paymentValue}
        buttonLoader={buttonLoader}
        onTouchOutside={() => {
          setClickedItem(0);
          setPayNow(false);
        }}
        onPressProceed={() => {
          // dispatchToStore(setLoader(true));
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
      <LoaderNew visible={isLoadingRedux} color={theme?.logoColor} />
    </>
  );
};
export default DashBoardCustomer;
