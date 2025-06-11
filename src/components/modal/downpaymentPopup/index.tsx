import {View, Text, Image, Dimensions, TouchableOpacity} from 'react-native';
import React from 'react';
import theme from '@/assets/stylesheet/theme';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {SubmitButton} from '@/components/buttons/submitButton';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
interface Props {
  show?: any | null;
  onClose?: any | null;
  onTouchOutside?: any | null;
  onPressOk?: any | null;
  btnTxtLabel?: any | null;
  text?: any | null
}

export const DownPaymentPopup = (props: Props) => {
  const {
    show,
    onClose,
    onTouchOutside,
    onPressOk,
    btnTxtLabel,
    text
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
            height: 190,
            width: screenWidth * 0.93,
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
              backgroundColor: theme?.darkGrey,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              zIndex: 1000,
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
          <View
            style={{
              paddingHorizontal: 20,
              height: '60%',
              // borderWidth: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}>
              {/* <Text
          allowFontScaling={false}

                style={{
                  fontSize: 20,
                  fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                  color: theme?.black,
                  textAlign: 'center',
                }}>
                {confirmationHeading}
              </Text> */}
              <Text
          allowFontScaling={false}

                style={{
                  fontSize: 16,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.black,
                  textAlign: 'center',
                }}>
               {text}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
            }}>
            <SubmitButton
              btnContainer={{
                height: 44,
                width: '90%',
                backgroundColor: theme?.logoColor,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: theme?.textGrey,
              }}
              btnText={btnTxtLabel}
              btnTextStyle={{
                color: theme?.white,
                fontSize: 16,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              }}
              onPress={onPressOk}
            />
          </View>
        </View>
      </DialogContent>
    </Dialog>
  );
};
