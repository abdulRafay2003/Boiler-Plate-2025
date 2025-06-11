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
  alertText?: any | null;
 
}

export const DateChangePopup = (props: Props) => {
  const {show, alertText} = props;
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
        
        <View
          style={{
            height: screenHeight * 0.09,
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
              <Text
          allowFontScaling={false}
                style={{
                  fontSize: 18,
                  fontFamily: FONT_FAMILY?.IBMPlexRegular,
                  color: theme?.black,
                  textAlign: 'center',
                }}>
                {alertText}
              </Text>
            </View>
          </View>
        </View>
      </DialogContent>
    </Dialog>
  );
};
