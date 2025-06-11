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
  Alert,
  BackHandler,
  Keyboard,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import theme from '@/assets/stylesheet/theme';
import {FONT_FAMILY} from '@/constants/fontFamily';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import {TabsButton} from '@/components/formsTab';
import {CircleBackButton} from '@/components/buttons/circleBackButton';
import {BrochurePopup} from '@/components/modal/brochurePopup';
import ProjectDetailSkeleton from '@/components/skeletons/projectDetail';
import {MoratgeCalculator} from '@/components/modal/mortageCalculator';
import Share from 'react-native-share';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {GetProjectDetail} from '@/services/apiMethods/home';
import CustomBottomSheet from '@/components/customBottomSheet';
import {
  countriesList,
  excludedCountries,
} from '@/constants/fontFamily/globalConst';
import {GetBrochure} from '@/services/apiMethods/download';
import {SubmitForm} from '@/services/apiMethods/form';
import {Loader} from '@/components/loader';
import {AxiosError} from 'axios';
import {ImageProgress} from '@/components/ImageProgress';
import {ThankYouPopup} from '@/components/modal/thankyouPopUp';
import crashlytics from '@react-native-firebase/crashlytics';
import {useSelector} from 'react-redux';
import {AlertPopupAuth} from '@/components/modal/alertPopupAuth';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

