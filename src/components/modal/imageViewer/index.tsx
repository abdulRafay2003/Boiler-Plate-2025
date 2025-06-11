import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import theme from '@/assets/stylesheet/theme';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import {FONT_FAMILY} from '@/constants/fontFamily';
import {ImageProgress} from '@/components/ImageProgress';
import ImageViewer from 'react-native-image-zoom-viewer';
// import {LANG_AR} from '@/constants/globalConst';
let screenWidth = Math.round(Dimensions.get('window').width);
let screenHeight = Math.round(Dimensions.get('window').height);
interface Props {
  show?: any | null;
  onClose?: any | null;
  onTouchOutside?: any | null;
  source?: any | null;
  featuredText?: any | null;
  showMore?: any | null;
  onPressShowMore?: any | null;
  onSwipeDown?: any | null;
}

export const ImageViewerPopup = (props: Props) => {
  const {
    show,
    onClose,
    onTouchOutside,
    source,
    featuredText,
    showMore,
    onPressShowMore,
    onSwipeDown,
  } = props;
  var lines = featuredText?.split(/\r\n|\r|\n/).length;
  console?.log('image', source);
  const images = [
    {
      // Simplest usage.
      url: source,

      // width: number
      // height: number
      // Optional, if you know the image size, you can set the optimization performance

      // You can pass props to <Image />.
      props: {
        // headers: ...
      },
    },
  ];
  return (
    <>
      {show && (
        <View
          style={{
            height: screenHeight,
            width: screenWidth * 0.93,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: theme?.blackOpacity,
            alignSelf: 'center',
            borderRadius: 20,
            position: 'absolute',
            marginTop: Platform.OS == 'ios' ? 0 : 40,
          }}>
          <ImageViewer
            imageUrls={images}
            style={{height: screenHeight, width: screenWidth}}
            enableImageZoom={true}
            enableSwipeDown={true}
            renderHeader={() => {
              return (
                <TouchableOpacity
                  style={{
                    height: 30,
                    width: 30,
                    backgroundColor: theme?.logoColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    // zIndex: 1000,
                    borderRadius: 50,
                    top: Platform.OS == 'ios' ? 40 : 20,
                    right: 10,
                    zIndex: 1,
                  }}
                  onPress={onClose}
                  activeOpacity={1}>
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
              );
            }}
            onSwipeDown={onSwipeDown}
            renderIndicator={() => {
              return <></>;
            }}
            loadingRender={() => {
              return (
                <ActivityIndicator size={'small'} color={theme?.logoColor} />
              );
            }}
          />
          <View
            style={{
              backgroundColor: theme?.blackOpacity,
              width: screenWidth,
              paddingHorizontal: 10,
              position: 'absolute',
              // bottom: 200,
              zIndex: 1,
              top: screenHeight * 0.75,
            }}>
            {featuredText.length > 50 ? (
              showMore == true ? (
                <TouchableOpacity activeOpacity={1} onPress={onPressShowMore}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 18,
                      color: theme?.white,
                      fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    }}>
                    {featuredText}{' '}
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 18,
                        color: theme?.logoColor,
                        fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                        // textAlign: 'right',
                        // bottom: 19,
                      }}>
                      Show less
                    </Text>
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity activeOpacity={1} onPress={onPressShowMore}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 18,
                      color: theme?.white,
                      fontFamily: FONT_FAMILY?.IBMPlexMedium,
                    }}>
                    {`${featuredText.slice(0, 50)}... `}{' '}
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 18,
                        color: theme?.logoColor,
                        fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                        // textAlign: 'right',
                        // bottom: 19,
                      }}>
                      Show more
                    </Text>
                  </Text>
                </TouchableOpacity>
              )
            ) : (
              <>
                {lines > 3 ? (
                  showMore == true ? (
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={onPressShowMore}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 18,
                          color: theme?.white,
                          fontFamily: FONT_FAMILY?.IBMPlexMedium,
                        }}>
                        {featuredText}{' '}
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: 18,
                            color: theme?.logoColor,
                            fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                          }}>
                          Show less
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={onPressShowMore}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 14,
                          color: theme?.white,
                          fontFamily: FONT_FAMILY?.IBMPlexRegular,
                        }}>
                        {`${featuredText.slice(0, 100)}... `}{' '}
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: 18,
                            color: theme?.logoColor,
                            fontFamily: FONT_FAMILY?.IBMPlexSemiBold,
                          }}>
                          Show more
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  )
                ) : (
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: theme?.white,
                      fontSize: 14,
                      fontFamily: FONT_FAMILY?.IBMPlexRegular,
                    }}>
                    {featuredText}
                  </Text>
                )}
              </>
            )}
          </View>
        </View>
      )}
    </>
    //   </DialogContent>
    // </Dialog>
  );
};
