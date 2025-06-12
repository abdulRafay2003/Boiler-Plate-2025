import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  StatusBar,
  Alert,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {TabsButton} from '@/components/formsTab';
import RenderHtml, {
  TBlock,
  defaultSystemFonts,
  CustomBlockRenderer,
  TNodeChildrenRenderer,
  TDefaultRenderer,
} from 'react-native-render-html';
import {Headers} from '@/components/header/headers';
import {ScrollView} from 'react-native-gesture-handler';
import FloorPlanSkeleton from '@/components/skeletons/floorPlan';
import {GetFloorPlan} from '@/services/apiMethods/home';
import {useIsFocused} from '@react-navigation/native';
import {GetBrochure} from '@/services/apiMethods/download';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import {Loader} from '@/components/loader';
import {ImageViewerPopup} from '@/components/modal/imageViewer';
import {ImageProgress} from '@/components/ImageProgress';
import Draggable from 'react-native-draggable';
import {ThankYouPopup} from '@/components/modal/thankyouPopUp';
import ImageViewer from 'react-native-image-zoom-viewer';
import crashlytics from '@react-native-firebase/crashlytics';
import {useSelector} from 'react-redux';
import {AxiosError} from 'axios';
import {AlertPopupAuth} from '@/components/modal/alertPopupAuth';
import { RootState } from '@/redux/store';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

