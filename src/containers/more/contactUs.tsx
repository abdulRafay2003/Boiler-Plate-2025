import React, {useState, useRef, useEffect} from 'react';
import theme from '@/assets/stylesheet/theme';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Platform,
  Linking,
  Alert,
  Keyboard,
  BackHandler,
} from 'react-native';
import {Headers} from '@/components/header/headers';
import MapView, {Marker} from 'react-native-maps';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Input} from '@/components/TextInput/Input';
import {SubmitButton} from '@/components/buttons/submitButton';
import {useForm} from 'react-hook-form';
import {ContactUsValidation} from '@/components/Validations/validations';
import {yupResolver} from '@hookform/resolvers/yup/src/yup';
import ReactNativePhoneInput from 'react-native-phone-input';
import {CountryPicker} from 'react-native-country-codes-picker';
import {FONT_FAMILY} from '@/constants/fontFamily';
import openMap from 'react-native-open-maps';
import {ThankYouPopup} from '@/components/modal/thankyouPopUp';
import {MapPopup} from '@/components/modal/mapPopup';
import ContactUsSkeleton from '@/components/skeletons/contact';
import {GetContactUs} from '@/services/apiMethods/more';
import {
  countriesList,
  excludedCountries,
} from '@/constants/fontFamily/globalConst';
import {SubmitForm} from '@/services/apiMethods/form';
import {Loader} from '@/components/loader';
import {AxiosError} from 'axios';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';
import {useSelector} from 'react-redux';
import {DropDownButtonYup} from '@/components/buttons/dropDownYup';
import {AlertPopupAuth} from '@/components/modal/alertPopupAuth';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
const Detail = ({data}) => {
  return (
    <View
      style={{
        marginVertical: 20,
        width: screenWidth,
        paddingHorizontal: 0,
        justifyContent: 'space-around',
      }}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <View
          style={{
            backgroundColor: theme?.transparentlogoColor,
            height: 50,
            width: 50,
            borderRadius: 50 / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('@/assets/images/icons/email_icon.png')}
            style={{height: 19, width: 26}}
            resizeMode="contain"
          />
        </View>
        <View style={{flexDirection: 'column'}}>
          {data?.email?.map(item => {
            if (item != '') {
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    Linking.openURL(`mailto:${item}`);
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: theme?.greyText,
                      fontSize: 16,
                      marginLeft: 10,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
        </View>
      </View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          marginTop: 20,
        }}>
        <View
          style={{
            backgroundColor: theme?.transparentlogoColor,
            height: 50,
            width: 50,
            borderRadius: 50 / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: data?.phoneIcon}}
            style={{height: 25, width: 25}}
            resizeMode="contain"
          />
        </View>
        <View style={{flexDirection: 'column'}}>
          {data?.phone?.map(item => {
            return (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  Linking.openURL(`tel:${item.replace(/[^0-9.+]/g, '')}`);
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    color: theme?.greyText,
                    fontSize: 16,
                    marginLeft: 10,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          marginTop: 20,
        }}>
        <View
          style={{
            backgroundColor: theme?.transparentlogoColor,
            height: 50,
            width: 50,
            borderRadius: 50 / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: data?.locationIcon}}
            style={{height: 25, width: 25}}
            resizeMode="contain"
          />
        </View>
        <Text
          allowFontScaling={false}
          style={{
            color: theme?.greyText,
            fontSize: 16,
            marginLeft: 10,
            flexWrap: 'wrap',
            width: '70%',
            fontFamily: FONT_FAMILY?.IBMPlexRegular,
          }}>
          {data?.address}
        </Text>
      </View>
    </View>
  );
};

const Social = ({data}) => {
  return (
    <View
      style={{
        marginVertical: 20,
        width: screenWidth,
        paddingHorizontal: 0,
        justifyContent: 'flex-start',
        flexDirection: 'row',
      }}>
      {data?.map(item => {
        return (
          <TouchableOpacity
            style={{
              // backgroundColor: theme?.transparentlogoColor,
              marginLeft: 10,
              height: 50,
              width: 50,
              borderRadius: 50 / 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              Linking.openURL(item?.link);
            }}>
            <Image
              source={
                item?.['icon_mobile_app'] == false
                  ? require('@/assets/images/icons/logo_PH.png')
                  : {uri: item?.['icon_mobile_app']}
              }
              style={{height: 50, width: 50}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
const ContactUs = props => {
  const _map = useRef(null);
  const phone_ref = useRef(null);
  const messageRef = useRef(null);
  const focuseds = useIsFocused();
  const userData = useSelector(state => state?.user?.userDetail);
  const [loading, setLoading] = useState(true);
  const [maxNum, setMaxNum] = useState(9);
  const [showMapPopup, setShowMapPopup] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [inquiryDropDown, setInquiryDropDown] = useState(false);
  const [inquiryLable, setInquiryLabel] = useState('');
  const [showThankyou, setShowThankyou] = useState(false);
  const [data, setData] = useState({});
  const [formSubmit, setFormSubmit] = useState(false);
  const [inquiryDropDownOptions, setInquiryDropDownOptions] = useState([
    {id: 1, title: 'Sales'},
    {id: 2, title: 'Feedback'},
  ]);

  const [focused, setFocused] = useState('');
  const [firstName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [queryMessage, setQueryMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [phoneCode, setPhoneCode] = useState('+971');
  const [apiResponnseErrors, setApiResponseMessageView] = useState('');
  const [apiCrash, setApiCrash] = useState(false);
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: {errors},
    trigger,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(ContactUsValidation),
  });
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }

    getContactUsData();
  }, []);
  useEffect(() => {
    reset({queryMessage, firstName, email, phone, inquiryLable});
  }, [isFocused]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      // BackHandler.removeEventListener(
  //      'hardwareBackPress',
 //       handleBackButtonClick,
 //     );
    };
  }, [showThankyou, showMapPopup]);

  const handleBackButtonClick = () => {
    if (showThankyou == true || showMapPopup == true) {
      setShowMapPopup(false);
      setShowThankyou(false);
    } else {
      props?.navigation?.goBack();
    }

    return true;
  };
  const [socialData, setSocialData] = useState([]);

  const onSubmit = async () => {
    try {
      setFormSubmit(true);
      const formData = new FormData();
      formData.append('firstname', firstName);
      formData.append('lastname', firstName);
      formData.append('email', email);
      formData.append('phone', phoneCode + phone);
      formData.append('inquirydrop', inquiryLable);
      formData.append('message', queryMessage);
      const formSubmitting = await SubmitForm(222, formData);
      setFormSubmit(false);
      setFocused('');
      setFName('');
      setLName('');
      setEmail('');
      setPhone('');
      setQueryMessage('');
      setInquiryLabel('');
      setShowThankyou(true);
      // setIsFocused(true);
      setValue('firstName', '');
      setValue('email', '');
      setValue('phone', '');
      setValue('queryMessage', '');
      reset({queryMessage, firstName, email, phone});
    } catch (error) {
      crashlytics().log('Form Submit Api Contact Us Screen');
      crashlytics().recordError(error);
      setFormSubmit(false);
      const err = error as AxiosError;
      console?.log('adsjhfhsadgjgjksdanjcks', err?.response?.data?.message);
      if (err?.response?.status >= 500 && err?.response?.status <= 500) {
        setApiResponseMessageView('Unable to send query at the moment.');
      } else if (!err?.response?.data?.message) {
        setApiResponseMessageView('Request timeout');
      } else {
        setApiResponseMessageView(err?.response?.data?.message);
      }
    }
  };
  const gotoMaps = () => {
    if (Platform.OS == 'ios') {
      setShowMapPopup(true);
    } else {
      Linking.canOpenURL('comgooglemaps://?ll=40.765819,-73.975866').then(
        canOpen => {
          if (canOpen) {
            openMap({
              latitude: data?.lat,
              longitude: data?.lng,
              provider: 'google',
              start: '',
              end: 'GJ Real Estate Sales Office - Oasis Towers,Ajman,United Arab Emirates',
              travelType: 'drive',
              waypoints: [''],
            });
          } else {
            Linking.openURL(
              `https://www.google.com/maps/dir/?api=1&destination=${data?.lat},${data?.lng}`,
              // &destination_place_id=${data?.projectName}`,
            );
            // Linking.openURL(
            //   `https://www.google.com/maps/dir//gj+properties/@${data?.lat},${data?.lng},13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3e5f59d6efae41b9:0xa36911cec7d7f38!2m2!1d55.4540809!2d25.3969663?entry=ttu`,
            // );
          }
        },
      );
    }
  };
  const renderOptions = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setInquiryLabel(item?.title);
          setInquiryDropDown(false);
          setValue('inquiryLable', item?.title);
          trigger(['inquiryLable']);
          // reset({inquiryLable})
        }}
        activeOpacity={0.8}
        style={{
          paddingVertical: 10,
          justifyContent: 'center',
        }}>
        <Text
          allowFontScaling={false}
          style={{
            alignSelf: 'flex-start',
            marginLeft: 15,
            fontSize: 14,
            fontFamily: FONT_FAMILY?.IBMPlexMedium,
            color: theme?.black,
            marginBottom: 5,
          }}>
          {item?.title}
        </Text>
      </TouchableOpacity>
    );
  };
  const onPressGoogleMap = () => {
    Linking.canOpenURL('comgooglemaps://?ll=40.765819,-73.975866').then(
      canOpen => {
        if (canOpen) {
          openMap({
            latitude: data?.lat,
            longitude: data?.lng,
            provider: 'google',
            start: '',
            end: data?.label,
            travelType: 'drive',
            waypoints: [''],
          });
        } else {
          Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${data?.lat},${data?.lng}`,
            // &destination_place_id=${data?.projectName}`,
          );
          // Linking.openURL(
          //   `https://www.google.com/maps/dir//${data?.label}/@${data?.lat},${data?.lng},13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3e5f59d6efae41b9:0xa36911cec7d7f38!2m2!1d55.4540809!2d25.3969663?entry=ttu`,
          // );
        }
      },
    );
  };
  const onPressAppleMap = () => {
    Linking.openURL(`maps://0,0?q=${data?.label}${data?.lat},${data?.lng}`);
  };

  const getContactUsData = async () => {
    try {
      const contactData = await GetContactUs();

      let data = {
        email: contactData?.pages?.['contact-us']?.data?.contact_email,
        phone: contactData?.pages?.['contact-us']?.data?.contact_number,
        address:
          contactData?.pages?.['contact-us']?.data?.contact_address_value,
        lat: contactData?.pages?.['contact-us']?.data?.contact_map?.lat,
        lng: contactData?.pages?.['contact-us']?.data?.contact_map?.lng,
        label: contactData?.pages?.['contact-us']?.data?.contact_map?.name,
        contactContent:
          ' It is really important to us that you know exactly how we look after your personal information and what we will use it for.',
        contactTitle: 'How Can We Help You?',
        contactDescription: 'Fill out the form and we will get back to you.',
        emailIcon:
          contactData?.pages?.['contact-us']?.data
            ?.contact_email_icon_mobile_app,
        phoneIcon:
          contactData?.pages?.['contact-us']?.data
            ?.contact_number_icon_mobile_app,
        locationIcon:
          contactData?.pages?.['contact-us']?.data
            ?.contact_address_icon_mobile_app,
        instaUrl: '',
        fbUrl: '',
        twitterUrl: '',
        youtubeUrl: '',
      };
      setSocialData(contactData?.pages?.['social_links']);
      setData(data);
      setLoading(false);
    } catch (err) {
      const error = err as AxiosError;
      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        setApiCrash(true);
        setLoading(false);
      } else {
        setApiCrash(false);
        setLoading(false);
      }
      crashlytics().log('Get Contact Us Api Contact Us Screen');
      crashlytics().recordError(err);
    }
  };
  return (
    <>
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
          heading={'Contact Us'}
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
          notificationIcon={false}
          onNotificationPress={() => {
            props?.navigation?.navigate('Notification');
          }}
        />
        {loading ? (
          <ContactUsSkeleton />
        ) : (
          <>
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
              <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                style={{paddingHorizontal: 20, marginBottom: 100}}
                bounces={false}
                nestedScrollEnabled={true}>
                <Detail data={data} />
                <View style={{paddingHorizontal: 0, borderRadius: 20}}>
                  <View style={{borderRadius: 20, overflow: 'hidden'}}>
                    {data?.lat != undefined && (
                      <MapView
                        provider="google"
                        style={{
                          height: screenHeight / 4,
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: 20,
                        }}
                        ref={_map}
                        loadingEnabled={true}
                        zoomEnabled={false}
                        scrollEnabled={false}
                        showsMyLocationButton={false}
                        showsUserLocation={false}
                        rotateEnabled={false}
                        region={{
                          latitude: data?.lat,
                          longitude: data?.lng,
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.0421,
                        }}
                        mapType="standard"
                        maxZoomLevel={30}>
                        <Marker
                          coordinate={{
                            latitude: +data?.lat,
                            longitude: +data?.lng,
                          }}
                          style={{width: 120, height: 80}}>
                          <Image
                            source={require('@/assets/images/icons/pin_icon.png')}
                            style={{height: 30, width: 25}}
                            resizeMode="contain"
                          />
                        </Marker>
                      </MapView>
                    )}
                  </View>

                  <TouchableOpacity
                    style={{marginVertical: 10}}
                    onPress={() => {
                      gotoMaps();
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: theme?.directionBlue,
                        textDecorationLine: 'underline',
                        fontSize: 12,
                        alignSelf: 'flex-end',
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      }}>
                      Get Directions
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginVertical: 20}}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 20,
                      color: theme?.black,
                      lineHeight: 20,
                      fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                    }}>
                    {data?.contactTitle}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      color: theme?.black,
                      lineHeight: 40,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    }}>
                    {data?.contactDescription}
                  </Text>
                  <View>
                    <Input
                      title={'Full Name'}
                      titleStyles={{
                        marginBottom: 18.5,
                        fontSize: 16,
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                        color: theme?.black,
                      }}
                      placeholderTextColor={theme?.textGrey}
                      mainViewStyles={{
                        width: '100%',
                      }}
                      inputViewStyles={{
                        borderWidth: 1,
                        borderColor:
                          focused == 'fname'
                            ? theme?.logoColor
                            : theme?.inputBorder,
                        height: 46,
                        borderRadius: 8,
                      }}
                      textInputFocused={() => {
                        setFocused('fname');
                      }}
                      placeholder={'Enter full name'}
                      fieldName={'firstName'}
                      control={control}
                      errTxt={errors?.firstName && errors?.firstName?.message}
                      errTxtstyle={{
                        top: 46,
                        right: 0,
                        position: 'absolute',
                        color: theme.brightRed,
                        fontSize: 11,
                        alignSelf: 'flex-end',
                      }}
                      value={firstName}
                      onChangeTexts={text => {
                        setFName(text);
                      }}
                    />

                    <Input
                      title={'Email'}
                      titleStyles={{
                        marginBottom: 18.5,
                        fontSize: 16,
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                        color: theme?.black,
                      }}
                      placeholderTextColor={theme?.textGrey}
                      mainViewStyles={{
                        width: '100%',
                        marginTop: 20,
                      }}
                      inputViewStyles={{
                        borderWidth: 1,
                        borderColor:
                          focused == 'email'
                            ? theme?.logoColor
                            : theme?.inputBorder,
                        height: 46,
                        borderRadius: 8,
                      }}
                      textInputFocused={() => {
                        setFocused('email');
                      }}
                      placeholder={'Enter your email address'}
                      fieldName={'email'}
                      control={control}
                      errTxt={errors?.email && errors?.email?.message}
                      errTxtstyle={{
                        top: 46,
                        right: 0,
                        position: 'absolute',
                        color: theme.brightRed,
                        fontSize: 11,
                        alignSelf: 'flex-end',
                      }}
                      value={email}
                      onChangeTexts={text => {
                        if (text == ' ') {
                        } else {
                          setEmail(text);
                        }
                      }}
                    />
                    <Text
                      allowFontScaling={false}
                      style={{
                        marginBottom: 18.5,
                        fontSize: 16,
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                        color: theme?.black,
                        marginTop: 20,
                      }}>
                      Phone Number
                    </Text>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor:
                          focused == 'phone'
                            ? theme?.logoColor
                            : theme?.inputBorder,
                        width: '100%',
                        height: 46,
                        borderRadius: 8,
                        justifyContent: 'center',
                        paddingHorizontal: 10,
                        flexDirection: 'row',
                      }}>
                      <TouchableOpacity
                        activeOpacity={0.6}
                        style={{
                          position: 'absolute',
                          left: 40,
                          top: Platform.OS == 'ios' ? 13.5 : 12,
                        }}
                        onPress={() => {
                          setShowCountries(true);
                        }}>
                        <Image
                          source={require('@/assets/images/icons/country_arrow.png')}
                          style={{height: 20, width: 20}}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>

                      <ReactNativePhoneInput
                        ref={phone_ref}
                        onPressFlag={() => {
                          setShowCountries(true);
                        }}
                        buttonTextStyle={{
                          fontSize: 14,
                          color: theme.darkestBlue,
                          backgroundColor: 'red',
                        }}
                        initialCountry={'ae'}
                        // countriesList={countriesList}
                        autoFormat={false}
                        textStyle={{
                          fontSize: 14,
                          color: theme.darkestBlue,
                        }}
                        style={{
                          width: 20,
                        }}
                      />
                      <Input
                        returnKeyLabel={'Done'}
                        returnKeyType={'done'}
                        onSubmitEditing={Keyboard.dismiss}
                        placeholderTextColor={theme?.textGrey}
                        mainViewStyles={{
                          width: '85%',
                          marginLeft: 20,
                        }}
                        inputViewStyles={{
                          borderColor:
                            focused == 'phone'
                              ? theme?.logoColor
                              : theme?.inputBorder,
                          height: 46,
                          borderRadius: 8,
                        }}
                        textInputFocused={() => {
                          setFocused('phone');
                        }}
                        placeholder={'xxx xxx xxxx'}
                        control={control}
                        fieldName={'phone'}
                        errTxt={errors?.phone && errors?.phone?.message}
                        errTxtstyle={{
                          top: 46,
                          right: -13,
                          position: 'absolute',
                          color: theme.brightRed,
                          fontSize: 11,
                          alignSelf: 'flex-end',
                        }}
                        value={phone}
                        onChangeTexts={text => {
                          setPhone(text);
                        }}
                        keyboardType={'numeric'}
                        // maxLength={15}
                      />
                    </View>
                    <Text
                      allowFontScaling={false}
                      style={{
                        marginBottom: 18.5,
                        fontSize: 16,
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                        color: theme?.black,
                        marginTop: 20,
                      }}>
                      Type of Inquiry
                    </Text>
                    <View style={{zIndex: 1000}}>
                      <DropDownButtonYup
                        onPress={() => setInquiryDropDown(!inquiryDropDown)}
                        showDropDown={inquiryDropDown}
                        btnContainer={{
                          paddingLeft: 10,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: theme?.inputBorder,
                          backgroundColor: theme?.white,
                          width: '100%',
                          height: 46,
                          justifyContent: 'center',
                        }}
                        label={
                          inquiryLable == ''
                            ? 'Select Your Option'
                            : inquiryLable
                        }
                        labelStyle={{
                          color:
                            inquiryLable == '' ? theme?.greyText : theme?.black,
                          fontFamily: FONT_FAMILY?.IBMPlexRegular,
                        }}
                        control={control}
                        fieldName={'inquiryLable'}
                        errors={
                          errors?.inquiryLable && errors?.inquiryLable?.message
                        }
                        errTxtstyle={{
                          color: theme.brightRed,
                          fontSize: 11,
                          alignSelf: 'flex-end',
                        }}
                      />
                      {inquiryDropDown && (
                        <View
                          style={{
                            position: 'absolute',
                            top: 40,
                            width: '100%',

                            maxHeight: 120,
                          }}>
                          <FlatList
                            nestedScrollEnabled={true}
                            data={inquiryDropDownOptions}
                            showsVerticalScrollIndicator={true}
                            style={{
                              backgroundColor: theme?.white,
                              maxHeight: 120,
                              borderBottomLeftRadius: 10,
                              borderBottomRightRadius: 10,
                              width: '100%',
                              borderWidth: 0.7,
                              borderColor: theme?.inputBorder,
                              zIndex: 9999,
                            }}
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderOptions}
                            bounces={false}
                            contentContainerStyle={{
                              paddingEnd: 20,
                            }}
                          />
                        </View>
                      )}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 10,
                      }}>
                      <Input
                        // ref={messageRef}
                        // // ref={true}
                        // blur={()=>{
                        //   messageRef?.current?.blur()
                        // }}
                        // onSubmitEditing={()=>{
                        //   messageRef?.current?.blur()
                        //   Keyboard.dismiss()
                        // }}
                        // returnKeyLabel={'Done'}
                        // returnKeyType={'done'}
                        title={'Your Message'}
                        titleStyles={{
                          marginBottom: 18.5,
                          fontSize: 16,
                          fontFamily: FONT_FAMILY?.IBMPlexRegular,
                          color: theme?.black,
                          marginTop: 10,
                        }}
                        placeholderTextColor={theme?.textGrey}
                        mainViewStyles={{
                          width: '100%',
                        }}
                        inputViewStyles={{
                          borderWidth: 1,
                          borderColor:
                            focused == 'message'
                              ? theme?.logoColor
                              : theme?.inputBorder,
                          height: 128,
                          borderRadius: 8,
                        }}
                        textInputFocused={() => {
                          setFocused('message');
                        }}
                        placeholder={'Type here'}
                        allowMultiline={true}
                        fieldName={'queryMessage'}
                        control={control}
                        errTxt={
                          errors?.queryMessage && errors?.queryMessage?.message
                        }
                        errTxtstyle={{
                          top: 128,
                          right: 0,
                          position: 'absolute',
                          color: theme.brightRed,
                          fontSize: 11,
                          alignSelf: 'flex-end',
                        }}
                        value={queryMessage}
                        onChangeTexts={text => {
                          setQueryMessage(text);
                        }}
                        keyboardType={'email-address'}
                      />
                    </View>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 14,
                        fontFamily: FONT_FAMILY.IBMPlexRegular,
                        color: theme?.textGrey,
                        marginTop: 20,
                      }}>
                      {data?.contactContent}
                    </Text>
                    <SubmitButton
                      btnContainer={{
                        height: 58,
                        width: '100%',
                        backgroundColor: theme?.logoColor,
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20,
                      }}
                      btnText="Submit"
                      btnTextStyle={{
                        color: theme?.white,
                        fontSize: 14,
                        fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                      }}
                      onPress={handleSubmit(onSubmit)}
                    />
                  </View>
                </View>
                <View>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 20,
                      color: theme?.black,
                      lineHeight: 20,
                      fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                    }}>
                    Follow Our Socials
                  </Text>
                  <Social data={socialData} />
                </View>
              </KeyboardAwareScrollView>
            )}
          </>
        )}
        <CountryPicker
          show={showCountries}
          lang={'en'}
          style={{
            modal: {
              height: '60%',
              paddingBottom: 50,
            },
            dialCode: {
              // backgroundColor:'red',
              color: theme?.black,
            },
            countryName: {
              // backgroundColor:'red',
              color: theme?.black,
            },
            flag: {
              color: 'black',
            },
          }}
          onBackdropPress={() => {
            setShowCountries(false);
          }}
          inputPlaceholder={'Search'}
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
          excludedCountries={excludedCountries}
        />
      </View>

      <ThankYouPopup
        onTouchOutside={() => {
          setTimeout(() => {
            setIsFocused(true);
          }, 400);

          setValue('firstName', '');
          setValue('email', '');
          setValue('phone', '');
          setValue('queryMessage', '');
          setShowThankyou(false);
          setFormSubmit(false);
          setFocused('');
          setFName('');
          setLName('');
          setEmail('');
          setPhone('');
          setQueryMessage('');
          setInquiryLabel('');
        }}
        onClose={() => {
          setTimeout(() => {
            setIsFocused(true);
          }, 400);

          setValue('firstName', '');
          setValue('email', '');
          setValue('phone', '');
          setValue('queryMessage', '');
          setShowThankyou(false);
          setFormSubmit(false);
          setFocused('');
          setFName('');
          setLName('');
          setEmail('');
          setPhone('');
          setQueryMessage('');
          setInquiryLabel('');
        }}
        show={showThankyou}
        thankyouText={
          'Thank you for contacting us. Your message has been sent to relevant department.'
        }
        goToHome={() => {
          setShowThankyou(false);
          setTimeout(() => {
            if (userData?.role == 'agent') {
              props.navigation.reset({
                index: 0,
                routes: [{name: 'ADashboard'}],
              });
            } else if (userData?.role == 'customer') {
              props.navigation.reset({
                index: 0,
                routes: [{name: 'CDashboard'}],
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
      <MapPopup
        show={showMapPopup}
        onTouchOutside={() => {
          setShowMapPopup(false);
        }}
        onPressAppleMap={onPressAppleMap}
        onPressGoogleMap={onPressGoogleMap}
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
      {formSubmit && <Loader />}
    </>
  );
};
export default ContactUs;
