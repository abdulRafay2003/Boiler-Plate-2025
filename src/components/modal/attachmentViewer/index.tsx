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

export const AttachmentViewerPopup = (props: Props) => {
  const {show, onClose, onTouchOutside, attachData, renderAttach} = props;

  const [planIndex, setPlanIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(1);

  const handleScroll = event => {
    const {contentOffset} = event.nativeEvent;
    const itemWidth = screenWidth * 0.77; // Adjust this based on your item width
    const activeItemIndex = Math.floor(contentOffset.x / itemWidth);

    setPlanIndex(activeItemIndex);
    if (activeItemIndex < 0) {
      setActiveIndex(1);
    } else {
      setActiveIndex(activeItemIndex + 1);
    }
  };
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
        {/* <TouchableOpacity
          activeOpacity={0.9}
          style={{
            height: screenHeight,
            width: screenWidth,
            position: 'absolute',
            top: screenHeight * -0.35,
          }}
          onPress={onTouchOutside}></TouchableOpacity> */}
        <View
          style={{
            height: 550,
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
              marginTop: 5,
              marginRight: 5,
              borderRadius: 50,
              alignSelf: 'flex-end',
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
              width: screenWidth * 0.9,
              marginTop: 20,
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
                height: screenHeight * 0.6,
              }}
              contentContainerStyle={{
                paddingBottom: 50,
                alignItems: 'flex-start',
              }}
              data={attachData}
              showsVerticalScrollIndicator={false}
              renderItem={renderAttach}
              nestedScrollEnabled={true}
              onScroll={handleScroll}
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
                      height: screenHeight * 0.5,
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 16,
                        fontFamily: FONT_FAMILY?.IBMPlexMedium,
                        color: theme?.textGrey,
                      }}>
                      No attachments updates at the moment.
                    </Text>
                  </View>
                );
              }}
            />
            {/* {attachData?.length > 0 && (
              <View style={{alignItems: 'center'}}>
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
            )} */}
          </View>
        </View>
      </DialogContent>
    </Dialog>
  );
};
