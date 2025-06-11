import React, {useEffect, useRef, useState} from 'react';
import theme from '@/assets/stylesheet/theme';
import {TabsButton} from '@/components/formsTab';
import TourListSkeleton from '@/components/skeletons/tourList';
import VRTourSkeleton from '@/components/skeletons/vrTour';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {
  GetAllProjects,
  GetAllProjectsIDs,
  GetOneProjectVR,
} from '@/services/apiMethods/vrTour';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setRefresh} from '@/redux/slice/UserSlice/userSlice';
import crashlytics from '@react-native-firebase/crashlytics';
import SingleVRSkeleton from '@/components/skeletons/singleVrSke';
import { RootState } from '@/redux/store';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

const VRTour = props => {
  const [index, setIndex] = useState(0);
  const flatListRef = useRef();
  const [loading, setLoading] = useState(true);
  const [virtualTours, setVirtualTours] = useState([]);
  const [vrData, setVrData] = useState({});
  const [projectIds, setProjectIds] = useState([]);
  const [next, setNext] = useState(false);
  const focused = useIsFocused();
  const [activeIndex, setActiveIndex] = useState(1);
  const [locationCor, setLocationCor] = useState({});
  const [imageLoad, setImageLoad] = useState(true);

  var count = 0;
  const tabFocused = useSelector((state: RootState) => state?.user?.refresh);
  useEffect(() => {
    getAllProjectsData();
    setLoading(true);
  }, []);
  useEffect(() => {
    if (tabFocused == true) {
      setActiveIndex(1);
      setVrData({});
      setVirtualTours([]);
      getAllProjectsData();
      setLoading(true);
    }
  }, [tabFocused]);
  const getAllProjectsData = async () => {
    try {
      const allProjects = await GetAllProjectsIDs();

      let array = [];
      allProjects?.map(item => {
        if (item?.['virtual_tours'] == true) {
          array.push(item?.id);
        }
      });
      dispatchToStore(setRefresh(false));
      setProjectIds(array);
      getSingleProjectVR(array[0]);
    } catch (error) {
      setLoading(false);
      crashlytics().log('GetAll Projects Api VRTour Screen');
      crashlytics().recordError(error);
    }
  };
  const getSingleProjectVR = async id => {
    try {
      const singleProjectVR = await GetOneProjectVR(id);
      let subStringDescription = singleProjectVR[0]?.description?.substring(
        singleProjectVR[0]?.description?.indexOf(',') + 1,
        singleProjectVR[0]?.description?.length,
      );
      let array = [];
      if (singleProjectVR?.length > 0) {
        singleProjectVR?.map((item, index) => {
          let itemSubStringDescription =
            singleProjectVR[0]?.description?.substring(
              singleProjectVR[0]?.description?.indexOf(',') + 1,
              singleProjectVR[0]?.description?.length,
            );
          array?.push({
            id: index,
            virtualTourlink: item?.webviewUrl,
            image: item?.image_url,
            virtualTourTitle: item?.['project_title'],
            virtualTourDescription: itemSubStringDescription?.trim(),
          });
        });
      }
      let obj = {
        id: 1,
        virtualtour: array,
        title: singleProjectVR[0]?.['project_title'],
        description: subStringDescription?.trim(),
        projectId: id || 100,
        phone: '13243213243',
        whatsapp: '+971509958505',
      };
      setLocationCor(singleProjectVR[0]?.location);
      setVrData(obj);
      setVirtualTours(singleProjectVR);
      setNext(false);
      setLoading(false);
    } catch (error) {
      console.log('errrrror', error);
      setLocationCor({});
      setVrData({});
      setVirtualTours([]);
      setNext(false);
      setLoading(false);
      crashlytics().log('Get Single Projects Api VRTour Screen');
      crashlytics().recordError(error);
    }
  };
  const renderCarouselImageSlider = ({item}) => {
    return (
      <View style={{paddingBottom: 20}}>
        <ImageBackground
          source={
            item?.image_url_detail_page == false
              ? require('@/assets/images/icons/logo_PH.png')
              : {uri: item?.image_url_detail_page}
          }
          style={{
            width: screenWidth * 0.9,
            height:
              screenHeight <= 820 ? screenHeight * 0.4 : screenHeight * 0.45,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 35,
          }}
          imageStyle={{
            width: screenWidth * 0.9,
            height:
              screenHeight <= 820 ? screenHeight * 0.38 : screenHeight * 0.42,
            borderRadius: 35,
            alignSelf: 'center',
          }}
          resizeMode="cover"
          onLoadEnd={() => {
            setImageLoad(false);
          }}>
          {imageLoad ? (
            <ActivityIndicator
              size={'small'}
              color={theme?.logoColor}
              style={{position: 'absolute', zIndex: 1}}
            />
          ) : (
            <TouchableOpacity
              onPress={() => {
                props?.navigation?.navigate('WebView', {
                  url: item?.webviewUrl,
                  name: item?.['project_title'],
                });
              }}
              style={{
                width: 150,
                height: 38,
                borderRadius: 30,
                backgroundColor: theme?.white,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  color: theme?.black,
                }}>
                Start Virtual Tour
              </Text>
            </TouchableOpacity>
          )}
        </ImageBackground>

        <View
          style={{
            // marginTop: 20,
            width: screenWidth * 0.88,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: -8,
          }}>
          <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              width: '75%',
              // backgroundColor:'red'
              // marginTop:10
            }}>
            <Text
              allowFontScaling={false}
              ellipsizeMode="tail"
              numberOfLines={2}
              style={{
                fontSize: 18,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
                color: theme?.black,

                // width:'0%'
              }}>
              {/* {screenHeight} */}
              {item?.description}
            </Text>
          </View>
          <TouchableOpacity
            style={{top: 2}}
            activeOpacity={1}
            onPress={() => {
              props?.navigation?.navigate('ProjectDetails', {
                id: item?.projectId,
              });
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                color: theme?.logoColor,
              }}>
              View Detail
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: theme?.white,
        paddingTop: 40,
      }}>
      <StatusBar barStyle={'dark-content'} translucent={true} />
      <View
        style={{
          justifyContent: 'space-between',
          height: screenHeight * 0.75,
        }}>
        <View>
          <View style={{marginTop: 10}}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 20,
                fontFamily: FONT_FAMILY?.IBMPlexBold,
                color: theme?.black,
                textTransform: 'uppercase',
              }}>
              Virtual Tours
            </Text>
          </View>
          {loading ? (
            <VRTourSkeleton />
          ) : (
            <>
              {virtualTours?.length > 0 ? (
                <View
                  style={{
                    marginTop: 10,
                  }}>
                  {next ? (
                    <TourListSkeleton />
                  ) : (
                    <>
                      <Text
                        allowFontScaling={false}
                        style={{
                          marginBottom: 20,
                          fontSize: 20,
                          fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                          color: theme?.black,
                        }}>
                        {vrData?.title}
                      </Text>
                      <Carousel
                        loop={false}
                        width={screenWidth}
                        height={screenHeight / 2}
                        autoPlay={false}
                        data={virtualTours}
                        scrollAnimationDuration={1000}
                        onSnapToItem={index => {
                          setActiveIndex(index + 1);
                        }}
                        renderItem={renderCarouselImageSlider}
                      />
                      <View
                        style={{
                          marginTop: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                          alignSelf: 'center',
                          width: '50%',
                          justifyContent: 'space-between',
                        }}>
                        <Image
                          source={require('@/assets/images/icons/right-arrow.png')}
                          style={{
                            width: 42,
                            height: 7,
                            transform: [{rotate: '180deg'}],
                            tintColor:
                              // activeIndex > 1 ?
                              theme?.black,
                            // : theme?.darkGrey,
                          }}
                        />

                        <Text
                          allowFontScaling={false}
                          style={{
                            textAlign: 'center',
                            fontSize: 16,
                            fontFamily: FONT_FAMILY?.IBMPlexRegular,
                            color: theme?.black,
                          }}>
                          {activeIndex}/{virtualTours?.length}
                        </Text>

                        <Image
                          source={require('@/assets/images/icons/right-arrow.png')}
                          style={{
                            width: 42,
                            height: 7,
                            tintColor:
                              // activeIndex < virtualTours?.length
                              //   ?
                              theme?.black,
                            // : theme?.darkGrey,
                          }}
                        />
                      </View>
                    </>
                  )}
                </View>
              ) : next ? (
                <TourListSkeleton />
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: screenHeight / 2,

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
                      textAlign: 'center',
                    }}>
                    Unable to load data at the moment.
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: screenWidth,
            justifyContent: 'center',
            alignItems: 'flex-end',
            alignSelf: 'center',
            paddingHorizontal: 50,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: theme?.greyText,
            borderBottomColor: theme?.greyText,
            paddingBottom: 10,
            paddingTop: 10,
            marginTop: 15,
            // backgroundColor:'red'
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',

              opacity: loading == true ? 0.3 : index == 0 ? 0.3 : 1,
              marginRight: 5,
            }}
            onPress={() => {
              if (index != 0) {
                count = 0;
                setImageLoad(true);
                setNext(true);
                setIndex(index - 1);
                flatListRef?.current?.scrollToOffset({
                  animated: true,
                  offset: 0,
                });
                getSingleProjectVR(projectIds[index - 1]);
                setActiveIndex(1);
              }
            }}
            disabled={loading == true ? true : index == 0 ? true : false}>
            <Text
              allowFontScaling={false}
              style={{
                width: 70,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                color: theme?.darkGrey,
              }}>
              Previous Property
            </Text>
            <View
              style={{
                width: 47,
                height: 47,
                borderRadius: 47 / 2,
                backgroundColor: theme?.darkGrey,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('@/assets/images/icons/arrow.png')}
                style={{
                  width: 15,
                  height: 15,
                  tintColor: theme.white,
                  transform: [{rotate: '180 deg'}],
                }}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 5,

              opacity:
                loading == true
                  ? 0.3
                  : index == projectIds?.length - 1
                  ? 0.3
                  : 1,
            }}
            onPress={() => {
              if (index < projectIds?.length - 1) {
                count = 0;
                setImageLoad(true);
                setNext(true);
                setIndex(index + 1);
                flatListRef?.current?.scrollToOffset({
                  animated: true,
                  offset: 0,
                });
                getSingleProjectVR(projectIds[index + 1]);
                setActiveIndex(1);
              }
            }}
            disabled={
              loading == true
                ? true
                : index == projectIds?.length - 1
                ? true
                : false
            }>
            <View
              style={{
                width: 47,
                height: 47,
                borderRadius: 47 / 2,
                backgroundColor: theme?.darkGrey,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('@/assets/images/icons/arrow.png')}
                style={{
                  width: 15,
                  height: 15,
                  tintColor: theme.white,
                }}
                resizeMode="contain"
              />
            </View>
            <Text
              allowFontScaling={false}
              style={{
                left: 10,
                width: 70,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                color: theme?.darkGrey,
              }}>
              Next Property
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TabsButton
        disabledEnquiryTap={loading}
        mainViewStyling={{
          alignSelf: 'center',
          width: screenWidth * 0.95,
          position: 'absolute',
          bottom: -10,
          height: 100,
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingBottom: 20,
          paddingTop: 21,
        }}
        enquiryPress={() => {
          props?.navigation?.navigate('Enquiry', {
            data: {
              lat: locationCor?.lat,
              lng: locationCor?.lng,
              projectTitle: vrData?.title,
              unitType: '',
              floorPlan: '',
              id: vrData?.projectId,
            },
          });
        }}
      />
    </View>
  );
};
export default VRTour;
