import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Platform,
  Keyboard,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ReactNativePhoneInput from 'react-native-phone-input';
import {CountryPicker} from 'react-native-country-codes-picker';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {Input} from '@/components/TextInput/Input';
import theme from '@/assets/stylesheet/theme';
import {SubmitButton} from '@/components/buttons/submitButton';
import {useIsFocused} from '@react-navigation/native';

// import {LANG_AR} from '@/constants/globalConst';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
interface Props {
  image?: any | null;
  show?: any | null;
  onClose?: any | null;
  goToHome?: any | null;
  thankyouText?: any | null;
  onTouchOutside?: any | null;
  textInputFocused?: any | null;
  focusedInput?: any | null;
  firstName?: any | null;
  changeFirstname?: any | null;
  email?: any | null;
  changeEmail?: any | null;
  phone?: any | null;
  changePhone?: any | null;
  showCountries?: any | null;
  countriesList?: any | null;
  excludedCountries?: any | null;
  onPressFlag?: any | null;
  onBackdropPress?: any | null;
  pickerButtonOnPress?: any | null;
  phone_ref?: any | null;
  errorsFname?: any | null;
  errorsEmail?: any | null;
  errorsPhone?: any | null;
  onSubmit?: any | null;
  invalidEmail?: any | null;
  maxLength?: any | null;
  formSubmit?: any | null;
  onPressDownloadBrochure?: any | null;
  phoneLengthError?: any | null;
  text?: any | null;
  invalidNumber?: any | null;
  control?: any | null;
  focused?: any | null;
  errFirstName?: any | null;
  onChangeFirstNameTexts?: any | null
}

