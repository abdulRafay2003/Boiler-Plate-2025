import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import React from 'react';
import theme from '@/assets/stylesheet/theme';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {Input} from '@/components/TextInput/Input';
import {SubmitButton} from '@/components/buttons/submitButton';
// import {LANG_AR} from '@/constants/globalConst';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
interface Props {
  show?: any | null;
  onClose?: any | null;
  reasonMulti?: any | null;
  goToHome?: any | null;
  onTouchOutside?: any | null;
  focused?: any | null;
  textInputFocused?: any | null;
  control?: any | null;
  errors?: any | null;
  reasonText?: any | null;
  onChangeTexts?: any | null;
  onNoPress?: any | null;
  onYesPress?: any | null;
  reasonSubmit?: any | null;
  inputRef?: any | null;
  onTouchInput?: any | null;
  onStartShouldSetResponder?: any | null
}

export const DeleteAccountPopup = (props: Props) => {
  const {
    show,
    onClose,
    goToHome,
    onTouchOutside,
    reasonMulti,
    focused,
    textInputFocused,
    control,
    errors,
    reasonText,
    onChangeTexts,
    onNoPress,
    onYesPress,
    reasonSubmit,
    inputRef,
    onTouchInput,
    onStartShouldSetResponder
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
    backdropTransitionOutTiming={0}>
      <DialogContent>
        <TouchableOpacity
          style={{
            height: screenHeight,
            width: screenWidth,
            position: 'absolute',
            top: screenHeight * -0.35,
          }}
          activeOpacity={1}
          onPress={onTouchOutside}></TouchableOpacity>
        <View
          style={{
            height: 290,
            width: screenWidth * 0.93,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme?.white,
            alignSelf: 'center',
            borderRadius: 20,
          }} onStartShouldSetResponder={onStartShouldSetResponder}>
          {!reasonSubmit && (
            <TouchableOpacity
              style={{
                height: 30,
                width: 30,
                backgroundColor: theme?.darkGrey,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                // zIndex: 1000,
                borderRadius: 50,
                top: 10,
                left: screenWidth * 0.83,
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
          )}
          {reasonSubmit ? (
            <View
              style={{
                justifyContent: 'space-around',
                alignItems: 'center',
                paddingHorizontal: 20,
                width: '100%',
                height: '80%',
              }}>
              <Text
          allowFontScaling={false}

                style={{
                  fontSize: 22,
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  textAlign: 'center',
                }}>
                Your account has been Deleted
              </Text>
              <Text
          allowFontScaling={false}

                style={{
                  fontSize: 18,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  textAlign: 'center',
                }}>
                Thank you for using it. We look forward to seeing you again.
              </Text>
              <SubmitButton
                btnContainer={{
                  height: 44,
                  width: '40%',
                  backgroundColor: theme?.logoColor,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: theme?.logoColor,
                }}
                btnText="Goto Login"
                btnTextStyle={{
                  color: theme?.white,
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                }}
                onPress={goToHome}
              />
            </View>
          ) : (
            <>
              <Input
                title={'Your Reason'}
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
                  paddingHorizontal: 20,
                }}
                inputViewStyles={{
                  borderWidth: 1,
                  borderColor: focused ? theme?.logoColor : theme?.inputBorder,
                  height: 130,
                  borderRadius: 8,
                }}
                textInputFocused={textInputFocused}
                placeholder={'Type here'}
                fieldName={'reason'}
                control={control}
                errTxt={errors}
                errTxtstyle={{
                  right: 0,
                  color: theme.brightRed,
                  fontSize: 11,
                  alignSelf: 'flex-end',
                }}
                // value={reasonText}
                onChangeTexts={onChangeTexts}
                allowMultiline={true}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  width: '99%',
                  marginTop: 20,
                }}>
                <SubmitButton
                  btnContainer={{
                    height: 44,
                    width: '40%',
                    backgroundColor: theme?.transparent,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: theme?.textGrey,
                  }}
                  btnText="Cancel"
                  btnTextStyle={{
                    color: theme?.textGrey,
                    fontSize: 16,
                    fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                  }}
                  onPress={onNoPress}
                />
                <SubmitButton
                  btnContainer={{
                    height: 44,
                    width: '40%',
                    backgroundColor: theme?.logoColor,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  btnText="Yes, Im sure"
                  btnTextStyle={{
                    color: theme?.white,
                    fontSize: 16,
                    fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                  }}
                  onPress={onYesPress}
                />
              </View>
            </>
          )}
        </View>
      </DialogContent>
    </Dialog>
  );
};
