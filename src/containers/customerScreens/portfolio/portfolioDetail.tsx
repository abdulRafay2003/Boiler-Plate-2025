import React, {useMemo, useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  StatusBar,
  BackHandler,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import {CircleBackButton} from '@/components/buttons/circleBackButton';
import ProjectDetailSkeleton from '@/components/skeletons/projectDetail';
import {GetProjectDetail} from '@/services/apiMethods/home';
import {AxiosError} from 'axios';
import {ImageProgress} from '@/components/ImageProgress';
import crashlytics from '@react-native-firebase/crashlytics';
import CustomerBottomSheet from '@/components/cutomerBottomSheet';
import {
  buttonBackgroundColor,
  buttonHeight,
  buttonText,
  buttonWidth,
  fianacialpaymentRecieptLink,
  finalAmountFinancials,
  formatValue,
  invoiceLink,
  isDateOlderThanCurrentDate,
  sortDate,
} from '@/utils/business.helper';
import {PaymenntApprovalPopup} from '@/components/modal/paymentApprovalPending';
import {PortfolioDetailApi} from '@/services/apiMethods/customerDashboard';
import {
  setGotoPayment,
  setLoader,
  setUserDetail,
} from '@/redux/slice/UserSlice/userSlice';
import {
  FinancialsListingApi,
  PaymentIntent,
} from '@/services/apiMethods/financials';
import {ConstructionListApi} from '@/services/apiMethods/construction';
import {useDispatch, useSelector} from 'react-redux';
import {AlertPopupAuth} from '@/components/modal/alertPopupAuth';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import FinancialsListingItem from '@/components/financialListinItem';
import { dispatchToStore, RootState } from '@/redux/store';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

export default function PortfolioDetail(props) {
  const sheetRef = useRef(null);
  const focused = useIsFocused();
  const paymentConfigs = useSelector((state: RootState) => state?.user?.paymentConfigs);
  const backFromPayment = useSelector((state: RootState) => state?.user?.gotoPayment);
  const [clickedItem, setClickedItem] = useState(0);
  const [projectMedia, setProjectMedia] = useState([]);
  const [openImageViewer, setOpenImageViewer] = useState(false);
  const [image, setImage] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const snapPoints = useMemo(() => ['22%', '22%', '80%'], []);
  const [loading, setLoading] = useState(true);
  const [loadingWp, setLoadingWp] = useState(true);
  const [loadingNode, setLoadingNode] = useState(true);
  const [loadingNodeF, setLoadingNodeF] = useState(true);
  const [loadingNodeCU, setLoadingNodeCU] = useState(true);
  const [projectDetailsWordPress, setProjectDetailsWordPress] = useState({});
  const [projectDetailsNode, setProjectDetailsNode] = useState({});
  const getPortfolioDetail = useSelector((state: RootState) => state?.user?.potfolioObject);
  const [dotIndex, setDotIndex] = useState(0);
  const [constructionUpdateList, setConstructionUpdateList] = useState([]);
  const [financialsListing, setFinancialsListing] = useState([]);
  const [payNow, setPayNow] = useState(false);
  const [paymentValue, setPaymentValue] = useState('');
  const [url, setUrl] = useState('');
  const [buttonLoader, setButtonLoader] = useState(false);
  const [apiCrash, setApiCrash] = useState(false);
  const [financialCrash, setFinancialCrash] = useState(
    'No transactions at the moment.',
  );
  const [constructionCrash, setConstructionCrash] = useState(
    'No construction updates at the moment.',
  );
  const [confirmationText, setConfirmationText] = useState([]);
  useEffect(() => {
    if (props?.route?.params?.from != undefined) {
      const find = getPortfolioDetail?.find(itemx => {
        return props?.route?.params?.nParentId == itemx?.netsuite_details_id;
      });

      getSingleProjectDataWordPress(find?.id);
      getSingleProjectDataNode(props?.route?.params?.nSuiteObjectId);
      getFinancialListing(
        props?.route?.params?.nPropertyId,
        props?.route?.params?.nUnitId,
      );
      getConstructionListing();
    } else {
      getSingleProjectDataWordPress(props?.route?.params?.wpProjectId);
      getSingleProjectDataNode(props?.route?.params?.nSuiteObjectId);
      getFinancialListing(
        props?.route?.params?.nPropertyId,
        props?.route?.params?.nUnitId,
      );
      getConstructionListing();
    }
  }, []);
  useEffect(() => {
    if (focused == true && backFromPayment == true) {
      setLoadingNodeF(true);
      dispatchToStore(setGotoPayment(false));
      getFinancialListing(
        props?.route?.params?.nPropertyId,
        props?.route?.params?.nUnitId,
      );
    }
  }, [focused]);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      backHandler.remove();
    };
  }, [payNow]);
  const handleBackButtonClick = () => {
    if (payNow == true) {
      setPayNow(false);
    }

    return true;
  };
  const getFinancialListing = async (propertyId, unitId) => {
    try {
      const financialListData = await FinancialsListingApi(
        `?pageNumber=1&pageSize=3&unitId=${unitId}&name=${propertyId}`,
      );
      if (financialListData?.rowData?.length > 0) {
        setFinancialsListing(financialListData?.rowData);
        setLoadingNodeF(false);
        setFinancialCrash('No transactions at the moment.');
      } else {
        setLoadingNodeF(false);
        setFinancialsListing([]);
        setFinancialCrash('No transactions at the moment.');
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (err?.response?.status >= 500 && err?.response?.status <= 599) {
        setFinancialCrash('Unable to load data at the moment.');
      }
      setLoading(false);
      setLoadingNodeF(false);
      setFinancialsListing([]);
      crashlytics().log('Get Portofilio Listing Api on Dashboard');
      crashlytics().recordError(error);
    }
  };

  const getSingleProjectDataWordPress = async wpId => {
    try {
      const projectData = await GetProjectDetail(wpId);
      if (projectData?.media?.length > 0) {
        let array = [];
        var count = 0;
        for (let i = 0; i < projectData?.media?.length; i++) {
          for (let j = 0; j < projectData?.media[i]?.media_items?.length; j++) {
            array?.push({
              image: projectData?.media[i]?.media_items[j]?.url,
              type: projectData?.media[i]?.type,
              id: count,
              title: projectData?.media[i]?.title,
              // position:i,
              image_thumbnail:
                projectData?.media[i]?.media_items[j]?.image_thumbnail,
            });
            count = count + 1;
          }
        }
        setImage(array);
        setProjectMedia(projectData?.media);
        setProjectDetailsWordPress(projectData);

        setLoading(false);
        setLoadingWp(false);
      } else {
        setImage([]);
        setProjectMedia(projectData?.media);
        setProjectDetailsWordPress(projectData);
        setLoading(false);
        setLoadingWp(false);
      }
    } catch (error) {
      setLoadingWp(false);
      console.log('portfolioDataerror', error);
    }
  };
  const getSingleProjectDataNode = async nId => {
    try {
      const portfolioData = await PortfolioDetailApi(nId);
      console.log('portfolioDataresp', portfolioData);

      if (portfolioData != null) {
        setProjectDetailsNode(portfolioData);
        setLoadingNode(false);
      }
    } catch (err) {
      const error = err as AxiosError;
      if (error?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      }
      console.log('portfolioDataerror', error);
    }
  };
  const getConstructionListing = async () => {
    try {
      let body = {
        ids: [props?.route?.params?.nProjecId],
      };

      const constructionListData = await ConstructionListApi(body);
      if (constructionListData?.construction_updates) {
        setConstructionUpdateList(constructionListData?.construction_updates);
        setLoadingNodeCU(false);
        setConstructionCrash('No construction updates at the moment.');
      } else {
        setLoadingNodeCU(false);
        setConstructionCrash('No construction updates at the moment.');
        setConstructionUpdateList([]);
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err?.response?.status == 401) {
        dispatchToStore(setUserDetail({role: 'guest'}));
        props?.navigation?.navigate('Login');
      } else if (err?.response?.status >= 500 && err?.response?.status <= 599) {
        setConstructionUpdateList([]);
        setConstructionCrash('Unable to load data at the moment.');
      }
      crashlytics().log('Get Construction Listing Api Dashboard');
      crashlytics().recordError(error);
    }
  };
  const renderImage = ({item, index}) => {
    return (
      <>
        {item?.type == 'gallery' ? (
          <TouchableOpacity
            onPress={() => {
              setSelectedImage(image);
              props?.navigation?.navigate('Gallery', {
                obj: image,
                selected: index,
                title: item?.title,
                value: item?.image,
                media: projectMedia,
                lat: projectDetailsWordPress?.location?.lat,
                lng: projectDetailsWordPress?.location?.lng,
                projectTitle: projectDetailsWordPress?.title,
                id: props?.route?.params?.wpProjectId,
              });
            }}
            style={{marginBottom: 4}}>
            {item?.image ? (
              <ImageProgress
                source={item?.image}
                imageStyles={{
                  width: screenWidth,
                  height: 375,
                }}
                resizeMode={
                  Platform?.OS == 'android'
                    ? 'cover'
                    : Platform?.OS == 'ios' && screenWidth > 400
                    ? 'cover'
                    : 'contain'
                }
                activityIndicatorSize={'small'}
                activityIndicatorColor={theme?.logoColor}
              />
            ) : (
              <Image
                source={require('@/assets/images/icons/logo_PH.png')}
                style={{
                  width: screenWidth,
                  height: 375,
                }}
                resizeMode="cover"
              />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setSelectedImage(image);
              props?.navigation?.navigate('Gallery', {
                obj: image,
                selected: index,
                title: item?.title,
                value: item?.image,
                media: projectMedia,
                lat: projectDetailsWordPress?.location?.lat,
                lng: projectDetailsWordPress?.location?.lng,
                projectTitle: projectDetailsWordPress?.title,
                id: props?.route?.params?.wpProjectId,
              });
            }}
            style={{marginBottom: 10}}>
            {item?.image_thumbnail ? (
              <ImageProgress
                source={item?.image_thumbnail}
                imageStyles={{
                  width: screenWidth,
                  height: 375,
                }}
                activityIndicatorSize={'small'}
                activityIndicatorColor={theme?.logoColor}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={require('@/assets/images/icons/logo_PH.png')}
                style={{
                  width: screenWidth,
                  height: 375,
                }}
                resizeMode="cover"
              />
            )}
            <Image
              source={require('@/assets/images/icons/videoIcon.png')}
              style={{
                height: 60,
                tintColor: 'white',
                width: 60,
                alignSelf: 'center',
                top: 170,
                position: 'absolute',
                zIndex: 999,
              }}
            />
          </TouchableOpacity>
        )}
      </>
    );
  };
  const renderPostItems = item => {
    return (
      <>
        {item?.item?.type == 'image' ? (
          <View
            style={{
              height: screenHeight,
              width: screenWidth,
              backgroundColor: theme?.black,
            }}>
            <Image
              source={item?.item?.image}
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: theme?.black,
              }}
              resizeMode={'contain'}
            />

            <View
              style={{
                position: 'absolute',
                top: '90%',
                width: screenWidth,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.white,
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexBold,
                }}>
                {item?.index + 1 < 9 ? `0${item?.index + 1}` : item?.index + 1}/
                {selectedImage?.image?.length < 9
                  ? `0${selectedImage?.image?.length}`
                  : selectedImage?.image?.length}
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              height: screenHeight,
              width: screenWidth,
              backgroundColor: theme?.black,
            }}>
            <View
              style={{
                position: 'absolute',
                top: '90%',
                width: screenWidth,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.white,
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexBold,
                }}>
                {item?.index + 1 < 9 ? `0${item?.index + 1}` : item?.index + 1}/
                {selectedImage?.image?.length < 9
                  ? `0${selectedImage?.image?.length}`
                  : selectedImage?.images?.length}
              </Text>
            </View>
          </View>
        )}
      </>
    );
  };
  const renderFinancialsListing = ({item, index}) => {
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
  const renderCarouselImageSlider = ({item}) => {
    return (
      <TouchableOpacity
        style={{paddingBottom: 20, marginTop: 20}}
        activeOpacity={1}
        onPress={() => {
          props?.navigation?.navigate('ConstructionUpdateDetail', {
            id: item?.id,
          });
        }}>
        <ImageBackground
          source={
            item?.listing_image != null
              ? {uri: item?.listing_image}
              : require('@/assets/images/icons/logo_PH.png')
          }
          style={{
            width: screenWidth * 0.92,
            height: 200,
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            borderRadius: 35,
          }}
          imageStyle={{
            width: screenWidth * 0.92,
            height: 200,
            borderRadius: 10,
            alignSelf: 'center',
          }}
          resizeMode="cover">
          <View
            style={{
              backgroundColor: theme?.black,
              borderRadius: 10,
              top: 10,
              right: 10,
              // width: 119,
              // height: 35,
              paddingHorizontal: 10,
              paddingVertical: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexMedium,
                color: theme?.white,
              }}>
              {item?.completion_percentage} Complete
            </Text>
          </View>
        </ImageBackground>

        <View
          style={{
            // marginTop: 20,
            width: screenWidth * 0.88,
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginTop: 10,
          }}>
          <Text
            allowFontScaling={false}
            ellipsizeMode="tail"
            numberOfLines={2}
            style={{
              fontSize: 22,
              fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              color: theme?.logoColor,
            }}>
            {item?.title}
          </Text>
          <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 15,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                color: theme?.black,
                marginTop: 10,
              }}>
              {item?.short_description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getUrl = async paymentValue => {
    try {
      let payload = {
        orderParams: {
          order_id: paymentValue?.invoiceId,
          amount: paymentValue?.foreignamount,
          language: 'en',
        },
      };
      const paymentUrl = await PaymentIntent(payload);
      console.log('sdfghjkl;', paymentUrl);
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
  // const finalAmount = amountRecieved => {
  //   if (paymentConfigs?.vat > 0 && paymentConfigs?.processingFee > 0) {
  //     let num =
  //       // paymentConfigs?.vat +
  //       paymentConfigs?.processingFee;
  //     setConfirmationText(
  //       `This price includes a processing fee of ${paymentConfigs?.processingFee}%, as well as VAT rate of ${paymentConfigs?.vat}%.`,
  //     );
  //     let amount = (amountRecieved / 100) * num + amountRecieved;
  //     return amount;
  //   } else if (paymentConfigs?.vat > 0 && paymentConfigs?.processingFee <= 0) {
  //     let num = paymentConfigs?.vat;
  //     setConfirmationText(
  //       `This price includes VAT rate of ${paymentConfigs?.vat}%.`,
  //     );
  //     let amount = (amountRecieved / 100) * num + amountRecieved;
  //     return amountRecieved;
  //   } else if (paymentConfigs?.vat <= 0 && paymentConfigs?.processingFee > 0) {
  //     let num = paymentConfigs?.processingFee;
  //     setConfirmationText(
  //       `This price includes a processing fee of ${paymentConfigs?.processingFee}%.`,
  //     );
  //     let amount = (amountRecieved / 100) * num + amountRecieved;
  //     return amount;
  //   } else {
  //     setConfirmationText('');
  //     return amountRecieved;
  //   }
  // };
  // const getUrl = async paymentValue => {
  //   try {
  //     let pay = paymentValue?.pay;
  //     let payload = {
  //       orderParams: {
  //         order_id: paymentValue?.invoiceId,
  //         amount: pay,
  //         language: 'en',
  //       },
  //     };
  //     const paymentUrl = await PaymentIntent(payload);
  //     setUrl(paymentUrl);
  //     setButtonLoader(false);
  //   } catch (err) {
  //     const error = err as AxiosError;
  //     if (error?.response?.status == 401) {
  //       dispatchToStore(setUserDetail({role: 'guest'}));
  //       props?.navigation?.navigate('Login');
  //     } else if (
  //       error?.response?.status >= 500 &&
  //       error?.response?.status <= 599
  //     ) {
  //       setPayNow(false);
  //       setApiCrash(true);
  //     }
  //     dispatchToStore(setLoader(false));
  //     crashlytics().log('Get Url Api Dashboard');
  //     crashlytics().recordError(error);
  //   }
  // };
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
      dispatchToStore(setLoader(false));
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
      crashlytics().log('ProceedToPay Api Dashboard');
      crashlytics().recordError(error);
    }
  };
  return (
    // <>
    //   {loading ? (
    //     <ProjectDetailSkeleton />
    //   ) : (
    <>
      <StatusBar barStyle={'dark-content'} translucent={true} />
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 50,
          zIndex: 1,
          paddingLeft: 10,
          width: 80,
        }}
        activeOpacity={1}
        onPress={() => {
          props?.navigation?.goBack();
        }}>
        <CircleBackButton />
      </TouchableOpacity>
      {loadingWp ? (
        <ProjectDetailSkeleton />
      ) : (
        <>
          {projectDetailsWordPress != undefined ? (
            <>
              {Object.keys(projectDetailsWordPress).length > 0 ? (
                <View
                  style={{
                    justifyContent: 'center',
                    height: screenHeight,
                  }}>
                  <View
                    style={{
                      width: screenWidth,
                      paddingHorizontal: 10,
                      alignSelf: 'center',
                      alignItems: 'center',
                    }}>
                    <FlatList
                      bounces={false}
                      style={{width: screenWidth}}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{paddingBottom: 200}}
                      numColumns={1}
                      data={image}
                      renderItem={renderImage}
                    />
                  </View>

                  <Dialog
                    visible={openImageViewer}
                    coverScreen={true}
                    overlayBackgroundColor={'black'}
                    overlayOpacity={0.8}
                    animationIn="bounceInUp"
                    statusBarTranslucent={true}
                    height={screenHeight}
                    width={screenWidth}
                    dialogStyle={{backgroundColor: theme?.transparentWhite}}
                    backdropTransitionOutTiming={0}
                    style={{justifyContent: 'flex-start'}}>
                    <DialogContent>
                      <View
                        style={{
                          backgroundColor: theme?.black,
                          height: screenHeight,
                          width: screenWidth,
                          alignSelf: 'center',
                        }}>
                        <FlatList
                          bounces={false}
                          data={selectedImage}
                          showsVerticalScrollIndicator={true}
                          style={{
                            borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10,
                          }}
                          showsHorizontalScrollIndicator={false}
                          horizontal
                          renderItem={renderPostItems}
                          snapToAlignment="start"
                          decelerationRate={'fast'}
                          snapToInterval={Dimensions.get('window').width}
                        />
                      </View>
                      <View style={{height: screenHeight}}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedImage([]);
                            setOpenImageViewer(false);
                          }}
                          style={{
                            width: 40,
                            height: 40,
                            backgroundColor: theme?.white,
                            position: 'absolute',
                            right: -10,
                            top: '-95%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 2,
                            borderRadius: 40 / 2,
                            borderWidth: 1,
                            borderColor: theme?.brightRed,
                          }}>
                          <Image
                            source={require('@/assets/images/icons/arrow.png')}
                            style={{
                              width: 15,
                              height: 15,
                              tintColor: theme.brightRed,
                            }}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>
                    </DialogContent>
                  </Dialog>
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: screenHeight * 1,
                    width: screenWidth * 0.99,
                    alignSelf: 'center',
                  }}>
                  <Image
                    source={require('@/assets/images/icons/smallAlert_Icon.png')}
                    style={{
                      height: 50,
                      width: 50,
                      tintColor: theme?.textGrey,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 18,
                      fontFamily: FONT_FAMILY?.IBMPlexBold,
                      color: theme?.textGrey,
                    }}>
                    No gallery images at the moment.
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: screenHeight * 1,
                width: screenWidth * 0.99,
                alignSelf: 'center',
              }}>
              <Image
                source={require('@/assets/images/icons/smallAlert_Icon.png')}
                style={{
                  height: 50,
                  width: 50,
                  tintColor: theme?.textGrey,
                }}
                resizeMode="contain"
              />
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 18,
                  fontFamily: FONT_FAMILY?.IBMPlexBold,
                  color: theme?.textGrey,
                }}>
                No gallery images at the moment.
              </Text>
            </View>
          )}
        </>
      )}
      <CustomerBottomSheet
        sheetRef={sheetRef}
        snapPoints={snapPoints}
        projectDetailsWP={projectDetailsWordPress}
        projectDetailsNode={projectDetailsNode}
        financialsListing={financialsListing}
        renderCarouselImageSlider={renderCarouselImageSlider}
        onSnapToItem={index => {
          setDotIndex(index);
        }}
        dotIndex={dotIndex}
        constructionUpdateData={constructionUpdateList}
        renderFinancialsListing={renderFinancialsListing}
        viewPaymentPlanPressed={() => {
          props?.navigation?.navigate('PaymentPlan', {
            item: projectDetailsWordPress,
            itemNode: projectDetailsNode,
            id: projectDetailsNode?.id,
            unitCode: projectDetailsNode?.unit?.unitCode,
            balance: projectDetailsNode?.balance,
            statementOfAccount: projectDetailsNode?.statementOfAccount,
          });
        }}
        viewFloorPlan={() => {
          if (loadingWp == false) {
            props?.navigation?.navigate('FloorPlans', {
              id: props?.route?.params?.wpProjectId,
              projectName: projectDetailsWordPress?.title,
              lat: projectDetailsWordPress?.location?.lat,
              lng: projectDetailsWordPress?.location?.lng,
            });
          }
        }}
        onPressTransactionViewAll={() => {
          props?.navigation?.navigate('Financials', {
            property: projectDetailsNode?.property?.id,
            unit: projectDetailsNode?.unit?.id,
          });
        }}
        onPressConstructionViewAll={() => {
          props?.navigation?.navigate('ConstructionUpdateList');
        }}
        onPressStatement={() => {
          props?.navigation?.navigate('Statement', {
            paymentRecieptUrl: projectDetailsNode?.statementOfAccount,
            name: `${projectDetailsWordPress?.title} - ${projectDetailsNode?.unit?.unitCode} Account Statement`,
          });
        }}
        loadingWp={loadingWp}
        loadingNode={loadingNode}
        loadingNodeF={loadingNodeF}
        loadingNodeCU={loadingNodeCU}
        constructionCrash={constructionCrash}
        financialCrash={financialCrash}
      />

      <PaymenntApprovalPopup
        height={270}
        show={payNow}
        onClose={() => {
          setClickedItem(0);
          setPayNow(false);
        }}
        buttonLoader={buttonLoader}
        confirmationText={confirmationText}
        paymentAmount={paymentValue}
        onTouchOutside={() => {
          setClickedItem(0);
          setPayNow(false);
        }}
        onPressProceed={() => {
          // setPayNow(false);
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
    </>
    //   )}
    // </>
  );
}
