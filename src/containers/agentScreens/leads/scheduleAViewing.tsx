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
import {MaterialTabBar, Tabs} from 'react-native-collapsible-tab-view';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch} from 'react-redux';
import {
  setAlertState,
  setContactDetails,
  setDeviceRegistered,
  setNotificationCounts,
  setOnBoardingComplete,
} from '@/redux/actions/UserActions';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';
import List from '@/components/skeletons/list';
import {GetContactUs} from '@/services/apiMethods/more';
import {
  GetNotifications,
  RegisterDevice,
} from '@/services/apiMethods/notification';
import {useIsFocused} from '@react-navigation/native';
import {ImageProgress} from '@/components/ImageProgress';
import ProjectSkeleton from '@/components/skeletons/projectsSkeleton';
import notifee, {EventType} from '@notifee/react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import VersionCheck from 'react-native-version-check';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {Headers} from '@/components/header/headers';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

const ScheduleViewing = props => {
  const flatListRef = useRef();
  const flatListRef1 = useRef();
  const [lengthRTM, setLengthRTM] = useState(0);
  const [lengthUC, setLengthUC] = useState(0);
  const [listLoader, setListLoader] = useState(false);
  const [tabSke, setTabSke] = useState(false);
  const [rTMIPageNo, setRTMIPageNo] = useState(1);
  const [uCPageNo, setUCPageNo] = useState(1);
  const [tabList, setTabList] = useState([
    {uuid: '1', name: 'Upcoming'},
    {uuid: '2', name: 'Previous'},
  ]);
  const [readyToMove, setReadyToMove] = useState([
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
  const [underConstruction, setUnderConstruction] = useState([
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
  const [tabIndex, setTabIndex] = useState(0);
  const focused = useIsFocused();

  useEffect(() => {
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

  const renderUpcoming = ({index, item}) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          paddingVertical: 8,
          paddingRight: 15,
        }}
        activeOpacity={1}
        onPress={() => {
          // props?.navigation?.navigate(item?.route, { id: item?.projectId });
        }}>
        <View
          style={{
            width: screenWidth * 0.9,
            height: 130,
            borderWidth: 1.14,
            borderRadius: 10,
            borderColor: theme?.agentUpComingBorder,
            paddingHorizontal: 15,
            paddingVertical: 20,
          }}>
          <View>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.black,
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
              }}>
              Lead No:
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: theme?.black,
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  flexWrap: 'wrap',
                  width: 190,
                }}>
                {' '}
                {item?.leadNo}
              </Text>
            </Text>
          </View>
          <View>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: theme?.logoColor,
                fontSize: 23,
                fontFamily: FONT_FAMILY?.IBMPlexBold,
                flexWrap: 'wrap',
                width: screenWidth * 0.53,
              }}>
              {item?.projectName}
            </Text>
          </View>
          <View>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: theme?.black,
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                flexWrap: 'wrap',
                width: screenWidth * 0.53,
              }}>
              {item?.personName}
            </Text>
          </View>
          <View>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.black,
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
              }}>
              Time:
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: theme?.black,
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  flexWrap: 'wrap',
                  width: screenWidth * 0.53,
                }}>
                {' '}
                {item?.time}
              </Text>
            </Text>
          </View>
          <View
            style={{
              width: screenWidth * 0.12,
              height: 53,
              borderRadius: 10,
              backgroundColor: theme?.logoColor,
              position: 'absolute',
              alignSelf: 'flex-end',
              right: 10,
              top: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: theme?.white,
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexBold,
                textAlign: 'center',
              }}>
              {'25\nAug'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const RenderUpCome = () => {
    return (
      <>
        {listLoader ? (
          <List />
        ) : (
          <FlatList
            scrollEnabled={true}
            ref={flatListRef}
            style={{marginTop: 90}}
            contentContainerStyle={{
              paddingBottom: 20,
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingLeft: screenWidth * 0.05,
            }}
            bounces={false}
            data={readyToMove}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={renderUpcoming}
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
                  }}>
                  {readyToMove?.length > 0
                    ? 'Currently, there are no more projects available.'
                    : ''}
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
            renderItem={renderUpcoming}
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
                    : ''}
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
          fontSize: 14,
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

  return (
    <View style={{flex: 1, backgroundColor: theme?.white}}>
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
        backArrowStyles={{
          height: 17,
          width: 10,
          tintColor: theme?.white,
          transform: [{rotate: '180 deg'}],
        }}
        backArrowViewStyles={{
          width: 47,
          height: 47,
          borderRadius: 47 / 2,
          backgroundColor: theme?.transparentWhite,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        heading={'Schedule A Viewings'}
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
        notificationIcon={false}
      />
      <View style={{width: screenWidth, paddingHorizontal: 20}}>
        <View
          style={{
            backgroundColor: theme?.filterBoxColor,
            width: screenWidth * 0.2,
            height: 30,
            borderRadius: 5,
            alignSelf: 'flex-end',
            marginTop: 15,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Text
            allowFontScaling={false}
            style={{
              color: theme?.logoColor,
              fontSize: 15,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
            }}>
            Filter
          </Text>
          <Image
            source={require('@/assets/images/icons/filter.png')}
            style={{height: 18, width: 16, left: 5}}
            resizeMode="contain"
          />
        </View>
      </View>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 5,
          height:
            Platform.OS == 'ios' ? screenHeight * 1.15 : screenHeight * 1.25,
        }}
        nestedScrollEnabled={true}>
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
              marginTop: 15,
            }}
            onIndexChange={index => {
              if (index == 0) {
                flatListRef1?.current?.scrollToOffset({
                  animated: true,
                  offset: 0,
                });
              } else {
                flatListRef?.current?.scrollToOffset({
                  animated: true,
                  offset: 0,
                });
              }
              setTabIndex(index);
            }}>
            <Tabs.Tab name={tabList[0]?.name}>{RenderUpCome()}</Tabs.Tab>
            <Tabs.Tab name={tabList[1]?.name}>
              {RenderUnderConstruction()}
            </Tabs.Tab>
          </Tabs.Container>
        )}
      </ScrollView>
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

export default ScheduleViewing;
