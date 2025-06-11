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
  source?: any | null;
}

export const ImageViewerEditProfile = (props: Props) => {
  const {show, onClose, onTouchOutside, source} = props;
  return (
    <Dialog
      visible={show}
      coverScreen={true}
      overlayBackgroundColor={'black'}
      overlayOpacity={1}
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
            height: screenHeight * 0.85,
            width: screenWidth * 0.93,
            justifyContent: 'center',
            alignItems: 'center',
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
          <View style={{height: '80%', width: '100%',justifyContent:'center'}}>
            <Image
              source={{
                uri: source,
              }}
              style={{
                height: screenHeight * 0.45,
                width: screenWidth * 0.93,
                // borderRadius: screenWidth/2,
              }}
              resizeMode="contain"
            />
          </View>
        </View>
      </DialogContent>
    </Dialog>
  );
};