export const BrochurePopup = (props: Props) => {
  const {
    show,
    onClose,
    onTouchOutside,
    textInputFocused,
    focusedInput,
    firstName,
    email,
    phone,
    changeFirstname,
    changeEmail,
    changePhone,
    showCountries,
    countriesList,
    excludedCountries,
    onPressFlag,
    onBackdropPress,
    pickerButtonOnPress,
    phone_ref,
    errorsFname,
    errorsEmail,
    errorsPhone,
    onSubmit,
    invalidEmail,
    maxLength,
    formSubmit,
    onPressDownloadBrochure,
    phoneLengthError,
    text,
    invalidNumber,
    control,
    focused,
    errFirstName,
    onChangeFirstNameTexts
  } = props;

  return (
    <Dialog
      visible={show}
      coverScreen={true}
      overlayBackgroundColor={'black'}
      overlayOpacity={0.8}
      animationIn="bounceInUp"
      statusBarTranslucent={true}
      height={screenHeight}
      width={screenWidth}
      dialogStyle={{
        backgroundColor: theme?.transparentWhite,
        justifyContent: 'center',
      }}
      backdropTransitionOutTiming={0}
      // style={{ borderRadius:20}}
    >
      <DialogContent>
        <TouchableOpacity
          style={{
            height: screenHeight,
            width: screenWidth,
            position: 'absolute',
            top: screenHeight * -0.17,
            // backgroundColor:'red'
          }}
          activeOpacity={1}
          onPress={onTouchOutside}></TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 30,
            width: 30,
            backgroundColor: theme?.darkGrey,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            zIndex: 1000,
            borderRadius: 50,
            top: 33,
            // paddingTop:20,
            left: screenWidth * 0.85,
          }}
          onPress={onClose}>
          <Image
            source={require('@/assets/images/icons/white_cross.png')}
            resizeMode={'cover'}
            style={{
              height: 13,
              width: 13,
              tintColor: theme.white,
            }}
          />
        </TouchableOpacity>
        {formSubmit ? (
          <View
            style={{
              marginVertical: 20,
              paddingHorizontal: 40,
              backgroundColor: theme?.white,
              paddingVertical: 20,
              borderRadius: 20,
              height: screenHeight * 0.5,
              width: screenWidth * 0.93,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            {/* <View
              style={{
                marginTop: 25,
                height: '50%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor:'red'
              }}> */}
            <Image
              source={require('@/assets/images/icons/enquiry_success.png')}
              style={{height: '30%', width: '40%'}}
              resizeMode="contain"
            />
            <Text
          allowFontScaling={false}

              style={{
                textAlign: 'center',
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexRegular,
                color: theme?.textGrey,
              }}>
              Thank you for registering your interest. One of our
              representatives will be in touch with you shortly.
            </Text>
            {/* </View> */}

            <TouchableOpacity
              activeOpacity={1}
              onPress={onPressDownloadBrochure}>
              <Text
          allowFontScaling={false}

                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.logoColor,
                  textDecorationLine: 'underline',
                }}>
                In the mean time please click here to download the brochure
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <KeyboardAwareScrollView
            style={{
              marginVertical: 20,
              paddingHorizontal: 20,
              backgroundColor: theme?.white,
              paddingVertical: 20,
              borderRadius: 20,
            }}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            <Text
          allowFontScaling={false}

              style={{
                fontSize: 20,
                color: theme?.black,
                // fontWeight: 'bold',
                lineHeight: 20,
                fontFamily: FONT_FAMILY?.IBMPlexBold,
              }}>
              Download Brochure
            </Text>

            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <View
                  style={{
                    width: '100%',
                  }}>
                  <Text
          allowFontScaling={false}

                    style={{
                      marginBottom: 18.5,
                      fontSize: 16,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      color: theme?.black,
                    }}>
                    Full Name
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor:
                        focusedInput == 'fname'
                          ? theme?.logoColor
                          : theme?.inputBorder,
                      // width: '100%',
                      height: 46,
                      borderRadius: 8,
                    }}>
                    <TextInput
                      style={{
                        height: '100%',
                        width: '100%',
                        paddingHorizontal: 10,
                        color: theme?.black,
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      }}
                      value={firstName}
                      onFocus={textInputFocused.bind(this, 'fname')}
                      keyboardType={'default'}
                      placeholder={'Enter full name'}
                      allowFontScaling={false}
                      multiline={false}
                      placeholderTextColor={theme?.textGrey}
                      textAlignVertical="top"
                      onChangeText={changeFirstname}
                    />

                    {errorsFname && (
                      <Text
                        allowFontScaling={false}
                        style={{
                          top: 46,
                          right: 0,
                          position: 'absolute',
                          color: theme.brightRed,
                          fontSize: 11,
                          alignSelf: 'flex-end',
                        }}>
                        This field is required.
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <View
                  style={{
                    width: '100%',
                  }}>
                  <Text
          allowFontScaling={false}

                    style={{
                      marginBottom: 18.5,
                      fontSize: 16,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      color: theme?.black,
                    }}>
                    Email
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor:
                        focusedInput == 'email'
                          ? theme?.logoColor
                          : theme?.inputBorder,
                      // width: '100%',
                      height: 46,
                      borderRadius: 8,
                    }}>
                    <TextInput
                      style={{
                        height: '100%',
                        width: '100%',
                        paddingHorizontal: 10,
                        color: theme?.black,
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      }}
                      value={email}
                      onFocus={textInputFocused.bind(this, 'email')}
                      keyboardType={'default'}
                      placeholder={'Enter your email'}
                      allowFontScaling={false}
                      multiline={false}
                      placeholderTextColor={theme?.textGrey}
                      textAlignVertical="top"
                      onChangeText={changeEmail}
                    />
                    {errorsEmail && (
                      <Text
          allowFontScaling={false}

                        allowFontScaling={false}
                        style={{
                          top: 46,
                          right: 0,
                          position: 'absolute',
                          color: theme.brightRed,
                          fontSize: 11,
                          alignSelf: 'flex-end',
                        }}>
                        This field is required.
                      </Text>
                    )}
                    {invalidEmail && (
                      <Text
                        allowFontScaling={false}
                        style={{
                          top: 46,
                          right: 0,
                          position: 'absolute',
                          color: theme.brightRed,
                          fontSize: 11,
                          alignSelf: 'flex-end',
                        }}>
                        Enter valid email.
                      </Text>
                    )}
                  </View>
                </View>
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
                    focusedInput == 'phone'
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
                    top: Platform.OS == 'ios' ? 12.5 : 12,
                  }}
                  onPress={onPressFlag}>
                  <Image
                    source={require('@/assets/images/icons/country_arrow.png')}
                    style={{height: 20, width: 20}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <ReactNativePhoneInput
                  ref={phone_ref}
                  onPressFlag={onPressFlag}
                  buttonTextStyle={{
                    // fontFamily: FONT_FAMILY.MontserratSemiBold,
                    fontSize: 14,
                    color: theme.darkestBlue,
                    backgroundColor: 'red',
                  }}
                  initialCountry={'ae'}
                  // countriesList={countriesList}
                  autoFormat={false}
                  textStyle={{
                    // fontFamily: FONT_FAMILY.MontserratSemiBold,
                    fontSize: 14,
                    color: theme.darkestBlue,
                  }}
                  style={{
                    width: '10%',
                    // height: 40,
                    // marginTop: 0,
                    // marginBottom: 20,
                    // alignItems: 'center',

                    // borderBottomWidth: 1,
                    // borderColor: theme.lightGrey,
                  }}
                  textProps={
                    {
                      // maxLength: numLength,
                    }
                  }
                />

                <View
                  style={{
                    width: '85%',
                    marginLeft: 20,
                  }}>
                  <View
                    style={{
                      borderColor:
                        focusedInput == 'phone'
                          ? theme?.logoColor
                          : theme?.inputBorder,
                      width: '103%',
                      height: '100%',
                      borderRadius: 8,
                    }}>
                    <TextInput
                      returnKeyLabel="Done"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                      style={{
                        height: '100%',
                        width: '100%',
                        paddingHorizontal: 10,
                        color: theme?.black,
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      }}
                      value={phone}
                      onFocus={textInputFocused?.bind(this, 'phone')}
                      keyboardType={'numeric'}
                      placeholder={'xx-xxx-xxxx'}
                      allowFontScaling={false}
                      multiline={false}
                      placeholderTextColor={theme?.textGrey}
                      textAlignVertical="top"
                      onChangeText={changePhone}
                      // maxLength={15}
                    />
                    {phoneLengthError && (
                      <Text
                        allowFontScaling={false}
                        style={{
                          top: 46,
                          right: 0,
                          position: 'absolute',
                          color: theme.brightRed,
                          fontSize: 11,
                          alignSelf: 'flex-end',
                        }}>
                        {text}
                      </Text>
                    )}
                    {errorsPhone && (
                      <Text
                        allowFontScaling={false}
                        style={{
                          top: 46,
                          right: 0,
                          position: 'absolute',
                          color: theme.brightRed,
                          fontSize: 11,
                          alignSelf: 'flex-end',
                        }}>
                        This field is required.
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* =================================== */}
              {/* <Input
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
                    focused == 'fname' ? theme?.logoColor : theme?.inputBorder,
                  height: 46,
                  borderRadius: 8,
                }}
                textInputFocused={textInputFocused}
                placeholder={'Enter Full Name'}
                fieldName={'firstName'}
                control={control}
                errTxt={errFirstName}
                errTxtstyle={{
                  top: 46,
                  right: 0,
                  position: 'absolute',
                  color: theme.brightRed,
                  fontSize: 11,
                  alignSelf: 'flex-end',
                }}
                value={firstName}
                onChangeTexts={onChangeFirstNameTexts}
              /> */}
              {/* =================================== */}

              <Text
          allowFontScaling={false}

                style={{
                  fontSize: 14,
                  color: theme?.black,
                  // lineHeight: 20,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  marginTop: 24,
                }}>
                It is really important to us that you know exactly how we look
                after your personal information and what we will use it for.
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
                onPress={onSubmit}
              />
            </View>
          </KeyboardAwareScrollView>
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
          onBackdropPress={onBackdropPress}
          inputPlaceholder={'Search'}
          pickerButtonOnPress={pickerButtonOnPress}
          excludedCountries={excludedCountries}
        />
      </DialogContent>
    </Dialog>
  );
};
