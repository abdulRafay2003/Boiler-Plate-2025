import React from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useSelector} from 'react-redux';

interface Props {
  // btnContainer?: any | null;

  bgStyles?: any | null;
  internalViewStyles?: any | null;
  backArrowStyles?: any | null;
  backArrowViewStyles?: any | null;
  notificationViewStyles?: any | null;
  notificationIconStyles?: any | null;
  heading?: any | null;
  headingViewStyles?: any | null;
  headingStyles?: any | null;
  onBackArrowPress?: any | null;
  backgroundImageUrl?: any | null;
  backgroundImageStyles?: any | null;
  onNotificationPress?: any | null;
  notificationIcon?: any | null;
}

export const Headers = (props: Props) => {
  const {
    bgStyles,
    internalViewStyles,
    backArrowStyles,
    backArrowViewStyles,
    notificationIconStyles,
    notificationViewStyles,
    heading,
    headingViewStyles,
    headingStyles,
    onBackArrowPress,
    backgroundImageUrl,
    backgroundImageStyles,
    onNotificationPress,
    notificationIcon,
  } = props;
  const count = useSelector(state => state?.user?.notificationCount);

  return (
    <ImageBackground
      source={backgroundImageUrl}
      style={bgStyles}
      imageStyle={backgroundImageStyles}
      resizeMode="cover">
      <View style={internalViewStyles}>
        <View style={headingViewStyles}>
          {backArrowViewStyles && (
            <TouchableOpacity
              style={backArrowViewStyles}
              onPress={onBackArrowPress}>
              <Image
                source={require('@/assets/images/icons/arrow.png')}
                style={backArrowStyles}
              />
            </TouchableOpacity>
          )}
          {heading && (
            <Text allowFontScaling={false} style={headingStyles}>
              {heading.toUpperCase()}
            </Text>
          )}
        </View>
        {notificationIcon && (
          <TouchableOpacity
            style={notificationViewStyles}
            onPress={onNotificationPress}>
            <Image
              source={
                count > 0
                  ? require('@/assets/images/icons/notification.png')
                  : require('@/assets/images/icons/notification_white_fill.png')
              }
              style={notificationIconStyles}
            />
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
};
