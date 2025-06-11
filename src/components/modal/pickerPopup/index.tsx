import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import theme from '@/assets/stylesheet/theme';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import {FONT_FAMILY} from '@/constants/fontFamily';
// import {LANG_AR} from '@/constants/globalConst';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
interface Props {
  show?: any | null;
  onClose?: any | null;
  onTouchOutside?: any | null;
  clickPhoto?: any | null;
  clickDoc?: any | null;
}

export const PickerPopup = (props: Props) => {
  const {show, onClose, onTouchOutside, clickPhoto, clickDoc} = props;
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
            height: screenHeight * 0.26,
            width: screenWidth * 0.93,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: theme?.transparentWhite,
            borderRadius: 10,
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={clickPhoto}
            activeOpacity={0.9}
            style={{
              width: screenWidth * 0.9,
              height: 50,
              backgroundColor: theme?.white,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={require('@/assets/images/icons/picture.png')}
                resizeMode={'cover'}
                style={{
                  height: 20,
                  width: 20,
                  tintColor: theme.logoColor,
                }}
              />
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  fontSize: 17,
                  color: theme?.black,
                  left: 15,
                }}>
                Gallery
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={clickDoc}
            activeOpacity={0.9}
            style={{
              width: screenWidth * 0.9,
              height: 50,
              backgroundColor: theme?.white,
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
              borderTopWidth: StyleSheet?.hairlineWidth,
              borderTopColor: theme?.logoColor,
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={require('@/assets/images/icons/camera.png')}
                resizeMode={'cover'}
                style={{
                  height: 20,
                  width: 20,
                  tintColor: theme?.logoColor,
                }}
              />
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  fontSize: 17,
                  left: 15,
                  color: theme?.black,
                }}>
                Camera
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              width: screenWidth * 0.9,
              height: 50,
              backgroundColor: theme?.logoColor,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              marginTop: 15,
            }}
            onPress={onClose}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                fontSize: 17,
                color: theme?.white,
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </DialogContent>
    </Dialog>
  );
};
