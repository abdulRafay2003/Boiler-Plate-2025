import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import theme from '@/assets/stylesheet/theme';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {SubmitButton} from '@/components/buttons/submitButton';
import {ScrollView} from 'react-native-gesture-handler';

let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
interface Props {
  show?: any | null;
  onClose?: any | null;
  onTouchOutside?: any | null;
  attachData?: any | null;
  renderAttach?: any | null;
}

export const ReciptListingPopup = (props: Props) => {
  const {show, onClose, attachData, renderAttach} = props;
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
            height: 400,
            width: screenWidth * 0.93,
            alignItems: 'center',
            backgroundColor: theme?.white,
            alignSelf: 'center',
            borderRadius: 20,
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              height: 30,
              width: 30,
              backgroundColor: theme?.darkGrey,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 5,
              marginTop: 5,
              borderRadius: 50,
              alignSelf: 'flex-end',
            }}
            onPress={onClose}>
            <Image
              source={require('@/assets/images/icons/white_cross.png')}
              resizeMode={'contain'}
              style={{
                height: 13,
                width: 13,
                tintColor: theme.white,
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              width: screenWidth * 0.9,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {attachData?.length > 0 && (
              <View style={{alignSelf: 'center'}}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 15,
                    color: theme?.logoColor,
                    fontFamily: FONT_FAMILY?.IBMPlexMedium,
                  }}>
                  {'Total Count'} :{' '}
                  {attachData?.length < 9
                    ? `0${attachData?.length}`
                    : attachData?.length}
                </Text>
              </View>
            )}
          </View>

          <View style={{width: screenWidth * 0.9}}>
            <FlatList
              bounces={false}
              style={{
                marginTop: 10,
                height: 300,
              }}
              contentContainerStyle={{
                paddingBottom: 50,
                alignItems: 'flex-start',
              }}
              data={attachData}
              showsVerticalScrollIndicator={false}
              renderItem={renderAttach}
              nestedScrollEnabled={true}
              scrollEventThrottle={200}
              snapToInterval={screenWidth * 0.87}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      alignItems: 'center',
                      marginTop: 20,
                      justifyContent: 'center',
                      width: screenWidth,
                      alignSelf: 'center',
                      height: 300,
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 16,
                        fontFamily: FONT_FAMILY?.IBMPlexMedium,
                        color: theme?.textGrey,
                      }}>
                      No reciept at the moment.
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </DialogContent>
    </Dialog>
  );
};
