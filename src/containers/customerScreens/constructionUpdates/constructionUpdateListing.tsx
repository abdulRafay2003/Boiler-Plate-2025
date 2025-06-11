import React, {useEffect, useState} from 'react';
import theme from '@/assets/stylesheet/theme';
import {
  StatusBar,
  Dimensions,
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Headers} from '@/components/header/headers';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {ImageProgress} from '@/components/ImageProgress';
import crashlytics from '@react-native-firebase/crashlytics';
import ConstructionUpdateListSkeleton from '@/components/skeletons/constructionUpdateListSkeleton';
import {ConstructionListApi} from '@/services/apiMethods/construction';
import {PortfoliListingApi} from '@/services/apiMethods/customerDashboard';
import {AxiosError} from 'axios';
import {setUserDetail} from '@/redux/actions/UserActions';
import {useDispatch} from 'react-redux';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

const ConstructionUpdateList = props => {
  const dispatch = useDispatch();
  const [constructionUpdateList, setConstructionUpdateList] = useState([]);
  const [length, setLength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiCrashResponse, setApiCrashResponse] = useState(false);
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }

    getPortfolioList();
  }, []);
  const getPortfolioList = async () => {
    try {
      const portfolioListData = await PortfoliListingApi(1, 1000);
      if (portfolioListData?.rowData?.length > 0) {
        let arr = [];
        portfolioListData?.rowData?.map(item => {
          arr.push(item?.property?.propertyId.toString());
        });
        if (arr?.length > 0) {
          getConstructionUpdateListData(arr);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
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
        setApiCrashResponse(true);
      }
      crashlytics().log('Get Portfolio Listing Api Portfolio Listing Screen.');
      crashlytics().recordError(error);
    }
  };
  const getConstructionUpdateListData = async arr => {
    try {
      let body = {
        ids: arr,
      };
      const constructionListData = await ConstructionListApi(body);
      if (constructionListData?.construction_updates) {
        setLength(constructionListData?.construction_updates?.length);
        setLoading(false);
        setConstructionUpdateList(constructionListData?.construction_updates);
      } else {
        setConstructionUpdateList([]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      crashlytics().log(
        'Get Construction Update Listing Api Construction Update Listing Screen',
      );
      crashlytics().recordError(error);
      setLoading(false);
    }
  };
  const renderConstructionUpdateListing = ({item}) => {
    return (
      <TouchableOpacity
        style={{padding: 20, flexDirection: 'row'}}
        activeOpacity={1}
        onPress={() => {
          props?.navigation?.navigate('ConstructionUpdateDetail', {
            id: item?.id,
          });
        }}>
        {item?.listing_image != null ? (
          <ImageProgress
            source={item?.listing_image}
            // imageSource={item?.listing_image}
            imageStyles={{
              height: 130,
              width: screenWidth * 0.4269,
              borderRadius: 20,
            }}
            imageStyle={{
              borderRadius: 10,
              height: 130,
              width: screenWidth * 0.4269,
            }}
            resizeMode={'cover'}
            activityIndicatorSize={'small'}
            activityIndicatorColor={theme?.logoColor}
          />
        ) : (
          <Image
            source={require('@/assets/images/icons/logo_PH.png')}
            style={{height: 140, width: screenWidth * 0.4269, borderRadius: 20}}
            resizeMode="cover"
          />
        )}
        <View
          style={{
            marginLeft: 20,
            justifyContent: 'center',
            width: screenWidth,
          }}>
          <Text
            allowFontScaling={false}
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              color: theme?.black,
              fontSize: 16,
              flexWrap: 'wrap',
              width: screenWidth * 0.4269,
              marginBottom: 5,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
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
              width: screenWidth * 0.4269,
              marginBottom: 5,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
            }}>
            {item?.short_description}
          </Text>
          <View></View>
          <Text
            allowFontScaling={false}
            style={{
              color: theme?.textGrey,
              fontSize: 12,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              marginTop: 10,
            }}>
            {/* Last Update: {moment(item?.updated_at).format('DD MMM YYYY')} */}
            Last Update: {item?.updated_at}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{backgroundColor: theme?.white, height: screenHeight}}>
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
        heading={'Construction Updates'}
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
        notificationIcon={false}
        onNotificationPress={() => {
          props?.navigation?.navigate('Notification');
        }}
      />
      {loading ? (
        <ConstructionUpdateListSkeleton />
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
              <Image
                source={require('@/assets/images/icons/smallAlert_Icon.png')}
                style={{height: 50, width: 50, tintColor: theme?.logoColor}}
                resizeMode="center"
              />
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
            <View style={{flex: 1, paddingTop: 20}}>
              <FlatList
                bounces={false}
                data={constructionUpdateList}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={renderConstructionUpdateListing}
                contentContainerStyle={{paddingBottom: 100}}
                // onEndReached={() => {
                //   if (length >= 10) {
                //     getConstructionUpdateListData(constructionUpdateList?.length);
                //   }
                // }}
                // onEndReachedThreshold={0}
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
                        No construction updates at the moment.
                      </Text>
                    </View>
                  );
                }}
                ListFooterComponent={() => {
                  return (
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      {length >= 10 ? (
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
                          {constructionUpdateList?.length > 0 ? '' : ''}
                        </Text>
                      )}
                    </View>
                  );
                }}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};
export default ConstructionUpdateList;
