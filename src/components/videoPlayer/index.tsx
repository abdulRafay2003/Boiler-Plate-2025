import {View, Text, Image, Dimensions, TouchableOpacity} from 'react-native';
import React from 'react';
import theme from '@/assets/stylesheets/theme';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-player';
// import {LANG_AR} from '@/constants/globalConst';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
interface Props {
  video?: any | null;
  show?: any | null;
  onClose?: any | null;
}

export const Videoplay = (props: Props) => {
  const {video, show, onClose} = props;
  console?.log('videovideovideovideovideo', video);
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
      dialogStyle={{backgroundColor: theme?.transparentWhite}}
      backdropTransitionOutTiming={0}
      style={{justifyContent: 'flex-start'}}>
      <DialogContent>
        <View
          style={{
            height: screenHeight,
            width: screenWidth * 0.93,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              height: 20,
              width: 20,
              backgroundColor: theme?.white,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              zIndex: 1,
              borderRadius: 50,
              top: 40,
              left: screenWidth * 0.85,
            }}
            onPress={onClose}>
            <Image
              source={require('@/assets/images/icons/close.png')}
              resizeMode={'cover'}
              style={{
                height: 10,
                width: 10,
                tintColor: theme.brightRed,
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              // backgroundColor: 'red',
              height: screenHeight,
              width: screenWidth,
            }}>
            <VideoPlayer
              video={{
                uri: video?.[0]?.orignal,
              }}
              videoWidth={screenWidth}
              videoHeight={screenHeight}
              thumbnail={{uri: 'https://i.picsum.photos/id/866/1600/900.jpg'}}
              resizeMode={'contain'}
            />
          </View>
        </View>
      </DialogContent>
    </Dialog>
  );
};
