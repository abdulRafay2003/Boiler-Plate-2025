import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  Keyboard,
  BackHandler,
  Alert,
} from 'react-native';
import {Headers} from '@/components/header/headers';
import theme from '@/assets/stylesheet/theme';
import {useForm} from 'react-hook-form';
import {ApplyMortageValidation} from '@/components/Validations/validations';
import {yupResolver} from '@hookform/resolvers/yup/src/yup';
import {Input} from '@/components/TextInput/Input';
import {SubmitButton} from '@/components/buttons/submitButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ReactNativePhoneInput from 'react-native-phone-input';
import {CountryPicker} from 'react-native-country-codes-picker';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {ThankYouPopup} from '@/components/modal/thankyouPopUp';
import {SubmitForm} from '@/services/apiMethods/form';
import {AxiosError} from 'axios';
import {
  countriesList,
  excludedCountries,
} from '@/constants/fontFamily/globalConst';
import {Loader} from '@/components/loader';
import crashlytics from '@react-native-firebase/crashlytics';
import {AlertPopupAuth} from '@/components/modal/alertPopupAuth';

let screenWidth = Math.round(Dimensions.get('window').width);

const ApplyMortage = props => {
  const data = props?.route?.params?.data;
  console.log('asvdjaskjdhkjashdkjahskjd', data);
  const phone_ref = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [maxNum, setMaxNum] = useState(9);
  const [checkRemeber, setCheckRemeber] = useState(false);
  const [formSubmit, setFormSubmit] = useState(false);

  const [focused, setFocused] = useState('');
  const [fullName, setFName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompany] = useState('');
  const [phoneCode, setPhoneCode] = useState('+971');
  const [salary, setSalary] = useState('');
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
    resolver: yupResolver(ApplyMortageValidation),
  });
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android') {
      StatusBar.setTranslucent(true);
    }
  }, []);
  useEffect(() => {
    reset({fullName, email, phone, companyName, salary});
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      // BackHandler.removeEventListener(
  //      'hardwareBackPress',
 //       handleBackButtonClick,
 //     );
    };
  }, [submitted]);

  const handleBackButtonClick = () => {
    if (submitted == true) {
      setSubmitted(false);
    } else {
      props?.navigation?.goBack();
    }

    return true;
  };
  const checkRememberPress = () => {
    setCheckRemeber(!checkRemeber);
  };
  const onSubmit = async () => {
    try {
      setFormSubmit(true);
      let checkBox = checkRemeber ? 'yes' : 'no';
      const formData = new FormData();
      formData.append('firstname', fullName);
      formData.append('email', email);
      formData.append('phone', phoneCode + phone);
      formData.append('company_name', companyName);
      formData.append('project_title', data?.title);
      formData.append('project_id', data?.id);
      formData.append('property_price', data?.propertyValue);
      formData.append('adv_payment', data?.advanceValue);
      formData.append('adv_payment_percentage', data?.advancePercent);
      formData.append('duration_year', data?.duration);
      formData.append('interest', data?.interestValue);
      formData.append('total_per_month_amount', data?.installment);
      formData.append('salary_range', salary);
      formData.append('agree', 'yes');
      formData.append('checkbox-215', checkBox);
      const formSubmitting = await SubmitForm(4691, formData);

      setFormSubmit(false);

      setFocused('');
      setFName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setSalary('');
      setSubmitted(true);
    } catch (error) {
      crashlytics().log('Form Submit Api Apply Mortage Screen');
      crashlytics().recordError(error);
      setFormSubmit(false);
      const err = error as AxiosError;
      if (err?.response?.status >= 500 && err?.response?.status <= 599) {
        setApiResponseMessageView('Unable to apply mortage at the moment.');
      }
      if (!err?.response?.data?.message) {
        setApiResponseMessageView('Request timeout');
      } else {
        setApiResponseMessageView(err?.response?.data?.message);
      }
    }
  };

  return (
    <>
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
        heading={'Mortgage Form'}
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
          Mortgage Register Interest
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
              title={'Email Address'}
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
                right: -7,
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
              title={'Company Name'}
              titleStyles={{
                marginBottom: 18.5,
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                color: theme?.black,
              }}
              inputViewStyles={{
                borderWidth: 1,
                borderColor:
                  focused == 'cname' ? theme?.logoColor : theme?.inputBorder,
                height: 46,
                borderRadius: 8,
              }}
              textInputFocused={() => {
                setFocused('cname');
              }}
              placeholder={'Enter your comapny name'}
              fieldName={'companyName'}
              control={control}
              errTxt={errors?.companyName && errors?.companyName?.message}
              errTxtstyle={{
                top: 46,
                right: 0,
                position: 'absolute',
                color: theme.brightRed,
                fontSize: 11,
                alignSelf: 'flex-end',
              }}
              value={companyName}
              onChangeTexts={text => {
                setCompany(text);
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
              maxLength={7}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              onSubmitEditing={Keyboard.dismiss}
              placeholderTextColor={theme?.textGrey}
              mainViewStyles={{
                width: '100%',
              }}
              title={'Salary'}
              titleStyles={{
                marginBottom: 18.5,
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                color: theme?.black,
              }}
              inputViewStyles={{
                borderWidth: 1,
                borderColor:
                  focused == 'sname' ? theme?.logoColor : theme?.inputBorder,
                height: 46,
                borderRadius: 8,
              }}
              textInputFocused={() => {
                setFocused('sname');
              }}
              placeholder={'Enter your salary range'}
              fieldName={'salary'}
              control={control}
              errTxt={errors?.salary && errors?.salary?.message}
              errTxtstyle={{
                top: 46,
                right: 0,
                position: 'absolute',
                color: theme.brightRed,
                fontSize: 11,
                alignSelf: 'flex-end',
              }}
              value={salary}
              onChangeTexts={text => {
                setSalary(text);
              }}
              keyboardType={'numeric'}
            />
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              activeOpacity={0.8}
              onPress={checkRememberPress}>
              {checkRemeber == true ? (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: theme?.logoColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{width: 15, height: 15, tintColor: theme?.logoColor}}
                    source={require('@/assets/images/icons/tick.png')}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: theme?.inputBorder,
                  }}></View>
              )}
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 5,
                  fontSize: 15,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.black,
                }}>
                Keep me up-to-date with news and offers
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 14,
              color: theme?.black,
              fontFamily: FONT_FAMILY?.IBMPlexRegular,
              marginTop: 24,
            }}>
            Please Visit
            <Text
              allowFontScaling={false}
              onPress={() => {
                props?.navigation?.navigate('PrivacyPolicy');
              }}
              style={{
                color: theme?.logoColor,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              }}>
              {' '}
              Privacy Policy
            </Text>{' '}
            to Understand How GJ Properties Handles your Personal Data.
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
              marginBottom: 20,
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
          setShowCountries(false);
          setCheckRemeber(false);
          setFormSubmit(false);

          setFocused('');
          setFName('');
          setEmail('');
          setPhone('');
          setCompany('');
          setSalary('');
        }}
        onClose={() => {
          setSubmitted(false);
          setShowCountries(false);
          setCheckRemeber(false);
          setFormSubmit(false);

          setFocused('');
          setFName('');
          setEmail('');
          setPhone('');
          setCompany('');
          setSalary('');
        }}
        show={submitted}
        thankyouText={
          'Thank you for your registeration. One of our representatives will be in touch with you shortly.'
        }
        goToHome={null}
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
          setPhone('');
          setPhoneCode(item?.dial_code);
          phone_ref.current.selectCountry(item?.code.toLowerCase());
          if (item?.code == 'QA' || item?.code == 'OM' || item?.code == 'KW') {
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
export default ApplyMortage;
