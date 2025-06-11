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
  confirmationText?: any | null;
  onTouchOutside?: any | null;
  paymentAmount?: any | null;
  onPressProceed?: any | null;
}

export const PaymenntPopup = (props: Props) => {
  const {
    show,
    onClose,
    confirmationText,
    paymentAmount,
    onTouchOutside,
    onPressProceed,
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
      // style={{justifyContent: 'center',alignItems:'center',alignContent:'center'}}
    >
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
            height: 230,
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
              height: '70%',
              // borderWidth: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
            <View
              style={{
                justifyContent: 'space-around',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                paddingVertical: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 18,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.black,
                    textAlign: 'center',
                  }}>
                  Total Amount
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 18,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    color: theme?.black,
                    textAlign: 'center',
                  }}>
                  {paymentAmount}
                </Text>
              </View>

              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 18,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.black,
                  textAlign: 'left',
                }}>
                {confirmationText}
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
                height: 48,
                width: '90%',
                backgroundColor: theme?.logoColor,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              btnText="Proceed To Pay"
              btnTextStyle={{
                color: theme?.white,
                fontSize: 14,
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
              }}
              onPress={onPressProceed}
            />
          </View>
        </View>
      </DialogContent>
    </Dialog>
  );
};