export default function MyPropertyDetail(props) {
  const userData = useSelector(state => state?.user?.userDetail);
  const sheetRef = useRef(null);
  const phone_ref = useRef(null);
  const itemRef = useRef(null);
  const [press, setPress] = useState(false);
  const [activeIndexes, setActiveIndexes] = useState(null);
  const [projectMedia, setProjectMedia] = useState([]);
  const [activeIndex, setActiveIndex] = useState(1);
  const [maxNum, setMaxNum] = useState(9);
  const [openImageViewer, setOpenImageViewer] = useState(false);
  const [formSubmit, setFormSubmit] = useState(false);
  const [propertyValue, setPropertyValue] = useState('0');
  const [advanceValue, setAdvanceValue] = useState(0);
  const [yearsValue, setYearsValue] = useState(1);
  const [interestValue, setInterestValue] = useState('0.25');
  const [installment, setInstallment] = useState('0');
  const [showMortage, setShowMortage] = useState(false);
  const [image, setImage] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const [focused, setFocused] = useState('');
  const [fName, setFName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errorsFname, setErrorsFname] = useState(false);
  const [errorsEmail, setErrorsEmail] = useState(false);
  const [errorsInvalidEmail, setErrorsInvalidEmail] = useState(false);
  const [errorsPhone, setErrorsPhone] = useState(false);
  const snapPoints = useMemo(() => ['30%', '30%', '80%'], []);
  const [showCountries, setShowCountries] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projectDetails, setProjectDetails] = useState({});
  const [brochureUrl, setBrochureUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [mortageErr, setMortageErr] = useState(false);
  const [phLengthErr, setPhLengthErr] = useState(false);
  const [showThankyou, setShowThankyou] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [phoneCode, setPhoneCode] = useState('+971');
  const [apiResponnseErrors, setApiResponseMessageView] = useState('');
  const [text, setText] = useState('');
  let reg = new RegExp('^[0-9]*$');
  let textReg = new RegExp('^[a-zA-Z ]*$');

  useEffect(() => {
    getSingleProjectData(props?.route?.params?.id);
    setActiveIndex(1);
  }, []);
  useEffect(() => {
    setPropertyValue('0');
    setInterestValue('0.25');
    setYearsValue(1);
    setAdvanceValue(0);
  }, [focused]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
        // isKeyboardVisible=true;
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        // isKeyboardVisible=false;
        setKeyboardVisible(false); // or some other action
      },
    );

    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
      // BackHandler.removeEventListener(
  //      'hardwareBackPress',
 //       handleBackButtonClick,
 //     );
    };
  }, [showMortage, press, showCountries]);

  const handleBackButtonClick = () => {
    if (showMortage == true || showCountries == true || press == true) {
      setShowMortage(false);
      setPress(false);
      setShowCountries(false);
      setPropertyValue('0');
      setInterestValue('0.25');
      setYearsValue(1);
      setAdvanceValue(0);
    } else {
      props?.navigation?.goBack();
    }

    return true;
  };
  const emailRegex = state => {
    let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (emailReg?.test(state) == false) {
      return false;
    } else {
      return true;
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
                lat: projectDetails?.location?.lat,
                lng: projectDetails?.location?.lng,
                projectTitle: projectDetails?.title,
                id: props?.route?.params?.id,
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
                lat: projectDetails?.location?.lat,
                lng: projectDetails?.location?.lng,
                projectTitle: projectDetails?.title,
                id: props?.route?.params?.id,
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
  const renderPaymentLogs = ({item, index}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: StyleSheet?.hairlineWidth,
          paddingVertical: 10,
          borderBottomColor: theme?.greyText,
          alignItems: 'center',
          backgroundColor: index % 2 != 0 ? theme?.white : theme?.greyRGB,
          paddingHorizontal: 5,
        }}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 18,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.black,
            width: '40%',
          }}>
          AED {item?.payment}
        </Text>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 16,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.greyText,
            width: '35%',
          }}>
          {item?.date}
        </Text>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 16,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.greyText,
            width: '20%',
            textAlign: 'left',
          }}>
          {item?.status}
        </Text>
        <Image
          source={require('@/assets/images/icons/paymentLog-arrow.png')}
          style={{height: 10, width: 10}}
          resizeMode="contain"
        />
      </View>
    );
  };
  const onSubmit = async () => {
    if (fName?.length <= 0 && email?.length <= 0 && phone?.length <= 0) {
      setErrorsFname(true);
      setErrorsEmail(true);
      setErrorsPhone(true);
    } else if (fName?.length > 0 && email?.length <= 0 && phone?.length <= 0) {
      setErrorsFname(false);
      setErrorsEmail(true);
      setErrorsPhone(true);
    } else if (fName?.length > 0 && email?.length > 0 && phone?.length <= 0) {
      setErrorsFname(false);
      setErrorsEmail(false);
      setErrorsPhone(true);
    } else if (fName?.length <= 0 && email?.length > 0 && phone?.length <= 0) {
      setErrorsFname(true);
      setErrorsEmail(false);
      setErrorsPhone(true);
    } else if (fName?.length <= 0 && email?.length > 0 && phone?.length > 0) {
      setErrorsFname(true);
      setErrorsEmail(false);
      setErrorsPhone(false);
    } else if (fName?.length <= 0 && email?.length <= 0 && phone?.length > 0) {
      setErrorsFname(true);
      setErrorsEmail(true);
      setErrorsPhone(false);
    } else if (phone?.length > 15) {
      setPhLengthErr(true);
      setText('Maximum 15 digits.');
    } else if (phone?.length < 7) {
      setText('Minimum 7 digits.');

      setPhLengthErr(true);
    } else {
      try {
        setPress(false);
        setDownloading(true);

        const formData = new FormData();
        formData.append('firstname', fName);
        formData.append('email', email);
        formData.append('phone', phoneCode + phone);
        formData.append('planpdf', brochureUrl);
        formData.append('project_title', projectDetails?.title);
        formData.append(
          'project_location',
          `https://www.google.com/maps/search/?api=1&query=${projectDetails?.location?.lat},${projectDetails?.location?.lng}`,
        );

        const formSubmitting = await SubmitForm(2375, formData);
        setPress(true);
        setFName('');
        setEmail('');
        setPhone('');
        setFocused('');
        setErrorsFname(false);
        setErrorsEmail(false);
        setErrorsPhone(false);
        setErrorsInvalidEmail(false);
        setDownloading(false);
        setFormSubmit(true);
      } catch (error) {
        crashlytics().log('Form Submit Api Project Detail Screen');
        crashlytics().recordError(error);
        setDownloading(false);
        setPress(true);
        const err = error as AxiosError;
        console?.log('adsjhfhsadgjgjksdanjcks', err?.response?.data?.message);
        if (!err?.response?.data?.message) {
          setApiResponseMessageView('Request timeout');
        } else {
          setApiResponseMessageView(err?.response?.data?.message);
        }
      }
    }
  };
  const downloadBrochure = async (source, name, project) => {
    setErrorsEmail(false);
    setErrorsFname(false);
    setErrorsEmail(false);
    const pdfCheck = source?.includes('.pdf') ? '.pdf' : '';
    let dirs = ReactNativeBlobUtil.fs.dirs;
    ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt: 'pdf',
      path: `${dirs.DocumentDir}/${project + ' ' + name}${pdfCheck}`,
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
        setFormSubmit(false);
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

          downloadBrochure(source, name, project);
        } else {
          Alert.alert(
            'GJ Properties',
            'Permission must be grant to download brochure.',
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

      downloadBrochure(source, name, project);
    }
  };
  const handleScroll = event => {
    const {contentOffset} = event.nativeEvent;
    const itemWidth =
      Platform.OS == 'ios' ? screenWidth * 0.98 : screenWidth * 0.97; // Adjust this based on your item width
    const activeItemIndex = Math.floor(contentOffset.x / itemWidth);
    setActiveIndex(activeItemIndex + 1);
  };

  const calculateInstallment = (key, val, interest) => {
    if (key == 'price') {
      let price = +val;

      let adv = +advanceValue / 100;
      let advance = price * adv;

      let amount = price - advance;

      let duaration = +yearsValue;

      let int = +interest;

      let intdivbyTwelve = int / 100;

      let againdivbyTwelve = intdivbyTwelve / 12;

      let durationInMonths = duaration * 12;

      let Mortgage =
        (amount *
          (againdivbyTwelve *
            Math.pow(1 + againdivbyTwelve, durationInMonths))) /
        (Math.pow(1 + againdivbyTwelve, durationInMonths) - 1);

      let final = Math.round(Mortgage).toFixed(0);
      setInterestValue(interest);
      setInstallment(final);
    } else if (key == 'advance') {
      let price = +propertyValue;

      let adv = +val / 100;
      let advance = price * adv;

      let amount = price - advance;

      let duaration = +yearsValue;

      let int = +interest;

      let intdivbyTwelve = int / 100;

      let againdivbyTwelve = intdivbyTwelve / 12;

      let durationInMonths = duaration * 12;

      let Mortgage =
        (amount *
          (againdivbyTwelve *
            Math.pow(1 + againdivbyTwelve, durationInMonths))) /
        (Math.pow(1 + againdivbyTwelve, durationInMonths) - 1);

      let final = Math.round(Mortgage).toFixed(0);
      setInstallment(final);
    } else if (key == 'year') {
      let price = +propertyValue;

      let adv = +advanceValue / 100;
      let advance = price * adv;

      let amount = price - advance;

      let duaration = +val;

      let int = +interest;

      let intdivbyTwelve = int / 100;

      let againdivbyTwelve = intdivbyTwelve / 12;

      let durationInMonths = duaration * 12;

      let Mortgage =
        (amount *
          (againdivbyTwelve *
            Math.pow(1 + againdivbyTwelve, durationInMonths))) /
        (Math.pow(1 + againdivbyTwelve, durationInMonths) - 1);

      let final = Math.round(Mortgage).toFixed(0);
      setInstallment(final);
    } else if (key == 'interestRate') {
      let price = +propertyValue;

      let adv = +advanceValue / 100;
      let advance = price * adv;

      let amount = price - advance;

      let duaration = +yearsValue;

      let int = +val;

      let intdivbyTwelve = int / 100;

      let againdivbyTwelve = intdivbyTwelve / 12;

      let durationInMonths = duaration * 12;

      let Mortgage =
        (amount *
          (againdivbyTwelve *
            Math.pow(1 + againdivbyTwelve, durationInMonths))) /
        (Math.pow(1 + againdivbyTwelve, durationInMonths) - 1);

      let final = Math.round(Mortgage).toFixed(0);
      setInstallment(final);
    }
  };

  const getSingleProjectData = async id => {
    try {
      const projectData = await GetProjectDetail(id);

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
        setProjectDetails(projectData);
        getBrouchureUrl(projectData?.paymentPlan[0]?.brochure);
        setLoading(false);
      } else {
        setImage([]);
        setProjectMedia(projectData?.media);
        getBrouchureUrl(projectData?.paymentPlan[0]?.brochure);
        setProjectDetails(projectData);
        setLoading(false);
      }
    } catch (error) {
      const err = error as AxiosError;
      setLoading(false);

      crashlytics().log('Get Single Project Api Project Detail Screen');
      crashlytics().recordError(error);
    }
  };

  const getBrouchureUrl = async id => {
    try {
      const brochure = await GetBrochure(id);
      setBrochureUrl(brochure?.url);
    } catch (error) {
      setBrochureUrl('');
      crashlytics().log('Get Brochure Url Api Project Detail Screen');
      crashlytics().recordError(error);
    }
  };
  const onApplyNowPress = () => {
    if (
      propertyValue?.length <= 0 ||
      advanceValue == 0 ||
      interestValue == ''
    ) {
      setMortageErr(true);
    } else {
      setShowMortage(false);
      const parts = propertyValue.split('.');
      const wholeNumber = parts[0];
      let formattedNumber = '';

      for (let i = wholeNumber.length - 1, j = 1; i >= 0; i--, j++) {
        formattedNumber = wholeNumber.charAt(i) + formattedNumber;
        if (j % 3 === 0 && i !== 0) {
          formattedNumber = ',' + formattedNumber;
        }
      }

      if (parts.length > 1) {
        formattedNumber += '.' + parts[1];
      }
      let av = +advanceValue;
      let advance = (+propertyValue * av) / 100;
      props?.navigation?.navigate('Apply', {
        data: {
          title: projectDetails?.title,
          propertyValue: formattedNumber,
          advanceValue: `${advance} AED`,
          advancePercent: `${advanceValue}%`,
          interestValue: `${interestValue}%`,
          duration: `${yearsValue} Years`,
          installment: installment,
        },
      });
    }
  };
  const shareOnMultipleApps = url => {
    const shareOptions = {
      url: url,
      social: Share.Social.WHATSAPP,
    };

    Share.open(shareOptions)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

  return (
    <>
      {loading ? (
        <ProjectDetailSkeleton />
      ) : (
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

          {Object.keys(projectDetails).length > 0 ? (
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
                No Data Found
              </Text>
            </View>
          )}
          {Object.keys(projectDetails).length > 0 ? (
            <CustomBottomSheet
              sheetRef={sheetRef}
              snapPoints={snapPoints}
              projectDetails={projectDetails}
              itemRef={itemRef}
              nnestedScrollEnable={true}
              ViewServicesPressed={() => {}}
              paymentLogs={[
                {id: 1, payment: 65000, date: '02-Jun-2023', status: 'Paid'},
                {id: 2, payment: 50000, date: '08-Jun-2023', status: 'Paid'},
                {id: 3, payment: 15000, date: '25-Jun-2023', status: 'Unpaid'},
              ]}
              handleScroll={handleScroll}
              renderPaymentLogs={renderPaymentLogs}
              downnloadEnable={brochureUrl != '' ? true : false}
              onPressShare={() => {
                shareOnMultipleApps('https');
              }}
              downloadBrochurePressed={() => {
                setPress(true);
              }}
              viewFloorPlan={() => {
                props?.navigation?.navigate('FloorPlans', {
                  id: props?.route?.params?.id,
                  projectName: projectDetails?.title,
                  lat: projectDetails?.location?.lat,
                  lng: projectDetails?.location?.lng,
                });
              }}
              MoratgeCalculatorPressed={() => {
                setShowMortage(true);
              }}
              startVT={item => {
                props?.navigation?.navigate('WebView', {
                  url: item?.url,
                  name: item?.title,
                });
              }}
              activeIndexes={activeIndexes}
              activeIndex={activeIndex}
              virtualTour={projectDetails?.virtualTours}
              viewPropertyLocation={() => {
                props?.navigation?.navigate('Location', {
                  data: {
                    lat: projectDetails?.location?.lat,
                    lng: projectDetails?.location?.lng,
                    projectName: projectDetails?.title,
                    address: projectDetails?.address,
                  },
                });
              }}
            />
          ) : null}
          <TabsButton
            mainViewStyling={{
              backgroundColor: theme?.white,
              zIndex: 1000,
              alignSelf: 'center',
              width: screenWidth,
              position: 'absolute',
              bottom: -4,
              height: 100,
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingBottom: 20,
              paddingTop: 21,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: theme?.textGrey,
              paddingHorizontal: screenWidth * 0.05,
            }}
            enquiryPress={() => {
              props?.navigation?.navigate('Enquiry', {
                data: {
                  lat: projectDetails?.location?.lat,
                  lng: projectDetails?.location?.lng,
                  unitType: '',
                  floorPlan: '',
                  projectTitle: projectDetails?.title,
                },
              });
            }}
          />
          <MoratgeCalculator
            isKeyShow={isKeyboardVisible}
            err={mortageErr}
            show={showMortage}
            propertyValue={propertyValue}
            advanceValue={advanceValue}
            yearsValue={yearsValue}
            interestValue={interestValue}
            installment={installment}
            onSlidingYear={val => {
              let int =
                interestValue == '' || interestValue <= '0'
                  ? '0.25'
                  : interestValue;
              setYearsValue(val.toFixed(0));
              calculateInstallment('year', `${val.toFixed(0)}`, int);
            }}
            onSlidingAdvance={val => {
              let int =
                interestValue == '' || interestValue <= '0'
                  ? '0.25'
                  : interestValue;
              calculateInstallment('advance', `${val.toFixed(0)}`, int);
              setAdvanceValue(val.toFixed(0));
            }}
            onTouchOutside={() => {
              setShowMortage(false);
            }}
            onClose={() => {
              setShowMortage(false);
            }}
            onChangepropertyValue={text => {
              let int =
                interestValue == '' || interestValue <= '0'
                  ? '0.25'
                  : interestValue;

              if (text.length >= 15) {
                setPropertyValue('10000');
                calculateInstallment('price', `10000`, int);
              } else {
                calculateInstallment('price', `${text}`, int);
                setPropertyValue(text);
              }
            }}
            onChangeInterestRate={text => {
              if (text > 10) {
                setInterestValue('10');
              } else {
                setInterestValue(text);
              }
            }}
            onPressMinusPropertyPrice={() => {
              let int =
                interestValue == '' || interestValue <= '0'
                  ? '0.25'
                  : interestValue;
              let temp = +propertyValue;
              let newVal = temp - 50000;
              if (newVal >= 0) {
                setPropertyValue(`${newVal}`);
                calculateInstallment('price', `${newVal}`, int);
              } else {
                let int =
                  interestValue == '' || interestValue <= '0'
                    ? '0.25'
                    : interestValue;
                setPropertyValue('0');
                calculateInstallment('price', '0', int);
              }
            }}
            onPressAddPropertyPrice={() => {
              let int =
                interestValue == '' || interestValue <= '0'
                  ? '0.25'
                  : interestValue;
              let temp = +propertyValue;
              let newVal = temp + 50000;
              setPropertyValue(`${newVal}`);
              calculateInstallment('price', `${newVal}`, int);
            }}
            onPressMinusInterestPrice={() => {
              let temp = +interestValue;
              let newVal = temp - 0.25;
              if (newVal > 0.25) {
                setInterestValue(`${newVal}`);
                calculateInstallment('interestRate', `${newVal}`, '0');
              } else {
                setInterestValue('0.25');
                calculateInstallment('interestRate', `0.25`, '0');
              }
            }}
            onPressAddInterestPrice={() => {
              let temp = +interestValue;
              let newVal = temp + 0.25;
              if (newVal <= 10.0) {
                setInterestValue(`${newVal}`);
                calculateInstallment(
                  'interestRate',
                  `${newVal}`,
                  interestValue,
                );
              } else {
              }
            }}
            onApplyNowPress={() => {
              onApplyNowPress();
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
            thankyouText={`Brochure downloaded successfully in your device.`}
          />
          <BrochurePopup
            formSubmit={formSubmit}
            countriesList={countriesList}
            excludedCountries={excludedCountries}
            showCountries={showCountries}
            focusedInput={focused}
            firstName={fName}
            email={email}
            phone={phone}
            phone_ref={phone_ref}
            errorsFname={errorsFname}
            errorsEmail={errorsEmail}
            errorsPhone={errorsPhone}
            invalidEmail={errorsInvalidEmail}
            phoneLengthError={phLengthErr}
            onSubmit={onSubmit}
            maxLength={maxNum}
            onPressDownloadBrochure={() => {
              setPress(false);
              // setDownloading(true);
              downloadBrochure(brochureUrl, 'Brochure', projectDetails?.title);
              // permission(brochureUrl, 'Brochure', projectDetails?.title)
            }}
            onPressFlag={() => {
              setShowCountries(true);
            }}
            onBackdropPress={() => {
              setShowCountries(false);
            }}
            textInputFocused={name => {
              setFocused(name);
            }}
            changeFirstname={text => {
              if (text?.length == 1 && text != ' ') {
                if (textReg.test(text) == true) {
                  setErrorsFname(false);
                  setFName(text);
                }
              } else if (text?.length > 1 && text == ' ') {
                if (textReg.test(text) == true) {
                  setErrorsFname(false);
                  setFName(text);
                }
              } else if (text?.length > 1) {
                if (textReg.test(text) == true) {
                  setErrorsFname(false);
                  setFName(text);
                }
              } else if (text?.length == 0) {
                if (textReg.test(text) == true) {
                  setFName(text);
                }
              }
            }}
            text={text}
            changeEmail={text => {
              setEmail(text);
              setErrorsEmail(false);
              if (emailRegex(text) == true) {
                setErrorsInvalidEmail(false);
              } else {
                setErrorsInvalidEmail(true);
              }
            }}
            invalidNumber={invalid}
            changePhone={text => {
              if (reg?.test(text) == true) {
                setInvalid(false);
                if (text?.length < 7) {
                  setPhLengthErr(true);
                  setText('Minimum 7 digits.');
                } else if (text?.length > 15) {
                  setPhLengthErr(true);
                  setText('Maximum 15 digits.');
                } else {
                  setPhLengthErr(false);
                  setText('');
                }
                setErrorsPhone(false);
                setPhone(text);
              } else {
                setInvalid(true);
              }
            }}
            onTouchOutside={() => {
              setPress(false);
            }}
            onClose={() => {
              setFName('');
              setEmail('');
              setPhone('');
              setFocused('');
              setPress(false);
              setErrorsFname(false);
              setErrorsEmail(false);
              setErrorsPhone(false);
              setErrorsInvalidEmail(false);
              setFormSubmit(false);
              setPhLengthErr(false);
              setText('');
            }}
            pickerButtonOnPress={item => {
              setPhoneCode(item?.dial_code);
              setPhone('');
              phone_ref.current.selectCountry(item?.code.toLowerCase());
              if (
                item?.code == 'QA' ||
                item?.code == 'OM' ||
                item?.code == 'KW'
              ) {
                setMaxNum(8);
              } else if (item?.code == 'JO' || item?.code == 'EG') {
                setMaxNum(10);
              } else {
                setMaxNum(9);
              }
              setShowCountries(false);
            }}
            show={press}
            thankyouText={
              'Thank you for registering your interest. One of our representatives will be in touch with you shortly.'
            }
            goToHome={() => {
              setPress(false);
              setTimeout(() => {
                if (userData?.role == 'agent') {
                  props.navigation.reset({
                    index: 0,
                    routes: [{name: 'DashboardAgent'}],
                  });
                } else if (userData?.role == 'customer') {
                  props.navigation.reset({
                    index: 0,
                    routes: [{name: 'DashboardCustomer'}],
                  });
                } else {
                  props.navigation.reset({
                    index: 0,
                    routes: [{name: 'Dashboard'}],
                  });
                }
              }, 100);
            }}
          />
          <AlertPopupAuth
            show={apiResponnseErrors?.length > 0 ? true : false}
            onClose={() => {
              setApiResponseMessageView('');
            }}
            alertText={apiResponnseErrors}
            onTouchOutside={() => {
              setApiResponseMessageView('');
            }}
          />
        </>
      )}
      {downloading && <Loader />}
    </>
  );
}
