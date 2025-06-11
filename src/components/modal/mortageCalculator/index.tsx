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
import React, {useEffect, useState} from 'react';
import theme from '@/assets/stylesheet/theme';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import {FONT_FAMILY} from '@/constants/fontFamily';
import Slider from '@react-native-community/slider';
import {Input} from '@/components/TextInput/Input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import {LANG_AR} from '@/constants/globalConst';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
interface Props {
  show?: any | null;
  onClose?: any | null;
  onTouchOutside?: any | null;
  propertyValue?: any | null;
  onChangepropertyValue?: any | null;
  onPressAddPropertyPrice?: any | null;
  onPressMinusPropertyPrice?: any | null;
  onPressAddInterestPrice?: any | null;
  onPressMinusInterestPrice?: any | null;
  advanceValue?: any | null;
  onSlidingAdvance?: any | null;
  yearsValue?: any | null;
  onSlidingYear?: any | null;
  interestValue?: any | null;
  installment?: any | null;
  onApplyNowPress?: any | null;
  onChangeInterestRate?: any | null;
  err?: any | null;
  isKeyShow?: any | null;
}

export const MoratgeCalculator = (props: Props) => {
  const {
    show,
    onTouchOutside,
    onClose,
    propertyValue,
    onChangepropertyValue,
    onPressAddPropertyPrice,
    onPressMinusPropertyPrice,
    onPressAddInterestPrice,
    onPressMinusInterestPrice,
    advanceValue,
    onSlidingAdvance,
    yearsValue,
    onSlidingYear,
    interestValue,
    installment,
    onApplyNowPress,
    onChangeInterestRate,
    err,
    isKeyShow,
  } = props;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const installmentFormat = () => {
    const numberString = installment.toString();
    const parts = numberString.split('.');
    const wholeNumber = parts[0];
    let formattedNumber = '';

    // var isKeyboardVisible;
    for (let i = wholeNumber.length - 1, j = 1; i >= 0; i--, j++) {
      formattedNumber = wholeNumber.charAt(i) + formattedNumber;
      if (j % 3 === 0 && i !== 0) {
        formattedNumber = ',' + formattedNumber;
      }
    }

    if (parts.length > 1) {
      formattedNumber += '.' + parts[1];
    }

    return formattedNumber;
  };
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

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
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
      // style={{justifyContent: 'center',alignItems:'center',alignContent:'center'}}
    >
      <DialogContent>
        <TouchableOpacity
          style={{
            height: screenHeight,
            width: screenWidth,
            position: 'absolute',
            // top: screenHeight * -0.35,
          }}
          activeOpacity={1}
          onPress={onTouchOutside}></TouchableOpacity>
        <KeyboardAwareScrollView
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          bounces={false}>
          <View
            style={{
              height:
                Platform.OS == 'android'
                  ? screenHeight * 0.78
                  : screenHeight * 0.7,
              width: screenWidth * 0.9,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme?.white,
              alignSelf: 'center',
              borderRadius: 20,
            }}>
            <TouchableOpacity
              style={{
                height: 30,
                width: 30,
                backgroundColor: theme?.logoColor,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                // zIndex: 1000,
                borderRadius: 50,
                top: 10,
                left: screenWidth * 0.8,
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
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: 16,
                zIndex: 9999,
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 26,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                  color: theme?.black,
                  // textTransform: 'uppercase',
                }}>
                Mortgage Calculator
              </Text>
              <View style={{marginBottom: 0, marginTop: 10}}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    color: theme?.black,
                    // textTransform: 'uppercase',
                  }}>
                  Property Price
                </Text>
                <View style={{height: 40, flexDirection: 'row', marginTop: 10}}>
                  <View
                    style={{
                      height: '100%',
                      width: '60%',
                      paddingHorizontal: 10,
                      backgroundColor: theme?.greyRGB,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: 10,
                    }}>
                    <TextInput
                      returnKeyLabel="Done"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                      style={{
                        height: '100%',
                        width: '80%',
                        paddingHorizontal: 10,
                        color: theme?.black,
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                        // borderWidth:1,
                        // backgroundColor: theme?.greyRGB,
                        // textAlignVertical:'center'
                      }}
                      value={propertyValue}
                      // onFocus={true}
                      keyboardType={'numeric'}
                      placeholder={'Enter Property Price'}
                      allowFontScaling={false}
                      multiline={false}
                      placeholderTextColor={theme?.greyRGB}
                      // textAlignVertical="top"
                      // editable={false}
                      // onChangeText={text => {
                      //   setPropertyValue(text);
                      //   // onChange(e), onChangeTexts && onChangeTexts(e);
                      // }}
                      onChangeText={onChangepropertyValue}
                      maxLength={100}
                    />
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 14,
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                        color: theme?.black,
                        // textTransform: 'uppercase',
                      }}>
                      AED
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={{
                      backgroundColor: theme?.greyRGB,
                      height: 40,
                      width: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 40 / 2,
                      marginHorizontal: 20,
                      paddingBottom: Platform.OS == 'android' ? 5 : 0,
                    }}
                    activeOpacity={0.9}
                    onPress={onPressMinusPropertyPrice}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        // height:40,
                        fontSize: 26,
                        fontFamily: FONT_FAMILY?.IBMPlexMedium,
                        color: theme?.black,
                        // backgroundColor:'red',
                        // textAlignVertical:'center'
                        // textTransform: 'uppercase',
                      }}>
                      -
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: theme?.greyRGB,
                      height: 40,
                      width: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 40 / 2,
                      paddingBottom: Platform.OS == 'android' ? 5 : 0,
                    }}
                    activeOpacity={0.9}
                    onPress={onPressAddPropertyPrice}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        // height:40,
                        fontSize: 26,
                        fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                        color: theme?.black,
                        // textTransform: 'uppercase',
                      }}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
                {err && propertyValue?.length <= 0 ? (
                  <Text
                    allowFontScaling={false}
                    style={{
                      top: 76,
                      right: 0,
                      position: 'absolute',
                      color: theme.brightRed,
                      fontSize: 11,
                      alignSelf: 'flex-end',
                      // fontFamily: FONT_FAMILY.MontserratSemiBold,
                    }}>
                    This Field is Required.
                  </Text>
                ) : null}
              </View>
              <View style={{marginBottom: 0, marginTop: 10}}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    color: theme?.black,
                    // textTransform: 'uppercase',
                  }}>
                  Advance Payment
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      color: theme?.black,
                      // textTransform: 'uppercase',
                    }}>
                    0%
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      color: theme?.black,
                      // textTransform: 'uppercase',
                    }}>
                    {advanceValue}%
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      color: theme?.black,
                      // textTransform: 'uppercase',
                    }}>
                    80%
                  </Text>
                </View>
                <Slider
                  style={{width: '100%', height: 40}}
                  minimumValue={0}
                  maximumValue={80}
                  minimumTrackTintColor={theme?.logoColor}
                  maximumTrackTintColor={theme?.textGrey}
                  thumbTintColor={theme?.logoColor}
                  // thumbImage={Platform.OS == 'android'?require('@/assets/images/icons/thumb_android.png') :null}
                  // upperLimit={25}
                  // lowerLimit={10}
                  onValueChange={onSlidingAdvance}
                  onSlidingComplete={onSlidingAdvance}
                />

                {advanceValue > 0 && (
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      fontFamily: FONT_FAMILY?.IBMPlexMedium,
                      color: theme?.logoColor,
                      alignSelf: 'center',
                      top: -10,
                      // textTransform: 'uppercase',
                    }}>
                    {(+propertyValue * (advanceValue / 100)).toLocaleString() +
                      ' AED'}
                  </Text>
                )}
                {err && advanceValue == '0' ? (
                  <Text
                    allowFontScaling={false}
                    style={{
                      top: 76,
                      right: 0,
                      position: 'absolute',
                      color: theme.brightRed,
                      fontSize: 11,
                      alignSelf: 'flex-end',
                      // fontFamily: FONT_FAMILY.MontserratSemiBold,
                    }}>
                    This Field is Required.
                  </Text>
                ) : null}
              </View>
              <View style={{marginBottom: 0, marginTop: 10}}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    color: theme?.black,
                    // textTransform: 'uppercase',
                  }}>
                  Loan Duration
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      color: theme?.black,
                      // textTransform: 'uppercase',
                    }}>
                    1 Y
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      color: theme?.black,
                      // textTransform: 'uppercase',
                    }}>
                    {yearsValue} Y
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                      color: theme?.black,
                      // textTransform: 'uppercase',
                    }}>
                    25 Y
                  </Text>
                </View>

                <Slider
                  style={{width: '100%', height: 40}}
                  minimumValue={1}
                  maximumValue={25}
                  minimumTrackTintColor={theme?.logoColor}
                  maximumTrackTintColor={theme?.textGrey}
                  thumbTintColor={theme?.logoColor}
                  // thumbImage={Platform.OS == 'android'?require('@/assets/images/icons/thumb_android.png') :null}
                  // upperLimit={25}
                  // lowerLimit={10}
                  onValueChange={onSlidingYear}
                  onSlidingComplete={onSlidingYear}
                />
              </View>
              <View style={{marginBottom: 0, marginTop: 10}}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    color: theme?.black,
                    // textTransform: 'uppercase',
                  }}>
                  Interest Rate
                </Text>
                <View style={{height: 40, flexDirection: 'row', marginTop: 10}}>
                  <View
                    style={{
                      height: '100%',
                      width: '60%',
                      paddingHorizontal: 10,
                      backgroundColor: theme?.greyRGB,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: 10,
                    }}>
                    <TextInput
                      returnKeyLabel="Done"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                      style={{
                        height: '100%',
                        width: '80%',
                        paddingHorizontal: 10,
                        color: theme?.black,
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                        // borderWidth:1,
                        // backgroundColor: theme?.greyRGB,
                        // textAlignVertical:'center'
                      }}
                      value={interestValue}
                      // onFocus={true}
                      keyboardType={'numeric'}
                      placeholder={'Enter Interest Rate'}
                      allowFontScaling={false}
                      multiline={false}
                      placeholderTextColor={theme?.greyRGB}
                      // editable={false}
                      // textAlignVertical="top"
                      onChangeText={onChangeInterestRate}
                      maxLength={100}
                    />
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 14,
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                        color: theme?.black,
                        // textTransform: 'uppercase',
                      }}>
                      %
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={{
                      backgroundColor: theme?.greyRGB,
                      height: 40,
                      width: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 40 / 2,
                      marginHorizontal: 20,
                      paddingBottom: Platform.OS == 'android' ? 5 : 0,
                    }}
                    activeOpacity={0.9}
                    onPress={onPressMinusInterestPrice}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 26,
                        fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                        color: theme?.black,

                        // textTransform: 'uppercase',
                      }}>
                      -
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: theme?.greyRGB,
                      height: 40,
                      width: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 40 / 2,
                      paddingBottom: Platform.OS == 'android' ? 5 : 0,
                    }}
                    activeOpacity={0.9}
                    onPress={onPressAddInterestPrice}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 26,
                        fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                        color: theme?.black,
                        // textTransform: 'uppercase',
                      }}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* {interestValue == ''&& <Text
          allowFontScaling={false}

                style={{
                  fontSize: 12,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.brightRed,
                }}>
                Interest Rate is Required to calculate Payment.
              </Text>} */}
                {err && interestValue == '' ? (
                  <Text
                    allowFontScaling={false}
                    style={{
                      top: 76,
                      right: 0,
                      position: 'absolute',
                      color: theme.brightRed,
                      fontSize: 11,
                      alignSelf: 'flex-end',
                      // fontFamily: FONT_FAMILY.MontserratSemiBold,
                    }}>
                    This Field is Required.
                  </Text>
                ) : null}
              </View>
              <View style={{marginBottom: 0, marginTop: 30}}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    color: theme?.black,
                    // textTransform: 'uppercase',
                  }}>
                  Estimated Monthly Payment
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10,
                    width: screenWidth * 0.8,
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 30,
                      fontFamily: FONT_FAMILY?.IBMPlexBold,
                      color: theme?.logoColor,

                      textAlign: 'center',
                      // marginLeft: screenWidth * 0.2
                      // textTransform: 'uppercase',
                    }}>
                    {installmentFormat()}{' '}
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 14,
                        fontFamily: FONT_FAMILY?.IBMPlexRegular,
                        color: theme?.textGrey,
                        marginLeft: 10,
                        // textTransform: 'uppercase',
                      }}>
                      AED/Month
                    </Text>
                  </Text>
                </View>
              </View>
              {/* <TouchableOpacity
              style={{
                height: 50,
                width: 140,
                backgroundColor: theme?.logoColor,
                alignSelf: 'center',
                borderRadius: 50,
                marginTop: Platform?.OS == 'ios' ? 45 : 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={1}
              onPress={onApplyNowPress}>
              <Text
          allowFontScaling={false}

                style={{
                  fontSize: 18,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                  color: theme?.white,
                }}>
                Apply Now
              </Text>
            </TouchableOpacity> */}
            </View>
          </View>
        </KeyboardAwareScrollView>
        {!isKeyShow && (
          <TouchableOpacity
            style={{
              height: 50,
              width: 140,
              backgroundColor: theme?.logoColor,
              alignSelf: 'center',
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              bottom: 0,
            }}
            activeOpacity={1}
            onPress={onApplyNowPress}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 18,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                color: theme?.white,
              }}>
              Apply Now
            </Text>
          </TouchableOpacity>
        )}
      </DialogContent>
    </Dialog>
  );
};
