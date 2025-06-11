import React, {useEffect, useState, useRef} from 'react';
import theme from '@/assets/stylesheet/theme';
import {
  View,
  Image,
  Dimensions,
  Platform,
  Text,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Keyboard,
  Alert,
} from 'react-native';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {useForm} from 'react-hook-form';
import {SignupValidation} from '@/components/Validations/validations';
import {yupResolver} from '@hookform/resolvers/yup/src/yup';
import {SubmitButton} from '@/components/buttons/submitButton';
import {ModifiedAnimatedInput} from '@/components/TextInput/AuthInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Input} from '@/components/TextInput/Input';
import ReactNativePhoneInput from 'react-native-phone-input';
import {CountryPicker} from 'react-native-country-codes-picker';
import {
  countriesList,
  excludedCountries,
} from '@/constants/fontFamily/globalConst';
import {postSignUpApi} from '@/services/apiMethods/authApis';
import {AxiosError} from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {setLoader} from '@/redux/actions/UserActions';
import LoaderNew from '@/components/loaderNew';
import {AlertPopupAuth} from '@/components/modal/alertPopupAuth';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

export default function Signup(props) {
  const isLoadingRedux = useSelector(state => state?.user?.loading);
  const phone_ref = useRef(null);
  const dispatch = useDispatch();
  const phone_textInput = useRef(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [focused, setFocused] = useState('');
  const [phoneCode, setPhoneCode] = useState('+971');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showCountries, setShowCountries] = useState(false);
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(SignupValidation),
  });
  useEffect(() => {
    dispatch(setLoader(false));
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);
  const onPressNext = async () => {
    dispatch(setLoader(true));
    try {
      var payLoad = {
        email: email,
        phone: phoneCode + phone,
        deviceToken: 'noToken backend issue',
      };
      const responseSignup = await postSignUpApi(payLoad);
      if (responseSignup?.data?.statusCode == 200) {
        props?.navigation?.navigate('Otp', {
          data: email,
          from: 'signup',
          phoneNo: phoneCode + phone,
        });
      }
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setLoader(false));
      const err = error as AxiosError;
      setError(true);
      if (err?.response?.status >= 500 && err?.response?.status <= 599) {
        setErrorMsg('Unable to register user at the moment.');
      } else {
        setErrorMsg(
          err?.response == undefined
            ? err?.toString()
            : err?.response?.data?.message?.toString(),
        );
      }
    }
  };
  return (
    <View
      onStartShouldSetResponder={() => {
        Keyboard.dismiss();
      }}
      style={{
        height: Platform.OS == 'ios' ? screenHeight : screenHeight * 1.1,
        width: screenWidth,
      }}>
      <ImageBackground
        source={require('@/assets/images/background/auth_bg.png')}
        style={{
          flex: 1,
          paddingHorizontal: 20,
        }}
        resizeMode="cover">
        {/* <StatusBar barStyle={'light-content'} translucent={true}  /> */}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
          }}
          style={{
            top: 66,
            flex: 1,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: theme?.lightGrey,
              height: 47,
              width: 47,
              borderRadius: 47 / 2,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              alignSelf: 'flex-end',
            }}
            activeOpacity={1}
            onPress={() => {
              props.navigation.reset({
                index: 0,
                routes: [{name: 'Dashboard'}],
              });
            }}>
            <Image
              source={require('@/assets/images/icons/white_cross.png')}
              style={{height: 10, width: 10, tintColor: theme?.black}}
            />
          </TouchableOpacity>
          <Image
            source={require('@/assets/images/icons/logo.png')}
            style={{
              width: 67,
              height: 81,
              resizeMode: 'contain',
              tintColor: theme?.logoColor,
            }}
          />
          <View style={{width: '100%', marginTop: screenHeight * 0.1}}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 35,
                fontFamily: FONT_FAMILY?.IBMPlexBold,
                color: theme?.logoColor,
                textAlign: 'left',
                flexWrap: 'wrap',
                width: '85%',
              }}>
              Register Your Account
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                color: theme?.black,
                textAlign: 'left',
                flexWrap: 'wrap',
              }}>
              Please provide your registered email address and mobile number to
              proceed
            </Text>
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              style={{width: '100%'}}
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              showsVerticalScrollIndicator={false}
              bounces={false}>
              <View
                style={{
                  height: screenHeight * 0.48,
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <View>
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
                        setEmail(text.replace(/\s/g, ''));
                      }
                    }}
                  />
                  <View>
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
                        ref={phone_textInput}
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
                          if (text == '.') {
                          } else {
                            setPhone(text);
                          }
                        }}
                        keyboardType={'numeric'}
                        // maxLength={15}
                      />
                    </View>
                  </View>
                </View>

                <SubmitButton
                  btnContainer={{
                    height: 48,
                    width: '100%',
                    backgroundColor: theme?.logoColor,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}
                  btnText="Next"
                  btnTextStyle={{
                    color: theme?.white,
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                  }}
                  onPress={handleSubmit(onPressNext)}
                />
              </View>
            </KeyboardAwareScrollView>
          </View>
          <View style={{marginTop: 20, flexDirection: 'row'}}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                color: theme?.black,
              }}>
              Already have an account?
            </Text>
            <TouchableOpacity
              style={{marginLeft: 5}}
              activeOpacity={1}
              onPress={() => {
                props?.navigation?.navigate('Login');
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  color: theme?.logoColor,
                }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
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
      </ImageBackground>
      <AlertPopupAuth
        show={error}
        onClose={() => {
          setErrorMsg('');
          setError(false);
        }}
        alertText={errorMsg}
        onTouchOutside={() => {
          setErrorMsg('');
          setError(false);
        }}
      />
      {<LoaderNew visible={isLoadingRedux} color={theme?.logoColor} />}
    </View>
  );
}
