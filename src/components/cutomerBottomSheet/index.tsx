import {
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ImageBackground,
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
import Dots from 'react-native-dots-pagination';
import CustomerBottomSheetSkeleton1 from '../skeletons/customerBottomSheetSkeleton1';
import CustomerBottomSheetSkeleton2 from '../skeletons/customerBottomSheetSkeleton2';
import CustomerBottomSheetSkeleton3 from '../skeletons/customerBottomSheetSkeleton3';
import CustomerBottomSheetSkeleton4 from '../skeletons/customerBottomSheetSkeleton4';
import CustomerBottomSheetSkeleton5 from '../skeletons/customerBottomSheetSkeleton5';
import CustomerBottomSheetSkeleton6 from '../skeletons/customerBottomSheetSkeleton6';
import CustomerBottomSheetSkeleton7 from '../skeletons/customerBottomSheetSkeleton7';
import {
  formatValue,
  projectDescription,
  statmentOfAccLink,
} from '@/utils/business.helper';
import CustomerBottomSheetSkeleton8 from '../skeletons/customerBottomSheetSkeleton8';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
interface Props {
  sheetRef?: any | null;
  snapPoints?: any | null;
  projectDetailsWP?: any | null;
  projectDetailsNode?: any | null;
  viewPaymentPlanPressed?: any | null;
  viewFloorPlan?: any | null;
  financialsListing?: any | null;
  renderFinancialsListing?: any | null;
  constructionUpdateData?: any | null;
  onPressTransactionViewAll?: any | null;
  onPressConstructionViewAll?: any | null;
  renderCarouselImageSlider?: any | null;
  onSnapToItem?: any | null;
  dotIndex?: any | null;
  loadingWp?: any | null;
  loadingNode?: any | null;
  loadingNodeF?: any | null;
  loadingNodeCU?: any | null;
  financialCrash?: any | null;
  constructionCrash?: any | null;
  onPressStatement?: any | null;
}
const CustomerBottomSheet = (props: Props) => {
  const {
    sheetRef,
    snapPoints,
    projectDetailsWP,
    viewPaymentPlanPressed,
    viewFloorPlan,
    financialsListing,
    renderFinancialsListing,
    constructionUpdateData,
    onPressTransactionViewAll,
    onPressConstructionViewAll,
    renderCarouselImageSlider,
    onSnapToItem,
    dotIndex,
    projectDetailsNode,
    loadingWp,
    loadingNode,
    loadingNodeF,
    loadingNodeCU,
    financialCrash,
    constructionCrash,
    onPressStatement,
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
          paddingBottom: 0,
        }}
        style={{borderWidth: 0}}>
        {loadingWp ? (
          <CustomerBottomSheetSkeleton1 />
        ) : (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
                paddingHorizontal: 10,
                justifyContent: 'space-between',
              }}>
              <Text
                allowFontScaling={false}
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{
                  width: '65%',
                  left: 5,
                  fontSize: 22,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                  color: theme?.logoColor,
                }}>
                {projectDetailsWP?.title}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: theme?.black,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  right: 5,
                  width: '30%',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    color: theme?.white,
                  }}>
                  Unit:{' '}
                </Text>
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    color: theme?.white,
                    width: '60%',
                  }}>
                  {projectDetailsNode?.unit?.unitCode}
                </Text>
              </View>
            </View>
            {projectDescription(projectDetailsNode) != '' ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginTop: 5,
                  paddingHorizontal: 15,
                }}>
                <Image
                  source={require('@/assets/images/icons/marker.png')}
                  style={{
                    width: 9,
                    height: 14,
                    resizeMode: 'contain',
                    tintColor: theme?.black,
                    marginRight: 5,
                    marginTop: 4,
                  }}
                />
                <Text
                  allowFontScaling={false}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 16,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    color: theme?.black,
                    width: '90%',
                    flexWrap: 'wrap',
                  }}>
                  {projectDescription(projectDetailsNode)}

                  {/* {projectDescription(projectDetailsNode, projectDetailsWP)} */}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginTop: 5,
                  paddingHorizontal: 15,
                }}
              />
            )}
            {statmentOfAccLink(projectDetailsNode?.statementOfAccount) && (
              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  height: 30,
                  justifyContent: 'center',
                  width: screenWidth,
                  alignItems: 'flex-end',
                  paddingHorizontal: 20,
                }}
                onPress={onPressStatement}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 12,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    color: theme?.black,
                    textDecorationLine: 'underline',
                  }}>
                  View Statment of Account
                </Text>
              </TouchableOpacity>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 15,
                paddingHorizontal: 10,
                marginHorizontal: 15,
                height: 35,
                backgroundColor: theme?.greyRGB,
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  color: theme?.black,
                }}>
                Balance
              </Text>
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  left: 5,
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  color: theme?.black,
                  maxWidth: '70%',
                }}>
                AED {formatValue(parseInt(projectDetailsNode?.balance))}
              </Text>
            </View>
          </>
        )}
        <View
          style={{
            borderBottomWidth: 0.7,
            marginTop: 20,
            borderBottomColor: theme?.greyRGB,
            width: '92%',
            alignSelf: 'center',
          }}></View>

        {loadingNode ? (
          <CustomerBottomSheetSkeleton2 />
        ) : (
          <View style={{marginTop: 20, paddingHorizontal: 15}}>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  width: '50%',
                  color: theme?.black,
                }}>
                Property Type:
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  width: '40%',
                  color: theme?.black,
                }}>
                {projectDetailsNode?.property?.type != null ||
                projectDetailsNode?.property?.type != undefined
                  ? projectDetailsNode?.property?.type
                      ?.charAt(0)
                      ?.toUpperCase() +
                    projectDetailsNode?.property?.type?.slice(1)?.toLowerCase()
                  : null}
              </Text>
            </View>

            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  width: '50%',
                  color: theme?.black,
                }}>
                Property Size:
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  width: '40%',
                  color: theme?.black,
                }}>
                {projectDetailsNode?.unit?.totalArea} Sq.ft
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  width: '50%',
                  color: theme?.black,
                }}>
                Unit Price:
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  width: '40%',
                  color: theme?.black,
                }}>
                {formatValue(parseInt(projectDetailsNode?.unitprice))}
                {/* {projectDetailsNode?.unitprice} */}
              </Text>
            </View>
            {/* <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Text
          allowFontScaling={false}

                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  width: '50%',
                }}>
                Interest Rate:
              </Text>
              <Text
          allowFontScaling={false}

                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  width: '40%',
                }}>
                {projectDetailsNode?.Interest}
              </Text>
            </View> */}
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  width: '50%',
                  color: theme?.black,
                }}>
                Down Payment Value:
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  width: '40%',
                  color: theme?.black,
                }}>
                {projectDetailsNode?.dpPercent}%
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  width: '50%',
                  color: theme?.black,
                }}>
                No. of Installments:
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  width: '40%',
                  color: theme?.black,
                }}>
                {projectDetailsNode?.noOfInstallments}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  width: '50%',
                  color: theme?.black,
                }}>
                First Installment Date:
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  width: '40%',
                  color: theme?.black,
                }}>
                {projectDetailsNode?.firstInstallmentDate}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  width: '50%',
                  color: theme?.black,
                }}>
                Project Delivery Date:
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  width: '40%',
                  color: theme?.black,
                }}>
                {projectDetailsNode?.property?.completionDate}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  width: '50%',
                  color: theme?.black,
                }}>
                Service Charges:
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  width: '40%',
                  color: theme?.black,
                }}>
                {projectDetailsNode?.unit?.serviceFee != null
                  ? `AED ${projectDetailsNode?.unit?.serviceFee} / year`
                  : ''}
              </Text>
            </View>
          </View>
        )}

        <View
          style={{
            borderBottomWidth: 0.7,
            marginTop: 20,
            borderBottomColor: theme?.greyRGB,
            width: '92%',
            alignSelf: 'center',
          }}></View>

        {/* {true ? <CustomerBottomSheetSkeleton8/> :<>{projectDetailsWP?.amenitites?.length > 0 && ( */}
        <View style={{marginTop: 20, paddingHorizontal: 15}}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 22,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              color: theme?.black,
            }}>
            Amenities
          </Text>
          {loadingWp ? (
            <CustomerBottomSheetSkeleton3 />
          ) : (
            <ScrollView
              bounces={false}
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{
                marginTop: 20,
              }}>
              {projectDetailsWP?.amenitites?.map(item => {
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
          )}
        </View>
        {/* )}</>} */}

        {loadingNode ? (
          <CustomerBottomSheetSkeleton4 />
        ) : (
          <View
            style={{
              marginTop: 20,
              width: '100%',
              height: Platform?.OS == 'ios' ? 105 : 130,
              backgroundColor: theme?.logoColorLight,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                width: 190,
                height: 46,
                backgroundColor: theme?.logoColor,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={viewPaymentPlanPressed}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.white,
                }}>
                View Payment Plan
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{marginTop: 20, paddingHorizontal: 15}}>
          <Text
            allowFontScaling={false}
            style={{
              top: 20,
              fontSize: 22,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              color: theme?.black,
            }}>
            Floor Plan
          </Text>
          {loadingWp ? (
            <CustomerBottomSheetSkeleton5 />
          ) : (
            <View
              style={{
                marginTop: 40,
                height: 290,
                borderRadius: 20,
                backgroundColor:
                  projectDetailsWP?.floorPlanImage == undefined
                    ? theme?.white
                    : ' rgba(80, 80, 80, 0.9)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {projectDetailsWP?.floorPlanImage != undefined ? (
                <>
                  <Image
                    source={
                      projectDetailsWP?.floorPlanImage?.image == false
                        ? require('@/assets/images/icons/logo_PH.png')
                        : {uri: projectDetailsWP?.floorPlanImage?.image}
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
                </>
              ) : (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 16,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.textGrey,
                  }}>
                  No floor plan at the moment.
                </Text>
              )}
            </View>
          )}
        </View>

        <View
          style={{
            borderBottomWidth: 0.7,
            marginTop: 20,
            borderBottomColor: theme?.greyRGB,
            width: '92%',
            alignSelf: 'center',
          }}></View>
        <View style={{flex: 1, paddingHorizontal: 15, marginTop: 20}}>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexDirection: 'row',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 22,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                color: theme?.black,
              }}>
              Recent Transactions
            </Text>
            {financialsListing?.length > 0 && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={onPressTransactionViewAll}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                    color: theme?.logoColor,
                    right: 5,
                  }}>
                  View All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {loadingNodeF ? (
            <CustomerBottomSheetSkeleton6 />
          ) : (
            <FlatList
              bounces={false}
              data={financialsListing}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              renderItem={renderFinancialsListing}
              contentContainerStyle={{paddingBottom: 10}}
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

        <View
          style={{
            marginTop: 20,
            paddingHorizontal: 15,
            flex: 1,
            marginBottom: 40,
          }}>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexDirection: 'row',
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
            <TouchableOpacity
              activeOpacity={1}
              onPress={onPressConstructionViewAll}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                  color: theme?.logoColor,
                  right: 5,
                }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {loadingNodeCU ? (
            <View>
              <CustomerBottomSheetSkeleton7 />
            </View>
          ) : (
            <View style={{marginTop: 20}}>
              {constructionUpdateData?.length > 0 ? (
                <>
                  <Carousel
                    loop={false}
                    width={screenWidth}
                    height={350}
                    autoPlay={false}
                    data={constructionUpdateData}
                    scrollAnimationDuration={1000}
                    renderItem={renderCarouselImageSlider}
                    onSnapToItem={onSnapToItem}
                  />
                  <Dots
                    length={constructionUpdateData?.length}
                    active={dotIndex}
                    activeDotWidth={30}
                    passiveDotWidth={15}
                    alignDotsOnXAxis={true}
                    activeColor={theme?.darkGrey}
                    passiveColor={theme?.greyRGB}
                  />
                </>
              ) : (
                <View
                  style={{
                    height: 350,
                    width: screenWidth,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
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
              )}
            </View>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default CustomerBottomSheet;
