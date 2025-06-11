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
  ImageBackground,
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
import {
  setNotificationCounts,
  setUserDetail,
} from '@/redux/actions/UserActions';
import {useDispatch} from 'react-redux';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import PushNotification from 'react-native-push-notification';
import crashlytics from '@react-native-firebase/crashlytics';
import MyInvoiceSkeleton from '@/components/skeletons/myInvoiceSkeleton';
import MyPropertiesSkeleton from '@/components/skeletons/myPropertiesSkeleton';
import {ImageProgress} from '@/components/ImageProgress';
import {PortfoliListingApi} from '@/services/apiMethods/customerDashboard';
import {GetAllProjects} from '@/services/apiMethods/vrTour';
import {AxiosError} from 'axios';
import {projectDescription} from '@/utils/business.helper';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
const CustomerPropertyPortfolio = props => {
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const [myPropertiesList, setMyPropertiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMark, setLoadingMark] = useState(false);
  const [length, setLength] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [projectData, setProjectData] = useState([]);
  const [portfolioCrash, setPortfolioCrash] = useState(
    'No portfolio at the moment.',
  );
  useEffect(() => {
    getProjectsData();
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, [focused]);

  const renderPortfolioListing = ({item, index}) => {
    console.log('sdxfcgvhbjnkm,', item);
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          marginBottom: 30,
          // width: '100%',
          width: screenWidth * 0.9,
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
        <ImageBackground
          source={
            item?.image != undefined
              ? {uri: item?.image}
              : require('@/assets/images/icons/logo_PH.png')
          }
          style={{
            // width: 335,
            width: screenWidth * 0.9,
            height: 150,
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            borderRadius: 15,
          }}
          imageStyle={{
            // width: 335,
            width: screenWidth * 0.9,
            height: 150,
            borderRadius: 10,
            alignSelf: 'center',
          }}
          resizeMode={item?.image != undefined ? 'contain' : 'cover'}>
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
              fontSize: 20,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.logoColor,
              width: '100%',
              marginTop: 10,
            }}>
            {item?.projectName}
          </Text>
        ) : (
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 20,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.logoColor,
              width: '100%',
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
            fontSize: 16,
            fontFamily: FONT_FAMILY?.IBMPlexRegular,
            color: theme?.black,
            marginTop: 5,
          }}>
          {`${
            item?.unit?.bedRooms != null ? item?.unit?.bedRooms + ' Bed - ' : ''
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
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
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
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                color: theme?.black,
                width: '95%',
              }}>
              {projectDescription(item)}
            </Text>
          </View>
        ) : (
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}
          />
        )}
      </TouchableOpacity>
    );
  };
  const getProjectsData = async () => {
    try {
      const projectsData = await GetAllProjects();
      if (projectsData?.length > 0) {
        setProjectData(projectsData);
        getPortfolioList(pageNo, projectsData);
      }
    } catch (err) {
      setLoading(false);
      setMyPropertiesList([]);
      setPortfolioCrash('Unable to load data at the moment.');
      crashlytics().log('Get All Projects Api Portfolio Listing Screen.');
      crashlytics().recordError(err);
    }
  };
  const getPortfolioList = async (pageNo, projectData) => {
    try {
      const portfolioListData = await PortfoliListingApi(pageNo, 5);
      if (portfolioListData?.rowData?.length > 0) {
        let arr = [];
        portfolioListData?.rowData?.map(item => {
          let find = projectData?.find(itemF => {
            return item?.property?.parentId == itemF?.netsuite_details_id;
          });
          if (find) {
            arr?.push({
              ...item,
              image: find?.protfolio_listing_image,
              projectName: find?.title,
              wpId: find?.id,
            });
          } else {
            arr?.push(item);
          }
        });

        if (pageNo > 1) {
          let merge = [...myPropertiesList, ...arr];
          setMyPropertiesList(merge);
          setLength(portfolioListData?.count);
        } else {
          setMyPropertiesList(arr);
          setLength(portfolioListData?.count);
        }
        setLoading(false);
        setPortfolioCrash('No portfolio at the moment.');
      } else {
        setLoading(false);
        setPortfolioCrash('No portfolio at the moment.');
      }
    } catch (err) {
      setLoading(false);
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatch(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (
        error?.response?.status >= 500 &&
        error?.response?.status <= 500
      ) {
        setMyPropertiesList([]);
        setPortfolioCrash('Unable to load data at the moment.');
      }
      crashlytics().log('Get Portfolio Listing Api Portfolio Listing Screen.');
      crashlytics().recordError(error);
    }
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
        heading={'Portfolio'}
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
        <MyPropertiesSkeleton />
      ) : (
        <>
          {myPropertiesList?.length > 0 ? (
            <View
              style={{
                flex: 1,
                paddingHorizontal: 20,
                marginTop: 35,
                width: screenWidth,
              }}>
              <FlatList
                contentContainerStyle={{
                  alignSelf: 'center',
                }}
                style={{
                  width: screenWidth * 0.9,
                }}
                bounces={false}
                data={myPropertiesList}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={renderPortfolioListing}
                onEndReached={() => {
                  if (myPropertiesList?.length < length) {
                    getPortfolioList(pageNo + 1, projectData);
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
                        height: screenHeight * 0.7,

                        width: screenWidth * 0.99,
                        alignSelf: 'center',
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
                ListFooterComponent={() => {
                  return (
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      {myPropertiesList?.length < length ? (
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
                          {myPropertiesList?.length > 0 ? '' : ''}
                        </Text>
                      )}
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
          )}
        </>
      )}
      {loadingMark && <Loader />}
    </>
  );
};
export default CustomerPropertyPortfolio;
