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
  Keyboard,
  Alert,
} from 'react-native';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {SubmitButton} from '@/components/buttons/submitButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AxiosError} from 'axios';
import {ConfirmationPopup} from '@/components/modal/confirmationPopup';
import crashlytics from '@react-native-firebase/crashlytics';
import {setLoader, setUserDetail} from '@/redux/actions/UserActions';
import {
  getProfilePicUrlApi,
  postLogInSmsApi,
  postLoginApi,
  postOtpVerifyApi,
  postSignUpApi,
  resendOtpApi,
} from '@/services/apiMethods/authApis';
import LoaderNew from '@/components/loaderNew';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {AlertPopupAuth} from '@/components/modal/alertPopupAuth';
import {ThankYouPopup} from '@/components/modal/thankyouPopUp';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);

export default function Otp(props) {
  const loginData = props?.route?.params?.data;
  const routeFrom = props?.route?.params?.from;
  const phoneData = props?.route?.params?.phoneNo;
  const isLoadingRedux = useSelector(state => state?.user?.loading);
  const _otpRef = useRef(null);
  const [otpCode, setOtpCode] = useState('');
  const [seconds, setSeconds] = useState(60);
  const [validOtp, setValidOtp] = useState('');
  const [errorView, setErrorView] = useState(false);
  const [checking, setChecking] = useState(null);
  const [messageError, setMessageError] = useState('Please Enter 4 Digits');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showThankyou, setShowThankyou] = useState(false);
  const [thanksText, setThanksText] = useState('');
  useEffect(() => {
    if (otpCode?.length == 4) {
      verifyAccount();
    }
  }, [otpCode]);

  const newCounter = updatedSeconds => {
    if (seconds > 0) {
      setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
      return (
        <Text
          allowFontScaling={false}
          style={{
            color: theme?.black,
            fontFamily: FONT_FAMILY.IBMPlexBold,
            fontSize: 13,
          }}>
          {new Date(updatedSeconds * 1000).toISOString()?.substring(14, 19)}
        </Text>
      );
    } else {
      return <Text allowFontScaling={false}></Text>;
    }
  };

  const resendEmailOtp = async () => {
    dispatch(setLoader(true));
    setSeconds(60);
    try {
      var payLoad = {
        email: loginData,
      };
      const responseEmailOtp = await resendOtpApi(payLoad);
      // Alert.alert(responseEmailOtp?.message);
      dispatch(setLoader(false));
      setShowThankyou(true);
      setThanksText(responseEmailOtp?.message);
    } catch (error) {
      dispatch(setLoader(false));
      const err = error as AxiosError;
      // Alert.alert(err?.response?.data?.message?.toString());
      setError(true);
      if (err?.response?.status >= 500 && err?.response?.status <= 599) {
        setErrorMsg('Unable to send otp at the moment.');
      } else {
        setErrorMsg(
          err?.response == undefined
            ? err?.toString()
            : err?.response?.data?.message?.toString(),
        );
      }
    }
  };

  const resendPhoneSmsOtp = async () => {
    dispatch(setLoader(true));
    setSeconds(60);
    try {
      var payLoad = {
        phone: loginData,
      };
      const responsePhoneSmsOtp = await resendOtpApi(payLoad);
      // Alert.alert(responsePhoneSmsOtp?.message);
      dispatch(setLoader(false));
      setShowThankyou(true);
      setThanksText(responsePhoneSmsOtp?.message);
    } catch (error) {
      dispatch(setLoader(false));
      const err = error as AxiosError;
      // Alert.alert(err?.response?.data?.message?.toString());
      setError(true);
      if (err?.response?.status >= 500 && err?.response?.status <= 599) {
        setErrorMsg('Unable to send otp at the moment.');
      } else {
        setErrorMsg(
          err?.response == undefined
            ? err?.toString()
            : err?.response?.data?.message?.toString(),
        );
      }
    }
  };

  const resendSignUpOtp = async () => {
    dispatch(setLoader(true));
    setSeconds(60);
    try {
      var payLoad = {
        email: loginData,
        phone: phoneData,
      };
      const responseSignUpOtp = await resendOtpApi(payLoad);
      // Alert.alert(responseSignUpOtp?.message);
      dispatch(setLoader(false));
      setShowThankyou(true);
      setThanksText(responseSignUpOtp?.message);
    } catch (error) {
      dispatch(setLoader(false));
      const err = error as AxiosError;
      setError(true);
      if (err?.response?.status >= 500 && err?.response?.status <= 599) {
        setErrorMsg('Unable to send otp at the moment.');
      } else {
        setErrorMsg(
          err?.response == undefined
            ? err?.toString()
            : err?.response?.data?.message?.toString(),
        );
      }
      // Alert.alert(err?.response?.data?.message?.toString());
    }
  };

  const resendOtp = async () => {
    if (routeFrom == 'phoneSms') {
      resendPhoneSmsOtp();
    } else if (routeFrom == 'email') {
      resendEmailOtp();
    } else {
      resendSignUpOtp();
    }
  };

  const verifyAccount = async () => {
    try {
      if (otpCode?.length == 4) {
        var payLoad =
          routeFrom == 'phoneSms'
            ? {
                phone: loginData,
                otp: otpCode,
                deviceToken: 'noToken backend issue',
              }
            : {
                email: loginData,
                otp: otpCode,
                deviceToken: 'noToken backend issue',
              };
        dispatch(setLoader(true));
        const responseLoginVerify = await postOtpVerifyApi(payLoad);
        if (responseLoginVerify?.statusCode == 200) {
          if (responseLoginVerify?.data?.user?.type == 'customer') {
            dispatch(
              setUserDetail({
                ...responseLoginVerify?.data,
                role:
                  responseLoginVerify?.data?.user?.type == 'customer'
                    ? 'customer'
                    : 'guest',
                profileImage: 'profile',
              }),
            );
            dispatch(setLoader(false));
            props.navigation.reset({
              index: 0,
              routes: [{name: 'DashboardCustomer'}],
            });
          } else if (responseLoginVerify?.data?.user?.type == 'agent') {
            dispatch(
              setUserDetail({
                ...responseLoginVerify?.data,
                role:
                  responseLoginVerify?.data?.user?.type == 'agent'
                    ? 'agent'
                    : 'guest',
                profileImage: 'profile',
              }),
            );
            dispatch(setLoader(false));
            props?.navigation?.reset({
              index: 0,
              routes: [{name: 'DashboardAgent'}],
            });
          }
        } else {
          dispatch(setLoader(false));
        }
      } else {
        setErrorView(true);
      }
    } catch (error) {
      dispatch(setLoader(false));
      const err = error as AxiosError;
      setError(true);
      if (err?.response?.status >= 500 && err?.response?.status <= 599) {
        setErrorMsg('Unable to verify at the moment.');
      } else {
        setErrorMsg(
          err?.response == undefined
            ? err?.toString()
            : err?.response?.data?.message?.toString(),
        );
      }
    }
  };
  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);

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
        <View
          style={{
            top: 66,
            flex: 1,
            alignItems: 'center',
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
              alignSelf: 'flex-start',
            }}
            activeOpacity={1}
            onPress={() => {
              props?.navigation?.goBack();
            }}>
            <Image
              source={require('@/assets/images/icons/arrow.png')}
              style={{
                height: 10,
                width: 14,
                tintColor: theme?.black,
                transform: [{rotate: '180deg'}],
              }}
              resizeMode="contain"
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
              Verification
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
              Please enter the code we have sent to your registered email
              address and number.
            </Text>
            <KeyboardAwareScrollView
              style={{width: '100%', marginTop: 50}}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 100,
                alignItems: 'center',
                justifyContent: 'space-between',
                height: screenHeight * 0.64,
              }}
              bounces={false}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <OTPInputView
                  ref={_otpRef}
                  style={{
                    width: '90%',
                    height: 50,
                    marginTop: 30,
                  }}
                  pinCount={4}
                  autoFocusOnLoad
                  codeInputFieldStyle={{
                    width: 69,
                    height: 69,
                    textAlign: 'center',
                    fontFamily: FONT_FAMILY.IBMPlexRegular,
                    fontSize: 20,
                    color: theme?.black,
                    backgroundColor: theme?.white,
                    shadowOffset: {
                      width: 0.5,
                      height: 1,
                    },
                    elevation: 8,
                    shadowColor: theme?.lightGrey,
                    shadowOpacity: 0.89,
                    shadowRadius: 1,
                    borderRadius: 15,
                  }}
                  onCodeChanged={code => {
                    // if (code?.length == 4) {
                    //   verifyAccount();
                    // }
                    setErrorView(false);
                    setOtpCode(code);
                  }}
                  keyboardType="number-pad"
                />

                {errorView && (
                  <Text
                    allowFontScaling={false}
                    style={{
                      marginTop: 20,
                      color: theme.brightRed,
                      fontSize: 13,
                      fontFamily: FONT_FAMILY.IBMPlexBold,
                    }}>
                    {messageError}
                  </Text>
                )}

                {seconds == 0 ? (
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontFamily: FONT_FAMILY.IBMPlexRegular,
                      fontSize: 14,
                      alignSelf: 'center',
                      marginTop: 20,
                      color: seconds > 0 ? theme.lightGrey : theme.lightGrey,
                    }}>
                    {'Did not receive code ?'}{' '}
                    <TouchableOpacity
                      onPress={() => {
                        // resetOtp();
                        resendOtp();
                      }}
                      disabled={seconds > 0 ? true : false}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: FONT_FAMILY.IBMPlexRegular,
                          fontSize: 14,
                          // color: theme.darkBlue,
                          textDecorationLine: 'underline',
                          top: 2,
                          color: seconds > 0 ? theme.lightGrey : theme.textGrey,
                        }}>
                        {'Resend'}
                      </Text>
                    </TouchableOpacity>
                  </Text>
                ) : (
                  <View
                    style={{
                      marginTop: 22,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 14,
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                        color: theme?.black,
                      }}>
                      Resend in{' '}
                    </Text>
                    {newCounter(seconds)}
                  </View>
                )}
              </View>
              <SubmitButton
                btnContainer={{
                  height: 48,
                  width: '100%',
                  backgroundColor: theme?.logoColor,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                btnText="Verify"
                btnTextStyle={{
                  color: theme?.white,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                }}
                onPress={() => {
                  verifyAccount();
                }}
              />
            </KeyboardAwareScrollView>
          </View>
        </View>
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
      <ThankYouPopup
        onTouchOutside={() => {
          setShowThankyou(false);
        }}
        onClose={() => {
          setShowThankyou(false);
        }}
        show={showThankyou}
        thankyouText={thanksText}
      />
      {<LoaderNew visible={isLoadingRedux} color={theme?.logoColor} />}
    </View>
  );
}
