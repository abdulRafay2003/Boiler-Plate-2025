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
  ActivityIndicator,
  Keyboard,
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
import {useIsFocused} from '@react-navigation/native';
import {
  setNotificationCounts,
  setUserDetail,
} from '@/redux/actions/UserActions';
import {useDispatch} from 'react-redux';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import PushNotification from 'react-native-push-notification';
import crashlytics from '@react-native-firebase/crashlytics';
import {ImageProgress} from '@/components/ImageProgress';
import {SearchBar} from '@/components/searchBar';
import LeadCard from '@/components/cards/leadCard';
import AllLeadsFilterBottomSheet from '@/components/agentBottomSheets/allLeadsFilter';
import LogActivityBottomSheet from '@/components/agentBottomSheets/logActivity';
import AgentAllLeadsSkeleton from '@/components/skeletons/allLeads';
import {AxiosError} from 'axios';
import {allLeadsSearchApi} from '@/services/apiMethods/leadsApis';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
const AllLeads = props => {
  const focused = useIsFocused();
  const leadRef = useRef();
  const dispatch = useDispatch();
  const [leadStatus, setLeadStatus] = useState('');
  const [propertyStatus, setPropertyStatus] = useState('');
  const [dummyArray, setDummyArray] = useState([]);
  const [latestLeads, setLatestLeads] = useState([]);
  const [holderArray, setHolderArray] = useState([]);
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
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [length, setLength] = useState(0);
  const [page, setPage] = useState(1);
  const sheetRef = useRef(null);
  const sheetRefLogs = useRef(null);
  const snapPoints = useMemo(() => ['1%', '1%', '40%'], []);
  const snapPointsLogs = useMemo(() => ['1%', '1%', '45%'], []);
  const [statusDropDown, setStatusDropDown] = useState(false);
  const [statusLable, setStatusLable] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [focusedAll, setFocusedAll] = useState('');
  const [filterBtn, setFilterBtn] = useState(false);
  const [leadStatusDropdDown, setLeadStatusDropdDown] = useState([
    {id: 1, title: 'Lead-Qualified'},
    {id: 2, title: 'Lead-Unqualified'},
  ]);
  const [allLeadsSkeleton, setAllLeadsSkeleton] = useState(true);
  const [statusDropDownProperties, setStatusDropDownProperties] =
    useState(false);
  const [propertiesLableDrop, setPropertiesLableDrop] = useState('');
  const [focusedAllProperties, setFocusedAllProperties] = useState('');
  const [propertiesDropdDown, setPropertiesDropdDown] = useState([
    // {id: 1, titleProperty: 'Al Helio Villas'},
    // {id: 2, titleProperty: 'Al Ameera Tower'},
    // {id: 3, titleProperty: 'Oasis Tower'},
  ]);
  const [leadCrash, setLeadCrash] = useState('No leads at the moment.');
  useEffect(() => {
    getAllLeadsSearch('firstRender', 1);
  }, []);
  useEffect(() => {
    clearAll();
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
  const openBottomSheet = () => {
    if (sheetRef?.current) {
      setSheetOpen(true);
      sheetRef?.current.expand();
    }
  };
  const openBottomSheetLogss = () => {
    if (sheetRefLogs?.current) {
      sheetRefLogs?.current.expand();
    }
  };
  const renderLeadStatus = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setStatusLable(item?.title);
          setLeadStatus(item?.title);
          setStatusDropDown(!statusDropDown);
        }}
        activeOpacity={0.8}
        style={{
          width: '100%',
          paddingVertical: 8,
          justifyContent: 'center',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme?.textGrey,
          alignItems: 'center',
          marginHorizontal: 10,
        }}>
        <Text
          allowFontScaling={false}
          style={{
            alignSelf: 'flex-start',
            // marginLeft: 15,
            fontSize: 14,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.black,
            marginBottom: 5,
          }}>
          {item?.title}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderProperties = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setPropertiesLableDrop(item?.titleProperty);
          setPropertyStatus(item?.titleProperty);
          setStatusDropDownProperties(!statusDropDownProperties);
        }}
        activeOpacity={0.8}
        style={{
          width: '100%',
          paddingVertical: 8,
          justifyContent: 'center',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme?.textGrey,
          alignItems: 'center',
          marginHorizontal: 10,
        }}>
        <Text
          allowFontScaling={false}
          style={{
            alignSelf: 'flex-start',
            // marginLeft: 15,
            fontSize: 14,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.black,
            marginBottom: 5,
          }}>
          {item?.titleProperty}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderLogListing = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          sheetRefLogs?.current?.close();
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
  const getAllLeadsSearch = async (text, pageNumber) => {
    try {
      if (pageNumber <= 1) {
        setAllLeadsSkeleton(true);
      }
      var payLoad;
      if (text == 'firstRender') {
        payLoad = `?pageSize=${8}&pageNumber=${pageNumber}`;
      } else if (leadStatus != '') {
        let temFilterArr = [];
        temFilterArr.push(leadStatus);
        payLoad = `?leadStatus=${JSON.stringify(
          temFilterArr,
        )}&title=${text}&pageSize=${8}&pageNumber=${pageNumber}`;
      } else if (text?.length > 0) {
        payLoad = `?title=${text}&pageSize=${8}&pageNumber=${pageNumber}`;
      } else {
        payLoad = `?pageSize=${8}&pageNumber=${pageNumber}`;
      }
      const responseAllleadsSearch = await allLeadsSearchApi(payLoad);
      if (responseAllleadsSearch?.data?.rowData?.length > 0) {
        if (pageNumber > 1) {
          let merge = [
            ...latestLeads,
            ...responseAllleadsSearch?.data?.rowData,
          ];
          setLatestLeads(merge);
          setLength(responseAllleadsSearch?.data?.count);
          setAllLeadsSkeleton(false);
        } else {
          setLatestLeads(responseAllleadsSearch?.data?.rowData);
          setLength(responseAllleadsSearch?.data?.count);
          setAllLeadsSkeleton(false);
        }
      } else {
        setAllLeadsSkeleton(false);
        setLength(0);
        if (pageNumber <= 1) {
          setLatestLeads([]);
        }
        setPage(1);
      }
      setLeadCrash('No leads at the moment.');
    } catch (err) {
      setAllLeadsSkeleton(false);
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatch(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 500
      ) {
        setLatestLeads([]);
        setLeadCrash('Unable to load data at the moment.');
      }
    }
  };

  return (
    <>
      <View
        onStartShouldSetResponder={() => {
          setStatusDropDown(false);
          setStatusDropDownProperties(false);
          Keyboard?.dismiss();
          if (sheetRef?.current || sheetRefLogs?.current) {
            sheetRef?.current?.close();
            sheetRefLogs?.current?.close();
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
          heading={'ALL LEADS'}
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
          onNotificationPress={null}
          notificationIcon={false}
        />
        <SearchBar
          value={searchValue}
          filterData={latestLeads}
          onPress={() => {
            if (sheetOpen == false) {
              openBottomSheet();
            } else {
              sheetRef?.current?.close();
              setSheetOpen(false);
            }
          }}
          placeHolder={'Search'}
          showFilter={true}
          onChangeTexts={text => {
            if (text?.length > 0) {
              setPage(1);
              getAllLeadsSearch(text, 1);
              setSearchValue(text);
            } else {
              getAllLeadsSearch(text, 1);
              setSearchValue('');
            }
          }}
        />

        {filterBtn ? (
          <TouchableOpacity
            onPress={() => {
              setFilterBtn(false);
              setLeadStatus('');
              setStatusLable('');
              setPage(1);
              setSearchValue('');
              getAllLeadsSearch('firstRender', 1);
              leadRef?.current?.scrollToOffset({animated: true, offset: 0});
            }}
            style={{
              backgroundColor: theme?.logoColor,
              width: screenWidth * 0.2,
              height: 20,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
              alignSelf: 'flex-end',
              right: 20,
              marginTop: 10,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 12,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
                color: theme?.white,
              }}>
              Clear Filter
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              height: 30,
            }}></View>
        )}
        <>
          <View
            style={{
              alignSelf: 'center',
              height: screenHeight * 0.8,
            }}>
            {allLeadsSkeleton ? (
              <AgentAllLeadsSkeleton />
            ) : (
              <FlatList
                ref={leadRef}
                bounces={false}
                contentContainerStyle={{
                  paddingBottom: latestLeads?.length > 0 ? 150 : 0,
                }}
                data={latestLeads}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => {
                  return (
                    <LeadCard
                      item={item}
                      onPressLead={id => {
                        sheetRef?.current?.close();
                        sheetRefLogs?.current?.close();
                        props?.navigation?.navigate('SingleLeadDetails', {
                          LeadId: item?.id,
                        });
                      }}
                    />
                  );
                }}
                onEndReached={() => {
                  if (latestLeads?.length < length) {
                    getAllLeadsSearch(searchValue, page + 1);
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
                      {latestLeads?.length < length ? (
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
                          {latestLeads?.length > 0 ? '' : ''}
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
                        height: screenHeight * 0.5,

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
                        {leadCrash}
                      </Text>
                    </View>
                  );
                }}
              />
            )}
          </View>
        </>
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
            openBottomSheetLogss();
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
        sheetRef={sheetRefLogs}
        snapPoints={snapPointsLogs}
      />
      <AllLeadsFilterBottomSheet
        allLeadsArray={leadStatusDropdDown}
        showDropDown={statusDropDown}
        typeLable={statusLable}
        dropDownFocus={() => {
          setFocusedAll('type');
          setStatusDropDown(!statusDropDown);
          setStatusDropDownProperties(false);
        }}
        focused={focusedAll}
        renderAllLeads={renderLeadStatus}
        renderAllProperties={renderProperties}
        focusedProperties={focusedAllProperties}
        propertiesLable={propertiesLableDrop}
        dropDownFocusProperties={() => {
          setFocusedAllProperties('property');
          setStatusDropDown(false);
          setStatusDropDownProperties(!statusDropDownProperties);
        }}
        showDropDownProperties={statusDropDownProperties}
        allPrpertiesArray={propertiesDropdDown}
        sheetRef={sheetRef}
        snapPoints={snapPoints}
        onSubmit={() => {
          sheetRef?.current?.close();
          setFilterBtn(true);
          setPage(1);
          getAllLeadsSearch(searchValue, 1);
          // getAllLeadsFilter(1);
        }}
      />
    </>
  );
};
export default AllLeads;