export default function FloorPlans(props) {
  const scrollView = useRef();
  const focused = useIsFocused();
  const userData = useSelector((state: RootState) => state?.user?.userDetail);
  const flatListRef = useRef();
  const [loading, setLoading] = useState(true);
  const [tabList, setTabList] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [showViewer, setShowViewer] = useState(false);
  const [planIndex, setPlanIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(1);
  const [apiCrash, setApiCrash] = useState(false);
  const [showThankyou, setShowThankyou] = useState(false);
  const [featureData, setFeatureData] = useState('');
  const [showMore, setShowMore] = useState(false);
  var lines = featureData?.split(/\r\n|\r|\n/).length;
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }

    getFloorPlanData();
  }, []);
  const getFloorPlanData = async () => {
    try {
      const floorData = await GetFloorPlan(props?.route?.params?.id);
      setTabList(floorData?.data);
      setData(floorData?.data[0]?.plans);
      setLoading(false);
      setApiCrash(false);
    } catch (error) {
      const err = error as AxiosError;
      if (err?.response?.status >= 500 && err?.response?.status <= 500) {
        setApiCrash(true);
      }
      crashlytics().log('Get Floor Plan Data Api Floor Plan Screen');
      crashlytics().recordError(error);
    }
  };
  const getBrouchureUrl = async (id, title) => {
    try {
      const brochure = await GetBrochure(id);
      saveBrochure(
        brochure?.url,
        props?.route?.params?.projectName,
        tabList[tabIndex]?.title + ' ' + title,
      );
      setApiCrash(false);
    } catch (error) {
      const err = error as AxiosError;
      if (err?.response?.status >= 500 && err?.response?.status <= 500) {
        setApiCrash(true);
        setShowThankyou(false);
      }
      setDownloading(false);
      crashlytics().log('Get Brochure Url Api Floor Plan Screen');
      crashlytics().recordError(error);
    }
  };
  const saveBrochure = async (source, name, project) => {
    let dirs = ReactNativeBlobUtil.fs.dirs;
    const pdfCheck = source?.includes('.pdf') ? '.pdf' : '';
    ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt: 'pdf',
      path: `${dirs.DocumentDir}/${name + ' ' + project}${pdfCheck}`,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: project,
        description: 'File downloaded by download manager.',
        mime: 'application/pdf',
      },
    })
      .fetch('GET', source)
      .then(res => {
        setDownloading(false);
        if (Platform.OS === 'ios') {
          const filePath = res.path();
          let options = {
            type: 'application/pdf',
            url: filePath,
            saveToFiles: true,
          };
          Share.open(options)
            .then(resp => console.log(resp))
            .catch(err => console.log(err));
        } else {
          setShowThankyou(true);
        }
      })
      .catch(err => console.log('BLOB ERROR -> ', err));
  };
  const permission = async (source, name, project) => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs access to your storage to download files.',
            buttonPositive: 'OK',
            // buttonNegative: 'Cancel'
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setDownloading(true);

          saveBrochure(source, name, project);
        } else {
          Alert.alert(
            'GJ Properties',
            'Permission must be grant to download floor plan.',
            [
              {
                text: 'Ok',
                onPress: () => {
                  setDownloading(false);
                  Linking.openSettings();
                  // deleteFinalImages(item?.fileImage);
                  // deleteLocalImage(index);
                },
              },
              {
                text: 'Cancel',
                onPress: () => {
                  setDownloading(false);
                  // Linking.openURL('app-settings:');
                },
              },
            ],
          );
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      setDownloading(true);

      saveBrochure(source, name, project);
    }
  };
  const renderTab = ({index, item}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setTabIndex(index);
          setData(item?.plans);
          if (flatListRef) {
            setTimeout(() => {
              flatListRef?.current?.scrollToIndex({
                animate: true,
                index: 0,
              });
            }, 500);
          }
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
            fontSize: 14,
            fontFamily: FONT_FAMILY?.IBMPlexRegular,
            textTransform: 'uppercase',
          }}>
          {item?.title?.charAt(0).toUpperCase() +
            item?.title?.slice(1)?.toLowerCase()}
        </Text>
      </TouchableOpacity>
    );
  };
  const ParagraphRenderer: CustomBlockRenderer = function ParagraphRenderer({
    TDefaultRenderer,
    tnode,
    type,
    ...props
  }) {
    return (
      <TDefaultRenderer type={'text'} tnode={tnode} {...props}>
        <TNodeChildrenRenderer
          tnode={tnode}
          parentMarkers={props?.markers}
          renderChild={({childTnode, childElement}) =>
            type === 'block' ? (
              // childElement
              <Text
                allowFontScaling={false}
                style={{
                  color: theme?.logoColor,
                  fontSize: 18,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                }}
                ellipsizeMode="tail"
                numberOfLines={3}>
                {childElement}
              </Text>
            ) : (
              <Text allowFontScaling={false}>{childElement}</Text>
            )
          }
        />
      </TDefaultRenderer>
    );
  };
  const html = `
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
    <br />sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    <br />Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
    <br />nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
    
  </p>\n
  `;
  const renderFloorDetails = ({item}) => {
    let array = item?.features?.split('<br />');
    var features = array.toString();
    let array2 = [];
    for (let i = 0; i < array?.length; i++) {
      if (array[i].includes('<p>')) {
        let item = array[i]?.replace('<p>', '');
        array2?.push(item);
      } else if (array[i].includes('</p>')) {
        let item = array[i]?.replace('</p>', '');
        array2?.push(item);
      } else {
        array2?.push(array[i]);
      }
    }
    let str = array2.toString();

    return (
      <View
        style={{
          width: screenWidth,
          paddingLeft: 15,
          // backgroundColor: 'red',
        }}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 26,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.black,
          }}>
          {item?.planType?.charAt(0).toUpperCase() +
            item?.planType?.slice(1)?.toLowerCase()}
        </Text>
        <View style={{marginTop: 10}}>
          <View
            // ref={scrollView}
            style={{
              width: screenWidth * 0.84,
              // height: screenHeight * 0.6,
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingRight: 100,
              flexDirection: 'column',
            }}
            // contentContainerStyle={{
            //   justifyContent: 'center',
            //   alignItems: 'flex-start',
            //   paddingRight: 100,
            //   flexDirection: 'column',
            // }}
            // snapToInterval={-100}
            // horizontal
            // showsHorizontalScrollIndicator={false}
          >
            <TouchableOpacity
              onPress={() => {
                setFeatureData(str);
                setShowViewer(true);
                setSelectedImage(item?.large_image);
              }}>
              <ImageProgress
                source={
                  item?.image == false
                    ? require('@/assets/images/icons/logo_PH.png')
                    : item?.image
                }
                imageStyles={{
                  width: screenWidth * 0.84,
                  height:
                    screenHeight < 820
                      ? screenHeight * 0.35
                      : screenHeight * 0.4,
                }}
                imageStyle={{
                  width: screenWidth * 0.84,
                  height:
                    screenHeight < 820
                      ? screenHeight * 0.35
                      : screenHeight * 0.4,
                }}
                resizeMode={item?.image === null ? 'cover' : 'contain'}
                activityIndicatorSize={'small'}
                activityIndicatorColor={theme?.logoColor}
              />
              {/* <Image
                source={
                  item?.image == false
                    ? require('@/assets/images/icons/logo_PH.png')
                    : {uri: item?.image}
                }
                style={{
                  width: 296,
                  height: 250,
                  top: 30,
                }}
                resizeMode="contain"
              /> */}
            </TouchableOpacity>
            <View style={{marginTop: 50, height: 70}}>
              <RenderHtml
                contentWidth={screenWidth * 0.85}
                source={{html: features}}
                // source={{html:html.replace('<br />','')}}
                renderers={{p: ParagraphRenderer}}
                tagsStyles={{
                  p: {
                    color: theme?.logoColor,
                    fontSize: 18,
                    height: '100%',
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    // overflow: 'hidden',
                    // whiteSpace: 'normal',
                  },
                }}
                // defaultTextProps={{ ellipsizeMode: 'tail',numberOfLines:2}}
                systemFonts={[
                  ...defaultSystemFonts,
                  FONT_FAMILY?.IBMPlexBold,
                  FONT_FAMILY?.IBMPlexMedium,
                  FONT_FAMILY?.IBMPlexRegular,
                  FONT_FAMILY?.IBMPlexSemiBold,
                ]}
              />
            </View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                marginTop: 18,
                alignItems: 'center',
                height: 30,
              }}
              activeOpacity={1}
              onPress={() => {
                getBrouchureUrl(item?.downloadPlan, item?.planType);
              }}>
              <Image
                source={require('@/assets/images/icons/download.png')}
                style={{
                  marginRight: 5,
                  width: 15,
                  height: 15,
                  resizeMode: 'contain',
                  tintColor: theme?.black,
                }}
              />
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 18,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  color: theme?.black,
                }}>
                Download Floor Plan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  const handleScroll = event => {
    const {contentOffset} = event.nativeEvent;
    const itemWidth = screenWidth * 0.97; // Adjust this based on your item width
    const activeItemIndex = Math.floor(contentOffset.x / itemWidth);

    setPlanIndex(activeItemIndex);
    if (activeItemIndex < 0) {
      setActiveIndex(1);
    } else {
      setActiveIndex(activeItemIndex + 1);
    }
  };
  // const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setShowViewer(!showViewer);
  };
  const images = [
    {
      // Simplest usage.
      url: selectedImage,

      // width: number
      // height: number
      // Optional, if you know the image size, you can set the optimization performance

      // You can pass props to <Image />.
      props: {
        // headers: ...
      },
    },
  ];
  return (
    <>
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
            alignItems: 'flex-end',
            paddingHorizontal: 10,
            height: 80,
          }}
          backArrowViewStyles={
            !submitted
              ? {
                  width: 47,
                  height: 47,
                  borderRadius: 47 / 2,
                  backgroundColor: theme?.transparentWhite,
                  justifyContent: 'center',
                  alignItems: 'center',
                }
              : null
          }
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
          heading={'Floor Plans'}
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
          onNotificationPress={() => {
            props?.navigation?.navigate('Notification');
          }}
          notificationIcon={false}
        />
        {loading ? <FloorPlanSkeleton /> : <></>}
        {apiCrash ? (
          <View
            style={{
              flex: 0.9,
              height: screenHeight,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme?.white,
            }}>
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
          <>
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
            <View
              style={
                {
                  // marginTop: 10,
                }
              }>
              <FlatList
                ref={flatListRef}
                bounces={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                horizontal={true}
                data={data}
                nestedScrollEnabled={true}
                renderItem={renderFloorDetails}
                onScroll={handleScroll}
                scrollEventThrottle={10}
                snapToInterval={screenWidth}
              />
            </View>
            <View
              style={{
                marginTop: userData?.role == 'guest' ? 0 : screenHeight * 0.09,
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
                  //  : theme?.darkGrey,
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
                {activeIndex}/{data?.length}
              </Text>
              <Image
                source={require('@/assets/images/icons/right-arrow.png')}
                style={{
                  width: 42,
                  height: 7,
                  tintColor:
                    // activeIndex < data?.length ?
                    theme?.black,
                  // : theme?.darkGrey,
                }}
              />
            </View>
          </>
        )}
        {userData?.role == 'guest' && (
          <TabsButton
            disabledEnquiryTap={loading}
            mainViewStyling={{
              backgroundColor: theme?.white,
              alignSelf: 'center',
              width: screenWidth * 0.95,
              position: 'absolute',
              bottom: -5,
              height: 100,
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingBottom: 20,
              paddingTop: 21,
              borderTopWidth: Platform.OS == 'ios' ? 0.2 : 0.3,
              borderTopColor: theme?.textGrey,
            }}
            enquiryPress={() => {
              props?.navigation?.navigate('Enquiry', {
                data: {
                  lat: props?.route?.params?.lat,
                  lng: props?.route?.params?.lng,
                  unitType: tabList[tabIndex]?.title,
                  floorPlan: data[planIndex]?.planType,
                  projectTitle: props?.route?.params?.projectName,
                  id: props?.route?.params?.id,
                },
              });
            }}
          />
        )}
      </View>

      <ImageViewerPopup
        show={showViewer}
        source={selectedImage}
        onClose={() => {
          setShowViewer(false);
          setSelectedImage('');
        }}
        onSwipeDown={() => {
          setShowViewer(false);
          setSelectedImage('');
        }}
        onTouchOutside={() => {
          setShowViewer(false);
          setSelectedImage('');
        }}
        featuredText={featureData}
        showMore={showMore}
        onPressShowMore={() => {
          setShowMore(!showMore);
        }}
      />
      <ThankYouPopup
        onTouchOutside={() => {
          setShowThankyou(false);
        }}
        onClose={() => {
          setShowThankyou(false);
        }}
        show={showThankyou}
        thankyouText={`Floor Plan downloaded successfully in your device.`}
      />
      <AlertPopupAuth
        show={apiCrash}
        onClose={() => {
          setApiCrash(false);
        }}
        alertText={'Unable to download broucher at the moment.'}
        onTouchOutside={() => {
          setApiCrash(false);
        }}
      />
      {downloading && <Loader />}
    </>
  );
}
