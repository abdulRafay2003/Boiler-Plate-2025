import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  Keyboard,
  BackHandler,
} from 'react-native';
import {Headers} from '@/components/header/headers';
import theme from '@/assets/stylesheet/theme';
import {useForm} from 'react-hook-form';
import {EnquiryFormValidation} from '@/components/Validations/validations';
import {yupResolver} from '@hookform/resolvers/yup/src/yup';
import {Input} from '@/components/TextInput/Input';
import {SubmitButton} from '@/components/buttons/submitButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ReactNativePhoneInput from 'react-native-phone-input';
import {CountryPicker} from 'react-native-country-codes-picker';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {ThankYouPopup} from '@/components/modal/thankyouPopUp';
import {
  countriesList,
  excludedCountries,
} from '@/constants/fontFamily/globalConst';
import {SubmitForm} from '@/services/apiMethods/form';
import {Loader} from '@/components/loader';
import {AxiosError} from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';
import {useSelector} from 'react-redux';
import {AlertPopupAuth} from '@/components/modal/alertPopupAuth';
import { RootState } from '@/redux/store';

let screenWidth = Math.round(Dimensions.get('window').width);
const EnquiryForm = props => {
  const data = props?.route?.params?.data;
  const phone_ref = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [maxNum, setMaxNum] = useState(9);
  const userData = useSelector((state: RootState) => state?.user?.userDetail);
  const [focused, setFocused] = useState('');
  const [fullName, setFName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [formSubmit, setFormSubmit] = useState(false);
  const [phoneCode, setPhoneCode] = useState('+971');
  const [apiResponnseErrors, setApiResponseMessageView] = useState('');
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(EnquiryFormValidation),
  });
  useEffect(() => {
    reset({fullName});
    reset({email});
    reset({phone});
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      backHandler.remove();
    };
  }, [submitted]);
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setTranslucent(true);
    }
  }, []);
  const handleBackButtonClick = () => {
    if (submitted == true) {
      setSubmitted(false);
    } else {
      props?.navigation?.goBack();
    }

    return true;
  };
  const onSubmit = async () => {
    try {
      setFormSubmit(true);
      const formData = new FormData();
      formData.append('firstname', fullName);
      formData.append('email', email);
      formData.append('phone', phoneCode + phone);
      formData.append(
        'project_location',
        `https://www.google.com/maps/search/?api=1&query=${data?.lat},${data?.lng}`,
      );
      formData.append('unit_type', data?.unitType);
      formData.append('floor_plan', data?.floorPlan);
      formData.append('project_title', data?.projectTitle);
      formData.append('project_id', data?.id);

      // console.log('sjasbdjkasjkdhasjkdh', data);
      // return;

      const formSubmitting = await SubmitForm(621, formData);
      setFormSubmit(false);
      setFocused('');
      setFName('');
      setEmail('');
      setPhone('');
      setSubmitted(true);
    } catch (error) {
      crashlytics().log('Form Submit Api Enquiry Form Screen');
      crashlytics().recordError(error);
      setFormSubmit(false);

      const err = error as AxiosError;
      console?.log('adsjhfhsadgjgjksdanjcks', err?.response?.status);
      if (err?.response?.status >= 500 && err?.response?.status <= 599) {
        setApiResponseMessageView('Unable to send enquiry at the moment.');
      } else if (!err?.response?.data?.message) {
        setApiResponseMessageView('Request timeout');
      } else {
        setApiResponseMessageView(err?.response?.data?.message);
      }
    }
  };

  return (
    <>
      {/* <StatusBar barStyle={'light-content'} translucent={true}  /> */}
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
        heading={'ENQUIRY FORM'}
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
      <KeyboardAwareScrollView
        style={{marginVertical: 20, paddingHorizontal: 20}}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 20,
            color: theme?.black,
            lineHeight: 20,
            fontFamily: FONT_FAMILY?.IBMPlexBold,
          }}>
          Register your Interest
        </Text>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 14,
            color: theme?.black,
            lineHeight: 40,
            fontFamily: FONT_FAMILY?.IBMPlexRegular,
          }}>
          Fill out the form and we will get back to you.
        </Text>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <Input
              placeholderTextColor={theme?.textGrey}
              mainViewStyles={{
                width: '100%',
              }}
              title={'Full Name'}
              titleStyles={{
                marginBottom: 18.5,
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                color: theme?.black,
              }}
              inputViewStyles={{
                borderWidth: 1,
                borderColor:
                  focused == 'fname' ? theme?.logoColor : theme?.inputBorder,
                height: 46,
                borderRadius: 8,
              }}
              textInputFocused={() => {
                setFocused('fname');
              }}
              placeholder={'Enter full name'}
              fieldName={'fullName'}
              control={control}
              errTxt={errors?.fullName && errors?.fullName?.message}
              errTxtstyle={{
                top: 46,
                right: 0,
                position: 'absolute',
                color: theme.brightRed,
                fontSize: 11,
                alignSelf: 'flex-end',
              }}
              value={fullName}
              onChangeTexts={text => {
                setFName(text);
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <Input
              placeholderTextColor={theme?.textGrey}
              mainViewStyles={{
                width: '100%',
              }}
              title={'Email'}
              titleStyles={{
                marginBottom: 18.5,
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                color: theme?.black,
              }}
              inputViewStyles={{
                borderWidth: 1,
                borderColor:
                  focused == 'email' ? theme?.logoColor : theme?.inputBorder,
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
          </View>
          <Text
            allowFontScaling={false}
            style={{
              marginBottom: 18.5,
              fontSize: 16,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              color: theme?.black,
            }}>
            Phone Number
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor:
                focused == 'phone' ? theme?.logoColor : theme?.inputBorder,
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
                left: screenWidth >= 838 ? 40 : 35,
                top: Platform.OS == 'ios' ? 12.5 : 12,
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
                width: '5%',
              }}
            />
            <Input
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              onSubmitEditing={Keyboard.dismiss}
              mainViewStyles={{
                width: screenWidth >= 838 ? '93%' : '85%',
                marginLeft: 20,
              }}
              placeholderTextColor={theme?.textGrey}
              inputViewStyles={{
                borderColor:
                  focused == 'phone' ? theme?.logoColor : theme?.inputBorder,
                width: '103%',
                height: '100%',
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
                right: 0,
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
              fontSize: 14,
              color: theme?.black,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              marginTop: 24,
            }}>
            It is really important to us that you know exactly how we look after
            your personal information and what we will use it for.
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
              fontWeight: '700',
            }}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </KeyboardAwareScrollView>
      <ThankYouPopup
        onTouchOutside={() => {
          setSubmitted(false);
          setFormSubmit(false);
          setFocused('');
          setFName('');
          setEmail('');
          setPhone('');
        }}
        onClose={() => {
          setSubmitted(false);
          setFormSubmit(false);
          setFocused('');
          setFName('');
          setEmail('');
          setPhone('');
        }}
        show={submitted}
        thankyouText={
          'Thank you for registering your interest. One of our representatives will be in touch with you shortly.'
        }
        goToHome={() => {
          setSubmitted(false);
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

          setShowCountries(false);
        }}
        excludedCountries={excludedCountries}
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
export default EnquiryForm;
