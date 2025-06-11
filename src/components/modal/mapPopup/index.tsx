import {View, Text, Image, Dimensions, TouchableOpacity} from 'react-native';
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
  onPressAppleMap?: any | null;
  onPressGoogleMap?: any | null;
  onTouchOutside?: any | null;
}

export const MapPopup = (props: Props) => {
  const {show, onClose, onPressAppleMap, onPressGoogleMap, onTouchOutside} =
    props;
  //   console?.log('image', image);
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
      //   onRequestClose={onTouchOutside}
      //   onTouchOutside={onTouchOutside}
      //   onDismiss={onTouchOutside}
      // style={{justifyContent: 'center',alignItems:'center',alignContent:'center'}}
    >
      <DialogContent>
        <TouchableOpacity
          style={{
            height: screenHeight,
            width: screenWidth,
            position:'absolute',
            top:screenHeight*-0.35
            
          }}
          activeOpacity={1}
          onPress={onTouchOutside}>
         
        </TouchableOpacity>
        <View
            style={{
              height: screenHeight * 0.2,
              width: screenWidth * 0.93,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme?.white,
              alignSelf: 'center',
              borderRadius: 20,
            }}>
            <View
              style={{
                marginVertical: 20,
                paddingHorizontal: 20,
                //   height: '70%',
                // borderWidth: 1,
                justifyContent: 'space-around',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%',
              }}>
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                activeOpacity={1}
                onPress={onPressAppleMap}>
                <Image
                  source={require('@/assets/images/icons/appleMapIcon.png')}
                  resizeMode={'cover'}
                  style={{
                    height: 50,
                    width: 50,
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    marginTop: 10,
                  }}>
                  Apple Maps
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                activeOpacity={1}
                onPress={onPressGoogleMap}>
                <Image
                  source={require('@/assets/images/icons/googleMapIcon.png')}
                  resizeMode={'cover'}
                  style={{
                    height: 50,
                    width: 50,
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    marginTop: 10,
                  }}>
                  Google Maps
                </Text>
              </TouchableOpacity>
            </View>
          </View>
      </DialogContent>
    </Dialog>
  );
};
