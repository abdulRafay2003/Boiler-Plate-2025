import {View, Text, Image, Dimensions, TouchableOpacity} from 'react-native';
import React from 'react';
import theme from '@/assets/stylesheet/theme';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {useSelector} from 'react-redux';
import { RootState } from '@/redux/store';
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
}

export const ThankYouPopup = (props: Props) => {
  const userDatails = useSelector((state: RootState) => state?.user?.userDetail);
  const {image, show, onClose, goToHome, thankyouText, onTouchOutside} = props;
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
            height: screenHeight * 0.5,
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
          <View
            style={{
              marginVertical: 20,
              paddingHorizontal: 20,
              height: '70%',
              // borderWidth: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '90%',
              }}>
              <Image
                source={require('@/assets/images/icons/enquiry_success.png')}
                style={{height: 100, width: 100, marginBottom: 30}}
              />
              {/* <Text
          allowFontScaling={false}

                style={{
                  fontSize: 30,
                  fontFamily: FONT_FAMILY?.IBMPlexBold,
                  color: theme?.logoColor,
                }}>
                Thank You!
              </Text> */}
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 18,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.textGrey,
                  textAlign: 'center',
                }}>
                {thankyouText}
                {/* Thank you for contacting us. You message has been sent to relevant department */}
              </Text>
            </View>
            {goToHome != null && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={
                  goToHome
                  //   () => {
                  //   props.navigation.reset({
                  //     index: 0,
                  //     routes: [{name: 'Dashboard'}],
                  //   });
                  // }
                }>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    color: theme?.logoColor,
                    textDecorationLine: 'underline',
                  }}>
                  {userDatails?.role == 'guest'
                    ? 'Go to Home Screen'
                    : 'Go to Dashboard'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </DialogContent>
    </Dialog>
  );
};
