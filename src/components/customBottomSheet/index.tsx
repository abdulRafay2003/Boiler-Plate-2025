import {
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {ScrollView, FlatList} from 'react-native-gesture-handler';

import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import {FONT_FAMILY} from '@/constants/fontFamily';
import theme from '@/assets/stylesheet/theme';
import Carousel from 'react-native-reanimated-carousel';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
interface Props {
  sheetRef?: any | null;
  snapPoints?: any | null;
  projectDetails?: any | null;
  itemRef?: any | null;
  handleScroll?: any | null;
  downloadBrochurePressed?: any | null;
  viewFloorPlan?: any | null;
  MoratgeCalculatorPressed?: any | null;
  startVT?: any | null;
  activeIndexes?: any | null;
  activeIndex?: any | null;
  virtualTour?: any | null;
  viewPropertyLocation?: any | null;
  downnloadEnable?: any | null;
  nnestedScrollEnable?: any | null;
  onPressShare?: any | null;
  brochureLoader?: any | null;
}
const CustomBottomSheet = (props: Props) => {
  const {
    sheetRef,
    snapPoints,
    projectDetails,
    itemRef,
    handleScroll,
    downloadBrochurePressed,
    viewFloorPlan,
    MoratgeCalculatorPressed,
    startVT,
    activeIndexes,
    activeIndex,
    virtualTour,
    viewPropertyLocation,
    downnloadEnable,
    nnestedScrollEnable,
    onPressShare,
    brochureLoader,
  } = props;

  return (
    <BottomSheet
      ref={sheetRef}
      index={1}
      snapPoints={snapPoints}
      handleIndicatorStyle={{backgroundColor: theme?.textGrey}}
      handleStyle={{
        paddingTop: 10,
        height: 40,
      }}
      backgroundStyle={{
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
      }}>
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        nestedScrollEnabled={true}
        contentContainerStyle={{
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          paddingBottom: Platform.OS == 'ios' ? 30 : 50,
        }}
        style={{borderWidth: 0}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <View style={{paddingHorizontal: 0}}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 18,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
                color: theme?.darkGrey,
              }}>
              Price From
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 28,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
                color: theme?.black,
              }}>
              {projectDetails?.priceFrom}
            </Text>
          </View>
          {/* <TouchableOpacity
            style={{
              height: 50,
              width: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }} activeOpacity={1} onPress={onPressShare}>
            <Image
              source={require('@/assets/images/icons/share.png')}
              style={{height: 20, width: 30}}
              resizeMode="contain"
            />
          </TouchableOpacity> */}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
            paddingHorizontal: 10,
          }}>
          <Image
            source={require('@/assets/images/icons/marker.png')}
            style={{
              width: 9,
              height: 14,
              resizeMode: 'contain',
            }}
          />
          <Text
            allowFontScaling={false}
            style={{
              left: 5,
              fontSize: 18,
              fontFamily: FONT_FAMILY?.IBMPlexMedium,
              color: theme?.logoColor,
            }}>
            {projectDetails?.title}
          </Text>
        </View>
        <View
          style={{
            borderBottomWidth: 0.7,
            marginTop: 20,
            borderBottomColor: theme?.greyRGB,
            width: '95%',
            alignSelf: 'center',
          }}></View>

        <View style={{marginTop: 20, paddingHorizontal: 10}}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 22,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              color: theme?.black,
            }}>
            Invest in {projectDetails?.title}
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              top: 20,
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
            }}>
            {projectDetails?.projectDescription}
          </Text>
        </View>

        <View
          style={{
            borderBottomWidth: 0.7,
            marginTop: 60,
            borderBottomColor: theme?.greyRGB,
            width: '95%',
            alignSelf: 'center',
          }}></View>

        <View
          style={{
            marginTop: 16,
            width: screenWidth * 0.9,
            alignSelf: 'center',
          }}>
          {projectDetails?.projectFeaturesListing?.map(item => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 30,
                }}>
                <Image
                  source={
                    item?.icon_mobile_app == false
                      ? require('@/assets/images/icons/logo_PH.png')
                      : {uri: item?.icon_mobile_app}
                  }
                  style={{
                    width: 22,
                    height: 26,
                    // top: 5,
                    tintColor: theme?.logoColor,
                  }}
                  resizeMode="contain"
                />
                <Text
                  allowFontScaling={false}
                  style={{
                    left: 15,
                    fontSize: 16,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.black,
                    flexWrap: 'wrap',
                    width: screenWidth * 0.8,
                  }}>
                  {item?.title}
                </Text>
              </View>
            );
          })}
        </View>
        <View
          style={{
            borderBottomWidth: 0.7,
            marginTop: 10,
            borderBottomColor: theme?.greyRGB,
            width: '95%',
            alignSelf: 'center',
          }}></View>

        <View style={{marginTop: 20, paddingHorizontal: 10}}>
          <View
            style={{
              marginTop: 20,
              height: 290,
              borderRadius: 20,
              backgroundColor: ' rgba(80, 80, 80, 0.9)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={
                projectDetails?.floorPlanImage?.image == false
                  ? require('@/assets/images/icons/logo_PH.png')
                  : {uri: projectDetails?.floorPlanImage?.image}
              }
              style={{
                width: '100%',
                height: 290,
                opacity: 0.5,
                borderRadius: 20,
              }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={viewFloorPlan}
              activeOpacity={0.9}
              style={{
                width: '50%',
                height: 40,
                backgroundColor: theme?.white,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 18,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  color: theme?.black,
                }}>
                View Floor Plans
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {projectDetails?.amenitites?.length > 0 && (
          <View style={{marginTop: 40, paddingHorizontal: 10}}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 22,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                color: theme?.black,
              }}>
              Amenities
            </Text>
            <ScrollView
              bounces={false}
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{
                marginTop: 20,
              }}>
              {projectDetails?.amenitites?.map(item => {
                return (
                  <View
                    style={{
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      marginRight: 20,
                    }}>
                    <View
                      style={{
                        width: 71,
                        height: 71,
                        borderRadius: 71 / 2,
                        backgroundColor: '#F2ECE4',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={
                          item?.iconImage == null
                            ? require('@/assets/images/icons/logo_PH.png')
                            : {uri: item?.iconImage}
                        }
                        style={{
                          width: 35,
                          height: 35,
                          borderRadius: 35 / 2,
                          tintColor: theme?.logoColor,
                        }}
                        resizeMode="contain"
                      />
                    </View>
                    <Text
                      allowFontScaling={false}
                      style={{
                        textAlign: 'center',
                        width: 71,
                        fontSize: 16,
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                        color: theme?.black,
                        // height: 100,
                        flexWrap: 'wrap',
                        marginVertical: 12,
                      }}>
                      {item?.title}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {projectDetails?.paymentPlan?.length > 0 && (
          <View
            style={{
              marginTop: 20,
              width: '100%',
              height: Platform?.OS == 'ios' ? 305 : 330,
              backgroundColor: theme?.paymentPlanGrey,
              paddingHorizontal: 20,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                top: 20,
                fontSize: 22,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                color: theme?.black,
              }}>
              Payment Plan
            </Text>
            <View
              style={{
                marginTop: 35,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 18,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.black,
                }}>
                Down Payment
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 20,
                  fontFamily: FONT_FAMILY?.IBMPlexBold,
                  color: theme?.logoColor,
                }}>
                {projectDetails?.paymentPlan?.[0]?.downPayment}
              </Text>
            </View>
            <View
              style={{
                borderBottomWidth: 0.7,
                marginTop: 20,
                borderBottomColor: theme?.darkGrey,
              }}></View>
            <View
              style={{
                marginTop: 15,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 18,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.black,
                }}>
                Pay the rest over
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 20,
                  fontFamily: FONT_FAMILY?.IBMPlexBold,
                  color: theme?.logoColor,
                }}>
                {projectDetails?.paymentPlan?.[0]?.payRest}
              </Text>
            </View>
            <View
              style={{
                borderBottomWidth: 0.7,
                marginTop: 20,
                borderBottomColor: theme?.darkGrey,
              }}></View>
            <View
              style={{
                marginTop: 15,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 18,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.black,
                }}>
                Interest Rate
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 20,
                  fontFamily: FONT_FAMILY?.IBMPlexBold,
                  color: theme?.logoColor,
                }}>
                {projectDetails?.paymentPlan?.[0]?.interest}
              </Text>
            </View>
            {brochureLoader ? (
              <View
                style={{
                  width: 211,
                  height: 43,
                  backgroundColor: downnloadEnable
                    ? theme?.logoColor
                    : theme?.greyText,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: 20,
                  justifyContent: 'center',
                  paddingHorizontal: 6.7,
                }}>
                <ActivityIndicator size={'small'} color={theme?.white} />
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  width: 211,
                  height: 43,
                  backgroundColor: downnloadEnable
                    ? theme?.logoColor
                    : theme?.greyText,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: 20,
                  justifyContent: 'flex-start',
                  paddingHorizontal: 6.7,
                }}
                disabled={!downnloadEnable}
                onPress={downloadBrochurePressed}>
                <View
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 25 / 2,
                    backgroundColor: theme?.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // alignSelf: 'center',
                    // marginRight: 8.6,
                  }}>
                  <Image
                    source={require('@/assets/images/icons/download.png')}
                    style={{
                      width: 14,
                      height: 14,
                      tintColor: downnloadEnable
                        ? theme?.logoColor
                        : theme?.greyText,
                    }}
                    resizeMode="contain"
                  />
                </View>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 16,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.white,
                    marginLeft: 8.6,
                  }}>
                  Download Brochure
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <TouchableOpacity
          style={{
            height: 50,
            width: screenWidth * 0.8,
            backgroundColor: theme?.logoColor,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 46,
            alignSelf: 'center',
            borderRadius: 50,
          }}
          activeOpacity={0.9}
          onPress={MoratgeCalculatorPressed}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 14,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              color: theme?.white,
            }}>
            Mortgage Calculator
          </Text>
        </TouchableOpacity>
        {projectDetails?.virtualTours?.length > 0 && (
          <>
            <View style={{marginTop: 46, paddingHorizontal: 10}}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 24,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                  color: theme?.black,
                }}>
                Virtual Tours
              </Text>
            </View>

            <View style={{}}>
              <ScrollView
                nestedScrollEnabled={nnestedScrollEnable}
                bounces={false}
                horizontal
                ref={itemRef}
                onScroll={handleScroll}
                showsHorizontalScrollIndicator={false}
                onScrollEndDrag={handleScroll}
                // scrollEventThrottle={16}
                scrollEventThrottle={10}
                // snapToInterval={300}
                decelerationRate="fast">
                {projectDetails?.virtualTours?.map(item => {
                  return (
                    <View
                      style={{
                        marginTop: 27,
                        marginRight: 10,
                        // width: screenWidth * 0.93,
                        width: screenWidth * 0.96,
                        // backgroundColor: 'red',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: screenWidth * 0.02,
                      }}>
                      <Image
                        source={
                          item?.image_url == false
                            ? require('@/assets/images/icons/logo_PH.png')
                            : {uri: item?.image_url}
                        }
                        style={{
                          // width: screenWidth * 0.91,
                          width: screenWidth * 0.95,
                          height: 250,
                          borderRadius: 20,
                          // marginLeft: 10,
                        }}
                        resizeMode="cover"
                      />

                      <LinearGradient
                        colors={[
                          'rgba(255, 255, 255, 0)',
                          'rgba(0, 0, 0, 0.2)',
                          'rgba(0, 0, 0, 0.8)',
                        ]}
                        style={{
                          width: screenWidth * 0.96,
                          position: 'absolute',
                          bottom: 0,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          alignSelf: 'center',
                          borderBottomRightRadius: 20,
                          borderBottomLeftRadius: 20,
                          // left: 8,
                          height: 100,
                        }}>
                        <View
                          style={{
                            width: '100%',

                            flexDirection: 'row',
                            bottom: -10,
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            allowFontScaling={false}
                            numberOfLines={2}
                            ellipsizeMode={'tail'}
                            style={{
                              left: 10,
                              width: 160,
                              alignSelf: 'flex-start',
                              fontSize: 18,
                              fontFamily: FONT_FAMILY?.IBMPlexMedium,
                              color: theme?.white,
                            }}>
                            {item?.title + item?.short_description}
                          </Text>
                          <TouchableOpacity
                            onPress={startVT?.bind(this, {
                              url: item?.url,
                              title: projectDetails?.title,
                            })}
                            style={{
                              width: 150,
                              height: 38,
                              borderRadius: 30,
                              backgroundColor: theme?.white,
                              alignItems: 'center',
                              justifyContent: 'center',
                              right: 10,
                              alignSelf: 'flex-end',
                            }}>
                            <Text
                              allowFontScaling={false}
                              style={{
                                fontSize: 16,
                                fontFamily: FONT_FAMILY?.IBMPlexMedium,
                                color: theme?.black,
                              }}>
                              Start Virtual Tour
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </LinearGradient>
                    </View>
                  );
                })}
              </ScrollView>

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
                      // activeIndex ?
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
                  {activeIndex == 0 ? 1 : activeIndex}/
                  {projectDetails?.virtualTours?.length}
                </Text>
                <Image
                  source={require('@/assets/images/icons/right-arrow.png')}
                  style={{
                    width: 42,
                    height: 7,
                    tintColor:
                      // !activeIndex ?
                      theme?.black,
                    // : theme?.darkGrey,
                  }}
                />
              </View>
            </View>
          </>
        )}
        <View
          style={{
            marginTop: 30,
            paddingHorizontal: 10,
            paddingBottom: Platform.OS == 'ios' ? 80 : 50,
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 22,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              color: theme?.black,
            }}>
            Location
          </Text>
          <TouchableOpacity
            onPress={viewPropertyLocation}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 15,
            }}>
            <Image
              source={require('@/assets/images/icons/map.png')}
              style={{
                width: 72,
                height: 72,
                resizeMode: 'contain',
              }}
            />
            <Text
              allowFontScaling={false}
              style={{
                left: 15,
                fontSize: 20,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
                color: theme?.black,
              }}>
              View Property Location
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default CustomBottomSheet;
