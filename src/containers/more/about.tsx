import theme from '@/assets/stylesheet/theme';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  StatusBar,
  Dimensions,
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Platform,
} from 'react-native';
import {Headers} from '@/components/header/headers';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {GetAboutUs} from '@/services/apiMethods/more';
import AboutSkeleton from '@/components/skeletons/about';
import crashlytics from '@react-native-firebase/crashlytics';
import {useSelector} from 'react-redux';
import {AxiosError} from 'axios';
import { RootState } from '@/redux/store';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

const About = props => {
  const userData = useSelector((state: RootState) => state?.user?.userDetail);
  const [tabList, setTabList] = useState([
    'Our Story',
    'Our Track Record',
    'Our Leadership',
    'Vision & Mission',
  ]);
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState({});
  const [ourTrackRecord, setOurTrackRecord] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiCrash, setApiCrash] = useState(false);

  useEffect(() => {
    getAboutUsData();
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);

  const getAboutUsData = async () => {
    try {
      const aboutData = await GetAboutUs();

      setOurTrackRecord(aboutData?.pages?.['our-track-record']?.data);
      setData(aboutData?.pages);
      setLoading(false);
      setApiCrash(false);
    } catch (err) {
      const error = err as AxiosError;
      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        // setErrorMsg('Unable to login at the moment.');
        setApiCrash(true);
        setLoading(false);
      } else {
        setLoading(false);
      }

      crashlytics().log('Get About Us Api About US Screen');
      crashlytics().recordError(err);
    }
  };
  const renderTab = ({index, item}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setTabIndex(index);
        }}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: tabIndex != index ? 1 : 0,
          borderColor: theme?.lightGrey,
          width: 150,
          margin: 6,
          height: 45,
          borderRadius: 25,
          backgroundColor:
            tabIndex == index ? theme?.logoColor : theme?.transparent,
        }}>
        <Text
          allowFontScaling={false}
          style={{
            color: tabIndex == index ? 'white' : theme.darkGrey,
            fontSize: 15,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
          }}>
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderTrackRecord = ({item, index}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 20,
          borderBottomWidth: index < ourTrackRecord?.length - 1 ? 1 : 0,
          borderBottomColor: theme?.greyColor,
        }}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 18,
            color: theme?.logoColor,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
          }}>
          {item?.number + item?.suffix}
        </Text>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 18,
            color: theme?.black,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
          }}>
          {item?.title}
        </Text>
      </View>
    );
  };
  const RenderData = ({data}) => {
    return (
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: tabIndex == 0 ? 30 : 0}}
        bounces={false}>
        {tabIndex == 1 ? (
          <View style={{marginTop: 20, paddingHorizontal: 20}}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 22,
                color: theme?.logoColor,
                fontFamily: FONT_FAMILY?.IBMPlexBold,
              }}>
              {data?.title}
            </Text>
            <View style={{marginTop: 20}}>
              <FlatList
                bounces={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{}}
                data={ourTrackRecord}
                renderItem={renderTrackRecord}
              />
            </View>
          </View>
        ) : tabIndex == 0 ? (
          <View style={{marginTop: 20}}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 22,
                color: theme?.logoColor,
                paddingHorizontal: 20,
                fontFamily: FONT_FAMILY?.IBMPlexBold,
              }}>
              {data?.title}
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                lineHeight: 20,
                fontSize: 16,
                color: theme?.black,
                paddingHorizontal: 20,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                marginTop: 20,
              }}>
              {data?.data?.section_short_description_paragraph_1}
            </Text>
            <Image
              source={{uri: data?.data?.our_story_mobile}}
              resizeMode="cover"
              style={{
                height: 230,
                width: screenWidth * 0.91,
                marginTop: 20,
                paddingHorizontal: 20,
                alignSelf: 'center',
                borderRadius: 20,
              }}
            />
            <Text
              allowFontScaling={false}
              style={{
                lineHeight: 20,
                fontSize: 16,
                paddingHorizontal: 20,
                color: theme?.black,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                marginTop: 20,
              }}>
              {data?.data?.section_short_description_paragraph_2}
            </Text>
          </View>
        ) : tabIndex == 2 ? (
          <View style={{marginTop: 20, paddingHorizontal: 20}}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 22,
                color: theme?.logoColor,
                fontFamily: FONT_FAMILY?.IBMPlexBold,
              }}>
              {data?.title}
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 22,

                color: theme?.black,
                marginTop: 20,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              }}>
              {data?.data?.leader_name}
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 18,
                color: theme?.logoColor,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
              }}>
              {data?.data?.leader_designation}
            </Text>
            <View style={{marginTop: 20, flexDirection: 'row'}}>
              <Text
                allowFontScaling={false}
                style={{
                  lineHeight: 20,
                  fontSize: 16,

                  color: theme?.black,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                }}>
                {data?.data?.leader_message}
              </Text>
            </View>
          </View>
        ) : (
          <>
            <View style={{marginTop: 20, paddingHorizontal: 20}}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 22,
                  color: theme?.logoColor,
                  fontFamily: FONT_FAMILY?.IBMPlexBold,
                  marginBottom: 20,
                }}>
                {data?.data?.vision_title}
              </Text>
              {/* <Image
                source={require('@/assets/images/icons/quotes.png')}
                style={{height: 60, width: 40}}
                resizeMode="contain"
              /> */}

              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 20,
                  color: theme?.logoColor,
                  fontFamily: FONT_FAMILY?.IBMPlexBold,
                }}>
                {data?.data?.vision_heading}
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  lineHeight: 20,
                  fontSize: 15,
                  marginTop: 30,
                  color: theme?.black,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                }}>
                {data?.data?.vision_short_description_para_1}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <Image
                  source={{uri: data?.data?.vision_image_mobile_app}}
                  style={{height: 182, width: 151, borderRadius: 10}}
                  resizeMode="contain"
                />
                <Text
                  allowFontScaling={false}
                  style={{
                    lineHeight: 20,
                    fontSize: 15,
                    flexWrap: 'wrap',
                    textAlign: 'left',
                    width: '50%',
                    color: theme?.black,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  }}>
                  {data?.data?.vision_short_description_para_2}
                </Text>
              </View>
            </View>
            <ImageBackground
              source={require('@/assets/images/background/mission_bg.png')}
              style={{flex: 1, marginTop: 30, padding: 20}}
              resizeMode="cover">
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 20,
                  color: theme?.white,
                  fontFamily: FONT_FAMILY?.IBMPlexBold,
                }}>
                {data?.data?.mssion_title}
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 20,
                  color: theme?.white,
                  marginTop: 10,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                }}>
                {data?.data?.mission_heading}
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  lineHeight: 20,
                  fontSize: 15,
                  marginTop: 20,
                  color: theme?.white,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                }}>
                {data?.data?.mission_short_description_para_1}
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  lineHeight: 20,
                  fontSize: 15,
                  marginTop: 30,
                  color: theme?.white,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                }}>
                {data?.data?.mission_short_description_para_2}
              </Text>

              <Image
                source={{uri: data?.data?.mission_image_mobile_app}}
                style={{
                  height: 300,
                  width: screenWidth * 0.9,
                  borderRadius: 10,
                  marginVertical: 20,
                }}
              />
            </ImageBackground>
          </>
        )}
      </ScrollView>
    );
  };
  return (
    <View style={{backgroundColor: theme?.white, flex: 1}}>
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

          height: 77,
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
        heading={'ABOUT US'}
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
          } else {
            props.navigation.reset({
              index: 0,
              routes: [{name: 'Dashboard'}],
            });
          }
        }}
        onNotificationPress={() => {
          props?.navigation?.navigate('Notification');
        }}
        notificationIcon={false}
      />
      {loading ? (
        <AboutSkeleton />
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
            <View style={{flex: 1}}>
              <View
                style={{
                  height: 60,

                  marginTop: 10,
                }}>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{alignSelf: 'center'}}
                  horizontal={true}
                  data={tabList}
                  renderItem={renderTab}
                />
              </View>

              <RenderData
                data={
                  tabIndex == 0
                    ? data?.['our-story']
                    : tabIndex == 1
                    ? data?.['our-track-record']
                    : tabIndex == 2
                    ? data?.leadership
                    : data?.['vision-mission']
                }
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};
export default About;
